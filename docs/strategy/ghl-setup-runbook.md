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

### Build checklist (Susie/Joey, tick straight through)

Order matters. Do the Google sync first, then the two 20 June events, then the shop calendar.
About 45 minutes. The three booking links are the goal: they unblock the launch emails.

**Step 0. Google 2-way sync (once each).**
- [ ] Susie, Joey, and Ben each connect their own Google Calendar in GHL (your user profile,
      then Calendar Connections, then Google, allow 2-way). Done when each shows "2-way".
- Why: GHL then reads real availability and writes bookings back, so nobody double-books.

**Step 1. B1, the maker session (10am to 2pm, Sat 20 June).**
- [ ] `Calendars` then `Create Calendar`, pick the event type ("Class Booking": a fixed event
      with seats, not a slot picker).
- [ ] Name: `RSVP: Maker session, Sat 20 June`.
- [ ] Owner: Nic (so it writes to Nic's synced calendar).
- [ ] Location (in person): The Harvest, 9 Gumland Dr, Witta.
- [ ] Date and time: Sat 20 June 2026, 10:00am, 4 hours (to 2:00pm).
- [ ] Seats / capacity: the real cap for the morning. **Ask Ben or Nic, do not guess a number.**
- [ ] Auto-confirmation ON. Confirmation message short and warm ("you're booked for the maker
      session, see you in the garden").
- [ ] Form fields: name, email, phone.
- [ ] Save, copy the booking link, label it **B1 link**.
- Done when: open the B1 link in a private browser window, book a test seat, confirm it lands
  on Nic's Google calendar, then delete the test booking.

**Step 2. B2, the afternoon and pizza (from 2pm, Sat 20 June). This is the dough count.**
- [ ] New Class Booking calendar, same as B1.
- [ ] Name: `RSVP: Afternoon + pizza, Sat 20 June`.
- [ ] Date and time: Sat 20 June 2026, 2:00pm (set an end like 6:00pm; the time is nominal, the
      point is the headcount).
- [ ] Seats / capacity: set generous, you want everyone to fit. **Confirm the cap with Ben/Nic.**
- [ ] Auto-confirmation ON, same fields as B1.
- [ ] Save, copy the link, label it **B2 link**.
- Done when: test-book, confirm, then delete the test.

**Step 3. Day-before reminder (both 20 June calendars). Nice to have, not blocking.**
- [ ] In each calendar's notification settings, add a reminder 1 day before. If there is no
      reminder option, skip it and tell Ben (it is a small workflow). Do not let this hold up
      the links.

**Step 4. Book a chat about the shop (ongoing, lower urgency).**
- [ ] `Create Calendar`, a regular booking calendar (round-robin between Susie and Joey, or
      simple owned by one).
- [ ] Name: `Book a chat about the shop`.
- [ ] Availability: a few windows a week only, not the whole diary (e.g. two afternoons).
- [ ] Auto-confirmation ON.
- [ ] Save, copy the link, label it **shop-chat link**.

**Step 5. Hand the three links back to Ben.**
- [ ] Send Ben the three links. They are what unblock the emails:
  - **B1** goes in the Wk4 Makers' invite.
  - **B2** goes in Harvest Note 02 and the Makers' invite (for those staying).
  - **shop-chat** goes in the shop nurture email (spec 6) and on the `/shop` page.
- [ ] Do not put the B1/B2 links on the public website. Members first.

**Stop and message Ben if:** the Class Booking type is not visible, or Google will not connect
2-way. Do not improvise around either; they are the foundation.

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

---

## Part 5: Sender domain fix (Harvest address instead of hi@act.place)

Why: launch and member emails currently send from `hi@act.place` (the shared ACT location
default). It works, and is parked for now, but it is off-brand for Harvest. The fix is a
location-wide GHL setup plus DNS records on the Harvest domain. Allow 30 to 60 minutes of
hands-on time plus DNS propagation (up to 24 to 48 hours).

### Pick the sending subdomain first

Use a **subdomain**, not the bare domain, so a campaign hiccup does not damage the root
domain's reputation. Two reasonable choices:

- `mail.theharvest.com.au` (cleaner, dedicated to Harvest).
- `harvest.act.place` (ties Harvest visually to ACT).

Default to `mail.theharvest.com.au` unless you want the ACT visual tie. The friendly From
address on emails can be e.g. `hi@theharvest.com.au`; the sending subdomain is the technical
plumbing underneath.

### Step 1: add the domain in GHL

1. Open `Settings -> Email Services -> Dedicated Domain & IP`.
2. Click `+ Add Domain`, enter the chosen subdomain.
3. GHL displays a table of DNS records to add: SPF (TXT), DKIM (TXT or CNAME), CNAME for the
   return-path, MX for bounces, DMARC (TXT). Leave this tab open.

### Step 2: add the records in the DNS provider

1. Log in to wherever the Harvest domain's DNS is hosted (Cloudflare, GoDaddy, Namecheap,
   etc.).
2. If GHL detects the DNS provider and offers **auto-config**, authorize it and let GHL set
   the records. This is the easy path.
3. Otherwise, copy each record from GHL exactly (name, type, value) and paste into the DNS
   provider's records UI. Save.

### Step 3: verify

1. Back in GHL, click **Verify** on each DNS record.
2. Many records verify within minutes; full propagation can take 24 to 48 hours.
3. Each record should show ✓ verified before relying on the sender.

### Step 4: switch the From address on the workflows

1. Open each Harvest workflow (Follow Welcome, Member Welcome, the six tag-triggered specs
   once built).
2. In each Email step, set **From Email** to e.g. `hi@theharvest.com.au`, and **From Name**
   to "The Harvest".
3. Test-send one workflow. Confirm SPF and DKIM pass in the email headers (in Gmail, "Show
   original" reveals both).

### DMARC alignment (the deliverability check)

DMARC requires the From-address domain to align with the DKIM/SPF signing domain. If the
From is `hi@theharvest.com.au` and the sending subdomain is `mail.theharvest.com.au`,
alignment is satisfied (both share parent `theharvest.com.au`). If alignment ever fails on a
campaign, GHL falls back to the default header configured under the dedicated domain.

### Who does what

- **Ben:** confirms domain ownership, gives DNS access.
- **Susie/Joey (or Ben):** clicks through Steps 1 to 4 above. Anyone with DNS access can do
  it.

Sources: HighLevel support docs (Add and Verify Domain DNS Records; Email Sending Guide;
Email Authentication DMARC).
