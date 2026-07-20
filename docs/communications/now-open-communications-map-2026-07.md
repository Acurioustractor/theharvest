# The Harvest is open: one story, every surface

Created 2026-07-02, twelve days after the first members and makers day. This is the
single source for how we talk about The Harvest now that it is open. Every surface
(website, newsletter, Mighty, socials, replies to enquiries) tells this story the same
way. Edit here first, then push outward.

Provenance: verified facts only. Sources are the Week 9 Monday status (Notion, 2026-06-29,
"Event delivered 20 Jun"), the producer re-engagement review (2026-06-27), Ben's replies
to visitor enquiries (30 Jun), and the strategy docs in this folder. Anything not listed
under "What we never say" has a source. When in doubt, cut the claim.

## The story in one paragraph (the spine)

The gate opened on Saturday 20 June. The Harvest is a community garden and creative
gathering place in Witta, on Jinibara Country, growing where the old Green Harvest
nursery stood for decades. It is open, and it is not arriving finished. That is the
point. You do not need to book to come and have a look while we find our feet. The
garden grows through regular work days, the first shop shelves are being shaped with
local makers and growers, and the art space is finding its shape. Members hear first,
every time.

## The three doors (every surface offers these, in this order)

1. **Join the members page.** Upcoming events land there first, you can RSVP there,
   and you can message us directly. Membership is free. Website door: /membership.
2. **Come to a work day.** The garden grows through regular work days. Reply to any
   email, or message us on the members page, and we will say when the next one is.
3. **Put your hand up for the shop.** The first shelves are being shaped with local
   makers and growers. An expression of interest starts a proper conversation, not a
   mailing list entry. Website door: /shop.

## Next phases, by area

Each area has a "now" (safe to say anywhere), a "next" (safe as intent, no dates), and
a "not yet" (do not say until the blocking fact clears).

### Shop
- **Now:** first shelves being shaped with local makers and growers. Every expression
  of interest gets a real conversation. Susie and Joey steward it.
- **Next:** real names on the shelf, starting small, short opening windows when it is
  ready. The maker keeps most of the sale.
- **Not yet:** hours, stock lists, consignment percentages, prices, an opening date.
  (Internal: the parked shop P1s are the Square ongoing model, consignment split and
  GST treatment, weekend hours and shift model, shop nurture workflow, first-shelf
  makers. See the producer re-engagement doc for the one-producer smart list.)

### Garden
- **Now:** growing through regular work days. Always "work days", never "working bees".
- **Next:** seasonal planting, the kids area shaped by kids, more hands on the place.
- **Not yet:** a fixed weekly schedule or open hours. Nothing is published anywhere.

### Events and gatherings
- **Now:** the first members and makers day happened on 20 June. Gatherings and shared
  meals are how the place works. New dates land on the members page first.
- **Next:** more work days, more shared meals, gatherings as the rhythm settles.
- **Not yet:** the next date (none is scheduled in any source), attendance claims from
  20 June, or any detail about how the day ran until Ben or Nic writes the debrief.

### Art space
- **Now:** finding its shape. Artists shape the art space; that is the co-design ethos.
- **Next:** first making sessions and residency ideas as what-is-forming.
- **Not yet:** residency counts, workshop schedules, named artist commitments, prices.

### Membership
- **Now:** free, and it stays the front door for hearing first. The members page
  (Mighty) is live: events, RSVPs, direct messages.
- **Next:** members bring a neighbour; the after-story photos become the public proof.
- **Not yet:** any paid tier or price. The supporter tier design is unresolved
  ($20/wk in the selling-system skill vs $30/wk on a pre-event Mighty plan). Never
  name a price until Ben settles it.

## Surface map (edit where the thing lives)

| Surface | Job | Source of truth |
| --- | --- | --- |
| Website | Evergreen truth: what this is, what you can do, the three doors | This doc drives page copy; pages live in the repo |
| GHL email (Harvest Notes) | The pulse: Note 04 "The gate is open" is next | `docs/communications/post-opening-newsletter-2026-07.md` runbook + `scripts/draft-post-opening-newsletter-ghl.ts` |
| Mighty members page | Conversation, RSVPs, events land here first | Mighty itself; mirror decisions back to GHL tags per the producer doc rules |
| Socials | The after-story: photos once collected, honest in-progress framing | Posting queue in Notion; never post attendance claims |
| Enquiry replies | Ben's verified formula: no booking needed while we find our feet, join the members page | GHL Harvest Inbox pipeline; replies can take a few days |

## What unlocks stronger copy (the blocked list)

Each of these is one answer away from better communication. Until answered, the copy
stays as shipped.

1. **Opening-day photos.** None exist in the repo or Empathy Ledger. Who shot the day,
   and can they be uploaded with consent? Upload path: /admin/media-library (or the
   bulk script precedent `scripts/upload-harvest-may-photos-el.ts`). Photos flow into
   the journey gallery automatically and slot into the home, /june-20 recap, /photo-wall
   and /membership pages.
2. **A one-paragraph debrief of 20 June** from Ben or Nic (what ran, roughly who came,
   one true moment). Unlocks recap copy on /june-20, /gather, the journey timeline,
   and the next newsletter.
3. **The next date** (work day, gathering, or pizza night). Unlocks every "what's on"
   surface. Post it to Mighty first, then everywhere.
4. **Visiting arrangements** once feet are found: is there a day the gate is reliably
   open? Unlocks /contact and the footer.
5. **Paid supporter tier decision** ($20/wk vs $30/wk vs not yet). Until then:
   membership is free, nothing else.
6. **Venue hire reality**: which spaces, what they are called, honest capacity.
   Until then /venue-hire stays an enquiry door.
7. **Sending domain**: Harvest Notes currently send from hi@act.place. Decide whether
   to move to a Harvest domain sender before Note 04 or accept it for now.

## Newsletter Note 04 (staged, human-sent)

- Audience: 147 contacts, tag `comms:harvest-newsletter` (plus one legacy
  `harvest-newsletter`), excluding `benjamin+` and `@act.place` test records.
  0 DND, 0 duplicates, verified 2026-07-02. One send covers members and followers;
  followers get the become-a-member door.
- Staging: `npx tsx scripts/draft-post-opening-newsletter-ghl.ts` (dry run) then
  `--apply` to create the GHL template. A human sends via the GHL campaign UI after a
  test-send. Never automated. Full runbook:
  `docs/communications/post-opening-newsletter-2026-07.md`.
