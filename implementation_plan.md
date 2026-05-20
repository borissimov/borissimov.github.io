# Updated Implementation Plan - Medical Dashboard Restructure V3

This plan incorporates user feedback regarding Galaxy A41 mobile viewport issues (navigation lock and missing/broken brightness/contrast controls).

---

## User Review Required

> [!IMPORTANT]
> Please review the proposed V3 mobile fixes before approval.

We propose the following updates:
1.  **Always-Visible Navigation Bar on Mobile:**
    *   Move the `.mobile-nav-bar` from inside the `.dossier-panel` to the root `.app-container` level.
    *   This ensures that on mobile, the navigation tab bar is sticky at the bottom of the screen at all times, allowing the patient/doctor to easily switch back from the "Viewer" to the "Dossier".
2.  **Floating overlay controls for Image Adjustments:**
    *   Remove the dedicated height-consuming `.image-adjust-controls` block.
    *   Implement a floating, semi-transparent toolbar (`.image-adjust-overlay`) positioned at the bottom of the X-ray viewer image area.
    *   This overlay will feature clean, horizontal sliders for brightness and contrast. It leaves 100% of the screen height for the actual X-ray image, preventing vertical scroll lock/clipping on small screens like Galaxy A41.
3.  **Reverse Chronological Timeline (Newest First):**
    *   List the 2026 CT scan at the top of the timeline and scale down to the May 2025 Day 0 fracture.
4.  **Default View on Load:**
    *   Automatically load the 2026 CT report in the right pane when the site opens.
5.  **Dedicated "Imaging Studies" Tab:**
    *   A structured tab highlighting the CT Scan (2026), MRI Scan (2025), and all X-ray series in one place.
6.  **Full Backup:**
    *   Backup the current version to `index.v19.bak.html` prior to code modifications.

---

## Verification Plan

*   **Mobile Lock Check:** Verify that on screen widths <= 1024px, the bottom nav bar remains visible in both Dossier and Viewer modes.
*   **Aadjustments Overlay Check:** Check that the brightness/contrast sliders are overlayed on the image and are touch-responsive on mobile viewports.
*   **Timeline & Studies Tab Check:** Verify reverse ordering and proper study loading.
