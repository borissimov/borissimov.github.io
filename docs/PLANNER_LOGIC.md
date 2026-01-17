# Architectural Design: Advanced Routine Planner

This document defines the logic and data structures for the cycle-based routine system.

## 1. Logic Flow: Virtual Day Index Resolution

The core challenge is translating a calendar date into a specific day within a multi-day routine, while accounting for "Life Gaps" (shifts and skips).

```mermaid
flowchart TD
    A[Start: Request Plan for Date] --> B{Date < Routine Start Date?}
    B -- Yes --> C[Return Empty / Default]
    B -- No --> D[Calculate CalendarDelta = Date - StartDate]
    D --> E[Retrieve ActiveAssignment: Shifts, Skips]
    E --> F[Calculate ResolvedDelta = CalendarDelta - TotalShifts - TotalSkips]
    F --> G[Calculate VirtualIndex = ResolvedDelta % RoutineLength]
    G --> H{Is Date in the Past & No Log Found?}
    H -- Yes --> I[Mark as Unresolved Gap]
    H -- No --> J[Return Routine[VirtualIndex]]
    I --> K[Display Gap Resolution UI]
```

## 2. Data Schema

### Routine Definition (Template)
Stored in `localStorage['regimen_routines']` or `REGI_routines` table.
```json
{
  "id": "push-pull-legs-v1",
  "name": "PPL Cycle",
  "length": 3,
  "days": [
    { "index": 0, "name": "Push", "type": "LIFT", "training": [...] },
    { "index": 1, "name": "Pull", "type": "LIFT", "training": [...] },
    { "index": 2, "name": "Legs", "type": "LIFT", "training": [...] }
  ]
}
```

### Active Assignment
Stored in `localStorage['regimen_active_assignment']` or `REGI_assignments` table.
```json
{
  "routineId": "push-pull-legs-v1",
  "startDate": "2026-01-17",
  "targetCycles": 10,
  "history": {
    "2026-01-18": { "action": "SHIFT", "reason": "Sick" },
    "2026-01-20": { "action": "SKIP", "reason": "Work" }
  },
  "totalShifts": 1,
  "totalSkips": 1
}
```

## 3. Gap Resolution State Machine

When an "Unresolved Gap" is encountered:

| User Action | Logic Impact | Resulting UI |
| :--- | :--- | :--- |
| **Log Retroactively** | No change to Assignment. | Day becomes "Resolved". Schedule remains fixed. |
| **Push Schedule** | `totalShifts += 1`. | Today's plan moves back. Routine end-date moves forward. |
| **Skip Day** | `totalSkips += 1`. | This specific day is marked "Missed". Today's plan stays on routine target. |
