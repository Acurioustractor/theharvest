# Welcome email + GHL workflow setup

Runbook for wiring the Harvest member welcome workflow in GHL. Pairs with the website's `/membership` form and the footer "Member list now open" signup.

Last updated: 2026-05-13.

## What the website sends

The newsletter-subscribe edge function (`supabase/functions/newsletter-subscribe/index.ts`) upserts contacts to GHL via `POST /contacts/upsert` with these fields:

- `firstName`, `lastName` (split from a single `name` field)
- `email`, `phone` (optional)
- `tags` (computed from interests + member flag, see below)
- `source` (tracks which form the signup came from)

## Sources by form

| Source value | Posted from |
| --- | --- |
| `Harvest member list` | `/membership` signup (Membership.tsx) |
| `Membership page question form` | `/membership` question box (separate form, same page) |
| `footer-member-list` | Footer newsletter form in `PublicLayout` |

## Tags applied

Every signup gets:
- `newsletter`
- `harvest-newsletter`
- `harvest-website`

Plus interest tags (one per selected interest):
- `interest-events`, `interest-workshops`, `interest-markets`, `interest-venue`, `interest-garden`, `interest-food`, `interest-community`, `interest-volunteer`, `interest-membership`, `interest-sustainability`

If `member: true` is sent (Membership form, footer form) OR interests includes `membership`:
- `harvest-member`
- `interest-membership`

## GHL workflow setup

### Workflow 1: Member welcome

**Trigger:** Contact tag added: `harvest-member`

**Wait:** 0 minutes (send immediately)

**Action:** Send email "Welcome to the Harvest member list" (template below)

**Why a separate workflow:** newsletter-only signups should NOT get the member welcome. The `harvest-member` tag is the discriminator.

### Workflow 2: Newsletter welcome (no membership)

**Trigger:** Contact tag added: `newsletter`

**Condition:** Contact does NOT have tag `harvest-member`

**Wait:** 0 minutes

**Action:** Send email "Welcome to the Harvest newsletter" (lighter version, no member-list promises)

### Workflow 3: Monthly Harvest Note (members)

**Trigger:** Monthly schedule (1st of month, 8am Brisbane)

**Condition:** Contact has tag `harvest-member`

**Action:** Send latest "Harvest Note" template (manually drafted each month)

This is the "one monthly letter from Ben or Nic" promise on `/membership`. Don't automate the content - draft it each month and queue the workflow to send.

## Email template: Member welcome

Subject: **Your name is on the list**

```
Hi {{first_name}},

You're on the Harvest member list. Thanks for that.

Here's what to expect:

1. The Harvest Note. A monthly letter from Ben or Nic. What happened in
   the garden, what's coming, one honest question, one small ask.
2. First call on community days, work days, workshops and meals before
   they go public. The next community day around the end of June lands
   here first.
3. Specific invitations to help. Hands needed for a path. Someone who
   knows old timber. A driver for a load of crates. Real asks, not
   "volunteer opportunities".

The legal structure (co-op, formal membership) comes later. This list is
the front gate while the place is being made.

If you have a question or want to introduce yourself, just reply to this
email. It comes to us directly.

Ben + Nic
The Harvest, Witta. Jinibara Country.
```

**Voice rules** (per project memory):
- No em-dashes. Use hyphens with spaces, or a period.
- No "vibrant", "tapestry", "testament", "underscore", "pivotal", "crucial".
- Plain, direct, first-person from Ben and Nic.

## Email template: Newsletter welcome (no membership)

Subject: **Thanks for following along**

```
Hi {{first_name}},

You'll get the Harvest newsletter when there's something worth sending.
That usually means one of:

- The garden has done something notable.
- A community day or event is coming up.
- A new work has started or finished.
- We have a question worth asking the network.

If you want more than that (early invites, first calls, the monthly
Harvest Note) the member list is here:

  https://www.theharvestwitta.com.au/membership

Otherwise we'll see you when something good happens.

Ben + Nic
The Harvest, Witta. Jinibara Country.
```

## Verification checklist (after workflows are saved in GHL)

- [ ] Submit a test contact via `/membership` form (use a real-but-disposable email)
- [ ] Confirm GHL contact appears with tags: `newsletter`, `harvest-newsletter`, `harvest-website`, `harvest-member`, `interest-membership`
- [ ] Confirm Workflow 1 fires and the member welcome email lands
- [ ] Submit a second test via the footer newsletter (no interests)
- [ ] Confirm Workflow 1 fires (footer also sends `member: true`)
- [ ] Delete the test contacts via GHL UI after verifying

## Known gaps

- **No double opt-in.** A signup is treated as confirmed consent. If you want a confirmation step, add it as a third workflow that sends a confirmation link before adding the contact to the member list.
- **No unsubscribe handling in the welcome workflow.** GHL's email footer covers this automatically; nothing on our end to wire.
- **No mid-stream tag changes.** If someone unticks "membership" via a re-signup, the `harvest-member` tag stays. GHL doesn't auto-remove tags on tag removal triggers unless wired explicitly.
