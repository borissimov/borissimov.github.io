# V3 System Map (Live Reference)

**Status:** ACTIVE
**Version:** V1.8.0 (Recovery Module)

---

## 1. Store Architecture (`useProgramStore`)

The store is composed of specialized domain slices to ensure state isolation.

...

### **E. Recovery Module (`sleepSlice`)**
```javascript
{
  activeSleepSession: { startTime: "ISO String" },
  sleepHistory: [],
  startSleep: () => void,
  endSleep: () => Promise<void>,
  updateSleepLog: (id, payload) => Promise<void>,
  deleteSleepLog: (id) => Promise<void>
}
```

---

## 2. Database Schema (`v3` / `v3_dev`)

| Entity | V3 Table | Primary Relation | Logic |
| :--- | :--- | :--- | :--- |
| **Program** | `programs` | `user_id` | Master plans with `archived_at` |
| **Day Slot** | `program_days` | `program_id` | Sequence of slots |
| **Session** | `sessions` | `program_day_id` | **Unique Constraint** on `program_day_id` |
| **Block** | `blocks` | `session_id` | STANDARD or CIRCUIT |
| **Item (Rx)** | `block_items` | `session_block_id` | Prescribed target metrics |
| **Sleep Log**| `sleep_logs` | `user_id` | **New** recovery tracking table |
| **History** | `completed_sessions`| `program_day_id` | execution header |
| **Logs** | `performance_logs` | `completed_session_id` | **Snapshotted** (Includes `exercise_name_snapshot`) |

---

## 3. Key Architectural Rules

1.  **The Snapshot Principle:**
    *   Performance logs MUST store the `exercise_name_snapshot` as plain text.
    *   This ensures history is readable even if the template item is deleted.
2.  **Surgical Persistence:**
    *   Persistence keys are namespaced by environment: `mp-v3-storage-${schema}`.
    *   Only `lastView`, `activeProgramId`, and `activeSession` are persisted to avoid cache pollution.
3.  **Unique Sessions:**
    *   The `sessions` table enforces a `UNIQUE(program_day_id)` constraint to enable reliable surgical upserts during program edits.
4.  **Relationship Hinting:**
    *   PostgREST queries use explicit `!fk_name` hints to resolve ambiguity between multiple foreign keys to the same table.
