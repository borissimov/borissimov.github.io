# GHI-47: Agenda Calendar Swipe to Change Month

**Status:** In Progress
**Tier:** 2
**Work Type:** UI/UX

## Problem
In the expanded calendar grid mode, users currently have to tap small navigation arrows to change the month. Swipe gestures are more intuitive on mobile devices and would improve the overall UX.

## Requirements
1.  **Swipe Gestures:** Allow users to swipe left (next month) or right (previous month) on the calendar grid.
2.  **Visual Feedback:** The calendar should update its view immediately upon a successful swipe.
3.  **Smooth Transition:** Ensure swiping feels responsive and natural.

## Technical Implementation
- Use `framer-motion`'s `onPan` or `onDragEnd` to detect horizontal swipes on the `DayPicker` container.
- Manage the current month state in `MasterAgendaView.jsx` and pass it to `AgendaCalendar`.
- Implement `onMonthChange` in `DayPicker` to keep the state in sync with arrow navigation.

## Verification Plan
- [ ] Build successfully with `npm run build`.
- [ ] Verify swiping right navigates to the previous month.
- [ ] Verify swiping left navigates to the next month.
- [ ] Verify arrow buttons still work correctly.
