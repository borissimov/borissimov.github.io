import pg from 'pg';
const { Client } = pg;
import fs from 'fs';

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function exportLogs() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        console.log("📊 Fetching session data...");
        const { rows: sessions } = await client.query(`
            SELECT 
                sl.id as session_id,
                sl.start_time,
                sl.end_time,
                rd.label as day_label,
                rd.sequence_number
            FROM v2.session_logs sl
            JOIN v2.routine_days rd ON sl.routine_day_id = rd.id
            ORDER BY sl.end_time DESC
        `);

        const exportedData = [];

        for (const session of sessions) {
            console.log(`🔎 Processing session: ${session.day_label} (${session.end_time.toISOString().split('T')[0]})`);
            
            const { rows: sets } = await client.query(`
                SELECT 
                    sl.set_number,
                    sl.weight,
                    sl.reps,
                    sl.rpe,
                    e.name as exercise_name,
                    be.target_weight,
                    be.target_reps,
                    be.target_rpe
                FROM v2.set_logs sl
                JOIN v2.block_exercises be ON sl.block_exercise_id = be.id
                JOIN v2.exercises e ON be.exercise_id = e.id
                WHERE sl.session_log_id = $1
                ORDER BY be.sort_order ASC, sl.set_number ASC
            `, [session.session_id]);

            exportedData.push({
                session_meta: {
                    day: session.day_label,
                    sequence: session.sequence_number,
                    started: session.start_time,
                    finished: session.end_time
                },
                logs: sets
            });
        }

        fs.writeFileSync('January_logs.json', JSON.stringify(exportedData, null, 2));
        console.log(`✅ EXPORT COMPLETE. Created January_logs.json with ${exportedData.length} sessions.`);

    } catch (err) {
        console.error("Export Error:", err.message);
    } finally {
        await client.end();
    }
}

exportLogs();
