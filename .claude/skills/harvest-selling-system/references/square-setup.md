# Square setup — simple but effective

The goal: Square does the selling, the receipts, and the margin reporting; it tracks
stock only for *packaged resale* items. The kitchen is run off a par sheet, not Square.
Square for Restaurants has a free tier that covers all of this.

> Verification note: feature behaviour below is from Square's Help Center as summarised
> by research 2026-06-18. AU pricing/processing rates and the exact low-stock-alert
> behaviour were **not fully verified** — confirm on squareup.com/au before relying on
> them. See `research-and-benchmarks.md`.

## 1. Item Library + categories

Build one Item Library. Categories double as the on-screen buttons on a busy night:

- **Pizza** — one item per pizza, with size as a *variation* if you do more than 12".
- **Sides** — garlic bread, salad.
- **Drinks** — one item per line (each carton type from Bidfood).
- **Dessert** — Nutella pizza, s'mores.
- **Coffee** — when it exists (the member-freebie hero).
- **Shop** — packaged shelf goods (see `shop-operating-system.md`).

## 2. Put the COST on every item

Each item/variation has a **unit cost** field. Enter the ex-GST cost from
`margin-method.md`. Square's reports then show **revenue, profit and margin per item and
per category** automatically — this is how you see, after a night, which pizzas and
drinks actually paid. Re-enter costs whenever a Bidfood invoice moves the price.

## 3. Inventory — track resale only (two tiers)

- **Track stock = ON** for packaged resale: every drink, every shop item. Square
  decrements on sale, so a weekly count reveals variance (theft, waste, miscount,
  comps). Target variance < 3%.
- **Track stock = OFF** for made-to-order food (pizzas, garlic bread). Tracking flour
  and cheese in Square is more admin than it's worth — those live on the par sheet in
  `stocktake-and-ordering.md`.
- Enable low-stock alerts on the high-movers (your top sodas) so you reorder before a
  night runs dry. (Exact alert mechanism unverified — confirm in-app.)

## 4. Member pricing enforcement

**Locked (2026-06-18): one automatic 15% Members discount + a free coffee.** A single flat
15% off lands within ~$0.50 of every target member price in `margin-method.md`, rounds in the
member's favour, and is one rule instead of a per-item grid. The offer is also simple to say:
"15% off the menu + a free coffee each visit."

1. **Customer Group "Members" + automatic discount "Member 15%".** Tag the customer as a
   Member in Square; the automatic 15%-off discount, restricted to the Members group, applies
   itself at checkout when they're attached to the sale. Cleanest and least error-prone.
2. **Fallback - a "Member 15%" button** the cashier taps after checking membership status
   (Mighty app / GHL tag / member card). Use this only if the automatic discount won't fire.
3. **Free coffee** is a **comp** (or a $0 "Member coffee" item) so it shows in reports as a
   redemption, not a lost sale. One per visit.

If you later want the exact per-item grid (e.g. $3 off pizza, $1 off drinks), build
category-scoped automatic discounts instead of the single flat one - more setup, more exact.

Run the **test sale in `launch-runbook.md` §2** before promising members the discount: a
Pepperoni + soda for a Members customer should drop $22.00 -> $18.70 automatically.

Square **Loyalty** (points/visits) is a paid add-on — optional. The membership itself
lives in Mighty Networks / GHL, not Square; Square just enforces the price on the day.
See `member-model.md` for who-owns-what.

## 5. Reports to actually look at

After every event and weekly:
- **Item Sales** — units sold per item (forecasts the next Bidfood order).
- **Category Sales** — is Pizza carrying the night like it should?
- **Cost of Goods / margin report** (needs step 2 done) — gross margin $ and %.
- **Discounts** — how much member pricing + comps cost, to feed the member breakeven.

## 6. Hardware + day-of

- A **Square reader/terminal** for tap-and-go on event days; the Square POS app on an
  iPad/phone as the till. One device can run the night; add a second for a long queue.
- Pre-build the night's menu as a **layout** so the right buttons are one tap away.
- End of night: cash up, read the Item Sales + COGS report, note any 86'd items (sold
  out) — that's tomorrow's reorder signal.

## What Square is NOT for here

- Not the kitchen stock system (par sheet does that).
- Not the membership database (Mighty Networks / GHL).
- Not the supplier ordering tool (Bidfood order history is the template).
