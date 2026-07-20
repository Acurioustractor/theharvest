# Photos and content for the next phases: the operating system

Created 2026-07-02, after the open-era site refresh (commit `96f51f0`). Companion to
`now-open-communications-map-2026-07.md` (the story). This doc is the machinery: how
photos and content get onto the website from here, without code changes becoming the
bottleneck.

## The two photo rails

**Rail A: living galleries (Empathy Ledger).** EL is the canonical photo home. Anything
uploaded there with the right tags flows onto the site automatically, no deploy needed.

- Upload: `/admin/media-library` for a handful, or clone
  `scripts/upload-harvest-may-photos-el.ts` for a batch (the May run put 98 photos
  through this way).
- Tag recipe: date (e.g. 2026-06), category (`milestone` for opening day), themes
  (`grow` / `make` / `gather`), plus work tags for anything showing a specific work
  (the pavilion, the paths, the shop shelf).
- Where it lands: the Journey gallery and Explore page immediately; per-work heroes on
  /works; per-person photos on /people. EL resizes on render, so no webp step.

**Rail B: fixed hero slots (repo images + admin overrides).** The big set-piece images
(home hero, section backgrounds, page heroes) are files in `client/public/images/`
with webp derivatives in `images/optimized/`. Two ways to change them:

- Admin swap, no deploy: the home page (and other slotted pages) read
  `imageOverrides` per page + slot (verified live: the home page requests ten slots,
  e.g. `garden-area-card`, `milk-crate-pavilion-card`, `the-milk-man-card`). Any image
  already in the media library can be swapped into a slot from the admin.
- New files, one deploy: drop the source jpg in `client/public/images/opening/`,
  derive webp at the house sizes (1600/1400 hero, 1000-1200 feature, 760-900 card;
  no script exists yet, generate by hand), commit.

## The slot map: what is waiting for opening-day photos

In priority order, once photos from 20 June (or any good day since) exist:

1. `/june-20` "The place as it stands" section: three marked stand-in slots
   (`photoSlots` in GardenLaunch.tsx, code comment says replace with accurate alt text).
2. Home: hero and closing background (Rail B), plus the six works cards (Rail A via
   work tags, or admin swap).
3. `/photo-wall`: currently "No photos on the wall yet", flips to alive the moment
   photos land in the bucket. Public upload means visitors can fill this one.
4. `/membership` hero, `/shop` (zero images today), the Gather recap strip,
   `/whats-on` past-event entry.
5. `/works/the-milk-man`: the page itself asks for a real photo of the Milk Man.

## Capture rhythm (so the next event never has this photo gap)

The 20 June gap happened because nobody owned capture. The fix is a standing rule:

- **Every work day, gathering and shop window gets one named photo owner** (Susie or
  Joey by default). Ten photos is plenty: hands working, the place, the food, one wide
  shot. Consent asked at the moment of shooting, per the day-of pattern already in the
  weekend runbook (task T48).
- **Same-week upload** to EL with the tag recipe above. Ten tagged photos beat a
  hundred sitting on a phone.
- **Visitors are a second lens**: the photo wall accepts public uploads from any visit.
  Mention it at events; the QR assets already exist (`qr-photo-wall.png`).

## The content rails (edit where it lives)

| Rail | What | Cadence | Who edits | Where |
| --- | --- | --- | --- | --- |
| Evergreen truth | What The Harvest is, the three doors, page copy | When reality changes | Ben (repo) | Site pages, this repo |
| Live dates | Work days, gatherings, pizza nights | As scheduled | Susie/Joey | Mighty first, then /whats-on (harvest_events), then socials |
| Pulse | Harvest Notes (Note 04 staged) | Occasional, when there is something worth saying | Drafted in repo scripts, human-sent via GHL | GHL campaigns |
| Work updates | Per-work progress lines | After work days | Susie/Joey via admin Pulse slots | /works pages, no deploy |
| Editable copy | Slotted page text overrides | Rarely | Admin UI | EditableText DB |
| Stories | Long-form people/place stories | As they are gathered | EL pipeline | /stories, /people |

The one rule that keeps this sane: dates land on Mighty first, every time. The website
carries the standing truth; the members page carries the calendar; the Note carries
the pulse. Nothing is written in two places.

## Next-phase triggers: when X happens, update Y

| Trigger (next phase) | Website updates | Other surfaces |
| --- | --- | --- |
| Opening-day photos found | Slot map items 1-5 above | Social after-story; photos into Note 05 |
| Ben/Nic write the 20 June debrief (one paragraph) | /june-20 recap detail, /gather recap, Compendium Ch. VII | Note 05 opening lines |
| First work day scheduled | /whats-on upcoming entry | Mighty event first, then socials |
| Shop: first shelf stocked with real names | /shop shifts to "open windows" copy + maker names + photos; /works/the-shop status | Note: "the shelf is real"; maker's own channels |
| Shop: opening windows decided | /shop + /contact hours line, footer | Mighty pinned post |
| Visiting rhythm settles (a reliably-open day) | /contact VISITS block, home closing block | Google Business profile if/when created |
| Art space: first making session | /bauhaus/art-space "here now" block | Mighty + Note |
| Paid supporter tier decided | /membership (only if launched; never a price before) | Mighty plan cleanup ($30/wk plan vs $20/wk skill conflict) |
| Cafe sub-operator goes public | /about + /venue-hire kitchen mentions get a name | Their channels + ours together |

## Standing constraints (from the copy contract)

No attendance figures, no invented hours or dates, no prices, "work days" never
"working bees", no em-dashes, kitchen is future sublicenced until the sub-op is public,
and anything not traceable to a source gets cut. The full contract lives in the commit
message of `96f51f0` and in `now-open-communications-map-2026-07.md`.
