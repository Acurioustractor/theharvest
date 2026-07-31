# How sweat equity actually works in practice

Type: research
Status: resolved
Assignee: Ben (claimed 2026-07-31)
Resolved: 2026-07-31
Blocked by: —

## Question

When an organisation lets people earn membership or access through work rather than money, what
actually happens operationally, and what breaks?

Raised 2026-07-31 mid-grilling on [Effort as currency](06-effort-as-currency.md). That grilling
stalled because the evidence base was four data points, three of them Northern Hemisphere, and
the mechanism question (rate versus door) turns entirely on operational detail nobody has looked
up.

## What ticket 01 already found — do not re-derive this

- Sweat equity stays cheap to administer only if you **book shifts rather than count hours**.
  Stearns Farm, Beardsley Farm and Sutton Community Farm all do this. Sutton uses Three Rings
  rota software.
- Stearns Farm publishes a **buyout rate for unworked hours** (USD 12/hr, about A$17), which
  makes a requirement enforceable without anyone having to enforce it.

Start there and go deeper. The gap is practice, not principle.

## Specific questions

**Recording and admin**
1. What do these organisations actually use to record participation? Named tools, spreadsheets,
   paper on a wall. What does it cost and who maintains it?
2. How much administrator time per week does a sweat-equity scheme consume at, say, 50 and 200
   members? Any organisation that has published this.
3. What happens when the person holding the roster is away for six weeks?

**Enforcement, the awkward part**
4. What happens in practice when someone does not turn up? Not the written policy, the actual
   behaviour. Is anyone chased, and by whom?
5. Is the buyout rate genuinely used, or is it a deterrent nobody invokes?
6. Any documented cases of sweat equity creating resentment between paying and working members,
   and how it was handled or how it ended.

**Structure**
7. Cadence: per week, per month, per season? What minimum commitment do real schemes ask, and
   which cadences show the best turn-up rates?
8. Household versus individual. Does a family's shift count once or per adult?
9. Can people bank ahead, or does unused effort expire? What happens to someone who over-delivers?

**Australia specifically, the real gap**
10. Australian community farms, food co-ops, hackspaces, community gardens, men's sheds,
    surf clubs, or repair cafes running work-for-access. The existing research is US and UK
    heavy and Witta is neither.
11. **Volunteer versus member versus worker under Australian law.** If someone works a shift in
    exchange for something of value, are they a volunteer or are they being paid in kind? This
    touches WorkCover (paid workers only), public liability (does the policy cover volunteers,
    and does exchange-for-value change that), and possibly tax. Flag anything that looks like it
    needs an accountant or a broker rather than a decision. Related:
    `thoughts/wiki/operations/insurance-call-sheet-2026-07-31.md`.

**Failure modes**
12. Documented walk-backs. Ticket 01's single most useful fact was Nottingham Hackspace losing
    148 of ~650 members overnight to a fee floor. Find the equivalent for effort schemes:
    who tried this and stopped, and why.

## Output

Findings to `.scratch/membership-model/research/03-sweat-equity-in-practice.md`, matching the
format of the two existing research files. Cite sources. Mark anything inferred rather than
found, and say plainly where the evidence is thin rather than filling the gap with reasoning.

## Answer (2026-07-31)

Full findings: `.scratch/membership-model/research/03-sweat-equity-in-practice.md` (1,084 lines,
12 Australian organisations, 69 sourced claims, 22 marked inferred).

**Four things moved the question.**

**1. The walk-back is Australian and it happened twice.** Alfalfa House, Enmore, 1981 to 2023, on
its own history page: *"It wasn't until it began to employ staff and drop the requirement for
members to work a certain number of hours a month that operations began to turn the corner."*
Then in January 2021, under COVID trading pressure, it cut the 20% volunteer discount. So
compulsion failed first, and when cash got tight the discount was the first thing cut. Directly
relevant to ticket 04's floor: a work-for-discount promise is exactly the kind that gets quietly
withdrawn in a bad month.

**2. Australian exchange rates are far below the Stearns figure.** Essendon Community Gardens
charges **$50 for missing 2 working bees or 6 hours** ($8.33/hr). Lorne SLSC prices non-patrolling
membership $50 above patrolling for a 16-hour minimum (~$3.13/hr). The Food Co-op Canberra runs a
**gated** buyout: 1 hour keeps the discount active for 2 weeks, and hours may be purchased only
with written board approval at an AGM-set price, with the board explicitly weighing *"family
circumstances, equity and capacity"*. So the real Australian range is **$3.13 to $17/hr**, and the
nearest comparable prices buyout as a deterrent with a human gate rather than a self-serve tariff.

**3. The legal position is genuinely unresolved, and the two Queensland statutes point opposite
ways.** WHS Act 2011 (Qld) s7(1)(h) makes a volunteer a **worker**, and the s5(7) volunteer-
association carve-out fails as soon as the group employs anyone. The Harvest employs, so it is a
PCBU owing the full s19 primary duty of care to everyone doing work on site. This is **true today,
independent of this map**, because work days already run. Meanwhile WCR Act 2003 (Qld) s11 makes a
volunteer **not** a worker for workers' compensation, and the s19 volunteer contract that would fix
it is available **only to a non-profit organisation** and *"must not cover the payment of
damages"*. The Harvest trades through a sole trader. Separately, Fair Work's employment test
counts "something in return" plus a regular roster as pointers toward employment, while
Volunteering Queensland gives almost exactly The Harvest's case as legitimate volunteering:
*"a volunteer may perform yard work for a local community group and receive membership in
community activities in return."* No Australian decision on point was found. **Two calls: the
broker, and Standard Ledger.**

**4. Nobody chases anyone, and the resentment runs the other way.** Every Australian scheme found
enforces by lapse, renewal surcharge, eligibility gate, or self-substitution. Not one chases. And
Park Slope's manual explains its double make-up rule: *"attendance was often bad enough to cause
those who did show up to quit because of the unfair burden placed on them."* **The dangerous
resentment is reliable members resenting unreliable ones, not payers resenting workers.** That
inverts this ticket's own assumption and reshapes
[Effort as currency](06-effort-as-currency.md).

**Stated thin.** No organisation anywhere publishes turn-up rates against requirement. No evidence
found that any Australian buyout or surcharge has ever actually been collected. Admin-hours-by-size
does not exist; the best Australian proxy is Victoria's State of Volunteering 2025 at **$5.92 per
volunteer hour to manage**, $86,717/yr average per organisation, paid volunteer leaders at 16.4
hrs/week, and fewer than 60% expecting to still be in the role in three years.
