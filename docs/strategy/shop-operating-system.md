# The Shop Operating System

> Status: decisions locked 2026-05-28, build to follow. The end-to-end model for The Harvest shop: how makers get on the shelf, how sales and pay work, who staffs it, how we build the maker community, and how customers and the brand are engaged. Sits under the philosophy (`the-harvest-philosophy.md`) and alongside the engagement plan. The GHL maker mechanics live in `ghl-pipeline-playbook.md` and `harvest-ghl-tag-and-automation-map.md`; this doc does not repeat them.

## What the shop is

A shared shelf for what people around Witta and Maleny grow and make, with honest signage about who made it and what they got paid. Not a supermarket, not a boutique. It starts small and opens slowly, as the products and the people to run it come together.

## The five decisions (locked 2026-05-28)

1. **How it is run: staged.** The community shared-shelf is **Harvest-run programming now** (consignment, stewards, a fair cut). The commercial cafe and retail is the **sublicensed future phase** (the "moving inside" step in the philosophy). This keeps the locked operating-model position ("retail sublicensed") intact: that position now clearly means the future commercial layer, not the community shelf. See open items for the alignment note.
2. **The cut: balanced consignment, about 75 to 80 percent to the maker.** The shop's 20 to 25 percent covers card fees, staffing, and overhead. Exact split to confirm with Standard Ledger.
3. **The till: Square.** GHL cannot sell or pay makers. Square runs sales, inventory, and maker payouts. GHL stays the maker relationship CRM.
4. **Staffing: stewards plus maker shifts, weekend hours.** Susie and Joey anchor it; makers do occasional shifts in exchange for shelf space (which doubles as community-building). Limited weekend or market-day hours to start, grow as it proves.
5. **Signage: a shop-wide pledge plus the maker per product.** A shop-wide promise ("makers keep about X percent") plus each product naming its maker and origin. This honours "what they got paid" without exposing each maker's individual pricing.

## Two sides of the system

- **Supply** is the makers and producers. GHL (a relationship CRM) is built for this.
- **Demand** is the customers. GHL does nothing here; Square and the newsletter do.

## Supply: the maker journey, end to end

| Step | What happens | Where it lives |
| --- | --- | --- |
| 1. Interest | `/shop` form applies `harvest-shop-interest` plus an offer tag | GHL Shop pipeline, New interest |
| 2. Connect | "Book a chat about the shop" calendar, a real conversation | In conversation |
| 3. Onboard | Consignment agreement, pricing, the story, food-safety where needed | Sampling / trial shelf |
| 4. On the shelf | Live stockist, honest signage | On the shelf |
| 5. Sell | Customer buys | Square |
| 6. Pay the maker | Payout at the agreed split, transparently | Square / accounting |
| 7. Restock and nurture | Ongoing relationship, "how is it selling" | GHL (shop nurture, spec 6) |

GHL holds steps 1 to 4 and 7 (the relationship and follow-up). Square holds steps 5 and 6 (the till and the payouts). The offer tags (`shop-produce`, `shop-maker`, `shop-food`, `shop-consignment`) segment within the pipeline.

## How sales and money work

- **Consignment.** The maker keeps ownership until the item sells. On sale, the maker is paid about 75 to 80 percent; the shop keeps 20 to 25 percent. Low risk for makers, fits "start small."
- **Square** records each sale against the maker, tracks stock, and runs the payouts so the split is clean and auditable.
- **The shop-wide pledge is the brand.** "Makers keep about X percent" on the wall, plus each product naming its maker and origin. Radical-enough transparency to be distinctive, without exposing individual margins.
- **Food tier gates the food side.** Selling produce, preserves, and cooked food triggers food-safety and licensing. What can go on the shelf depends on the food-business tier (see `thoughts/wiki/operations/food-business-setup-roadmap.md`).

## Staffing and hours (phase one)

- **Stewards anchor it.** Susie and Joey run the open hours.
- **Maker shifts.** Makers do an occasional shift in exchange for shelf space. This is community-building, not just cover, and it gives makers a stake in the place.
- **Hours start small.** Weekend or market-day windows to begin, extended only as the shelf and the foot traffic prove out.

## Building the maker community

- The Shop pipeline plus the "book a chat" calendar means **every maker is a person we get back to**, not a form in a void.
- A **maker smart list** ("growers in conversation", "on the shelf") lets us talk to the right group at the right time.
- A **makers' channel** (a WhatsApp group or a regular work day) turns stockists into a community who shape the shop, not just suppliers. The maker version of the members' inner ring.
- The **20 June maker session** (RSVP calendar B1) is the first gathering of this community.

## Outreach order for June

Use 1:1 emails, DMs, or calls. Do not broadcast to makers as a generic shop list. When someone
replies, move them from `New interest` to `In conversation` in the Shop pipeline and add the
best-fit offer tags.

1. **Warm leads first:** Leeza, Rebecca, Monita, Lachie.
2. **Witta and Wootha neighbours next:** Robyn Jay, Fleur / Pinch & Spin, Jacky Lowry,
   Fresh Flavours Farm.
3. **Fast shelf-stable wins:** honey, coffee, chai, preserves.
4. **Gallery and market channels:** David Linton, Maleny Handmade, Sapling, Peace of Green,
   Maleny Arts & Crafts.

## Customers and the brand

- **Discovery:** the launch after-story, "new on the shelf this week" in the newsletter, signage, locals, word of mouth in a town of around 1,300.
- **Experience:** meet-the-maker stories, the honest signage, the rough-and-real feel. A connection, not a transaction.
- **Repeat:** seasonal rhythm, members hear first, the shop as a reason to keep coming back.
- **Brand:** transparency (who made it, what they got paid), local, and honest about being in-progress.

## What each system holds

- **GHL:** the maker CRM. Pipeline, tags, the "book a chat" calendar, the shop nurture workflow (spec 6), maker smart lists. The "get back to makers" engine.
- **Square:** the till. Sales, inventory, maker payouts, customer purchase history.
- **Signage:** the brand promise made physical, on the wall and on each product.
- The customer side barely touches GHL beyond the newsletter list and "new on the shelf" broadcasts.

## Food-business tier (Phase A position, council to confirm)

The shop is **retail of others' food**, not on-site preparation, so the food-business path here
differs from the cafe path in `thoughts/wiki/operations/food-business-setup-roadmap.md`. That doc
covers the future kitchen and cafe; this section covers the shelf.

Three categories with different rules:

- **Fresh whole fruit and vegetables: exempt** under the Queensland Food Act. Sell freely on the
  shelf.
- **Pre-packaged shelf-stable food** (preserves, jams, honey, dried, baked, ferments) **made by a
  maker who holds their own QLD home-based food business licence: legally retailable** from the
  shelf. The maker carries the food-safety obligation under their own licence; the shop is a
  retail outlet. Council can confirm site-level requirements (labelling display, storage, no
  on-site repackaging).
- **High-risk perishables** (chilled dairy, meat, ready-to-eat foods needing temperature
  control): **not yet.** These require a shop-level Food Business Licence (~$400 to $700/yr) plus
  a Food Safety Supervisor. Avoid these on the shelf at launch; revisit at Phase B (the cafe).

**Recommended Phase A position:** "Retail of pre-packaged shelf-stable food + fresh whole
produce", **no shop-level food business licence required**, each maker holds their own licence
where needed. **Confirm in writing with the Sunshine Coast Council Environmental Health team
before the first sale.** Single phone call, about 30 minutes. This is a Notion action.

Sources: Queensland Food Act 2006, QLD Health "Do I need a food business licence?", Sunshine
Coast Council food-business pages, `food-business-setup-roadmap.md` (cafe tier ladder).

## Signage copy (paste-ready, hold the percent until SL confirms)

Two pieces. The final shop-wide pledge percent waits on Standard Ledger confirming the
consignment split.

### Shop-wide pledge (one large board, prominent at entrance or above the shelf)

> Makers keep [X percent] of what you pay. The Harvest keeps the rest, to cover card fees and
> the shop's share of work. We tell you both, because we think you should know.

Variant for an entry sign or window decal:

> A shared shelf for what Witta and the hinterland grow and make. Honest about who made it
> and what they were paid.

`[X percent]` resolves to 75 to 80 once Standard Ledger confirms (P4 task).

### Per-product label template (card on or near each item)

```
[ITEM NAME] · [MAKER FIRST NAME] · [PROPERTY OR BUSINESS NAME]
Made at [PLACE], from [SOURCE].
$[PRICE]
```

Optional: a one-sentence story line under the heading, in the maker's own words.

Example:

```
Plum Jam · Sarah · Sarah's Stone Fruit
Made at Maleny, from her own backyard plums.
$8.50
"Cooked in a copper pot, no pectin, just plums and time."
```

### Implementation

- The shop-wide pledge: printed once, A2 or larger, mounted prominently. **Nic to design** in
  Harvest visual language.
- Per-product labels: a simple template Susie/Joey fill per item. Card stock and handwriting
  works for the small-and-honest feel; or print in small batches. **Each maker confirms their
  own line** so the story is theirs.
- Update labels whenever a maker's offer changes. Part of the steward weekly rhythm, not a
  special task.

## Square setup (with the consignment add-on decision)

The blunt finding: **Square POS does not natively handle consignment commission splits.** This
is the main decision for the till.

### Two paths

**Path A: Square + manual reconciliation (recommended at launch).**
- Square POS standalone (free app, transaction fees about 1.6 percent in-person card-present in
  Australia).
- Each maker tagged as a vendor in Square via item description or SKU prefix (e.g. `SAR-` for
  Sarah's items).
- Weekly reconciliation: Susie or Joey exports the sales report, splits by maker, pays out
  manually by bank transfer.
- **Pros:** no monthly fee, dead simple, full control over the numbers.
- **Cons:** reconciliation time grows with volume; depends on someone running it weekly.
- **Fit:** the launch phase ("starts small and opens slowly"), 1 to 20 active makers, low
  weekly turnover.

**Path B: Square + a consignment add-on (consider at scale).**
- A third-party tool layered over Square: Rose (~$75/month/location), Circle-Hand, or
  ConsignCloud.
- Automated commission splits, consignor portals, payout tracking.
- **Pros:** scales without admin burden.
- **Cons:** monthly subscription, another tool to learn and maintain.
- **Fit:** the shelf grows past roughly 20 active makers with steady weekly turnover, or manual
  reconciliation starts taking more than an hour a week.

**Recommended Phase A position: Path A (manual reconciliation), revisit at scale.** A monthly
subscription only earns its keep once volume justifies it.

### Hardware (Path A, one-off)

- **Square Reader** (contactless + chip): about $65 from Square Australia, one-off.
- **iPad or Android tablet** for the POS app: use an existing tablet or a refurb.
- Optional later: cash drawer + receipt printer for a full-till feel, about $300 combined.
  Defer until the till is in regular use.

### Setup checklist

- [ ] Open a Square account at squareup.com.au under The Harvest Pty Ltd ABN.
- [ ] Order the Square Reader.
- [ ] Set up items in Square, one item per maker product (or one item per maker with sub-SKUs).
      Put the maker's name in the item description or SKU prefix so the sales report can be
      filtered.
- [ ] Set up the weekly sales report export from the Square dashboard.
- [ ] Agree the reconciliation rhythm (suggested: Monday morning, looking back at Sat/Sun
      sales).
- [ ] Path A vs Path B review at six months, or sooner if reconciliation runs over an hour a
      week.

Sources: Square Community thread on consignment, Circle-Hand "Square POS for consignment"
guide, Square Australia pricing pages.

## Open items to confirm

- **Exact consignment split** (within 75 to 80 percent) with Standard Ledger, so the cut covers
  real costs without breaking the fair-pay promise. Gates the final shop-wide pledge percent.
- **Sunshine Coast Council EHO call** to confirm the Phase A food position above (single phone
  call, about 30 minutes).
- **Shop nurture workflow** (spec 6) still to be built in GHL.
- **Square Path A vs Path B review** at six months, or sooner if reconciliation overruns.
