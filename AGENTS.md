# E-CELL MET Recruitment System 2026–27 — Agent Instructions

## Project Context
This repository is being upgraded from the 2025 recruitment system into the 2026–27 E-CELL MET recruitment platform.

Primary developer: Rahul (working solo)

Primary goal:
Build a production-ready, mobile-first recruitment experience with:
- participant-facing landing experience
- 3-step application wizard
- dynamic team-specific questions
- fresh 2026 MongoDB dataset
- application tracking
- secure admin recruitment workspace

Existing stack:
- Next.js
- React
- Tailwind CSS
- MongoDB / Mongoose
- JWT-based admin authentication
- Vercel deployment

Working branch:
- `recruitment-v2`

`master` must remain stable until the final verified merge.

---

## Mandatory Reading Order Before UI Work

Before implementing participant-facing or admin-facing UI, read:

1. `docs/00_PROJECT_UIUX_INDEX.md`
2. `docs/01_UIUX_MASTER_SPEC.md`
3. `docs/02_LANDING_WIREFRAME.md`
4. `docs/03_APPLICATION_UX_SPEC.md`
5. `docs/04_ADMIN_UX_SPEC.md`
6. `docs/05_RESPONSIVE_MOTION_SYSTEM.md`
7. `docs/06_CONTENT_SYSTEM.md`
8. `docs/07_TEAM_SYSTEM.md`
9. `docs/08_TYPOGRAPHY_SYSTEM.md`

These documents are the design contract. Do not invent alternate product decisions unless Rahul explicitly changes them.

---

## Product Architecture

Public:
- `/` → recruitment landing experience
- `/apply` → 3-step application wizard
- `/apply/success` → submission confirmation
- `/track` → application status tracking

Admin:
- `/admin` → login
- `/admin/...` → recruitment command center

Application stages:
1. submitted
2. under_review
3. shortlisted
4. interview
5. selected / rejected

Eligible students:
- First Year
- Second Year
- Third Year

Teams:
- Technical
- Design
- Documentation
- Social Media
- PR
- Event
- Research

---

## Core Engineering Rules

- Do not rewrite working architecture unnecessarily.
- Do not modify `master` during implementation.
- Do not expose candidate data through public read endpoints.
- Admin-only APIs must enforce authentication server-side.
- Public admin registration must not remain open.
- Use a fresh 2026 recruitment database/collection strategy.
- Preserve old 2025 data untouched.
- Never silently change data model, routes, product copy, or team questions.
- Prefer reusable components and central config over repeated hardcoded JSX.
- Keep team metadata/questions in a single configuration source.
- Run lint/build after meaningful implementation checkpoints.
- Fix critical errors before moving to the next phase.
- Never delete production data or alter production environment variables without explicit approval.
- Do not deploy directly to production before local and preview verification.

---

## UI Rules — Non-Negotiable

Canonical visual identity:
**Soft Editorial Playground**

Design character:
- soft
- pastel
- editorial
- youthful
- premium
- human
- creative
- restrained

Must avoid:
- dark UI
- neon/electric styling
- cyberpunk
- purple AI gradients
- glassmorphism overload
- heavy bold typography
- generic SaaS layouts
- random emojis
- excessive rounded cards
- glowing cards
- giant animated blobs
- stock-looking imagery
- random rainbow pastel sections
- every section using the same centered-heading + 3-card structure

Do not use heavy font weights to create hierarchy.
Hierarchy comes from:
- scale
- spacing
- line breaks
- composition
- type personality
- color
- whitespace

Mobile participant UX is a primary target, not a fallback.

---

## Implementation Philosophy

Do not attempt a giant one-shot rebuild.

Work checkpoint by checkpoint:

Understand
→ Plan
→ Implement
→ Test
→ Review
→ Fix
→ Commit
→ Next checkpoint

Do not start the next phase if the current phase has critical unresolved issues.

---

## Temporary Media Rule

Real E-CELL media will replace placeholders later.

Use a stable placeholder structure and filenames so assets can be swapped without redesign.

Do not fabricate club achievements, statistics, deadlines, contact details, partnerships, or official claims.

Use explicit placeholders where final information is not available.

---

## Copy Rule

Use the exact approved copy in `docs/06_CONTENT_SYSTEM.md` unless Rahul changes it.

Tone:
- simple English
- human
- smart
- youthful
- slightly playful
- never corporate
- never try-hard slang

No AI filler such as:
- “Innovate. Inspire. Impact.”
- “Empowering tomorrow’s leaders”
- “Dynamic ecosystem”
- “Revolutionizing student entrepreneurship”

---

## Responsive Rule

Participant:
- mobile-first
- desktop-enhanced

Admin:
- desktop-first
- mobile-functional

Always validate participant-facing work at ~390px width before considering desktop work complete.
