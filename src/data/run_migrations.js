import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;

// Helper to get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations(connectionString) {
    if (!connectionString) {
        console.error("❌ Error: No connection string provided.");
        process.exit(1);
    }

    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false } // Required for Supabase
    });

    try {
        console.log("🔌 Connecting to database...");
        await client.connect();
        console.log("✅ Connected.");

        // 1. Read Cleanup Script
        console.log("🧹 Running cleanup...");
        const cleanupSql = fs.readFileSync(path.join(__dirname, 'cleanup_obsolete.sql'), 'utf8');
        await client.query(cleanupSql);
        console.log("✅ Cleanup complete.");

        // 2. Read Setup Script
        console.log("🏗️  Running setup...");
        const setupSql = fs.readFileSync(path.join(__dirname, 'create_routine_system.sql'), 'utf8');
        await client.query(setupSql);
        console.log("✅ Setup complete.");

        console.log("🎉 All migrations finished successfully!");

    } catch (err) {
        console.error("❌ Migration Failed:", err);
    } finally {
        await client.end();
    }
}

// Get the connection string from the command line argument
const connectionString = process.argv[2];
runMigrations(connectionString);
