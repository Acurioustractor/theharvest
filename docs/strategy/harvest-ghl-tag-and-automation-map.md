# Harvest GHL Tag And Automation Map

> **SUPERSEDED 2026-06-03 on the 20 June model. 20 June is now a PUBLIC OPEN DAY.** The "from 2pm"
> / members-first framing is retired. Current truth:
> `RECONCILED-20-june-public-open-day-2026-06-03.md` and `GHL-completion-handoff-2026-06-03.md`
> (public RSVP via trigger link feeding `rsvp-pizza-dinner`, pizza from 5pm). The tag names and
> calendar IDs below still stand; read the day-model framing as history.

Last verified: 2026-06-12

This is the operating map for Harvest contacts in GoHighLevel. The website creates or updates contacts, applies tags, adds notes where useful, and triggers workflows when a workflow env var is configured.

To build the workflows that do not exist in GHL yet, and to see the current env wiring state, use `ghl-workflow-build-specs.md`. On 2026-05-27 footer follows were wired to a dedicated **"Harvest - Follow Welcome"** workflow (`0cf2479e-791c-43ac-a8cd-a3395a03cdaa`), verified end to end (correct Harvest-voice email delivered). Do NOT use the generic Newsletter Signup workflow (`0c61347a-b59b-4de5-ae90-32a59c8e4805`) for Harvest: a live test showed it sends an ACT-branded welcome (wrong brand, violates Harvest voice); it is a shared/legacy ACT workflow. Open follow-up: the welcome sends from `hi@act.place`, not a Harvest address (location-wide sending-domain setup needed). The Witta Gathering Photos workflow (`65819e73-09c8-4598-b982-41dfeeb8624e`) is wired in Vercel production.

## System Rules

- Use `harvest-website` as the base tag for every contact created by the Harvest website.
- Use `comms:harvest-newsletter` for Harvest newsletter sends. Do not rely on the generic `newsletter` tag because the GHL location also holds non-Harvest contacts.
- Prefer workflow-ID enrolment from the website for active forms. Keep broad tags for filtering, not branching. If a tag trigger is used, add exclusions so question or contact paths do not receive the wrong welcome.
- Do not remove legacy tags such as `act-hv`, `eoi-gathering-march-2026`, or `locals-day-march-2026`. They are historical context, not new trigger tags.
- Use GHL tags and notes as the source of truth for membership, shop interest, questions, and follow-up.

## The Inbox Axis (verified 2026-09-05)

Two tags decide whether a person appears on the "waiting on a human" list. Everything else in
this document is segmentation.

| Tag | Means | Live count (2026-09-05) |
| --- | --- | --- |
| `project:act-hv` | belongs to The Harvest | 342 |
| `act-inquiry` | a human is expected to reply | 17 on Harvest, 29 location-wide |

Rules:
- One `project:act-XX` per contact, applied at capture. The code form (`project:act-hv`) is
  canonical across ACT. Hyphen forms are strays: `project-harvest` (2 contacts), `project-goods`
  (14). `act-hv` exists in the tag library with zero contacts and should be deleted.
- Every form whose submitter expects a reply applies `act-inquiry`. Today only the contact form
  does. Shop EOI, venue enquiry and member question rely on their own tags
  (`shop-follow-up`, `venue-enquiry`, `member-question`), which `scripts/report-ghl-waiting.ts`
  honours as legacy until the handlers are updated.
- `harvest-website`, `harvest-inbox`, `source:website` are source and state tags. None of them
  means "asked something", and none of them is a project tag.

The list itself: `npm run waiting:ghl`. See `ghl-pipeline-playbook.md`, "How to get back to
people", for why the Conversations tab cannot show this on its own.

## Flow Tags

> Reconciled to website code 2026-05-29. The code (`server/routers.ts` `buildNewsletterTags` + the Supabase edge functions `contact-form` / `community-submit`) is the source of truth for tags; this doc is kept in sync with it.

| Flow | Tags applied by the website | Workflow env var |
| --- | --- | --- |
| Newsletter signup | `comms:harvest-newsletter`, `harvest-website`, selected `interest:*` tags, one `source:*` tag when provided; if `notes` field filled: `member-comments` + `harvest-inbox` | `GHL_NEWSLETTER_WORKFLOW_ID` |
| Membership signup | Newsletter tags plus `tier:member`, `interest:membership` | `GHL_MEMBER_WELCOME_WORKFLOW_ID`, fallback `GHL_NEWSLETTER_WORKFLOW_ID` |
| Member question | Membership tags plus `member-question` + `harvest-inbox` | `GHL_MEMBER_QUESTION_WORKFLOW_ID`, fallback `GHL_CONTACT_FORM_WORKFLOW_ID` |
| Members wall | `member-wall`, `harvest-member`, `interest-membership`, `interest-community`, `harvest-website` (no workflow triggered) | none |
| Shop EOI | `project:act-hv`, `role:supplier`, `interest:markets`, `shop-follow-up`, `shop-stage-1`, one shop offer tag | `GHL_SHOP_INTEREST_WORKFLOW_ID`, fallback `GHL_CONTACT_FORM_WORKFLOW_ID` |
| Witta Gathering RSVP | Embedded public form is live. Sets `witta-gathering-2026-06-20`, `rsvp-pizza-dinner`, `harvest-event-attendee`, `harvest-website`, `harvest-inbox`, `Event: Witta Gathering - 2026-06-20`, `Event type: Public launch (50-150)`, `Access: Open registration (Public)`. `GHL_GATHERING_RSVP_WORKFLOW_ID` points at the dedicated June 20 receipt workflow. | `GHL_GATHERING_RSVP_WORKFLOW_ID` |
| Photo wall | `photo-wall`, `harvest-website`, `harvest-gathering-photos`; also `harvest-inbox` when a response is filled; also `photo-wall-ready` when `notifyAll` is used | `GHL_PHOTO_WALL_WORKFLOW_ID` |
| Contact form (Supabase edge fn `contact-form`) | `contact-form`, `harvest-website`, `harvest-inbox`, `act-inquiry`, `project:act-hv`, optional `comms:harvest-newsletter`; creates a Harvest Inbox card | `GHL_CONTACT_FORM_WORKFLOW_ID` |
| Event submission | `event-submission`, `harvest-website`, `harvest-inbox` | `GHL_EVENT_SUBMIT_WORKFLOW_ID` |
| Business registration | `business-registration`, `harvest-website`, `harvest-inbox` | `GHL_BUSINESS_REG_WORKFLOW_ID` |
| Workshop booking | `workshop-booking`, `harvest-website`, `harvest-inbox` | `GHL_WORKSHOP_WORKFLOW_ID` |
| Community / GetInvolved (Supabase edge fn `community-submit`) | `harvest-website`, `harvest-inbox`; by type: `community-idea` / `residency-applicant` / `business-interest` / `workshop-suggestion` / `story-feature` / `venue-enquiry`; dynamic: `idea-<type>` / `biz-<type>` / `residency-<type>` | none wired yet |
| Pulse survey | `pulse-respondent`, `harvest-website`, dynamic `interest-*` tags | `GHL_PULSE_WORKFLOW_ID` |
| Visitor quiz | `quiz-completed`, `harvest-website`, persona tags | `GHL_QUIZ_WORKFLOW_ID` |

## Workflow Definition Check

Status on 2026-05-14: workflow existence, published status, versions, contact state, tag state, and env wiring are verified. Internal workflow builder steps/actions are not verified because the available HighLevel API and connector do not expose the action graph.

Verified API evidence:

- `GET /workflows/?locationId=...` returns 19 workflows.
- API versions checked: `2021-07-28` and `2023-02-21`.
- Returned workflow fields only: `id`, `name`, `status`, `version`, `createdAt`, `updatedAt`, `locationId`.
- Direct detail/action probes returned `404`: `/workflows/:id`, `/workflows/:id/steps`, `/workflows/:id/actions`, `/workflows/:id/triggers`, `/workflows/:id/versions`, `/workflows/:id/executions`, `/workflows/:id/history`.
- HighLevel connector `_search` resolved the workflow request to opportunities, not workflow definitions.
- HighLevel connector `_fetch` for a workflow ID returned `fetch tool not found or not active`.

Observed Harvest workflows:

| Workflow | ID | Status | Version | Internal steps/actions |
| --- | --- | --- | --- | --- |
| Harvest - Contact Form Receipt | `93596cb4-f100-4961-b9c3-759313827b8d` | `published` | `3` | Receipt delivered in live contact test on 2026-06-11 |
| Harvest - Shop Interest Receipt | `ff4ff43e-0174-415d-828e-3610f5386de5` | `published` | `6` | Receipt/card/tags verified by shop EOI test on 2026-06-11 |
| Harvest - June 20 RSVP Receipt | `95d515a6-10ec-4506-8d5d-b14727b1bafb` | `published` | `3` | Receipt delivered in RSVP test on 2026-06-11 |
| Harvest Locals Day | `ea8bf9b7-a012-4f8c-b5e8-4a73b4ac5ae1` | `published` | `4` | Not API-accessible |
| Harvest --- EOI Gathering Confirmation | `ca37ba92-5a8b-4209-9b88-34fc924c5393` | `published` | `7` | Not API-accessible |
| Newsletter Signup | `0c61347a-b59b-4de5-ae90-32a59c8e4805` | `published` | `3` | Not API-accessible |
| Witta Gathering Photos | `65819e73-09c8-4598-b982-41dfeeb8624e` | `published` | `3` | Not API-accessible |

Confirmed live effect:

- Live shop EOI test through the production site triggered the contact-form fallback workflow and created an inquiry opportunity in GHL. The resulting contact had `harvest-shop-interest`, `harvest-website`, `shop-follow-up`, `shop-produce`, and the workflow-added `engagement:lead`.
- Live contact-form test through the Supabase edge function returned `workflowTriggered: true`, `opportunityCreated: true`, canonical tags, and a Harvest Inbox card on 2026-06-11. Test data was deleted.
- Dedicated RSVP test with `GHL_GATHERING_RSVP_WORKFLOW_ID=95d515a6-10ec-4506-8d5d-b14727b1bafb` created the GHL contact, canonical June 20 RSVP tags, a Harvest Inbox card, and delivered the receipt email "You're on the list for 20 June" on 2026-06-11. After a Vercel production redeploy from the prior production deployment, the live `https://www.theharvestwitta.com.au` RSVP endpoint repeated the same result. Test data was deleted.
- Shop EOI now uses `Harvest - Shop Interest Receipt` when `GHL_SHOP_INTEREST_WORKFLOW_ID` is configured. It falls back to contact only if that env var is blank.
- Dedicated local shop EOI test with `GHL_SHOP_INTEREST_WORKFLOW_ID=ff4ff43e-0174-415d-828e-3610f5386de5` created the GHL contact, shop tags, and shop EOI note.

Remaining manual check:

- Open each remaining workflow in the GHL workflow builder and inspect the trigger and action blocks directly. The contact-form workflow was checked manually on 2026-05-14.
- Confirm the member welcome workflow is not using a broad `harvest-member` tag trigger without excluding `member-question`.

## Interest Tags

These are used by newsletter signup and can be used for segmented sends.

| Interest | GHL tag |
| --- | --- |
| Events | `interest-events` |
| Workshops | `interest-workshops` |
| Markets | `interest-markets` |
| Venue hire | `interest-venue` |
| Garden | `interest-garden` |
| Food and kitchen | `interest-food` |
| Community | `interest-community` |
| Volunteering | `interest-volunteer` |
| Membership | `interest-membership` |
| Sustainability | `interest-sustainability` |

## Newsletter Source Tags

The `heardAbout` field on the newsletter / follow form sets one source tag. Use these for origin-channel analysis only, not for workflow branching.

| How they heard | GHL tag |
| --- | --- |
| Referral / word of mouth | `source-referral` |
| Social media | `source-social` |
| Local / Witta community | `source-local-witta` |
| Other | `source-other` |

Note: `interest-community` is hardcoded on every footer "follow along" submission regardless of which interest checkboxes are ticked. It is not a no-interest follow.

Note on intentional dual-tagging: `newsletter` + `harvest-newsletter` are both applied deliberately. `harvest-newsletter` scopes sends to Harvest contacts only; `newsletter` is kept for any cross-location tooling. Similarly `interest-membership` + `harvest-member` are both applied on membership sign-up for the same scoping reason. Do not remove either tag of either pair.

## Mighty Mirror Tags

These tags were created in the GHL tag library on 2026-06-12 with `npm run ensure:mighty-tags:ghl`.
They are record tags for the manual Mighty trial, not automation triggers.

| Mighty bridge use | GHL tag |
| --- | --- |
| Sent a Mighty invite | `platform:mighty-invited` |
| Joined Mighty | `platform:mighty-active` |
| Joined but inactive after review | `platform:mighty-dormant` |
| Garden crew | `pod:garden` |
| Shop maker crew | `pod:shop-makers` |
| Event / kitchen crew | `pod:events` |
| Asked a practical Mighty question | `signal:asked-question` |
| Offered help in a way that needs human review | `signal:help-offered` |

Rule: add these by hand during the Monday sweep until the first 10 to 15 invite test proves the flow. Do not let Mighty automatically move GHL stages, audience membership, or consent state.

## Member System Tags

These tags were created in the GHL tag library on 2026-06-12 with `npm run ensure:member-system-tags:ghl`.
They describe membership level and recognition. They do not grant Mighty access by themselves.

| Member system use | GHL tag |
| --- | --- |
| Ordinary community member | `member-level:community` |
| Gifted founding/lifetime member | `member-level:founding-lifetime` |
| Active practical contributor | `member-level:contributor` |
| Trusted host/moderator/operator | `member-level:steward` |
| Helped the build materially | `recognition:build-contributor` |

Rule: every membership level still sits under `tier:member`. Use `member-level:*` for the promise and recognition, `pod:*` for what they help with, and `platform:mighty-*` for the Mighty invite/join state.

## Shop Tags

Use `interest:markets` as the primary shop-interest trigger. Branch inside GHL by offer tag.
Keep `shop-follow-up` as the catch-all for people who want to shape the shop without offering a
specific product yet.

| Shop offer | GHL tag |
| --- | --- |
| Shop prospect, imported or manually identified | `shop-prospect` |
| Produce | `shop-produce` |
| Handmade goods | `shop-maker` |
| Food, preserves, ferments, baking, drinks | `shop-food` |
| Shared shelf or consignment | `shop-consignment` |
| Help shape the shop | `shop-follow-up` |

## Quiz Persona Tags

| Persona | GHL tags |
| --- | --- |
| Regular | `quiz-regular`, `high-frequency`, `community-builder` |
| Maker | `quiz-maker`, `workshop-interested`, `hands-on-learner` |
| Gatherer | `quiz-gatherer`, `venue-interested`, `event-host` |
| Grower | `quiz-grower`, `garden-interested`, `plant-buyer` |
| Explorer | `quiz-explorer`, `first-timer`, `curious-visitor` |

All quiz contacts also receive `quiz-completed` and `harvest-website`.

## Current Live Audit

Run:

```bash
npm run audit:contacts:ghl
```

Verified result from a read-only audit on 2026-06-02:

| Check | Status |
| --- | --- |
| GHL contacts scanned | `1152` |
| Harvest contacts found | `160` |
| Canonical tag refreshes needed | `0` |
| Missing names | `13`, already tagged for review |
| Harvest duplicate email groups | `0` |
| Harvest duplicate phone groups | `0` |

## Engagement Ladder Stages

The engagement ladder named in `docs/strategy/community-engagement-launch-plan.md` maps onto tags and the Notion Harvest Engagement DB status field that already exist. No new tags are required to run it.

| Rung | What the person gets | GHL tag | Engagement DB status |
| --- | --- | --- | --- |
| Receive | A fortnightly or seasonal story. No ask. | `harvest-newsletter` | Initial Contact |
| Show up | Open work days, events, garden visits. | event / RSVP tags | Participating |
| Use it | Content and resources useful for their own goals. | `interest-*` tags | Participating |
| Make it | Owns a mini-project. | `interest-volunteer` plus collaborator tags | Participating |
| Hold it | Named, ongoing member or steward. | `harvest-member` | deeper / named |

Note: the follow-vs-member split is live as of 2026-05-27. The footer "follow along" intake applies `harvest-newsletter` without `harvest-member` (Receive rung); the `/membership` "join" intake adds `harvest-member` (Hold-it rung). The split is enforced in `buildNewsletterTags` (`server/routers.ts`), which only adds `harvest-member` when `member: true` or interests include membership.

## Automation Trigger Recommendations

- Newsletter send: trigger/filter on `harvest-newsletter`.
- Member onboarding: trigger on `harvest-member`.
- Member wall display: filter on `member-wall` (no workflow fires; this is a display/filter tag only).
- Member questions: trigger on `member-question`; contacts also carry `harvest-inbox` for inbox routing.
- Shop follow-up: trigger on `interest:markets`, then branch by `shop-produce`, `shop-maker`, `shop-food`, or `shop-consignment`.
- Current event RSVP: trigger on `witta-gathering-2026-06-20` or `harvest-event-attendee`.
- Photo wall follow-up: trigger on `photo-wall` or `harvest-gathering-photos`; use `photo-wall-ready` to filter contacts with a response ready to display.
- Contact form: trigger on `contact-form`; ACT notification routing uses `act-inquiry` + `project:act-hv` (the doc previously said `project-harvest`, a stray hyphen tag on 2 contacts).
- Inbox triage: filter on `harvest-inbox` --- set by event submission, business registration, workshop booking, member question, photo wall response, community submit, and gathering RSVP handler.
- Community / GetInvolved triage: filter by type tag (`community-idea`, `residency-applicant`, `business-interest`, `workshop-suggestion`, `story-feature`, `venue-enquiry`).

## Calendar Booking Tags

Each GHL booking calendar applies a tag on booking so RSVPs flow into the engagement
system. A calendar does not tag reliably from its own settings, so use a one-step workflow
per calendar: trigger *Customer Booked Appointment*, filter *Calendar is X*, action *Add Tag*.

| Calendar | Tags on booking | Note |
| --- | --- | --- |
| RSVP - 20 June maker session (10am-2pm), ID `M0KzSu7Bo3jJ3ZQta3ag` | `witta-gathering-2026-06-20` + `rsvp-maker-morning` | Calendar is live. Tag workflow still needs GHL UI build. |
| RSVP - 20 June afternoon + pizza (from 2pm), ID `4IpU9GnzAChTMkKFJPWi` | `witta-gathering-2026-06-20` + `rsvp-pizza-dinner` | Calendar is live. `rsvp-pizza-dinner` count = the pizza dough headcount after workflow is live. |
| Book a chat about the shop, ID `viM1BRnHG9gwpIEZd4HM` | `project:act-hv` + `interest:markets` + `shop-call-booked` | Calendar is live with Ben/Nicholas as current GHL users. Move to Susie/Joey after their users exist. |

Tags verified present in the GHL tag library: `rsvp-maker-morning`, `rsvp-pizza-dinner`, `project:act-hv`, `interest:markets`, `shop-call-booked`.

Do NOT auto-apply `harvest-newsletter` or `harvest-member` on an RSVP. An event yes is not a
subscribe; invite event guests to follow in the post-event recap, by choice.

## Operational Commands

```bash
npm run audit:contacts:ghl
npm run setup:june-sprint-calendars:ghl
npm run count:rsvps:ghl
npm run refresh:contacts:ghl
npm run prepare:contacts:ghl
```

Use `refresh:contacts:ghl` for safe canonical tag alignment. Use `prepare:contacts:ghl` only when you also want name backfill and review tags applied.
