# Master Plan v2.0: Technical Architecture & Reference

**Date:** January 27, 2026
**Version:** v1.8.0 (Recovery & Responsive Architecture)
**Scope:** File Structure, Application Stack, & Domain Logic

---

## 1. System Overview
The **Master Plan** is a specialized, offline-first **Progressive Web Application (PWA)** built for professional athletic programming. It utilizes a **Modular Domain-Driven** architecture, enabling indestructible performance history, specialized recovery tracking, and a responsive hub-based UI.

### Core Capabilities
*   **Tactical Recovery Engine:** Specialized Sleep Protocol tracking with dedicated low-light UI and database persistence.
*   **Hub-Optimized UI:** Responsive viewport constraints that center the application on desktop while maintaining edge-to-edge mobile performance.
*   **Immutable History Engine:** Uses text-based snapshotting to ensure workout logs survive even if program templates are deleted.

---

## 2. Project Organization (`src/apps/master-plan/`)

The application is structured into **Feature Orchestrators** and **Store Slices**.

```text
src/apps/master-plan/
├── features/
│   ├── agenda/              <-- (Timeline, Stats, & Sleep Protocol)
│   │   ├── MasterAgendaView.jsx
│   │   └── components/      <-- (Calendar, SleepModeView, SessionCard)
│   │
│   ├── builder/             <-- (Full-Width Authoring Engine)
│   │   ├── ProgramEditorView.jsx
│   │   └── components/      <-- (EditorHeader, EditorDay, EditorBlock)
...
 ├── stores/
│   ├── slices/              <-- (Domain Logic Modules)
│   │   ├── programSlice.js
│   │   ├── sessionSlice.js
│   │   ├── historySlice.js
│   │   ├── sleepSlice.js    <-- (New Recovery Module)
│   │   └── uiSlice.js
│   └── useProgramStore.js
```

---

## 3. Frontend Architecture

### **Domain Slices (`Zustand`)**
The store is broken into specialized modules to prevent "God Object" fragility.
*   **`sleepSlice`**: Manages `activeSleepSession` and recovery history persistence.
*   **`programSlice`**: Handles Surgical Upserts for programs.
*   **`sessionSlice`**: Manages the "Following Shadow" focus engine and timer.

### **Responsive Viewport Logic**
The application implements a `.viewport-constrained` class in `shared-premium.css`.
- **Target:** 500px centered max-width.
- **Applied to:** Agenda, Library, Session.
- **Exception:** Program Builder (remains unconstrained for complex authoring).

---

## 4. Backend Architecture (Supabase V3)

### **Schema Map**
| Entity | V3 Table | Primary Relation | Constraint |
| :--- | :--- | :--- | :--- |
| **Program** | `programs` | `user_id` | `archived_at` Soft-Delete |
| **Sleep Log**| `sleep_logs`| `user_id` | Dedicated recovery table |
| **Log Entry** | `performance_logs`| `completed_session_id`| **ON DELETE SET NULL** |

### **Key Architectural Patterns**
1.  **Surgical Upsert:** Program saves diff incoming data against existing IDs to preserve relational history links.
2.  **The Shield:** Foreign keys to template items use `SET NULL` instead of `CASCADE`, protecting performance logs from deletion.
3.  **Ambiguity Resolution:** Constraints are uniquely named (e.g., `dev_performance_logs_block_item_fkey`) to resolve PostgREST caching ambiguity.
