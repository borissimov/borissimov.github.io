---
gh_issue_number: 18
type: "documentation"
title: "Task: Routine Planner Logic & Flowchart Design"
---

# TASK-18: Task: Routine Planner Logic & Flowchart Design

**Related Epic:** #17

## Status
- **Status:** UAT
- **Tier:** 3
- **Progress:** 100%

## Implementation Details
- Created [docs/PLANNER_LOGIC.md](https://github.com/borissimov/borissimov.github.io/blob/task-18-routine-planner-design/docs/PLANNER_LOGIC.md) with architectural and user flowcharts.
- Defined Virtual Day Index formula: `ResolvedDelta % RoutineLength`.
- Defined JSON schemas for `Routine` and `ActiveAssignment`.
- Mapped out Gap Resolution state machine (Log/Push/Skip/Swap).

## 1. Technical Flow (Resolution Logic)
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
    H -- No --> J["Return Routine[VirtualIndex]"]
    I --> K[Display Gap Resolution UI]
```

## 2. User Choice Flow (UX)
```mermaid
flowchart TD
    Start([User opens app]) --> Detection{Gap detected in past?}
    
    Detection -- Yes --> ResolutionUI[Display Resolution Banner]
    Detection -- No --> Standard[Show today's planned session]
    
    ResolutionUI --> Choice{User's Choice}
    
    Choice -- "Log Retroactive" --> Log[Enter data for the past date]
    Log --> ResultFixed[Schedule remains unchanged]
    
    Choice -- "Push (I'm behind)" --> Shift[Move whole routine forward 1 day]
    Shift --> ResultLater[End date moves forward]
    
    Choice -- "Skip (I'll pass)" --> Skip[Mark day as missed]
    Skip --> ResultFixed
    
    Standard --> Modification{Want to change today?}
    Modification -- "Swap with Day X" --> Swap[Exchange today's plan with another day in the cycle]
    Swap --> ResultSwap[Specific days are swapped]
    
    ResultFixed --> End([App updated])
    ResultLater --> End
    ResultSwap --> End
```

## Tasks
- [x] Design technical logic flowchart.
- [x] Design user choice/UX flowchart.
- [x] Define data schema for routines and assignments.
- [x] Define resolution state machine.
- [ ] Visual Sign-off from user.