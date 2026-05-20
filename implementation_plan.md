# Implementation Plan - Medical Dashboard Restructure

This plan details the proposed architectural, UX, and aesthetic restructure of the medical portfolio/dashboard at [borissimov.github.io](file:///C:/Projects/borissimov.github.io). The primary target audience is medical professionals (orthopedic surgeons/consultants) from whom the patient is seeking a clinical opinion on how to proceed.

---

## User Review Required

> [!IMPORTANT]
> The primary design shift is moving from a raw "tab-per-date" image-viewer layout to a **dossier-style medical dashboard** where history, questions, and specific imaging evidence are integrated together.

We seek user feedback on the following structural and design choices:
1. **Interactive Split-Screen Layout (Desktop):** A dual-pane layout where the left column contains the Patient Dossier (Case Summary, Timeline, and Consultation Questions) and the right column acts as the Interactive Document/Image Viewer. This allows a doctor to read the timeline/questions and immediately view the corresponding X-ray or MRI/CT report side-by-side without leaving their place.
2. **Simplified Navigation Header:** Grouping the five separate 2025 X-ray dates into a single "X-ray Archive" dropdown or slider to declutter the navigation.
3. **Bilingual Presentation:** The medical history text is currently in Bulgarian. Should we implement an English/Bulgarian translation toggle so the site can easily be shared with international specialists?

---

## Proposed Changes

We propose restructuring [index.html](file:///C:/Projects/borissimov.github.io/index.html) into a modern, single-page application (SPA) with a cohesive, premium dark/clinical theme.

### Component 1: Layout & UX Restructure

#### [MODIFY] [index.html](file:///C:/Projects/borissimov.github.io/index.html)
*   **Dual-Pane Desktop View:**
    *   **Left Pane (Scrollable Dossier):**
        *   **Patient Profile Header:** Quick dashboard showing Name (Boris Simov, 42y), Injury Goal (Return to heavy lifting 30kg+ and aggressive mountain biking), and Quick Action buttons to download the 2026 CT Report and 2025 MRI Report.
        *   **Key Finding Callout:** A prominent card highlighting that the **July 2025 MRI** showed the *earliest sign of non-union* (2.5mm dehiscence) and the **April 2026 CT Scan** *confirmed pseudoarthrosis* (2mm gap with smoothed margins, subchondral cysts, and two 2mm free intra-articular fragments).
        *   **Interactive Medical Timeline:** An elegant, vertical line tracing:
            1.  *14 May 2025:* Day 0 - Radial Head Fracture (Interactive link to view Day 0 X-rays).
            2.  *June 2025:* Immobilization & early rehab details.
            3.  *24 July 2025:* MRI reveals 2.5mm non-union gap (Interactive link to load MRI PDF/Viewer).
            4.  *Sep 2025 – Mar 2026:* Training progression & minor residual pain.
            5.  *13 Mar 2026:* Second trauma (fall, acute pain).
            6.  *23 April 2026:* CT confirms chronic pseudoarthrosis and free fragments (Interactive link to load CT PDF/Viewer).
        *   **8 Consultation Questions:** Verbatim Bulgarian list styled with high-contrast, clean list items.
    *   **Right Pane (Interactive Viewer):**
        *   Contains the dynamic viewer frame. When the doctor clicks a timeline item or tab, the right pane displays the active viewer:
            *   *X-ray Viewer:* Showing the X-ray series for the selected date with brightness, contrast, zoom, and pan controls.
            *   *PDF Viewer:* Embedding the MRI or CT scan report directly.
            *   *External DICOM Viewers:* Highlighting CTA buttons to launch the full DICOM studies in a new tab on DICOM Library.
*   **Mobile Layout:**
    *   Folds into a single-column view.
    *   A sticky bottom navigation bar or clean header tabs allow the doctor to jump directly to sections (Summary, Questions, X-Ray Viewer).
    *   Interactive timeline items act as links that scroll the viewer section into focus.

### Component 2: Aesthetic Enhancements (CSS)

#### [MODIFY] [index.html](file:///C:/Projects/borissimov.github.io/index.html)
*   Update styles to use a refined, dark clinical interface.
    *   *Base Theme:* Dark gray backgrounds (`#121214` to `#18181c`) with crisp white body text (`#f1f1f5`).
    *   *Primary Accents:* Deep medical blue (`#0f62fe` or `#007bff`) for navigation, orange (`#e67e22`) for CT-related alerts, and emerald green (`#198754`) for MRI-related alerts.
    *   *Micro-animations:* Subtle transitions on tab buttons, interactive timeline markers, and card hovers.
    *   *Typography:* Implement Inter/System font stack for legibility.

---

## Verification Plan

### Automated/Interactive Verification
*   **Device Responsiveness:** Use the browser tools (or request manual testing) to verify that the split-pane layout behaves correctly on wide desktop monitors (>= 1200px), standard tablets (768px - 1024px), and small mobile viewports (<= 480px).
*   **Link & Interaction Testing:** Verify that clicking timeline dates updates the image display area and selects the correct metadata.
*   **Image Filter Verification:** Ensure that the brightness, contrast, zoom, and panning functions work seamlessly on all archived X-rays.

### Manual Verification
*   **User Review:** Present the visual plan and structural logic to the user for confirmation.
