# Supabase Setup

This project uses Supabase tables + Edge Functions (frontend-only deployment on Vercel).

## 1) Run the SQL migration

In Supabase SQL editor, run:

`supabase/migrations/20241222120000_init.sql`

This creates `app_users`, `events`, and `businesses` with RLS policies.

## 2) Deploy Edge Functions

Install Supabase CLI and login, then from the repo root:

```
supabase functions deploy app-user-sync
supabase functions deploy admin-events
supabase functions deploy admin-businesses
supabase functions deploy business-claim
supabase functions deploy business-update
supabase functions deploy newsletter-subscribe
```

## 3) Set Edge Function secrets

These are required for the functions to run:

```
supabase secrets set SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
supabase secrets set OWNER_OPEN_ID=YOUR_SUPABASE_USER_ID
supabase secrets set ADMIN_OPEN_IDS=COMMA_SEPARATED_USER_IDS
supabase secrets set GHL_API_KEY=YOUR_GHL_KEY
supabase secrets set GHL_TOKEN=YOUR_PRIVATE_INTEGRATION_TOKEN
supabase secrets set GHL_LOCATION_ID=YOUR_GHL_LOCATION_ID
```

Notes:
- `OWNER_OPEN_ID` or `ADMIN_OPEN_IDS` marks admins in `app_users`.
- `SUPABASE_SERVICE_ROLE_KEY` is **server-only**. Never set it in Vercel env vars.

## 4) Vercel environment variables

Set these in Vercel for the frontend:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 5) Local dev

```
pnpm install
pnpm dev
```

Make sure `.env` contains the Vite Supabase vars.
