# Sweat equity in practice: what happens when work buys access

Research ticket: `.scratch/membership-model/issues/16-how-sweat-equity-actually-works.md`
Written: 2026-07-31. All URLs accessed 2026-07-31 unless stated.

## How to read this

Every claim is marked **FOUND** (I opened the source and it says this) or **INFERRED** (my reasoning
from sourced facts). Where I could not establish something, it says so rather than reasoning into
the gap. Nothing here is legal advice; the law sections report what the primary instruments and the
regulators' own pages say, and flag where the boundary is genuinely unclear.

Most figures below are Australian dollars in their native currency. Where a figure is not, it uses
ECB reference rates for 2026-07-30 via the Frankfurter API
(https://api.frankfurter.dev/v1/latest?base=AUD): 1 AUD = 0.52141 GBP = 0.6981 USD. So GBP 1 is
about A$1.92 and USD 1 is about A$1.43. Converted figures are rounded and marked "approx".

Ticket 01 already established, and this file does not re-derive: book shifts rather than count
hours; Stearns Farm, Beardsley Farm and Sutton Community Farm all do this; Sutton uses Three Rings
rota software; Stearns publishes a USD 12/hr buyout (approx A$17).

Two things surprised me and are worth reading first. The clearest Australian buyout mechanism is
not in a farm, it is in a Canberra food co-op, and it requires written board approval rather than
being self-serve. And the most useful walk-back in the whole set is Australian: Alfalfa House in
Sydney, which says on its own history page that dropping compulsory member hours is when the
business started to work.

---

## Part 1: Australian organisations that trade work for access

### 1. Blue Mountains Food Co-op, Katoomba NSW

The cleanest Australian example of the three-price ladder: shopper, member, working member.

**FOUND.** Membership fees: Household $40/year or $20/half-year; concession card holders $5 per
quarter; business $50/year. Members get 10% off all purchases, AGM voting rights, eligibility to
become a director, and "Volunteer opportunities for an extra 20% discount on member prices". Over
2,100 members. Concession membership requires proof of concession status and can only be bought
in store. Source: https://bmfoodcoop.org.au/membership/

Note the counting unit: **the membership is a household, not a person**, at $40. Concession is
priced per quarter rather than per year, which lowers the entry cost rather than the annual cost.

**FOUND.** They also run "Concession Wednesdays": concession card holders, seniors and students
shop at member prices every Wednesday with no membership at all. That is a free door held open
next to the paywall, of the kind ticket 01 called Model E. Same source.

**FOUND, and this is the admin finding.** Volunteering is framed as optional and reciprocal:
"in return you'll receive points towards a 20% discount on your shopping". Shifts are managed by a
Volunteer Coordinator "to ensure safety, fairness, and accessibility". Existing trained volunteers
book shop shifts through "the live Google Doc linked here: BMFC Volunteer Roster". Source:
https://bmfoodcoop.org.au/volunteer/

A co-op with 2,100 members runs its work roster on a shared Google Doc and one coordinator. That
is the real-world floor for tooling cost, and also the real-world single point of failure.

**Secondary**, from a search summary of their own pages that I could not confirm on the live site:
"in exchange for 4 hours work you get an extra 20% discount off $250 worth of shopping", and
volunteer training nights run monthly. The 4-hours and $250 figures are **unverified**; the live
volunteer page says only "points towards a 20% discount".

### 2. The Food Co-op, Canberra ACT: the Australian buyout

Operating since 1976. The single most decision-relevant Australian source in this file, because it
publishes both a work-for-discount rate and a buyout, in its own words.

**FOUND.** "Membership grants you a 5% discount in the shop, as well as discounts on cafe lunches
and certain Co-op events." Members can get a further 10% off bulk orders. Then:

> "Working Members receive a 20% discount in the Co-op for a fortnight for every hour that is
> worked. Hours worked are cumulative; for example if you work two hours in succession, you will
> receive one month of 20% discount. This discount may also be purchased by any member who seeks
> and gains approval in writing from the Board to pay the price set at the most recent AGM each
> year to 'buy out' the required hours. The Board may, but is not bound to, take into consideration
> family circumstances, equity and capacity in determining whether to grant approval for a member
> to buy out their hours."

Source: https://cbrfoodcoop.org.au/index.php/become-a-member/

Four design moves in one paragraph, all of them portable:

1. **The unit is time-of-benefit, not credit.** One hour buys a fortnight of a better price. Effort
   decays rather than banking. Nobody has to run a ledger of owed hours; the discount flag simply
   expires.
2. **The buyout exists but is gated.** It is not a self-serve price on a page. It requires written
   board approval, and the board is explicitly permitted to weigh family circumstances, equity and
   capacity. That converts the buyout from a way for rich members to opt out into a hardship and
   circumstance mechanism.
3. **The buyout price is set annually at the AGM.** The price is a membership decision, not a
   management one, which is why nobody argues with it mid-year.
4. **It is a discount on purchases, not access to the place.** The shop is open to everyone.

**FOUND.** Some working roles are paid in store credit rather than discount: "Our Shop & Cafe
Coordinators receive store credit in return for their time and dedication." Board members "receive
the working member discount for their important work." They also run a standing "Return-for-Labour"
working group, which tells you the scheme is actively maintained rather than set and forgotten.
Source: https://cbrfoodcoop.org.au/index.php/our-co-op/

**FOUND.** Their strategic plan lists as a strategic action: "Maintain an adaptable Return for
Labour Policy that is reflective of and incentivises work at the co-op." And in the same document,
under weaknesses, in their own words: "Staff burnout"; "Lack of volunteer engagement strategy, we
do not have a clear, structured nor concerted approach to onboarding volunteers"; "Transient roles,
turnover and changing availabilities for certain roles means we lose capacity and knowledge";
"'Exclusive' community, we are overly dependent on core members who dominate some activities."
Source: https://cbrfoodcoop.org.au/wp-content/uploads/2023/06/Food-Co-op-Strategic-Plan-2022-2025.pdf

That last list is the most honest published account I found anywhere of what a labour-for-benefit
scheme actually costs an organisation. It is not enforcement. It is dependence on a small core,
knowledge loss when they rotate, and staff burnout carrying the coordination.

**I could not find the actual buyout dollar figure.** It is set at each AGM and is not published on
the website. Their AGM minutes are not publicly posted at a URL I could reach.

### 3. Friends of the Earth Food Co-op and Cafe, Collingwood Vic

**FOUND.** Members get 5% off. "All volunteers receive 15% of [sic] groceries and lunch is provided
plus lovely drinks." The roster is "a four-hour shift (ideally once a week), either from 10-2 or
1-5 on weekdays + saturdays, or 11-3 on sundays, and includes a drink while you work, as well as
lunch either before or after your shift". Morning shifts skew kitchen, afternoons skew shop.
Sources: https://www.foefood.org/membership and https://www.foefood.org/volunteer

Two things to note. The **cadence is weekly and the shift is fixed-length and fixed-slot**, which
is the same shape as Park Slope and the opposite of "log your hours". And the **non-cash part of
the reward is a meal**, which is materially different in tax and insurance terms from a discount
(see Part 2). There is no buyout, no minimum, and no stated consequence for stopping. Getting in is
by conversation: "the best way to get involved is to speak to us in the co-op to decide on a first
shift."

### 4. Alfalfa House, Enmore NSW: the Australian walk-back, twice

The co-op ran from 1981 and its shop ceased trading in 2023. Its own history page is the most
useful single paragraph in this research.

**FOUND.** From their history page:

> "The following year, 13 people set out to formalise the Co-op and founded it as Alfalfa House in
> December 1988. It was first registered as a worker co-operative and later changed its status to a
> consumer co-operative. **Members were obliged to work in the Co-op for the princely sum of $1 an
> hour.** ... It wasn't until it began to employ staff and **drop the requirement for members to
> work a certain number of hours a month that operations began to turn the corner.** More than 40
> years since its rent strike, Alfalfa House had slowly grown to include upwards of 3300 members
> when it finally closed its doors in 2023 due to lack of security of tenure."

Source: https://www.alfalfahouse.org/history (emphasis mine)

That is an Australian consumer co-operative stating, in its own official history, that removing
compulsory member labour is what made the business viable. The stated cause of the eventual closure
was tenure, not labour.

**FOUND, second walk-back.** In January 2021, under COVID trading pressure, "On January 11, it
informed members that it had to remove the 20% volunteer discount (although a smaller discount
still applies to volunteers)." At that point the co-op had around 1,900 members and told them that
"unless people renew their membership and spend at least $15 a week, every week, it cannot keep its
doors open". Source: https://www.greenleft.org.au/content/organic-food-co-op-faces-closure
(Green Left, 15 January 2021, **secondary**, reporting the co-op's communications to members).

So the volunteer discount was the thing cut first when cash got tight. **INFERRED:** a work-earned
discount is a variable cost that scales with the exact members you most want to keep, and it is
structurally the easiest line to cut in a crisis, which is also the moment cutting it does the most
relationship damage.

**FOUND, the pricing structure before closure**, from the archived membership page (Internet
Archive capture of 2021): "Get 10% off every shop (20% if you volunteer)". Source:
https://web.archive.org/web/2021id_/https://alfalfahouse.org/membership/

The co-operative entity still exists. The board retained it after the shop closed and now runs the
Newtown Station Kitchen Garden, which is open to anyone Wednesday and Sunday mornings with no
membership and no requirement: "Just turn up at 10.00am and one of our regular garden members will
get you started." Source: https://www.alfalfahouse.org/

### 5. Essendon Community Gardens, Moonee Valley Vic: the Australian buyout rate

**FOUND.** By-law 1, in full:

> "This is a community garden and as such members are expected to contribute a little time to the
> garden's upkeep. We ask that you attend a minimum of 2 'working bees' each year per plot. **A
> surcharge of $50 will be added to the annual fees for members who do not attend 2 working bees or
> contribute the equivalent of 6 hours of community garden work.**"

Source: https://essendoncommunitygardens.jimdofree.com/garden-rules/

This is the Australian equivalent of Stearns Farm's USD 12/hr. Read as a rate it is $50 for 6 hours,
about **$8.33 an hour**, roughly half Stearns' approx A$17. The requirement is **per plot, not per
person**, which quietly settles the household question: a family with one plot owes two attendances,
not two per adult.

Also worth noting: the enforceable sanction in that document is not about the work at all. It is
about the plot. "Continued neglect of any plot will cause the Committee to issue a notice of
cancellation of membership. Members who receive 2 audit plot notices in a 12 month period (AGM to
AGM) will automatically be asked to vacate their plot within 14 days." And "Failure to pay results
in expulsion from the Gardens." The work surcharge rides on the annual fee, so it collects itself at
renewal. **INFERRED:** nobody has to chase anyone, because the only two levers are the invoice and
the plot, and both are pulled once a year.

### 6. Three more Australian community gardens, three different cadences

**FOUND. Rose Bay Community Garden, Woollahra NSW.** Entry is gated by participation before you get
a plot: "Just participate in 3 workshops and 3 working bees and you will be eligible for a Plot."
Then ongoing: "Members with plots are required to continue to be involved in at least 3 working
bees / community activities during each Membership Year." Working bees are the third Sunday of each
month. Fees: Membership single $50 / family $80, plus plot fee $100.
Source: https://rosebaycommunitygarden.org/membership/

Monthly cadence, three attendances a year out of twelve possible, so a 25% expectation. Family
membership is $80 against a single $50, so a household pays 1.6 times, not 2 times.

**FOUND. Curly Community Garden, Curl Curl NSW.** No individual plots at all, everything communal.
Membership $35 individual / $50 household. Working bees are **twice weekly**, Saturday mornings and
Wednesday afternoons. "According to our Member Guidelines, members are **encouraged** to attend at
least 12 working bees a year per year and are welcome to attend as often as they like. However, we
also welcome members who can attend less frequently than this or who may be away for extended
periods." Harvest is shared only among the members present at the working bee.
Source: https://curlycommunitygarden.org.au/faqs/

Two points. First, the requirement is a stated encouragement with an explicit exemption for people
who are away, and the reward is automatic rather than administered: **you get vegetables because you
are standing there when they are picked**. That is the lowest-admin sweat equity design in this
whole file, because there is no record at all. Second, they are candid about the yield: "Unless you
don't eat a lot of veggies, you will still need to make a weekly trip to the fruit & veg shop!"

**FOUND, and this is the insurance link.** Curly's answer to "Do I have to be a member to
participate in the garden's working bees?": you may attend once before joining, but to continue
"you need to become a member. **This is so you can be covered under our garden's insurance policy**
and so we can easily communicate with you." Same source. Membership is the insurance boundary, not
the access boundary.

**FOUND. North Perth Community Garden, City of Vincent WA.** Membership $20/year paid by everyone,
communal plot lease $20, individual plots $80 to $100 by size. "Members will be expected to
volunteer twice per annum at a working bee, event, fundraiser or special project as determined by
the committee from time to time." And, separately: "if you take on a formal role with us you get a
discount on your annual fees." They list thirteen named coordinator roles.
Source: https://northperthcommunitygarden.org/index.php/membership/

That last line is a second, quieter form of sweat equity: **effort discounts the fee for
office-holders**, not for general volunteers.

### 7. Northey Street City Farm, Brisbane: the Queensland control case

The closest Queensland comparator, and it deliberately does **not** trade work for access.

**FOUND.** Volunteering and membership are entirely separate. Volunteers get an induction, a free
meal Tuesday to Thursday, and morning tea. Nothing in the volunteer page offers a discount, a
membership, or a price. The requirement is one-directional: "please register to attend the farm
induction session so that you can be allocated a role, receive a safety induction, **and then be
covered under the farm's insurance**." Youth education volunteers "will need a Blue Card (Working
with children check)." Most volunteering happens Tuesday to Thursday mornings.
Source: https://www.nscf.org.au/volunteer/

**FOUND.** Allotments are a rental with a concession rate and a bond, and membership is explicitly
optional for allotment holders. Source: https://www.nscf.org.au/allotment-gardens/ (fees as recorded
in ticket 01, unchanged)

**INFERRED:** the nearest large Queensland peer separates the three relationships completely.
Volunteering earns an induction, insurance cover and lunch. Membership earns a discount. The
allotment is a rented asset. No one of these buys another.

### 8. Connected Community HackerSpace, Hawthorn Vic: contribution in lieu, by petition

**FOUND.** Fees are $75/month full, $37.50 concession, up to $900/year full, $450 concession.
First and second visits are free. Casual rate $30 per visit. Then the hardship clause:

> "If you feel that due to personal circumstances the fee structure is out of your reach you are
> invited to write to the committee for special consideration. The committee will consider each
> petition on a case by case basis, but please be prepared that certain privileges such as Key
> access may be denied you. Please consider the following criteria. Source of hardship (Generic
> terms are fine.) **What amount of contribution, financial and non-financial you can make in lieu
> of full membership.**"

Source: https://www.hackmelbourne.org/about-cchs/fees/

This is work-for-access with no published rate, no roster and no counting. It is negotiated once,
per person, by the committee, and it is explicit that reduced payment may come with reduced
privileges (no key). **INFERRED:** this is the cheapest possible administration of sweat equity, and
it works because the number of people using it is small and each case is a conversation, not a rule.

### 9. Robots and Dinosaurs (Sydney) and Makerspace Adelaide: the alternative they chose instead

**FOUND.** Robots and Dinosaurs: $50/month standard, "Starving Hacker" $30/month with no questions
asked ("We won't inquire about your circumstances, so if you feel you can't afford the full
membership you can purchase a starving hacker membership"), voluntary higher rates at $100/month
that confer no extra benefit, $30 single day use, first visit free.
Source: https://robodino.org/membership

**FOUND.** Makerspace Adelaide: casual access $20/day standard, $10 concession; membership $66.25/
month standard, $39.90 concession, with quarterly and annual discounts.
Source: https://makerspaceadelaide.org/pricing/

**FOUND, by absence.** Neither publishes any work-for-membership arrangement. Both solve
affordability with a self-declared cheaper tier instead. I looked for a work-in-lieu option on both
and did not find one; treat the absence as **INFERRED** rather than proven policy.

### 10. Surf lifesaving: the only Australian sector running compulsory hours at scale

Worth studying because it is the largest Australian population of people who must do unpaid work to
retain a membership category, and the clubs publish their rules.

**FOUND. Lorne SLSC, Vic.** Fees: Active (18+, holds Bronze Medallion) **$100**; Associate (30+,
**non-patrolling**) **$150**; Active Reserve $120; Long Service $140; Family $320 (or $350 after 1
December); Active Student $65. "All members aged 15-29 years, must gain their Bronze Medallion
qualification, and also complete a minimum of 16 hours patrol each patrolling season. This is an
Australian Surf Life Saving requirement." All members 18 and over must hold a current Working With
Children Check. Sources: https://lornesurfclub.com.au/members-home/membership-and-payments/ and
https://lornesurfclub.com.au/members-home/patrol-responsibility/

**This is the clearest published Australian price on effort I found.** The patrolling member pays
$100 and the non-patrolling member pays $150. The difference is $50 for a minimum of 16 hours, which
is **about $3.13 an hour**. It is not a discount for labour so much as a surcharge for not
labouring, and it is small.

**FOUND, on enforcement.** Lorne: "If you are unable to attend your patrol, **you must find a
substitute** and ensure that your patrol will not be deficient in any award that you hold." A
minimum of three hours must be achieved at any one time or the hours do not count at all.

**FOUND. Cronulla SLSC, NSW.** Minimum 25 personal patrol hours per calendar year for Active
members, 12 for Active Reserve, Long Service members exempt. "A member that is behind in their
rostered patrols may be considered to be in **patrol default** and this situation needs to be
corrected prior to the member being entered into any surf lifesaving competition." Substitution is
permitted "so long as the substitute turns up to the patrol". Hours can be earned through rostered
patrols, substitute patrols (credited to the person who actually did it), voluntary patrols, water
safety for junior activities, and volunteer specialist services. And: "**Penalty patrol hours shall
not be used as personal patrol hours** for competition purposes."
Source: https://cronullasurfclub.com/competition/patrol-hours-obligations/

Three transferable mechanisms here. **The sanction attaches to a privilege the person actually
wants** (competing at a carnival), not to money and not to basic access. **Substitution is the
sanctioned escape valve**, which turns a no-show from an administrative problem into the member's
own problem to solve. And **penalty hours exist as a category**, so there is a graded response
between "nothing" and "you are out".

### 11. Australian Men's Sheds: the insurance floor, priced

Ticket 01 inferred that a large part of a $60 shed membership is insurance. That is now verified.

**FOUND.** The AMSA group insurance program for 28 February 2026 to 28 February 2027 costs
**$28.50 per member**, with a minimum of fifteen members applied for the calculation. It bundles
$40,000,000 public and products liability, $10,000,000 association liability, Voluntary Workers
Personal Accident, Group Personal Accident for Mutual Obligation participants, Industrial Special
Risks up to $100,000, and $15,000 burglary cover.
Sources: https://mensshed.org/for-mens-sheds/shed-insurance/ and
https://everestrg.com.au/wp-content/uploads/sites/11/2023/02/AMSA-FAQ-V9.0-1.pdf (FAQ v12.2,
issued 9 February 2026)

**FOUND, and this matters for anyone letting the public do work.** From the same FAQ: "**No,
visitors to your premises are not directly insured by your Public & Products Liability insurance
policy.** ... while the policy covers claims made against the organisation by visitors, it does not
serve as personal insurance for visitors themselves."

So on a $60 shed membership, roughly half is insurance, and the insurance only reaches people who
are members. That is a concrete reason to make everyone who works a member, cheaply, rather than to
run an unmembered volunteer pool.

### 12. St Kilda Repair Cafe, Vic: the pure gift end

**FOUND.** "Repair Café doesn't charge for repairs. It's offered in the spirit of the gift economy
where we hope to share what we know and can do with our community." Attendees sign a registration
form with house rules and a disclaimer on arrival, and "all repairs are undertaken at their own
risk". Monthly, second Sunday, 2 to 5pm, hosted at the Port Phillip EcoCentre.
Source: https://www.stkildarepaircafe.org.au/faqs/

Nothing is earned and nothing is counted. The relevant mechanisms are the **signed disclaimer at the
door** and **hosting inside somebody else's venue**, which is how the liability is carried.

---

## Part 2: Volunteer, worker, or paid in kind. What the Australian primary sources say

This is the highest-stakes section and the one most likely to need a broker and an accountant rather
than a decision. Everything below is what the source says. Where the boundary is unclear, it says so.

### 2.1 The Fair Work Act does not define a volunteer, and that is the whole problem

**FOUND.** The Fair Work Ombudsman: "Volunteering is where someone gives their time to support a
cause, typically for a charity or not-for-profit organisation. Volunteering is unpaid. **A
volunteering arrangement could turn into an employment relationship.** If a volunteering arrangement
starts to become similar to an employment relationship, it's important to check if it is now an
employment relationship." The page cites Fair Work Act 2009 section 12 as its source reference.
Source: https://www.fairwork.gov.au/starting-employment/unpaid-work

**FOUND, the test itself.** From the FWO's unpaid work fact sheet: "There is no definition of
employment under the FW Act. Instead, it is a matter of working out whether the arrangement to work
involves an employment contract. That contract does not have to be in writing; it can be a purely
verbal agreement. For an employment contract to exist it must be clear that:

- the parties intend to create a legally binding arrangement
- there is a commitment to perform work for the benefit of the business or organisation
- **the person performing the work is to get something in return (which might be just experience or
  training)**
- the person must not be performing the work as part of a business of their own."

And the factors: nature and purpose ("Where the arrangement involves productive work rather than
just meaningful learning, training and skill development, it is likely to be an employment
relationship"); duration; how significant the work is to the organisation ("Is the work normally
performed by paid employees? Does the business or organisation need this work to be done?"); the
person's obligations; and "Who benefits from the arrangement? ... If the business or organisation is
gaining a significant benefit from the person's work, an employment relationship is more likely to
exist."
Source: https://www.fairwork.gov.au/tools-and-resources/fact-sheets/unpaid-work/unpaid-work-unpaid-work
(the page carries a notice that it is under review following the new statutory definition of
employment added to the FW Act on 26 August 2024)

**FOUND, the short version in the FWO library:** "An employment relationship can be indicated by:
organisation control; obligation to attend work; no free will to choose whether to attend or not."
Source: https://library.fairwork.gov.au/viewer/?krn=K600367

**Read those together and the picture for sweat equity is uncomfortable.** The "something in return"
limb is satisfied by experience alone, so a discount plainly satisfies it. The factors that push
towards employment are exactly the factors that make a sweat-equity scheme work: productive rather
than educational work, work that the organisation needs done, work normally done by paid staff, a
regular roster, and an obligation to attend. A scheme designed to be reliable is a scheme designed
to look like employment.

**Where it is genuinely unclear:** none of the FWO material addresses the specific case of a member
of a co-operative or association doing work in exchange for a benefit from that same association.
I found no Australian decision on point. Every organisation in Part 1 is operating in that gap.
**This is the item for a lawyer, not for a decision at a whiteboard.**

### 2.2 The ATO: benefits to volunteers, and where they become income

**FOUND, the definition.** "Although there is no legal definition of 'volunteer' for tax purposes,
**a volunteer does not work under a contractual obligation for remuneration** and would not be an
employee or independent contractor. So, if any of your workers are not employees or independent
contractors, they will be volunteers." As a general rule: "Volunteers do not have to pay tax on
payments or benefits they receive in their capacity as volunteers" and NFPs "are not liable for pay
as you go (PAYG) withholding and fringe benefits tax (FBT) on payments they make, or benefits they
provide, to volunteers."
Source: https://www.ato.gov.au/businesses-and-organisations/not-for-profit-organisations/your-organisation/your-obligations-to-volunteers-employees-and-contractors/not-for-profit-volunteers

**FOUND, the test that actually bites.** "Volunteers can be paid in cash, **given non-cash benefits**
or given a combination of both. ... **The name or description of the payment does not determine its
treatment for tax purposes**, it depends on the nature of the payment and the volunteer's
circumstances. **Generally, receipts that are earned, expected, relied upon and have an element of
periodicity, recurrence or regularity are treated as assessable income of a volunteer.**"

A payment that is not assessable income will have many of these characteristics: it meets incurred
or anticipated expenses; it has no connection to income-producing activities; it is not remuneration
or a consequence of employment; it is not relied upon for day-to-day living; **it is not legally
required or expected**; there is no obligation on the organisation to make it; and **"The payment is
a token amount compared to the services provided."**
Source: https://www.ato.gov.au/businesses-and-organisations/not-for-profit-organisations/your-organisation/your-obligations-to-volunteers-employees-and-contractors/not-for-profit-volunteers/paying-volunteers

**INFERRED, and stated as inference:** a published rate ("one hour buys a fortnight at 20% off") is
by construction earned, expected, recurrent and legally promised. Three of the ATO's seven
not-assessable characteristics point the other way as soon as you publish a rate. The one that still
holds is "token amount compared to the services provided", and that is exactly why the observed
Australian exchange rates are so low: Lorne's approx $3.13/hour, Essendon's $8.33/hour. Whether a
20%-off-groceries benefit is "token" depends entirely on how much the person shops, which is a fact
about the member, not about the scheme. **This is the accountant's question.**

**FOUND, on GST.** The ATO's volunteers-and-GST page covers credits on purchases for volunteers and
reimbursements, and says "A not-for-profit organisation does not need to remit GST on things it
provides to volunteers **if those things are to be used by the volunteer in their activities for the
organisation**."
Source: https://www.ato.gov.au/businesses-and-organisations/not-for-profit-organisations/your-organisation/your-obligations-to-volunteers-employees-and-contractors/not-for-profit-volunteers/volunteers-and-gst

Note the condition. A meal eaten during a shift is used in the activity. A discount on the member's
weekly groceries is not. **I could not find ATO guidance directly on GST treatment where labour is
the consideration for a supply of goods or services to a member.** The relevant concept is non-cash
or non-monetary consideration, and I did not reach a primary ruling on it within this ticket.
Marked as **not established**, and flagged as a question for the accountant alongside the GST
registration question already in the map.

### 2.3 Volunteering Australia's definition, and the example that fits The Harvest exactly

**FOUND.** "Volunteering is time willingly given for the common good and without financial gain."
Launched 27 July 2015. Source: https://www.volunteeringaustralia.org/resources/definition-of-volunteering/

**FOUND, the explanatory notes as reproduced by Volunteering Queensland:**

> "Volunteers can receive reimbursement of out of pocket expenses. Volunteers can be rewarded and
> recognised as part of good practice. **While this process may introduce an element of financial or
> material benefit to the volunteer it does not exclude the activity from being considered
> volunteering.** Volunteers may receive an honorarium, stipend or similar payment as recognition
> for voluntary services ... in accordance with Australian Taxation Office rulings."

And, on the same page:

> "Volunteering can include the concept of **reciprocity** such as participating in groups where a
> reciprocal exchange of help/services is undertaken for the benefit of others as well as the
> volunteer."

> "Volunteers can receive many benefits from their participation, including benefits that have
> financial value. For example: **a volunteer may perform yard work for a local community group and
> receive membership in community activities in return. In this case, both services benefit the
> community, so this is a volunteer role.**"

Source: https://volunteeringqld.org.au/about-volunteering/definition-of-volunteering/

That yard-work example is close to identical to a Harvest work day earning a membership. The sector
peak body's position is that this is volunteering. That is not law, and it does not bind the FWO or
the ATO, but it is the position an Australian insurer or funder will most likely be working from.

**FOUND, the qualifier that sets the ceiling.** Volunteering Australia's own tax fact sheet adds:
"**Any such rewards should be commensurate with the volunteer's contribution.**" It also warns
against allowances ("Volunteering Australia does not suggest the use of allowances for volunteers
because, where they are not tied to expenses actually incurred and vouched for, they are likely to be
treated as assessable income") and against honorariums ("they may attract volunteer's with the wrong
motivations").
Source: https://volunteeringhub.org.au/wp-content/uploads/2021/02/Volunteers%20and%20Tax.pdf
(Volunteering Australia, updated January 2021)

"Commensurate with the contribution" and the ATO's "token amount compared to the services provided"
pull in opposite directions. **INFERRED:** the safe zone is a benefit that is real enough to feel
like recognition and small enough that nobody would do the work for it if they did not also want to
be there. Both Australian published rates found here, approx $3.13/hour at Lorne and $8.33/hour at
Essendon, sit well under half the minimum wage. That is probably not an accident.

### 2.4 Queensland work health and safety: volunteers ARE workers, and the carve-out will not apply

This one is unambiguous and needs no interpretation.

**FOUND.** Work Health and Safety Act 2011 (Qld), section 7(1): the meaning of "worker" expressly
includes, at paragraph (h), **a volunteer**. Schedule 5 defines: "**volunteer means a person who is
acting on a voluntary basis (irrespective of whether the person receives out-of-pocket expenses).**"
Source: https://www.legislation.qld.gov.au/view/whole/html/inforce/current/act-2011-018

**FOUND, the carve-out and why it does not help.** Section 5(7): "**A volunteer association does not
conduct a business or undertaking for the purposes of this Act.**" Section 5(8): "volunteer
association means a group of volunteers working together for 1 or more community purposes **where
none of the volunteers, whether alone or jointly with any other volunteers, employs any person** to
carry out work for the volunteer association." Same source.

**INFERRED, but close to certain:** The Harvest employs people. It therefore cannot be a volunteer
association, it is a person conducting a business or undertaking, and every volunteer on site is a
"worker" to whom the full primary duty of care under section 19 is owed. Sections 34 and 34B mean a
volunteer does not personally commit an offence for most duty failures, and cannot commit industrial
manslaughter, but the organisation and its officers can.

**Note the definitional wrinkle.** The Act's "volunteer" is a person acting on a voluntary basis
"irrespective of whether the person receives out-of-pocket expenses". It says nothing about people
who receive a benefit beyond expenses. **INFERRED:** someone earning a discount may sit outside that
definition, but they would then be a worker under one of the other limbs of section 7 anyway, so the
WHS duty is the same either way. The WHS answer does not change with the scheme design. That is
useful: it means WHS is a fixed cost of having people do work on site, not a variable to be traded.

### 2.5 Queensland workers' compensation: volunteers are not workers, unless you buy a contract

**FOUND.** Workers' Compensation and Rehabilitation Act 2003 (Qld), section 11: "A worker is
(a) a person who (i) works under a contract; and (ii) in relation to the work, is an employee for the
purpose of assessment of PAYG withholding under the Taxation Administration Act 1953 (Cwlth)".
Source: https://www.legislation.qld.gov.au/view/whole/html/inforce/current/act-2003-027

So statutory workers' compensation follows the PAYG employee test. A genuine volunteer is not a
worker and is not covered.

**FOUND, the door that exists.** Chapter 1, Division 3, Subdivision 1 "Volunteers etc." lets
WorkCover enter contracts of insurance covering specified non-workers. Section 19 is the relevant
one for a place like The Harvest:

> "**19 Person in voluntary or honorary position with non-profit organisation.** (1) WorkCover may
> enter into a contract of insurance for this subdivision with a non-profit organisation. (2) The
> contract may cover a person in a voluntary or honorary position with the organisation (volunteer).
> (3) A person covered by the contract is entitled to compensation for injury sustained **only while
> attending meetings and performing any other duty the organisation requires**, as a volunteer."

Section 18 covers a church, non-profit charitable organisation or benevolent institution, but is
narrower still: cover applies "only while engaged on **a specific capital undertaking** of the
institution". Section 12(2) is the sting: "**The contract must not cover the payment of damages** for
injury sustained by the person" (with a narrow exception for specified volunteer firefighters). Same
source.

**INFERRED, three consequences.** First, the section 19 door is only open to a **non-profit
organisation**. The Harvest is currently trading through a sole trader and is heading to a Pty Ltd,
so which entity holds the volunteer relationship determines whether this cover is even available.
Second, the statutory volunteer cover pays compensation but explicitly **does not cover damages**, so
it does not remove the negligence exposure; that is what public liability is for. Third, "any other
duty **the organisation requires**" is a phrase that sits oddly beside the Fair Work position that a
volunteer should be under no obligation to attend. The insurance framework assumes required duties;
the employment framework treats required duties as evidence of employment. **That tension is real and
I did not find it resolved anywhere.**

### 2.6 What the insurance market says

**FOUND.** Ansvar, an Australian insurer specialising in the community sector: "**Volunteers are not
covered by Worker's Compensation legislation**, which is why it's so important for organisations to
cover themselves (and their volunteers) with Volunteer Personal Accident Insurance. ... Volunteer
Personal Accident Insurance is like Worker's Compensation for volunteers. ... it's a defined event
policy, so there is no requirement for the Insured to be negligent in order to claim." They also
note: "The insurance coverage will typically dictate what **age restrictions** there are on
volunteers (i.e. no one under the age of 16, for example)."
Source: https://www.ansvar.com.au/2022/09/28/does-public-liability-insurance-cover-volunteers/

**FOUND.** Two Australian organisations state plainly that membership exists in order to make the
insurance work: Curly Community Garden ("This is so you can be covered under our garden's insurance
policy") and Northey Street City Farm ("receive a safety induction, and then be covered under the
farm's insurance").

**The questions for the broker, not for a decision:**
1. Does our public liability policy respond to injury or damage caused by a person doing rostered
   work who receives a benefit of value in return? Does the policy define "volunteer" and does
   receiving a discount, a meal, a membership, or sauna access take them outside that definition?
2. Do we need Volunteer Personal Accident cover, what does it cost per head, and what is the minimum
   and maximum age it covers?
3. Is a WorkCover Queensland section 19 volunteer contract available to the entity that will actually
   hold the relationship, and what does it cost?
4. Does anything change if the person is paid in store credit rather than a discount?
This belongs beside `thoughts/wiki/operations/insurance-call-sheet-2026-07-31.md`.

---

## Part 3: What actually happens when someone does not turn up

### 3.1 Park Slope Food Coop: the deepest published enforcement machinery in existence

Brooklyn, over 16,000 members, no discounts, closed to non-members, every adult member must work.
Their membership manual and member-labor flyer are public and unusually specific. Not Australian,
but nobody else has published this much detail.

**FOUND, the requirement.** "All shifts are 2 hours and 45 minutes"; "Each member is responsible for
13 workslots a year"; the shift cycle is six weeks and "every working member has to do at least one
shift every six weeks"; "All working members are required to schedule shifts through Member Services.
**Walk-ins (or unscheduled work) are not permitted.**"
Sources: https://www.foodcoop.com/wp-content/uploads/2023/09/HIW_member_labor_v2.pdf and
https://www.foodcoop.com/wp-content/uploads/2020/01/MembershipManual_2020_1_13_FINAL_WEB.pdf

**FOUND, the escalation ladder**, in order:
- Cancel before 8pm the night before: no penalty. One "cancel ticket" per calendar year lets you
  cancel later, up to an hour before.
- Three cancellations of a recurring team shift in a rolling 12 months is tolerated. "At the fourth
  cancellation, you will be automatically removed from the team."
- More than 15 minutes late: "the staff has the right to turn you away and mark you a 'no show'."
- No show: one shift credit debited. Under the older ABCD system, "if you are absent from your shift,
  **you will owe two make-ups**".
- Two cycles behind: "**suspended**", which "prevents you from shopping" and "affects all members of
  your household even if the other household members are alert or active for work."
- Suspended members get a 10 to 14 day grace period to keep shopping while they fix it, then five
  "suspension overrides", single-day passes requested from the Membership Office.
- Persistent failure: "Not Placed", where you stay suspended, keep accruing a make-up every cycle,
  and make-ups worked earn no credit until you rejoin a squad.
- "One-for-One": a negotiated plan for members owing six or fewer make-ups, letting them keep
  shopping while working them off, revoked if they miss again.
- "Work Amnesty": rejoin after a year away and owed make-ups are wiped, once per lifetime.

**FOUND, the reason the double make-up exists**, in the Coop's own words, and this is the single most
useful sentence in this file on the resentment question:

> "The Double Make-up Policy is the result of the Coop's shaky start in the early 1970s when
> **attendance was often bad enough to cause those who did show up to quit because of the unfair
> burden placed on them.** Back then, members only had to do one make-up for an absence. Our
> membership learned that by allowing members to do only one make-up for a missed shift, we were
> making it easier to miss a shift and work an unscheduled make-up than to show up for a scheduled
> shift. ... The Double Make-up Policy, which was voted in by the membership at a General Meeting, is
> **not intended as a punishment but as an incentive**."

Source: membership manual, as above.

The resentment that kills these schemes is not paying members resenting working members. **It is
reliable people resenting unreliable people.** The published fix is to make the unscheduled make-up
strictly worse than the scheduled shift, and to have the membership vote it in rather than the board
impose it.

**FOUND, no buyout at all, deliberately.** "**I. NO WORKSLOTS FOR PAY.** The Coop prohibits members
from paying members outside of their household to do their Coop work. This rule was decided upon by
members at a General Meeting to prevent members (who could afford to) from paying their way out of a
shift and losing the connection to the Coop as working members." Same source.

That is the explicit counter-argument to Stearns Farm's buyout. Both positions were arrived at
democratically. The difference is what the organisation thinks it is selling: Stearns sells
vegetables and the hours are a cost input; Park Slope sells belonging and the hours are the product.

### 3.2 A member's account, which is the answer to "what really happens"

**FOUND.** An observational essay by a Park Slope member, written as a graduate assignment in 2017:

> "**The ins and outs of the work requirement are the subject of constant low-key grumbling, but
> little genuine resentment.** There are stories of members conducting various scams to evade work,
> or forcing their nannies to do shifts, but these cases are exceedingly rare. After a member of my
> squad was busted for freeloading off his wife's membership, he cheerfully acknowledged that it was
> only fair he do shifts as well. **I have met several former members who bitterly complain about
> being unable or unwilling to meet the work requirement.** On the other hand, some members
> positively cherish their Coop jobs."

He also observes: "Like the walkers, this last job seems like a sign that there is an **absurd
oversupply of volunteer labor**, which is true."
Source: https://ethanhein.substack.com/p/descriptive-participant-observations-on-the-culture-of-the-park-slope-food-coop

Two findings in that. **The people who resent the requirement have already left**, so surveying
current members will always understate the problem. And a mandatory scheme at scale produces surplus
labour that has to be given something to do, which becomes its own management problem.

### 3.3 The Australian pattern: nobody chases anyone, the renewal does the work

**FOUND.** Across every Australian scheme in Part 1, I found **no published process for chasing a
non-attender**. What I found instead:

- Essendon: a $50 surcharge added to the next annual fee. No chase, an invoice.
- Rose Bay: participation is a condition of continuing eligibility for a plot, checked at membership
  year boundaries.
- Curly: attendance is "encouraged", the reward is the produce you take home from the session you
  attended, and non-attendance costs you the produce and nothing else.
- North Perth: an expectation "as determined by the committee from time to time", with a fee discount
  for people who take formal roles.
- Blue Mountains and Canberra: the benefit simply lapses. In Canberra it lapses on a published clock,
  a fortnight per hour worked.
- Surf clubs: you must find your own substitute; failure puts you in "patrol default", which blocks
  competition entry.

**INFERRED, and I am confident in it:** the Australian community sector does not enforce sweat equity
by pursuit. It enforces by **lapse** (the benefit expires), by **surcharge at renewal** (the invoice
collects itself), by **eligibility gate** (no plot, no carnival), or by **self-substitution** (your
problem to solve, not the coordinator's). None of those requires anyone to have an awkward
conversation. That is why they survive in organisations with no paid administrator.

### 3.4 Is a buyout genuinely invoked?

**Not established.** Canberra's buyout is published, gated by written board approval, and priced at
the AGM, which is strong evidence that it is real rather than decorative. But I could not find the
price, could not find minutes recording an approval, and could not find any organisation reporting
how many members use its buyout. Essendon's $50 surcharge is stated as automatic ("will be added to
the annual fees"), which suggests it is applied rather than invoked, but I found no minutes or
newsletter confirming that it actually is. **Evidence here is thin and I am not going to dress it up.**

---

## Part 4: Documented walk-backs

### 4.1 Alfalfa House, Sydney (Australian, twice)

Covered in Part 1.5 above. Compulsory member hours at "$1 an hour" from 1988, dropped at some point
in the 1990s, and the co-op's own history says operations turned the corner when they employed staff
and dropped the requirement. Then in January 2021 the 20% volunteer discount was removed under
trading pressure and replaced with a smaller one. Shop closed 2023 with about 3,300 members, stated
cause tenure.

### 4.2 The American food co-op sector, which walked back for a legal reason

This matters to The Harvest because the mechanism, not the jurisdiction, is what transfers.

**FOUND.** Associated Press, January 2016: "Food cooperative programs that allow members to scoop
rice, sort organic vegetables and ring up sales in return for grocery discounts are **fading fast
amid a changing marketplace and fears of violating labor laws**. ... The larger issue weighing on the
board at Honest Weight and other co-ops is the fear that labor officials could classify their working
members as employees rather than volunteers, leaving them open to charges they are violating
minimum-wage rules."

Named in that one article:
- **City Market, Burlington VT**: "this year finished phasing out of its traditional member work
  program in favor of one that **gives members credit for out-of-store community volunteering**."
- **East End Food Co-op, Pittsburgh**: "ended its volunteer program last September."
- **Bloomingfoods, Bloomington IN**: "ended its limited program recently **after implementing its
  first union contract for employees**."
- **Honest Weight, Albany NY**: about 1,200 working members and USD 25 million of sales. The board
  voted to discontinue the in-store program, "Board members rescinded that vote after being told they
  overstepped their authority. But the initial uproar led to a shake-up of the board that **cost the
  president his position**." A board member: "The time to make a change is now, before we have a
  complaint filed against us. And I don't think our membership is there yet."
- **Park Slope**, named as the "one big exception", where "**members don't get discounts, and the
  store is not open to non-members**", and where the general coordinator said the program "has never
  run into trouble".

Source: https://www.seattletimes.com/business/will-work-for-food-co-op-programs-end-amid-labor-law-fears/

**Read the exception carefully.** The one program that never had trouble is the one where the labour
buys **no discount at all**. The benefit is access to a shop that is closed to everyone else. That is
a different legal shape: not payment in kind for work, but a condition of membership in a mutual.

### 4.3 The dollar figure on the risk

**FOUND.** A first-person account published in Cooperative Grocer in 1992 by the manager of Co-op
Food Fair, a consumer co-operative in Independence, Missouri, about 5,000 member families:

> "Our Gold Star volunteer program had allowed members a **5 percent discount for three hours of work
> per week**. The DOL offered to resolve the issue for **$75,000**. This money would be paid to the
> volunteers for the time they volunteered. The $75,000 was computed by multiplying **minimum wage
> times three hours per week times 52 weeks, times two years (the statute of limitations), times each
> volunteer**. ... These volunteers are all member-owners and do not want to be paid. The DOL says
> they know that but it's the law."

Source: https://archives.grocer.coop/articles/member-labor-issues-retail-food-co-ops

**FOUND, the legal analysis that goes with it**, from a 2012 follow-up: "when a working cooperative
owner tells the DOL that he or she doesn't want to be paid or doesn't consider themselves a worker,
**those facts are irrelevant**." And on the obvious defence: "What about using clever mathematics to
calculate the average 'wage' received by a co-op member in the form of discounts and demonstrating
that it meets or exceeds the minimum wage? **Unfortunately this argument does not hold water.**"
And on how these end: "**to date, all of the retail food cooperatives that have been subject to or
threatened with enforcement action regarding their member labor programs avoided the cost and risk of
litigation by entering into settlement agreements.**"
Source: https://columinate.coop/whos-watching-member-labor-in-retail-food-cooperatives/

The same article gives the third reason co-ops dropped these programs, which has nothing to do with
law: "Others reduced or eliminated member work programs because they felt **the net cost of these
programs caused nonworking members to unfairly subsidize the cost of the discounts.**"

**INFERRED, on transferability:** the American exposure calculation is minimum wage times hours times
the limitation period times every participant. Australia has no identical mechanism, but the
underlying shape (if they were employees, back pay is owed for all hours) is the same under the Fair
Work Act. The number is not the number here. The structure of the number is.

### 4.4 Park Slope's accidental controlled experiment, 2020 to 2021

**FOUND.** The Coop suspended member labour entirely during the pandemic and rebuilt it in stages:
first "Member Labor Is Coming Back! Member labor will resume in October. **These shifts will be
VOLUNTARY**, and you will be required to sign-up for every shift you work. Members will earn one FTOP
credit for each shift worked ... **All members may continue to shop regardless of participation in
these voluntary shifts.**" Then, "The member-labor work requirement resumed on Monday, July 12. All
members are required to work a shift unless on a work-exempt committee."
Sources: https://www.foodcoop.com/member-labor/ and https://www.foodcoop.com/return-of-member-labor/

So a compulsory scheme was switched off, run voluntarily with a credit incentive for roughly nine
months, and switched back on. They did not publish participation rates for the voluntary period, so
**the most interesting number from the experiment is not available.**

**FOUND, what they did publish afterwards**, April 2022, and it is genuinely useful:
- Cycle length extended from five weeks to six "As the Coop size continues to increase ... **The Coop
  was on pace to have more member workers than work shifts in the cycle.**"
- Cap on simultaneously scheduled shifts cut from four to two: "When we reviewed the data, we
  realized that **12% of the member-worker pool was scheduling 21% of all available shifts.**"
- Popular shifts are now "timed to release throughout the cycle. This system was created after
  observing that **members grabbed all the most popular shifts the day they were released**, leaving
  no options for members who looked later in the cycle."
Source: https://www.foodcoop.com/update-on-member-labor/

**INFERRED:** at scale, the scarce resource flips. The problem stops being "nobody turns up" and
becomes "too many people want the good shifts". A minority hoards. The fixes are all supply-side
scheduling rules, not enforcement.

### 4.5 The one from ticket 01, for completeness

Nottingham Hackspace lost 148 of roughly 650 members overnight when a GBP 5 minimum replaced
pay-what-you-want, triggered by a VAT threshold breach. Already documented in
`.scratch/membership-model/research/01-comparable-models.md`, not re-derived here.

---

## Part 5: The mechanics

### 5.1 What they actually record with, and what it costs

| Organisation | Tool | Cost |
|---|---|---|
| Blue Mountains Food Co-op (2,100 members) | "the live Google Doc linked here: BMFC Volunteer Roster", plus a Volunteer Coordinator | nil, plus one person's time (**FOUND**, https://bmfoodcoop.org.au/volunteer/) |
| Sutton Community Farm (UK) | Three Rings | "a typical helpline or volunteer-run library could probably expect to pay **about GBP 174 per year** ... including VAT" (approx A$334); priced on organisation turnover; "For the smallest charities ... we might be able to provide Three Rings for free"; top of scale approx GBP 270 (approx A$518) (**FOUND**, https://threerings.org.uk/get-a-3r-account/get-an-account/) |
| Park Slope Food Coop | bespoke "Member Services" with shift calendar, credit bank, auto-scheduled recurring shifts, iPad check-in by paid staff | not published (**FOUND** for the description, **not established** for cost) |
| Robots and Dinosaurs, CCHS Melbourne | TidyHQ (Australian) | Free tier: unlimited contacts and members, 100 emails/month, 3% + US$0.20 service fee. Pro US$690/year (approx A$988), 1% + US$0.20. (**FOUND**, https://tidyhq.com/pricing) |
| Volaby (Australian-built volunteer management) | onboarding, rostering, compliance, impact recording | 30-day free trial; pricing not shown on the page I fetched (**FOUND** for existence, **not established** for price, https://volaby.org/) |
| Better Impact / Volunteer Impact | three tiers by volunteer count (up to 500, up to 2,000, unlimited) | **no prices published**, "Book a Demo" only (**FOUND**, https://www.betterimpact.com/volunteer-impact-pricing/) |
| Essendon, Rose Bay, Curly, North Perth community gardens | no tool named anywhere on their sites | nil (**INFERRED** from absence) |

**INFERRED:** the tool is not the cost. Three Rings at approx A$334/year is trivial next to the
coordinator's time. A 2,100-member co-op runs on a Google Doc. The thing that scales badly is the
human who keeps the roster, not the software that holds it.

### 5.2 Administrator time per week, at 50 and at 200

Nobody publishes this by membership size. The best Australian data is by role, not by scale.

**FOUND.** Victoria's State of Volunteering Report 2025:
- Paid Leaders of Volunteers work an average of **16.4 hours per week** on the role. Unpaid Leaders of
  Volunteers contribute **13 hours per week**.
- 69.4% of Leaders of Volunteers are women; average age 54.7 years; **46.3% are unpaid**; 39.4% have
  more than 12 years of experience.
- "In 2024, **less than 60% of volunteer leaders said they expected to still be in their role in
  three years.**"
- "The average cost to manage volunteers was **$86,717 per year**. The **cost per volunteer hour is
  just $5.92.** This is significantly lower than the national average of $13.97/hour reported in other
  State of Volunteering reports, and down from $6.69/hour reported in Victoria's 2020 report."
- The expense breakdown per organisation per annum: wages and salaries related to volunteer
  management **$44,513**; rent and infrastructure $7,711; catering $6,510; volunteer recognition
  $4,758; marketing $4,354; induction, education and training $3,879; tools, equipment and technology
  $3,307; motor vehicle $2,978; **insurances $2,236**; administration $2,201; other $2,144; volunteer
  reimbursements $1,574; accommodation $551.
- Reimbursement of volunteer expenses averaged $131 per month against volunteers' actual
  out-of-pocket costs of **$235 per month**, "a cost carried by volunteers themselves".
- A quoted leader: "**I love what I do, but I can't keep doing it without support, it's too much for
  one person.**"

Source: https://www.volunteeringvictoria.org.au/wp-content/uploads/2025/05/VV0012-VV-SOVR-Report-FINAL.pdf

**INFERRED, arithmetic only, flagged as such.** At $5.92 per volunteer hour of management cost, a
scheme where 50 members each give 8 hours a year (400 hours) costs about **$2,370 a year** to
administer. At 200 members giving 8 hours (1,600 hours), about **$9,470**. At the national average of
$13.97/hour those become about $5,590 and $22,350. Those are not observed Harvest figures, they are
the Victorian sector average applied to two hypothetical volumes, and they include wages, catering,
recognition, training and insurance, not just rostering. Treat as an order of magnitude, not a budget.

**Note the direction of the trend.** Victoria's cost per volunteer hour fell from $6.69 in 2020 to
$5.92 in 2025. The report reads that as "rising financial strain and declining investment in volunteer
infrastructure", not as efficiency.

### 5.3 What happens when the roster-holder is away for six weeks

**Not directly established.** No organisation publishes an account of this. The closest evidence:

- **FOUND.** Blue Mountains Food Co-op routes all volunteer shift booking through one named Volunteer
  Coordinator and one shared Google Doc, with monthly training nights. Single point of failure, stated
  on the page.
- **FOUND.** Park Slope's Membership Office is "open six days a week", "managed by paid Membership
  Coordinators and is staffed by Office Committee members doing their workslots", and the Coop employs
  General Coordinators plus "more than 80 'area' Coordinators", whose "responsibilities include
  supervising and coordinating the labor of our 17,000+ members." The scheme is only continuous
  because it is staffed continuously.
- **FOUND.** Victoria's report: fewer than 60% of volunteer leaders expect to still be in the role in
  three years, and 46.3% are unpaid.
- **FOUND.** Canberra Food Co-op's own weakness list: "Transient roles, turnover and changing
  availabilities for certain roles means we lose capacity and knowledge."

**INFERRED:** the designs that survive an absent coordinator are the ones with no coordinator in the
loop. Curly's model (turn up on Saturday, take home what is picked) needs nobody. Canberra's model
(one hour buys a fortnight, flagged at the till) needs nobody after the shift. Essendon's model (a
surcharge at renewal) needs one person once a year. Park Slope's model needs paid staff six days a
week. The correct question is not "who covers the roster" but "does the scheme have a roster at all".

### 5.4 Resentment between paying and working members

**FOUND, and it is not the resentment the ticket expected.** Park Slope's manual records that the
original failure was reliable members quitting because unreliable ones made their burden unfair, and
the fix was to make the missed shift cost double. Cooperative Grocer records the other direction:
co-ops that ended programs "because they felt the net cost of these programs caused **nonworking
members to unfairly subsidize the cost of the discounts**". Canberra Food Co-op records a third:
"'Exclusive' community, we are **overly dependent on core members who dominate some activities**."

**INFERRED:** there are three distinct resentments, and they need three different answers.
1. Workers resenting no-shows. Answer: make a missed booked shift worse than not booking one.
2. Payers resenting the discount they fund. Answer: keep the exchange rate visibly small, and publish
   what the money does, not what the worker gets.
3. Newcomers resenting the core group. Answer: rotate roles, publish the rota, and cap how many shifts
   one person can hold, as Park Slope did when 12% were taking 21% of shifts.

### 5.5 Cadence, and which one shows the best turn-up

Observed Australian and comparable cadences:

| Cadence | Example | Requirement |
|---|---|---|
| Twice weekly, drop-in | Curly Community Garden | encouraged 12 a year out of ~104 possible |
| Weekly, fixed 4-hour slot | FoE Melbourne | "ideally once a week" |
| Every 4 to 6 weeks, booked | Park Slope | 13 shifts/year, mandatory, 2h45m |
| Monthly | Rose Bay | 3 attendances/year out of 12 |
| Per season | Surf clubs | 16 to 25 hours/season |
| Twice a year | Essendon, North Perth | 2 attendances/year |
| Per hour, decaying | Canberra Food Co-op | any hour buys a fortnight |

**I could not find published turn-up rates for any of them.** No organisation in this set publishes
attendance against requirement. **INFERRED, from design rather than data:** the schemes that ask for
the least (two attendances a year) are the ones that attach a money consequence, and the schemes that
ask for the most (weekly) are the ones that attach no consequence at all and rely on the reward being
immediate. Frequency and enforcement appear to be substitutes, not complements. That is an inference,
not a finding.

### 5.6 Household versus individual

**FOUND**, and the sector is split:

- **Household is the unit of price.** Blue Mountains: $40 household. Curly: $35 individual, $50
  household. Rose Bay: $50 single, $80 family. Lorne SLSC: $320 family.
- **Household is the unit of obligation.** Essendon: two working bees "per plot". Beardsley (ticket
  01): one application per household, "all household members may contribute volunteer hours towards
  the share".
- **Household is the unit of liability.** Park Slope: "All members of the same household are linked in
  our membership system ... If you are suspended because of overdue make-ups or money owed, this will
  impact your housemate's ability to shop." But also "one person in a household may do the work of
  their housemates and/or partner in addition to their own work", and each adult chooses a workslot.
  If one household member wants to go on leave because they cannot meet the requirement, "all members
  of your household have to go on leave as well."

**INFERRED:** the tidy answer is the one Essendon and Beardsley reached independently. Price and
obligation attach to the household; anyone in the household may discharge it; the number of adults is
not counted. Park Slope counts adults individually and then has to build an entire linked-household
suspension apparatus to stop free riding within a home. That apparatus is a cost the household model
does not incur.

### 5.7 Banking ahead, expiry, and over-delivery

**FOUND, three distinct designs:**

1. **Decay, no bank.** Canberra Food Co-op: one hour buys a fortnight of the discount, two hours in
   succession buys a month. Hours are cumulative within a sitting but the benefit runs on a clock.
   Nothing is stored, so nothing has to be tracked. Over-delivery simply extends the clock.
2. **Points towards a threshold.** Blue Mountains: "you'll receive points towards a 20% discount on
   your shopping". No stated expiry found.
3. **A formal bank with rules.** Park Slope FTOP: "There is no limit to the number of credits you can
   have in your bank"; "These banked shifts **do not expire**"; but "Banked FTOP shifts can be used
   toward **planned absences only, not as make-ups after an absence**"; you must hold at least two to
   use them; "You may not schedule or work FTOP shifts if you owe any make-ups"; and "**FTOP shifts in
   your bank cannot be applied to make-ups owed**."

That third set of restrictions is the interesting one. Park Slope lets you bank indefinitely but
forbids the bank from ever settling a debt. **INFERRED:** if banked effort can clear a missed shift,
then a keen member can pre-buy the right to be unreliable, which defeats the point of scheduling. If
you allow banking at all, allow it only for absences declared in advance.

**FOUND, the over-delivery problem at scale.** Park Slope had to cap simultaneous bookings at two,
because 12% of workers were taking 21% of shifts, and had to lengthen the cycle because there were
more willing workers than shifts. Over-delivery is not a gift, it is a crowding-out problem for
everyone else.

---

## What this means for The Harvest

**This section is interpretation, not finding.** Everything above is sourced. Everything below is my
reading of it, and should be argued with.

**1. The Australian evidence says price the effort low, and the number is around $3 to $8 an hour.**
Lorne SLSC prices a season of patrol at about $3.13/hour of difference in the fee. Essendon prices a
missed work day at $8.33/hour. Both sit far below the wage a court would impute. Stearns Farm's approx
A$17/hour, which ticket 01 carried forward, is at the top of the observed range and is American. A
Harvest rate at the Australian end is both more defensible and cheaper to be wrong about.

**2. Do not let effort buy the sauna.** Ticket 01 established that an Australian sauna visit is a $45
product. If an hour of work is worth $3 to $8, a sauna session costs six to fifteen hours of weeding,
which nobody will accept, or you set the rate at $45 an hour, which is above the minimum wage and
turns the whole scheme into a payroll question. Effort should buy the things with no retail price:
membership itself, a plot, a place in the room, a meal on the day. The sauna stays a product.

**3. Copy Canberra's clock, not Stearns' ledger.** "One hour of work keeps your member rate live for a
fortnight" needs no record, no chasing, no roster software and no coordinator. It is a flag on a
contact record with an expiry date, which the CRM already does. Stearns' hours-owed model needs
somebody to hold a balance and eventually to invoice against it.

**4. If a buyout is published, gate it the way Canberra does.** Written approval, price set once a
year by whoever governs, and explicit permission to weigh circumstances. A self-serve buyout price on
a public page is a statement that money and effort are interchangeable, which is the thing Park Slope
voted against and the thing that makes the Fair Work analysis worse rather than better.

**5. Make the missed booked shift worse than not booking.** Park Slope's double make-up is the only
mechanism in this research that was adopted specifically to stop reliable people leaving. The Harvest
version is mild: someone who books a work day and does not come loses the benefit for longer than
someone who never booked. It costs nothing to state and it is the difference between a roster and a
suggestion.

**6. Membership is the insurance boundary, and that is the honest reason to have one.** Curly and
Northey Street both say it in plain words on their public pages. The Men's Shed number puts a price on
it: $28.50 per member per year buys $40M public liability plus voluntary workers personal accident.
"Join so you are covered" is a better sentence than "join to support us", it is true, and it survives
scrutiny.

**7. Count the household, not the adults.** Essendon and Beardsley both landed there without talking to
each other. Park Slope counts adults and then needs a linked-suspension system to stop one partner
carrying the other. The Harvest does not want to build that.

**8. The legal work is two calls, not a decision.** One to the broker: does our public liability
respond to a person doing rostered work who receives something of value, and does the policy define
"volunteer" in a way that excludes them. One to Standard Ledger: is a published discount-for-labour
rate assessable to the member, does it create GST consequences on non-cash consideration, and which
entity should hold the volunteer relationship given that WCR Act section 19 cover is only available to
a non-profit organisation. Neither call needs the membership model finished first, and both should
happen before any rate is published.

**9. The precedent to have ready if someone challenges it.** Volunteering Queensland's own page gives
the example of a person doing yard work for a community group and receiving membership in community
activities in return, and calls it a volunteer role. That is the closest thing to an Australian
blessing of this exact arrangement that I found, and it is worth having the URL in the file.

**10. And the warning that Alfalfa House gives for free.** An Australian food co-op made members work
for their membership, dropped it, and says on its own history page that dropping it is when the
business started to work. Twenty-five years later, under pressure, the successor scheme (a 20%
volunteer discount) was the first cost cut. Sweat equity is real revenue foregone, it is variable, and
it is fragile at exactly the moment the organisation is under strain.

---

## What I could not establish

- **The Canberra Food Co-op's actual buyout price.** Set at each AGM, not published on the website,
  and I could not reach their AGM minutes.
- **Whether any Australian buyout or surcharge is actually collected.** Essendon's $50 is stated as
  automatic; I found no minutes, newsletter or member account confirming it has ever been applied.
  This is the biggest hole in the enforcement section.
- **Turn-up rates against requirement, for any organisation, anywhere.** Nobody publishes attendance
  as a percentage of the obligation. All the cadence reasoning in 5.5 is inference from design.
- **Park Slope's participation rate during the voluntary period (October 2020 to July 2021).** They
  ran the experiment and did not publish the number.
- **Administrator hours per week at 50 and at 200 members.** The Victorian State of Volunteering data
  is by role (16.4 hours/week paid, 13 unpaid) and by dollar ($5.92 per volunteer hour), not by
  organisation size. The two dollar figures in 5.2 are my arithmetic on a sector average, not
  observations.
- **ATO guidance on GST where labour is the consideration for a supply to a member.** The concept is
  non-monetary consideration; I did not reach a primary ruling within this ticket. The ATO bartering
  page URL I tried returned 404 and I did not find the current location.
- **Any Australian tribunal or court decision on a co-operative member working in exchange for a
  member benefit.** I looked; AustLII blocked automated access and I found nothing on point through
  other routes. Treat the whole area as untested in Australia rather than settled either way.
- **Blue Mountains Food Co-op's stated exchange rate.** A search summary quoted "4 hours work ... 20%
  discount off $250 worth of shopping". Their live volunteer page says only "points towards a 20%
  discount". The specific figures are unverified.
- **Whether Robots and Dinosaurs or Makerspace Adelaide have any unpublished work-in-lieu
  arrangement.** Absence of a published policy is not proof of absence of a practice.
- **WorkSafe Queensland's own guidance pages on covering volunteers.** worksafe.qld.gov.au returned
  403 to every automated fetch I tried. The statutory position in 2.5 comes from the Act itself via
  legislation.qld.gov.au, which is a better source anyway, but the practical "how to buy it and what
  it costs" pages could not be read.
- **Volaby and Better Impact pricing.** Neither publishes a figure.
