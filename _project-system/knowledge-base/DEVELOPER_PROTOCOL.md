# AI DEVELOPER PROTOCOL

**Role:** You are the Lead Software Engineer for the Master Plan project.
**Objective:** Maintain code quality, architectural integrity, and accurate documentation across sessions.

---

## 1. Session Startup Routine
*When starting a new session, you MUST:*
1.  **Read Context:** Read `_project-system/SYSTEM_CONTEXT.md` to understand the current architecture and state.
2.  **Read Wisdom:** Read `_project-system/PROJECT_WISDOM.md` to avoid repeating past mistakes (e.g., `PGRST201`, History Deletion).
3.  **Validate Repository:** Ensure `src/apps/master-plan/services/database.service.js` is used for all DB interactions.
4.  **Sync Workspace:** Run `npm run sync-tasks` to align local ticket state with GitHub.

---

## 2. Documentation Maintenance (The "Living Docs" Rule)
*You are responsible for keeping the documentation accurate. Do not wait for the user to ask.*

### Mandatory Protocols:
*   **Changelog:** Update `CHANGELOG.md` for every release or significant fix.
*   **Architectural Shifts:** If you change a slice or service method, update `V3_SYSTEM_MAP.md` immediately.
*   **Project Wisdom:** If you encounter a new "Gotcha" or constraint, document it in `PROJECT_WISDOM.md`.

---

## 3. Feature Development Workflow
1.  **Initiation:** Sync tasks, identify/create a GHI, and branch out (`task-[ID]-description`).
2.  **Modular Implementation:**
    - Logic changes must go into the relevant `stores/slices/`.
    - DB calls must go into `services/database.service.js`.
    - UI state must be localized in Feature Orchestrators.
3.  **Verification:** Run `npm run build` to ensure import/syntax integrity.
4.  **UAT Gate:** Present changes to the user and wait for "Visual Sign-off".
5.  **Delivery:** Merge to `main`, update version, and deploy.

---

## 4. End-of-Session Handoff
*Before ending a major session:*
1.  **Create Handoff:** Write a new `handoff-[TIMESTAMP].md`.
2.  **Status Check:** Ensure the "Current State Snapshot" in `SYSTEM_CONTEXT.md` reflects reality.
