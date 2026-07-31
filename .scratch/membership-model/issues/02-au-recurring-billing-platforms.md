# AU recurring billing: Mighty, Square, GHL

Type: research
Status: resolved
Blocked by: —

## Question

Which platform can take recurring Australian membership payments for The Harvest with the
least mess, and what does each one cost and constrain?

Assess at minimum Mighty Networks (members already live there), Square (already used for
point of sale) and GoHighLevel (already the CRM, holds the harvest-website tag subset on a
shared ACT location). Include Stripe directly as a baseline.

For each:
- Can it do AUD recurring subscriptions, and does it handle GST correctly for an Australian
  entity — tax-inclusive pricing, tax on invoices, and the reporting an accountant needs?
- Fees: percentage, fixed, platform fee, and any monthly floor.
- Tier support: multiple tiers, household or multi-seat, concessions, pauses, cancellations,
  and free-to-paid upgrade paths.
- What happens to the roughly 188 existing free Mighty members if the paid tier lives
  somewhere else. Can they be migrated, or does the list fracture?
- Whether membership state can reach GHL so tags and automations stay accurate, and how much
  glue that needs.
- Whether members can be identified on site — for a member rate at the sauna, or a door — or
  whether that is a manual list.
- Dealbreakers: AU availability, payout timing, whether it requires a company rather than a
  sole trader.

Cite provider documentation and pricing pages with URLs and access dates. Flag anything that
is current-as-of-today and likely to drift.

Write findings to `.scratch/membership-model/research/02-billing-platforms.md`.

## Answer

Full findings: [`research/02-billing-platforms.md`](../research/02-billing-platforms.md)

**Recommended split: Stripe takes the money, GoHighLevel holds membership state, Square does
the door check.** No single platform does all three well.

**Least-regret starting move: Square recurring invoices with card on file.** No code, the
account already exists, GST records land in the same ledger as the point of sale, and it is
reversible one member at a time. The cost of that convenience is about 0.5% more than Stripe,
which is roughly $4 a month at 30 members paying $25. Continuity favours it too: Square is the
app the team already uses, whereas a Stripe dashboard plus a webhook is a developer's tool and
Ben is overseas until 15 August.

**Verified fee findings**
- Stripe AU domestic cards 1.7% + A$0.30, and the AU pricing page states fees include GST.
  BECS Direct Debit and PayTo 1.5%, also GST inclusive.
- Square AU is 1.6% in person but 2.2% card-not-present. A recurring membership charge is
  card-not-present, so Square costs more than Stripe on memberships, not less.
- Mighty Networks takes a permanent platform cut on top of Stripe (2% Launch, 1% Scale, 0.5%
  Growth, never zero) plus a USD monthly floor of roughly US$79 to US$354, and does not handle
  GST natively: its own help article pushes tax onto Quaderno, a separate paid product. Most
  expensive and least reversible.

**Two findings that change other tickets**
- There is no payment migration problem with the existing 188. They are free members with no
  card stored. The real risk is list fracture across Mighty, GHL and the biller, so one system
  must be named source of truth. GHL is the obvious candidate. This simplifies
  [The people already on the list](09-existing-members.md).
- The GHL blocker is structural, not technical. Because there is no separate Harvest location,
  a Stripe connection would sit on the shared ACT location during the sole-trader to Pty
  cutover. That is an entity and accounting question for Standard Ledger before it is a
  platform question, and it makes [Where the money lands](08-where-the-money-lands.md) a hard
  prerequisite rather than a parallel concern.

**Answered in passing**
- Only Square answers the sauna-door question without a laptop, via customer directory search
  in the POS app. Stripe has no staff-facing lookup at all.
- Nothing assessed models household or multi-seat membership natively. If that is wanted it
  becomes a GHL data-modelling job. Feeds [Price and unit](07-price-and-unit.md).
- Member Jungle is the right shape (Australian-built, member app with digital card) and the
  wrong size of bill at A$109 to A$799 per month plus GST. Revisit past a few hundred paying
  members.

**Explicitly unverified, do not treat as settled**
- Stripe's current AU Billing rate. Secondary sources say 0.7% of billing volume; the agent
  could not read it off Stripe's own page.
- Stripe Tax's AU per-transaction charge.
- Whether GHL produces AU-compliant tax invoices.
- Whether GHL adds no transaction fee of its own. This is inferred from secondary sources, not
  confirmed in HighLevel's documentation.
- Whether subscription status actually shows on the Square POS customer profile. Worth a live
  test before relying on it for the door.
- Payout timing for both Square AU and Stripe AU.

**Standing caveat.** Every fee above is current as of 29 July 2026 and will drift. Re-check
before any price is set publicly.
