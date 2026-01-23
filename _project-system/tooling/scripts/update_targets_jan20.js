import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.vhqgufwgzspwmztpswdn:do6auwQxhdpc3MZu@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

const UPDATES = [
  {
    "day": "Recovery (Mon)",
    "updates": [
      {
        "name": "Walking (LISS)",
        "technique": "Breathe deeply. minimal stress.",
        "targets": [
          { "set": 1, "reps": "30-60m", "weight": "-", "rpe": "3", "tempo": "Natural", "label": "Active Recovery" }
        ]
      }
    ]
  },
  {
    "day": "Legs (Tue)",
    "updates": [
      {
        "name": "Barbell Hip Thrusts",
        "technique": "Chin tucked. Drive through heels. HARD squeeze at top.",
        "targets": [
          { "set": 1, "reps": "15", "weight": "40", "rpe": "5", "tempo": "2-0-1-3", "label": "Warm-up" },
          { "set": 2, "reps": "12", "weight": "60", "rpe": "6", "tempo": "2-0-1-3", "label": "Feeder" },
          { "set": 3, "reps": "10-12", "weight": "80-90", "rpe": "8.5", "tempo": "2-0-1-3", "label": "Working" },
          { "set": 4, "reps": "10-12", "weight": "80-90", "rpe": "9", "tempo": "2-0-1-3", "label": "Working" }
        ]
      },
      {
        "name": "Leg Extensions",
        "technique": "Control the descent. Do not rest at bottom.",
        "targets": [
          { "set": 1, "reps": "20", "weight": "30", "rpe": "5", "tempo": "3-0-1-1", "label": "Warm-up" },
          { "set": 2, "reps": "15", "weight": "40", "rpe": "7", "tempo": "3-0-1-1", "label": "Feeder" },
          { "set": 3, "reps": "12-15", "weight": "45-50", "rpe": "8", "tempo": "3-0-1-1", "label": "Working" },
          { "set": 4, "reps": "12-15", "weight": "45-50", "rpe": "9", "tempo": "3-0-1-1", "label": "Working" }
        ]
      },
      {
        "name": "Leg Press (Wide Stance)",
        "technique": "Sit for 15s after set! Do not lock knees.",
        "targets": [
          { "set": 1, "reps": "15", "weight": "80-100", "rpe": "5", "tempo": "3-1-1-0", "label": "Warm-up" },
          { "set": 2, "reps": "12", "weight": "140", "rpe": "7", "tempo": "3-1-1-0", "label": "Feeder" },
          { "set": 3, "reps": "10-12", "weight": "160-170", "rpe": "8", "tempo": "3-1-1-0", "label": "Working" },
          { "set": 4, "reps": "10-12", "weight": "160-170", "rpe": "9", "tempo": "3-1-1-0", "label": "Working" },
          { "set": 5, "reps": "15-20", "weight": "120", "rpe": "10", "tempo": "2-0-1-0", "label": "Drop Set" }
        ]
      },
      {
        "name": "Goblet Squat (or Hack)",
        "technique": "Deep stretch. Chest up.",
        "targets": [
          { "set": 1, "reps": "12", "weight": "20", "rpe": "6", "tempo": "3-1-1-0", "label": "Warm-up" },
          { "set": 2, "reps": "10", "weight": "30", "rpe": "7.5", "tempo": "3-1-1-0", "label": "Feeder" },
          { "set": 3, "reps": "10", "weight": "30-35", "rpe": "8.5", "tempo": "3-1-1-0", "label": "Working" },
          { "set": 4, "reps": "10", "weight": "30-35", "rpe": "9", "tempo": "3-1-1-0", "label": "Working" }
        ]
      },
      {
        "name": "Lying Leg Curls",
        "technique": "Slow eccentric (4s). Protect knees.",
        "targets": [
          { "set": 1, "reps": "15", "weight": "25", "rpe": "6", "tempo": "4-0-1-0", "label": "Warm-up" },
          { "set": 2, "reps": "12", "weight": "35", "rpe": "7.5", "tempo": "4-0-1-0", "label": "Working" },
          { "set": 3, "reps": "10-12", "weight": "40", "rpe": "8.5", "tempo": "4-0-1-0", "label": "Working" },
          { "set": 4, "reps": "10-12", "weight": "40", "rpe": "9", "tempo": "4-0-1-0", "label": "Working" }
        ]
      },
      {
        "name": "Adductor Machine",
        "technique": "Squeeze legs together hard.",
        "targets": [
          { "set": 1, "reps": "15", "weight": "40", "rpe": "6", "tempo": "2-0-1-1", "label": "Warm-up" },
          { "set": 2, "reps": "12-15", "weight": "50-55", "rpe": "8", "tempo": "2-0-1-1", "label": "Working" },
          { "set": 3, "reps": "12-15", "weight": "50-55", "rpe": "9.5", "tempo": "2-0-1-1", "label": "Working" }
        ]
      },
      {
        "name": "Calves",
        "technique": "Full stretch at bottom. 2s hold.",
        "targets": [
          { "set": 1, "reps": "15", "weight": "Heavy", "rpe": "9", "tempo": "2-2-1-1", "label": "Working" },
          { "set": 2, "reps": "15", "weight": "Heavy", "rpe": "9", "tempo": "2-2-1-1", "label": "Working" },
          { "set": 3, "reps": "15", "weight": "Heavy", "rpe": "10", "tempo": "2-2-1-1", "label": "Working" },
          { "set": 4, "reps": "15", "weight": "Heavy", "rpe": "10", "tempo": "2-2-1-1", "label": "Working" }
        ]
      }
    ]
  },
  {
    "day": "Push (Wed)",
    "updates": [
      {
        "name": "DB Flat Bench",
        "technique": "Strict form. 3s negative.",
        "targets": [
          { "set": 1, "reps": "10-12", "weight": "20", "rpe": "8", "tempo": "3-1-1-0", "label": "Working" },
          { "set": 2, "reps": "10-12", "weight": "20", "rpe": "8.5", "tempo": "3-1-1-0", "label": "Working" },
          { "set": 3, "reps": "8-12", "weight": "20", "rpe": "9", "tempo": "3-1-1-0", "label": "Working" },
          { "set": 4, "reps": "8-12", "weight": "20", "rpe": "9.5", "tempo": "3-1-1-0", "label": "Working" }
        ]
      },
      {
        "name": "DB Incline Bench",
        "technique": "Upper chest focus.",
        "targets": [
          { "set": 1, "reps": "10-12", "weight": "17.5", "rpe": "9", "tempo": "3-1-1-0", "label": "Working" },
          { "set": 2, "reps": "10-12", "weight": "17.5", "rpe": "9", "tempo": "3-1-1-0", "label": "Working" },
          { "set": 3, "reps": "10-12", "weight": "17.5", "rpe": "9.5", "tempo": "3-1-1-0", "label": "Working" }
        ]
      },
      {
        "name": "DB Lateral Raise",
        "technique": "Lead with elbows. No momentum.",
        "targets": [
          { "set": 1, "reps": "12-15", "weight": "7.5", "rpe": "9", "tempo": "2-0-1-1", "label": "Working" },
          { "set": 2, "reps": "12-15", "weight": "7.5", "rpe": "9", "tempo": "2-0-1-1", "label": "Working" },
          { "set": 3, "reps": "12-15", "weight": "7.5", "rpe": "10", "tempo": "2-0-1-1", "label": "Working" }
        ]
      },
      {
        "name": "Cable Rope Pushdown",
        "technique": "Spread the rope at bottom.",
        "targets": [
          { "set": 1, "reps": "10-12", "weight": "17.5", "rpe": "9", "tempo": "3-0-1-1", "label": "Working" },
          { "set": 2, "reps": "10-12", "weight": "17.5", "rpe": "9", "tempo": "3-0-1-1", "label": "Working" },
          { "set": 3, "reps": "10-12", "weight": "17.5", "rpe": "10", "tempo": "3-0-1-1", "label": "Working" }
        ]
      },
      {
        "name": "Ab Wheel Rollout",
        "technique": "Protect lower back. Brace core.",
        "targets": [
          { "set": 1, "reps": "8-12", "weight": "BW", "rpe": "8", "tempo": "4-0-1-0", "label": "Working" },
          { "set": 2, "reps": "8-12", "weight": "BW", "rpe": "9", "tempo": "4-0-1-0", "label": "Working" },
          { "set": 3, "reps": "8-12", "weight": "BW", "rpe": "9", "tempo": "4-0-1-0", "label": "Working" }
        ]
      }
    ]
  },
  {
    "day": "Pull (Thu)",
    "updates": [
      {
        "name": "Wide Lat Pulldown",
        "technique": "Pull to chest. Control release.",
        "targets": [
          { "set": 1, "reps": "10-12", "weight": "50", "rpe": "8", "tempo": "3-1-1-0", "label": "Working" },
          { "set": 2, "reps": "10-12", "weight": "50", "rpe": "9", "tempo": "3-1-1-0", "label": "Working" },
          { "set": 3, "reps": "10-12", "weight": "50", "rpe": "9", "tempo": "3-1-1-0", "label": "Working" },
          { "set": 4, "reps": "10-12", "weight": "50", "rpe": "10", "tempo": "3-1-1-0", "label": "Working" }
        ]
      },
      {
        "name": "V-Handle Cable Row",
        "technique": "Full stretch forward.",
        "targets": [
          { "set": 1, "reps": "10-12", "weight": "40", "rpe": "8.5", "tempo": "3-1-1-0", "label": "Working" },
          { "set": 2, "reps": "10-12", "weight": "40", "rpe": "9", "tempo": "3-1-1-0", "label": "Working" },
          { "set": 3, "reps": "10-12", "weight": "40", "rpe": "9.5", "tempo": "3-1-1-0", "label": "Working" }
        ]
      },
      {
        "name": "Face Pulls",
        "technique": "External rotation focus.",
        "targets": [
          { "set": 1, "reps": "15", "weight": "7.5", "rpe": "8", "tempo": "2-0-1-2", "label": "Working" },
          { "set": 2, "reps": "15", "weight": "7.5", "rpe": "9", "tempo": "2-0-1-2", "label": "Working" },
          { "set": 3, "reps": "15", "weight": "7.5", "rpe": "10", "tempo": "2-0-1-2", "label": "Working" }
        ]
      },
      {
        "name": "Incline DB Curl",
        "technique": "Full stretch at bottom.",
        "targets": [
          { "set": 1, "reps": "10-12", "weight": "8", "rpe": "9", "tempo": "3-0-1-0", "label": "Working" },
          { "set": 2, "reps": "10-12", "weight": "8", "rpe": "9.5", "tempo": "3-0-1-0", "label": "Working" },
          { "set": 3, "reps": "10-12", "weight": "8", "rpe": "10", "tempo": "3-0-1-0", "label": "Working" }
        ]
      }
    ]
  },
  {
    "day": "Swim LISS (Fri)",
    "updates": [
      {
        "name": "Moderate Swim",
        "technique": "Steady state. Focus on breathing.",
        "targets": [
          { "set": 1, "reps": "30-45m", "weight": "-", "rpe": "6", "tempo": "Continuous", "label": "LISS" }
        ]
      }
    ]
  },
  {
    "day": "Swim HIIT (Sat)",
    "updates": [
      {
        "name": "Interval Swim",
        "technique": "1 lap Fast / 2 laps Slow.",
        "targets": [
          { "set": 1, "reps": "20m", "weight": "-", "rpe": "9", "tempo": "Interval", "label": "HIIT" }
        ]
      }
    ]
  },
  {
    "day": "Metabolic (Sun)",
    "updates": [
      {
        "name": "Goblet Squats",
        "technique": "CONTROL breath. Stop if dizzy.",
        "targets": [
          { "set": 1, "reps": "12", "weight": "30", "rpe": "8", "tempo": "2-0-X-0", "label": "Working" },
          { "set": 2, "reps": "12", "weight": "30", "rpe": "8", "tempo": "2-0-X-0", "label": "Working" },
          { "set": 3, "reps": "12", "weight": "30", "rpe": "9", "tempo": "2-0-X-0", "label": "Working" },
          { "set": 4, "reps": "12", "weight": "30", "rpe": "9", "tempo": "2-0-X-0", "label": "Working" }
        ]
      },
      {
        "name": "Push-ups",
        "technique": "Strict form.",
        "targets": [
          { "set": 1, "reps": "Failure", "weight": "BW", "rpe": "10", "tempo": "1-0-X-0", "label": "Failure" },
          { "set": 2, "reps": "Failure", "weight": "BW", "rpe": "10", "tempo": "1-0-X-0", "label": "Failure" },
          { "set": 3, "reps": "Failure", "weight": "BW", "rpe": "10", "tempo": "1-0-X-0", "label": "Failure" }
        ]
      },
      {
        "name": "DB Bent-Over Rows",
        "technique": "Squeeze back.",
        "targets": [
          { "set": 1, "reps": "12-15", "weight": "17.5", "rpe": "8", "tempo": "1-0-1-0", "label": "Working" },
          { "set": 2, "reps": "12-15", "weight": "17.5", "rpe": "9", "tempo": "1-0-1-0", "label": "Working" },
          { "set": 3, "reps": "12-15", "weight": "17.5", "rpe": "9", "tempo": "1-0-1-0", "label": "Working" }
        ]
      },
      {
        "name": "DB Push Press",
        "technique": "Use legs. Exhale on push.",
        "targets": [
          { "set": 1, "reps": "10", "weight": "15", "rpe": "9", "tempo": "X-0-X-0", "label": "Working" },
          { "set": 2, "reps": "10", "weight": "15", "rpe": "9", "tempo": "X-0-X-0", "label": "Working" },
          { "set": 3, "reps": "10", "weight": "15", "rpe": "9", "tempo": "X-0-X-0", "label": "Working" }
        ]
      },
      {
        "name": "DB Swings",
        "technique": "Snap hips. Stop if dizzy.",
        "targets": [
          { "set": 1, "reps": "20", "weight": "24", "rpe": "9", "tempo": "X-0-X-0", "label": "Working" }
        ]
      }
    ]
  }
];

async function applyUpdate() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log("Connected to Supabase.");

        for (const dayData of UPDATES) {
            console.log(`\n📅 DAY: ${dayData.day}`);
            const { rows: days } = await client.query(`SELECT id FROM v2.routine_days WHERE label = $1`, [dayData.day]);
            if (days.length === 0) {
                console.log(`❌ ERROR: Could not find routine day '${dayData.day}'`);
                continue;
            }
            const dayId = days[0].id;

            const { rows: workouts } = await client.query(`SELECT id FROM v2.workouts WHERE routine_day_id = $1`, [dayId]);
            const workoutId = workouts[0].id;

            const { rows: blocks } = await client.query(`SELECT id FROM v2.workout_blocks WHERE workout_id = $1`, [workoutId]);
            const blockId = blocks[0].id;

            const mapName = (n) => {
                if (n === 'Barbell Hip Thrusts') return 'Machine Hip Thrusts';
                if (n === 'Goblet Squat (or Hack)') return 'Goblet Squats';
                if (n === 'Calves') return 'Calf Raises';
                return n;
            };

            for (const up of dayData.updates) {
                const dbName = mapName(up.name);
                console.log(`  └─ EX: ${up.name} -> DB: ${dbName}`);
                
                await client.query(`UPDATE v2.exercises SET technique_notes = $1 WHERE name = $2`, [up.technique, dbName]);

                const def = up.targets[0];
                const { rowCount } = await client.query(`
                    UPDATE v2.block_exercises 
                    SET target_sets = $1, target_reps = $2, target_weight = $3, target_rpe = $4, target_tempo = $5, set_targets = $6
                    WHERE block_id = $7 AND exercise_id IN (SELECT id FROM v2.exercises WHERE name = $8)
                `, [
                    up.targets.length, def.reps, def.weight, def.rpe, def.tempo, 
                    JSON.stringify(up.targets), 
                    blockId, dbName
                ]);

                if (rowCount === 0) {
                    console.log(`     ⚠️ WARNING: No block_exercise found for ${dbName}`);
                } else {
                    console.log(`     ✅ Updated ${rowCount} rows with ${up.targets.length} set targets.`);
                }
            }
        }

        console.log("\n✅ ALL TARGETS AND LABELS SYNCED SUCCESSFULLY.");

    } catch (err) {
        console.error("Update Error:", err.message);
    } finally {
        await client.end();
    }
}

applyUpdate();
