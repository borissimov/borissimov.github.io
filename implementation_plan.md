# Updated Implementation Plan - Medical Dashboard Restructure V5

This plan addresses study card clickability, renaming of reports and external links, wrapping of viewer action buttons on mobile, and transforming the comparison table to be fully responsive without horizontal scrolling.

---

## User Review Required

> [!IMPORTANT]
> Please review the proposed V5 fixes before approval.

We propose the following updates:
1.  **Card Clickability with Event Stop Propagation:**
    *   Add `onclick="loadPDF('CT')"` back to the outer `.ct-card` and `onclick="loadPDF('MRI')"` back to the outer `.mri-card`.
    *   Add `onclick="event.stopPropagation()"` to the external DICOM `<a>` links. This allows the user to click anywhere on the card to open the report PDF, while clicking the external link only opens that link in a new tab without loading the PDF.
2.  **Renaming Links and Reports:**
    *   Rename "📄 Преглед на Доклад" to "📄 Разчитане".
    *   Rename "🩻 Онлайн 3D Скенер" to "🩻 Виж КТ изследване" (CT card).
    *   Rename "🩻 Онлайн ЯМР" to "🩻 Виж ЯМР изследване" (MRI card).
    *   Update dynamic actions in JavaScript to reflect these names for the viewer top bar buttons.
3.  **Viewer Top Bar Layout on Mobile:**
    *   Add CSS rules to stack the `.viewer-top-bar` vertically on mobile screen widths (`max-width: 768px`).
    *   Display buttons in a horizontal row below the title, with `flex-grow: 1` so they take 50% width each and fit cleanly on small viewports.
4.  **Responsive Comparison Table:**
    *   Add mobile CSS rules for `.comparison-table` (`max-width: 600px`) that stack columns vertically.
    *   The indicator name ("Показател") becomes the section title, while the MRI and CT findings stack below it, prefixed with "ЯМР (2025):" and "КТ (2026):" (automatically translated based on current language toggle).
5.  **Full Backup:**
    *   Create a full copy of the current version to `index.v21.bak.html`.

---

## Verification Plan

*   **Card Click Test:** Click the CT scan card body. Verify it opens the PDF in the viewer. Click the "Виж КТ изследване" link. Verify it opens DICOM library in a new tab without switching the viewer's active document.
*   **Renaming Test:** Verify the link names are updated correctly in Bulgarian and English.
*   **Table Test:** Verify that the comparison table renders as stacked cards on mobile and fits within 360px without scrolling horizontally.
*   **Top Bar Button Fit Test:** Verify the top bar layout on mobile scales correctly and text fits inside buttons without clipping.
