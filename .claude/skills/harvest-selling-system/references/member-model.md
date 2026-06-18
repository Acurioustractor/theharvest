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
| **Mighty Networks** | **Billing rail** for the paid Supporter Plan (charges the card via Stripe) + community home. See `docs/strategy/mighty-community-operating-system-2026-06-11.md`. |
| **GoHighLevel** | CRM **source of truth** for tags/segments. Holds the `supporter-member` tag that says "this person is paid up". |
| **Square** | Enforces member *price* on the day (Customer Group auto-discount / coffee comp). Not the membership database. |

## Billing — LOCKED: Mighty Networks subscription (2026-06-18)

The $20/week Supporter fee charges through **Mighty Networks** as a paid Plan.

### How it bills (verified 2026-06-18)
- Mighty supports weekly / monthly / annual / one-time intervals, so $20/week is literally possible.
- **Bill MONTHLY at $87/mo, frame it as "$20/week".** Stripe's fixed ~$0.30 per charge ×
  52 weekly ≈ $15.60/member/yr vs ~$3.60 billed monthly, and weekly = 52 chances for a
  card decline. Offer an **annual** option (~$1,040, optionally a small discount) for the committed.
- You **can't set/change billing during the free trial** — the Harvest network must exit
  the trial / pick a paid Mighty plan before it can charge. (Currently on the 3-months-free trial.)

### Fee drag (what you keep)
| Fee | Rate | On ~$1,044/yr |
|---|---|---|
| Mighty take | 2% Launch · 1% Scale · 0.5% Growth (5% on Growth trial) | ~$21 (Launch) |
| Stripe | ~2.9% + $0.30/charge (AU domestic cards often ~1.75%+$0.30 — verify) | ~$34 (monthly billing) |
| Mighty platform | Launch $79/mo fixed (all members); Scale/Growth higher | spread across the tier |
| **Apple iOS** | **15% if they subscribe via the iOS app** (Mighty take = 0 then) | **AVOID — use web checkout** |

Net ≈ **~$985/member/yr** before the fixed platform fee, which shrinks per-member as the
tier grows. The **iOS 15% trap is the big one** — always send the join link to Mighty's
**web checkout**, never "download the app and subscribe". (Sources in `research-and-benchmarks.md`.)

### The role-shift (reconcile, don't overwrite, the Mighty doc)
`mighty-community-operating-system-2026-06-11.md` says Mighty is "the inside room, **not
where money happens**", invite-only, with GHL as the source of truth. Charging here shifts
that for the Supporter tier. Reconcile it:
- Mighty runs **two plans**: the free invited inside-room (unchanged) and a paid **Supporter** Plan.
- You're not selling "Mighty access" — you're selling **backing The Harvest + real-world
  perks**; Mighty is just the billing + membership-home rail. The value is the place, not
  the online feed (retention rides on belonging, not the room).
- Update the Mighty doc's "not where money happens" line to: *money happens only for the
  paid Supporter Plan; the free inside room stays free and invite-only.*

### Entitlement flow (so the perks are honoured off-platform)
Mighty bills, but the perks are real-world, so the "is-a-Supporter" signal must reach Square:

```
Mighty paid Supporter Plan  ->  GHL `supporter-member` tag  ->  Square Members customer group
       (billing)                   (source of truth)              (member price on the day)
```

- **Phase A (launch) — manual.** The existing Monday sweep reads Mighty's paid-member
  list, sets `supporter-member` in GHL by hand, and adds them to the Square Members group.
  Matches the Mighty doc's "Phase A: no cross-system automation".
- **Phase B — automate** once it's alive: needs Mighty **Scale** (Zapier + Admin API are
  Scale-and-up per the Mighty doc), which also drops the take rate to 1%. Mighty
  join/cancel -> GHL tag -> Square group.

## Still open (decide before charging)

1. **Mighty plan tier** — start on Launch ($79/mo, 2%, manual sync); move to Scale for
   auto-sync + 1% once the tier has the numbers to justify it.
2. **Naming** — "Supporter" vs "Member" vs something Harvest. Don't collide with the
   existing free "member" language (footer/history).
3. **Square enforcement** — confirm the Customer Group auto-discount + coffee comp actually
   work on the day before promising them.
4. **GST** — the membership fee is likely a taxable supply; confirm treatment with Standard
   Ledger (entity-level — defer to ACT business-research).

This is **day-shift, human-in-loop** work: it charges real people. Plan it, then do it deliberately.
