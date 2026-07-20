# Production release gates

The Harvest production domain must represent the current commit on GitHub `main`.

## Automated contract

- Pull requests into `main` run TypeScript, the complete Vitest suite, a production build, and browser checks for all eight principal routes.
- Pushes to `main` run the same checks. The production verification job then waits for a manually promoted deployment and verifies that `/api/version` reports the exact GitHub SHA.
- This project uses manual Vercel promotion: merging does not itself authorise promotion. Promote the `main` deployment only after the required pull-request checks and Vercel preview have passed.
- After promotion, production verification fails when an immutable route identity is missing, the SHA differs, or the browser reports a blocking runtime/configuration error. This is a detection and rollback signal, not a substitute for the pre-promotion checks.
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

- Set `main` as the only source eligible for manual production promotion.
- Keep preview deployments enabled for feature branches.
- Do not assign the production domain to preview deployments.
- Keep automatic production promotion disabled; preview and verify first, then promote the successful `main` deployment.
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
