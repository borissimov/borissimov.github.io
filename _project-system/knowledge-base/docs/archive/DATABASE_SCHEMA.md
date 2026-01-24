# Database Schema Design (v2.0 - Block Architecture)

## Overview
The V2 schema utilizes a **Block-Based Relational Model**. This allows for complex workout structures (multiple circuits, supersets, and standard sets) while maintaining the **Relational Delta Model** to minimize Supabase egress.

## Mermaid ER Diagram

```mermaid
erDiagram
    PROFILES ||--o{ PLAN_TEMPLATES : owns
    PROFILES ||--o{ DAILY_SESSIONS : records
    PROFILES ||--o{ HEALTH_METRICS : tracks
    PROFILES ||--o{ NUTRITION_LOGS : eats
    PROFILES ||--o{ SUPPLEMENT_LOGS : takes
    
    PLAN_TEMPLATES ||--o{ TEMPLATE_BLOCKS : "organized into"
    TEMPLATE_BLOCKS ||--o{ TEMPLATE_EXERCISES : "contains"
    
    DAILY_SESSIONS ||--o{ TRAINING_LOGS : contains
    TEMPLATE_EXERCISES ||--o{ TRAINING_LOGS : logs

    FOOD_LIBRARY ||--o{ NUTRITION_LOGS : "logged as"
    SUPPLEMENT_LIBRARY ||--o{ SUPPLEMENT_LOGS : "logged as"

    PROFILES {
        uuid id PK
        string full_name
        string settings_json
        timestamp updated_at
    }

    PLAN_TEMPLATES {
        uuid id PK
        uuid user_id FK
        int day_of_week
        string focus_label
    }

    TEMPLATE_BLOCKS {
        uuid id PK
        uuid plan_id FK
        int order_index
        string block_type "STANDARD, CIRCUIT, SUPERSET"
        string label "e.g., 'Main Circuit', 'Finisher'"
    }

    TEMPLATE_EXERCISES {
        uuid id PK
        uuid block_id FK
        string name
        int order_index
        string target_sets
        string target_reps
        string target_weight
        string metadata_json "Tempo, Hints"
    }

    DAILY_SESSIONS {
        uuid id PK
        uuid user_id FK
        date scheduled_date
        timestamp start_time
        timestamp end_time
        text notes
    }

    TRAINING_LOGS {
        uuid id PK
        uuid session_id FK
        uuid exercise_id FK
        int round_number "For Circuit Support"
        int set_number "1, 2, 3..."
        float weight
        int reps
        int rpe
        timestamp created_at
    }

    HEALTH_METRICS {
        uuid id PK
        uuid user_id FK
        timestamp measured_at
        string metric_type "BP_SYS, BP_DIA, HR, WEIGHT"
        float value
        text tags
    }

    FOOD_LIBRARY {
        uuid id PK
        string name
        float protein_per_100g
        float carbs_per_100g
        float fats_per_100g
        float calories_per_100g
    }

    NUTRITION_LOGS {
        uuid id PK
        uuid user_id FK
        date consumed_at
        uuid food_id FK
        float amount_grams
        string meal_name "Meal 1, Refeed, etc."
    }

    SUPPLEMENT_LIBRARY {
        uuid id PK
        string name
        string unit "cap, scoop, tab"
    }

    SUPPLEMENT_LOGS {
        uuid id PK
        uuid user_id FK
        date consumed_at
        uuid supplement_id FK
        float dosage
        boolean is_taken
    }
```

## Core Design Logic

### 1. Training "Blocks"
This is the most critical feature for the **Routine Editor** and **Circuit Training**.
- Exercises are no longer flat lists. They belong to **Blocks**.
- A single Day can have multiple Blocks (e.g., Standard Warmup -> Circuit 1 -> Standard Heavy Lift -> Circuit 2).
- **UI Progress:** The logger uses the `order_index` of `TEMPLATE_BLOCKS` to show "Circuit 1 of 3" headers.

### 2. High-Efficiency Circuits
- When `block_type = CIRCUIT`, the React UI renders the vertical "Round-Based" logging flow.
- The `TRAINING_LOGS` table explicitly stores the `round_number`, ensuring your history knows exactly how you cycled through the circuit.

### 3. Nutrition & Supplements
- **Relational Libraries:** Moving away from text blobs to a `FOOD_LIBRARY` ensures macro-calculation accuracy.
- **Compliance Tracking:** `SUPPLEMENT_LOGS` allows for per-item "Taken" tracking rather than just a daily "Done" flag.

## Impact on Egress
| Operation | Legacy (Blob) | New (Relational) |
| :--- | :--- | :--- |
| **Log 1 Set** | 50 KB (Whole Day) | **0.2 KB** (1 Row) |
| **Switch Days** | 50 KB (Whole Day) | **0.5 KB** (Session Meta) |
| **Check Supplement** | 50 KB (Whole Day) | **0.1 KB** (Boolean Flag) |
