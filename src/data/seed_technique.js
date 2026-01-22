import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function seedTechniqueRecaps() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        // 1. Add column if it doesn't exist (DUMMY CHECK via error handling or direct alter)
        try {
            await client.query(`ALTER TABLE v2.exercises ADD COLUMN technique_notes TEXT`);
            console.log("Column 'technique_notes' added.");
        } catch (e) {
            console.log("Column 'technique_notes' already exists or could not be added.");
        }

        const data = [
            { name: 'Barbell Hip Thrusts (PRIORITY #1)', tech: 'Chin tucked, ribs down. Drive through heels. Full glute squeeze at top. DO NOT arch lower back.' },
            { name: 'Leg Extensions', tech: 'Toes slightly out. Pause for 1s at peak contraction. Control the weight all the way down.' },
            { name: 'Leg Press (Wide Stance)', tech: 'Feet high and wide. Knees stay in line with toes. Push through the middle of the foot.' },
            { name: 'Goblet Squats', tech: 'Elbows inside knees at bottom. Chest up. Sit back into hips. Full range of motion.' },
            { name: 'Lying Leg Curls', tech: 'Keep hips glued to the pad. Squeeze hamstrings hard at top. 3s negative.' },
            { name: 'Adductor Machine', tech: 'Sit tall. Squeeze slowly. Pause at the peak of the movement.' },
            { name: 'Calf Raises', tech: '2s pause at full stretch. Explosive drive up. 2s pause at peak contraction.' },
            { name: 'PLANK (Isometric Finisher)', tech: 'Glutes clenched hard. Push floor away with elbows. Body in a straight line.' }
        ];

        for (const item of data) {
            await client.query(`UPDATE v2.exercises SET technique_notes = $1 WHERE name = $2`, [item.tech, item.name]);
        }

        console.log("✅ Technique recaps seeded successfully.");

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await client.end();
    }
}

seedTechniqueRecaps();