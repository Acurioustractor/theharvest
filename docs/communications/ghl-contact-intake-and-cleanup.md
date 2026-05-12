# GHL Contact Intake And Cleanup

## Job

Keep HighLevel as the contact desk for The Harvest.

Every website path that creates or updates a GHL contact should send:

1. name
2. email or phone
3. source
4. tags
5. note, when the form carries context

## Canonical Audience Tags

Use these as the real lists:

- `harvest-member` - weekly member update, invitations, first-access opportunities
- `harvest-newsletter` - broader Harvest updates
- `harvest-event-attendee` - people who have RSVP'd or attended
- `harvest-volunteer` - people who have offered help
- `harvest-business` - local business or stall interest

Keep `newsletter` only for backward compatibility with older contacts and older GHL sends.

## Current Website Intake

| Path | Endpoint | Required identity | Main tags |
|---|---|---|---|
| `/membership` member signup | `newsletter.subscribe` | name + email | `harvest-member`, `harvest-newsletter`, `newsletter`, `interest-membership`, `harvest-website` |
| `/membership` question form | `members.question` | name + email | `harvest-member`, `harvest-newsletter`, `member-question`, `interest-membership`, `harvest-website` |
| `/garden-launch` RSVP | `eoi.submit` | name + email or phone | `witta-gathering-2026-06-20`, `harvest-event-attendee`, `harvest-website` |
| Site footer member list | `newsletter.subscribe` or `newsletter-subscribe` | name + email | `harvest-member`, `harvest-newsletter`, `newsletter`, `interest-membership`, `interest-community`, `harvest-website` |
| Contact form | `contact-form` | name + email | `contact-form`, `harvest-website`, plus `harvest-newsletter` and `newsletter` when opted in |
| Event submission | `events.submit` | name + email | `event-submission`, `harvest-website` |
| Business registration | `businesses.submit` | submitter name + email | `business-registration`, `harvest-website` |
| Get involved | `community-submit` | name + email | submission type tag plus `harvest-website` |
| Visitor quiz email capture | `quiz.submit` | name + email | quiz tags, `quiz-completed`, `harvest-website` |
| Photo wall | `photoWall.submit` | first name + email | `photo-wall`, `harvest-gathering-photos`, `harvest-website` |

## Intake Rule

Do not create fresh email-only contacts from the website.

If a form asks for an email, it must ask for a name in the same moment. If a contact is phone-only, a name is still required.

## Tag Merge Rule

The safe GHL pattern is:

```text
upsert contact fields -> add tags separately -> add note -> trigger workflow
```

Do not send tags inside the upsert payload for old Supabase edge functions. Tags should be added through the contact tags endpoint so existing tags are merged, not replaced.

## Weekly Cleanup

Run a dry audit first:

```bash
npm run audit:contacts:ghl
```

This reports:

- Harvest contact count
- current tag counts
- contacts missing names
- duplicate email groups
- duplicate phone groups
- safe tag refresh plan
- safe name backfill plan
- missing-name review tag plan

To apply only the safe tag refreshes:

```bash
npm run refresh:contacts:ghl
```

This only adds missing canonical tags. It does not delete, merge, unsubscribe, or remove tags.

To prepare the list for manual cleanup:

```bash
npm run prepare:contacts:ghl
```

This can:

- add missing canonical tags
- backfill a name only when the same exact email already has a named duplicate contact
- tag contacts with no trustworthy name source as `harvest-needs-name-review`
- tag duplicate email or phone groups as `harvest-duplicate-review`

It still does not merge or delete contacts.

## Next Stage Lists

Build these as GHL smart lists or saved filters:

| List | Filter |
|---|---|
| Harvest members | tag is `harvest-member` |
| Harvest newsletter | tag is `harvest-newsletter` |
| June 20 RSVP | tag is `witta-gathering-2026-06-20` |
| Member questions | tag is `member-question` |
| Name cleanup queue | tag is `harvest-needs-name-review` |
| Duplicate cleanup queue | tag is `harvest-duplicate-review` |
| Photo wall contributors | tag is `photo-wall` or `harvest-gathering-photos` |
| Legacy March EOI | tag is `eoi-gathering-march-2026` |

## Duplicate Cleanup

Do not auto-merge contacts.

Duplicates need a review pass because one record can carry notes, workflow history, attribution, replies, or opt-out state that the other does not.

The cleanup decision should be:

1. pick the record with the best history as the keeper
2. copy useful notes/tags/phone/email onto the keeper
3. confirm subscription and DND status
4. merge or delete the duplicate inside HighLevel
5. rerun the audit

If unsure, tag the records for manual review instead of deleting anything.
