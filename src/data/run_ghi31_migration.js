import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function applyMigration() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        // Add additive columns
        await client.query(`
            -- Support for granular set targets (Pyramid, Drop sets, etc)
            ALTER TABLE v2.block_exercises 
            ADD COLUMN IF NOT EXISTS set_targets JSONB;

            -- Support for workout-level context (Safety alerts, goal descriptions)
            ALTER TABLE v2.workouts 
            ADD COLUMN IF NOT EXISTS workout_notes TEXT;
        `);
        console.log("✅ Database schema upgraded with set_targets and workout_notes.");

    } catch (err) {
        console.error("Migration Error:", err.message);
    } finally {
        await client.end();
    }
}

applyMigration();
