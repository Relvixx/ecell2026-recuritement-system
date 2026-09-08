# Theme Architecture

## Theme IDs

- `paper`: current approved Soft Editorial Playground / Paper Editorial direction.
- `midnight`: future E-CELL cinematic brand atmosphere x editorial paper material direction.

These are art-direction themes, not operating-system light/dark modes.

## Core Principle

Softness comes from material; E-CELL comes from atmosphere.

Paper keeps the warm editorial canvas, charcoal type, restrained pastel materials, and scrapbook-like paper surfaces already approved for the product.

Midnight is prepared as an E-CELL brand-aligned foundation: near-black atmosphere, restrained crimson action, muted gray supporting text, and warm ivory paper moments.

## Scope

The participant routes use the theme system:

- `/`
- `/apply`
- `/apply/success`
- `/track`

The admin workspace is not part of the dual-theme system. Admin surfaces continue to use the existing Paper-compatible global palette and should not receive `data-recruitment-theme`.

## Implementation Contract

- There is one component/layout tree.
- Do not create theme-specific duplicate pages or components.
- Visual differences should primarily come from semantic design tokens.
- `paper` remains the default visible theme.
- `midnight` tokens exist only as a foundation until a later transformation phase activates them intentionally.

## Toggle And Persistence

No visible theme toggle exists in Phase M1.

The future preference key is reserved as:

`ecell_recruitment_theme`

Client persistence is deferred to the toggle phase so Paper remains server-rendered by default with no hydration flash or theme switch during normal current use.
