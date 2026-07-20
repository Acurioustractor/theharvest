# June 20 newsletter and Mighty invite path

> Created 2026-06-12.
> Purpose: draft the launch newsletter first, then define how people move from GHL interest into Mighty Networks without making the public invite carry too much.

## Decision

The newsletter has one public job:

```text
Get people to take a free ticket and understand that Saturday 20 June is a hands-on making afternoon.
```

Mighty has one quieter job:

```text
Bring the people who show real intent into the inside room after they raise their hand.
```

Do not make the public newsletter a Mighty launch. Mention the inside room softly, then use replies, RSVP intention text, and known relationships to invite the first useful cohort.

## Send Setup

Send type: Field Note / public launch invitation

Build in: GHL Campaigns, not Workflows

GHL draft template:

```text
Template ID: 6a2b8da223b65d1a24ce4014
Preview: https://firebasestorage.googleapis.com/v0/b/highlevel-backend.appspot.com/o/location%2FagzsSZWgovjwgpcoASWG%2Femails%2F6a2b8da223b65d1a24ce4014%2Findex.html?alt=media&token=5baff361-acb4-4aac-8739-beec9c9ccf6b
```

Note: GHL currently shows this API-created template as `New Template` in the template list. Use the ID or latest modified time to identify it if the name does not display.

Audience: `comms:harvest-newsletter`

Main CTA: `Get a free ticket`

CTA link:

```text
https://www.theharvestwitta.com.au/june-20#rsvp
```

Do not send to `All`.

Do not add or remove tags as part of the send.

If using first-name personalisation, use fallback `there`.

## Live GHL Audience Snapshot

Checked 2026-06-12 with read-only GHL audits.

| Audience / tag | Current count | Use for this send? | Note |
| --- | ---: | --- | --- |
| `comms:harvest-newsletter` | 100 | Yes | Public Harvest Field Note audience. Use this for the June 20 launch send. |
| `harvest-newsletter` | 1 | No | Legacy/small tag. Do not use as the campaign audience. |
| `tier:member` | 80 | Not for this public send | Members can receive member-first practical notes, but this launch note is public. |
| `interest:membership` | 80 | Not for this public send | Membership interest/member cohort, not the general launch list. |
| `interest:markets` | 90 | Not for this public send | Shop/maker lane. Use for shop-specific follow-up after the event or one-to-one maker invites. |
| `role:supplier` | 35 | Not for this public send | Supplier/shop context only. |
| `witta-gathering-2026-06-20` | 0 | No | Event RSVP result tag. Do not target this before the event send. |
| `rsvp-pizza-dinner` | 0 | No | Headcount tag populated by the embedded RSVP form. |

Watch:

- 12 Harvest contacts are missing names, so avoid a personalised greeting unless GHL fallback is set to `there`.
- 1 Harvest duplicate phone group exists. It does not block the send.
- Current public RSVP count is 0, so the campaign is ready to start sending traffic.

## Pre-Send Gate Snapshot

Checked 2026-06-12 at 14:45 Brisbane.

Ready:

- GHL branded email template exists: `6a2b8da223b65d1a24ce4014`.
- GHL preview verified as Harvest content, not placeholder content.
- Public RSVP path is the website form at `/june-20#rsvp`.
- Current RSVP tags are zero, so the send will start the public traffic cleanly:
  - `witta-gathering-2026-06-20`: 0
  - `rsvp-pizza-dinner`: 0
  - `rsvp-maker-morning`: 0
- No active/scheduled Harvest email campaign was found in the GHL schedule list. Existing matching Harvest/Witta campaigns are completed March sends.

Use caution:

- GHL template list may show the API-created template as `New Template`; identify it by ID and latest modified date.
- Do not use the old `harvest-newsletter` audience; it has 1 contact.
- Do not use `tier:member` only for this public announcement.
- Do not use `interest:markets` for this public announcement.

Still not needed for this send:

- Calendar booking tag workflows are still incomplete, but the public `/june-20` embedded RSVP form writes the event tags directly.
- Shop-chat booked workflow and Susie/Joey GHL users are still follow-up items, not blockers for this public email.

## GHL Build Walkthrough

Do this in HighLevel inside the A Curious Tractor sub-account.

Current status, checked 2026-06-12 at 16:10 Brisbane:

- Template and audience are ready.
- Campaign creation is still a manual GHL UI step. The current API token can create/update email templates, but cannot create the final Campaign object:
  - `POST /emails/locations/:locationId/campaigns/emails` returned 404 for tested API versions.
  - `POST /emails/public/v2/locations/:locationId/campaigns/email-campaign` returned 401 `The token is not authorized for this scope`.
- `GHL_AGENCY_API_KEY` also returned 401 for Campaign V2 endpoints.
- Arc/Computer Use reached the authenticated GHL shell, but the Email Marketing iframe stayed on a loader and did not expose campaign-builder controls.
- A read-only Campaign V2 list check returned the 6 existing sent campaigns and no matching `Harvest Field Note` / `June 20` / `gate opens` campaign.
- No live campaign send or test email has been sent from GHL yet.

1. Go to `Marketing -> Emails -> Campaigns`.
2. Create a new regular email campaign. Do not create a workflow.
3. Name it:

```text
Harvest Field Note - June 20 gate opens - 2026-06-12
```

4. Set subject:

```text
After the Witta Market, the gate opens
```

5. Set preview text:

```text
Turn up after the market, help make the first version, then make and eat pizza together.
```

6. Paste the newsletter body from this doc.
7. Add one main button only:

```text
Get a free ticket
```

Button URL:

```text
https://www.theharvestwitta.com.au/june-20#rsvp
```

8. Use a real Harvest/site image if one is ready. If not, send text-first rather than delaying for a weak graphic.
9. Check sender name and email. If the only verified sender is still `hi@act.place`, use it for now rather than blocking the send, but record it as a fix.
10. Audience: choose the smart list or segment built from `comms:harvest-newsletter`.
11. Confirm the audience count is around 100. If GHL shows 1, you picked the old `harvest-newsletter` tag. Stop and change it.
12. Do not add tags in the campaign builder.
13. Send a test to Ben and Nic.
14. Open the test on phone.
15. Click the button and confirm `/june-20#rsvp` opens.
16. Check the RSVP form asks:

```text
What brings you through the gate?
```

17. Send or schedule.
18. After sending, monitor replies and RSVPs manually. Do not bulk-invite everyone into Mighty.

## Newsletter Draft

Subject:

```text
After the Witta Market, the gate opens
```

Preview:

```text
Turn up after the market, help make the first version, then make and eat pizza together.
```

Body:

```text
The gate opens on Saturday 20 June.

Witta Market runs in the morning. After it packs down, come up the road to The Harvest.

The old nursery is not arriving finished. That is the point.

From 1pm, we will open the gate for a working afternoon.

People will turn up and do a few things together.

We will walk the garden, put thoughts on the question wall, and make or fix a few small things that help the place become easier to use.

Nothing grand. Just useful first moves.

Then we will make pizzas together.

Roll, top, cook, eat. Sit down for a bit.

If the garden has something ready, it can go on the table. If not, we keep it simple.

The ticket is free. It just helps us plan the dough and understand what brings people through the gate.

When you put your name down, we will ask one small question:

What brings you through the gate?

Garden, shop, making, pizza, curiosity, kids, a question, a skill, or nothing in particular. All of those are useful.

Before we leave, we will ask one more thing:

What should happen next?

That might be a garden working day, a shelf idea, a workshop, a kids project, a repair job, a question, or someone putting their hand up to help.

After Saturday, we will invite a small first group into the Harvest inside room. It is where garden hands, shop makers, workshop people, and people with practical questions can help shape the next version.

If that sounds like you, reply to this email with one word: garden, shop, workshop, help, or question.

The Harvest is a community garden and creative gathering place taking shape in Witta, on Jinibara Country.

It will only become real if people walk through it and start making it with us.

Get a free ticket:
https://www.theharvestwitta.com.au/june-20#rsvp

Saturday 20 June 2026
From 1pm to late afternoon
9 Gumland Drive, Witta
Free ticket

Come after the market.
Bring gloves, a chair, a tool, a story, a question, or nothing at all.
```

## Why The Mighty Mention Is Soft

The public invite should not ask people to understand a new platform before they understand the place.

The better move is:

```text
newsletter -> free ticket -> intention/reply -> human review -> personal Mighty invite
```

That gives us better people in the first round and keeps Mighty feeling like a useful inside room, not another account to make.

## GHL To Mighty Movement

Use GHL as the source of truth.

Use Mighty as the room where interested people can actually participate.

| Signal | GHL action | Mighty action |
| --- | --- | --- |
| RSVP only | Keep event RSVP tags only | No Mighty invite yet |
| RSVP says garden / hands / volunteer | Human review, then add `signal:help-offered` and, if suitable, `pod:garden` | Personal invite to `Garden Crew` |
| RSVP says shop / maker / grower / shelf | Human review, then direct to `/shop` or Shop pipeline, add `pod:shop-makers` after clear intent | Personal invite to `The Shop Makers` |
| RSVP says workshop / teach / host | Add `signal:help-offered`; create manual follow-up task | Personal invite to `Questions Wall` first |
| Reply to newsletter with garden/shop/workshop/help/question | Reply personally; tag only after confirming the meaning | Invite to the matching Space |
| Known founder / contributor | Confirm exact contact record and consent first | Personal founding/lifetime invite |

Do not bulk-invite every RSVP into Mighty.

The first Mighty cohort should be small enough that it can be welcomed properly.

Target first cohort:

- 3 to 5 garden/help people
- 3 to 5 shop maker or grower people
- 2 to 3 question/workshop people
- founding contributors by personal invitation only

## Tags To Use After Human Review

Mighty state:

- `platform:mighty-invited`
- `platform:mighty-active`
- `platform:mighty-dormant`

Participation pods:

- `pod:garden`
- `pod:shop-makers`
- `pod:events`

Signals:

- `signal:asked-question`
- `signal:help-offered`

Member levels:

- `member-level:community`
- `member-level:founding-lifetime`
- `member-level:contributor`
- `member-level:steward`
- `recognition:build-contributor`

Rule: only apply member-level and recognition tags after a human has checked the exact contact record.

## Personal Mighty Invite Copy

Use this after someone replies, RSVPs with a clear intention, or is known personally.

Subject:

```text
Come into the Harvest inside room
```

Body:

```text
Hey [first name],

Thanks for putting your hand up around [garden / shop / workshop / questions].

We are testing a small inside room for The Harvest before we invite the wider list. It is not a social feed. It is where we keep the practical things close: what needs hands, maker questions, workshop ideas, and the next useful thing to do.

Come in here:
[Mighty invite link]

Start with Start Here, then go to [Garden Crew / The Shop Makers / Questions Wall].

No pressure to post a lot. One useful question or one small offer of help is enough.
```

SMS version:

```text
Hey [name] - thanks for putting your hand up around [garden/shop/workshop/questions]. We are testing a small inside room for The Harvest with a few people first. Come in here: [link]
```

## GHL Campaign Checklist

1. Create the send as a GHL Campaign.
2. Audience is `comms:harvest-newsletter`, or a narrower Harvest smart list. Never `All`.
3. Confirm the visible contact count out loud before sending.
4. Use one main button: `Get a free ticket`.
5. Button link is `https://www.theharvestwitta.com.au/june-20#rsvp`.
6. If using first name, confirm fallback is `there`.
7. Test-send to Ben and Nic.
8. Open the test on phone.
9. Click the RSVP link.
10. Confirm the form opens and the intention question is visible.
11. Send or schedule.
12. After send, review replies and RSVPs manually before tagging or inviting people into Mighty.

## Post-Send Triage

Run this once per day until the event.

1. Open GHL conversations and new RSVP contacts.
2. Read the intention text.
3. Sort into:
   - RSVP only
   - garden/help
   - shop/maker/grower
   - workshop/host
   - question/needs reply
   - founding/contributor
4. Reply personally where needed.
5. Apply only the tags that match the confirmed intent.
6. Send Mighty invite only when the person has a clear next place to go inside Mighty.

## First Mighty Welcome Sequence

When someone joins Mighty, the goal is not volume. The goal is one useful action.

Ask them to do one of these:

- Garden Crew: reply to `What needs hands this week`.
- The Shop Makers: reply to `What are you making, growing, preserving, baking, or carrying?`
- Questions Wall: post one practical question.

That is enough for the first test.
