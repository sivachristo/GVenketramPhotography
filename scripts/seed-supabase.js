const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if present
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
  console.error('Error: Please update .env.local with your actual NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedSupabase() {
  console.log('Seeding Supabase Database...');

  // Import portfolio data
  const portfolioModule = require(path.join(__dirname, '..', 'src', 'data', 'portfolio.js'));
  const categories = portfolioModule.PORTFOLIO_CATEGORIES || [];
  const portfolioData = portfolioModule.portfolioData || [];

  // 1. Seed Categories
  console.log('Inserting Categories...');
  const categoryRecords = categories.map((name, idx) => ({
    name,
    display_order: idx
  }));

  const { error: catErr } = await supabase
    .from('categories')
    .upsert(categoryRecords, { onConflict: 'name' });

  if (catErr) {
    console.error('Error inserting categories:', catErr.message);
  } else {
    console.log(`Successfully inserted ${categories.length} categories.`);
  }

  // 2. Seed Portfolio Images
  console.log('Inserting Portfolio Images...');
  const flatRows = [];
  let globalOrder = 0;

  portfolioData.forEach(catObj => {
    if (Array.isArray(catObj.images)) {
      catObj.images.forEach(img => {
        flatRows.push({
          category_name: catObj.category,
          src: img.src,
          width: img.width || 1600,
          height: img.height || 1200,
          title: img.title || 'Untitled',
          description: img.description || '',
          display_order: globalOrder++
        });
      });
    }
  });

  // Batch insert in chunks of 50
  const chunkSize = 50;
  for (let i = 0; i < flatRows.length; i += chunkSize) {
    const chunk = flatRows.slice(i, i + chunkSize);
    const { error: imgErr } = await supabase
      .from('portfolio_images')
      .insert(chunk);

    if (imgErr) {
      console.error(`Error inserting batch ${i / chunkSize + 1}:`, imgErr.message);
    } else {
      console.log(`Batch ${i / chunkSize + 1}: Inserted ${chunk.length} images.`);
    }
  }

  console.log('\nSupabase Seeding Completed Successfully!');
}

seedSupabase().catch(err => console.error('Seed script error:', err));
