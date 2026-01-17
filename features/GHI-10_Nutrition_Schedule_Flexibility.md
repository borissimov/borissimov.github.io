---
gh_issue_number: 10
title: "Nutrition Schedule Flexibility"
---

# Feature Ticket: Nutrition Schedule Flexibility & Dynamic Plan Management

**Ticket ID:** FEATURE-001
**Status:** Completed
**Priority:** High
**Context:** The current application uses hardcoded logic (`switch(dayOfWeek)`) to determine the workout and nutrition plan. Users need the ability to modify these plans directly within the UI, supporting both one-off daily exceptions and permanent schedule updates.

---

## 1. Architectural Strategy: "The Three Layers of Truth"

To resolve the "What should I eat today?" query, the application will implement a tiered resolution logic. This ensures flexibility without losing the robustness of default values.

### Layer 1: Daily Exception (Highest Priority)
*   **Scope:** Applies to a specific calendar date (e.g., `2026-01-20` only).
*   **Storage:** Inside the existing `masterLogs` object for that specific date key.
*   **Property:** `plan_overrides` (Object containing `nutrition`, `training`, etc.).
*   **Use Case:** "I'm traveling today, so my diet is different just for today."
*   **Logic:** If `masterLogs['YYYY-MM-DD'].plan_overrides` exists, render this data and ignore lower layers.

### Layer 2: User Template (Medium Priority)
*   **Scope:** Applies to a specific day of the week (e.g., "Every Tuesday").
*   **Storage:** A new LocalStorage object key: `regimen_user_template`.
*   **Structure:** `{ 0: {...}, 1: {...}, ... }` (0=Sunday, 6=Saturday).
*   **Use Case:** "I want to change my recurring Tuesday meal plan to include fish."
*   **Logic:** If no Daily Exception exists, check `regimen_user_template[dayOfWeek]`. If found, use it.

### Layer 3: System Default (Lowest Priority)
*   **Scope:** Global fallback.
*   **Storage:** A `const DEFAULT_PLAN` object within the codebase (extracted from current switch logic).
*   **Use Case:** User has never customized the plan or resets their data.
*   **Logic:** If neither Layer 1 nor Layer 2 yields data, load from `DEFAULT_PLAN`.

---

## 2. Implementation Plan

### Phase A: Data Extraction & Structure
1.  **Refactor `getPlanForDate`:**
    *   Extract the massive `switch` statement into a clean `const DEFAULT_PLAN` object map.
    *   Rewrite `getPlanForDate` to implement the 3-Layer resolution logic described above.

### Phase B: UI Enhancements ("Edit Mode")
1.  **Edit Toggle:** Add an "Edit" button to the Nutrition and Supplement panel headers.
2.  **Input View:** When clicked, replace the static list with an editable form:
    *   Row-based inputs for `Time`, `Name`, `Details`.
    *   "Add Row" / "Delete Row" controls.
    *   "Save" and "Cancel" actions.

### Phase C: Persistence Logic ("The Save Modal")
1.  **User Intent:** When the user clicks "Save", trigger a prompt (Modal/Dialog):
    *   *"Apply changes to just today, or all [DayNames]?"*
2.  **Routing:**
    *   **"Just Today":** Write data to `masterLogs[dateKey].plan_overrides`. Call `save()` (persists to `regimen_master_log_v2`).
    *   **"All [DayNames]":** Write data to `regimen_user_template` variable. Save to LocalStorage key `regimen_user_template`.

### Phase D: Synchronization
1.  **Daily Logs:** The existing sync mechanism (`REGI_daily_logs` table) handles Layer 1 (Exceptions) automatically because `masterLogs` is already being synced.
2.  **Templates:**
    *   *Interim (V0.1):* We will bundle the `user_template` inside the daily log snapshot if necessary, or treat it as a local-first preference.
    *   *Long-term:* Create a dedicated `REGI_templates` table in Supabase for syncing the recurring schedule.

---

## 3. Technical Notes
*   **Backups:** Ensure `regimen_beta_0.1.html` is preserved before starting Phase A.
*   **State Management:** The `save()` function must be updated to handle saving the Template object if Layer 2 is modified.
*   **Validation:** Ensure the "Edit" form sanitizes inputs to prevent breaking the rendering HTML (e.g., escaping quotes).

---

## 4. Implementation Summary (Final)

### Data Architecture (3-Layer System)
The `getPlanForDate(date)` function now resolves plans in this order:
1.  **Daily Override:** Checks `masterLogs[dateKey].plan_overrides`. If present, this data is used (highest priority).
2.  **User Template:** Checks `localStorage['regimen_user_template'][dayOfWeek]`. If a custom template exists for that day (e.g., all Tuesdays), it is used.
3.  **System Default:** Falls back to `DEFAULT_PLAN`, a `const` object containing the original hardcoded schedule.

### Edit Functionality
*   **Edit Modes:** Added boolean states `isNutriEditMode` and `isSuppsEditMode`.
*   **Render Functions:** `renderNutriEdit` and `renderSuppsEdit` provide input fields for modifying data.
*   **Load Defaults:** A "LOAD SYSTEM DEFAULTS" button allows users to populate the form with factory defaults. This action does not auto-save; users must explicitly choose to save it.
*   **Save Logic:** Users can choose "SAVE TODAY ONLY" (writes to Layer 1) or "SAVE FOR ALL [DAYS]" (writes to Layer 2).

### Synchronization Strategy ("System Image" Bundling)
To support syncing custom schedules without a dedicated database table:
*   **Push (Sync):** The current `regimen_user_template` from LocalStorage is bundled into the `data.user_template_snapshot` field of every daily log sent to Supabase.
*   **Pull (Fetch):** When fetching logs, the app checks for `user_template_snapshot` in the most recent log entry. If found, it restores this object to `localStorage['regimen_user_template']`.
*   **Result:** This ensures that user preferences (schedule changes) travel alongside their history (daily logs) across devices.