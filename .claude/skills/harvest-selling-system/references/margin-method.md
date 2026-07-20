# Margin method + worked Bidfood order

## The method (five steps)

1. **True cost per unit.** Take the supplier "Price" (ex-GST) and divide by the number
   of sellable units in the pack. `node scripts/margin.mjs unit <packPrice> <units>`.
   For made food, add up the cost of each ingredient at its per-gram cost.
2. **Add a small reality factor.** Wastage, spoilage, free pours, the odd dropped pizza.
   ~5–10% on perishables. Don't price off the theoretical cost alone.
3. **Set the public price** to a target *food cost %* (cost as a % of net revenue).
   Default blended target ~30–35%. `node scripts/margin.mjs price <cost> <pct>`.
   Then round to a friendly community point ($15, $16, $17, $5, $6.50).
4. **Set the member price** below public but never below cost — see `member-model.md`.
5. **Sense-check the night, not just the item.** Multiply margin per item × expected
   volume. A thin-margin soda at high volume can still matter; a fat-margin item nobody
   buys does not. Re-cost from each new Bidfood invoice; re-check the menu quarterly.

## GST, the one rule that trips people up

A Curious Tractor is GST-registered, so:
- **Costs you enter are ex-GST** (Bidfood "Price" column, not "Total"). You claim the
  GST back, so it isn't a real cost.
- **A taxable shelf price is net ÷ 1.1 to you.** A $5 soda = $4.55 yours + $0.45 GST you
  remit. Cooked/prepared food and most cafe drinks are taxable. A few packaged shop
  goods and plain unprepared food are GST-free (use `--gst-free`).
- So the calculator works on **net (ex-GST) revenue** for every margin figure.

## Targets (sustainable hospitality, the locked default)

| Lever | Target | Note |
|---|---|---|
| Blended food cost | 30–35% of net | Across the menu, not item-by-item |
| Drinks (bought-in cans) | accept 50–65% | Service items, not the margin engine |
| Coffee / house-made (future) | 10–20% (very high margin) | Where real beverage margin lives |
| Prime cost (food + labour) | keep under ~60–65% of revenue | The number that actually decides if a night pays |

Don't apply a flat 3× to every line — the "rule of three" comes from 1 ÷ 33% and it
over-prices cheap items and under-prices expensive ones. Price the *menu* to the blend.

## Worked example — the Bidfood order ($2,470.92 inc GST, 2026-06)

### Where the money went (ex-GST)

| Bucket | Spend | Share | Lifespan |
|---|---|---|---|
| Premium drinks (resale) | $1,184.78 | 50.1% | Multi-week pantry |
| Pizza inputs | $940.10 | 39.8% | ~50–100 pizzas |
| Dessert | $118.42 | 5.0% | Per-event |
| Packaging | $119.70 | 5.1% | Per-event |

**Half the order was premium cans — the thinnest-margin thing in the box.** Treat that
as a stock-up across several nights, not one night's cost, and don't over-buy it.

### Cost per sellable unit — drinks

| Drink | Pack | Pack $ | Cost/unit | GST on sale |
|---|---|---|---|---|
| Coconut water natural | 24 × 500ml | $60.87 | $2.54 | GST-free |
| Coconut & yuzu | 24 × 500ml | $57.69 | $2.40 | GST-free |
| San Pellegrino 250ml | 24 × 250ml | $46.28 | $1.93 | taxable |
| Bundaberg ginger beer | 24 × 375ml | $54.50 | $2.27 | taxable |
| Jarritos (cola/lime/mango/guava) | 24 × 370ml | $64.22 | $2.68 | taxable |
| OK Boocha kombucha | 16 × 375ml | $62.02 | $3.88 | taxable |

### Cost per pizza — components (assumed grams in brackets)

| Component | Pack | Cost/pizza |
|---|---|---|
| Classic base (Letizza 12") | 24 | $3.07 |
| Thin base (Mission 12") | 15 | $2.57 |
| GF/vegan base (La'Bakehouse 11") | 15 | $6.28 |
| Tomato sauce (Mutti, 80g) | 4.1kg | $0.48 |
| Shredded mozzarella (Alfinas, 120g) | 2kg | $1.64 |
| Buffalo mozzarella (La Stella, ½ × 125g) | 125g | ~$3.00 |
| Pepperoni (Primo, 40g) | 1kg | $0.91 |
| Ham (Hans, 50g) | 2kg | $0.65 |
| Pineapple (Dewfresh, 60g drained) | 3.03kg | $0.27 |
| Parmesan shaved (Alfinas, 15g) | 1kg | $0.43 |
| Kalamata olives (Kalos, 20g) | 2kg | $0.23 |
| Garlic bread (per piece) | 40 | $1.91 |
| Nutella (50g) | 1kg | $0.89 |

Seasonings, flour, semolina, dressing are cents per serve — fold into the reality factor.

### Sample builds → recommended prices

The Member column is the design target; on the day it is enforced as a flat **15% Members
discount** in Square (which lands within ~$0.50 of these and rounds member-favourably), plus
a free coffee. See `square-setup.md` and `launch-runbook.md`. Member prices stay above cost.

| Item | Food cost | Public | Member | Public cost % |
|---|---|---|---|---|
| Cheese / Margherita | $5.19 | $16 | $13 | 36% |
| Pepperoni | $6.10 | $17 | $14 | 39% |
| Ham & pineapple | $6.11 | $17 | $14 | 40% |
| Buffalo margherita (premium) | $8.19 | $21 | $18 | 43% |
| GF / DF base | +$3.20 input | +$3 surcharge | +$3 | — |
| Garlic bread | $1.91 | $6 | $5 | 35% |
| Nutella dessert pizza | $4.26 | $12 | $10 | 39% |
| Sodas / ginger beer / coconut | $2.27–2.68 | $5 | $4 | 50–60% |
| San Pellegrino 250ml | $1.93 | $4 | $3.50 | 53% |
| Kombucha | $3.88 | $6.50 | $5.50 | 66% |
| Coffee (when it exists) | ~$0.70 | $5 | free 1/visit | ~15% |

A night selling ~80–100 pizzas at a ~$16 average is roughly **$1,000+ gross margin**
before labour. That is the engine. Drinks add a few hundred dollars of margin and round
out the offer.

## Three things this order flagged (resolved for the ~60-pizza launch night)

1. **Cheese was the binding constraint - now par'd.** 3 × 2kg shredded mozz at 120g/pizza
   was only ~50 pizzas of cheese. Par is now **4 × 2kg** (8kg, ~60-70 pizzas at ~110g) in
   `par-sheet-template.csv`. Cheese is the 2nd-biggest pizza cost, so portioning it tight
   (~110g) is the single biggest margin lever on pizza.
2. **The pizza boxes don't fit the pizzas.** Ordered boxes are 7"/18cm; bases are
   11-12"/28-30cm. Order a **12-13"** box for whole-pizza takeaway; keep the 7" for garlic
   bread and dessert slices. Confirm the Bidfood code for a 12-13" box before the next order.
3. **Vegan: GF only for now.** Founder decision (2026-06-18): no vegan pizza on the launch
   menu. The GF base is served with dairy cheese, so there is no vegan claim. Add a plant
   cheese later if a vegan pizza goes on. (No plant cheese in the next order.)

## Menu engineering (review quarterly)

Plot each item on margin (high/low) × popularity (high/low):
- **Stars** (high margin, high sales) — protect, feature, never discount carelessly.
- **Plowhorses** (low margin, high sales, e.g. cheap pizzas) — nudge price up, trim cost
  (cheese portion), or bundle with a drink.
- **Puzzles** (high margin, low sales) — promote, reposition on the menu/board.
- **Dogs** (low margin, low sales) — cut, unless they're there for range/ethos reasons.
