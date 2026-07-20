# SEO and GHL visibility next actions

Date: 2026-07-08
Site: https://www.theharvestwitta.com.au
Scope: Google visibility, Google Business Profile, GoHighLevel follow-through.

## Verified today

- Production site is live on Vercel deployment `dpl_3ckSN1jQg1LGd4JcJrQSUPRTTdiW`.
- Vercel project setting now reports `Node.js Version 24.x` (`vercel project inspect the-harvest`; Vercel API `nodeVersion: "24.x"`).
- `/witta-pizza` returns `200`.
- `sitemap.xml` includes `/witta-pizza`.
- `/gather` redirects to `/whats-on`.
- `/photo-wall` redirects to `/whats-on`.
- The live bundle contains the `/witta-pizza` route, "DIY pizza in Witta", "Witta pizza weekends", `FoodEstablishment`, and `9 Gumland Drive`.
- `robots.txt` points Google to `https://www.theharvestwitta.com.au/sitemap.xml`.
- Public search sampling shows the home page for `The Harvest Witta`, but old `/gather` and `/photo-wall` results are still visible in public results. That means Google still needs to recrawl the redirects.
- Public search sampling did not surface a clear Google Business Profile for **The Harvest Witta**. It did surface legacy Green Harvest / 9 Gumland Drive results, so the GBP claim/category/address check matters.
- `npm run report:launch-gates:ghl` showed three booking-tag workflow blockers before cleanup. On 2026-07-08, the two June 20 calendar workflows are now historical unless those old calendars are reused. The live visibility blocker is `Harvest - Shop Chat Booked (tag)`.
- `npm run audit:contacts:ghl` baseline: 3,276 contacts scanned, 353 Harvest contacts, 213 `comms:harvest-newsletter`, 194 `tier:member`, 129 `interest:markets`, 2 `rsvp-pizza-dinner`, 0 `shop-call-booked`.
- `npm run desk:ghl` baseline: 17 reply-needed cards today. Many are form-sweep tests and should be cleaned from the desk after the real cards are handled.

## What is still unknown

- True Google ranking is unknown until Search Console is checked.
- Google has not necessarily recrawled the new sitemap yet.
- Google Business Profile existence/claim state, completeness, category, hours, photos, reviews, and post cadence have not been verified in the GBP UI.
- GHL workflow internals cannot be proven by API. The UI action graph still needs direct inspection and one real test for any workflow we keep live.

## The GHL visibility loop

Use GHL for execution, not thinking.

```text
Search / GBP sends attention -> website gets the click -> GHL captures the person -> workflow replies -> pipeline/task makes a human follow up -> GBP/GHL posts show the next real thing.
```

Feature map:

| GHL feature | Job |
| --- | --- |
| Workflows | Tag booking and form signals, send receipts, never silently subscribe people. |
| Calendars | Turn "come in / talk shop" into bookable actions. |
| Opportunities | Give Susie, Joey, Ben and Nic one board for follow-up. |
| Conversations | Reply from one place instead of chasing email, Facebook and forms separately. |
| Smart lists | Segment people by real intent: makers, members, visitors, pizza RSVPs. |
| Social Planner + GBP posts | Publish the weekly "what is actually happening" signal. |
| Reputation / review requests | Ask only real visitors for honest Google reviews. |

Do not build the GHL Membership/Community portal. Membership is still a list plus real-world belonging.

## Do next, in order

### 1. Search Console recrawl

In Google Search Console:

1. Submit or resubmit `https://www.theharvestwitta.com.au/sitemap.xml`.
2. URL Inspection, then Request Indexing for:
   - `https://www.theharvestwitta.com.au/`
   - `https://www.theharvestwitta.com.au/witta-pizza`
   - `https://www.theharvestwitta.com.au/whats-on`
3. URL Inspection for retired pages, check that Google sees the redirect:
   - `https://www.theharvestwitta.com.au/gather`
   - `https://www.theharvestwitta.com.au/photo-wall`

Source: Google says Search Console can submit sitemaps and inspect URLs, and URL Inspection can request a crawl for individual URLs. Request indexing only for the few important URLs. Repeating the same URL does not make Google crawl faster.

References:

- https://search.google.com/search-console/about
- https://support.google.com/webmasters/answer/9012289
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl

### 2. Fix the live GHL booking workflow

Current `npm run report:launch-gates:ghl` result:

- Historical watch: `Harvest - RSVP Maker Session (tag)` is missing. It only matters if the June 20 maker calendar is reused.
- Historical watch: `Harvest - RSVP Pizza Dinner (tag)` exists, but is draft `v2`. It only matters if the June 20 afternoon/pizza calendar is reused.
- Live blocker: `Harvest - Shop Chat Booked (tag)` is missing.
- Published: `Harvest - Shop Interest Receipt` is OK.

Build this in GHL:

1. `Harvest - Shop Chat Booked (tag)`
   - Trigger: Customer Booked Appointment.
   - Filter: calendar `Book a chat about the shop`, ID `viM1BRnHG9gwpIEZd4HM`.
   - Add tags: `project:act-hv`, `interest:markets`, `shop-call-booked`.
   - Re-entry on.
   - Publish, test one booking, remove test data.

Only build these if the old June 20 calendars are reused:

1. `Harvest - RSVP Maker Session (tag)`
   - Trigger: Customer Booked Appointment.
   - Filter: calendar `RSVP: Maker session, Sat 20 June`, ID `M0KzSu7Bo3jJ3ZQta3ag`.
   - Add tags: `witta-gathering-2026-06-20`, `rsvp-maker-morning`.
   - Re-entry off.
   - Publish, test one booking, remove test data.

2. `Harvest - RSVP Pizza Dinner (tag)`
   - Open existing draft.
   - Trigger: Customer Booked Appointment.
   - Filter: calendar `RSVP: Afternoon + pizza, Sat 20 June`, ID `4IpU9GnzAChTMkKFJPWi`.
   - Add tags: `witta-gathering-2026-06-20`, `rsvp-pizza-dinner`.
   - Re-entry off.
   - Publish, test one booking, remove test data.

Acceptance check after UI work:

```bash
npm run report:launch-gates:ghl
```

Expected result: the shop-chat workflow blocker disappears. The June 20 calendar workflows may remain as watch items unless the calendars are reused.

### 3. Clean the shop visibility path

Current state:

- `interest:markets`: 129 contacts.
- `shop-call-booked`: 0 contacts.
- `shop-follow-up`: 5 contacts.
- Shop chat calendar exists and is assigned to Suzie and Joey.

Next GHL UI actions:

1. Confirm Suzie/Joey permissions stay limited to the useful operator set: Conversations, Opportunities, Calendars, Contacts.
2. Connect their Google Calendars if not already connected.
3. Publish and test `Harvest - Shop Chat Booked (tag)`.
4. Create a smart list: tag `interest:markets`, exclude `shop-call-booked`, sort newest first. This is the "shop interest, not booked yet" call-down list.
5. In the Shop pipeline, work left to right: New interest -> In conversation -> Sampling / trial shelf -> On the shelf / Parked.

This matters for visibility because "shop interest" is already in the CRM, but the booked-call signal is not being captured. Visibility without follow-through turns into a pile of names.

### 4. Connect and complete Google Business Profile inside GHL

In GHL:

1. Go to Listings and connect Google Business Profile and Facebook Page.
2. Check whether **The Harvest Witta** already exists as a claimable profile. If Google only shows the older Green Harvest entity at 9 Gumland Drive, do not edit that profile into The Harvest. Create/claim a separate truthful Harvest profile instead.
3. Check the Google profile score/completeness.
3. Confirm these are accurate:
   - Name: The Harvest Witta.
   - Website: `https://www.theharvestwitta.com.au/`.
   - Address: 9 Gumland Drive, Witta.
   - Phone: the public Harvest phone.
   - Hours: only publish hours that are genuinely true.
   - Photos: real Harvest photos, not generated concept images.
4. Category caution: use the closest truthful primary category, likely community garden if available. Do not choose "pizza restaurant" unless the operating model, food setup, and public expectation support it.
5. Add a service/product for DIY pizza only if the GBP UI supports it cleanly and the copy stays true.

HighLevel references:

- GBP optimization in HighLevel: https://help.gohighlevel.com/support/solutions/articles/155000005837-easily-optimize-your-google-business-profile-in-highlevel
- GBP and Facebook integration with Listings: https://help.gohighlevel.com/support/solutions/articles/155000004144-google-business-profile-and-facebook-integration-with-listings

### 5. Start the weekly GBP post loop

Use GHL Social Planner and the GBP Post Scheduler.

Weekly rhythm:

- Tuesday or Wednesday: one Google Business Profile post for the coming weekend.
- Saturday or Sunday: one photo recap post if there is a real photo and consent is clean.
- Monday: check Social Planner statistics and note what got reach, clicks, or replies.

Post shape:

```text
[Concrete first line.]

[One real detail from the week.]

[One clear invitation.]

Link: https://www.theharvestwitta.com.au/witta-pizza
```

First GBP post draft:

```text
DIY pizza is now easier to find.

The Harvest is at 9 Gumland Drive in Witta. Come through for weekend DIY pizza, garden paths, and a place that is still being made by local hands.

Dates can move week to week, so check the members page before you drive.
```

Second GBP post draft:

```text
The oven is not the whole story.

There is a garden taking shape, a milk-crate pavilion, and a long table slowly learning what it can hold.

Weekend DIY pizza details are here:
https://www.theharvestwitta.com.au/witta-pizza
```

HighLevel references:

- GBP Post Scheduler: https://help.gohighlevel.com/support/solutions/articles/155000007212-google-business-profile-gbp-post-scheduler-in-highlevel
- Social Planner analytics: https://help.gohighlevel.com/support/solutions/articles/155000004101-social-planner-track-social-performance-using-advance-analytics
- Social Planner setup: https://help.gohighlevel.com/support/solutions/articles/155000005063-getting-started-setup-social-planner

### 6. Ask for reviews after real visits

Do not blast old contacts. Ask people who actually came, ate, booked, or helped.

GHL setup:

1. Reputation > Settings > Integrations, connect Google review platform.
2. Reputation > Settings > Review Link, make Google the default review destination if it is the only live platform.
3. Create a simple post-visit review request for real attendees.
4. Keep the copy human:

```text
Thanks for coming through The Harvest.

If the visit was useful, a short Google review helps locals find us.

No need to write an essay. One honest line is enough.
```

HighLevel references:

- Send review requests: https://help.gohighlevel.com/support/solutions/articles/48001222668-how-to-send-review-requests
- Customize review request messages: https://help.gohighlevel.com/support/solutions/articles/48000980328-how-to-customize-the-review-request-messages-sms-email-
- Review platform integrations: https://help.gohighlevel.com/support/solutions/articles/155000004584-integrating-multiple-review-platforms-to-manage-and-monitor-reviews

## Weekly visibility scorecard

Run:

```bash
npm run report:visibility
```

Every Monday, record:

- Search Console: top queries, clicks, impressions, average position for `the harvest witta`, `witta pizza`, `witta community garden`, `witta events`.
- Search Console: page performance for `/witta-pizza`, `/whats-on`, `/membership`.
- Google Business Profile: calls, website clicks, directions, profile views, posts published.
- GHL Social Planner: GBP post reach, clicks, comments.
- GHL tags: `interest:markets`, `shop-call-booked`, `rsvp-pizza-dinner`, `comms:harvest-newsletter`, `tier:member`.
- GHL desk: reply-needed cards.

Current GHL counts to baseline:

- Harvest contacts: 353.
- `comms:harvest-newsletter`: 213.
- `tier:member`: 194.
- `interest:markets`: 129.
- `shop-call-booked`: 0.
- `rsvp-pizza-dinner`: 2.
- Reply queue: 17 cards, many are form-sweep tests and can be cleaned.

## What to clean from GHL after the workflow fixes

Do not clean first; clean after the shop-chat workflow is built/tested so the evidence is fresh.

1. Remove or resolve the form-sweep test opportunity cards in Harvest Inbox.
2. Remove the test contact/card created during the shop-chat workflow test.
3. Re-run:

```bash
npm run report:launch-gates:ghl
npm run audit:contacts:ghl
npm run desk:ghl
```

Done state:

- Live booking workflow blocker gone.
- `shop-call-booked` has at least one test count during verification, then returns to the real count after cleanup.
- Reply queue no longer mixes real replies with form-sweep test cards.

## Decision

The website now has the right front door for Witta pizza. The next move is not another page.

The next move is:

```text
Search Console recrawl -> GHL booking workflow fixes -> GBP connected and posting weekly -> review requests after real visits.
```

That is the visibility loop.
