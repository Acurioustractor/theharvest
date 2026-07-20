# Square to Supabase data pull (scope)

> Scoped 2026-06-19. Square stays the operational source of truth (till, catalog,
> payments). This is a one-way, read-only pull into Supabase so The Harvest gets the
> margin and sales reporting Square's free tier is weak on, alongside the rest of the
> Harvest data. Post-launch build. Day-shift: it touches the live Square account (real
> money) and the shared Empathy Ledger Supabase project.

## Why

- Square's free tier gives item and category sales but weak per-item COGS / margin reporting.
- The Harvest data already lives in the Empathy Ledger Supabase project; a mirror lets you
  build margin dashboards and join sales to events and members.
- It mirrors a pattern already in this DB: `xero_payments` mirrors an external financial
  system into Supabase. This does the same for the till.

## What exists (checked 2026-06-19)

- DB: Empathy Ledger project `tednluwflfhxyucgwigh` (the Harvest site's DB; its edge
  functions `sync-events`, `ghl-webhook` already deploy here).
- Harvest namespace tables exist: `harvest_businesses`, `harvest_events`. Convention = `harvest_*`.
- No Square / POS / orders / retail-catalog tables yet. `goods_products` is the Goods arm,
  not Harvest food and drink.
- `xero_payments` exists (precedent for an external-system financial mirror).

## Proposed schema (net-new, namespaced `harvest_square_*`)

Money in integer cents. `net` is ex-GST so margins are correct.

- `harvest_square_catalog` (square_id PK, name, category, price_cents, unit_cost_cents,
  gst_free bool, track_stock bool, updated_at)
- `harvest_square_orders` (square_order_id PK, created_at, location_id, gross_cents,
  net_cents, tax_cents, discount_cents, source, event_id FK -> harvest_events nullable)
- `harvest_square_order_lines` (id PK, square_order_id FK, square_item_id, name, category,
  qty, unit_price_cents, gross_cents, net_cents, discount_cents, tax_cents)
- `harvest_square_payments` (square_payment_id PK, square_order_id FK, amount_cents,
  processing_fee_cents, tender_type, created_at)
- `harvest_square_inventory` (id PK, square_variation_id, count, counted_at)
- View `harvest_v_item_margins`: join lines to catalog cost for qty, net revenue, cost,
  margin $ and margin % per item / category / day. This is the payoff Square's free tier lacks.

## Sync mechanism

- **Phase 1 - scheduled nightly pull.** A Supabase edge function (Deno) on a cron calls the
  Square Orders + Catalog + Inventory APIs with a since-cursor and upserts idempotently.
  Simple, robust, slight lag. Good enough for reporting.
- **Phase 2 (optional) - webhooks.** Square webhooks (`order.created`,
  `inventory.count.updated`, `catalog.version.updated`) to the same function for
  near-real-time. Adds webhook signature verification.

## Square auth + scopes

- A Square access token (OAuth app, or a developer Personal Access Token) with READ-ONLY
  scopes: `ORDERS_READ`, `ITEMS_READ`, `INVENTORY_READ`, `PAYMENTS_READ`, `MERCHANT_PROFILE_READ`.
- Store as a Supabase secret. No write scopes: this mirror never pushes to Square.

## Build plan (post-launch, in order)

1. Create a Square developer app; generate a read-only token (day-shift, live account).
2. Apply the `harvest_square_*` migration to the EL project. Tier 3: shared prod DB with
   250+ tables, multi-tenant. Review the migration before apply; use the normal migration path.
3. Write the pull edge function, orders first (highest value); deploy to `tednluwflfhxyucgwigh`.
4. Backfill the launch night's orders as a one-off, then verify the totals tie to Square's
   own sales report before trusting anything.
5. Build `harvest_v_item_margins` + a simple dashboard (website admin, or a Supabase view).
6. Add catalog + inventory sync; later add webhooks if you want real-time.

## Guardrails

- Read-only. Square stays the operational truth; this is a reporting mirror, not a second till.
- Day-shift: live Square account (real money) + shared EL Supabase project. Migrations
  reviewed before apply; never an AFK task.
- GST: capture gross and tax separately; report margins on net.
- Provenance: verify the mirror ties to Square's own report before any figure is trusted or shipped.

## Related

- `.claude/skills/harvest-selling-system/SKILL.md` - the selling system this feeds.
- Notion build log: "Selling System Build Log" under The Harvest Witta HQ.
- `xero_payments` table - the existing external-financial-mirror precedent.
