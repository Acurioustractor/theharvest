# Circle trial — build sheet

> Created 2026-06-05. The execution sheet for §v2 of `community-platform-decision-2026-06-05.md`.
> Everything below is prepped so the human part is one sitting (~45 min of clicks). Member
> import file is ready at `thoughts/shared/circle-member-import-2026-06-05.csv` (45 live
> `tier:member` contacts, pulled from GHL 2026-06-05, gitignored).

## 0. The one timing decision

A 14-day trial started today runs out **19 June, the night before the open day**. Two clean options:

- **A. Start now**: trial verdict lands pre-launch chaos; if it's working, pay the first month
  ($89) and let the open day drive sign-ups into a live community. Riskier attention-wise.
- **B. Start Mon 23 June**: trial runs 23 Jun to 7 Jul, fed by the open-day energy and the
  paper come-back sheet. The day becomes the recruitment engine for the trial. (Recommended.)

Everything below works for either.

## A. Circle setup (Ben's clicks, ~30 min)

1. **Account**: circle.so → Start 14-day trial → plan: **Professional** ($89/mo). No card
   tricks needed; trial is cardless.
2. **Community name**: The Harvest. Logo + the warm cream/linen palette from the brand kit.
3. **Custom domain**: Settings → Domain → `community.<harvest-domain>` (confirm the apex
   domain first). Add the CNAME Circle gives you at the DNS host. Confirmed available on
   Professional.
4. **Sign-in**: leave email magic-link ON (default). Members never invent a password; the
   mobile app logs in with a one-time emailed code.
5. **Spaces — only three to start** (a sparse community reads as dead; three full rooms beat
   eight empty ones):
   - **The Garden** (open to all members) — the garden crew's home. Seed it with 3 real
     photos from `compendium/` (consent-checked) before anyone arrives.
   - **The Shop & Makers** (open) — where shelf news, "new from the neighbourhood", and
     maker chat lives. Seed with the first shelf photo.
   - **Events** (the calendar space) — the heartbeat.
   - NOT yet: courses, paid spaces, chat channels. Add rooms when the house is full.
6. **Walk the member-experience settings**: turn off anything that scores or ranks members
   (leaderboard-style features if present), keep notification defaults calm (weekly digest ON,
   per-post emails OFF). The orbit rule: activity is a signal we read, never a score they see.
7. **Two real events** (in the Events space, both with **seat caps**):
   - July work day — cap 20, physical location The Harvest, 316 Witta Rd area details.
   - Garden crew session — cap 12.
   - No waitlist feature exists: if a cap fills, the event description says "full this time,
     next one is [date]". Anything needing a true waitlist runs on Humanitix instead.
8. **Invites — warm first, not the full 45**: invite the garden crew + ~5 warm members by
   hand (Leeza, Rebecca, Monita, Lachie + crew). The full CSV
   (`circle-member-import-2026-06-05.csv`) imports the moment the trial converts. A platform
   that 10 warm people use beats one that 45 ignore.

## B. The two Zaps (Ben's clicks, ~15 min, zapier.com free tier)

**Zap 1 — member in → Circle invite**
- Trigger: LeadConnector (GHL) → *Tag Added to Contact* → tag = `tier:member`
- Action 1: Circle → *Create contact* (email, name from GHL)
- Action 2: Circle → *Add member to space* → The Garden
- Effect: every genuine join on the website flows into the community with zero admin.

**Zap 2 — Circle activity → GHL signal**
- Trigger: Circle → *New Event RSVP*
- Action 1: LeadConnector → *Find or create contact* (by email)
- Action 2: LeadConnector → *Add tag* `circle:rsvp` + note with the event name
- Effect: the Monday sweep sees who's showing up, inside GHL, same as ever.
- Optional Zap 2b: Circle *New Member* → GHL tag `circle:joined`.

**Rules that survive the tooling:** RSVPs happen IN Circle and flow OUT (a Zapier-pushed RSVP
only ever shows "Invited", so never push them in). An RSVP or a post is a signal for the
hand-read, never an auto-climb. Nothing in Zapier touches `lane:community` contacts.

## C. Humanitix (defer to first big public/ticketed day)

Not needed for the trial. When the first market/ticketed day comes: humanitix.com → org
profile → event with ticket types + waitlist → organiser app for gate check-in → Zapier
*New Attendee* → GHL tag `event:<slug>-<date>`. Free for free events.

## D. Invite message (draft — Ben to voice-check before sending)

Subject: a key to the garden gate

> Hi [name],
>
> We have set up a small online home for Harvest members, a place for work day photos,
> what's growing, and first word on what's coming up. It lives at
> community.<harvest-domain> and your email is the key, no password to remember.
>
> [invite link]
>
> It only gets good if the people actually shaping the place are in it, which is why
> you're getting this before anyone else.
>
> Ben

## E. How we judge the trial (evidence, not vibes)

By day 14, look for three things:
1. **Did anyone post without being asked?** (the only real signal of belonging)
2. **Did RSVPs move through Circle** rather than texts to Ben/Nic?
3. **Did a single low-tech member get in unaided** (magic link worked, app code worked)?

2 of 3 → pay the $89, import the full 45, plan the WhatsApp-crew migration into spaces.
0–1 of 3 → walk away having spent nothing; v1 ($0 stack) resumes as the standing plan.

## F. Who does what

| Step | Owner | Status |
|---|---|---|
| Member import CSV | done | `thoughts/shared/circle-member-import-2026-06-05.csv` (45) |
| Zap specs, settings sheet, invite draft | done | this doc |
| Circle signup + domain DNS + spaces + events | Ben | ~30 min, external accounts |
| Zapier account + the two Zaps | Ben | ~15 min |
| Seed photos (consent-checked) into spaces | Ben/Nic | 10 min |
| Warm invites | Ben | after voice-check of §D |
| Trial verdict | Ben + the evidence in §E | day 14 |
