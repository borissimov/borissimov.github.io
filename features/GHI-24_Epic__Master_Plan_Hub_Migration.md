---
gh_issue_number: 24
type: "epic"
title: "Epic: Master Plan Hub Migration"
---

# GHI-24: Master Plan Hub Migration

Transition the project from a collection of standalone files to a unified, Dashboard-First React application.

## Objectives
- [ ] **Legacy Isolation:** Move current React code to `src/apps/legacy-tracker/` (Complete).
- [ ] **Hub Landing Page:** Create a sleek primary entry point at `/`.
- [ ] **Regimen Pro Port:** Convert `regimen.html` into a clean React component in `src/apps/regimen-pro/`.
- [ ] **Circuit Redesign:** Implement the round-based logging system for efficient circuit training.
- [ ] **Routing:** Implement a lightweight internal router to switch between apps.

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
