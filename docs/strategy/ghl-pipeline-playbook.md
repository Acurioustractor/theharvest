# Harvest GHL Flows and Pipeline Playbook

> Created 2026-05-27. The reference for how people enter The Harvest's GHL, what they hear
> back, and how we track and follow up with them. Companion to two existing docs, which stay
> canonical for their own layer:
> - `harvest-ghl-tag-and-automation-map.md` — the full tag list per flow.
> - `ghl-workflow-build-specs.md` — the build sheet + email copy for each workflow.
>
> This doc adds the part those two do not cover: the pipeline / tracking model, and how to
> build it out so the team can get back to people easily and see where everyone is at.

## The four-layer model (the thing that makes GHL easy)

Each layer does one job. Keep them separate in your head and the system stays simple.

| Layer | Answers | Example | How often it changes |
| --- | --- | --- | --- |
| **Tags** | *Who* they are, *what* they want | `harvest-shop-interest`, `shop-produce` | Rarely. Durable labels. |
| **Pipeline + stage** | *Where* they are with us | Shop pipeline → "In conversation" | Often. You drag the card. |
| **Workflows** | *What* they hear automatically | follow welcome, shop receipt | Set once, runs itself. |
| **Tasks / next-action date** | *What we owe them next* | "Call Friday about volumes" | The follow-up engine. |

The three things we want from GHL map straight onto this:

- **Ease of use** — one pipeline board to scan, not a spreadsheet.
- **Easy to get back to people** — a stage plus a next-action date makes the to-do list obvious.
- **Track what they are doing** — the card moves through stages, tags filter within.

## Entry points — when people come in

Every public form upserts a contact, tags it, and (for some) creates a pipeline card. Full
tag lists are in `harvest-ghl-tag-and-automation-map.md`. Verified 2026-05-27.

| Flow | Comes in via | Makes a pipeline card? | Auto-message |
| --- | --- | --- | --- |
| Follow along | Footer (every page) | No | Harvest - Follow Welcome (live, on-brand) |
| Become a member | `/membership` | No | Harvest - Member Welcome (wired) |
| Member question | `/membership` | Yes | Member Question Receipt (wired) |
| Shop interest | `/shop`, `/works/the-shop`, `/membership` | Yes | Shop Interest Receipt (wired) |
| Contact form | `/contact` | No | Contact to Universal Inquiry (live) |
| Photo wall | `/photo-wall` | Yes | Witta Gathering Photos (wired) |
| Gathering RSVP | `/garden-launch` (disabled now) | Yes | EOI Confirmation (wired, dormant) |
| Workshop booking | `workshops.book` | Yes | None yet (spec 1) |
| Business registration | `businesses.submit` | Yes | None yet (spec 3) |
| Event submission | `events.submit` | Yes | None yet (spec 4) |
| Quiz | `quiz.submit` | No | None yet (spec 2) |
| Pulse | `pulse.submit` | No | None yet (spec 5) |
| Shop nurture (2nd touch) | tag, after receipt | — | Spec'd, not built (spec 6) |

Do not use the generic "Newsletter Signup" workflow (`0c61347a`). It sends an ACT-branded
welcome, not Harvest voice.

## Messages — what people hear back (honest state)

- **Live and verified on-brand:** follow welcome, contact form.
- **Wired, content not re-checked:** member welcome, member question, shop receipt, photo
  wall. Worth opening each in the GHL builder to confirm voice and sender.
- **Silent (submitter hears nothing):** workshop, business, event, quiz, pulse. They land in
  GHL, and the first three make a pipeline card the team sees, but no email goes back.
  Building specs 1-5 closes this.
- **Sender seam (all of them):** every email sends from `hi@act.place`, not a Harvest
  address. Fixing it is a location-wide GHL sending-domain task (verify
  `theharvestwitta.com.au`, set it in each workflow's Email From field). Tracked, not done.

## Pipelines — what we can track

### Today

One pipeline, "Harvest Inbox / Universal Inquiry" (`ggQw10DuH0XRji6keimS`), and every card
lands at one stage, "New" (`server/gohighlevel.ts:49`). Shop, workshop, event, business,
member question, RSVP, and photo wall all pile into the same "New" column. We can see *that*
someone came in, but not *where they are* with us. That is the gap.

### The Shop pipeline (build this)

A dedicated pipeline with real stages, so a maker or grower is never lost between "they
asked" and "they are on the shelf".

```
New interest -> In conversation -> Sampling / trial shelf -> On the shelf
                                                                 \-> Not now / parked
```

- **New interest** — just submitted. The form drops them here automatically (see wiring); the receipt fires on its own, so this stage does not need a separate "acknowledged" column.
- **In conversation** — we have replied, talking detail: volumes, timing, food safety.
- **Sampling / trial shelf** — they have brought something in.
- **On the shelf** — live stockist.
- **Not now / parked** — declined or future. Stays visible, not lost.

Tags (`shop-produce`, `shop-maker`, `shop-food`, `shop-consignment`, `shop-follow-up`)
segment *within* the board, so you can filter "growers in conversation".

**Wiring (code already done 2026-05-27):** `shopInterest.submit` reads `GHL_SHOP_PIPELINE_ID`
and `GHL_SHOP_PIPELINE_NEW_STAGE_ID`. Set BOTH together (a stage ID only belongs to its own
pipeline) and shop EOIs route into the Shop pipeline's "New interest" stage. Leave them blank
and shop EOIs fall back to the shared Harvest Inbox (current behaviour, no breakage). Steps:

1. In GHL, create the "Shop" pipeline with the six stages above.
2. Copy the pipeline ID and the "New interest" stage ID.
3. Set `GHL_SHOP_PIPELINE_ID` and `GHL_SHOP_PIPELINE_NEW_STAGE_ID` in local `.env` and Vercel.
4. Redeploy. New shop EOIs now land in the Shop pipeline.

### The right-sized set: three pipelines (decided 2026-05-27, Ben)

Reframe that governs all of this: **a pipeline is for a process that ends** (they become a
stockist, or they do not). Where someone sits on the engagement ladder is *not* a pipeline;
it is a tag on the person. So followers and members never go in a pipeline. Only deals do.

We deliberately built **three**, not four, after a right-sizing pass. An empty board is
ceremony, not organisation.

**1. Shop stockist** — above.

**2. Inbox (general inquiry).** Give the existing shared inbox real stages so contact-form
questions and one-offs are tracked, not a black hole. Keep the entry stage named so the
website's default routing still lands correctly (`DEFAULT_HARVEST_INBOX_NEW_STAGE_ID`).

```
New -> In progress -> Waiting on them -> Resolved
```

**3. Partners (cultivation).** Slow cultivation of partner orgs. Pre-seed with the named
prospects (Centrecorp, Oonchiumpa) so it opens with real cards. **Funders are NOT in here** —
they live in the ACT funder ledger (`act-global-infrastructure/wiki/narrative/funders.json`,
GrantScope, the money-brain). Putting them in Harvest GHL would duplicate that. One place per
thing.

```
Identified -> Warming -> In conversation -> Proposal -> Active partner
                                                           \-> Parked
```

**Deferred, on purpose:**

- **Bookings (team days + venue hire)** — not built yet. It would sit empty until we actively
  offer these post-launch. Use a `team-day` / `venue-hire` tag in the meantime, and stand up
  the pipeline (Enquiry -> Quoted -> Booked -> Ran -> Repeat / Lost) the day the first real
  enquiry lands. Building an empty board now is the exact "overdoing it" we are avoiding.

Only the Shop pipeline is wired to a website form (shop EOIs route in automatically). Inbox
catches the website's default opportunities; partner cards are added by hand at current
volumes. Auto-routing other forms into pipelines can come later if volume justifies it.

## Membership: list + belonging, not a portal (decided 2026-05-27, Ben)

Do not build a GHL Membership / Community portal. Membership at The Harvest is a free tagged
list plus real-world belonging, delivered where people already are (email, in person). A
login-to portal is exactly the destination Croft warned nobody uses
(`community-engagement-launch-plan.md`). The "Hold it" rung is a tag (`harvest-member`) and a
relationship, not a software product. Revisit only if members start asking for an online
space of their own.

## Supporting GHL features (what actually helps)

| Feature | How it serves the system | Verdict |
| --- | --- | --- |
| Calendars / Appointments | Garden visits, workshop slots, "book a chat with Susie/Joey", team days. The "Show up" rung made bookable. | Adopt |
| Conversations inbox (incl. WhatsApp) | One place for Susie/Joey to reply across email/SMS/WhatsApp. WhatsApp is the community's real channel. This is the "get back to people" surface. | Adopt |
| Custom fields on contacts | Store the stage-2 detail (produce type, volumes, stall size) we stopped asking at the door. Makes progressive profiling real. | Adopt |
| Smart lists / segments | Audience x rung filtering ("makers who came in but were not contacted"). The right-message-right-audience engine. | Adopt |
| Trigger links | Measure who clicks what (real engagement signal); powers the member reconfirm. | Adopt |
| Memberships / Communities portal | A destination to log into. Contradicts the strategy. | Hold |

## How to get back to people (the follow-up engine)

Tracking is only half of it. The other half is making sure nobody waits on us.

- Give every pipeline card an **owner** and a **next-action date** in GHL.
- The **nurture workflow** (shop nurture, spec 6) is the safety net: it follows up a few days
  later so a card does not go cold while it waits for a human.
- A simple daily habit beats any automation: open the board, work the left-most stages first,
  move or date every card you touch.

## Build checklist

Pipelines (in GHL) — three, right-sized:
- [ ] **Shop stockist** — create with the 5 stages, then send the pipeline ID + "New
      interest" stage ID so the two env vars get wired + deployed (auto-routes shop EOIs).
- [ ] **Inbox** — add stages (New / In progress / Waiting on them / Resolved) to the existing
      shared pipeline; keep the entry stage so default routing still lands.
- [ ] **Partners** — create with its 5 stages, pre-seed Centrecorp + Oonchiumpa. Funders stay
      in the ACT ledger, not here.
- [ ] ~~Bookings~~ — **deferred**. Use a `team-day` / `venue-hire` tag; build the pipeline
      when the first real enquiry arrives.

Messages (in GHL):
- [ ] Shop nurture (spec 6) so makers get a second touch.
- [ ] The five silent receipts (specs 1-5: workshop, quiz, business, event, pulse) so every
      submitter hears back. Build each, paste its ID into the matching env var (local +
      Vercel), then `npm run verify:forms:ghl`.
- [ ] Member reconfirm for the 15 legacy contacts (one-time campaign in `ghl-workflow-build-specs.md`).
- [ ] Fix the `hi@act.place` sender (location-wide), separate task.

Supporting features (in GHL, as capacity allows):
- [ ] Calendars for garden visits / workshops / "book a chat" / team days.
- [ ] Conversations inbox set up for Susie + Joey, WhatsApp connected.
- [ ] Custom fields for stage-2 profiling (produce type, volumes, stall size).
- [ ] Smart lists per audience x ladder rung.

Decided, do NOT build:
- [ ] ~~GHL Membership / Community portal~~ — membership stays a list + belonging, no login.

## Cross-references

- Tags per flow: `harvest-ghl-tag-and-automation-map.md`
- Workflow build sheet + email copy: `ghl-workflow-build-specs.md`
- The why behind the ladder + audiences: `community-engagement-launch-plan.md`
- Opportunity code: `server/gohighlevel.ts` (`upsertGHLHarvestInboxOpportunity`),
  `server/routers.ts` (per-form `.submit` procedures).
