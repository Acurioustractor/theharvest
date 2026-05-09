# Content Flow Runbook — Photos → Article → Harvest Site

The full path from "I have a photo on my phone" to "the article is live at theharvestwitta.com.au/blog/<slug> and the right photo is the hero on /works/<slug>".

Both servers must be running:
- The Harvest dev → http://localhost:3000
- Empathy Ledger v2 dev → http://localhost:3030

---

## Step 1. Get into Empathy Ledger admin

Open: http://localhost:3030/admin

Sign in. You need an EL admin account on the local DB. If you can't get in, that's a separate auth issue — check the EL repo's `.env.local` and your Supabase profile row.

---

## Step 2. Upload photos to The Harvest Gallery

Open: http://localhost:3030/admin/galleries

Click into **The Harvest Gallery** (the one with id `5fa1593e-7d73-477a-9a34-64d2f3ff86cc`).

Click **Upload** (or drag-drop).

For each photo, while the metadata panel is open, set:

| Field | Value |
|---|---|
| **Project** | Pick a work slug if it belongs to one: `milk-crate-pavilion`, `the-cedar`, `the-garden`, `the-sauna`, `the-shop`. Leave blank if it's general. |
| **Title** | Short, descriptive — appears as caption hover |
| **Alt text** | One-sentence factual description for accessibility |
| **Tags** | At minimum, one **theme** (`make`, `grow`, `eat`, `gather`). Optional: `harvest-page` (`home` etc.), `harvest-special` (`hero` for the lead photo of a work). |

**Save.** That's enough — the photo is live in the API immediately.

> Bulk shortcut: drop a stack of photos in unannotated, then go to `/admin/bulk-edit`, filter to the Harvest Gallery, multi-select, batch-tag.

---

## Step 3. Verify the photo flowed through

Open in browser:

```
http://localhost:3030/api/v1/harvest/gallery?project=milk-crate-pavilion
```

You should see your photo in the JSON. The `total` count went up by one. If it's not there, check:
- Photo is associated to The Harvest Gallery (not just uploaded to EL globally)
- `project_id` is set
- The slug matches exactly: `milk-crate-pavilion` (lowercase, hyphens)

---

## Step 4. Write an article

Open: http://localhost:3030/admin/stories?contentType=articles

Click **New article** (or new story → set type to article).

Fill in:

| Field | Why |
|---|---|
| **Title** | The headline. Plain. Not clever. |
| **Slug** | URL — `milk-crate-pavilion-overview`. Stays forever; choose carefully. |
| **Subtitle** | One line that earns the click |
| **Excerpt** | 2-3 sentences for list/card views |
| **Article type** | `dispatch` or `case-study` or `essay` — your call |
| **Featured image** | Click → uses **Enhanced Media Picker** → pick from the photos you uploaded |
| **Body** | Write the piece. Use headings, embed photos via the media picker. |
| **Themes** | Same vocabulary as photos: `make`, `grow`, `eat`, `gather` |
| **Primary project** | Set to a work slug (e.g. `milk-crate-pavilion`) so the article also surfaces on `/works/milk-crate-pavilion` under "Writing about this work" |
| **Related projects** | Other work slugs the article touches |

---

## Step 5. Syndicate to Harvest

Click the **Syndication** tab in the article editor.

- Toggle syndication **on**
- In destinations, check **The Harvest**
- Save / Publish

This is the step that makes the article visible to the Harvest website. Without it, the article lives only in EL.

---

## Step 6. Verify on The Harvest

Open in fresh tabs:

- http://localhost:3000/blog — the article appears in the index
- http://localhost:3000/blog/<your-slug> — the full article renders
- http://localhost:3000/works/milk-crate-pavilion — scroll down. "Writing about this work" section now shows your article (because `primaryProject` matched the work slug)

**Cache note:** EL responses cache for 5 minutes. If something's missing, hard refresh, then wait. Hard refresh again at the 5-minute mark.

---

## Step 7. Log in as admin on the Harvest site

Open browser dev console on http://localhost:3000:

```js
localStorage.setItem("dev-admin-login", "true")
location.reload()
```

You're now an admin on the Harvest site.

---

## Step 8. Swap a hero photo from the page itself

Visit: http://localhost:3000/works/milk-crate-pavilion

Hover the hero image. A "Swap photo" button appears. Click it.

The **Harvest Photo Picker** opens, pre-filtered to `milk-crate-pavilion`. Click any photo. The hero updates immediately. A small "Override" pip appears top-right of the image.

To revert to the priority chain (EL `special:hero` → first EL photo → bundled fallback), hover and click "Revert".

The override persists across reloads, browsers, users — it's stored in `image_overrides` keyed on `(page="works", slot="milk-crate-pavilion-hero")`.

---

## The priority chain on `/works/<slug>`

When the page renders the hero, it picks the first one that's set:

1. **Admin override** for `(works, <slug>-hero)` — your manual pick via the swap widget
2. EL photo with `special: hero` and `project_id = <slug>`
3. First EL photo with `project_id = <slug>` (sorted by created_at)
4. Bundled fallback — `client/src/data/works.ts` → `heroImage`

The same chain runs on every page load. To "lock" a hero forever, override it. To rotate heroes, leave them alone and just retag the `hero` photo in EL.

---

## Common gotchas

| Symptom | Fix |
|---|---|
| Photo uploaded but not on `/works/<slug>` | Check `project_id` matches slug exactly. Lowercase, hyphens. |
| Article published but not in `/blog` | Check Syndication tab → "The Harvest" destination is enabled |
| Hero swap saves but page still shows old image | EL response cached 5 min. Hard refresh. Check `Override` pip top-right of image. |
| "Swap photo" button doesn't appear | Not logged in as admin. Run the dev shortcut in Step 7. |
| Picker shows zero photos | Filter mismatch — try "Any project" + "Any theme". Or no photos in Harvest Gallery yet. |
| Article appears on /blog but not on /works/<slug> | `primaryProject` field isn't set on the article, or doesn't match the work slug |

---

## The full content sweep — what to write next

Three articles in `docs/communications/articles-launch-set/` are drafted ready to paste:

1. **Milk Create Pavilion — overview** → `01-milk-crate-pavilion.md`
2. **The Cedar — working with the wood the range almost lost** → `02-the-cedar.md`
3. **The Sauna — a communal warmth ritual** (concept piece) → `03-the-sauna.md`

Each draft includes:
- Title, subtitle, slug
- The body (paste-ready, voice-aligned)
- `primaryProject`, `themes`, `articleType` to set
- Photo brief — what shots to upload first and how to tag them
- Suggested feature image

Order to ship:
1. Upload Milk Create photos → set hero → publish article 01
2. Repeat for Cedar (article 02)
3. Repeat for Sauna (article 03 — concept stage, fewer photos needed)

Once these three are live, the works pages each have a hero photo + a featured article, and `/blog` has its first three pieces. That's the "full sweep" launched.
