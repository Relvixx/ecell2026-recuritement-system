# Typography System

## Important Status

The exact final display font is **NOT LOCKED YET**.

Rahul's visual references establish the direction:
- unusual
- soft
- sculptural
- playful
- memorable
- distinctive letterforms

But the final typeface must avoid the heavy/chunky weight seen in many playful display fonts.

Do not silently choose a generic font just to finish implementation.

---

# 1. Core Typography Goal

Typography must feel:

**Unique + Soft + Premium + Youthful + Creative**

Avoid:
- heavy bold
- loud chunky type
- childish bubble fonts
- corporate default typography
- generic AI landing-page type

Impact must come from:
- scale
- whitespace
- line breaks
- composition
- letterform personality
- contrast
- restrained color

Not from 800/900 font weight.

---

# 2. Display Font Requirements

Final display font should ideally have:
- distinctive forms
- organic/soft character
- regular or light-ish usable weight
- good lowercase personality
- strong readability at large sizes
- enough character to make hero/section headings memorable
- web licensing suitable for production

Preferred weights:
- Regular
- Medium at maximum

Avoid:
- 700
- 800
- 900
- Black / ExtraBold

Use display font for:
- hero
- large section headings
- selected editorial callouts
- occasional admin page title only

Do not use it for every form label or table cell.

---

# 3. Body/UI Font Requirements

Body/UI font should be:
- clean
- readable
- neutral
- modern
- soft rather than technical/corporate
- strong on mobile
- visually compatible with display font

Use for:
- paragraphs
- nav
- buttons
- labels
- inputs
- helper copy
- FAQ
- tracking
- admin tables
- filters

Preferred weights:
- Regular
- Medium

Avoid unnecessary bold.

---

# 4. Optional Handwritten Accent

A handwritten/accent style may be used very sparingly (~5% of visual text max).

Use only for:
- tiny scrapbook annotations
- doodle labels
- short playful notes
- media captions

Examples:
- nice move.
- apply here →
- behind the scenes

Never use for:
- required information
- form labels
- status
- admin data
- long paragraphs

---

# 5. Hierarchy Without Bold

Hero can be impactful using:

```text
Don’t just
join a club.

Build one.
```

Even at regular weight.

Hierarchy sources:
1. size
2. spacing
3. line break
4. placement
5. color
6. typeface personality
7. whitespace

Avoid solving hierarchy by adding `font-bold`.

---

# 6. Approx Responsive Type Scale

These are guidance ranges, not final locked values.

Hero:
- Mobile: ~42–54px
- Desktop: ~70–96px

Section headings:
- Mobile: ~34–46px
- Desktop: ~48–68px

Body:
- Mobile: ~16–18px
- Desktop: ~17–19px

Small UI:
Keep readable. Avoid excessively tiny text.

---

# 7. Sentence Case

Prefer:
- Find your squad
- What you'll actually get
- Life at E-CELL

Use uppercase only for small eyebrow labels:
- ABOUT US
- THE TEAMS
- WHAT HAPPENS NEXT?

Avoid all-caps body or buttons.

---

# 8. Performance

Do not load many weights.

Target:
- display: 1–2 weights
- body: 2 weights
- handwritten accent: 1 weight max

Use production-safe, properly licensed web font delivery.

Do not expose or redistribute local font files.

---

# 9. Temporary Implementation Rule

If exact final fonts are still undecided during early structure work:
- use a neutral temporary fallback
- isolate font tokens centrally
- do not bake a random font into every component
- keep replacement easy

Final typography should be selected before visual polish is considered complete.
