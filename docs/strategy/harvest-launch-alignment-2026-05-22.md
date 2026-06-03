# Harvest Launch Alignment — 20 June 2026

> **SUPERSEDED AGAIN 2026-06-03. 20 June is now a PUBLIC OPEN DAY.** First superseded to the
> private members'-day model on 2-Jun (note below); now that model is retired too. Current truth:
> `RECONCILED-20-june-public-open-day-2026-06-03.md` (everyone welcome, public date, RSVP via the
> public page plus the B2/trigger-link, pizza from 5pm). Read everything here as history.

> **Superseded for execution on 2026-06-02.** This document is retained as the decision
> history that moved Harvest away from a public launch. The current operating model is in
> `june-sprint-operating-plan-2026-06-02.md`: private members' day, B1 maker session
> 10am to 2pm, B2 afternoon plus pizza from 2pm. The older 3pm-7pm reply-led proof-night
> model below is not the current run sheet.

**Owner:** Ben (decision), Nic (co-sign)
**Status:** Decision-forcing. Go/No-Go target: 2026-05-25 (this week).
**Source-of-truth Notion page:** [Harvest Launch Alignment - Countdown to 20 June 2026](https://www.notion.so/acurioustractor/Harvest-Launch-Alignment-Countdown-to-20-June-2026-363ebcf981cf81b19deef477e76983e0)
**Companion docs (this repo):**
- [docs/communications/launch-countdown-comms-cadence.md](../communications/launch-countdown-comms-cadence.md)
- [docs/communications/find-others-playbook.md](../communications/find-others-playbook.md)
- [docs/strategy/10-week-commencement-plan.md](10-week-commencement-plan.md)
- [docs/communications/newsletter-2026-06-garden-launch.md](../communications/newsletter-2026-06-garden-launch.md)
- [docs/communications/welcome-email-and-ghl-workflow.md](../communications/welcome-email-and-ghl-workflow.md)
- [docs/strategy/harvest-ghl-tag-and-automation-map.md](harvest-ghl-tag-and-automation-map.md)

## Why this doc exists

The Notion alignment page (2026-05-17) pulled the 20 June frame back to a **soft opening / proof night**. The website, the launch newsletter draft, and Article 01 (Milk Create Pavilion) are still running the older **Garden Launch + Community Day** frame. That gap needs to close before any public-facing invite goes out.

This doc:
1. Names the gap, in detail.
2. Forces the Go/No-Go decision the 10-week plan called for this week.
3. Lays out the three branched paths and what each one changes on the site.
4. Wires the comms cadence and finance/status loop into the existing infrastructure so we don't build parallel systems.

## The gap, named

| Surface | Currently says | Notion alignment says | Risk |
|---|---|---|---|
| `client/src/pages/GardenLaunch.tsx` (title) | "Garden Launch + Community Day" | "Soft opening / proof night" | Over-promises before non-negotiables met |
| `GardenLaunch.tsx` (program) | Garden walk, pavilion open, wood-fired long table lunch (free), kids co-design, open mic | "Minimum public offer", "lock the simplest viable offer" | Food safety + fire + insurance not yet confirmed for that scale |
| `docs/communications/newsletter-2026-06-garden-launch.md` | "wood-fired, hinterland-grown" lunch under the pavilion + open mic | "Possibly three pizza types, maybe fortnightly" / "lock the minimum public offer" | Newsletter not yet sent — copy still flexible |
| `docs/communications/articles-launch-set/01-milk-create-pavilion.md` (line 90) | "It will host the Garden Launch and Community Day on Saturday 20 June 2026" | Frame TBD | Article is drafted, not yet published to EL — easy fix |
| `docs/brand/harvest-overview.md` §"20 June 2026 community day" | (unread, but title implies community day frame) | Soft open | Brand doc carries the older frame |
| `GardenLaunch.tsx` (email-led invite section) | "The public RSVP form is not open yet… first invite goes through Harvest member emails" | Aligned ✅ | None — this section is already correct |

Already aligned with the conservative path:
- The Garden Launch RSVP form is dormant (`GHL_GATHERING_RSVP_WORKFLOW_ID` unset).
- Email-led invite path is wired and tested.
- Member welcome workflow, member question workflow, contact form workflow, shop interest workflow — all verified 2026-05-14.
- Empathy Ledger → /blog pipeline is live (Sophie story proves it).
- 101 Harvest contacts in GHL, properly tagged.

The conservative infrastructure is built. The public-facing **copy** is what's off.

## The Go/No-Go decision (overdue)

Per the [10-week plan §Week 5](10-week-commencement-plan.md), the soft-open decision was scheduled to lock **this week (26 May – 1 Jun)**. Today is 2026-05-22. The Notion alignment page explicitly asks: *"Is 20 June a public launch, invite-only proof, or internal rehearsal?"*

Three paths. Each one wires through to specific website + comms changes.

### Path A — Invite-only proof night (Notion's default recommendation)

- Audience: 30-50 named people. Member list filtered to Witta locals + crew + advisers.
- Offer: pizza + tea + water. No alcohol, no register, no big kitchen flow.
- Run sheet: doors 3pm, pavilion open, simple food 4-6pm, soft close 7pm.
- Comms: member-list email only. No public marketing. No social campaign before the night.
- Story: "We are opening the gate for the first time, quietly, to learn how to open it well."

**What changes on the site:**
- `/garden-launch` retitled "First Open Day" or "Soft Opening" (page hero copy below).
- "Wood-fired long table lunch (free)" → "Simple food on the night. Pizza if the oven and licence are ready, tea if not."
- "Open mic" → removed for the night. Replace with "A short circle: what's next for The Harvest?"
- "Kids' co-design" → keep but soften: "If kids come along, there'll be paper and chalk on the kids' corner table. Not a programmed activity."
- Add a visible "This is a soft opening, not a public launch. The bigger day comes later in the year." note in the page hero.

### Path B — Public open day, narrow offer (the riskier middle path)

- Audience: open to the public via newsletter + social.
- Offer: same as Path A but ready for 80-120 people. Requires food safety licence in place + PL insurance bound + extra hands.
- Run sheet: gate 10am, food noon-2pm, soft close 3pm.
- Comms: member list first, then social, then local Facebook groups.
- Story: "The Garden is open. Come walk it. Eat something. Talk about what's next."

**What changes on the site:**
- Keep "Garden Launch + Community Day" title.
- Lock menu in page copy. Remove ambiguity ("wood-fired" → "wood-fired pizza" or "wood-fired snacks" — pick one).
- Add explicit dietary intake form (currently only "reply to email").
- Add parking, accessibility, kids-policy, weather-plan section to the page.

**Blockers (must clear by 1 June):**
- PL $20M insurance bound in Harvest Pty's name.
- Food licence path confirmed (Sunshine Coast Council Environmental Health).
- Fire/oven/kids risk assessment in writing.
- Named on-the-night host + 4 named roles (oven, register, runner, close).
- Stock owner named.

### Path C — Closed rehearsal (the safest path)

- Audience: 10-15 named people only. Crew + Susie + Joey + one or two advisers.
- Offer: cooking test, walk-through, debrief. No public moment at all.
- Story: "We're rehearsing. Public day comes in August once the operating system is real."

**What changes on the site:**
- `/garden-launch` page is parked — replaced with a "What's coming" page or 302-redirected to `/membership`.
- Newsletter is rewritten: "20 June is for us, not for you. The first public day will be announced when the system is ready."
- Article 01 (Milk Create Pavilion) line 90 rewritten: remove the 20 June reference.
- Frees Ben to leave 20 June without operational anxiety (he flies out that day per [10-week-commencement-plan.md §Week 8](10-week-commencement-plan.md)).

### Recommended path

**Path A (invite-only proof night).** Three reasons:

1. **Ben flies out 20 June.** Path B requires a public-event-grade run sheet with Ben in the country to take responsibility. He can't be at the gate and on a plane.
2. **Insurance is the SPOF.** Per the 10-week plan, PL $20M is bound in Week 7 (9-15 June). Path B opens to the public with a thin window between binding and event. Path A keeps the audience small enough that the run sheet is forgiving if the broker slips.
3. **The Notion principle.** "No public promise without an owner, a safety answer, and a closing procedure." Path A is the only one of the three where all three are answerable by 1 June without heroic effort.

Path B is achievable if the broker comes through fast, the food licence is in hand, and Nic agrees to be primary host on the night. That's a Week 5-6 decision, not a Week 1-2 decision, and Week 5 ends Sunday.

**This doc assumes Path A unless overridden.** All comms cadence and page changes downstream of here are written for Path A. If Ben + Nic decide B or C by Sunday 25 May, the cadence doc has clearly marked branch points.

## Decision questions — answered or queued

Notion's list, with proposed answers:

1. **Is 20 June a public launch, invite-only proof, or internal rehearsal?** → **Invite-only proof (Path A).** Lock by Sun 25 May.
2. **What exactly can someone buy on the night?** → Pizza if the oven and licence land in time. Otherwise tea + water + simple snacks. **No transactions.** All food is on the house at proof-night scale. Defer the register flow to the first paid event later in the year.
3. **Who is legally/operationally responsible for the public opening?** → Nic, on-site. Ben remote (in transit). Insurance bound in Harvest Pty's name pre-event.
4. **What insurance evidence is needed before the gate opens?** → Certificate of Currency for PL $20M, in Harvest Pty's name, dated before 20 June.
5. **What food safety setup is required?** → Council pre-application call this week. If a Temporary Food Licence is needed for the scale of Path A, file it by 1 June. If Path A is fully exempt (private event, ≤50 people, no sales), document the rationale and the contact name at council.
6. **Who holds the room if Ben/Nic are pulled into problems?** → Named deputy: Susie or Joey. To be confirmed this week.
7. **What is the next opening after 20 June?** → Reserved decision. Recommend keeping the calendar empty until 4-week debrief.
8. **What do we refuse to add before launch?** → Open mic. Live music. Alcohol sales. Public register. Any new built infrastructure. Anything that requires a separate permit.

## What needs to change on the website (Path A)

Tier-1 (file edits, not yet deployed):

- [ ] `client/src/pages/GardenLaunch.tsx` — soften hero, remove wood-fired-lunch promise, swap "open mic" for "short circle", add honest "this is a soft opening" framing. Draft copy: see [§Page copy drafts](#page-copy-drafts-path-a) below.
- [ ] `docs/communications/newsletter-2026-06-garden-launch.md` — rewrite for invite-only audience. Pull the open-mic + long-table-lunch language. Add a sentence that names this as a soft opening.
- [ ] `docs/communications/articles-launch-set/01-milk-create-pavilion.md` line 90 — change "It will host the Garden Launch and Community Day on Saturday 20 June 2026" to "It will host the first soft opening on 20 June 2026, member-list only."
- [ ] `docs/brand/harvest-overview.md` — update §"20 June 2026 community day" to match.

Tier-2 (visible to public when deployed — requires Ben confirm):

- [ ] Deploy the page softening. Recommend pairing with the launch newsletter send so the page and email tell the same story.
- [ ] Optionally retitle the page route from `/garden-launch` to `/soft-opening`. Keep `/garden-launch` as a 302 redirect. Saves rebuilding link equity, signals the reframe to anyone watching the URL bar.

## Comms cadence — overview

Detail and draft copy: [docs/communications/launch-countdown-comms-cadence.md](../communications/launch-countdown-comms-cadence.md).

Five weekly touchpoints between now and 20 June, plus the post-event one:

| Week | Internal job | Member-facing touchpoint | Social touchpoint | Story drop |
|---|---|---|---|---|
| **W -4 · 22-24 May** (now) | Lock Path A. Brief Susie + Joey. Council call. | None public. Optional "we're getting close" tease for the list. | Continue current cadence (planting + care posts). | None new. |
| **W -3 · 25-31 May** | Confirm insurance binding window. Lock menu. | **Soft-opening invite #1** (member-list only). Reply for seat count. | One post hinting at member event. No date. | Publish Article 01 (Milk Create Pavilion) on /blog. |
| **W -2 · 1-7 June** | Internal pizza test. Walk guest path. | Reply-handling on invite. Headcount estimate. | One photo post of the prep. | Publish Article 02 (The Garden — its own slug). |
| **W -1 · 8-14 June** | Rehearsal night with crew. | **Soft-opening reminder + practical note**: parking, arrival, dietary check. | One quiet "what we're building toward" post. | None. Hold story drop for the night. |
| **W 0 · 15-20 June** | Go/no-go Friday 19 June. Cook + serve + close. | **Final reminder** Thu 18 June. Same-day welcome at the gate. | Live photos day-of only if Ben is comfortable. | Capture the night for the post-event piece. |
| **W +1 · 21-27 June** | Debrief. Decide next opening date. | **Thank-you + photos** within 5 days. | Album post. | Publish post-event Article: "What happened on the first night." |

GHL workflow IDs and audience filters for each touchpoint are detailed in the cadence doc.

## Finding others — overview

Detail: [docs/communications/find-others-playbook.md](../communications/find-others-playbook.md).

For Path A, the playbook is **deliberately narrow.** The "find others" work is staged:

- **Before 20 June:** invite-only. The find-others playbook is parked except for one-to-one asks from the crew to friends-of-Harvest.
- **After 20 June:** the playbook opens up — local Facebook groups, Witta Hall noticeboard, Maleny Co-op partner ask, hinterland businesses, social cross-posting. Targeted toward the first paid event (date TBD).

This is the inversion of the usual launch logic: the public marketing happens after the proof night, not before.

## Finance + Notion feedback loop

Today, the Harvest finance picture lives in three places: Notion's Harvest Budget DB, the working-capital plan (`thoughts/wiki/operations/working-capital-plan.md`), and Xero (when Harvest Pty's books are live). The website only sees member signups, contact-form messages, and shop EOIs.

**Proposal: weekly Monday auto-summary into Notion's Harvest dashboard**, building on the existing [harvest-weekly-status routine](../../scripts/) (already runs Mon 8am Brisbane). Add three signals to the summary:

1. **Member list count** (delta WoW): from GHL via the `harvest-member` tag count.
2. **Soft-opening reply count** (delta WoW): from GHL contact notes filtered to the launch invite send.
3. **Spending against launch budget**: needs a launch-specific budget line item in the Notion Harvest Budget DB. Three categories:
   - Insurance binding (one-time, target ≤ $15K/yr)
   - Soft-opening direct cost (food, materials, signage, contingency — target $1.5-3K)
   - Cleanup/contingency reserve ($500)

When the budget line is locked, the weekly status can pull `actual vs target` and show it inline on the Notion Harvest dashboard.

**What's missing today:** the launch-specific budget categories don't exist in Notion's Harvest Budget DB. Two-step fix:

- [ ] Add three new budget rows to the Harvest Budget DB this week.
- [ ] Update `harvest-weekly-status` routine to pull and report on those three rows.

Both are Tier 2 (Notion edits) — recommend Ben does step 1 manually in Notion, then we wire up step 2 in the routine.

## Page copy drafts (Path A)

For `client/src/pages/GardenLaunch.tsx`. These are drafts only — file is NOT changed by this commit.

### Hero (replace lines 94-104)

```text
EYEBROW: Coming up · Saturday 20 June 2026 · Member list only
H1: First open day
SUBHEAD: A soft opening. A small group. Pizza if the oven is ready, tea if not.
SUPPORTING: The first time we open the gate at The Harvest. Member list only for this one. The bigger public day comes later, once we know how to open and close cleanly.
```

### What it is (replace lines 144-173)

```text
EYEBROW: What it is
H2: A soft opening. Not a launch.
BODY:

This is the first time we open the gate at The Harvest. Member list only. About 40 of you. On Jinibara Country at Witta, under the Milk Create Pavilion that 80 of you helped build in March.

It is a proof night, not a launch. We want to know if we can open the gate, feed people something simple, hold a clear room, and close it cleanly. If the answer is yes, the next opening becomes easier. If the answer is "almost", we learn what to fix.

The bigger public day comes later in the year, once the operating rhythm is real.

ITALIC: Come for an hour or stay until soft close. The kettle stays on.
```

### What to expect (replace lines 33-59 program items)

Keep the Card layout. Replace the five cards with three:

```text
1. The Garden Walk
   Icon: Sprout
   Body: We'll walk the new beds together. What's in, what's coming, who's tending which row.

2. Pizza or tea, depending on what landed
   Icon: Flame (replace Music)
   Body: If the oven and the food licence are both ready, three pizza types. If not, tea, water, and something simple. No surprise. No bar. No register.

3. A short circle: what's next?
   Icon: Users
   Body: Late afternoon, we sit together for thirty minutes. One question: what do you want to see at The Harvest in the next year? We listen and write it down.
```

Remove:
- "Long table lunch" card (over-promise for Path A)
- "Kids' co-design" as a programmed event (replace with a soft mention in the body: "Bring kids — there's paper and chalk on the kids' corner table, not a programmed activity")
- "Open mic — what's missing in Witta?" (over-promise; the "short circle" replaces it)

### Email-led invite section (lines 287-358 — keep as-is)

This section is already correct under Path A. Don't change it.

### Honest "what we know so far" panel (NEW section, insert after "What it is")

```text
EYEBROW: What we know
H2: Some things are confirmed. Some are still settling.

CONFIRMED
- Date: Saturday 20 June 2026
- Place: 9 Gumland Drive, Witta
- Audience: member list only, roughly 40 seats
- Cost: free
- Format: walk, simple food, short circle, soft close

STILL SETTLING (we'll update by 7 June)
- Whether pizza or tea is the food story (depends on oven + council)
- Whether we offer a guided garden walk or a free-walk
- Whether the short circle runs 4pm or 5pm

If you've put your name on the member list, the practical note for the day lands on Thursday 18 June with everything settled.
```

## Concrete actions — this week (22-24 May)

| # | Action | Owner | Tier | Status |
|---|---|---|---|---|
| 1 | Read this doc end-to-end | Ben | 1 | — |
| 2 | Decide Path A / B / C and write the decision into Notion alignment page | Ben + Nic | 2 | — |
| 3 | Call Sunshine Coast Council Environmental Health re food licence for Path A | Ben | 1 | — |
| 4 | Confirm Susie + Joey can host on 20 June. If Ben + Nic are both off-deck at any moment that day, who holds the room? | Ben → Susie/Joey | 1 | — |
| 5 | Add three soft-opening budget rows to Notion Harvest Budget DB | Ben | 2 | — |
| 6 | Once Path locked: apply page copy changes to `GardenLaunch.tsx`, newsletter draft, Article 01, brand overview | Ben/agent | 1 | Drafts ready in this doc + comms cadence |
| 7 | Once page changes applied: deploy via `vercel --prod` | Ben | 2 | — |
| 8 | Schedule launch newsletter send for Mon 26 May or Wed 28 May (member-list audience) | Ben in GHL | 2 | Newsletter draft ready |
| 9 | Update [10-week plan §D19](10-week-commencement-plan.md) with the locked decision | Ben | 1 | — |

## Risks this doc does not solve

- **Broker slip.** If PL $20M binding slides past 15 June, even Path A is at risk. Mitigation: open the broker conversation about a same-day binder for the proof-night-scale event, separate from the annual policy.
- **Council slow.** If the food licence path requires a 14-day notice and we haven't called by next week, Path A locks to "tea + water only." Acceptable for proof night, but the page copy needs to be even more honest about it.
- **Member list size mismatch.** If <30 reply to the invite, the room feels thin. If >80 reply, Path A breaks. Mitigation: send the invite to a tight list (Witta + crew + advisers) first; expand to wider member list only if needed.
- **Ben's overseas window starts 20 June.** Path A assumes Ben can be at the proof night before flying. Confirm flight time — if departure is afternoon/evening, he's at the gate; if morning, Nic + Susie + Joey carry it.

## What this doc is NOT

- Not a replacement for the Notion alignment page. That page is canonical. This doc is the website + comms-side translation of it.
- Not a substitute for the council call, the broker call, or the Susie/Joey conversation.
- Not a public-facing artefact. Stays in the repo.

---

*End of alignment doc. Next: [launch-countdown-comms-cadence.md](../communications/launch-countdown-comms-cadence.md) for week-by-week comms detail.*
