# Empathy Ledger ↔ The Harvest — Tagging Playbook

How to tag photos, articles, and projects in Empathy Ledger so they show up
in the right place on the Harvest website.

---

## The five filters that matter

The Harvest website pulls content from EL through five orthogonal filters.
All of them are **tags**, applied to photos in the `A Curious Tractor Photos` →
`The Harvest` project. Set as many as apply — they're additive, not exclusive.

| Filter | Tag category | What it does | Valid values |
|---|---|---|---|
| **Work** | `harvest-work` | Pins media to one of the 5 Works (primary mechanism) | `milk-crate-pavilion`, `the-cedar`, `the-garden`, `the-sauna`, `the-shop` |
| **Page** | `harvest-page` | Routes media to a specific page | `home`, `journey`, `stories`, `explore`, `membership`, `visit`, `whats-on` |
| **Theme** | `harvest-theme` | Maps to one of the four pillars | `eat`, `grow`, `make`, `gather` |
| **Category** | `harvest-category` | Lifecycle phase | `before`, `during`, `after`, `milestone`, `general-harvest` |
| **Special** | `harvest-special` | Spotlight role | `hero`, `featured` |

> Legacy: `project_id` (set to a project's UUID) still works as a per-work filter
> for backwards compatibility. New tagging should use `harvest-work` tags instead —
> they're easier to multi-apply via the EL admin's Tags filter and let a photo
> belong to multiple works at once.

---

## When tagging a photo, ask in this order

**1. Is it of one of the five Works?**
→ Set **`project_id`** to that project (via `slug` lookup in EL).
That alone is enough to make it appear on `/works/<slug>`.

**2. Which Harvest pillar does it speak to?**
→ Tag a **theme**: `eat | grow | make | gather`.
Themes group images for `/`, `/explore`, and the home zones.

**3. Which page is this destined for?**
→ Tag a **page**: `home`, `journey`, `stories`, etc.
Use sparingly — most photos don't need to be page-pinned.

**4. Is it the hero or a feature?**
→ Tag **special**: `hero` (lead image for that page) or `featured` (above-the-fold spotlight).

**5. Is it a before/after/milestone?**
→ Tag a **category** for the progress gallery: `before | during | after | milestone`.
Default is `general-harvest`.

---

## How filters combine on the website

| Page | Query | Notes |
|---|---|---|
| `/` (home) | media with `tag=home` or `special=hero` | Hero rotates featured images |
| `/works/<slug>` | media with `project_id=<slug>` | Pure project filter |
| `/journey` | media with `tag=journey`, sorted by date | Timeline |
| `/explore` | media by `theme=...` filter chips | User chooses pillar |
| `/blog/<slug>` | article body + `featured_image_url` | Article-level, not gallery |

---

## Quick reference — current Works mapping

| Work | Project slug | Default theme | Notes |
|---|---|---|---|
| Milk Create Pavilion | `milk-crate-pavilion` | `make`, `gather` | Flagship — mark hero photo with `special=hero` |
| The Cedar | `the-cedar` | `make` | Heritage timber, Barry Rodgerig's source |
| The Garden | `the-garden` | `grow` | Wednesday Maintenance Crew tag candidates |
| The Sauna | `the-sauna` | `gather` | Concept stage — sketches/renders |
| The Shop | `the-shop` | `eat`, `gather` | Concept stage |

---

## Current Garden-first build mapping

Use this table for the 20 June / Garden-first push. It keeps the public site
honest about what is happening now while still leaving room for the longer
kitchen, art, events and community space model.

| Site story | Work tag | Theme tags | Category | Notes |
|---|---|---|---|---|
| Seedlings, beds, soil and shade | `the-garden` | `grow`, `gather` | `during` | Main public focus until July |
| Giant milk crate pavilion | `milk-crate-pavilion` | `make`, `gather` | `during` or `milestone` | Use `milestone` for key build moments |
| St Mary's timber paths | `the-cedar` | `make`, `gather` | `during` | Use for timber, tools, Barry, source-tracing and pathway pieces |
| Kids playground | `the-garden` | `gather` | `during` | Until a dedicated playground work exists, keep this under the Garden |
| Co-op type shop / produce shelf | `the-shop` | `eat`, `gather` | `general-harvest` or `during` | Working interest only, not a formal co-op claim |
| Future kitchen food loop | `the-shop` | `eat`, `grow` | `general-harvest` | Do not imply the Kitchen is ready this round |

For video, use the same tags. The website gallery can render video assets once
EL returns public MP4/WebM media URLs through the Harvest gallery API.

---

## How to actually tag in EL admin

**For one photo at a time:**
1. EL → `/admin/photos` (or `/admin/galleries/<harvest-gallery-id>`)
2. Open the photo's metadata panel
3. Set `Project` (dropdown of project slugs)
4. Add Tags — pick from the harvest-* categories
5. Save

**For many photos at once:**
1. EL → `/admin/bulk-edit`
2. Filter to "The Harvest Gallery"
3. Select rows → set project / add tags in batch

**For brand-new uploads:**
1. EL → `/admin/galleries/<harvest-gallery-id>` → Upload
2. Tag during the upload step (project + theme minimum)
3. The photo appears on `/works/<slug>` automatically

**For programmatic / bulk:**
- Run `~/Code/empathy-ledger-v2/scripts/upload-harvest-local-images.ts --apply`
- It applies the manifest mapping (see script for current rules)

---

## Articles

Articles use a different surface but the same destination model.

**To publish a Harvest blog post:**
1. EL → `/admin/stories?contentType=articles` → New article
2. Write title, subtitle, body, attach featured image (uses `EnhancedMediaPicker`)
3. **Syndication tab** → enable syndication → check **The Harvest** destination
4. Set `articleType` (e.g. `blog-post`, `dispatch`, `case-study`)
5. Add themes if relevant (`make`, `grow`, etc.)
6. Publish

The website pulls these via `trpc.blog.list({ destination: "harvest" })` automatically — no Harvest-side change needed once the article is syndicated.

---

## Gotchas

- **Project slugs are exact strings** — `milk-crate-pavilion` (lowercase, hyphens). A typo means the photo won't appear.
- **Tags must already exist** in EL with the right `category`. Migrations seed them; if a category is missing run `20260120000005_harvest_gallery_tags.sql`.
- **The Harvest Gallery membership matters** — a photo with all the right tags but not in `gallery_media_associations` for the Harvest Gallery won't show. The bulk-upload script does this automatically.
- **Page tag ≠ theme** — don't tag `journey` as a theme; it's a page tag.
- **Don't tag in two places** — if a photo is `project_id=the-cedar`, you don't also need `tag=the-cedar`. Project ID is enough.

---

## When in doubt

Default to: **`project_id` + one `theme` + (optional) `special:featured`**.
Skip page tags unless the photo specifically belongs on a non-default page.
