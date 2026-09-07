# Prompt: rebuild the Harvest Dashboard as one screen (for Notion AI, 7 Sep 2026)

You are rebuilding one Notion page: **Harvest Dashboard** (id 34cebcf981cf81ca9981f3ff88b71d37) under The Harvest Witta HQ. Today it is a long document. It must become a dashboard: one screen a tired person reads in thirty seconds on a Monday. Use Notion's own tools for this: linked database views with filters and sorts, callouts, columns, toggles. Do not paste text where a live view will do.

## Read first

- The page as it is now, including its three child pages "Dashboard archive 1, 2, 3" and the four inline database blocks on it.
- "How The Harvest runs: Notion map (September 2026)" (id 3bc79089282f4cf997bfe318348485bb), section 1, for what green means on Monday.
- The Harvest Calendar database (id 67bba19b3a924c0eae889a26b7500dd6). Properties: Date, Type, Zone, Owner, Status, Package, Tool, Gate, Public.
- The ACT Actions database (id 177ebcf981cf8023af6edff974284218) and its existing Harvest view.
- "Money, events and people: review after the first green week" (id 3d4ebcf981cf81928439fe782c80b530), for the decisions list.

## The layout, top to bottom

1. **Four callouts in one row (columns).** Each is one number and one line of context. Fill them from the sources named; if a source does not hold the number, write "unverified" rather than inventing it.
   - Last weekend: heads and taken. Source: the Monday evidence line (currently 69 heads, $2,215, 4 to 6 Sep).
   - Waiting on a reply: count and oldest. Source: the newest daily check-in (currently 8 people, oldest 113 days).
   - Next opening: date and named host. Source: the next Confirmed or Tentative calendar row of Type "Pizza weekend" or "Event". If Owner is blank or "Ben and Nic" with no names, show "host not named".
   - Decisions due this week: count. Source: calendar rows of Type "Decision", Status not Done, Date within 7 days.
2. **Who is on this weekend.** A three-column line: Friday, Saturday, Till. Pull from the next Pizza weekend row's Notes if names are there; otherwise leave blank with the words "fill from the calendar row". Do not invent names. Dennis has left; the current default is Ben, Nic and Nic's dad with Joey or Susie on the till, and that only belongs here if the calendar row says so.
3. **Three linked database views, each collapsed to what matters:**
   - "This month": Harvest Calendar, filter Date within this month and Status is Confirmed or Tentative, sort by Date, show Name, Date, Type, Owner, Status, Package, Tool. Calendar or list layout, not a table if it scrolls.
   - "Overdue and due soon": ACT Actions, filtered as its Harvest view is, plus Due Date on or before 7 days from now and Status not Done, sort by Due Date. Show Action Item, Status, Due Date, Assigned to.
   - "Decisions waiting": Harvest Calendar, filter Type is Decision and Status is not Done, sort by Date. Show Name, Owner, Date.
4. **Systems, one line.** Eight links in a single paragraph, no table: GitHub repo (https://github.com/Acurioustractor/theharvest/tree/main), Xero, Square, GoHighLevel (https://app.gohighlevel.com/v2/location/agzsSZWgovjwgpcoASWG), Mighty (https://harvest-the-network.mn.co/), Humanitix, Website (https://www.theharvestwitta.com.au/whats-on), Supabase. Explanations live on the map page; link to it once.
5. **Two commands**, one code block, as they are now (`npm run square:pull`, `npm run books:check`).

## What leaves the page

- Create a child page **"Agent log"**. Move into it, in this order and without editing a word: the "Monday evidence line" table, the heading "📅 Latest weekly update (auto-posted by Monday 8am agent)" with the Week 10 status beneath it, the three "Daily check-in" sections. Keep that weekly heading text exactly; an automation looks for it.
- Move the three "Dashboard archive" child pages under "Agent log" as well.
- The three untitled inline database blocks are views of a dead actions database (data source a83dd8a7-e314-491e-8183-a8f5eff367e3). Do not delete them yourself. Move them to the bottom of "Agent log" under a heading "Dead views, delete after Ben confirms".
- The one remaining inline database is the site-build Budget (data source 3df521a0-b3f8-4f47-983d-6713657befe5). Keep it, but as a link in the Systems line, not embedded.
- Sections 2 to 6 of the current page (This week, Monday evidence line, Systems table, Rhythm and agents, Archive) are replaced by the layout above. Their words are already in the archive pages or the map; do not keep a copy.

## Rules

- No new databases. One new page ("Agent log"). Linked views only, never duplicated databases.
- Nothing deleted. Moving is fine. If Notion warns that an operation deletes a child page or database, stop and say so.
- No invented numbers, names or dates. "unverified" or blank beats a guess.
- Plain words, no em-dashes, Australian spelling. "Work days", not "working bees".
- When done, report: what each callout shows and its source, the filter on each view, what moved to Agent log, and anything you could not do.
