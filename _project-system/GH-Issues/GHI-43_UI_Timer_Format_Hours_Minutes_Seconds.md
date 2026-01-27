# GHI-43: Timer Format Refinement (HH:MM:SS)

**Status:** In Progress
**Tier:** 3
**Work Type:** UI/UX

## Problem
The active session timer (stopwatch) currently only displays minutes and seconds (MM:SS). When a session exceeds 60 minutes, it continues to increment minutes (e.g., "395:00"), making it difficult to read at a glance.

## Requirements
1.  **Format Logic:** Update the timer to use `HH:MM:SS` format once the duration exceeds 60 minutes.
2.  **Consistency:** Ensure the new format is applied to both the active session header and the activity banner displayed on other screens.
3.  **Monospace:** Maintain monospace font alignment for tabular numbers to prevent layout shifting.

## Technical Implementation
- Modify `src/apps/master-plan/shared/hooks/useSessionTimer.js` to calculate hours.
- Return `HH:MM:SS` if hours > 0, otherwise stay with `MM:SS` (or always `HH:MM:SS` if requested, but user said "once it goes over an hour").

## Verification Plan
- [ ] Build successfully with `npm run build`.
- [ ] Manual verification by mocking a start time > 1 hour ago.
