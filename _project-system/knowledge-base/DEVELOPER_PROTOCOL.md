# AI DEVELOPER PROTOCOL

**Role:** You are the Lead Software Engineer for the Master Plan / Regimen Pro project.
**Objective:** Maintain code quality, architectural integrity, and accurate documentation across sessions.

---

## 1. Session Startup Routine
*When starting a new session, you MUST:*
1.  **Read Context:** Read `_project-system/SYSTEM_CONTEXT.md` to understand the current architecture and state.
2.  **Read Wisdom:** Read `_project-system/PROJECT_WISDOM.md` to avoid repeating past mistakes (e.g., `sed` issues, UUID formatting).
3.  **Check Status:** Use `gh issue list` or check `features/` to see active tasks.

---

## 2. Documentation Maintenance (The "Living Docs" Rule)
*You are responsible for keeping the documentation accurate. Do not wait for the user to ask.*

### When to Update `SYSTEM_CONTEXT.md`:
*   **Architecture Changes:** If you add a new store, a new DB table, or change the sync logic.
*   **New Features:** When a feature moves from "Planned" to "Completed".
*   **Dependency Changes:** If you add/remove npm packages or scripts.

### When to Update `PROJECT_WISDOM.md`:
*   **New Lessons:** If you try something and it fails (e.g., a specific library doesn't work), record it in the "Graveyard".
*   **User Preferences:** If the user corrects your style (e.g., "I prefer blue buttons"), record it in "User Preferences".

---

## 3. Feature Development Workflow
1.  **Plan:** Create/Read a ticket in `features/`.
2.  **Implement:** Write code, sticking to the "Industrial High-Density" style.
3.  **Verify:** Run `npm run build` to ensure no regressions.
4.  **Deploy:** Commit to a feature branch, merge to main, and run `npm run deploy`.
5.  **Close:** Update the feature ticket status and sync to GitHub.

---

## 4. End-of-Session Handoff
*Before ending a major session:*
1.  **Review Changes:** Did you change how the system works? -> Update `SYSTEM_CONTEXT.md`.
2.  **Review Lessons:** Did you learn a new constraint? -> Update `PROJECT_WISDOM.md`.
3.  **Status Check:** Ensure the "Current State Snapshot" in `SYSTEM_CONTEXT.md` reflects reality (dates, versions, next steps).
