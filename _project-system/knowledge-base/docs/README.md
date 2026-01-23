# Master Plan: Tactical Training System

**Version:** 1.3.0
**Status:** Live Production

The **Master Plan** is a specialized PWA for tracking high-performance hypertrophy training. It features an intelligent "Focus Engine" that guides users through complex workouts (Standard and Circuit) with zero distraction.

## 🚀 Key Features

*   **Focus-First Logger:** An intelligent interface that highlights the next required set, automatically collapsing completed sections to keep the workspace clean.
*   **Offline-First:** All data is saved instantly to LocalStorage. Syncs to the cloud when online.
*   **Unified Timeline:** A chronological feed of all past training sessions.
*   **Performance Vault:** Deep history view to track volume load and progress on specific exercises.
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
*   Health Metrics (Blood Pressure)
