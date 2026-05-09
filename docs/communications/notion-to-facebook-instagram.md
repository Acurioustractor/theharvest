# GHL to Notion Social Records

Use this when GHL is the place where posts are written, previewed, scheduled, and published.

Notion becomes the record keeping layer, not the main posting tool.

The day-to-day Notion view is:

```text
ACT Communications Dashboard -> Harvest Posting Queue
```

That view is filtered to The Harvest and shows the posting record after GHL has done the publishing work.

## Daily Workflow

Work in GHL first:

1. Create the post in GHL Social Planner.
2. Add the image or video in GHL.
3. Choose Facebook, Instagram, or both.
4. Preview each channel in GHL.
5. Schedule or publish from GHL.
6. Pull GHL records back into Notion.

Dry-run the pull first whenever you schedule, publish, or edit posts:

```bash
npm run sync:social -- --pull-ghl
```

Read the rows before applying.

Check:

- status is right: Draft, Scheduled, or Published
- platform is right: Instagram, Facebook, or both
- media is attached when expected
- old test posts are not being recreated

If the rows look right, write them to Notion:

```bash
npm run sync:social -- --pull-ghl --apply
```

If the dry run shows a strange platform or missing media, fix the post in GHL first, then run the dry run again.

## What Notion Stores

The pull creates one grouped Notion record per GHL post group.

It stores:

- caption in `Key Message/Story`
- platform list in `Target Accounts`
- image URL in `Image`
- GHL group ID in `GHL Post ID`
- date in `Sent date`
- status as Draft, Scheduled, or Published
- import details in `Notes`

If the same post goes to Facebook and Instagram, GHL may create separate channel posts. The pull groups them into one Notion record when GHL gives them the same parent post ID.

## When To Use Notion First

Use Notion first only for rough ideas, campaign planning, or a lightweight content backlog.

For actual publishing, use GHL first. It handles channel previews, media handling, scheduling, and publish state better.

## Caption Rule

If the same caption works for both Facebook and Instagram, use one Notion row.

If Facebook needs practical details and Instagram needs a shorter place-story caption, create two Notion rows:

- one row for Facebook
- one row for Instagram

## Best Shared Post Shape

```text
Strong first line.

One real detail from the site.

Why it matters.

What people can do next.

Link or invitation.

#TheHarvestWitta #Witta #Maleny #SunshineCoastHinterland
```

## Image Rules

Best shared size:

- square image
- 1080 x 1080 px
- readable on a phone
- no tiny text

Use a photo when the post is about the place, people, food, garden, or making.

Use a graphic when the post needs a date, countdown, or clear event detail.

## Current Technical Blockers To Check

Before relying on this daily:

- The Notion integration token must be valid.
- The `ACT Communications Dashboard` must be shared with the Notion integration.
- GHL Social Planner must have Facebook and Instagram connected.
- GHL OAuth for social posting may need to be refreshed through `/api/social-auth/start`.

## Quick Test

Create a test post in GHL:

1. Add one image.
2. Select Facebook and Instagram.
3. Save as draft or schedule.
4. Run `npm run sync:social -- --pull-ghl`.
5. If it appears correctly, run `npm run sync:social -- --pull-ghl --apply`.

Check the new Notion row, then delete the test from GHL if it was only a test.
