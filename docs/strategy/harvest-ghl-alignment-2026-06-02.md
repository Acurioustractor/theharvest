# Harvest GHL Alignment — verified state + realignment plan

> 2026-06-02. Verified live via `scripts/list-ghl-workflows-and-tags.ts` (read-only GHL API) + the workflow-list UI. Supersedes the "workflows verified live" claims in the May docs — they are now `draft`. Three problems, one decision, a clicked plan + a code plan.

## Verified live state

**Workflows (Harvest-relevant, from 18 in the shared ACT location):**

| Workflow | ID | Status | Note |
|---|---|---|---|
| Harvest - Follow Welcome | `0cf2479e-791c-43ac-a8cd-a3395a03cdaa` | **draft** | not firing |
| Harvest - Member Welcome | `19cc358a-05f6-4d99-8e6b-91b31c63e8c4` | **draft** | 46 enrolled, not firing |
| Harvest - Member Question Receipt | `62aa2b50-c4f3-4564-84c3-3aa81c0c36f8` | **draft** | not firing |
| Harvest - Shop Interest Receipt | `ff4ff43e-0174-415d-828e-3610f5386de5` | **draft** | not firing |
| Shop prospect → create card | `570b1e7a-a6c3-49f5-8989-dca0eee5dbfa` | **draft** | not firing |
| Contact Form to Universal Inquiry | `f0c1f3db-8809-4283-ba91-907626ac0bb7` | **draft** | not firing |
| Harvest Membership Journey | `cadc781e-f1c5-4c2a-9568-0f2fd93daef6` | published | **0 enrolled — orphaned** |

All five share `Last Updated Jun 02 12:04 PM` → a bulk change today likely reverted them to draft (cause inferred).

**Tags:** 397 in the shared location. Harvest-relevant + the collisions:
- `harvest-*` (8): harvest-website, harvest-newsletter, harvest-member, harvest-shop-interest, harvest-event-attendee, harvest-gathering-photos, harvest-inbox, harvest-people-hq
- `interest-*` (10, FLAT — website applies these) vs `interest:*` (16, NAMESPACED — ACT-wide standard) ← **duplicate taxonomy**
- `source-*` (2) vs `source:*` (17) ← **duplicate taxonomy**
- `tier:` (curious, connected, member) · `role:` (19) · `comms:` (13) · `consent:` (newsletter-yes, withdrawn) · `action:` (5)
- operational (keep as-is): `rsvp-maker-morning`, `rsvp-pizza-dinner`, `shop-*` (7), `quiz-*` (6), `witta-gathering-2026-06-20`, `member-question`, `pulse-respondent`, `event-submission`, `business-registration`

## The three problems

1. **Workflows draft → no automated emails fire.** Launch-critical: members joining now hear nothing back.
2. **Membership Journey orphaned** → published but nothing applies `tier:` tags, so 0 inflow.
3. **Tag drift** → flat `interest-*`/`source-*` (website) vs namespaced `interest:`/`source:` (ACT-wide); 397-tag sprawl with no canonical Harvest subset.

## Target model — canonical Harvest tag set

One tag per job. Scope + tier + role are the spine; interest/source/consent are namespaced; operational tags stay flat.

| Job | Canonical tag(s) | Deprecate |
|---|---|---|
| Scope (which list/site) | `harvest-website`, `harvest-newsletter` (the list), `comms:harvest-newsletter` (channel/consent) | — |
| Journey stage | `tier:curious` → `tier:connected` → `tier:member` | — |
| Role | `role:member`, `role:buyer`, `role:supplier` (maker/grower), `role:volunteer`, `role:partner` | — |
| Interest | `interest:*` (namespaced) | `interest-*` (flat, after code migration) |
| Source | `source:*` (namespaced) | `source-*` (flat, after code migration) |
| Consent | `consent:newsletter-yes` | — |
| Operational (events/shop/quiz) | keep flat: `rsvp-pizza-dinner`, `rsvp-maker-morning`, `shop-call-booked`, `quiz-*`, `witta-gathering-2026-06-20`; use namespaced `interest:markets` + `role:supplier` for shop intent | — |

**The bridge that fixes the orphaned Journey:** whenever someone becomes a member, apply `tier:member` + `role:member` (not just `harvest-member`). Whenever someone follows, apply `tier:connected`. That feeds the Journey pipeline.

## Realignment actions

### A. GHL UI — Ben clicks, launch-critical, do now (no deploy)
1. **Publish the 5 draft workflows** (Follow Welcome, Member Welcome, Member Question, Shop Interest Receipt, Shop prospect→card). Test one enrol each — confirm the email fires.
2. **Feed the Journey (in-workflow, no code):**
   - Member Welcome → add action *Add Tag* `tier:member` + `role:member`
   - Follow Welcome → add action *Add Tag* `tier:connected`
   - Shop Interest Receipt → add action *Add Tag* `role:supplier`
3. **Build the 3 calendar-tag workflows** per `ghl-calendar-tag-workflows-runbook.md` (7a/b/c). RSVP tags only — no tier change (an RSVP is not a subscribe).

### B. Website code — SHIPPED to branch `wip/harvest-launch-fixes-2026-06-02` (not yet deployed)
All in `server/routers.ts` (no `gohighlevel.ts` change needed — it POSTs tags to `/contacts/{id}/tags`, which merges and preserves colons):
- `interest:*` / `source:*` are now canonical, **dual-written** with their flat `interest-*` / `source-*` aliases via `withFlatAlias()` so existing smart lists keep receiving contacts (NOT a hard switch — avoids silently dropping new contacts from flat-tag segments mid-launch).
- Journey bridge applied at submit: member → `tier:member` + `role:member`; follower → `tier:connected`; quiz → `tier:curious`; shop EOI → `role:supplier`. Channel tag `comms:harvest-newsletter` added.
- Kept `harvest-*` scope tags + bare `newsletter`. 22 tests pass (2 new assertions pin the namespaced/tier output). `tsc` clean.
- **Note:** because code now applies `tier:`/`role:`, the in-workflow bridge in A2 becomes redundant once this deploys — but tags are idempotent (set membership), so running both is harmless. After deploy, A2 can be dropped.

### C. Tag hygiene — later, after B ships
Deprecate the duplicate flat `interest-*` / `source-*` tags (stop applying, then archive — never bulk-delete mid-launch; check no other ACT project relies on them first).

## The one decision (gates Phase B)
**Converge the Harvest website onto the namespaced ACT-wide taxonomy?** (Recommended: yes — it's already the standard across Goods/JusticeHub/funders, and it makes the Journey + cross-project segments work.) If yes, Phase B is a code PR. If you'd rather keep Harvest on flat tags for now, we skip B and rely on the in-workflow bridge (A2) alone — the Journey still gets fed, but the duplicate taxonomies persist.

## Guardrails
- Don't bulk-delete tags during launch — deprecate by ceasing to apply, archive later, verify no cross-project dependency first.
- Publishing a workflow does not re-enrol the historical 46 — it only fires for new triggers from now.
- Never add `harvest-newsletter`/`harvest-member` on an RSVP (event yes ≠ subscribe).
- Adding tags inside a published workflow is safe + reversible; test one contact before trusting counts.
