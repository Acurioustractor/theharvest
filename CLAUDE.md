# The Harvest — Community Hub Website

## Project Overview

Community hub website for The Harvest, Witta (Sunshine Coast Hinterland, Jinibara Country). TypeScript full-stack app: React SPA frontend + Express/tRPC backend + Supabase/PostgreSQL database.

Co-founders: Ben (builds), Nicholas (vision/design direction).

## Tech Stack

- **Frontend**: React 19, wouter (routing), Tailwind CSS 4, Radix UI, framer-motion, tRPC client
- **Backend**: Express + tRPC, Drizzle ORM, Supabase (auth + storage + DB)
- **Build**: Vite 7, esbuild (server), pnpm
- **Deploy**: Vercel (project: `the-harvest-community-hub`)
- **Integrations**: Empathy Ledger (content hub), GoHighLevel (CRM/forms), S3 (file storage)

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (starts on port 3000+, auto-finds available) |
| Build | `npm run build` (vite + esbuild) |
| Type check | `npx tsc --noEmit` |
| Test | `npm run test` |
| DB migrate | `npm run db:push` (drizzle-kit generate + migrate) |
| Deploy | `vercel --prod` |

## Build & Verification

Always run `npx tsc --noEmit` after making code changes. Fix TypeScript errors before moving on. Don't stack changes across multiple files without verifying the build between logical milestones.

## Database

- **ORM**: Drizzle. Schema at `drizzle/schema.ts`, config at `drizzle.config.ts`
- **Migrations**: Use `npm run db:push` (drizzle-kit generate + migrate). NOT raw psql, NOT REST API.
- **Connection**: `DATABASE_URL` env var (PostgreSQL connection string via Supabase)
- **Supabase CLI**: Available for edge functions and secrets (`npx supabase`)

## Deployment

- **Platform**: Vercel
- **Config**: `vercel.json` — SPA rewrites, tRPC API route
- **Build command** (Vercel): `pnpm exec vite build`
- **Output**: `dist/public`
- **Before deploying**: Verify `vercel ls` shows correct project. Check env vars with `vercel env ls`.

## Project Structure

```
client/
  src/
    pages/          # Page components (one per route)
    components/     # Shared components + ui/ (Radix/shadcn)
    contexts/       # ThemeContext, SeasonalContext
    _core/          # Auth hooks, core client utilities
    lib/            # tRPC client, utils
server/
  _core/            # Express setup, tRPC config, Vite middleware
  routers.ts        # All tRPC routes
  db.ts             # Database queries
  empathyLedger.ts  # EL integration
  gohighlevel.ts    # GHL integration
  storage.ts        # S3 file storage
drizzle/            # Schema + migrations
```

## Routing

- Router in `App.tsx` — wouter `<Switch>` inside `<PublicLayout>`
- Standalone pages (e.g., `/bauhaus`) bypass PublicLayout via `useLocation()` check in `Router()`
- Server serves `index.html` for all non-API routes (SPA fallback)

## Before Starting Work

1. Check what services/integrations are already configured — review `.env`, `package.json`, and existing integration files before choosing an approach
2. Read existing code before modifying it
3. Prefer editing existing files over creating new ones
4. Use TypeScript for all new files (never JS)

## Code Standards

- TypeScript strict mode. Install type definitions for browser APIs when needed.
- Tailwind CSS for styling in existing pages. Inline styles OK for isolated prototype pages (e.g., `/bauhaus`).
- Radix UI + shadcn pattern for UI components (`client/src/components/ui/`)
- tRPC for all API communication (no raw fetch to `/api/` except registry feed)

## Design Direction

Current exploration: Bauhaus-inspired brand identity (see `/bauhaus` route).
- Three zones: Garden, Kitchen, Art Space
- Principle: simplicity and intentionality — "if you do a bit of everything, what the fuck is it?"
- iPhone unboxing metaphor: clear first impression, depth behind it
- Co-design ethos: kids build the kids area, artists shape the art space
