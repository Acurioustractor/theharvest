# Site refresh + community/staff feedback — plan

Drafted 2026-07-05. Awaiting Ben's two decisions (marked **DECISION** below) before any building or sending. Nothing here has been published or sent.

## Where we are (so we build on it, not over it)

The site already moved to open-era copy on 2 July (commit `96f51f0`). The comms layer already holds most of what a "recap" needs:

- `now-open-communications-map-2026-07.md` — the spine, the three doors, next phases by area, the blocked list.
- `post-opening-newsletter-2026-07.md` — a post-opening newsletter draft.
- `photo-and-content-system-2026-07.md` — how photos flow in.

So "refresh the site with a recap of what has happened" is mostly a **surfacing and freshening** job, not a rebuild. The story spine is written. What is missing is (a) real photos from the opening, and (b) a clear way for people to tell us how it is going.

## Hard constraints (do not break)

- **No fabricated facts.** We do not have attendance numbers, and no 20 June opening photos exist anywhere yet. The recap uses "it is open, it is still being made" framing, not claims about crowd size or finished builds.
- **Voice.** No em-dashes, no marketing words (vibrant, tapestry, testament, pivotal). Work days, not working bees.
- **Photos we actually have (15):** aerial, seed-house front, community-gathering, gathering-recap-crowd, member-welcome-crates, local-produce, harvest-eat, barry x2, team-garden-selfie. That is the whole real library. Anything beyond this needs Ben to supply files.

## Privacy note to clear first

`client/public/images/optimized/sophie-garden-1000.webp` is Sophie's selfie. We removed every page reference, but the **file itself is still in the repo and reachable by direct URL**. To honour her request fully, the file should be deleted (and its source in `client/public/images/`). Recommend removing it as part of this pass. Flagging rather than deleting unprompted because it is a person's photo.

## DECISION 1 — what the refresh is

Recommendation: **update the existing pages** (option B), not a new page. The site is already open-era; a separate "since we opened" page would duplicate the spine and split attention. Instead:

- Home + "What is The Harvest": add one short, honest "where we are now" beat (open, still being made, first members and makers day happened 20 June, from July it is properly under way).
- Swap in the strongest real photos we have where slots currently show weaker defaults.
- Surface the feedback ask (see Decision 2) with a clear, single call.

If Ben supplies opening-day photos, a light "opening day" strip becomes worth adding. Until then, a new photo-led page would be thin.

Alternatives on the table: (A) a dedicated "Since we opened" page, (C) make the recap a member letter (Note 05) rather than a site change, (D) fuller written plan first.

## DECISION 2 — how we gather feedback

Recommendation: **two channels** (option C), because community and staff need different questions.

- **Community** — a simple feedback form on the site, routing to GHL like the other forms. One or two open questions ("what did you enjoy, what would you change, what would bring you back"). Public, low friction, no login.
- **Staff** — a short focused ask to Trina, Dennis, and the stewards, with operational questions (what worked on the day, what was missing, what they need). Sent, not a public form.

GHL groundwork that already exists: shared ACT location `agzsSZWgovjwgpcoASWG`, Harvest identified by tag; a 147-contact `comms:harvest-newsletter` audience; forms route to GHL. So the community form and any emailed ask can reuse existing plumbing.

Alternatives: (A) on-site form only, (B) emailed ask only, (D) decide feedback after the refresh ships.

## Sequencing once decisions land

1. Clear the Sophie file (privacy) in the same pass.
2. Refresh copy + photos on the chosen surfaces. Build, type-check, show Ben before deploy.
3. Stand up the feedback channel(s). Community form is a site change (safe to build). The staff ask and any member email are **send actions that need Ben's explicit go** and a human sender, not automated.
4. Deploy the site changes (Ben's call, per the manual `the-harvest` promote flow).

## What needs Ben, not me

- The two decisions above.
- Any real opening-day photos (none exist yet).
- Approval before sending anything to the member list or staff.
- The production promote (deploys are manual on `the-harvest`).
