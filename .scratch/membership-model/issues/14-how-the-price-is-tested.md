# How the price is tested before it is committed

Type: grilling
Status: open
Blocked by: 07, 13

## Question

Once there is a candidate price, how is it tested on real people without either guessing or
committing to a number that cannot be walked back?

Ticket 07 decides what the price IS. This ticket decides how you find out whether it was
right, before it becomes public copy and before 188 people see it.

Separate for a reason: a price arrived at by judgement and a price confirmed by evidence are
different objects, and the map's standing constraint is to never name a price publicly until
this map closes. A capped founding cohort is not public copy. It is the mechanism that lets
the price stop being a draft.

Press on:
- Stated versus revealed preference. People answer price surveys sincerely and wrongly. Does
  the test involve a real checkout at a real number, or does it not count?
- Simultaneous A/B pricing is discoverable in a town this size and reads as someone being
  ripped off. Are sequential cohorts over time the only fair structure? Founding cohort at
  price A, next tranche at price B, with early birds having genuinely earned the difference.
- What is the kill criterion, written down BEFORE the offer goes out? Without one, whatever
  number comes back gets rationalised. How many of 188 in how many days means the proposition
  is wrong rather than the price being slightly off?
- Does a slow result mean lower the price, or fix the offer? Ticket 03 decided free governs
  and does not get thinned, so cutting the free tier to drive conversion is already ruled out.
- **Incrementality, the hard one.** Everything in the economics turns on whether membership
  CAUSES visits or just discounts ones that would have happened. A randomised holdout is the
  proper method and is awkward in a 188-person community where everyone talks. Is pre/post
  visit frequency on the founding cohort, from the same people's Square history, good enough
  to act on? It is confounded by novelty and seasonality.
- Redemption rate reads in both directions: low means the tier will churn and the fix is
  engagement, high means the per-visit cost assumption was too low and the price is wrong. Is
  it a monthly habit or a stated decision rule?

## Timing constraint

`member-model.md` correctly flags charging real people as day-shift, human-in-loop. Ben is
overseas until roughly 15 August. Measurement (ticket 13) involves no money and no public
price and can happen now. A live checkout cannot. Sequence accordingly.

## Context from resolved tickets

From [One tier or two](03-one-tier-or-two.md): the incrementality threshold is computed and
sharp. At $66/yr, roughly 13 of a weekly member's 52 visits must be caused by the membership
for it to wash. At $250/yr, one. That is the number this test has to produce, and it is why a
survey cannot resolve it: people do not know, and do not honestly report, what caused them to
turn up.
