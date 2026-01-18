---
gh_issue_number: 22
type: "feature"
title: "Task: Update Training Regimen (Jan 18-24)"
---

# TASK-22: Update Training Regimen (Jan 18-24)

Apply AI-optimized recommendations for the current week to the system defaults, ensuring historical integrity via Layer 1 hydration.

## Status
- **Status:** UAT
- **Tier:** 3
- **Progress:** 100%

## Implementation Details
- **Data Architecture (Layer 1 Hydration):**
    - Defined `PLAN_JAN_18` constant containing the specific AI-optimized plan for Jan 18-24.
    - Implemented `v5` migration logic in `initApp` to hydrate `masterLogs[date].plan_overrides` (Layer 1) with this specific plan for the target week.
    - This ensures that these specific weights and hints are "baked in" to history for these dates, even if `DEFAULT_PLAN` changes in the future.
- **UI Enhancements:**
    - Updated `renderTraining` to explicitly render the `hint` field (orange text) below the target grid, ensuring AI commentary is visible.
- **Progression Applied:**
    - **TUE (Legs):** +2kg on Squats and RDL.
    - **THU (Pull):** +5kg on Cable Rows, +2.5kg on DB Rows.
- **Nutrition/Timing Fixes:**
    - **TUE:** Post-Workout moved to 14:00 (Refeed).
    - **WED/THU:** Swapped Dinner (Meal 2) to move Cod Liver to Thursday as requested.

## Verification
- [x] **Hints Display:** Verified `ex.hint` renders correctly in the UI.
- [x] **History Lock:** Migration `regimen_migration_task_22_v5` successfully populates `plan_overrides`.
- [x] **Data Accuracy:** All weights and hints match `upcoming_regimen_plan.json`.
- [x] **Build:** `npm run build` passes.

## Next Steps
- [ ] User visual sign-off.
- [ ] Merge `task-22-correction` to `source`.