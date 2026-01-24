# Execution Plan: V3 Migration & Modularization (COMPLETE)

**Goal:** Successfully transitioned Master Plan to the V3 "Professional Athletic" Architecture and Modularized V1.5 Codebase.
**Status:** COMPLETED Jan 24, 2026.

---

## ✅ Phase 1: Stabilization & Verification (COMPLETE)
*Objective: Prove the current V2 application works and lock its behavior with tests.*
1.  [x] System Mapping (V2).
2.  [x] Test Infrastructure (Vitest/JSDOM).
3.  [x] Baseline Tests.
4.  [x] Service Worker Fix.

---

## ✅ Phase 2: The "Frontend V3" Refactor (The Adapter) (COMPLETE)
*Objective: Update the UI and Store while still fetching from V2 Database.*
1.  [x] Rename Store & Terminology.
2.  [x] Implement Adapter Layer.
3.  [x] Refactor Components (`SessionBlock`, `LinearBlock`, `MetricInput`).
4.  [x] Verify UI stability.

---

## ✅ Phase 3: Database Migration (The Switch) (COMPLETE)
*Objective: Migrate the backend to V3 and remove the Adapter.*
1.  [x] Create V3 Schema & Copy Data.
2.  [x] Seed Metric Types (Polymorphic data upgrade).
3.  [x] Point Store to V3 Native (Removed Adapter).
4.  [x] **User Manual Action:** Expose `v3` schema in Supabase Dashboard.
5.  [x] Final Verification.

---

## ✅ Phase 4: Cleanup (COMPLETE)
1.  [x] Decommission: Archive/Delete V2 tables (after 48h stability).
2.  [x] Docs: Update Technical Manual to reflect final state.
3.  [x] Remove migration scripts.

---

## ✅ Phase 5: Modularization & Master Agenda (V1.5) (COMPLETE)
*Objective: Break the monolith into feature-based modules and establish the "Calendar-First" architecture.*

1.  [x] **Extract Shared Core:**
    *   `src/apps/master-plan/shared/` created.
    *   Utilities (`formatting.jsx`), Hooks (`useSessionTimer`), Components (`SessionModals`).
2.  [x] **Feature: Master Agenda (Timeline):**
    *   Refactored to `features/agenda/MasterAgendaView.jsx`.
    *   Granular components: `AgendaCalendar`, `ActivityLogCard`, `AgendaStats`.
    *   Set as Default Landing Screen.
3.  [x] **Feature: Library (The Program):**
    *   Refactored to `features/library/LibraryView.jsx` (Renamed from Dashboard).
    *   Granular components: `ProgramDayCard`.
4.  [x] **Feature: Session Engine:**
    *   Refactored to `features/session/SessionView.jsx`.
    *   Components moved to `features/session/components/`.
5.  [x] **The Orchestrator:**
    *   `MasterPlanApp.jsx` simplified to <150 lines (Router Only).