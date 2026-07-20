# Shop People Engagement — Build Plan

> Created 2026-05-27. Track from the community-engagement review. Goal: make the shop a real
> engagement path for producers and makers ahead of the Wk4 launch content ("the shop, the
> question", Jun 2-8). Four parts, approved together.

## What already exists (verified 2026-05-27)

- Nav "Shop" → `/works/the-shop` (`HarvestReviewTest.tsx` `pageNavLinks`).
- The Shop work (`works.ts:287`) carries the hook ("village shop Witta hasn't had in a
  generation"), three Witta threads, and three CTAs to `#shop-interest`.
- `WorkDetail.tsx:337` renders `<ShopInterestSection />` for the-shop.
- Intake `shopInterest.submit` (`routers.ts:870`) → tags `project:act-hv`, `role:supplier`,
  `interest:markets`, `shop-follow-up`, `shop-stage-1`, offer tag → fires "Harvest - Shop Interest Receipt"
  (`GHL_SHOP_INTEREST_WORKFLOW_ID`, wired). Receipt fires once, no further touch.

So the door is not missing. The gaps are friction at the door and no ongoing drip.

## Part 1 — Cut the form friction (code)

Today the intake requires name, email, offer type, **description (min 20 chars)**,
**location (min 3)**, **readiness (min 3)**. The launch plan §4 says strip to name, email,
one line, enrich later.

**Decision:** stage-1 = name, email, offer type, and an optional short "what could go on the
shelf?" line. Drop location + readiness from the door (gather them in the drip / a real
conversation). Shared component, so this also lightens the form on `/membership`.

- `server/routers.ts` shopInterest schema: `description` → `.max(2000).optional()`;
  `location` → `.max(180).optional()`; `readiness` → `.max(180).optional()`. Update the note
  builder to skip blank fields.
- `client/src/components/ShopInterestSection.tsx`: remove the location + readiness inputs
  from the form, make description optional (placeholder "Optional: a line on what you grow,
  make, or want to help test"). Keep name, email, phone (optional), offer type, description.

## Part 2 — Dedicated /shop landing (code)

A lean, action-first door for producers/makers, distinct from the deep `/works/the-shop`
story.

- New `client/src/pages/Shop.tsx`: `SiteNav` + short hero (the 50-years hook, one line) +
  "Four ways onto the shelf" (produce / made goods / food + ferments / shared shelf, mapped
  to the offer types) + `<ShopInterestSection />` + a "Read the full story" link to
  `/works/the-shop` + `SiteFooter`. Reuse `SiteNav`/`SiteFooter`/`harvestButtonClasses` from
  `HarvestReviewTest` (same pattern as `Membership.tsx`).
- `client/src/App.tsx`: import `Shop`, add `if (location === "/shop") return <Shop />;`.
- `HarvestReviewTest.tsx` `pageNavLinks`: repoint "Shop" from `/works/the-shop` → `/shop`.
- `/works/the-shop` keeps its own `#shop-interest` form, so its existing CTAs still work.

## Part 3 — Improve /works/the-shop (code, light)

Add one cross-link from the Shop work to the new `/shop` door ("Want on the shelf? →
/shop"). Content there is already strong; no rewrite. Keep this minimal.

## Part 4 — Shop drip in GHL (spec only, user builds)

The receipt fires once. Add a nurture sequence so makers get ongoing, useful touch — the
"engagement" the track is about. Same shape as the follow-welcome we just shipped.

- New spec section in `ghl-workflow-build-specs.md`: **"Harvest - Shop Nurture"** — trigger
  on tag `interest:markets`, wait a few days, send a follow-up branched by offer tag
  (`shop-produce` / `shop-maker` / `shop-food` / `shop-consignment` / `shop-follow-up`).
  Harvest-voice email copy per branch, drafted in the spec. Keep the existing receipt
  workflow as the immediate ack; the nurture is the second touch.
- User builds it in GHL (cloning pattern), sends the workflow ID; if it needs its own env
  var we add + wire it like the follow-welcome. If it just extends the existing receipt
  workflow, no env change.

## Order + verification

1. Part 1 + Part 2 + Part 3 together (all code). `npx tsc --noEmit`, then `npm run build`.
2. Optional: smoke-test the lighter form to GHL (one test contact, flagged for cleanup).
3. Part 4: write the spec + copy, hand to user for the GHL build.

## Open decisions (confirm before build)

1. Friction: OK to drop location + readiness from the door and make description optional,
   including on `/membership` (shared component)?
2. Nav "Shop" repoints to `/shop` (deep story stays at `/works/the-shop`)?
3. Drip as a new "Harvest - Shop Nurture" workflow (vs extending the receipt)?
