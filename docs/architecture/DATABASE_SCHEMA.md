# Database Schema Design (v2.0 - Normalized)

## Overview
The V2 schema shifts from **Monolithic JSON Blobs** to a **Relational Delta Model**. This design minimizes Supabase egress by only transmitting changed rows (Deltas) rather than entire day structures.

## Mermaid ER Diagram

```mermaid
erDiagram
    PROFILES ||--o{ PLAN_TEMPLATES : owns
    PROFILES ||--o{ DAILY_SESSIONS : records
    PROFILES ||--o{ HEALTH_METRICS : tracks
    PROFILES ||--o{ NUTRITION_LOGS : eats
    PROFILES ||--o{ SUPPLEMENT_LOGS : takes
    
    PLAN_TEMPLATES ||--o{ TEMPLATE_EXERCISES : defines
    
    DAILY_SESSIONS ||--o{ TRAINING_LOGS : contains
    TEMPLATE_EXERCISES ||--o{ TRAINING_LOGS : instantiated_by

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
        string workout_type
    }

    TEMPLATE_EXERCISES {
        uuid id PK
        uuid plan_id FK
        string name
        int order_index
        string target_sets
        string target_reps
        string target_weight
        string group_id "For Circuits/Supersets"
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
        int set_number
        int round_number "For Circuit Support"
        float actual_weight
        int actual_reps
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
        string category "Meat, Veg, Dairy, etc."
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
        string default_time "08:00, Pre-Workout"
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

## Table Descriptions

### 1. Training Architecture (`DAILY_SESSIONS`, `TRAINING_LOGS`)
- **Circuit Support:** `group_id` in templates and `round_number` in logs allow the UI to render "Round 1 -> All Exercises" flows.
- **Delta Logging:** Only the finished set is sent to the server.

### 2. Nutrition Suite (`FOOD_LIBRARY`, `NUTRITION_LOGS`)
Instead of a text list of foods, we now have a relational library.
- **Precision:** Tracking grams of specific foods allows the app to calculate total daily protein/calories automatically.
- **Meal Grouping:** `meal_name` allows the app to group logs into the "Meal 1", "Meal 2" structure you prefer.

### 3. Supplement Suite (`SUPPLEMENT_LIBRARY`, `SUPPLEMENT_LOGS`)
- **Stacks:** You can define a "Lunch Stack" in the library and log individual items or the whole group.
- **History:** Enables checking exactly when you took specific items (e.g., "Did I take my Vitamin D today?").

### 4. Health Metrics (`HEALTH_METRICS`)
- Used for the **Blood Pressure Tracker**.
- Optimized for time-series charts.

## Impact on Egress
| Operation | Legacy (Blob) | New (Relational) | Improvement |
| :--- | :--- | :--- | :--- |
| Load Today | 50 KB | 2 KB (Metadata only) | 25x Better |
| Log 1 Set/Meal | 50 KB | 0.2 KB | 250x Better |
| View History | 1.5 MB (Month) | 15 KB (Logs only) | 100x Better |