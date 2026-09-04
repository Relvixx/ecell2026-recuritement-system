# Landing Page Wireframe Specification

Route: `/`

Primary audience device:
**Mobile (especially 375–430px)**

Full narrative flow:

1. Navigation
2. Hero
3. What is E-CELL?
4. Life at E-CELL
5. Find Your Squad
6. What You'll Actually Get
7. Recruitment Journey
8. FAQ
9. Final CTA + Footer

Emotional flow:

Curiosity
→ Understanding
→ Belonging
→ Self-identification
→ Value
→ Confidence
→ Action

---

# 1. Navigation

## Mobile

Structure:

```text
E-CELL MET                       ☰
```

Behavior:
- sticky
- 64–68px approximate height
- initially blends with warm ivory background
- gains subtle surface/border after scrolling
- full-screen pastel mobile menu
- no dark overlay

Mobile menu:
- About
- Life at E-CELL
- Find Your Squad
- Recruitment Journey
- FAQ
- Start Application ↗
- Instagram / Website links

## Desktop

```text
E-CELL MET   About   Life   Teams   Journey   FAQ     [ Apply Now ↗ ]
```

Quiet and compact.
Do not let navbar visually compete with hero.

---

# 2. Hero

Approved headline:

**Don’t just  
join a club.**

**Build one.**

Supporting:
- Recruitment 2026–27
- Applications Open
- For 1st, 2nd & 3rd year students
- short supporting paragraph
- primary CTA
- secondary teams link

## Mobile Structure

```text
NAV

Recruitment 2026–27
● Applications Open

Don’t just
join a club.

Build one.

Short supporting copy.

[ Start your application ↗ ]

Explore the teams ↓

          [ HERO PHOTO 01 ]
      small tape / doodle

[ PHOTO 02 ]
small handwritten note
```

Rules:
- CTA should appear before a major scroll
- copy first, media after
- 2 major images maximum
- one tape, one doodle, one annotation are enough
- no desktop collage squeezed into mobile

## Desktop Structure

Approx 55/45:
- left: copy
- right: editorial photo composition

Asymmetric, not perfect 50/50.

Hero min-height:
- approximately 85–95svh on desktop
- content-driven on mobile

Hero should not require a large autoplay video.

---

# 3. What is E-CELL?

Heading:
**What even is E-CELL?**

Key statement:
**Ideas are easy. Execution is the interesting part.**

Body:
Short explanation only.

## Mobile
Text first, then one strong candid/team visual.

## Desktop
Approx:
- 45% text
- 55% image/visual

Optional tiny labels:
- BUILD
- CREATE
- CONNECT
- EXECUTE

Do not turn these into four SaaS cards.

---

# 4. Life at E-CELL

Heading:
**Life at E-CELL**

Purpose:
Create emotional belonging through real club moments.

Narrative media order:
1. preparation
2. team collaboration
3. event
4. behind the scenes
5. aftermath/celebration

## Mobile
Vertical editorial scrapbook story.

Avoid:
- tiny two-column photo grids everywhere
- horizontal carousel for core content

## Desktop
Controlled asymmetric collage.

Featured video:
- maximum one
- poster first
- tap/click to play
- no forced sound

Use context-aware captions only.

---

# 5. Find Your Squad

Heading:
**Find your squad**

Sub:
Seven teams. Different strengths. Same mission.

## Mobile
Use:
- one featured team card
- remaining teams as compact selector/cards
- tapping a compact team promotes it to the featured state

This avoids seven huge vertical cards while keeping all teams visible.

## Desktop
Use an asymmetric editorial grid, not seven equal cards.

Team card identity:
- team number
- team name
- tagline
- short description
- Explore ↗
- subtle team motif

## Team Detail Interaction

Mobile:
- full-screen sheet

Desktop:
- large drawer/modal

Content order:
- team name
- tagline
- short description
- what we do
- who may fit
- what you may work on
- reassurance for beginners
- Apply for this team ↗

Team CTA may route:
`/apply?team=technical`, etc.

---

# 6. What You'll Actually Get

Heading:
**What you'll actually get**

Core value cards:
- Build things that matter
- Own real responsibility
- Learn outside your branch
- Meet people who execute
- Optional: Get comfortable figuring things out

## Mobile
Staggered vertical editorial cards.

## Desktop
Irregular editorial/bento-like composition.

Avoid generic 3-equal-card SaaS layout.

---

# 7. Recruitment Journey

Heading:
**Here's what happens after you apply**

Stages:
1. Apply
2. We Review
3. Interaction
4. Final Call
5. Welcome In

## Mobile
Vertical timeline.

## Desktop
Horizontal or loose curved path.

Do not use a horizontally scrollable timeline on mobile.

---

# 8. FAQ

Heading:
**A few things you might be wondering**

Use simple accordion rows.

Questions:
- Do I need previous experience?
- Can first-year students apply?
- Can I choose two teams?
- What if I’m not sure which team fits me?
- What happens after I submit?
- How much time will E-CELL require?
- Can I edit my application later?
- How will I know my status?

FAQ is intentionally quiet:
- no large card grid
- almost no decorative graphics

---

# 9. Final CTA + Footer

Preferred playful direction:

**Still scrolling?**

**Might as well apply.**

CTA:
**Start your application ↗**

Supporting:
Open for 1st, 2nd & 3rd year students.

Footer:
- E-CELL MET
- Instagram
- Website
- Contact
- Recruitment 2026–27
- Built with care by E-CELL MET

---

# Mobile Sticky Apply CTA

Recommended core behavior:

After hero leaves the viewport:

```text
Recruitment open              [ Apply ↗ ]
```

Rules:
- hidden while hero CTA is visible
- hidden when mobile menu is open
- hidden on `/apply`
- may hide near final CTA if visually redundant
- safe-area aware
- never bouncing/pulsing
