# Launch staging - 20 June 2026

> Created 2026-06-09. Execution view for the public open day, website page, GHL intake, Notion planning, social, and newsletters.
>
> Current truth updated 2026-06-11: Saturday 20 June 2026 is a public, free-ticket launch afternoon. Witta Market runs 7am to 12pm; The Harvest gate opens from 1pm; people make, walk, ask questions, make pizzas through the afternoon, and finish early. Older member-only, proof-night, and pizza-from-5pm copy is historical only.

## Current read

The Facebook signal is clear: the milk crate works are doing the job. They are making locals notice, ask, object, defend, laugh, and imagine uses for the place.

Use that. Do not make the launch feel like a polished venue announcement. The public line is:

```text
The gate opens after the Witta Market on Saturday 20 June.
Come see the garden, make something small with us, and help shape what comes next.
```

The deeper method:

```text
art first -> question second -> invitation third -> GHL records chosen action
```

## Verified on 2026-06-09

- `/june-20` route exists and renders `GardenLaunch`.
- The page has the right public frame: free ticket, gate from 1pm, everyone welcome.
- The page already uses `/get-involved?form=idea`, and that route does select the idea form.
- `/june-20` now has an embedded public RSVP form. It upserts a GHL contact and applies `witta-gathering-2026-06-20` + `rsvp-pizza-dinner`.
- Browser tests on 2026-06-09 confirmed the RSVP form success state and GHL contact tags locally and in production. Test contacts were deleted afterwards.
- Production deploy completed on 2026-06-09. Live URL: `https://www.theharvestwitta.com.au/june-20`.
- `npm run report:social:ghl` worked and found 15 GHL Social Planner posts, but not the new 20 June launch series.
- `npm run report:launch-gates:ghl` now runs cleanly. It reports the website RSVP path as good and the remaining GHL workflow/user items as blocked.
- A Notion working page was created: `Harvest launch staging - 20 June 2026`.

## Blocked

| Gate | Owner | Next action |
| --- | --- | --- |
| Public RSVP | Good | Embedded website form is live in production and writes the correct GHL tags. |
| Website RSVP env | Removed | `VITE_GHL_IM_COMING_URL` is no longer required for anonymous public RSVP. Keep the GHL trigger-link path only for tracked email clicks if needed later. |
| GHL readiness | Ben | Build/publish the remaining GHL workflows in the UI and create Susie/Joey users. Name presence is not proof. |
| Social launch series | Ben / comms | Schedule the works-led launch series in GHL Social Planner, then pull back to Notion. |
| Operating gates | Ben / Nic | Confirm insurance, food safety, pizza lead, roster, parking, and photo consent path. |

## Website page

Tone is mostly right. It feels like someone standing at the gate, not a venue brochure.

Keep:

- "The gate opens."
- "Come for the afternoon."
- "One tap, so there's enough dough. That's all it does."
- The simple three ways in: coming, shelf, idea.

Improve:

- Put the first works before the day layout, because current Facebook energy is entering through Milk Man and the Milk Crate Pavilion.
- Make the question wall explicit on the page.
- Keep the shop as one supporting path, not the headline.

Current page order should be:

1. Hero.
2. Quick facts.
3. What it is.
4. First works and question wall.
5. Shape of the day.
6. Ways in.
7. Shop note.
8. Social and collection links.

## GHL intake

Do not infer too much from Facebook comments. GHL records what people choose to do.

| Door | GHL record |
| --- | --- |
| I'm coming | `rsvp-pizza-dinner`, `witta-gathering-2026-06-20` |
| Maker morning | `rsvp-maker-morning`, `witta-gathering-2026-06-20` |
| Shop / local maker | `project:act-hv`, `role:supplier`, `interest:markets` |
| Garden help | `role:volunteer`, `interest:garden` |
| Kitchen / food | `interest:kitchen`; add `role:volunteer` or `role:partner` only after human read |
| Art / story / object | `interest:art` or `interest:stories`; human follow-up |
| Local business | `role:partner`, `interest:local-business`; human follow-up |
| Elders / storytellers / community lane | `lane:community`; no automation |

Hard rules:

- RSVP never subscribes someone.
- Broadcasts never add tags.
- A Facebook comment is not a tag.
- A person climbs the membership journey only after doing something real, by hand.

## Day layout

Keep it loose, but give the crew enough structure.

| Time | Shape | Notes |
| --- | --- | --- |
| 10am-1pm | Maker/doer session if still confirmed | Quiet session, not public-facing. Align B1 calendar if this shifts from 10am-2pm. |
| 1pm | Public gate opens after Witta Market | Signs, welcome point, water, toilets clear. |
| 1pm-2pm | Walk the place | Garden, Milk Man, Milk Crate Pavilion, shop shelf idea, question wall. |
| 2pm-4pm | Make small things together | Signs, crates, garden jobs, question wall, table setup, kids chalk. |
| Mid afternoon | Make pizzas | Free, simple, count from `rsvp-pizza-dinner` plus local judgement. Use garden herbs/produce only if ready. |
| Late afternoon | Close cleanly | Thank people, point to shop/maker/garden next steps, send people to Flight Bar separately if they want drinks. |

## Physical capture

Paper first. QR second.

Use five sheets:

- Garden hands.
- Shop makers and growers.
- Kitchen and food.
- Art, stories, objects, photos.
- Local businesses.

Use the question wall:

- What should this place hold?
- What should this place not become?
- What can you bring?

Monday sweep types the sheets into GHL and notes any follow-up owed.

## Notion planning

Use one content board for launch work. Suggested statuses:

- Idea
- Drafted
- Needs asset
- Needs consent
- Scheduled in GHL
- Published
- Pulled back from GHL
- Follow-up needed

Suggested fields:

- Channel
- Audience
- CTA
- Website door
- GHL tag
- Owner
- Publish date
- Asset status
- Consent status
- Notes from Facebook

Do not use Notion as the publishing tool. GHL publishes. Notion records.

## Social staging

### Phase 1 - 9 to 13 June: works into invitation

Job: turn current Facebook attention into a clean reason to come.

Posts:

1. Milk Man: "not selling milk, starting conversations."
2. Milk Crate Pavilion: useful object, dairy memory, gathering shape.
3. Question response: some people love it, some people ask hard questions, good.
4. Behind him: garden, shop, kitchen, art space, open day.

Facebook can carry longer practical captions. Instagram should stay more visual and shorter.

### Phase 2 - 14 to 19 June: practical clarity

Job: remove uncertainty.

Posts:

1. One week to go.
2. What happens on the day.
3. What to bring.
4. Kids / parking / food.
5. Tomorrow.

### Phase 3 - 20 June: live day

Job: capture evidence, not perform.

Only post live if the day is steady. Prioritise hands, objects, signs, garden, food, and wide shots. No close face photos without consent.

### Phase 4 - 21 to 27 June: after-story

Job: sort signal into the next rhythm.

Posts:

1. Thank you.
2. What people wrote on the wall.
3. The first shelf call.
4. Garden hands call.
5. Next work day or holding line.

## Social copy starters

### Milk Man

```text
The Milk Man has already started doing his job.

Not selling milk. Starting conversations.

Some people see Witta's dairy history. Some people see a strange figure at the edge of a new place. Some people are asking what he means.

Good.

The first works at The Harvest are not here to decorate a finished venue. They are here to ask what this place should become.

The gate opens Saturday 20 June at 9 Gumland Drive, Witta.
Bring a question.
```

### Behind him

```text
Someone asked what is going on behind him.

Behind him is the next part of the story: garden, shed, shop, food, art, and a place slowly being made by local hands.

The gate opens Saturday 20 June from 1pm.
Come and see what is taking shape.
```

### Practical week

```text
Saturday 20 June.

The gate opens after Witta Market, from 1pm.

Free ticket. Everyone welcome. Kids welcome. Bring a chair if you have one, and shoes for walking through a garden.

9 Gumland Drive, Witta.
Tap I'm coming so there is enough dough.
```

## Newsletter staging

### 1. Members

Subject: Saturday 20 June at The Harvest

Preview: The gate opens after Witta Market. A practical note for members.

```text
Hi {{contact.first_name}},

Saturday 20 June is the first public open day at The Harvest.

The gate opens after Witta Market, from 1pm. Come for the part that suits you, or stay for the afternoon.

You will see the garden, the first works, the Milk Crate Pavilion, the shop idea, and the question wall. Nothing is finished. That is why the day matters.

Through the afternoon we will make small things together, then make pizzas together.

If you are coming, get a free ticket so we make enough dough:
[RSVP LINK]

A few practical bits:

- The Harvest, 9 Gumland Drive, Witta.
- Wear shoes for walking through a garden.
- Bring a hat and water.
- Kids are welcome.
- If you want to bring a chair, bring one.

See you in the garden,
The Harvest
```

### 2. Shop / makers

Subject: A shelf for what Witta and Maleny already make

Preview: Come through on 20 June, or put your name down for the shop.

```text
Hi {{contact.first_name}},

The first shop at The Harvest will be simple: a shared shelf for what people around Witta and Maleny already grow and make.

Produce. Objects. Preserves. Useful things. Small batches. Things with a name and a person behind them.

If that sounds like you, put your name down here:
theharvestwitta.com.au/shop

If you want to see the place first, come through on Saturday 20 June. Witta Market runs in the morning; The Harvest gate opens after it, from 1pm.

The shop will not be solved in a form. The form just helps us know who to talk to.

See you at the shelf,
The Harvest
```

### 3. Public newsletter

Subject: The gate opens Saturday 20 June

Preview: After the Witta Market, come walk the garden and make pizza with us.

```text
Hi {{contact.first_name}},

The gate opens at The Harvest after Witta Market on Saturday 20 June.

Come walk the garden, see the first works, leave a thought on the question wall, make something small, and make pizza with us.

You do not need to bring anything. If you are the sort of person who likes to bring something, bring a chair, a question, a story, or a pair of hands.

Saturday 20 June.
From 1pm.
9 Gumland Drive, Witta.

Get a free ticket so we make enough dough:
[RSVP LINK]

See you at the gate,
The Harvest
```

### 4. Post-event members

Write this after the day. Do not pre-fill fake detail.

Required ingredients:

- One verified number.
- One human moment.
- One thing the question wall said.
- One thing that did not work and will change.
- One next step.

### 5. Post-event shop group

Write this after the day.

Required ingredients:

- What makers asked.
- What customers wanted.
- What the first shelf needs.
- Link to `/shop`.

## Execution order

1. Deploy the `/june-20` embedded RSVP form.
2. Submit one production test RSVP, verify tags, then remove the test contact.
3. Run `npm run count:rsvps:ghl`.
4. Schedule the first four works-led posts in GHL Social Planner.
5. Pull GHL social records back to Notion.
6. Send member note once RSVP link is tested.
7. Send shop/maker note to maker segment.
8. Run practical public post series from 14 June.
9. Print question wall and five paper sheets.
10. Monday sweep after launch.
