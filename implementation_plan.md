# Updated Implementation Plan - Medical Dashboard Restructure V4

This plan addresses layout bugs on Galaxy A41, CSS overlap rendering bugs in the media viewer pane, and event bubbling for online DICOM study links.

---

## User Review Required

> [!IMPORTANT]
> Please review the proposed V4 fixes before approval.

We propose the following updates:
1.  **Fix Galaxy A41 Horizontal Overflow:**
    *   Set `min-width: 0;` on `.dossier-panel` inside the mobile media query (`max-width: 1024px`). This allows the panel to correctly shrink to 360px on Galaxy A41 without clipping or horizontal scroll.
2.  **Fix Media Viewer Split Pane Layout Bug:**
    *   Currently, when a PDF report is loaded, the welcome/placeholder panel ("Medical Viewing Panel") stays visible side-by-side because it lacks a `display: none` rule when inactive.
    *   Modify the CSS so that `.welcome-container` is set to `display: none` by default and `display: flex` only when it has the `.active` class. This allows the loaded PDF or X-rays to take 100% of the right pane's screen size.
3.  **Fix DICOM Links and Click Bubbling:**
    *   Remove `onclick="loadPDF('CT' | 'MRI')"` from the parent `.study-card` containers to prevent click bubbling.
    *   Bind the `onclick="loadPDF(...)"` handler specifically to the "View Report PDF" text span.
    *   Change the "Online DICOM Scan" links into actual `<a>` tags pointing directly to the DICOM library URLs with `target="_blank"` so they open the online scans in a new tab.
4.  **Full Backup:**
    *   Create a full copy of the current version to `index.v20.bak.html` in the workspace folder.

---

## Verification Plan

*   **Width Test:** Verify the page doesn't scroll horizontally on mobile.
*   **Viewer Layout Test:** Verify that when the CT or MRI is loaded, the PDF occupies the entire width of the right panel without showing the placeholder box.
*   **Link Click Test:** Click "Online 3D Scanner" and verify it opens the DICOM library in a new tab rather than loading the PDF in the viewer.
