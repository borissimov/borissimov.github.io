import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function clearLogs() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        console.log("🧹 Clearing session and set logs...");
        
        // Truncate clears everything but keeps the table structure
        // CASCADE ensures dependent set_logs are also cleared
        await client.query('TRUNCATE v2.session_logs RESTART IDENTITY CASCADE');
        
        console.log("🧹 Clearing health metrics...");
        await client.query('TRUNCATE v2.health_metrics RESTART IDENTITY');

        console.log("✅ ALL TEST LOGS CLEARED. Schema is now clean.");

    } catch (err) {
        console.error("Error clearing logs:", err.message);
    } finally {
        await client.end();
    }
}

clearLogs();
