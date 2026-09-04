# Can member visits be measured at all

Type: task
Status: open
Blocked by: —

## Question

Does Square identify customers on transactions, and can the six weeks of trading since
20 June be split member versus non-member?

Nothing to decide here. This is manual work that unblocks decisions, which is why it is a
task and not a grilling ticket.

## Why this blocks pricing

Ticket 03 settled that the paid tier carries real-marginal-cost perks. Ticket 03's asset
shows what those cost: **$4.72 to $7.86 per member visit** for 15% off plus a free coffee.
That figure only matters against **visit frequency**, because the break-even is expressed in
visits per year:

| annual fee | break-even visits/yr |
|---|---|
| $66 | 8 to 13 |
| $125 | 15 to 25 |
| $250 | 30 to 50 |

A weekly regular makes 52. So the price depends on how often members actually come, and
nobody has measured how often anyone comes.

If Square is not identifying customers, that number can never be recovered for the period
already trading, and every membership economics question stays permanently theoretical.
This is the instrument. Check it before designing anything that depends on a reading.

## The checklist

1. Does the Square account record a customer against transactions, or are sales anonymous?
2. Does the Members customer group exist? `member-model.md` records it as decided
   2026-06-18, with a note to confirm via a test sale per `launch-runbook.md` §2. Unknown
   whether that test sale ever happened.
3. Can a sales report be exported split by customer, for 20 June to date?
4. From that export: covers per session, average ticket, pizzas per cover, drink attach rate.

## What this also retires

Item 4 above is the single largest assumption in the whole financial model, not just the
membership question. `model.ts` currently runs on 25 / 40 / 60 covers a session, all
assumption, a swing of roughly $5,850/month between the Base and Good scenarios.

Note the `harvest_square_*` Supabase mirror scoped in
`docs/strategy/square-supabase-pull-2026-06.md` was never built (verified 2026-07-31: only
`harvest_businesses` and `harvest_events` exist). **The mirror is not needed for this.**
Square's own sales report answers all four questions. This is an export, not a build.

## Answer

<!-- record what was found: whether customers are identified, the four figures if available,
     and where the export was saved -->
