import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function inspectSchema() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("🔌 Connected. Inspecting v2 schema...");

        const { rows: tables } = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'v2' 
            ORDER BY table_name
        `);

        if (tables.length === 0) {
            console.log("⚠️ No tables found in schema 'v2'.");
            return;
        }

        for (const table of tables) {
            console.log(`
📄 Table: v2.${table.table_name}`);
            const { rows: columns } = await client.query(`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_schema = 'v2' AND table_name = $1
                ORDER BY ordinal_position
            `, [table.table_name]);
            
            columns.forEach(col => {
                console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
            });
        }

    } catch (err) {
        console.error("❌ Inspection Failed:", err);
    } finally {
        await client.end();
    }
}

inspectSchema();
