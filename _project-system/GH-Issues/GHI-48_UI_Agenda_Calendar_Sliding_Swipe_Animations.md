# GHI-48: Agenda Calendar Sliding Swipe Animations

**Status:** Completed
**Tier:** 2
**Work Type:** UI/UX

## Problem
The current swipe-to-change-month implementation in the expanded calendar feels unnatural. There is no visual feedback during the swipe, and the month "jumps" to the next one after the gesture ends, rather than sliding away.

## Requirements
1.  **Sliding Transition:** When the month changes (via swipe or arrow buttons), the current month should slide out and the new month should slide in from the side.
2.  **Directional Awareness:** If navigating to the next month, it should slide left. If navigating to the previous month, it should slide right.
3.  **Visual Continuity:** The transition should feel smooth and provide clear feedback that a navigational change is occurring.

## Technical Implementation
- **Direction Tracking:** Added a combined state `[monthKey, direction]` to track when the month changes and in which direction (1 for future, -1 for past).
- **AnimatePresence:** Wrapped the `DayPicker` in `AnimatePresence` with `mode="popLayout"` to allow the exiting month to be removed from the flow while the new one enters.
- **Motion Variants:** Defined `enter`, `center`, and `exit` variants that use the `direction` to determine the `x` offset (sliding left/right).
- **Spring Physics:** Used a spring transition for the `x` axis to make the slide feel "snappy" and native.
- **Drag Refinement:** Set `dragElastic={0.5}` to provide immediate visual feedback during the swipe gesture.

## Verification Plan
- [x] Build successfully with `npm run build`.
- [x] Verify horizontal sliding animation when swiping left/right.
- [x] Verify same sliding animation triggers when tapping the arrow buttons.
