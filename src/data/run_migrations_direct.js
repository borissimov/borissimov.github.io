import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
    const client = new Client({
        user: 'postgres.vhqgufwgzspwmztpswdn',
        host: 'aws-1-eu-west-1.pooler.supabase.com',
        database: 'postgres',
        password: 'e5SBezOZnXwoH5oL',
        port: 5432,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("🔌 Connecting to database...");
        await client.connect();
        console.log("✅ Connected.");

        console.log("🧹 Running cleanup...");
        const cleanupSql = fs.readFileSync(path.join(__dirname, 'cleanup_obsolete.sql'), 'utf8');
        await client.query(cleanupSql);
        console.log("✅ Cleanup complete.");

        console.log("🏗️  Running setup...");
        const setupSql = fs.readFileSync(path.join(__dirname, 'create_routine_system.sql'), 'utf8');
        await client.query(setupSql);
        console.log("✅ Setup complete.");

        console.log("🎉 All migrations finished successfully!");
    } catch (err) {
        console.error("❌ Migration Failed:", err.message);
    } finally {
        await client.end();
    }
}

runMigrations();
