# GHI-52: Fix Library Hydration & Initial Program Visibility

**Status:** In Progress
**Tier:** 1 (Critical Bug)
**Work Type:** Bug Fix

## Problem
When navigating to the Library View (e.g., via the Plus button on the Agenda), programs sometimes fail to display initially. They only appear after the user toggles "Show Archived Programs". This suggests a race condition or a stale state issue in the hydration logic of `programSlice.js`.

## Requirements
1.  **Guaranteed Loading:** Ensure `fetchProgramManifest` is called and completes successfully whenever the Library View is mounted or navigated to.
2.  **State Stability:** Ensure the `programs` list in the store is correctly populated before rendering the Library cards.
3.  **Active ID Sync:** If `activeProgramId` is missing, the system should intelligently pick the first available non-archived program during initial fetch.

## Technical Implementation
- Investigate `MasterPlanApp.jsx` dependency array for `useEffect`.
- Ensure `fetchProgramManifest` in `programSlice.js` correctly handles cases where `activeProgramId` might be null but programs exist.
- Add a explicit fetch trigger in `LibraryView` mount if programs are missing.

## Verification Plan
- [ ] Build successfully with `npm run build`.
- [ ] Manual verification: Log out, log in, navigate to Agenda, tap Plus, verify Library shows programs immediately.
