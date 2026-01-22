import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function addGroupingColumn() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        console.log("🛠️ Adding 'grouping_id' to v2.exercises...");
        await client.query(`ALTER TABLE v2.exercises ADD COLUMN IF NOT EXISTS grouping_id TEXT`);
        
        console.log("✅ Column added.");

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

addGroupingColumn();
