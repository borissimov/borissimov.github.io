# V3 System Map (The Current Reality)

**Goal:** Document the architecture of the Native V3 Professional Athletic Model.
**Activated:** Jan 23, 2026.

---

## 1. Store State (`useProgramStore`)

### **A. `activeSession`**
```javascript
{
  id: "uuid",
  startTime: "ISO Date String",
  program_day_id: "uuid", // Foreign Key to v3.program_days
  isRestDay: boolean,
  sessionFocus: string, // Mapped from v3.sessions.session_focus
  
  logs: {
    [itemId]: [
      {
        id: number, // timestamp
        weight: string,
        reps: number,
        rpe: number,
        duration_seconds: number, // NEW
        distance_meters: number, // NEW
        set: number 
      }
    ]
  },

  blocks: [
    {
      id: "uuid", // v3.blocks.id
      label: "string",
      block_type: "STANDARD" | "CIRCUIT",
      
      items: [
        {
          id: "uuid", // v3.block_items.id
          name: "string", // v3.exercise_library.name
          technique_cues: "string", // v3.exercise_library.technique_cues
          metric_type: "LOAD_REP" | "DURATION" | "DISTANCE",
          
          target_sets: number,
          target_reps: string,
          target_weight: string,
          target_rpe: string,
          tempo: string,
          
          set_targets: JSON | null, 
          sort_order: number
        }
      ]
    }
  ]
}
```

---

## 2. Database Schema (`v3` Schema)

| Entity | V3 Table | Primary Relation |
| :--- | :--- | :--- |
| **Program** | `v3.programs` | Top Level |
| **Day Slot** | `v3.program_days` | `program_id` |
| **Session** | `v3.sessions` | `program_day_id` |
| **Block** | `v3.blocks` | `session_id` |
| **Item (Rx)** | `v3.block_items` | `session_block_id` |
| **Library** | `v3.exercise_library`| Reference |
| **Session (Log)**| `v3.completed_sessions`| `session_id`, `program_day_id` |
| **Log Entry** | `v3.performance_logs` | `completed_session_id`, `block_item_id` |

---

## 3. Key Rules & Filters

1.  **Ghost Block Filtering:**
    *   The Store explicitly excludes any blocks where the label starts with `HISTORY` or `ARCHIVED`. These are artifacts of the V2 legacy system.
2.  **Metric Polymorphism:**
    *   The `MetricInput` component switches UI based on `item.metric_type`.
    *   `DURATION` items enable the Stopwatch.
3.  **Local Dev Safety:**
    *   Service Workers are automatically unregistered on `localhost` or port `5173`.
    *   `sw.js` ignores any fetch event with `hostname: localhost`.
