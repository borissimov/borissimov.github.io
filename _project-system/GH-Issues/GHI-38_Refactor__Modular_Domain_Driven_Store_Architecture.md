---
gh_issue_number: 38
type: "refactor"
title: "Refactor: Modular Domain-Driven Store Architecture"
---

# TASK-38: Refactor: Modular Domain-Driven Store Architecture

### Goal
Decompose the 'God Object' useProgramStore.js into specialized, schema-aware slices to improve maintainability, testability, and stability.

### Problem
The current store handles too many responsibilities (Auth, CRUD, Execution, UI, History), leading to fragile logic where fixes in one area cause regressions in another.

### Solution
1. Implement the **Zustand Slice Pattern**.
2. Create specialized domain slices:
   - `programSlice`: Program CRUD & Builder logic.
   - `sessionSlice`: Active Logger & Focus Engine.
   - `historySlice`: Performance Vault & AI Exports.
   - `uiSlice`: Navigation & Environment state.
3. Introduce a `services/db.service.js` layer to abstract schema-aware Supabase queries.
4. Unify under a single `useProgramStore.js` for API compatibility.

### Work Type
Refactor / Engineering Excellence