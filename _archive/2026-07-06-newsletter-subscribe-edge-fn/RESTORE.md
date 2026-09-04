# Archived: newsletter-subscribe edge function

Archived 2026-07-06 (TODOS.md GHL tag cleanup 4). This function duplicated the
buildNewsletterTags member-split logic in server/routers.ts and had NO callers:
the footer and /membership both submit through trpc newsletter.subscribe, and
lib/api.ts subscribeNewsletter() was exported but never imported.

Keeping two copies of the member-tag rule risked silent divergence, so the
local source moved here. The deployed copy in Supabase project
tednluwflfhxyucgwigh remained live after the local archive.

Read-only verification on 5 September 2026 confirmed that version 35 was still
ACTIVE in the same project. Its deployed handler adds newsletter tags without
checking explicit consent. Current website signups use `trpc.newsletter.subscribe`;
the unused `lib/api.ts` wrapper and stale setup deployment command have now been
removed.

After Ben's approval, the deployed `newsletter-subscribe` function was deleted
on 5 September 2026 at 08:29 Brisbane (4 September at 22:29 UTC). Supabase's
before/after inventories confirmed it was the only removal: 13 functions became
12, and every remaining function retained its ID, version, status, and code hash.
No contacts, workflows, database records, or other functions were changed.

This archive is retained for reference. The archived handler lacks consent
enforcement; do not redeploy it unchanged.
