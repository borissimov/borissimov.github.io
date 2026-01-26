# V3 System Map (Live Reference)

**Status:** ACTIVE
**Version:** V1.6 (Multi-Program Relational)

---

## 1. Store State (`useProgramStore`)

The store handles relational data across multiple training plans.

### **A. Global Context**
```javascript
{
  programs: [], // Fetched non-archived programs
  activeProgramId: "uuid", // Current selection
  showArchivedPrograms: boolean, // Graveyard visibility toggle
  programDays: [], // Days filtered by activeProgramId
}
```

### **B. `activeSession`**
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
        duration_seconds: number,
        distance_meters: number,
        set: number 
      }
    ]
  },

  blocks: [] // Prescribed structure
}
```

---

## 2. Database Schema (`v3` Schema)

| Entity | V3 Table | Relation | Logic |
| :--- | :--- | :--- | :--- |
| **Program** | `v3.programs` | Top Level | `user_id` owner, `archived_at` soft-delete |
| **Day Slot** | `v3.program_days` | `program_id` | Sequence of days |
| **Session** | `v3.sessions` | `program_day_id` | Workout definition |
| **Block** | `v3.blocks` | `session_id` | `STANDARD` or `CIRCUIT` types |
| **Item (Rx)** | `v3.block_items` | `session_block_id` | Granular exercise prescription |
| **Library** | `v3.exercise_library`| Reference | Exercise metadata and cues |
| **Session (Log)**| `v3.completed_sessions`| `program_day_id` | Historical execution link |
| **Log Entry** | `v3.performance_logs` | `completed_session_id` | Set-granular data |

---

## 3. Key Rules & Filters

1.  **The "Archive" Principle:**
    *   Template deletion is prohibited to prevent data corruption.
    *   Query `v3.programs` with `is('archived_at', null)` for active view.
2.  **Deep Hydration Pattern:**
    *   The Builder loads nested data via multi-level join fetching (`program_days -> sessions -> blocks -> block_items`).
3.  **Metric Polymorphism:**
    *   UI inputs adapt dynamically based on `item.metric_type` ('LOAD_REP', 'DURATION', 'DISTANCE').
4.  **Relational Stability:**
    *   Program edits use `upsert` for the master record.
    *   Child records are replaced/updated while maintaining parent IDs.