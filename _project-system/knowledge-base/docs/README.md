# Regimen Pro Documentation

Regimen Pro is a standalone PWA (Progressive Web App) designed for rigorous performance tracking and flexible dietary/supplement management. It is designed to work offline first with seamless Supabase cloud synchronization.

## 📖 Documentation Index

### [1. User Guide](./USER_GUIDE.md)
*   Account Setup & Login
*   Daily performance logging (Checkmarks, Notes)
*   Editing your Nutrition & Supplements schedule
*   Cloud Sync & Data Exports

### [2. System Architecture](./ARCHITECTURE.md)
*   High-level architecture diagrams
*   The "Three Layers of Truth" data resolution logic
*   "System Image" cloud synchronization strategy
*   Data schema and storage keys

### [3. Development Tickets](../features/)
*   [FEATURE-001: Nutrition Flexibility (Completed)](../features/FEATURE-001_Nutrition_Schedule_Flexibility.md)
*   [FEATURE-002: Data Redundancy Optimization (Planned)](../features/FEATURE-002_Data_Redundancy_Optimization.md)

---

## Technical Highlights
*   **Offline-First:** Uses browser LocalStorage for immediate persistence.
*   **Dynamic Overrides:** Supports per-day plan overrides without breaking the underlying weekly schedule.
*   **Self-Healing Sync:** Preference templates travel with history logs, enabling automatic environment reconstruction on fetch.
*   **Zero-Install:** Designed as a single-file HTML application for maximum portability.
