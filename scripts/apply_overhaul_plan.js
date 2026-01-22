import fs from 'fs';
import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

async function applyOverhaul() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    await client.connect();

    try {
        const plan = JSON.parse(fs.readFileSync('update_workout_regime copy 2.json', 'utf8'));
        console.log("🚀 Starting Plan Overhaul (Safe Archive Mode)...");

        for (const dayData of plan) {
            const cleanLabel = dayData.day.split(' (')[0];
            console.log(`\n--- Processing Day: ${cleanLabel} ---`);

            // 1. Clean Label
            const { rows: days } = await client.query(
                "UPDATE v2.routine_days SET label = $1 WHERE label = $2 OR label = $3 RETURNING id",
                [cleanLabel, dayData.day, cleanLabel]
            );
            
            if (days.length === 0) {
                console.error(`❌ Could not find day matching: ${dayData.day}`);
                continue;
            }
            const dayId = days[0].id;

            // 2. Get Workout ID
            const { rows: workouts } = await client.query("SELECT id FROM v2.workouts WHERE routine_day_id = $1", [dayId]);
            if (workouts.length === 0) {
                const { rows: newWork } = await client.query("INSERT INTO v2.workouts (routine_day_id, name) VALUES ($1, $2) RETURNING id", [dayId, cleanLabel]);
                workouts.push(newWork[0]);
            }
            const workoutId = workouts[0].id;

            // 3. ARCHIVE current MAIN PHASE to avoid FK violations and keep history links
            await client.query(
                "UPDATE v2.workout_blocks SET label = 'ARCHIVED ' || TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI') WHERE workout_id = $1 AND label = 'MAIN PHASE'",
                [workoutId]
            );

            // 4. CREATE FRESH MAIN PHASE block
            const { rows: newBlock } = await client.query(
                "INSERT INTO v2.workout_blocks (workout_id, label, block_type, sort_order) VALUES ($1, 'MAIN PHASE', 'STANDARD', 1) RETURNING id",
                [workoutId]
            );
            const blockId = newBlock[0].id;

            // 5. Insert New Exercises and Targets
            for (let i = 0; i < dayData.updates.length; i++) {
                const update = dayData.updates[i];
                
                // Ensure exercise exists
                let { rows: exRows } = await client.query("SELECT id FROM v2.exercises WHERE name = $1", [update.name]);
                let exId;
                if (exRows.length === 0) {
                    const { rows: newEx } = await client.query(
                        "INSERT INTO v2.exercises (name, technique_notes) VALUES ($1, $2) RETURNING id",
                        [update.name, update.technique]
                    );
                    exId = newEx[0].id;
                } else {
                    exId = exRows[0].id;
                    await client.query("UPDATE v2.exercises SET technique_notes = $1 WHERE id = $2", [update.technique, exId]);
                }

                // Insert Block Exercise
                const targetSets = update.targets.length;
                const primaryTarget = update.targets[0];
                
                await client.query(`
                    INSERT INTO v2.block_exercises (
                        block_id, exercise_id, sort_order, 
                        target_sets, target_reps, target_weight, target_rpe, target_tempo,
                        set_targets
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                `, [
                    blockId, exId, i + 1,
                    targetSets, primaryTarget.reps, primaryTarget.weight, primaryTarget.rpe, primaryTarget.tempo,
                    JSON.stringify(update.targets)
                ]);

                console.log(`✅ Linked: ${update.name} (${targetSets} sets)`);
            }
        }

        console.log("\n✨ Database Overhaul Complete. Labels cleaned. Targets updated. History preserved.");

    } catch (err) {
        console.error("💥 Overhaul Failed:", err);
    } finally {
        await client.end();
    }
}

applyOverhaul();