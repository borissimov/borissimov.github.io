# V3 Renaming & Migration Checklist (COMPLETE)

**Status:** ALL TASKS COMPLETED (Jan 24, 2026).

---

## 1. Domain Terminology
*   [x] `Routine` -> **`Program`**
*   [x] `RoutineDay` -> **`ProgramDay`**
*   [x] `Workout` -> **`Session`**
*   [x] `BlockExercise` -> **`BlockItem`** (To support non-exercise items like Rest)
*   [x] `Exercise` -> **`ExerciseLibrary`**

## 2. Database Schema (`v3`)
*   [x] Create `v3` Schema.
*   [x] Create `programs` table.
*   [x] Create `program_days` table.
*   [x] Create `sessions` table (with `session_focus`).
*   [x] Create `blocks` table.
*   [x] Create `block_items` table (with `metric_type`).
*   [x] Create `completed_sessions` table.
*   [x] Create `performance_logs` table.

## 3. Frontend Codebase
*   [x] Store: `useProgramStore.js` created and active.
*   [x] Views: `MasterAgendaView`, `LibraryView`, `SessionView` created.
*   [x] State: `currentView` migrated to `'master-agenda'`.
*   [x] Files: `MasterPlanApp.jsx` modularized.

## 4. Documentation
*   [x] `TECHNICAL_MANUAL.md` updated.
*   [x] `V3_SYSTEM_MAP.md` updated.
*   [x] `README.md` updated.