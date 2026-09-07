# Prompt: align Notion to run The Harvest (paste into Notion AI, 7 Sep 2026)

You are reviewing the Notion workspace for The Harvest, Witta, a community hub (garden, events, art space) on Jinibara Country, run by Ben Knight and Nicholas Marchesi. Your job is to make Notion the one place a tired person can open on a Monday and know what to do, without Notion becoming a second copy of anything that lives elsewhere.

## Start here, read all of it before proposing anything

- The Harvest Witta HQ (parent page, id 11debcf981cf80828fd0d6031a9709f2) and every child page and database under it.
- The Harvest Dashboard (id 34cebcf981cf81ca9981f3ff88b71d37): the morning driver page. The daily check-in posts here at 7am and the weekly status on Monday 8am.
- "Money, events and people: review after the first green week (7 Sep 2026)" (id 3d4ebcf981cf81928439fe782c80b530): the current review page and its eight decisions.
- "Harvest to End of Year 2026: pizza, comms, brand, calendar" (id 3d0ebcf981cf81d88c74e34e6fc75091) and the Harvest Calendar database inside it (69 rows, fields Type, Zone, Owner, Status, Package, Tool).
- Sauna HQ (id 4644bd905ba341ccb2c21687049fa7f1), the Pizza Playbook, the Revenue Streams playground, the Base/Good/Stretch page, the Brand and Style Guide, the Comms Plan, the GHL Inbox Rollout page.
- The ACT Actions database (id 177ebcf981cf8023af6edff974284218), filtered to the Harvest project. This is the only actions list. An older Harvest-only actions database is dead; do not revive it.

## The systems around Notion and what each one owns

Notion does not own any of these. It links to them and records decisions about them.

| System | Owns | Where |
|---|---|---|
| GitHub repo `Acurioustractor/theharvest` (main) | The website, the money model, the people and entity map, the strategy documents, and the scripts that read the other systems | `docs/strategy/` for plans, `.scratch/harvest-financial-model/` for the model, `scripts/` for tools. Key files: `docs/strategy/harvest-money-events-and-people-plan-2026-09.md`, `docs/strategy/the-harvest-strategic-plan-notion.md`, `STRATEGY.md`, `TODOS.md` |
| Xero (Nicholas Marchesi sole trader file, tracking option "ACT-HV — The Harvest Witta", revenue account 205 Harvest sales) | Money truth. The Harvest Pty Ltd is not yet registered; when it is, it gets its own Xero file | Read by `npm run books:check` in the repo; fixes go to Standard Ledger (Dijane, Vanessa) |
| Square (location "The Harvest", LQQBD77AGYED7) | The till: pizza, drinks, shop, sauna sessions, and from now the head count via $0 items "Kid eats free" and "Visitor, not eating" | Read by `npm run square:pull` in the repo |
| GoHighLevel (shared ACT location, tag `project:act-hv`, pipeline "Harvest Inbox") | People: members, enquiries, owed replies, forms from the website | Nothing in Notion should duplicate a contact |
| Mighty Networks | The inside room for members: members-first event links, artist-in-residence threads, member opportunities ("I'm in" posts). No money except the future Supporter plan | Monday sweep carries activity into GHL tags |
| Humanitix | Tickets for capped, paid events | Link posted in Mighty 48 hours before public |
| Website theharvestwitta.com.au | Public truth: hours, What's On, forms | Events come from the `harvest_events` table; the calendar in Notion is the plan, the site is the publication |
| Supabase project tednluwflfhxyucgwigh | Database behind the site, plus a mirror of Xero bank lines | Read by the scripts; never edited by hand |

Entities, for anything about money or contracts: Nic's sole trader trades The Harvest today; A Curious Tractor Pty Ltd trades as Goods on Country and shares Joey and Trina with The Harvest; The Harvest Pty Ltd is planned with the landlord as minority shareholder; The Butterfly Movement Ltd is the only DGR vehicle; A Kind Tractor Ltd is dormant and out of scope.

## The one rule

Edit where the thing lives. Strategy and code in the repo. Decisions, dates, meetings and the calendar in Notion. Money in Xero. Sales in Square. People in GHL. Member conversation in Mighty. If you find the same fact written in two places, propose which one keeps it and which one becomes a link.

## What to produce

Write one page called "How The Harvest runs: Notion map (September 2026)" under The Harvest Witta HQ, with these sections and nothing else:

1. **Open on Monday.** The three things to look at, in order, and what "green" looks like for each. Link to the dashboard, the review page and the calendar. Include the two repo commands a human runs (`npm run square:pull`, `npm run books:check`) and what their output means.
2. **What lives in Notion.** A short table of every Harvest page and database that should exist, its one job, its owner, and how often it is touched. Mark anything you found that duplicates the repo, GHL or Xero as "make this a link".
3. **What lives elsewhere, and how to get there.** One row per system from the table above: what it owns, the link or command, who has access, and the one thing never to do there (for example: never edit Square prices from Notion; never write a contact into Notion).
4. **Roles.** Ben (builds, money, systems), Nic (vision, community, sauna, events), Dennis (pizza, the till), Susie and Joey (stewards, garden, work days), Standard Ledger (books), Sonas (landlord). For each: the pages they own, the pages they read, and what they must never have to do.
5. **Decisions waiting.** Pull the open decisions from the review page and the calendar (rows of Type "Decision" not Done) into one list with owner and date. Do not add new decisions.
6. **Archive candidates.** Pages under Harvest HQ that are stale, duplicated or superseded. List them with the reason. Do not archive anything yourself; archiving in Notion cascades to children and needs a human.
7. **What is missing.** At most five things Notion should hold that it does not, each with why and where it would sit.

## Constraints

- Do not create databases, move pages, archive pages or change properties. One new page only, plus links.
- Plain words. No em-dashes. Short sentences. No praise for the existing setup, no filler.
- Every claim about money, dates or counts must come from a page you read or be marked "unverified".
- Where two pages disagree (the website hours, the venue signs and the calendar disagree today), say so and name both pages rather than picking one.
- Australian spelling. "Work days", never "working bees". Jinibara Country, Witta.
