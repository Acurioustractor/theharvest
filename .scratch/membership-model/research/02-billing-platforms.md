# AU recurring billing platforms for Harvest membership

Ticket: `.scratch/membership-model/issues/02-au-recurring-billing-platforms.md`
Researched: 2026-07-29. All URLs accessed 2026-07-29.
Author note on confidence: every claim below is tagged **Verified** (I read the provider page
myself today), **Inferred** (reasoned from provider docs or strong secondary sources, not
directly confirmed) or **Unverified** (needs a direct check before anyone relies on it).

## Short answer

Take the money with **Stripe**, present it through whatever front door is convenient, and use
**Square's customer directory** for the in-person "is this person a member" question at the
sauna door and the POS. Do not move the 188 free Mighty members anywhere until there is a paid
thing to move them to. Mighty Networks is the most expensive way to charge and the hardest to
reverse; GoHighLevel is the cheapest to add but sits on a shared account-wide location, which
is a real operational hazard, not a theoretical one.

---

## Platform by platform

### 1. Stripe (direct): the baseline

**AUD recurring:** yes, natively. Subscriptions, trials, pauses, proration, dunning on failed
cards, and a hosted customer portal members can use to update a card or cancel without anyone
at Harvest touching it. (Inferred from long-standing Stripe Billing docs; the portal is the
part worth confirming is enabled on the account.)

**GST:** Stripe's AU pricing page states plainly that card fees "include GST" and that PayTo /
BECS Direct Debit fees include GST (Verified, stripe.com/au/pricing). For charging GST to
members, Stripe Tax can calculate and show GST on invoices and subscriptions
(Verified that the product does this per Stripe docs; Unverified whether the AU tax-inclusive
display behaves the way an accountant wants without configuration). Stripe Tax is priced
separately, listed on the AU pricing page as a per-transaction charge in jurisdictions where
you are registered (Verified that it is separately priced; I did not pin the exact AU rate, so
treat "0.5% per transaction" as **Unverified** and check with Stripe).

**Fees (Verified, stripe.com/au/pricing, 2026-07-29):**
- Domestic cards: **1.7% + A$0.30**, GST included.
- AU BECS Direct Debit / PayTo: **1.5%**, GST included. (Whether a cap applies is Unverified.)
- Stripe Billing: a percentage of billing volume on top. Public secondary sources put the
  current pay-as-you-go Billing rate at **0.7% of billing volume**, replacing the older 0.5%
  Starter / 0.8% Scale split. I could not read this off Stripe's AU Billing page today (the
  page is JS-rendered), so **treat 0.7% as Unverified and confirm before budgeting.**
- No monthly floor on payments. No lock-in contract.

**Tiers:** unlimited price points, monthly or annual, concession prices, pause collection,
cancel at period end, and free-to-paid upgrade is just creating a subscription against an
existing customer record. Household or multi-seat is possible via quantity on a subscription,
but "who are the two people in this household" is not something Stripe models. That is on
whatever holds the member list.

**Mighty migration:** Stripe does not touch the Mighty list. The 188 stay where they are; you
would export them and hold the list in GHL. Card details cannot be pulled out of Mighty by
Harvest, but there is nothing to pull, since the 188 are free members with no card on file.
That is the good news: **there is no payment migration problem, only a list problem.**

**GHL sync:** not native. Stripe webhooks to a small endpoint that sets or clears a GHL tag.
Honest estimate: half a day to a day of build for a competent developer, plus ongoing
ownership. That is not free, and it is one more thing that can silently break while Ben is
overseas.

**In-person identification:** none. Stripe has no staff-facing lookup app. This is Stripe's
single biggest weakness for the sauna door.

**Dealbreakers:** none found. AU available, sole traders with an ABN can hold a Stripe account
(**Inferred**, high confidence, worth a five-minute check at signup). Payout timing on AU
accounts is a rolling schedule of a couple of business days after an initial hold; exact
timing is **Unverified**.

---

### 2. Square: already in the building

**AUD recurring:** yes, two ways. Square Subscriptions (subscription plans attached to items,
sold through Square Online) and recurring invoices with Card on File. Both documented on
Square's AU help site (Verified, squareup.com/help/au/en/article/5096 and /article/7627).
Recurring invoicing requires one-time cardholder consent to store and charge the card
(Verified).

**GST:** Square AU handles tax-inclusive pricing and shows tax on invoices, and the dashboard
issues monthly GST invoices for Square's own fees (Verified: the AU fees help article has a
section on viewing "monthly GST invoices"). Reporting is exportable from the dashboard. This
is the most accountant-friendly of the options because the POS and the memberships would sit
in one ledger.

**Fees (Verified, squareup.com/au/en/payments/our-fees, 2026-07-29):**
- In person: **1.6%** per transaction (applies to sellers who signed up on or after
  30 May 2024; earlier sellers pay 1.9% unless on a paid plan that carries 1.6%).
- Card-not-present, which includes Square Online, invoices, virtual terminal and card on file:
  **2.2%** per transaction. **A recurring membership charge is card-not-present, so membership
  costs 2.2%, not 1.6%.**
- Afterpay 6% + 30c excl GST.
- No monthly floor on the free POS plan. Paid plans exist (Square Online Plus and Premium; the
  AU dollar figures I saw were secondary sources, so treat the exact plan prices as
  **Unverified**). Fees are deducted per transaction before payout, not billed monthly
  (Verified).

**Tiers:** multiple plans are fine. Concessions are just another plan. Pauses and cancellations
exist on Square Subscriptions but the granularity is thinner than Stripe's
(**Unverified** in detail). Household or multi-seat: not modelled. Free-to-paid upgrade is
manual, since the free 188 are not in Square.

**Mighty migration:** same as Stripe. No payment data to move; the list would be exported and
held elsewhere.

**GHL sync:** not native. Square webhooks plus a small endpoint, or Zapier. Roughly the same
build burden as Stripe. **Inferred.**

**In-person identification: this is Square's advantage.** The customer directory is searchable
from the Square POS app on a phone or terminal, so a volunteer at the sauna door can look up a
name without a laptop. Square Loyalty could also carry a member flag. I have **not verified**
that a Square subscription status is visible on the customer profile in the POS app, and that
is the one thing to test in a live account before committing. Fallback that definitely works:
a member group or a loyalty enrolment, maintained by whatever system is the source of truth.

**Dealbreakers:** none. Already live, sole trader eligible (the account already exists), AU
entity Square AU Pty Ltd ABN 38 167 106 176 (Verified from the fees page footer). Payout
timing: **Unverified**, commonly next business day in AU.

---

### 3. GoHighLevel: already the CRM

**AUD recurring:** yes, through a connected Stripe account. GHL is not a processor; it is a
front end on Stripe. AU-specific support includes Stripe BECS Direct Debit (Inferred from
GHL's own changelog and AU-focused secondary sources; **Unverified** on GHL's official docs).

**GST:** weak. GHL invoicing has tax settings, but I found no clear documentation that it
produces AU-compliant tax invoices and BAS-ready reporting to the standard an accountant
expects. **Unverified and the main thing to test.** In practice you would rely on Stripe's
records rather than GHL's.

**Fees:** GHL adds no transaction fee of its own on top of Stripe for a normal sub-account;
you pay Stripe's rates (Inferred from multiple secondary sources; **Unverified** against
HighLevel's own pricing page). The agency plan is already being paid for, so the marginal
platform cost is zero.

**Tiers, upgrades, automations:** this is where GHL is strong. Tags, workflows, membership
areas, and the free-to-paid path all live in one place, and the 188 are already reachable
there. No glue needed for the CRM side, because the CRM *is* the billing front door.

**The hazard, and it is specific to this org:** there is no separate Harvest location. Harvest
is the `harvest-website` tag subset on a shared account-wide location. Membership products,
payment settings and workflows built in that location are visible to and editable by everyone
else using the same location, and a Stripe connection is per-location. Connecting a
Harvest-revenue Stripe account to a shared ACT location mixes two entities' money in one
settings screen at exactly the moment the sole-trader-to-Pty-Ltd cutover is happening. That is
an accounting and governance problem before it is a technical one. **Verified from the
project's own standing facts, not from GHL.**

**In-person identification:** the GHL mobile app (LeadConnector) lets staff search contacts and
see tags on a phone. That is a workable door check, and it needs no extra build.
**Inferred**, worth a two-minute test on Ben's phone.

**Dealbreakers:** the shared location. Also, GHL's subscription management surface for members
themselves (change card, cancel) is thinner than Stripe's customer portal. **Unverified.**

---

### 4. Mighty Networks: where the 188 already are

**AUD recurring:** yes. Plans can be sold in up to 10 currencies, and the currencies available
depend on the country of your connected Stripe account (Verified, faq.mightynetworks.com
article 9140670). An AU Stripe account can present and settle AUD (Inferred).

**GST:** Mighty does not handle it natively. Their own help article states the host is
responsible for taxes, and tax calculation and compliant invoicing runs through **Quaderno**,
which is a separate product you must buy and connect yourself (Verified,
faq.mightynetworks.com article 9140680). So GST-correct invoicing on Mighty costs a third
subscription on top of the platform fee and Stripe's fee.

**Fees (Verified as to structure, from mightynetworks.com/pricing and consistent secondary
sources; exact dollar figures are USD and drift, so treat them as indicative):**
- Plans around US$79/mo (Launch), US$179/mo (Scale), US$354/mo (Growth).
- A **platform transaction fee on top of Stripe**: 2% on Launch, 1% on Scale, 0.5% on Growth.
  The fee never reaches zero.
- So a paid membership on Mighty costs roughly Stripe's 1.7% + 30c, **plus** 0.5 to 2% to
  Mighty, **plus** a USD monthly floor, **plus** Quaderno if you want GST done properly. It is
  comfortably the most expensive option, and it is billed in USD, so the cost moves with the
  exchange rate.

**Tiers:** multiple plans, one-off or recurring, free-to-paid upgrade inside the same space.
Genuinely good at the upgrade path, because the 188 are already there. Household or multi-seat:
not modelled (**Unverified**).

**Migration, the important part:** the 188 are free members with no payment method stored. If
paid billing goes elsewhere, nothing breaks financially, but the **identity of the list
fractures**: Mighty holds the community activity, GHL holds the CRM record, and the billing
system holds the money. Three places, three copies of "who is a member". Whatever is decided,
one system must be named the source of truth for membership state, and the other two must be
downstream of it. My recommendation is GHL as source of truth, because it already is.

**GHL sync:** no native integration found. Zapier or webhooks. **Unverified** whether Mighty
fires the events you would need.

**In-person identification:** the Mighty app is member-facing, not staff-facing. A volunteer
would be searching a member app, not a door-check tool. Weak.

**Dealbreakers:** USD monthly floor for an organisation running a planned Year-One loss of
about $20K; a permanent transaction fee that funds someone else's platform; and the tax work
pushed onto a third product. Not a dealbreaker but worth naming: monthly plans avoid lock-in,
annual plans do not. **Unverified** on current cancellation terms.

---

### 5. Others genuinely worth a look

**Member Jungle** (Australian, built for clubs and associations). Membership records,
renewals, a member app with a digital card, events, AU-hosted data. Pricing runs roughly
A$109 to A$799 per month **plus GST**, and their payment gateway page quotes AU domestic card
payments at **2.7% + 99c** (Verified from memberjungle.com/pricing and /gatewayfees via search
snippets; I did not render the pages directly, so treat the exact figures as **Inferred**).
Verdict: the right shape of product and the wrong size of bill for 188 people, most of whom pay
nothing. Revisit if paid membership passes a few hundred.

**GoCardless AU / Ezidebit** (bank direct debit, gym-style). Cheaper than cards at volume and
much better at not failing every time a card expires. Both add a contract and a setup process,
and neither gives you a door-check app. Not worth it below a few hundred paying members.
**Inferred**, no pricing verified today.

**Not recommended and why:** Patreon and similar creator platforms (wrong framing for a place
you physically walk into, and USD-centric). Xero repeating invoices (works, but a member
chasing an emailed invoice each month is worse than a card on file).

---

## Comparison

| | Stripe direct | Square | GoHighLevel | Mighty Networks | Member Jungle |
|---|---|---|---|---|---|
| AUD recurring | Yes | Yes | Yes (via Stripe) | Yes (via Stripe) | Yes |
| Processing fee | 1.7% + 30c incl GST | 2.2% CNP, 1.6% in person | Stripe's rates | Stripe's rates | ~2.7% + 99c (inferred) |
| Platform fee | Billing % (~0.7%, unverified) | Nil on free plan | Nil extra (inferred) | 0.5-2% + US$79+/mo | A$109-799/mo + GST |
| GST handling | Good, Stripe Tax priced separately | Good, one ledger with POS | Weak / unverified | Needs Quaderno, extra cost | Built for AU |
| Tiers, pauses, concessions | Best | Adequate | Good | Good | Good |
| Free-to-paid path for the 188 | Manual | Manual | Native, they are already there | Native, they are already there | Manual |
| Reaches GHL | Webhook, ~1 day build | Webhook or Zapier | It is GHL | Zapier, unverified | Unverified |
| Door check without a laptop | None | Best, POS directory on a phone | Good, LeadConnector app | Weak | Member app with digital card |
| Sole trader eligible | Yes (inferred) | Yes, account exists | n/a | n/a | Inferred |
| Reversibility | High | High | Medium, shared location | Low, community lives there | Low |

---

## Recommendation

**Take payments with Stripe, run the member list in GHL, check members in person with Square.**

Reasoning:
1. Stripe is the processor underneath GHL, Mighty and Member Jungle anyway. Going direct
   removes one margin and one dependency without losing anything except a front end.
2. Its fee is the lowest all-in for card-not-present recurring, and the AU price includes GST,
   which is one less reconciliation argument.
3. It is the only option with a real member-facing self-service portal, which matters more than
   anything else on this list when Ben is out of the country from 27 June to 15 August.
4. Square stays where it is, doing what it already does, and earns its keep as the door check.
5. GHL keeps holding the truth about who is a member, so the 188 never fracture.

**Least regret option.** If the model is still uncertain, start with **Square recurring
invoices with card on file**, not a built integration. It uses an account that already exists,
needs no code, produces GST-correct records in the same ledger as the POS, costs 2.2%, and can
be switched off one member at a time. The extra 0.5% over Stripe on, say, 30 members at $25 a
month is around $4 a month. That is a trivially cheap option to be wrong about. Move to Stripe
proper once the tier structure is locked and the numbers justify a build.

**What I would not do.** Do not turn on paid plans inside Mighty Networks. It adds a USD
monthly floor and a permanent cut to an organisation already planning a $20K loss, pushes GST
onto a fourth product, and it is the hardest thing on this list to walk back, because the
community itself becomes the hostage.

**Do not connect a Harvest revenue Stripe account to the shared ACT GHL location** until
someone has decided which entity receives the money. Payment settings are per-location and the
location is not Harvest's alone. Raise this with the accountant before, not after.

**Who operates it while Ben is away.** Square is the only one a non-technical person can be
handed with a straight face: it is the app they already use, the lookup is a search box, and
issuing or cancelling a recurring invoice is a couple of taps. A Stripe dashboard plus a
webhook is a developer's tool. If continuity during the overseas window is the binding
constraint, that alone argues for starting on Square.

---

## What to check directly before committing

1. Stripe's current AU Billing rate and Stripe Tax's AU per-transaction charge. Confirm with
   Stripe sales or the logged-in dashboard, not the marketing page.
2. Whether a Square subscription or recurring invoice status shows on the customer profile
   inside the Square POS app, so a volunteer can see it at the door.
3. Whether GHL produces an AU-compliant tax invoice, and what Standard Ledger will accept.
4. Payout timing for both Square AU and Stripe AU on this specific account.
5. Which entity, sole trader or Pty Ltd, receives subscription revenue. Everything above is
   downstream of that answer.
6. Whether household or multi-seat membership is actually wanted. If it is, none of these model
   it natively and it becomes a GHL data-modelling job.

## Drift warning

Payment pricing changes with little notice. Square's 1.6% in-person rate already depends on
whether you signed up before or after 30 May 2024. Stripe restructured Billing pricing in 2024.
Mighty prices in USD. Re-verify anything in this document that is more than about three months
old before it goes into a budget.

## Sources

- Square AU fees, https://squareup.com/au/en/payments/our-fees (accessed 2026-07-29)
- Square AU fee schedule help article, https://squareup.com/help/au/en/article/5068-what-are-square-s-fees (2026-07-29)
- Square AU recurring payments, https://squareup.com/help/au/en/article/5096-process-recurring-or-subscription-payments (2026-07-29)
- Square AU subscription plans, https://squareup.com/help/au/en/article/7627-get-started-with-subscriptions-in-dashboard (2026-07-29)
- Stripe AU pricing, https://stripe.com/au/pricing (2026-07-29)
- Stripe Billing pricing, https://stripe.com/billing/pricing (2026-07-29, JS-rendered, figures not directly read)
- Mighty Networks pricing, https://www.mightynetworks.com/pricing (2026-07-29)
- Mighty Networks currencies, https://faq.mightynetworks.com/en/articles/9140670-what-currencies-can-i-charge-in-on-mighty-networks (2026-07-29)
- Mighty Networks taxes, https://faq.mightynetworks.com/en/articles/9140680-how-do-taxes-work-with-my-mighty-network (2026-07-29)
- Member Jungle pricing, https://www.memberjungle.com/pricing and https://www.memberjungle.com/gatewayfees (2026-07-29, via search snippets)
- HighLevel changelog, Stripe payment methods for AU, https://ideas.gohighlevel.com/changelog/new-stripe-payment-methods-enabled-for-uk-australia-malaysia-and-us (2026-07-29)
