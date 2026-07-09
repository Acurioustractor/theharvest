# Launch Readiness: 20 June Members' Day

> **SUPERSEDED 2026-06-03. 20 June is now a PUBLIC OPEN DAY.** Written for the private
> members'-day model (capped, members-first, date public never, pizza from 2pm). That model is
> retired. Current truth: `RECONCILED-20-june-public-open-day-2026-06-03.md` (everyone welcome,
> public date, RSVP via the public page plus the B2/trigger-link, pizza from 5pm). Read the framing
> here as history. Still-valid operational detail (calendar IDs, tags, GHL build steps) stands.

> Created 2026-05-28. The single sequencing view that ties the open launch threads
> together. It does not duplicate the engagement docs; it orders them and names the gates.
> Companion to `community-engagement-launch-plan.md` (why), `ghl-setup-runbook.md` (how to
> build), `ghl-workflow-build-specs.md` (email copy), `content-calendar-june-2026.md` (the
> dated run), `shop-operating-system.md` (the shop model). Voice: plain, no marketing-speak.
>
> Reconciled 2026-06-02 to `june-sprint-operating-plan-2026-06-02.md`. The current model is
> B1 maker session 10am to 2pm, capacity 18, and B2 afternoon plus pizza from 2pm, capacity
> 40. The older 3pm-7pm reply-led proof-night frame is superseded.

## Implementation state on 2026-06-02

- HighLevel app connector is reauthenticated. Connector search returned live GHL contacts.
- Local GHL scripts still work. Latest local audit: 1152 contacts scanned, 160 Harvest
  contacts, 0 unintended tag refreshes, 0 Harvest duplicate email groups.
- B1/B2 calendars and shop-chat calendar are live. `npm run count:rsvps:ghl` currently shows
  B1 0/18 and B2 0/40.
- Calendar tag workflows, Google Calendar sync, Susie/Joey calendar ownership, GHL campaign
  drafts, and GHL test sends are not verified live until the acceptance checks pass.

## The one hard gate

**Public liability insurance bound in The Harvest Pty Ltd's name before 20 June.** No
insurance, no event. Everything else on this page can flex. This cannot. Owner: Ben + Nic
via the broker shortlist (Clear / NFPIB / Aon) tracked in the ACT project; $20M PL minimum
per the lease. State unverified here, confirm against the ACT insurance addendum before
counting it done.

## The date that moves everything

- **Today: 2 June 2026 (Wk4).**
- **Ben departs 27 June, overseas to 15 August.** So Ben is present for launch day (20 June)
  and the week after, but gone for the 30 June sole-trader-to-Pty cutover. Every Ben-only
  decision still wants to clear before 27 June; the email-chain deadlines below are tighter
  anyway. Nic leads the maker session on the day and is on-deck Maleny 20 June to 1 July for
  the commencement window.
- Wk4 (2 to 8 Jun): Makers' invite to makers and doers. Carries the date first, plus both
  RSVP links.
- Wk5, **Tue 9 Jun: Harvest Note 02 to members.** Carries the B2 pizza link.
- Fri 19 Jun: Harvest Note 03, practical details.
- **Sat 20 Jun: the day.** Maker session 10 to 2 (Nic-led), community gathering plus
  make-your-own pizza 2 to late.

## Critical path (what unblocks what)

```
  CALENDARS                        INSURANCE
  B1/B2 RSVP + book-a-chat         Public liability bound
  (GHL UI, ~by 1 Jun)              (broker, before 20 Jun)
        |                                |
   real RSVP links                       |
        |                                |
   Wk4 Makers' invite (2 Jun)            |
        |                                |
   Harvest Note 02 (9 Jun)               |
        |                                |
        +---------> 20 JUNE <------------+
```

Two keystones, run in parallel:
1. **Calendars** are the keystone for the email chain. Until B1/B2 exist, there are no real
   RSVP links, so neither the Wk4 Makers' invite nor Harvest Note 02 can send with the date.
2. **PL insurance** is the keystone for the event itself.

Both must clear before mid-June. The calendars are now overdue: the Makers' invite wants to
go out in the week of 2 June, so B1 and B2 need to be built before that campaign is scheduled.

## The six threads, sequenced

| # | Thread | Status | Blocked on | Owner | Unblocks | When |
|---|--------|--------|-----------|-------|----------|------|
| 1 | B1/B2 RSVP calendars + book-a-chat | Calendars live, workflows not verified | GHL UI workflow build + Google sync + Susie/Joey users | Susie/Joey/Ben | threads 2, 3 | immediate |
| 2 | Harvest Note 02 to members | Copy paste-ready, B2 link live | Sender decision + test send | Ben/Susie | the members' invite | 9 Jun |
| 3 | Maker engine (nurture spec 6, maker smart list) | Specced, shop-chat link live | Workflow build + shop-chat owner update later | Susie/Joey | ongoing shop follow-up | not launch-gating |
| 4 | 20 June readiness opens | In progress | PL insurance, pizza lead, extra hands | Ben/Nic | the day itself | before 20 Jun |
| 5 | Standard Ledger questions | Drafted this session | Ben to send | Ben | founding-circle + shop cut | not launch-gating |
| 6 | Operating-model alignment note | **Done this session** | Nothing | (shipped) | removes shop/retail drift | done |

### Thread 1: Calendars (the email-chain keystone)

Built per `ghl-setup-runbook.md` Part 0. Three calendars are live:
- **B1: Maker session (10am to 2pm)**, ID `M0KzSu7Bo3jJ3ZQta3ag`, capacity **18**.
  Link: `https://api.leadconnectorhq.com/widget/bookings/harvest-2026-06-20-maker-session`.
- **B2: Afternoon + pizza (from 2pm)**, ID `4IpU9GnzAChTMkKFJPWi`, capacity **40**.
  Link: `https://api.leadconnectorhq.com/widget/bookings/harvest-2026-06-20-afternoon-pizza`.
  **B2 bookings = the dough count.**
- **Book a chat about the shop**, ID `viM1BRnHG9gwpIEZd4HM`, current Ben/Nicholas round-robin.
  Link: `https://api.leadconnectorhq.com/widget/bookings/harvest-shop-chat`.
  Move this to Susie/Joey after their GHL users exist. This serves thread 3.

Connect Google Calendar 2-way for Susie + Joey + Ben first, so availability is real and
bookings write back. Keep both 20 June links members-first; never on the public site.

Then build one calendar tag workflow per calendar:

- B1 booking adds `witta-gathering-2026-06-20` and `rsvp-maker-morning`.
- B2 booking adds `witta-gathering-2026-06-20` and `rsvp-pizza-dinner`.
- Shop-chat booking adds `project:act-hv`, `interest:markets`, and `shop-call-booked`.

### Thread 2: Harvest Note 02 (the members' invite)

Copy is paste-ready in `content-calendar-june-2026.md` (the "Harvest Note 02" block). It is
a **broadcast** to `harvest-member`, not a workflow (per `email-operating-system.md`). Two
inputs before send:
- The **real B2 RSVP link** from thread 1 is live:
  `https://api.leadconnectorhq.com/widget/bookings/harvest-2026-06-20-afternoon-pizza`.
- **Sender decision.** Default position (per runbook): send from `hi@act.place` for now;
  the Harvest-address fix stays parked so it does not block the members' invite. Flip only
  if Ben wants the domain verified first, which would add setup and risk the 9 Jun date.

### Thread 3: Maker engine (not launch-gating, can land after 20 June)

- **Shop nurture (spec 6):** tag-triggered on `interest:markets`, Wait 4 days, If/Else
  by offer tag, send, tag `shop-nurture-sent`. Full copy and branches in
  `ghl-workflow-build-specs.md`. No code, no env var.
- **Book-a-chat link:** the calendar from thread 1, dropped into spec 6's `[booking link]`
  and onto `/shop`.
- **Maker smart list:** GHL smart list of makers/growers for "new on the shelf" touches and
  for the Wk4 Makers' invite segment (shop EOIs + doers). Build as: has any of
  `interest:markets` / `role:supplier` / `shop-prospect` / `shop-produce` / `shop-maker` / `shop-food` /
  `shop-consignment` / `shop-follow-up`, plus known volunteer/doer contacts.

### Thread 4: 20 June readiness (the human gates)

The day-of operational detail (roster, run sheet, open/serve/close checklist, signage, stock,
service flow, onboarding) lives in `launch-ops-run-sheet.md`. The gates below stay here.

- **Public liability insurance** (the hard gate, see top of page).
- **Pizza lead:** who runs the make-your-own pizza dinner. Unassigned.
- **Extra hands for the maker session:** Nic leads; confirm Kurtis + partner (possible Alice
  Springs custodians) and the Holland contact. More hands needed.
- **Maker name + photo** for the Wk3 social post B (the only fabrication-risk blank in the
  content calendar; needs a real person who has been on site).

### Thread 5: Standard Ledger (drafted this session, Ben to send)

Two questions added to `thoughts/wiki/operations/email-standard-ledger-draft.md` as a
follow-up block:
- **Founding-circle money mechanism** (no DGR path): does Harvest-earmarked backing route
  through A Kind Tractor (charity, non-DGR) or land in Harvest Pty as taxable revenue? The
  answer decides the GHL home (shared Supporters pipeline + Harvest tag vs. a dedicated
  Harvest Founding Circle pipeline). Do not build the pipeline until this is settled; for
  now tag interest `harvest-founding-interest`. See `ghl-pipeline-playbook.md`.
- **Exact consignment split** within the 75 to 80 percent to the maker, so the shop's cut
  covers card fees, staffing, and overhead without breaking the fair-pay promise. See
  `shop-operating-system.md`.

### Thread 6: Operating-model alignment note (done)

Added to `the-harvest-strategic-plan-notion.md` under Team Structure: the locked
"retail sublicensed" position means the **future commercial cafe and retail layer**, not
the community shared-shelf, which is **Harvest-run programming now** (consignment, stewards,
a fair cut). This keeps the operating model and the shop model from drifting. Source of the
ask: `shop-operating-system.md` open items.

## What needs a human (cannot be done from the repo)

- **GHL UI build:** threads 1 and 3 (calendars, nurture workflow, smart list). Follow the
  runbook; no code. Susie/Joey/Ben.
- **External, Ben/Nic:** PL insurance bind, pizza lead, extra hands, sending Ben's SL email,
  and supplying the maker name + photo and the real social photos.

## Drift flagged (decision, not a silent edit)

`the-harvest-strategic-plan-notion.md` line 265 still records 20 June as a "pending
Week 5-6 Go/No-Go" with three paths (proceed / shift to Aug-Sep / skip). The engagement
work since 27 May treats 20 June as a **confirmed members' day**, and the content calendar,
runbook, and emails are all built on that. Recommend updating that decision record to
"confirmed: 20 June members' day, Nic-led" so the strategic plan stops contradicting the
operative plan. Left for Ben to confirm rather than rewritten here, because it is a formal
decision record, not a typo.
