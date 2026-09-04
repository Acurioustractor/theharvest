# Where the money lands

Type: grilling
Status: open
Blocked by: 07

## Question

Which entity receives subscription revenue, and what does that mean for GST, accounting and
the cutover?

Harvest currently trades through Nicholas Marchesi's sole trader (ABN 21 591 780 066) and its
existing Xero tenant, tracked as ACT-HV, until the move to A Curious Tractor Pty Ltd. A
recurring revenue stream started now will straddle that boundary.

Press on:
- Sole trader now, or wait for the Pty? What breaks if subscriptions start on the sole trader
  and have to migrate mid-stream — payment methods, mandates, member trust?
- GST: is membership taxable, and is the price inclusive? A price set without this is a price
  that changes later, in public.
- Does any part of this touch Butterfly and the DGR endorsement? Membership is not a donation,
  and conflating them would be a serious error. Confirm the separation explicitly.
- What does Standard Ledger need to see before this starts?
- Does a recurring obligation to members change anything in the lease or the operating model?

## Context from resolved tickets

From [AU recurring billing](02-au-recurring-billing-platforms.md): this ticket is now a hard
prerequisite for the platform choice, not a parallel concern. Because there is no separate
Harvest GHL location, a payment connection would sit on the shared ACT location during the
sole-trader to Pty cutover. Settle the entity before wiring any biller, and raise the shared
location explicitly with Standard Ledger.
