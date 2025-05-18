# Style Aesthetic & Visual Design System

This document outlines the visual design system for the Mugshot Matcher application. The goal is to create a modern, clean, engaging, and accessible user interface. This system is designed to work seamlessly with Tailwind CSS and shadcn/ui.

## 1. Color Palette

The color palette is designed to be versatile, support both light and dark modes, and provide clear visual hierarchy.

### Primary Colors
-   **Primary (Slate Blue):**
    -   Light Mode: `slate-600` (text, primary actions), `slate-500` (hover/active states)
    -   Dark Mode: `slate-400` (text, primary actions), `slate-300` (hover/active states)
    -   *Justification:* Conveys professionalism, trust, and stability. Provides good contrast for text and interactive elements.

-   **Secondary (Sky Blue):**
    -   Light Mode: `sky-500`
    -   Dark Mode: `sky-600`
    -   *Justification:* A friendly and engaging color, used for secondary actions, highlights, or illustrative elements. Complements the primary slate blue.

### Accent Color
-   **Accent (Amber):**
    -   Light Mode: `amber-500`
    -   Dark Mode: `amber-400`
    -   *Justification:* A warm, vibrant color for calls-to-action (CTAs), important notifications, or to draw attention to specific interactive elements.

### Neutral Colors
-   **Backgrounds:**
    -   Light Mode: `bg-slate-50` (main), `bg-white` (cards/modals)
    -   Dark Mode: `bg-slate-900` (main), `bg-slate-800` (cards/modals)
    -   *Justification:* Clean and unobtrusive, allowing content to stand out.

-   **Text:**
    -   Light Mode:
        -   Headings: `text-slate-900`
        -   Body: `text-slate-700`
        -   Muted: `text-slate-500`
    -   Dark Mode:
        -   Headings: `text-slate-100`
        -   Body: `text-slate-300`
        -   Muted: `text-slate-400`
    -   *Justification:* Ensures high readability and contrast against backgrounds.

-   **Borders & Dividers:**
    -   Light Mode: `border-slate-200`
    -   Dark Mode: `border-slate-700`
    -   *Justification:* Subtle separation for UI elements without being distracting.

### Feedback Colors (Semantic)
-   **Success:**
    -   Light Mode: `green-500` (bg), `green-700` (text/icon)
    -   Dark Mode: `green-600` (bg), `green-400` (text/icon)
-   **Error:**
    -   Light Mode: `red-500` (bg), `red-700` (text/icon)
    -   Dark Mode: `red-600` (bg), `red-400` (text/icon)
-   **Warning:**
    -   Light Mode: `yellow-400` (bg), `yellow-700` (text/icon)
    -   Dark Mode: `yellow-500` (bg), `yellow-300` (text/icon)
-   **Info:**
    -   Light Mode: `blue-500` (bg), `blue-700` (text/icon)
    -   Dark Mode: `blue-600` (bg), `blue-400` (text/icon)
-   *Justification:* Standard, universally understood colors for user feedback.

## 2. Typography

Typography choices prioritize readability, hierarchy, and a modern feel.

-   **Primary Font Family: Inter** (Sans-Serif)
    -   *Source:* Google Fonts (easily importable) or system font stack.
    -   *Weights:* Regular (400), Medium (500), Semi-Bold (600), Bold (700).
    -   *Justification:* "Inter" is a highly versatile and readable sans-serif font, excellent for UI design. It offers a wide range of weights for establishing clear hierarchy.

-   **Usage:**
    -   **Headings (h1, h2, h3, etc.):** Inter, Semi-Bold or Bold weight.
        -   Example sizes (Tailwind): `text-4xl`, `text-3xl`, `text-2xl`, `text-xl`
    -   **Body Text:** Inter, Regular weight.
        -   Example size (Tailwind): `text-base` (16px)
    -   **UI Elements (Buttons, Labels, Captions):** Inter, Medium or Regular weight.
        -   Example size (Tailwind): `text-sm` or `text-base`
    -   **Line Height:** Use Tailwind's relative line-height classes (e.g., `leading-normal`, `leading-relaxed`) for optimal readability.

## 3. Spacing and Layout

Consistent spacing creates visual rhythm and improves scannability.

-   **Base Unit:** 4px (Tailwind's `1` unit, e.g., `p-1`, `m-1`).
-   **Spacing Scale:** Utilize Tailwind CSS's default spacing scale (e.g., `p-2`=8px, `p-4`=16px, `p-6`=24px, `p-8`=32px).
-   **Layout:**
    -   Employ Tailwind's flexbox (`flex`, `items-center`, `justify-between`) and grid (`grid`, `grid-cols-*`) utilities for responsive layouts.
    -   **Containers:** Standardize page content containers with horizontal padding (e.g., `px-4 sm:px-6 lg:px-8`).
    -   **Component Spacing:** Maintain consistent margins between UI elements (e.g., `mb-4` between form fields, `mt-8` between sections).

## 4. UI Component Base Styles (Conceptual)

These are general guidelines for styling common shadcn/ui components using Tailwind CSS, based on the defined color palette and typography.

-   **Buttons (`<Button>`):**
    -   **Default/Primary:** `bg-slate-600 text-white hover:bg-slate-700` (Light), `bg-slate-400 text-slate-900 hover:bg-slate-300` (Dark)
    -   **Secondary:** `bg-sky-500 text-white hover:bg-sky-600` (Light), `bg-sky-600 text-white hover:bg-sky-700` (Dark)
    -   **Destructive:** `bg-red-500 text-white hover:bg-red-600` (Light), `bg-red-600 text-white hover:bg-red-700` (Dark)
    -   **Outline:** `border border-slate-500 text-slate-600 hover:bg-slate-100` (Light), `border-slate-400 text-slate-300 hover:bg-slate-700` (Dark)
    -   **Ghost:** `hover:bg-slate-100 text-slate-600` (Light), `hover:bg-slate-700 text-slate-300` (Dark)
    -   **Link:** `text-slate-600 underline-offset-4 hover:underline` (Light), `text-sky-400 underline-offset-4 hover:underline` (Dark)
    -   *Common:* `rounded-md`, `px-4 py-2`, `text-sm font-medium` (Inter)

-   **Cards (`<Card>`):**
    -   `bg-white dark:bg-slate-800`
    -   `rounded-lg`
    -   `border border-slate-200 dark:border-slate-700`
    -   `shadow-sm` (subtle shadow for depth)
    -   `<CardHeader>`, `<CardContent>`, `<CardFooter>` to use consistent internal padding (e.g., `p-6`).

-   **Inputs (`<Input>`):**
    -   `bg-transparent` (or `bg-slate-50 dark:bg-slate-700` if distinct background preferred)
    -   `border border-slate-300 dark:border-slate-600`
    -   `rounded-md`
    -   `px-3 py-2 text-sm`
    -   `focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900`

-   **Modals/Dialogs (`<Dialog>`):**
    -   Overlay: `bg-black/60`
    -   Content: `bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6`

## 5. Iconography

-   **Library:** Lucide React (already in `techStack.md`).
-   **Style:** Clean, modern, and consistent line weight.
-   **Sizing:** Typically `h-4 w-4`, `h-5 w-5`, or `h-6 w-6` to match text sizes.
-   **Color:** Inherit text color (`currentColor`) or use semantic colors where appropriate.

## 6. Dark Mode

-   The color palette and component styles are designed with dark mode in mind from the outset.
-   Utilize Tailwind's `dark:` variant extensively.
-   Ensure sufficient contrast ratios for accessibility in both modes.

## Implementation Notes
-   These styles will be primarily implemented by customizing Tailwind CSS configuration (`tailwind.config.ts`) for colors, fonts, and potentially extending the spacing scale.
-   Shadcn/ui components will be styled using these Tailwind utility classes.
-   Global styles in `app/globals.css` should be minimal, primarily for base HTML element styling and font imports.
