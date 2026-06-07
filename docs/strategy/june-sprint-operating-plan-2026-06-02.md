# Harvest June Sprint Operating Plan

> **SUPERSEDED 2026-06-03. 20 June is now a PUBLIC OPEN DAY.** Written for the private
> members'-day model (capped, members-first, date public never, pizza from 2pm). That model is
> retired. Current truth: `RECONCILED-20-june-public-open-day-2026-06-03.md` (everyone welcome,
> public date, RSVP via the public page plus the B2/trigger-link, pizza from 5pm). Read the framing
> here as history. Still-valid operational detail (calendar IDs, tags, GHL build steps) stands.

> Current as of 2026-06-02 Brisbane time. Covers 2026-06-02 to 2026-07-01.
> This is the current operating view for the June sprint. It supersedes the older
> 3pm-7pm reply-led proof-night frame in the May launch-alignment drafts.

## Current Decision

Saturday 20 June 2026 is a private members' day in two parts:

| Slot | GHL calendar name | Time | Default capacity | Audience |
| --- | --- | --- | --- | --- |
| B1 | `RSVP: Maker session, Sat 20 June` | 10am to 2pm | 18 | Makers, doers, shop prospects, crew |
| B2 | `RSVP: Afternoon + pizza, Sat 20 June` | From 2pm | 40 | Members plus makers staying on |

Use Notion as operating memory. Use HighLevel as the publishing and relationship desk.
Do not put B1 or B2 links on the public website.

## Verified State On 2026-06-02

HighLevel app connector: reauthenticated. Connector search returned live GHL contacts instead
of `401 Reauthentication required`. Direct LeadConnector API writes also work.

Local checks:

| Check | Result |
| --- | --- |
| HighLevel connector `_search` | Returned 1152 live GHL contacts instead of a 401; trace `fcd2a677-07a4-4ceb-854f-a394fabf6e60` |
| Required tags | All present, including `rsvp-maker-morning`, `rsvp-pizza-dinner`, `shop-call-booked` |
| B1 calendar | Live: `M0KzSu7Bo3jJ3ZQta3ag`, 18 seats, 10am to 2pm |
| B2 calendar | Live: `4IpU9GnzAChTMkKFJPWi`, 40 seats, 2pm to 6pm |
| Shop-chat calendar | Live: `viM1BRnHG9gwpIEZd4HM`, round-robin between current GHL users Ben and Nicholas |
| `npm run audit:contacts:ghl` | 1152 contacts scanned, 160 Harvest contacts, 0 unintended tag refreshes, 0 Harvest duplicate email groups |
| `npm run count:rsvps:ghl` | B1 0/18, B2 0/40, tag workflow counts 0 |
| `npm run report:social:ghl` | Social planner read works and shows existing drafted or published Harvest posts |

Remaining implementation implication: calendar tag workflows, campaign test sends, and actual
scheduled campaigns still need the HighLevel UI because the connector exposes search/fetch, not
workflow-builder or campaign-create actions. Do not claim these are built until the checks below pass.

## HighLevel Audiences

| Audience | Tags or filter | Use |
| --- | --- | --- |
| Members | `harvest-member` | Harvest Notes, practical note, thank-you |
| Public followers | `harvest-newsletter` | Public Field Notes only |
| Makers and doers | `harvest-shop-interest`, `shop-prospect`, `shop-produce`, `shop-maker`, `shop-food`, `shop-consignment`, `shop-follow-up`, relevant volunteer/doer contacts | Makers' invite, shop follow-up, B1 |
| Event, all 20 June bookings | `witta-gathering-2026-06-20` | Event attendance segment |
| B1 maker morning | `rsvp-maker-morning` | Maker-session headcount |
| B2 afternoon and pizza | `rsvp-pizza-dinner` | Dough count |
| Shop chat booked | `shop-call-booked` plus `harvest-shop-interest` | Shop pipeline and nurture |

Do not add `harvest-newsletter` or `harvest-member` through an RSVP. An event yes is not a
subscribe.

## HighLevel Build Queue

Current build state:

1. Google Calendar 2-way sync for Susie, Joey, Ben, and the B1 owner: unverified.
2. B1 Class Booking calendar: live, capacity 18, Saturday 20 June 2026, 10am to 2pm.
   Link: `https://api.leadconnectorhq.com/widget/bookings/harvest-2026-06-20-maker-session`.
3. B2 Class Booking calendar: live, capacity 40, Saturday 20 June 2026, 2pm to 6pm.
   Link: `https://api.leadconnectorhq.com/widget/bookings/harvest-2026-06-20-afternoon-pizza`.
4. `Book a chat about the shop`: live, limited Tue/Thu 1pm to 4pm windows.
   Link: `https://api.leadconnectorhq.com/widget/bookings/harvest-shop-chat`.
   Current GHL users are Ben and Nicholas only; move ownership to Susie/Joey after their users exist.
5. Calendar tag workflows still need to be built in the GHL workflow UI:
   - B1 booking adds `witta-gathering-2026-06-20` and `rsvp-maker-morning`.
   - B2 booking adds `witta-gathering-2026-06-20` and `rsvp-pizza-dinner`.
   - Shop-chat booking adds `harvest-shop-interest` and `shop-call-booked`.
6. `Harvest - Shop Nurture`, triggered by `harvest-shop-interest`.
7. Five silent receipts: workshop, quiz, business, event, pulse.
8. Campaign drafts, test sends, then scheduled sends.
9. Social Planner drafts or schedules, using only approved real Harvest media.

Primary build instructions live in `ghl-setup-runbook.md`,
`ghl-workflow-build-specs.md`, and `email-operating-system.md`.

## Campaign Queue

| Date window | Campaign | Audience | GHL template ID | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-06-02 to 2026-06-08 | Wk4 Field Note: Witta shop shelf story | `harvest-newsletter` | `6a1de93fa5ab652f24f6bee8` | Template created | Public list only, no 20 June public invite |
| 2026-06-02 to 2026-06-08 | Wk4 Makers' invite | Makers and doers | `6a1de93f6972087910787f77` | Template created earlier; local source now has live B1/B2 links | Check existing GHL template before send |
| 2026-06-09 | Harvest Note 02 | `harvest-member` | `6a1de9407526e35f3eb1506a` | Template created earlier; local source now has live B2 link | First-name fallback `there`; check existing GHL template before send |
| 2026-06-19 | Harvest Note 03 practical details | `harvest-member` | `6a1de941eae4d2744602e305` | Template created | Confirm parking, weather, food, safety gates |
| 2026-06-24 | Thank-you plus photos | `harvest-member` | `6a1de9410d36220d2b79cdd6` | Template created, needs real event details | Fill with verified headcount, approved photos, one learned thing |
| Early July | Harvest Note: what we learned and what happens next | `harvest-member` | `6a1de942ce86ea75af0fe3f0` | Template created, needs debrief | Do not promise next public date until debrief |

All are one-off Campaigns, not Workflows. A broadcast never adds tags.

## Social Plan

Use the June calendar copy for shop, garden, art space, people, and members-first teaser
posts. Keep public posts date-light before 20 June. Attach only approved real Harvest media.
Do not use generated brand assets for this sprint.

After publication or scheduling, pull the state back into Notion:

```bash
npm run sync:social -- --pull-ghl --apply
```

## Story Drops

| Story | Timing | Gate |
| --- | --- | --- |
| Milk Create Pavilion | Publish or verify live in Wk4 | Existing article checked, public facts verified |
| Garden, Susie, Joey | Only after consent | Consent recorded before publish |
| First day article | Within 7 days after 20 June | Real attendance, photos, quotes, and learnings only |

## Shop Strategy

Locked model: Harvest-run shared shelf now, sublicensed cafe and retail later.

Phase A shelf:

- Fresh whole produce.
- Shelf-stable pre-packaged goods from compliant makers.
- Hold chilled dairy and high-risk perishables until food licensing is settled.

Money and systems:

- Consignment, maker keeps about 75 to 80 percent.
- Final split and GST treatment wait on Standard Ledger.
- Square runs till, inventory, and payout reconciliation.
- GHL runs maker CRM, pipeline, tags, and follow-up.

Outreach order:

1. Warm leads: Leeza, Rebecca, Monita, Lachie.
2. Witta and Wootha neighbours: Robyn Jay, Fleur / Pinch & Spin, Jacky Lowry, Fresh Flavours Farm.
3. Fast shelf-stable wins: honey, coffee, chai, preserves.
4. Gallery and market channels: David Linton, Maleny Handmade, Sapling, Peace of Green, Maleny Arts & Crafts.

Use 1:1 emails or DMs, not a broadcast. Move replies from `New interest` to
`In conversation` in the Shop pipeline.

## SOP Library Load-In

Create the first 10 SOPs in the existing Notion SOP Library as one-page working checklists.
Each SOP must include owner, area, escalation rule, checklist, and where the record lives.

| SOP | Area | Default owner | Status |
| --- | --- | --- | --- |
| Site open and safety walk | Venue | Susie plus Nic | Draft checklist |
| Gate and RSVP check-in | Events | Gate lead | Draft checklist |
| Food and pizza service | Food | Pizza lead | Draft checklist |
| Fire and oven safety | Food | Pizza lead plus site lead | Draft checklist |
| Toilets and handwashing | Venue | Joey | Draft checklist |
| Kids area and incident response | Events | Kids area lead | Draft checklist |
| Volunteer and helper briefing | Support | Nic | Draft checklist |
| Photo/video consent and content capture | Events | Content lead | Draft checklist |
| Site close, bins, fridge, fire, lock-up | Venue | Susie plus Joey | Draft checklist |
| Shop intake, labels, Square reconciliation | Shop | Susie | Draft checklist |

## Acceptance Checks

Run these before claiming the sprint setup is live:

```bash
npm run audit:contacts:ghl
npm run count:rsvps:ghl
npm run report:social:ghl
```

Manual checks:

- Test B1 booking lands in calendar and applies `witta-gathering-2026-06-20` plus `rsvp-maker-morning`.
- Test B2 booking lands in calendar and applies `witta-gathering-2026-06-20` plus `rsvp-pizza-dinner`.
- Test shop-chat booking applies `harvest-shop-interest` plus `shop-call-booked`.
- Campaign test sends render on mobile, first-name fallback is `there`, and no broadcast adds tags.
- Social Planner posts have real approved media attached.
- Voice gate passes: no em-dashes in new public copy, no public 20 June date before intended channels, no invented facts, consent checked for people and photos.

## Hard Gates

- Public liability insurance.
- Food safety position.
- Pizza lead.
- Extra hands and role roster.
- Site open, service, and close SOPs reviewed before 20 June.
