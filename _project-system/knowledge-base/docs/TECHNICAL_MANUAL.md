# Master Plan: Technical Reference Manual

**Version:** 1.4.3 (Component Specifications Added)
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

## 4. Component Specifications (Frontend V3)

The following components implement the athletic domain model.

### **A. `SessionBlock.jsx` (Container)**
*   **Role:** The visual container for a specific phase of the workout (e.g., "Warm Up" or "Main Lift").
*   **Behavior:** Implements the **Accordion** logic.
    *   *Collapsed:* Shows summary stats ("3/12 Sets").
    *   *Expanded:* Renders the list of exercises.
*   **Responsibility:** It delegates the rendering logic to either `LinearBlock` (Standard) or `CircuitBlock` based on `block.type`.

### **B. `SessionLogger.jsx` (The Input Engine)**
*   **Role:** The interactive form for logging performance.
*   **State:** Local state for `weight`, `reps`, `rpe`, `time` (transient before save).
*   **Polymorphism:** Checks `exercise.metric_type` to decide whether to render:
    *   `NumericInput` (Weight/Reps)
    *   `TimerInput` (Play/Pause button + Display)
*   **Action:** On "Check" (Save), it calls `store.addLogEntry` and triggers the Focus Engine to calculate the next step.

### **C. `BlockItemRow.jsx` (The Display)**
*   **Role:** Represents a single exercise within a block.
*   **Visuals:**
    *   **Left:** Exercise Name + Set Counter (`1/4`).
    *   **Right:** The **Prescription** (Target Weight, Reps, Tempo).
*   **State:** Displays "Green" when completed, "Orange" when focused (active), "Gray" when pending.

---

## 5. Database Schema: The V3 Map

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

## 6. Logic Flow: The Focus Engine

The "Following Shadow" logic is the brain of the Session Logger.

1.  **Initialization:** The app loads the `Session Template` and creates a local `ActiveSession` state.
2.  **Navigation:**
    *   The `systemStep` cursor points to the first incomplete item.
    *   **Linear Block:** Finishes all sets of Exercise A before moving to Exercise B.
    *   **Circuit Block:** Moves Exercise A -> B -> C -> A (Round 2).
3.  **Completion:**
    *   When a set is logged (manually or via timer), the system calculates the next index.
    *   It automatically **Expands** the accordion for the new active block.

---

## 7. Service Worker Configuration & Safety Mechanisms

### 7.1 The "Zombie SW" Protection
During the V3 migration (Jan 2026), a critical issue arose where an outdated Service Worker (`sw.js`) cached broken assets and blocked local development (`localhost`), causing a permanent white screen.

To prevent this, two safety mechanisms were hard-coded into the application entry points.

#### A. The Kill Switch (`index.html`)
The application is configured to **immediately unregister** any active Service Worker if it detects a local environment. This runs synchronously before the window `load` event to ensure the Service Worker is removed even if the app crashes.

```javascript
// index.html logic
const isLocal = window.location.hostname === 'localhost' || ...;
if (isLocal) {
    navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(reg => reg.unregister()); // KILL
    });
}
```

#### B. The Stand-Down Order (`sw.js`)
The Service Worker file itself contains a guard clause to ignore fetch events from localhost. This prevents a registered SW from intercepting dev server requests (HMR, Vite).

```javascript
// public/sw.js
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.hostname === 'localhost') return; // STAND DOWN
    // ...
});
```

### 7.2 Negative Impact & Reversal
**Impact:** PWA features (Offline Mode, Install Prompt) are **DISABLED** in local development. You cannot test offline functionality on `localhost`.

**How to Reverse (Enable PWA Locally):**
If you need to test offline capabilities locally:
1.  Open `index.html`.
2.  Comment out the `if (isLocal) { unregister... }` block.
3.  Open `public/sw.js`.
4.  Comment out the `if (url.hostname === 'localhost') return;` guard clause.
5.  **Warning:** This may re-introduce the "Zombie SW" issue if the SW caches broken assets. Use "Update on Reload" in DevTools > Application > Service Workers to mitigate this.
