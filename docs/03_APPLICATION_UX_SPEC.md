# Application UX Specification

Route: `/apply`

Core principle:

> The application should feel shorter than it actually is.

Participant-facing form is mobile-first.

Canonical wizard:

1. You
2. Your Squad
3. Review

---

# 1. Form Shell

Mobile:

```text
E-CELL MET                  Exit

01 ●──── 02 ○──── 03 ○
You       Squad    Review

Current step heading
Helper copy

Form content

[ Back ]      [ Continue → ]
```

Visual environment:
- warm ivory
- calm
- minimal doodles
- no marketing collage
- no distracting animation
- focused reading width

Desktop content width:
~720–860px.

---

# 2. Step 1 — You

Goal:
Fast, low-effort start.

Field order:
1. Full Name
2. Email Address
3. WhatsApp Number
4. Branch / Department
5. Year of Study
6. Part of another club?
7. If Yes → Which club(s)?

No motivation questions in Step 1.

Year options:
- First Year (FE)
- Second Year (SE)
- Third Year (TE)

Branch options should come from config, not remain trapped in JSX.

---

# 3. Validation

Inline validation only.

Examples:
- This field is required.
- Enter a valid email address.
- Enter a valid WhatsApp number.

Do not show a giant summary of errors at the top.

Visual:
- soft rose border
- concise message under the field
- error disappears once fixed

Normalize:
- email → lowercase + trim
- phone → normalize spaces/dashes and optional +91 formatting

Duplicate application error must be human-readable.

---

# 4. Step 2 — Your Squad

Heading:
**Find your place**

Sub:
Pick the team you'd genuinely enjoy contributing to. You don't need to be an expert already.

## Primary Team
Required.

Use visual team cards, not a plain select.

Selected card:
- clear checkmark
- pastel team surface
- visible selected state beyond color alone

## Secondary Team
Optional.

Rules:
- cannot equal primary
- more compact selection UI is acceptable
- no second full questionnaire

---

# 5. Common Questions

Ask after team selection:

### Why E-CELL?
Why do you want to be part of E-CELL MET?

### Primary team fit
Why does your primary team feel like a good fit for you?

### Experience
Tell us about something you've built, created, organised, researched or contributed to.

### Availability
How much time can you realistically give E-CELL each week?

Options:
- 2–3 hours
- 4–5 hours
- 6–8 hours
- 8+ hours
- Depends on the event schedule

---

# 6. Dynamic Team Questions

Show only the selected primary team's question set.

Heading pattern:
**A few Technical-specific questions**
or corresponding team.

Team questions live in central config.

If primary team changes:
- do not instantly erase previous team answers from local state
- restore previous answers if user switches back
- submit only currently selected primary team's answers

Secondary preference gets only:
**Why might your second-choice team also suit you?**
Optional, short.

---

# 7. Word / Character Guidance

Use soft limits/guidance for longer text fields.

Suggested:
- Why E-CELL: ~50–250 words
- Why primary team: ~30–180 words
- Secondary reason: ~100 words max

Counters should guide, not make the form feel like an exam.

---

# 8. Autosave

V1:
Use browser local storage.

Behavior:
- save draft quietly
- on return/refresh, detect unfinished draft
- show:

**Welcome back.**
We found an unfinished application on this device.

Buttons:
- Continue draft
- Start over

Clear local draft only after successful server submission.

Quiet feedback:
**Saved on this device**

Do not spam toasts.

---

# 9. Navigation

Back/Next must never erase data.

Keep wizard in one route rather than separate pages for each step.

On step transition:
- validate current step
- soft 180–240ms transition
- scroll to top of form content

No page reload.

---

# 10. Step 3 — Review

No new questions.

Heading:
**Almost there.**

Sub:
Take one last look before you send it.

Review sections:
- ABOUT YOU
- YOUR SQUAD
- YOUR STORY
- [TEAM NAME] QUESTIONS

Each section has Edit.

Editing:
- jumps directly to relevant step
- after edit, allow Return to review →

Confirmation:
I confirm that the information above is accurate and submitted by me.

CTA:
Submit application →

Loading:
Submitting...

---

# 11. Submission Behavior

On submit:
- disable button
- prevent duplicate clicks
- keep draft until server success

On network failure:

**We couldn't submit your application. Your answers are still safe—please try again.**

Show:
[ Try Again ]

On success:
- clear local draft
- redirect to `/apply/success?id=...`

Never expose raw MongoDB ID as the participant-facing application identifier.

---

# 12. Mobile Rules

- one-column form
- 44px minimum touch target
- 52–56px primary CTA height
- correct input types (`email`, `tel`, `url`)
- sticky Back/Continue may be used on long step 2
- safe-area aware
- sticky bar must not cover keyboard/input
- no hover-dependent behavior
- team cards must remain easy to tap
- textareas comfortable for thumb typing

---

# 13. Accessibility

- real labels
- semantic radios/checkboxes behind visual cards
- keyboard accessible
- visible focus states
- errors associated with fields
- selected state not communicated by color alone
- readable progress indicator
- reduced motion supported

---

# 14. Do Not Build in V1

- participant account/login
- complex server-side draft system
- mandatory resume
- heavy file uploads
- timed application
- AI scoring
- automatic rejection
- 20 questions per team
- huge portfolio upload system
