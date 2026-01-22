import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function seedPerformanceProtocol() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        const { rows: days } = await client.query(`SELECT id FROM v2.routine_days WHERE label = 'Legs' LIMIT 1`);
        const tuesdayId = days[0].id;

        const { rows: workouts } = await client.query(`SELECT id FROM v2.workouts WHERE routine_day_id = $1`, [tuesdayId]);
        const workoutId = workouts[0].id;
        
        await client.query(`DELETE FROM v2.workout_blocks WHERE workout_id = $1`, [workoutId]);

        const { rows: blocks } = await client.query(`
            INSERT INTO v2.workout_blocks (workout_id, label, block_type, sort_order)
            VALUES ($1, 'STRENGTH PHASE', 'STANDARD', 1) RETURNING id
        `, [workoutId]);
        const blockId = blocks[0].id;

        const protocol = [
            { 
                name: 'Barbell Hip Thrusts (PRIORITY #1)', 
                targets: [
                    { set: 1, reps: '15', weight: '40', tempo: '2-0-1-3', rpe: '5', label: 'Warm-up' },
                    { set: 2, reps: '12', weight: '60', tempo: '2-0-1-3', rpe: '6', label: 'Feeder' },
                    { set: 3, reps: '10-12', weight: '80-90', tempo: '2-0-1-3', rpe: '8.5', label: 'Work Set 1' },
                    { set: 4, reps: '10-12', weight: '80-90', tempo: '2-0-1-3', rpe: '9', label: 'Work Set 2' }
                ]
            },
            { 
                name: 'Leg Extensions', 
                targets: [
                    { set: 1, reps: '20', weight: '30', tempo: '3-0-1-1', rpe: '5', label: 'Warm joints' },
                    { set: 2, reps: '15', weight: '40', tempo: '3-0-1-1', rpe: '7' },
                    { set: 3, reps: '12-15', weight: '45-50', tempo: '3-0-1-1', rpe: '8' },
                    { set: 4, reps: '12-15', weight: '45-50', tempo: '3-0-1-1', rpe: '9' }
                ]
            },
            { 
                name: 'Leg Press (Wide Stance)', 
                targets: [
                    { set: 1, reps: '15', weight: '80-100', tempo: '3-1-1-0', rpe: '5', label: 'Warm-up' },
                    { set: 2, reps: '12', weight: '140', tempo: '3-1-1-0', rpe: '7', label: 'Feeder' },
                    { set: 3, reps: '10-12', weight: '160-170', tempo: '3-1-1-0', rpe: '8' },
                    { set: 4, reps: '10-12', weight: '160-170', tempo: '3-1-1-0', rpe: '9' },
                    { set: 5, reps: '15-20', weight: '120', tempo: '2-0-1-0', rpe: '10', label: 'DROP SET' }
                ]
            },
            {
                name: 'Goblet Squats',
                targets: [
                    { set: 1, reps: '12', weight: '20', tempo: '3-1-1-0', rpe: '6' },
                    { set: 2, reps: '10', weight: '30', tempo: '3-1-1-0', rpe: '7.5' },
                    { set: 3, reps: '10', weight: '30-35', tempo: '3-1-1-0', rpe: '8.5' },
                    { set: 4, reps: '10', weight: '30-35', tempo: '3-1-1-0', rpe: '9' }
                ]
            },
            {
                name: 'Lying Leg Curls',
                targets: [
                    { set: 1, reps: '15', weight: '25', tempo: '4-0-1-0', rpe: '6' },
                    { set: 2, reps: '12', weight: '35', tempo: '4-0-1-0', rpe: '7.5' },
                    { set: 3, reps: '10-12', weight: '40', tempo: '4-0-1-0', rpe: '8.5' },
                    { set: 4, reps: '10-12', weight: '40', tempo: '4-0-1-0', rpe: '9' }
                ]
            },
            {
                name: 'Adductor Machine',
                targets: [
                    { set: 1, reps: '15', weight: '40', tempo: '2-0-1-1', rpe: '6' },
                    { set: 2, reps: '12-15', weight: '50-55', tempo: '2-0-1-1', rpe: '8' },
                    { set: 3, reps: '12-15', weight: '50-55', tempo: '2-0-1-1', rpe: '9.5' }
                ]
            },
            {
                name: 'Calf Raises',
                targets: [
                    { set: 1, reps: '15', weight: 'Heavy', tempo: '2-2-1-1', rpe: '9' },
                    { set: 2, reps: '15', weight: 'Heavy', tempo: '2-2-1-1', rpe: '9' },
                    { set: 3, reps: '15', weight: 'Heavy', tempo: '2-2-1-1', rpe: '9.5' },
                    { set: 4, reps: '15', weight: 'Heavy', tempo: '2-2-1-1', rpe: '10' }
                ]
            },
            {
                name: 'PLANK (Isometric Finisher)',
                targets: [
                    { set: 1, reps: '60s', weight: 'BW', rpe: '7', label: 'Hold' },
                    { set: 2, reps: '60s', weight: 'BW', rpe: '8', label: 'Squeeze' },
                    { set: 3, reps: 'MAX', weight: 'BW', rpe: '10', label: 'Failure' }
                ]
            }
        ];

        for (let i = 0; i < protocol.length; i++) {
            const ex = protocol[i];
            await client.query(`INSERT INTO v2.exercises (name, category) VALUES ($1, 'Legs') ON CONFLICT (name) DO NOTHING`, [ex.name]);
            const { rows: exLib } = await client.query(`SELECT id FROM v2.exercises WHERE name = $1`, [ex.name]);
            
            await client.query(`
                INSERT INTO v2.block_exercises (block_id, exercise_id, target_sets, set_targets, sort_order)
                VALUES ($1, $2, $3, $4, $5)
            `, [blockId, exLib[0].id, ex.targets.length, JSON.stringify(ex.targets), i + 1]);
        }

        console.log("✅ Performance Protocol + PLANK seeded for Tuesday.");

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

seedPerformanceProtocol();
