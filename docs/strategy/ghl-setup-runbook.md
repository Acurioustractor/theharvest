# GHL Setup Runbook

> Created 2026-05-27. A do-it-yourself guide for setting up the Harvest automations,
> Conversations, and WhatsApp in GoHighLevel. Written so Susie, Joey, or an intern can follow
> it without Ben. Companion to `ghl-pipeline-playbook.md` (the why) and
> `ghl-workflow-build-specs.md` (the email copy). The GHL location is shared across
> ACT/Goods/Harvest, so keep everything tagged and named "Harvest -".

## Suggested order

1. Calendars (30 min, powers the shop calls + meetups).
2. The 6 tag-triggered workflows (an evening; no code).
3. Conversations + phone number + the mobile app.
4. WhatsApp (when there is capacity; the fiddliest).

---

## Part 0 — Calendars (do first)

In `Settings -> Calendars` (or the `Calendars` nav). First, **connect Google Calendar with
2-way sync** for Susie + Joey + Ben so GHL respects real availability and writes bookings back.
That shared sync is what stops double-booking. Then build two:

**A. "Book a chat about the shop"** — a regular booking calendar, owned by Susie/Joey (or
round-robin between them). Limit the slots (a few windows a week, not the whole diary).
Auto-confirmation + a reminder. Drop the booking link into the shop nurture email (spec 6,
`[booking link]`) and on `/shop`. This turns "we should call them" into "they book us."

**B. "RSVP — 20 June members' day"** — build **two** Class Booking events (a fixed event with
capacity, not a slot picker), both dated Sat 20 June, each with a capacity, auto-confirmation,
and a **day-before reminder**. Two slots so the pizza dinner headcount is real:

- **B1 — Maker session (10am–2pm).** Link goes in the Wk4 Makers' invite (makers and doers:
  shop EOIs + doers tag).
- **B2 — Afternoon + pizza (from 2pm).** Link goes in the Makers' invite (for those staying on)
  and in Harvest Note 02 (members). **B2 bookings = the dough count** for the pizza dinner.

Keep both links members-first: the morning link is makers-only, the afternoon link goes to the
member list. Do not put either on the public website.

---

## Part 1 — The auto-message workflows

All in `Automation -> Workflows` (where "Harvest - Follow Welcome" was built). These six are
**tag-triggered**: they fire off a tag the website already stamps on the contact. No env var,
no code, no deploy. Build and publish, done.

| Workflow | Trigger: Contact Tag added = | Copy from |
| --- | --- | --- |
| Harvest - Shop Nurture | `harvest-shop-interest` | spec 6 |
| Harvest - Workshop Receipt | `workshop-booking` | spec 1 |
| Harvest - Quiz Follow Up | `quiz-completed` | spec 2 |
| Harvest - Business Receipt | `business-registration` | spec 3 |
| Harvest - Event Receipt | `event-submission` | spec 4 |
| Harvest - Pulse Thanks | `pulse-respondent` | spec 5 |

**Per workflow (~5 min):**
1. `Automation -> Workflows -> + Create Workflow -> Start from Scratch`.
2. Name it (e.g. "Harvest - Shop Nurture").
3. **Add New Trigger -> "Contact Tag" -> is added ->** pick the tag above.
4. **+ -> Send Email**, paste subject + body from the spec. (Shop Nurture also gets a
   **Wait 4 days** first, then an **If/Else** by offer tag; spec 6 details it.)
5. **Settings -> Allow re-entry OFF**, Allow multiple opportunities OFF.
6. **Publish**.

**Verify the first one:** GHL should fire a tag-trigger when the website adds the tag via
API (standard behaviour, ~90% sure). After building the first workflow, do a real test
submission and confirm the email arrives. If it does not fire, the fallback is enrol-by-ID
(build with no trigger, paste the workflow ID into the matching env var, redeploy) — ask Ben.

Follow Welcome and Member Welcome are different: the website enrols those by ID, so they have
no trigger. Do not add tag triggers to them.

The **Member Reconfirm** (15 legacy members) is a one-time campaign using Trigger Links; see
`ghl-workflow-build-specs.md`. Leave it till last.

---

## Part 2 — Conversations (the reply surface)

The `Conversations` tab is one inbox for every contact's email / SMS / WhatsApp / DMs,
threaded per person, logged on their contact card. This is the day-to-day surface for Susie
and Joey.

1. **Phone number** — `Settings -> Phone System`. One number exists: +61 468 052 660. This
   unlocks SMS + calls in the inbox. (Email already works.)
2. **Email sending** — `Settings -> Email Services`. Sends from `hi@act.place` for now (the
   Harvest-address fix is parked).
3. **Open `Conversations`** — reply from here; it logs on the contact.
4. **Assign owners** — route conversations to Susie or Joey.
5. **Mobile app (the killer move):** Susie + Joey install **LeadConnector** on their phones
   and reply on the go, all logged. This is what makes "easy to get back to people" real.

---

## Part 3 — WhatsApp (the community's real channel)

Worth it because it is where people actually are, but the fiddliest. Do it after Conversations.

**Read the number gotcha first (Part 3a) — it decides everything.**

### 3a. The phone-number rule (critical)

A WhatsApp Business Platform number **cannot already be on a personal WhatsApp app**, and
Meta sometimes rejects virtual/VoIP numbers.

- If +61 468 052 660 is a GHL/LeadConnector-provisioned number (not a real phone with
  personal WhatsApp), try it for WhatsApp first.
- If it is Ben's actual mobile with WhatsApp on it, **do not use it** — pick a separate
  dedicated number.
- Confirm which it is before starting, or the connection will fail confusingly.

### 3b. Meta / Facebook Business account

WhatsApp API lives under a Meta Business account. If the existing Facebook business account
has issues, **create a fresh Meta Business account** at business.facebook.com with
**benjamin@act.place** as admin — clean home for ACT/Harvest. Name it "A Curious Tractor".

### 3c. Connect in GHL

1. `Settings -> WhatsApp` (in the left nav) -> run the embedded Meta signup, selecting the new
   Business account + the chosen number. Approval can take a day or two.
2. Once live, WhatsApp threads flow into `Conversations`. 1:1 replies are free within 24h of
   someone messaging you; **outbound broadcasts need pre-approved message templates** (Meta's
   rule).
3. Harvest use: a "Shop Makers" broadcast for fired-up updates + 1:1 follow-ups.

### 3d. The easy fallback

If the Meta setup stalls, run a **WhatsApp Business app on a phone + a manual broadcast list**
to start. Zero integration, and the community cannot tell the difference. Graduate to the GHL
connection later.

---

## Making the most of the GHL number

+61 468 052 660 can carry: SMS to/from makers and members (in Conversations), calls (set a
forwarding number + caller ID under `Settings -> Phone System`), automated **SMS reminders**
on Calendar bookings, and possibly WhatsApp (per Part 3a). Keep the friendly name and
forwarding current so calls reach a human.
