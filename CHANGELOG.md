# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2026-01-26

### Added
- **Surgical JSON Backup Engine:** Automated multi-schema snapshotting tool for `v3` and `v3_dev`.
- **The Vault:** Dedicated archival directory `_project-system/archives/db-backups/` for timestamped database states.
- **npm run backup-db:** Simplified command-line interface for manual and automated backups.
- **Service Role Integration:** Configured secure `.env` protocol to bypass RLS for administrative data preservation.
- **Push Notification Support:** Added VAPID keys to `.env` for future edge function integration.

### Security
- **Credential Hardening:** Excluded `database_access.txt` from git tracking and updated `.gitignore` to prevent accidental exposure of master secrets.

## [1.6.0] - 2026-01-26

### Added
- **Sandbox Mode (v3_dev):** Fully isolated database playground mirrored from production for safe experimentation.
- **Environment Switcher:** Hub-level control to toggle between **PROD** and **SANDBOX** schemas with automatic reload.
- **Relational Integrity Restore:** Custom scripts to re-establish Foreign Keys and permissions within the cloned dev schema.
- **App-wide Environment HUD:** Standardized "Sandbox Mode" visual indicators across all headers for constant context awareness.
- **Safe Archiving:** Soft-delete "Graveyard" functionality implemented for program templates to preserve historical logs.

### Fixed
- **Relationship Errors (PGRST200):** Resolved missing PostgREST relationship cache in dev schema by restoring FKs.
- **Permission Denied (42501):** Granted explicit schema usage and table privileges to `anon` and `authenticated` roles in v3_dev.
- **Session Header Regression:** Restored the Timer, Progress Bar, and Abandon button in the Session Logger while integrating the Sandbox indicator.
- **Navigation Persistence:** Hardened `navState` propagation to ensure program editing context survives page refreshes.

## [1.3.0] - 2026-01-25

### Added
- **Native V3 Program Builder:** A hierarchical accordion-style editor for creating training programs with days, sessions, and standard/circuit blocks.
- **Program Context Switcher:** A dynamic header dropdown in the Library to switch between different training programs.
- **Program Editing:** Ability to modify existing programs with deep hydration of nested days and exercises.
- **Safe Archiving (Soft Delete):** Mechanism to archive programs to reduce clutter while preserving all historical performance data in the Master Agenda.
- **Unarchive/Restore:** A "Graveyard" toggle in the program switcher to view and restore archived programs.
- **Database Schema (V3):** Added `user_id` and `archived_at` columns to the `programs` table to support multi-user ownership and archiving.
- **Formalized Project System:** Established the `_project-system/` directory with Developer Protocol, System Context, and Project Wisdom documentation.

### Changed
- **Renaming:** Standardized terminology; renamed "Dashboard" to **"Library"** and "Activity Log" to **"Completed Session Card"**.
- **Modularization:** Refactored the core engine into granular feature directories (`agenda`, `builder`, `library`, `session`) for better maintainability.

### Fixed
- **Circuit Progressive Focus:** Corrected logic for advancing focus round-robin across circuit items.
- **Session Metrics:** Restored volume and intensity calculations using V3 field mappings.
- **Navigation Persistence:** Updated root `App.jsx` to correctly pass and persist `navState` (including `programId`) across refreshes.
- **Library Selection Reset:** Ensured the Library selection is reset when entering to provide a clean state.

## [1.2.0] - 2026-01-24

### Added
- **V3 Relational Engine:** Initial migration to the Native V3 relational schema for training data.
- **Master Agenda View:** High-density tactical calendar for tracking and preparing training sessions.
- **Retroactive Logging:** Ability to prepare and log workouts for past dates directly through the Library.
- **V3 Frontend Adapter:** Implemented a bridge allowing V3 UI components to function with the legacy V2 backend during transition.

### Security
- **Zombie Service Worker Protection:** Re-applied protections to prevent stale service workers from corrupting training data on reload.

## [1.1.0] - 2026-01-23

### Added
- **Active Session Visibility:** Persistent banner in the Master Agenda for quick access to in-progress workouts.
- **Context-Aware Navigation:** Store-level persistence of `lastView` to ensure intuitive "Back" button behavior.

### Changed
- **Industrial UI Overhaul:** Transitioned to high-density dark aesthetic with orange and green tactical highlights.

### Removed
- **Dependency Cleanup:** Removed heavy libraries (`date-fns`, `tailwind-merge`, `pg`) in favor of native JS utilities to reduce bundle size and improve performance.

## [1.0.0] - 2026-01-18

### Added
- **Cloud Sync Engine:** Supabase integration for authenticated cross-device training data synchronization.
- **3-Layer Data Architecture:** Implementation of the resolution hierarchy: Daily Overrides > User Templates > System Defaults.
- **Nutrition & Supplement Flexibility:** Added full cycle and daily schedule customization for nutrition and supplements.
- **AI-Ready Exports:** Self-describing JSON export logic for performance analysis by Large Language Models.
- **Weekly Update Tooling:** Python-based surgical update system for weekly training regimen rotations.