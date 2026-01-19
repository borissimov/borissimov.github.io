import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function runMigration() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("🔌 Connecting to Supabase...");
        await client.connect();
        console.log("✅ Connected.");

        // 1. Run Schema Init
        console.log("🏗️  Initializing v2 Schema...");
        const initSql = fs.readFileSync(path.join(__dirname, 'v2_schema_init.sql'), 'utf8');
        await client.query(initSql);
        console.log("✅ Schema initialized.");

        // 2. Run Seed Data
        console.log("🌱 Seeding real Bulgarian plan data...");
        const seedSql = fs.readFileSync(path.join(__dirname, 'v2_real_plan_seed.sql'), 'utf8');
        await client.query(seedSql);
        console.log("✅ Data seeded.");

        console.log("🎉 Database Migration Successful!");

    } catch (err) {
        console.error("❌ Migration Error:", err.message);
        console.error(err.stack);
    } finally {
        await client.end();
    }
}

runMigration();
