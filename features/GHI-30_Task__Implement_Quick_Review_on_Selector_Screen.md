---
gh_issue_number: 30
parent_epic: 24
type: "task"
title: "Task: Implement Quick Review (Historical Context) on Selector Screen"
---

# GHI-30: Quick Review on Selector Screen

## Objective
Provide the user with immediate context about their past performance for each routine day directly on the selection screen to assist in decision-making and weight selection.

## Requirements
1. **Data Fetching:** For every day in the available routine list, fetch the metadata of the most recent completed session (date, completion percentage).
2. **Visual Feedback:** 
   - Show "Last Done: [Date]" on each routine card.
   - Display a small completion indicator (e.g., "100%" or "Skipped") for the last session of that specific day type.
3. **Optimized Loading:** Ensure historical data is fetched efficiently alongside the routine list.

## Implementation Steps
1. [ ] Update `useTrainingStore.js` to join `session_logs` metadata with `availableRoutineDays`.
2. [ ] Refactor `RegimenProApp.jsx` landing screen to render the historical summary.
3. [ ] Verify visual alignment on Galaxy A41.

## Linked Issues
- Parent Epic: [GHI-24](./GHI-24_Epic__Master_Plan_Hub_Migration.md)
