import base64

new_plan = """
    const PLAN_JAN_18 = {
        0: { // SUN
            focus: "METABOLIC", type: "LIFT", mobility: DEFAULT_MOBILITY,
            training: [
                { name: "Goblet Squats", sets: 4, reps: "12-15", kg: "24 kg", rpe: 8, tempo: "1-0-X-0", hint: "Match Jan 4th load. Focus on high tempo before fasting." },
                { name: "Push-ups", sets: 4, reps: "Failure", kg: "BW", rpe: 10, tempo: "1-0-X-0", hint: "Strict mechanical failure." },
                { name: "DB Bent-Over Rows", sets: 4, reps: "12-15", kg: "17.5 kg", rpe: 9, tempo: "1-0-1-0", hint: "Squeeze at top. Matched to Jan 15th strength." },
                { name: "DB Push Press", sets: 4, reps: "10-12", kg: "12.5 kg", rpe: 9, tempo: "X-0-X-0", hint: "Use aggressive leg drive." },
                { name: "DB/KB Swings", sets: 4, reps: "20-25", kg: "24 kg", rpe: 9, tempo: "X-0-X-0", hint: "Explosive hip snap. Returning to 24kg." },
                { name: "Finisher: Cable Crunch", sets: 3, reps: "12-15", kg: "55 kg", rpe: 10, tempo: "2-0-1-1", hint: "Spinal flexion focus. No arm pulling." }
            ],
            supplements: [S_ELEC, S_PRE, S_INTRA, S_BED, STACK_M1_MEAT, STACK_M2],
            nutrition: [
                { time: "15:00", name: "Post-Workout", details: "Collagen (12.5g), Skimmed Curd - 300g" },
                { time: "16:00", name: "Meal 1", details: "Chicken Breast - 500g (Raw), Broccoli - 250g, Olive Oil - 13g (1 tbsp)" },
                { time: "19:30", name: "Meal 2", details: "Skimmed Curd - 250g, Olive Oil - 13g (1 tbsp)" },
                { time: "20:00", name: "FAST START", details: "Begin 42h Fast" }
            ]
        },
        1: { // MON
            focus: "ACTIVE RECOVERY", type: "CARDIO", mobility: DEFAULT_MOBILITY,
            training: [{ name: "Walking (LISS)", target: "30-60m", hint: "Fat oxidation focus. Maintain electrolytes." }],
            supplements: [S_ELEC, S_BED],
            nutrition: [{ time: "All Day", name: "FASTING", details: "Zero Calories" }, HYDRA]
        },
        2: { // TUE
            focus: "LEGS (VOLUME)", type: "LIFT", mobility: DEFAULT_MOBILITY,
            training: [
                { name: "Machine Hip Thrusts", sets: 3, reps: "10-12", kg: "40 kg", rpe: 9, tempo: "2-0-1-2", hint: "Recommended starting load. Focus on 2s hard squeeze." },
                { name: "Goblet Squats", sets: 4, reps: "15-20", kg: "26 kg", rpe: 9, tempo: "3-0-1-0", hint: "Progression: +2kg from Jan 6th performance." },
                { name: "Leg Extensions", sets: 3, reps: "12-15", kg: "30 kg", rpe: 10, tempo: "2-0-1-2", hint: "Maximum TUT. Peak contraction hold." },
                { name: "Lying Leg Curls", sets: 3, reps: "12-15", kg: "12.5 kg", rpe: 10, tempo: "2-0-1-0", hint: "Strict mind-muscle connection." },
                { name: "DB RDL", sets: 3, reps: "12-15", kg: "34 kg", rpe: 9, tempo: "3-1-1-0", hint: "Progression: +2kg from Jan 6th. Focus on stretch." },
                { name: "Calf Raises", sets: 4, reps: "20-25", kg: "10 kg", rpe: 10, tempo: "2-1-1-2", hint: "Added load to hit rep range failure." },
                { name: "Plank", sets: 3, reps: "Failure", kg: "BW", rpe: 10, tempo: "Static", hint: "Clench glutes hard to protect lower back." }
            ],
            supplements: [S_ELEC, S_PRE, S_INTRA, S_BED, STACK_M1, STACK_M2],
            nutrition: [
                { time: "14:00", name: "Post-Workout (Refeed)", details: "Collagen (12.5g), Skimmed Curd - 250g" },
                { time: "16:00", name: "Meal 1", details: "Hake - 300g (Raw), Rice - 150g (Dry), Cucumber - 150g" },
                { time: "19:30", name: "Meal 2", details: "Hake - 260g (Raw), Rice - 100g (Dry), Lettuce" }
            ]
        },
        3: { // WED
            focus: "PUSH (TUT)", type: "LIFT", mobility: DEFAULT_MOBILITY,
            training: [
                { name: "DB Flat Bench", sets: 4, reps: "8-12", kg: "20 kg", rpe: 9, tempo: "3-1-1-0", hint: "Strict tempo verified. Corrected load from Jan 7th." },
                { name: "DB Incline Bench", sets: 3, reps: "10-12", kg: "17.5 kg", rpe: 9, tempo: "3-1-1-0", hint: "30-45 degree incline focus." },
                { name: "High Incline DB Press", sets: 3, reps: "10-12", kg: "15 kg", rpe: 9, tempo: "3-1-1-0", hint: "Neutral spine, overhead emphasis." },
                { name: "DB Lateral Raise", sets: 3, reps: "12-15", kg: "7.5 kg", rpe: 10, tempo: "3-1-1-0", hint: "No swinging. Lead with elbows." },
                { name: "Cable Rope Pushdown", sets: 3, reps: "10-12", kg: "15-17.5 kg", rpe: 9, tempo: "3-1-1-0", hint: "Corrected load from Jan 7th. Spread rope at bottom." },
                { name: "Overhead Rope Ext", sets: 3, reps: "12-15", kg: "10-12.5 kg", rpe: 10, tempo: "3-1-1-0", hint: "Corrected load from Jan 7th. Focus on long head stretch." },
                { name: "Ab Wheel Rollout", sets: 3, reps: "8-12", kg: "BW", rpe: 9, tempo: "4-0-1-0", hint: "Slow and controlled movement." }
            ],
            supplements: [S_ELEC, S_PRE, S_INTRA, S_BED, STACK_M1_WED, STACK_M2],
            nutrition: [
                { time: "15:00", name: "Post-Workout", details: "Collagen (12.5g), Skimmed Curd - 300g" },
                { time: "16:00", name: "Meal 1", details: "Pork Loin - 450g (Raw), Cabbage - 200g" },
                { time: "19:30", name: "Meal 2", details: "Tuna - 112g (Drained), Zucchini - 200g, Olive Oil - 25g (2 tbsp)" }
            ]
        },
        4: { // THU
            focus: "PULL (TUT)", type: "LIFT", mobility: DEFAULT_MOBILITY,
            training: [
                { name: "Wide Lat Pulldown", sets: 4, reps: "10-12", kg: "50 kg", rpe: "8-9", tempo: "3-1-1-0", hint: "Maintain strict performance from Jan 15th." },
                { name: "V-Handle Cable Row", sets: 4, reps: "10-12", kg: "40 kg", rpe: 9, tempo: "3-1-1-0", hint: "Progression: +5kg from Jan 15th." },
                { name: "1-Arm DB Row", sets: 3, reps: "8-10", kg: "20 kg", rpe: 9, tempo: "3-1-1-0", hint: "Progression: +2.5kg from Jan 15th." },
                { name: "Face Pulls", sets: 3, reps: "15-20", kg: "7.5 kg", rpe: 8, tempo: "3-1-1-0", hint: "Focus on external rotation." },
                { name: "Incline DB Curl", sets: 3, reps: "10-12", kg: "6 kg", rpe: 10, tempo: "3-1-1-0", hint: "Deep stretch behind body." },
                { name: "Hammer Curls", sets: 3, reps: "10-12", kg: "8 kg", rpe: 10, tempo: "3-1-1-0", hint: "Strict brachialis isolation." },
                { name: "Toes to Bar/Knees", sets: 3, reps: "Failure", kg: "BW", rpe: 10, tempo: "3-1-1-0", hint: "Strict abdominal control." }
            ],
            supplements: [S_ELEC, S_PRE, S_INTRA, S_BED, STACK_M1_MEAT, STACK_M2],
            nutrition: [
                { time: "15:00", name: "Post-Workout", details: "Collagen (12.5g), Skimmed Curd - 300g" },
                { time: "16:00", name: "Meal 1", details: "Chicken Breast - 500g (Raw), Broccoli - 250g, Olive Oil - 10g (2 tsp)" },
                { time: "19:30", name: "Meal 2 (Cod Liver Day)", details: "Cod Liver - 120g (Canned), Cucumber - 150g" }
            ]
        },
        5: { // FRI
            focus: "SWIM (LISS)", type: "CARDIO", mobility: DEFAULT_MOBILITY,
            training: [{ name: "Moderate Swim", target: "30-45m", hint: "Aerobic conditioning. Focus on breathing rhythm." }],
            supplements: [S_ELEC, { time: "13:50", name: "Pre-Swim", details: "EAA (3 scoops / 20g)" }, S_BED, STACK_M1_FISH, STACK_M2],
            nutrition: [
                { time: "15:00", name: "Post-Swim", details: "Collagen (12.5g), Skimmed Curd - 350g" },
                { time: "16:00", name: "Meal 1", details: "Sardines - 400g, Lettuce - 200g, Olive Oil - 13g (1 tbsp)" },
                { time: "19:30", name: "Meal 2", details: "Tuna - 112g (Drained), Skyr - 250g" }
            ]
        },
        6: { // SAT
            focus: "SWIM (HIIT)", type: "CARDIO", mobility: DEFAULT_MOBILITY,
            training: [{ name: "Interval Swim", target: "15-20m", hint: "1 Lap Sprint (90% effort) / 2 Laps Recovery pace." }],
            supplements: [S_ELEC, S_PRE, S_INTRA, S_BED, STACK_M1_MEAT, STACK_M2],
            nutrition: [
                { time: "15:00", name: "Post-Swim", details: "Collagen (12.5g), Skimmed Curd - 250g" },
                { time: "16:00", name: "Meal 1", details: "Pork Loin - 450g (Raw), Cabbage - 200g, Olive Oil - 13g (1 tbsp)" },
                { time: "19:30", name: "Meal 2", details: "Skyr - 250g, Olive Oil - 13g (1 tbsp)" }
            ]
        }
    };
"

print(base64.b64encode(new_plan.encode()).decode())
