# Vercel Preview Smoke Runbook

Use this before promoting Harvest website changes to production.

## Required Vercel environment variables

These must exist in Vercel for both **Preview** and **Production**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

The `VITE_*` values are public browser config, not secrets. The anon key is safe to expose when Supabase Row Level Security is correct. Do not expose service-role keys through `VITE_*`.

Set these in Vercel:

`the-harvest` -> Settings -> Environment Variables

After changing env vars, redeploy the preview. Existing deployments do not automatically rebuild with the new values.

## Preview-first flow

Live configuration checked on 5 September 2026: the Vercel project `the-harvest`
has automatic custom-domain assignment disabled. GitHub `main` requires the
TypeScript/test/build/route-smoke check and the Vercel check, including for admins.
Those checks do not enforce smoke verification of the deployed preview before a
manual promotion. Run the preview command below and retain its passing output
with the deployment URL before promoting. The production check runs afterward
for detection and rollback. See the [production release contract](production-release-gates.md).

1. Commit a clean worktree.
2. Push a branch and let Vercel create a preview deployment.
3. If the preview is protected, create a temporary Vercel share link and copy the `_vercel_share` token from the URL.
4. Run:

```bash
npm run smoke:deployment -- --url https://your-preview.vercel.app --share your-share-token
```

For an unprotected URL:

```bash
npm run smoke:deployment -- --url https://your-preview.vercel.app
```

The smoke check verifies:

- `/witta-pizza` returns `200`
- Google Search Console verification tag is present
- Vite client bundle is present
- `/pizza` redirects to `/witta-pizza`
- `/gather` and `/photo-wall` redirect to `/whats-on`
- Sitemap includes `/witta-pizza` and excludes retired routes
- A real headless browser verifies stable route markers for all eight principal routes, independent of editable page copy

Only promote the preview after this command passes.

## If the browser check fails

If the script says Chrome is missing, install the local browser cache:

```bash
npx playwright install chromium
```

If it says `React root stayed empty`, open the preview console. The most common cause is missing preview env vars, especially `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
