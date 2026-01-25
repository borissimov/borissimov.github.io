# PROJECT WISDOM: The Unwritten Rules & History

**Purpose:** This document captures the "tribal knowledge," lessons learned, and user preferences that don't fit into technical architecture docs. Read this to understand *how* to work on this project, not just *what* it is.

---

## 1. User Preferences & "The Vibe"

### Communication Style
*   **Explain First:** The user is an active architect/supervisor. Always explain *what* you intend to do and *why* before calling tools.
*   **Confirm Scope:** If a request is ambiguous, ask. Do not assume.
*   **Documentation:** The user values clean, updated documentation. When a feature is done, update the docs immediately.

### UI/Design Philosophy ("Industrial High-Density")
*   **Aesthetic:** Dark mode, high contrast (`#f29b11` Orange, `#2ecc71` Green), monospace numbers.
*   **Button Placement:**
    *   **Bad:** Full-width, mobile-game style "START" buttons.
    *   **Good:** Small, compact, right-aligned buttons in headers.
*   **Density:** Prefer dense information displays (e.g., "Pills" for sets/reps) over sparse, whitespace-heavy layouts.
*   **Feedback:** UI must react immediately. If data is fetching, show a loader or a log message.

---

## 2. The "Graveyard" (Mistakes & Technical Constraints)

### ⛔ Do NOT use `sed` for `public/regimen.html`
*   **The Incident:** We attempted to use `sed` to replace large JSON blocks (`PLAN_JAN_18`). It failed catastrophically due to string length and special characters, corrupting the file.
*   **The Rule:** **ALWAYS** use Python scripts (`write_file` -> `python3 script.py`) for surgical text replacement in the large HTML file. See `scripts/apply_weekly_plan.py` as the gold standard.

### ⛔ Database Types & UUIDs
*   **The Incident:** The user entered "bobcat" as a User ID. The app crashed because Supabase strictly enforces UUID v4 format on the backend.
*   **The Rule:** Always validate UUIDs in the UI before attempting to sync. The app now includes `isValidUUID` and auto-generates safe IDs.

### ⛔ Race Conditions in Sync
*   **The Incident:** `fetchFromCloud` used to call `save()` immediately after merging. Because `save()` reads from the *current* (potentially empty) state variables, it overwrote the fresh cloud data with stale local data.
*   **The Rule:** When fetching/merging, write **directly** to `localStorage` strings. Do not pass go, do not use the state-to-storage wrapper.

### ⛔ The "Blind Merge" (V3 Migration Failure)
*   **The Incident:** We merged a massive full-stack refactor (V3) based solely on `npm run build`. The app crashed in production because runtime logic was broken, even though the build passed.
*   **The Rule:** **The "UAT Gate"**. Never merge a feature branch to `main` until the user confirms "The app is running and working."
*   **The Rule:** **Local-First Verification**. Service Workers must be disabled on `localhost` to see true errors.

### ⛔ The "Revert & Re-Merge" Trap
*   **The Incident:** After reverting a broken `main`, we re-merged the *same* feature branch to save documentation, re-introducing the bugs.
*   **The Rule:** **Burn the Bridge**. If a branch breaks `main`, it is dead. Cherry-pick docs to a new branch; never re-merge the tainted branch.

---

## 3. Project Evolution (The Story)

### Phase 1: The Static Prototype
*   Started as a simple HTML file.
*   **Constraint:** Must run offline by double-clicking. No build step for the legacy file.

### Phase 2: The "3-Layer" Logic (Feature-001)
*   We realized hardcoding plans in `switch` statements was unscalable.
*   We invented the **3-Layer Architecture**:
    1.  **Daily Override** (Specific date exceptions).
    2.  **User Template** (Recurring weekly preferences).
    3.  **System Default** (The hardcoded safety net).
*   **Key Achievement:** We stopped deleting data. We "mask" it. "Save Today Only" creates a layer on top, preserving the underlying schedule.

### Phase 3: The "System Image" Sync
*   We realized syncing just "Logs" lost the user's schedule preferences when switching devices.
*   We decided to bundle the **User Template** inside the daily log payload. Every sync is a snapshot of both *performance* and *preference*.

---

## 4. Current Operational Deficit
*   **Redundancy:** We currently save a full copy of the default plan when a user "Resets" a day. This ensures historical integrity (if defaults change later, history stays same), but it bloats the DB. **FEATURE-002** is tracked to address this eventually.
