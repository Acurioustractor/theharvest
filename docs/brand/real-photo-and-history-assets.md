# Harvest real photo and history asset system

The Harvest brand should be built from real proof:

```text
real photos -> verified source notes -> approved picks -> website, deck, social, newsletter
```

AI-generated images are not Harvest brand assets.

AI can help with cropping, sequencing, type, captions, slide layout, and social variants. It should not invent Harvest scenes, people, interiors, or history.

## Source buckets

| Bucket | Use | Current local source |
| --- | --- | --- |
| Current place photos | website hero, deck proof, social progress | `client/public/images/compendium/` |
| Barry and shed photos | timber, craft, machinery, local story | `client/public/images/compendium/barry/` |
| Garden crew media | working bees, progress, community proof | `docs/communications/debriefs/_whatsapp-exports/` |
| Floor plans and site drawings | deck structure, website proof, signage | `client/public/images/plans/`, `client/public/images/site-plan/`, `client/public/images/compendium/MASTER FLOOR PLAN*` |
| Witta history images | timber, dairy, settlement, agriculture | `client/public/images/witta/history/` |
| Website screenshots | redesign review, supporter proof | `docs/brand/screenshots/` |
| Icons and simple marks | support navigation and social structure | `client/public/images/email-icons/`, `client/public/images/sketches/` |
| Books and source notes | captions, deck evidence, website story | Notion source notes, local docs, library/archive links |

## Verified local inventory

Checked on 8 May 2026:

- 36 compendium files, including aerial, garden, team, Barry, drawings, video, and floor plan material.
- 15 Witta history image files.
- 59 plan and site-plan image files.
- 456 WhatsApp-exported photo/video files across current and archived garden crew exports.

These are not all publish-ready. They are the first review pool.

## Publish rule

Every public asset needs this record:

```text
Asset name:
Source:
Date or era:
Place:
People visible:
Consent:
Rights:
Attribution:
Story source:
Allowed uses:
Decision:
Next action:
```

If any of `Source`, `Consent`, `Rights`, or `Attribution` is unclear, keep the item in Review.

## Rights and consent

Use these labels in Notion:

| Field | Values |
| --- | --- |
| Provenance | Harvest original, Community supplied, Historical archive, Book/story source, Screenshot, Design support |
| Rights | Owned/cleared, Permission needed, Public domain/archive attribution, Research use only, Do not publish |
| Consent | Not needed, Confirmed, Needed, Internal only, Do not publish |

Rules:

- Public domain does not remove the need for attribution.
- Book scans and long excerpts stay research-only unless permission is clear.
- Community portraits need consent before public use.
- Photos of children require clear consent and a specific use.
- Sensitive local stories stay internal unless the person has agreed to be named.

## Historical source leads

These source leads were checked on 8 May 2026 and should be used for provenance, rights, and attribution before publication:

- [Queensland Places: Witta](https://queenslandplaces.com.au/witta) for the Teutoburg/Witta timeline, dairy, school, sawmill, and renaming context.
- [Witta Lutherans history](https://wittalutherans.org.au/history/) for Jinibara Country, Teutoburg settlement, church, school, and local book reference.
- [Queensland State Archives image 2383 via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Queensland_State_Archives_2383_Couple_and_13_feet_high_corn_at_Manitzkys_Farm_Teutoberg_Blackall_Range_c_1899.png) for the Manitzky farm corn image, circa 1899. Preferred citation listed there: Queensland State Archives, Digital Image ID 2383.
- [Queensland State Archives image 2390 via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Queensland_State_Archives_2390_C_M_Nothlings_vineyard_and_shingle_roof_cottage_at_Teutoberg_Blackall_Range_c_1899.png) for the C. M. Nothling vineyard and shingle roof cottage image, circa 1899.
- [State Library of Queensland Maleny Sawmill image via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:StateLibQld_2_234402_Sawmill_workers_at_the_Maleny_Sawmill_in_the_Blackall_Range.jpg) for sawmill workers in the Blackall Range, 1894.
- [Queensland Heritage Register: Fairview](https://apps.des.qld.gov.au/heritage-register/detail/?id=602105) for pit-sawn timber, dairy farming, corn, and early Maleny district building context.
- [Maleny Wiki](https://malenywiki.org/index.php/Main_Page) for community-authored Maleny co-operative movement context. Treat as a lead, not a sole authority.
- [National Library of Australia: Built on Butter](https://catalogue.nla.gov.au/catalog/5078974) for Brian D. Bauer's dairy co-operative book record. The record marks the book as in copyright, so use notes and short references only unless permission is secured.

## Deck asset set

Build the first supporter deck from 10 assets:

1. Aerial site photo: `client/public/images/compendium/hero-aerial.jpg`
2. Front building photo: `client/public/images/compendium/seed-house-front.jpg`
3. Garden person photo: `client/public/images/compendium/sophie-garden.jpg`
4. Team/garden selfie: `client/public/images/compendium/team-garden-selfie.jpg`
5. Barry shed portrait or workbench photo: `client/public/images/compendium/barry/IMG_5745.jpg`
6. Master floor plan: `client/public/images/compendium/MASTER FLOOR PLAN.png`
7. Site plan layers: `client/public/images/site-plan/cropped/masterplan.png`
8. Witta/Teutoburg agriculture photo: `client/public/images/witta/history/teutoburg-farm-couple-corn-1899.png`
9. Witta/Teutoburg cheese or dairy photo: `client/public/images/witta/history/teutoburg-cheese-making-1899.png`
10. Works page screenshot: `docs/brand/screenshots/harvest-works-2026-05-08.png`

Use these as the first deck spine before adding icons or decorative marks.

## Current website share image

Default social preview image:

```text
client/public/images/social/harvest-social-card.jpg
```

Source:

```text
Real Harvest milk-crate photo supplied by Ben, cropped from `client/public/images/membership/member-welcome-crates.jpg`.
```

Use:

```text
Default Open Graph, Twitter/X card, and website structured-data image for pages that do not set their own page-specific preview image.
```

Decision:

```text
Use this instead of the old generated long-table hero image. No identifiable people visible. Fits the current timber, dairy, and co-operative story better than generic venue imagery.
```

## Simple icons and support visuals

Use icons like road signs, not illustrations trying to carry the brand.

Allowed:

- Garden, Kitchen, Art Space icons.
- Milk crate, tool, plate, path, table, shed, and map line marks.
- Crop frames, labels, arrows, date stamps, and source tags.
- One-colour or two-colour marks from the Harvest palette.

Avoid:

- fake people
- fake farms
- fake historical scenes
- cartoon nostalgia
- decorative icons that compete with the photo

## Review loop

1. Put the asset in the Notion asset review database.
2. Fill provenance, rights, consent, attribution, and story source.
3. Mark it as `Use in deck`, `Use in social`, `Approved`, `Needs work`, or `Archive`.
4. Build from approved or selected assets only.
5. Record the final output back in Notion.
