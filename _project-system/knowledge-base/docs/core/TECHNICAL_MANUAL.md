# Master Plan v2.0: Technical Architecture & Reference

**Date:** January 25, 2026
**Version:** v1.6.0 (Multi-Program Relational Architecture)
**Scope:** File Structure, Application Stack, & Domain Logic

> **Status:** LIVE & STABLE.
> **Architecture:** Native V3 (Professional Athletic Model).

---

## 1. System Overview
The **Master Plan** is a specialized, offline-first **Progressive Web Application (PWA)** built for professional athletic programming. It utilizes a **Relational-First** architecture, enabling sophisticated authoring, execution, and archiving of multiple training programs.

### Core Capabilities
*   **Hierarchical Program Builder:** Full CRUD for microcycles, metabolic circuits, and standard strength blocks.
*   **Safe Archive System:** "Soft-deletion" logic that hides templates while preserving 100% of performance history.
*   **Polymorphic Session Logger:** Adapts UI based on exercise type (Load/Duration/Distance).
*   **Master Agenda:** A unified timeline dashboard of past performance and future prescriptions.

---

## 2. Project Organization (`src/apps/master-plan/`)

The application is structured into **Feature Modules** to ensure scalability and maintainability.

```text
src/apps/master-plan/
├── features/
│   ├── agenda/              <-- (Home Screen: Timeline & Stats)
│   │   ├── MasterAgendaView.jsx
│   │   └── components/      <-- (AgendaCalendar, CompletedSessionCard)
│   │
│   ├── builder/             <-- (Program Authoring Engine)
│   │   └── ProgramEditorView.jsx
│   │
│   ├── library/             <-- (Context Switcher & Program Repo)
│   │   ├── LibraryView.jsx
│   │   └── components/      <-- (ProgramDayCard)
│   │
│   ├── session/             <-- (The Active Logger Focus Engine)
│   │   ├── SessionView.jsx
│   │   └── components/      <-- (SessionBlock, SessionLogger)
│
├── shared/                  <-- (Reused Core Logic)
├── stores/
│   └── useProgramStore.js   <-- (The Brain: Multi-Program V3 Logic)
└── MasterPlanApp.jsx        <-- (System Orchestrator & Router)
```

---

## 3. Frontend Architecture

### **Store State (`useProgramStore`)**
The store manages multiple programs and handles "Deep Hydration" for editing.

```javascript
{
  programs: [], // List of non-archived programs
  activeProgramId: "uuid", // Current UI context
  showArchivedPrograms: boolean, // Graveyard visibility
  
  activeSession: {
    id: "uuid",
    program_day_id: "uuid",
    logs: { [itemId]: [] }, // Active performance data
    blocks: [] // Hydrated Rx data
  }
}
```

### **Navigation & Context (`navState`)**
The root `App.jsx` persists a `navState` object. This allows the system to remember specific context across refreshes (e.g., "Editing Program X" or "Retroactive Log for Date Y").

---

## 4. Backend Architecture (Supabase V3)

The system runs on the **Native V3 Schema**, designed for relational integrity.

### **Schema Map**
| Entity | V3 Table | Primary Relation |
| :--- | :--- | :--- |
| **Program** | `v3.programs` | `user_id`, `archived_at` |
| **Day Slot** | `v3.program_days` | `program_id` |
| **Session** | `v3.sessions` | `program_day_id` |
| **Block** | `v3.blocks` | `session_id` |
| **Item (Rx)** | `v3.block_items` | `session_block_id` |
| **Library** | `v3.exercise_library`| Reference |
| **Session (Log)**| `v3.completed_sessions`| `program_day_id` |
| **Log Entry** | `v3.performance_logs` | `completed_session_id` |

### **Key Architectural Patterns**
1.  **Deep Hydration:** To edit a program, the Store performs a multi-level join fetch to reconstruct the nested Builder state from the relational tables.
2.  **Upsert Saves:** Program saves use the `upsert` pattern to update existing records while preserving historical Foreign Key stability.
3.  **The "Archive" Layer:** Destruction of program templates is forbidden. Archiving adds a timestamp to `archived_at`, filtering the record from the "Active" UI without orphaning historical data.