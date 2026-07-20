# Mighty Networks trial build sheet

> Written 2026-06-06. Ben's call: the team has the most experience with Mighty Networks, so
> Mighty trials FIRST; Circle Pro is the banked fallback if it fails
> (`circle-trial-build-sheet-2026-06-05.md` stays ready). Facts below verified 2026-06-06
> (sources in `community-platform-decision-2026-06-05.md` § Mighty re-check).

## When (REVISED 2026-06-06: trial already started)

Account created 2026-06-06 on accounts@act.place; **trial ends Jun 20** (collides with launch
day). Split the trial instead of wasting it:

- **Now to Jun 19, staff-only phase:** settings sweep + kill-questions 1-4 + CSV ferry test.
  NO member invites before the 20th (launch focus is sacred). If 1-3 fail, Mighty dies early
  and the post-launch week goes straight to Circle.
- **After Jun 20, demand phase:** invite garden crew + 5 warm members, watch for unprompted
  posts (kill-question 5). Needs the trial extended (ask Mighty support this week) or one
  cancellable month of Explore/Launch monthly.
- The "3 months free" annual sale ending Jun 20 is a pressure mechanic; never buy annual
  before the values gate answers.

## Plan tiers (corrected from the live pricing screen, 2026-06-06)

USD monthly / annual-rate: Explore $29/$26 (no automations, no courses, 3 hosts, 100GB) ·
Launch $79/$71 (events + basic automations, 5 custom fields) · Scale $179/$161 (intermediate
automations + **5,000 API req/mo — the own-scripts sync route exists at Scale after all,
correcting the earlier no-API-below-Pro finding**) · Growth $354/$319 (50k API req/mo).
All plans: unlimited spaces. **Buy-tier tree at day 14:** Explore (~A$530/yr) if belonging-only
and events stay 100% Humanitix (VERIFY during trial whether Events exist on Explore at all —
Launch's marketing copy implies events are Launch-gated) · Launch (~A$1,300/yr) if in-platform
member RSVPs matter · Scale only if automated sync ever earns its keep · nothing today.

## What the trial runs on

- The free trial runs on the **Growth** tier (fully loaded). The tier we would actually buy
  is **Launch (US$79/mo, ~A$1,440/yr)**, belonging-only scope.
- That means: anything Scale-gated (Zapier sync, the RSVP cap automation) will WORK during
  the trial and DISAPPEAR at Launch. Do not let the trial sell a feature the bought tier
  loses. Test them, note them, but judge against Launch.
- Launch scope: crew spaces + feed + photos + announcements. Sync to GHL = manual Monday CSV
  (member export + bulk-invite CSV exist on all tiers). All real events stay on Humanitix.
  Money never touches Mighty (its fee stacks on Stripe, GST is host-managed).

## Setup (day 1, ~2 hours)

1. Network with Harvest branding, custom domain if Launch supports the chosen subdomain shape.
2. Two spaces only: **Garden crew** and **The Shop makers**. No more. Sprawl kills trials.
3. One real event: the July work day. Set the cap automation at the real seat number to test
   it, knowing it is Scale-gated after trial.
4. Switch OFF everything switchable: Streaks off (Admin > Gamification > Streaks). Hunt for
   points / leaderboard / People Magic toggles and document what can and cannot be disabled.
5. Bulk-invite via CSV: the garden crew + 5 warm members from
   `thoughts/shared/circle-member-import-2026-06-05.csv` (the banked 45-contact list, reusable).
6. Post one welcome and one real question. Then stop seeding and watch.

## Kill-questions (any FAIL on 1-3 = stop, fall back to Circle)

| # | Question | Pass looks like |
|---|---|---|
| 1 | Can People Magic AI (matching, member suggestions, auto-engagement) be FULLY disabled? | A real off state, not just hidden surfaces. UNVERIFIED from docs, trial-only answer |
| 2 | With streaks off and the leaderboard hidden, does any scoring still show on members? | No member-visible points/levels anywhere |
| 3 | Elder login: can a non-technical member get in with just their email, no invented password? | One emailed step, in. Test with one real older member |
| 4 | Does the cap automation actually close RSVPs at N? | Closes at N. (Informational: Scale-gated, lost at Launch, events stay Humanitix regardless) |
| 5 | Who posts unprompted by day 10? | The demand test. Crickets = the member corner + WhatsApp were already enough |

## Decision rule (day 14)

- **Pass 1-3 + real unprompted activity** → commit Launch annual (~A$1,440/yr). Belonging
  moves in; WhatsApp crews coexist or migrate gradually; Monday CSV ferry starts.
- **Fail any of 1-3** → Circle Pro trial, same script, sheet already banked.
- **Pass 1-3 but crickets on 5** → no platform. The $0 stack stands (member corner +
  WhatsApp crews), question closes until the named reopen triggers fire.

## Standing rules (unchanged under every outcome)

Members hear first · broadcasts never add tags · no auto-climb, an RSVP is a headcount never
a rung · `lane:community` (Jinibara, elders, storytellers) never on any platform, consent
first · shelves through Square, tickets through Humanitix, belonging through GHL · paper is
a first-class input · tier rungs hand-set in GHL only, the platform never writes them.
