import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function fixPermissions() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        // 1. Enable RLS and add PERMISSIVE INSERT policy for session_logs
        await client.query(`
            ALTER TABLE v2.session_logs ENABLE ROW LEVEL SECURITY;
            
            -- Allow any authenticated user to insert logs
            -- (In a multi-user app we'd restrict by user_id, but for now we need it functional)
            DROP POLICY IF EXISTS "Allow session inserts" ON v2.session_logs;
            CREATE POLICY "Allow session inserts" ON v2.session_logs FOR INSERT WITH CHECK (true);
            
            -- Allow viewing logs
            DROP POLICY IF EXISTS "Allow session select" ON v2.session_logs;
            CREATE POLICY "Allow session select" ON v2.session_logs FOR SELECT USING (true);

            -- Same for health_metrics
            DROP POLICY IF EXISTS "Allow health inserts" ON v2.health_metrics;
            CREATE POLICY "Allow health inserts" ON v2.health_metrics FOR INSERT WITH CHECK (true);
            DROP POLICY IF EXISTS "Allow health select" ON v2.health_metrics;
            CREATE POLICY "Allow health select" ON v2.health_metrics FOR SELECT USING (true);
        `);
        console.log("✅ RLS Policies deployed successfully.");

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

fixPermissions();
