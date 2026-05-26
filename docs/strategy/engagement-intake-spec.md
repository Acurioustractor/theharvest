# Engagement Intake Spec: follow-vs-member split + form friction

> Implementation spec for two roadmap items. Created 2026-05-26.
> Roadmap records: "Engagement: split follow-along from member intake" and "Engagement: reduce friction on the shop/partner intake form".
> Verified against code on 2026-05-26: `server/routers.ts`, `client/src/pages/Membership.tsx`, `client/src/components/PublicLayout.tsx`, `client/src/components/ShopInterestSection.tsx`.

## Part 1: split "follow along" from "member"

### The problem

Every public signup becomes a member, so the Receive rung of the ladder does not exist. People who only want to follow the story are tagged `harvest-member` and pushed into the Hold-it rung they did not choose.

### What the code actually does today (verified)

The backend already supports a non-member signup. The frontend never uses it.

- `buildNewsletterTags` (`server/routers.ts:152-173`): always applies `newsletter`, `harvest-newsletter`, `harvest-website` plus interest tags. It adds `harvest-member` and `interest-membership` only when `member === true` **or** `interests` includes `"membership"`.
- `newsletter.subscribe` (`server/routers.ts:635-702`): picks the welcome workflow by the same test. `isMember` (`member` or interests includes `membership`) enrols `GHL_MEMBER_WELCOME_WORKFLOW_ID`; otherwise `GHL_NEWSLETTER_WORKFLOW_ID` (`routers.ts:688-690`).
- So a call with `member: false` and no `"membership"` interest produces a follow-along contact (newsletter tags, lighter welcome) with no `harvest-member`. This path is correct and unused.

The two frontends both force membership:
- `client/src/pages/Membership.tsx:147,156`: `interests: ["membership", ...]` and `member: true`. Correct for this page (it is the deliberate join).
- `client/src/components/PublicLayout.tsx:104-111` (site footer, on every page): `interests: ["membership", "community"], member: true`. This is the leak. The broad, low-intent footer makes everyone a member.

### The change

Backend: no change needed. The split is frontend plus copy.

1. **Footer (`PublicLayout.tsx`) becomes the Receive rung.**
   - Send `member: false`.
   - Send `interests: ["community"]` (remove `"membership"`, since membership in interests also flips `isMember`).
   - Copy: change the footer signup from member language to follow language. For example label it "Follow the story" or "Get the Harvest note," button "Keep me posted." Make clear this is the light version: occasional notes, no commitment.
   - Keep the existing "Become a member" nav link (`PublicLayout.tsx:74`) pointing to `/membership` for people who want the deeper rung.

2. **Membership page (`Membership.tsx`) stays the Hold-it rung.** No change to `member: true`. Optionally add one quiet line near the form: "Just want the occasional note? You can follow along from the footer instead." so the two rungs are legible.

3. **GHL precondition.** Confirm `GHL_NEWSLETTER_WORKFLOW_ID` is set in local `.env` and Vercel and points to the lighter "Thanks for following along" welcome (workflow 5 in `docs/communications/welcome-email-and-ghl-workflow.md`). Today the runbook notes the newsletter-only fallback is not used because both surfaces submit `member: true`. Once the footer sends `member: false`, this workflow goes live, so it must exist and be published first.

### Acceptance tests

- Submit the footer form. The GHL contact has `newsletter`, `harvest-newsletter`, `harvest-website`, `interest-community`, and **not** `harvest-member` or `interest-membership`.
- That contact enrols `GHL_NEWSLETTER_WORKFLOW_ID` (the follow welcome), not the member welcome.
- Submit the `/membership` form. The contact still has `harvest-member` and `interest-membership` and enrols the member welcome.
- A follow-along contact can later be upgraded to member by signing up at `/membership` (tags add, none removed).

### Out of scope

No double opt-in (existing known gap). No change to how the member welcome reads.

## Part 2: take friction off the shop/partner intake

### The problem (Croft's note)

Croft flagged a partner form that asks "roughly what size are you thinking?" up front. That kind of question creates friction at the door and costs submissions. Ask the minimum to start, enrich after the person has raised their hand.

### What the form asks today (verified)

`client/src/components/ShopInterestSection.tsx` collects, in one step: name (required), email (required), phone (optional), **location (required)**, offer type (select), **description (required, "at least a sentence")**, **readiness (required, "roughly when you could start")**. The shop EOI route applies `harvest-shop-interest` plus offer tags and enrols `GHL_SHOP_INTEREST_WORKFLOW_ID` (see the tag map). Business registration (`server/routers.ts:346`) follows the same heavy-intake pattern.

Three of the required fields (location, a full description, readiness) are stage-2 questions being asked at the door.

### The change

Two stages, gated by the person raising their hand.

- **Stage 1 (the door, low friction):** name, email, offer type (the select), and one short line "what is it." Submit. That is the whole form.
- **Stage 2 (after they submit):** gather location, readiness, fuller description, volume or size, and consignment terms, via a follow-up email, a stage-2 form link in the receipt, or a real conversation. The shop receipt email already promises Ben or Nic will come back, so stage 2 can be that reply.

GHL: stage 1 still applies `harvest-shop-interest` plus the offer tag and `shop-follow-up`. Add a tag like `shop-stage-1` so it is clear who still needs stage-2 detail. When stage-2 detail arrives, the follow-up owner records it as a note or moves the pipeline stage.

Apply the same stage-1 trim to business registration.

### Split test

Run the short form against the current longer form and measure submission rate, per Croft. Keep whichever converts better. Even without formal A/B, ship the short form and watch the submission count in the weekly review.

### Acceptance tests

- Stage-1 shop submit succeeds with only name, email, offer type, and one line. No required location or readiness.
- The GHL contact has `harvest-shop-interest`, the offer tag, `shop-follow-up`, and `shop-stage-1`.
- The receipt email invites the stage-2 detail.

## Sequencing

Part 1 footer change is small and high-leverage, do it first (needs the GHL follow welcome published). Part 2 is a form rework plus a stage-2 path, do it second. Both are tracked as roadmap records in the Actions DB, Harvest view.
