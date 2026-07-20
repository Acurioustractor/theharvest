# 03. Pizza evening (Sat 20 June 2026)

> Day-of run sheet for moment three: pizza from 5pm, then one clear conversation
> about what should happen next, then close and lock-up. The minute-by-minute
> shape, who holds what, the make-your-own pizza flow, oven and fire safety, how Nic
> runs the conversation so everyone gets a say, and the close checklist.
>
> **This follows the reconciled public open-day model**, not the older capped
> members'-day plan. Where this disagrees with `docs/strategy/launch-ops-run-sheet.md`
> (B1/B2 capped seats, pizza from 2pm), the reconciled model wins. Decision source of
> truth: `docs/strategy/RECONCILED-20-june-public-open-day-2026-06-03.md`. Menu, par
> levels and food detail: `.claude/skills/harvest-selling-system/references/launch-runbook.md`
> and `par-sheet-template.csv`. Signage look: `04-branding-and-signage-pack.md`.

## The event

Saturday 20 June 2026. Pizza **from 5pm**, stay till dark. 9 Gumland Drive, Witta
QLD 4552, Jinibara Country. Free, everyone welcome, uncapped. Nothing is sold.

This follows the open afternoon (`02-open-afternoon.md`). The gate opened at 1pm,
people have walked the place, the two questions are already on the wall. The evening
is where the day lands: a shared meal made by hand, then one honest conversation
about what The Harvest should become. It happens after the Witta Market that runs
that morning, so some people will have been around the site all day.

**Food is served, not sold.** No register, no Square, no shop sales, no liquor
licence. Water, tea, coffee and soft drinks are served free. BYO alcohol is fine.

## The shape of the evening

- **From 5pm. Make your own pizza.** Three doughs and what the garden gave.
  Margherita, roast veg and feta, salami. Gluten-free base and dairy-free cheese
  on the side. People build their own, the oven does the rest.
- **As it gets dark. One conversation.** Nic brings the room together for a single,
  clear talk: what should happen next here. Everyone gets a say, the quiet people
  too, and it gets written down.
- **After dark. Close.** Oven out and cold, site walked, gate secured, written
  record kept.

Free. No register, no bar. Kids welcome, the chalk-and-paper corner from the
afternoon stays open into the early evening.

## Run of show (4:30 to close)

Times are a plan, not a promise, and they flex with the light and the crowd. Dusk
on 20 June at this latitude is around 5:15 to 5:30, dark by about 5:45, so the oven
wants to be hot before the light goes.

| Time | What happens | Who holds it |
|---|---|---|
| 4:30 | Pizza crew gathers. Wash hands, lay out the bar, fill topping bowls, stage bases. Cold ingredients stay in the esky or fridge until needed. | Pizza lead + crew |
| 4:30 | Fire and oven safety walk: keep-clear zone marked, extinguisher and water bucket in place, kids corner sighted away from the fire. | Safety lead + pizza lead |
| 4:40 | Oven lit and brought up to heat. A wood-fired oven takes time, so light early. | Pizza lead |
| 4:45 | Drinks out and topped with ice: water, tea and coffee urn on, soft drinks in tubs. BYO note up. | Drinks / floor |
| 4:50 | Pizza menu board and the free-night note placed at the bar. Allergen labels (gluten, dairy) on the bar. | Floor + signage |
| 5:00 | Pizza service opens. Nic or the host says a few words: thanks for coming, how the bar works, the conversation comes later. | Host (Nic) |
| 5:00 to 6:30 | Make-your-own pizza in waves. Guests build, crew bakes, plates go out. Topping bowls refilled as they empty. | Pizza lead + crew |
| 5:15 | Lights and string lights on as the light drops. Music on, low enough to talk over. | Floor |
| 5:30 | Quick fire and light check now it is near dark: paths lit, no dark trip spots, fire contained. | Safety lead |
| 6:30 | Last builds called so the oven can wind down with the conversation. Dessert pizzas if doing them. | Pizza lead |
| 6:45 | Nic gathers the room for the one conversation. People settle with a plate and a drink. | Host (Nic) |
| 6:45 to 7:30 | The "what's next" conversation (see below). Captured live on the wall and on paper. | Host (Nic) + capture lead |
| 7:30 | Nic closes the conversation: thanks, what happens with the notes, no promises beyond what is true. | Host (Nic) |
| 7:30 onward | People drift, music stays on, oven left to die down. Edible leftovers offered to guests to take. | Floor + all hands |
| 8:00 | Wind-down begins. Pack the bar, gather the written record, start the close checklist. | All hands |
| After dark, fire cold | Final close and lock-up (see checklist). Nobody leaves until the fire is out and cold. | Close lead + Ben/Nic |

The oven, not the clock, sets the food pace. If turnout is high, run the bar in
calmer waves and let the queue breathe rather than rushing builds past the oven.

## Make-your-own pizza service flow

The night is built on set bases so anyone can make a good pizza without skill. The
crew runs the oven and the queue; the guests do the building.

**The menu (served, not sold)**

Three set pizzas on the board, built on the bar:

- **Margherita.** Tomato sauce, mozzarella, basil.
- **Roast veg and feta.** Roast pumpkin or shared garden veg, feta, mozzarella.
- **Salami.** Tomato sauce, mozzarella, salami.

**Options on the side:**

- **Gluten-free base.** GF only this night, baked with dairy cheese, so there is no
  vegan claim on the menu. No vegan or plant cheese this night.
- **Dairy-free cheese.** Available on request for the dairy-free.
- **Dessert pizza** if the crew has the hands: Nutella and marshmallow, late in the
  service.

**Allergens:** gluten and dairy. Labels on the bar. GF base and DF cheese kept
separate from the wheat bases and dairy cheese, with their own spoon, to avoid
cross-contact.

**How many bases.** Plan for **about 60 bases for about 40 people**, roughly 1.5 per
head. **This is a planning estimate, not a headcount.** The only real dough signal is
the `rsvp-pizza-dinner` count from the "I'm coming" RSVPs (read it with
`npm run count:rsvps:ghl`), and the turnout is public and uncapped, so the actual
number could be higher or lower. Firm the buy against the RSVP count on 18 to 19 June,
keep a buffer, and remember the bases store well so a modest over-buy is fine. Par
levels for a 60-pizza night sit in `par-sheet-template.csv` (4 x 2kg mozzarella,
roughly 110g cheese per pizza, sauce at 80g). Stock owner: Susie.

**The flow at the bar:**

1. **Build.** Guest takes a base, sauces it, adds toppings from the bowls. A crew
   member helps and keeps it sane (one base at a time at busy moments).
2. **Bake.** A crew member, not the guest, carries the pizza to the oven and runs the
   bake. Only the pizza lead and named crew go near the oven.
3. **Out.** Pizza comes out, onto a board, cut, handed back. Call names or a simple
   numbered marker so builds do not get muddled.
4. **Refill.** Topping bowls topped up from the esky as they empty. Cold things go
   back cold between refills.
5. **Reset.** Wipe the build surface between waves, fresh gloves, handwash at the bar.

## Drinks (served free)

Water, tea, coffee and soft drinks, all free. Water and a tea-and-coffee urn are the
backbone; soft drinks in iced tubs. BYO alcohol is fine and there is no bar and no
sale. Keep cups, milk and sugar stocked through the evening. A clearly marked water
station matters most as the night goes and people have been on site for hours.

## Oven, fire and safety

The oven and the open fire are the main risk of the evening, more so once it is dark
and there are kids about.

- **One keep-clear zone** marked around the oven and any fire, with the "Keep clear,
  hot oven and fire" sign up before service (`04-branding-and-signage-pack.md`, sign
  11). Kids corner sited well away from it.
- **Only named crew** at the oven. Guests build at the bar, crew bake. No guest
  carries a raw or hot pizza to or from the oven.
- **Extinguisher and a water bucket** within reach of the oven the whole time. First
  aid kit located and the incident process known by the leads before 5pm.
- **Light it early** (around 4:40) so the oven is hot before dusk and the fire is
  settled, not roaring, by the time the crowd is thick.
- **Two safety checks named in the run of show:** one at 5:30 as it goes dark (paths
  lit, no dark trip spots, fire contained) and one at close (fire fully out and cold
  before anyone leaves). This sits under gate 7, the fire / oven / kids risk
  assessment walked with the leads.
- **Nobody leaves until the fire is out and cold.** This is the last line of the
  close checklist for a reason.

## Seating and ambience as dusk falls

The evening should feel like a shared meal under the pecans, not a function. As the
light drops:

- Long tables and the pavilion seating set so people eat together, not in scattered
  corners. Leave room for people to move and for the later conversation to gather.
- String lights and lamps on by about 5:15, before the light goes, so the change is
  gentle and the paths stay lit.
- Music on from service, low enough to talk over, and turned down for the
  conversation.
- A jacket note in the comms and at the gate: it is a hinterland winter evening and it
  gets cold after dark.
- Fire as the warm centre of the room, with its keep-clear zone respected.

## The "what's next" conversation (Nic hosts)

This is the point of the evening. One conversation, not a panel and not a pitch, about
what should happen next at The Harvest. It carries the same question that has been on
the wall all afternoon: **"What should happen next?"** (alongside "What brings you
through the gate?"). Nic leads it so that everyone, including the quiet people, gets a
say, and so the answers are kept.

**How Nic runs it (about 45 minutes):**

1. **Gather, don't summon.** Around 6:45, with food in hand, Nic brings people
   together at the long tables and the fire rather than calling a meeting. Warm and
   short to open: thanks for coming, here is the one thing worth talking about
   tonight.
2. **Frame the one question.** What should happen next here. Name the Green Harvest
   lineage honestly (the site was a plant nursery called The Green Harvest for
   decades, and The Harvest carries the name forward) so people place the question in
   the real history of the place, not a blank slate.
3. **Make space for the quiet ones.** Do not run an open-floor free-for-all, where the
   loudest win. Use a method that reaches everyone:
   - A minute of quiet first: write one thing on a card (cards and pens on the
     tables).
   - Small clusters of three or four talk it through, then one voice shares back per
     cluster, so no one has to speak to the whole crowd to be heard.
   - Nic invites, by name where it is kind to, people who have not spoken: "what did
     you land on at your table?"
   - The question wall stays open the whole time for anyone who would rather write
     than speak.
4. **Capture it live.** A capture lead writes the threads up as they come, on the wall
   and on paper. The cards are kept. Nothing is paraphrased away.
5. **Close honestly.** Nic closes by saying what happens to the notes (they are kept
   and read, they shape what comes next) and makes no promise beyond what is true
   today. **No membership, Mighty, or "you're in" promise on the night.** The Mighty
   inside room is a human-reviewed first cohort decided after Saturday, never a
   bulk-invite from the door.

**What gets captured:** every "what's next" answer, on cards, on the wall, and in the
feedback notes. These are the written record of what the community wants this place to
be, and they are the input to what gets built next.

## Open / serve / close checklist

**Open (from 4:30)**
- [ ] Pizza bar laid out, build surface clean, gloves and handwash at the bar
- [ ] Bases staged; cold ingredients in esky or fridge until service
- [ ] Topping bowls filled: sauce, mozzarella, basil, roast veg, feta, salami
- [ ] GF base and DF cheese set aside separately with their own spoons
- [ ] Allergen labels (gluten, dairy) on the bar
- [ ] Pizza menu board and "free tonight, nothing for sale, BYO alcohol" note placed
- [ ] Drinks out: water station, tea and coffee urn, soft drinks iced
- [ ] Oven lit early (around 4:40) and coming up to heat
- [ ] Fire keep-clear zone marked; extinguisher and water bucket in reach
- [ ] First aid kit located; incident process known by the leads
- [ ] String lights and lamps ready to switch on at dusk
- [ ] Kids corner still set, sited away from the fire

**Serve (5pm onward)**
- [ ] Pizza lead runs the oven and the queue; only named crew at the oven
- [ ] Guests build at the bar, crew bake and plate; topping bowls refilled
- [ ] Cold ingredients kept cold between refills
- [ ] Lights on by about 5:15; music on, low enough to talk over
- [ ] 5:30 safety check: paths lit, no dark trip spots, fire contained
- [ ] Last builds called around 6:30 so the oven can wind down
- [ ] 6:45 Nic gathers the room for the one conversation; capture lead writing live
- [ ] Conversation captured on the wall and on cards; quiet voices reached

**Close (after dark)**
- [ ] "What's next" cards, wall notes and feedback gathered and kept (do not lose the
      written record)
- [ ] Edible leftovers offered to guests to take, then to the crew; scraps to compost
- [ ] Oven and fire fully out and cold before anyone leaves
- [ ] Bar packed, surfaces wiped, utensils washed, gloves and packaging cleared
- [ ] Bins and recycling out, waste removed
- [ ] Site walked: gardens, building, pavilion, kids corner checked
- [ ] Lights, taps, fridge, keys, gate secured
- [ ] Quick count by hand: rough turnout, pizza served, cards left

## Role roster

Names are confirmed closer to the day. Unassigned roles are marked TBC and sit
against the readiness gates below, not invented here. Host is Nic, stock owner is
Susie, and Ben is present on 20 June (he departs overseas 27 June).

| Role | Who | Window | What it covers |
|---|---|---|---|
| Host / room lead | Nic | 5:00 to late | holds the shape of the evening; runs the "what's next" conversation so everyone gets a say |
| Pizza lead | TBC (gate) | 4:30 to late | runs the oven and the make-your-own bar; unassigned, see readiness gates |
| Pizza crew | TBC | 4:30 to wind-down | builds help, bakes, plates, refills bowls; only named crew at the oven |
| Drinks / floor | TBC | 4:45 to late | water, tea, coffee, soft drinks topped up; lights and music; sets the room |
| Safety / incident lead | TBC | 4:30 to close | fire and oven keep-clear, the 5:30 and close safety checks, first aid and incident process |
| Capture lead | TBC | 6:30 to close | writes the conversation up live on the wall and cards; keeps the written record |
| Kids corner | TBC | early evening | low-risk supervised play in the chalk-and-paper corner, away from the fire |
| Stock owner | Susie | before the day | firms the dough buy against the RSVP count, buys 18 to 19 June |
| Close / lock-up lead | TBC | from late | runs the close checklist; confirms the fire is out and cold before lock-up |

Extra hands for a public crowd are flagged in the readiness gates. The afternoon's
gate, parking and welcome roles (`02-open-afternoon.md`) may roll into the evening or
hand over; confirm the handover before 5pm.

## Materials and setup checklist

- **Pizza bar:** trestle or bench, clean build surface, boards, pizza peel, cutter,
  serving boards, plenty of gloves, tongs, serving spoons (separate spoon for GF and
  DF), handwash and paper at the bar.
- **Bases and food:** about 60 bases (estimate, firm against the RSVP count), GF bases,
  sauce, mozzarella, DF cheese, feta, basil, roast veg, salami; dessert toppings if
  doing them. Per `par-sheet-template.csv`.
- **Cold chain:** eskies with ice and/or fridge for cheese, salami, veg, feta;
  thermometer if available.
- **Drinks:** water station and jugs, tea and coffee urn, cups, milk, sugar, tea, soft
  drinks, ice and tubs.
- **Oven and fire:** dry firewood, lighter, fire extinguisher, water bucket, heat
  gloves, ash bucket for the morning.
- **Light and ambience:** string lights, lamps, extension leads, long tables and
  seating, a small speaker for music.
- **Capture:** the question wall (carried over from the afternoon), index cards, pens,
  feedback sheets, a box or folder to keep the cards in so nothing is lost.
- **Safety and clean:** first aid kit, torches, lined bins for landfill and recycling,
  cleaning cloths, sanitiser, foil for leftovers, compost bucket.
- **Signage:** pizza menu board, free-night note, allergen labels, fire and oven
  keep-clear, the two questions large by the wall (see signage below).

## Signage

Keep it simple and human, in the graphite-pencil brand look, dark logo on light stock
(`04-branding-and-signage-pack.md`). For the evening specifically:

- **Pizza menu board** at the bar: the three pizzas (margherita; roast veg and feta;
  salami), the GF base and DF cheese options, and "make your own".
- **Free-night note**, plain and honest: **"Everything here is free tonight. Nothing
  is sold. BYO alcohol is welcome."** This matters because the night is served, not
  sold, and there is no register.
- **Allergen labels** on the bar: gluten and dairy. GF base and DF cheese available.
- **Fire and oven keep-clear:** "Keep clear, hot oven and fire" around the oven and
  any fire.
- **The two questions**, large, by the wall: "What brings you through the gate?" and
  "What should happen next?"
- **Water station**, toilets, handwashing and the path to the gate, lit for after
  dark.

## Capture for the day

The evening's record is the input to what gets built next, so do not lose it. Keep:

- **"What's next" cards and wall notes.** Every answer to the one question, kept and
  read.
- **Feedback.** Anything left about the space, the kids' corner, market mornings,
  maker days, the empty rooms.
- **Headcount and dough.** A rough by-hand count of who came and how much pizza went.

GHL tags for the day (from the reconciled doc, unchanged): the "I'm coming" RSVP adds
`rsvp-pizza-dinner` and `witta-gathering-2026-06-20`; produce conversations add
`interest:markets`, `role:supplier`, `project:act-hv`; ideas add `idea:witta-2026-06`;
feedback adds `feedback:witta-2026-06`. **An RSVP is a headcount and a dough count
only.** It never subscribes anyone to the newsletter, a membership or Mighty, so do not
add `harvest-member` or `harvest-newsletter` from an RSVP. The Mighty inside room is a
human-reviewed first cohort of 8 to 12 people, decided after Saturday, never a
bulk-invite from the door.

## Risks and the tea-and-water fallback

- **Council food gate not confirmed (gate 3).** If the council food-safety call
  (07 5475 7272) is not confirmed, **food locks to tea and water only and the pizza
  falls away.** The evening still runs: tea, coffee, water and BYO alcohol, the same
  conversation, the same close. Plan the night so it survives this. Decide the cutover
  date with the owner; do not light the oven on a guess.
- **Pizza lead not assigned (gate 4).** No pizza lead means no oven, so the night falls
  back to tea and water. Watch this against the food gate; they fall together.
- **Insurance not bound (gate 1, hard kill-switch).** No $20M public liability bound in
  the trading entity's name means no event at all. Fallback ladder: if insurance is
  uncertain, a same-day or event binder; if still uncertain, a closed rehearsal of 10
  to 15 named people with no public surface. This is the owner's call, not a day-of one.
- **Public turnout unknown.** Could be well over the 40-person estimate. Run the bar in
  calmer waves, keep a base buffer, and keep extra hands on standby (gate 5).
- **Fire and dark.** The oven and an open fire after dark with kids about. Mitigated by
  the keep-clear zone, named-crew-only at the oven, the 5:30 and close safety checks,
  and lit paths.
- **Cold and weather.** Hinterland winter evening. Jacket note in the comms and at the
  gate; the fire as the warm centre; a wet-weather plan for the pavilion if needed.
- **Capture lost.** The written record is the point of the night. One named capture
  lead, cards kept in a box, gathered before anyone packs down.

## Readiness gates (owned elsewhere, they can stop the night)

These live in `RECONCILED-20-june-public-open-day-2026-06-03.md` and the Notion launch
gates. Surface them honestly with the owner; none are claimed done here.

1. **Public liability insurance**, $20M minimum, bound in the trading entity's name,
   with a Certificate of Currency. **Hard kill-switch: no insurance, no event.** Owner:
   Ben and Nic.
2. **Entity name settled** (Harvest Pty vs A Curious Tractor Pty) with Standard Ledger.
   This blocks the insurance bind.
3. **Council food-safety call** (07 5475 7272). If not confirmed, **food locks to tea
   and water only and pizza falls away.**
4. **Pizza lead assigned.** Else tea and water. The `rsvp-pizza-dinner` count is the
   only real dough signal, so watch it.
5. **Extra hands** for a public, uncapped crowd.
6. **Parking plan** for an unknown public number (held in `02-open-afternoon.md`,
   matters into the evening as cars leave in the dark).
7. **Fire / oven / kids risk assessment** walked with the leads before the day.
8. **Day-of leads assigned:** launch owner, gate/welcome, parking/path, food/pizza,
   safety/incident, kids corner, comments/DMs, content/photos, close/reset.
9. **Member announcement sent** before any public push.

## Provenance

Built from `RECONCILED-20-june-public-open-day-2026-06-03.md` (the public open-day
decision, day shape, gates and tag map), the selling-system skill
`launch-runbook.md` and `par-sheet-template.csv` (the real menu, the ~60-bases-for-~40
planning estimate, par levels and cold-chain detail), `docs/strategy/launch-ops-run-sheet.md`
(food, service flow and close detail), and the sibling files `02-open-afternoon.md`
and `04-branding-and-signage-pack.md` (tone, structure and signage look). The ~60
bases for ~40 people is a planning estimate, not a headcount; the only real dough
signal is the `rsvp-pizza-dinner` count. Names left TBC where the source has them
unassigned. No turnout, attendance or build figures asserted, and no membership,
Mighty or done-claim made on the night.
