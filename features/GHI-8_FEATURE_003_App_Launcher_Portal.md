---
gh_issue_number: 8
title: "FEATURE-003 App Launcher Portal"
---

Implemented a unified landing page (index.html) that acts as an app launcher for Regimen Pro and Master Plan Dashboard. 

**Completed Logic Improvements:**
*   **Persistent Preference:** User default app selection is now saved across logout/login sessions.
*   **Smart Auto-Launch:** Portal automatically redirects to the default app upon login or fresh page load if a preference exists.
*   **Select Mode Bypass:** Added '?select=true' support to bypass auto-redirection, allowing users to return to the dashboard to switch apps.
*   **Clean Session Management:** Logout reloads to a clean root URL to prevent redirection loops.