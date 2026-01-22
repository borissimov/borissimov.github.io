---
gh_issue_number: 27
parent_epic: 24
type: "task"
title: "Task: V2 Relational Schema Design & Implementation"
---

# GHI-27: V2 Relational Schema Design

## Objective
Establish a clean, isolated database environment for the V2 "Exercise Tracking Flow" to solve the data egress issues of the legacy monolithic blobs.

## Key Requirements
1. **Schema Isolation:** Use a dedicated `v2` PostgreSQL schema to separate new tables from legacy `public` tables.
2. **Cycle-Aware Routines:** Design for "N-Day Loop" logic (3, 5, 10, or 15-day cycles).
3. **Block-Based Hierarchy:** Support both Standard and Circuit training blocks natively.
4. **Intelligent Cursor Support:** Architecture must allow querying the last completed routine day to provide automated "Following Shadow" recommendations.

## Proposed Table Hierarchy
- `v2.routines` (Parent split container)
- `v2.routine_days` (Sequence logic: Day 1, Day 2, etc.)
- `v2.workouts` (Specific day content)
- `v2.workout_blocks` (Sequential/Circuit blocks)
- `v2.exercises` (Master exercise library)
- `v2.block_exercises` (Specific targets for a workout)
- `v2.session_logs` (Historical records for cursor logic)
- `v2.set_logs` (Granular data points for sets/rounds)

## Implementation Steps
1. [ ] Produce technical design document `docs/design/V2_RELATIONAL_ENGINE.md`.
2. [ ] Write SQL Migration script for Supabase.
3. [ ] Update `supabaseClient.js` to support schema-aware queries.
4. [ ] Implement "Next-Day" selector logic in Zustand store.

## Linked Issues
- Parent Epic: [GHI-24](./GHI-24_Epic__Master_Plan_Hub_Migration.md)
