# The Harvest design memory

This is the agent-facing `design.md` for The Harvest Website.

Use it before any Harvest website redesign, brand work, slide deck, public copy, social post, newsletter, design prompt, or Notion brand update.

## Source order

1. `AGENTS.md` for operational rules.
2. `SOUL.md` and `USER.md` for working style.
3. This file for Harvest brand memory.
4. `docs/brand/README.md` for the human-facing brand operating system.
5. `docs/brand/real-photo-and-history-assets.md` for the real image and history source system.
6. `client/src/styles/brand.ts` for live app tokens.
7. `docs/communications/photo-graphics-copy-style-guide.md` and `docs/communications/newsletter-writing-system.md` for channel rules.

For ACT-facing public copy, also read the parent writing voice file:

```text
../act-global-infrastructure/.claude/skills/act-brand-alignment/references/writing-voice.md
```

## Current decision

The Harvest is a working community hub in Witta, on Jinibara Country.

The brand is not a generic cafe, retreat venue, community centre, farm shop, or arts space. It is three rooms held together by one place:

| Room | Verb | Public meaning | Regional memory |
| --- | --- | --- | --- |
| Garden | Grow | food, plants, kids, working bees, soil | nursery, ridge gardens, practical care |
| Kitchen | Feed | long tables, pop-ups, milk bar, fire cooking | dairy, milk, co-op tables, shared meals |
| Art Space | Make | residencies, workshops, repair, exhibition | timber, tools, Barry's shed, local craft |

The first residency theme is **timber, dairy, and co-operatives**. It should shape the launch story, not sit in a footnote.

## Facts, inferences, unknowns

Verified in the repo and Notion:

- Public rooms: Garden, Kitchen, Art Space.
- Live app tokens live in `client/src/styles/brand.ts`.
- Internal brand guide route exists at `client/src/pages/BrandGuide.tsx`.
- Harvest HQ exists in Notion as `The Harvest Witta HQ`.
- Real Harvest source material already exists in the repo: site photos, Barry and shed photos, floor plans, Witta/Teutoburg history images, website screenshots, and WhatsApp field media.
- The current launch target in Notion is 20 June 2026.
- Strategy docs still carry a 20 June 2026 soft-open go/no-go decision, with Ben away from 20 June to 15 August 2026.

Working inference:

- The 20 June 2026 date should be treated as the **launch readiness target** for brand, website, deck, and comms unless Ben or Nic explicitly changes it.
- The visual direction should keep the current Harvest material palette and Bauhaus discipline, but avoid cold CivicGraph-style Bauhaus. This is a working place, not a data terminal.

Open issue:

- The upstream ACT brand map still contains older Harvest Country wording. This repo currently instructs Jinibara Country. Use Jinibara here and correct the upstream map before shipping a new public brand decision.

## Brand spine

Short identity:

```text
The Harvest is a garden, kitchen, and art space taking shape in Witta.
```

Launch line:

```text
A working place for growing, feeding, making, and gathering in Witta.
```

Internal test:

```text
If it tries to do everything, no one knows what it is. Garden. Kitchen. Art Space.
```

What it must feel like:

- a shed waking up
- a long table before the first meal
- old timber with new hands on it
- milk crates becoming a pavilion
- a nursery becoming a commons
- a brand with dust on its boots

What it must not feel like:

- a polished lifestyle venue
- a generic community hub
- a purple-gradient startup site
- a wellness retreat brochure
- a council activation project
- an over-explained philosophy page

## Visual system

Current live tokens are the source of truth.

| Token | Hex | Role |
| --- | --- | --- |
| Shed | `#1C1917` | primary dark, type, dark sections |
| Milk | `#F5F0E8` | background, paper, milk bar warmth |
| Rammed Earth | `#B58B70` | surfaces, secondary warmth |
| Golden Hour | `#C4922A` | dairy, timber light, primary accent |
| Workshirt | `#3B5563` | dusk blue, secondary anchor |
| Calendula | `#CF5C1E` | small high-energy accent |
| Canopy | `#4A6741` | garden, growth, steady green |
| Hardwood | `#3D3832` | timber, structure, quiet dark |
| Lilly Pilly | `#6B3040` | seasonal detail, human warmth |
| Crane | `#8B4A2A` | rusted iron, art space, machinery |

Typography in the current app:

- Display: `Montserrat`
- Body: `Inter`

Keep type direct and workmanlike. Use large type only where the page has room to breathe. Do not scale fonts with viewport width.

## Composition rules

- Show the real place first.
- Use photos, site drawings, floor plans, scans, material textures, working images, and historical photos before any illustration.
- Do not use AI-generated images as Harvest brand assets. If generated imagery is ever used, label it as concept-only and keep it out of the public brand library.
- Simple icons, line marks, maps, type treatments, and crop systems are allowed only when they support a real photo, historical image, floor plan, or story source.
- Let one thing dominate each screen: a photo, a line, a map, a room, a table.
- Use hard edges or small radii. Cards may exist for repeated items, but do not stack cards inside cards.
- Make the first viewport legible: Garden, Kitchen, Art Space, or the launch invitation must be obvious.
- Do not hide the place behind abstract gradients, bokeh, blobs, or generic atmosphere.
- Motion should feel like work happening: lift, slide, reveal, stack, mark, fold. Avoid shiny SaaS motion.

## Real image rule

The Harvest brand is photo-led and history-led.

Approved source material:

- original site photos and video
- Barry, shed, machinery, timber, garden, kitchen, and working bee images
- floor plans, sketches, scans, and site drawings
- historical Witta, Teutoburg, Blackall Range, dairy, timber, and co-op images with clear source and rights notes
- book and archive story notes, used as researched context rather than copied text
- community portraits and supplied photos only after consent is recorded

Every public image needs a source note:

```text
who/where/when -> rights/permission -> attribution -> publish status
```

If the source is unknown, the asset stays in review.

## Design motifs

Use these as ingredients, not wallpaper:

- milk crates as modular co-op architecture
- reclaimed timber, sawmill memory, Barry's machinery
- rammed earth, rusted iron, corrugated shed edges
- long round tables, not boardroom tables
- milk bottles, raw milk, yoghurt, milk bar simplicity
- open fire, mobile pizza oven, shared pots
- floor plan marks, pencil sketches, site annotations
- kids building the kids area
- artists changing the room instead of decorating it

## Voice rules

Write like someone standing at the gate.

Use:

- plain sentences
- named objects
- named rooms
- local detail
- one clear invitation
- short paragraphs

Avoid:

- "we are excited to announce"
- "community is at the heart"
- "vibrant hub"
- "unlock", "empower", "seamless", "elevate"
- polished venue language
- formal co-op claims before the governance is real

Public copy should usually use these rooms and bodies:

| Topic | Room | Body/object |
| --- | --- | --- |
| Garden | bed, path, nursery, soil | hands, boots, fork, leaves |
| Kitchen | table, plate, pot, milk bar | mouth, bowl, kettle, crate |
| Art Space | wall, studio, workbench | brush, tool, hand, timber |
| Launch | gate, shed, pavilion | neighbour, crate, chair |

## Audience angles

For Witta locals:

- "Come see what is taking shape."
- Use practical asks, dates, and visible progress.

For timber people:

- Treat timber as memory and material.
- Name sawmills, tools, reclaimed hardwood, Barry's shed, and things built by hand.

For dairy people:

- Make the milk bar, milk crate pavilion, shared dairy history, and simple food offer tangible.
- Avoid nostalgia that turns working history into decoration.

For co-op and community enterprise people:

- Talk about shared tools, open books, round tables, and gradual handover.
- Do not imply a legal cooperative exists until it does.

For funders, landlord, and operators:

- Lead with clarity: what opens, what it tests, what revenue or participation signal it creates.
- Keep the philosophy behind the proof.

## Layout prompt pattern

Use this when asking an AI design tool to arrange a Harvest surface from supplied real assets:

```text
Use the Harvest design memory. This is a working community hub in Witta on Jinibara Country: Garden, Kitchen, Art Space. Use only the supplied real photos, historical images, screenshots, scans, sketches, and floor plans. Do not invent or generate new brand imagery. Build from milk crates, timber, dairy, co-op tables, rammed earth, rusted iron, shed light, garden beds, floor plan marks, and Witta history. Use the Harvest palette: shed #1C1917, milk #F5F0E8, golden hour #C4922A, canopy #4A6741, crane #8B4A2A, workshirt #3B5563. Typography should feel direct and material. Simple icons and line marks can support the real source material, but cannot replace it. Avoid generic startup gradients, stock-photo wellness, and abstract community language. One screen, one job.
```

## Workflow

The design workflow is:

```text
reference -> compose -> inspect -> systemise -> iterate -> remix -> export
```

Use it this way:

1. Reference: gather real photos, historical photos, story sources, sketches, current page, and this file.
2. Compose: make one strong surface only, using real source material.
3. Inspect: check if the three rooms, the people, and the place are legible.
4. Systemise: update this file or `docs/brand/README.md` if a rule is now proven.
5. Iterate: improve the same surface.
6. Remix: only then make the slide, reel, mobile screen, poster, or newsletter version.
7. Export: move the final decision into Notion for human access.

Do not let every layout pass invent a new Harvest.

## Links

- Human brand system: `docs/brand/README.md`
- Real photo and history assets: `docs/brand/real-photo-and-history-assets.md`
- Brand voice: `docs/brand/harvest-brand-voice.md`
- Launch deck: `docs/brand/harvest-launch-deck.md`
- Current comms home: `docs/communications/00-COMMS-HOME.md`
- Current photo/copy guide: `docs/communications/photo-graphics-copy-style-guide.md`
- Live tokens: `client/src/styles/brand.ts`
- Internal brand guide page: `client/src/pages/BrandGuide.tsx`
