# Sourced benchmarks (committed digest)

Distilled from a deep-research pass (2026-06-18). The **full report with inline
citations** lives at `thoughts/shared/handoffs/selling-system-research.md` (local only —
the `thoughts/` tree is gitignored), so the key figures are mirrored here so they survive
in the repo. Verification status is marked per item per the project's verification rules.

## Pricing & margins

- **Food cost target ~30%** is the common default, but operators are warned **not** to
  apply a flat 3× to every line — the "rule of three" comes from 1 ÷ 33% and it
  over-prices cheap items and under-prices expensive ones. Price the *menu* to a blended
  target. *(Verified against multiple hospitality sources.)*
- **Prime cost** (food + labour combined) should stay under **~60–65% of revenue** — this
  is the number that actually decides if a venue is viable, more than food cost alone.
  *(Verified — standard restaurant-finance benchmark.)*
- **Menu engineering** (stars / plowhorses / puzzles / dogs on margin × popularity) is the
  standard tool for which items to feature, reprice, or cut. *(Verified.)*
- Charm/price-point rounding gives a small sales lift. *(Unverified — typical industry
  claim; treat as a nudge, not a law.)*

## Beverages

- **Coffee and house-made drinks run ~70–90% gross margin.** Bought-in premium cans
  (imported sodas, kombucha) run only **~30–40%** at normal retail, and soda is roughly
  **2.5–3× wholesale** at typical shelf prices. *(Verified.)* → Feature house-made and
  coffee; treat premium cans as range/service, not the margin engine. At The Harvest's
  community price points these cans run *thinner still* (~50–65% cost) — see
  `margin-method.md`.

## Square (verified against Square's own Help Center)

- Per-item **unit cost** drives Square's COGS report (revenue / profit / margin per item).
- **Track stock** should be enabled only on countable resale items; made-to-order food is
  left untracked.
- **Member pricing** is best enforced via a **Customer Group automatic discount**;
  **Loyalty** is an optional paid add-on.
- **Low-stock-alert** exact behaviour **could not be fully verified** — confirm in-app.
- **AU dollar pricing / processing rates** **unverified** — confirm on squareup.com/au.

## Stocktake & ordering

- **Two-tier** stocktake (POS-tracked resale vs par-sheet kitchen ingredients) is the
  standard small-venue approach. *(Verified.)*
- **Variance target < 3%** between expected (POS) and counted stock. *(Verified as a
  common benchmark.)*
- Count high-movers more often; do a full count weekly. *(Count cadence — unverified;
  typical industry practice.)*
- Receive stock **against the supplier invoice**; AU food-service invoices mix GST-free
  and taxable lines, so capture true ex-GST unit cost per line. *(Verified.)*

## Membership / subscription food models

- The directly copyable AU model: **Blue Mountains Food Co-op — ~$40/year for 10% off**,
  member breaks even above ~$8/week of spend. *(Verified — co-op's own materials.)*
- **CSAs lose 25–70% of members per season**; retention rides on **engagement, not
  discount**. *(Verified across CSA research.)* → The member tier must deliver felt,
  weekly value (the coffee) and belonging, or it churns.

### Mighty Networks billing (the chosen rail, verified 2026-06-18)

- **Intervals:** weekly / monthly / annual / daily / one-time all supported, so $20/week is
  possible — but the fixed ~$0.30/charge makes weekly the dear way to bill (≈$15.60/yr vs
  ≈$3.60 monthly). *(Verified — Mighty Help Center "installment plans & subscription intervals".)*
- **Transaction fee:** 2% Launch · 1% Scale · 0.5% Growth (5% on the Growth free trial),
  on top of Stripe (~2.9% + $0.30; AU domestic often ~1.75%+$0.30 — verify). *(Verified —
  Mighty Help Center "does Mighty charge a transaction fee".)*
- **iOS:** Apple takes **15%** on in-app purchases; Mighty charges 0% then. → Use web
  checkout. *(Verified — same Mighty fee page.)*
- **Platform fee:** Launch plan **$79/mo** entry point after the 2025 restructure; Zapier +
  Admin API (needed to auto-sync paid status → GHL → Square) are **Scale-and-up**.
  *(Verified — Mighty pricing page + the Harvest Mighty operating-system doc.)*

Sources: [Mighty intervals](https://faq.mightynetworks.com/en/articles/11101060-how-do-i-set-up-installment-plans-and-subscription-intervals) ·
[Mighty fees](https://faq.mightynetworks.com/en/articles/9140682-does-mighty-networks-charge-a-transaction-fee) ·
[Mighty pricing](https://www.mightynetworks.com/pricing)

## Events ("pizza night")

- Cost an event **separately from pantry stock**; food cost commonly ~**$8–10/head** for a
  casual feed. *(Per-head figure — unverified; typical planning figure.)*
- Price at **cost ÷ heads + a small surplus** for cost-recovery-plus, or at hospitality
  margin if it's meant to fund the venue. *(Verified approach.)*
- AU GST: charge GST on essentially all cafe/event sales (prepared food + dine-in).
  *(Verified.)*

## Top takeaways baked into this skill

1. Price the menu to a ~30–35% blend, not each item at 3×.
2. Pizza (and future coffee) carry the surplus; cans are a service.
3. Watch prime cost, not just food cost.
4. Two-tier stock: Square for resale, par sheet for the kitchen.
5. Member retention is an engagement problem; the weekly coffee is the lever.
6. Re-cost from every invoice; AU invoices mix GST-free and taxable lines.
