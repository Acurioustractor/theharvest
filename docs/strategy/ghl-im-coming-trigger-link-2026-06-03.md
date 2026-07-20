# GHL build spec: public "I'm coming" RSVP (trigger link)

> Build target for the public 20 June open day (see `RECONCILED-20-june-public-open-day-2026-06-03.md`).
> ~5 minutes in the GHL UI. The API can't create trigger links or workflows, so this is a human step.
> Owner: Ben (or anyone with GHL UI access to location `agzsSZWgovjwgpcoASWG`).

## Why a trigger link, not the B2 booking calendar

The public page needs a **one-tap** "I'm coming" — a booking-calendar form is too heavy for that, and
putting the B2 booking link on the public site would create a **second headcount source** (the 2-Jun plan
forbade B2 on the public site for exactly this reason). Instead the trigger link applies the **same
`rsvp-pizza-dinner` tag** the B2 calendar uses, so `npm run count:rsvps:ghl` still reads one true dough
count. One RSVP surface, one tag, one count.

## Step 1 — Trigger Link

GHL → **Marketing → Trigger Links → + Add**
- **Name:** `Pizza RSVP — I'm coming (20 June public)`
- **Redirect URL:** `https://www.theharvestwitta.com.au/june-20`
- Save. Copy the generated link (looks like `https://link.theharvest…/…` or an `api.leadconnectorhq.com` link).

## Step 2 — Workflow that tags the click

GHL → **Automation → Workflows → + Create Workflow** (blank)
- **Trigger:** `Trigger Link Clicked` → choose the link from Step 1.
- **Action 1:** `Add Contact Tag` → **`rsvp-pizza-dinner`**
- **Action 2:** `Add Contact Tag` → **`witta-gathering-2026-06-20`**
- **No Action 3. Tags only.** Do NOT create a Membership Journey card from this click. An RSVP is
  not a rung. The public stays in the outer ring (curious) and climbs only by *doing*, hand-read
  after the day (orbit model, see `harvest-audience-map-2026-06-03.md`). Auto-climbing is the
  funnel reflex this design refuses.
- **Settings → Re-entry: OFF** (one contact, one count, no double-tagging).
- **Publish** (toggle the workflow live, not just save).

### Guardrails (do not skip)
- **Tags only, no pipeline.** No auto-climb into Membership Journey. People enter the rings by doing, hand-read.
- **Do NOT add `harvest-member` or `harvest-newsletter`** here. An event "yes" is not a subscribe.
- **Community line.** A Jinibara elder / storyteller who taps the link carries `lane:community` and must never be ringed, scored, or dripped. A gathering tag for the headcount is fine; nothing else.
- **Do NOT also put the B2 booking link on the public page.** Trigger link is the single public RSVP surface.

## Step 3 — Wire the page

Set the Step 1 link in local/Vercel env:
```text
VITE_GHL_IM_COMING_URL=https://…paste-the-trigger-link…
```
The page already routes an `http(s)` value as an external link and falls back to scroll-to-`#ways-in`
while it's empty, so nothing is ever a dead link. Then the page is ready to deploy.

## Step 4 — Verify before counting it done
- In GHL, click the trigger link yourself (incognito / a test contact), then confirm that contact now
  carries `rsvp-pizza-dinner` + `witta-gathering-2026-06-20`.
- Run `npm run count:rsvps:ghl` and confirm the `rsvp-pizza-dinner` tag count ticked up by one.
- Remove the test tag from your test contact so it doesn't inflate the dough count.

## The dough count, day-of
`rsvp-pizza-dinner` tag count = your live headcount = the dough order. Watch it through launch week; for an
uncapped public day it's the only real turnout signal you have, so it also feeds the insurance/parking/hands
planning in the reconciliation doc's Gates.
