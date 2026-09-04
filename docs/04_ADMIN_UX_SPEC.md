# Admin UX Specification

Canonical direction:

**Soft Editorial Workspace × Recruitment Operations Tool**

Admin is a work surface, not a flashy landing page.

Primary:
- desktop-first
- tablet-friendly
- mobile-functional

---

# 1. Login

Route direction:
`/admin`

Simple centered login:
- E-CELL MET
- Recruitment Command Center
- username
- password
- Sign in →

No public signup.
No marketing content.
No heavy visual decoration.

---

# 2. Main Layout

Desktop:

```text
SIDEBAR            MAIN WORKSPACE

E-CELL             Recruitment 2026–27
Overview
Candidates
Teams
Analytics

Admin
Logout
```

Visual:
- warm off-white
- white/cream surfaces
- thin borders
- minimal shadow
- deep charcoal text
- muted pastel status colors

No scrapbook graphics.

---

# 3. Overview

Purpose:
Answer “What is happening in recruitment right now?”

Top metrics:
- Total Applications
- Submitted
- Under Review
- Shortlisted
- Interview
- Selected
- Rejected

Status colors:
- Submitted → Powder Blue
- Under Review → Butter Yellow
- Shortlisted → Lavender
- Interview → Peach
- Selected → Sage
- Rejected → Muted Rose

Useful blocks:
- Applications by Team
- Applications by Year
- Recent Applications
- Recruitment Funnel

Avoid a dashboard full of meaningless charts.

---

# 4. Candidates Page

This is the primary working screen.

Header:
Candidates
N applications

Search:
Name, email, phone, Application ID

Filters:
- Team
- Status
- Year
- Branch

Quick status tabs:
- All
- Submitted
- Under Review
- Shortlisted
- Interview
- Selected
- Rejected

Active filter chips:
- Technical ×
- First Year ×
- Shortlisted ×

Clear all.

Default sort:
Newest first.

Optional:
- Oldest first
- Name A–Z

---

# 5. Desktop Candidate Table

Preferred over cards for 100–150 candidates.

Columns:
- Candidate
- Year
- Primary Team
- Status
- Applied
- Action / row interaction

Do not clutter each row with:
- full phone
- full email
- entire answer
- many buttons

Row click opens candidate detail.

---

# 6. Candidate Detail

Desktop:
Right-side drawer (~500–600px).

Mobile:
Full-screen detail view.

Order:
1. Candidate identity
2. Team preference
3. Current status
4. Contact / academic details
5. General answers
6. Team-specific answers
7. Availability
8. Internal notes
9. Status action

Keep filters/scroll position when drawer closes.

---

# 7. Status Workflow

Canonical stages:
- Submitted
- Under Review
- Shortlisted
- Interview
- Selected
- Rejected

Use one clear status control rather than six giant buttons.

Sensitive changes (Selected / Rejected) may use confirmation.

Rejection is not deletion.

---

# 8. Internal Notes

Required V1 feature.

Field:
Internal notes

Helper:
Only admins can see these notes.

Manual Save Note is acceptable for V1.

Candidate tracking endpoint must never expose these notes.

---

# 9. Evaluation Scope

Do NOT build a complex 5-dimension star rating system in V1.

V1:
- status
- internal notes

Optional later:
- single overall score

Avoid scoring complexity until criteria are explicitly defined.

---

# 10. Teams Page

Operational summary, not full CMS.

For each team show:
- total applicants
- shortlisted
- interview
- selected

Click team → Candidates page pre-filtered to that team.

---

# 11. Analytics

Useful only:
- Applications by Team
- Applications by Year
- Applications by Branch
- Applications by Status
- Recruitment Funnel

No chart overload.

---

# 12. Export

Keep CSV export.

Options:
- Export all candidates
- Export current filtered view

No need for PDF export in V1.

---

# 13. Edit / Delete

Manual edit:
Allowed for correcting candidate data.

Delete:
Hidden in destructive secondary menu.

Delete requires confirmation.

Rejected applications remain stored.

---

# 14. Manual Applicant Creation

If existing functionality is easy to preserve:
`+ Add Applicant`

Keep secondary, not dominant.

---

# 15. Mobile Admin

On mobile:
- candidate table becomes compact list cards
- filters accessible through compact control
- candidate detail becomes full screen
- no desktop table squeezed into phone

Tablet:
List + drawer can coexist.

---

# 16. Empty / Loading / Error States

Empty:
**No candidates match these filters.**

Fresh database:
**No applications yet. New candidates will appear here once recruitment opens.**

Loading:
Use skeletons, not giant spinners.

Error:
**Couldn't load candidates.**
[ Try again ]

Failed status update must not visually pretend success.

---

# 17. V1 Priorities

Critical:
- login
- protected admin access
- candidate list
- search
- filters
- candidate details
- status update
- internal notes
- mobile usability

Important:
- overview metrics
- team stats
- CSV export

Later:
- bulk actions
- multiple reviewers
- audit log
- complex scoring
- interview scheduler
