# SYSTEM CONTEXT: Master Plan

**Last Updated:** January 26, 2026
**Version:** 1.7.0 (Surgical Backups)

## 1. Project Identity & Goal
**Master Plan** is a high-performance athletic platform built for rigorous training management. 
It has transitioned from a static prototype to a **Native V3 Relational Architecture**, enabling sophisticated multi-program management and granular performance tracking.

**Core Philosophy:** "Relational Integrity," "Industrial High-Density UI," and "Preservation of History."

---

## 2. Technology Stack
*   **Frontend:** React 18, Vite, Lucide React, Zustand (Store-based state).
*   **Backend:** Supabase (PostgreSQL).
*   **Environments:** 
    *   `v3`: Production environment.
    *   `v3_dev`: Sandbox environment (Perfect mirror for risk-free testing).
*   **Schema (v3/v3_dev):**
    *   `programs`: Master training plans (Columns: `id`, `name`, `user_id`, `cycle_length`, `archived_at`).
    *   `program_days`: The sequence of days within a program.
    *   `sessions`: The specific workout prescribed for a day.
    *   `blocks`: Groups of exercises (Standard or Metabolic Circuit).
    *   `block_items`: Specific exercise prescriptions (Rx: sets, reps, weight, RPE, tempo).
    *   `completed_sessions`: Historical logs of executed workouts.
    *   `performance_logs`: The granular set-by-set data linked to `completed_sessions`.
    *   `health_metrics`: User vital signs and health tracking.

---

## 3. Architecture & Data Logic

### A. The "Relational Hierarchy"
Training data is resolved through a strict hierarchical chain:
`Program -> Program Day -> Session -> Block -> Block Item (Exercise Rx)`.

### B. Multi-Program Management
The app supports multiple active and archived programs.
*   **Library Context:** The UI filters training days based on an `activeProgramId`.
*   **Safe Archiving:** Programs are never hard-deleted. An `archived_at` timestamp hides them from the active Library while keeping all historical `completed_sessions` linked and valid.

### C. Navigation & State Persistence
A unified `navState` object is passed through the root `App.jsx` to all sub-apps. This ensures that deep-links (like a specific `programId` for editing) survive page refreshes and browser navigation.

---

## 4. Key Conventions & Rules

### UI/UX ("Industrial High-Density")
*   **Aesthetic:** Dark mode, high contrast (`#f29b11` Orange, `#2ecc71` Green), monospace numbers.
*   **Density:** Compact displays (Pills, nested accordions) to maximize data visibility on small screens.
*   **Environment Awareness:** A global, absolutely-positioned "Sandbox Mode" HUD is mandatory when `getActiveSchema() === 'v3_dev'`.

### Code Standards
*   **Logic Isolation:** Components are "thin"; all database mutations and complex filtering live in `useProgramStore.js`.
*   **Schema Switching:** The app is designed to support switching between `v3` (production) and `v3_dev` (sandbox) schemas via HubApp.

---

## 5. Current State Snapshot (Jan 26, 2026)

### Recently Completed
*   **Surgical Backups:** Implementation of `npm run backup-db` for multi-schema JSON snapshots.
*   **Sandbox Environment:** Creation, exposure, and population of the `v3_dev` playground.
*   **Program Archiving:** Soft-delete "Graveyard" for template management.
*   **Relational Hardening:** Full Foreign Key restoration and permission granting for the sandbox.
*   **App-wide HUD:** Standardized "Sandbox Mode" indicators in all headers.

### Immediate Roadmap
*   **Structural Sync:** Implementation of SQL migrations to maintain schema parity.
*   **On-demand Data Mirroring:** UI-triggered "Sync Prod to Dev" functionality.
*   **Exercise Library Extension:** Expansion of Rx templates.

---

## 6. Critical File Map
*   `src/App.jsx`: Root orchestrator and navigation authority.
*   `src/supabaseClient.js`: Dynamic schema resolution engine.
*   `src/apps/master-plan/MasterPlanApp.jsx`: Feature-level router and modal manager.
*   `src/apps/master-plan/stores/useProgramStore.js`: The central "brain" for Native V3 data.
*   `src/apps/master-plan/features/builder/ProgramEditorView.jsx`: The hierarchical program authoring engine.
*   `_project-system/tooling/db/backup_db.js`: The surgical multi-schema backup engine.
*   `CHANGELOG.md`: The mandatory audit log of all system changes.