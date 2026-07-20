# Artworks launch signal brief - 7 June 2026

> Status: working brief.
> Image note updated 2026-06-07: the two referenced screenshots were found in
> `/Users/benknight/Downloads/Recents/`. They are screenshots of a local Facebook thread, not clean
> artwork photos. Use them as internal evidence of community response only. Do not publish the
> screenshots without permission from the commenters and group owner.

## Current launch frame

Saturday 20 June 2026 is currently a **public open day**, per
`docs/strategy/RECONCILED-20-june-public-open-day-2026-06-03.md`.

Do not use the older capped proof-night or private members' day language unless Ben changes the
decision again. The live frame is: the gate opens, everyone welcome, with operational gates still
to clear around insurance, pizza, food safety, roster, and parking.

## The useful read

The Milk Man and the giant milk crate are not decorations.

They are public questions.

That is the launch value. They let people ask, "what is this place?" without The Harvest needing to
answer with a polished venue sentence. They give locals something to react to, argue with, support,
photograph, remember, and add to.

The clean public answer is:

```text
The Harvest is a garden, kitchen, and art space taking shape in Witta.
The first works are asking what this place should hold.
```

The deeper read:

- **Milk Man** carries dairy memory, local labour, service, delivery, routine, and a bit of oddness.
- **Giant milk crate** carries co-operative infrastructure: stacked, shared, returned, borrowed,
  useful, modular, not precious.
- Together they say: this place is made from local objects, old systems, and current hands.
- The community response is part of the work. Support, jokes, scepticism, questions, offers, and
  complaints are all signal.

The mistake would be to make the art sound like a finished interpretation.

The better move is to let it open the conversation:

```text
Some people see a crate.
Some people see the dairy history of the ridge.
Some people see a good place to sit.
Some people are still asking what the hell it is.

Fair.

That is why we are opening the gate.
```

## Source notes

### Screenshot 1 - initial question and early responses

| Field | Value |
| --- | --- |
| Asset name | `IMG_2177.PNG` |
| Local path | `/Users/benknight/Downloads/Recents/IMG_2177.PNG` |
| Source | Screenshot of the Witta & Curramore Chit Chat Facebook group |
| Captured | 7 June 2026, about 10:29am Brisbane time |
| What it shows | A public question about the "eyesore" next to the Nest, plus visible responses defending the work, questioning fit, and supporting the place |
| People visible | Commenter names, profile images, and group identity are visible |
| Consent | Not confirmed |
| Rights | Facebook/community screenshot. Internal planning only unless permission is secured |
| Publish decision | Do not use as public media. Use as private evidence of live community response |
| Useful signal | Safety/legal concern, neighbour defence, local enthusiasm, city-vs-local tension, clear proof that the artwork is already making people talk |

### Screenshot 2 - response spread

| Field | Value |
| --- | --- |
| Asset name | `IMG_2178.PNG` |
| Local path | `/Users/benknight/Downloads/Recents/IMG_2178.PNG` |
| Source | Screenshot of the same Witta & Curramore Chit Chat thread |
| Captured | 7 June 2026, about 10:29am Brisbane time |
| What it shows | More comments ranging from "looks cool" to "it's art" to "misaligned with Witta" and "engineered?" |
| People visible | Commenter names, profile images, and group identity are visible |
| Consent | Not confirmed |
| Rights | Facebook/community screenshot. Internal planning only unless permission is secured |
| Publish decision | Do not use as public media. Use as private evidence of sentiment range |
| Useful signal | The public frame must make room for support, critique, safety questions, and curiosity without becoming defensive |

### Empathy Ledger media lookup

Checked 2026-06-07 via the local Empathy Ledger content hub API:

```text
GET /api/v1/content-hub/media?project=the-harvest&limit=50&page=N
```

Result:

| Check | Result |
| --- | --- |
| Harvest media records returned | 462 |
| Records matching `milk`, `crate`, or `pavilion` | 56 |
| Records matching `milk man`, `milkman`, `figure`, `sculpture`, `statue`, `artwork`, `robot`, `nest`, or `sign` in metadata | 0 |
| Why Milk Man did not appear in text search | Milk Man records exist as untagged `upload` media with filename-only alt text |
| Slot source that resolved Milk Man images | `ops/backups/harvest-image-overrides-2026-05-13.json` |
| Visual check | Downloaded 21 candidate images to `/tmp/harvest-el-candidates/` and built `/tmp/harvest-el-candidates/contact-sheet.jpg` |

Use this source path when publishing: content hub media record first, slot override second. Do not use
the Facebook screenshots as media assets.

### Recommended launch media

| Use | Candidate | Empathy Ledger media ID | Slot/source | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Post 1 - Milk Man hero | `20260423-1E5A4420.jpg` | `95f88438-1ea0-4b5f-adda-8cbf2eebb28d` | `the-milk-man-card` in `ops/backups/harvest-image-overrides-2026-05-13.json` | Source found, not publish-ready | Best first-post image visually: wide horizontal, full figure in place, site context visible, not cropped too tight. Live content hub confirms the record exists but has `consentObtained: false`. Fix or manually approve that before scheduling. |
| Work page / alternate Milk Man | `20260423-1E5A4423.jpg` | `33556076-3356-4f01-b9ca-fedc4eb8906e` | `the-milk-man-hero` | Source found, not publish-ready | Strong vertical artwork hero. Tighter crop than the card image. Live content hub confirms `consentObtained: false`. |
| Post 2 - giant milk crate | `20260508-1E5A4841.jpg` | `04bb3713-85d1-4b51-8dc4-cff11f4138f7` | `milk-crate-pavilion-card` / content hub | Publishable if brand signs off | Wide finished structure in place. Content hub shows `consentObtained: true`, `elderApproved: false`, no cultural tags. |
| Site-context alternate | `DJI_20260508143751_0012_D.jpg` | `1a7af0d1-17ed-4f63-9a90-054e781ea508` | `milk-crate-pavilion-spread-left` / content hub | Publishable if brand signs off | Drone view shows Garden, building, and crate structure together. Content hub shows `consentObtained: true`, `elderApproved: false`, no cultural tags. |

## Naming decision

Use **the Milk Man** in public captions as the plain local nickname.

Do not treat it as the final formal artwork title until Nic, the maker, or the commissioning record
confirms it. The caption can say "the Milk Man" because that is how people will remember and repeat
it. The formal source note should stay:

```text
Artwork title: Milk Man, working title. Formal title TBC.
```

For the crate, use **the giant milk crate** in social captions. Use **Milk Crate Pavilion** only when
referring to the pavilion itself. Do not force "Milk Create" into public launch copy unless that name
is deliberately re-approved, because the current 20 June copy asks for Milk Crate.

## Launch campaign spine

Campaign name:

```text
The First Things
```

Working line:

```text
Before the place is finished, the first works are asking what it should become.
```

Four post lanes:

| Lane | Job | Example |
| --- | --- | --- |
| Object | Explain one real thing without over-explaining it | Milk Man, giant milk crate, pavilion, long table |
| Response | Show how people are reacting | "Some people love it. Some people have questions. Good." |
| Making | Show hands, materials, repair, stacking, carrying | crates, tools, timber, chalk, pizza dough, garden paths |
| Invitation | Turn attention into attendance or contribution | "Come through on 20 June. Bring a question, a story, or a pair of hands." |

Do not run the campaign as "look at our cool art."

Run it as:

```text
Here is the first thing in the room.
What should the room become?
```

## Community prompts for the open day

Put these somewhere people can answer with a pen, not a QR code first:

1. What should this place hold?
2. What should this place not become?
3. What can you bring: a story, a skill, a tool, a crate, a plant, a recipe, a few hours?

Use three visible buckets:

| Bucket | Meaning | Capture |
| --- | --- | --- |
| Question | "I want to understand / I am unsure / I disagree" | white cards |
| Support | "I want this to happen / I can help" | green cards |
| Offer | "I can bring something specific" | gold cards |

This matters because disagreement can become useful when it has a place to land.

The Harvest should not pretend everyone already gets it. The launch should show that the place is
strong enough to hold different first reactions.

Print-ready question wall:

```text
docs/communications/question-wall-2026-06-20.html
```

Use this as the physical capture layer for the open day. Print the first three pages as A3/A2 prompt
signs if possible. Print the later card pages on coloured paper or plain paper cut into quarters.

## Sample social copy

### Post 1 - Milk Man

```text
The Milk Man has already started doing his job.

Not selling milk. Starting conversations.

Some people see Witta's dairy history. Some people see a strange figure at the edge of a new place.
Some people are asking what he means.

Good.

The first artworks at The Harvest are not here to decorate a finished venue. They are here to ask
what this place should become.

The gate opens Saturday 20 June at 9 Gumland Drive, Witta.
Bring a question.
```

### Post 2 - Giant milk crate

```text
A milk crate is a useful thing.

It stacks. It carries. It gets borrowed, returned, reused, and left in the corner until someone
needs it again.

That is not a bad model for a community place.

The giant crate at The Harvest is part dairy memory, part pavilion logic, part invitation. It says
the first version of this place will be built from what is already here and what people bring.

Saturday 20 June. Witta.
Come see what is taking shape.
```

### Post 3 - Different ways people show up

```text
People are already showing up in different ways.

Some ask hard questions.
Some bring tools.
Some lend a few hours.
Some send a photo from the old days.
Some tell us what not to mess up.

All of that helps.

The Harvest is a garden, kitchen, and art space taking shape in Witta. The first open day is not a
performance. It is a way to see who is here, what people care about, and what the next version needs
to hold.

Saturday 20 June. Gate opens from 1pm.
```

### Post 4 - Short day-before post

```text
Tomorrow the gate opens.

The Milk Man will be there. The crates will be there. The garden will still be rough. The place will
not pretend to be finished.

That is the point.

Come through, walk the site, write a question on the wall, and tell us what The Harvest should hold
next.
```

## GHL scheduling package

Use this four-post sequence as a companion to the canonical six-post open-day series in
`docs/content/june-20-copy.md`. Do not replace the six-post series. This sequence is the art and
community-response layer.

| Post | Recommended window | Caption source | Required media | Link |
| --- | --- | --- | --- | --- |
| 1. Milk Man | As soon as approved | Sample social copy, Post 1 | Recommended: `95f88438-1ea0-4b5f-adda-8cbf2eebb28d`, but only after consent/status is corrected or manually approved | `https://www.theharvestwitta.com.au/june-20` |
| 2. Giant milk crate | 2-3 days after Post 1 | Sample social copy, Post 2 | Recommended: `04bb3713-85d1-4b51-8dc4-cff11f4138f7`; alternate: `1a7af0d1-17ed-4f63-9a90-054e781ea508` | `https://www.theharvestwitta.com.au/june-20` |
| 3. Different ways people show up | Weekend before 20 June | Sample social copy, Post 3 | Photo of hands, materials, question wall prep, or site context. Do not use Facebook screenshots publicly | `https://www.theharvestwitta.com.au/june-20` |
| 4. Tomorrow the gate opens | Friday 19 June | Sample social copy, Post 4 | Strongest artwork-in-place or gate/site image | `https://www.theharvestwitta.com.au/june-20` |

Scheduling status checked 2026-06-07:

- `npm run report:social:ghl` can read GHL Social Planner and returned existing drafts/published posts.
- The report showed older milk-crate-art posts from 27 April 2026, but not this new four-post
  sequence.
- The repo has a `createGHLSocialPost` code path, but the Harvest send rule still applies: do not
  schedule without approved real media.
- The recovered `IMG_2177.PNG` and `IMG_2178.PNG` screenshots are evidence, not approved media.
- Empathy Ledger now has recommended artwork media IDs. The Milk Man first-post image is still blocked
  by `consentObtained: false`; the crate candidates show `consentObtained: true`.

Launch URL / RSVP status checked 2026-06-07:

- `https://www.theharvestwitta.com.au/june-20` returns HTTP 200.
- Current local page copy locks the public time as Saturday 20 June 2026, gate from 1pm, pizza from
  5pm.
- `npm run report:launch-gates:ghl` says `VITE_GHL_IM_COMING_URL/GHL_IM_COMING_URL` is not
  configured, so the public one-tap RSVP is not verified ready.
- The same GHL report says key launch workflows are missing or still draft. Treat GHL scheduling as
  copy-ready, not send-ready, until the workflows and RSVP URL are fixed.

## Newsletter lead

Subject:

```text
The first works are asking a question
```

Preview:

```text
Milk Man, milk crates, and the first open day at The Harvest.
```

Lead:

```text
The first artworks at The Harvest are already doing useful work.

The Milk Man and the giant milk crate have given people something to talk about before the place is
finished. Some people love them. Some people are asking what they mean. Some people are offering
stories about dairy, timber, work, and what Witta has carried before.

That is the right kind of launch signal.

The Harvest is not opening as a polished venue. It is opening as a garden, kitchen, and art space
taking shape in public. The first works are asking what this place should hold, what it should not
become, and who wants to help make the next version.

Come through on Saturday 20 June. Bring a question, a story, or a pair of hands.
```

## Other projects to learn from

These are not templates to copy. They are useful precedents for treating art as place-making,
community argument, and practical infrastructure.

| Project | What they did | Harvest lesson |
| --- | --- | --- |
| Project Row Houses, Houston | Turned a cluster of historic row houses into a long-running art, residency, community, and neighbourhood platform. | Use the local form as the language. For Harvest, the crate, shed, garden path, table, timber, and dairy memory are not branding garnish. They are the grammar. |
| Theaster Gates / Rebuild Foundation, Chicago | Reworked buildings, objects, archives, and craft into cultural spaces and public programs. | Treat old materials and awkward objects as carriers of value. The work is not "art plus community." The building, archive, food, program, and object all count. |
| Granby Four Streets / Assemble, Liverpool | Built from residents' existing work, then used making, repair, objects, workshops, and social enterprise to help the neighbourhood tell its own renewal story. | Do not claim community before showing community labour. Let the made objects fund, explain, and continue the work. |
| Folkestone Triennial and Open Art Folke | Uses the town itself as the gallery, with permanent works, walking routes, local artists, studios, homes, shops, and public places in the mix. | Make the site walkable as a story. The open day can be a route through Garden, Kitchen, Art Space, not a single announcement point. |
| Behin Ha's Living Pavilion | Used hundreds of milk crates as a modular public pavilion and growing structure. | The crate works because it is ordinary. Its power is not novelty. It makes reuse, shade, growth, and gathering legible at human scale. |

Source links:

- Project Row Houses: https://projectrowhouses.org/about/
- Project Row Houses history: https://projectrowhouses.org/about/history/
- Rebuild Foundation: https://www.rebuild-foundation.org/copy-of-visit
- Dorchester Project archive: https://arte-util.org/projects/dorchester-project/
- Granby Four Streets / Assemble: https://www.archdaily.com/778435/assemble-awarded-the-2015-turner-prize-for-granby-four-streets
- Folkestone Triennial: https://www.creativefolkestone.org.uk/folkestone-triennial/
- Living Pavilion: https://www.behinha.com/living-pavilion-governors-island-installation

## What to make next

1. **Done:** re-found the two referenced screenshots and added source notes above.
2. **Done:** use "the Milk Man" as the public nickname, formal artwork title TBC.
3. **Found, not approved:** use `95f88438-1ea0-4b5f-adda-8cbf2eebb28d` as the first-post Milk Man hero
   once consent/status is corrected or explicitly approved. It is the clean wide image that shows the
   figure in place.
4. **Done:** built the question wall print file at `question-wall-2026-06-20.html`.
5. **Ready, not scheduled:** four-post sequence is copy-ready. GHL scheduling still needs Social
   Planner publish access, Milk Man media consent approval, and the public RSVP URL/workflows fixed.

## Guardrails

- Do not say "co-op" as a legal structure. Say co-operative memory, shared tools, shared tables, or
  shared work unless governance is decided.
- Do not publish identifiable people, children, or supplied community photos without consent.
- Do not smooth over scepticism. Capture it cleanly and answer with the place.
- Do not make the art carry the whole brand. It should open the door to Garden, Kitchen, Art Space.
