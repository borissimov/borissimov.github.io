---
gh_issue_number: 31
parent_epic: 24
type: "task"
title: "Task: Implement High-Detail Protocols and Set-Specific Targets"
---

# GHI-31: High-Detail Protocols & Set-Specific Targets

## Objective
Transform the Training App from a generic logger into a professional-grade protocol engine that supports pyramid sets, drop sets, and pre/post-workout medical/safety instructions.

## Requirements
1. **Schema Upgrade:** Add `set_targets` (JSONB) to `v2.block_exercises` and `workout_notes` to `v2.workouts`.
2. **Dynamic UI:** `SequentialSetLogger` must update recommended weight/reps based on the *current set index*.
3. **Safety Context:** Display critical context (e.g., "44-Hour Fasted State") at the top of the session.
4. **Special Set Flags:** Support visual indicators for "Warm-up", "Feeder", and "Drop" sets.

## Implementation Steps
1. [ ] Apply database migration for additive columns.
2. [ ] Seed the Tuesday "Volume & TUT" routine with high-detail data.
3. [ ] Update `useTrainingStore.js` to handle JSONB targets.
4. [ ] Update `SequentialSetLogger` and `ExerciseRow` components.

## Linked Issues
- Parent Epic: [GHI-24](./GHI-24_Epic__Master_Plan_Hub_Migration.md)
