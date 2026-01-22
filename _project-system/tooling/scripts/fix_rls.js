import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function fixPermissions() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        console.log("🔓 Granting Usage on Schema v2...");
        await client.query('GRANT USAGE ON SCHEMA v2 TO anon, authenticated');
        await client.query('GRANT ALL ON ALL TABLES IN SCHEMA v2 TO anon, authenticated');
        await client.query('GRANT ALL ON ALL SEQUENCES IN SCHEMA v2 TO anon, authenticated');

        console.log("🔓 Disabling RLS on critical tables...");
        await client.query('ALTER TABLE v2.routine_days DISABLE ROW LEVEL SECURITY');
        await client.query('ALTER TABLE v2.workouts DISABLE ROW LEVEL SECURITY');
        await client.query('ALTER TABLE v2.workout_blocks DISABLE ROW LEVEL SECURITY');
        await client.query('ALTER TABLE v2.exercises DISABLE ROW LEVEL SECURITY');
        await client.query('ALTER TABLE v2.block_exercises DISABLE ROW LEVEL SECURITY');
        await client.query('ALTER TABLE v2.session_logs DISABLE ROW LEVEL SECURITY');
        await client.query('ALTER TABLE v2.set_logs DISABLE ROW LEVEL SECURITY');

        console.log("✅ PERMISSIONS FIXED. Data should now be visible to the app.");

    } catch (err) {
        console.error("Error fixing permissions:", err.message);
    } finally {
        await client.end();
    }
}

fixPermissions();
