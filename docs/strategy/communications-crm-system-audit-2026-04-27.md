# Communications and CRM Audit - 2026-04-27

This file is the short audit. The operating system now lives in [../communications/README.md](../communications/README.md).

## Verified

- GoHighLevel is live for the configured location.
- GHL has 1,357 contacts.
- GHL has 19 workflows.
- GHL has 8 connected social accounts.
- Connected accounts include:
  - Google Business: A Curious Tractor
  - Facebook: The Harvest Witta
  - Instagram: benknightphoto
- Current GHL tag counts:
  - `newsletter`: 279
  - `harvest-website`: 99
  - `photo-wall`: 26
  - `harvest-gathering-photos`: 25
  - most planned interest tags currently return 0
- Notion has a real `ACT Communications Dashboard` data source with the right editorial fields.
- The website has code for:
  - newsletter signup
  - GHL contact upsert
  - GHL workflow triggers
  - Notion editorial calendar reads and writes
  - GHL Social Planner posting
  - GHL email template creation

## Current Risk

The tools exist, but the system is messy:

- Harvest, ACT, Goods, newsletter, events, photo wall, and social posts are sharing one GHL location.
- Tags are not consistently namespaced.
- `newsletter` is too broad for Harvest-specific sends.
- The local Notion token failed against the live API.
- Local env files contain live-looking secrets.
- Several admin-power tRPC routes are public procedures.
- The GHL webhook function and migration appear schema-mismatched.

## Clean System

Use this rule:

> Notion plans the message. GoHighLevel owns people and delivery. The website captures intent. Supabase records operational submissions.

System files:

- [Communications System](../communications/README.md)
- [Content Flow and Stages](../communications/content-flow-and-stages.md)
- [Social Sharing Playbook](../communications/social-sharing-playbook.md)
- [Newsletter Writing System](../communications/newsletter-writing-system.md)
- [GHL Newsletter HTML Template](../communications/newsletter-ghl-template.html)
- [Photo, Graphics, and Copy Style Guide](../communications/photo-graphics-copy-style-guide.md)

## Priority Fixes

1. Rotate exposed secrets if `.env` or `.env.local` have ever been shared, committed, backed up, or synced.
2. Protect admin-only routes before production use:
   - editorial create/update/autoSync
   - social post
   - email template create
   - newsletter sendCampaign
3. Reconnect the Notion API token and verify `/social-planner`.
4. Fix the GHL webhook schema mismatch.
5. Move all new Harvest contacts onto namespaced tags:
   - `harvest`
   - `harvest-newsletter`
   - `source-harvest-website`
   - `harvest-interest-*`
6. Decide whether Instagram should remain `benknightphoto` or become a dedicated Harvest account.

