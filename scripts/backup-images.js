const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const root = path.join(__dirname, '..');
const sourcePath = path.join(root, 'backups', 'latest_backup.json');

if (!fs.existsSync(sourcePath)) {
  console.error('Missing backups/latest_backup.json. Run npm run backup:db first.');
  process.exit(1);
}

const backup = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const tables = backup.tables || {};

function rows(table) {
  return Array.isArray(tables[table]) ? tables[table] : [];
}

const records = [];

for (const row of rows('portfolio_images')) {
  if (row.src) {
    records.push({
      table: 'portfolio_images',
      id: row.id || '',
      category: row.category_name || '',
      title: row.title || '',
      url: row.src,
    });
  }
}

for (const row of rows('main_images')) {
  if (row.src) {
    records.push({
      table: 'main_images',
      id: row.id || '',
      category: 'main',
      title: row.title || '',
      url: row.src,
    });
  }
}

for (const row of rows('art_gallery')) {
  if (row.image) {
    records.push({
      table: 'art_gallery',
      id: row.id || '',
      category: row.category || '',
      title: row.title || '',
      url: row.image,
    });
  }
}

function csvCell(value) {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function safeSegment(value) {
  return String(value || 'uncategorized')
    .trim()
    .replace(/[^\w.-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'uncategorized';
}

function fileNameFromUrl(url, id) {
  let pathname = '';
  try {
    pathname = new URL(url).pathname;
  } catch {
    pathname = url;
  }
  const base = path.basename(pathname).split('?')[0] || 'image';
  const clean = base.replace(/[^\w.-]+/g, '_');
  return `${safeSegment(id)}__${clean}`;
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(root, 'backups');
const imagesDir = path.join(backupDir, 'images');
fs.mkdirSync(imagesDir, { recursive: true });

const manifest = records.map((record) => {
  const folder = path.join(imagesDir, record.table, safeSegment(record.category));
  const filename = fileNameFromUrl(record.url, record.id);
  return {
    ...record,
    file: path.relative(root, path.join(folder, filename)),
  };
});

const csvHeader = 'table,id,category,title,url,file';
const csvBody = manifest
  .map((row) => [row.table, row.id, row.category, row.title, row.url, row.file].map(csvCell).join(','))
  .join('\n');
const csv = `${csvHeader}\n${csvBody}\n`;
const urlList = `${manifest.map((row) => row.url).join('\n')}\n`;

const csvPath = path.join(backupDir, `image_urls_${timestamp}.csv`);
const txtPath = path.join(backupDir, `image_urls_${timestamp}.txt`);
fs.writeFileSync(csvPath, csv, 'utf8');
fs.writeFileSync(txtPath, urlList, 'utf8');
fs.writeFileSync(path.join(backupDir, 'latest_image_urls.csv'), csv, 'utf8');
fs.writeFileSync(path.join(backupDir, 'latest_image_urls.txt'), urlList, 'utf8');

function download(url, dest, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('http:') ? http : https;
    const req = lib.get(url, { headers: { 'User-Agent': 'gvenketram-image-backup' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        if (redirectsLeft <= 0) {
          reject(new Error('Too many redirects'));
          return;
        }
        const next = new URL(res.headers.location, url).href;
        resolve(download(next, dest, redirectsLeft - 1));
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const tmp = `${dest}.part`;
      const file = fs.createWriteStream(tmp);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          fs.renameSync(tmp, dest);
          resolve();
        });
      });
      file.on('error', (err) => {
        fs.unlink(tmp, () => reject(err));
      });
    });
    req.on('error', reject);
    req.setTimeout(60000, () => req.destroy(new Error('Timeout')));
  });
}

async function pool(items, limit, worker) {
  let index = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index;
      index += 1;
      await worker(items[current], current);
    }
  });
  await Promise.all(runners);
}

async function run() {
  console.log(`URL records: ${manifest.length}`);
  console.log(`URL list: ${txtPath}`);
  console.log(`URL csv:  ${csvPath}`);
  console.log(`Downloading into ${imagesDir}`);

  let done = 0;
  let skipped = 0;
  const failures = [];

  await pool(manifest, 8, async (row) => {
    const dest = path.join(root, row.file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      skipped += 1;
      done += 1;
      return;
    }
    try {
      await download(row.url, dest);
    } catch (err) {
      failures.push({ url: row.url, file: row.file, error: err.message });
    }
    done += 1;
    if (done % 25 === 0 || done === manifest.length) {
      console.log(`  ${done}/${manifest.length} processed`);
    }
  });

  const failPath = path.join(backupDir, `image_download_failures_${timestamp}.json`);
  if (failures.length) {
    fs.writeFileSync(failPath, JSON.stringify(failures, null, 2), 'utf8');
  }

  console.log('\nImage backup finished');
  console.log(`  saved: ${manifest.length - failures.length - skipped}`);
  console.log(`  already present: ${skipped}`);
  console.log(`  failed: ${failures.length}`);
  if (failures.length) console.log(`  failure log: ${failPath}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
