# GHL completion handoff — 20 June public open day (2026-06-03)

> **Single entry point for finishing the GoHighLevel build.** Written so another Claude Code
> instance can pick this up cold. Reconciled to the **public open day** decision
> (`RECONCILED-20-june-public-open-day-2026-06-03.md`). Where older GHL docs assume the private
> members'-day model, this handoff and the RECONCILED note win.
>
> Location: `agzsSZWgovjwgpcoASWG`. **Everything below needs the GHL UI** — the connector/API
> exposes search/fetch but NOT workflow-builder or campaign-create (confirmed 2-Jun handoff).

## The one design decision the pivot resolves

The **trigger link AND the B2 calendar both apply `rsvp-pizza-dinner`**, so two entry surfaces
aggregate into **one dough count**:
- **Public** → one-tap **trigger link** on `/june-20` (low friction). Spec:
  `ghl-im-coming-trigger-link-2026-06-03.md`.
- **Members** → **B2 booking calendar** via the email CTA (gives a calendar invite + reminders).
- **Both** tag `rsvp-pizza-dinner` → `npm run count:rsvps:ghl` reads one number.
- **B1** maker-morning calendar stays but **private** (not on the public page; sub-decision 3).

## Current state (what's already built)

**Verified by query 2026-06-03:** pipelines *The Shop pipeline* (`Pdtr1ZIOvg3LrMSeNvHe`),
*Harvest Membership Journey* (`ijPN2jEoEuMshXXKbQ4z`, Curious→Steward), *Harvest Inbox*
(`5ZqAuFokM4LsNqMCMPmY`).

**Per 2-Jun handoff (not re-verified this session):**
- Calendars live: **B1** `M0KzSu7Bo3jJ3ZQta3ag` (maker session); **B2** `4IpU9GnzAChTMkKFJPWi`
  (afternoon+pizza); **shop-chat** `viM1BRnHG9gwpIEZd4HM` (Ben/Nic round-robin).
- Booking links: B1 `…/harvest-2026-06-20-maker-session`, B2 `…/harvest-2026-06-20-afternoon-pizza`,
  shop-chat `…/harvest-shop-chat`.
- All required tags present (`rsvp-maker-morning`, `rsvp-pizza-dinner`, `shop-call-booked`, etc.).
- Connector reauthed; 1,152 contacts / 160 Harvest / 0 unintended refreshes.
- 6 email templates created (IDs in `content-calendar-june-2026.md` build checklist).

## Remaining build queue (ordered)

### P0 — launch-gating, do first
1. **3 calendar→tag workflows** (GHL UI → Automation → Workflows; trigger *Customer Booked Appointment*):
   - B1 → add `witta-gathering-2026-06-20` + `rsvp-maker-morning`
   - B2 → add `witta-gathering-2026-06-20` + `rsvp-pizza-dinner`
   - shop-chat → add `harvest-shop-interest` + `shop-call-booked`
   - Re-entry OFF. Publish. Then **test-book each**, check tags, run `npm run count:rsvps:ghl`.
2. **"I'm coming" trigger link + workflow** → `rsvp-pizza-dinner` + `witta-gathering-2026-06-20`.
   Build per `ghl-im-coming-trigger-link-2026-06-03.md`, then paste link into `GardenLaunch.tsx:22`
   `IM_COMING_URL` and deploy the page.
3. **Email campaigns** (one-off Campaigns, never Workflows; a broadcast never adds tags):
   - **Update all 6 templates** to **gate 1pm / pizza 5pm** (the repo source in
     `content-calendar-june-2026.md` is already fixed; the GHL templates are not).
   - **Re-time Harvest Note 02 to Fri 6 Jun** (members before the Sat 7 public announce).
   - Test-send each to Ben, check on mobile, first-name fallback `there`, from name `The Harvest`.
   - Schedule: Field Note (Wk4, public, dateless — can go now) · Makers' invite (Wk4) · Note 02
     (Fri 6) · Note 03 (Fri 19) · Thank-you (post-event) · early-July note (post-debrief).

### P1 — not launch-gating, can land after 20 Jun
4. **Shop nurture workflow** (spec 6): trigger `harvest-shop-interest` → Wait 4 days → If/Else by offer
   tag → send → tag `shop-nurture-sent`. Drop the shop-chat booking link into `[booking link]` + `/shop`.
5. **Maker smart list**: has any of `harvest-shop-interest` / `shop-prospect` / `shop-produce` /
   `shop-maker` / `shop-food` / `shop-consignment` / `shop-follow-up` + known doers. Feeds the Makers'
   invite segment + ongoing shop touches.
6. **5 silent receipts** (workshop, quiz, business, event, pulse) — auto-replies.

### Parallel / external
7. **Social Planner** — schedule the **6 public dated posts** from `docs/content/june-20-copy.md` §4
   (the date is now allowed publicly). Approved real media only, consent gate on faces. After scheduling:
   `npm run sync:social -- --pull-ghl --apply`.
8. **Susie/Joey GHL users** — create, then move shop-chat ownership to them + connect Google Calendar
   2-way (theirs + Ben). Until then shop-chat stays Ben/Nic.

## Decisions to settle in the GHL session
- **Sender:** `hi@act.place` (default — does not risk the date) vs verified Harvest sending domain.
- **Members RSVP path:** B2 booking (rec) vs point members at the trigger link too. Both feed
  `rsvp-pizza-dinner` either way.
- **RSVP → Membership Journey:** optionally have the "I'm coming" workflow also create a *Curious*
  card (`85da97c5-…`) so RSVPs become nurturable. Tag-only is fine for launch.
- **Maker-morning hours / handoff** to the 1pm public gate (sub-decision 3 in RECONCILED). Emails
  currently set maker session 10am–1pm; B1 calendar is still 10am–2pm — align them.

## Guardrails
- An RSVP **never** adds `harvest-member` or `harvest-newsletter` (a yes is not a subscribe).
- A broadcast Campaign **never** adds tags (tags come from Workflows/trigger links only).
- One public RSVP surface (trigger link); don't also put the B2 booking link on the public page.
- Voice gate on any new public copy: no em-dashes, no AI tells, consent checked, no invented facts.

## Acceptance checks (run before claiming the GHL build is live)
```bash
npm run audit:contacts:ghl     # contacts scanned, 0 unintended tag refreshes
npm run count:rsvps:ghl        # B1/B2 + rsvp tag counts = the headcount
npm run report:social:ghl      # social planner drafts/scheduled
```
Manual: test-book B1/B2/shop-chat land the right tags; click the trigger link applies its tags;
campaign test-sends render on mobile with `there` fallback; no broadcast added a tag.

## Blockers (from 2-Jun handoff)
- GHL workflow-builder + campaign create/update not reliable via API → all UI.
- Susie/Joey not yet GHL users.
- Google Calendar 2-way sync unverified in UI.

## Canonical docs (pull detail as needed, don't re-derive)
- `RECONCILED-20-june-public-open-day-2026-06-03.md` — the decision + per-surface actions.
- `ghl-im-coming-trigger-link-2026-06-03.md` — the trigger-link build.
- `june-sprint-operating-plan-2026-06-02.md` — audiences, build queue, campaign queue (private-model
  framing; defer to RECONCILED where they differ).
- `content-calendar-june-2026.md` — email copy (already updated to 1pm/5pm + Fri-6 Note 02) + checklist.
- `ghl-setup-runbook.md`, `ghl-workflow-build-specs.md`, `email-operating-system.md` — step detail.
- Maker 1:1 outreach (independent of the open day): `research/data/harvest-shop-send-list.md` +
  `harvest-shop-outreach-messages.md`.
