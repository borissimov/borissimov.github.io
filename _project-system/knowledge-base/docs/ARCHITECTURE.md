# Master Plan Architecture

## Overview
Master Plan is a multi-app suite built on a **Dashboard-First** architecture. The root application serves as a **Hub (Container)** that orchestrates specialized functional modules.

## System Components

### 1. The Hub (Container)
- **Role:** Primary entry point, authentication gateway, and app launcher.
- **Isolation Strategy:** Uses an internal router to switch between micro-apps. Each app is logically sandboxed in `src/apps/`.
- **Legacy Support:** The "Legacy Tracker" is isolated within its own folder and styles to prevent technical debt from affecting new features.

### 2. Shared Core (`src/`)
To maintain a "Single Source of Truth" and reduce egress, the following are shared across all apps:
- **`context/`**: Global state (User Session, Profile).
- **`data/`**: Central DataManager and Supabase Client.
- **`hooks/`**: Common logic (Timers, Persistence).
- **`constants/`**: Unified design tokens (Colors, Spacing).

### 3. App Modules
- **Regimen Flow:** The next-gen training logger (Ported from HTML).
- **Health Tracker:** Specialized metrics logging (Blood Pressure, HR).
- **Legacy Tracker:** The original React dashboard (Archive mode).

## Data & Egress Strategy
The system has transitioned from a **Monolithic Blob Model** to a **Relational Delta Model**. 
- **Local-First:** All actions are saved to the Zustand persistent store instantly.
- **Background Sync:** Tiny "Deltas" (single rows) are synced to Supabase, reducing data usage by >95%.