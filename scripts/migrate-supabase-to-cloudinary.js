const { createClient } = require('@supabase/supabase-js');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

// 1. Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const apiKey = process.env.CLOUDINARY_API_KEY || '';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase credentials missing in .env.local');
  process.exit(1);
}

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Error: Cloudinary credentials missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

const CONCURRENCY = 6; // Process 6 uploads concurrently

async function uploadToCloudinary(imageSource, folder = 'portfolio') {
  let target = imageSource;
  if (target.startsWith('/')) {
    const localPath = path.join(__dirname, '..', 'public', target.replace(/^\//, ''));
    if (fs.existsSync(localPath)) {
      target = localPath;
    } else {
      throw new Error(`Local file not found at ${localPath}`);
    }
  }

  const result = await cloudinary.uploader.upload(target, {
    folder: folder,
    resource_type: 'image',
  });

  return result.secure_url;
}

async function removeSupabaseStorageFile(url) {
  if (!url || !url.includes('supabase.co/storage')) return;

  for (const bucket of ['portfolio-images', 'artworks']) {
    if (url.includes(`/${bucket}/`)) {
      const parts = url.split(`/${bucket}/`);
      if (parts[1]) {
        const filePath = decodeURIComponent(parts[1].split('?')[0]);
        const { error } = await supabase.storage.from(bucket).remove([filePath]);
        if (error) {
          console.warn(`[SUPABASE CLEANUP WARNING] Could not delete ${filePath} from ${bucket}:`, error.message);
        } else {
          console.log(`[SUPABASE CLEANUP] Removed ${filePath} from Supabase bucket ${bucket}`);
        }
        break;
      }
    }
  }
}

async function processInBatches(items, workerFn, batchSize = CONCURRENCY) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);
    const chunkResults = await Promise.all(chunk.map((item, idx) => workerFn(item, i + idx + 1, items.length)));
    results.push(...chunkResults);
  }
  return results;
}

async function runMigration() {
  console.log('====================================================');
  console.log(' STARTING FAST IMAGE MIGRATION: SUPABASE -> CLOUDINARY');
  console.log('====================================================\n');

  let stats = {
    portfolio: { inspected: 0, skipped: 0, uploaded: 0, errors: 0 },
    gallery: { inspected: 0, skipped: 0, uploaded: 0, errors: 0 },
    categories: { inspected: 0, skipped: 0, uploaded: 0, errors: 0 }
  };

  // ----------------------------------------------------
  // 1. Migrate portfolio_images table
  // ----------------------------------------------------
  console.log('--- 1. Migrating `portfolio_images` table ---');
  const { data: portfolioRecords, error: pFetchErr } = await supabase
    .from('portfolio_images')
    .select('*');

  if (pFetchErr) {
    console.error('Failed to fetch portfolio_images from Supabase:', pFetchErr.message);
  } else if (portfolioRecords) {
    console.log(`Found ${portfolioRecords.length} records in portfolio_images.`);

    await processInBatches(portfolioRecords, async (record, index, total) => {
      stats.portfolio.inspected++;
      const src = record.src || '';

      if (src.includes('res.cloudinary.com') || !src) {
        stats.portfolio.skipped++;
        return;
      }

      try {
        console.log(`[${index}/${total}] Uploading Portfolio Record ${record.id} (${record.title || 'Untitled'})...`);
        const cloudinaryUrl = await uploadToCloudinary(src, 'portfolio');

        const { error: updateErr } = await supabase
          .from('portfolio_images')
          .update({ src: cloudinaryUrl })
          .eq('id', record.id);

        if (updateErr) {
          console.error(`[DB ERROR ${record.id}]:`, updateErr.message);
          stats.portfolio.errors++;
        } else {
          console.log(`[SUCCESS ${index}/${total}] ${record.title || record.id} -> Cloudinary`);
          stats.portfolio.uploaded++;
          await removeSupabaseStorageFile(src);
        }
      } catch (err) {
        console.error(`[ERROR ${record.id}]:`, err.message);
        stats.portfolio.errors++;
      }
    });
  }

  // ----------------------------------------------------
  // 2. Migrate art_gallery table
  // ----------------------------------------------------
  console.log('\n--- 2. Migrating `art_gallery` table ---');
  const { data: artRecords, error: aFetchErr } = await supabase
    .from('art_gallery')
    .select('*');

  if (aFetchErr) {
    console.warn('Notice: art_gallery query returned:', aFetchErr.message);
  } else if (artRecords && artRecords.length > 0) {
    console.log(`Found ${artRecords.length} records in art_gallery.`);

    await processInBatches(artRecords, async (record, index, total) => {
      stats.gallery.inspected++;
      const img = record.image || record.src || '';

      if (img.includes('res.cloudinary.com') || !img) {
        stats.gallery.skipped++;
        return;
      }

      try {
        console.log(`[${index}/${total}] Uploading Artwork Record ${record.id} (${record.title || 'Untitled'})...`);
        const cloudinaryUrl = await uploadToCloudinary(img, 'art_gallery');

        const { error: updateErr } = await supabase
          .from('art_gallery')
          .update({ image: cloudinaryUrl })
          .eq('id', record.id);

        if (updateErr) {
          console.error(`[DB ERROR ${record.id}]:`, updateErr.message);
          stats.gallery.errors++;
        } else {
          console.log(`[SUCCESS ${index}/${total}] ${record.title || record.id} -> Cloudinary`);
          stats.gallery.uploaded++;
          await removeSupabaseStorageFile(img);
        }
      } catch (err) {
        console.error(`[ERROR ${record.id}]:`, err.message);
        stats.gallery.errors++;
      }
    });
  }

  // ----------------------------------------------------
  // 3. Migrate categories cover images if any
  // ----------------------------------------------------
  console.log('\n--- 3. Checking `categories` table ---');
  const { data: catRecords } = await supabase.from('categories').select('*');
  if (catRecords && catRecords.length > 0) {
    for (const cat of catRecords) {
      if (cat.cover_image && !cat.cover_image.includes('res.cloudinary.com')) {
        try {
          console.log(`Uploading cover image for category ${cat.name}...`);
          const cloudinaryUrl = await uploadToCloudinary(cat.cover_image, 'portfolio/categories');
          await supabase.from('categories').update({ cover_image: cloudinaryUrl }).eq('id', cat.id);
          stats.categories.uploaded++;
          await removeSupabaseStorageFile(cat.cover_image);
        } catch (err) {
          console.error(`Error migrating category ${cat.name}:`, err.message);
          stats.categories.errors++;
        }
      } else {
        stats.categories.skipped++;
      }
    }
  }

  console.log('\n====================================================');
  console.log('               MIGRATION COMPLETE SUMMARY           ');
  console.log('====================================================');
  console.log(`Portfolio Records Uploaded:   ${stats.portfolio.uploaded} / ${stats.portfolio.inspected} (Skipped ${stats.portfolio.skipped})`);
  console.log(`Art Gallery Records Uploaded: ${stats.gallery.uploaded} / ${stats.gallery.inspected} (Skipped ${stats.gallery.skipped})`);
  console.log(`Category Cover Images Uploaded:${stats.categories.uploaded}`);
  console.log(`Total Errors Encountered:     ${stats.portfolio.errors + stats.gallery.errors + stats.categories.errors}`);
  console.log('====================================================\n');
}

runMigration().catch(err => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
