# GHI-55: Implement Recovery Sleep Engine & Timer UI

**Status:** Completed
**Tier:** 2
**Work Type:** Feature

## Problem
Users want to track sleep as a recovery mission using the same high-performance timer engine used for workouts. Currently, there is no dedicated way to log sleep sessions.

## Requirements
1.  **Database:** Create \`v3.sleep_logs\` table to store sleep sessions.
2.  **Trigger:** Add a \`Moon\` icon to the \`MasterAgendaView\` header.
3.  **Active State:** Implement a \`sleepSlice\` to manage the "Active Sleep" state (start time, persistent across refreshes).
4.  **UI:**
    *   **Sleep Mode Overlay:** A focused, low-light screen with a timer.
    *   **Active Recovery Banner:** A blue/purple banner visible on other screens while sleeping.
5.  **Logging:** On "Wake Up", calculate duration and save to database.
6.  **Safety:** Prevent concurrent sessions (no sleep during workout, no workout during sleep) and add confirmation modals.

## Technical Implementation
- **Schema:** Created \`sleep_logs\` in both \`v3\` and \`v3_dev\`.
- **Logic:** Deployed \`sleepSlice.js\` managing \`activeSleepSession\` and persistence.
- **Session Protection:** Implemented conflict checks in \`handleToggleSleep\` and \`startSession\` to ensure only one mission is active at a time.
- **Confirmation Modals:** Added specialized modals for "Initiate Sleep", "Wake Up Confirmation", and "Session Conflict" in \`SessionModals.jsx\`.
- **Low-Light UI:** Created \`SleepModeView.jsx\` for a distraction-free, high-contrast night timer.

## Verification Plan
- [x] Build successfully with \`npm run build\`.
- [x] Verify "Sleep Protocol" can be started/ended with confirmation.
- [x] Verify persistence after page refresh.
- [x] Verify data appears in \`sleep_logs\` table.
- [x] Verify session conflict modal appears if trying to start a workout while sleeping.
