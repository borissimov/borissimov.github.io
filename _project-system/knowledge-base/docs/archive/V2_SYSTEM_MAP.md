# V2 System Map (The Baseline)

**Goal:** Document the exact data shapes and component contracts of the stable V2 application to guide the Adapter Refactor.
**Source:** Live Database Inspection & Source Code Analysis (Jan 23, 2026).

---

## 1. Store State (`useTrainingStore`)

### **A. `activeSession` (The core execution object)**
This object is constructed in `startSession` and persisted in local storage (`mp-training-storage-v33`).

```javascript
{
  id: "uuid",
  startTime: "ISO Date String",
  routine_day_id: "uuid", // Foreign Key to routine_days
  isRestDay: boolean,
  workoutNotes: string, // Mapped from workouts.workout_notes
  
  // LOGS (State of execution)
  // Key: block_exercise_id
  logs: {
    [exerciseId]: [
      {
        id: number, // timestamp
        weight: string,
        reps: number,
        rpe: number,
        set: number // implied by index
      }
    ]
  },

  // BLOCKS (The Template)
  blocks: [
    {
      id: "uuid", // workout_block.id
      label: "string", // e.g. "Warm Up", "Main Phase"
      block_type: "STANDARD" | "CIRCUIT",
      
      // EXERCISES (Nested Items)
      exercises: [
        {
          id: "uuid", // block_exercise.id (NOT exercise_library.id)
          name: "string", // Mapped from exercises.name
          technique: "string", // Mapped from exercises.technique_notes
          
          // TARGETS
          target_sets: number,
          target_reps: string,
          target_weight: string,
          target_rpe: string,
          target_tempo: string,
          
          set_targets: JSON | null, // Advanced per-set targets
          sort_order: number
        }
      ]
    }
  ]
}
```

---

## 2. Component Contracts

### **A. `TrainingBlock.jsx`**
*   **Props:**
    *   `block`: The block object defined above.
    *   `index`: number.
    *   `totalBlocks`: number.
*   **Dependency:** `useTrainingStore` (expandedBlockId).
*   **Internal Logic:** Calculates completion stats based on `block.exercises`.

### **B. `StandardBlock.jsx`**
*   **Props:**
    *   `block`: The block object.
*   **Render:** Maps over `block.exercises` -> `<SequentialSetLogger />`.

### **C. `CircuitBlock.jsx`**
*   **Props:**
    *   `block`: The block object.
*   **Render:** Maps over `block.exercises` -> `<ExerciseRow />`.

### **D. `SequentialSetLogger.jsx`** (Used in Standard)
*   **Props:**
    *   `exercise`: The exercise object.
    *   `blockId`: uuid.
*   **State:** Local state for `weight`, `reps`, `rpe`.
*   **Action:** Calls `addLogEntry`.

### **E. `ExerciseRow.jsx`** (Used in Circuit)
*   **Props:**
    *   `exercise`: The exercise object.
    *   `blockId`: uuid.
*   **State:** Local state for `weight`, `reps`, `rpe`.
*   **Action:** Calls `addLogEntry`.

---

## 3. Database Schema (V2 Live Inspection)

The following tables are the "Source of Truth" for the Adapter.

| Table | Critical Columns |
| :--- | :--- |
| **`v2.routines`** | `id`, `name`, `loop_length` |
| **`v2.routine_days`** | `id`, `routine_id`, `sequence_number`, `label` |
| **`v2.workouts`** | `id`, `routine_day_id`, `workout_notes` (becomes `session_focus`) |
| **`v2.workout_blocks`** | `id`, `workout_id`, `label`, `block_type`, `sort_order` |
| **`v2.block_exercises`** | `id`, `block_id`, `exercise_id`, `target_sets`, `target_reps`, `target_weight`, `target_rpe`, `target_tempo`, `set_targets` |
| **`v2.exercises`** | `id`, `name`, `technique_notes` |

---

## 4. The Adapter Strategy

To move to V3 without breaking the database connection, we must implement a **Translation Layer** in `useProgramStore.js`.

### **Mapping Logic**

We will fetch from V2 tables but return V3 objects.

**Entity: Session (Workout)**
```javascript
// Fetch
const { data: v2Workout } = await supabase.from('workouts')...

// Map
const v3Session = {
  id: v2Workout.id,
  sessionFocus: v2Workout.workout_notes, // RENAME
  // ...
}
```

**Entity: Block**
```javascript
// Map
const v3Block = {
  id: v2Block.id,
  items: v2Block.exercises.map(...) // RENAME: exercises -> items
}
```

**Entity: Item (Exercise)**
```javascript
// Map
const v3Item = {
  id: v2BlockExercise.id,
  technique_cues: v2Exercise.technique_notes, // RENAME
  tempo: v2BlockExercise.target_tempo, // RENAME
  // ...
}
```

**Critical Action:** The refactored components (`SessionBlock`, `SessionLogger`) will **ONLY** accept the V3 shape (`block.items`, `item.technique_cues`). The Store is responsible for the transformation.
