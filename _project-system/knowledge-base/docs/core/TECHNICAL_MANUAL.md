# Master Plan v2.0: Technical Architecture & Reference

**Date:** January 26, 2026
**Version:** v1.7.1 (Modular Orchestrator Architecture)
**Scope:** File Structure, Application Stack, & Domain Logic

---

## 1. System Overview
The **Master Plan** is a specialized, offline-first **Progressive Web Application (PWA)** built for professional athletic programming. It utilizes a **Modular Domain-Driven** architecture, enabling indestructible performance history and sophisticated multi-program management.

### Core Capabilities
*   **Immutable History Engine:** Uses text-based snapshotting to ensure workout logs survive even if program templates are deleted.
*   **Decentralized Orchestration:** Feature views (`Agenda`, `Library`, `Session`) act as self-contained controllers, managing their own UI state.
*   **Environment Isolation:** Fully independent local storage and database schemas for Production and Sandbox.

---

## 2. Project Organization (`src/apps/master-plan/`)

The application is structured into **Feature Orchestrators** and **Store Slices**.

```text
src/apps/master-plan/
├── features/
│   ├── agenda/              <-- (Self-Contained Timeline & Stats)
│   │   ├── MasterAgendaView.jsx (Feature Orchestrator)
│   │   └── components/      <-- (Calendar, Stats, SessionCard)
│   │
│   ├── builder/             <-- (Program Authoring Engine)
│   │   ├── ProgramEditorView.jsx
│   │   └── components/      <-- (EditorHeader, EditorDay, EditorBlock)
│   │
│   ├── library/             <-- (Program Selector & Previews)
│   │   ├── LibraryView.jsx
│   │   └── components/      <-- (ProgramSwitcher, DayCard)
│   │
│   ├── session/             <-- (The Active Execution Engine)
│   │   ├── SessionView.jsx
│   │   └── components/      <-- (SessionHeader, SessionBlock, Logger)
│
├── services/
│   └── database.service.js  <-- (Centralized V3 Repository)
│
├── stores/
│   ├── slices/              <-- (Domain Logic Modules)
│   │   ├── programSlice.js
│   │   ├── sessionSlice.js
│   │   ├── historySlice.js
│   │   └── uiSlice.js
│   └── useProgramStore.js   <-- (Store Assembly & Orchestration)
```

---

## 3. Frontend Architecture

### **Domain Slices (`Zustand`)**
The store is broken into specialized modules to prevent "God Object" fragility.
*   **`programSlice`**: Handles Surgical Upserts for programs.
*   **`sessionSlice`**: Manages the "Following Shadow" focus engine and timer.
*   **`historySlice`**: Calculates workout streaks and volumes using snapshot fallback logic.

### **Navigation & Resilience**
*   **Standardized Dates:** All date comparisons use `en-CA` (YYYY-MM-DD) strings to prevent timezone shifting in UTC+2 (Sofia) contexts.
*   **Snapshot Fallback:** UI fetching logic prioritizes relational joins but seamlessly falls back to `exercise_name_snapshot` if template links are null.

---

## 4. Backend Architecture (Supabase V3)

The system runs on the **Native V3 Schema**, hardened for relational integrity.

### **Schema Map**
| Entity | V3 Table | Primary Relation | Constraint |
| :--- | :--- | :--- | :--- |
| **Program** | `programs` | `user_id` | `archived_at` Soft-Delete |
| **Day Slot** | `program_days` | `program_id` | ON DELETE CASCADE |
| **Session** | `sessions` | `program_day_id`| **UNIQUE (program_day_id)** |
| **Log Entry** | `performance_logs`| `completed_session_id`| **ON DELETE SET NULL** |

### **Key Architectural Patterns**
1.  **Surgical Upsert:** Program saves diff incoming data against existing IDs to preserve relational history links.
2.  **The Shield:** Foreign keys to template items use `SET NULL` instead of `CASCADE`, protecting performance logs from deletion.
3.  **Ambiguity Resolution:** Constraints are uniquely named (e.g., `dev_performance_logs_block_item_fkey`) to resolve PostgREST caching ambiguity.
