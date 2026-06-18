# The member model

## Two tiers

| Tier | Price | What it is | Lives in |
|---|---|---|---|
| **Community member** | Free | Existing tag-based membership: on the list, welcome, newsletter, invited to things. Keep it. | GHL tag + Mighty Networks |
| **Supporter member** | **$20/week** (~$87/mo, ~$1,040/yr) | New paid tier. The four perks below. For *regulars* — people in the door often. | Billing TBD (see below) + Square for price enforcement |

The free tier stays the front door for the whole community. The paid tier is for the
people who come most and want to back the place — never gate the community out.

## What $20/week unlocks (all four)

1. **Member price on food & drink** — the member column in `margin-method.md`
   (~$3 off pizzas, ~$1 off drinks). Enforced via Square (see `square-setup.md`).
2. **Free / discounted event entry** — pizza nights and ticketed events free or reduced.
3. **A weekly freebie — make it coffee.** Coffee is ~$0.70 to make and ~$5 perceived
   value: the highest-margin, highest-felt perk you have. One per visit, comped at POS.
4. **Shop discount + priority access** — ~10% off the shelf + early/priority booking on
   limited events.

## Does $20/week pay? (breakeven model — adjust the assumptions)

Revenue per supporter: **~$1,040/yr.**

Cost of perks to The Harvest (cash cost, not perceived value), for an *active weekly* member:

| Perk | Assumption | Annual cost |
|---|---|---|
| Weekly coffee | 52 × ~$0.70 make-cost | ~$36 |
| Member food/drink discount | ~$3.50 off × ~1 visit/wk × 52 (margin foregone) | ~$180 |
| Free/discounted events | ~12/yr × ~$5 | ~$60 |
| Shop discount 10% | ~$500 shop spend × 10% | ~$50 |
| **Total perk cost** | | **~$330** |

**Net contribution ≈ $700/yr per active member**, and *higher* for less-frequent members
(who pay the fee but redeem fewer perks). The model is financially sound — **if members
stay.** That is the whole risk.

## The retention reality (read this twice)

- Community-supported food models (CSAs) lose **25–70% of members a season**. Retention
  rides on **engagement, not discount** — people stay for belonging and rhythm, not for
  10% off. (See `research-and-benchmarks.md`.)
- A directly comparable AU model — Blue Mountains Food Co-op — runs at **$40/year for
  10% off**, breaking even for the member once they spend more than ~$8/week. At
  **$20/week**, a supporter must *feel* more than $20/week of value or they downgrade to
  the free tier.
- So position the paid tier for **regulars**, lead with the **weekly coffee + belonging**
  (not the discount), and make redemption effortless. Track redemption in Square monthly;
  if active members aren't using perks, the tier will churn — fix engagement, not price.

A lighter on-ramp (e.g. a $10/week tier, or annual billing at a discount) is worth
modelling if sign-up is slow — change the number in the calculator and re-run the table.

## Who owns what (don't double-handle)

| System | Role |
|---|---|
| **Mighty Networks** | The community home + member directory + member comms. Possibly the subscription billing surface. See `docs/strategy/mighty-community-operating-system-2026-06-11.md`. |
| **Square** | Enforces member *price* on the day (Customer Group auto-discount / comp). Not the membership database. |
| **GoHighLevel** | CRM source of truth for tags/segments and automation. The `harvest-member` / interest tags. |
| **Stripe-via-Mighty or Square recurring or GHL** | Where the $20/week actually charges — **decide before launch** (see open decisions). |

Sync is tag-based and currently manual-ish: a paid supporter gets a `supporter-member`
tag in GHL, is added to the Members group in Square, and to the paid space in Mighty.
Keep one of these the source of truth (GHL tag) and reconcile the others to it.

## Open decisions to reconcile before launch

1. **Billing location** — Mighty subscription vs Square recurring vs GHL/Stripe. One
   place, auto-charged weekly/monthly, with a clean cancel.
2. **Naming** — "Supporter" vs "Member" vs something Harvest. Don't collide with the
   existing free "member" language (footer/history). Reconcile with the Mighty + email
   operating-system docs.
3. **Perk enforcement** — confirm the Square Customer Group auto-discount flow and the
   coffee-comp mechanism actually work on the day before promising them.
4. **GST** — the membership fee itself is a taxable supply if it buys goods/services;
   confirm treatment with Standard Ledger (entity-level — defer to ACT business-research).

This is **day-shift, human-in-loop** work: it writes to GHL/Square/Mighty and charges
real people. Plan it, then do it deliberately.
