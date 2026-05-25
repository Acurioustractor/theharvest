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

| Path | Endpoint | Required identity | Main tags | Flow to build |
|---|---|---|---|---|
| `/membership` member signup | `newsletter.subscribe` | name + email | `harvest-member`, `harvest-newsletter`, `newsletter`, `interest-membership`, `harvest-website` | Member welcome + monthly Harvest Note |
| `/membership` question form | `members.question` | name + email | `harvest-member`, `harvest-newsletter`, `member-question`, `interest-membership`, `harvest-website` | Human reply + question receipt |
| Footer member list | `newsletter.subscribe` | name + email | `harvest-member`, `harvest-newsletter`, `newsletter`, `interest-membership`, `interest-community`, `harvest-website` | Same as membership signup |
| `/contact` | `contact-form` | name + email | `contact-form`, `harvest-website`, plus `harvest-newsletter` and `newsletter` when opted in | General enquiry receipt |
| `/membership#shop-interest`, `/works/the-shop` | `shopInterest.submit` | name + email | `harvest-shop-interest`, `harvest-website`, `shop-follow-up`, one shop offer tag | Shop EOI follow-up |
| `/garden-launch` | no active submit surface | none | none | Email-led invite only. Send to `harvest-member`; people reply and Ben/Nic count seats manually |
| `/whats-on`, `/enterprises` | `events.submit` | name + email | `event-submission`, `harvest-website` | Event submission acknowledgement |
| `/enterprises` business registration | `businesses.submit` | submitter name + email | `business-registration`, `harvest-website` | Business approval flow |
| `/venue-hire` | `communitySubmit` (`venue-enquiry`) | name + email | `venue-enquiry`, `harvest-website` | Venue enquiry receipt |
| `/get-involved` | `communitySubmit` | name + email | submission type tag + `harvest-website` | Type-specific intake receipts |
| `/visit` quiz | `quiz.submit` | name + email | quiz tags, `quiz-completed`, `harvest-website` | Persona nurture |
| `/pulse` | `pulse.submit` | optional name + email | `pulse-respondent`, `harvest-website`, dynamic `interest-*` tags | Pulse follow-up |
| `/photo-wall` | `photoWall.submit` | first name + email | `photo-wall`, `harvest-gathering-photos`, `harvest-website` | Portrait follow-up |
| `/witta` | `witta.submit` | name + optional email | none | DB review only, no GHL |
| `photo wall check-in` | `photoWall.addNote` | GHL contact ID + note | none | Internal helper, no workflow |
| `event feedback` | `feedback.submit` | none | none | Local feedback only |

## Daily Harvest Desk

Use HighLevel as the daily contact desk. Do not use Gmail as the source of truth for website form work.

Daily flow:

1. Open the `Universal Inquiry` pipeline.
2. Review stage `New Inquiry`.
3. Open each opportunity created since the last check.
4. Click through to the linked contact.
5. Read the contact `Notes` timeline. Form details live there.
6. Reply from GHL email/SMS or create a task for Ben/Nic.
7. Move the opportunity to the right stage:
   - `New Inquiry` - not reviewed yet
   - `Needs reply` - human reply needed
   - `Waiting on them` - replied, waiting for the person
   - `In motion` - useful lead, active follow-up
   - `Closed / recorded` - handled or not relevant

Use the opportunity as the work queue. Use the contact as the record.

Anything that needs a human look should create or update a `Universal Inquiry` opportunity card. Current code-driven inbox cards:

- member signup with a comment
- member question
- shop expression of interest
- contact form submission
- venue / community submission
- event submission
- business registration
- RSVP submission
- workshop booking
- photo wall response

The opportunity view is good for triage, but it does not show every form field. The submitted form payload is saved as a contact note. Example: shop interest stores offer type, location, readiness, and the person's shelf note in the contact notes timeline.

Turn on HighLevel notifications for new opportunities/tasks in the `Universal Inquiry` pipeline. That is the notification surface. The daily report below is the backup catch-all when GHL hides detail inside contact notes.

Run the daily desk report when you want one screen that catches both opportunity cards and member activity:

```bash
npm run desk:ghl
```

For another Brisbane date:

```bash
npm run desk:ghl -- --date 2026-05-15
```

This reports:

- opportunity cards created or updated that day
- member signups created or updated that day
- member comments saved as notes
- form notes attached to today's contacts

If a form contact exists but no opportunity card exists yet, backfill the action board:

```bash
npm run backfill:inbox:ghl -- --date 2026-05-15
```

Then apply it:

```bash
npm run backfill:inbox:ghl -- --date 2026-05-15 --apply
```

Backfill only creates cards for action tags and skips contacts that already have an open opportunity unless `--force` is passed.

## Daily Smart Lists

Create or keep these saved filters in HighLevel:

| List | Filter | Use |
|---|---|---|
| New Harvest inbox | pipeline is `Universal Inquiry`, stage is `New Inquiry` | Daily reply queue |
| Harvest inbox all | tag is `harvest-inbox` | Every contact that should have a board card |
| Shop interest | tag is `harvest-shop-interest` | People offering produce, made goods, food, consignment, or shop help |
| Member questions | tag is `member-question` | People who asked a direct question |
| Member comments | tag is `member-comments` | Member notes, ideas, offers, and encouragement that should be read |
| Harvest members | tag is `harvest-member` | Weekly member update, invitations, early opportunities |
| General contact forms | tag is `contact-form` | General messages from `/contact` |
| Venue enquiries | tag is `venue-enquiry` | Venue hire or site-use enquiries |
| Needs name cleanup | tag is `harvest-needs-name-review` | Manual cleanup queue |
| Duplicate cleanup | tag is `harvest-duplicate-review` | Manual merge queue |

## Label System

Use `Source` as the short card label on the opportunity board.

Use tags as the real filters/lists.

Future Harvest website submissions use this source naming pattern:

```text
Harvest | [Flow]
```

| Form / flow | Source label | Primary tag |
|---|---|---|
| Member signup | `Harvest | Member Signup` | `harvest-member` |
| Footer member signup | `Harvest | Footer Member Signup` | `harvest-member` |
| Member question | `Harvest | Member Question` | `member-question` |
| General contact form | `Harvest | Contact` | `contact-form` |
| Shop interest | `Harvest | Shop` | `harvest-shop-interest` |
| Venue / community submit | `Harvest | venue-enquiry`, or matching type | `venue-enquiry`, or matching type tag |
| Event submission | `Harvest | Event` | `event-submission` |
| Business registration | `Harvest | Business` | `business-registration` |
| Workshop booking | `Harvest | Workshop` | `workshop-booking` |
| Visitor quiz | `Harvest | Quiz` | `quiz-completed` |
| Photo wall | `Harvest | Photo Wall` | `photo-wall` |
| Pulse survey | `Harvest | Pulse` | `pulse-respondent` |
| June 20 RSVP, when reopened | `Harvest | RSVP 2026-06-20` | `witta-gathering-2026-06-20` |

Do not create separate pipelines for every form yet. Keep one Harvest inbox pipeline and use the source label plus tag filters. Separate pipelines only make sense once one lane has its own owner and weekly operating rhythm.

## Reply Rule

Every weekday, clear `New Inquiry` to zero.

For each new item, do one of three things:

1. Reply now from GHL.
2. Create a task with a due date and owner.
3. Close it with a clear note if no reply is needed.

Do not leave a reviewed contact in `New Inquiry`. That stage means unseen.

## Form Payload Rule

Every website form should leave two traces:

1. Tags for filtering and audience membership.
2. A contact note with the actual human context.

When a workflow creates an opportunity, the opportunity may only show name, email, phone, source, and tags. That is normal. Open the contact notes to see the submitted form details.

Legacy / frozen:

- `members.wall.submit` still exists in the backend, but the public wall form is currently frozen. Do not build a current email flow around it unless we reopen it.
- `newsletter-subscribe` is the older Supabase edge-function path. The public site footer now uses the same `newsletter.subscribe` route as `/membership`.
- `eoi.submit` and `GHL_GATHERING_RSVP_WORKFLOW_ID` still exist for a later RSVP path, but the Garden Launch page no longer renders a public RSVP form. Leave this dormant unless the RSVP form is deliberately reopened.
- `/get-involved` is a broad catch-all. Keep the types available, but split them into clearer lanes before building separate nurture flows.

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
| June 20 RSVP | dormant for now. Use only if the public RSVP form is reopened |
| Member questions | tag is `member-question` |
| Venue enquiries | tag is `venue-enquiry` |
| Pulse survey | tag is `pulse-respondent` |
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
