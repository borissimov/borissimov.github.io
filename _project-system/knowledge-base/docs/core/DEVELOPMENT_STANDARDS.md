# Development Standards & Conventions

**Version:** V1.6 (Multi-Program)
**Scope:** Frontend Engineering

---

## 1. Directory Structure: Feature-Based
Do **NOT** dump components into a generic `src/components` folder. We use a **Feature-Based** organization.

*   **`features/[feature-name]/`**: Contains the View and its specific sub-components.
    *   *Example:* `features/agenda/MasterAgendaView.jsx`
    *   *Example:* `features/builder/ProgramEditorView.jsx`
*   **`shared/`**: Only for truly global utilities (Hooks, Formatting, UI Primitives like Buttons/Modals).

## 2. Component Pattern: The Orchestrator
Top-level views (e.g., `MasterAgendaView`, `SessionView`) should act as **Orchestrators**.
*   **Responsibility:** Layout, State Passing, Handler connection.
*   **Context:** Use the unified `navState` object to pass extra metadata (like `programId` or `date`) through the navigation chain.

## 3. State Management
*   **Store:** `useProgramStore` is the Single Source of Truth for training data.
*   **Multi-Program Context:** All training day resolution MUST be filtered by the `activeProgramId` in the store.
*   **Polymorphism:** Do not hardcode "Weight/Reps". Check `metric_type` ('LOAD_REP', 'DURATION', 'DISTANCE') before rendering inputs.

## 4. Styling ("Industrial OS")
*   **CSS Variables:** Use `var(--accent-orange)` and `var(--bg-dark)` from `shared-premium.css`.
*   **Tailwind:** Permitted for layout (flex, grid, padding), but core aesthetics should use the shared variables for consistency.

## 5. Safety & Data Integrity
*   **Never Hard-Delete:** Do not delete program templates. Use the `archived_at` column to hide them from the UI. This prevents orphaning historical workout logs.
*   **UAT Gate:** No features are merged to `main` without a visual sign-off from the user.
*   **Service Workers:** Never enable SW on `localhost` to avoid stale state caching issues.