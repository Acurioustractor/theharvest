# Member audience review and next Harvest Note - 2026-07-08

Status: draft, not sent, not posted.

## Re-audit update - 2026-07-10

This supersedes the earlier audience counts in this file.

- GHL contacts scanned: 3,278.
- Harvest-scoped contacts: 355.
- `tier:member`: 197.
- `interest:membership`: 197, exactly the same contact set as `tier:member`.
- Every member carries `project:act-hv` and `comms:harvest-newsletter`.
- Email DND among members: 0.
- Obvious staff/test member records: 6.
- Clear members-only campaign audience: 189.
- Source-overwrite records for Ben to review: Phil Thamm and Serge.
- Expected campaign audience if both are confirmed: 191.
- Membership provenance: 119 current member signups, 48 Mighty member sweep
  records, 17 curated Harvest member-list records, 2 member-question records, and
  11 older or later-updated sources reviewed individually.
- Mighty: 91 member records. Dry-run shows one existing GHL contact needing the
  Mighty-active tag and three Mighty members missing from GHL. No sync was applied.
- Gmail re-check still finds no sent reply for Asha Hay, Mari Lloyd, Serge, or Jan
  Maguire. The early member-comment emails still do not have matching Gmail threads.
- The live `/pulse` page returns 200 and reaches its final optional name/email and
  submit step. No new production response was submitted in this pass.
- GHL template created: `Harvest Note 04 - A few weeks in - member pulse`, ID
  `6a5046464ea233224da7913e`. Hosted preview contains the current headline, pulse
  link, Mighty link, and canonical logo.
- Eleven aligned one-to-one Gmail drafts were created on 2026-07-10 for the open
  Harvest reply cards. Each matching GHL contact now has a `Gmail draft created
  2026-07-10, not sent` note with the Gmail message ID.
- No campaign was created, test-sent, scheduled, or sent.

Current send runbook and final copy:

- `docs/communications/post-opening-newsletter-2026-07.md`

Generated people view:

- `research/data/harvest-member-audience-review-2026-07-08.json`
- `research/data/harvest-member-audience-review-2026-07-08.csv`

The CSV is the quick view. It separates GHL members, Mighty members, Mighty-only people, and newsletter-only potential members. It uses masked emails; GHL remains the place to act on contact records.

## Re-audit update - later 2026-07-08

This section supersedes the earlier counts where live systems have moved since the first run.

- Current GHL audit scanned 3,272 contacts.
- Current Harvest-scoped contacts: 350.
- Current `tier:member`: 191.
- Current `comms:harvest-newsletter`: 210.
- Current `platform:mighty-active`: 86.
- Current `harvest-inbox`: 58.
- Current `member-comments`: 40.
- Current `role:supplier`: 38.
- Current shop tags: `shop-prospect` 28, `shop-follow-up` 5, `shop-stage-1` 4, `shop-produce` 2, `shop-consignment` 1, `shop-maker` 1.
- Current Mighty member count is still 88 through the paginated Mighty Admin API.
- Mighty sync dry-run still shows one real-looking Mighty member missing from GHL: Amy C.
- No GHL writes were applied.
- No Gmail replies, GHL campaigns, Mighty posts, or Gmail drafts were created.

## Earlier verified snapshot

- GHL contacts scanned: 3,259.
- Harvest-scoped contacts found by the live audit: 337.
- GHL members: 189 with `tier:member`.
- Sendable GHL members: 186 after excluding staff/test addresses.
- Newsletter audience: 209 with `comms:harvest-newsletter` or the one legacy `harvest-newsletter`.
- Sendable newsletter audience: 204.
- Newsletter-only potential members: 18.
- Mighty members: 88 through the paginated Mighty Admin API.
- External Mighty members: 87 after excluding one staff/test record.
- Mighty members already in GHL: 86.
- Mighty members missing from GHL: 1.
- GHL members not tagged `platform:mighty-active`: 100.
- Harvest inbox contacts needing review: 48.
- Live `/pulse` page returns 200 at `https://www.theharvestwitta.com.au/pulse`.

Later re-audit also verified:

- `npm run audit:contacts:ghl` now finds 350 Harvest contacts and 191 contacts tagged `tier:member`.
- `npm run report:mighty` still finds 88 Mighty members and 7 spaces.
- Mighty has one `Start Here` space in the API response, so the duplicate `Start Here` blocker is not present in the latest report.
- `npm run report:launch-gates:ghl` shows the shop-chat calendar exists and is assigned to Suzie and Joey.
- `npm run report:launch-gates:ghl` shows Suzie and Joey GHL users exist.
- `npm run report:launch-gates:ghl` shows `shop-call-booked` exists as a tag but has 0 contacts.
- `npm run report:launch-gates:ghl` shows the `Harvest - Shop Chat Booked (tag)` workflow is missing.
- Gmail was checked before any send using Harvest searches across `hi@act.place` and `benjamin@act.place`, plus exact searches for the open names below.
- GHL notes were fetched directly for the open Harvest form contacts below.

## Fixed while reviewing

`npm run report:mighty` was only reading the first Mighty page, so it showed 25 members. The script now paginates and reports 88 members.

## Not verified

- `/pulse` submission has not been live-tested in this pass. The page loads, but do one test submission before putting the link in a real send.
- No GHL campaign has been built, test-sent, scheduled, or sent.
- No Mighty post has been published.
- The one Mighty member missing from GHL needs a human check before any write-back.
- The missing shop-chat booked workflow has not been built in GHL.
- `shop-call-booked` is still zero.
- The generated CSV and JSON still reflect the earlier same-day audience snapshot. Run the export again before a final broadcast send.

## Current blockers

| Blocker | Current status | Next action |
| --- | --- | --- |
| Duplicate `Start Here` spaces | Cleared in latest Mighty API report. Only one `Start Here` space returned. | No action unless the Mighty UI shows an archived/hidden duplicate that the API does not return. |
| Shop-chat booked workflow | Still missing. | Build and publish `Harvest - Shop Chat Booked (tag)`: trigger on customer booked appointment for `Book a chat about the shop`, then add `project:act-hv`, `interest:markets`, and `shop-call-booked`. |
| `shop-call-booked` | Tag exists but has 0 contacts. | After the workflow is published, book one real or test shop chat and rerun `npm run report:launch-gates:ghl`. |
| Suzie and Joey GHL access | Verified present. | Keep the shop calendar assigned to them. The latest report already shows this is done. |
| Maker/pizza calendar workflows | Maker session workflow missing. Pizza workflow exists but is draft. | Lower priority than shop now, because the 20 June event has passed, but they still show as launch-gate blockers in the report. |

## Gmail and GHL reply audit

Gmail was checked before any broadcast. The broad Harvest Gmail search found 35 Harvest-related messages from `hi@act.place` since 1 June and more than 50 matching Benjamin-side Harvest messages. Exact checks then separated answered threads from open replies.

### Needs direct reply before broadcast

| Person | Source | What they asked or offered | Gmail status | Reply lane |
| --- | --- | --- | --- | --- |
| Asha Hay | Contact form, 3 July | Live sound technician, sound gear hire, event support, wants to look at the space. | No matching sent reply found. | Events and art space support. |
| Mari Lloyd | Shop EOI, 3 July | Ceramic artist, small ceramics for the shop, consignment. | No matching sent reply found. | Shop makers. |
| Serge | Shop EOI, 16 June | Made-goods shop interest. Detail is thin in GHL note. | No matching sent reply found. | Shop makers, ask for details. |
| Jo Pike | Member signup, 3 July | Local, interested in dinner gatherings, workshops, events, and making stuff. | No matching sent reply found. | Member and events/workshops. |
| Jan Maguire, Maleny Garden Club | Gmail, 15 June | Wants a meeting about the Spring Fair on Saturday 3 October 2026. | No matching sent reply found. | Partner/event follow-up. |
| Hazel Newman | Member comment, 15 June | Neighbour. | No matching Gmail thread found. | Light member catch-up. |
| Eugenie Tamplon | Member comment, 15 June | Encouragement, playground, music, art, people gathering. | No matching Gmail thread found. | Member catch-up, kids/art/music. |
| Eugenie Schwartz | Member comment, 15 June | Homeschool parent, kids mix, garden volunteering, Kids Club, workshop or weekly meet-up. | No matching Gmail thread found. | Kids, garden, workshop. |
| Lesley Gillett | Member comment, 15 June | Signup had no visible note in the desk sample. | No matching Gmail thread found. | Light member catch-up. |
| Catherine Mobbs | Member comment, 15 June | Signup had no visible note in the desk sample. | No matching Gmail thread found. | Light member catch-up. |
| Pen Hassmann | Member comment, 15 June | Signup had no visible note in the desk sample. | No matching Gmail thread found. | Light member catch-up. |

### Answered enough for now

| Person/thread | Evidence |
| --- | --- |
| Phil Thamm | Gmail shows Benjamin replied on 30 June about booking. |
| Bernard Dwyer | Gmail shows Benjamin replied on 30 June about the group booking. |
| Andy Fairbairn | Gmail shows Benjamin replied and Andy acknowledged. |
| Grant Luff | Gmail shows Nic replied on 29 June. |
| Leca / Witta Sports sponsorship | Gmail shows Nic replied on 6 July. |

## Direct reply drafting history

The copy below was the staging source. Eleven aligned Gmail drafts were created on
2026-07-10. The live Gmail drafts are now the review source of truth and remain unsent.
They use the current language: the gate opened on 20 June, the place is still taking
shape, and ongoing practical conversation moves to the Harvest members page in Mighty
Networks.

| Person | Gmail status | GHL status |
| --- | --- | --- |
| Asha Hay | Draft created, not sent | Note added; card remains open in `New` |
| Mari Lloyd | Draft created, not sent | Note added; card remains open in `New` |
| Serge | Draft created, not sent | Note added; card remains open in `New` |
| Jo Pike | Draft created, not sent | Note added; card remains open in `New` |
| Jan Maguire | Threaded draft created, not sent | Note added; card remains open in `New` |
| Hazel Newman | Draft created, not sent | Note added; card remains open in `New` |
| Eugenie Tamplon | Draft created, not sent | Note added; card remains open in `New` |
| Eugenie Schwartz | Draft created, not sent | Note added; card remains open in `New` |
| Lesley Gillett | Draft created, not sent | Note added; card remains open in `New` |
| Catherine Mobbs | Draft created, not sent | Note added; card remains open in `New` |
| Pen Hassmann | Draft created, not sent | Note added; card remains open in `New` |

### Asha Hay

Subject:

```text
Re: Sound services and event support
```

Body:

```text
Hi Asha,

Thanks for reaching out, and sorry this sat longer than it should have.

It is good timing. We are working out how the stage and small events should grow from here, and live sound is exactly the kind of practical help we need to map properly before booking too much.

Could you send through a simple outline of what you usually cover, such as live mixing, gear hire, small event support, and any local dates you would be around to come and look at the space?

I will pull it into the events and art space thread so we know who to call when the next music night or gathering starts to take shape.

Thanks,
Ben
```

### Mari Lloyd

Subject:

```text
Re: Your Harvest shop expression of interest
```

Body:

```text
Hi Mari,

Thanks for putting your hand up for the shop, and sorry this sat in the queue.

We are starting small with the shop shelf and want the first maker pass to stay practical. Your ceramics sound like the right scale for that first test: small useful pieces, gifts, and everyday objects.

Could you reply with a few photos or a link, a rough price range, and whether you prefer consignment, a small shelf test, or a workshop conversation?

We are also pulling the maker conversation into Mighty Networks so it does not get lost in loose emails. Once I have your details, I can point you into the right shop thread.

Thanks,
Ben
```

### Serge

Subject:

```text
Re: The Harvest shop
```

Body:

```text
Hi Serge,

I found your shop interest note and wanted to make sure it did not disappear. Sorry we have been slow to come back.

The note came through as made goods, but without much detail. Could you send a few lines on what you make, what you would want to sell or test, and whether you are thinking shelf, market, event, or workshop?

We are collecting the maker leads into one shop pass, then moving the ongoing conversation into Mighty Networks so it is easier to see who is making what.

Thanks,
Ben
```

### Jo Pike

Subject:

```text
Re: The Harvest
```

Body:

```text
Hi Jo,

Thanks for putting your name down after meeting Nic. Sorry this reply has taken a few days.

Dinner gatherings, workshops, events, and making stuff are exactly the kind of local threads we want to gather as The Harvest finds its rhythm.

Could you reply with the one lane you would most like to help shape first: dinners, workshops, events, making, or garden?

I am gathering people by lane now, then we will turn the first one or two into real dates.

Thanks,
Ben
```

### Jan Maguire, Maleny Garden Club

Subject:

```text
Re: Maleny Garden Club Spring Fair
```

Body:

```text
Hi Jan,

Thank you for coming out and for sending the Spring Fair flyer. Sorry we have been slow to come back after opening.

I am moving between a few things this month, and Nic is more on the ground at Witta. Could you send two or three times that suit you and your committee colleague?

Weekends are easiest for the site, but send what is practical and we will work from there.

Once the shape is clear, we can also share the Spring Fair with the Harvest community so the right people see it.

Thanks,
Ben
```

### Early member catch-up template

Use this for Hazel, Lesley, Catherine, and Pen unless you want to write a more personal note.

Subject:

```text
The Harvest member catch-up
```

Body:

```text
Hi {{first_name}},

I am doing a catch-up pass through the early Harvest member notes to make sure nobody was missed.

Thanks for putting your name down. We are moving the next layer of the community into Mighty Networks so garden days, kids and family ideas, workshops, dinners, shop makers, and practical help can sit in one place.

Could you reply with the lane you care about most: garden, kids, workshops, dinners, shop, events, or help?

I will point you into the right thread from there.

Thanks,
Ben
```

### Eugenie Tamplon

Subject:

```text
Re: The Harvest
```

Body:

```text
Hi Eugenie,

Thank you for the kind note, and sorry this reply has taken a little while.

The playground, music, art, and people gathering are exactly the threads we want to grow carefully from here. We are trying to move the next conversations into Mighty Networks so those ideas do not disappear into a long inbox.

If you reply with the lane you care about most, I will point you into the right place: kids, music, art, garden, events, or help.

Thanks,
Ben
```

### Eugenie Schwartz

Subject:

```text
Re: Kids, garden, and workshops at The Harvest
```

Body:

```text
Hi Eugenie,

Thanks for your note, and sorry this has taken a little while to come back to.

The homeschool, kids, garden, Kids Club, workshop, and weekly meet-up ideas are exactly the sort of practical threads we need to gather before they become too scattered.

We are moving these conversations into Mighty Networks so families, gardeners, workshop people, and makers can find each other in one place.

Could you reply with what feels most alive for you first: kids in the garden, a Kids Club, a workshop, or a weekly meet-up?

Thanks,
Ben
```

## Inbox-zero operating process

Run this before every member or producer send.

1. Run the GHL contact audit.

```bash
npm run audit:contacts:ghl
```

2. Run the Mighty report.

```bash
npm run report:mighty
```

3. Run the Mighty sync dry-run. Do not apply until the missing contact is checked by a person.

```bash
npx tsx scripts/sync-mighty-members.ts
```

4. Run the GHL launch gate report, especially before producer/shop comms.

```bash
npm run report:launch-gates:ghl
```

5. Check Gmail before sending. Use broad searches first, then exact names from GHL notes.

```text
after:2026/06/01 -in:spam -in:trash from:hi@act.place (Harvest OR Witta OR shop OR garden OR member OR "Contact Form" OR "New Inquiry")
after:2026/06/01 -in:spam -in:trash from:benjamin@act.place (Harvest OR Witta OR shop OR garden OR member OR booking)
```

6. Reply to personal form notes before broadcast. Start with the `Needs direct reply before broadcast` table above.

7. Move ongoing conversations into Mighty by lane:

| Lane | Mighty space | GHL audience logic |
| --- | --- | --- |
| Shop makers and producers | `The Shop Makers` | `project:act-hv` plus any shop tag. Never use `role:supplier` alone. |
| Garden | `Garden Crew` | `interest:garden`, garden comments, garden volunteers. |
| Events, dinners, workshops | `Events` or `Community Notice Board` | `interest:events`, workshop notes, dinner/event replies. |
| General member orientation | `Start Here` | New Mighty members and member replies. |
| Public updates | `Community Notice Board` | Keep it broad and practical. |

8. Broadcast only after the personal queue is either replied to or deliberately moved into a named next send.

9. After replies go out, update GHL notes manually with `replied YYYY-MM-DD via Gmail` and the lane, then remove or resolve any open inbox card if the workflow requires it.

## GHL reply queue created - 2026-07-08

The open direct-reply people were added to the live GHL Harvest Inbox pipeline.

What was written:

- 11 open Harvest Inbox opportunity cards.
- 11 contact notes headed `Harvest reply audit 2026-07-08`.
- 11 Gmail drafts created on 2026-07-10 and recorded back to GHL notes.
- No emails sent.
- No GHL tags changed.
- No GHL workflows changed.

Cards created in `Harvest Inbox`, stage `New`:

| Person | Card |
| --- | --- |
| Asha Hay | `Reply needed - Asha Hay - events and art space` |
| Mari Lloyd | `Reply needed - Mari Lloyd - shop makers` |
| Serge | `Reply needed - Serge - shop makers` |
| Jo Pike | `Reply needed - Jo Pike - events, workshops, making` |
| Jan Maguire | `Reply needed - Jan Maguire - partner and events` |
| Hazel Newman | `Reply needed - Hazel Newman - member catch-up` |
| Eugenie Tamplon | `Reply needed - Eugenie Tamplon - kids, art, music` |
| Eugenie Schwartz | `Reply needed - Eugenie Schwartz - kids, garden, workshops` |
| Lesley Gillett | `Reply needed - Lesley Gillett - member catch-up` |
| Catherine Mobbs | `Reply needed - Catherine Mobbs - member catch-up` |
| Pen Hassmann | `Reply needed - Pen Hassmann - member catch-up` |

How to work the board:

1. Open GHL `Opportunities`.
2. Open the `Harvest Inbox` pipeline.
3. Start with the `Reply needed - ...` cards in `New`.
4. Open the card, then the contact.
5. Read the contact notes and tags.
6. Check Gmail if the history looks incomplete.
7. Send the reply from Gmail or GHL, but record the result back as a GHL note.
8. Move the card to `Waiting on them` if a reply was sent, or `Resolved` if no further action is needed.
9. When someone belongs in Mighty, add a note saying which Mighty lane they should enter.

## Audience call

Use three different lanes.

| Lane | Audience | Count | Job |
| --- | ---: | ---: | --- |
| Harvest Note | GHL `tier:member`, excluding staff/test | 191 gross in latest audit. Re-export sendable count before send. | Members hear first. Ask what should happen next. |
| Mighty post | Mighty members | 88 total, 87 external | Keep the inside room alive. Ask for practical replies. |
| Field Note | Newsletter/followers | 210 gross in latest audit. Re-export sendable count before send. | Public update after members. Invite people to join or answer the pulse. |

Do not send to `All`. Do not add or remove tags during a broadcast. Set first-name fallback to `there`.

## Clean-up before send

1. Reply to, or deliberately defer, every person in the `Needs direct reply before broadcast` table.
2. Check the one Mighty-only person in the generated data.
3. If correct, run the dry-run again, then apply the safe sync:

```bash
npx tsx scripts/sync-mighty-members.ts
npx tsx scripts/sync-mighty-members.ts --apply
```

4. Run the GHL audit again and read the member count out loud:

```bash
npm run audit:contacts:ghl
```

5. Test `/pulse` once on production before using it as the button.
6. Re-export the final sendable member and newsletter counts before loading a GHL campaign.

## Message spine

The Harvest opened on Saturday 20 June. As of 8 July, we are 18 days in. Use the more durable phrase "a few weeks in" if the send slips.

Say:

- The gate is open.
- The place is still being made.
- Priorities now: garden care, clear next dates, the first shop shelf conversations, small workshops/art space tests, and better feedback.
- Members hear first.
- The ask is simple: tell us what should happen next, or reply with your lane.

Keep out:

- attendance numbers
- opening hours unless confirmed that day
- paid membership price
- member levels or internal tag names
- governance or co-op claims
- old June booking links

## Draft member email

Send type: Harvest Note, GHL Campaign, not Workflow.

Audience: `tier:member`, excluding staff/test.

Subject options:

```text
A few weeks in
What should happen next at The Harvest
The gate is open. Now we listen.
```

Preview text:

```text
The Harvest is open. Here is what we are working on next, and the question we need you to answer.
```

Body:

```text
Hi {{contact.first_name}},

The gate opened on Saturday 20 June.

A few weeks in, the place is still rough in the right ways. The garden is being cared for. The tables are moving around. The shop shelf is starting to ask real questions. The art space needs its first small tests, not a grand plan.

That is where members matter.

For now, membership means hearing first, finding the next useful thing, and helping shape what The Harvest becomes.

The next priorities are simple:

Garden care. Regular work days, clearer jobs, enough hands to keep the place alive.

The shop shelf. Local growers, makers, preserves, produce, labels, timing, and a fair way to begin.

The art and workshop side. Small useful sessions first. Things people can actually turn up for.

Better listening. What people say at the gate, in the member space, and after a night here needs to shape the next month.

If you have a few minutes, tell us what should happen next:

https://www.theharvestwitta.com.au/pulse

Or just reply with one word: garden, shop, workshop, events, help, or question.

We read the replies. It may take a few days while we find our feet, but the answers matter.

The Harvest is a community garden and creative gathering place in Witta, on Jinibara Country.

It becomes real as people keep walking through the gate.
```

Button:

```text
Tell us what should happen next
https://www.theharvestwitta.com.au/pulse
```

GHL fallback: set `{{contact.first_name}}` default to `there`.

## Mighty post

Recommended space: `Community Notice Board`, because it has current activity. Add a shorter pointer in `Start Here` if needed.

Title:

```text
What should we make real next?
```

Body:

```text
The gate opened on 20 June.

A few weeks in, we are trying to listen properly before we make the next layer too complicated.

The next priorities look like this:

Garden care.
The first shop shelf conversations.
Small workshops and art space tests.
Clearer dates for people who want to come back.
Better ways to catch what people are saying at the gate.

Tell us one thing.

What should The Harvest keep doing, change, or try next?

You can answer here, or use the short pulse survey:
https://www.theharvestwitta.com.au/pulse

If you want a practical lane, write one word: garden, shop, workshop, events, help, or question.
```

## Newsletter rhythm after this

Keep it light.

1. **Members first:** one Harvest Note each month, plus practical dates when they land.
2. **Mighty weekly:** one useful post a week, not a performance feed. Ask, answer, confirm dates.
3. **Public Field Note:** 2 to 3 days after the member note. Same story, less inside-room detail.
4. **Monday sweep:** new Mighty members, unanswered questions, GHL notes, inbox replies, next dates.
5. **Return loop:** the next note should say what members told us, and what changed because of it.

The vibe is not a content machine. It is a working noticeboard with warmth.
