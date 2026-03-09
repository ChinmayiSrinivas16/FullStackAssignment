# StockFolio Fintech Design System

## Color Tokens
Use these CSS custom properties from `src/styles.scss`.

- `--color-primary`: `#2563EB`
- `--color-bg`: `#0F172A`
- `--color-sidebar`: `#111827`
- `--color-card`: `#1E293B`
- `--color-border`: `#334155`
- `--color-text-primary`: `#F8FAFC`
- `--color-text-secondary`: `#94A3B8`
- `--color-profit`: `#22C55E`
- `--color-loss`: `#EF4444`

## Spacing Scale
- `--space-1`: `4px`
- `--space-2`: `8px`
- `--space-3`: `12px`
- `--space-4`: `16px`
- `--space-5`: `20px`
- `--space-6`: `24px`
- `--space-8`: `32px`
- `--space-10`: `40px`

## Radius and Elevation
- `--radius-sm`: `8px`
- `--radius-md`: `12px`
- `--radius-lg`: `16px`
- `--shadow-card`: `0 12px 24px rgba(2, 8, 23, 0.28)`

## Reusable Components
All are standalone Angular components.

- `app-icon`
- `app-stat-card`
- `app-chart-card`
- `app-empty-state`
- `app-sidebar-item`

### `app-stat-card`
Inputs:
- `label: string`
- `value: string`
- `subtitle?: string`
- `positive?: boolean`
- `icon?: string`

### `app-chart-card`
Inputs:
- `title: string`
- `meta?: string`
Content:
- Uses `<ng-content>` for chart/table/custom bodies.

### `app-empty-state`
Inputs:
- `title: string`
- `message: string`
- `icon?: string`

### `app-sidebar-item`
Inputs:
- `route: string`
- `label: string`
- `icon: string`
- `exact?: boolean`

## Icon Rules
- Use `app-icon` for all UI iconography.
- Do not use emoji in UI text or controls.
- Prefer semantic icon names like `line-chart`, `file-text`, `briefcase`, `refresh`.

## Motion Rules
- Card entry animation is subtle (`~260-280ms`, ease-out).
- Hover motion should be light (`translateY(-2px)` max).
- Respect `prefers-reduced-motion` by disabling non-essential animations.

## Page Conventions
- Build pages with `app-chart-card` sections.
- Keep page headers with title + subtitle + live/refresh actions.
- Use `profit` and `loss` classes for value direction.
- Ensure responsive behavior at tablet/mobile breakpoints.

## Quick Checklist For New Screens
1. Use design tokens only, avoid hard-coded palette values.
2. Use reusable components before creating page-specific wrappers.
3. No emoji icons.
4. Keep spacing aligned to token scale.
5. Verify with `npm run build`.
