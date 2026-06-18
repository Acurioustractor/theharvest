---
name: harvest-selling-system
description: Pricing, margins, Square POS, stocktake, supplier ordering (Bidfood) and the member model for The Harvest's food, drinks, events and shop. Use when working out how much to charge, calculating margins on an order, setting up or using Square, doing stocktake, restocking, pricing a pizza night, or designing member pricing and perks.
---

# The Harvest — Selling System

How The Harvest makes money on food, drink, events and the shop, in a way that
stays simple enough for a small team to run on a busy night and honest enough to
hold its margins. This skill covers five linked jobs:

1. **Working out cost** — true cost per sellable unit from a supplier invoice.
2. **Setting price** — what to charge, public price and member price.
3. **Selling** — Square POS setup and how member pricing is enforced.
4. **Restocking** — two-tier stocktake + Bidfood ordering to par.
5. **The member model** — the paid supporter tier and what it unlocks.

## Context

The Harvest is a community hub at 9 Gumland Dr, Maleny QLD (Witta, Sunshine Coast
hinterland, Jinibara Country). Food, drink and shop sales trade under **A Curious
Tractor Pty Ltd**, which is **GST-registered from 1 June 2026** — so GST is live on
sales and claimable on inputs. Pizza nights are the flagship paid event; a Harvest-run
shop shelf and ticketed events round out the income. Co-founders: Ben (builds, ops),
Nicholas (vision, community).

This skill complements, and does not duplicate:
- `docs/strategy/shop-operating-system.md` — the shop shelf / consignment model
- `docs/strategy/mighty-community-operating-system-2026-06-11.md` — Mighty Networks community
- `docs/strategy/email-operating-system.md` — broadcast vs workflow rules

## Operating principles (hold these)

1. **Pizza and house-made carry the surplus; drinks are a service.** Bought-in premium
   cans (sodas, kombucha) run 50–65% cost at community prices — fine as a range, never
   the margin engine. The margin lives in dough-based food and, once it exists, coffee.
2. **Price the whole menu, not each item at a flat 3×.** Aim for a blended ~30–35%
   food cost across the menu; let cheap-input items earn more and premium items earn
   less, rather than slavishly marking up each line.
3. **Two prices on everything: public and member.** Member value must be *felt weekly*
   or members churn (CSAs lose 25–70% a season). The single best member perk is a
   weekly coffee — ~$0.70 to make, ~$5 perceived value.
4. **Two-tier stock.** Square tracks *packaged resale* (drinks, shop goods) and
   decrements on sale. Kitchen ingredients live on a *par sheet*, not in Square.
5. **Capture true cost from every invoice.** Bidfood prices drift; re-cost the menu and
   re-check margins each quarter (or after any big price move).

## Default dials (locked 2026-06-18, change here if the strategy changes)

- **Margin target:** sustainable hospitality — blended food cost ~30–35%, drinks at
  clean community price points (~$5–6.50), with a deliberate member-value layer on top.
- **Member tier:** **$20/week supporter** (~$87/mo, ~$1,040/yr) sitting *above* the
  existing free, tag-based community membership.
- **Member perks (all four):** member price on food & drink · free/discounted event
  entry · a weekly freebie (make it coffee) · shop discount + priority access.

## How to use this skill

| You want to… | Go to |
|---|---|
| **Stand the whole system up (Square + Mighty + sweep), step by step** | `references/launch-runbook.md` |
| Get cost per unit, or price something to a target margin | run `scripts/margin.mjs` + `references/margin-method.md` |
| Understand the method, GST handling, the worked Bidfood order | `references/margin-method.md` |
| Set up or run Square (items, costs, member discount, reports) | `references/square-setup.md` + `references/square-item-build-sheet.csv` |
| Do stocktake, set par levels, place a Bidfood reorder | `references/stocktake-and-ordering.md` + `references/par-sheet-template.csv` |
| Design or price the membership and its perks | `references/member-model.md` |
| See the sourced benchmarks behind all of this | `references/research-and-benchmarks.md` |

## The calculator

`scripts/margin.mjs` is a zero-dependency CLI. Cost is **always entered ex-GST** (the
Bidfood "Price" column). Sales default to taxable (incl 10% GST); add `--gst-free` for
the rare item whose sale carries no GST.

```
node .claude/skills/harvest-selling-system/scripts/margin.mjs unit 64.22 24   # cost per can
node .claude/skills/harvest-selling-system/scripts/margin.mjs check 6.10 17    # is $17 a good price?
node .claude/skills/harvest-selling-system/scripts/margin.mjs price 6.10 33    # price to a 33% cost target
node .claude/skills/harvest-selling-system/scripts/margin.mjs price 2.54 50 --gst-free
```

## When triggered

- "Work out the margin on this Bidfood order / this item"
- "How much should we charge for [pizza / a soda / garlic bread / a member meal]?"
- "Set up Square for the pizza night / add these items / how do member prices work?"
- "Do a stocktake / what do we reorder / set par levels"
- "Price the next pizza night" or "what does the member tier need to unlock to break even?"
- Any question about The Harvest's food/drink/shop pricing, margins, POS or stock.

## Guardrails

- **Voice:** no fabricated counts, attendance or sales figures. No em-dashes, no AI
  vocab, "work days" not "working bees" in any public-facing copy. (See project memory
  `feedback-harvest-voice`, `feedback-no-fabricated-facts`.)
- **GST:** quote costs ex-GST; remember a taxable shelf price is net ÷ 1.1 to The Harvest.
- **Member tier reconciliation:** the $20/week paid tier is *new* and sits above the
  existing free community membership. Before launching it, reconcile naming, billing
  location (Mighty subscription vs Square recurring vs GHL) and perk enforcement against
  the Mighty + shop operating-system docs. Do not silently overwrite the free tier.
- **Money is day-shift.** Anything that writes to Square/GHL/Mighty or sends to a
  customer is a deliberate, human-in-loop action, not an AFK one.

## File references

| Need | Reference |
|---|---|
| **Stand-it-up runbook (Square + Mighty + sweep + test sale)** | `references/launch-runbook.md` |
| Pricing method, GST, worked Bidfood order | `references/margin-method.md` |
| Square setup + member pricing enforcement | `references/square-setup.md` |
| Square item library values (import-ready) | `references/square-item-build-sheet.csv` |
| Stocktake, par levels, Bidfood reorder | `references/stocktake-and-ordering.md` |
| Par sheet, par levels set for ~60 pizzas | `references/par-sheet-template.csv` |
| Member model, perks, breakeven, retention | `references/member-model.md` |
| Sourced benchmarks (committed digest) | `references/research-and-benchmarks.md` |
| Full research report (local only, gitignored) | `thoughts/shared/handoffs/selling-system-research.md` |
| Shop shelf / consignment model | `docs/strategy/shop-operating-system.md` |
| Mighty Networks community OS | `docs/strategy/mighty-community-operating-system-2026-06-11.md` |
| Calculator | `scripts/margin.mjs` |
