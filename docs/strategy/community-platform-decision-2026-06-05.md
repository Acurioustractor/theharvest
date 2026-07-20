# Community platform decision — GHL full system vs Mighty Networks and friends

> **SETTLED 2026-06-05 (third pass, staff-operator lens): NO community platform.** The walk
> through Susie's seat (`staff-operating-view-2026-06-05.md`) settled it: the operating system
> is four screens + paper (GHL · Square · Humanitix · WhatsApp · the wall), and a platform is
> a sixth surface that does none of the five staff jobs. Belonging is carried by contribution,
> recognition, crew WhatsApp, and our own site's member/photo walls. §v2 below (Circle
> architecture + trial sheet) stays BANKED, not active — reopen only on a named pain: crew
> chaos, >100 active members, paid-tier demand. v1's research tables remain valid facts.
>
> Written 2026-06-05. Question: should The Harvest build its full membership + shop + maker +
> events system in GoHighLevel, or move the community layer to something like Mighty Networks?
> Inputs: live GHL pull (this date), `harvest-audience-map-2026-06-03.md`,
> `GHL-completion-handoff-2026-06-03.md`, `ghl-member-segmentation-2026-05-27.md`,
> `harvest-shop-send-list.md`, `witta-market-hitlist.md`, and fresh platform research
> (pricing and capabilities cited inline, USD unless flagged).

## The lists, as of today (verified live)

| List | Count | State |
|---|---|---|
| Members (`harvest-member`) | 56 | 41 genuine joiners, 15 accidental old-footer auto-tags (downgrade list ready in `ghl-member-segmentation-2026-05-27.md`) |
| Shop pipeline (makers/producers) | 32 open cards | All at early stages. Populated since the empty 28-May pull. Warmth-ordered send list (4 batches) + Witta Market in-person hitlist cover the outreach |
| Whole location | 1,152 contacts / 160 Harvest | Shared ACT location, canonical tag vocabulary (`role:` `tier:` `lane:` `action:` `consent:`) |

Scale honesty: this is a community of dozens, headed for low hundreds. Every platform decision
below is priced against that, not against a creator audience of thousands.

## What the question is actually asking

Three different systems hide inside "community site":

1. **System of record** — who everyone is, which lane they are on, consent, money. CRM work.
2. **Events** — recurring in-person gatherings, RSVP, capacity, check-in, reminders.
3. **Belonging surface** — where a crew talks between work days.

Mighty Networks sells all three in one box. The Harvest already has 1 mostly built in GHL,
needs 2 properly, and already has 3 living on WhatsApp (the garden crew thread, 456 exports
deep). The comparison has to be made per-system, not platform-vs-platform.

## The platforms (researched 2026-06-05)

| | Cost/mo (USD) | Paid memberships | In-person events/RSVP | Shop support | Mobile app | Non-tech elders | Data ownership |
|---|---|---|---|---|---|---|---|
| Mighty Networks | $41–$425 + 0.5–2% fees | Yes | Good, no seat caps | None | Branded app ~$33k/yr (UNVERIFIED 2026) | Medium | Partial export |
| Circle.so | $89–$419 + add-ons ($99 email, $49 fields) | Yes | Strong (recurring + physical + CSV) | None | Branded = Circle Plus, custom $ | Medium | CSV exports |
| Skool | $9 (10% fee) or $99 (2.9%) | Subscription only, no one-off sales | Good meetups | None | Free app | High (simplest) | Limited, UNVERIFIED |
| GHL Communities | **$0 added** (in existing plan) | Yes, GHL/Stripe | **Weak: no native events feed** | GHL e-comm separate | LeadConnector free; branded +$49/mo | Medium | Full, already ours |
| Heartbeat | $49–$849 | Yes | Online-first | None | Scale tier only | Medium | UNVERIFIED |
| Bettermode | $499+ | Yes | Yes | None | Yes | Low | Full API |
| **Humanitix** (events only) | **$0 free events / ~2% paid** | No | **Best in class: check-in, waitlists, stall allocation** | Stall allocation | Organiser check-in app | High | Full attendee export |

Sources: Mighty pricing mightynetworks.com/pricing; Circle circle.so/pricing + help.circle.so
events KB; Skool skool.com/pricing; GHL supplygem.com/gohighlevel-communities + GHL support
gamification docs; Humanitix humanitix.com/au/pricing. UNVERIFIED items flagged in-line.

## Why a Mighty-style platform is the wrong shape here

1. **The operating model forbids their engine.** The audience map's hard rules are no
   auto-climb, no drip without relationship, rungs earned by doing, hand-read by a human,
   paper sheet over QR code. Mighty/Skool/Circle are engagement machines: gamification,
   leaderboards, algorithmic feeds, streaks. Skool's whole identity is XP and levels, which
   is literally "energy-score them," the thing lane 4 bans outright. Buying one means paying
   monthly for a machine whose core loop the philosophy prohibits switching on.
2. **The community lane can never live there.** Jinibara elders and storytellers are worked
   by hand under OCAP, consent-first, never a workflow. A third-party US platform holding
   that data is a sovereignty regression from a CRM we control and export freely.
3. **It splits the system of record.** GHL stays the CRM either way (shop pipeline, email,
   tags, the ACT-wide constellation). A community platform becomes a second silo with its own
   member list, drifting from day one.
4. **Cost against scale.** Circle properly equipped runs ~$190+/mo (Pro + email + fields);
   Mighty $99–119/mo. For 41 members that is $3–4 per member per month for software, paid
   from grant money, before anyone has paid a membership dollar.
5. **The hard part of this community is offline.** Barry and the old-timers are reached
   through the Rec Club and the RSL, never digital-only (locked gate in the launch playbook).
   No platform fixes the part that matters; the in-person rhythm does.

What the platforms ARE better at: a polished member-facing feed and event calendar in one
place. That gap is real and is handled below without a second subscription.

## The decision: GHL spine + Humanitix events + WhatsApp crews

### Layer 1 — GHL, system of record (already ~80% built)

Everything stays as designed in `GHL-completion-handoff-2026-06-03.md` and the audience map:

- **Four lanes**: public (leave be) · makers/users (Membership Journey, hand-moved) ·
  producers (Shop pipeline) · community (hand-worked, consent-first, never automated).
- **Pipelines** live: Harvest Membership Journey (Curious→Steward), The Shop pipeline
  (New interest→On the shelf), Harvest Inbox.
- **Money, when membership money starts**: GHL payments (Stripe, AUD, GST) for paid tiers.
  No platform transaction fee on top, against Skool's 10%/2.9% and Mighty's 0.5–2%.
- **Build queue unchanged**: P0 calendar→tag workflows, "I'm coming" trigger link, campaign
  re-times before 20 June; then shop nurture, maker smart list, silent receipts.
- **List hygiene from this review**: run the 15-contact accidental-member downgrade
  (remove `harvest-member`, keep `harvest-newsletter`) before any member-only money or
  member-only comms ship.

### Layer 2 — Humanitix, the recurring-events engine (post 20 June)

20 June runs on the already-built GHL calendars + trigger link. Do not change that 15 days out.

After the day, the rhythm becomes monthly work days, workshops, markets. GHL has no native
community events feed (calendars are 1:1 booking surfaces), and rebuilding a calendar + tag
workflow per event does not scale. Humanitix is Australian, free for free events, B-Corp,
and purpose-built for exactly this: capacity caps, waitlists, reminders, mobile check-in,
stall allocation for market days.

- Public events page on Humanitix, embedded/linked from the website's events page.
- Attendees flow back to GHL as tags (inbound-webhook workflow or Zapier; the exact
  connector needs a one-hour spike, UNVERIFIED which path is cleanest).
- Check-in on the day via the Humanitix organiser app replaces paper headcounts; the paper
  come-back/can-help sheet stays, because that is the relationship instrument, not admin.
- The no-auto-climb rule survives: an attendee tag is a headcount, never a rung.

### Layer 3 — WhatsApp crews, the belonging surface (already alive)

The bonding unit in the audience map is the crew/pod, not a feed. The garden crew already
runs on WhatsApp. Formalise that instead of migrating it:

- One WhatsApp group per crew (garden, art space, events/kitchen) with `pod:` tags in GHL
  mirroring membership so the record knows who is in what.
- The member monthly email (Harvest Notes) stays the broadcast channel.
- **Pilot GHL Communities only if** crews outgrow WhatsApp (cross-crew coordination pain,
  photo-sharing chaos, newcomers lost). It costs $0 to try, members use the free
  LeadConnector app, gamification stays OFF, and the data stays in our tenant. This is the
  Skool-shaped escape hatch without a second bill.
- **Revisit a dedicated platform (Circle, not Mighty) only when** paying members pass
  ~150–200 AND a real demand exists for an online space with recurring revenue to fund it.
  Circle wins that future on genuine recurring in-person event support; Mighty's branded
  app economics (~$33k/yr) never make sense at Harvest scale.

### Layer 4 — the website stays the front door

All intake forms already write tags/workflows into GHL (`harvest-ghl-tag-and-automation-map.md`).
Nothing moves. The events page later embeds Humanitix listings.

## What would change this answer

- Membership grows past ~200 paying and asks for an online home → trial Circle against a
  GHL Communities pilot, whichever the crews actually open.
- GHL ships a real Communities events module → Layer 2 may fold back into GHL.
- Humanitix integration spike fails (no clean webhook to GHL) → fall back to a weekly CSV
  import script; the decision still holds.

## Cost picture

| Stack | Added cost/mo | Notes |
|---|---|---|
| **Recommended** (GHL + Humanitix + WhatsApp) | **$0** | Humanitix free for free events, ~2% only on paid tickets; GHL already paid |
| + branded mobile app later | +$49 USD | Optional GHL add-on, only if LeadConnector branding grates |
| Mighty Networks path | $99–119 USD + fees | Second silo, engagement engine off-philosophy |
| Circle path | ~$190+ USD + fees | Best alternative if scale ever demands it |

## Sequence

1. Finish the P0 GHL handoff queue (launch-gating, 20 June).
2. ~~Run the 15-contact member downgrade.~~ DONE 2026-06-05 in canonical tags (`tier:member`
   removed, `tier:connected` added; verified counts + smart-list audience warning in the build
   plan §5). Tag schema note: flat `harvest-member`/`harvest-newsletter` are now 0 live —
   membership = `tier:member`, follow = `comms:harvest-newsletter`.
3. Land 20 June, hand-read the energy, sort the lanes (the day is the engine).
4. Post-launch week: 1-hour Humanitix spike (account, test event, webhook→GHL tag).
5. July: first recurring work day on Humanitix; crews onto named WhatsApp groups + `pod:` tags.
6. Review at ~150 active: does anyone actually want an online community space, or is the
   long table doing the job.

---

# v2 (same-day revision) — Circle as the community home

> Supersedes the v1 verdict above. Reframed on Ben's call: the question was never "what is
> cheapest," it was "what gives members a place to belong between work days." A CRM nobody
> logs into is plumbing, not a community site. Integration + UX facts below verified
> 2026-06-05 (sources in the research notes; UNVERIFIED items flagged).

## The architecture: three rooms, one record

| Layer | Tool | Job |
|---|---|---|
| **The home** | Circle (Professional, $89 USD/mo annual) | What members see: crew spaces, events calendar, directory with faces, work-day photos, paid tiers later |
| **The engine room** | GHL (already paid) | The single record: contacts, four lanes, tags, shop pipeline, Field/Harvest Notes, Stripe money plumbing |
| **The big-day gate** | Humanitix (free / ~2% paid tickets) | Public ticketed days only: open days, markets — check-in app, stall allocation, waitlists, GST |

The sovereignty line is unmoved: Jinibara, elders, storytellers are never on any platform.
The orbit rules survive: no gamification switched on, no auto-climb — Circle activity becomes
a SIGNAL into the Monday sweep, never an automatic rung.

## The sync (verified)

On Professional, Circle's native webhooks/Admin API are Business-plan ($199) gated; **Zapier
is the sync bus** (available on Professional; free tier or ~$20/mo at Harvest volume).

- **GHL → Circle:** contact tagged `tier:member` → Zap → Circle invite + add to space.
- **Circle → GHL:** New Member / New Event RSVP / New Post triggers → Zap → GHL tag
  (`event:<slug>-<date>` headcounts, activity signals for the sweep).
- **Humanitix → GHL:** "New Attendee" Zapier trigger (no native webhooks; API polling is the
  fallback). Same Zapier account.
- **Design rule:** RSVPs happen IN Circle and flow OUT. (Confirmed gotcha: Zapier can only
  set Circle RSVPs to "Invited", not "Going" — never push RSVPs in.)
- GHL keeps sending all email. Circle's email add-ons are not needed.

### Sync REVISED (same-day follow-up research, 2026-06-05)

**Drop Zapier entirely. Run the trial with manual CSV, no sync wiring.** Follow-up research found:

- Professional's ONLY API credential is a **Zapier-only token**. It cannot authenticate own
  scripts, Make, n8n, Pabbly, or Activepieces. Every scriptable route needs the Admin API
  token = **Business ($199) and above**.
  (help.circle.so/p/sso-and-integrations/api/create-an-api-token-in-your-community)
- No native Circle↔GHL integration exists in either marketplace (verified absence).
- The CSV lane is fully open on Professional: member export, event-attendee export, and
  bulk-invite upload are all plan-agnostic admin tools.
  (help.circle.so export-a-csv-of-your-members · access-event-attendee-list ·
  bulk-invite-members-to-your-community)
- GHL's own webhooks (inbound trigger + outbound Custom Webhook action, $0.01/exec, first
  100 free) are available on all GHL plans, but cannot reach Circle on Pro without Zapier.

**The pattern:** Monday sweep does the join. Export Circle member + RSVP CSVs, eyeball,
import to GHL; invite new members via bulk-invite CSV. Same hand-read discipline as the
Humanitix attendee decision, $0, nothing silently tags anyone. **Upgrade trigger restated:**
if manual CSV genuinely hurts, that pain buys Circle Business + self-hosted n8n or
Activepieces on existing pm2/cron infra. Never pay for Zapier on Pro.

## Events split (the Susie rule)

- **Members' rhythm → Circle events**: work days, crew sessions, member workshops. Hard seat
  caps CONFIRMED (18-seat sessions work). NO auto-waitlist — full is blocked, so anything
  that needs a waitlist goes to Humanitix.
- **Tickets, gate, or waitlist → Humanitix**: open days, markets, paid workshops.

## What a member feels

1. Joins on the main website (existing GHL form, unchanged) → invite email lands.
2. Web: `community.<harvest domain>` — custom domain CONFIRMED on Professional. Magic-link
   sign-in, no password to invent.
3. Phone: the generic Circle app (a branded app is enterprise-priced — skip), login by
   one-time emailed code. Type email, type code, in. RSVP + photos in-app, push reminders.
4. Inside: Garden / Art Space / Kitchen crew spaces, the events calendar as the heartbeat,
   member directory, photos in a home instead of a 456-export WhatsApp scroll.
5. UNVERIFIED: how much residual "Circle" chrome shows on the $89 tier — the trial answers it.
6. Money later: paywalls via Stripe in AUD CONFIRMED, GST via Stripe Tax integration.

WhatsApp crews migrate INTO crew spaces gradually (or coexist; the trial tells us which).

## Costs

| Item | Cost |
|---|---|
| Circle Professional (annual) | $89 USD/mo ≈ A$1,600/yr |
| Zapier | $0–20 USD/mo |
| Humanitix | $0 (free events) / ~2% paid tickets |
| Circle add-ons (email $99, custom fields $49) | **$0 — skip, GHL does both** |
| Upgrade trigger | Business $199 only if Zapier chafes (native automations + API) |

At a paid membership of ~A$60/yr, ~30 members cover the Circle bill.

## The deciding move: a real trial, not a spec sheet

14-day Circle trial, after 20 June (never before — demo-eve rule):
1. Stand up 2 spaces (Garden, The Shop makers) + 2 real events (July work day, a crew session).
2. Custom domain on, magic-link invites to the garden crew + 5 warm members.
3. Run the two Zaps (member-in, RSVP-out). Watch who posts without being asked.
4. Decide on evidence: if Witta locals open it and RSVP, commit annual. If it's crickets,
   fall back to v1 ($0 stack) having spent nothing.

## The orbital test (2026-06-06, the frame that settles build order)

GHL is the sun (single record); every surface is an orbit whose only job is keeping the
record true. Signals flow IN weekly (the sweep is the orbit-collector); only invites flow
OUT. Rank orbits by connection cost: **website = native (forms already wired, $0) ·
paper/WhatsApp = sweep-read · Humanitix = weekly CSV ferry (decided) · Circle/Mighty = same
ferry + ~A$1,500/yr + a new login per member.** The website is the underused orbit: it is
"member corner", already item 6 on the build list, owned, natively connected, and ACT's core
competence. **Order that follows: member corner + WhatsApp crews first; a paid platform only
when members ask for what the corner cannot do; at that point Circle Pro has already won the
head-to-head (see re-checks below).**

## GHL Communities re-check (2026-06-06, the named reopen trigger half-fired)

v1 rejected GHL Communities for having "no events module." Re-verified 2026-06-06: **Community
Events now exist** (free/paid, recurring, reminders, gating, Live Rooms — shipped late 2024,
help.gohighlevel.com/.../155000004111) **but the in-person operational layer is still absent**:
no seat caps, no waitlist, no check-in, **admins cannot see or export who RSVP'd**, and no
RSVP workflow triggers (all open ideas-board requests). Humanitix would still run every real
event.

**New finding, dealbreaker-grade: gamification cannot be switched off.** Points/badges/9
levels/leaderboard are built in with no disable toggle ("turn off leaderboard" = open request;
only workaround is CSS-hiding the button while points accrue underneath:
help.gohighlevel.com/.../155000002487). Silently scoring member activity violates the same
rule that disqualified Skool. Member-side positives confirmed: magic-link login (best path
for non-technical members), custom domain, group-scoped moderator roles with no CRM access,
$0 added cost. CRM-native integration is real for group ACCESS only (granted/revoked
triggers); posts/comments/RSVPs touch nothing.

**Standing:** GHL Communities stays the $0 fallback, not the home. Decision unchanged:
Circle Pro trial (CSV lane, no Zapier) is the test of member demand.

## Mighty Networks re-check (2026-06-06, fuller facts than the v1 table)

v1's "no seat caps" was half right. Verified 2026-06-06 (faq.mightynetworks.com host docs):
RSVP lists ARE admin-visible + CSV-exportable; attendance CAN be capped via an automation
("Event reached N RSVPs → close RSVPs") but ONLY on Scale ($179/mo USD) and above; still NO
waitlist and NO door check-in. **Tier honesty (corrected same day):** for belonging-only
(crew spaces + feed, manual Monday CSV, all real events on Humanitix) the tier is **Launch
$79/mo ~A$1,440/yr, marginally cheaper than Circle Pro**; Scale $179/mo ~A$3,260/yr applies
only if automated GHL sync or in-app seat caps are wanted (Zapier and the cap automation are
Scale-gated). Sync: Zapier needs Scale. CORRECTION 2026-06-06 from the live pricing screen:
**Scale includes 5,000 API req/mo** (Growth 50k), so an own-scripts route exists at $179
after all, not only at Mighty Pro; and a cheaper **Explore tier ($29/$26)** exists,
spaces/feed only, no automations, 3 hosts (whether Events exist on Explore = verify in
trial). People Magic AI (matching, suggestions, streaks) is now the headline product;
streaks toggle off but there is NO master gamification off-switch, and whether AI matching
fully disables is UNVERIFIED (trial-only question). Review consensus 2025-26: interface
overwhelm for non-technical members. **Standing REVISED 2026-06-06 (Ben's call): the team's hands-on
experience is deepest with Mighty, so Mighty trials FIRST, w/c 23 June, per
`mighty-trial-build-sheet-2026-06-06.md` (kill-questions 1-3 are the values gate: People
Magic fully off, no residual member-visible scoring, elder login). Circle Pro is the banked
fallback; no-platform stays the outcome if demand never shows.**

## What stays true from v1

- GHL P0 queue + the build plan (`simple-system-build-plan-2026-06-05.md`) proceed unchanged —
  every piece (tags, pipelines, welcome flows, Monday sweep) feeds Circle rather than
  competing with it. The build plan's Phase 2/3 get revised post-trial: Circle events replace
  most of the Humanitix plan; WhatsApp pods become Circle spaces if the trial lands.
- Mighty Networks stays rejected (no event seat caps, weak moderation, branded-app economics).
- Skool stays rejected (single space, subscription-only payments, gamification-as-identity).
- GHL Communities stays rejected as the home (no events module) — fallback only.
