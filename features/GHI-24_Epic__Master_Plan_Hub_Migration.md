---
gh_issue_number: 24
type: "epic"
title: "Epic: Master Plan Hub Migration"
---

# GHI-24: Master Plan Hub Migration

Transition the project from a collection of standalone files to a unified, Dashboard-First React application. This epic serves as the parent for all migration-related stories and tasks.

## Parent Epic Objectives
- [x] **Infrastructure:** Modular `src/apps/` architecture.
- [x] **Hub Launcher:** Glassmorphism dashboard gateway.
- [x] **Legacy Isolation:** Sandbox for original React code.
- [x] **Exercise Tracking Flow (GHI-26):** Intelligent focus-driven tracker redesign.
- [ ] **Data Engine (GHI-25):** Relational Supabase delta-sync integration.
- [ ] **Health Suite:** Dedicated apps for metrics (BP, etc) and trend visualization.

## Linked Issues
- **GHI-26 (Task):** [Exercise Tracking Flow Redesign](./GHI-26_Task__Exercise_Tracking_Flow_Redesign.md) - **COMPLETED**
- **GHI-28 (Task):** [Calendar-Ready Relational Engine](./GHI-28_Task__Implementation_Calendar-Ready_Relational_Engine.md) - **IN PROGRESS**
- **GHI-25 (Task):** Relational Data Migration - **PLANNED**

## Status
- **Status:** IN PROGRESS
- **Tier:** 1 (Infrastructure / Core Logic)
- **Progress:** 65%

## High-Level implementation Log
- **Phase 1: Isolation & Hub Foundation** (Completed)
- **Phase 2: UI Architecture & Tracking Flow Logic** (Completed / UAT Passed)
- **Phase 3: Relational Data & Real-Time Sync** (In Progress)

## Next Steps
1. Integration of real-time relational data fetching (Phase 3 Step 3).
2. Data visualization layer for health metrics.