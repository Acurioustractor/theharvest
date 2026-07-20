# Harvest event ops strategy - 18 June 2026

This is the working strategy for Friday 19 June 2026 and Saturday 20 June 2026.

It reconciles the current channel truth:

- GHL and the website hold RSVP and contact truth.
- Facebook brings people in and needs manual comment replies.
- Mighty is the inside room after human review, not the launch operating channel.
- Square can take money only after a live test proves it.
- Manual sheets are allowed on the day. Reconcile after.

## Current call

Use the website RSVP as the public call to action:

```text
https://www.theharvestwitta.com.au/june-20#rsvp
```

Do not send people to the Mighty paid Friday/Saturday plans unless Ben explicitly changes the
strategy and those plans are cleaned first. They still carry stale paid member/event framing.

Do not promise paid pizza, shop sales, or Square checkout until Square is verified in a live
test. The public copy should say the gate is open and ask people to RSVP so there is enough
dough/headcount.

## Verified state on 18 June 2026

Read-only checks run from the repo:

```bash
npm run report:launch-gates:ghl
npm run count:rsvps:ghl
npm run report:social:ghl -- --engagement
npm run report:mighty
npm run check:mighty-tags:ghl
```

Verified:

- GHL calendars exist for maker session, afternoon plus pizza, and shop chat.
- GHL tags exist: `witta-gathering-2026-06-20`, `rsvp-maker-morning`,
  `rsvp-pizza-dinner`, `project:act-hv`, `interest:markets`, `shop-call-booked`,
  `shop-follow-up`, and `role:supplier`.
- Public `/june-20` RSVP path is the embedded website form and the launch gate report says
  it writes `witta-gathering-2026-06-20` and `rsvp-pizza-dinner` directly.
- RSVP count is currently zero: B1 `0 / 18`, B2 `0 / 40`, and the three June 20 RSVP tags
  are all `0`.
- Open shop signal is real: `interest:markets` has 113 contacts.
- GHL social report can see 15 posts and engagement counts.
- Mighty API works for `The Harvest`: 10 spaces, 25 members, 18 posts, 6 events.
- GHL Mighty mirror tags all exist.

Blocked or watch:

- Maker calendar tag workflow is missing.
- Afternoon plus pizza tag workflow exists but is draft.
- Shop-chat booked workflow is missing.
- Susie and Joey are not visible as GHL users in the launch-gate report.
- Mighty has a duplicate empty `Start Here` and is missing or has renamed the expected
  `What's On`, `Questions Wall`, and `Ask a Steward` spaces.
- Mighty has visible paid member/event access plans that conflict with the current public
  launch strategy.
- Social comment bodies and reply state still need native GHL/Facebook checks, not API.
- Square/payment readiness was not verified by command or native UI in this pass.

## Operating model

```text
Facebook event / GHL social / email
  -> website RSVP
  -> GHL June 20 tags
  -> printed/manual day sheet
  -> day-of notes, helpers, payments, incidents, offers
  -> Sunday reconciliation
  -> GHL notes/tags/tasks
  -> Mighty first-cohort invites only after human review
```

## Channel roles

| Surface | Job this week | Do not use it for |
| --- | --- | --- |
| Website `/june-20` | One public RSVP path and the clearest truth | Payment, Mighty join, or complex intake |
| GHL | Contacts, tags, RSVP count, campaigns, inbox, social publishing record | Workflow truth unless the UI action graph is checked |
| Native Facebook/GHL Social Planner | Event comments, DMs, public reply queue | Automated comment-body reporting |
| Mighty | Inside room after Saturday, first cohort only | Public RSVP, checkout, or day-of operating truth |
| Square | Till only if tested | Membership, consent, newsletter subscription, or CRM source of truth |
| Manual sheet | Walk-ins, helpers, payments, incidents, follow-up asks | Long-term database |
| Repo/Notion | Memory, strategy, run sheets, meeting lens | Live comment/reply queue |

## Money and Square strategy

The clean default for Saturday 20 June is still:

```text
Free entry. RSVP for headcount. No public paid promise until Square is proved.
```

If Ben/Nic decide to take money on the night, use Square directly. Do not send people through
Mighty to pay for the launch.

### Paid mode gate

Paid mode is only safe when all of this is true:

- Square account owner is confirmed.
- Square Reader, terminal, or checkout link works on site.
- Item library is set up.
- Test sale and refund are complete.
- Payout account and receipt wording are understood.
- GST/tax language is not misleading.
- Cash policy is named: preferably no cash, or one cashbox owner.
- One payment lead is named for the night.
- One reconciliation owner is named for Sunday.
- GHL tag map has been agreed before any payment data is imported or tagged.

If any item is missing, run free/headcount mode and put a support/signup sheet at the table.

### Square item structure

Use plain item names so the end-of-night export is readable:

| Square category | Item examples | Notes |
| --- | --- | --- |
| Event food | `Opening night pizza - adult`, `Opening night pizza - kid` | Only if food/payment gates clear |
| Shop shelf | `Harvest shop shelf item` | Use item notes for maker name if needed |
| Support | `Harvest support payment` | Do not call it tax-deductible donation |

Every payment on Saturday should carry an internal batch note:

```text
square:2026-06-20-opening
```

### GHL tagging after Square

Do not auto-tag during the night.

After reconciliation, use these tag ideas only if the tag map is updated and the tags are
created deliberately:

| Tag idea | Use |
| --- | --- |
| `attended:opening-2026-06-20` | Person was present or checked in |
| `source:facebook-event` | Person came through the Facebook event |
| `payment:square` | Person made a Square payment |
| `purchase:pizza-night` | Person paid for pizza or food |
| `purchase:shop-shelf` | Person bought a shop item |
| `support:harvest-paid` | Person made a general support payment |

Consent rule:

```text
Payment does not equal permission to email, join membership, or invite to Mighty.
```

If someone pays and wants updates, capture consent separately on the manual sheet or in GHL.

## Friday 19 June - member and community test day

Decision goal:

```text
By Friday night, everyone knows what Saturday is, what is not promised, and who owns each gate.
```

Actions:

- Confirm insurance evidence or fallback decision.
- Confirm food mode: pizza, simple snacks, or tea/water.
- Confirm payment mode: free/headcount, Square paid, or support-only.
- If Square is possible, complete a test sale and refund before public copy mentions payment.
- Hide or correct stale Mighty paid plans and public-facing paid-member wording. Minimum fix:
  make the visible Mighty plans private/hidden or rewrite them so they do not contradict the
  website RSVP path.
- Publish or prepare the Facebook event with the website RSVP link.
- Send the Friday practical member note only after audience/count/test checks.
- Print or prepare the day sheet:
  - RSVP/walk-in name
  - contact method, optional
  - how they heard
  - pizza/headcount
  - helper/offer/ask
  - payment yes/no, if paid mode is on
  - consent to receive updates
  - follow-up owner
- Assign day roles:
  - launch owner
  - gate/welcome
  - parking/path
  - food/pizza
  - payment, if used
  - safety/incident
  - kids corner
  - comments/DMs
  - content/photos
  - close/reset

## Saturday 20 June - The Opening of The Harvest

Public frame:

```text
The Opening of The Harvest
Saturday 20 June 2026
9 Gumland Drive, Witta, Jinibara Country
Gate from 1pm. Pizza/headcount from 5pm if food mode is confirmed.
```

Day flow:

- Morning: site walk, hazards, toilets, handwashing, signs, parking, first aid, weather.
- Before gate: final comment/DM sweep and RSVP count.
- Gate: welcome, tick RSVP/walk-ins, invite people to the question wall.
- Afternoon: garden walk, milk crate pavilion, make/fix work, local conversations.
- From 5pm: pizza or the confirmed food fallback.
- Night: one clear conversation about what should happen next.
- Close: fire/oven off, bins, fridge, lights, lock-up, notes in one place.

Do not try to run the whole future system on Saturday. Saturday needs to prove:

- people can find the place
- people understand what it is
- the team can host safely
- food/payment does not create chaos
- follow-up asks are captured
- nobody is forced into Mighty or a funnel

## Sunday 21 June reconciliation

Run one sweep:

1. Count RSVPs, walk-ins, and actual attendees.
2. Reconcile Square batch and cashbox if paid mode was used.
3. Add only consented contacts or known contacts to GHL.
4. Add notes/tags/tasks for real follow-up.
5. Reply to unresolved comments, DMs, and emails.
6. Choose the first 8 to 12 Mighty invites by human review.
7. Park stale rows and build the next 7-day action list from what happened.

## Public copy rule

Public copy should say only what is true today.

Use:

- "Come see what is taking shape."
- "The gate opens this Saturday."
- "RSVP so we can count people and dough."
- "Kids welcome."
- "Bring a jacket and follow the signs when you arrive."

Avoid:

- stale Friday $10 / Saturday $30 Mighty links
- "members only" unless the event is actually members-only
- "paid pizza" unless Square and food gates are verified
- "shop open" unless payment, consignment, stock, and stewarding are ready
- automatic Mighty or membership promises
