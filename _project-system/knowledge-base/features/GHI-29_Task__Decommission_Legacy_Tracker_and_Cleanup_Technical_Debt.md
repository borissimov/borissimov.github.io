---
gh_issue_number: 29
parent_epic: 24
type: "task"
title: "Task: Decommission Legacy Tracker and Cleanup Technical Debt"
---

# GHI-29: Decommission Legacy Tracker

## Objective
Remove the obsolete monolithic React tracker to streamline the architecture, reduce bundle size, and eliminate legacy state-conflict bugs.

## Scope of Work
1. **Hub UI Cleanup:** Remove "Legacy Tracker" card from `HubApp.jsx`.
2. **Code Deletion:** Permanently remove the `src/apps/legacy-tracker/` directory.
3. **Context Cleanup:** Remove `PlanContext.jsx` and other legacy-only providers.
4. **Supabase Refactor:** 
   - Move away from `MockSupabase.js` reliance.
   - Refactor `supabaseClient.js` to prioritize the new `v2` relational schema.
5. **Dependency Review:** Remove any NPM packages only used by the legacy app.

## Rational
The Legacy Tracker uses a "JSON Blob" data model that is incompatible with our new V2 "Relational Delta" engine. Keeping both creates complexity, increases the risk of `auth` crashes, and slows down development.

## Branch Strategy
This work involves significant deletions and will be performed on a dedicated branch: `cleanup/decommission-legacy`.

## Linked Issues
- Parent Epic: [GHI-24](./GHI-24_Epic__Master_Plan_Hub_Migration.md)
