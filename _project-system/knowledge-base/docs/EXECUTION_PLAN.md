# Execution Plan: The "Adapter" Refactor Strategy

**Goal:** Safely transition Master Plan to the V3 "Professional Athletic" Architecture without a "Big Bang" break.
**Strategy:** Decouple the Frontend Refactor from the Database Migration using an Adapter Pattern.

---

## 🛑 Phase 1: Stabilization & Verification (The Baseline)
*Objective: Prove the current V2 application works and lock its behavior with tests.*

1.  **System Mapping:** Create `V2_SYSTEM_MAP.md`.
    *   Document exact shape of `activeSession` in V2.
    *   Document exact props for `TrainingBlock`, `StandardBlock`, `CircuitBlock`.
2.  **Test Infrastructure:** Install `vitest`, `jsdom`, `@testing-library/react`.
3.  **Baseline Tests:** Write integration tests for `MasterPlanApp.jsx` (V2).
    *   Test: Renders Dashboard.
    *   Test: Starts Session.
    *   Test: Renders Logger.
4.  **Service Worker Fix:** Ensure local development is permanently safe from Zombie SWs.

---

## 🔌 Phase 2: The "Frontend V3" Refactor (The Adapter)
*Objective: Update the UI and Store to V3 terminology (`Program`, `Session`, `Item`) while still fetching from V2 Database (`routines`, `workouts`).*

**Branch:** `feat/v3-frontend-adapter`

1.  **Rename Store:** `useTrainingStore` -> `useProgramStore`.
2.  **Implement Adapter Layer:**
    *   *Fetch:* `supabase.from('workouts')`
    *   *Map:* Transform V2 data to V3 shape as defined in `V2_SYSTEM_MAP.md`.
        *   `workout_notes` -> `session_focus`
        *   `exercises` array -> `items` array
        *   `technique_notes` -> `technique_cues`
    *   *State:* Store state (`activeSession`) must strictly adhere to the V3 schema.
3.  **Refactor Components:**
    *   Rename `TrainingBlock` -> `SessionBlock`.
    *   Rename `StandardBlock` -> `LinearBlock`.
    *   Update them to consume V3 props (`block.items` instead of `block.exercises`).
4.  **Verify:** Run the Test Suite (updated for V3 component names) against the *live V2 database*.

---

## 💾 Phase 3: Database Migration (The Switch)
*Objective: Migrate the backend to V3 and remove the Adapter.*

**Branch:** `feat/v3-database-switch`

1.  **Create V3 Schema:** Run `v3_schema_creation.sql` (Non-destructive).
2.  **Seed Data:** Copy V2 data to V3.
3.  **Update Store:** Remove the Adapter mapping. Point `supabase.from('workouts')` to `supabase.from('sessions')`.
4.  **Verify:** Run the Test Suite.

---

## ✅ Phase 4: Cleanup
1.  **Decommission:** Archive/Delete V2 tables (after 48h stability).
2.  **Docs:** Update Technical Manual to reflect final state.
