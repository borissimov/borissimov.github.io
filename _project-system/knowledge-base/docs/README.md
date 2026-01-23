# Master Plan: Tactical Training System

**Version:** 1.3.0
**Status:** Live Production

## 📚 System Definitions

To avoid confusion during the migration, the system uses the following terminology:

*   **Regimen Pro (Legacy):** The standalone HTML prototype (`regimen.html`). This is the "Old World" app that is being decommissioned. It uses the `public` schema.
*   **Master Plan (Current):** The modern React application (formerly `RegimenProApp`). This is the "New World" app running on the V2 Relational Engine.

## 🚀 Key Features (Master Plan)

*   **Session Selector:** An intelligent dashboard that highlights the next logical workout in your cycle.
*   **Session Logger:** A focus-first interface that highlights the next required set, automatically collapsing completed sections to keep the workspace clean.
*   **Master Agenda:** A chronological unified timeline of all past training sessions.
*   **Performance Vault:** Deep history view to track volume load and progress on specific exercises.
*   **Health Tracker:** Dedicated logging for Blood Pressure and Heart Rate trends.
*   **Offline-First:** All data is saved instantly to LocalStorage. Syncs to the cloud when online.
*   **Retroactive Logging:** Ability to log past workouts for days you missed.

## 🛠️ Tech Stack

*   **Frontend:** React 18, Vite, Zustand, Tailwind CSS.
*   **Backend:** Supabase (PostgreSQL) with a custom V2 relational schema.
*   **Design:** "Industrial OS" High-Contrast Dark Mode.

## 📂 Project Structure

This repository uses a structured system layer:

*   `src/`: Application Source Code (React components, Logic).
*   `_project-system/`:
    *   `knowledge-base/`: Documentation & Blueprints.
    *   `system-config/`: Auth & Data Templates.
    *   `tooling/`: Migration & Maintenance Scripts.

## ⚡ Quick Start

1.  **Install:** `npm install`
2.  **Dev Server:** `npm run dev`
3.  **Build:** `npm run build`
4.  **Deploy:** `npm run deploy` (Deploys to GitHub Pages)

## 🔮 Future Roadmap
*See `_project-system/knowledge-base/docs/FUTURE/` for design specs on:*
*   Nutrition Logging (Meal Parser)
*   Supplement Stack Tracking