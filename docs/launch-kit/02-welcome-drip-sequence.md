# Welcome Drip Sequence — The Harvest

5 emails sent over 14 days after newsletter signup. Configure as a GHL Workflow triggered by the `newsletter` + `website-signup` tags.

---

## Email 1: Welcome (Immediate)
**Subject:** Welcome to The Harvest
**Preview text:** You just joined something worth building.

---

Hey {{contact.first_name}},

Thanks for signing up. You're now part of something that doesn't exist yet — at least not fully. And that's the point.

The Harvest is a gathering place being built on 5 acres of Jinibara Country in Witta, on the Sunshine Coast Hinterland. A place to eat, gather, make, and grow. Not a venue. Not a brand. A place where people come to do real things alongside real people.

We're in the early chapters. There's a nursery that's been here for 27 years. A shed where the first workshops will happen. A piece of land that wants to be useful.

If you want the full story:
**[Read The Compendium →](https://theharvestwitta.com.au/compendium)**

We'll send you a few emails over the next couple of weeks to show you what's taking shape and how you might want to be part of it. Nothing salesy. Just the work.

See you around,
The Harvest Team

---

## Email 2: The Place (Day 3)
**Subject:** The land, the nursery, the shed
**Preview text:** 5 acres between the dairy farms and the rainforest.

---

Hey {{contact.first_name}},

We wanted to show you where this is happening.

Witta is a quiet stretch of the Sunshine Coast Hinterland — rolling green dairy country, subtropical rainforest, and a community of about 800 people. There's no cafe, no pub, no community hall. The nearest town is Maleny, 10 minutes down the road. Witta has incredible people and incredible land. What it doesn't have is a place to gather.

That's where The Harvest comes in.

The site is 5 acres anchored by a 27-year-old native nursery run by Barry — a man who's been restoring this land since before most of us moved here. There's a shed that's seen better days but has good bones. And there's space — for a community kitchen, workshops, markets, gardens, and gathering.

**[Explore the site →](https://theharvestwitta.com.au/site-plan)**

We're not starting from scratch. We're starting from what's already here.

The Harvest Team

---

## Email 3: The Pillars (Day 6)
**Subject:** Eat. Gather. Make. Grow.
**Preview text:** Four words. One place.

---

Hey {{contact.first_name}},

Everything at The Harvest organises around four pillars:

**Eat** — A community kitchen where locals cook together. Shared tables. Hinterland produce. Long lunches where strangers become neighbours.

**Gather** — Events, markets, music, conversation. A place where the community can actually come together — because right now, there's nowhere to do that.

**Make** — Workshop spaces for people who work with their hands. Woodwork, ceramics, fermentation, repair, textiles. Learning by doing, together.

**Grow** — The nursery. The gardens. Sustainability not as a slogan but as a practice. Growing native species, growing food, growing a community that looks after its patch.

These aren't departments. They're rhythms. Different ways of showing up to the same place.

**[See what's coming →](https://theharvestwitta.com.au/whats-on)**

The Harvest Team

---

## Email 4: How to Get Involved (Day 9)
**Subject:** There's a place for you in this
**Preview text:** Every role is real. Every contribution matters.

---

Hey {{contact.first_name}},

The Harvest isn't being built by a company. It's being built by the people who show up. That could be you. Here's how:

**Come to something** — When events start rolling, show up. Bring a friend. That's how community starts.

**Share an idea** — Got an event concept, a workshop you'd run, a collaboration that makes sense? We're listening. [Submit an idea →](https://theharvestwitta.com.au/get-involved)

**Run a business nearby?** — We're building relationships with local producers, makers, and service providers. [Express your interest →](https://theharvestwitta.com.au/get-involved)

**Apply for a residency** — We're creating an artist and enterprise in residence program. Come for a few weeks, work on your project, share what you're building. [Apply →](https://theharvestwitta.com.au/get-involved)

**Tell your story** — Everyone in this community has one. We'd love to feature yours. [Get in touch →](https://theharvestwitta.com.au/get-involved)

You don't need to do all of these. Just start where you are.

The Harvest Team

---

## Email 5: The Movement (Day 14)
**Subject:** Bigger than a property
**Preview text:** Listen. Be curious. Take action. Make art.

---

Hey {{contact.first_name}},

We wanted to share one more thing before we switch to our regular updates.

The Harvest isn't just a place. It's a way of thinking about what community can be.

We draw inspiration from the Bauhaus — the early 20th century movement where artists, architects, makers and thinkers lived and worked side by side. Not hiding from the world, but building a workshop for it. They believed that bringing creative people together — without hierarchy, without pretence — could produce something better than any of them could make alone.

That's what we're after.

**Listen** — to the land, to each other, to what's actually needed.
**Be curious** — about how things work, how they could work better, what's possible.
**Take action** — not someday, but now, with what we have.
**Make art** — in the broadest sense. Make something beautiful, useful, or true.

This isn't limited to Witta. If you're anywhere in Australia — or the world — and this resonates, you're part of it. The residency program is designed for exactly this: people who want to come, create, and contribute to something larger than themselves.

**[Read the full vision →](https://theharvestwitta.com.au/compendium)**

We'll keep you posted with stories, events, and progress. Thanks for being here at the beginning.

The Harvest Team

---

## GHL Workflow Configuration

1. **Trigger:** Contact tag added = `website-signup`
2. **Wait times:** Immediate → 3 days → 3 days → 3 days → 5 days
3. **Exit conditions:** Contact unsubscribes OR tag `welcome-complete` added
4. **On completion:** Add tag `welcome-complete`
5. **Sender:** hello@theharvestwitta.com.au
6. **Reply-to:** hello@theharvestwitta.com.au
