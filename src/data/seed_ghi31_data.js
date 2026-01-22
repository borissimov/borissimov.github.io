import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function seedFullTuesdayDetail() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        const { rows: days } = await client.query(`SELECT id FROM v2.routine_days WHERE label ILIKE '%Вторник%' LIMIT 1`);
        if (days.length === 0) throw new Error("Tuesday not found");
        const tuesdayId = days[0].id;

        await client.query(`
            UPDATE v2.workouts 
            SET workout_notes = 'CONTEXT: 44-Hour Fasted State. GOAL: Max Glycogen Depletion. SAFETY: Stand up slowly (Orthostatic Hypotension risk).',
                name = 'LEG DAY (Volume & TUT Focus)'
            WHERE routine_day_id = $1
        `, [tuesdayId]);

        const { rows: workouts } = await client.query(`SELECT id FROM v2.workouts WHERE routine_day_id = $1`, [tuesdayId]);
        const workoutId = workouts[0].id;
        
        await client.query(`DELETE FROM v2.workout_blocks WHERE workout_id = $1`, [workoutId]);

        const { rows: blocks } = await client.query(`
            INSERT INTO v2.workout_blocks (workout_id, label, block_type, sort_order)
            VALUES ($1, 'СИЛОВА ЧАСТ', 'STANDARD', 1) RETURNING id
        `, [workoutId]);
        const blockId = blocks[0].id;

        const exercises = [
            { 
                name: 'Barbell Hip Thrusts (PRIORITY #1)', 
                targets: [
                    { set: 1, reps: '15', weight: '40', label: 'Warm-up' },
                    { set: 2, reps: '12', weight: '60', label: 'Feeder' },
                    { set: 3, reps: '10-12', weight: '80-90', label: 'Working' },
                    { set: 4, reps: '10-12', weight: '80-90', label: 'Working' }
                ]
            },
            { 
                name: 'Leg Extensions', 
                targets: [
                    { set: 1, reps: '20', weight: '30', label: 'Warm joints' },
                    { set: 2, reps: '15', weight: '40', label: 'Working' },
                    { set: 3, reps: '12-15', weight: '45-50', label: 'Working' },
                    { set: 4, reps: '12-15', weight: '45-50', label: 'Working' }
                ]
            },
            { 
                name: 'Leg Press (Wide Stance)', 
                targets: [
                    { set: 1, reps: '15', weight: '80-100' },
                    { set: 2, reps: '12', weight: '140' },
                    { set: 3, reps: '10-12', weight: '160-170', label: '3s DOWN' },
                    { set: 4, reps: '10-12', weight: '160-170', label: '3s DOWN' },
                    { set: 5, reps: '15-20', weight: '120', label: 'DROP SET' }
                ]
            },
            {
                name: 'Goblet Squats',
                targets: [
                    { set: 1, reps: '12', weight: '20', label: 'Stretch focus' },
                    { set: 2, reps: '10', weight: '30' },
                    { set: 3, reps: '10', weight: '30-35' },
                    { set: 4, reps: '10', weight: '30-35' }
                ]
            },
            {
                name: 'Lying Leg Curls',
                targets: [
                    { set: 1, reps: '15', weight: '25' },
                    { set: 2, reps: '12', weight: '35' },
                    { set: 3, reps: '10-12', weight: '40' },
                    { set: 4, reps: '10-12', weight: '40' }
                ]
            },
            {
                name: 'Adductor Machine',
                targets: [
                    { set: 1, reps: '15', weight: '40' },
                    { set: 2, reps: '12-15', weight: '50-55' },
                    { set: 3, reps: '12-15', weight: '50-55' }
                ]
            },
            {
                name: 'Calf Raises',
                targets: [
                    { set: 1, reps: '15', weight: 'Heavy' },
                    { set: 2, reps: '15', weight: 'Heavy' },
                    { set: 3, reps: '15', weight: 'Heavy' },
                    { set: 4, reps: '15', weight: 'Heavy' }
                ]
            }
        ];

        for (let i = 0; i < exercises.length; i++) {
            const ex = exercises[i];
            await client.query(`INSERT INTO v2.exercises (name, category) VALUES ($1, 'Legs') ON CONFLICT (name) DO NOTHING`, [ex.name]);
            const { rows: exLib } = await client.query(`SELECT id FROM v2.exercises WHERE name = $1`, [ex.name]);
            
            await client.query(`
                INSERT INTO v2.block_exercises (block_id, exercise_id, target_sets, set_targets, sort_order)
                VALUES ($1, $2, $3, $4, $5)
            `, [blockId, exLib[0].id, ex.targets.length, JSON.stringify(ex.targets), i + 1]);
        }

        console.log("✅ Seeded Full 7-Exercise detailed plan for Tuesday.");

    } catch (err) {
        console.error("Seeding Error:", err.message);
    } finally {
        await client.end();
    }
}

seedFullTuesdayDetail();