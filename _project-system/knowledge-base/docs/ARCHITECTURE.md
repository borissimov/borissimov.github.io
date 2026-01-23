# Master Plan v2.0: Technical Architecture

**Date:** January 23, 2026
**Version:** v1.4.2 (Polymorphic Logger Model)
**Scope:** File Structure & Application Stack

> **Note:** For the detailed Domain Logic (Metric Types, Auto-Advance) and Data Rules, see the **[Technical Reference Manual](./TECHNICAL_MANUAL.md)**.

---

## 1. System Overview
The **Master Plan** is a specialized, offline-first **Progressive Web Application (PWA)**. It uses a single, unified execution engine to handle diverse athletic activities (Strength, Cardio, Mobility).

### Key Capabilities
*   **Polymorphic Session Logger:** A single component that adapts its UI (Inputs vs. Timer) based on the exercise type.
*   **Focus Engine:** An intelligent state machine that guides the user through workouts set-by-set.
*   **Unified History:** A chronological timeline of all completed sessions (Master Agenda).

---

## 2. Project Organization (`_project-system/`)
*   **`archives/`**: Legacy logic (Python scripts) and raw JSON logs.
*   **`knowledge-base/`**: Detailed documentation, design blueprints, and feature specifications.
*   **`system-config/`**: Authentication keys and data templates.
*   **`tooling/`**: Automation scripts for migrations, seeding, and deployment.

---

## 3. Frontend Architecture

### **Core Stack**
*   **Framework:** React 18 + Vite.
*   **State Management:** `zustand` (v5.0) with `persist` middleware.
*   **Styling:** CSS Variables (`shared-premium.css`) + Tailwind CSS (Utility classes).

### **The Training Store (`useTrainingStore.js`)**
This is the application's "Brain". It manages the session lifecycle.

#### **A. Active Session State**
When a workout starts, `activeSession` is created in LocalStorage. It contains the **Blueprint** (Read-Only) and the **Logs** (Write-Only).

#### **B. The Session Logger (`SessionLogger.jsx`)**
This is the unified input component. It renders different interfaces based on `metric_type`:
*   **Load/Rep Mode:** Standard numeric inputs for lifting.
*   **Duration Mode:** Interactive Stopwatch for planks/mobility.
*   **Distance Mode:** Distance/Time inputs for cardio.

### **Component Structure**
*   **`src/App.jsx`**: The System Orchestrator.
*   **`src/apps/master-plan/MasterPlanApp.jsx`**: The primary training controller.
    *   **Session Selector:** Dashboard.
    *   **Session Logger:** Active execution view.
    *   **Master Agenda:** History view.

---

## 4. Backend Architecture (Supabase V2)

The system runs on a custom **Relational Delta Schema** (`v2`).

*See `TECHNICAL_MANUAL.md` for the detailed V3 Schema definition.*

### **Data Flow**
*   **Read (Load):** The app fetches the entire `v2` definition tree on startup to enable offline usage.
*   **Write (Sync):** When a user finishes a workout, the app pushes individual rows to `v2.completed_sessions` and `v2.performance_logs`.

---

## 5. UI/UX Design System ("Industrial OS")

The interface is designed for the **Galaxy A41** (360x800 viewport).

*   **Accordion Logic:** Only **one block** is expanded at a time.
*   **Auto-Advance:** For Flow blocks, the system automatically moves to the next item when the timer completes.
*   **Visual Feedback:**
    *   **Orange (`#f29b11`):** Active Task.
    *   **Green (`#2ecc71`):** Completed Task.