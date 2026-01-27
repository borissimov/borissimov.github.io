# SYSTEM CONTEXT: Master Plan

**Last Updated:** January 26, 2026
**Version:** 1.7.1 (Modular Architecture)

## 1. Project Identity & Goal
**Master Plan** is a high-performance athletic platform built for rigorous training management. 
It has transitioned to a **Modular Domain-Driven Architecture**, enabling indestructible performance history and sophisticated multi-program management.

**Core Philosophy:** "Relational Integrity," "Industrial High-Density UI," and "Immutable History."

---

## 2. Technology Stack
*   **Frontend:** React 18, Vite, Lucide React, Zustand (Modular Slices).
*   **Backend:** Supabase (PostgreSQL).
*   **Environments:** 
    *   `v3`: Production.
    *   `v3_dev`: Sandbox (Hardened mirror).
*   **Schema (Hardened):**
    *   `performance_logs`: Includes `exercise_name_snapshot` for immutable history.
    *   `sessions`: Enforces `UNIQUE(program_day_id)` for surgical upserts.

---

## 3. Architecture & Data Logic

### A. The "Modular Slice" Brain
The store is decomposed into specialized domain slices:
`UI (Context) + Program (CRUD) + Session (Logger) + History (Analytics)`.

### B. Decentralized Orchestration
Major UI views act as independent orchestrators, consuming specific slices directly to reduce root component complexity.

### C. The History Shield
History is preserved via two layers:
1.  **DB Level:** `ON DELETE SET NULL` on template links.
2.  **Logic Level:** Mandatory text snapshots of movement names in logs.

---

## 4. Key Conventions & Rules

### UI/UX ("Industrial High-Density")
*   **Aesthetic:** Dark mode, high contrast Orange/Green, Monospace numbers.
*   **Timezone Safety:** Standardized `en-CA` date comparisons for Sofia compatibility.

### Code Standards
*   **Surgical Repositories:** All DB calls live in `src/apps/master-plan/services/database.service.js`.
*   **Explicit Joins:** Relationship hints are mandatory for PostgREST clarity.

---

## 5. Current State Snapshot (Jan 26, 2026)

### Recently Completed
*   **Modular Store Refactor:** Transitioned to domain slices and service layer.
*   **Immutable History:** Snapshots implemented across both schemas.
*   **Security Audit:** Rotated all credentials and hardened `.env`.
*   **Mobile Fix:** Responsive wrapping for builder inputs.

### Immediate Roadmap
*   **Structural Sync:** Implementation of automated schema migration scripts.
*   **Data Mirroring:** UI-triggered "Prod -> Dev" cloning utility.
*   **Performance Analytics:** Real-time volume tracking.

---

## 6. Critical File Map
*   `src/App.jsx`: Root router.
*   `src/apps/master-plan/stores/useProgramStore.js`: Modular store orchestrator.
*   `src/apps/master-plan/services/database.service.js`: The Unified V3 Repository.
*   `src/apps/master-plan/features/`: Granular feature orchestrators.
*   `CHANGELOG.md`: Mandatory audit log.
