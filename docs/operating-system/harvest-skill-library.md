# Harvest Skill Library

> Status: v0.1, created 2026-06-07. This is the operating layer for how agents should work inside The Harvest. It turns repeated Harvest judgement into reusable skills, before the system gets buried under tools.

## Why This Exists

The Harvest has a lot of connected surfaces:

- a real place with lease, insurance, food, shop, events, staff, volunteers, and money risk
- a website and Control Room
- GHL for contacts, tags, forms, workflows, inbox, calendar, and social publishing
- Notion for operating memory
- Supabase for server-backed site data
- repo docs for stable decisions and runbooks

Access to these systems is not enough. An agent can read GHL, Notion, Supabase, and the repo and still make the wrong call if it does not understand the method.

The skill library captures the method.

The rule:

```text
If we explain the same Harvest workflow twice, it becomes a skill.
```

## Operating Shape

Harvest agents should not start from a blank prompt. They should load the relevant skill, check the source of truth, run the narrow verification command, then act.

```text
Repo docs stabilize the method
Notion holds the operating memory
GHL runs publishing and relationship work
Supabase supports the website
Control Room shows the live gates
```

Do not make Notion do GHL's job. Do not make GHL do thinking work. Do not create another dashboard unless the existing Control Room cannot answer the question.

## Skill Standard

Every Harvest skill should have this minimum shape:

```text
Name
When to use it
Owner
Source of truth
Live checks
Procedure
Done means
Failure modes
What not to do
```

Quality bar:

- The skill can be used by Ben when tired.
- The skill can be handed to Susie, Joey, Nicholas, or an agent without a lecture.
- The skill ends with a visible state: sent, blocked, watch, done, or needs human decision.
- The skill names what was verified and what is still inferred.

## First Skill List

| Skill | Purpose | Current state | Build next |
| --- | --- | --- | --- |
| Event Ops Router | Keep Friday/Saturday event ops aligned across GHL, Mighty, Square, Facebook, RSVP, manual sheets and reconciliation | Promoted to `.agents/skills/harvest-event-ops` | Use on the 19-20 June event pass, then refine from the Sunday debrief |
| Launch Readiness | Decide if 20 June can actually run | Promoted to `.agents/skills/harvest-launch-readiness` | Use once on the live GHL blocker pass, then refine |
| GHL Workflow Gate | Build/test the manual GHL workflow steps the API cannot create | Promoted to `.agents/skills/harvest-ghl-workflow-gate` | Use on the next manual GHL UI pass |
| Shop Maker Loop | Move makers from interest to chat to shelf | Promoted to `.agents/skills/harvest-shop-maker-loop` | Use on the Monday maker sweep, then refine |
| Comms Send Discipline | Keep broadcasts, workflows, lists, and records clean | Promoted to `.agents/skills/harvest-comms-send-discipline` | Use on the next Field Note / Harvest Note / social send |
| Compliance Gate | Check lease, PL insurance, food safety, WHS, event risk | Research skill exists, not operationalized | Build a red/amber/green gate |
| Control Room Triage | Answer what is blocked, watch, good | Built in app, report script exists | Package the operator procedure |
| Brand and Place Story | Keep public copy Harvest-specific | Brand docs exist | Convert into public-copy skill |
| Staff Handoff | Let Susie/Joey operate GHL/shop without Ben | Staff docs exist | Build phone-first operating card |
| Finance and Lease Loop | Keep rent, revenue share, capex, Square, Xero clean | Lease facts exist | Build accountant-facing checklist |

## Skill 0: Event Ops Router

**When to use it:** Any time the work crosses Friday/Saturday event operations, GHL tags,
Mighty cleanup, Square/payment decisions, Facebook event setup, comment triage, RSVP counts,
manual sheets, or post-event reconciliation.

**Owner:** Ben/Nic until a day owner is named.

**Source of truth:**

- `docs/strategy/harvest-event-ops-strategy-2026-06-18.md`
- `docs/communications/facebook-event-opening-of-the-harvest-2026-06-20.md`
- `docs/strategy/RECONCILED-20-june-public-open-day-2026-06-03.md`
- `docs/communications/launch-pull-together-2026-06-13.md`
- `docs/strategy/launch-ops-run-sheet.md`

**Live checks:**

```bash
npm run report:launch-gates:ghl
npm run count:rsvps:ghl
npm run report:social:ghl -- --engagement
npm run report:mighty
npm run check:mighty-tags:ghl
```

**Procedure:**

1. Confirm the current public truth and date in absolute terms.
2. Run the live checks.
3. Decide the money mode: free/headcount, Square paid, or support-only.
4. If Square is not test-proved, keep paid language out of public copy.
5. Use website RSVP as the public call to action.
6. Keep Mighty as the inside room only after human review.
7. Use native GHL/Facebook for comment bodies and reply state.
8. Prepare the manual day sheet and the Sunday reconciliation sweep.

**Done means:** one public RSVP path, one payment decision, one comments owner, one manual
sheet, and one Sunday reconciliation path.

**Failure modes:**

- Sending people to stale Mighty paid plans.
- Treating payment as consent.
- Calling Square ready without a test sale/refund.
- Letting social comment counts stand in for actual replies.
- Making Saturday prove the whole future system instead of the first safe gathering.

**What not to do:** do not turn on more automation during the event. Capture cleanly, then
reconcile.

## Skill 1: Launch Readiness

**When to use it:** Any time someone asks if the public day, member day, shop-chat path, or launch surface is ready.

**Owner:** Ben until the live day owner is named.

**Source of truth:**

- `docs/strategy/RECONCILED-20-june-public-open-day-2026-06-03.md`
- `docs/strategy/GHL-completion-handoff-2026-06-03.md`
- `docs/strategy/ghl-build-sheet-2026-06-03.md`
- `docs/strategy/launch-readiness-20-june-2026.md`
- Control Room at `/admin/control-room`

**Live checks:**

```bash
npm run report:launch-gates:ghl
npm run count:rsvps:ghl
```

**Procedure:**

1. Read the current truth doc first. Do not blend old members-day framing with the public-open-day decision.
2. Run the GHL launch gate report.
3. Check Control Room gates.
4. Separate GHL blockers from Supabase/security blockers.
5. Name the owner for each blocked gate.

**Done means:** every gate is `good` or explicitly accepted as `watch` by a human owner.

**Failure modes:**

- Treating a draft GHL workflow as live.
- Counting public clicks before `VITE_GHL_IM_COMING_URL` is configured and tested.
- Letting old proof-night or members-only copy leak into current public-day decisions.

**What not to do:** do not invent readiness from docs. Run the live report.

## Skill 2: GHL Workflow Gate

**When to use it:** Any time workflow-builder actions, calendar booking tags, trigger links, campaign sends, or GHL automations are involved.

**Owner:** Ben for build, Susie/Joey for later operation once users exist.

**Source of truth:**

- `docs/strategy/ghl-calendar-tag-workflows-runbook.md`
- `docs/strategy/ghl-build-sheet-2026-06-03.md`
- `docs/strategy/ghl-im-coming-trigger-link-2026-06-03.md`
- `docs/strategy/harvest-ghl-tag-and-automation-map.md`

**Live checks:**

```bash
npm run report:launch-gates:ghl
npm run audit:contacts:ghl
npm run desk:ghl
```

**Procedure:**

1. Confirm the tag names before building the workflow.
2. Build workflow steps in the GHL UI. The API can list workflows, but it cannot reliably build or inspect action graphs.
3. Publish the workflow. Saved or draft is not live.
4. Trigger one real test.
5. Confirm the contact has exactly the expected tags.
6. Remove test tags or delete the test contact if it affects headcount.

**Done means:** the workflow is published and a real contact record proves the tags landed.

**Failure modes:**

- Workflow exists but is `draft`.
- Wrong calendar filter.
- Broadcast accidentally adds a tag.
- Trigger link redirects but does not identify/count anonymous visitors.

**What not to do:** do not claim a workflow is done from name presence alone.

## Skill 3: Shop Maker Loop

**When to use it:** Any time a grower, maker, supplier, shelf, Square, consignment, or shop-chat task appears.

**Owner:** Susie/Joey for daily operation, Ben for system wiring.

**Source of truth:**

- `docs/strategy/shop-operating-system.md`
- `docs/strategy/harvest-ghl-tag-and-automation-map.md`
- `docs/strategy/simple-system-build-plan-2026-06-05.md`
- `research/data/harvest-shop-send-list.md`
- GHL tags: `interest:markets`, `role:supplier`, `shop-follow-up`, `shop-call-booked`

**Live checks:**

```bash
npm run audit:contacts:ghl
npm run desk:ghl
```

**Procedure:**

1. Pull the maker list from `interest:markets` and `role:supplier`.
2. Split people into: new interest, needs reply, chat booked, stage-2 detail needed, shelf candidate, not now.
3. For each live maker, capture product, volume, food-safety flag, consignment fit, and next action.
4. Use GHL for contact state and conversation.
5. Use Square for inventory, sales, and payout once the shelf is real.
6. Record stage-2 detail as a GHL note or pipeline movement.

**Done means:** every maker has one next action and no one is sitting as an unowned form submission.

**Failure modes:**

- Treating `shop-follow-up` as the whole maker list.
- Forgetting booked calls because `shop-call-booked` stayed at zero.
- Moving to Square before the relationship and consignment details are clear.

**What not to do:** do not blast makers as a generic list when the ask should be one-to-one.

## Skill 4: Comms Send Discipline

**When to use it:** Any time sending a Field Note, Harvest Note, maker invite, social post, or GHL campaign.

**Owner:** Ben for launch window, then named comms operator.

**Source of truth:**

- `docs/strategy/email-operating-system.md`
- `docs/communications/notion-to-facebook-instagram.md`
- `docs/communications/weekly-content-patterns.md`
- `docs/strategy/harvest-ghl-tag-and-automation-map.md`

**Live checks:**

```bash
npm run report:social:ghl
```

**Procedure:**

1. Decide if the work is a workflow, broadcast, or social post.
2. For broadcasts: pick one smart list, read the count, set first-name fallback to `there`, test-send.
3. For social: build and preview in GHL first, with real media and consent checked.
4. Pull the published/scheduled record back into Notion after GHL has done the publishing job.
5. Record what was sent, to whom, and what needs follow-up.

**Done means:** message sent or scheduled in GHL, test checked, Notion record updated.

**Failure modes:**

- Sending to `All`.
- Adding tags during a broadcast.
- Drafting in three places and losing the final version.
- Public copy naming an event before the current decision allows it.

**What not to do:** do not use Notion as the publishing desk.

## Skill 5: Compliance Gate

**When to use it:** Any time the work touches events, food, insurance, lease, volunteers, building use, subletting, shop operations, or public liability.

**Owner:** Ben/Nicholas, with accountant/lawyer/council where needed.

**Source of truth:**

- `thoughts/wiki/operations/lease.md`
- `docs/strategy/the-harvest-lease-legal-review.md`
- `docs/communications/launch-calls-brief.md`
- Harvest business-research skill

**Live checks:** no single command. This is evidence-based: certificate, council answer, signed agreement, written owner, or documented risk acceptance.

**Procedure:**

1. Identify the risk category: lease, PL insurance, food, liquor, WHS, volunteer, subletting, council, privacy/consent.
2. Check the canonical lease facts before making a claim.
3. Separate verified fact, inference, and question for lawyer/accountant/council.
4. Name the minimum evidence needed.
5. Put the gate in Control Room or the active runbook.

**Done means:** the evidence exists or a named human explicitly accepts the risk.

**Failure modes:**

- Assuming a private gathering rule applies to a public day.
- Selling food before the food-safety position is clear.
- Using the wrong legal entity name.
- Treating insurance as done without a certificate.

**What not to do:** do not let warm community language override hard compliance gates.

## Skill 6: Control Room Triage

**When to use it:** Any time someone asks "what is blocked?", "what is next?", "are we ready?", or "what is real?"

**Owner:** Ben for build, operators for daily read.

**Source of truth:**

- `client/src/pages/HarvestControlRoom.tsx`
- `server/routers.ts` `businessSetup.summary`
- `scripts/report-ghl-launch-gates.ts`
- `/admin/control-room`

**Live checks:**

```bash
npm run report:launch-gates:ghl
npm run desk:ghl
npm run count:rsvps:ghl
```

**Procedure:**

1. Open Control Room.
2. Run the launch-gate report if GHL status matters.
3. Translate each item into `blocked`, `watch`, or `good`.
4. Attach owner and next action.
5. Do not bury real blockers under broad summaries.

**Done means:** the blocker list is short, owned, and based on current checks.

**Failure modes:**

- Treating Supabase advisor noise as the launch blocker after server-managed tables are locked down.
- Showing old shop tags in the operating view.
- Leaving a blocker without an owner.

**What not to do:** do not add another dashboard for the same question.

## Skill 7: Brand and Place Story

**When to use it:** Any time writing public copy, social, newsletter, deck, hero page, shop language, or invitation copy.

**Owner:** Nicholas for vision/design direction, Ben for system/build, comms operator for execution.

**Source of truth:**

- `DESIGN.md`
- `docs/brand/README.md`
- `docs/brand/harvest-brand-voice.md`
- `docs/communications/weekly-content-patterns.md`
- `docs/strategy/the-harvest-philosophy.md`

**Procedure:**

1. Check the current event/business truth before writing.
2. Use Harvest language: place, making, garden, kitchen, art, shelf, long table, real people.
3. Cut generic community-hub language.
4. Check consent before naming or showing people.
5. Keep the public promise smaller than the operating reality can hold.

**Done means:** the copy is accurate, specific to Witta/The Harvest, and safe to publish.

**Failure modes:**

- Making The Harvest sound like a civic innovation project.
- Overpromising public access before operations can hold it.
- Turning people into content without consent.

**What not to do:** do not let style outrank verified facts.

## Skill 8: Staff Handoff

**When to use it:** Any time Susie, Joey, or another operator needs to run part of the system without Ben.

**Owner:** Ben until handoff, then named operator.

**Source of truth:**

- `docs/strategy/simple-system-build-plan-2026-06-05.md`
- `docs/strategy/staff-operating-view-2026-06-05.md`
- `docs/sop/`
- GHL mobile app and shop pipeline

**Procedure:**

1. Give the operator only the surface they need.
2. Phone-first instructions beat architecture diagrams.
3. Define what they can touch and what they should not touch.
4. Include the exact escalation path.
5. Test with one real card, one real conversation, and one real booking.

**Done means:** the operator can complete the task from their phone without Ben narrating.

**Failure modes:**

- Giving full GHL access before the permissions model is clear.
- Handoff doc is correct but too long to use while standing in the shop.
- Nobody owns stale cards.

**What not to do:** do not hand over abstractions. Hand over the work surface.

## Skill 9: Finance and Lease Loop

**When to use it:** Any time the work touches rent, revenue share, capital improvements, Square, Xero, maker payouts, subletting, or reporting to landlord/accountant.

**Owner:** Ben/Nicholas with Standard Ledger.

**Source of truth:**

- `thoughts/wiki/operations/lease.md`
- `docs/strategy/shop-operating-system.md`
- signed lease PDF
- Xero/Square once live

**Procedure:**

1. Identify whether the money is operating revenue, capex, maker consignment, sublet/licence income, event income, or grant funding.
2. Keep Harvest site money traceable by line.
3. For shop sales, Square is the till and payout record.
4. For landlord reporting, reconcile against lease definitions before sharing numbers.
5. Send accountant/lawyer questions with facts, not vague strategy.

**Done means:** money movement has an owner, category, record system, and reporting path.

**Failure modes:**

- Blurring maker consignment with Harvest revenue.
- Treating capital improvement fund spend as ordinary operating cost.
- Reporting revenue share from messy categories.

**What not to do:** do not build finance reporting from GHL tags.

## Build Order

Do not build all skills at once. Build them in the order the business needs them.

| Order | Skill | Reason |
| --- | --- | --- |
| 1 | Launch Readiness | Current blocker pressure |
| 2 | GHL Workflow Gate | Current manual workflow gap |
| 3 | Control Room Triage | Keeps truth visible |
| 4 | Shop Maker Loop | Turns shop interest into business activity |
| 5 | Comms Send Discipline | Prevents audience/list mistakes |
| 6 | Compliance Gate | Protects the business |
| 7 | Staff Handoff | Makes the system survive Ben not being present |
| 8 | Brand and Place Story | Keeps public voice coherent |
| 9 | Finance and Lease Loop | Needed before revenue/share complexity grows |

## Promotion Path

This doc is the map. A skill becomes real when it graduates into a folder:

```text
.agents/skills/harvest-launch-readiness/SKILL.md
.agents/skills/harvest-ghl-workflow-gate/SKILL.md
.agents/skills/harvest-shop-maker-loop/SKILL.md
```

Promotion rule:

```text
Make a proper skill only after the runbook has survived one real use.
```

Each promoted skill should keep references light. Point to source docs, do not paste whole strategy files into the skill.

## Current Gaps

- GHL workflow builder still requires UI work for calendar tags, trigger link, test sends, and scheduling.
- `VITE_GHL_IM_COMING_URL` still needs the live trigger link.
- Susie/Joey GHL users and shop-chat ownership are not finished.
- Shop has tags and docs, but the Monday maker sweep needs to become a repeatable procedure.
- Compliance gates need evidence fields, not just narrative notes.
- Finance/Square/Xero path is not yet operationalized.

## The Principle

The Harvest skill library is not a knowledge base.

It is how the business remembers how to act.
