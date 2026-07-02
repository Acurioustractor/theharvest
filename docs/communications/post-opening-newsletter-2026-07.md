# Post-opening newsletter: "The gate is open" (July 2026)

Send runbook for Harvest Note 04. Template is drafted by `scripts/draft-post-opening-newsletter-ghl.ts`. A human sends it via the GHL UI. Nothing in this runbook is automated end-to-end.

## Audience

GHL smart list:

- Tag is `comms:harvest-newsletter` OR legacy `harvest-newsletter` (one contact still carries only the legacy tag)
- AND email does NOT contain `benjamin+`
- AND email does NOT contain `@act.place`

Verified 2026-07-02: 147 contacts, 0 DND.

Never use:

- Bare `newsletter` (cross-location tag, pulls in non-Harvest contacts)
- `role:supplier` (Goods-only records)
- `interest:markets`

Counts drift. Re-run the audit on send day (step 1 below) and use the fresh number.

## Steps

1. **Send day, re-verify the audience.** Run `npm run audit:contacts:ghl` and confirm the smart-list count and 0 DND before anything else.
2. **Create the template (Tier 2).** Dry-run first: `npx tsx scripts/draft-post-opening-newsletter-ghl.ts` (prints the HTML, makes no API calls). Review the output, then run with `--apply` to create the template in GHL. This creates a template only; it does not pick an audience, send, or schedule.
3. **A human sends via the GHL UI (Tier 3, never automated).** Nic on the ground, or Ben remotely. In GHL: Marketing > Emails > Campaigns > new campaign from the "Harvest Note 04 - The gate is open" template > set the recipient filter to the smart list above > test-send to yourself and read it on a phone > schedule. Note: the sending domain is currently `hi@act.place`, so the email arrives from an ACT address unless the location sending domain is fixed first.

## Pre-send checklist

- [ ] Audience audit re-run on send day; count and 0 DND confirmed
- [ ] Facts gate: no attendance claims or headcounts anywhere in the email
- [ ] Facts gate: no opening hours, no fixed weekdays, no event dates
- [ ] Facts gate: no prices, no paid-tier mention, no shop stock or consignment detail
- [ ] Links resolve: https://www.theharvestwitta.com.au/membership and https://www.theharvestwitta.com.au/shop both load
- [ ] Unsubscribe footer present in the test-send
- [ ] Test-send received and read (desktop and phone) before scheduling
- [ ] Recipient filter is the smart list above, not a bare tag

## Body text (for review)

Subject: **The gate is open**

Preheader: The Harvest opened on 20 June. Here is what you can do there now, and what comes next.

> The gate opened on Saturday 20 June.
>
> Thank you to everyone who came and helped make the first day.
>
> The old nursery is still not arriving finished. That is still the point.
>
> From the first of July, The Harvest is properly under way.
>
> **What you can do there now**
>
> You do not need to book to come and have a look while we find our feet.
>
> If you want to be part of it, three doors are open.
>
> Join the members page. Upcoming events land there first, you can RSVP there, and you can message us directly.
>
> Come to a work day. The garden grows through regular work days, and an extra pair of hands changes what a day can do. Reply to this email and we will tell you when the next one is.
>
> Put your hand up for the shop. The first shelves are being shaped with local makers and growers. If you make or grow something, tell us and we will have a proper conversation.
>
> **What comes next**
>
> Small first moves, in the open: more work days, the first shelves in the shop, the art space finding its shape, more shared meals.
>
> Members hear first, every time. When the next date lands, it lands on the members page before anywhere else.
>
> Susie and Joey are stewarding the place day to day. Say hello when you visit.
>
> Questions? Reply to this email. We read everything, and replies can take a few days while we find our feet.
>
> The Harvest is a community garden and creative gathering place in Witta, on Jinibara Country.
>
> It becomes real as people walk through it and make it with us.

Buttons: "Become a member" -> https://www.theharvestwitta.com.au/membership · "The shop" -> https://www.theharvestwitta.com.au/shop
