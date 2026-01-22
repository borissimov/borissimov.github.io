# Master Plan Visual Guidelines (v2.0)

This document serves as the technical specification for the Master Plan suite's aesthetic. It is intended for both internal development and external UI/UX designers.

## 1. Core Palette
| Element | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Primary Accent** | `#f29b11` | Branding, Headers, Primary Actions (Orange) |
| **Background** | `#121212` | Main application background |
| **Surface (Card)** | `#1e1e1e` | Secondary surfaces, cards, containers |
| **Sub-Surface** | `#252525` | Inner containers, icon backgrounds |
| **Primary Text** | `#ececec` | Main readability |
| **Secondary Text**| `#b0b0b0` | Descriptions, meta-data, captions |
| **Border** | `#333333` | Component isolation |

## 2. Typography
- **Primary Font:** Sans-Serif Stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`).
- **Brand Headers:** `900` weight (Black/Extra Bold), Uppercase, `3px` letter-spacing.
- **Section Headers:** `Bold`, `18px`, Default casing.
- **Micro-labels:** `900` weight, `9px` size, Uppercase, `1px` letter-spacing.

## 3. Component Architecture: The "Hub Card"
- **Shape:** Horizontal layout (Flexbox).
- **Radius:** `16px` outer, `12px` inner (icons).
- **Padding:** `24px` (Uniform).
- **Interactions:**
    - **Hover:** Transform `translateY(-2px)`, Border change to `#f29b11`.
    - **Transition:** `0.2s ease-in-out`.

## 4. Training Interface Designs (Approved)

### Design 1: Edge-to-Edge Mobile
- **Context:** Optimized for small displays (e.g., Galaxy A41).
- **Structure:** Zero horizontal margins. Cards span 100% of screen width.
- **Separation:** Horizontal `border-bottom` only.

### Design 2: Sequential Logger (Current Winner)
- **Master Templates:** 
    - [Sequential Logger Code](./templates/Design2_SequentialLogger.jsx)
    - [Circuit Row Code](./templates/Design2_ExerciseRow.jsx)
    - [Shared Styling](./templates/Design2_SharedStyles.css)
- **Hierarchy:** 
    - **Line 1:** [Progress Box] + [Exercise Name (Left-aligned)]
    - **Line 2:** [Targets: KG, REPS, RPE, TEMPO (Right-aligned)]
- **Colors:** Labels are `#f29b11`, Values are `#fff`.
- **Interaction:** Sequential input. Completed sets move to an inline-editable grid below the active input.
- **Density:** Ultra-compact vertical spacing. Border "hugs" the last log entry.

## 5. Visual Assets
We prefer vector-based icons (`lucide-react` or raw SVG) to maintain crispness on mobile OLED displays.
