import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function renameBlocksToEnglish() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        // Translate specific block labels
        await client.query(`
            UPDATE v2.workout_blocks 
            SET label = 'STRENGTH PHASE' 
            WHERE label = 'СИЛОВА ЧАСТ';
            
            UPDATE v2.workout_blocks 
            SET label = 'FINISHER' 
            WHERE label = 'Финишър';

            UPDATE v2.workout_blocks 
            SET label = 'RECOVERY' 
            WHERE label = 'Recovery'; -- Normalize case
        `);

        console.log("✅ Block labels normalized to English.");

    } catch (err) {
        console.error("Error renaming blocks:", err.message);
    } finally {
        await client.end();
    }
}

renameBlocksToEnglish();
