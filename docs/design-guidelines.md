# Design Guidelines — MigrainLog

Mobile-first PWA. Dark mode default. Accessibility-first for photosensitive users.

---

## Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Heading 1 | Plus Jakarta Sans | 800 | 28px |
| Heading 2 | Plus Jakarta Sans | 700 | 22px |
| Heading 3 | Plus Jakarta Sans | 700 | 18px |
| Body | DM Sans | 400 | 16px min |
| Label / Caption | DM Sans | 500 | 14px |

- Line height: 1.6+ for body, 1.2 for headings
- Never use pure white (`#FFF`) for text — use `--text-primary`

---

## Design Tokens (CSS Custom Properties)

```css
:root {
  /* Dark Mode (default) */
  --bg-base: #0F1117;
  --bg-surface: #171823;
  --bg-elevated: #1F2133;
  --border: #2A2D3E;

  --text-primary: #E8E8F4;
  --text-secondary: #9192A6;

  --accent-primary: #7B61FF;
  --accent-secondary: #38BDF8;
  --accent-mint: #34D399;

  --severity-low: #6366F1;
  --severity-mid: #A855F7;
  --severity-high: #DC2626;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-full: 9999px;

  /* Animation */
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --easing: ease-in-out;
}

[data-theme="light"] {
  --bg-base: #F5F4F0;
  --bg-surface: #FFFEF9;
  --bg-elevated: #F0EEE8;
  --border: #E2E0EC;
  --text-primary: #1A1A2E;
  --text-secondary: #6B6A80;
  --accent-primary: #6B4FE6;
}
```

---

## Color Usage Rules

- **Backgrounds**: layer `--bg-base` → `--bg-surface` → `--bg-elevated` (modals/drawers)
- **No bright reds/oranges/yellows** as large areas — only `--severity-high` for small badges
- **Glow halos** (dark mode only): `box-shadow: 0 0 20px color-mix(in srgb, var(--accent-primary) 30%, transparent)`
- Light mode: standard `box-shadow` with low opacity, no glows

---

## Layout

- **Base viewport**: 375px
- **Max content width**: 428px (centered on wider screens)
- **Page padding**: 16px horizontal
- **Bottom nav height**: 64px (safe area aware)
- **Card padding**: 16px
- **Section gap**: 24px
- **Spacing unit**: 4px base

### Bottom Navigation (4 tabs)
`Dashboard` | `Calendar` | `Log (FAB)` | `Profile`

- Tab icons: 24px, touch target 56px minimum
- Active tab: `--accent-primary` icon + label
- Log tab center: floating-style, slightly elevated card

---

## Component Patterns

### Cards
- Background: `--bg-surface`
- Border-radius: `--radius-md` (16px) or `--radius-lg` (24px)
- Border: `1px solid var(--border)`
- Padding: 16px
- No harsh drop shadows in dark mode — use glow or none

### Buttons (Primary CTA)
- Height: 56px, border-radius: `--radius-full`
- Background: `--accent-primary`
- Neumorphic inset on press: `box-shadow: inset 2px 2px 6px rgba(0,0,0,0.4)`
- Haptic feedback on submit actions

### Quick Log FAB
- 64px circle, `--accent-primary` fill, `+` or pencil icon
- Fixed bottom-right: `bottom: calc(80px + env(safe-area-inset-bottom))`, `right: 20px`
- Tap → bottom sheet (3 steps: location → severity → triggers)

### Bottom Sheets
- Background: `--bg-elevated`
- Border-radius: 24px top only
- Drag handle: 40×4px pill, `--border` color, centered top
- Backdrop: `rgba(0,0,0,0.6)` blur(8px) (glassmorphic)

### Sliders (Pain Intensity)
- Custom range input, thumb 28px with glow
- Track gradient: `--severity-low` → `--severity-mid` → `--severity-high`
- Haptic on integer value changes

### Severity Indicators
| Level | Color | Usage |
|---|---|---|
| Mild (1–3) | `--severity-low` #6366F1 | Badge, dot |
| Moderate (4–7) | `--severity-mid` #A855F7 | Badge, dot |
| Severe (8–10) | `--severity-high` #DC2626 | Badge, dot — never large fill |

### Calendar Heatmap
- GitHub contribution graph style, 7×N grid
- Cell size: 12px, gap: 3px, border-radius: 3px
- Empty: `--bg-surface`; intensity levels map to severity palette
- Tap cell → bottom sheet with day detail

### Trigger/Symptom Grid
- Icon-based grid, 3–4 columns
- Each cell: 72×72px card, icon (28px) + label (12px caption)
- Selected state: `--accent-primary` border + subtle glow background

### Segmented Controls
- Background: `--bg-surface`
- Active segment: `--bg-elevated` + `--accent-primary` text
- Border-radius: `--radius-sm`; height: 40px

---

## Motion & Animation

```css
/* All transitions */
transition: all var(--duration-normal) var(--easing);

/* Reduced motion override — MANDATORY */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- **Enter animations**: fade + slide up 8px, 300ms
- **Bottom sheet open**: slide up 300ms ease-out
- **FAB press**: scale(0.94) 200ms
- **No bounce, spring, or flicker effects** — disorienting for migraine sufferers

---

## Accessibility

- Touch targets: 48px minimum, 56px preferred
- Focus rings: `outline: 2px solid var(--accent-primary); outline-offset: 2px`
- Contrast ratio: 4.5:1 minimum (body), 3:1 (large text)
- Never rely on color alone to convey meaning — always pair with icon or label
- `prefers-reduced-motion` respected on all animations

---

## Tech Stack Integration

| Concern | Tool |
|---|---|
| Components | shadcn/ui (Radix UI base) |
| Styling | Tailwind CSS + CSS custom properties above |
| Animation | Framer Motion (`useReducedMotion()` hook required) |
| Charts | Recharts (heatmap, trend lines) |
| Head diagram | Custom inline SVG |
| Fonts | `next/font` — Plus Jakarta Sans + DM Sans |

Tailwind config should alias design tokens:
```js
// tailwind.config.ts
colors: {
  'bg-base': 'var(--bg-base)',
  'bg-surface': 'var(--bg-surface)',
  'accent': 'var(--accent-primary)',
  // ...
}
```
