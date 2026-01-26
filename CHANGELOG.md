# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-01-25

### Added
- **Native V3 Program Builder:** A hierarchical accordion-style editor for creating training programs with days, sessions, and standard/circuit blocks.
- **Program Context Switcher:** A dynamic header dropdown in the Library to switch between different training programs.
- **Program Editing:** Ability to modify existing programs with deep hydration of nested days and exercises.
- **Safe Archiving (Soft Delete):** Mechanism to archive programs to reduce clutter while preserving all historical performance data in the Master Agenda.
- **Unarchive/Restore:** A "Graveyard" toggle in the program switcher to view and restore archived programs.
- **Database Schema (V3):** Added `user_id` and `archived_at` columns to the `programs` table to support multi-user ownership and archiving.

### Fixed
- **Navigation Persistence:** Updated root `App.jsx` to correctly pass and persist `navState` (including `programId`) across refreshes.
- **Program Meta Data:** Fixed `cycle_length` calculation to dynamically match the number of days in a program.
- **Library Filtering:** Ensured the Library only shows days belonging to the active program.

## [1.2.0] - 2026-01-24

### Added
- **V3 Relational Engine:** Initial migration to the Native V3 relational schema for training data.
- **Master Agenda View:** High-density tactical calendar for tracking and preparing training sessions.
- **Retroactive Logging:** Ability to prepare and log workouts for past dates.

### Fixed
- **Circuit Progressive Focus:** Corrected logic for advancing focus round-robin across circuit items.
- **Session Metrics:** Restored volume and intensity calculations using V3 field mappings.
