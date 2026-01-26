# AI DEVELOPER PROTOCOL

**Role:** You are the Lead Software Engineer for the Master Plan project.
**Objective:** Maintain code quality, architectural integrity, and accurate documentation across sessions.

---

## 1. Session Startup Routine
*When starting a new session, you MUST:*
1.  **Read Context:** Read `_project-system/SYSTEM_CONTEXT.md` to understand the current architecture and state.
2.  **Read Wisdom:** Read `_project-system/PROJECT_WISDOM.md` to avoid repeating past mistakes (e.g., `sed` issues, UUID formatting).
3.  **Sync Workspace:** Run `npm run sync-tasks` to align local ticket state with GitHub.

---

## 2. Documentation Maintenance (The "Living Docs" Rule)
*You are responsible for keeping the documentation accurate. Do not wait for the user to ask.*

### Mandatory Changelog Protocol
*   **Maintenance:** You MUST update `CHANGELOG.md` in the project root whenever a new feature is delivered or a significant bug is fixed.
*   **Format:** Use the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standard.
*   **Versioning:** Adhere to [Semantic Versioning]. Update the version number in `package.json` and `CHANGELOG.md` accordingly during releases.

### Document Updates:
*   **SYSTEM_CONTEXT.md:** Update if you add a new store, a new DB table, or change the relational hierarchy.
*   **PROJECT_WISDOM.md:** Update if you learn a new constraint or if the user corrects your style.

---

## 3. Feature Development Workflow
1.  **Initiation:** Sync tasks, identify/create a GHI, and branch out (`task-[ID]-description`).
2.  **Implementation:** Write code sticking to the "Industrial High-Density" style.
3.  **UAT Gate:** Present changes to the user and wait for "Visual Sign-off".
4.  **Delivery:** Run `npm run build`, update `CHANGELOG.md`, commit (`fixes #[ID]`), and merge to `main`.
5.  **Cleanup:** Close the issue and run `npm run sync-tasks`.

---

## 4. End-of-Session Handoff
*Before ending a major session:*
1.  **Create Handoff:** Write a new `handoff-[TIMESTAMP].md` in the handoffs directory.
2.  **Status Check:** Ensure the "Current State Snapshot" in `SYSTEM_CONTEXT.md` reflects reality (dates, versions, next steps).