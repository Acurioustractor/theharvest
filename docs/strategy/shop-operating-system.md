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

## Open items to confirm

- **Exact consignment split** (within 75 to 80 percent) with Standard Ledger, so the cut covers real costs without breaking the fair-pay promise.
- **Operating-model alignment note:** the locked operating model says "retail sublicensed". Record that this now means the future commercial cafe and retail layer, not the community shelf, so the two do not drift. Worth a line in the strategic plan / operating-model record.
- **Food-business tier** for the shelf (what food can be sold), per the food-business roadmap.
- **Square setup:** account, hardware (card reader), and the maker-payout configuration.
- **Shop nurture workflow** (spec 6) still to be built in GHL.
