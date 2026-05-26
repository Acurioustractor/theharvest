# Harvest GHL Tag And Automation Map

Last verified: 2026-05-14

This is the operating map for Harvest contacts in GoHighLevel. The website creates or updates contacts, applies tags, adds notes where useful, and triggers workflows when a workflow env var is configured.

## System Rules

- Use `harvest-website` as the base tag for every contact created by the Harvest website.
- Use `harvest-newsletter` for Harvest newsletter sends. Do not rely on the generic `newsletter` tag alone because the GHL location also holds non-Harvest contacts.
- Prefer workflow-ID enrolment from the website for active forms. Keep broad tags for filtering, not branching. If a tag trigger is used, add exclusions so question or contact paths do not receive the wrong welcome.
- Do not remove legacy tags such as `act-hv`, `eoi-gathering-march-2026`, or `locals-day-march-2026`. They are historical context, not new trigger tags.
- Use GHL tags and notes as the source of truth for membership, shop interest, questions, and follow-up.

## Flow Tags

| Flow | Tags applied by the website | Workflow env var |
| --- | --- | --- |
| Newsletter signup | `newsletter`, `harvest-newsletter`, `harvest-website`, selected interest tags | `GHL_NEWSLETTER_WORKFLOW_ID` |
| Membership signup | Newsletter tags plus `harvest-member`, `interest-membership` | `GHL_MEMBER_WELCOME_WORKFLOW_ID`, fallback `GHL_NEWSLETTER_WORKFLOW_ID` |
| Member question | Membership tags plus `member-question` | `GHL_MEMBER_QUESTION_WORKFLOW_ID`, fallback `GHL_CONTACT_FORM_WORKFLOW_ID` |
| Shop EOI | `harvest-shop-interest`, `harvest-website`, `shop-follow-up`, one shop offer tag | `GHL_SHOP_INTEREST_WORKFLOW_ID`, fallback `GHL_CONTACT_FORM_WORKFLOW_ID` |
| Current gathering RSVP | Dormant. Public Garden Launch RSVP form is disabled for this phase | Leave `GHL_GATHERING_RSVP_WORKFLOW_ID` unset until reopened |
| Photo wall | `photo-wall`, `harvest-website`, `harvest-gathering-photos` | `GHL_PHOTO_WALL_WORKFLOW_ID` |
| Contact form | `contact-form`, `harvest-website`, optional `newsletter`, `harvest-newsletter` | `GHL_CONTACT_FORM_WORKFLOW_ID` |
| Event submission | `event-submission`, `harvest-website` | `GHL_EVENT_SUBMIT_WORKFLOW_ID` |
| Business registration | `business-registration`, `harvest-website` | `GHL_BUSINESS_REG_WORKFLOW_ID` |
| Workshop booking | `workshop-booking`, `harvest-website` | `GHL_WORKSHOP_WORKFLOW_ID` |
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
| Contact Form to Universal Inquiry | `f0c1f3db-8809-4283-ba91-907626ac0bb7` | `published` | `5` | Contact receipt email action verified in builder |
| Harvest - Shop Interest Receipt | `ff4ff43e-0174-415d-828e-3610f5386de5` | `published` | `3` | Shop-specific receipt workflow |
| Harvest Locals Day | `ea8bf9b7-a012-4f8c-b5e8-4a73b4ac5ae1` | `published` | `4` | Not API-accessible |
| Harvest — EOI Gathering Confirmation | `ca37ba92-5a8b-4209-9b88-34fc924c5393` | `published` | `7` | Not API-accessible |
| Newsletter Signup | `0c61347a-b59b-4de5-ae90-32a59c8e4805` | `published` | `3` | Not API-accessible |
| Witta Gathering Photos | `65819e73-09c8-4598-b982-41dfeeb8624e` | `published` | `3` | Not API-accessible |

Confirmed live effect:

- Live shop EOI test through the production site triggered the contact-form fallback workflow and created an inquiry opportunity in GHL. The resulting contact had `harvest-shop-interest`, `harvest-website`, `shop-follow-up`, `shop-produce`, and the workflow-added `engagement:lead`.
- Local contact-form test through the live Supabase edge function returned `workflowTriggered: true` after fixing the workflow endpoint and adding the contact receipt email action.
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

## Shop Tags

Use `harvest-shop-interest` as the primary trigger. Branch inside GHL by offer tag.

| Shop offer | GHL tag |
| --- | --- |
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

Verified result after refresh on 2026-05-14:

| Check | Status |
| --- | --- |
| GHL contacts scanned | `873` |
| Harvest contacts found | `101` |
| Canonical tag refreshes needed | `0` |
| Canonical tags in GHL location tag library | `49/49` |
| Missing names | `20`, already tagged for review |
| Harvest duplicate email groups | `0` |
| Harvest duplicate phone groups | `1`, already covered by duplicate review handling |

## Engagement Ladder Stages

The engagement ladder named in `docs/strategy/community-engagement-launch-plan.md` maps onto tags and the Notion Harvest Engagement DB status field that already exist. No new tags are required to run it.

| Rung | What the person gets | GHL tag | Engagement DB status |
| --- | --- | --- | --- |
| Receive | A fortnightly or seasonal story. No ask. | `harvest-newsletter` | Initial Contact |
| Show up | Open work days, events, garden visits. | event / RSVP tags | Participating |
| Use it | Content and resources useful for their own goals. | `interest-*` tags | Participating |
| Make it | Owns a mini-project. | `interest-volunteer` plus collaborator tags | Participating |
| Hold it | Named, ongoing member or steward. | `harvest-member` | deeper / named |

Note: the website currently tags both footer and `/membership` signups as `harvest-member`, which collapses Receive into Hold-it. Making the Receive rung real needs a separate lighter "follow along" intake that applies `harvest-newsletter` without `harvest-member`. Tracked as a roadmap action.

## Automation Trigger Recommendations

- Newsletter send: trigger/filter on `harvest-newsletter`.
- Member onboarding: trigger on `harvest-member`.
- Member questions: trigger on `member-question`.
- Shop follow-up: trigger on `harvest-shop-interest`, then branch by `shop-produce`, `shop-maker`, `shop-food`, or `shop-consignment`.
- Current event RSVP: trigger on `witta-gathering-2026-06-20`.
- Photo wall follow-up: trigger on `photo-wall` or `harvest-gathering-photos`.
- Contact form: trigger on `contact-form`.

## Operational Commands

```bash
npm run audit:contacts:ghl
npm run refresh:contacts:ghl
npm run prepare:contacts:ghl
```

Use `refresh:contacts:ghl` for safe canonical tag alignment. Use `prepare:contacts:ghl` only when you also want name backfill and review tags applied.
