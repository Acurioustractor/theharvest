# Harvest Brand Operating System

This is the working home for The Harvest brand system.

The rule:

```text
repo holds the executable memory -> Notion holds the accessible memory -> GHL publishes -> the website proves it
```

## Start here

| File | Job |
| --- | --- |
| `harvest-overview.md` | Plain-language overview of what The Harvest is, what is being built, and how the website should explain it. |
| `../../DESIGN.md` | Agent-facing design memory. Read before design, copy, slides, or website work. |
| `real-photo-and-history-assets.md` | Real photo, historical photo, rights, consent, and source workflow. |
| `harvest-brand-voice.md` | Public voice, audience angles, copy patterns. |
| `harvest-brand-development-guide.md` | Repeatable AI-assisted discovery, review, and one-page strategy process for Harvest brand surfaces. |
| `harvest-launch-deck.md` | Editable photo-led launch deck source. |
| `harvest-launch-deck.pdf` | Shareable PDF export of the launch deck. |
| `harvest-launch-deck.pptx` | PowerPoint export of the launch deck. |
| `harvest-launch-deck.html` | Browser preview export of the launch deck. |
| `brand-review-workflow.md` | How to review assets, screenshots, decks, works, and social outputs. |
| `notion-brand-page.md` | Notion-ready copy for the canonical human page. |
| `../communications/photo-graphics-copy-style-guide.md` | Channel rules for photos, graphics, and captions. |
| `../communications/newsletter-writing-system.md` | Newsletter shape and GHL handoff. |

Notion page:

```text
https://www.notion.so/359ebcf981cf81eebd0ed897a7134123
```

Notion asset review database:

```text
https://www.notion.so/24aada76c976480f9a7c6e05579ae624
```

Notion review workflow:

```text
https://www.notion.so/359ebcf981cf8109b30cc7c42653cd11
```

Current screenshot set:

```text
docs/brand/screenshots/
```

Current website redesign prototype:

```text
/launch-redesign
```

## The system

Design memory is not another mood board.

It is the recipe that keeps the website, slides, social graphics, newsletter, signs, and launch copy from drifting into five different brands.

The Harvest system has five layers:

| Layer | Source | Use |
| --- | --- | --- |
| Brand spine | `DESIGN.md` | What The Harvest is and is not. |
| Voice | `harvest-brand-voice.md` | How we write in public. |
| Visual tokens | `client/src/styles/brand.ts` | The palette and type already in the app. |
| Comms rhythm | `docs/communications/` | Weekly posts, newsletters, reels, records. |
| Human source | Notion | Easy access for Ben, Nic, and collaborators. |

## Image rule

The Harvest brand is built from real photos, real people, real work, floor plans, scans, and historical Witta material.

AI-generated images are not Harvest brand assets. AI may help crop, arrange, caption, or turn real material into a slide or social layout, but it must not invent fake scenes, fake people, fake interiors, or fake history.

Every public asset needs a source note:

```text
who/where/when -> rights/permission -> attribution -> publish status
```

The current in-app brand guide image set is listed in `real-photo-and-history-assets.md` under
`Current brand guide image set`. Use that before old launch graphics, concept renders, or
generated-looking venue scenes.

## Current Public Frame

Current public lockup:

```text
Witta · Jinibara Country · Garden opening end of June

The Harvest
Grow. Make. Gather.
A community garden and creative gathering place taking shape in Witta.
Learn about The Harvest
```

This is the current front door for the brand guide and public surfaces. The exact operational date can be used where needed, but the brand frame is **garden opening end of June**.

## Brand spine

```text
A community garden and creative gathering place taking shape in Witta.
```

The public words:

- Garden: grow
- Creative build: make
- Community place: gather

Supporting story threads:

- timber
- dairy
- milk crates
- shared tables
- old nursery
- local makers
- Witta stories

## Daily use

For website redesign:

1. Read `DESIGN.md`.
2. Open the current page and inspect the real components.
3. Use real site imagery, historical photos, drawings, and materials first.
4. Keep Grow, Make, and Gather legible.
5. Use `harvest-brand-development-guide.md` for the stage gate and surface brief.
6. Update `DESIGN.md` if a new design rule is proven.

For slides:

1. Start from `harvest-launch-deck.md`.
2. Pull approved assets from the Notion asset review database.
3. Use one idea per slide.
4. Use real photos, screenshots, historical images, or plans before decoration.
5. End with one ask.

For comms:

1. Start from the week in `../communications/THIS-WEEK.md`.
2. Use `harvest-brand-voice.md` for the caption or newsletter.
3. Pull approved social assets from the Notion asset review database.
4. Check the current stage in `harvest-brand-development-guide.md`.
5. Build in GHL.
6. Pull the record back to Notion.

For Notion:

1. Keep the canonical human page short.
2. Link back to these repo files.
3. Record decisions, not every draft.

## Guardrails

- Do not make The Harvest a generic cafe brand.
- Do not make it a polished venue brand before the place is ready.
- Do not use "co-op" as a legal/governance claim until it is real.
- Do not use generated images as public Harvest proof.
- Do not publish sensitive people stories or images without consent.
- Use Jinibara Country per the current repo instructions.
- Flag the upstream ACT brand map mismatch before shipping any new public brand decision.
