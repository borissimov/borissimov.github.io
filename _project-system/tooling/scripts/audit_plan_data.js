import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function auditData() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        // 1. Check for Missing Target Sets
        const { rows: missingSets } = await client.query(`
            SELECT be.id, e.name, be.target_sets
            FROM v2.block_exercises be
            JOIN v2.exercises e ON be.exercise_id = e.id
            WHERE be.target_sets IS NULL OR be.target_sets <= 0
        `);

        if (missingSets.length > 0) {
            console.warn("⚠️  FOUND EXERCISES WITH MISSING TARGET SETS:");
            missingSets.forEach(r => console.warn(`   - ${r.name} (ID: ${r.id})`));
        } else {
            console.log("✅ All exercises have valid target_sets.");
        }

        // 2. Check for Rest Days with unintentional workouts
        const { rows: restWorkouts } = await client.query(`
            SELECT rd.label, w.name
            FROM v2.routine_days rd
            JOIN v2.workouts w ON w.routine_day_id = rd.id
            WHERE rd.is_rest_day = true
        `);

        if (restWorkouts.length > 0) {
            console.warn("⚠️  FOUND REST DAYS WITH LINKED WORKOUTS (Conflict):");
            restWorkouts.forEach(r => console.warn(`   - ${r.label}`));
        } else {
            console.log("✅ Rest days are clean.");
        }

        // 3. Summary of Session Counts
        const { rows: counts } = await client.query(`
            SELECT rd.label, COUNT(be.id) as ex_count
            FROM v2.routine_days rd
            LEFT JOIN v2.workouts w ON w.routine_day_id = rd.id
            LEFT JOIN v2.workout_blocks wb ON wb.workout_id = w.id
            LEFT JOIN v2.block_exercises be ON be.block_id = wb.id
            GROUP BY rd.label, rd.sequence_number
            ORDER BY rd.sequence_number
        `);

        console.log("\n📊 WORKOUT VOLUME SUMMARY:");
        counts.forEach(c => console.log(`   - ${c.label}: ${c.ex_count} exercises`));

    } catch (err) {
        console.error("Audit Error:", err.message);
    } finally {
        await client.end();
    }
}

auditData();
