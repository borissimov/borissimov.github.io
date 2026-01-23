# Master Plan: Technical Reference Manual

**Version:** 1.4.2 (Polymorphic Logger Model)
**Scope:** Domain Logic, Data Architecture, and System Rules.

---

## 1. The Core Philosophy: "Prescription vs. Performance"

The application is architected around a strict separation between the **Plan** (what the coach/program prescribes) and the **Reality** (what the athlete executes).

*   **The Prescription (Rx):** Immutable templates that define the ideal session.
*   **The Performance (Log):** Mutable records of the actual physical event.

---

## 2. The Hierarchy of Time: "The Program Day"

To support professional athletic schedules—where a user might have multiple distinct activities (e.g., Morning Mobility, Afternoon Strength, Evening Cardio) on the same calendar day—we utilize the concept of a **Program Day**.

### **2.1 The Program Day Container**
The `Program Day` is the master container for a specific slot in the cycle. It allows stacking disparate activities without terminology conflict.

### **2.2 The Session**
A **Session** is a specific, cohesive activity unit (e.g., "Legs Hypertrophy" or "Morning Flow"). It is the parent container for the actual work.

---

## 3. The Unified "Session Logger" Engine

We use a single, **Polymorphic Session Logger** to handle all types of activity (Strength, Cardio, Mobility). We do NOT separate them into different apps.

### **3.1 The Polymorphic Logic**
The Logger renders different input interfaces based on the **Metric Type** defined in the prescription (`block_items`).

| Metric Type | Use Case | UI Interface | Data Logged |
| :--- | :--- | :--- | :--- |
| **`LOAD_REP`** | Squat, Bench, Curls | Number Inputs (Weight/Reps) | `weight`, `reps`, `rpe` |
| **`DURATION`** | Planks, Stretches, Iso-holds | **Stopwatch / Timer** | `duration_seconds`, `rpe` |
| **`DISTANCE`** | Running, Rowing | Number Inputs (Dist/Time) | `distance_meters`, `duration_seconds` |
| **`Weighted DURATION`** | Farmer Carries | Mixed Input | `weight`, `duration_seconds` |

### **3.2 The "Flow" Block (Auto-Advance)**
To support Maintenance/Mobility sessions without breaking the user's rhythm, the logger supports an **Auto-Advance** mode.

*   **Context:** `block_type = 'CIRCUIT'` + `metric_type = 'DURATION'`
*   **Behavior:** When the timer hits 0:00, the system:
    1.  Plays a completion chime.
    2.  Automatically saves the log.
    3.  **Immediately moves the focus** to the next item in the sequence.

---

## 4. Database Schema: The V3 Map

This schema supports the full "Athletic Model" with clean separation of concerns.

### **Level 1: The Blueprint (v2 Schema)**
These tables define the **Prescription**.

*   **`v2.programs`**: The overarching cycle.
*   **`v2.program_days`**: The daily slots.
*   **`v2.sessions`**: The activities. Contains `session_focus` (Instructions).
*   **`v2.blocks`**: Grouping containers (Warmup, Main, Finisher).
*   **`v2.block_items`**: The specific prescriptions.
    *   *Columns:* `target_weight`, `target_reps`, `target_rpe`, `metric_type`.
    *   *Instructions:* `tempo`, `rest_seconds`.

### **Level 2: The Library (v2 Schema)**
These tables define **Universal Truths**.

*   **`v2.exercise_library`**: Movements.
    *   *Columns:* `name`, `technique_cues` (Permanent form reminders).

### **Level 3: The Record (v2 Schema)**
These tables store the **Performance**.

*   **`v2.completed_sessions`**: The header record.
    *   *Columns:* `start_time`, `end_time`, `user_id`, `session_id`.
*   **`v2.performance_logs`**: The granular data.
    *   *Columns:* `weight`, `reps`, `rpe`, `duration_seconds`, `distance_meters`.

---

## 5. Logic Flow: The Focus Engine

The "Following Shadow" logic is the brain of the Session Logger.

1.  **Initialization:** The app loads the `Session Template` and creates a local `ActiveSession` state.
2.  **Navigation:**
    *   The `systemStep` cursor points to the first incomplete item.
    *   **Standard Block:** Finishes all sets of Exercise A before moving to Exercise B.
    *   **Circuit Block:** Moves Exercise A -> B -> C -> A (Round 2).
3.  **Completion:**
    *   When a set is logged (manually or via timer), the system calculates the next index.
    *   It automatically **Expands** the accordion for the new active block.