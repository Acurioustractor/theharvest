# Stocktake + Bidfood ordering — the simplest system that works

The whole system is two tiers and one weekly loop. Resist anything more complex until
the volume genuinely demands it.

## Two tiers

| Tier | What | Tracked where | Counted |
|---|---|---|---|
| **A — Resale** | Drinks, packaged shop goods | Square inventory (decrements on sale) | Weekly count → reconcile against Square (variance < 3%) |
| **B — Kitchen** | Flour, semolina, sauce, cheese, meats, toppings, dessert, packaging | Par sheet (Google Sheet or printed) | Before each event: count → order to par |

Tier A is about catching loss (Square tells you what *should* be on the shelf). Tier B
is about never running out mid-night and never over-buying perishables.

## Par levels (the heart of it)

A **par** = the target amount you want on hand for the next event/week.
**Order quantity = par − what you counted.** Set par from expected covers:

```
pizzas expected  ×  grams per pizza  ÷  grams per pack  =  packs needed (round up)
```

Example: 100 pizzas × 100g cheese = 10kg ÷ 2kg pack = **5 packs** of shredded mozz.
(The last order had 3 — see the cheese-constraint flag in `margin-method.md`.)

Review pars after every event: if you 86'd an item, raise its par; if you threw
perishables out, lower it.

## The weekly loop

1. **Mon — count.** Tier A full count in Square; Tier B count on the par sheet.
2. **Mon/Tue — order.** Build the Bidfood order = par − counted, per item. Start from
   last order history (your reorder template) and adjust for the next event's size.
3. **Wed/Thu — receive against the invoice.** Tick every line as it arrives. Check qty
   and check the **unit price** — if a price moved, update the item cost in Square and in
   `margin-method.md`, and re-check that item's margin.
4. **Event — sell.** Square captures every sale (and decrements Tier A).
5. **After — reconcile.** Square Item Sales = next forecast; Tier A variance = loss
   check; note sold-outs.

## Per-event vs pantry (don't confuse a stock-up with a night's cost)

From the 2026-06 Bidfood order:

| Buy fresh each event | Standing pantry (lasts weeks) |
|---|---|
| Pizza bases, cheese, fresh/short-life toppings | Drinks (all cartons) |
| Garlic bread, dessert items | Dry goods: flour, semolina |
| Packaging (boxes, napkins, containers) | Shelf-stable: sauce cans, olives, dressing, seasonings, Nutella |

Order pantry to a buffer par (don't tie up cash in 4 months of soda); order per-event
items tight to the forecast.

## Reorder template — from the last Bidfood order

Use this as the starting par list; set the "Par (packs)" column from your next event size.

| Code | Item | Pack | Cost/pack | Cost/unit | Tier | Par (packs) |
|---|---|---|---|---|---|---|
| 107200 | Pizza base classic 12" | 24 | $73.56 | $3.07 | B/event | _set_ |
| 110228 | Pizza base thin 12" | 15 | $38.49 | $2.57 | B/event | _set_ |
| 170716 | Pizza base GF/vegan 11" | 15 | $94.21 | $6.28 | B/event | _set_ |
| 217211 | Mozzarella shredded 2kg | — | $27.28 | $1.64/pizza | B/event | _≥5 for 100 pizzas_ |
| 39733 | Pizza sauce Mutti 4.1kg | — | $24.52 | $0.48/pizza | B/pantry | _set_ |
| 176743 | Pepperoni 1kg | — | $22.64 | $0.91/pizza | B/event | _set_ |
| 99808 | Ham shredded 2kg | — | $26.15 | $0.65/pizza | B/event | _set_ |
| 139092 | Pineapple 3.03kg | — | $13.43 | $0.27/pizza | B/pantry | _set_ |
| 185996 | Parmesan shaved 1kg | — | $28.42 | $0.43/pizza | B/pantry | _set_ |
| 164143 | Kalamata olives 2kg | — | $23.37 | $0.23/pizza | B/pantry | _set_ |
| 4836 | Garlic bread 40×170g | 40 | $76.29 | $1.91/pc | B/event | _set_ |
| 218354 | Nutella 1kg | — | $17.74 | $0.89/serve | B/event | _set_ |
| 171363 | Mini marshmallows 375g | — | $11.98 | ~$0.30/serve | B/event | _set_ |
| 116116 | Semolina 12.5kg | — | $39.56 | dough | B/pantry | _set_ |
| 56339 | Flour plain 10kg | — | $16.56 | dough | B/pantry | _set_ |
| 189781/197912/189779/189778 | Jarritos sodas | 24 | $64.22 | $2.68 | A | _set_ |
| 206110 | Coconut water | 24 | $60.87 | $2.54 | A | _set_ |
| 206111 | Coconut & yuzu | 24 | $57.69 | $2.40 | A | _set_ |
| 28684 | San Pellegrino 250ml | 24 | $46.28 | $1.93 | A | _set_ |
| 8728 | Bundaberg ginger beer | 24 | $54.50 | $2.27 | A | _set_ |
| 213443/213446 | OK Boocha kombucha | 16 | $62.02 | $3.88 | A | _set_ |
| 221668 | Pizza boxes 7" (⚠ too small) | 100 | $25.05 | $0.25 | B/event | _check size_ |
| 175812 | Family box | 50 | $23.60 | $0.47 | B/event | _set_ |
| 222082 | Clamshell 9×9 | 100 | $34.86 | $0.35 | B/event | _set_ |
| 167993 | Bowls 12oz | 25 | $3.78 | $0.15 | B/event | _set_ |
| 86140 | Napkins 500s | 500 | $8.81 | $0.02 | B/pantry | _set_ |

A blank `references/par-sheet-template.csv`-style copy of this lives in your head until
you paste it into a Google Sheet — that sheet, not this file, is the live count surface.
Keep this table as the canonical item/cost reference; update costs from each invoice.

## Receiving discipline (the cheap insurance)

- Count what arrived against the invoice **before** the driver leaves where possible.
- Short-dated perishables: check use-by, rotate (FIFO).
- Price changed? Update the cost in Square + `margin-method.md` the same day, then run
  `node scripts/margin.mjs check <newCost> <currentPrice>` on that item to confirm the
  margin still holds. If it slipped under ~target, flag the price for review.
