import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function nuclearWipe() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        console.log("🧨 Performing NUCLEAR WIPE of v2 schema...");
        
        // Truncate all tables and reset identity sequences
        await client.query(`
            TRUNCATE 
                v2.set_logs, 
                v2.session_logs, 
                v2.block_exercises, 
                v2.exercises, 
                v2.workout_blocks, 
                v2.workouts, 
                v2.routine_days,
                v2.health_metrics
            RESTART IDENTITY CASCADE
        `);

        console.log("✅ DATABASE WIPED. All routines and history are gone.");

    } catch (err) {
        console.error("Wipe Error:", err.message);
    } finally {
        await client.end();
    }
}

nuclearWipe();
