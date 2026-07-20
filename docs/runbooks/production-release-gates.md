# Production release gates

The Harvest production domain must represent the current commit on GitHub `main`.

## Automated contract

- Pull requests into `main` run TypeScript, the complete Vitest suite, a production build, and browser checks for all eight principal routes.
- Pushes to `main` run the same checks, then wait for production `/api/version` to report that exact GitHub SHA.
- Production promotion fails when a route does not contain its current-site identity marker or the browser reports a blocking runtime/configuration error.
- `/api/version` returns non-secret deployment provenance with `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow`.

Principal routes:

1. `/`
2. `/whats-on`
3. `/membership`
4. `/get-involved`
5. `/venue-hire`
6. `/works`
7. `/shop`
8. `/contact`

## Required platform settings

Repository code cannot set these account-level controls. Confirm them in GitHub and Vercel after this workflow lands.

### GitHub

- Protect `main`.
- Require pull requests before merging.
- Require `TypeScript, tests, build, and route smoke` to pass.
- Require branches to be up to date before merging.
- Block force pushes and branch deletion.

### Vercel

- Set the production branch to `main` only.
- Keep preview deployments enabled for feature branches.
- Do not assign the production domain to preview deployments.
- Enable the Vercel system environment variables used by `/api/version`.
- Optionally set `DEPLOYMENT_TIMESTAMP` if the project does not expose `VERCEL_DEPLOYMENT_CREATED_AT`.

## Verification

```bash
curl -s https://www.theharvestwitta.com.au/api/version
pnpm smoke:deployment -- \
  --url https://www.theharvestwitta.com.au \
  --expected-sha "$(git rev-parse origin/main)"
```

The release is current only when the endpoint SHA, GitHub `main`, and the deployed route markers all agree.
