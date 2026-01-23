# Master Plan: Development Standards & Visual Language

This document defines the UI/UX standards, design tokens, and coding conventions for the Master Plan suite.

---

## 1. Visual Language ("Industrial OS")

The application utilizes a high-contrast, tactical aesthetic designed for peak readability in low-light environments (gyms).

### **Design Tokens (CSS Variables)**
Defined in `src/apps/shared-premium.css`:

| Token | Hex/Value | Purpose |
| :--- | :--- | :--- |
| `--bg-dark` | `#121212` | Root application background. |
| `--card-dark` | `#1e1e1e` | Card surfaces. |
| `--border-dark` | `#333333` | Component borders. |
| `--accent-orange` | `#f29b11` | Primary actions, headers, active focus. |
| `--text-primary` | `#ececec` | High-readability body text. |
| `--text-secondary` | `#b0b0b0` | Meta-data, labels, and disabled states. |

### **Typography Scale**
*   **Primary Font:** Sans-Serif Stack (`-apple-system`, `system-ui`).
*   **Primary Data:** `13px / 900` weight (Extra Bold). Used for set counters and weights.
*   **Labels/Tags:** `12px / 800` weight. Used for secondary identifiers.
*   **Headers:** `16px / 900`. Used for section and card titles.

---

## 2. Component Conventions

### **Premium Cards**
*   **Class:** `.premium-card`
*   **Behavior:** Full-width on mobile. Includes a subtle scale-down (`0.99`) on `:active` to provide haptic-like visual feedback.

### **Interactive Elements**
*   **Inputs:** High-density, center-aligned text. Background turns orange (`0.05` opacity) on focus.
*   **Primary Buttons:** Solid orange background with black text (`#000`).
*   **Secondary Buttons:** Transparent background with `--border-dark`.

---

## 3. Semantic Color Usage

| Color | Semantic Meaning |
| :--- | :--- |
| **Orange** | **Active Effort.** Currently focused task or recommended session. |
| **Green** | **Completion.** Logged sets or successfully synced missions. |
| **Teal** | **Recovery.** Rest days and mobility work. |
| **Red** | **Critical Alert.** Destructive actions (Abandon/Delete) or system errors. |

---

## 4. Animation Standards

We use `framer-motion` for complex physics and CSS keyframes for background states:

*   **Breathe Orange:** Used for the "Following Shadow" to indicate the recommended next step.
*   **Pulse Green:** Used for the "Session Complete" state to guide the user to the finish button.
*   **Breathe Red:** Used for destructive modals or urgent alerts.

---

## 5. Coding Standards

*   **Offline-First:** All state updates must be immediate in the local store (`useTrainingStore.js`) before attempting cloud sync.
*   **Schema-First:** Always explicitly use `.schema('v2')` when interacting with the Supabase client to prevent data leakage into legacy tables.
*   **Modular Apps:** Each sub-app resides in `src/apps/` and should be logically self-contained, sharing only CSS and hooks from the root.
