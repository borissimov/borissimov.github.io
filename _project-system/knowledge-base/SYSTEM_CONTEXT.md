# SYSTEM CONTEXT: Master Plan & Regimen Pro

**Last Updated:** January 25, 2026
**Version:** 1.3.0 (React App) / Legacy Prototype (HTML)

## 1. Project Identity & Goal
This repository hosts two distinct but related applications aimed at rigorous fitness tracking and schedule management:
1.  **Master Plan (v1.3.0):** A modern, industrial-styled React PWA serving as the primary dashboard and future platform.
2.  **Regimen Pro (Legacy):** A standalone, single-file HTML/JS prototype (`public/regimen.html`) used for rapid feature testing and offline-first usage.

**Core Philosophy:** "Offline-First," "Industrial High-Density UI," and "System Image Synchronization."

---

## 2. Technology Stack
*   **Frontend (Main):** React 18, Vite, Lucide React, Framer Motion.
*   **Frontend (Legacy):** Vanilla HTML5/CSS3/ES6 (Single File).
*   **Backend:** Supabase (Auth & Database).
    *   **Table:** `REGI_daily_logs` (Composite Key: `user_id` + `date`).
    *   **Data Type:** JSONB blobs for flexibility.
*   **State Management:**
    *   React: `zustand` (stores: `useTrainingStore`, `useProgramStore`).
    *   Legacy: Global window objects (`masterLogs`, `dailyLog`) persisted to `localStorage`.

---

## 3. Architecture & Data Logic

### A. The "Three Layers of Truth"
Used to resolve what should be displayed for any given date:
1.  **Layer 1 (Daily Exception):** Specific overrides for a calendar date (e.g., "Sick day"). Highest priority.
2.  **Layer 2 (User Template):** Recurring weekly schedule (e.g., "Custom Leg Day on Tuesdays").
3.  **Layer 3 (System Default):** Hardcoded factory settings (`DEFAULT_PLAN`). Lowest priority.

### B. Synchronization Strategy ("System Image")
We do not sync individual changes. We sync the **entire state** for a day.
*   **Push (Sync):** Bundles the daily log *plus* the current User Template into the JSON payload.
*   **Pull (Fetch):** Overwrites local daily logs with cloud data and restores the User Template from the most recent entry.
*   **UUIDs:** Strict UUID v4 enforcement for User IDs to ensure database compatibility.

---

## 4. Key Conventions & Rules

### UI/UX
*   **Style:** "Industrial High-Density." Dark mode, monospace numbers, high contrast (`#f29b11` Orange, `#2ecc71` Green).
*   **Navigation:** Context-aware. The "Back" button in a session should return to where the user started (Agenda or Library).
*   **Feedback:** Explicit confirmation for saves (e.g., "Save Today Only" vs. "Save All").

### Code Standards
*   **Legacy (`regimen.html`):**
    *   All interactive functions must be explicitly attached to `window` (e.g., `window.toggleSession = ...`).
    *   No external build steps. Must run by double-clicking.
*   **React (`src/`):**
    *   **Isolation:** `RegimenProApp.jsx` handles the workout engine. `MasterPlanApp.jsx` handles the shell/dashboard.
    *   **Stores:** Logic lives in `zustand` stores, not components.

### Maintenance
*   **Weekly Updates:** Use `scripts/apply_weekly_plan.py` to surgically update the System Default plan (Layer 3). Do not edit the large JSON block manually.

---

## 5. Current State Snapshot (Jan 25, 2026)

### Recently Completed
*   **Active Session Visibility:** The Master Agenda now shows a banner if a workout is in progress.
*   **Navigation Fixes:** Barbell icon now correctly routes to the Library. Back button persistence implemented.
*   **Cleanup:** Removed unused dependencies (`date-fns`, `pg`, etc.).

### Immediate Roadmap
*   **FEATURE-007 (Planned):** Transition to "Dashboard-First" architecture, making the React app the primary entry point.
*   **Optimization:** Implement data redundancy checks (FEATURE-002) to stop saving default plans as overrides.

---

## 6. Critical File Map
*   `index.html`: The Portal entry point (handles auth & auto-redirect).
*   `public/regimen.html`: The legacy standalone app (fully functional).
*   `src/apps/master-plan/MasterPlanApp.jsx`: Main React Shell.
*   `src/apps/master-plan/features/agenda/MasterAgendaView.jsx`: The timeline/dashboard view.
*   `src/apps/regimen-pro/stores/useTrainingStore.js`: The brain of the workout engine.
*   `_project-system/knowledge-base/docs/history/handoffs/`: Archive of detailed session logs and context handoffs.
