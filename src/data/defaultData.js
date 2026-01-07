export const defaultPlanData = {
    "pon": {
        "training": {
            "title": "Active Recovery",
            "rest": 0,
            "instructions": "Goal: Recovery, improved circulation, and fat burning during the 42-hour fast.\nIntensity: Low, you should be able to hold a conversation without gasping.",
            "exercises": [
                {
                    "id": "ex_pon_1",
                    "exercise": "Active Recovery",
                    "config": "N/A x 30-60 min @ N/A RPE",
                    "focus": "Walk at a light to moderate pace outdoors or on a treadmill."
                }
            ]
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
                { "id": "ev_pon_1", "time": "07:00", "action": "On Waking / As Needed", "items": [ { "id": "it_pon_1", "name": "Electrolytes", "dosage": "As needed", "active": "(Lo Salt + Non-iodized salt)" } ] },
                { "id": "ev_pon_2", "time": "22:30", "action": "Bedtime (Fasted)", "items": [ 
                    { "id": "it_pon_2a", "name": "KSM-66 Ashwagandha", "dosage": "4 caps" }, 
                    { "id": "it_pon_2b", "name": "OptiZinc", "dosage": "1 cap", "active": "(Zinc + Copper)" } 
                ] }
            ]
        }
    },
    // ... For brevity in scaffolding, I am including just Mon/Tue but in a real app I'd copy the full JSON object here.
    "vto": {
        "training": {
            "title": "Heavy Leg Workout",
            "rest": 60,
            "instructions": "Goal: Maximal muscle glycogen depletion.\nRest: 45-60s.\nRPE: 9-10.",
            "exercises": [
                { "id": "ex_vto_1", "exercise": "Goblet Squats", "config": "4 x 15-20 @ 9 RPE", "focus": "Keep dumbbell tight." },
                { "id": "ex_vto_2", "exercise": "Leg Press", "config": "4 x 15-20 @ 10 RPE", "focus": "Lower slowly." }
            ]
        },
        "nutrition": { "title": "Refeed", "input": "1500 kcal", "output": "2800 kcal", "deficit": "1300", "events": [] },
        "supplements": { "title": "Supps", "events": [] }
    }
};

export const DAYS_MAP = {
    pon: "Monday", vto: "Tuesday", sry: "Wednesday", che: "Thursday", pet: "Friday", sab: "Saturday", ned: "Sunday"
};
