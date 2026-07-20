# Membership and contact email setup

> **Current canon check (2026-07-06).** Parts of this doc predate the June tag
> alignment. Live canon: newsletter audience = `comms:harvest-newsletter` (154),
> members = `tier:member` (135), followers = `tier:connected`; colon-namespaced
> tags are canonical and hyphen twins are being retired. Before acting on tag
> names or audience filters here, cross-check
> `docs/communications/harvest-system-review-2026-07-06.md`.

Runbook for the active Harvest GHL email flows.

Last updated: 2026-05-14.

## Current decision

Use GHL for the emails.

Use the website only for the current intake surfaces:

- `/membership` member signup
- `/membership` question form
- Footer member signup
- `/contact` general message

Do not use the Garden Launch RSVP form yet. The Garden Launch invite and headcount will come through member emails first.

## How the website starts workflows

The website already enrols contacts into specific GHL workflows by workflow ID.

That means the safer setup is:

```text
website form -> GHL contact upsert -> GHL tags and note -> subscribe contact to workflow by ID
```

Do not also create a broad "tag added" trigger for the same workflow unless you add clear exclusions. Otherwise one signup can get two emails.

Important edge case: the member question form currently adds `harvest-member` as a tag. If the member welcome workflow is triggered only by "tag added: harvest-member", people asking a question can receive the member welcome too. Prefer the workflow ID method below.

## Active workflow IDs

Set these in local `.env` and Vercel when the matching workflow exists in GHL:

| Env var | Used by | Job |
|---|---|---|
| `GHL_MEMBER_WELCOME_WORKFLOW_ID` | `/membership` signup + footer member signup | Sends the member welcome email |
| `GHL_MEMBER_QUESTION_WORKFLOW_ID` | `/membership` question form | Sends question receipt and/or internal task |
| `GHL_CONTACT_FORM_WORKFLOW_ID` | `/contact` and fallback paths | Sends contact receipt and/or internal task |
| `GHL_SHOP_INTEREST_WORKFLOW_ID` | `/membership#shop-interest` and `/works/the-shop` | Sends shop-specific receipt and follow-up task |
| `GHL_NEWSLETTER_WORKFLOW_ID` | newsletter-only fallback | Sends lighter newsletter welcome |

Leave `GHL_GATHERING_RSVP_WORKFLOW_ID` unset for this phase unless the public RSVP form is deliberately reopened.

## Website source map

| Surface | Endpoint | Source value | Main tags |
|---|---|---|---|
| `/membership` member signup | `newsletter.subscribe` | `Harvest | Member Signup` | `harvest-member`, `harvest-newsletter`, `newsletter`, `interest-membership`, selected interest tags, `harvest-website` |
| Footer member signup | `newsletter.subscribe` | `Harvest | Footer Member Signup` | `harvest-member`, `harvest-newsletter`, `newsletter`, `interest-membership`, `interest-community`, `harvest-website` |
| `/membership` question form | `members.question` | `Harvest | Member Question` | `member-question`, `harvest-member`, `harvest-newsletter`, `interest-membership`, `harvest-website` |
| `/contact` general message | `contact-form` edge function | `Harvest | Contact` | `contact-form`, `harvest-website`, optional `newsletter`, optional `harvest-newsletter` |

## GHL build order

1. Create the email templates in GHL first.
2. Create one workflow per job.
3. Keep each workflow small: one receipt email, one internal notification/task if needed.
4. Publish the workflow.
5. Copy the workflow ID into the matching env var.
6. Submit one test form locally.
7. Confirm contact tags, note, and email delivery.
8. Delete or tag the test contact after checking.

## Workflow 1: member welcome

**Workflow ID env var:** `GHL_MEMBER_WELCOME_WORKFLOW_ID`

**Started by:** website API subscription after `newsletter.subscribe`.

**Audience:** contacts joining through `/membership` or the footer member form.

**Actions:**

1. Send email: `Welcome to the Harvest member list`
2. Optional internal notification to Ben/Nic: new member joined

**Do not add:** a broad tag trigger on `harvest-member` unless you exclude `member-question`.

### Email: member welcome

Subject: `Your name is on the list`

Preview: `A monthly note, first calls, and practical asks from The Harvest.`

```text
Hi {{first_name}},

You're on the Harvest member list.

For now, that means three things.

1. The Harvest Note. A monthly letter from Ben or Nic. What changed in the garden, what is coming, one honest question, one small ask.

2. First call on community days, work days, workshops and meals before they go public.

3. Specific invitations to help. Hands for a path. Someone who knows old timber. A driver for a load of crates. Real asks, not vague volunteering.

The legal structure comes later. This list is the front gate while the place is being made.

If you have a question or want to introduce yourself, reply to this email. It comes to us directly.

Ben + Nic
The Harvest, Witta. Jinibara Country.
```

## Workflow 2: member question receipt

**Workflow ID env var:** `GHL_MEMBER_QUESTION_WORKFLOW_ID`

**Started by:** website API subscription after `members.question`.

**Audience:** people who ask a question from `/membership`.

**Actions:**

1. Send email: `We got your Harvest question`
2. Create task or internal notification for Ben/Nic to reply

### Email: member question receipt

Subject: `We got your Harvest question`

Preview: `Ben or Nic will reply from the Harvest inbox.`

```text
Hi {{first_name}},

We got your question.

Ben or Nic will read it and reply from the Harvest inbox.

If you forgot something, just reply to this email and add it there.

The Harvest, Witta
Jinibara Country
```

## Workflow 3: contact form receipt

**Workflow ID env var:** `GHL_CONTACT_FORM_WORKFLOW_ID`

**Started by:** Supabase `contact-form` edge function after the contact is upserted and the form note is added.

**Audience:** people who send a general message from `/contact`.

**Actions:**

1. Send email: `We got your message`
2. Create task or internal notification for Ben/Nic to reply

### Email: contact receipt

Subject: `We got your message`

Preview: `Thanks for writing to The Harvest.`

```text
Hi {{first_name}},

We got your message.

If it needs a reply, Ben or Nic will come back to you from this inbox.

If you were asking about membership, the member list is here:
https://www.theharvestwitta.com.au/membership

If you were asking about produce, made goods, or the shop shelf, use the shop form on the membership page.

The Harvest, Witta
Jinibara Country
```

## Workflow 4: shop interest receipt

**Workflow ID env var:** `GHL_SHOP_INTEREST_WORKFLOW_ID`

**Started by:** website API subscription after `shopInterest.submit`.

**Audience:** people offering produce, made goods, food, consignment ideas, or help shaping the shop shelf.

**Actions:**

1. Send email: `We got your shop note`
2. Create task or internal notification for Ben/Nic to review the offer

**Setup note:** duplicate `Contact Form to Universal Inquiry`, rename it `Harvest - Shop Interest Receipt`, replace the customer email with the copy below, publish it, then set `GHL_SHOP_INTEREST_WORKFLOW_ID` locally and in deployment. Until this is set, the shop form falls back to `GHL_CONTACT_FORM_WORKFLOW_ID`.

### Email: shop interest receipt

Subject: `We got your shop note`

Preview: `Thanks for putting something on the Harvest shelf.`

```text
Hi {{contact.first_name}},

We got your shop note.

Thanks for putting something forward for the Harvest shelf.

Ben or Nic will read it and come back from this inbox if it fits the next round of conversations.

For now, we are looking for produce, food, made goods, consignment ideas, and people who want to help shape the first version of the shop.

The Harvest, Witta
Jinibara Country
```

## Workflow 5: newsletter-only welcome

**Workflow ID env var:** `GHL_NEWSLETTER_WORKFLOW_ID`

Use this only for newsletter-only contacts that are not joining as members.

Subject: `Thanks for following along`

```text
Hi {{first_name}},

You'll get a Harvest note when there is something worth sending.

That usually means the garden has moved, a gathering is coming, a work has started, or we have a question worth asking the network.

If you want the closer list, join here:
https://www.theharvestwitta.com.au/membership

Ben + Nic
The Harvest, Witta. Jinibara Country.
```

## Garden Launch for this phase

The Garden Launch RSVP form is not active on the website.

Current path:

```text
member list -> GHL member email -> people reply -> Ben/Nic count seats manually
```

When the invite is ready, send a manual GHL campaign to `harvest-member`.

Use this CTA:

```text
Reply to this email with your name and how many seats you need.
```

Do not point the campaign to `/garden-launch` as an RSVP form unless the public form is deliberately reopened.

## Verification checklist

- [x] Confirm `GHL_MEMBER_WELCOME_WORKFLOW_ID` is set locally.
- [x] Confirm `GHL_MEMBER_QUESTION_WORKFLOW_ID` is set locally.
- [x] Confirm `GHL_CONTACT_FORM_WORKFLOW_ID` is set locally and in Supabase edge function secrets.
- [x] Confirm `GHL_SHOP_INTEREST_WORKFLOW_ID` is set locally.
- [x] Submit one test through `/membership`.
- [x] Confirm GHL contact has `harvest-member`, `harvest-newsletter`, `newsletter`, `interest-membership`, and `harvest-website`.
- [x] Submit one test through `/membership` question form.
- [x] Confirm GHL contact has `member-question` and the question appears as a note.
- [x] Submit one test through `/contact`.
- [x] Confirm GHL contact has `contact-form` and the message appears as a note.
- [x] Confirm `/contact` returns `workflowTriggered: true`.
- [ ] Open `/garden-launch` and confirm there is no RSVP form.

## Verification log

2026-05-14:

- Member welcome workflow ID is `19cc358a-05f6-4d99-8e6b-91b31c63e8c4`.
- Member question workflow ID is `62aa2b50-c4f3-4564-84c3-3aa81c0c36f8`. Test contact had `member-question`, membership tags, and a saved question note.
- Contact form workflow ID is `f0c1f3db-8809-4283-ba91-907626ac0bb7`. Supabase secret was added, `contact-form` was redeployed, and the test returned `workflowTriggered: true`.
- Contact workflow now includes a customer receipt email action: `Contact form receipt`.
- Shop interest uses the contact workflow fallback for this phase. Test contact had `harvest-shop-interest`, `shop-produce`, `shop-follow-up`, and workflow-added `engagement:lead`.
- Shop interest workflow ID is `ff4ff43e-0174-415d-828e-3610f5386de5`. The workflow is published in GHL as `Harvest - Shop Interest Receipt`.
- Dedicated shop form test used `benjamin+harvest-shop-dedicated-ff4ff43@act.place`. GHL contact had `harvest-shop-interest`, `shop-produce`, `shop-follow-up`, and a saved shop EOI note.
- Fixed legacy edge-function workflow enrolment from `POST /workflows/:id/subscribe` to `POST /contacts/:contactId/workflow/:workflowId`.
- Newsletter-only fallback is not used by the current public footer or membership page. Both submit as `member: true`.

## Known gaps

- No double opt-in yet. A signup is treated as consent to receive Harvest emails.
- Member question contacts currently receive `harvest-member`. Keep workflow triggers workflow-ID based to avoid accidental member welcome sends.
- The old `newsletter-subscribe` edge function still exists. Keep it as legacy unless a current page uses it again.
