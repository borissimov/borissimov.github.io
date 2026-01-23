import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function stripPrefixes() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        const updates = [
            { seq: 1, label: 'Recovery' },
            { seq: 2, label: 'Legs' },
            { seq: 3, label: 'Push' },
            { seq: 4, label: 'Pull' },
            { seq: 5, label: 'Active Recovery' },
            { seq: 6, label: 'HIIT Swim' },
            { seq: 7, label: 'Metabolic Circuit' }
        ];

        for (const up of updates) {
            await client.query(`
                UPDATE v2.routine_days 
                SET label = $1 
                WHERE sequence_number = $2
            `, [up.label, up.seq]);
        }

        console.log("✅ Weekday prefixes removed. Chooser labels are now clean.");

    } catch (err) {
        console.error("Error updating labels:", err.message);
    } finally {
        await client.end();
    }
}

stripPrefixes();
