# Community Engagement & Membership Launch Plan

> Status: draft for review. Created 2026-05-26.
> Source: synthesis of Benjamin Croft's feedback (25-26 May 2026) plus Ben's own landing point.
> This doc is the strategy layer. The operational execution layer (roadmap, target-audience records, drip calendar) lives in Notion and references this doc. Do not duplicate this content into Notion.

## The one idea everything hangs on

The failure mode Croft names: build a slick membership site, fill it with cool stuff, then spam people to "come join," and nobody logs in. The fix is not better content. It is right message, right medium, right market, then learn how to convert.

So the launch is not a reveal that drives traffic to a destination. It is a slow seeding of genuine value, delivered where each audience already lives, that lets people climb toward deeper involvement on their own terms.

Ben's landing point, which is the test for everything we ship: people use their own agency to keep connecting because they know they are continuing to get value. If a piece does not give the receiver something they can use for their own goals, it does not go out.

## 1. Map each audience to its medium, and ask them first

For the first three audiences (community, Centrecorp, Oonchiumpa), ask each how they actually want to receive and share this. Not "here is a website link." It might be a photo gallery they text around, a short video, a printable one-pager, a board-meeting slide, an audio piece. Consent on format, not just content.

Practical move: a single short conversation or message to each, "we made this for you, how do you want it, and how do you want to be able to pass it on?" Then we produce that one format well rather than five formats nobody asked for.

The website is the deep archive. The delivery to each audience is whatever that audience already opens: WhatsApp broadcast, a Facebook group, a fortnightly email, an Instagram. Meet them there.

## 2. The engagement ladder (membership without the funnel)

People climb by choice as value accumulates. Nobody gets pushed, and you can sit happily on a low rung forever, which is what makes people eventually climb.

- Receive: a beautiful story every fortnight or season. No ask. Useful and share-worthy on its own.
- Show up: open work days, seasonal events, a garden visit. Low friction, real, in person.
- Use it: take something for your own goal: photos to share, a planting guide, a recipe, a space to host your own thing, a story that helps you tell yours.
- Make it: own a mini-project: co-design the kids area, run a workshop, steward a garden bed.
- Hold it: membership or stewardship: named, ongoing, valued. A founding circle, a season pass, a contributor role.

Membership is the top rung, not the only goal. The agency is real because rungs one through three deliver value indefinitely without ever joining. Susie and Joey as Community Stewards are the humans who help people find their next rung when they are ready.

## 3. Drip the story (the rhythm people look forward to)

Too much content, fed all at once, lands worse than small sequenced pieces. People understand a mission better over weeks than in one hit.

- Pick one named, recurring thing people come to anticipate. A fortnightly "Field Notes from The Harvest," or a seasonal rhythm. Consistency creates the looking-forward-to feeling.
- Each piece is small and complete: one story, one image set, one useful thing. Not a newsletter that tries to say everything.
- Sequence it so the mission reveals itself over weeks. The website holds the depth for whoever wants to dig.
- A podcast or short audio series fits the voice if there is appetite, but start with the format that can be sustained. Cadence beats production value.

## 4. Take friction off every door

On the partner form, the "roughly what size are you thinking?" question creates friction at the wrong moment. Ask less up front, enrich later.

- Stage 1: name, email, one line of intent. That is it.
- Stage 2: once they have raised their hand, a follow-up form or real conversation gathers detail like size. Progressive profiling, not an interrogation at the door.
- Split-test short form vs longer form, measure submissions.

Same principle everywhere: every form, every join, every RSVP asks for the minimum that lets the next step happen.

## 5. The Ben and Nic question

Segment it rather than choose.

- Community-facing (audience set one): keep the founders in service of the community. Light presence, framed as stewards, not the front door.
- Second audiences (partners, funders, corporate, broader public): these people convert on trust, and knowing Ben and Nic are behind it is a strong trust signal. Make a short, honest "who is behind this and why" available and more visible in those funnels.

One founder story, positioned in-service, surfaced more for the audiences who need the credibility and held lightly for the community who needs the spotlight on themselves.

## 6. Hand the small pieces to others (with a brand guide)

The place delivery falls over is the smaller pieces and ongoing touch-points. Turn the small pieces into owned mini-projects for volunteers and marketing interns.

- Write a brand and voice guide once: voice (the field-notes voice, no em-dashes, no marketing-speak), objectives, the engagement ladder, what good looks like, what never to do. This is what lets you trust-and-verify a rolling stream of interns.
- Each mini-project has one owner, a clear brief, and Ben as visionary reviewing output, not making it.
- This fixes follow-through. The vision stays with Ben; delivery stops bottlenecking on him.

## 7. How GHL holds it together long-term

GHL is the engine, not the "place." The place is where the audience already lives. GHL orchestrates behind the scenes:

- Tags and segments per audience, so the community drip and the partner drip are different cadences and content.
- Workflows run the drip sequences (extends the welcome workflow already in progress).
- Pipelines for second audiences are the warming funnels: stages like aware, interested, conversation, partner. See who is warming and who has gone cold.
- Progressive profiling: short form in, enrich via stage-2 form or behavioural tags later.
- Corporate events fit perfectly: a standing "host your team day at The Harvest" gives corporates something useful for their own goals, keeps them connected, and earns revenue. That is a pipeline and a drip of its own.

The discipline: GHL sends people value and tracks the relationship. It never becomes the destination people get nagged to log into. If the data shows people are not opening the slick thing, move the same content to the channel they actually use.

## 8. Launch sequence

A rough order that seeds value first and asks later:

1. Ask the first three audiences how they want it (format consent). Produce that one format each.
2. Set up the named recurring drip and the brand/voice guide so it can scale to interns.
3. Strip the partner form to stage 1, add a stage 2, start the split test.
4. Stand up the second-audience warming pipelines in GHL (partners, corporate, funders) with a light founder-visible story.
5. Open the first in-person rung (a work day or seasonal event) so the digital drip has a real-world place to land.
6. Watch the channels. Move content to where people actually engage. Convert toward the ladder only as fast as value earns it.

## The system underneath (how this maps to what exists)

This plan is the strategy layer. It rides on systems already built. Nothing new gets invented, and nothing gets written in two places.

- Who: the Notion Harvest Engagement DB plus GHL tags hold the people, segmented.
- What and when: the Notion Actions DB (Projects = Harvest) holds the roadmap.
- Delivery: the six live GHL workflows send. Tag operations are canonical in `harvest-ghl-tag-and-automation-map.md`.
- Capture: the website forms intake into GHL.

The ladder-to-tag mapping (which GHL tag and which Engagement DB status each rung uses) lives in the GHL tag and automation map under "Engagement Ladder Stages", so tag operations stay in one place.

### The following-vs-member split (done 2026-05-27)

The footer "follow along" intake and the `/membership` "join" intake are now separate. The footer submits `member: false` with `interest-community`, so it applies `harvest-newsletter` only and fires the Newsletter Signup workflow (`GHL_NEWSLETTER_WORKFLOW_ID`). The `/membership` form submits `member: true`, which adds `harvest-member` plus `interest-membership` and fires the Member Welcome workflow (`GHL_MEMBER_WELCOME_WORKFLOW_ID`). The gating lives in `buildNewsletterTags` (`server/routers.ts`), which only adds `harvest-member` when `member: true` or interests include membership. The Receive rung is now a real rung, distinct from Hold-it. Both welcome workflows are wired and verified live as of 2026-05-27: member joins fire "Harvest - Member Welcome", footer follows fire "Harvest - Follow Welcome" (`0cf2479e`). Note: the generic "Newsletter Signup" workflow was found to send an off-brand ACT welcome and must not be used for Harvest. Open follow-up: welcomes send from `hi@act.place`, not a Harvest address (sending-domain setup in GHL).

### Target audiences and their mediums

Consent on format: ask each first-audience how they want to receive and share before producing anything. Medium is confirmed with them, not assumed.

| Audience | Set | Preferred medium | Entry rung | GHL tag / pipeline |
| --- | --- | --- | --- | --- |
| Community (Witta locals) | First | Confirm with them | Show up | `harvest-newsletter`, `interest-community` |
| Centrecorp | First | Confirm with them | Receive | partner pipeline |
| Oonchiumpa | First | Confirm with them | Receive | partner pipeline |
| Partners | Second | Warming funnel | Receive | partner pipeline |
| Corporate (team days) | Second | Warming funnel | Use it | corporate pipeline |
| Funders | Second | Warming funnel | Receive | funder pipeline |
| Makers / shop | Cross-cutting | Shop form | Use it / Make it | `harvest-shop-interest` |
| Broader public | Second | Social plus website | Receive | `harvest-website` |

## Content note

Croft's photo note: on the bed image, consider pulling back slightly so her old bed is visible.
