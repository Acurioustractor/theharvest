# The Harvest: Priority Build Plan

> Created 2026-05-28. The single priority-ordered execution view, built so each row can become
> a task with an owner. Shop-led. This orders the work and names who, when, and done-when; the
> detail lives in the companion docs. Voice: plain, no marketing-speak.
>
> Detail docs: `shop-operating-system.md` (shop model), `launch-readiness-20-june-2026.md`
> (the 20 June countdown), `ghl-setup-runbook.md` (how to build in GHL),
> `ghl-workflow-build-specs.md` (email copy), `content-calendar-june-2026.md` (the dated copy),
> `ghl-pipeline-playbook.md` (pipelines + founding circle), and
> `june-sprint-operating-plan-2026-06-02.md` (current June sprint source of truth).
>
> Reconciled 2026-06-02: current 20 June model is B1 maker session 10am to 2pm, capacity 18,
> and B2 afternoon plus pizza from 2pm, capacity 40. The older 3pm-7pm proof-night model is
> superseded. HighLevel app connector is reauthenticated. B1, B2, and shop-chat calendars
> are live in GHL; calendar tag workflows and campaign test sends are still unverified.

## How to read this

Four priorities, in order. **P1 (the shop) is the substance:** the reason the place works as a
community hub. **P2 (20 June) is the moment,** and it carries the only immovable dates, so a few
P2 items must interleave early even though the shop leads. P3 and P4 follow.

Every row is task-shaped: owner, what it depends on, done-when. "GHL UI" means no code, follow
the runbook. Owners are suggested defaults (Ben builds/tech, Nic vision/design, Susie + Joey
stewards/people); reassign as you like.

## The immovable dates (so nothing in P1 buries them)

- **Calendars are overdue as of Tue 2 Jun** (gates the launch emails). First move:
  reauthenticate HighLevel connector or build directly in the GHL UI.
- **Wk4 Makers' invite 2 to 8 Jun. Harvest Note 02 Tue 9 Jun. Harvest Note 03 Fri 19 Jun.**
- **Sat 20 Jun: the day.** PL insurance bound before it (hard gate).

---

## Priority 1: The Shop (the community shared shelf)

The locked model: a Harvest-run shared shelf now, consignment, about 75 to 80 percent to the
maker, Square till, stewards plus maker weekend shifts, honest signage. The commercial
cafe/retail is sublicensed later. The shelf opens **progressively, not big-bang**, so most of
this runs past 20 June. The makers are also who the 20 June maker session is for, which is why
the maker smart list and the shop nurture feed straight into the launch.

**Done already:**
- [x] `/shop` page + lightened intake live.
- [x] Shop stockist pipeline built + wired (`GHL_SHOP_PIPELINE_ID` = `Pdtr1ZIOvg3LrMSeNvHe`).
- [x] Immediate shop-interest receipt workflow wired (`GHL_SHOP_INTEREST_WORKFLOW_ID`).

**Tasks:**

| Task | Owner | Depends on | Done when |
|------|-------|-----------|-----------|
| Build shop nurture workflow (spec 6) | Susie/Joey | nothing (tag exists) | tag-trigger fires; a test EOI gets the 4-day second-touch email |
| Build book-a-chat calendar | Susie/Joey | Google sync | link live, test booking lands (runbook Part 0, step 4) |
| Drop book-a-chat link into spec 6 + `/shop` | Ben | calendar | link on `/shop` and in the nurture email |
| Build maker smart list | Susie/Joey | nothing | list returns the shop EOIs/makers; reused for the Wk4 invite + "new on the shelf" |
| Confirm consignment split + GST treatment | Ben + Standard Ledger | SL reply | the % and agency-vs-resell decided, so signage can print |
| Square setup (account, card reader, payouts) | Ben + steward | none | a test sale and maker payout run end to end |
| Food-business tier for the shelf | Ben | food-business roadmap | what food can be sold is written down, any cert in train |
| Signage: shop-wide pledge + per-product maker | Nic | consignment % | designed + printed, states the split honestly |
| First-shelf makers + stage-2 detail | Susie/Joey | maker smart list | first makers named; produce type/volume on their contact |
| Weekend hours + steward/maker shift model | Susie/Joey | none | a simple roster pattern agreed |

---

## Priority 2: 20 June members' day (the moment, immovable dates)

Detail and countdown: `launch-readiness-20-june-2026.md`. Copy: `content-calendar-june-2026.md`.

| Task | Owner | Depends on | Done when |
|------|-------|-----------|-----------|
| Decide seat capacities (B1, B2) | Ben/Nic | none | B1 18 and B2 40 confirmed or changed in writing |
| Build B1 + B2 RSVP calendars | Susie/Joey | capacities, Google sync | both links live, test bookings land (runbook Part 0) |
| Build B1/B2/shop-chat tag workflows | Susie/Joey | calendars | test bookings apply the right tags and no subscription tags |
| Send Wk4 Makers' invite | Ben/Susie | B1+B2 links, maker smart list | broadcast to makers/doers, date carried, 2 to 8 Jun |
| Send Harvest Note 02 | Ben/Susie | B2 link, sender decision | broadcast to `harvest-member`, Tue 9 Jun |
| Send Harvest Note 03 | Ben/Susie | none | Fri 19 Jun |
| **PL insurance bound (Harvest Pty)** | Ben + Nic + broker | none | $20M PL certificate in hand before 20 Jun (**HARD GATE**) |
| Pizza lead | Ben/Nic | none | someone owns the make-your-own pizza dinner |
| Extra hands for the maker session | Nic | none | Kurtis + partner / the Holland contact confirmed |
| Maker name + photo (Wk3 social B) | Ben/Nic | none | a real on-site person named, photo supplied |
| Real photos for the social posts | Ben/Nic | none | attached at send time |

---

## Priority 3: CRM / automation backbone (after the launch crunch)

| Task | Owner | Depends on | Done when |
|------|-------|-----------|-----------|
| Build the 5 silent receipts (specs 1-5) | Susie/Joey | none | workshop/quiz/business/event/pulse submits each get a receipt; `verify:forms:ghl` passes |
| Member reconfirm (15 legacy) | Susie/Joey | trigger links | the 15 asked, list sorted by their answer |
| Conversations inbox + LeadConnector app | Susie/Joey | phone number | Susie + Joey replying from the app, logged on contacts |
| WhatsApp | Susie/Joey | fresh Meta Business acct | connected (the fiddliest, do last) |
| Custom fields for stage-2 profiling | Susie/Joey | none | produce type / volume / stall-size fields exist |
| Fix `hi@act.place` sender (Harvest address) | Ben | domain verify | Harvest address verified + set in workflows (parked, optional pre-launch) |

---

## Priority 4: Entity / finance (Standard Ledger gated)

| Task | Owner | Depends on | Done when |
|------|-------|-----------|-----------|
| Send Standard Ledger the two questions | Ben | none | email sent (draft ready in `thoughts/wiki/operations/email-standard-ledger-draft.md`) |
| Founding-circle money mechanism decided | Ben + SL | SL reply | A Kind Tractor vs Harvest Pty chosen; only then build the pipeline; for now tag `harvest-founding-interest` |
| Consignment % (also feeds P1 signage) | Ben + SL | SL reply | the number + GST treatment |

---

## Done this session (2026-05-28)

- [x] Operating-model alignment note: "retail sublicensed" = the future commercial layer, not
      the community shelf.
- [x] 20 June flipped to confirmed (strategic plan + memory).
- [x] Calendar build checklist added to the runbook (Part 0).
- [x] Standard Ledger follow-up questions drafted.
- [x] Ben's departure corrected to 27 June across docs + memory.

## Done this session (2026-06-02)

- [x] Added `june-sprint-operating-plan-2026-06-02.md` as the current June source of truth.
- [x] Marked B1/B2 model as current and the 3pm-7pm proof-night model as superseded.
- [x] Verified local GHL audit/report commands still read live data while the HighLevel app
      connector needs reauthentication.
- [x] Expanded the June content calendar with the thank-you email, early July note, GHL
      campaign checklist, and acceptance checks.

## Next: turn this into tasks

Every table row is task-shaped (owner + depends-on + done-when). The canonical action surface
is the Notion main Actions DB, Harvest view. Suggested load order: P1 plus the immovable P2
dates first, owners assigned, then P3 and P4.
