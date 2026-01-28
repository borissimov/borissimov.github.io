# SYSTEM CONTEXT: Master Plan

**Last Updated:** January 27, 2026
**Version:** 1.8.0 (Recovery & Responsive)

## 1. Project Identity & Goal
**Master Plan** is a high-performance athletic platform built for rigorous training management. 
It has transitioned to a **Tactical Recovery OS**, integrating indestructible performance history with a new specialized recovery engine.

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
    *   `sleep_logs`: Dedicated recovery tracking with RLS.
    *   `sessions`: Enforces `UNIQUE(program_day_id)` for surgical upserts.

---

## 3. Architecture & Data Logic

### A. The "Modular Slice" Brain
The store is decomposed into specialized domain slices:
`UI (Context) + Program (CRUD) + Session (Logger) + History (Analytics) + Sleep (Recovery)`.

### B. Decentralized Orchestration
Major UI views act as independent orchestrators, consuming specific slices directly. Views are width-constrained to 500px (Hub Viewport) on desktop, except for the Program Builder.

### C. The History Shield
History is preserved via two layers:
1.  **DB Level:** `ON DELETE SET NULL` on template links.
2.  **Logic Level:** Mandatory text snapshots of movement names in logs.

---

## 4. Key Conventions & Rules

### UI/UX ("Industrial High-Density")
*   **Aesthetic:** Dark mode, high contrast Orange/Green/Blue, Monospace numbers.
*   **Timezone Safety:** Standardized `en-CA` date comparisons for Sofia compatibility.
*   **Locked Headers:** Headers are `flex-shrink: 0` and locked to the top of `100dvh`.

### Code Standards
*   **Surgical Repositories:** All DB calls live in `src/apps/master-plan/services/database.service.js`.
*   **Conflict Prevention:** Only one active session (Workout or Sleep) is permitted at a time.

---

## 5. Current State Snapshot (Jan 27, 2026)

### Recently Completed
*   **Recovery Engine:** Full Sleep Protocol lifecycle with database persistence.
*   **Responsive Refactor:** Centered hub viewport for Agenda/Library/Session.
*   **Horizontal Builder:** Full-width multi-column grid for program authoring.
*   **Gesture Polish:** Directional sliding animations for calendar navigation.

### Immediate Roadmap
*   **Performance Analytics:** Volume tracking and overload indicators.
*   **Data Mirroring:** UI-triggered "Prod -> Dev" cloning utility.
*   **Manual Sleep Logging:** Interface for manual date entry for missing recovery logs.

---

## 6. Critical File Map
*   `src/App.jsx`: Root router.
*   `src/apps/master-plan/stores/useProgramStore.js`: Modular store orchestrator.
*   `src/apps/master-plan/services/database.service.js`: The Unified V3 Repository.
*   `src/apps/master-plan/features/`: Granular feature orchestrators.
*   `CHANGELOG.md`: Mandatory audit log.
