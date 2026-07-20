# The Harvest system review: website, forms, GHL, email, people, social

Written 2026-07-06 from a full audit: every routed page and form in this repo, the live
GHL configuration (tags, pipelines, all workflow IDs, Social Planner), the live contact
list (id-level, via the contacts API), Ben's Gmail (60-day window), the Supabase project
(tednluwflfhxyucgwigh: edge functions, logs, capture tables), the docs layer in this
folder and docs/strategy/, and the public Facebook and Instagram pages. Sources are
cited inline. Anything not verified is listed in "Still unverified" at the end.

Companion capture: `social-posts-capture-2026-07-06.md` (every post, all channels).

## The one-line verdict

The list is real and growing (255 contacts, 135 members, 91 added since 1 June), the
core forms work, and the venue is running a weekly pizza rhythm. But the reply desk is
unowned while Ben is away, three capture paths silently lose messages, members have not
heard from us since 14 June while social followers get weekly updates, and the website
still tells visitors nothing is on. The system is 80 percent built and 50 percent run.

## Decisions locked in this review

1. **GHL Social Planner is the publishing desk** (Ben, 2026-07-06). All posting goes
   through GHL first. Native posting on Facebook or Instagram is the exception, not the
   rule. No Meta API integration for now; the logged-out browser pull covers occasional
   native-post review.

## What provably works (leave it alone)

| Flow | Evidence |
| --- | --- |
| Contact form end to end | /contact -> contact-form edge fn v28 -> GHL contact + message in notification email. Fix verified 3 Jul (test send, body inline) |
| Membership join | /membership -> newsletter.subscribe -> tier:member + Member Welcome workflow (19cc358a, published). 135 members, 112 via this form |
| Footer newsletter follow | -> Follow Welcome workflow (0cf2479e, published). 19 tier:connected |
| Member question | members.question -> receipt workflow 62aa2b50, published; errors surface to the visitor |
| Shop interest | shopInterest.submit -> receipt ff4ff43e + Shop pipeline. Real lead Mari L, 3 Jul |
| GHL to Supabase sync | ghl-webhook v24: 48 of 48 success in ghl_sync_log since the 3 Jul fix; daily error emails stopped |
| Photo wall capture | 19 contacts tagged; QR PNGs decode to the right live URLs; admin mutations gated |
| Email delivery from hi@act.place | 14 Jun members email confirmed received (member reply 15 Jun) |
| Instagram publishing via GHL | Pizza weekend posts published 1 and 3 Jul from the Planner UI |
| The list itself | 255 deduped contacts, all carrying project:act-hv; 0 DND; clean segments (below) |

## The people we have engaged (live GHL, 2026-07-06)

3,206 contacts in the shared ACT location; 255 are Harvest (project:act-hv is the
universal marker). 91 added since 1 June, 22 since opening day.

| Segment | Size | Note |
| --- | --- | --- |
| Newsletter audience | 154 (+1 legacy) | comms:harvest-newsletter. Contains 3 live TEST contacts; Helen K stranded on the legacy tag |
| Members (free) | 135 | tier:member, identical set to interest:membership |
| Event interest | 134 | declared at signup, not RSVPs. All actual RSVP and attendance tags sit at zero |
| Workshop interest | 100 | recruiting pool for art space programming |
| Volunteer interest | 64 | the work-day recruiting pool. action:volunteered = 0 |
| Needs-reply inbox | 47 | harvest-inbox: people whose signup carried a comment or question |
| Local Witta residents | 38 | source:local-witta |
| Shop suppliers pipeline | 28 prospects | 4 follow-up, 3 stage-1, 1 consignment |
| Photo wall contributors | 19 | same set as harvest-gathering-photos |
| Mighty members | 25 | NOT mirrored into GHL (zero platform:mighty-* tags) |

Data hygiene before the next send: delete the 3 test contacts, retag Helen K, fix
"Karl &" (couple in one name field), merge the Bernard D duplicate (UI only, the API
cannot merge), review Bek. 12 contacts have no first name; 3 shop prospects have no
email.

## Where messages come in, and where they leak

23 capture paths exist. Five work end to end (table above). The leaks:

**Silent loss (visitor sees success, message can vanish):**
- community-submit edge function, which carries /venue-hire and all five /get-involved
  forms: returns success even when the GHL write fails, and its fallback inserts target
  three tables that do not exist in the database (community_ideas,
  residency_applications, business_interest). Confirmed against live schema.
- contact-form and newsletter-subscribe write only to GHL, no database row, so an
  outage loses the message with no trace (contact_submissions has 1 row ever).

**Reachable but nobody answers (the biggest one):**
- Every form notification lands only in benjamin@act.place, and Ben is overseas until
  15 Aug with a vacation auto-reply. Unanswered as of today: Asha Hay (contact form,
  3 Jul), Mari Lloyd ceramics (3 Jul), Victoria Palmer exhibition proposal (3 Jul),
  Maleny Garden Club Spring Fair for 3 Oct (waiting since 15 Jun), Bond Uni NFP pilot
  (3 unread), Amelia Clifford ongoing-support question (17 Jun). The Harvest Inbox
  pipeline exists in GHL with the right stages; nobody works it.

**Built but disconnected:**
- Community pulse survey: page exists, has no route, and its table (pulse_responses)
  does not exist in the database. The planned post-opening feedback channel cannot
  receive a single response.
- Pizza-night RSVP: social promotes three sessions a week; the only RSVP path is a
  Mighty share link in captions. The RSVP Pizza Dinner workflow in GHL is still DRAFT,
  eoi.submit has no form mounted, and RSVP tags are all zero.
- Event submission and business registration receipts: env vars unset, so submitters
  hear nothing (designed copy already written in ghl-workflow-build-specs.md).
- Photo wall receipt workflow: GHL_PHOTO_WALL_WORKFLOW_ID points at a workflow that
  does not exist in live GHL, and the trigger fails without throwing.
- Two of eight .env workflow IDs are dead (EOI, photo wall); two envs the code reads
  are set nowhere (event submit, business reg).

**Website vs reality:**
- The venue is open with weekly activity, but the live nav has no What's On link;
  /whats-on, /get-involved and /venue-hire are orphaned pages with no nav shell. About
  nine routed public pages dead-end without navigation.
- GardenLaunch links a dead Facebook vanity URL and a nonexistent Instagram handle
  (verified 404). The real accounts: facebook.com/profile.php?id=61587776558599 and
  instagram.com/theharvestwitta.
- The /june-20 recap page still renders placeholder photos, while 12 or more real
  opening-night photos sit on the 22 June Facebook post (89 reactions).
- Sophie privacy purge is committed locally but NOT deployed; her image was still live
  at a production URL when checked this session. This is a commitment to a named
  community member and ships with the next deploy.

**Email reality (Gmail, 60-day window):**
- Members last heard from us 14 Jun (pre-open welcome). Note 04 "The gate is open" was
  staged 2 Jul and remains unsent. Social followers meanwhile get weekly updates, which
  inverts the "members hear first" principle.
- hello@theharvestwitta.com.au receives real inbound with no observed outbound and no
  named owner. hi@theharvestwitta.com.au was used ad hoc by Nic once (10 Jun).
- Sending domain is still hi@act.place; the designed Harvest sender
  (send.theharvestwitta.com.au) is unimplemented. Gmail shows one contradiction to
  settle: a thread describes Sue McGary as the first PAID member (15 Jun), while GHL
  shows zero paid tiers. Check what she paid and through what before the tier decision.

**Social (GHL Social Planner, 101 posts in the live planner):**
- July pizza posts were created in the Planner UI and published to Instagram, but 5 of
  the last 10 Facebook attempts FAILED: the Facebook page connection needs
  reconnecting. This is the single blocker to the locked GHL-first strategy.
- The repo script scripts/report-ghl-social.ts sees only 15 of the 101 posts (it uses
  the OAuth app path, which appears to return only API-created posts, not UI-created
  ones). Fix: use POST /social-media-posting/$LOC/posts/list with skip and limit as
  JSON strings (numeric values return 422; verified this session).
- Sitting in drafts: the Sophie story post (consent flag, review against the July
  privacy decision before anyone publishes), five April garden posts, and 5 Google
  Business Profile posts from 29 Apr that never published.
- Both profile bios still carry the pre-May line "Garden, Kitchen, Art Space";
  Facebook claims "Always open" and category "Museum"; Instagram is categorised
  "Restaurant"; the public FB contact is benjamin@act.place.

**Tag and doc drift:**
- Around 10 hyphen/colon tag twins coexist (interest-garden vs interest:garden and so
  on); older runbooks name tags that are not the live canon; the two-board pipeline
  decision is contradicted by a live third pipeline (Harvest Membership Journey, with a
  same-named published workflow). Either document it or retire it.
- Three price positions exist for the supporter tier: $30 a week already told to 25
  Mighty members, $20 a week in the selling-system skill, and "never name a price" in
  the comms map. One person has possibly already paid (see Sue McGary above).

## The target operating system (what world class looks like here)

One loop, run weekly, owned by named people. Every piece below already exists in some
form; nothing here is a new build except where marked.

```
CAPTURE            LIST              REPLY             PROGRAMME          PUBLISH           RETURN
on-site QR,   ->   GHL tags     ->   Harvest Inbox ->  next dates    ->   GHL Planner  ->   members hear
forms, gate        one canon         daily desk        decided weekly     (all channels)    first, come back
sheets                               15 min/day        Mighty first                         to a date
```

- **Capture**: every physical moment has a digital edge: photo wall QR, pulse QR (once
  routed), gate sheet with consent column, named photo owner per event.
- **List**: GHL is the one system of record. Mighty membership mirrors back as tags in
  a Monday sweep. Colon-namespaced tags are canon; hyphen twins retire.
- **Reply**: the Harvest Inbox pipeline is a daily 15-minute desk owned by a named
  person on the ground (Nic now, steward later), replying from a Harvest address.
  Nothing waits more than 2 days.
- **Programme**: dates decided in the weekly rhythm, posted to Mighty first (members
  hear first), then /whats-on, then socials. Every event gets an RSVP path that lands
  a tag in GHL.
- **Publish**: GHL Social Planner only (locked decision). Facebook reconnected. The
  weekly content loop from THIS-WEEK.md restarts: capture on site, add to Empathy
  Ledger, draft in GHL, publish best, newsletter monthly, Notion records after.
- **Return**: the newsletter and members page carry every next date; the after-story
  photos become the public proof; feedback (pulse) closes the loop.

Physically: printed QR posters at gate, shop and pizza oven; a laminated day sheet for
staff (open, greet, capture, close); the gate sheet and question wall at every event;
Dennis and the stewards holding the desk rhythm without needing a laptop, via the
LeadConnector app.

## The implementation list

Ordered. Owner in brackets. Day-shift items need a human; night-shift items are safe
for Ben or an agent to do remotely without touching money or sending anything.

### This week, day shift (mostly Nic and stewards, Ben remote where marked)

1. Take the reply desk: Nic answers Asha Hay, Mari Lloyd, Victoria Palmer today, then
   works the remaining unanswered list (Maleny Garden Club before it goes stale, Bond
   Uni, Amelia Clifford). Record a GHL note per reply. [Nic]
2. Reconnect Facebook in GHL Social Planner settings and republish the failed weekend
   posts. Confirm which page connection expired. [Nic or Ben remote, 15 min]
3. Send Note 04: clean the audience first (delete 3 test contacts, retag Helen K),
   re-run npm run audit:contacts:ghl, dry-run then apply the draft script, test-send to
   a phone, human send from the GHL campaign UI per the runbook. Include the next pizza
   dates so members finally hear first. [Nic sends; Ben preps remotely]
4. Publish the next 2 to 3 dates everywhere: Mighty first, then socials via GHL. (The
   pizza rhythm already exists; this is writing it down.) [Nic + Dennis]
5. Opening photos: download the 12+ photos from the 22 June Facebook post (page admin
   has originals), consent-check, upload via /admin/media-library. Unblocks /june-20,
   home, gather, and the newsletter after this one. [Nic or whoever shot them]
6. Locate the 20 June paper records (gate sheet with consent column, question wall
   answers). Photograph and transcribe, or record the loss and adopt the standing
   capture rule at the very next event. [Nic + stewards]
7. Give staff the desk: GHL logins or LeadConnector app for Dennis and stewards, plus
   agreement on who owns hello@theharvestwitta.com.au. [Ben remote, provisioning]

### Ben digital batch, night-shift safe (one focused block, then deploy)

8. Deploy the Sophie purge (commit is local; production still serves her image). Then
   review or kill the Sophie draft in Social Planner. [privacy commitment, first]
9. Fix community-submit: one community_submissions table, write the DB row before the
   GHL call, return an error when both fail. Same fallback-row pattern for contact-form
   and newsletter-subscribe.
10. Route the pulse survey: npm run db:push to create pulse_responses (clears the wider
    schema drift too), add the /pulse route, generate a QR poster for on site.
11. Navigation pass: What's On and Get Involved into SiteNav and SiteFooter; shared nav
    shell onto the nine orphaned pages; fix the dead social links in GardenLaunch;
    route or remove /social; canonical redirects for the duplicate home aliases.
12. RSVP path: publish the RSVP Pizza Dinner workflow (currently draft), re-point
    eoi.submit with a configurable event date or a GHL calendar, and mount a small RSVP
    form on /whats-on. Mighty link stays in captions; GHL becomes the record.
13. Workflow wiring: rebuild or re-point the photo wall receipt workflow; build receipt
    specs 1 to 5 from ghl-workflow-build-specs.md (copy pre-written); set
    GHL_EVENT_SUBMIT_WORKFLOW_ID and GHL_BUSINESS_REG_WORKFLOW_ID in the serving Vercel
    project; delete the two dead env vars; find the "New Inquiry" template that sends
    content-free notifications and add the message body.
14. Fix report-ghl-social.ts to read the full planner (string skip/limit pagination) so
    the weekly review sees UI-created posts. Add the failed-post check to the Monday
    review.
15. Resolve the Vercel project identity three-way ambiguity (.vercel/project.json says
    witta-swot-analysis, CLI says the-harvest, CLAUDE.md says
    the-harvest-community-hub) and verify the production env list against it.

### Systemise, next two to four weeks

16. Tag canon sweep: retire the hyphen twins in GHL, banner-correct the stale runbooks,
    execute the TODOS.md tag cleanups. One session.
17. Mighty mirror: apply platform:mighty-active to the 25 members, adopt the Monday
    sweep, fix the renamed Mighty spaces, then the producer re-engagement sends.
18. Restart the weekly content loop with GHL as the desk (THIS-WEEK.md pattern):
    capture rule at every event (named photo owner, about 10 photos, consent at
    shooting), Empathy Ledger intake, GHL drafts, publish best, Notion record after.
19. Contact hygiene as a monthly habit: prepare:contacts:ghl, merge duplicates in the
    UI, review the no-name and no-email rows.
20. Update the social profiles to the current story: bios to "garden, events and art
    space", fix the Facebook category and "Always open" hours, decide the public
    contact address, publish or delete the 5 Google Business drafts.
21. Profile page copy on the website: /membership mentions no supporter tier until the
    price decision lands (see 22).

### Decisions only Ben can make (the blocked list, updated)

22. Supporter tier price: $30 a week is already public on Mighty and someone may have
    paid (check the Sue McGary thread and Mighty payments first). Settle it or
    explicitly strip the price from Mighty.
23. Sending domain: accept hi@act.place for Note 04 (recommended, it delivered fine on
    14 Jun) and schedule the Harvest subdomain properly; also name an owner for
    hello@theharvestwitta.com.au.
24. Visiting arrangements: is there a reliably open day yet? The pizza rhythm suggests
    yes in practice. One sentence unlocks /contact, the footer, and the Facebook hours.
25. Venue-hire reality: which spaces, honest capacity. Until then the page stays an
    enquiry door (which currently leaks; see item 9).
26. The 20 June debrief paragraph (with Nic): one honest paragraph unlocks the recap
    page, journey timeline, and newsletter copy.

## Still unverified (say so, do not guess)

- Whether Nic separately answered the landlord inbound (about 28 Jun) or Victoria
  Palmer from his own mailbox: only Ben's mailbox was audited.
- The Shop pipeline board state in the UI (API returned zero opportunities while the
  receipt workflow verifiably created cards on 30 May); whether Mari L has a card.
- Which Vercel project serves production, and the deployed commit identity.
- Whether the 21-workflow API list paginates (affects the two "not found" IDs).
- Mighty internals (payments, plans, spaces) and the "Needs review (2)" GHL workflow.
- Whether QR posters are physically printed and placed; qr-website.png failed to
  decode locally and should be phone-tested before printing.
- Phone and SMS: +61 468 052 660 is live in GHL; unread conversations were not audited.
- event_registrations activity in the shared DB is CONTAINED Adelaide, not Harvest
  (verified by row inspection this session); Harvest RSVP capture remains at zero.
