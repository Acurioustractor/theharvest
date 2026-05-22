# Notion-ready paste blocks — 2026-05-22

> Two blocks below, both ready to paste into Notion. Companion to [harvest-launch-alignment-2026-05-22.md](harvest-launch-alignment-2026-05-22.md).

## Block 1 — Recommendation for the Harvest Launch Alignment page

**Where to paste:** [Harvest Launch Alignment - Countdown to 20 June 2026](https://www.notion.so/acurioustractor/Harvest-Launch-Alignment-Countdown-to-20-June-2026-363ebcf981cf81b19deef477e76983e0) — append as a new section at the bottom (or under "Decision Questions").

---

## AI-Prepared Recommendation (2026-05-22)

> Prepared in the website repo, pending Ben + Nic review and lock. Full reasoning + companion docs at `docs/strategy/harvest-launch-alignment-2026-05-22.md`.

### Recommended Path: A — Invite-only proof night

- Audience: Member list only. About 40 seats.
- Time: 3pm to 7pm (shifted from earlier 10am-3pm framing).
- Offer: Pizza if oven + food licence land in time, otherwise tea + water + simple snacks. No bar. No register. No open mic at this scale.
- Frame: Soft opening, not a launch. Proof night for the operating system. Public day later in the year once the rhythm is real.

### Why Path A over B (public open day) or C (closed rehearsal)

1. Ben flies out 20 June. Path B needs a public-event-grade run sheet with Ben in-country to take responsibility. He cannot be at the gate and on a plane. Path A works with Nic on-deck plus Susie and Joey, with Ben pre-flight.
2. Insurance is the single point of failure. PL $20M binds Week 7 (9-15 June). Path B opens to public with a thin window between binding and event. Path A keeps the audience small enough that the run sheet is forgiving if the broker slips.
3. The clean principle holds. "No public promise without an owner, a safety answer, and a closing procedure." Path A is the only one of the three where all three are answerable by 1 June without heroic effort.

### Decision Questions — proposed answers

1. Public / invite / rehearsal? Invite-only (Path A).
2. What can someone buy? Nothing. All food on the house at proof-night scale. Defer register flow to later paid event.
3. Who is legally/operationally responsible? Nic on-site. Ben remote (in transit). Insurance bound in Harvest Pty's name pre-event.
4. Insurance evidence? Cert of Currency for PL $20M, in Harvest Pty's name, dated before 20 June.
5. Food safety setup? Council pre-application call this week. File Temporary Food Licence by 1 June if needed; if exempt at Path A scale, document rationale and council contact name.
6. Who holds the room if Ben/Nic pulled away? Named deputy: Susie or Joey. Confirm this week.
7. Next opening after 20 June? Reserved. Recommend empty calendar until 4-week debrief.
8. What do we refuse to add? Open mic, live music, alcohol sales, public register, new built infrastructure, anything requiring a separate permit.

### What this triggers on the website + comms (already applied locally, not yet deployed)

- `client/src/pages/GardenLaunch.tsx` — hero, program, "what we know" panel, time window 3-7pm
- `docs/communications/newsletter-2026-06-garden-launch.md` — rewritten for invite-only audience, full cadence (invite, nudge, practical, thank-you)
- `docs/communications/articles-launch-set/01-milk-create-pavilion.md` — soft-opening framing
- `docs/brand/harvest-overview.md` — §20 June section
- "How did you hear about The Harvest?" field added to Membership form (signal for find-others playbook later)

Companion planning docs (new in repo):

- `docs/strategy/harvest-launch-alignment-2026-05-22.md`
- `docs/communications/launch-countdown-comms-cadence.md`
- `docs/communications/find-others-playbook.md`

### What still needs decision / physical action

- [ ] Ben + Nic confirm Path A or override to B/C (lock here)
- [ ] Call Sunshine Coast Council Environmental Health re food licence path
- [ ] Confirm Susie + Joey as host pair for the night
- [ ] Add three launch-budget rows to Harvest Budget DB (see Block 2 below)
- [ ] Deploy website changes via `vercel --prod` after lock
- [ ] Schedule member-list invite send in GHL for Wed 27 May
- [ ] Update 10-week plan §D19 with locked decision

### Override notes

If Path B (public open day): the cadence doc has Path B branch points marked inline. Main changes: widen audience filter, lock food licence + insurance earlier, add public dietary/parking intake, activate find-others playbook 2 weeks pre-event instead of post.

If Path C (closed rehearsal): `/garden-launch` page is parked, the newsletter becomes "20 June is for us, not for you," and the public day announcement moves to August/September.

---

## Block 2 — Three rows for The Harvest Budget DB

**Where to paste:** [Harvest Budget DB](https://www.notion.so/3df521a0-b3f8-4f47-983d-6713657befe5) (under The Harvest Witta HQ).

> Notion's data source schema for the Budget DB isn't fetched here — column names may differ. Use the values below to map into whatever columns the DB has (Title, Category, Target, Status, Notes). Add rows manually so the DB-schema mismatch doesn't break anything.

### Row 1 — Insurance binding (PL $20M)

| Field | Value |
|---|---|
| Title / Name | Insurance binding — PL $20M |
| Category | Insurance (or whatever the closest existing category is) |
| Target / Budget | $12,000 – $15,000 / year |
| Status | Quoting (Clear / NFPIB / Aon — broker calls in Week 5-6) |
| Owner | Ben |
| Hard deadline | 15 June 2026 (Week 7) — gate blocker for lease execution |
| Notes | Per insurance-harvest-broker-addendum-2026-04-24.md. If quotes exceed $15K, activate strategic plan Risk Register rescue. |

### Row 2 — Soft-opening direct cost (20 June 2026)

| Field | Value |
|---|---|
| Title / Name | Soft opening direct cost — 20 June 2026 |
| Category | Launch / Programming |
| Target / Budget | $1,500 – $3,000 |
| Status | Pending Path lock and food story |
| Owner | Ben (until Susie/Joey confirmed as host pair) |
| Hard deadline | Spend Window: 1 June – 19 June |
| Notes | Covers food (pizza ingredients or tea + simple snacks), basic signage, kids' chalk + paper, contingency for missing items. Free entry, no register, no bar. If pizza path lands, ingredients sit at the top of the range; tea path sits at the bottom. |

### Row 3 — Cleanup + contingency reserve

| Field | Value |
|---|---|
| Title / Name | Cleanup + contingency reserve — 20 June |
| Category | Launch / Programming |
| Target / Budget | $500 |
| Status | Reserve only — spend only if needed |
| Owner | Ben |
| Hard deadline | 21 June 2026 |
| Notes | Same-day reserve for unexpected items (extra firewood, additional cleaning, replacement consumables). Unspent reserve rolls back to general operations after debrief. |

---

## Notes on these paste blocks

- **Block 1** is information-only; pasting it into Notion does not lock Path A. Ben + Nic still have to make the call and write the lock-in note themselves.
- **Block 2** budget figures are *targets / ranges*, not committed spend. The hard numbers are dependent on the broker quote (Row 1) and food story (Row 2).
- After pasting, this file can be deleted from the repo. It exists only to bridge the local-edit → Notion-write gap that the auto-mode classifier protects.
