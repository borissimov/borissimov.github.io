# Master Plan PWA (V1.5)

**The Professional Athletic Programming System.**

Master Plan is a specialized, offline-first Progressive Web Application designed for high-performance athletic training. It moves beyond simple "workout tracking" to provide a structured **Regimen** system that integrates heavy lifting, metabolic conditioning, and targeted mobility work.

---

## 🏗️ Architecture: V3 (Modular & Native)

The application runs on a "Calendar-First" architecture, prioritizing the daily schedule (Master Agenda) over the static program library.

### **Core Modules**
1.  **Master Agenda (Home):** A unified timeline of past performance and future prescriptions. "Today's Objective" is front and center.
2.  **Program Library (The Plan):** A repository of structured microcycles and ad-hoc modules.
3.  **Session Engine (The Worker):** A polymorphic execution environment that adapts to Load (Weight/Reps), Duration (Timer), or Distance metrics.

### **Tech Stack**
*   **Frontend:** React 18, Vite, Tailwind CSS.
*   **State:** Zustand (v5) with Persist Middleware.
*   **Backend:** Supabase (PostgreSQL) running the custom **V3 Schema**.
*   **Design:** "Industrial OS" Aesthetic (Dark Mode, High Contrast, Tactical).

---

## 📂 Project Structure

We follow a **Feature-Based Modular Architecture**:

```text
src/apps/master-plan/
├── features/
│   ├── agenda/              # Timeline & History View
│   ├── library/             # Program Repository (was Dashboard)
│   ├── session/             # Active Training Logger
├── shared/                  # Reused Components & Hooks
├── stores/                  # Native V3 Logic
└── MasterPlanApp.jsx        # System Orchestrator
```

---

## 🚀 Getting Started

1.  **Install:** `npm install`
2.  **Run:** `npm run dev`
3.  **Build:** `npm run build`

**Local Development Safety:**
The app includes a "Zombie Service Worker" protection mechanism. `sw.js` automatically unregisters itself on `localhost` to prevent caching issues during development.

---

## 📜 Documentation

*   **[Technical Manual](./_project-system/knowledge-base/docs/TECHNICAL_MANUAL.md):** Deep dive into data models and component logic.
*   **[Execution Plan](./_project-system/knowledge-base/docs/EXECUTION_PLAN.md):** History of the V3 migration and refactor.
*   **[V3 System Map](./_project-system/knowledge-base/docs/V3_SYSTEM_MAP.md):** Database schema and store state reference.
