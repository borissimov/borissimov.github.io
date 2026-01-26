---
gh_issue_number: 36
type: "refactor"
title: "Hardening: Implement Library Anchor for Performance History"
---

# TASK-36: Hardening: Implement Library Anchor for Performance History

### Goal
Protect user performance history from template mutations by anchoring logs directly to the exercise library.

### Problem
Currently, performance logs are linked to program blocks. When a block is deleted or a program is edited (Nuke & Pave), the relational link breaks, and historical data vanishes from the UI.

### Solution
1. Add `exercise_library_id` to `performance_logs`.
2. Backfill existing logs.
3. Update store logic (`finishSession`) to populate this anchor.
4. Refactor `saveProgram` to use surgical updates instead of full deletion.
5. Update history views to fallback to library-anchor if block link is null.

### Work Type
Refactor / Architecture