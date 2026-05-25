# Works pages brand audit

Date: 2026-05-24

Scope:

- `/works`
- `/works/the-garden`
- `/works/milk-crate-pavilion`
- `/works/the-cedar`
- `/works/the-shop`
- `/works/kids-area`
- `/works/the-milk-man`

Checked against:

- `DESIGN.md`
- `docs/brand/README.md`
- `docs/brand/harvest-brand-voice.md`
- `docs/brand/real-photo-and-history-assets.md`
- `docs/brand/harvest-overview.md`
- live admin text overrides in `editable_content`
- live image overrides in `image_overrides`
- local rendered pages at `http://localhost:3006`

Review screenshot:

- `docs/brand/screenshots/harvest-works-index-2026-05-24.png`

## Summary

The works pages are directionally right. They are object-led, place-led, and mostly free of cafe, wellness, startup, and council language.

The weak points are not the core idea. They are:

1. image provenance and image-to-work fit
2. one live lifecycle override hiding the Milk Crate Pavilion status
3. source-sensitive claims on the St Mary's timber story
4. legal/entity wording on The Shop
5. a few admin-edited copy mistakes now visible in public
6. Empathy Ledger gallery errors hiding the automatic "Photographs" sections

## Verified

- All seven routes rendered locally.
- No public page crashed.
- After scrolling each page to trigger lazy images, no rendered image returned a failed natural size.
- Public pages use real Harvest or Harvest-linked media, not AI-generated scenes.
- The main copy mostly passes the Harvest sentence test: rooms, tools, plants, plates, material, or place are usually named.
- The `/works` index shows six works.
- The detail pages rely on live DB overrides as well as `client/src/data/works.ts`.

## Technical/content issues

### P1: Empathy Ledger work galleries are failing

The work detail pages call `gallery.forWork`, but the Empathy Ledger Harvest gallery endpoint returned errors during smoke review.

Observed:

- `the-garden`, `milk-crate-pavilion`, `the-cedar`, and `the-shop` returned `500 Failed to fetch images`.
- `kids-area` and `the-milk-man` returned `400 Invalid work slug`.
- The valid values returned by EL were `milk-crate-pavilion`, `the-cedar`, `the-garden`, `the-sauna`, and `the-shop`.

Impact:

- Visitor pages silently fall back to bundled and image override assets.
- The automatic "Photographs · n" section is hidden for visitors.
- The site and EL taxonomy have drifted: the site has `kids-area` and `the-milk-man`; EL still lists `the-sauna` and does not list those two.

Recommended fix:

- Fix the EL gallery endpoint for the valid slugs.
- Add `kids-area` and `the-milk-man` to the EL work taxonomy, or remove the gallery lookup for works that are not in EL yet.
- Decide what happens to `the-sauna` if it is no longer part of the public collection.

### P1: Milk Crate Pavilion lifecycle is blank on the detail page

The code default has `building`, but the live override for `works / milk-crate-pavilion-lifecycleTags` is an empty array.

Impact:

- The `/works` index shows `Building`.
- The detail page header and museum label show no lifecycle status.
- This weakens the strongest proof piece in the collection.

Recommended fix:

- Clear that override or set it to `["built", "extending"]` or `["building"]`, depending on the current truth.

### P1: The Shop uses unsafe entity wording

The Shop page currently says:

- "Sublicenced under the lease, at arm's length from Harvest Pty's programming."
- "Sub-licenced under the lease..."
- "Harvest Pty Ltd" as the sub-licence holder.

Issue:

- Repo ACT context says the Harvest entity is still being designed.
- "Harvest Pty Ltd" is not listed as a verified legal entity.
- Public brand guidance says not to imply governance/legal structures before they are real.

Recommended fix:

- Replace legal/entity language with operational language until the entity is confirmed.
- Example direction: "Run as a small shared-shelf test under the broader Harvest operating setup."

### P1: St Mary's timber source claim is still too strong

The Garden Paths page says:

- "St Mary's timber, returning to Witta as walkways"
- "The source trail leads back to trees cut from the Witta region"
- "The story is being traced back to the Witta region"

Issue:

- `docs/brand/harvest-overview.md` says the Witta-origin line needs a clean source note before it becomes public proof.

Recommended fix:

- Keep St Mary's as verified if that is sourced.
- Make Witta origin provisional until the source trail is documented.
- Example direction: "The source trail is still being checked. For now, the timber carries the larger ridge story: cut, moved, used, and now returned to daily work."

## Image audit

### `/works`

Good:

- The page is photo-led.
- The Milk Crate Pavilion card is strong and specific.
- Garden card feels like real work, not a styled lifestyle image.

Needs work:

- `Kids' Area` card uses a screenshot asset: `Screenshot 2026 05 13 at 4.59.24 pm`.
- `The Garden Paths`, `The Shop`, and `The Garden` all read as garden-progress imagery on the index, so the collection loses distinction.
- `The Milk Man` index card falls back to crates, not a clear figure/sentinel image.

Recommended image swaps:

- Kids' Area: use a real sketch, loose-parts material photo, logs/shade/play test, or keep it text-led until consent-safe kid imagery exists.
- Garden Paths: use reclaimed timber, Barry's shed/workbench, or path material, not general garden progress.
- Shop: use shelf, produce, crate, preserves, handwritten price/signage, or local produce detail.
- Milk Man: use the actual milk crate figure if the current detail page image set is showing it.

### `/works/the-garden`

Good:

- Strong real Harvest garden image set.
- Sophie/garden story is specific and human.
- The page keeps the Garden as the current public focus.

Needs work:

- Live copy typo: "Then Harvest Maintenance Crew" should be "The Harvest Maintenance Crew".
- Live copy spacing typo: "crew .Not" should be "crew. Not".
- If Sophie is named and quoted, confirm the quote/portrait consent is recorded in the asset review system.

### `/works/milk-crate-pavilion`

Good:

- The images are the strongest fit in the collection.
- The work carries the dairy/co-op story clearly.
- The page feels like actual making.

Needs work:

- Lifecycle hidden by empty live override.
- Hand credit says "Eltech Electrical" while the external link says "Hatch Electrical". Confirm the right name.
- "Family, the harvest community and our amazing friends..." is warmer than the rest of the system but a bit loose for public museum-label copy.
- Hero still uses bundled `gathering-recap-crowd-1200.webp`, while stronger pavilion-specific EL images are used elsewhere.

### `/works/the-cedar`

Good:

- The work belongs in the brand spine: timber, path, garden, source trail.
- The copy is material-led.

Needs work:

- Hero/card image is general garden progress, not timber/path.
- Two inline images have generic alt text from filenames.
- Spread images repeat the same Barry image twice.
- The Witta-origin claim needs source confirmation before being treated as public proof.
- Public title is "The Garden Paths" while route slug is `/works/the-cedar`; this is probably acceptable short-term, but it is a review point.

### `/works/the-shop`

Good:

- The page is practical and small-scale.
- The shop-interest form is aligned with the "first shelf" idea.
- Copy avoids pretending the shop already exists.

Needs work:

- Legal/entity language needs to come out or be verified.
- "Sublicenced" should be standardised to "sub-licensed" if the term remains.
- Hero alt text is still filename-like.
- The same `local-produce-760.webp` is reused across every inline image slot, which makes the page feel thinner than the others.

### `/works/kids-area`

Good:

- Copy correctly avoids a finished playground claim.
- Co-design with kids is clear.
- It does not drift into generic family venue language.

Needs work:

- Index card image is a screenshot, not a public brand asset.
- Detail page repeats the same team selfie for hero, feature, and spread slots.
- Any future child imagery needs explicit consent and use notes before publication.
- EL work taxonomy does not include this slug.

### `/works/the-milk-man`

Good:

- This is on-brand: dairy memory, object at the gate, humour without turning the history into museum wallpaper.
- Detail images appear to be real object photos and load successfully.

Needs work:

- Detail image alt text is filename-like.
- Index card fallback is generic crates, not the figure.
- EL work taxonomy does not include this slug.
- "Sentinel" is vivid, but check whether it feels too mythic for public copy. "Marker" or "figure" may be plainer.

## Copy language scan

No major generic-brand terms were found in the rendered works pages:

- no "vibrant"
- no "unlock"
- no "empower"
- no "elevate"
- no "seamless"
- no "world-class"
- no "precinct"
- no "stakeholders"
- no "ecosystem"

Copy issues that do need attention:

- `Harvest Pty Ltd`
- `Harvest Pty`
- `Sublicenced`
- `Then Harvest Maintenance Crew`
- `crew .Not`
- public Witta-origin timber claim without visible source note
- blank Milk Crate Pavilion lifecycle

## Recommended review order

1. Fix the factual/legal risks first: The Shop entity wording and St Mary's source claim.
2. Clear or repair the Milk Crate Pavilion lifecycle override.
3. Fix EL gallery/taxonomy drift.
4. Swap weak card images on `/works`.
5. Clean filename-like alt text on detail images.
6. Tighten public hand credits.
7. Record source/rights/consent for the selected images in the Notion asset review database.

## Proposed image decisions

Use now:

- Garden: Sophie/garden progress photos.
- Milk Crate Pavilion: current pavilion build images.
- The Milk Man: actual object photos, once alt text is rewritten.

Needs better pick:

- Garden Paths: timber/path/material image.
- The Shop: first shelf/produce/signage image.
- Kids' Area: concept sketch, material test, or no public image until consent-safe material exists.

Hold in review:

- Screenshot used as `kids-area-card`.
- Any image with people where consent is not recorded.
- Historical or source-claim images without attribution.
