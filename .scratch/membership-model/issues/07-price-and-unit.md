# Price and unit

Type: grilling
Status: open
Blocked by: 01, 05, 13, 15

## Question

What does membership cost, charged how often, and to whom?

The parked figures are $20/wk and $30/wk from June 2026, both unverified. At roughly $1,000
to $1,560 a year, that is gym pricing in a town The Harvest's own copy describes as having
nowhere to buy a loaf of bread. Treat those numbers as drafts to be interrogated, not a
starting bid.

Press on:
- Unit: weekly, monthly, annual. Weekly reads cheap and bills often; annual reads committed
  and is a bigger ask at the door.
- Household or individual. This is a rural family town, and a per-head price on a family of
  five is a different product.
- Concession, local resident, and visitor rates. Does someone from Brisbane pay what a
  neighbour pays?
- What is the number the target member would say yes to without checking with their partner?
- What does the model need to earn to matter against the Year One loss of roughly $20K, and
  how many members is that? If the answer is more members than Witta has people, the model is
  wrong, not the price.
- What is the floor below which this is not worth administering?

## Context from resolved tickets

From [Comparable models](01-comparable-models-worldwide.md): real Australian comparators are far
below the parked $20 to $30 per week. CERES is A$66/year ($30 concession). Northey Street City
Farm is $15/$30/$60/$125 a year, self-declared income bands with no means testing. School Farm
CSA runs four prices for an identical product, each band labelled by what the money lets the farm
do rather than what the buyer gets. Local-resident concessions are simple and real: Community
Sauna's Stratford Locals rate is proof of address plus photo ID, six months validity. Note that
the parked weekly figures may have been pricing the facility, not the membership.

From [AU recurring billing](02-au-recurring-billing-platforms.md): nothing assessed models
household or multi-seat membership natively, so a household rate becomes a data-modelling job.

From [One tier or two](03-one-tier-or-two.md): this ticket's sub-question "what is the floor
below which this is not worth administering" now has an arithmetic answer for the offer
currently on the table. A member visit costs **$4.72 to $7.86** in forgone contribution (15%
off plus a free coffee). Against a weekly regular that is a floor of roughly **$256/yr, about
$5/week** — above every comparable in ticket 01 and far below both parked figures.

The inversion worth staring at: `member-model.md` says position the paid tier for REGULARS,
and ticket 01 says real AU prices are $66 to $125/yr. Together that is a loss-making offer
aimed at the people who use it most. At $66/yr a weekly regular costs $182 to $346 a year
more than they pay. Two ways out, both decisions rather than calculations: price to cover
expected frequency, or stop putting per-visit-costly perks in the membership (which is 05).

A self-declared band is one tier with a sliding price, not extra tiers — settled in 03, so
this ticket is free to use bands without reopening the tier count.

Note this is now also blocked by [Can member visits be measured](13-can-member-visits-be-measured.md):
the floor is expressed in visits per year, and visit frequency has never been measured.
