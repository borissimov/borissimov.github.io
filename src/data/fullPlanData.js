export const fullPlanData = {
    "pon": {
        "training": {
            "title": "Active Recovery",
            "rest": 0,
            "instructions": "<ul><li>Goal: Recovery, improved circulation, and fat burning during the 42-hour fast.</li><li>Intensity: Low, you should be able to hold a conversation without gasping.</li></ul>",
            "exercises": [
                {
                    "exercise": "Active Recovery",
                    "config": "N/A x 30-60 min @ N/A RPE",
                    "focus": "<ul><li>Walk at a light to moderate pace outdoors or on a treadmill.</li></ul>"
                }
            ],
            "type": "list"
        },
        "nutrition": {
            "title": "42-hour Fast",
            "input": "~0 kcal (p: 0g / f: 0g / c: 0g)",
            "output": "~2400 kcal (BMR: ~1850 kcal + Activity: ~550 kcal)",
            "deficit": "~2400",
            "events": []
        },
        "supplements": {
            "title": "Supplementation",
            "events": [
                {
                    "time": "07:00",
                    "action": "On Waking / As Needed",
                    "items": [
                        { "name": "Electrolytes", "dosage": "As needed (Lo Salt + Non-iodized salt)" }
                    ]
                },
                {
                    "time": "22:30",
                    "action": "Bedtime (Fasted)",
                    "items": [
                        { "name": "KSM-66 Ashwagandha", "dosage": "4 caps" },
                        { "name": "OptiZinc (Zinc + Copper)", "dosage": "1 cap" },
                        { "name": "Boron", "dosage": "1 cap" },
                        { "name": "Vitamin B6 P-5-P", "dosage": "1 cap" }
                    ]
                }
            ]
        }
    },
    "vto": {
        "training": {
            "title": "Heavy Leg Workout (Glycogen Depletion)",
            "rest": 60,
            "instructions": "<ul><li>Goal: Maximal muscle glycogen depletion through high volume.</li><li>Rest between sets: 45-60 seconds.</li><li>Target RPE 9-10 (close to or at muscle failure).</li></ul>",
            "exercises": [
                { "exercise": "Goblet Squats", "config": "4 x 15-20 @ 9 RPE", "focus": "<ul><li>Keep dumbbell tight to chest, elbows pointing down.</li><li>Descend deep and controlled.</li><li>This is your main volume mover.</li></ul>" },
                { "exercise": "Leg Press", "config": "4 x 15-20 @ 10 RPE", "focus": "<ul><li>Place feet shoulder-width apart.</li><li>Lower slowly and drive up explosively, do not lock knees at the top.</li></ul>" },
                { "exercise": "Leg Extensions", "config": "3 x 12-15 @ 10 RPE", "focus": "<ul><li>Isolate the quadriceps.</li><li>Squeeze the muscle for a second at the top before starting the slow descent.</li></ul>" },
                { "exercise": "Lying Leg Curls", "config": "3 x 12-15 @ 10 RPE", "focus": "<ul><li>Focus on the mind-muscle connection with the hamstrings.</li><li>Movement should be smooth, without using momentum from the hips.</li></ul>" },
                { "exercise": "Dumbbell RDL", "config": "3 x 12-15 @ 9 RPE", "focus": "<ul><li>With slight knee bend, push hips back until you feel max stretch in hamstrings.</li><li>Keep back straight.</li></ul>" },
                { "exercise": "Calf Raises", "config": "4 x 20-25 @ 10 RPE", "focus": "<ul><li>Perform full stretch at bottom position and hold for a second at the very top.</li></ul>" },
                { "exercise": "PLANK - Core Finisher", "config": "3 x To Failure @ 10 RPE", "focus": "<ul><li>Keep body in a perfectly straight line from shoulders to heels.</li><li>Tighten core and glutes.</li><li>Do not let hips sag.</li></ul>" }
            ],
            "type": "list"
        },
        "nutrition": {
            "title": "Refeed & Fast Breaking",
            "input": "~1541 kcal (p: 158g / f: 7g / c: 209g)",
            "output": "~2850 kcal (BMR: ~1850 kcal + Activity: ~1000 kcal)",
            "deficit": "~1308",
            "events": [
                { "time": "~14:00", "action": "Post-Workout Shake", "items": [{ "name": "Skimmed Curd", "dosage": "250 g <span class='macro-stats'>(p:37.5 f:2.3 c:1.3)</span>" }] },
                { "time": "Meal 1", "action": "First Meal", "items": [
                    { "name": "Hake Fillet", "dosage": "300 g <span class='macro-stats'>(p:54.0 f:1.8 c:0.0)</span>" },
                    { "name": "White Rice", "dosage": "150 g <span class='macro-stats'>(p:10.5 f:1.0 c:120.0)</span>" },
                    { "name": "Cucumber", "dosage": "150 g <span class='macro-stats'>(p:1.0 f:0.2 c:5.4)</span>" }
                ]},
                { "time": "Meal 2", "action": "Second Meal", "items": [
                    { "name": "Hake Fillet", "dosage": "260 g <span class='macro-stats'>(p:46.8 f:1.6 c:0.0)</span>" },
                    { "name": "White Rice", "dosage": "100 g <span class='macro-stats'>(p:7.0 f:0.7 c:80.0)</span>" },
                    { "name": "Lettuce", "dosage": "100 g <span class='macro-stats'>(p:1.4 f:0.2 c:2.9)</span>" }
                ]}
            ]
        },
        "supplements": {
            "title": "Supplementation",
            "events": [
                { "time": "07:00", "action": "On Waking (Fasted)", "items": [{ "name": "Electrolytes", "dosage": "As needed" }] },
                { "time": "12:30", "action": "Pre-Workout", "items": [{ "name": "Creatine Monohydrate", "dosage": "1 scoop (5 g)" }, { "name": "Citrulline Malate", "dosage": "2 scoops (6 g)" }] },
                { "time": "13:00", "action": "Intra-Workout", "items": [{ "name": "EAA", "dosage": "3 scoops (20 g)" }] },
                { "time": "~14:00", "action": "Post-Workout (Fasted)", "items": [{ "name": "Marine Collagen", "dosage": "5 scoops (12.5 g)" }] },
                { "time": "Meal 1", "action": "With Meal 1", "items": [{ "name": "Creatine Monohydrate", "dosage": "1 scoop (5 g)" }, { "name": "Vit&Min FORTE", "dosage": "2 tabs" }, { "name": "Calcium Citrate", "dosage": "1.5 tsp (3 g)" }, { "name": "Kelp (Iodine)", "dosage": "1 tab" }, { "name": "Vitamin C", "dosage": "1 scoop (1 g)" }] },
                { "time": "Meal 2", "action": "With Meal 2", "items": [{ "name": "Magnesium Citrate", "dosage": "3 scoops (2.7 g)" }] },
                { "time": "22:30", "action": "Bedtime (Fasted)", "items": [{ "name": "KSM-66 Ashwagandha", "dosage": "4 caps" }, { "name": "OptiZinc", "dosage": "1 cap" }, { "name": "Boron", "dosage": "1 cap" }, { "name": "Vitamin B6 P-5-P", "dosage": "1 cap" }] }
            ]
        }
    },
    "sry": {
        "training": {
            "title": "Push (Chest/Shoulders/Triceps) - TUT Focus",
            "rest": 75,
            "instructions": "<ul><li>Goal: Stimulate chest, shoulders, and triceps.</li><li>Focus on Time Under Tension (TUT).</li><li>Tempo: 3-1-1-0.</li><li>Rest between sets: 60-75 seconds.</li></ul>",
            "exercises": [
                { "exercise": "Flat Dumbbell Press", "config": "4 x 8-12 @ 8-9 RPE", "focus": "<ul><li>Tempo: 3-1-1-0.</li><li>Control the descent for 3 seconds.</li><li>Feel the stretch in chest at bottom before pushing explosively.</li></ul>" },
                { "exercise": "Incline Dumbbell Press", "config": "3 x 10-12 @ 9 RPE", "focus": "<ul><li>Tempo: 3-1-1-0.</li><li>Bench angle 30-45 degrees.</li><li>Focus on upper chest. Elbows slightly tucked.</li></ul>" },
                { "exercise": "Seated Dumbbell Shoulder Press", "config": "3 x 10-12 @ 9 RPE", "focus": "<ul><li>Tempo: 3-1-1-0.</li><li>Keep back straight.</li><li>Lower dumbbells to ear level and drive up without clanking them.</li></ul>" },
                { "exercise": "Dumbbell Lateral Raises", "config": "3 x 12-15 @ 9-10 RPE", "focus": "<ul><li>Lead the movement with elbows, not wrists.</li><li>Imagine pouring two pitchers of water.</li><li>Target side delts.</li></ul>" },
                { "exercise": "Cable Tricep Pushdowns (Rope)", "config": "3 x 10-12 @ 9 RPE", "focus": "<ul><li>Keep elbows tight to body.</li><li>Spread rope at bottom to max activate triceps.</li></ul>" },
                { "exercise": "Overhead Cable Tricep Extension", "config": "3 x 12-15 @ 10 RPE", "focus": "<ul><li>Targets long head of triceps.</li><li>Full stretch and focus on full contraction.</li></ul>" },
                { "exercise": "Ab Wheel Rollout - Core Finisher", "config": "3 x 8-12 @ 9 RPE", "focus": "<ul><li>Control movement slowly forward from knees as far as possible without arching back.</li><li>Use abs to pull back.</li></ul>" }
            ],
            "type": "list"
        },
        "nutrition": {
            "title": "PSMF/Keto Nutrition",
            "input": "~1566 kcal (p: 166g / f: 89g / c: 22g)",
            "output": "~2700 kcal (BMR: ~1850 kcal + Activity: ~850 kcal)",
            "deficit": "~1133",
            "events": [
                { "time": "~14:00", "action": "Post-Workout Shake", "items": [{ "name": "Skimmed Curd", "dosage": "300 g <span class='macro-stats'>(p:45.0 f:2.7 c:1.5)</span>" }] },
                { "time": "Meal 1", "action": "First Meal", "items": [
                    { "name": "Pork Loin (trimmed)", "dosage": "450 g <span class='macro-stats'>(p:112.5 f:15.8 c:0.0)</span>" },
                    { "name": "Cabbage", "dosage": "200 g <span class='macro-stats'>(p:2.6 f:0.2 c:11.6)</span>" }
                ]},
                { "time": "Meal 2", "action": "Second Meal", "items": [
                    { "name": "Cod Liver (Officer)", "dosage": "1 can (120 g) <span class='macro-stats'>(p:5.8 f:70.8 c:4.3)</span>" },
                    { "name": "Cucumber", "dosage": "150 g <span class='macro-stats'>(p:1.0 f:0.2 c:5.4)</span>" }
                ]}
            ]
        },
        "supplements": {
            "title": "Supplementation",
            "events": [
                { "time": "07:00", "action": "On Waking (Fasted)", "items": [{ "name": "Electrolytes", "dosage": "As needed" }] },
                { "time": "12:30", "action": "Pre-Workout", "items": [{ "name": "Creatine Monohydrate", "dosage": "1 scoop (5 g)" }, { "name": "Citrulline Malate", "dosage": "2 scoops (6 g)" }] },
                { "time": "13:00", "action": "Intra-Workout", "items": [{ "name": "EAA", "dosage": "3 scoops (20 g)" }] },
                { "time": "~14:00", "action": "Post-Workout (Fasted)", "items": [{ "name": "Marine Collagen", "dosage": "5 scoops (12.5 g)" }] },
                { "time": "Meal 1", "action": "With Meal 1", "items": [{ "name": "Calcium Citrate", "dosage": "1.5 tsp (3 g)" }, { "name": "Vitamin C", "dosage": "1 scoop (1 g)" }] },
                { "time": "Meal 2", "action": "With Meal 2", "items": [{ "name": "Magnesium Citrate", "dosage": "3 scoops (2.7 g)" }] },
                { "time": "22:30", "action": "Bedtime (Fasted)", "items": [{ "name": "KSM-66 Ashwagandha", "dosage": "4 caps" }, { "name": "OptiZinc", "dosage": "1 cap" }, { "name": "Boron", "dosage": "1 cap" }, { "name": "Vitamin B6 P-5-P", "dosage": "1 cap" }] }
            ]
        }
    },
    "che": {
        "training": {
            "title": "Pull (Back/Biceps) - TUT Focus",
            "rest": 75,
            "instructions": "<ul><li>Goal: Stimulate back and biceps.</li><li>Focus on Time Under Tension (TUT).</li><li>Tempo: 3-1-1-0.</li><li>Rest between sets: 60-75 seconds.</li></ul>",
            "exercises": [
                { "exercise": "Wide Grip Lat Pulldown", "config": "4 x 10-12 @ 8-9 RPE", "focus": "<ul><li>Tempo: 3-1-1-0.</li><li>Think about pulling with elbows, not hands.</li><li>Squeeze shoulder blades hard at bottom.</li><li>Control weight all the way up.</li></ul>" },
                { "exercise": "Seated Cable Row (V-Grip)", "config": "4 x 10-12 @ 9 RPE", "focus": "<ul><li>Tempo: 3-1-1-0.</li><li>Keep chest out and back straight.</li><li>Pull handle towards lower abdomen.</li></ul>" },
                { "exercise": "One Arm Dumbbell Row", "config": "3 x 8-10 @ 9 RPE", "focus": "<ul><li>Max stretch at bottom, pull dumbbell in an arc towards hip, not straight up.</li><li>This maximizes lat activation.</li></ul>" },
                { "exercise": "Face Pulls", "config": "3 x 15-20 @ 8 RPE", "focus": "<ul><li>Critical for shoulder and upper back health.</li><li>Pull towards face, ending in a 'double bicep' pose.</li></ul>" },
                { "exercise": "Incline Dumbbell Curl", "config": "3 x 10-12 @ 9-10 RPE", "focus": "<ul><li>Bench incline 60-75 degrees.</li><li>Puts biceps under constant tension and stretch.</li><li>Elbows point to floor, curl only with biceps.</li></ul>" },
                { "exercise": "Dumbbell Hammer Curls", "config": "3 x 10-12 @ 9-10 RPE", "focus": "<ul><li>Targets brachialis/forearm, adding arm thickness.</li><li>Strict movement, no swinging.</li></ul>" },
                { "exercise": "Toes to Bar - Core Finisher", "config": "3 x To Failure @ 10 RPE", "focus": "<ul><li>If full range is hard, do Knees to Chest.</li><li>Avoid swinging.</li></ul>" }
            ],
            "type": "list"
        },
        "nutrition": {
            "title": "PSMF/Keto Nutrition",
            "input": "~1234 kcal (p: 197g / f: 39g / c: 22g)",
            "output": "~2700 kcal (BMR: ~1850 kcal + Activity: ~850 kcal)",
            "deficit": "~1465",
            "events": [
                { "time": "~14:00", "action": "Post-Workout Shake", "items": [{ "name": "Skimmed Curd", "dosage": "300 g <span class='macro-stats'>(p:45.0 f:2.7 c:1.5)</span>" }] },
                { "time": "Meal 1", "action": "First Meal", "items": [
                    { "name": "Chicken Breast Fillet", "dosage": "500 g <span class='macro-stats'>(p:115.0 f:6.0 c:0.0)</span>" },
                    { "name": "Broccoli", "dosage": "250 g <span class='macro-stats'>(p:7.0 f:0.9 c:15.0)</span>" },
                    { "name": "Olive Oil", "dosage": "2 tsp (8 ml) <span class='macro-stats'>(p:0.0 f:8.0 c:0.0)</span>" }
                ]},
                { "time": "Meal 2", "action": "Second Meal", "items": [
                    { "name": "Tuna in brine (drained)", "dosage": "112 g <span class='macro-stats'>(p:28.0 f:1.1 c:0.0)</span>" },
                    { "name": "Zucchini", "dosage": "200 g <span class='macro-stats'>(p:2.4 f:0.6 c:6.2)</span>" },
                    { "name": "Olive Oil", "dosage": "2 tbsp (20 ml) <span class='macro-stats'>(p:0.0 f:20.0 c:0.0)</span>" }
                ]}
            ]
        },
        "supplements": {
            "title": "Supplementation",
            "events": [
                { "time": "07:00", "action": "On Waking (Fasted)", "items": [{ "name": "Electrolytes", "dosage": "As needed" }] },
                { "time": "12:30", "action": "Pre-Workout", "items": [{ "name": "Creatine Monohydrate", "dosage": "1 scoop (5 g)" }, { "name": "Citrulline Malate", "dosage": "2 scoops (6 g)" }] },
                { "time": "13:00", "action": "Intra-Workout", "items": [{ "name": "EAA", "dosage": "3 scoops (20 g)" }] },
                { "time": "~14:00", "action": "Post-Workout (Fasted)", "items": [{ "name": "Marine Collagen", "dosage": "5 scoops (12.5 g)" }] },
                { "time": "Meal 1", "action": "With Meal 1", "items": [{ "name": "Omega 3 Ultra", "dosage": "4 caps" }, { "name": "Vitamin D3 4000 + K2", "dosage": "1 tab" }, { "name": "Vit&Min FORTE", "dosage": "2 tabs" }, { "name": "Calcium Citrate", "dosage": "1.5 tsp (3 g)" }, { "name": "Kelp (Iodine)", "dosage": "1 tab" }, { "name": "Vitamin C", "dosage": "1 scoop (1 g)" }] },
                { "time": "Meal 2", "action": "With Meal 2", "items": [{ "name": "Magnesium Citrate", "dosage": "3 scoops (2.7 g)" }] },
                { "time": "22:30", "action": "Bedtime (Fasted)", "items": [{ "name": "KSM-66 Ashwagandha", "dosage": "4 caps" }, { "name": "OptiZinc", "dosage": "1 cap" }, { "name": "Boron", "dosage": "1 cap" }, { "name": "Vitamin B6 P-5-P", "dosage": "1 cap" }] }
            ]
        }
    },
    "pet": {
        "training": {
            "title": "Light to Moderate Swimming",
            "rest": 0,
            "instructions": "<ul><li>Goal: Active recovery, improve cardiovascular system, fat burning with low joint stress.</li><li>Low to moderate intensity, steady state (LISS).</li><li>Focus on breathing technique and smooth movement.</li></ul>",
            "exercises": [],
            "type": "descriptive",
            "content": [{ "exercise": "Light to Moderate Swimming", "duration": "30-45 minutes", "details": "" }]
        },
        "nutrition": {
            "title": "PSMF/Keto Nutrition",
            "input": "~1119 kcal (p: 162g / f: 44g / c: 17g)",
            "output": "~2550 kcal (BMR: ~1850 kcal + Activity: ~700 kcal)",
            "deficit": "~1430",
            "events": [
                { "time": "~14:00", "action": "Post-Workout Shake", "items": [{ "name": "Skimmed Curd", "dosage": "350 g <span class='macro-stats'>(p:52.5 f:3.2 c:1.8)</span>" }] },
                { "time": "Meal 1", "action": "First Meal", "items": [
                    { "name": "Mackerel (whole)", "dosage": "~400 g <span class='macro-stats'>(p:52.0 f:39.0 c:0.0)</span>" },
                    { "name": "Lettuce/Iceberg", "dosage": "200 g <span class='macro-stats'>(p:2.8 f:0.4 c:5.8)</span>" }
                ]},
                { "time": "Meal 2", "action": "Second Meal", "items": [
                    { "name": "Tuna in brine (drained)", "dosage": "112 g <span class='macro-stats'>(p:28.0 f:1.1 c:0.0)</span>" },
                    { "name": "Billa Skyr", "dosage": "250 g <span class='macro-stats'>(p:27.5 f:0.5 c:10.0)</span>" }
                ]}
            ]
        },
        "supplements": {
            "title": "Supplementation",
            "events": [
                { "time": "07:00", "action": "On Waking (Fasted)", "items": [{ "name": "Electrolytes", "dosage": "As needed" }] },
                { "time": "13:00", "action": "Intra-Workout", "items": [{ "name": "EAA", "dosage": "3 scoops (20 g)" }] },
                { "time": "~14:00", "action": "Post-Workout (Fasted)", "items": [{ "name": "Marine Collagen", "dosage": "5 scoops (12.5 g)" }] },
                { "time": "Meal 1", "action": "With Meal 1", "items": [{ "name": "Vitamin D3 4000 + K2", "dosage": "1 tab" }, { "name": "Vit&Min FORTE", "dosage": "2 tabs" }, { "name": "Calcium Citrate", "dosage": "1.5 tsp (3 g)" }, { "name": "Kelp (Iodine)", "dosage": "1 tab" }, { "name": "Vitamin C", "dosage": "1 scoop (1 g)" }] },
                { "time": "Meal 2", "action": "With Meal 2", "items": [{ "name": "Magnesium Citrate", "dosage": "3 scoops (2.7 g)" }] },
                { "time": "22:30", "action": "Bedtime (Fasted)", "items": [{ "name": "KSM-66 Ashwagandha", "dosage": "4 caps" }, { "name": "OptiZinc", "dosage": "1 cap" }, { "name": "Boron", "dosage": "1 cap" }, { "name": "Vitamin B6 P-5-P", "dosage": "1 cap" }] }
            ]
        }
    },
    "sab": {
        "training": {
            "title": "Intensive Swimming (Intervals)",
            "rest": 90,
            "instructions": "<ul><li>Goal: Max calorie burn, improve anaerobic capacity and metabolic stress.</li><li>Interval Training (HIIT).</li><li>Warm up 5-10 min, then alternate 1 length sprint (~90% effort) with 2 lengths very slow recovery swimming.</li><li>Cool down 5 min.</li></ul>",
            "exercises": [],
            "type": "descriptive",
            "content": [{ "exercise": "Intensive Swimming (Intervals)", "duration": "15-20 minutes", "details": "" }]
        },
        "nutrition": {
            "title": "PSMF/Keto Nutrition",
            "input": "~1161 kcal (p: 180g / f: 38g / c: 22g)",
            "output": "~2750 kcal (BMR: ~1850 kcal + Activity: ~900 kcal)",
            "deficit": "~1588",
            "events": [
                { "time": "~14:00", "action": "Post-Workout Shake", "items": [{ "name": "Skimmed Curd", "dosage": "250 g <span class='macro-stats'>(p:37.5 f:2.3 c:1.3)</span>" }] },
                { "time": "Meal 1", "action": "First Meal", "items": [
                    { "name": "Pork Loin (trimmed)", "dosage": "450 g <span class='macro-stats'>(p:112.5 f:15.8 c:0.0)</span>" },
                    { "name": "Cabbage", "dosage": "200 g <span class='macro-stats'>(p:2.6 f:0.2 c:11.6)</span>" },
                    { "name": "Olive Oil", "dosage": "1 tbsp (10 ml) <span class='macro-stats'>(p:0.0 f:10.0 c:0.0)</span>" }
                ]},
                { "time": "Meal 2", "action": "Second Meal", "items": [
                    { "name": "Billa Skyr", "dosage": "250 g <span class='macro-stats'>(p:27.5 f:0.5 c:10.0)</span>" },
                    { "name": "Olive Oil", "dosage": "1 tbsp (10 ml) <span class='macro-stats'>(p:0.0 f:10.0 c:0.0)</span>" }
                ]}
            ]
        },
        "supplements": {
            "title": "Supplementation",
            "events": [
                { "time": "07:00", "action": "On Waking (Fasted)", "items": [{ "name": "Electrolytes", "dosage": "As needed" }] },
                { "time": "12:30", "action": "Pre-Workout", "items": [{ "name": "Creatine Monohydrate", "dosage": "1 scoop (5 g)" }, { "name": "Citrulline Malate", "dosage": "2 scoops (6 g)" }] },
                { "time": "13:00", "action": "Intra-Workout", "items": [{ "name": "EAA", "dosage": "3 scoops (20 g)" }] },
                { "time": "~14:00", "action": "Post-Workout (Fasted)", "items": [{ "name": "Marine Collagen", "dosage": "5 scoops (12.5 g)" }] },
                { "time": "Meal 1", "action": "With Meal 1", "items": [{ "name": "Omega 3 Ultra", "dosage": "4 caps" }, { "name": "Vitamin D3 4000 + K2", "dosage": "1 tab" }, { "name": "Vit&Min FORTE", "dosage": "2 tabs" }, { "name": "Calcium Citrate", "dosage": "1.5 tsp (3 g)" }, { "name": "Kelp (Iodine)", "dosage": "1 tab" }, { "name": "Vitamin C", "dosage": "1 scoop (1 g)" }] },
                { "time": "Meal 2", "action": "With Meal 2", "items": [{ "name": "Magnesium Citrate", "dosage": "3 scoops (2.7 g)" }] },
                { "time": "22:30", "action": "Bedtime (Fasted)", "items": [{ "name": "KSM-66 Ashwagandha", "dosage": "4 caps" }, { "name": "OptiZinc", "dosage": "1 cap" }, { "name": "Boron", "dosage": "1 cap" }, { "name": "Vitamin B6 P-5-P", "dosage": "1 cap" }] }
            ]
        }
    },
    "ned": {
        "training": {
            "title": "Metabolic Workout",
            "rest": 120,
            "instructions": "<ul><li>Goal: Final glycogen depletion before fast.</li><li>Circuit training.</li><li>Perform exercises back-to-back with 15-20 sec rest.</li><li>After circuit ends, rest 90-120 sec.</li><li>Perform 3-4 total circuits.</li></ul>",
            "exercises": [
                { "exercise": "Goblet Squats - Circuit", "config": "3-4 x 12-15 @ 8 RPE", "focus": "<ul><li>Keep tempo high but form good.</li><li>Legs and core focus.</li></ul>" },
                { "exercise": "Push-ups - Circuit", "config": "3-4 x To Failure @ 10 RPE", "focus": "<ul><li>Elevate feet if too easy.</li><li>Use knees if too hard.</li></ul>" },
                { "exercise": "Bent-Over DB Rows - Circuit", "config": "3-4 x 12-15 @ 8-9 RPE", "focus": "<ul><li>Keep back straight.</li><li>Pull dumbbells to hip, squeezing shoulder blades.</li></ul>" },
                { "exercise": "Standing DB Shoulder Press - Circuit", "config": "3-4 x 10-12 @ 9 RPE", "focus": "<ul><li>Use legs for slight initial push (Push Press) to maintain intensity.</li></ul>" },
                { "exercise": "Kettlebell/DB Swings - Circuit", "config": "3-4 x 20-25 @ 9 RPE", "focus": "<ul><li>Metabolic finisher.</li><li>Movement comes from hips, not arms.</li><li>Squeeze core and glutes.</li></ul>" },
                { "exercise": "Cable Crunches - Core Finisher", "config": "3 x 12-15 @ 9-10 RPE", "focus": "<ul><li>Perform AFTER all circuits.</li><li>Use rope.</li><li>Focus on curling torso, bringing ribs to hips.</li><li>Do not pull with arms.</li></ul>" }
            ],
            "type": "list"
        },
        "nutrition": {
            "title": "PSMF/Keto Nutrition",
            "input": "~1176 kcal (p: 204g / f: 31g / c: 17g)",
            "output": "~2750 kcal (BMR: ~1850 kcal + Activity: ~900 kcal)",
            "deficit": "~1573",
            "events": [
                { "time": "~14:00", "action": "Post-Workout Shake", "items": [{ "name": "Skimmed Curd", "dosage": "300 g <span class='macro-stats'>(p:45.0 f:2.7 c:1.5)</span>" }] },
                { "time": "Meal 1", "action": "First Meal", "items": [
                    { "name": "Chicken Breast Fillet", "dosage": "500 g <span class='macro-stats'>(p:115.0 f:6.0 c:0.0)</span>" },
                    { "name": "Broccoli", "dosage": "250 g <span class='macro-stats'>(p:7.0 f:0.9 c:15.0)</span>" },
                    { "name": "Olive Oil", "dosage": "1 tbsp (10 ml) <span class='macro-stats'>(p:0.0 f:10.0 c:0.0)</span>" }
                ]},
                { "time": "Meal 2", "action": "Second Meal", "items": [
                    { "name": "Skimmed Curd", "dosage": "250 g <span class='macro-stats'>(p:37.5 f:2.3 c:1.3)</span>" },
                    { "name": "Olive Oil", "dosage": "1 tbsp (10 ml) <span class='macro-stats'>(p:0.0 f:10.0 c:0.0)</span>" }
                ]}
            ]
        },
        "supplements": {
            "title": "Supplementation",
            "events": [
                { "time": "07:00", "action": "On Waking (Fasted)", "items": [{ "name": "Electrolytes", "dosage": "As needed" }] },
                { "time": "12:30", "action": "Pre-Workout", "items": [{ "name": "Creatine Monohydrate", "dosage": "1 scoop (5 g)" }, { "name": "Citrulline Malate", "dosage": "2 scoops (6 g)" }] },
                { "time": "13:00", "action": "Intra-Workout", "items": [{ "name": "EAA", "dosage": "3 scoops (20 g)" }] },
                { "time": "~14:00", "action": "Post-Workout (Fasted)", "items": [{ "name": "Marine Collagen", "dosage": "5 scoops (12.5 g)" }] },
                { "time": "Meal 1", "action": "With Meal 1", "items": [{ "name": "Omega 3 Ultra", "dosage": "4 caps" }, { "name": "Vitamin D3 4000 + K2", "dosage": "1 tab" }, { "name": "Vit&Min FORTE", "dosage": "2 tabs" }, { "name": "Calcium Citrate", "dosage": "1.5 tsp (3 g)" }, { "name": "Kelp (Iodine)", "dosage": "1 tab" }, { "name": "Vitamin C", "dosage": "1 scoop (1 g)" }] },
                { "time": "Meal 2", "action": "With Meal 2", "items": [{ "name": "Magnesium Citrate", "dosage": "3 scoops (2.7 g)" }] },
                { "time": "22:30", "action": "Bedtime (Fasted)", "items": [{ "name": "KSM-66 Ashwagandha", "dosage": "4 caps" }, { "name": "OptiZinc", "dosage": "1 cap" }, { "name": "Boron", "dosage": "1 cap" }, { "name": "Vitamin B6 P-5-P", "dosage": "1 cap" }] }
            ]
        }
    }
};
export const DAYS_MAP = { pon: "Monday", vto: "Tuesday", sry: "Wednesday", che: "Thursday", pet: "Friday", sab: "Saturday", ned: "Sunday" };