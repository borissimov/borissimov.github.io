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

### ⛔ Database Types & UUIDs
*   **The Rule:** Always validate UUIDs in the UI before attempting to sync. Supabase strictly enforces UUID v4 format.

### ⛔ Navigation Context Loss
*   **The Incident:** Deep-links to the Program Builder would break on refresh because the root orchestrator didn't know which program ID was being edited.
*   **The Rule:** **Unified `navState`**. Always pass a secondary state object through the `onNavigate` chain to preserve IDs and context.

### ⛔ Cascading History Deletion
*   **The Incident:** Deleting an exercise from a program template physically deleted all past workout logs because of `ON DELETE CASCADE`.
*   **The Rule:** Use `ON DELETE SET NULL` for history links and always snapshot exercise names as text.

### ⛔ PostgREST Ambiguity (`PGRST201`)
*   **The Incident:** The API failed when multiple foreign keys existed between the same tables (e.g., `v3` and `v3_dev` schemas).
*   **The Rule:** Use unique constraint names per schema and explicit relationship hints (e.g., `!fk_name`) in JS code.

---

## 3. Proven Strategies

### 🛡️ The "Snapshot" Strategy
*   **The Solution:** Never rely on relational links for history. "Bake" (snapshot) critical data (Names, Targets) into the log row at the moment of completion. This makes history immune to future template edits.

### 🛡️ Modular Slice Architecture
*   **The Solution:** Breaking the global store into domain-specific slices (`program`, `history`, `session`) prevents "God Object" fragility and ensures local fixes don't cause global regressions.

### 🛡️ Surgical ID-Based Diffing
*   **The Pattern:** When saving complex structures, compare incoming IDs against existing database IDs. Only update changed items and only delete items explicitly removed in the UI.

---

## 4. Operational Protocols
*   **CHANGELOG.md:** Every significant feature delivery MUST be documented in the root `CHANGELOG.md` using the "Keep a Changelog" format.
*   **UAT Gate:** No feature merge without visual sign-off.
