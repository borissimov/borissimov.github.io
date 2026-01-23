# Master Plan: High-Performance Training System

**Version:** 1.4.1
**Status:** Live Production

The **Master Plan** is a professional **Prescription vs. Performance** system designed for elite-level tracking of training and recovery.

## 🚀 Key Modules

*   **Session Selector:** View your **Training Program** and identify your next prescribed session.
*   **Performance Logger:** A focus-first execution interface that provides **Execution Instructions** and **Technique Cues** while tracking your performance in real-time.
*   **Master Agenda:** A chronological history of **Completed Sessions**, providing data-driven insights into your progression.
*   **Health Tracker:** Dedicated module for monitoring vital signs (Blood Pressure, Heart Rate).

## 📚 System Definitions

*   **Training Program:** The macro-cycle governing your schedule.
*   **Program Day:** The daily container. A single day might include a Training Session and a Mobility Session.
*   **Session:** A specific prescribed activity (e.g. "Upper Body Power").
*   **Performance Log:** The immutable record of what you actually achieved.

## 📂 Project Organization

*   `src/`: Application logic and athletic UI.
*   `_project-system/`:
    *   `knowledge-base/`: Architecture, Design, and Domain logic.
    *   `system-config/`: Secure configurations and data blueprints.
    *   `tooling/`: Database migrations and maintenance scripts.

## ⚡ Quick Start

1.  **Install:** `npm install`
2.  **Dev Server:** `npm run dev`
3.  **Deploy:** `npm run deploy` (Build and push to production)