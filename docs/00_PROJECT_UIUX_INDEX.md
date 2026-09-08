# E-CELL MET Recruitment 2026–27 — UI/UX Documentation Index

## Purpose

This folder is the design and content source of truth for the 2026–27 recruitment platform.

The goal is to prevent implementation agents from inventing UI, copy, layouts, motion, or team logic on their own.

## Canonical Product Direction

Product:
**E-CELL MET Recruitment System 2026–27**

Visual identity:
**Soft Editorial Playground**

Creative reference:
**Independent Creative Studio × Editorial Magazine × Curated Campus Scrapbook**

Core UX:
- participant-facing experience is mobile-first
- application flow is 3 steps
- admin is a calm recruitment workspace
- pastel surfaces are restrained, not childish
- typography is distinctive but not heavy/bold
- real club photography becomes the main visual asset when available

## Document Map

### `01_UIUX_MASTER_SPEC.md`
Global visual direction, layout philosophy, color behavior, shape language, photography, scrapbook rules, visual anti-patterns.

### `02_LANDING_WIREFRAME.md`
Full landing page structure and responsive wireframe:
- Navigation
- Hero
- What is E-CELL?
- Life at E-CELL
- Find Your Squad
- Value section
- Recruitment Journey
- FAQ
- Final CTA + Footer

### `03_APPLICATION_UX_SPEC.md`
Full 3-step application flow:
- Step 1: You
- Step 2: Your Squad
- Step 3: Review
- validation
- autosave
- dynamic questions
- mobile behavior
- submission behavior

### `04_ADMIN_UX_SPEC.md`
Admin login, overview, candidate review table, filters, candidate detail drawer, status flow, notes, teams, analytics, export, mobile fallback.

### `05_RESPONSIVE_MOTION_SYSTEM.md`
Breakpoints, spacing, device transformations, touch targets, animation rules, performance, reduced-motion, image/video behavior.

### `06_CONTENT_SYSTEM.md`
Approved participant and admin copy, CTA wording, form labels, FAQ, tracking states, success copy, error messages, placeholders.

### `07_TEAM_SYSTEM.md`
Seven team identities, descriptions, responsibilities, fit statements, visual motifs, and team-specific application questions.

### `08_TYPOGRAPHY_SYSTEM.md`
Typography philosophy and constraints. Exact final display font is intentionally not locked yet.

### `09_THEME_ARCHITECTURE.md`
Participant theme IDs, scope, token-driven architecture, admin isolation, and deferred toggle/persistence notes for Paper and Midnight.

---

## Current UI/UX Phase Status

- A. Visual Direction & Mood — LOCKED
- B. Landing Page Wireframe — LOCKED
- C. Application UX — LOCKED
- D. Admin UX — LOCKED
- E. Responsive + Motion System — LOCKED
- F. Content System — LOCKED
- G. Repo Design Docs — THIS DOCUMENT SET

Any future design change should update these files so implementation remains consistent.
