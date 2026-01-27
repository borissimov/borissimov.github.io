# GHI-54: Session Logger - Reverse Set Display Order

**Status:** In Progress
**Tier:** 3
**Work Type:** UI/UX

## Problem
In the active session logger, completed sets are currently appended to the bottom of the list. This forces the user to scroll down to see their most recent performance if the list is long. A reverse chronological order (newest on top) is more ergonomic for "Focus-First" training.

## Requirements
1.  **Reverse Order:** The most recently logged set must appear at the top of the completed sets list.
2.  **Visual Continuity:** The set numbers (e.g., 1, 2, 3) must still correctly identify which set is which, even though the visual order is reversed.
3.  **Global Consistency:** Apply this change to the `SessionLogger` component.

## Technical Implementation
- Modify `src/apps/master-plan/features/session/components/SessionLogger.jsx`.
- Use `[...logs].reverse().map(...)` or `flex-direction: column-reverse` to display sets.
- Ensure the index/set-number calculation remains accurate.

## Verification Plan
- [ ] Build successfully with `npm run build`.
- [ ] Manual verification: Log 3 sets for an exercise, verify Set 3 is at the top and Set 1 is at the bottom.
