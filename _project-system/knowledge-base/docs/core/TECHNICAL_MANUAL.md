# Master Plan v2.0: Technical Architecture & Reference

**Date:** January 24, 2026
**Version:** v1.5.0 (Modular Feature Architecture)
**Scope:** File Structure, Application Stack, & Domain Logic

> **Status:** LIVE & STABLE.
> **Architecture:** Native V3 (Professional Athletic Model).

---

## 1. System Overview
The **Master Plan** is a specialized, offline-first **Progressive Web Application (PWA)** built for professional athletic programming. It utilizes a **Calendar-First** architecture, prioritizing the daily schedule (Master Agenda) over the program library.

### Core Capabilities
*   **Polymorphic Session Logger:** Adapts UI (Inputs vs. Timer) based on exercise type (Load/Duration/Distance).
*   **Master Agenda:** A unified timeline of past performance and future prescriptions.
*   **Program Library:** A repository of structured microcycles and ad-hoc modules.
*   **Focus Engine:** An intelligent state machine for set-by-set guidance.

---

## 2. Project Organization (`src/apps/master-plan/`)

The application is structured into **Feature Modules** to ensure scalability and maintainability.

```text
src/apps/master-plan/
├── features/
│   ├── agenda/              <-- (Home Screen: Timeline)
│   │   ├── MasterAgendaView.jsx
│   │   └── components/      <-- (AgendaCalendar, ActivityLogCard, AgendaStats)
│   │
│   ├── library/             <-- (The Program Repository)
│   │   ├── LibraryView.jsx
│   │   └── components/      <-- (ProgramDayCard)
│   │
│   ├── session/             <-- (The Active Logger)
│   │   ├── SessionView.jsx
│   │   └── components/      <-- (SessionBlock, SessionLogger, MetricInput)
│
├── shared/                  <-- (Reused Core Logic)
│   ├── components/          <-- (SessionModals)
│   ├── hooks/               <-- (useDraggableScroll, useSessionTimer)
│   └── utils/               <-- (formatting.jsx)
│
├── stores/
│   └── useProgramStore.js   <-- (The Brain: Native V3 Logic)
│
└── MasterPlanApp.jsx        <-- (System Orchestrator & Router)
```

---

## 3. Frontend Architecture

### **Core Stack**
*   **Framework:** React 18 + Vite.
*   **State Management:** `zustand` (v5.0) with `persist` middleware.
*   **Styling:** CSS Variables (`shared-premium.css`) + Tailwind CSS (Utility classes).

### **Navigation Flow (Calendar-First)**
1.  **Entry:** App opens to **Master Agenda**.
2.  **Action:** User sees "Today's Objective" or browses history.
3.  **Library:** User clicks "Dumbbell Icon" to access the full **Program Library** for ad-hoc selection.
4.  **Execution:** Selecting a day launches the **Session Engine**.

---

## 4. Backend Architecture (Supabase V3)

The system runs on the **Native V3 Schema**, designed for professional athletic data.

### **Key Tables (`v3` Schema)**
*   **`programs`**: Top-level macrocycles.
*   **`program_days`**: The slots in a microcycle (e.g., "Day 1", "Push Day").
*   **`sessions`**: The actual workout content linked to a day.
*   **`blocks` / `block_items`**: The structural units of a workout.
*   **`completed_sessions`**: The header record for a finished workout.
*   **`performance_logs`**: The granular data points (sets, reps, time).

---

## 5. UI/UX Design System ("Industrial OS")

The interface is designed for the **Galaxy A41** (360x800 viewport) with a "Tactical/Medical" aesthetic.

*   **Accordion Logic:** Only **one block** is expanded at a time.
*   **Visual Feedback:**
    *   **Orange (`#f29b11`):** Active Task / In Progress.
    *   **Green (`#2ecc71`):** Completed Task / Success.
*   **Polymorphic Input:**
    *   **LOAD_REP:** Weight x Reps inputs.
    *   **DURATION:** Interactive Stopwatch.
    *   **DISTANCE:** Distance x Time inputs.

---

## 6. Domain Logic: The "Regimen Flow"

### Overview
**Regimen Flow** is the high-performance training logger designed for "Focus-First" gym use. It utilizes an intelligent state machine to guide the user through their workout with zero distraction.

### The "Following Shadow" Engine
The app acts as an intelligent assistant that recommends the next step while respecting user freedom.
- **Intelligent Seeking:** When a set is finished, the app doesn't just move to the next index; it scans for the **next incomplete task** in the whole session.
- **Accordion Handoff:** Only **one block** is expanded at a time. Tapping a new block automatically collapses the previous one.
- **Breathing Signal:** If the user moves away from the recommended task, that task starts **Breathing Orange** to call for attention.

### Visual Language (The State Machine)

The UI transitions between states to provide immediate feedback:

1.  **Upcoming:** Gray Badge, Low Opacity.
2.  **Focused:** Orange Badge, Breathing Orange Background, Expanded Workspace.
3.  **Complete:** Green Badge, Green Border, Auto-Collapsed.

### Dashboard Features
1.  **Fixed Global Progress Bar:** Real-time calculation of `Logged Sets / Total Sets` for the entire session.
2.  **Block-Level Progress:** Set-granular progress bar at the bottom of each block header.
3.  **Progressive Badge Logic:** Exercise badges start at `0/X` and turn Green as soon as the first set is logged.
