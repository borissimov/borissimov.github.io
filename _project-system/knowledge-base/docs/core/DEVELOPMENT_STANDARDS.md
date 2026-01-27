# Development Standards & Conventions

**Version:** V1.7.1 (Modular Orchestrator)
**Scope:** Frontend Engineering

---

## 1. Directory Structure: Domain-Driven
We use a **Feature-Based** organization for UI and a **Slice-Based** organization for logic.

*   **`features/[feature-name]/`**: Contains the View (Orchestrator) and its sub-components.
*   **`stores/slices/`**: Contains the domain logic modules.
*   **`services/`**: Centralized, schema-aware database repositories.

## 2. Component Pattern: The Decentralized Orchestrator
Top-level views (e.g., `MasterAgendaView`, `LibraryView`) are **Orchestrators**.
*   **Responsibility:** They MUST manage their own internal UI state (selected dates, tabs, local flags).
*   **Direct Store Access:** Orchestrators consume specific store slices directly to minimize prop-drilling from the root.

## 3. State Management: The Slice Pattern
*   **Encapsulation:** Never add logic to the root `useProgramStore.js`. Add it to the relevant domain slice.
*   **Persistence:** Only persist volatile session state and navigation context. Static reference data should be re-fetched.
*   **Standardized Dates:** Always use `toLocaleDateString('en-CA')` (YYYY-MM-DD) for logic comparisons to ensure timezone resilience.

## 4. History Preservation: The Snapshot Rule
*   **Immutability:** Performance history must NEVER depend solely on a program template ID.
*   **Baking Logic:** When finishing a session, "bake" the exercise name and target strings directly into the `performance_logs` record.
*   **Fallbacks:** Read logic MUST attempt a relational join first but provide a clean fallback to the snapshotted text.

## 5. Styling ("Industrial OS")
*   **Typography:** Bold uppercase labels (900 weight) for headers. Monospace fonts for numbers, timers, and metrics.
*   **Density:** Prefer high-density grids and compact rows over sparse layouts.
*   **Mobile First:** Builder inputs must use `flex-wrap` to support narrow viewports (e.g., Galaxy A41).

## 6. Safety & Data Integrity
*   **Surgical Save:** Program editing MUST use ID-based diffing. Never use "Delete-All-and-Reinsert" patterns for relational data.
*   **Shielded Keys:** Foreign keys from logs to templates MUST use `ON DELETE SET NULL`.
*   **PostgREST Hints:** Use explicit relationship hints (e.g., `!fk_name`) in joins to avoid ambiguous relationship errors.
