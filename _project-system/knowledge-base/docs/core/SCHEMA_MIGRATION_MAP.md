# Schema Migration Map: V2 to V3

This document defines the mapping between the **V2 (Relational)** and **V3 (Native Athletic)** database schemas. It serves as a reference for data migration and architectural consistency.

---

## 1. Entity Mapping

| V2 Entity (Relational) | V3 Entity (Native) | Notes |
| :--- | :--- | :--- |
| `v2.routines` | `v3.programs` | Top-level training plans. |
| `v2.routine_days` | `v3.program_days` | Specific slots in a cycle (e.g., "Day 1"). |
| `v2.workouts` | `v3.sessions` | The prescription/template for a day. |
| `v2.workout_blocks` | `v3.blocks` | Organizational units within a workout. |
| `v2.block_exercises` | `v3.block_items` | Individual exercises or tasks in a block. |
| `v2.exercises` | `v3.exercise_library` | The global dictionary of exercise movements. |
| `v2.session_logs` | `v3.completed_sessions` | The header record for a finished workout. |
| `v2.set_logs` | `v3.performance_logs` | The granular metrics (Weight, Reps, RPE, etc.). |

---

## 2. Field-Level Migration Logic

### Sessions (Header)
*   **From:** `v2.session_logs`
*   **To:** `v3.completed_sessions`
*   **Logic:** 
    *   `id` -> `id` (Preserved UUID)
    *   `user_id` -> `user_id`
    *   `routine_day_id` -> `program_day_id` (Mapped via `sequence_number` if direct ID match fails)
    *   `start_time` -> `start_time`
    *   `end_time` -> `end_time`

### Performance Logs (Sets)
*   **From:** `v2.set_logs`
*   **To:** `v3.performance_logs`
*   **Logic:**
    *   `session_log_id` -> `completed_session_id`
    *   `block_exercise_id` -> `block_item_id` (Requires look-up via exercise name matching)
    *   `weight` -> `weight` (Cast to String)
    *   `reps` -> `reps`
    *   `rpe` -> `rpe`
    *   `set_number` -> `set_number`
    *   `created_at` -> `created_at`

---

## 3. Related Scripts

The following scripts handle or document the migration process:

*   **`_project-system/migration_v2_to_v3_single.js`**: 
    *   **Purpose:** Surgical migration of a specific workout (e.g., Jan 25, 2026).
    *   **Strategy:** Dual-client authentication (Anon for V2 read, Service Role for V3 write).
    *   **Logic:** Resolves exercise names by traversing `v2.block_exercises` -> `v2.exercises` and matching against `v3.exercise_library`.

*   **`src/data/v3_schema_rename.sql`**: (Referenced in handoffs)
    *   **Purpose:** The original full-schema migration script.

---

## 4. Known Constraints
*   **Name-Based Matching:** Migration of logs relies on exact string matches for exercise names between `v2.exercises.name` and `v3.exercise_library.name` because structural IDs often differ after heavy refactors.
*   **RLS Bypass:** Writing to V3 requires the `service_role` key to bypass Row-Level Security policies.
