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
      process.env[key] = value.trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase credentials missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TABLES = [
  'categories',
  'portfolio_images',
  'main_images',
  'art_gallery',
  'site_settings',
];

function escapeSqlValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${val.toString().replace(/'/g, "''")}'`;
}

async function fetchAllRows(table) {
  const pageSize = 1000;
  let allRows = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .range(from, from + pageSize - 1);

    if (error) {
      console.warn(`  Warning: Could not fetch from "${table}": ${error.message}`);
      return { rows: [], error: error.message };
    }

    if (data && data.length > 0) {
      allRows = allRows.concat(data);
      from += pageSize;
      if (data.length < pageSize) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }

  return { rows: allRows, error: null };
}

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '..', 'backups');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('==============================================');
  console.log(`Starting Supabase DB Backup [${new Date().toISOString()}]`);
  console.log(`Target Supabase URL: ${supabaseUrl}`);
  console.log('==============================================\n');

  const backupData = {
    metadata: {
      timestamp: new Date().toISOString(),
      supabaseUrl,
      tableCounts: {},
    },
    tables: {},
  };

  let sqlStatements = [];
  sqlStatements.push(`-- ==========================================================`);
  sqlStatements.push(`-- Supabase Database Backup`);
  sqlStatements.push(`-- Timestamp: ${new Date().toISOString()}`);
  sqlStatements.push(`-- URL: ${supabaseUrl}`);
  sqlStatements.push(`-- ==========================================================\n`);
  sqlStatements.push(`BEGIN;\n`);

  for (const table of TABLES) {
    process.stdout.write(`Fetching table "${table}"... `);
    const { rows, error } = await fetchAllRows(table);

    if (error) {
      console.log(`FAILED (${error})`);
      backupData.metadata.tableCounts[table] = 0;
      backupData.tables[table] = [];
      continue;
    }

    backupData.metadata.tableCounts[table] = rows.length;
    backupData.tables[table] = rows;
    console.log(`OK (${rows.length} rows)`);

    if (rows.length > 0) {
      sqlStatements.push(`-- Table: ${table} (${rows.length} rows)`);
      const columns = Object.keys(rows[0]);
      const colList = columns.map(c => `"${c}"`).join(', ');

      for (const row of rows) {
        const valList = columns.map(col => escapeSqlValue(row[col])).join(', ');
        sqlStatements.push(`INSERT INTO public."${table}" (${colList}) VALUES (${valList}) ON CONFLICT DO NOTHING;`);
      }
      sqlStatements.push('');
    }
  }

  sqlStatements.push(`COMMIT;\n`);

  // Write JSON backup
  const jsonPath = path.join(backupDir, `supabase_backup_${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(backupData, null, 2), 'utf8');

  // Write SQL backup
  const sqlPath = path.join(backupDir, `supabase_backup_${timestamp}.sql`);
  fs.writeFileSync(sqlPath, sqlStatements.join('\n'), 'utf8');

  // Update latest copies
  const latestJsonPath = path.join(backupDir, 'latest_backup.json');
  const latestSqlPath = path.join(backupDir, 'latest_backup.sql');
  fs.copyFileSync(jsonPath, latestJsonPath);
  fs.copyFileSync(sqlPath, latestSqlPath);

  const jsonSizeKB = (fs.statSync(jsonPath).size / 1024).toFixed(2);
  const sqlSizeKB = (fs.statSync(sqlPath).size / 1024).toFixed(2);

  console.log('\n==============================================');
  console.log('DB Backup Completed Successfully!');
  console.log('==============================================');
  console.log(`Summary of backed up tables:`);
  for (const [table, count] of Object.entries(backupData.metadata.tableCounts)) {
    console.log(`  - ${table}: ${count} rows`);
  }
  console.log(`\nFiles created:`);
  console.log(`  JSON: ${jsonPath} (${jsonSizeKB} KB)`);
  console.log(`  SQL:  ${sqlPath} (${sqlSizeKB} KB)`);
  console.log(`  Latest copies updated at:`);
  console.log(`    ${latestJsonPath}`);
  console.log(`    ${latestSqlPath}`);
  console.log('==============================================\n');
}

runBackup().catch(err => {
  console.error('\nFatal Backup Error:', err);
  process.exit(1);
});

