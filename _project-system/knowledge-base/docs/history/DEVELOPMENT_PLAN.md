# Master Plan: V3 Refactor & Development Roadmap

**Goal:** Implement the "Professional Athletic" domain model and the "Polymorphic Session Logger."

---

## Phase 1: Database Migration (The "V3" Schema)
**Objective:** Rename existing tables to match the new Domain Language.

1.  **Execute SQL Migration:** Run `src/data/v3_schema_rename.sql` in Supabase.
    *   `routines` -> `programs`
    *   `routine_days` -> `program_days`
    *   `workouts` -> `sessions` (Add `session_type`)
    *   `block_exercises` -> `block_items` (Add `metric_type`)
2.  **Verify Data Integrity:** Ensure existing logs are preserved and correctly linked.

---

## Phase 2: Backend Integration (Store Refactor)
**Objective:** Update `useTrainingStore.js` to speak the new language.

1.  **Update Fetch Logic:**
    *   Replace `fetchRoutineDays` with `fetchProgramManifest`.
    *   Update queries to select from `program_days`, `sessions`, `blocks`.
2.  **Update Sync Logic:**
    *   Update `finishSession` to push to `completed_sessions` and `performance_logs`.
3.  **Type Safety:** Update internal state objects (`activeSession`) to use `session_id`, `block_item_id`.

---

## Phase 3: The Polymorphic Logger (UI Evolution)
**Objective:** Upgrade `SequentialSetLogger` to handle Time and Distance.

1.  **Rename Component:** `SequentialSetLogger.jsx` -> `SessionLogger.jsx`.
2.  **Implement Metric Switch:**
    *   Create `renderLoadRepInput()` (Existing logic).
    *   Create `renderDurationInput()` (New Stopwatch logic).
    *   Create `renderDistanceInput()` (New logic).
3.  **Implement Auto-Advance:**
    *   Add `onTimerComplete` callback to the store.
    *   Trigger `toggleFocus(nextId)` automatically.

---

## Phase 4: Data Seeding (The "Athletic" Content)
**Objective:** Populate the database with a real Hybrid Program.

1.  **Seed Session Types:**
    *   Create a "Morning Mobility" session (Duration-based).
    *   Create a "Hypertrophy" session (Load-based).
2.  **Seed Metric Types:**
    *   Update `block_items` to set `metric_type = 'DURATION'` for Planks/Stretches.

---

## Phase 5: Cleanup & Verification
1.  **Legacy Purge:** Remove any code referencing `routine_days` or `workout_logs` (Legacy public schema).
2.  **Full UAT:** Run through a full cycle:
    *   Start Mobility Session -> Timer Flow -> Auto-Complete.
    *   Start Lifting Session -> Log Weights -> Manual Complete.
    *   Check Master Agenda for both.
