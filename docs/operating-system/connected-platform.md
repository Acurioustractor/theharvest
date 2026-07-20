# Connected platform

The Harvest Website is the public front door. ACT infrastructure is the private
control room. They share the ACT Supabase project, so data is exposed through
restricted views rather than copied between databases.

Canonical architecture:

```text
../act-global-infrastructure/docs/architecture/harvest-connected-platform.md
```

## Daily flow

```text
Shape and approve in Harvest docs or Notion
Publish through GHL
ACT pulls the actual result into Supabase
Command Center reviews performance and failures
The public website reads published Harvest posts only
```

## Public entry point

`/start` is the permanent front door for:

- visiting
- volunteering
- hosting
- supplying local goods
- joining
- sharing a story

Links carry `utm_campaign=start-here` and a specific `utm_content` value. Form
submissions preserve that attribution and apply matching GHL source tags.

## Do not duplicate

- Do not create a second social-post ledger in this repo.
- Do not move ACT finance or entity facts into Harvest working docs.
- Do not make Notion the machine ledger for published posts.
- Do not expose social drafts, failures or private engagement metrics publicly.
