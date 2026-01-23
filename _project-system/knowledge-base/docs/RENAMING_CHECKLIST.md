# Master Plan: Renaming & Migration Checklist

**Goal:** Transition from "Regimen/Workout" (V2) to "Program/Session" (V3).

---

## 1. Core Domain Model (Documentation Status: ✅ Agreed)

These terms have been defined in `TECHNICAL_MANUAL.md` and `ARCHITECTURE.md`.

| Old Term (Legacy/V2) | **New Term (V3)** | Doc Status | Code Status | Database Status |
| :--- | :--- | :--- | :--- | :--- |
| Routine | **Training Program** | ✅ Done | ❌ Pending | ❌ Pending (`v2.programs`) |
| Routine Day | **Program Day** | ✅ Done | ❌ Pending | ❌ Pending (`v2.program_days`) |
| Workout | **Session** | ✅ Done | ❌ Pending | ❌ Pending (`v2.sessions`) |
| Workout Block | **Session Block** | ✅ Done | ❌ Pending | ❌ Pending (`v2.blocks`) |
| Block Exercise | **Block Item** | ✅ Done | ❌ Pending | ❌ Pending (`v2.block_items`) |
| Session Log | **Completed Session** | ✅ Done | ❌ Pending | ❌ Pending (`v2.completed_sessions`) |
| Set Log | **Performance Log** | ✅ Done | ❌ Pending | ❌ Pending (`v2.performance_logs`) |
| Exercises | **Exercise Library** | ✅ Done | ❌ Pending | ❌ Pending (`v2.exercise_library`) |

---

## 2. UI Terminology (Documentation Status: ✅ Agreed)

These changes affect the user-facing labels in `MasterPlanApp.jsx` and `App.jsx`.

| Old UI Label | **New UI Label** | Doc Status | Code Status |
| :--- | :--- | :--- | :--- |
| "Ready to Train?" | **"SELECT SESSION"** | ✅ Done | ✅ Done |
| "Mission Logs" | **"Master Agenda"** | ✅ Done | ✅ Done |
| "Start Session" | **"START SESSION"** | ✅ Done | ✅ Done |
| "End Activity" | **"END SESSION"** | ✅ Done | ✅ Done |
| "Abandon Activity" | **"ABANDON SESSION"** | ✅ Done | ✅ Done |
| "Session Selector" | **"Session Selector"** | ✅ Done | ✅ Done |

> **Decision:** We use "Session Selector" because the primary user action is choosing a workout session to execute.

---

## 3. Component & File Renaming (Pending Action)

These files need to be renamed to match the domain model.

| Current File | **Proposed Name** | Status |
| :--- | :--- | :--- |
| `useTrainingStore.js` | `useProgramStore.js` | ❌ Pending |
| `TrainingBlock.jsx` | `SessionBlock.jsx` | ❌ Pending |
| `StandardBlock.jsx` | `LinearBlock.jsx` | ❌ Pending (or keep Standard?) |
| `CircuitBlock.jsx` | `CircuitBlock.jsx` | ✅ Keep (Logic is sound) |
| `SequentialSetLogger.jsx` | `SessionLogger.jsx` | ❌ Pending |
| `ExerciseRow.jsx` | `BlockItemRow.jsx` | ❌ Pending |

---

## 4. Unresolved / Open Questions

1.  **Block Types:** We have `Standard` and `Circuit`. Should we rename `Standard` to `Linear`?
2.  **Health Tracker:** Should its store (`useHealthStore`) be merged into `useProgramStore` or kept separate? (Recommendation: Keep separate).
3.  **Routine vs Program in Code:** Variable names like `availableRoutineDays` in `useTrainingStore.js` need to become `programDays`. This is a massive refactor.

---

## 5. Next Steps (Execution Order)

1.  [ ] **Confirm** "Program Selector" vs "Session Selector".
2.  [ ] **Run Database Migration** (`v3_schema_rename.sql`).
3.  [ ] **Rename Components** (`TrainingBlock` -> `SessionBlock`).
4.  [ ] **Refactor Store** (Rename variables and table references).
