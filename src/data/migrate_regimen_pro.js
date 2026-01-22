import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

const REGIMEN_PRO_PLAN = {
    0: { focus: "SUN: METABOLIC", type: "CIRCUIT", training: [
        { name: "Goblet Squats", sets: 4, reps: "12", kg: "30", rpe: "8", tempo: "2-0-X-0", technique: "CONTROL breath. Stop if dizzy." },
        { name: "Push-ups", sets: 3, reps: "Failure", kg: "BW", rpe: "10", tempo: "1-0-X-0", technique: "Strict form." },
        { name: "DB Bent-Over Rows", sets: 3, reps: "12-15", kg: "17.5", rpe: "8", tempo: "1-0-1-0", technique: "Squeeze back." },
        { name: "DB Push Press", sets: 3, reps: "10", kg: "15", rpe: "9", tempo: "X-0-X-0", technique: "Use legs. Exhale on push." },
        { name: "DB/KB Swings", sets: 3, reps: "20", kg: "24", rpe: "9", tempo: "X-0-X-0", technique: "Snap hips. Stop if dizzy." }
    ]},
    1: { focus: "MON: ACTIVE RECOVERY", type: "STANDARD", training: [{ name: "Walking (LISS)", target: "30-60m", kg: "-", rpe: "3", tempo: "Natural", technique: "Breathe deeply. minimal stress." }]},
    2: { focus: "TUE: LEGS (VOLUME)", type: "STANDARD", training: [
        { name: "Barbell Hip Thrusts", sets: 4, reps: "10-12", kg: "80-90", rpe: "9", tempo: "2-0-1-3", technique: "Chin tucked. Drive through heels. HARD squeeze at top." },
        { name: "Leg Extensions", sets: 4, reps: "12-15", kg: "45-50", rpe: "9", tempo: "3-0-1-1", technique: "Control the descent. Do not rest at bottom." },
        { name: "Leg Press (Wide Stance)", sets: 5, reps: "10-12", kg: "160-170", rpe: "9", tempo: "3-1-1-0", technique: "Sit for 15s after set! Do not lock knees." },
        { name: "Goblet Squats", sets: 4, reps: "10", kg: "30-35", rpe: "9", tempo: "3-1-1-0", technique: "Deep stretch. Chest up." },
        { name: "Lying Leg Curls", sets: 4, reps: "10-12", kg: "40", rpe: "9", tempo: "4-0-1-0", technique: "Slow eccentric (4s). Protect knees." },
        { name: "Adductor Machine", sets: 3, reps: "12-15", kg: "50-55", rpe: "9.5", tempo: "2-0-1-1", technique: "Squeeze legs together hard." },
        { name: "Calf Raises", sets: 4, reps: "15", kg: "Heavy", rpe: "10", tempo: "2-2-1-1", technique: "Full stretch at bottom. 2s hold." }
    ]},
    3: { focus: "WED: PUSH (TUT)", type: "STANDARD", training: [
        { name: "DB Flat Bench", sets: 4, reps: "8-12", kg: "20", rpe: "9", tempo: "3-1-1-0", technique: "Strict form. 3s negative." },
        { name: "DB Incline Bench", sets: 3, reps: "10-12", kg: "17.5", rpe: "9.5", tempo: "3-1-1-0", technique: "Upper chest focus." },
        { name: "DB Lateral Raise", sets: 3, reps: "12-15", kg: "7.5", rpe: "10", tempo: "2-0-1-1", technique: "Lead with elbows. No momentum." },
        { name: "Cable Rope Pushdown", sets: 3, reps: "10-12", kg: "17.5", rpe: "10", tempo: "3-0-1-1", technique: "Spread the rope at bottom." },
        { name: "Ab Wheel Rollout", sets: 3, reps: "8-12", kg: "BW", rpe: "9", tempo: "4-0-1-0", technique: "Protect lower back. Brace core." }
    ]},
    4: { focus: "THU: PULL (TUT)", type: "STANDARD", training: [
        { name: "Wide Lat Pulldown", sets: 4, reps: "10-12", kg: "50", rpe: "10", tempo: "3-1-1-0", technique: "Pull to chest. Control release." },
        { name: "V-Handle Cable Row", sets: 3, reps: "10-12", kg: "40", rpe: "9.5", tempo: "3-1-1-0", technique: "Full stretch forward." },
        { name: "Face Pulls", sets: 3, reps: "15", kg: "7.5", rpe: "10", tempo: "2-0-1-2", technique: "External rotation focus." },
        { name: "Incline DB Curl", sets: 3, reps: "10-12", kg: "8", rpe: "10", tempo: "3-0-1-0", technique: "Full stretch at bottom." }
    ]},
    5: { focus: "FRI: SWIM (LISS)", type: "STANDARD", training: [{ name: "Moderate Swim", target: "30-45m", kg: "-", rpe: "6", tempo: "Continuous", technique: "Steady state. Focus on breathing." }]},
    6: { focus: "SAT: SWIM (HIIT)", type: "STANDARD", training: [{ name: "Interval Swim", target: "20m", kg: "-", rpe: "9", tempo: "Interval", technique: "1 lap Fast / 2 laps Slow." }]}
};

async function migrateAndSeed() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        await client.query('TRUNCATE v2.routine_days RESTART IDENTITY CASCADE');
        await client.query('TRUNCATE v2.exercises RESTART IDENTITY CASCADE');

        const dayEntries = [
            { seq: 1, label: 'Recovery (Mon)', orig: 1 },
            { seq: 2, label: 'Legs (Tue)', orig: 2 },
            { seq: 3, label: 'Push (Wed)', orig: 3 },
            { seq: 4, label: 'Pull (Thu)', orig: 4 },
            { seq: 5, label: 'Swim LISS (Fri)', orig: 5 },
            { seq: 6, label: 'Swim HIIT (Sat)', orig: 6 },
            { seq: 7, label: 'Metabolic (Sun)', orig: 0 }
        ];

        const activeWorkoutIdMap = {}; // Day Label -> Workout ID

        // 1. SEED ACTIVE PLAN
        for (const d of dayEntries) {
            const { rows: dayRows } = await client.query(`INSERT INTO v2.routine_days (sequence_number, label) VALUES ($1, $2) RETURNING id`, [d.seq, d.label]);
            const dayId = dayRows[0].id;
            const plan = REGIMEN_PRO_PLAN[d.orig];
            const { rows: workRows } = await client.query(`INSERT INTO v2.workouts (routine_day_id, name) VALUES ($1, $2) RETURNING id`, [dayId, plan.focus]);
            activeWorkoutIdMap[d.label] = workRows[0].id;

            const { rows: blockRows } = await client.query(`INSERT INTO v2.workout_blocks (workout_id, label, block_type, sort_order) VALUES ($1, 'MAIN PHASE', $2, 1) RETURNING id`, [workRows[0].id, plan.type]); 
            const blockId = blockRows[0].id;

            for (let i = 0; i < plan.training.length; i++) {
                const ex = plan.training[i];
                await client.query(`INSERT INTO v2.exercises (name, category, technique_notes) VALUES ($1, 'General', $2) ON CONFLICT (name) DO NOTHING`, [ex.name, ex.technique]);
                const { rows: exLib } = await client.query(`SELECT id FROM v2.exercises WHERE name = $1`, [ex.name]);
                await client.query(`
                    INSERT INTO v2.block_exercises (block_id, exercise_id, target_sets, target_reps, target_weight, target_rpe, target_tempo, sort_order)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `, [blockId, exLib[0].id, ex.sets || 1, ex.reps || ex.target || '-', ex.kg || '-', ex.rpe || '-', ex.tempo || '-', i + 1]);
            }
        }

        // 2. MIGRATE HISTORY TO ISOLATED BLOCKS
        console.log("🚚 Migrating History to Isolated Blocks...");
        const { rows: legacyLogs } = await client.query(`SELECT * FROM public."REGI_daily_logs"`);
        
        for (const row of legacyLogs) {
            const dateStr = new Date(row.date).toISOString().split('T')[0];
            const data = row.data;
            if (!data.user_performance || !data.user_performance.training) continue;

            const dayOfWeek = new Date(row.date).getDay();
            const dayMeta = dayEntries.find(de => de.orig === dayOfWeek);
            if (!dayMeta) continue;

            // Create a hidden HISTORY block for this date
            const { rows: histBlock } = await client.query(`
                INSERT INTO v2.workout_blocks (workout_id, label, block_type, sort_order)
                VALUES ($1, $2, 'STANDARD', 99) RETURNING id
            `, [activeWorkoutIdMap[dayMeta.label], `HISTORY - ${dateStr}`]);
            const histBlockId = histBlock[0].id;

            // Link session log to correct day
            const { rows: targetDay } = await client.query(`SELECT id FROM v2.routine_days WHERE label = $1`, [dayMeta.label]);
            const { rows: sessionRows } = await client.query(`
                INSERT INTO v2.session_logs (user_id, routine_day_id, start_time, end_time) 
                VALUES ($1, $2, $3, $4) RETURNING id
            `, [row.user_id, targetDay[0].id, `${dateStr}T12:00:00Z`, `${dateStr}T13:00:00Z`]);
            const sessionLogId = sessionRows[0].id;

            const trainingLogs = data.user_performance.training;
            const historyExOrder = data.plan_definitions?.training || [];

            for (const [exIdxStr, setGroup] of Object.entries(trainingLogs)) {
                const exIdx = parseInt(exIdxStr);
                const historicalEx = historyExOrder[exIdx];
                if (!historicalEx) continue;

                await client.query(`INSERT INTO v2.exercises (name, category) VALUES ($1, 'Historical') ON CONFLICT (name) DO NOTHING`, [historicalEx.name]);
                const { rows: exLib } = await client.query(`SELECT id FROM v2.exercises WHERE name = $1`, [historicalEx.name]);

                // Create block exercise inside the HISTORICAL block
                const { rows: beRows } = await client.query(`
                    INSERT INTO v2.block_exercises (block_id, exercise_id, target_sets, target_reps, target_weight, target_rpe, target_tempo, sort_order)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
                `, [histBlockId, exLib[0].id, historicalEx.sets || 1, historicalEx.reps || '-', historicalEx.kg || '-', historicalEx.rpe || '-', historicalEx.tempo || '-', exIdx + 1]);
                const blockExId = beRows[0].id;

                if (typeof setGroup === 'object' && setGroup.logged && !setGroup[0]) {
                    await client.query(`INSERT INTO v2.set_logs (session_log_id, block_exercise_id, weight, reps, rpe, set_number) VALUES ($1, $2, $3, $4, $5, $6)`, [sessionLogId, blockExId, '-', 0, parseFloat(historicalEx.rpe) || null, 1]);
                } else {
                    for (const [setIdxStr, setVal] of Object.entries(setGroup)) {
                        if (typeof setVal !== 'object' || !setVal.logged) continue;
                        await client.query(`INSERT INTO v2.set_logs (session_log_id, block_exercise_id, weight, reps, rpe, set_number) VALUES ($1, $2, $3, $4, $5, $6)`, [sessionLogId, blockExId, String(setVal.weight || '0'), parseInt(setVal.reps) || 0, parseFloat(setVal.rpe) || null, parseInt(setIdxStr) + 1]);
                    }
                }
            }
        }
        console.log("✅ HISTORY ISOLATED. ACTIVE PLAN CLEAN.");
    } catch (err) { console.error("Error:", err.message); } finally { await client.end(); }
}
migrateAndSeed();