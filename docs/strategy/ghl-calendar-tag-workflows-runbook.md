# Runbook — build the 3 calendar-tag workflows (GHL UI)

> Why a runbook and not a script: GHL has no workflow-create API. Workflows with a
> *Customer Booked Appointment* trigger are built in the workflow UI only. The API can
> enrol/trigger and list workflows, not create them. This is a ~10-minute click job.
> Source spec: `ghl-workflow-build-specs.md` §7. Tags already exist in the location library.

**Location:** The Harvest (LeadConnector / GHL). **Build order:** 7a first, then *Clone* it for 7b and 7c.

---

## Workflow 7a — RSVP: Maker session (B1)

1. **Automation → Workflows → + Create Workflow → Start from scratch.**
2. Name it: **`Harvest - RSVP Maker Session (tag)`**
3. **Add Trigger → "Customer Booked Appointment".**
   - Filter: **In Calendar** → **is** → `RSVP: Maker session, Sat 20 June` (ID `M0KzSu7Bo3jJ3ZQta3ag`)
4. **Add Action → "Add Contact Tag":**
   - `witta-gathering-2026-06-20`
   - `rsvp-maker-morning`
5. **Settings → Re-entry: OFF** (a contact who re-books should not re-tag — once is enough).
6. **No email step** — the calendar sends its own booking confirmation. Do NOT add `harvest-newsletter` or `harvest-member` (an RSVP is not a subscribe).
7. **Save → Publish (toggle to Publish, top-right).**

---

## Workflow 7b — RSVP: Afternoon + pizza (B2)  *(clone of 7a)*

1. On 7a: **⋮ → Clone.** Rename the clone: **`Harvest - RSVP Afternoon + Pizza (tag)`**
2. **Edit the trigger filter:** In Calendar → is → `RSVP: Afternoon + pizza, Sat 20 June` (ID `4IpU9GnzAChTMkKFJPWi`)
3. **Edit the Add-Tag action** to:
   - `witta-gathering-2026-06-20`
   - `rsvp-pizza-dinner`   ← **this count is the pizza-dough headcount**
4. **Re-entry: OFF.**
5. **Publish.**

---

## Workflow 7c — Book a chat about the shop  *(clone of 7a)*

1. On 7a: **⋮ → Clone.** Rename: **`Harvest - Shop Chat Booked (tag)`**
2. **Edit the trigger filter:** In Calendar → is → `Book a chat about the shop` (ID `viM1BRnHG9gwpIEZd4HM`)
3. **Edit the Add-Tag action** to (CANONICAL — updated 2026-06-03; the site no longer mints `harvest-shop-interest`, and the shop Smart Lists now key on `interest:markets`):
   - `project:act-hv`     ← project router (calendar bookings skip the website chokepoint, so stamp it here)
   - `interest:markets`   ← so a booked chat lands in the Shop Smart Lists + nurture
   - `shop-call-booked`   ← distinguishes a booked call from a form EOI
4. **Re-entry: ON** (someone may book more than one chat over time).
5. **Publish.**

---

## Test (do this once per workflow before trusting the count)

1. Open each calendar's public booking link, book a test slot with a throwaway/your-own contact.
2. In **Contacts**, open that contact → confirm the two expected tags appear within ~1 min.
3. Check the smart list: a booking on B2 should make **`rsvp-pizza-dinner`** count = 1.
4. Delete the test appointment + remove the test tags (or delete the test contact) so the headcount starts clean.

## Acceptance
- [ ] 7a published, test booking tagged `witta-gathering-2026-06-20` + `rsvp-maker-morning`
- [ ] 7b published, test booking tagged `witta-gathering-2026-06-20` + `rsvp-pizza-dinner`
- [ ] 7c published, test booking tagged `harvest-shop-interest` + `shop-call-booked`
- [ ] all three test bookings + tags cleaned up so live counts are zero at start

## Guardrails
- No email/notification step inside these (the calendar handles confirmations).
- Never auto-apply `harvest-newsletter` / `harvest-member` on an RSVP.
- These tags drive the pizza headcount and the Events smart list — a wrong calendar filter = wrong count, so test each one.
