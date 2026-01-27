# GHI-50: Agenda Calendar Robust Swipe Detection

**Status:** In Progress
**Tier:** 2
**Work Type:** UI/UX

## Problem
The swipe-to-change-month gesture is difficult to trigger on mobile because the interactive elements inside the `DayPicker` (date buttons) swallow touch events or conflict with the `drag` gesture. Users must currently initiate the swipe from outside the calendar grid for it to work reliably.

## Requirements
1.  **Full Area Swipe:** Swipe gestures should work anywhere inside the calendar container, including on top of the date grid.
2.  **No Conflicts:** Tapping a date should still work (for selection), but horizontal movement should be captured by the swipe logic.
3.  **Visual Feedback:** The slide animation must remain smooth and direction-aware.

## Technical Implementation
- Switch from `drag` to `onPan` or use `dragListener={true}` with carefully handled `pointer-events`.
- Use `touchAction: 'pan-y'` to allow vertical scrolling of the page while capturing horizontal pans for the calendar.
- Wrap the `DayPicker` in a way that transparency to pointer events doesn't break date selection.
- Implement a custom `Pan` handler that ignores small movements but triggers month change on significant horizontal delta.

## Verification Plan
- [ ] Build successfully with `npm run build`.
- [ ] Verify swipe works when initiated directly on a date cell on mobile.
- [ ] Verify date selection still works on tap.
