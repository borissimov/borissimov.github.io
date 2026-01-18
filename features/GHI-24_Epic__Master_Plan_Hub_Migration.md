---
gh_issue_number: 24
type: "epic"
title: "Epic: Master Plan Hub Migration"
---

# GHI-24: Master Plan Hub Migration

Transition the project from a collection of standalone files to a unified, Dashboard-First React application.

## Objectives
- [x] **Legacy Isolation:** Move current React code to `src/apps/legacy-tracker/`.
- [x] **Hub Landing Page:** Create a sleek primary entry point at `/`.
- [ ] **Data Normalization (GHI-25):** Implement the Relational Schema to solve egress. [View Design](../../docs/architecture/DATABASE_SCHEMA.md).
- [ ] **Regimen Pro Port:** Convert `regimen.html` into a clean React component.
- [ ] **Blood Pressure Tracker:** Implement a new dedicated app for BP logging and trends.
- [ ] **Routine Editor:** Placeholder app card for the upcoming design suite.
- [ ] **Circuit Redesign:** Implement round-based logging in Regimen Pro.
- [ ] **Routing:** Implement a lightweight internal router.

## Status
- **Status:** IN PROGRESS
- **Tier:** 1 (Infrastructure)
- **Progress:** 20%

## Implementation Log
- **Phase 1: Isolation**
    - Scaffolded `src/apps/` directory.
    - Moved legacy components, hooks, and App.jsx to isolation.
    - Updated `main.jsx` to maintain legacy functionality during transition.

## Next Steps
1. User verification of Legacy App functionality.
2. Design Hub Landing Page (Launcher style).
3. Port core data logic from `regimen.html` to `src/apps/regimen-pro/`.
