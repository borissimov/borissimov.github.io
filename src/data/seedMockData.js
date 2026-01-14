import initialData from './local_db_dump.json';

export const seedMockDB = () => {
    const existing = localStorage.getItem('mock_db');
    let db = {};
    try {
        db = JSON.parse(existing || '{}');
    } catch (e) {
        db = {};
    }

    // Seed if empty OR missing critical tables (e.g. routines)
    if (!db.routines || db.routines.length === 0) {
        console.log("[MockDB] Seeding initial data from export...");
        
        const mockUserId = 'mock-user-id';
        const realUserId = '2edced93-d05e-4e83-8a83-5df5140ebffb';
        
        const seeded = {};
        for (const [table, rows] of Object.entries(initialData)) {
            seeded[table] = rows.map(row => {
                const newRow = { ...row };
                if (newRow.user_id === realUserId) newRow.user_id = mockUserId;
                if (newRow.id === realUserId) newRow.id = mockUserId; // for profiles
                return newRow;
            });
        }
        
        localStorage.setItem('mock_db', JSON.stringify(seeded));
        console.log("[MockDB] Seed complete.");
    }
};
