# Harvest brand review workflow

This is the repeatable loop for reviewing Harvest assets and turning them into website, Notion, supporter deck, and social outputs.

## The model

```text
capture real surface -> prove source -> review in Notion -> decide job -> remix into deck/social/site -> record decision
```

Notion is the review board.

The repo is the source of files and executable memory.

GHL is the publishing desk.

## Notion board

Brand page:

```text
https://www.notion.so/359ebcf981cf81eebd0ed897a7134123
```

Asset review database:

```text
https://www.notion.so/24aada76c976480f9a7c6e05579ae624
```

Use the database for every asset that might matter:

- website screenshots
- logo marks
- social tiles
- site photos
- historical photos
- book and archive story sources
- floor plans
- work stories
- decks
- Notion pages
- simple icons and visual marks

Each row needs:

| Field | Job |
| --- | --- |
| Asset | Plain name |
| Type | What kind of thing it is |
| Status | Inbox, Review, Approved, Needs work, Use in deck, Use in social, Archive |
| Source | Page URL or Notion URL |
| Repo path | Where the file/source lives |
| Provenance | Where it came from |
| Rights | Whether it is cleared for public use |
| Consent | Whether people/story consent is needed or confirmed |
| Attribution | Credit line to use publicly |
| Story source | Book, archive, interview, or note behind the asset |
| Decision | What we think about it |
| Next action | The next practical move |

Generated images are not entered as public Harvest assets. If one exists from a concept test, mark it clearly as concept-only and keep it out of deck/social/site picks.

## Screenshot set

Current screenshots live here:

```text
docs/brand/screenshots/
```

Captured on 8 May 2026 from local dev:

| Surface | Route | Screenshot |
| --- | --- | --- |
| Home | `/` | `harvest-home-2026-05-08.png` |
| Bauhaus exploration | `/bauhaus` | `harvest-bauhaus-2026-05-08.png` |
| Works index | `/works` | `harvest-works-2026-05-08.png` |
| Logo story | `/logo-story` | `harvest-logo-story-2026-05-08.png` |
| Garden launch | `/garden-launch` | `harvest-garden-launch-2026-05-08.png` |
| Garden launch mobile | `/garden-launch` | `harvest-garden-launch-mobile-2026-05-08.png` |
| Launch redesign prototype | `/launch-redesign` | `harvest-launch-redesign-2026-05-08.png` |
| Launch redesign prototype mobile | `/launch-redesign` | `harvest-launch-redesign-mobile-2026-05-08.png` |
| Social page | `/social` | `harvest-social-2026-05-08.png` |
| Internal brand guide | `/brand-guide` | `harvest-brand-guide-2026-05-08.png` |

When reviewing screenshots, ask:

1. Can I tell this is Garden, Kitchen, Art Space, or launch?
2. Can I see the real place or material?
3. Is the next action clear?
4. Does the page feel like Witta, not a generic venue?
5. Is this useful for supporters, locals, social, or archive?
6. Which real photo, historical image, plan, or story should replace any generic surface?

## Review passes

### Pass 1: inventory

Move everything into one of these buckets:

- website surface
- logo and mark
- photo and footage
- historical photo
- book or history source
- drawing and plan
- work story
- deck
- social tile
- newsletter/comms
- icon or simple visual asset

Do not judge yet. Just make the mess visible.

### Pass 1.5: provenance

Before an asset can be used publicly, answer:

- Who made it or supplied it?
- Where was it taken or found?
- When was it made, if known?
- Do we own it, have permission, or need archive attribution?
- Are there people in it, and is consent clear?
- Is the story from a book, archive, interview, or local memory?

### Pass 2: decision

For each item, choose one:

- Approved
- Needs work
- Use in deck
- Use in social
- Archive

Write the decision in plain language.

Good:

```text
Use in deck. Shows actual site design work, not abstract intent.
```

Bad:

```text
Nice vibe.
```

### Pass 3: remix

Only remix approved or useful assets.

| Output | Pull from |
| --- | --- |
| Supporter deck | works index, floor plans, logo story, launch page, 3 proof photos |
| Social posts | garden launch, current garden photos, milk crate pavilion, simple asks |
| Website redesign | best screenshots, DESIGN.md, real site photos, Witta history images, work stories |
| Newsletter | garden story, launch readiness, one practical ask |

## Supporter deck shape

Keep it short.

1. The Harvest: Garden, Kitchen, Art Space
2. Why Witta needs this
3. The first build: timber, dairy, co-operatives
4. The works: milk crate pavilion, cedar, garden
5. What opens first
6. What support unlocks
7. The ask

Use proof before poetry:

- screenshots
- floor plans
- site photos
- historical Witta photos
- archive/book source notes
- work stories
- current launch page

## Social build shape

Social should not be a smaller deck.

Use one post, one job:

| Post type | Job |
| --- | --- |
| Progress photo | Show that the place is changing |
| Local ask | Get a thing or a hand |
| Work story | Teach one material story |
| Launch reminder | Date, room, action |
| Behind the build | Show taste and care |

Start with:

```text
The milk crates are becoming a pavilion.
```

not:

```text
We are excited to announce our innovative community activation.
```

## The next clean move

For the first working review session:

1. Open the Notion asset review database.
2. Review only the `Review` and `Use in deck` rows.
3. Choose the first 10 approved assets.
4. Build the supporter deck from those 10.
5. Build three social posts from the same material.

If one asset cannot serve a website, deck, or social job, archive it.
