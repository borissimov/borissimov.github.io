# Master Plan v2.0: Technical Architecture

**Date:** January 23, 2026
**Version:** v1.3.0
**Scope:** Training Engine & Data Infrastructure

---

## 1. System Overview
The **Master Plan** is a specialized, offline-first **Progressive Web Application (PWA)** designed for high-performance workout tracking. It replaces traditional spreadsheet logging with an intelligent "Focus-First" interface optimized for mobile devices.

### Key Capabilities
*   **Focus Engine:** An intelligent state machine that guides the user through workouts set-by-set.
*   **Unified History:** A chronological timeline of all completed sessions.
*   **Offline Persistence:** Instant local saving with background cloud synchronization.

---

## 2. Project Organization (`_project-system/`)
The codebase is separated into application logic (`src/`) and system management (`_project-system/`):

*   **`archives/`**: Legacy logic (Python scripts) and raw JSON logs.
*   **`knowledge-base/`**: Documentation and design specifications.
    *   **`docs/FUTURE/`**: Archives for planned features (Nutrition, Supplements) not yet active in the runtime.
*   **`system-config/`**: Authentication keys and data templates.
*   **`tooling/`**: Node.js scripts for database migrations, seeding, and verification.

---

## 3. Frontend Architecture

### **Core Stack**
*   **Framework:** React 18 + Vite.
*   **State Management:** `zustand` (v5.0) with `persist` middleware.
*   **Styling:** CSS Variables (`shared-premium.css`) + Tailwind CSS (Utility classes).
*   **Routing:** Internal state-based routing (`currentView` state) to maintain PWA context.

### **The Training Store (`useTrainingStore.js`)**
This is the application's "Brain". It manages two distinct lifecycles:

#### **A. The Session Lifecycle (Active State)**
When a workout starts, `activeSession` is created in LocalStorage:
1.  **Blueprint:** Fetches `v2.block_exercises` to build a read-only template.
2.  **Execution:** User logs sets into `activeSession.logs`.
3.  **State Machine:** The `systemStep` cursor calculates the next logical exercise based on completion status.

#### **B. The History Lifecycle (Passive State)**
*   **Fetch:** `fetchGlobalHistory` pulls `session_logs` joined with `set_logs` from Supabase.
*   **Render:** Data is displayed in the "Global History" timeline or the "Vault" performance view.

---

## 4. Backend Architecture (Supabase V2)

The system runs on a custom **Relational Delta Schema** (`v2`) isolated from legacy data.

### **Schema Hierarchy**
1.  **`routine_days`**: Defines the cycle (e.g., "Push", "Pull", "Legs").
2.  **`workouts`**: Containers for specific sessions.
3.  **`workout_blocks`**: Organizes exercises into "Main Phase", "Circuit", etc.
4.  **`block_exercises`**: Links exercises to blocks with specific targets (Sets/Reps/RPE).

### **Data Flow**
*   **Read (Load):** The app fetches the entire `v2` definition tree on startup to enable offline usage.
*   **Write (Sync):** When a user finishes a workout, the app pushes individual rows to `v2.session_logs` and `v2.set_logs`.

---

## 5. UI/UX Design System ("Industrial OS")

The interface is designed for the **Galaxy A41** (360x800 viewport).

*   **Accordion Logic:** Only **one block** is expanded at a time to minimize scrolling.
*   **Visual Feedback:**
    *   **Orange (`#f29b11`):** Active Task / Recommended Action.
    *   **Green (`#2ecc71`):** Completed Task / Success State.
    *   **Dark Gray (`#1a1a1a`):** Inactive / Future Tasks.
*   **Draggable HUD:** The "Add" button and stats overlay can be dragged to avoid blocking content.
