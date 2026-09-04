# Responsive + Motion System

## 1. Core Rule

Participant:
**Mobile-first, desktop-enhanced**

Admin:
**Desktop-first, mobile-functional**

Mobile is not a shrunken desktop layout.

---

## 2. Design Ranges

- Mobile Small: 320–374px
- Mobile Standard: 375–430px
- Mobile Large: 431–639px
- Tablet: 640–1023px
- Desktop: 1024–1439px
- Large Desktop: 1440px+

Critical QA sizes:
- 360×800
- 390×844
- 430×932
- 768×1024
- 1024×768
- 1366×768
- 1440×900

390px is the primary participant reference width.

---

## 3. Spacing

Mobile:
- page gutters: 16–20px
- major vertical section gaps: ~72–96px
- dense section gaps: ~56–72px

Tablet:
- horizontal: ~32–48px
- vertical: ~88–120px

Desktop:
- content gutters: ~48–72px
- major section gaps: ~120–176px

Use a consistent spacing rhythm rather than random padding utilities.

---

## 4. Content Widths

- main desktop content: ~1200–1320px
- reading copy: ~560–680px
- forms: ~720–860px
- FAQ: ~760–900px
- admin: wider as needed

Do not stretch paragraphs to full desktop width.

---

## 5. Responsive Typography

Approximate only until final fonts are selected.

Hero:
- Mobile: ~42–54px
- Desktop: ~70–96px

Section headings:
- Mobile: ~34–46px
- Desktop: ~48–68px

Body:
- Mobile: 16–18px
- Desktop: 17–19px

Do not solve responsive hierarchy by suddenly using heavy font weights.

---

## 6. Structural Transformations

### Hero
Desktop:
copy + collage

Mobile:
copy
→ CTA
→ media

### About
Desktop:
text + image

Mobile:
text
→ image

### Life at E-CELL
Desktop:
asymmetric scrapbook collage

Mobile:
vertical editorial story

### Teams
Desktop:
asymmetric grid

Mobile:
featured team + compact selector

### Journey
Desktop:
horizontal/curved

Mobile:
vertical

### Application
Mobile:
single column

Desktop:
simple fields may become two columns; textareas stay full width

### Admin
Desktop:
table + drawer

Mobile:
list + full-screen candidate detail

---

## 7. Touch Targets

Minimum:
~44×44px

Primary CTA:
~52–56px height

Full team card should be tappable.

No tiny close icons or hover-only actions.

---

## 8. Motion Personality

Canonical motion:
**Soft physical movement**

Think:
paper/card settling gently.

Allowed:
- fade
- small translate
- tiny rotation settle
- underline draw
- accordion expand
- arrow shift
- drawer slide
- subtle card lift

Avoid:
- bounce
- huge scale
- strong parallax
- glowing motion
- constant looping
- scroll hijacking

---

## 9. Timing

Micro interactions:
140–220ms

Standard UI transitions:
200–320ms

Editorial reveals:
320–500ms

Avoid routine 1s+ transitions.

Use natural ease-out / ease-in-out.

---

## 10. Scroll Reveal

Good candidates:
- section heading
- major image
- selected scrapbook images
- benefit cards
- timeline stages

Usually static:
- body paragraphs
- FAQ rows
- footer
- form labels
- admin table

Not every element needs animation.

---

## 11. Hero Entry

Soft stagger:
- badge
- headline
- copy
- CTA
- main image
- secondary image

Keep stagger subtle (~60–100ms difference).

Content must still become usable immediately.

---

## 12. Form Motion

Minimal.

Step transition:
~180–240ms
small fade/translate

Validation:
gentle appearance
no shaking inputs

Success:
small stars/doodles may appear
no full-screen particle show

---

## 13. Admin Motion

Allowed:
- drawer slide
- dropdown
- filter chip
- skeleton
- modal fade
- status update transition

Avoid:
- parallax
- decorative scroll reveals
- bouncing charts
- unnecessary flourish

---

## 14. Reduced Motion

Respect:
`prefers-reduced-motion`

When enabled:
- disable parallax
- remove rotations
- remove decorative doodle animation
- scroll reveals become static
- step transitions become instant or minimal fade

Functionality must remain unchanged.

---

## 15. Performance

Priority order:
1. nav
2. headline
3. copy
4. CTA
5. hero primary visual
6. below-fold media
7. decorative assets

Images:
- responsive sizes
- reserve aspect ratio
- WebP/AVIF where appropriate
- do not send giant originals to small cards

Video:
- poster first
- muted if autoplay exists
- mobile may receive static poster
- featured video loads on interaction where possible

Fonts:
- limited weights
- avoid unnecessary files

---

## 16. Layout Stability

- reserve image/video dimensions
- avoid layout shifts
- loading text should not resize buttons dramatically
- use sensible font fallbacks
- no fixed heights that clip content

Use `svh/dvh` carefully.
Avoid blind `height: 100vh`.

---

## 17. Safe Areas

Sticky mobile elements must respect:
`env(safe-area-inset-bottom)`

Applies to:
- sticky Apply CTA
- form navigation
- mobile sheets

---

## 18. Mobile QA Rule

Every participant-facing component must be checked at ~390px before desktop work is considered complete.

Implementation loop:
Build
→ 390px check
→ 430px check
→ desktop check
→ fix

No “desktop first, mobile at the end.”
