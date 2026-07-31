# Map: The Harvest membership model

Label: wayfinder:map
Started: 2026-07-29

## Destination

A decided membership model: what is free, what is paid, what it costs, what it unlocks,
where the money lands, and how it is presented. The decision, locked — not the build.
Reached when pricing copy, GHL automations and the sauna's opening day all have a settled
answer to point at.

## Notes

**Domain.** The Harvest, Witta, on Jinibara Country. A garden, events and art space, open to
the public since 20 June 2026. Capability is arriving fast: a sauna is coming, the inside of
the building is being worked on, and talks, workshops, building-and-learning sessions, space
hire and garden use are all live or near. Membership is currently free — name and email —
and offers three lanes: Grow (a Harvest Note when there is something worth saying), Make
(specific calls when hands are needed), Gather (first call for community days and meals).
Roughly 188 members sit inside a 207-person newsletter list.

**The tension this map exists to resolve.** Ben's position (2026-07-29): members get the
sauna free, non-members pay, and the direction of travel is toward paid membership. As long
as membership itself is free, the paying group is empty by construction — the cheaper door is
open and unlocked. So membership must cost money, cost effort, or gate only a bounded amount.
That fork is the spine of this map.

**Standing constraints.**
- Never name a price publicly until this map closes. A supporter tier has been parked since
  June 2026 at $20/wk in one source and $30/wk in another; treat both as unverified drafts.
- Year One runs at a planned loss of roughly $20K. The sauna, workshops and hire are the first
  things capable of earning. A model that converts them into free perks removes the first
  revenue before it earns.
- Harvest trades through Nicholas Marchesi's sole trader until the A Curious Tractor Pty Ltd
  cutover. Recurring revenue needs an entity and GST answer, not an assumption.
- The site publicly claims to be a community garden and gathering place. A model that puts
  everything meaningful behind a paywall makes that claim thin. Treat "what stays free
  forever" as a values boundary, not a pricing residual.
- Voice rules apply to anything member-facing: no em-dashes, no AI vocabulary, "work days"
  not "working bees", no invented figures.

**Skills to consult.** `/grilling` and `/domain-modeling` for the decision tickets.
`/research` for the AFK tickets. `/prototype` for the presentation ticket. `act-voice` before
drafting any member-facing wording.

**Deviation from the skill's default, deliberate.** Research findings are written to
`.scratch/membership-model/research/` rather than a throwaway `research/<name>` git branch.
The working tree carries ~71 modified files and is 11 commits behind origin/main; branch
switching against that is a real risk of losing someone's work. Revisit once the tree is clean.

## Decisions so far

<!-- one line per resolved ticket: gist + link -->

- [Comparable membership models worldwide](issues/01-comparable-models-worldwide.md) —
  no comparable organisation gives its scarce, staffed facility away free to members; even a
  not-for-profit sauna whose mission is access only halves the price. The affordable pattern is
  a bounded allowance where the cap is the product, membership priced cheap on a self-declared
  band, the scarce facility priced separately as an earning product, and one named free session
  held open forever to keep the community claim credible. Nottingham Hackspace is the documented
  walk-back: a fee floor cost it 148 of ~650 members overnight.

- [AU recurring billing: Mighty, Square, GHL](issues/02-au-recurring-billing-platforms.md) —
  split the job: Stripe takes the money, GHL holds membership state, Square does the door
  check. Least-regret start is Square recurring invoices with card on file. Mighty is the most
  expensive and least reversible, and does not handle GST natively. No payment migration
  problem exists for the existing 188, only a source-of-truth problem. Several fees remain
  explicitly unverified.

- [One tier or two](issues/03-one-tier-or-two.md) — two tiers; free survives permanently, and
  the line between them is drawn by **marginal cost**, not perceived value. Zero-cost-per-use
  perks are free forever and scale without limit; perks carrying a dollar figure every time
  they are used sit in the paid tier. Effort is a route into the paid tier rather than a third
  tier, and a self-declared income band is one tier with a sliding price, not extra tiers. When
  the community promise and the conversion funnel conflict, **free governs**: Ben committed to a
  floor that does not get thinned to drive sign-ups. Measured basis: the current 15%-plus-coffee
  offer costs $4.72 to $7.86 per member visit, which puts the price floor near $256/yr against a
  weekly regular. Structure and cutting principle only; contents are 04 and 05.

- [What stays free forever](issues/04-what-stays-free-forever.md) — the floor is two lines: the
  grounds are free and open to anyone during opening hours, and there is always one named
  recurring session that costs nothing to attend (currently the Friday movie night). Public
  access is bounded by hours and hazard supervision, never by payment; nothing is carved out of
  the grounds. Pizza is paid and open to all, because it carries ~$8/pizza of real goods and is
  74% of Base contribution. **The commitment is fixed, the instance is swappable**: which
  session it is can change with notice, but it can never be dropped without replacement, and
  only both founders together can move it. The boundary comes from Ben and Nicholas's own line
  rather than the lease or DGR, so **publication is what makes it bind** — a hard requirement
  on 12.

- [Contribution scaled to capacity](issues/15-contribution-scaled-to-capacity.md) — open for
  all; contribute what you can, in money or in time; **bands are labelled by what the money lets
  The Harvest do, not by what the member gets**. Self-declared, no means testing (Northey Street
  pattern); four prices for an identical product explained by purpose (School Farm pattern);
  time is legal tender alongside money rather than a side door. This is a spine decision: under
  band-labelling, perks stop being the product, so there is no acquisition hook to design and
  the whole perceived-value-versus-cost analysis drops to second order. Decides the shape and
  the values, not any number, not what is gated, and not what an hour buys.

- [How sweat equity actually works in practice](issues/16-how-sweat-equity-actually-works.md) —
  research. Twelve Australian organisations. **Alfalfa House is the Australian walk-back and it
  happened twice**: compulsory member hours were dropped before the co-op turned the corner, then
  the 20% volunteer discount was cut under COVID trading pressure, so a work-for-discount promise
  is exactly what gets withdrawn in a bad month. **Australian buyout rates are $3.13 to $17/hr**,
  far below the Stearns figure, and the nearest comparable (Food Co-op Canberra) gates its buyout
  behind written board approval rather than publishing a self-serve tariff. **Nobody chases
  anyone**: enforcement is by lapse, renewal surcharge, eligibility gate or self-substitution.
  **The resentment runs the opposite way to what ticket 06 assumed** — reliable members resent
  unreliable ones, not payers resenting workers. And the legal position is unresolved: Qld WHS Act
  s7(1)(h) makes volunteers workers with the carve-out failing once you employ anyone (so this duty
  exists at The Harvest today), while WCR Act s11 says they are not workers and the fix is
  non-profit-only. Two calls needed: broker and Standard Ledger.

- [Effort as currency](issues/06-effort-as-currency.md) — effort is a **door, not a rate**. The
  unit is a booked shift, hours never convert to dollars, and nothing in the scheme needs a number
  attached. **The buyout dissolved rather than being answered**: under ticket 15 money and time are
  both legal tender, so someone who cannot make a shift is contributing in the other currency
  rather than defaulting, and there is no debt to buy out of. **Enforcement is lapse**, and lapse
  is soft here because it returns someone to the permanent free tier rather than removing them.
  What counts is settled by one test: **if it can be booked on a roster in advance it is a shift;
  if it needs valuing it is money** — so teaching, hosting and a booked tradesperson all count,
  while donated materials go down the money route as an in-kind gift. Teaching an hour and weeding
  an hour count the same, deliberately. Self-substitution (find your own replacement) is the
  recommended practice against the real resentment risk, which ticket 16 showed is reliable members
  resenting unreliable ones rather than payers resenting workers.

## Not yet specified

- Insurance and liability once members have access to a sauna, and whether that changes the
  public liability position or the lease's terms.
- Whether workshops and talks are separately ticketed, included in membership, or discounted —
  likely cannot be specified until the paywall boundary is settled.
- Governance: whether paying members get any say in what the place does, and whether that is a
  promise worth making or a trap. Sharpened by [One tier or two](issues/03-one-tier-or-two.md):
  a say costs nothing per member, so under the marginal-cost rule it is a candidate for the free
  side, which makes "a say" harder to justify as a paid perk than it first looked.
- Pauses and seasonality. A hinterland town with visitors, families and pensioners does not have
  one rhythm, and a membership that cannot be paused in a quiet winter churns instead.
- Whether "member" remains one word for two very different relationships, or whether the paid
  thing needs its own name.
- Community share offers as a way to raise capital. Surfaced by the comparable-models research:
  Fordhall (GBP 50/share, 8,000 holders), The Old Forge (GBP 320,000), and Australian
  community-owned pubs such as Grong Grong's Royal Hotel. These confer ownership and a vote but
  no discount and no access, so they are a capital instrument rather than a membership model.
  Likely a separate effort with its own destination, not a ticket on this map, but recorded here
  so it is not lost.

## Out of scope

- Building the billing integration. This map decides the model; implementation is a separate
  effort.
- The A Curious Tractor Pty Ltd cutover itself. This map only needs to know which entity
  receives subscription revenue, not to run the migration.
- Final member-facing copy beyond the rough presentation prototype.
