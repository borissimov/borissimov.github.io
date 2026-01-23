import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function renameToEnglish() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        const updates = [
            { seq: 1, label: 'Monday: Recovery' },
            { seq: 2, label: 'Tuesday: Legs' },
            { seq: 3, label: 'Wednesday: Push' },
            { seq: 4, label: 'Thursday: Pull' },
            { seq: 5, label: 'Friday: Active Recovery' },
            { seq: 6, label: 'Saturday: HIIT Swim' },
            { seq: 7, label: 'Sunday: Metabolic Circuit' }
        ];

        for (const up of updates) {
            await client.query(`
                UPDATE v2.routine_days 
                SET label = $1 
                WHERE sequence_number = $2
            `, [up.label, up.seq]);
        }

        console.log("✅ All training days renamed to English.");

    } catch (err) {
        console.error("Error renaming days:", err.message);
    } finally {
        await client.end();
    }
}

renameToEnglish();
