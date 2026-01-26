import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../../');
const BACKUP_DIR = path.join(ROOT_DIR, '_project-system/archives/db-backups');

// 1. Manual .env parser (avoiding extra dependencies)
function loadEnv() {
    const envPath = path.resolve(ROOT_DIR, '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = (match[2] || '').trim();
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
                process.env[key] = value;
            }
        });
    }
}

loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
}

const SCHEMAS = ['v3', 'v3_dev'];
const TABLES = [
    'programs',
    'program_days',
    'sessions',
    'blocks',
    'block_items',
    'completed_sessions',
    'performance_logs',
    'health_metrics',
    'exercise_library'
];

async function backupSchema(schema) {
    console.log(`\n📦 Backing up schema: ${schema}...`);
    const client = createClient(SUPABASE_URL, SERVICE_KEY, {
        db: { schema }
    });

    const backupData = {
        schema,
        timestamp: new Date().toISOString(),
        tables: {}
    };

    for (const table of TABLES) {
        process.stdout.write(`   📄 Fetching ${table}... `);
        const { data, error } = await client.from(table).select('*');
        
        if (error) {
            console.log(`❌ ERROR: ${error.message}`);
            backupData.tables[table] = { error: error.message };
        } else {
            console.log(`✅ (${data.length} records)`);
            backupData.tables[table] = data;
        }
    }

    return backupData;
}

async function runBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-') ;
    const fullBackup = {
        version: "1.6.0",
        timestamp,
        data: {}
    };

    try {
        for (const schema of SCHEMAS) {
            fullBackup.data[schema] = await backupSchema(schema);
        }

        const fileName = `mp_backup_${timestamp}.json`;
        const filePath = path.join(BACKUP_DIR, fileName);

        fs.writeFileSync(filePath, JSON.stringify(fullBackup, null, 2));
        
        console.log(`\n✨ Backup Complete!`);
        console.log(`📂 Saved to: _project-system/archives/db-backups/${fileName}`);

        // Maintain a "latest" symlink or copy for easy reference
        const latestPath = path.join(BACKUP_DIR, 'latest_backup.json');
        fs.writeFileSync(latestPath, JSON.stringify(fullBackup, null, 2));

    } catch (err) {
        console.error(`\n💥 FATAL ERROR during backup:`, err);
    }
}

runBackup();
