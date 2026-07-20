# The Harvest: launch pull-together, 2026-06-13

One week to Saturday 20 June. This brief pulls together the membership, GHL, comms, shop and June 20 docs into three things: a go/no-go for today's member announcement, a simpler way to explain membership, and a plan-on-a-page for the 20th.

It is a point-in-time decision brief. The canonical homes still own the detail: membership in `docs/strategy/harvest-member-system-2026-06-12.md`, the day in `docs/strategy/RECONCILED-20-june-public-open-day-2026-06-03.md` plus `docs/strategy/launch-ops-run-sheet.md`, comms in `docs/communications/00-COMMS-HOME.md`, shop in `docs/strategy/shop-operating-system.md`.

---

## Do-today shortlist

1. Confirm whether the member sends (Makers' invite, Harvest Note 02) have already gone. Members hear first, so nothing public goes out until they have.
2. Verify `/june-20` is live and the RSVP works on a phone (gate 1pm, free-ticket language, the "What brings you through the gate?" question visible).
3. Resolve two copy inconsistencies before any send repeats: pizza time (5pm vs "through the afternoon") and the single RSVP surface ("I'm coming" trigger link vs the `/june-20#rsvp` form).
4. If the member note has not gone, send it: `tier:member` (~80), no tag added, first-name fallback "there", test-send to Ben and Nic first.
5. Start chasing the insurance and entity-name gates. They are the spine of the week.

---

## 1. GO / NO-GO: member announcement (today)

**Verdict: GO-WITH-FIXES.** The note, the email HTML, and the member audience (`tier:member`, ~80) are ready and the members-first design is correct. The one real gate: the campaign has never been built or test-sent in GHL, so today's send needs a manual GHL UI build plus a test-send to Ben and Nic before it goes live.

### Pre-send checklist (in GHL, in order)

- [ ] Open the **A Curious Tractor** sub-account. The Harvest is the tag-identified subset inside it, never a separate location.
- [ ] Create a new **Campaign** (not a Workflow), named exactly: `Harvest member note - membership and June 20 - 2026-06-13`.
- [ ] Paste the ready HTML from `membership-member-note-email-2026-06-13.html`. Confirm the single CTA reads **"Get a free ticket"** and points to `https://www.theharvestwitta.com.au/june-20#rsvp`.
- [ ] Set audience to the **`tier:member`** smart list. Not `harvest-member` (legacy, ~0 live), not `comms:harvest-newsletter`, not All.
- [ ] **Exclude `test-submission` contacts** from the audience (smoke-test records carry that tag).
- [ ] **Confirm the count out loud: about 80.** If it shows 1, or about 100, the wrong tag is selected. STOP and fix before going further.
- [ ] **Check the copy timing.** The live GHL email templates may still carry the old "from 2pm" wording. Anything that mentions the day must read **gate from 1pm, pizza from 5pm**. The HTML in `membership-member-note-email-2026-06-13.html` is already correct; if you build from a saved GHL template instead, fix the timing first.
- [ ] Set **first-name merge fallback to "there"** (about 12 to 19 members carry `harvest-needs-name-review` / email-as-name and will break the greeting without it).
- [ ] Confirm the sender. Likely `hi@act.place` today (Harvest sending domain not yet verified). Acceptable per the docs. Note it as a fix, do not block on it.
- [ ] **Test-send to Ben and Nic.** Open on a phone. Click "Get a free ticket" and confirm it lands on `/june-20#rsvp` with the intention question visible.
- [ ] Re-confirm this is a **broadcast: it must NOT add or remove any tag** (adding a tag would trigger a workflow).
- [ ] Send, or schedule for this morning. After sending, do nothing else to tags or Mighty. Replies get a human (see Sequencing).

### Blockers to clear before send

- **Campaign not built or test-sent in GHL.** The API cannot create the Campaign object, so this is a manual UI build plus test-send. The one true gate on today's send.
- **Audience count unverified at send time.** Docs report `tier:member` = 80 as of 2026-06-12; re-read it in the builder today (about 80, not 1, not 100).
- **First-name fallback not yet set in this campaign.** Set to "there" before send.
- **Sender still `hi@act.place`.** Not a hard blocker, usable today. Record domain verification as a follow-up.

Keep these OUT of today's send (not blockers, but do not include): member level names, the founding-lifetime announcement, the Mighty product name or signup link, any membership pricing beyond one honest "free now" line, discounts / voting / governance / venue promises, and any person named or photographed without consent.

### Sequencing

This member note is **first** in the date-reveal order and must land **before** the public "free ticket" newsletter.

- **Already designed to precede it:** makers heard the 20 June morning first (Wk4 Makers' invite), then members via Harvest Note 02 (`tier:member`). Confirm those have gone.
- **Today:** member note to `tier:member` (~80). This is the members-hear-first moment.
- **After, same day or next morning:** the public gate-opens newsletter to `comms:harvest-newsletter` (~100, single "Get a free ticket" CTA). The gap between the two sends is the point. Do not collapse it, and do not let the public send go first.
- **Replies** (garden / shop / workshop / help / question) get a personal human answer. Do NOT auto-invite anyone into Mighty or change tags. Mighty invites are a later, human-review step (8 to 12 people, not the whole list).
- **Rest of the run:** Harvest Note 03 to members Fri 19 Jun, launch Sat 20 Jun, thank-you Wed 24 Jun, early-July note. Membership stays one sentence in public copy until after 20 June.

---

## 2. Membership, made simple

The current explanation is too dense in a few spots. This is the simpler version, voice-checked, ready to lift into the newsletter and the social queue.

### The one-sentence version

Membership is free, and it means you hear about things first and get to help shape what The Harvest becomes.

### The short version (newsletter)

Membership at The Harvest is free. It is not a fee and not a discount card. Being a member means you hear about what is on before anyone else, you find the next useful thing to be part of, and you get a say in how this place grows. To be part of it, just turn up, lend a hand, or reply and tell us what you are into.

### Three social drafts

**A. What it is** (square)
Membership at The Harvest is free.
It means you hear first, and you help shape what this place becomes.
No fee. No card. Just a way in.
Reply with one word: garden, shop, workshop.

**B. Members hear first** (story)
The date went to our members before it went anywhere else.
That is how it works here. Members hear first.
Want in? It is free to join.
Tap to say hello.

**C. How to support** (square)
The best way to back The Harvest is to show up.
Come to a work day. Make something for the shop. Bring a friend.
That is what being a member looks like.
Find out what is on this week.

### Ways to support it, made simple

- Turn up to a work day and get your hands in the garden.
- Make something for the shop shelf.
- Bring a friend along to something that is on.
- Share a post so more people in the hills find us.
- Reply and tell us what you are into, so we can point you to the next useful thing.

### Stop saying this, say this instead

- STOP: "That is most of what membership means right now." (Abstract before it is concrete.) SAY: "Membership is free. You hear first, and you help shape what The Harvest becomes."
- STOP: stacking "garden hands, shop makers, workshop people" plus "see what needs doing and help decide what happens next" in one sentence. SAY: split it. "Some people come for the garden. Some make for the shop. Some come for the workshops." Then separately: "All of them get a say in what happens next."
- STOP: "member level / participation pod / Mighty state" and any talk of levels, tiers, or rungs. SAY: describe what people do, not where they rank. "Whatever you turn up for, you are a member."

---

## 3. June 20 plan-on-a-page

Where a figure or date is not yet locked, it says "confirm".

### The shape of the day (reconciled: public open day)

Saturday 20 June is a public open day. The gate opens, everyone is welcome. Uncapped, public, and the date is public. (Ben's decision, 2026-06-03; supersedes the older private members' day model.)

- The Witta Market runs in the morning. After the market, the gate opens at The Harvest, 9 Gumland Drive, Witta, on Jinibara Country.
- Gate from 1pm to late afternoon. A working afternoon, not a performance.
- Walk the garden, put thoughts on a question wall, make or fix a few small things, then make-your-own pizza through the afternoon, then talk about what should happen next.
- Free ticket. Nothing sold on the day (no register, no Square).
- Make-your-own pizza on set bases: margherita, roast veg and feta, salami. Gluten-free base and dairy-free cheese options. Drinks: water, tea, coffee, soft drinks. BYO alcohol.
- Nic hosts and leads the room.

**Two timings to lock before copy repeats:** (a) pizza fixed at 5pm (RECONCILED 6-03) vs "through the afternoon" (12 Jun pack). (b) The maker morning session's status under the public model. RECONCILED recommends keeping it as a private pre-1pm maker session, not publicly promoted. Confirm both with Nic.

**Run sheet (operational base, re-time the old 10 to 2 / 2pm slots to the 1pm gate before the crew brief):** 8:30 site open and safety walk; 9:00 set up and signage; 1:30 oven fired, prep bar, drinks out; gathering begins after the gate; dusk lights and fire check; late wind-down and pack-down; close lock-up. Full checklists, signage list, stock list, service flow and volunteer onboarding live in `launch-ops-run-sheet.md`.

### Locked

- **Date and frame:** Sat 20 June 2026, public open day, gate from 1pm, "after the market", 9 Gumland Drive, Witta.
- **Free / nothing sold.** No liquor licence needed because nothing is sold. Food is served, not sold.
- **Audience:** public, uncapped.
- **Pizza menu, dietary options, drinks, BYO** (above). Host = Nic. Stock owner = Susie.
- **RSVP rule:** an RSVP is headcount, dough-count and intention only. It never subscribes anyone to the newsletter, member list or Mighty.
- **Public page** (`/june-20`, GardenLaunch.tsx) built, fact-correct and typecheck-clean as of 6-03. Verify it is merged, deployed and the RSVP works on a phone (state not confirmed in the docs).
- **All copy drafted and voice-checked:** public launch newsletter (GHL template `6a2b8da223b65d1a24ce4014`), Facebook post, Instagram caption, Facebook event description, plus the day-of operational base.
- **GHL rails:** Shop / Membership Journey / Harvest Inbox pipelines verified live 6-03. Audience counts verified 12 Jun: `comms:harvest-newsletter` = 100, `tier:member` = 80, `interest:markets` = 90, all 20-June RSVP tags = 0 (clean start).
- **Pre-launch scripts ready:** insurance broker brief ($20M PL: Clear / NFPIB / Aon) and the Sunshine Coast Council food-safety call script.

### Open gates this week (by urgency)

| # | Gate | Owner | By when | Status |
|---|------|-------|---------|--------|
| 1 | **$20M Public Liability** bound in the trading entity's name; Certificate of Currency in hand. The one hard kill-switch. No insurance, no event. | Ben | Cert **Thu 18 Jun**; bound **Fri 19 Jun** | UNVERIFIED in docs. Check against the ACT insurance addendum now. |
| 2 | **Entity name settled** (Harvest Pty vs A Curious Tractor Pty) with Standard Ledger, so brokers can bind. Broker brief still has a placeholder. | Ben / Standard Ledger | Was due **Mon 9 Jun** | **OVERDUE.** Blocks gate 1. |
| 3 | **Council food-safety call** (07 5475 7272). Confirms pizza is allowed, BYO, oven siting. If no answer in window, food locks to **tea and water only** and pizza falls away. | confirm | Target was **Fri 30 May** | **OVERDUE.** Window closing. |
| 4 | **Pizza lead** assigned. If no one takes it, fallback is the tea-and-water path. | confirm | Before crew brief (~Thu 18 Jun) | UNASSIGNED. |
| 5 | **Extra hands for a public crowd** confirmed (Kurtis and partner, the Holland contact were flagged; do not invent names). | Ben / Nic | This week | Not confirmed. |
| 6 | **Parking plan** for an unknown public number. | confirm | This week | Open. |
| 7 | **Fire / oven / kids risk assessment (T08)** drafted and walked with leads. | confirm | Before the day | Open. |
| 8 | **Day-of leads** beyond pizza: gate/check-in, kids supervisor, content and photos, signage owner, crew-brief owner, RSVP-list printer, first-aid owner. | Nic to assign | Crew brief | Open. |
| 9 | **Member announcement confirmed sent** before any public push. | Ben | Before public send | Confirm whether it has gone. |

**Fallback ladder if insurance is not certain:** same-day / event binder for 20 June; if even that is uncertain, the day becomes a closed rehearsal (10 to 15 named people, no public surface).

**Ben's window:** he departs overseas Sat 27 June. Every Ben-only decision must clear before then. He is present for 20 June, away for the 30 June cutover; Nic is on deck in Maleny 20 Jun to 1 Jul.

### The week to 20 June (day by day)

**Before anything sends today:** confirm the member sends (Harvest Note 02, Makers' invite) have gone. Date-reveal order is fixed: makers, then members, then public. If members have not heard, they hear before any further public push.

**Sat 13 Jun (today)**
- Verify `/june-20` is live: gate 1pm, free-ticket language, RSVP button works on a phone, intention question visible.
- Resolve the two live-model inconsistencies (pizza time; single RSVP surface).
- Confirm member sends are done. If not, send the member note first: `tier:member` (~80, never All), no tag added, fallback "there", test-send to Ben and Nic first.
- Start chasing the insurance and entity-name gates (1, 2). The week's spine.

**Sun 14 to Mon 15 Jun**
- Build the **public launch newsletter as a GHL Campaign** (manual UI; the API can't create the Campaign object). Audience `comms:harvest-newsletter` (~100; if GHL shows 1, you picked the legacy tag, stop). One CTA: "Get a free ticket" to `https://www.theharvestwitta.com.au/june-20#rsvp`. Sender likely `hi@act.place` (record as a fix).
- Test-send to Ben and Nic, open on phone, click through.
- **Public send** once members have heard and the test passes. Then Facebook post, Instagram caption, Facebook event (post in GHL Social Planner, then `npm run sync:social -- --pull-ghl` dry-run, then `--apply` to record in Notion).

**Tue 16 to Wed 17 Jun**
- Council call if still open (gate 3). Lock pizza vs tea-only on the answer.
- Assign pizza lead (gate 4) and the remaining day-of leads (gate 8).
- Confirm extra hands (gate 5), parking plan (gate 6).
- Read the live RSVP / dough count, finalise stock (run sheet estimates ~60 bases for ~40 people, confirm against actual headcount first).
- Social: a place / people / garden photo post and a countdown. No new public claim beyond the open day.

**Thu 18 Jun**
- **Insurance Certificate of Currency in hand (gate 1).** If not, trigger the fallback ladder.
- Draft and walk the fire / oven / kids risk assessment (gate 7) with leads.
- Crew brief off the re-timed run sheet (1pm gate, not the old 10 to 2 model). Print the RSVP list.
- Buy and prep stock per the confirmed count (~$2,500 soft-opening line covers it).

**Fri 19 Jun**
- **PL bound (gate 1).** Harvest Note 03 to members (`tier:member`, broadcast, no tag, "there" fallback).
- Final site prep, signage and wayfinding set, drinks chilled, oven and fire checked.
- Confirm every day-of lead knows their job and arrival time.

**Sat 20 Jun, the day**
- 8:30 site open and safety walk, 9:00 set up and signage, after the market gate from 1pm, 1:30 oven fired and prep bar and drinks out, afternoon garden walk and question wall and make/fix and make-your-own pizza, talk about what's next, dusk lights and fire check, pack-down, lock-up.
- Content and photos owner captures consent-gated material (this also fills the only fabrication-risk blank: a real maker name and photo for the Wk3 social post).

**After:** thank-you to attendees (confirm date; docs reference Wed 24 Jun) and an early-July note. Do NOT bulk-invite RSVPs into Mighty; that is a later, one-by-one human-review step.

### The shop on the day, and how people support it

The shop is **not** a sale surface on 20 June. Square account, Reader and item setup are not confirmed done, and the council food confirmation and the Standard Ledger consignment split are still open. Do not promise live shop sales.

What is true and can be said:

- The shared shelf is taking shape, and the people closest to The Harvest are hearing about it first.
- It is a shared shelf for what people around Witta and Maleny grow and make, with honest signage about who made it. Makers keep most of what you pay (the exact percentage, within 75 to 80 percent, is held until Standard Ledger confirms, so do not state a number yet).

How people support it on the day, in plain terms:

- **Makers and growers:** the 20 June maker session is the first gathering of the maker community. Invite makers to that gathering rather than to a finished shop. If someone wants produce or work on the shelf, point them to the `/shop` form, which lands them in the maker pipeline. Do this 1:1, not by broadcast.
- **Everyone else:** come through the gate, walk the garden, put a thought on the question wall, make or fix something small, share a pizza. The afternoon's "what should happen next" conversation is itself how people shape the shop and the rest of the place.
- **Maker outreach order (off-day, June):** warm leads first (Leeza, Rebecca, Monita, Lachie), then Witta / Wootha neighbours, then fast shelf-stable wins (honey, coffee, chai, preserves), then galleries. 1:1 contact, no broadcast.

---

## Method note (how this was produced, and its gaps)

Produced by a five-reader workflow over the membership, GHL, June 20, shop and comms doc clusters, then synthesis and a voice plus fact-check pass.

- **GHL build-state: gap now closed** (re-run 2026-06-13, all six GHL docs read). The build is substantially live for the public-open-day model. Confirmed live: the Shop and Harvest Inbox pipelines, the B1 / B2 / shop-chat calendars, the website June 20 RSVP Receipt workflow (`95d515a6-...`, live-tested 2026-06-11) and its embedded public RSVP form, the Member Welcome / Follow Welcome / receipt workflows, the 6 June email templates, and clean contact hygiene (audit 2026-06-02). New gotchas this surfaced, now folded into the checklist above: (1) **exclude `test-submission`** on the member send; (2) the **live GHL email templates may still say "from 2pm"** and need a hand-edit to gate 1pm / pizza 5pm (re-running a draft script can create duplicates, so edit in place); (3) the **3 calendar-to-tag workflows (P0) are not confirmed built**, so the dough count read from the calendar door could under-read, though the verified website RSVP form covers the public count; (4) reconcile which is the live public RSVP surface, the embedded form (newest doc) or the "I'm coming" trigger link; (5) the API cannot create the Campaign object or build workflows, so all of this is manual GHL UI work; (6) sender stays `hi@act.place` until the Harvest domain is verified (acceptable, does not risk the date).
- **Voice gate:** the membership explainer passed clean on banned words and hierarchy / paywall framing. Four em-dashes (three social labels, one plan title) were caught and fixed in this document.
- **Fact-check note:** the verifier was scoped to the membership review only, so it flagged figures sourced from the other reviews (audience counts, pizza menu, council number, cert dates, $2,500, 75 to 80 percent, template id) as unbacked. Each was cross-checked against the june20, comms and shop reviews, which read the real docs, and traces to source. The plan keeps those figures with their "confirm" caveats.
