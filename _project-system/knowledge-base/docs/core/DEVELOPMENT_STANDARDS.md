# Development Standards & Conventions

**Version:** V1.5 (Modular)
**Scope:** Frontend Engineering

---

## 1. Directory Structure: Feature-Based
Do **NOT** dump components into a generic `src/components` folder. We use a **Feature-Based** organization.

*   **`features/[feature-name]/`**: Contains the View and its specific sub-components.
    *   *Example:* `features/agenda/MasterAgendaView.jsx`
    *   *Example:* `features/agenda/components/ActivityLogCard.jsx`
*   **`shared/`**: Only for truly global utilities (Hooks, Formatting, UI Primitives like Buttons/Modals).

## 2. Component Pattern: The Orchestrator
Top-level views (e.g., `MasterAgendaView`, `SessionView`) should act as **Orchestrators**.
*   **Responsibility:** Layout, State Passing, Handler connection.
*   **Avoid:** Inline complex logic or massive rendering loops. Delegate to sub-components (`ActivityLogCard`, `SessionBlock`).

## 3. State Management
*   **Store:** `useProgramStore` is the Single Source of Truth.
*   **Local State:** Use `useState` only for UI transients (e.g., `isExpanded`, `showModal`).
*   **Polymorphism:** Do not hardcode "Weight/Reps". Check `metric_type` ('LOAD_REP', 'DURATION', 'DISTANCE') before rendering inputs.

## 4. Styling ("Industrial OS")
*   **CSS Variables:** Use `var(--accent-orange)` and `var(--bg-dark)` from `shared-premium.css`.
*   **Tailwind:** Permitted for layout (flex, grid, padding), but core aesthetics should use the shared variables for consistency.

## 5. Safety
*   **Service Workers:** Never enable SW on `localhost`.
*   **Database:** Use the `v3` schema via the Store. Do not access `v2` or `public` directly unless migrating.