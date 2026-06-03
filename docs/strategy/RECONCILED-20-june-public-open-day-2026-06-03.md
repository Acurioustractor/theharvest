# RECONCILED: 20 June is a public open day (decision 2026-06-03)

> **Status: supersedes the private members'-day model.** Ben decided on 2026-06-03 that
> Saturday 20 June 2026 is a **public open day** ("the gate opens, everyone welcome"), per the
> `wip/june-20-page-2026-06-03` page work — NOT the private capped members' day described in
> `june-sprint-operating-plan-2026-06-02.md` and `launch-readiness-20-june-2026.md`.
>
> This note exists because two sessions built two contradictory events one day apart and never
> reconciled. Read this before touching any 20 June comms, social, GHL, or page work. Where this
> note and an older strategy doc disagree, **this note wins** until Ben says otherwise.
>
> Decision made eyes-open to the trade: more reach, but unknown public turnout to plan insurance,
> capacity, parking and dough against, 17 days out. Those become the things to manage (see Gates).

## What changed (supersession table)

| Surface | OLD (2-Jun private members' day) | NEW (public open day) |
|---|---|---|
| Audience | Capped: makers AM (18) + members PM (40) = 58, invite-only | **Open to everyone**, uncapped, public |
| Date publicity | "Public never"; channels stay date-light; after-story only | **Date is public.** Announced Sat 7 Jun on socials |
| RSVP surface | B1/B2 GHL booking calendars, members-first, never on public site | Public `/june-20` page with a one-tap **"I'm coming"** |
| Day shape | B1 maker session 10–2, then B2 afternoon + pizza **from 2pm** | One afternoon: gate **1pm** → two-questions → **pizza 5pm** → dark |
| Social plan | `content-calendar-june-2026.md` E/F/G/H — no post names the date | **6 dated public teaser posts** in `june-20-copy.md` (4–19 Jun) |

## Three open sub-decisions (do NOT silently resolve — Ben's call)

1. **Pizza time: 5pm or 2pm?** The public page and all of `june-20-copy.md` say **pizza from 5pm**
   (gate 1pm). The 2-Jun emails (Notes 02/03, Makers' invite) and the B2 calendar say **from 2pm**.
   → *Recommend: lock 5pm to match the public page* (it's the one going out widest). Then update
   Harvest Note 02/03 + Makers' invite + the B2 calendar label to "from 1pm, pizza from 5pm".
2. **Members-first courtesy.** Public dated **announce is Sat 7 Jun**; member **Harvest Note 02 is
   Tue 9 Jun** — so the public hears the date *two days before* members. That breaks the "members
   hear first" promise the member list was built on. → *Recommend: send Harvest Note 02 on **Fri 6
   Jun** (before the 7 Jun public announce), or hold the 7 Jun announce to 9 Jun.* Pick one.
3. **The maker morning (B1, 10–2).** It has no place in the single-afternoon public page. Options:
   (a) keep it as a **private pre-session** for makers/doers before the 1pm public gate and don't
   promote it publicly; (b) fold makers into the public afternoon (personal invite to "come from
   1pm"); (c) drop it. → *Recommend (a):* the maker 1:1 outreach + a quiet maker hour still has
   real value and Nic can lead it; it just isn't a publicly-promoted capped session anymore.

## Surface-by-surface aligned actions

### 1. The page (`client/src/pages/GardenLaunch.tsx`) — SHIP IT
- It is built, fact-correct, typecheck-clean, but **unmerged** (4 commits ahead of main) and
  **`IM_COMING_URL` is still `""`** (verified 2026-06-03). Public open day means it goes live and
  **indexed** (no noindex).
- **Action:** wire `IM_COMING_URL` (see GHL §3), then merge `wip/june-20-page-2026-06-03` → `main`
  (auto-deploys to theharvestwitta.com.au). This is the one Tier-3 "deploy" step — needs Ben's go.
- Fix the **idea path** before ship: `IDEA_URL = /get-involved` defaults to the residency tab. Add
  the `?form=idea` deep-link (or point at a dedicated idea capture) so "Share an idea" lands right.

### 2. Social — run the page's 6-post series, retire the date-light plan
- **Authoritative now:** the 6 dated public posts in `docs/content/june-20-copy.md` §4 (Wed 4 Jun
  tease → Fri 19 Jun eve). One visual signature, real Harvest photography, consent gate on faces.
- **Superseded:** `content-calendar-june-2026.md` social posts E/F/G/H ("no public date / members
  hear first"). The Wk3–Wk4 shop/garden/people posts (A–D, the 1–7 Jun daily run) **still stand** —
  they don't name the date and warm the ground. Only the date-suppression posts retire.
- **Action:** schedule the 6 posts in GHL Social Planner with approved real media. First post (4
  Jun tease) is **due now**. After scheduling: `npm run sync:social -- --pull-ghl --apply`.

### 3. GHL — reuse what's built, don't duplicate it
- **Verified live (queried 2026-06-03):** pipelines *The Shop pipeline*, *Harvest Membership
  Journey* (Curious→Steward), *Harvest Inbox*.
- **Per 2-Jun handoff (not re-verified this session):** B1/B2/shop-chat **calendars live** with real
  booking links; all required tags present; connector reauthed (1,152 contacts).
- **"I'm coming" wiring — the key reconciliation:** the public one-tap should reuse the existing
  headcount rails, not create a parallel one. Build a GHL **Trigger Link** "Pizza RSVP — I'm coming"
  (redirect → /june-20) + a *Trigger Link Clicked* workflow that adds **`rsvp-pizza-dinner`** +
  **`witta-gathering-2026-06-20`** (re-entry OFF). Paste that link into `IM_COMING_URL`. This keeps
  the dough count flowing through the same `rsvp-pizza-dinner` tag the B2 calendar uses, so
  `npm run count:rsvps:ghl` still reads the headcount. **Do not** also push the B2 booking-calendar
  link onto the public page — pick one RSVP surface (the trigger link) to avoid two headcount sources.
- Optional: an "I'm coming" tag can also drop the contact into *Harvest Membership Journey* at
  **Curious** if you want RSVPs to become a nurturable list. Tag-only is fine for launch.
- Tag map for the day (unchanged): `rsvp-pizza-dinner`, `witta-gathering-2026-06-20`; produce →
  `interest:markets` + `role:supplier` + `project:act-hv`; ideas → `idea:witta-2026-06`; feedback →
  `feedback:witta-2026-06`. **Do not** add `harvest-member`/`harvest-newsletter` via an RSVP — a yes
  is not a subscribe.
- Calendar→tag workflows + campaign sends still need the **GHL UI** (the API can't build them).

### 4. Comms / email — keep the chain, re-time and re-word for public
- Six templates exist. **Field Note (Wk4, public shop story)** stands as-is (no date). **Makers'
  invite** + **Harvest Note 02/03** need the time fixed (sub-decision 1) and Note 02 re-timed
  (sub-decision 2). With the date now public, Notes 02/03 can carry the same public framing — members
  still get a personal note, just no longer an exclusive date.
- **Maker 1:1 outreach** (shop shelf — `harvest-shop-outreach-messages.md` + `harvest-shop-send-list.md`,
  5 batches, ~30 targets) runs **unchanged and independent** of the open day. It deliberately keeps
  the date out of cold copy; now that the date is public you *may* point warm makers to /june-20, but
  the consignment ask stays the lead. Move replies New interest → In conversation in The Shop pipeline.

## Gates (now public-scale — these kill the day)
1. **Public liability insurance** bound in The Harvest Pty Ltd's name, **$20M PL min** per lease.
   No insurance, no event. *Now sized against unknown public turnout, not a capped 58.* Owner: Ben + Nic.
2. **Pizza lead** — unassigned. Public turnout makes dough planning harder; the `rsvp-pizza-dinner`
   count is the only real signal — watch it.
3. **Food safety** position. 4. **Extra hands / roster** (more needed for an uncapped crowd).
   5. **Parking** for an unknown public number. 6. **Maker name + photo** for the Wk3 social (only
   fabrication-risk blank — needs a real on-site person, consent gated).

## Time-critical sequence before Ben departs 27 June
- **Now:** schedule social post 1 (4 Jun tease); fix idea deep-link; build the trigger link + workflow.
- **Before Fri 6 Jun:** wire `IM_COMING_URL`; **deploy** the page (Ben's "merge/deploy" go); decide
  sub-decisions 1–3; if honouring members-first, send Harvest Note 02 Fri 6 Jun.
- **Sat 7 Jun:** public dated announce post goes live.
- **Through 19 Jun:** run the 6-post series; Harvest Note 03 Fri 19; confirm all six gates.
- **Sat 20 Jun:** the day. On-site idea wall + produce + feedback capture sheets.

## Provenance
- Verified directly this session: GHL pipelines (get-pipelines), `IM_COMING_URL=""`, branch unmerged.
- From repo docs (attributed, not re-verified): B1/B2 calendars live, tags present, 1,152 contacts,
  6 email templates — per `june-sprint-operating-plan-2026-06-02.md` + the 2-Jun handoff YAML.
- Insurance state: **unverified** — confirm against the ACT insurance addendum before counting done.
