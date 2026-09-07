# The Harvest: seeing the money, packaging events, housing people, and one set of books

> Written 7 September 2026, the week after the first green trading week (an event carried it).
> Companion code: `.scratch/harvest-financial-model/model.ts` (cost base, scenarios, contribution)
> and `.scratch/harvest-financial-model/people-places-entities.ts` (who works where, rent flows,
> entity map, weekly cash view). Numbers live in the code. This page holds the reasoning and
> the decisions. Ledger: `thoughts/shared/handoffs/harvest-money-and-media/current.md`.

## What the books say today (Xero and the Xero mirror, checked 7 Sep 2026)

The only Xero file is still Nic's sole trader (ABN 21 591 780 066). 1 July to 7 September:
income $227,063, expenses $184,162, net $42,901. That is all of ACT mixed together, not
The Harvest. Wages $0, Super $0, Cost of Goods Sold $0, Merchant Fees $0.

Checked line by line in the `xero_transactions` mirror (synced 6 Sep, last transaction 5 Sep):

- **The Harvest tracking option exists and is in use.** Xero category `Project Tracking`,
  option `ACT-HV — The Harvest Witta`. 74 transactions carry it since 1 July. The `HARVEST`
  category and `HARVEST-EVENTS` codes named in the ACT wiki do not exist in this file; ACT-HV is
  the real one.
- **Square deposits are coded as an expense.** 28 settlements from Square Australia since 20 June,
  $8,396.50 in total, sit in account 485 Subscriptions, tagged ACT-CORE or nothing. Harvest sales
  income is therefore $0 in the P&L and the Subscriptions line is understated. This is the single
  reason the green week cannot be seen.
- **Bidfood is booked but as build materials.** 12 bills, $5,855, account 446 Materials & Supplies
  (one in Bank Fees), most tagged ACT-HV, three untagged. Nothing in Cost of Goods Sold.
- **Nobody on site has been paid through this file.** No contact, bill, or bank line for Dennis,
  Susie, Joey or Trina since 20 June. The only Dennis entry is a $2,000 sales invoice to him dated
  28 August for one refunded week of the pizza teaching program, coded to account 200 Sales - Rent.
  The P&L shows Sales - Rent at $1,524; the difference is not explained by anything readable here.
- **Harvest-tagged spend 1 July to 7 September:** about $30,000, led by Sub-contractors $16,620
  (electrical, carpentry), Materials $5,406, Travel $4,202. Harvest-tagged income: $0.

Weekly Square settlements and Bidfood bills as they hit the bank (settlements lag sales by two
to four days, so the last row is incomplete):

| Week starting | Square in | Bidfood out |
|---|---|---|
| 6 Jul | $959 | $605 |
| 13 Jul | $1,199 | $0 |
| 20 Jul | $797 | $1,376 |
| 27 Jul | $640 | $1,348 |
| 3 Aug | $380 | $0 |
| 10 Aug | $900 | $913 |
| 17 Aug | $861 | $350 |
| 24 Aug | $1,397 | $365 |
| 31 Aug | $1,033 | $898 |

So the green week is real at the till and invisible in the books. The books cannot show a
Harvest week green or red until three things are true: Square deposits are coded to a sales
account with ACT-HV, food inputs go to Cost of Goods Sold, and whoever is paid on site is paid
through the file. None of that needs the new company. It needs a bookkeeping rule and about
two hours.

## 1. The live money view

**Principle: one till, one bill inbox, one file. Then a view on top.**

Square is the till. Every dollar taken on site goes through it, including cash: count the
tin at close and key it as a cash sale so Square is the single record of takings. Bidfood,
firewood and gas go Dext to Xero as bills coded COGS with tracking ACT-HV. Wages run in Xero
payroll. That is the whole data path; nothing else is needed to know whether a week was green.

**The Monday routine now exists:** `npm run books:check` reads the Xero mirror and writes a
bookkeeper fix-note to `thoughts/shared/books/`. It lists every Square deposit not coded as
Harvest sales, every Bidfood bill not in Cost of Goods Sold, anything in Sales - Rent, unreconciled
Harvest lines, and whether anyone on site was paid through the file, plus the weekly till-in
versus food-out table. Run it, send the note to Standard Ledger, done. It never writes to Xero.

What can be read by an agent today: Xero (cash, P&L, bills) through the Xero connector, and the
bank-feed mirror through the script above.
What cannot: Square. There is no Square connector and the Square to Supabase pull scoped on
19 June was never built. Two options, in order:

1. **Now, zero build.** Monday morning Ben exports Square Sales Summary and Item Sales as CSV
   for the week and drops them in `thoughts/shared/square-exports/`. An agent reads them, ties
   Square net to the Xero bank feed line, and posts the five numbers to the Notion Harvest
   Dashboard. Six weeks of this retires the six assumptions listed in `model.ts` section E.
2. **Later, one build.** A read-only Square token in Supabase secrets and the nightly pull from
   `docs/strategy/square-supabase-pull-2026-06.md`. Build it only once the Monday routine has
   proven which numbers matter. Day-shift: it touches the live Square account.

The five numbers on the Monday view: takings gross and net by category; cash counted; inputs
bought; wages for the week; fixed costs for the week (rent, outgoings, insurance, subs divided
by 4.33). Green means net takings exceed inputs plus wages plus the week's share of fixed.
The per-line sources are listed in `people-places-entities.ts` under WEEKLY_VIEW.

## 2. Events: make them easier by making them the same

The green week came from an event. The lesson is not "do more events", it is "make the next
one cost a fraction of the effort". Three packages, each a fixed shape:

| Package | Shape | Price unit | Who runs it | Tool |
|---|---|---|---|---|
| **Weekend rhythm** | Pizza Fri/Sat, sauna sessions, gate open. Same every week. | Per pizza, per sauna seat | Dennis (or successor) + steward | Square only. No tickets. Free RSVP optional. |
| **Ticketed night** | Themed dinner, producer showcase, film with food. One a month, cap 2 pre-sub-op. | Per seat, paid up front | Dennis + guest | One ticketing tool (below) |
| **Hire** | Venue hire, sauna hire, group bookings. Enquiry, quote, deposit. | Per day or per session | Ben/Nic quote, steward hosts | GHL enquiry form to Harvest Inbox pipeline, quote by email, deposit by Square invoice |

**The calendar tool decision.** Three candidates are already in the stack. Pick by what each
is for, not by features:

- **GHL** holds people and the enquiry pipeline. It already runs the Harvest Inbox. It is the
  wrong place to sell a ticket: GHL calendars and payments are built for appointments and
  service businesses, and every ticket sold there is a contact you have to re-tag by hand.
- **Mighty** is the inside room for members (decided 11 June 2026). It can take event RSVPs
  and, on Scale, charge for them. It is the most expensive plan to grow into, does not handle
  GST natively, and every buyer must be a Mighty member. Use it for member RSVP and nothing
  paid.
- **Humanitix** was already picked as the events-only tool in the 5 June 2026 platform decision
  and the Circle build sheet. It is
  GST-aware, Australian, free for free events, and the fees go to charity. It exports a CSV that
  a Monday sweep can push into GHL tags.

Recommendation: **Humanitix for anything ticketed, GHL for enquiries and hire, Square for the
door and the bar, Mighty for member RSVP only.** The public calendar is the site's What's On
(Supabase `harvest_events`, admin at `/admin/events` once the pending migration runs). One row
per event there; each row links out to the Humanitix page or the GHL form. That is four tools
but each has one job, and none of them duplicates another's data.

**The full calendar to December already exists**: the Notion Harvest Calendar under the
end-of-year hub (69 rows, September to December). Do not build a second one. The work is to
mark each row with its package (rhythm, ticketed, hire) and its tool, then mirror the public
rows into What's On.

## 3. Sauna booking

Sauna HQ in Notion has the mystery shop (comparable 24-hour hire $390 to $600, hosted 2 to 4
hours $850 to $900) and six open questions. The booking shape follows the package split above:

- **On-site sessions** during the weekend rhythm: sold as a Square item at the door, or as a
  Humanitix ticket if seats are capped and sell out. Start at the door; move to tickets only
  when a session sells out twice.
- **Off-site or private hire**: GHL enquiry form, quote, Square invoice deposit. Same as venue
  hire. Do not build a booking calendar for a product that has not yet had ten bookings.
- Treehouse Arts asked about Thursday and women's-only sessions and is waiting on a reply.
  Answer them before choosing a tool; they are the first hire customer.

Price, inclusions, and the safety and cleaning checklist are the decisions on the end-of-year
hub page. Insurance for a wood-fired sauna in public use is on the broker call sheet and is
still the number one risk on the ledger.

## 4. Café and artists in residence: sequence, do not parallel

The strategic plan says a sub-operator café signed by end October. The Simple Model says start
weekend day trade in September on the days people are already there. Both need the council food
posture in writing first, which is not done. Order it: council letter, then weekend day trade
under the current event-food posture if the letter allows it, then sub-operator by November
with the trade data in hand. A sub-operator will pay more for a café with eight weekends of
till data than for a promise.

Artists in residence is the Art Space's version of the sauna hire: an enquiry, a brief, a
licence, a date. It reuses the sub-operator licence skeleton in the local ops wiki. What it
needs is a one-page offer (space, duration, what The Harvest gives, what the artist gives back)
and a form into the Harvest Inbox pipeline. Money, if any, is a Square invoice. Do not open it
until the roster to December is set, because a resident on site needs a named host.

## 5. People on site: Joey, Susie, and the Farm

Joey moving in and working across Goods and The Harvest, and Susie renting at the Farm with
farm duties, are the same problem twice: one person, two projects, rent flowing one way and
pay the other. The rules that keep this simple:

1. **Rent is always a real number, paid, and booked as income** to whoever holds the dwelling.
   Joey's rent is Harvest income (or Harvest Pty's). Susie's is Farm income, never Harvest.
2. **Rent is never traded for work by handshake.** If the rent is below market because of duties,
   the difference is pay in kind. It goes on a payslip or it becomes an FBT bill (the June
   staffing brief put housing FBT near $30K a year if not neutralised) and a Fair Work problem.
3. **Each person carries one split, written down, reviewed quarterly.** Joey 60/40 Harvest/Goods,
   Susie 70/30 Harvest/Farm are placeholders in `people-places-entities.ts`. Ben and Nic set
   the real ones. The Goods share is recharged to Goods on Country's budget, not absorbed.
4. **Live-in plus set hours is employment**, whatever the contract says. Standard Ledger question
   before Joey's first night, with the landlord consent for a residential use in the same email.

On the money model: once Goods and Farm carry their shares, Harvest's people cost drops from the
$19,974 in `model.ts` to about $16,034 plus Trina's slice. That is not a saving. It is the same
cost moved to two projects that then have to afford it, which is exactly what the entity
structure is for.

## 6. One set of books: the entity map

Five entities exist or are planned. Only three touch Harvest money:

| Entity | Harvest role | Books |
|---|---|---|
| Nic sole trader | Trades Harvest today (interim decision 19 Jul 2026) | Everything, tracking option ACT-HV, until Harvest Pty is live |
| A Curious Tractor Pty Ltd, trading as Goods on Country | Goods share of Joey and Trina; shared services to Harvest | ACT-GD for Goods labour; a monthly services recharge to Harvest |
| The Harvest Pty Ltd (not yet registered) | Trading entity, lease, staff, Square, landlord minority shareholder | Own Xero file, own bank, same chart and tracking as ACT Pty |
| The Butterfly Movement Ltd | DGR home. Receipts gifts and grants Harvest programmes under a written agreement | Butterfly's file only |
| A Kind Tractor Ltd | None. Dormant, not DGR | Nothing. Leave it |

What makes bookkeeping simpler is not fewer entities, it is fewer paths. Every Harvest dollar
in goes through Square or a Square invoice. Every dollar out goes through Dext with a tracking
code. Staff are paid by the entity whose work they do, with one recharge journal a month for
the shared people. Donations go only to Butterfly. Standard Ledger then reads four files that
never overlap instead of one file where everything does.

Sequencing, unchanged from the ledger: insurance, then truth in the books (Square recode, payroll, COGS,
tracking), then price the facilities, then the entity, then membership.

## Decisions for Ben and Nic (everything above waits on these)

1. Does Dennis continue past the 1 September trial, and at what weekly rate.
2. Joey's rent per week, market rent for the dwelling, and the Harvest/Goods split.
3. Susie's rent at the Farm, what farm duties are, and the Harvest/Farm split.
4. The weekly rhythm (already decision 1 on the end-of-year hub). Events packaging depends on it.
5. Ticketing: Humanitix for paid events, or something else. One tool.
6. Sauna offer: on-site, hire, or both, and the price (hub decision 3; Treehouse Arts is waiting).
7. Café order: weekend day trade first, or wait for the sub-operator.
8. Two hours with the bookkeeper to switch food inputs to COGS, tag HARVEST, and start payroll.

## What runs without a decision

- Monday Square export routine (Ben, ten minutes) and the agent tie-out to Xero.
- Tag the 69 calendar rows with package and tool.
- Reply to Treehouse Arts.
- Draft the artist-in-residence one-pager from the sub-operator licence skeleton.
- Standard Ledger email: live-in employee, FBT neutralisation by market rent, recharge journal.
