---
gh_issue_number: 2
title: "FEATURE-002: Data Redundancy Optimization"
---

# Feature Ticket: Data Redundancy Optimization

**Ticket ID:** FEATURE-002
**Status:** Draft
**Priority:** Low (Optimization)
**Context:** Currently, when a user resets a daily plan to the System Default using "SAVE TODAY ONLY", the system saves a full copy of the default data into the `masterLogs` (Layer 1). While this ensures historical integrity (protecting against future changes to defaults), it creates unnecessary data redundancy when the saved data is identical to the current `DEFAULT_PLAN`.

---

## 1. Problem Statement
*   **Action:** User clicks "Load System Defaults" -> "Save Today Only".
*   **Result:** `masterLogs[dateKey].plan_overrides` is populated with a JSON object identical to `DEFAULT_PLAN[dayOfWeek]`.
*   **Impact:** Database size increases unnecessarily over time with redundant data.

## 2. Proposed Solution
Implement a "Diff & Prune" logic during the Save operation.

### Logic Flow
1.  **Intercept Save:** When `saveNutriEdit` or `saveSuppsEdit` is called with `isTemplate = false` (Today Only).
2.  **Compare:** Compare the `newList` (user input) against `DEFAULT_PLAN[dayOfWeek][section]`.
3.  **Conditional Write:**
    *   **If Identical:** Delete `masterLogs[dateKey].plan_overrides[section]`. (Reverting to Layer 3 behavior).
    *   **If Different:** Save `newList` to `masterLogs[dateKey].plan_overrides[section]` (Standard Layer 1 behavior).

## 3. Considerations & Risks
*   **Historical Integrity:** If we implement this, we effectively "unfreeze" history for days that match the default. If `DEFAULT_PLAN` changes in a future version (e.g., v2.0 updates the default meal), these past logs will implicitly update to the new v2.0 meal because they no longer have a static snapshot.
*   **Decision Required:** Is saving a few kilobytes of redundancy worth the risk of changing past history?
    *   *Alternative:* Only apply this optimization to future dates, or version the `DEFAULT_PLAN` (e.g., `DEFAULT_PLAN_V1`).

## 4. Implementation Steps
1.  Create a deep-equality check helper function.
2.  Update `saveNutriEdit` and `saveSuppsEdit` to use this check before writing to `masterLogs`.
3.  Add unit tests to ensure that manual overrides which *happen* to match defaults are treated correctly according to the chosen policy.
