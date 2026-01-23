---
gh_issue_number: 26
parent_epic: 24
type: "task"
title: "Task: Exercise Tracking Flow Redesign"
---

# GHI-26: Exercise Tracking Flow Redesign

## The Redesign Story
The goal was to transform the gym tracking experience from a static list into an **Intelligent Guided Flow**. We built a "Proactive Assistant" that guides the user through complex workouts (Standard and Circuit) with zero distraction.

### Key Innovations:
1. **The Focus Engine (Following Shadow):** An intelligent cursor that knows where you should be but respects your manual navigation. If you move away from the planned order, the cursor stays on the requirement, "Breathing" to call you back.
2. **Visual Guidance (Orange-Green-Gray):** 
   - **Orange Breathing:** The System's next recommendation.
   - **Solid Orange:** Your current active workspace.
   - **Green Badge:** Proof of progress (even partial).
   - **Grayed Out:** Everything else, minimizing choice paralysis.
3. **Strict Accordion UI:** Only one block and one exercise expanded at a time. The app "snaps" shut completed tasks and "snaps" open the next one, ensuring the workspace is always clean.
4. **Unmount-Proof Memory:** Moved all logging state to a centralized Zustand store, ensuring data survives collapsing blocks or app refreshes.

## Visual Documentation
- **Logic Diagram:** [State Machine Visualization](../../docs/REGIMEN_LOGIC.md#visual-language-the-state-machine)
- **User Journey:** [Journey Map](../../docs/REGIMEN_LOGIC.md#user-journey-map)

## Technical Milestones
- **Alpha Core Logic:** `v2.0.0-alpha-flow-engine-stable`
- **Final UI Polish:** `v2.0.0-alpha-ui-polished`
- **Stable Branch:** `snapshot/v2-alpha-complete-ui-logic`

## Status
- **Status:** COMPLETED
- **UAT:** PASS (Verified on Galaxy A41)
- **Testing:** PASS (Full-width, No text-selection, Set-granular progress)

## Linked Documentation
- [REGIMEN_LOGIC.md](../../docs/REGIMEN_LOGIC.md)
