# GHI-49: Fix Agenda Calendar Swipe Gesture & Animation

**Status:** In Progress
**Tier:** 2
**Work Type:** Bug Fix / UI

## Problem
The previous sliding animation implementation broke the calendar's swipe gesture. The `dragConstraints={{ left: 0, right: 0 }}` combined with `mode="popLayout"` might be preventing horizontal movement or capturing events incorrectly on mobile.

## Requirements
1.  **Restore Swipe:** Ensure users can swipe left/right to change months again.
2.  **Smooth Slide:** Maintain the directional sliding animation.
3.  **No Clipping:** Ensure the exit/enter animations don't cause layout shifting or clipping within the 500px viewport.

## Technical Implementation
- Remove `dragConstraints` to allow free horizontal movement during the gesture.
- Increase the `dragElastic` or use a different `drag` configuration to ensure the animation triggers reliably.
- Use `pan` gestures or a simplified `onDragEnd` logic.
- Ensure the `motion.div` has a defined width and is correctly centered.

## Verification Plan
- [ ] Build successfully with `npm run build`.
- [ ] Verify horizontal swipe works on mobile devices.
- [ ] Verify sliding feedback is visible during and after the gesture.
