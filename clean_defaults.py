import os

path = 'public/regimen.html'
with open(path, 'r') as f:
    lines = f.readlines()

# 1. Clean DEFAULT_PLAN (Removing hardcoded weights)
# We will replace the whole DEFAULT_PLAN block with a version where kg: "-"
clean_default_plan = """    const DEFAULT_PLAN = {
        1: { // MON
            focus: "ACTIVE RECOVERY", type: "CARDIO", mobility: DEFAULT_MOBILITY,
            training: [{ name: "Walking (LISS)", target: "30-60m", hint: "Active recovery focus." }],
            supplements: [S_ELEC, S_BED],
            nutrition: [{ time: "All Day", name: "FASTING", details: "Zero Calories" }, HYDRA]
        },
        2: { // TUE
            focus: "LEGS (VOLUME)", type: "LIFT", mobility: DEFAULT_MOBILITY,
            training: [
                { name: "Machine Hip Thrusts", sets: 3, reps: "10-12", kg: "-", rpe: "9", tempo: "2-0-1-2", hint: "Focus on peak contraction." },
                { name: "Goblet Squats", sets: 4, reps: "15-20", kg: "-", rpe: "9", tempo: "3-0-1-0", hint: "Maintain upright torso." },
                { name: "Leg Extensions", sets: 3, reps: "12-15", kg: "-", rpe: "10", tempo: "2-0-1-2", hint: "Mind-muscle connection." },
                { name: "Lying Leg Curls", sets: 3, reps: "12-15", kg: "-", rpe: "10", tempo: "2-0-1-0", hint: "Control the eccentric." },
                { name: "DB RDL", sets: 3, reps: "12-15", kg: "-", rpe: "9", tempo: "3-1-1-0", hint: "Max stretch in hamstrings." },
                { name: "Calf Raises", sets: 4, reps: "20-25", kg: "DB", rpe: "10", tempo: "2-1-1-2", hint: "Full range of motion." },
                { name: "Plank", sets: 3, reps: "Failure", kg: "BW", rpe: "10", tempo: "Static", hint: "Strong core engagement." }
            ],
            supplements: [S_ELEC, S_PRE, S_INTRA, S_BED, STACK_M1, STACK_M2],
            nutrition: [
                { time: "14:00", name: "Post-Workout", details: "Collagen (12.5g), Skimmed Curd - 250g" },
                { time: "16:00", name: "Meal 1", details: "Hake - 300g (Raw), Rice - 150g (Dry), Cucumber - 150g" },
                { time: "19:30", name: "Meal 2", details: "Hake - 260g (Raw), Rice - 100g (Dry), Lettuce" }
            ]
        },
        3: { // WED
            focus: "PUSH (TUT)", type: "LIFT", mobility: DEFAULT_MOBILITY,
            training: [
                { name: "DB Flat Bench", sets: 4, reps: "8-12", kg: "-", rpe: "8-9", tempo: "3-1-1-0", hint: "Strict form, no bouncing." },
                { name: "DB Incline Bench", sets: 3, reps: "10-12", kg: "-", rpe: "9", tempo: "3-1-1-0", hint: "Focus on upper chest." },
                { name: "High Incline DB Press", sets: 3, reps: "10-12", kg: "-", rpe: "9", tempo: "3-1-1-0", hint: "Shoulder stability focus." },
                { name: "DB Lateral Raise", sets: 3, reps: "12-15", kg: "-", rpe: "9-10", tempo: "3-1-1-0", hint: "Lead with elbows." },
                { name: "Cable Rope Pushdown", sets: 3, reps: "10-12", kg: "RPE", rpe: "9", tempo: "3-1-1-0", hint: "Full extension." },
                { name: "Overhead Rope Ext", sets: 3, reps: "12-15", kg: "-", rpe: "10", tempo: "3-1-1-0", hint: "Deep triceps stretch." },
                { name: "Ab Wheel Rollout", sets: 3, reps: "8-12", kg: "BW", rpe: "9", tempo: "4-0-1-0", hint: "Protect lower back." }
            ],
            supplements: [S_ELEC, S_PRE, S_INTRA, S_BED, STACK_M1_WED, STACK_M2],
            nutrition: [
                { time: "15:00", name: "Post-Workout", details: "Collagen (12.5g), Skimmed Curd - 300g" },
                { time: "16:00", name: "Meal 1", details: "Pork Loin - 450g (Raw), Cabbage - 200g" },
                { time: "19:30", name: "Meal 2", details: "Tuna - 112g (Drained), Zucchini - 200g, Olive Oil - 25g (2 tbsp)" }
            ]
        },
        0: { // SUN
            focus: "METABOLIC", type: "LIFT", mobility: DEFAULT_MOBILITY,
            training: [
                { name: "Goblet Squats", sets: 4, reps: "12-15", kg: "-", rpe: "8", tempo: "1-0-X-0", hint: "High intensity focus." },
                { name: "Push-ups", sets: 4, reps: "Failure", kg: "BW", rpe: "10", tempo: "1-0-X-0", hint: "Strict mechanical failure." },
                { name: "DB Bent-Over Rows", sets: 4, reps: "12-15", kg: "-", rpe: "8-9", tempo: "1-0-1-0", hint: "Upper back engagement." },
                { name: "DB Push Press", sets: 4, reps: "10-12", kg: "-", rpe: "9", tempo: "X-0-X-0", hint: "Explosive movement." },
                { name: "DB/KB Swings", sets: 4, reps: "20-25", kg: "-", rpe: "9", tempo: "X-0-X-0", hint: "Powerful hip snap." },
                { name: "Finisher: Cable Crunch", sets: 3, reps: "12-15", kg: "-", rpe: "10", tempo: "2-0-1-1", hint: "Isolation of abdominals." }
            ],
            supplements: [S_ELEC, S_PRE, S_INTRA, S_BED, STACK_M1_MEAT, STACK_M2],
            nutrition: [
                { time: "15:00", name: "Post-Workout", details: "Collagen (12.5g), Skimmed Curd - 300g" },
                { time: "16:00", name: "Meal 1", details: "Chicken Breast - 500g (Raw), Broccoli - 250g, Olive Oil - 13g (1 tbsp)" },
                { time: "19:30", name: "Meal 2", details: "Skimmed Curd - 250g, Olive Oil - 13g (1 tbsp)" },
                { time: "20:00", name: "FAST START", details: "Begin 42h Fast" }
            ]
        },
        4: { // THU
            focus: "PULL (TUT)", type: "LIFT", mobility: DEFAULT_MOBILITY,
            training: [
                { name: "Wide Lat Pulldown", sets: 4, reps: "10-12", kg: "-", rpe: "8-9", tempo: "3-1-1-0", hint: "Controlled movement." },
                { name: "V-Handle Cable Row", sets: 4, reps: "10-12", kg: "-", rpe: "9", tempo: "3-1-1-0", hint: "Retract scapula fully." },
                { name: "1-Arm DB Row", sets: 3, reps: "8-10", kg: "-", rpe: "9", tempo: "3-1-1-0", hint: "Drive elbow back." },
                { name: "Face Pulls", sets: 3, reps: "15-20", kg: "-", rpe: "8", tempo: "3-1-1-0", hint: "Rear delt isolation." },
                { name: "Incline DB Curl", sets: 3, reps: "10-12", kg: "-", rpe: "9-10", tempo: "3-1-1-0", hint: "Maximum bicep stretch." },
                { name: "Hammer Curls", sets: 3, reps: "10-12", kg: "-", rpe: "9-10", tempo: "3-1-1-0", hint: "Forearm and brachialis focus." },
                { name: "Toes to Bar/Knees", sets: 3, reps: "Failure", kg: "BW", rpe: "10", tempo: "3-1-1-0", hint: "Control the swing." }
            ],
            supplements: [S_ELEC, S_PRE, S_INTRA, S_BED, STACK_M1_MEAT, STACK_M2],
            nutrition: [
                { time: "15:00", name: "Post-Workout", details: "Collagen (12.5g), Skimmed Curd - 300g" },
                { time: "16:00", name: "Meal 1", details: "Chicken Breast - 500g (Raw), Broccoli - 250g, Olive Oil - 10g (2 tsp)" },
                { time: "19:30", name: "Meal 2", details: "Cod Liver - 120g (Canned), Cucumber - 150g" }
            ]
        },
        5: { // FRI
            focus: "SWIM (LISS)", type: "CARDIO", mobility: DEFAULT_MOBILITY,
            training: [{ name: "Moderate Swim", target: "30-45m", hint: "Steady breathing." }],
            supplements: [S_ELEC, { time: "13:50", name: "Pre-Swim", details: "EAA (3 scoops / 20g)" }, S_BED, STACK_M1_FISH, STACK_M2],
            nutrition: [
                { time: "15:00", name: "Post-Swim", details: "Collagen (12.5g), Skimmed Curd - 350g" },
                { time: "16:00", name: "Meal 1", details: "Sardines - 400g, Lettuce - 200g, Olive Oil - 13g (1 tbsp)" },
                { time: "19:30", name: "Meal 2", details: "Tuna - 112g (Drained), Skyr - 250g" }
            ]
        },
        6: { // SAT
            focus: "SWIM (HIIT)", type: "CARDIO", mobility: DEFAULT_MOBILITY,
            training: [{ name: "Interval Swim", target: "15-20m", hint: "High intensity intervals." }],
            supplements: [S_ELEC, S_PRE, S_INTRA, S_BED, STACK_M1_MEAT, STACK_M2],
            nutrition: [
                { time: "15:00", name: "Post-Swim", details: "Collagen (12.5g), Skimmed Curd - 250g" },
                { time: "16:00", name: "Meal 1", details: "Pork Loin - 450g (Raw), Cabbage - 200g, Olive Oil - 13g (1 tbsp)" },
                { time: "19:30", name: "Meal 2", details: "Skyr - 250g, Olive Oil - 13g (1 tbsp)" }
            ]
        }
    };
"

# Find markers for DEFAULT_PLAN
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if 'const DEFAULT_PLAN = {' in line:
        start_idx = i
    if start_idx != -1 and i > start_idx and '    };' in line:
        # Check if the next line after '    };' is empty or starts another block
        # In our case, after DEFAULT_PLAN we have function save() or similar
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    lines[start_idx:end_idx+1] = [clean_default_plan]

# Update migration keys to v70
final_lines = []
for line in lines:
    new_line = line.replace("regimen_migration_task_22_v65", "regimen_migration_task_22_v70")
    final_lines.append(new_line)

with open(path, 'w') as f:
    f.writelines(final_lines)

print("Default plan cleaned and migration updated.")
