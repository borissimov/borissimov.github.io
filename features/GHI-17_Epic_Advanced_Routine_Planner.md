---
gh_issue_number: 17
type: "enhancement"
title: "Epic: Advanced Routine Planner"
---

# EPIC-17: Advanced Routine Planner

Implement a cycle-based routine system that moves beyond the 7-day calendar synchronous model.

## 1. Core Logic: The Virtual Day Index
The system must shift from `date.getDay()` to a dynamic calculation:
`VirtualIndex = (CurrentDate - AnchorDate - TotalShifts - TotalSkips) % RoutineLength`

## 2. Technical Components
- **Routine Definition:** JSON structure for $N$ days of programming.
- **Assignment Logic:** Link a Routine to a User with a `startDate` and `targetCycles`.
- **Gap Detection:** Identify dates between `startDate` and `today` with zero logged data.
- **Resolution Engine:** UI banner to handle gaps via three strategies:
    - **Push:** Move entire schedule forward (increments `TotalShifts`).
    - **Skip:** Mark day as missed (increments `TotalSkips`).
    - **Log:** Retroactively fill data (resolves the gap without shifting).

## 3. UI Requirements
- **Planner Tab:** Dedicated space to create and assign routines.
- **Date Scroller Signals:** Visual indicators (e.g., hollow orange border) for unresolved gaps.
- **Projection Logic:** Show future workouts based on the current calculated cycle.

## 4. Resolution Strategies (UAT Focus)
- **Push:** "I was sick, I'll do Day 3 today."
- **Skip:** "I missed Legs, moving to Chest today as planned."
- **Rest Swap:** "I'll count yesterday as one of my floating rest days."

## Status
- **Status:** Todo
- **Tier:** 2
- **Progress:** 0%
