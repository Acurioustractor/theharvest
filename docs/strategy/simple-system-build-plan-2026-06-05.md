# The simple system build plan — GHL spine, Humanitix events, WhatsApp crews

> Created 2026-06-05. The operator-grade build-out of the stack decided in
> `community-platform-decision-2026-06-05.md`. Designed so people with low tech literacy can
> RUN it (Susie, Joey, volunteers) and so the comms automation cannot misfire. This doc does
> not re-derive the mechanics; it sits on top of:
> - `ghl-pipeline-playbook.md` — the four-layer model (tags = who, pipeline = where,
>   workflows = what they hear, tasks = what we owe)
> - `email-operating-system.md` — the rules of the road for sending (workflow vs broadcast)
> - `harvest-ghl-tag-and-automation-map.md` — the canonical tag list
> - `GHL-completion-handoff-2026-06-03.md` — the pre-20-June build queue (unchanged by this plan)

## 1. Design rules (the whole philosophy in six lines)

1. **One screen per person.** Each operator lives in exactly one view. Nobody opens settings.
2. **Paper is a first-class input.** The come-back sheet, the kraft label, a phone call — all
   valid. The Monday sweep types them in. Barry never needs an app.
3. **Automation only ever says "we got it" and "don't forget".** Receipts, welcomes, event
   reminders. Everything with judgement in it is a human.
4. **Every automation has a name, an owner, and a kill switch** (unpublish the workflow).
5. **Nothing automated touches the community lane.** Jinibara, elders, storytellers: by hand,
   with consent, always.
6. **One vocabulary.** Tags come from the tag map only. New tag = update the map first.

## 2. Who runs what (one screen each)

| Person | Their one screen | What they do there | What they never do |
|---|---|---|---|
| **Susie / Joey** | LeadConnector app → Shop pipeline board + Conversations | Drag shop cards, reply to enquiries, book shop chats | Send broadcasts, edit workflows, touch tags |
| **Ben** | GHL desktop | Broadcasts (Field/Harvest Notes), workflow builds, the Monday sweep | Rush a send without the checklist |
| **Nic** | Calendars + the day itself | Maker sessions, work days, the gate | — |
| **Volunteer on event day** | Humanitix organiser app | Tap names at the gate (check-in) | Anything else |
| **Crew members** | Their WhatsApp group | Talk, organise, share photos | Need GHL at all |
| **Members/public** | Email + one-tap links | Read the Note, tap "I'm coming", fill a form | Never need an app or login |

The operator card (§8) is the printed version of this table. Laminate it, leave it at the shop.

## 3. The comms automation map (every message the system sends)

**Automatic (set once, fires itself):**

| # | Message | Fires when | Goes to | Status | Build ref |
|---|---|---|---|---|---|
| 1 | Follow Welcome | footer follow form | new follower | LIVE (`0cf2479e…`) | tag map |
| 2 | Member Welcome | `/membership` join form | new member | wired | workflow specs |
| 3 | Member Question Receipt | member question form | the asker | wired | workflow specs |
| 4 | Shop Interest Receipt | `/shop` EOI | the maker | LIVE (`ff4ff43e…`) | tag map |
| 5 | Contact-form receipt | contact form | the asker | LIVE | tag map |
| 6 | Shop nurture (2nd touch) | `interest:markets` + 4 days | the maker | **NOT BUILT — P1 spec 6** | handoff §P1 |
| 7 | Silent receipts ×5 | workshop / quiz / business / event / pulse forms | submitter | **NOT BUILT — P1** | handoff §P1 |
| 8 | Event reminders + day-before nudge | Humanitix native | event RSVPs | Phase 2 | §6 |
| 9 | Calendar booking confirmations | B1/B2/shop-chat bookings | the booker | LIVE (GHL native) | handoff |

**Human-sent (a person presses send, every time):**

| # | Message | Cadence | List | Rule |
|---|---|---|---|---|
| 10 | Field Note | ~monthly | Newsletter | safe-broadcast checklist, every time |
| 11 | Harvest Note | ~monthly | Members | members hear news first, always |
| 12 | Makers / shop updates | as needed | Shop list | never a cold blast; 1:1 for asks |
| 13 | The Knock (maker outreach) | rolling | individuals | 1:1 from a person's own inbox |
| 14 | After-day photo + one line | after each event | each guest | a message from a person, not a template |

**Never sent:** anything to `lane:community` via automation; anything that adds a tag from a
broadcast; anything to "All".

Alignment check this map enforces: one door per list (footer→follow, join form→member,
/shop→shop), an RSVP never subscribes, a receipt never sells, a broadcast never tags.

## 4. The four lanes, end to end (intake → auto → human → record)

| Lane | They do | System says (auto) | Human does | Record |
|---|---|---|---|---|
| **Public** | Tap "I'm coming" / turn up | Event reminder only | Leave them be; after-day photo + line | gathering/event tag, nothing else |
| **Maker/user** | Form, work day, shows up | Receipt + welcome | Invite to crew, hand-move rung after they DO something | Membership Journey card + `pod:` tag |
| **Producer** | `/shop` EOI or the Knock | Receipt now, nurture day 4 | Susie books chat, drags card New interest → On the shelf | Shop pipeline card + offer tag |
| **Community** | — | **Nothing. Ever.** | Relationship, consent first, by hand | `lane:community`, consent fields, owes-ledger |

## 5. Phase 0 — finish the specced build (now → 20 June) — owner: Ben

Unchanged from `GHL-completion-handoff-2026-06-03.md`. No new scope before the day. P0: 3
calendar→tag workflows, "I'm coming" trigger link, template time-edits + campaign schedule.

**DONE 2026-06-05: the 15-contact accidental-member downgrade.** Note the tag schema migrated
to the canonical namespaced vocabulary since the segmentation doc was written (flat
`harvest-member` / `harvest-newsletter` = 0 live; membership = `tier:member`, follow =
`comms:harvest-newsletter`). The downgrade executed in canonical terms: removed `tier:member` +
`interest-membership` + `interest:membership`, added `tier:connected`, kept
`comms:harvest-newsletter`. Verified live after: `tier:member` 45 (all genuine),
`tier:connected` 19.

**OPEN, launch-critical:** any smart list / campaign audience still keyed on the stripped flat
tags matches ZERO contacts. Before Note 02 sends (Fri 6 Jun), confirm in the GHL UI that the
members audience keys on `tier:member` and the newsletter audience on
`comms:harvest-newsletter`. The email-OS and tag-map docs still use the flat names — read them
through the migration (`harvest-ghl-alignment-2026-06-02.md` is the mapping).

**Done when:** acceptance checks in the handoff pass (`npm run count:rsvps:ghl` etc.).

## 6. Phase 1 — give the team their screens (week of 23 June) — owner: Ben, 2–3 hrs

1. **Done 2026-06-29:** create **Suzie + Joey as GHL users** (named blocker in the handoff).
   Permissions intended: Conversations, Opportunities, Calendars, Contacts ON; Marketing,
   Automation, Settings OFF.
   Restricting the menu IS the simplicity: they cannot see what they don't need.
2. **LeadConnector app** (free) on their phones, logged in. Walk once through: the Shop
   pipeline board, replying to a conversation, booking a shop chat.
3. **Done 2026-06-29:** move shop-chat calendar ownership Ben/Nic → Suzie/Joey. Remaining:
   connect their Google Calendars 2-way and check it actually syncs both ways with a test booking.
4. Teach the four-layer model in one breath: *"tags say who, the board says where, the robot
   says we-got-it, the task says what we owe."*
5. Hand over the **printed operator card** (§8).

**Done when:** Susie moves a real shop card and answers a real enquiry from her phone with
nobody helping. That is the acceptance test, not a checklist.

## 7. Phase 2 — Humanitix events engine (week of 30 June) — owner: Ben spike, then Susie runs

The 20 June day stays on the already-built GHL calendars + trigger link. This phase is for
the rhythm AFTER: monthly work days, workshops, market days.

1. **Spike (1 hr, Ben):** Humanitix account + The Harvest org profile + one test event.
   Verify the attendee path back to GHL: native integration vs Zapier vs CSV
   (**UNVERIFIED which is cleanest — resolve in the spike**). Fallback: weekly CSV import,
   which is one file and ten minutes and still beats hand-typed RSVPs.
2. **Event templates, once:** "Work Day" and "Workshop". Free events, capacity caps,
   reminders on (Humanitix native), one image, plain words.
3. **The operator move is duplicate-and-change-the-date.** That is the entire skill. Susie
   never builds an event from scratch.
4. **Check-in:** Humanitix organiser app on the gate phone. A volunteer taps names. No paper
   headcount maths at 5pm.
5. **Tags back to GHL:** attendees land as `event:<slug>-<date>` (same grammar as
   `witta-gathering-2026-06-20`). Headcount only. **An attendee tag is never a rung** — the
   no-auto-climb rule survives the new tool.
6. Website events page links/embeds the Humanitix listings.

**Done when:** the first July work day runs publish → RSVP → reminder → check-in → tags in
GHL without Ben being needed on the day.

## 8. Phase 3 — WhatsApp crews + the operator card (July) — owner: Nic + Ben, ~1 hr

1. Name the crews from real energy after the 20th (garden, art space, kitchen/events).
2. One WhatsApp group per crew, **one human admin each**. A two-line norms message pinned:
   what the group is for, photos of people only with their OK.
3. **Join door is a human:** someone turns up, helps, gets invited. No public join links.
4. Mirror in GHL: `pod:garden` etc., added during the Monday sweep. The tag mirrors the
   group; the group never depends on the tag.
5. Print the **operator card** (one page, laminated):
   - *Move a card when something real happens. New interest → In conversation when they reply.*
   - *Reply to messages from the app. Nothing should sit unread past 3 days.*
   - *Paper sheets and phone calls go in the Monday pile, someone types them in.*
   - *Never send to a list. Never add a tag while sending. If a number looks wrong, stop.*
   - *Elders and storytellers: no automation, no lists, ask Ben/Nic first, always.*

**Done when:** each crew has a group, an admin, matching `pod:` tags, and the card is at the shop.

## 9. The Monday sweep (30 min, one person, the heartbeat) — owner: rotates, starts Ben

1. **Harvest Inbox pipeline:** anything in New → answer it or task it with a date.
2. **Conversations:** unread → replied. Nothing older than 3 days.
3. **Shop board:** any card with no next-action date gets one (the playbook rule).
4. **Paper pile:** Saturday's sheets + labels typed in. Tags per the map, `pod:` invites noted.
5. **New shop EOIs:** confirm the receipt fired; book chats for the keen ones.
6. **Who DID something** (helped, came back, brought eggs): hand-move their Membership
   Journey rung. This is the only way anyone climbs.
7. **Read three numbers out loud:** members, next event RSVPs, makers on the shelf. If a
   number surprises you, find out why before doing anything else.

The sweep is the alignment mechanism. Automation catches and acknowledges; the sweep reads
and sorts. If the sweep is skipped two weeks running, the system is quietly broken — that is
the canary.

## 10. Failure modes, pre-answered

| What happens | What the system does | Who acts |
|---|---|---|
| Someone replies to an automated receipt | Lands in Conversations | Susie/Joey reply (it's a person now, not a flow) |
| Wrong person got a broadcast | Impossible-by-design if checklist followed (one smart list, count read aloud) | Ben re-reads `email-operating-system.md` |
| Workflow misbehaves | Unpublish it (the kill switch); contacts keep their tags | Ben |
| Humanitix→GHL sync breaks | Fall back to CSV export Monday | Sweep owner |
| Susie accidentally drags a card to the wrong stage | Drag it back; stages carry no automation side-effects by design | Anyone |
| A community-lane person ends up in a flow | Remove from workflow, audit how, fix the door | Ben, same day |
| Someone signs up twice | GHL upserts on email/phone; tags accumulate, no duplicate welcome (re-entry off) | Nobody |

## 11. What we never automate (the standing list)

- Moving anyone up a Membership Journey rung
- Anything to `lane:community` / `role:elder` / `role:storyteller`
- The Knock (maker asks are 1:1, from a person)
- The after-day photo message
- Membership charges, when money starts — a human confirms the relationship first;
  Stripe just collects

## 12. Sequence at a glance

| When | What | Owner | Effort |
|---|---|---|---|
| Now → 20 Jun | Phase 0: P0 handoff queue + 15-contact downgrade | Ben | as specced |
| Sat 20 Jun | The day. Hand-read the energy, sort the lanes | Ben + Nic | — |
| w/c 23 Jun | Phase 1: Susie/Joey users, app, operator handover | Ben | 2–3 hrs |
| w/c 30 Jun | Phase 2: Humanitix spike + templates (Ben overseas from 27 Jun — spike may shift, or run remote; the day-to-day holds because Phase 1 landed) | Ben | 1–2 hrs |
| July | First Humanitix work day; Phase 3 crews + card | Nic + Susie | ~1 hr setup |
| August | Review: is the sweep happening, are crews alive, does anyone want an online space | all | 30 min |
| At ~150–200 paying members | Revisit GHL Communities pilot / Circle, per the decision doc | Ben | — |
