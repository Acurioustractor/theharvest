# Harvest member system

> Created 2026-06-12. This sits beside `mighty-community-operating-system-2026-06-11.md`,
> `membership-and-comms.md`, and `harvest-ghl-tag-and-automation-map.md`.

## Decision

GHL holds membership truth.

Mighty holds member activity.

The clean model:

```text
Person raises hand -> GHL record -> membership level / role / pod tags -> human invite -> Mighty room -> Monday sweep back to GHL
```

Do not make Mighty the source of membership status. Mighty is the inside room after someone has a clear reason to be there.

## The three layers

Keep these separate.

| Layer | What it answers | Where it lives |
| --- | --- | --- |
| Member level | What kind of Harvest member are they? | GHL tag `member-level:*` |
| Participation pod | What are they helping with? | GHL tag `pod:*`, mirrored by Mighty Space access |
| Mighty state | Have they been invited or joined? | GHL tag `platform:mighty-*` |

This avoids the trap where one word, "member", has to mean supporter, volunteer, shop maker, steward, and friend of the place.

## Member levels

| Level | GHL tag | Meaning | Mighty access |
| --- | --- | --- | --- |
| Community member | `member-level:community` | Someone who deliberately joins the Harvest member list and wants to stay close. | Start Here, What's On, Questions Wall |
| Founding lifetime member | `member-level:founding-lifetime` | Gifted recognition for people who materially helped the place exist. No fee. No expiry. | Start Here, What's On, Questions Wall, relevant pods |
| Contributor member | `member-level:contributor` | Someone actively giving time, skill, materials, produce, workshop energy, or practical help. | Relevant pod Space |
| Steward | `member-level:steward` | Trusted host/moderator/operator. This is responsibility, not status. | Host/moderator permissions where needed |

Rules:

- Every member level still carries `tier:member`.
- A person can have more than one `member-level:*` tag if true.
- `member-level:founding-lifetime` is recognition, not a public hierarchy.
- Do not charge founding lifetime members later unless they actively choose to support something else.
- Do not use `member-level:steward` unless there is a job, a boundary, and a person responsible.

## Founding lifetime cohort

Start with a small named list. These are not "VIPs". They are people whose hands, trust, family support, craft, money, labour, or belief helped The Harvest get to the gate.

Draft names mentioned:

- Sophie
- Susie
- Joey
- Amelia
- Carla
- Polly
- Jolly
- Hatch team
- electricians
- Ben's daughters
- Nick's parents
- other build supporters and practical contributors

Before tagging or emailing:

1. Confirm each person is actually in GHL, or add them by hand.
2. Add `tier:member`.
3. Add `member-level:founding-lifetime`.
4. Add `recognition:build-contributor` if their contribution was practical build/support.
5. Add the right pod only if they have an actual current lane:
   - `pod:garden`
   - `pod:shop-makers`
   - `pod:events`
6. Send a personal note before any public recognition.
7. Only use their name or photo publicly after consent.

## June 20 Mighty trial cohort

Invite 8 to 12 people, not the whole member list.

The first test cohort should include:

| Person type | Why they are in the test | Mighty Space |
| --- | --- | --- |
| 2 to 3 founding contributors | They know the place and can set the tone. | Start Here, Questions Wall |
| 2 shop/grower people | Test shelf questions and maker process. | The Shop Makers |
| 2 garden helpers | Test work-day asks and photos. | Garden Crew |
| 1 to 2 workshop/space idea people | Test whether ideas become usable proposals. | Questions Wall first, later a Workshop Ideas Space if needed |
| 1 steward/moderator | Test the host load. | Relevant Spaces |

Do not invite everyone who RSVPs on June 20. RSVP means "coming through the gate", not "ready for the inside room".

## First cohort record check - 2026-06-12

GHL was searched for the draft founding cohort names before applying any tags.

Status:

- Candidate records were found for Sophie, Joey, Amelia, Carla, Polly, Jolly, Hatch, Nicholas/Nick.
- No `Susie` match was found by name.
- Several names return multiple or ambiguous contacts.
- No founding/lifetime tags were applied yet.

Do not tag from the draft name list alone. The safe next step is a human pass over exact contact records, especially for duplicate names, organisations, family members, school contacts, or anyone under 18.

Tagging rule after confirmation:

```text
tier:member
member-level:founding-lifetime
recognition:build-contributor, only if their contribution was build/practical support
pod:* only if they have a current work lane
platform:mighty-invited only after the Mighty invite is actually sent
```

## What members get now

Do not overpromise.

For June and July 2026, membership gives:

- Harvest Notes first, through GHL email.
- First call on work days, small gatherings, garden asks, and practical opportunities.
- A simple inside room in Mighty if invited.
- A way to ask useful questions and see what is happening.
- A path to help shape the garden, shop, events, workshops, or stories.

Membership does not yet promise:

- discounts
- voting rights
- governance
- unlimited venue access
- guaranteed shop placement
- paid workshop slots
- private community access for everyone

The public line:

```text
For now, membership means hearing first, finding the next useful thing, and helping shape what The Harvest becomes.
```

## Future paid membership

Do not price this before the room proves value.

Possible later shape:

| Future offer | What it could include | Gate before charging |
| --- | --- | --- |
| Community member | Harvest Notes first, member mornings, garden/shop updates, small invitations | People are returning without being chased |
| Contributor member | All community member value plus a clear project lane | A real roster or contribution loop exists |
| Maker member | Shop-maker process, sample days, shelf calls, consignment guidance | Square/shop process is live and fair |
| Steward circle | Training, host tools, access to help run parts of the place | Responsibility framework exists |

Founding lifetime members keep lifetime recognition even if paid memberships start later.

## Email flow

GHL sends all broad email.

Mighty does not replace Harvest Notes.

| Trigger | GHL email | Mighty action |
| --- | --- | --- |
| `/membership` join | Member welcome workflow | No automatic invite |
| Founding lifetime recognition | Personal email or hand-written note first | Invite if they want the inside room |
| June 20 RSVP | RSVP receipt only | Invite only selected trial people |
| Shop EOI | Shop receipt | Invite to The Shop Makers after human review |
| Volunteer offer | Personal reply or next work-day note | Invite to Garden Crew after real intent |
| Workshop idea | Reply with next step | Keep in Questions Wall until repeated enough for its own Space |

## Mighty engagement design

Do not build a content machine. Build a useful noticeboard with human warmth.

First prompts:

- Start Here: "What are you here to help grow, make, or gather?"
- Garden Crew: "What needs hands this week"
- The Shop Makers: "What are you making, growing, preserving, baking, or carrying?"
- Questions Wall: "Ask the practical thing here"
- What's On: June 20, next garden day, next maker conversation

Weekly rhythm:

- Monday: host sweep, match Mighty activity back to GHL.
- Wednesday: one practical post in one Space only.
- Friday: confirm weekend hands, weather, tools, or gathering details.
- After any work day: short "what got done" post with cleared photos.

## Moderation and stewardship

Minimum roles for the first trial:

| Person | Role | Job |
| --- | --- | --- |
| Ben | Network Host | Final decisions, membership levels, public voice, sensitive relationships |
| Susie | Space Host or moderator for shop/events when ready | Shop maker questions, event/kitchen asks |
| Joey | Space Host or moderator for events/garden when ready | Practical event/garden coordination |
| One garden steward | Garden Crew moderator | Work-day posts, safety, tools, photos |

Mighty docs distinguish Network Hosts from Network moderators. Hosts have full admin access. Moderators focus on members, content, and features. Use the lighter role unless someone truly needs full access.

Moderation rule:

```text
Public warmth, private correction, human decision.
```

If something is off:

1. Pause the thread if needed.
2. Move sensitive detail to Ask a Steward or a direct conversation.
3. Record any real follow-up in GHL.
4. Remove/ban only for safety, spam, harassment, or serious boundary crossing.

## AI moderation and support

Use AI quietly.

Good uses:

- Draft a reply for a steward to approve.
- Summarise unanswered questions before Monday sweep.
- Turn repeated questions into a pinned FAQ.
- Suggest a soft icebreaker.
- Clean spelling in a host post without changing voice.
- Flag a thread that sounds unanswered, heated, or operationally important.

Do not use AI to:

- pretend to be The Harvest host
- auto-reply to members
- decide membership level
- score contribution
- rank people
- publicly recognise people without consent
- touch elders, Jinibara relationships, kids, or sensitive stories

Mighty's AI features can be managed under `Admin > General > AI Features`, including toggling individual features or turning all AI off. Keep member-facing AI minimal until the trial proves it helps rather than making the room feel synthetic.

## First seven days after June 20

1. Clean duplicate Mighty `Start Here`.
2. Set real `Start Here` as the landing Space.
3. Edit the Start Here Page in Mighty UI.
4. Add June 20 to `What's On`.
5. Confirm exact GHL records for the first founding lifetime cohort.
6. Tag first founding lifetime cohort in GHL.
7. Send personal founding lifetime notes.
8. Invite 8 to 12 Mighty trial members.
9. Add `platform:mighty-invited` in GHL for each invite.
10. Run first Monday sweep.
11. Decide what to keep, remove, or postpone.

## Pass conditions

- Founding lifetime members understand the gift and do not feel sold to.
- At least one shop-maker question appears.
- At least one garden/helper next action appears.
- At least one workshop or space idea becomes a clear next step.
- A steward can check the room in under 15 minutes.
- GHL still has the clean record of who is what.

## Fail signals

- People think Mighty is another newsletter.
- People ask the same things in WhatsApp because Mighty is unclear.
- Hosts feel they need to perform in the feed.
- Membership levels feel like hierarchy instead of gratitude and usefulness.
- AI makes posts sound less like the place.
