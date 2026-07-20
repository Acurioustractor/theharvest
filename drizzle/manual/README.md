# Manual migrations

Drizzle-kit's auto-generator (via `npm run db:push`) is interactive. It trips over historical schema renames (e.g. the `users` → `app_users` rename that was applied via `drizzle/0001_create_app_users.sql`) and asks "is this a new table or a rename?" The wrong answer can rename an existing production table.

When that interactive flow is risky, write the migration SQL by hand and apply it directly via the Supabase SQL Editor (or psql).

## How to apply

1. Open the Supabase SQL Editor for the Harvest project
2. Paste the contents of the relevant `NNNN_*.sql` file in this directory
3. Run it
4. Verify tables / columns exist as expected
5. Note in your ops log when and where you applied it

## What's here

| File | Applied | Notes |
|---|---|---|
| `0002_image_overrides_and_witta_contributions.sql` | 2026-05-09 (verify) | Adds `image_overrides` and `witta_contributions` tables; widens `editable_content.slot` from varchar(100) to varchar(200) |
| `0003_member_wall_entries.sql` | pending | Adds the opt-in public members wall table |
| `0004_public_form_tables.sql` | 2026-05-24 | Adds missing public form tables for event submissions, business submissions, and event feedback |
| `0005_lock_down_harvest_server_managed_tables.sql` | 2026-06-07 | Enables RLS and revokes browser-role grants for `editable_content`, `image_overrides`, `member_wall_entries`, and `witta_contributions` |

## When to use this vs `npm run db:push`

- **Use this** when the schema diff would trigger interactive rename prompts
- **Use `db:push`** when adding small, unambiguous changes and you're comfortable answering the prompts

If you're not sure which case you're in, run `drizzle-kit generate` first (which generates without applying) and inspect the proposed SQL.
