# Works copy review

Last exported: 2026-05-15

Scope: `/works` plus the current six work detail routes in `client/src/data/works.ts`.

Source files checked:

- `client/src/data/works.ts`
- `client/src/pages/Works.tsx`
- `client/src/pages/WorkDetail.tsx`
- `client/src/components/ShopInterestSection.tsx`
- `docs/brand/harvest-overview.md`
- `docs/brand/harvest-brand-voice.md`

This is the simple editing surface. Edit the copy here first. When it is approved, sync it back into:

- `client/src/data/works.ts` for work titles, subtitles, blurbs, sections, Witta threads, hands, links, and related works.
- `client/src/pages/Works.tsx` for the `/works` index page copy.
- `client/src/pages/WorkDetail.tsx` for shared section labels and fallback page copy.
- `client/src/components/ShopInterestSection.tsx` for the shop form intro, labels, placeholders, options, and success/error language.

Important: admin inline edits in the browser can override the code defaults through `EditableText`. This file mirrors the code defaults. If there are live database overrides, check them before doing a final sync.

## Quick copy review

- Overall direction is strong: object-led, material-led, place-led. It mostly sounds like a working place, not a venue brochure.
- Biggest decision: `/works/the-cedar` is publicly titled "The Garden Paths". Either keep the old slug as a hidden technical detail, or rename the route later so the public title and URL match.
- The St Mary's timber copy says the source trail leads back to trees cut from the Witta region. `harvest-overview.md` says that Witta-origin line needs a clean source note before it becomes public proof. Keep this as "being traced" until sourced.
- Milk Crate Pavilion says lifecycle `Building`, but year says "Built March 2026". Decide whether it is built, building, or built and extending.
- The Shop copy mentions sub-licensing and `Harvest Pty Ltd`. Check the legal/entity wording before launch. Avoid implying a formal co-op exists.
- Kids' Area and The Milk Man currently rely on fallback images that may not be the right public proof. Copy is fine, but the photo story probably needs a stronger match.
- The repeated detail page labels are serviceable. If we tighten later, start with "Story / A note on this work" and "Photographs / From the field."

## Sync notes

Use these slots if syncing browser edits or DB overrides:

- Work detail title: `page=works`, `slot=<slug>-title`
- Work detail subtitle: `page=works`, `slot=<slug>-subtitle`
- Work detail body sections: `page=works`, `slot=<slug>-whatItIs`, `<slug>-why`, `<slug>-how`
- Work detail story fallback: `page=works`, `slot=<slug>-story`
- Work index subtitle: `page=works-index`, `slot=<slug>-subtitle`
- Work index blurb: `page=works-index`, `slot=<slug>-blurb`
- Lifecycle override: `page=works`, `slot=<slug>-lifecycleTags`
- Pulse status: `page=works`, `slot=<slug>-pulse`
- Video URL: `page=works`, `slot=<slug>-videoUrl`

Dynamic content not edited here:

- Empathy Ledger photos on work pages.
- Blog articles attached to each work.
- Admin-picked image overrides.
- GHL form workflows and email copy.

---

# `/works`

## Page metadata

Browser title:

```text
The Collection · The Harvest
```

Meta description:

```text
The works of The Harvest — a living collection on Jinibara Country, Witta. Each piece carries a thread back to the history of the place.
```

## Hero

Eyebrow:

```text
The Collection · 6 works
```

Title:

```text
Everything here is a piece.
```

Body:

```text
The Harvest is a slow, living collection. Some works are built. Some are growing. Some are still forthcoming. Each one carries a thread back to the history of this place.
```

CTA:

```text
Read the Witta history first
```

## Index cards

Each card uses:

- work title
- subtitle
- year
- materials
- blurb
- `See the work`

## Closing band

Eyebrow:

```text
The Collection grows
```

Title:

```text
The next pieces will be made with you.
```

Body:

```text
Each season brings a new work...sometimes a structure, sometimes a practice, sometimes a partnership. Add a memory, share a skill, or come and help build one.
```

CTA:

```text
Add to Witta history
```

Review note:

```text
"Add to Witta history" points to `/witta`. Good if the Witta contribution path is ready. If not, use a softer CTA like "Read the Witta story".
```

---

# Shared work detail copy

Back link:

```text
The Collection
```

Not found eyebrow:

```text
Work not in the collection
```

Not found title:

```text
We couldn't find that piece.
```

Not found CTA:

```text
Back to the collection
```

Museum label fields:

```text
Year
Materials
Lifecycle
```

Section labels:

```text
What it is
Why
How
```

Inline feature caption after How:

```text
In the making.
```

Story eyebrow:

```text
Story
```

Story title:

```text
A note on this work.
```

Hands eyebrow:

```text
The Hands
```

Hands title:

```text
Who made it possible.
```

Related works eyebrow:

```text
Adjacent works
```

Next work eyebrow:

```text
Next in the collection
```

Next work CTA:

```text
See the next work
```

Photographs eyebrow:

```text
Photographs · {count}
```

Photographs title:

```text
From the field.
```

Photographs body:

```text
Every photograph tagged for this work in Empathy Ledger.
```

Blog eyebrow:

```text
Blog · {count}
```

Blog title:

```text
The narrative of {workTitle}.
```

Blog body:

```text
Past dispatches, what's happening now, and what's coming next. Every article on the Harvest site whose primary project is this work, in order.
```

Blog empty state:

```text
Nothing in this window yet. Try another filter.
```

Blog CTA:

```text
Read
```

Admin pulse eyebrow:

```text
Now
```

Admin pulse fallback:

```text
Add a short status update for what's happening with this work right now.
```

---

# Work 01 - The Garden

Route: `/works/the-garden`

Slug:

```text
the-garden
```

Lifecycle tags:

```text
planted, growing
```

Title:

```text
The Garden
```

Subtitle:

```text
The volcano made the soil. The community works the rows.
```

Materials:

```text
Red volcanic soil · seasonal beds · local hands
```

Year:

```text
Established 2025, planting ongoing
```

Hero alt:

```text
Sophie working in the garden at The Harvest
```

Blurb:

```text
The reason anything grows here is Jurassic. Volcanic red soil, two metres of rain a year, mist from the coast that gets pushed up the range. The garden is half landscape, half practice.
```

What it is:

```text
The productive garden at The Harvest. Beds for kitchen herbs, salad, fruiting vegetables, perennials, and a slowly building food forest. Tended by the Wednesday Maintenance Crew and a rotating roster of volunteers. Not a display garden. A working one.
```

Why:

```text
If we don't grow some of what we eat, we are not what we say we are. The garden is the daily proof. It also gives us a reason for people to come back every week. Caring for something living is the strongest invitation we have.
```

How:

```text
Beds were laid out in late 2025 around the existing canopy. Wednesday Maintenance Crew runs weekly through the seasons. Weeding, mulching, planting, harvesting. Cuttings go to the kitchen, surplus to neighbours, scraps back to compost. Decisions are made in the bed, not on paper.
```

Witta thread 1:

```text
Year: Time immemorial
Moment: Jinibara custodianship of the Blackall Range. Land managed through fire, seasonal movement, and deep ecological knowledge.
Thread: The first gardeners of this place worked it for tens of thousands of years. We grow on Country, with respect, and we are still learning.
```

Witta thread 2:

```text
Year: Jurassic era
Moment: Volcanic basalt soils form the deep, nutrient-rich krasnozem of the Blackall Range.
Thread: The soil is older than every story. It is the reason the rainforest, the dairies, and now the garden exist.
```

Witta thread 3:

```text
Year: 1893
Moment: Meat and Dairy Encouragement Act. Dairy begins replacing timber across the range.
Thread: The pasture economy that followed was monoculture. The garden is the opposite: plural, seasonal, and small enough to know.
```

Hands:

```text
Wednesday Maintenance Crew | Weekly stewards
Sophie | Garden volunteer | https://sophiesseedlings.com/
Susie & Joey | Community Stewards (from July 2026)
```

Story links:

```text
Read the full Sophie garden story | /blog/from-clearing-to-care-sophie-harvest-garden
```

Related works:

```text
milk-crate-pavilion
the-shop
```

Review note:

```text
Good core copy. Check "late 2025" and "from July 2026" before launch. The copy is strongest when it stays on soil, beds, weekly hands, and kitchen use.
```

---

# Work 02 - Milk Crate Pavilion

Route: `/works/milk-crate-pavilion`

Slug:

```text
milk-crate-pavilion
```

Lifecycle tags:

```text
building
```

Title:

```text
Milk Crate Pavilion
```

Subtitle:

```text
A gathering structure made from the dairy industry’s everyday object.
```

Materials:

```text
Reclaimed milk crates · scaffold · salvaged timber · community hands
```

Year:

```text
Built March 2026
```

Hero alt:

```text
People gathered at The Harvest during the milk crate pavilion build
```

Hero credit:

```text
Radical Scoops fellowship · Regional Arts Australia
```

Blurb:

```text
A few people built it together in a few weeks. Milk crates from the dairy industry, scaffold poles, found timber. The first piece of architecture on the site is also the most communal.
```

What it is:

```text
A modular art peice at the heart of The Harvest. Roughly 14m wide x 9m high, sized to fit comfortably. Plays the role of gallery, theatre, market hall, dining room, sometimes in the same afternoon. Designed to come apart, rearrange, and grow.
```

Why:

```text
We wanted to make art, we wanted to use something related to the dairy industry and we wanted it to be unique. A pavilion lets the community show up before the buildings finish. Markets, exhibitions, films, dinners, conversations. It says clearly: this place is for gathering, and gathering is the first work.
```

How:

```text
Built across two weekends in April 2026. Reclaimed milk crates were bought from the peope that make them for the dairy industry that once powered Witta.  No single builder.
```

Witta thread 1:

```text
Year: 1904
Moment: Maleny's first butter factory opens. The co-operative model takes root.
Thread: The crate is the icon of that century. Stacked, shared, returned, restacked. We took the form and made it a roof.
```

Witta thread 2:

```text
Year: 1960s
Moment: Dairy industry peak. Around 300 butter and cheese factories across the hinterland.
Thread: These crates carried the milk that built every house on this ridge. Reusing them keeps the lineage in the room.
```

Witta thread 3:

```text
Year: 2000
Moment: Dairy deregulation. Farms that sustained families for generations become unviable.
Thread: What was discarded after deregulation becomes the architecture of the next chapter. Not nostalgia. Repurpose.
```

Hands:

```text
Eighty community members | Builders, weekend of 7 March 2026
Regional Arts Australia | Radical Scoops fellowship funder
Ben Knight & Nicholas Marchesi | Co-founders, project leads
```

Primary external link:

```text
Radical Scoops fellowship | https://regionalarts.com.au/resources/radical-scoops
```

Extra links:

```text
Hatch Electrical | https://www.hatchelectrical.com.au/
```

Related works:

```text
the-cedar
the-garden
```

Review note:

```text
Strongest work page. Decide whether the lifecycle is still Building or should become Built/Extending. Also check the exact weekend date before launch.
```

---

# Work 03 - The Garden Paths

Route: `/works/the-cedar`

Slug:

```text
the-cedar
```

Lifecycle tags:

```text
building, making
```

Title:

```text
The Garden Paths
```

Subtitle:

```text
St Mary's timber, returning to Witta as walkways
```

Materials:

```text
Reclaimed St Mary's Cathedral timber · garden paths · local source trail
```

Year:

```text
Sourced 2026
```

Hero alt:

```text
Reclaimed timber connected to the garden paths at The Harvest
```

Blurb:

```text
The garden paths are being made from timber reclaimed from St Mary's Cathedral in Sydney. The source trail leads back to trees cut from the Witta region, returning as walkways through the garden.
```

What it is:

```text
A set of garden walkways made from reclaimed St Mary's Cathedral timber. The paths carry people through the beds while carrying the timber story back into the landscape it came from.
```

Why:

```text
The timber story belongs in the ground, not only on a wall. Paths are how people first read a garden: where to enter, where to slow down, where to notice what is growing.
```

How:

```text
Reclaimed from St Mary's Cathedral in Sydney and being prepared for use as garden walkways at The Harvest. The story is being traced back to the Witta region, with the timber used visibly so the grain, marks, and source remain part of the work.
```

Witta thread 1:

```text
Year: 1860
Moment: Bunya pine reserve rescinded. Timber-getters flood in. The 'red gold' rush begins.
Thread: The paths carry the timber story back into the garden, plank by plank.
```

Witta thread 2:

```text
Year: 1886
Moment: Two giant cedar logs shipped to the Indian and Colonial Exhibition in London. No buyer, too large for any mill in the world.
Thread: Some Witta timber travelled far from the range. This work follows one return journey.
```

Witta thread 3:

```text
Year: 1906
Moment: Red cedar faces commercial extinction. One-third of Queensland's hoop and bunya pine already gone.
Thread: The paths keep the timber visible as material, memory, and daily use.
```

Hands:

```text
Nicholas Marchesi | Material lead
Ben Knight | Source trail and documentation
Local timber hands | Preparation and installation
```

Related works:

```text
milk-crate-pavilion
the-garden
```

Review note:

```text
This needs the most careful source handling. The title is good, but the route is still `/works/the-cedar`. The Witta-origin claim should stay provisional unless the source note is clean.
```

---

# Work 04 - The Shop

Route: `/works/the-shop`

Slug:

```text
the-shop
```

Lifecycle tags:

```text
concept, planned
```

Title:

```text
The Shop
```

Subtitle:

```text
Reclaiming the village shop that Witta hasn't had in a generation
```

Materials:

```text
Local makers · shared shelf test · low overhead · honesty more than ornament
```

Year:

```text
Proposed June 2026
```

Hero alt:

```text
Local produce gathered for The Harvest shop test
```

Blurb:

```text
Witta has roughly 1,300 residents and no shops, no pub. The Shop is a small, slow attempt to put one back with a shared shelf and the makers who already live here.
```

What it is:

```text
A small retail space at The Harvest stocking what Witta and the surrounding hinterland produces. Preserves, ferments, ceramics, prints, oils, herbs, baked goods, gifts from the residencies. Run as a consignment and shared-shelf test rather than a buy-low-sell-high shop. Sublicenced under the lease, at arm's length from Harvest Pty's programming.
```

Why:

```text
The strategic plan calls for sub-licenced retail. The deeper reason is that Witta's last shop closed inside living memory and the gap is felt every week. A village without a shop has to drive for everything. A shop with the right shape, not Coles, not boutique, gives makers a shelf and gives neighbours a reason to walk past.
```

How:

```text
Sub-licenced under the lease, capital-light by design. Co-design with local makers and the Wednesday Maintenance Crew. Honest signage: who made it, where it came from, what they got paid. Open progressively as products and operators are ready, not all at once.
```

Witta thread 1:

```text
Year: Today
Moment: Witta: ~1,300 residents. No shops. No pub. A school that closed in 1974.
Thread: The Shop answers an absence that's been there for fifty years. Modestly, on the village's own terms.
```

Witta thread 2:

```text
Year: 1904
Moment: Maleny's first butter factory opens. The co-operative model takes root.
Thread: The first commerce here was co-operative. The Shop tests that shared operating instinct at village scale before any formal structure is claimed.
```

Witta thread 3:

```text
Year: 1980s
Moment: Maleny attracts artists, craftspeople, and alternative lifestylers. Co-ops, organic produce, and intentional communities replace dairy infrastructure.
Thread: Forty years of makers around Witta still need a shelf. We're building the shelf.
```

Hands:

```text
Local makers (Witta + hinterland) | Stockists, co-designers
Sub-operator (TBC) | Day-to-day retail
Harvest Pty Ltd | Sub-licence holder
```

Story links:

```text
Offer produce for the first shelf | /works/the-shop#shop-interest
Stock something you make | /works/the-shop#shop-interest
Help shape The Shop | /works/the-shop#shop-interest
```

Related works:

```text
the-garden
milk-crate-pavilion
```

Review note:

```text
Good strategic page, but watch legal/entity wording. Consider replacing "Harvest Pty Ltd" with "The Harvest team" until the entity is final. Keep the co-op language as history and instinct, not a claim.
```

## The Shop form

Component: `ShopInterestSection`

Default section id:

```text
shop-interest
```

Eyebrow:

```text
Shop interest
```

Title:

```text
Put something real on the first shelf.
```

Body:

```text
The Shop starts small: produce, made goods, food, useful objects, and people who want to help test the shape before it becomes too polished.
```

Offer options:

```text
Produce from the garden, farm, or kitchen
Something made by hand
Food, preserves, ferments, baking, or drinks
Shared shelf or consignment idea
I want to help shape the shop
```

Form labels:

```text
Name
Email
Phone, optional
Location
What fits best?
What could go on the shelf?
Timing
```

Placeholders:

```text
Your name
you@example.com
For a call or text back
Witta, Maleny, Montville...
Tell us what you grow, make, cook, stock, or want to help test.
Ready now, June, later in winter...
```

Submit button:

```text
Express shop interest
```

Pending button:

```text
Saving...
```

Success toast:

```text
Shop interest saved.
```

Error toast:

```text
Could not save shop interest
```

Error fallback:

```text
Please try again.
```

Review note:

```text
The form copy is clean and specific. If we want it warmer, change the button to "Send shop interest" or "Tell us what you can bring". Current version is clear enough.
```

---

# Work 05 - Kids' Area

Route: `/works/kids-area`

Slug:

```text
kids-area
```

Lifecycle tags:

```text
consulting, planned
```

Title:

```text
Kids' Area
```

Subtitle:

```text
A play area shaped with the kids who will use it
```

Materials:

```text
Logs · shade · loose parts · local kids' ideas
```

Year:

```text
In design 2026
```

Hero alt:

```text
Harvest garden crew gathered at the old nursery site
```

Blurb:

```text
The kids area is being shaped with local kids, not handed down as a finished playground. They help decide what belongs there, what it should feel like, and what makes them want to come back.
```

What it is:

```text
A small outdoor play area inside the garden rhythm of The Harvest. Logs, shade, loose parts, climbable edges, and room for children to make their own rules without turning the whole place into a plastic playground.
```

Why:

```text
If families are part of The Harvest, kids need a place that is theirs. Co-design keeps the area practical, safer, stranger, and more loved than a bought object dropped on site.
```

How:

```text
The first version starts with listening, sketches, and small build tests. Kids bring ideas. Adults bring care, tools, safe joins, shade, and the ability to make the good ideas stand up.
```

Witta thread 1:

```text
Year: Today
Moment: Families, working bees, and open days bring children through the gate.
Thread: The kids area makes room for children as contributors to the place, not just people waiting while adults talk.
```

Witta thread 2:

```text
Year: Former nursery
Moment: The old nursery site was already a place where local families came for seeds, plants, and practical garden knowledge.
Thread: The play area keeps that everyday family use alive in the next version of the site.
```

Hands:

```text
Local kids | Ideas and co-design
Parents and builders | Care, safety, materials
The Harvest team | Design and build coordination
```

Related works:

```text
the-garden
milk-crate-pavilion
```

Review note:

```text
Good copy. It avoids overpromising. The next improvement is a more specific image and one real kid-led detail once we have consent.
```

---

# Work 06 - The Milk Man

Route: `/works/the-milk-man`

Slug:

```text
the-milk-man
```

Lifecycle tags:

```text
built, made
```

Title:

```text
The Milk Man
```

Subtitle:

```text
A milk crate sentinel at the front of The Harvest
```

Materials:

```text
Milk crates · stacked figure · front gate marker · dairy memory
```

Year:

```text
Standing now
```

Hero alt:

```text
Milk crates stacked at The Harvest
```

Blurb:

```text
The Milk Man stands at the front of The Harvest: a figure made from milk crates, holding the dairy story at the gate before people even read a sign.
```

What it is:

```text
A milk crate figure at the front of the site. Part sign, part marker, part local joke with a serious backbone: the dairy industry made the object, and now the object watches the next version of the place arrive.
```

Why:

```text
The Harvest needs recognisable things people can point at, remember, and talk about. The Milk Man does that before anyone reads a paragraph. He makes the dairy thread visible without turning it into a museum label.
```

How:

```text
Built from stacked milk crates and kept visible at the front of the site. The next work is naming him properly, photographing him well, and deciding how he carries the dairy story with enough humour and enough respect.
```

Witta thread 1:

```text
Year: 1900s
Moment: Dairy and co-operative infrastructure shaped work, movement, and daily life across the hinterland.
Thread: The crate was a working object before it became a sculpture. The Milk Man keeps that plain material memory standing at the gate.
```

Hands:

```text
The Harvest team | Build and placement
Local photographers | Still needed
Neighbours | Name suggestions and crate leads
```

Story links:

```text
Send a name idea or photo | /membership#questions
See the Milk Crate Pavilion | /works/milk-crate-pavilion
```

Related works:

```text
milk-crate-pavilion
the-garden
```

Review note:

```text
Good, but the line "Send a name idea or photo" points to `/membership#questions`. Confirm that anchor exists and feels right. If not, use `/contact` or remove until the member form explicitly handles it.
```
