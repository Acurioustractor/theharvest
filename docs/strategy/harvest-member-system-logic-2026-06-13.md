# The Harvest member system: logic and money

Written 2026-06-13. This is the canonical logic for how membership, events, and payment fit together. Where it differs from earlier drafts on price, this wins.

## The model in one line

Free to join the community, pay per event to take part in the launch, then a $30 a week membership that includes events.

## Three layers of access

**1. Community, free to join.** GHL members get the welcome email, join the network for free, and land in the community: Start Here, What's On, Garden Crew, The Shop Makers, Offerings, Ask a Steward. Free join is deliberate. It is low friction, it gets the 80 in, and everyone can see what is on.

**2. Launch weekend, pay per event.** One-time payments, no subscription required. Friday is $10 to take part. The Saturday pizza night is $30. People join free, then pay once for what they want to come to. This is the low-commitment on-ramp.

**3. Membership, $30 a week.** A recurring subscription, built and opened after the weekend once people have tasted it. Members get events included and member-only spaces. You convert the warm attendees from the launch.

## Two money tracks

- **Supporters** pay per event, one-time, no commitment. This is your warm pipeline.
- **Members** pay $30 a week, recurring. Events are included, plus member-only spaces.

| | Free join | Supporter (per event) | Member ($30/wk) |
|---|---|---|---|
| See what's on, community spaces | yes | yes | yes |
| Attend a paid event | no | pays per event | included |
| Member-only spaces | no | no | yes |
| Commitment | none | none | recurring |

## How this maps to Mighty Networks

The key mechanic: in MN, money works through Plans that unlock Spaces, and events live inside Spaces. A Plan is either one-time or recurring. Payments run through Stripe on the web. You do not sell a ticket to a single event directly, you gate access with a Plan.

What that means for the build:

- **Free community spaces.** Start Here, What's On, Garden Crew, The Shop Makers, Offerings, Ask a Steward stay open to anyone who joins.
- **Friday, $10.** A one-time Plan that unlocks the Friday event. Because pricing attaches to a Space, the two paid events cannot share one price inside a single "Events" space. Friday needs its own gated access.
- **Saturday pizza night, $30.** A separate one-time Plan unlocking the Saturday evening event.
- **Membership, $30 a week.** A recurring Plan that unlocks the member spaces and includes events.

Fees come out of your payout, not added to the member's price. Budget about 3% Mighty Networks (on the Community plan; 2% on Business) plus roughly 2.9% Stripe. A $30 night nets you about $28. Avoid the iOS app for purchases, Apple takes 15%, so push people to pay on the web.

## Build checklist, in order

1. Connect Stripe in MN settings, set currency to AUD.
2. Check your MN plan tier and its transaction fee.
3. Create the Friday $10 one-time Plan and gate the Friday event with it.
4. Create the Saturday $30 one-time Plan and gate the pizza night with it.
5. Keep What's On open for free and member events.
6. Confirm the join flow: welcome email button to join free, then pay per event in the space.
7. After the weekend, create the $30 a week recurring membership Plan (events included, member spaces) and convert attendees.

## Why this works

Free join removes friction and gets people in. Cheap one-time events let them taste it without commitment. Once they have come, the recurring membership is an easy yes, because they have felt the value rather than been asked to buy it sight unseen. Supporters who pay per event are the pipeline that becomes members.

## Open item to confirm

Saturday daytime (the Grow, Make, Gather sessions and harvest lunch): is that free to come along, bundled into the $30 pizza night, or its own price? The locked prices cover Friday $10 and the Saturday pizza night $30 only. The copy currently treats the daytime as free to come along.

## Pricing reconciliation

This supersedes earlier drafts that said "first month free," "about $10 a week," and "Saturday daytime free for members." Locked: free join, Friday $10, Saturday pizza night $30, membership $30 a week with events included, no intro free month.
