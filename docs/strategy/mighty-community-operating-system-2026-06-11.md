# Mighty community operating system

> Created 2026-06-11. This reopens the Mighty Networks question after the June 20 RSVP/GHL
> workflow cleanup. It sits beside `community-platform-decision-2026-06-05.md`,
> `mighty-trial-build-sheet-2026-06-06.md`, `simple-system-build-plan-2026-06-05.md`, and
> `shop-operating-system.md`.

## Decision

Use Mighty as the inside room, not the system of record.

The clean model:

```text
Website forms -> GHL record -> human review -> Mighty invite
Mighty activity -> Monday sweep -> GHL notes/tags/tasks
GHL broadcasts -> website proof -> Mighty discussion only when useful
```

Mighty should help members, makers, and volunteers find the next useful thing. It should not
replace GHL, Square, Humanitix, WhatsApp, the website, or the paper sheet.

**On money:** money happens only for the paid Supporter Plan; the free inside room stays free
and invite-only. The Supporter Plan ($20/week, billed $87/month via web checkout) is the one
place Mighty charges - see `.claude/skills/harvest-selling-system/references/member-model.md`
and `launch-runbook.md`. GHL stays the source of truth for who is paid up.

## Why this fits The Harvest

The Harvest is a place where people belong by doing.

Mighty can support that if it holds:

- the next work day
- the maker question
- the volunteer brief
- the shelf update
- the photo from the garden
- the practical answer someone needs before they show up

It breaks the philosophy if it becomes:

- a points game
- a public feed people are expected to perform in
- a second CRM
- a place where elders, Jinibara relationships, or sensitive stories are processed
- a drip machine that moves people up a journey because they clicked something

## What Mighty actually gives us

Current Mighty facts checked 2026-06-11:

- Launch plan lists courses, events, badges/tags, gamification, and basic automations.
- Scale adds more integrations, event charging, intermediate automations, and limited API.
- Growth includes advanced AI/automation features and Admin/Headless API.
- Events support RSVP, Going/Maybe/Not Going, comments, attendee messaging, local-event
  reminders, and CSV download.
- Automations can open/close RSVPs, move people between Spaces/Plans, reward activity, and
  celebrate event attendance. This is powerful, so Harvest should use it narrowly.
- Zapier is Scale and up. Admin API is Scale and up, with 5,000 monthly requests on Scale.
- AI features can be managed from Admin > General > AI Features, including turning all AI off.
- Member data and insights can be exported.

## Live Mighty admin check - 2026-06-11

Verified in the logged-in Arc session for `harvest-the-network.mn.co`:

- The network is live as `The Harvest`.
- The account is in trial with the banner `Unlock 3 MONTHS FREE before your trial ends` and roughly 8 days left.
- Admin access is available.
- The admin shell shows `Members`, `Leaderboard`, `Activity Feed`, `Chat`, `Events`, `Create a Space`, and `Create a Collection`.
- The Members area is empty/onboarding state and shows the built-in People Magic prompt: members can find each other, break the ice, and get connected.
- Leaderboard/recognition is visible in the product surface, including `Top Recognizers` and the recognition value `Welcoming`.

Unverified in live admin:

- The current `Admin > General > AI Features` toggle state.
- Whether all AI features can be disabled on this exact trial/plan.
- Whether leaderboard, badges, and recognition can be made quiet enough for Harvest without upgrading or changing plan.
- The final paid plan selected after trial and any account-specific API/Zapier limits.

Decision until those are checked: keep AI and gamification out of the launch promise. Treat them as optional host tools only after a real admin walkthrough.

## Live Mighty API check - 2026-06-12

Verified with `npm run report:mighty` using the Mighty Admin API key stored in local env:

- API auth works for network `harvest-the-network` / `The Harvest`.
- API-visible state: 7 Spaces, 1 member, 1 post/article, 0 events.
- Expected first-round Spaces exist: `Start Here`, `What's On`, `The Shop Makers`, `Garden Crew`, `Questions Wall`, `Ask a Steward`.
- There is a duplicate `Start Here` Space. Keep `Start Here` ID `24050197`, which has the one existing post/article. Delete or hide duplicate `Start Here` ID `24050240`, which has 0 posts.
- `Events Archive` was not visible through the API.

Do not automate deletion from the API unless explicitly chosen. Mighty docs confirm Space deletion is permanent. The safe admin action is: open both `Start Here` Spaces in Mighty, keep `24050197`, and delete or archive `24050240`.

## Live Mighty seed - 2026-06-12

Seeded with `npm run seed:mighty-member-system`:

- `Questions Wall` now has `Ask the practical thing here`.
- `The Shop Makers` now has `What are you making, growing, preserving, baking, or carrying?`.
- `Garden Crew` now has `What needs hands this week`.

Verified after seeding with `npm run report:mighty`: 4 post/article records visible by API.

Not seeded by API:

- `Start Here` because Posts/Feed are disabled. This is expected for a Page-only Space. Edit the Start Here Page in the Mighty UI instead.
- `What's On` because Posts/Feed are disabled. This is expected for an Events-only Space. Create the June 20 item as an Event or Page in the Mighty UI.

Remaining UI tasks:

1. Delete or hide duplicate `Start Here` ID `24050240`.
2. Set real `Start Here` ID `24050197` as the landing Space.
3. Add the June 20 item in `What's On`.
4. Inspect `Admin > General > AI Features` and keep member-facing AI quiet for the trial.

## GHL bridge readiness - 2026-06-12

Verified with `npm run check:mighty-tags:ghl`, then created with `npm run ensure:mighty-tags:ghl`, then rechecked:

- `platform:mighty-invited`
- `platform:mighty-active`
- `platform:mighty-dormant`
- `pod:garden`
- `pod:shop-makers`
- `pod:events`
- `signal:asked-question`
- `signal:help-offered`

All eight tags now exist in the GHL tag library. They are record tags only. Do not use them as automation triggers until the first 10 to 15 invite test proves the flow.

## Tool boundaries

| Tool | Job |
| --- | --- |
| Website | Public front door. Membership, shop, RSVP, volunteer interest. |
| GHL | Source of truth. Contacts, tags, pipelines, receipts, broadcast lists, tasks. |
| Mighty | Member/maker/volunteer room. Questions, resources, photos, work-day coordination. |
| Square | Shop till, products, stock, maker reconciliation. |
| Humanitix | Public ticketed or larger events after June 20. |
| WhatsApp | Small fast crew chats where a real group is already alive. |
| Paper | Event-day and low-tech intake. Typed into GHL during the sweep. |

## Start with four Spaces

Do not build a full village on day one.

| Space | Who gets access | Purpose | First posts |
| --- | --- | --- | --- |
| Start Here | Everyone invited | How The Harvest works, how to ask, what not to use Mighty for | Welcome, map of rooms, "what are you here to help with?" |
| Garden Crew | Volunteers and members who want work days | Working bee details, photos, tool asks, safety notes | July work day, what to bring, photo thread |
| The Shop Makers | Shop EOIs moved to conversation | Shelf process, consignment questions, maker stories, sample-day notes | How the shared shelf works, what we need first |
| Questions Wall | Members, makers, volunteers | Practical questions and answered-once knowledge | "Ask here", pinned answers, weekly answered list |

Optional later:

- Art Space, only after there is a real crew.
- Kitchen/Event Crew, only after Susie/Joey are running repeated event work.
- Members Journal, only if people are actually sharing stories and photos.

## Access rules

Mighty is not open by default.

| Trigger | Human decision | Mighty action |
| --- | --- | --- |
| `/membership` join | If they look like a genuine local/member lead | Invite to Start Here |
| `/shop` EOI | Once Susie/Ben moves GHL card to `In conversation` | Invite to The Shop Makers |
| Volunteer offer | After a named work day or real reply | Invite to Garden Crew or relevant crew |
| June 20 RSVP | No automatic invite | Thank them, invite only if they ask to help or join |
| Elder/storyteller/community lane | Never automated | Relationship by hand, outside Mighty unless explicitly consented |

## Process flows

### 1. Member joins

1. Person joins on the Harvest website.
2. GHL applies `tier:member`, `comms:harvest-newsletter`, `interest:membership`, and the
   member welcome workflow.
3. Monday sweep checks new members.
4. If appropriate, send a Mighty invite to Start Here.
5. In GHL, add `platform:mighty-invited` and, once joined, `platform:mighty-active`.

### 2. Shop maker comes through

1. Person fills `/shop`.
2. GHL creates the Shop card in `New interest`, applies `interest:markets`, `role:supplier`,
   `shop-stage-1`, `shop-follow-up`, and the offer tag.
3. Susie/Ben replies or books a chat.
4. When the card moves to `In conversation`, invite them to The Shop Makers.
5. Mighty holds the practical shop process: how the shelf works, what info is needed, sample
   day, label examples, FAQ.
6. GHL remains the pipeline. Square remains the till.

### 3. Volunteer engagement

1. Person offers help through a form, reply, paper sheet, or in person.
2. GHL gets a note/tag in the Monday sweep.
3. A human decides whether they join Garden Crew, Event Crew, or stay on the email list only.
4. Mighty gives them one clear next action: the next work day, what to bring, who is hosting.
5. Attendance or contribution is recorded in GHL by a human. No auto-climb.

### 4. Questions and knowledge

1. Member asks in Mighty.
2. Host answers plainly.
3. If it is reusable, copy the answer into the pinned Questions Wall.
4. If it creates a real task, create the task in GHL or the relevant ops doc.
5. Weekly: pull 3 answered questions into the next Harvest Note if useful.

## AI support

Use AI as a steward's desk assistant, not as the host.

Good AI uses:

- Summarise the week's Mighty questions for the Monday sweep.
- Draft replies for Ben/Susie to approve.
- Turn repeated questions into a pinned FAQ.
- Suggest which new posts should become a Harvest Note paragraph.
- Flag unanswered questions older than 3 days.
- Draft a warm invite from a GHL contact note.
- Help a host find the right setting or Mighty feature.

Do not use AI to:

- auto-message members in Harvest voice without review
- recommend or rank people publicly
- auto-move journey rungs
- score contribution
- generate fake community stories
- process sensitive community-lane relationships

AI policy:

```text
AI can sort, summarise, draft, and remind.
People invite, decide, answer, and move the relationship.
```

## The Monday sweep with Mighty added

Add 10 minutes to the existing sweep:

1. New Mighty members: match to GHL contact, add `platform:mighty-active`.
2. Unanswered questions: reply or assign.
3. Shop Makers: any post that implies a next step becomes a GHL note/task.
4. Volunteers: any person who actually helped gets the correct `pod:` tag by hand.
5. Export/check: if automation is not built, export Mighty member/activity data and reconcile.
6. Read out loud: new members, unanswered questions, next work-day RSVPs, shop makers active.

## Tags to add only if we use Mighty

These now exist in the GHL tag library as of 2026-06-12:

| Tag | Meaning |
| --- | --- |
| `platform:mighty-invited` | Sent a Mighty invite |
| `platform:mighty-active` | Joined Mighty |
| `platform:mighty-dormant` | Joined but inactive after review |
| `pod:garden` | Garden crew |
| `pod:shop-makers` | Shop maker crew |
| `pod:events` | Event/kitchen crew |
| `signal:asked-question` | Asked a practical Mighty question, reviewed in sweep |
| `signal:help-offered` | Offered help, reviewed by a human |

These are record tags, not automation triggers unless a workflow is explicitly documented.

## Automations

Phase A: no cross-system automation.

- Use bulk invite or manual invite.
- Export/check once a week.
- Let the system prove it deserves wiring.

Phase B: light automation only if Phase A is alive.

- GHL `tier:member` -> Mighty invite.
- Mighty join -> GHL `platform:mighty-active`.
- Mighty event RSVP -> GHL event headcount tag.
- Mighty question older than 3 days -> host task.

Never automate:

- journey rungs
- community-lane relationships
- shop stage movement
- consent
- broadcast audience changes

## Trial design

Run this for 14 days after June 20, not during launch-week noise.

Pass conditions:

- One low-tech member gets in without help.
- Garden Crew has at least three useful posts or comments from people who are not Ben.
- Shop Makers produces at least one practical question or maker next step.
- Hosts can turn off or tame AI/gamification enough that it does not feel like a points game.
- Monday sweep takes less than 45 minutes total with Mighty included.

Fail conditions:

- No one posts unless prompted.
- People ask the same questions in WhatsApp anyway.
- The login/app friction creates support work.
- Hosts spend more time tending Mighty than tending the place.
- AI/gamification cannot be made quiet.

## Recommended next move

Build Mighty as a small trial:

1. Clean the duplicate `Start Here`: keep `24050197`, remove or hide `24050240`.
2. Set `Start Here` as the landing Space in Mighty admin.
3. Edit the Start Here Page copy in Mighty UI so it matches the member-system model.
4. Add the June 20 item to `What's On`.
5. Invite 5 to 10 people, not the whole list.
6. Add `platform:mighty-invited` by hand in GHL for anyone invited.
7. Do one Monday sweep.
8. Decide from behaviour, not from the feature list.

The test is not "can Mighty do a lot?"

It can.

The test is: does it help people come back, ask better questions, and do real work at The
Harvest without making the system heavier?
