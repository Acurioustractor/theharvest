# Social posts capture, all channels, 6 July 2026

What has actually been posted, across every channel, pulled on 2026-07-06. Three sources:
GHL Social Planner (via `npx tsx scripts/report-ghl-social.ts`, live API), the public
Facebook page, and the public Instagram profile (both read logged-out on 2026-07-06, so
Facebook only shows back to 20 June; the 2 May to 20 June window on Facebook is
unverified until someone does a logged-in pull or we add Meta API access).

## The accounts (verified live)

| Channel | Handle / URL | Followers | Status |
| --- | --- | --- | --- |
| Facebook | `facebook.com/profile.php?id=61587776558599` ("The Harvest Witta") | 548 | Active, posting directly |
| Instagram | `instagram.com/theharvestwitta` ("Witta Harvest") | 109, 19 posts | Active as of 1 July |
| Facebook vanity | `facebook.com/theharvestwitta` | n/a | DEAD. Linked from GardenLaunch.tsx |
| Instagram alt | `instagram.com/the.harvest.witta` | n/a | DOES NOT EXIST. Linked from GardenLaunch.tsx |

Stale profile copy (both bios): "Three zones - Garden, Kitchen, Art Space" is the
pre-May brand line; current line is garden, events and art space. Facebook also claims
"Always open" hours, lists category "Performance and event venue, Community garden,
Museum", and shows benjamin@act.place as the public contact. Instagram category is
"Restaurant".

## Timeline of everything posted

### Through GHL Social Planner (15 posts total, all 27 Apr to 8 May)

| Date | Post | Channels | Status |
| --- | --- | --- | --- |
| 27 Apr | Did everyone see the milk crate art on the weekend? | IG + FB | Published |
| 29 Apr | The garden is starting to show itself (reel + photo post) | IG + FB | Published |
| 30 Apr | Quick local ask | FB | Failed (GHL/Facebook error), never retried |
| 1 May | You can start to feel the change from the road now | FB | Published |
| 2 May | Garden question for local brains (mesh arches) | FB | Published |
| 29 Apr drafts | Planting day; The next useful job is care; Small signs; Room to move; What changed this week | mixed | Still draft, never published |
| 8 May | Sophie story (three Sophie photos) | IG + FB | Still draft. CONSENT FLAG: post-crisis decision removed Sophie's images from public surfaces; this draft predates that and should be reviewed or killed |

### Posted directly on Facebook (visible logged-out, 20 Jun onward)

| Date | Post | Engagement |
| --- | --- | --- |
| 20 Jun 12:18 | Long Way Home playing live after 5pm tonight | 14 reactions |
| 22 Jun 06:08 | "Thanks so much to everyone who came along for the opening night" with 12+ photos | 89 reactions, 8 comments |
| 22 Jun 06:42 | Cover photo updated | 9 reactions |
| 25 Jun 10:09 | DIY PIZZA WEEKEND at The Harvest (Sat + Sun) | 13 reactions |
| 27 Jun 07:55 | Pizza, fresh produce from the garden and community connection tonight from 4pm | 21 reactions |
| ~3 Jul | "Hey Friends" weekend rundown (full text below) | 30 reactions |
| ~3 Jul | Reel: A little update from the Harvest - DIY Pizza Friday, Saturday, Sunday this week | 61 reactions, 9 shares |

### Posted directly on Instagram

Instagram was dark 29 Apr to 1 Jul. It skipped the opening entirely (no opening-night
post exists there). On 1 Jul both weekend posts went up (the "Hey Friends" rundown, 15
likes, and the reel version).

## The current "what's on" copy (verbatim, IG post DaRIBWCn9qK, 1 July)

> Hey Friends, Hope you have had a wonderful week.
>
> This weekend at The Harvest 🌾🍕🎬
>
> Three ways to come dig in, eat well, and hang out this weekend, oh also we have our
> resident Pizza Teacher Dennis in the house!
>
> Fri, July 3 — DIY Pizza & Community Movie Night (3–8pm)
> Sat, July 4 — DIY Pizza Making (12–8pm)
> Sun, July 5 — DIY Pizza Making (12–6pm)
>
> All welcome, no experience needed — just bring your appetite, some conversation and
> maybe an extra pair of hands for the garden. 💚
>
> If you can register here will help us with numbers
> (https://harvest-the-network.mn.co/share/OZleJHyrST2m3PyK?utm_source=manual)

## What this changes

1. **Opening-day photos exist.** The blocked list in
   `now-open-communications-map-2026-07.md` item 1 says none exist. The 22 June
   Facebook post carries 12+ of them. Someone with page access downloads the originals,
   checks consent, uploads to Empathy Ledger, and the whole photo chain unblocks.
2. **A next date exists (and a weekly rhythm).** Blocked list item 3 is answered in
   practice: DIY Pizza weekends are running Fri/Sat/Sun with Dennis. The website, GHL
   newsletter and members page just never heard about it.
3. **Registration runs through Mighty**, via a share link in social captions. Numbers
   land in Mighty, not GHL, so the list-building loop (social to list) is leaking.
4. **The channels tell different stories.** Facebook got the opening recap; Instagram
   did not. Neither bio matches the current brand line. The website matches neither.
5. **CORRECTION (same day, from the full GHL audit):** the Planner is NOT abandoned.
   The live Planner holds 101 posts, and the July pizza posts were created in the GHL
   UI and published through it. Instagram published fine; 5 of the last 10 Facebook
   attempts FAILED (page connection needs reconnecting). `report-ghl-social.ts` sees
   only 15 of the 101 posts because its OAuth path appears to return only API-created
   posts; the location-key endpoint POST /social-media-posting/$LOC/posts/list (with
   skip and limit as JSON strings; numbers return 422) sees everything.

## How posting works from here (decision, Ben 2026-07-06)

**GHL Social Planner is the publishing desk.** Post from GHL first; native posting is
the exception. No Meta API integration for now. Consequences:

- Fix the Facebook connection in Planner settings and republish the failed posts.
- Fix `scripts/report-ghl-social.ts` to read the full planner (string skip/limit
  pagination) so the weekly review sees UI-created posts and failed statuses.
- For occasional review of anything posted natively, this document's logged-out
  browser pull works (Facebook reaches back only a few weeks; engagement partial).
- The Meta Graph API path (page token + a report-meta-social.ts twin) stays on the
  shelf as a later option if native posting ever becomes routine.
