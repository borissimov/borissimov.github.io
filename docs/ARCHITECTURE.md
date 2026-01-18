# System Architecture: Regimen Pro PWA

The Regimen Pro PWA is an "Offline-First" application designed for performance tracking and dynamic schedule management. It uses a tiered data resolution strategy and a unique "System Image" synchronization approach.

## 1. High-Level Data Flow

The application manages two types of data: **Performance History** (logs, checkmarks) and **Schedule Configuration** (what you plan to do).

```mermaid
graph TD
    subgraph "Browser / PWA Client"
        UI["User Interface (Tabs/Forms)"]
        State["Runtime State (masterLogs)"]
        Resolver{"getPlanForDate()"}
        LS_LOGS[("LocalStorage: masterLogs")]
        LS_TMPL[("LocalStorage: User Template")]
    end

    subgraph "Supabase Cloud"
        DB[("Table: REGI_daily_logs")]
    end

    %% Initialization
    LS_LOGS -.-> State
    LS_TMPL -.-> Resolver

    %% Rendering Flow
    Resolver --> UI
    State --> Resolver

    %% User Interaction
    UI -- "Toggle Log" --> State
    UI -- "Edit Plan" --> State
    State -- "auto-save" --> LS_LOGS

    %% Sync Flow
    LS_LOGS -- "PUSH: History + Template" --> DB
    DB -- "FETCH: Merge logs + Restore Tmpl" --> LS_LOGS
```

---

## 2. The "Three-Layer" Logic (Plan Resolution)

When a user selects a date, the system must decide which plan (Training/Nutrition/Supps) to display. It follows this priority order:

1.  **Layer 1: Daily Exception (Highest Priority)**
    *   **Stored in:** `masterLogs[dateKey].plan_overrides`
    *   **Purpose:** One-off changes for a specific date (e.g., "Eating out today").
2.  **Layer 2: User Template (Medium Priority)**
    *   **Stored in:** `localStorage['regimen_user_template']`
    *   **Purpose:** The user's custom recurring weekly schedule (e.g., "My new Tuesday fish diet").
3.  **Layer 3: System Default (Lowest Priority)**
    *   **Stored in:** `const DEFAULT_PLAN` (Hardcoded)
    *   **Purpose:** Factory settings and fallback for unconfigured days.

### Resolution Flowchart

```mermaid
flowchart TD
    A[User Selects Date] --> B{Layer 1 Check: <br/>Date Override Found?}
    
    B -- YES --> C[Render Daily Override]
    
    B -- NO --> D{Layer 2 Check: <br/>User Template Found?}
    
    D -- YES --> E[Render Recurring Schedule]
    
    D -- NO --> F[Render System Default]
    
    C --> G[UI Updated]
    E --> G
    F --> G
```

---

## 3. Synchronization Strategy ("System Image" Bundling)

To simplify the backend while ensuring a "Self-Healing" restore process, the app uses a bundling strategy.

*   **Push (Sync):** Every daily log sent to the Supabase `data` column includes a snapshot of the current `regimen_user_template`.
*   **Pull (Fetch):** When fetching, the app iterates through all logs and identifies the most recent one. It extracts the `user_template_snapshot` from that log and restores it to the local environment.

**Benefit:** If you log in on a brand-new device, clicking **FETCH** reconstructs not just your history, but your entire customized weekly schedule automatically.

---

## 4. Key Technical Data
*   **Database Table:** `public.REGI_daily_logs`
*   **Unique Index:** `user_id`, `date`
*   **Primary State Variable:** `masterLogs` (Indexed by ISO date string `YYYY-MM-DD`).
*   **Template Key:** `regimen_user_template` (Indexed by Day of Week `0-6`).

---

## 5. Publication Lifecycle

The project uses a professional separation between source code and production assets.

```mermaid
flowchart TD
    subgraph "Development"
        A[Feature Branch] -- "Commit & Push" --> B[Pull Request]
    end

    subgraph "Staging / Review"
        B -- "Review & Approve" --> C[source branch]
    end

    subgraph "Publication (Manual)"
        C -- "npm run deploy" --> D["Build Engine (Vite)"]
        D -- "Push /dist to main" --> E[main branch]
        E -- "GitHub Pages" --> F((LIVE SITE))
    end

    style F fill:#f29b11,stroke:#000,stroke-width:2px
```

### Steps to Publish:
1.  **Merge PR:** Combine feature code into the `source` branch on GitHub.
2.  **Sync Local:** `git checkout source && git pull`.
3.  **Run Deploy:** Execute `npm run deploy`. This triggers the `predeploy` (build) and pushes the optimized bundle to the `main` branch.
