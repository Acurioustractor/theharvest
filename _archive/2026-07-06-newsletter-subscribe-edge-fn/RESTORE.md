# Archived: newsletter-subscribe edge function

Archived 2026-07-06 (TODOS.md GHL tag cleanup 4). This function duplicated the
buildNewsletterTags member-split logic in server/routers.ts and had NO callers:
the footer and /membership both submit through trpc newsletter.subscribe, and
lib/api.ts subscribeNewsletter() was exported but never imported.

Keeping two copies of the member-tag rule risked silent divergence, so the
local source moved here. The DEPLOYED copy in Supabase project
tednluwflfhxyucgwigh is still live but uncalled; delete it from the dashboard
(Edge Functions > newsletter-subscribe) during the next day-shift GHL/Supabase
hygiene pass.

To restore: `git mv _archive/2026-07-06-newsletter-subscribe-edge-fn/newsletter-subscribe supabase/functions/newsletter-subscribe`
