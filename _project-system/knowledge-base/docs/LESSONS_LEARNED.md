# Lessons Learned: V3 Migration & Refactor Failure

**Date:** January 23, 2026
**Incident:** Premature Merge of V3 Architecture to Main
**Status:** Application Broken in Production/Local

---

## 1. The Incident
The AI agent executed a complex full-stack refactor (Database + Store + UI) and merged the changes to the `main` branch based solely on a successful compile (`npm run build`) and a Service Worker hotfix. The user was not given the opportunity to verify the application's runtime functionality before the merge.

## 2. Root Causes

### A. Process Failure (The Critical Error)
*   **Premature Merging:** The agent merged `feat/v3-architecture` to `main` without User Acceptance Testing (UAT).
*   **False Confidence:** The agent assumed that because `npm run build` passed and the DB migration script finished, the application was working.
*   **Ignored Complexity:** The refactor touched every single layer of the app (DB -> Store -> Components). The probability of runtime errors (null pointers, logic gaps) was 100%, yet the agent treated it as a "done deal."

### B. Technical Oversights
*   **Service Worker Aggression:** The Service Worker configuration aggressively cached broken assets and blocked local development, masking the actual application state.
*   **Schema Assumptions:** The V3 migration script initially failed because it assumed columns (`tags`) that didn't exist in V2, proving that the "Inspection" phase was insufficient.

## 3. Corrective Actions (New Protocol)

1.  **The "UAT Gate":** NEVER merge a feature branch to `main` until the user explicitly confirms "The app is running and working."
2.  **Rollback Readiness:** Always keep the legacy schema (`v2`) intact until V3 is proven in production for at least 24 hours. (Fortunately, we did this).
3.  **Local-First Verification:** Service Workers must be strictly disabled or bypassed in `localhost` environments to ensure true error visibility.
4.  **Incremental Merges:** Huge refactors should be broken down. We should have migrated the DB and verified the *old* app could run on the *new* DB (via adapter) before rewriting the UI.

---

## 4. Immediate Recovery Plan
*   **Option A (Rollback):** Revert `main` to the pre-V3 commit. Point config back to `v2` schema.
*   **Option B (Fix Forward):** Debug the white-screen error in `main` aggressively.

---

## 5. The "Revert & Re-Merge" Trap (Incident #2)
**Date:** January 23, 2026 (Part 2)

### The Event
After correctly identifying that `main` was broken, the agent successfully performed a hard reset to restore the V2 state. However, the agent then attempted to "save the documentation" by merging the `feat/v3-architecture` branch back into `main`.
*   **The Error:** `feat/v3-architecture` still contained the *broken V3 code changes*. Merging it back into `main` re-introduced the bugs, overriding the reset.
*   **The Fix:** A second hard reset was required.

### Corrective Action (Git Protocol)
*   **Abandon Tainted Branches:** If a feature branch causes a breakage that requires a `main` revert, that feature branch is **DEAD**. Do not merge it again.
*   **Cherry-Pick Docs:** If you need to save documentation from a dead branch, use `git checkout <file>` or copy-paste content to a *new, clean branch* derived from the stable `main`. Never merge the whole branch.
