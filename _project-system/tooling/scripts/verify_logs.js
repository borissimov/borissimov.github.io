import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function verifyLogs() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        
        // 1. Latest Session
        const { rows: sessions } = await client.query(`
            SELECT id, start_time, end_time FROM v2.session_logs ORDER BY end_time DESC LIMIT 1
        `);

        if (sessions.length === 0) {
            console.log("No sessions found in DB.");
            return;
        }

        const sid = sessions[0].id;
        console.log(`Checking session ID: ${sid}`);

        // 2. Individual Sets
        const { rows: sets } = await client.query(`
            SELECT e.name, sl.weight, sl.reps, sl.set_number
            FROM v2.set_logs sl
            JOIN v2.block_exercises be ON sl.block_exercise_id = be.id
            JOIN v2.exercises e ON be.exercise_id = e.id
            WHERE sl.session_log_id = $1
            ORDER BY be.sort_order, sl.set_number
        `, [sid]);

        console.log(`Found ${sets.length} sets in this session.`);
        sets.forEach(s => {
            console.log(`[${s.name}] Set ${s.set_number}: ${s.weight}kg x ${s.reps}`);
        });

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

verifyLogs();
