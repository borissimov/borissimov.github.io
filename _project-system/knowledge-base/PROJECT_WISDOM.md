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
*   **Density:** Prefer dense information displays (e.g., "Pills" for sets/reps) over sparse, whitespace-heavy layouts.
*   **Feedback:** UI must react immediately. If data is fetching, show a loader or a log message.

---

## 2. The "Graveyard" (Mistakes & Technical Constraints)

### ⛔ Do NOT use `sed` for `public/regimen.html`
*   **The Rule:** **ALWAYS** use Python scripts (`write_file` -> `python3 script.py`) for surgical text replacement in the large HTML file.

### ⛔ Database Types & UUIDs
*   **The Rule:** Always validate UUIDs in the UI before attempting to sync. Supabase strictly enforces UUID v4 format.

### ⛔ Navigation Context Loss
*   **The Incident:** Deep-links to the Program Builder (for editing) would break on refresh because the root orchestrator didn't know which program ID was being edited.
*   **The Rule:** **Unified `navState`**. Always pass a secondary state object through the `onNavigate` chain to preserve IDs and context.

### ⛔ Structural vs. Data Sync
*   **The Rule:** **Prod -> Dev ONLY**. Never sync data from `v3_dev` to `v3`. Only structural SQL migrations move from Dev to Prod.

---

## 3. Proven Strategies

### 🛡️ The "Archive & Snapshot" Strategy
*   **The Problem:** Users want to delete programs to avoid clutter, but deleting a template orphans the workout logs.
*   **The Solution:** Never delete. Use an `archived_at` column. Filter the Library to hide archived items, but keep them in the database so the "Master Agenda" history remains valid.

### 🛡️ Hierarchical Deep Saving
*   **The Pattern:** When saving a complex program, we use a single `upsert` for the master record, then replace or surgically update the children (Days -> Sessions -> Blocks). This maintains relational integrity.

---

## 4. Operational Protocols
*   **CHANGELOG.md:** Every significant feature delivery MUST be documented in the root `CHANGELOG.md` using the "Keep a Changelog" format.
*   **UAT Gate:** No merge to `main` without visual sign-off from the user.