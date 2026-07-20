# Harvest SEO, media, and arts flywheel

Date: 2026-07-09
Site: https://www.theharvestwitta.com.au
Purpose: turn Google visibility into a real invitation system for Witta locals, makers, artists, visitors, funders, and partners.

## The plain decision

Do not build an SEO content farm.

Build a proof loop:

```text
real story -> Harvest article -> social and GBP post -> partner/media link -> small event -> GHL capture -> follow-up -> next story
```

The Harvest ranks by becoming the most useful public record of what is actually happening at 9 Gumland Drive.

That means:

- articles with local search language
- real photos and named people, with consent
- cross-links from artists, makers, media, council, event pages, and partner orgs
- Google Business Profile posts and reviews
- events that make the story visible in the world

## Current verified base

- Search Console URL-prefix ownership is verified for `https://www.theharvestwitta.com.au/`.
- `https://www.theharvestwitta.com.au/sitemap.xml` is submitted and shows Success with 17 discovered pages.
- Homepage is indexed and on Google.
- `/witta-pizza` was not indexed on 2026-07-08, so indexing was requested.
- `/whats-on` was discovered but not indexed on 2026-07-08, so indexing was requested.
- The public Google Maps listing exists for The Harvest Witta at 9 Gumland Dr, with website, hours, category Farm, photos, and no reviews.
- `benjamin@act.place` does not currently manage that Google Business Profile.

## Important blocker before relying on articles

The repo still has blog and article components, and the content runbook says articles can publish to `/blog/<slug>`.

But the current router sends almost all `/blog` and `/stories` traffic to `/whats-on`:

```text
client/src/App.tsx
if (location === "/blog" || location.startsWith("/blog/")) return <Redirect to="/whats-on" />;
if (location === "/stories" || location.startsWith("/stories/")) return <Redirect to="/whats-on" />;
```

The sitemap also deliberately excludes `/blog`, `/stories`, and `/people`.

So the first website decision is:

1. Re-open `/blog`, `/blog/:slug`, `/people/:slug`, and selected `/stories/:id` routes for public article work, or
2. Keep the site simple and publish the first stories through `/works/:slug`, `/what-is-the-harvest`, `/witta-pizza`, `/shop`, and `/whats-on`.

Recommendation: re-open the article surfaces once the first three pieces are ready and consent-cleared. Do not open an empty journal.

## Search themes to own

The useful search shape is local and specific.

| Search area | Why it matters | Primary page |
| --- | --- | --- |
| The Harvest Witta | branded discovery | `/` and `/what-is-the-harvest` |
| Witta pizza | immediate visit intent | `/witta-pizza` |
| Witta community garden | local participation | `/what-is-the-harvest`, garden article, `/get-involved` |
| Maleny/Witta makers | shop, shelf, workshops | `/shop`, maker profiles |
| Sunshine Coast hinterland artists | art space, residencies, workshops | artist profiles, fellowship page |
| Things to do in Witta | visitor discovery | `/whats-on`, weekend articles |
| Open studios / art trail / maker workshops | partner and event visibility | events, artist profiles |
| Local produce Witta / Maleny | shop shelf and food loop | `/shop`, producer profiles |

Google's own guidance is a good fit here: write helpful, reliable, people-first content, use words people search for, and make links crawlable. That is exactly the Harvest voice if we keep it grounded.

## The article spine

Use three kinds of article.

### 1. Proof articles

These show what is already real.

Examples:

- The Harvest Witta: from old nursery to community garden
- DIY pizza in Witta: how Friday nights work at The Harvest
- Two people, on Wednesdays, in the garden
- The Milk Create Pavilion
- The cedar in the room
- A small shelf for Witta growers and makers

Job: rank for local terms, explain the place, give media something linkable.

### 2. Profile articles

These feature a real artist, maker, grower, cook, volunteer, or local business.

Examples:

- [Name], ceramic artist, Maleny
- [Name], timber worker, Witta
- [Name], preserves and pantry goods, Blackall Range
- [Name], painter in the hinterland
- [Name], the person behind Friday pizza

Job: give the featured person a reason to share and link back. These pages also rank for their name, medium, and place.

### 3. Event articles

These convert attention into a reason to come through.

Examples:

- A Sunday artist table at The Harvest
- Witta maker shelf day
- Garden open morning
- Pizza and work-in-progress night
- Regional arts table: a first conversation

Job: create a date, a page, a social post, a Google Business Profile post, a GHL capture point, and a follow-up article.

## First 12 articles

These are the first pieces I would build. They are not all big. Some are 700 words with one strong photo.

| Order | Working title | Search target | Main link | Cross-link ask |
| --- | --- | --- | --- | --- |
| 1 | DIY pizza in Witta | witta pizza, pizza maleny, weekend pizza witta | `/witta-pizza` | Google Business Profile post, Facebook event, local tourism/event listings |
| 2 | The Harvest Witta: from old nursery to community garden | the harvest witta, witta community garden | `/what-is-the-harvest`, `/get-involved` | local community groups, maps listing, newsletter |
| 3 | The Milk Create Pavilion | milk crate pavilion, community art witta | `/works/milk-crate-pavilion` | builders, makers, Regional Arts Australia if appropriate |
| 4 | Two people, on Wednesdays, in the garden | witta community garden, volunteer gardening witta | `/get-involved` | Susie/Joey only with consent, garden groups |
| 5 | The cedar in the room | witta timber, maleny timber, local makers | `/works/the-cedar` | timber people, maker pages |
| 6 | A small shelf for local growers and makers | local makers witta, local produce maleny | `/shop` | every maker featured on the shelf |
| 7 | Artist profile: [first artist] | [artist name] sunshine coast, [medium] maleny | artist site, `/works` | artist website, Instagram, Arts Connect |
| 8 | Maker profile: [first shop maker] | [maker name], [product] witta | maker site, `/shop` | maker website, markets page |
| 9 | What to do in Witta this weekend | things to do in witta, witta weekend | `/whats-on`, `/witta-pizza` | event listings, Visit Sunshine Coast Hinterland |
| 10 | The long table is not finished yet | community dinner witta, long table maleny | `/whats-on` | food partners, attendees, photographer |
| 11 | Regional artists need rooms with tools | sunshine coast artist residency, creative space maleny | fellowship page | SCCA, Arts Connect, council arts team |
| 12 | The first Harvest regional arts table | regional arts sunshine coast, artist fellowship witta | event page, GHL form | RADF/CIIP/SCAF partner prospects |

## Internal link pattern

Every article should link to:

- one main Harvest page
- one related Harvest article or work page
- one practical action page
- one collaborator or source page, where appropriate

Example for an artist profile:

```text
Article: [artist name], [medium], [place]
Links to: /works, /get-involved, /whats-on
Links out to: artist website or Instagram, Arts Connect/Open Studios if relevant
CTA: come to the artist table or join the maker list
```

Example for pizza:

```text
Article: DIY pizza in Witta
Links to: /witta-pizza, /whats-on, /membership
Links out to: collaborator if there is one
CTA: check the next open time before you drive
```

## Cross-link strategy

A backlink only happens when the other person has a reason to link.

Give them one of these:

1. A profile they are proud to share.
2. An event page they are part of.
3. A useful resource their audience needs.
4. A grant/fellowship announcement they helped make possible.
5. A recap with their name, photo, and link handled properly.

Do not ask for "SEO links". Ask for the human thing:

```text
We wrote the piece and linked back to you here. If it is useful, can you link to it from your news page or share it with your list?
```

## Media targets

Use media after there is proof: article, photos, quote, event date, and one clear public ask.

| Target | Why it fits | Best angle |
| --- | --- | --- |
| Sunshine Coast News | local editorial and photo submissions | old nursery becomes community garden, Witta pizza, regional makers |
| Hinterland Times | local stories, arts, events, people | artist and maker profiles, local business story, "what is taking shape in Witta" |
| Visit Sunshine Coast Hinterland | visitor discovery | weekend open days, maker workshops, pizza, art trail angle |
| Arts Connect Inc / Open Studios Sunshine Coast | artist network and studio trail | Harvest as a working room for local makers and artists |
| Sunshine Coast Creative Alliance | regional creative sector | fellowship, creative space, professional development |
| ArtsCoast / council artist channels | arts opportunities and public programs | artist table, residencies, open call |
| Sunshine Coast Arts Foundation | philanthropic partner pathway | fellowship fund or partnership project |
| Witta and Maleny community groups | immediate trust | practical invites, not hype |

Known current notes:

- Sunshine Coast News lists editorial contact as `news@sunshinecoastnews.com.au` and Photo of the Day as `photo@sunshinecoastnews.com.au`.
- Hinterland Times is listed by QCPA with `editor@hinterlandtimes.com.au` and phone `(07) 5499 9049`.
- Maleny Arts Council appears in older directories, but public reporting in April 2026 says it formally disbanded. Treat it as historical context until a live contact is verified.

## Pitch sequence

Do not pitch "The Harvest exists." Pitch a story with a date and a body in it.

### Pitch 1: Witta pizza as the soft entry

Use when `/witta-pizza` is indexed and GBP is claimed.

Subject:

```text
Witta pizza nights at the old nursery on Gumland Drive
```

Body:

```text
The Harvest Witta has started opening the gate for weekend DIY pizza at 9 Gumland Drive.

It is not a restaurant. It is the first public rhythm for a community garden and creative gathering place taking shape on the old nursery site.

There are real photos, hours, and a short page here:
https://www.theharvestwitta.com.au/witta-pizza

If useful, we can send a tight photo set and a few lines from Ben or Nicholas.
```

### Pitch 2: artists and makers shaping the place

Use after two artist or maker profiles are live.

Subject:

```text
Hinterland artists are being invited to shape The Harvest in Witta
```

Body:

```text
The Harvest is starting a small artist and maker table in Witta.

The idea is practical: profile local artists, invite them into the working rooms, and turn that into small public showings, workshops, and shop shelf trials.

The first stories are here:
[link]
[link]

The next artist table is [date] at 9 Gumland Drive.
```

### Pitch 3: the fellowship

Use only after the partner and funding shape is real enough.

Subject:

```text
A working-table fellowship for Sunshine Coast hinterland artists
```

Body:

```text
The Harvest Witta is shaping a small regional arts fellowship for artists and makers who want to work with real rooms, real tools, and the public life of a place.

Each fellow would make one thing for the site, host one public moment, and leave behind one story people can read.

We are looking for partners before we open the call.
```

## Social posting loop

Every article becomes five pieces, not five new ideas.

| Channel | Piece |
| --- | --- |
| Instagram/Facebook | photo first, 100 to 160 word caption, one link or "link in bio" |
| Google Business Profile | short update or event, direct link to relevant page |
| GHL newsletter | one paragraph in the weekly note |
| Partner share pack | one image, one caption, one link, one sentence they can edit |
| Follow-up story | photo recap after the event |

Post pattern:

```text
[Concrete first line.]

[One real detail.]

[Why it matters in one sentence.]

[One invitation.]
```

Example:

```text
The first shelf does not need to be full.

It needs the right hands behind it. We are starting with local growers, small makers, preserves, useful ceramics, and things that carry a name.

If you make something that belongs on a Witta shelf, send us a note.

https://www.theharvestwitta.com.au/shop
```

## Event loop

Every event should make the next article easier to write.

The clean event shape:

```text
article -> event page -> GHL capture -> GBP event post -> partner share -> event -> photos/notes -> recap article -> review ask
```

First event set:

| Event | Purpose | Article that feeds it | Follow-up |
| --- | --- | --- | --- |
| Friday pizza night | easy public entry | DIY pizza in Witta | "What Friday looked like" photo note |
| Wednesday garden morning | local participation | Two people, on Wednesdays | volunteer follow-up and garden article |
| Maker shelf table | shop maker intake | A small shelf for local growers and makers | maker profile series |
| Artist table under the pavilion | art space invitation | Regional artists need rooms with tools | fellowship EOI |
| Open studio Sunday | partner alignment | first artist profiles | Open Studios / Arts Connect pitch |
| Long table story night | history and belonging | old nursery to community garden | Witta history series |

## The fellowship idea

Working title:

```text
The Harvest working table fellowship
```

Plain description:

```text
A small regional arts fellowship for Sunshine Coast hinterland artists and makers who want to work with a real place, not a blank gallery.
```

Shape:

- 6 artists or makers.
- 8 to 10 weeks.
- Each person gets a small stipend, one site brief, one public work-in-progress moment, and one published profile.
- Each person leaves one thing behind: a sign, bench, shelf object, workshop, wall work, garden object, sound work, table piece, repair, or documented method.
- Each person gets a profile page that links to their site and asks them to link back.
- The final weekend becomes a public showing, workshop table, and regional media hook.

The fellowship is not a retreat. It is a working table.

Possible streams:

| Stream | Output |
| --- | --- |
| Garden signs | handmade plant, path, and care markers |
| Long table objects | bowls, plates, vessels, table textiles, lamps |
| Milk crate pavilion | shade, screen, sound, projection, seating, small works |
| Local timber | bench, rail, object, repair, story card |
| Shop shelf | small run of maker goods with story cards |
| Witta history | photo/story wall with source notes |
| Kids corner | child-safe object or workshop, with consent and safety checks |

Partner fit:

- RADF: arts projects and artist development.
- Creative Industries Investment Program: established creative initiative or sector development.
- MadeSC / Creative Spaces: artist development and residency language.
- Arts Connect/Open Studios: artist network and trail visibility.
- Sunshine Coast Creative Alliance: sector partner and advocacy.
- Sunshine Coast Arts Foundation: donation/project partnership pathway.

Do not promise the fellowship publicly until:

- site insurance and workshop safety are clear
- artist payments are budgeted
- rights and consent rules are written
- partner asks are specific
- GHL capture and follow-up are ready

## Funding and partnership frame

RADF is the most direct first path. Council describes RADF as supporting artists, organisations, and collectives to develop quality arts projects, build skills and capacity, and grow audiences and engagement.

The Arts and Heritage Levy is the larger story. Its current reporting shows investment into First Nations creative arts programs, Creative Spaces residencies, ArtsCoast audience development, Horizon Festival, creative business development, and philanthropy support.

That gives The Harvest a clean argument:

```text
The Harvest is a working room for regional artists, makers, and community practice in the southern hinterland.
```

Grant language to keep close:

- artist development
- audience engagement
- creative ecology
- regional access
- work-in-progress showing
- maker economy
- heritage and material culture
- practical creative space

Grant language to avoid:

- world-class
- vibrant hub
- transformative ecosystem
- innovation precinct

## First 30 days

### Week 1

- Decide whether to re-open `/blog` now or wait until three articles are ready.
- Claim or request access to the existing Google Business Profile.
- Add phone, best category, photos, and one post once access exists.
- Publish or prepare the first article: DIY pizza in Witta.
- Create the first partner share pack.

### Week 2

- Publish old nursery to community garden article.
- Publish or refresh the Milk Create Pavilion article with real photos.
- Submit `/witta-pizza`, `/whats-on`, and the first article URL in Search Console.
- Post one GBP update and one Facebook/Instagram post.
- Ask 3 real visitors for honest Google reviews after a real visit.

### Week 3

- Publish the first artist or maker profile.
- Send one light pitch to Hinterland Times or Sunshine Coast News only after the page is live.
- Create an event page for the first artist/maker table.
- Invite 8 to 12 people directly, not as a public blast.

### Week 4

- Run the first small table.
- Capture photos, names, consent, and one quote.
- Publish a recap.
- Draft the fellowship one-pager and send it to 3 possible partners for sense-checking.

## Measurement

Weekly scorecard:

- Search Console indexed status for new pages.
- Search Console impressions for `The Harvest Witta`, `Witta pizza`, `Witta community garden`, `Witta events`.
- Clicks to `/witta-pizza`, `/shop`, `/get-involved`, `/whats-on`.
- Google Business Profile views, website clicks, directions, calls, and reviews.
- Backlinks or referral clicks from media, artists, makers, council, event pages.
- GHL tags: `interest:markets`, `shop-call-booked`, event RSVPs, `comms:harvest-newsletter`.
- Event RSVPs and attendance.
- Number of people who come back twice.

The real metric is not impressions. It is return.

## Sources checked

- Google Search Essentials: https://developers.google.com/search/docs/essentials
- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Business Profile: https://business.google.com/en-all/business-profile/
- Google Business Profile Help: https://support.google.com/business/
- Sunshine Coast Council RADF grants: https://www.sunshinecoast.qld.gov.au/living-and-community/grants-and-funding/grants-programs/arts-funding/regional-arts-development-fund
- Arts and Heritage Levy annual report: https://heritage.sunshinecoast.qld.gov.au/about/arts-and-heritage-levy/annual-report
- Creative Industries Investment Program: https://www.sunshinecoast.qld.gov.au/living-and-community/grants-and-funding/grants-programs/arts-funding/creative-investment-program
- MadeSC: https://www.sunshinecoast.qld.gov.au/experience-sunshine-coast/arts-and-culture/madesc
- Open Studios Sunshine Coast: https://openstudiossunshinecoast.com.au/
- Arts Connect Inc membership/Open Studios context: https://artsconnectinc.com.au/membership/
- Sunshine Coast Creative Alliance: https://wearescca.org/
- Sunshine Coast Arts Foundation partnership projects: https://www.scartsfoundation.com/projects/
- Sunshine Coast News contact: https://www.sunshinecoastnews.com.au/contact-us/
- Hinterland Times QCPA listing: https://www.qcpa.com.au/members/hinterland-times
- Artlands 2026 Sunshine Coast timing: https://regionalarts.com.au/programs/artlands/artlands26
