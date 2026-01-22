import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function restoreHistory() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        // 1. Map Routine Day Labels to IDs
        const { rows: days } = await client.query('SELECT id, label FROM v2.routine_days');
        const dayMap = days.reduce((acc, d) => {
            acc[d.label] = d.id;
            return acc;
        }, {});

        // 2. Fetch Legacy Logs
        console.log("🚚 Fetching legacy logs from REGI_daily_logs...");
        const { rows: legacyLogs } = await client.query(`SELECT * FROM public."REGI_daily_logs"`);
        console.log(`Found ${legacyLogs.length} historical sessions.`);

        for (const row of legacyLogs) {
            const dateStr = new Date(row.date).toISOString().split('T')[0];
            const data = row.data;
            if (!data.user_performance || !data.user_performance.training) continue;

            // Map TUE -> Legs (Tue), etc.
            const dayMapLegacy = { 'MON': 'Recovery (Mon)', 'TUE': 'Legs (Tue)', 'WED': 'Push (Wed)', 'THU': 'Pull (Thu)', 'FRI': 'Swim LISS (Fri)', 'SAT': 'Swim HIIT (Sat)', 'SUN': 'Metabolic (Sun)' };
            const v2Label = dayMapLegacy[data.day_info?.day];
            const dayId = dayMap[v2Label];

            if (!dayId) continue;

            // a. Find the workout for this day
            const { rows: workouts } = await client.query('SELECT id FROM v2.workouts WHERE routine_day_id = $1', [dayId]);
            const workoutId = workouts[0].id;

            // b. Create a HISTORICAL block for this date
            const { rows: blockRows } = await client.query(`
                INSERT INTO v2.workout_blocks (workout_id, label, block_type, sort_order)
                VALUES ($1, $2, 'STANDARD', 99) RETURNING id
            `, [workoutId, `HISTORY - ${dateStr}`]);
            const blockId = blockRows[0].id;

            // c. Create the session log
            const { rows: sessionRows } = await client.query(`
                INSERT INTO v2.session_logs (user_id, routine_day_id, start_time, end_time)
                VALUES ($1, $2, $3, $4) RETURNING id
            `, [row.user_id, dayId, `${dateStr}T12:00:00Z`, `${dateStr}T13:00:00Z`]);
            const sessionLogId = sessionRows[0].id;

            const trainingLogs = data.user_performance.training;
            const historyExOrder = data.plan_definitions?.training || [];

            for (const [exIdxStr, setGroup] of Object.entries(trainingLogs)) {
                const exIdx = parseInt(exIdxStr);
                const historicalEx = historyExOrder[exIdx];
                if (!historicalEx) continue;

                // Ensure Exercise exists in global library
                await client.query(`INSERT INTO v2.exercises (name, category) VALUES ($1, 'Historical') ON CONFLICT (name) DO NOTHING`, [historicalEx.name]);
                const { rows: exLib } = await client.query(`SELECT id FROM v2.exercises WHERE name = $1`, [historicalEx.name]);

                // Create block exercise entry
                const { rows: beRows } = await client.query(`
                    INSERT INTO v2.block_exercises (block_id, exercise_id, target_sets, target_reps, target_weight, target_rpe, target_tempo, sort_order)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
                `, [blockId, exLib[0].id, historicalEx.sets || 1, historicalEx.reps || '-', historicalEx.kg || '-', historicalEx.rpe || '-', historicalEx.tempo || '-', exIdx + 1]);
                const blockExId = beRows[0].id;

                // Insert sets
                if (typeof setGroup === 'object' && setGroup.logged && !setGroup[0]) {
                    // Cardio/Flat log
                    await client.query(`INSERT INTO v2.set_logs (session_log_id, block_exercise_id, weight, reps, rpe, set_number) VALUES ($1, $2, $3, $4, $5, $6)`, [sessionLogId, blockExId, '-', 0, null, 1]);
                } else {
                    for (const [setIdxStr, setVal] of Object.entries(setGroup)) {
                        if (typeof setVal !== 'object' || !setVal.logged) continue;
                        await client.query(`INSERT INTO v2.set_logs (session_log_id, block_exercise_id, weight, reps, rpe, set_number) VALUES ($1, $2, $3, $4, $5, $6)`, [sessionLogId, blockExId, String(setVal.weight || '0'), parseInt(setVal.reps) || 0, parseFloat(setVal.rpe) || null, parseInt(setIdxStr) + 1]);
                    }
                }
            }
            console.log(`✅ Restored: ${v2Label} (${dateStr})`);
        }

        console.log("🎉 ALL HISTORY RESTORED.");

    } catch (err) {
        console.error("Restoration Error:", err.message);
    } finally {
        await client.end();
    }
}

restoreHistory();
