# Execution Plan: V3 Migration & Refactor

**Goal:** Transition the Master Plan application to the Professional Athletic Model (V1.4.1).
**Strategy:** "The Feature Tunnel" (Single long-lived feature branch).

---

## 🛑 Phase 0: Safety & Preparation
*Before touching any code or database schema.*

1.  **Backup Data:** Run a full export script (`export_january_logs.js`) to secure a local JSON snapshot of all `session_logs` and `set_logs`.
2.  **Branching:** Create `feat/v3-architecture` from `main`.

---

## 🚧 Phase 1: Database Migration (The Hard Break)
*Goal: Align the Database Schema with V3 Architecture.*
*Impact: Production App will temporarily fail until Phase 2 is complete.*

1.  **Execute Migration:** Run `src/data/v3_schema_rename.sql` on the Supabase SQL Editor.
    *   `routines` -> `programs`
    *   `routine_days` -> `program_days`
    *   `workouts` -> `sessions`
    *   `workout_blocks` -> `blocks`
    *   `block_exercises` -> `block_items`
2.  **Verify Integrity:** Check that foreign keys are preserved and data is accessible under new names.
3.  **Update Config:** Update `v2_schema_init.sql` in the repo to reflect the new structure for future deployments.

---

## 🧠 Phase 2: The Brain Transplant (Store Refactor)
*Goal: Update application logic to speak the new Domain Language.*

1.  **Rename Store:** `useTrainingStore.js` -> `useProgramStore.js`.
2.  **Refactor Queries:** Update all Supabase calls to reference new table names (`.from('sessions')`, etc.).
3.  **Refactor State:**
    *   `availableRoutineDays` -> `programDays`
    *   `activeSession.routine_day_id` -> `activeSession.program_day_id`
4.  **Verification:** Ensure the "Session Selector" (Dashboard) loads data correctly.

---

## 🦴 Phase 3: The Body (Component Evolution)
*Goal: Update UI components to match the new architecture.*

1.  **Rename Components:**
    *   `TrainingBlock.jsx` -> **`SessionBlock.jsx`**
    *   `StandardBlock.jsx` -> **`LinearBlock.jsx`**
    *   `ExerciseRow.jsx` -> **`BlockItemRow.jsx`**
    *   `SequentialSetLogger.jsx` -> **`SessionLogger.jsx`**
2.  **Update Imports:** Fix all references in `MasterPlanApp.jsx` and sub-components.
3.  **Visual Update:** Rename UI headers (e.g., "Workout Notes" -> "Session Focus").

---

## ⚡ Phase 4: The Polymorphic Upgrade
*Goal: Enable Metric-based inputs (Time/Distance).*

1.  **Update `SessionLogger.jsx`:**
    *   Add logic to check `block_item.metric_type`.
    *   Implement switch: `LOAD_REP` (Standard) vs `DURATION` (Timer).
2.  **Add Timer UI:** Implement the interactive stopwatch for Duration-based items.
3.  **Auto-Advance:** Wire up the "Flow" logic to auto-complete sets when the timer hits zero.

---

## ✅ Phase 5: Deployment
1.  **UAT:** Verify a full cycle (Start -> Log -> Finish -> History).
2.  **Merge:** `feat/v3-architecture` -> `main`.
3.  **Deploy:** `npm run deploy`.
