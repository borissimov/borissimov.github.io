import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function checkLegacyTables() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        const { rows } = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name ILIKE '%regi%'
        `);

        console.log("Found legacy tables:", rows.map(r => r.table_name));

        if (rows.some(r => r.table_name === 'REGI_daily_logs')) {
            const { rowCount } = await client.query(`SELECT 1 FROM public."REGI_daily_logs"`);
            console.log(`Total records in REGI_daily_logs: ${rowCount}`);
        }

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

checkLegacyTables();
