# hi@act.place as the notification centre

Written 2026-07-06. Today every form notification lands only in
benjamin@act.place, and Ben is overseas until 15 August. This runbook moves the
notification stream to hi@act.place as a shared inbox, with benjamin@ kept as a
second recipient so nothing is missed during the changeover.

The model: hi@act.place receives every notification, the daily desk works the
GHL Harvest Inbox pipeline, and replies go out from a Harvest address. One
inbox anyone on the desk can read, one pipeline that shows what is owed a
reply.

## Part 1: GHL workflow edits (about 30 minutes, GHL UI only)

For each workflow below: Automation, open the workflow, find the internal
notification or email step addressed to benjamin@act.place, and set the
recipients to hi@act.place AND benjamin@act.place. Save and republish.

| Workflow | Id (for search) | What it notifies |
| --- | --- | --- |
| Harvest - Contact Form Receipt | 93596cb4 | website contact form messages |
| Contact Form to Universal Inquiry | f0c1f3db | the "New Inquiry" emails. While here, FIX THE TEMPLATE: it currently sends no message body, add {{contact.message}} |
| Harvest - Shop Interest Receipt | ff4ff43e | shop maker and grower EOIs |
| Harvest - Member Question Receipt | 62aa2b50 | member questions |
| Harvest - Member Welcome | 19cc358a | check for an internal notify step; add hi@ if present |
| Harvest - Follow Welcome | 0cf2479e | same check |
| Harvest - June 20 RSVP Receipt | 95d515a6 | legacy; add hi@ if it stays in use |

Workflows still to be built (receipt specs 1 to 5 in
docs/strategy/ghl-workflow-build-specs.md) should use hi@ + benjamin@ as the
notification recipients from day one. Same for the pizza RSVP workflow when
the draft (c03f016c) is published.

## Part 2: who reads hi@act.place

Decide and do one of these, both work with Part 1:

1. **Mailbox access.** hi@act.place is an act.place Google Workspace address.
   Add Nic (and later a steward) as a delegate or group member so the inbox is
   readable on their phones. Fastest to stand up.
2. **GHL Conversations.** Connect hi@act.place as the location's email in GHL
   so inbound lands in Conversations, next to the contact record and pipeline
   card. Staff use the LeadConnector app. Better long term, slightly more
   setup.

## Part 3: the reply rule

- Anything needing an answer gets a Harvest Inbox pipeline card (most forms
  already create one). The desk moves cards: New, In progress, Waiting on
  them, Resolved.
- Replies go from hi@act.place (or hi@theharvestwitta.com.au once the sending
  domain decision lands), never from personal addresses, so the thread
  survives staff changes.
- Nothing waits more than 2 days. The daily 7am check-in on the Notion
  dashboard lists who is waiting each morning.

## Part 4: staff users in GHL (so replies are attributed)

Settings, My Staff, add each person as a user on the ACT location with the
Harvest team: Nic first, then Dennis and the stewards as the desk widens.
What this buys:

- Every reply sent from GHL Conversations is stamped with the user who sent
  it. "Who replied" stops being a mystery.
- Opportunities (pipeline cards) get an owner via Assigned to. The owner is
  the person who owes the reply.
- The LeadConnector phone app gives each person the desk in their pocket.

Rule of thumb: a card with no owner is nobody's job. The first triage act is
always assign it to a person.

## Part 5: the triage flow, end to end

1. Message arrives (form, question, EOI). Notification lands at hi@act.place;
   a card appears in the Harvest Inbox pipeline stage New.
2. Whoever is on the desk (daily, 15 minutes): open the card, identify what
   it is, ASSIGN it to a person, move it to In progress.
3. The owner replies from GHL Conversations (or hi@), then moves the card to
   Waiting on them or Resolved.
4. Shop EOIs follow the same shape on the Shop pipeline: New interest means
   nobody has spoken to them yet.

## Part 6: seeing the triage, and getting better at it

The GHL webhook already mirrors every pipeline card into Supabase
(ghl_opportunities: pipeline, stage, assigned_to, timestamps), so triage
health is measurable without opening GHL. Baseline on 2026-07-06:

- Harvest Inbox: 11 cards in New, 21 in In progress (untouched since 16 Jun),
  13 Resolved. 32 open cards, none with a named owner.
- Shop pipeline: 29 in New interest, 5 in conversation.

The daily 7am check-in on the Notion dashboard now reports these counts every
morning: cards in New, cards open with no owner, and how long the oldest has
waited. The number to drive down is "cards in New older than 2 days"; the
habit that drives it down is the 15-minute daily desk. Review the trend at
the Monday check-in and adjust.

Contact-list health rides the same rhythm: the monthly hygiene pass (dupes,
no-name rows, test contacts, tag drift) is action-listed in Notion, and the
mirror makes the list auditable with SQL at any time.

## What this does NOT change

- hi@act.place stays the sending identity for newsletters and receipts.
- The sending domain decision (send.theharvestwitta.com.au) is separate and
  still Ben's call.
- Gmail rules on benjamin@ can file the duplicate notifications to a folder
  once hi@ is proven.
