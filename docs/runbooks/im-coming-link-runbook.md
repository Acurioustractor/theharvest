# "I'm coming" link — the 10-minute runbook

> 2026-06-06. The last blocker on the June-20 page is the GHL trigger link/env value.
> `VITE_GHL_IM_COMING_URL` is the public page setting; without it, the button falls back to
> `#ways-in`.
> Branch `wip/june-20-page-2026-06-03` is pushed and waiting.

## Know this first (30 seconds)

A GHL **trigger link** only knows WHO clicked when the click comes from a GHL-sent email
(Note 02/03) or from a browser GHL has already cookied. Anonymous walk-ins from the public
page click through untracked — fine, they still land somewhere useful. If you want
*everyone* counted, use Option B (form). Option A is faster and right for launch.

## Option A — trigger link (the planned path, ~10 min)

1. GHL → **Marketing → Trigger Links → + Add Link**
   - Name: `Pizza RSVP — I'm coming (20 June public)`
   - URL (where the click lands): `https://www.theharvestwitta.com.au/june-20`.
2. Copy the trigger-link URL GHL gives you (looks like `https://link.../widget/tl/...`).
3. GHL → **Automation → Workflows → + New → trigger: "Trigger Link Clicked"** → pick
   `Pizza RSVP — I'm coming (20 June public)` → add two actions:
   - **Add Tag** `rsvp-pizza-dinner`
   - **Add Tag** `witta-gathering-2026-06-20`
   - Tag, not pipeline move. No drip, no tier — headcount only (per the tag canon).
   - Publish the workflow.
4. Set the trigger-link URL in env:
   - Local: `VITE_GHL_IM_COMING_URL=https://...`
   - Vercel production: set the same env var, then redeploy.
5. Ship: merge the June-20 page branch to main → deploy.
6. Test: click the button from YOUR phone (you're a known contact) → check your own GHL
   record grew both tags. Anonymous test in a private window → confirms the redirect works,
   but may not count unless GHL can identify the visitor.

## Option B — form (if you want every RSVP captured, ~20 min)

GHL → Sites → Forms: name + email + "I'm coming" button → on-submit workflow adds the
same `rsvp-pizza-dinner` + `witta-gathering-2026-06-20` tags (upserts unknown visitors as
new contacts, `source:website`). Embed or link it as `VITE_GHL_IM_COMING_URL`. Counts everyone, costs a
name+email ask.

## Day-of and after

- Headcount = contacts tagged `rsvp-pizza-dinner` (smart list it). The broader event bucket is
  `witta-gathering-2026-06-20`.
- AFTER the day: actual attendance is the real signal — when the Humanitix webhook lands
  (post-20-June plan), attendance becomes `attended:<event-slug>` and feeds The Field's
  contact warmth. RSVP tags never move anyone's tier. Ever.
