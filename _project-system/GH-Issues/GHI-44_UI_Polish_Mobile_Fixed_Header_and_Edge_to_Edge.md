# GHI-44: UI Polish - Fixed Header & Mobile Edge-to-Edge

**Status:** Completed
**Tier:** 2
**Work Type:** UI/UX

## Problem
1.  **Header Scrolling:** On smaller devices like Galaxy A41, the app's title bar (header) scrolls away when the user scrolls down, violating the fixed-app feel.
2.  **Visible Borders:** Vertical borders added for desktop viewports are visible on mobile, which is undesirable.
3.  **App Height:** The application height should be strictly locked to the viewport height so that only the content area scrolls.

## Requirements
1.  **Locked Header:** Headers in Agenda, Library, and Session views must remain fixed at the top of the screen at all times.
2.  **Conditional Borders:** Remove vertical borders and shadows on devices with width <= 500px.
3.  **Strict Viewport:** Ensure `100dvh` is respected and prevent the root body from scrolling when a constrained view is active.
4.  **Zero Padding:** Remove default vertical padding from constrained views to allow headers to sit perfectly at the top.

## Technical Implementation
- **Media Query Borders:** Refined `.viewport-constrained` in `shared-premium.css` to only apply vertical borders and shadows on screens wider than `500px`.
- **Height Locking:** Applied `height: 100vh; height: 100dvh; overflow: hidden;` to `.master-plan-orchestrator` and `.viewport-constrained` to ensure the app doesn't exceed the viewport.
- **Fixed Headers:** Implemented `flex-shrink: 0` on headers and placed main content inside a `.scrollable-content` container with `flex: 1; overflow-y: auto;`.
- **Padding Cleanup:** Removed default vertical padding from the outer container to ensure the header touches the top edge of the screen.

## Verification Plan
- [x] Build successfully with `npm run build`.
- [x] Visual verification on mobile (simulated Galaxy A41) and desktop.
