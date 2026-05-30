# Harvest GHL Workflow Build Specs

Last verified against live GHL: 2026-05-27

Companion to `harvest-ghl-tag-and-automation-map.md`. The map records which workflows
exist and how forms tag contacts. This file is the build sheet for the workflows that
do not exist in GHL yet, plus the wiring state for the ones that do.

GHL does not let the website create workflows over the API. The site can only list and
trigger them. So each spec below is built by hand in the GHL workflow builder, then its
ID is pasted into the matching env var (local `.env` and Vercel).

## Wiring state (verified 2026-05-27)

Five workflows exist in GHL and are correctly wired:

| Env var | GHL workflow | ID |
| --- | --- | --- |
| `GHL_EOI_WORKFLOW_ID` | Harvest — EOI Gathering Confirmation | `ca37ba92-5a8b-4209-9b88-34fc924c5393` |
| `GHL_MEMBER_WELCOME_WORKFLOW_ID` | Harvest - Member Welcome | `19cc358a-05f6-4d99-8e6b-91b31c63e8c4` |
| `GHL_MEMBER_QUESTION_WORKFLOW_ID` | Harvest - Member Question Receipt | `62aa2b50-c4f3-4564-84c3-3aa81c0c36f8` |
| `GHL_CONTACT_FORM_WORKFLOW_ID` | Contact Form to Universal Inquiry | `f0c1f3db-8809-4283-ba91-907626ac0bb7` |
| `GHL_SHOP_INTEREST_WORKFLOW_ID` | Harvest - Shop Interest Receipt | `ff4ff43e-0174-415d-828e-3610f5386de5` |

**`ff4ff43e` confirmed 2026-05-30:** its Create-Opportunity action points at **The Shop pipeline / New interest** (trigger: Form Submitted, no filters), so future `/shop` form EOIs card correctly. An earlier version created the opp in Universal Inquiry; that is fixed and verified live.

Photo Wall is correctly wired in Vercel production (`GHL_PHOTO_WALL_WORKFLOW_ID` =
`65819e73-09c8-4598-b982-41dfeeb8624e`, present since well before 2026-05-27).

**Newsletter follow-welcome is now wired to a Harvest workflow (2026-05-27).** The footer
"follow along" path fires the new **"Harvest - Follow Welcome"** workflow
(`0cf2479e-791c-43ac-a8cd-a3395a03cdaa`), built by cloning the email step into a fresh
workflow with no trigger (the website enrols by ID, which bypasses triggers). Verified end
to end on 2026-05-27: a live follow test through production delivered the correct
Harvest-voice email (subject "You're following along with The Harvest").

Do NOT point `GHL_NEWSLETTER_WORKFLOW_ID` at the generic `Newsletter Signup` workflow
(`0c61347a-b59b-4de5-ae90-32a59c8e4805`). That is a shared/legacy ACT workflow that sends an
ACT-branded welcome ("Welcome to the ACT community", "A Curious Tractor", "regenerative
innovation ecosystem"), found by a live test on 2026-05-27 and a direct violation of Harvest
voice.

Open follow-up (not blocking): the welcome sends from `hi@act.place` (GHL location default),
not a Harvest address. Sending from `hello@theharvestwitta.com.au` needs that domain verified
as a sending domain in GHL, then set in each workflow's Email action From field. Affects all
Harvest workflows, not just this one.

| Env var | GHL workflow | ID | State |
| --- | --- | --- | --- |
| `GHL_NEWSLETTER_WORKFLOW_ID` | Harvest - Follow Welcome | `0cf2479e-791c-43ac-a8cd-a3395a03cdaa` | wired + verified |
| `GHL_PHOTO_WALL_WORKFLOW_ID` | Witta Gathering Photos | `65819e73-09c8-4598-b982-41dfeeb8624e` | wired |

## 0. Harvest - Follow Welcome (build this first)

The footer "follow along" path enrols the contact via workflow ID (not a tag trigger), the
same mechanism the working "Harvest - Member Welcome" uses. Easiest reliable build: in GHL,
**clone "Harvest - Member Welcome"**, rename the copy to **"Harvest - Follow Welcome"**,
replace the email with the copy below, and publish. Cloning guarantees the enrolment config
matches what the website expects (`triggerGHLWorkflow(workflowId, contactId)`,
`server/routers.ts:688`, non-member branch).

- **Env var:** `GHL_NEWSLETTER_WORKFLOW_ID` (currently blank)
- **Re-enrolment:** OFF.
- **First name merge default:** "there".
- **Sender / reply-to:** hello@theharvestwitta.com.au.

**Email**

Subject: You're following along with The Harvest
Preview: A note now and then from the garden in Witta.

Hi {{contact.first_name}},

Thanks for following along. Now and then you'll get a note from The Harvest: what's growing in the garden, what's happening in the events space, and what's taking shape in the art space, here in Witta on Jinibara Country.

No ask, and nothing to log into. Just a story or two worth your time, and the odd invitation to come and see it for yourself.

If you ever want more than the updates, the door to becoming a member is open whenever you're ready. For now, you're exactly where you need to be.

See you in the garden,
The Harvest

After publishing, send the new workflow ID to repoint `GHL_NEWSLETTER_WORKFLOW_ID` (local
`.env` + Vercel production), redeploy, and smoke-test to a readable mailbox.

---

Five forms have no workflow in GHL yet. **Simplest path (recommended): build each as a
tag-triggered workflow** ("Contact Tag added is <the trigger tag>") and leave the env var
blank. The website already stamps these unique tags, so the workflow fires on its own — no
env var, no redeploy. Verify the first one with a real test submission. Only if a tag-trigger
does not fire (it should) fall back to enrol-by-ID: build with no trigger and paste the
workflow ID into the env var below (local + Vercel), then redeploy. Either way, never do both
for the same workflow or the contact enrols twice.

| Env var (enrol-by-ID fallback only) | Form route | Trigger tag | Spec |
| --- | --- | --- | --- |
| `GHL_WORKSHOP_WORKFLOW_ID` | `workshops.book` | `workshop-booking` | 1 below |
| `GHL_QUIZ_WORKFLOW_ID` | `quiz.submit` | `quiz-completed` | 2 below |
| `GHL_BUSINESS_REG_WORKFLOW_ID` | `businesses.submit` | `business-registration` | 3 below |
| `GHL_EVENT_SUBMIT_WORKFLOW_ID` | `events.submit` | `event-submission` | 4 below |
| `GHL_PULSE_WORKFLOW_ID` | `pulse.submit` | `pulse-respondent` | 5 below |

## Shared build settings

Apply these to all five workflows unless a spec says otherwise.

- **Sender:** hello@theharvestwitta.com.au (confirm this is the sending address you want).
- **Reply-to:** hello@theharvestwitta.com.au.
- **Re-enrolment:** OFF. A contact should not run the same receipt twice.
- **First name:** use `{{contact.first_name}}`. If you want a fallback for blanks, set the
  merge default to "there".
- **Internal notifications** go to the team inbox you watch. The website already creates a
  card in the Harvest Inbox pipeline for workshop, business, and event submissions, so the
  internal email is a heads-up, not the system of record.
- **Voice:** no em-dashes, no marketing words, no invented dates or numbers. The Harvest is
  taking shape on Jinibara Country in Witta. The front door is garden, events, and art space.
  Do not promise a launch date in transactional copy.

---

## 1. Harvest - Workshop Booking Receipt

- **Trigger:** Contact Tag added is `workshop-booking`
- **Env var:** `GHL_WORKSHOP_WORKFLOW_ID`
- **Steps:**
  1. Send email (immediate). Copy below.
  2. Send internal notification email to the team inbox: subject `New workshop booking: {{contact.first_name}} {{contact.last_name}}`, body with the contact email and a note to open their card in the Harvest Inbox pipeline for the workshop they asked about.
  3. Add tag `workshop-booking-ack-sent`.

**Email**

Subject: We have your workshop booking
Preview: We will confirm the details with you shortly.

Hi {{contact.first_name}},

Thanks for booking a spot. We have your request and one of us will be in touch to confirm the details, including timing and anything you need to bring.

Workshops at The Harvest are still taking shape, so numbers are small and the rooms are simple. That is on purpose. You learn more in a small group with your hands busy.

If your plans change, just reply to this email and let us know.

See you in the shed,
The Harvest

---

## 2. Harvest - Quiz Follow Up

- **Trigger:** Contact Tag added is `quiz-completed`
- **Env var:** `GHL_QUIZ_WORKFLOW_ID`
- **Steps:**
  1. Send email (immediate). Base email copy below.
  2. Add tag `quiz-followup-sent`.
- **Optional branching:** the quiz already applies a persona tag (`quiz-grower`, `quiz-maker`,
  `quiz-gatherer`, `quiz-regular`, `quiz-explorer`). If you want tailored copy later, add an
  If/Else after the trigger that swaps one line based on the persona tag. Start with the base
  email and add branches only once they earn their keep.

**Email**

Subject: Thanks for telling us how you would use The Harvest
Preview: Here is where to look next.

Hi {{contact.first_name}},

Thanks for the few minutes. What you told us helps us shape the garden, the events, and the art space around what people here actually want, rather than what we guess.

We will keep you posted as things take shape. If you would rather hear from us regularly, the newsletter is the place to be, and you are already on it.

Talk soon,
The Harvest

---

## 3. Harvest - Business Registration Receipt

- **Trigger:** Contact Tag added is `business-registration`
- **Env var:** `GHL_BUSINESS_REG_WORKFLOW_ID`
- **Steps:**
  1. Send email (immediate). Copy below.
  2. Send internal notification to the team inbox: subject `New business registration: {{contact.first_name}} {{contact.last_name}}`, body pointing to their Harvest Inbox card for review.
  3. Add tag `business-reg-ack-sent`.

**Email**

Subject: We have your business details
Preview: We will read it properly and come back to you.

Hi {{contact.first_name}},

Thanks for registering. We are building relationships with local producers, makers, and services around Witta and Maleny, and yours is now on the list to look at properly.

We read each one rather than auto-listing, so give us a little time. If there is a fit, we will be in touch about what working together could look like.

Thanks for putting your hand up,
The Harvest

---

## 4. Harvest - Event Submission Receipt

- **Trigger:** Contact Tag added is `event-submission`
- **Env var:** `GHL_EVENT_SUBMIT_WORKFLOW_ID`
- **Steps:**
  1. Send email (immediate). Copy below.
  2. Send internal notification to the team inbox: subject `New event idea: {{contact.first_name}} {{contact.last_name}}`, body pointing to their Harvest Inbox card.
  3. Add tag `event-submit-ack-sent`.

**Email**

Subject: We have your event idea
Preview: Every submission gets read by a person.

Hi {{contact.first_name}},

Thanks for sending this through. The events at The Harvest come from people in the community proposing them, so ideas like yours are exactly how the calendar fills.

We read every submission. If we have questions or want to take it further, we will reply to this email.

Thanks for thinking of us,
The Harvest

---

## 5. Harvest - Pulse Thank You

- **Trigger:** Contact Tag added is `pulse-respondent`
- **Env var:** `GHL_PULSE_WORKFLOW_ID`
- **Steps:**
  1. Send email (immediate). Copy below.
  2. Add tag `pulse-thanks-sent`.
- **No internal notification.** Pulse is high volume and feeds the results view, not a per-response inbox.

**Email**

Subject: Thanks for the pulse check
Preview: We read every response.

Hi {{contact.first_name}},

Thanks for sharing where you are at. We read every response, and they shape what we focus on next across the garden, events, and the art space.

No reply needed. We just wanted you to know it landed.

The Harvest

---

## 6. Harvest - Shop Nurture

The shop EOI already fires an immediate receipt ("Harvest - Shop Interest Receipt",
`GHL_SHOP_INTEREST_WORKFLOW_ID`, enrolled by ID from the website). This nurture is the
**second touch** a few days later, so makers and growers get ongoing, useful contact instead
of one ack and silence. It is the "engagement" half of the shop track.

Unlike the follow-welcome, this needs **no env var and no code change**. It triggers on the
`harvest-shop-interest` tag the website already applies to every shop EOI. Build it, publish
it, done.

- **Trigger:** Contact Tag added is `harvest-shop-interest`.
- **Re-entry:** OFF. **Allow multiple opportunities:** OFF (one nurture per contact).
- **Steps:**
  1. Wait 4 days (gives the receipt room; feels like a person following up, not a machine).
  2. If/Else by offer tag to swap one paragraph (see branch lines below). Order the branches
     `shop-produce`, `shop-maker`, `shop-food`, `shop-consignment`, then a catch-all for
     `shop-follow-up` / anything else.
  3. Send email (base copy below, with the matched branch paragraph).
  4. Add tag `shop-nurture-sent`.
- **Alternative (simpler):** instead of a separate workflow, add steps 1-4 onto the end of the
  existing receipt workflow. One workflow to manage, same result. Use whichever you prefer;
  the separate workflow keeps the receipt clean, which is why it is the default here.

**Email**

Subject: A bit more on the shop shelf
Preview: What happens next, and what we would love from you.

Hi {{contact.first_name}},

Thanks again for putting your hand up for the shop. Here is a bit more on where it is at.

The shop starts small and slow: a shared shelf at The Harvest for what Witta and the hinterland already grow and make, with honest signage about who made it and what they were paid. We open it progressively, as products and the people to run it are ready, rather than all at once.

[BRANCH PARAGRAPH]

When we are closer, we will be in touch to talk through the detail: timing, volumes, pricing, and how the shelf works for your kind of thing. Nothing needed from you now.

See you at the shop,
The Harvest

**Branch paragraphs (swap one in at the [BRANCH PARAGRAPH] line):**

- `shop-produce`: Because you grow produce, the first questions will be simple ones: what is in season for you, roughly how much, and how often you could drop it in. Small and regular beats big and rare.
- `shop-maker`: Because you make things by hand, we will want to see a sample or two and talk about how many you can comfortably make. The shelf suits small runs, not mass production.
- `shop-food`: Because you make food, preserves, or drinks, there are a few food-safety basics we will sort together. Nothing scary, just the right labelling and handling so it is all above board.
- `shop-consignment`: Because you are thinking consignment, we will keep it straightforward: you keep ownership until it sells, we agree a simple split, and the signage stays honest about both.
- `shop-follow-up` (catch-all): Because you want to help shape the shop rather than sell something yet, even better. We will fold you into the co-design conversations with the makers and the Wednesday crew as they happen.

---

## 7. The 20 June RSVP calendar → tag workflows

Three GHL booking calendars drive the 20 June members' day and the ongoing shop chat. A calendar
does not reliably tag the contact from its own settings, so each calendar needs a one-step
workflow: trigger *Customer Booked Appointment*, filter *In Calendar is X*, action *Add Contact
Tag*. The three booking tags already exist in the location tag library (created 2026-05-30).

**Prerequisite:** build the 3 calendars first (Calendars → Create calendar), then the workflow
behind each.

| # | Calendar | Type | Cap | When | Tags the workflow adds | Re-entry |
| --- | --- | --- | --- | --- | --- | --- |
| 7a | RSVP - 20 June maker session | Class/Event | 18 (B1) | Sat 20 Jun 10am-2pm | `witta-gathering-2026-06-20` + `rsvp-maker-morning` | OFF |
| 7b | RSVP - 20 June afternoon + pizza | Class/Event | 40 (B2) | Sat 20 Jun from 2pm | `witta-gathering-2026-06-20` + `rsvp-pizza-dinner` | OFF |
| 7c | Book a chat about the shop | Round robin | — | ongoing | `harvest-shop-interest` + `shop-call-booked` | ON |

Notes:

- `rsvp-pizza-dinner` count is the pizza dough headcount.
- `witta-gathering-2026-06-20` is the event tag; it feeds the The Harvest Events smart list (empty
  until the first booking) and would fire an event-RSVP workflow if one is built later.
- 7c reuses `harvest-shop-interest` so a booked shop chat flows into the Shop pipeline and the shop
  nurture; `shop-call-booked` distinguishes a booked call from a form EOI.
- Build 7a, then clone it twice and swap the calendar filter and the two tags. No email step: the
  calendar sends its own booking confirmation.
- Do NOT auto-apply `harvest-newsletter` or `harvest-member` on an RSVP. An event yes is not a
  subscribe; invite event guests to follow in the post-event recap, by choice.

---

## One-time cleanup: Harvest - Member Reconfirm

Not a form workflow. A one-time campaign to clean up the 15 contacts tagged `harvest-member`
who never chose membership (they came through the old footer). Decision on 2026-05-27: do
not auto-downgrade them. Ask them, and let the answer sort the list.

The 15 are listed in `thoughts/shared/ghl-member-segmentation-2026-05-27.md` (gitignored, PII).

### Target segment

The legacy cohort is the **15 contacts tagged `member-migration-review-2026-05-15`** (verified
live 2026-05-30, count 15). Note: the earlier definition here, "`harvest-member` AND NOT
`interest-membership`", is now **empty** — the 2026-05-15 migration added `interest-membership`
to all 57 members, so that pair runs 1:1. Use the `member-migration-review-2026-05-15` tag as the
segment, exclude any test contacts, and add `member-reconfirm-pending` to enrol them. That tag
add is the send trigger (Workflow C), so build A, B, and C and publish them first.

### Mechanism (set up in GHL)

1. Create two Trigger Links in GHL (Marketing > Trigger Links): one for "yes, member", one
   for "just the updates". Put both in the email as buttons.
2. Workflow trigger A, "member reconfirm yes" link clicked: add `interest-membership`, add
   `member-confirmed`, remove `member-reconfirm-pending`. They are now a genuine member.
3. Workflow trigger B, "follow only" link clicked: remove `harvest-member`, remove
   `member-reconfirm-pending`. They stay on `harvest-newsletter` as a follower.
4. Workflow trigger C, tag `member-reconfirm-pending` added: send the email, then wait 14
   days, then if the contact still has `member-reconfirm-pending` (no click), remove
   `harvest-member` and remove `member-reconfirm-pending`. This treats no answer as "just the
   updates", which is the honest default since they never opted into membership.

Decision to confirm with Ben before building: should no-answer after 14 days downgrade to
follower (recommended, keeps the list honest) or stay a member (keeps the list as is).

### Email

Subject: Quick check: member, or just keeping in touch?
Preview: Either answer is a good one.

Hi {{contact.first_name}},

When you signed up through the website we added you to The Harvest member list. We are
tidying that list up, and we want it to reflect what you actually want.

Membership here is free. It just means you want to be a named, hands-on part of what we are
building in Witta: the garden, the events, and the art space. Showing up, shaping things,
getting the member updates.

If that is you, brilliant. If you would rather just hear from us now and then without the
member bits, that is just as good. Pick whichever fits.

[ Yes, count me as a member ]   [ Just keep me in the loop ]

Either way you stay on our updates. There is no wrong answer.

Thanks,
The Harvest

---

## After building each workflow

1. Copy the workflow ID from the GHL builder URL or the workflow list.
2. Paste it into the matching env var in local `.env`.
3. Add the same value in Vercel so production fires it.
4. Run `npm run verify:forms:ghl` to confirm the form triggers the workflow end to end.
5. Update the wiring tables in this file and the workflow list in
   `harvest-ghl-tag-and-automation-map.md`.
