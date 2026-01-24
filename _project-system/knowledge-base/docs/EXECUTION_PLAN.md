# Execution Plan: V3 Migration & Refactor (COMPLETE)

**Goal:** Successfully transitioned Master Plan to the V3 "Professional Athletic" Architecture.
**Status:** COMPLETED Jan 23, 2026.

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

## 🏗️ Phase 5: Modularization & Master Agenda (V1.5)
*Objective: Break the `MasterPlanApp.jsx` monolith into feature-based modules and formally establish the "Master Agenda" view.*

**Branch:** `refactor/v1.5-modularization`

1.  **Extract Shared Core:**
    *   Move helpers to `src/apps/master-plan/shared/utils/`.
    *   Create hooks: `useSessionTimer`, `useDraggableScroll`.
2.  **Feature: Dashboard ("Ready to Train"):**
    *   Extract Dashboard UI to `features/dashboard/DashboardView.jsx`.
3.  **Feature: Session Engine:**
    *   Extract Active Session UI to `features/session/SessionView.jsx`.
    *   Move `SessionBlock`, `SessionLogger`, `MetricInput` to `features/session/components/`.
4.  **Feature: Master Agenda (The Transition):**
    *   **Refactor:** Extract "Global History" UI to `features/agenda/MasterAgendaView.jsx`.
    *   **Rename:** Update UI terminology from "Mission Logs" / "History" -> **"Master Agenda"**.
    *   **Enhance:** Ensure the "Vault" vs "Timeline" toggle is cleanly implemented within this module.
5.  **The Orchestrator:**
    *   Clean `MasterPlanApp.jsx` to act strictly as a Router/State Connector.
