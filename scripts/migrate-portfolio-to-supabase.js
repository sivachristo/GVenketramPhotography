const { createClient } = require('@supabase/supabase-js');
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
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-supabase-project')) {
  console.error('Error: Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.webp': return 'image/webp';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.gif': return 'image/gif';
    case '.avif': return 'image/avif';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

async function runMigration() {
  console.log('====================================================');
  console.log(' STARTING PORTFOLIO IMAGES MIGRATION TO SUPABASE   ');
  console.log('====================================================\n');

  // Fetch all portfolio image records from Supabase PostgreSQL
  const { data: dbRecords, error: fetchErr } = await supabase
    .from('portfolio_images')
    .select('*')
    .order('display_order', { ascending: true });

  if (fetchErr) {
    console.error('Failed to fetch portfolio_images from Supabase:', fetchErr.message);
    process.exit(1);
  }

  const totalDbRecords = dbRecords.length;
  console.log(`Found ${totalDbRecords} total records in Supabase portfolio_images table.\n`);

  let localPortfolioCount = 0;
  let uploadedCount = 0;
  let dbUpdatedCount = 0;
  let skippedCount = 0;
  let missingFilesCount = 0;
  let errorCount = 0;
  const missingFilesList = [];

  for (const record of dbRecords) {
    const src = record.src || '';

    // Check if record already uses a full URL (Supabase Storage or external CDN)
    if (src.startsWith('http://') || src.startsWith('https://')) {
      skippedCount++;
      continue;
    }

    // Identify local portfolio records starting with /portfolio/
    if (src.startsWith('/portfolio/')) {
      localPortfolioCount++;

      // Relative path inside public/ (e.g. portfolio/fashion/6.webp)
      const relPath = src.replace(/^\//, '');
      const localFilePath = path.join(__dirname, '..', 'public', relPath);

      // Verify physical file existence
      if (!fs.existsSync(localFilePath)) {
        console.warn(`[MISSING] Local file not found for DB Record ID ${record.id}: ${localFilePath}`);
        missingFilesCount++;
        missingFilesList.push({ id: record.id, src, localFilePath });
        continue;
      }

      // Storage path inside portfolio-images bucket (e.g. fashion/6.webp)
      const storagePath = src.replace(/^\/portfolio\//, '');
      const contentType = getMimeType(localFilePath);

      try {
        const fileBuffer = fs.readFileSync(localFilePath);

        // Upload file directly to portfolio-images bucket
        const { data: uploadResult, error: uploadErr } = await supabase.storage
          .from('portfolio-images')
          .upload(storagePath, fileBuffer, {
            contentType,
            upsert: true
          });

        if (uploadErr) {
          console.error(`[UPLOAD ERROR] ID ${record.id} (${storagePath}):`, uploadErr.message);
          errorCount++;
          continue;
        }

        uploadedCount++;

        // Get public URL from Supabase Storage
        const { data: urlData } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(storagePath);

        const publicUrl = urlData?.publicUrl;

        if (!publicUrl) {
          console.error(`[URL ERROR] Failed to construct public URL for ${storagePath}`);
          errorCount++;
          continue;
        }

        // Update database record src to public Supabase Storage URL
        const { error: updateErr } = await supabase
          .from('portfolio_images')
          .update({ src: publicUrl })
          .eq('id', record.id);

        if (updateErr) {
          console.error(`[DB UPDATE ERROR] Record ID ${record.id}:`, updateErr.message);
          errorCount++;
        } else {
          dbUpdatedCount++;
          console.log(`[SUCCESS] Migrated record ${record.id} (${record.title}): ${publicUrl}`);
        }

      } catch (err) {
        console.error(`[EXCEPTION] Failed processing record ID ${record.id}:`, err.message);
        errorCount++;
      }
    } else {
      skippedCount++;
    }
  }

  // Verify final Database State
  const { data: finalRecords, error: finalFetchErr } = await supabase
    .from('portfolio_images')
    .select('src');

  let remainingLocalRecords = 0;
  let totalStorageUrls = 0;

  if (!finalFetchErr && finalRecords) {
    finalRecords.forEach(r => {
      if (r.src && r.src.startsWith('/portfolio/')) {
        remainingLocalRecords++;
      } else if (r.src && (r.src.startsWith('http://') || r.src.startsWith('https://'))) {
        totalStorageUrls++;
      }
    });
  }

  console.log('\n====================================================');
  console.log('               MIGRATION SUMMARY                    ');
  console.log('====================================================');
  console.log(`Total Database Records Inspected:   ${totalDbRecords}`);
  console.log(`Local Portfolio Records Found:      ${localPortfolioCount}`);
  console.log(`Files Successfully Uploaded:        ${uploadedCount}`);
  console.log(`Database Records Updated:           ${dbUpdatedCount}`);
  console.log(`Records Skipped (Already Storage):  ${skippedCount}`);
  console.log(`Missing Local Files:                ${missingFilesCount}`);
  console.log(`Total Errors Encountered:           ${errorCount}`);
  console.log('----------------------------------------------------');
  console.log(`Final Database State:`);
  console.log(` - Remaining /portfolio/... records: ${remainingLocalRecords}`);
  console.log(` - Total Storage / External URLs:    ${totalStorageUrls}`);
  console.log('====================================================\n');

  if (missingFilesList.length > 0) {
    console.warn('The following records could not be migrated because local files were missing:');
    console.warn(JSON.stringify(missingFilesList, null, 2));
  }
}

runMigration().catch(err => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
