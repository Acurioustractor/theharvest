# Launch runbook - stand the system up

The step-by-step to turn the designed selling system into a running one. Everything
here writes to Square, Mighty or GHL, or charges real people, so it is day-shift,
human-in-loop work. Do it deliberately, in order, and tick each box.

Two import-ready files sit beside this runbook:
- `square-item-build-sheet.csv` - the item library (categories, public price, ex-GST cost, track-stock flag).
- `par-sheet-template.csv` - the par sheet, par levels set for a ~60-pizza night.

## 1. Square - stand up the till

1. **Build the Item Library.** In Square Dashboard, `Items` -> `Actions` -> `Export
   Library` to pull your account's current CSV template (columns vary by account, so
   start from the real one). Paste the values from `square-item-build-sheet.csv` into
   the matching columns, then import. Or key the 14 items in by hand - it is a short list.
2. **Categories = on-screen buttons:** Pizza, Sides, Dessert, Coffee, Drinks. (Shop goods
   are a separate category per `shop-operating-system.md`.)
3. **Put the cost on every item.** Enter each item's `Unit cost` (the ex-GST column in the
   build sheet). This is what powers Square's COGS / margin report. Without it the profit
   report is blank. Re-enter a cost whenever a Bidfood invoice moves the price.
4. **Two-tier inventory:**
   - Track stock = **ON** for the 6 Drinks lines (resale, countable).
   - Track stock = **OFF** for Pizza, Sides, Dessert, Coffee (made to order; the kitchen
     runs off the par sheet, not Square).
   - Turn on low-stock alerts for the top-selling sodas (confirm the alert behaviour in-app).
5. **GST flags:** Coconut Water and Coconut & Yuzu are GST-free on sale; everything else is
   taxable. Set the tax on each item to match the build sheet.

## 2. Square - member pricing enforcement

The member offer enforced on the day is simple: **15% off the menu + a free coffee each
visit.** A flat 15% lands within about $0.50 of every target member price in
`margin-method.md`, rounds in the member's favour, and is one rule instead of a per-item grid.

1. **Customer group "Members".** `Customers` -> create a group called `Members`.
2. **Automatic discount "Member 15%".** `Items` -> `Discounts` -> create `Member 15%`,
   type = 15% off, set to **automatic** and restricted to the `Members` customer group.
   It then applies itself whenever a Members customer is attached to the sale.
3. **Free coffee.** Best handled as a **comp** at the till (or a `$0 Member Coffee` item) so
   it shows in reports as a redemption, not a lost sale. One per visit.
4. Nothing falls below cost at 15% off (checked against the grid) - even the thinnest soda
   keeps a positive margin. No item needs an exception.

### Test sale (do this before promising members the discount)

1. Add a test customer, put them in the `Members` group.
2. Start a sale, add a Pepperoni ($17) and a Jarritos ($5), attach the test customer.
3. Confirm the **Member 15%** discount auto-applies: $22.00 -> **$18.70** (pepperoni $14.45 +
   soda $4.25). If it does not fire, the discount is not set to automatic or not restricted
   to the group - fix and re-test.
4. Comp a coffee on the same sale; confirm it reads $0 and shows as a comp in the report.
5. Pull the day's COGS report and confirm margin shows per item (proves step 1.3 worked).

If the discount only applies when the cashier taps it (not automatically), that is the
acceptable fallback (option 2 in `square-setup.md`); just make sure staff know to check
membership and tap it.

## 3. Mighty - the paid Supporter Plan

**Plan tier: launch on Launch ($79/mo, 2% take).** Scale ($179/mo, 1%) only pays for itself
above roughly $120k/yr of Mighty-processed revenue (about 115 paid supporters), and its real
value (Zapier + Admin API auto-sync) is Phase B, "only if Phase A is alive". Upgrade trigger:
when the manual Monday sweep becomes a real burden, or paid supporters approach ~100.

1. **Exit the free trial / pick the Launch plan.** You cannot set or change billing while on
   the 3-months-free trial. The network must be on a paid Mighty plan before it can charge.
2. **Create a paid Plan called `Supporter`.** Price = **$87/month** (this is the "$20/week"
   framed monthly; monthly billing keeps Stripe's fixed $0.30/charge from stacking 52 times).
   Offer an **annual** option (~$1,040) for the committed.
3. **Web checkout only.** Always send the join link to Mighty's **web checkout**. If someone
   subscribes inside the **iOS app, Apple takes 15%** and Mighty's take drops to 0 - so the
   iOS route costs you about $130/member/yr more. Never tell people "download the app and subscribe".
4. The free inside-room Plan stays free and invite-only. The Supporter Plan sits beside it.

### What you actually keep (verified 2026-06-18, AU rates)
On $1,044/yr (12 x $87), billed monthly, on Launch:
- Mighty take 2% = ~$21/yr.
- Stripe AU domestic 1.70% + $0.30/charge = ~$1.78/charge x 12 = ~$21/yr (ex-GST; the GST on
  the fee is claimable). International cards cost more.
- Net ~**$1,000/member/yr** before the $79/mo platform fee, which spreads thinner as the tier grows.
The iOS 15% trap is the one that actually hurts. Avoid it with web checkout.

## 4. Entitlement flow - the Monday sweep (Phase A, manual)

Mighty bills, GHL is the source of truth, Square enforces the price. The "is-a-Supporter"
signal has to walk from Mighty to Square by hand each week until Phase B automation:

```
Mighty paid Supporter list  ->  GHL `supporter-member` tag  ->  Square Members customer group
        (billing)                    (source of truth)               (member price on the day)
```

Every Monday, as part of the existing sweep (target under 45 min total):
1. **Read** Mighty's paid Supporter member list (Admin -> members on the Supporter Plan).
2. **GHL:** add `supporter-member` to anyone newly paid; remove it from anyone who cancelled
   (use the GHL UI or the direct REST API per memory `ghl-rest-api-direct` - the MCP
   remove-tags is broken). GHL is the record of who is paid up.
3. **Square:** add new supporters to the `Members` customer group; remove cancellations.
4. Spot-check one supporter end to end: paid in Mighty -> tagged in GHL -> in the Square group.

Phase B (automate) needs Mighty **Scale** (Zapier + Admin API), which also drops the take to
1%. Wire it only once Phase A has proven the tier is alive.

## 5. Stocktake + ordering - the weekly loop

Run off `par-sheet-template.csv` (pars set for ~60 pizzas) and `stocktake-and-ordering.md`:

1. **Mon - count.** Tier A (drinks) full count in Square; Tier B (kitchen) count on the par sheet.
2. **Mon/Tue - order.** Bidfood order = par minus counted, per line. Start from last order history.
3. **Wed/Thu - receive against the invoice.** Tick every line; check qty and unit price. If a
   price moved, update the cost in Square and `margin-method.md` the same day and re-run
   `margin.mjs check` on that item.
4. **Event - sell.** Square captures every sale and decrements Tier A.
5. **After - reconcile.** Square Item Sales = next forecast; Tier A variance (target < 3%) =
   loss check; note any sold-outs and raise their par.

### The three order flags (resolved for this night)
1. **Cheese:** par now set to **4 x 2kg** shredded mozz (8kg covers ~60-70 pizzas at ~110g).
   Last order had 3 packs, which was short. Portioning cheese tight (~110g) is the single
   biggest margin lever on pizza.
2. **Boxes:** the 7in boxes ordered are slice/dessert size, too small for 12in pizzas. Order a
   **12-13in** box for whole-pizza takeaway; keep the 7in for garlic bread and dessert slices.
   Confirm the Bidfood code for a 12-13in box before the next order.
3. **Vegan:** GF only this night (founder decision 2026-06-18). The GF base is served with dairy
   cheese, so there is no vegan claim on the menu. Add a plant cheese later if a vegan pizza goes on.

## Still open (entity-level, defer)
- **GST on the membership fee** is likely a taxable supply; confirm treatment with Standard
  Ledger. This is entity-level - defer to the ACT business-research skill.
