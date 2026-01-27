# GHI-51: Agenda Header Plus Button & Floating UI Cleanup

**Status:** Completed
**Tier:** 2
**Work Type:** UI/UX / Refactor

## Problem
The current UI has a redundant floating action button (FAB) for logging activities, and the header's barbell icon is inconsistent with the primary "Plan/Log" action. The surrounding metrics in the FAB are no longer desired.

## Requirements
1.  **Header Update:** Replace the `Dumbbell` (barbell) icon in the `MasterAgendaView` header with a `Plus` icon.
2.  **Action Sync:** The new header `Plus` button must trigger the same logic as the old FAB: `onLogActivity(selectedCalendarDate)`.
3.  **Context-Aware Logic:** 
    - If `selectedCalendarDate` is Today: Navigating to Library should prepare for a live session (timer).
    - If `selectedCalendarDate` is NOT Today: Navigating to Library should prepare for a retroactive log.
4.  **Cleanup:** Remove the `AgendaStats` component (the floating UI and surrounding metrics) from the `MasterAgendaView`.

## Technical Implementation
- **Icon Swap:** Replaced `Dumbbell` with `Plus` in the `MasterAgendaView` header.
- **Unified Action:** Mapped the header `Plus` button to `onLogActivity(selectedCalendarDate)`. This ensures that if a user is focused on "Today", it initiates a live session, and if they are focused on a past/future date, it initiates a retroactive log for that specific date.
- **Floating UI Deletion:** Removed the `AgendaStats` component entirely from the Agenda view to declutter the interface.

## Verification Plan
- [x] Build successfully with `npm run build`.
- [x] Verify header button correctly navigates to Library with `retroactiveDate` context.
- [x] Verify floating UI is gone.
