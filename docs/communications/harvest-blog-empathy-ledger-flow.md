# Harvest Blog + Empathy Ledger Flow

Use this when writing a public Harvest blog piece in Empathy Ledger and making it appear on the Harvest website.

## What The Website Reads

The Harvest website does not store blog bodies locally.

Flow:

```text
Empathy Ledger article -> Content Hub API -> Harvest /blog -> Harvest /blog/:slug
```

Public articles appear on `/blog` only when they are:

- `status = published`
- `visibility = public`
- syndicated to `harvest`

Drafts do not belong on the public site.

## Write And Syndicate A Blog

1. Open Empathy Ledger admin.
2. Go to articles.
3. Create or open the article.
4. Keep `status = draft` while writing or waiting for consent.
5. Set the article type.
6. Add the title, subtitle, excerpt, body, themes, and featured image.
7. Set `Syndication destinations` to `harvest`.
8. If the article should appear under a work page, set the primary project to the work slug.
9. Publish only after the person, photo, and story context are approved.

Useful work slugs:

- `the-garden`
- `milk-crate-pavilion`
- `the-cedar`
- `the-shop`
- `kids-area`
- `the-milk-man`

## Where It Appears

Global Blog:

```text
/blog
```

Article page:

```text
/blog/:slug
```

Work page journal:

```text
/works/:workSlug
```

The work page journal uses the article project filter. If a piece is about the Milk Crate Pavilion, use `milk-crate-pavilion` as the primary project or related project in Empathy Ledger.

## Approval Rule

Person-led stories stay draft until:

- the person is comfortable being named
- quotes are checked in context
- photos are approved for public use
- the excerpt does not flatten or sensationalise the person
- the article has one clear Harvest reason to exist

Barry is currently treated as draft/in review. Do not publish his public profile, quotes, or story card until the context is approved.

## Current Public Shape

For now, `/blog` is intentionally simple:

- one fixed starter card: `What is The Harvest?`
- the published Empathy Ledger article feed
- search only
- no theme or work filter buttons until there are enough articles to make filters useful

When there are roughly 6-9 published articles, bring filters back.

## Quick Verification

After publishing in Empathy Ledger:

1. Open `/blog`.
2. Confirm the article appears.
3. Open `/blog/:slug`.
4. Confirm the body, image, title, and excerpt are right.
5. If linked to a work, open `/works/:workSlug`.
6. Confirm it appears in the work journal.
7. If it is person-led, open `/people` and the person page only after consent is approved.
