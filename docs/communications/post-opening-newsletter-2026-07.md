# Post-opening member note: "A few weeks in" (July 2026)

Send runbook for Harvest Note 04. The template is drafted by
`scripts/draft-post-opening-newsletter-ghl.ts`. A human sends it through the GHL
campaign UI. The script creates or updates a template only. It never chooses the
audience, sends, or schedules.

## Review artifacts

- Full 197-contact sense-check, grouped into clear, review, and exclude:
  `docs/communications/harvest-member-audience-sense-check-2026-07-10.md`
- Masked CSV with source, date added, Mighty status, full tags, and GHL contact ID:
  `research/data/harvest-member-audience-sense-check-2026-07-10.csv`
- Exact authored HTML for GHL:
  `docs/communications/harvest-note-04-member-pulse.html`
- Rebuild the live audience files with:
  `npm run report:member-audience:ghl -- --write`

## GHL template

- Template: `Harvest Note 04 - A few weeks in - member pulse`
- Template ID: `6a5046464ea233224da7913e`
- Created: 2026-07-10
- API list check: correct name and HTML template type
- Design source: canonical roots wordmark plus the real seed-house-front site photo
- Link hierarchy: tracked pulse button first, tracked Mighty members-page text link second
- Local render check: desktop `900px` and mobile `390px`, with no clipping or overlap
- GHL template update: successful on 2026-07-10; hosted mobile preview matches the
  local design, with only GHL's Outlook link-colour guards injected
- Campaign, recipient selection, test-send, schedule, and send: not created

## Audience

GHL smart list:

- tag is `tier:member`
- AND tag is `interest:membership`
- AND email does NOT contain `@example.com`
- AND email does NOT contain `@act.place`
- AND source is not `formsweep-test`
- AND source is not `phase3-question-verify`
- AND source is not `xero`

Verified 2026-07-10:

- `tier:member`: 197
- `interest:membership`: 197
- exact same contact set: yes
- email DND: 0
- obvious staff/test records: 6
- clear campaign audience: 189
- source-overwrite records for Ben to review: 2, Phil Thamm and Serge
- expected campaign audience if both review records are confirmed: 191
- every included contact also carries `project:act-hv` and
  `comms:harvest-newsletter`

Membership provenance is mixed but accounted for: 119 current records came through
the member signup path, 48 through the Mighty member sweep, 17 through the curated
Harvest member list, and the remainder through member questions or older Harvest
records whose current source was later updated. Two definite example/test records,
two ACT-address records, Nic's xero-source record, and the phase-three question test
stay out of the campaign.

Never use `All`, bare `newsletter`, `role:supplier`, `interest:markets`, or the
newsletter audience for this send. This is a members-only Harvest Note.

Counts drift. Re-run the audit on send day (step 1 below) and use the fresh number.

## Steps

1. **Send day, re-verify the audience.** Run `npm run audit:contacts:ghl` and
   confirm the two membership tag counts still match, the campaign count is 189 or
   191 depending on the Phil/Serge decision, and email DND is still zero.
2. **Review the reply desk.** Check the GHL Harvest Inbox and Gmail before the
   broadcast. Asha Hay, Mari Lloyd, Serge, Jo Pike, Jan Maguire, and the early member
   comments still need a direct reply or a deliberate owner.
3. **Create or update the template.** Dry-run first with
   `npx tsx scripts/draft-post-opening-newsletter-ghl.ts`. Then use `--apply` to
   create it, or `--apply --update-template <id>` to update the existing GHL draft.
4. **A human sends through GHL.** Marketing > Emails > Campaigns > create a campaign
   from `Harvest Note 04 - A few weeks in - member pulse` > choose the exact smart
   list above > test-send to Ben and Nic > open it on a phone > click both links >
   schedule or send.

The current sending domain is still `hi@act.place`. Treat that as a visible open
choice before the test-send, not as a hidden last-minute change.

## Pre-send checklist

- [ ] Audience audit re-run on send day; paired tag counts and 0 DND confirmed
- [ ] Campaign recipient count is 189 or 191 and read out loud
- [ ] Recipient filter is the named member smart list, never `All`
- [ ] Campaign subject and preview text match the reviewed copy below
- [ ] Facts gate: no attendance claims or headcounts anywhere in the email
- [ ] Facts gate: no opening hours, no fixed weekdays, no event dates
- [ ] Facts gate: no prices, no paid-tier mention, no shop stock or consignment detail
- [ ] The pulse opens and reaches its final optional name/email step
- [ ] Links resolve: https://www.theharvestwitta.com.au/pulse and the Mighty members page
- [ ] Unsubscribe footer present in the test-send
- [ ] Test-send received and read (desktop and phone) before scheduling
- [ ] No tags are added or removed by the campaign

## Body text (for review)

Subject: **A few weeks in at The Harvest**

Preheader: The gate is open. Tell us what should happen next.

> The gate opened on Saturday 20 June.
>
> The first members and makers day gave us a real starting point.
>
> Since then, the garden has kept moving through regular work days. Conversations
> with local makers and growers are shaping the first shop shelves. The art space
> is still finding its first useful shape.
>
> That is the point. The Harvest is open, but it is not arriving finished.
>
> **Before we fill the next month with guesses**
>
> What would you actually use? When would you come? What could you share? What gets
> in the way?
>
> The Harvest community pulse takes about three minutes. Add your name and email if
> you want us to follow up, or leave both blank to answer anonymously.
>
> Your answers will shape the next work days, shared meals, shop shelf
> tests, and first making sessions.
>
> **Keep close**
>
> Practical dates, RSVP links and questions land on the members page first. It is
> free to join.
>
> You can also reply to this email. We read everything, even when it takes a few
> days to come back.
>
> Grow. Make. Gather.

Primary button: `Take the 3-minute pulse` ->
`https://www.theharvestwitta.com.au/pulse?utm_source=email&utm_medium=member-note&utm_campaign=harvest-note-04`

Secondary text link: `Open the Harvest members page` -> the canonical Mighty share
link from `client/src/lib/links.ts`, with the same campaign attribution.
