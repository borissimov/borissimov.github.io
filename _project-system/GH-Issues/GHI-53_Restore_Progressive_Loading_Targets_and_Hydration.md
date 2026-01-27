# GHI-53: Restore Progressive Loading Targets & Hydration

**Status:** In Progress
**Tier:** 1 (Critical Data Integrity)
**Work Type:** Bug Fix

## Problem
Progressive loading targets (per-set weight/rep/RPE variations) are being lost or flattened to the base targets. While the `sessions` table and `block_items` support `set_targets`, the hydration logic in `programSlice.js` was not correctly passing this JSON blob to the UI components, and the save logic was not persisting it.

## Requirements
1.  **Hydration Fix:** Ensure `fetchProgramDetails` and `startSession` correctly map the `set_targets` JSON blob into the store's state.
2.  **Persistence Fix:** Update `saveProgram` to preserve existing `set_targets` for block items.
3.  **UI Feedback:** Verify that the `SessionLogger` displays the correct per-set target when a set is active.

## Technical Implementation
- Update `src/apps/master-plan/stores/slices/programSlice.js` to include `set_targets` in the mapping logic for `fetchProgramDetails`.
- Update `src/apps/master-plan/stores/slices/sessionSlice.js` to include `set_targets` in the mapping logic for `startSession`.
- Ensure `saveProgram` in `programSlice.js` does not overwrite `set_targets` with null during standard program edits.

## Verification Plan
- [ ] Build successfully with `npm run build`.
- [ ] Manual verification: Edit a program with existing progressive targets (check DB for a 'legs' day), start session, verify per-set targets change as sets are logged.
