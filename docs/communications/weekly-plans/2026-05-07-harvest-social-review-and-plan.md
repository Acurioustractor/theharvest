# Harvest Social Review And Plan - 2026-05-07

Source of truth:

- GHL Social Planner pull on 7 May 2026
- Notion connector fetch of ACT Communications Dashboard on 7 May 2026
- [[../THIS-WEEK|This Week board]]
- [[2026-04-29-next-few-weeks-whatsapp-content-plan|Next Few Weeks WhatsApp Content Plan]]

## Verification Status

Verified:

- GHL Social Planner post statuses, dates, target channels, attached media, and failed-post error text were pulled from the GHL API.
- The Notion connector can fetch the ACT Communications Dashboard and its data source.

Blocked:

- The local Notion API token used by `npm run sync:social -- --pull-ghl` still cannot access the ACT Communications Dashboard. The script now falls back from the configured data-source ID to the database ID, but Notion rejects both for the current token.

Not API-verified:

- Facebook comments
- Instagram comments
- DMs
- likes, shares, saves, reach, or reel views

Decision:

```text
Use GHL as the verified publishing board.
Use Facebook / Instagram / GHL Inbox as the manual response check.
Use Notion as the archive once the JusticeHub Notion integration has database access.
```

## What Actually Happened

### Published

| Date | Post | Channel | State |
| --- | --- | --- | --- |
| 29 Apr 2026 | Garden reel / garden showing itself | Instagram + Facebook | Published |
| 1 May 2026 | Road-facing garden | Facebook | Published |
| 2 May 2026 | Mesh arches ask | Facebook | Published |

### Failed

| Date | Post | Channel | State |
| --- | --- | --- | --- |
| 30 Apr 2026 | Quick local ask | Facebook | Failed |

Failure note:

```text
GHL returned a generic Facebook/GHL request error: "Sorry, we're having trouble completing your request..."
```

This does not look like a content problem. It looks like a platform request failure.

Do not retry the exact same broad ask this week. Use the more specific watering and care ask instead.

### Still Drafted In GHL

| Draft | Channel | GHL group |
| --- | --- | --- |
| Planting day | Instagram + Facebook | `69f1a47f61cb6f777e80ffa9` |
| Watering and care ask | Facebook | `69f1a48277b53aacd8a012c1` |
| Community art detail | Instagram | `69f1a484372bcc93ba3814df` |
| Room to move | Facebook | `69f1a48561cb6f848181061b` |
| What changed this week | Instagram + Facebook | `69f1a48977b53a616ca01a07` |

## Read Of The Week

The published posts did the right setup work:

- the garden is visible
- the front is starting to look cared for
- the feed has a practical ask around mesh and growing

This week should not add a new theme.

It should move the story forward:

```text
we cleared and shaped it -> things are planted -> now we need care
```

## This Week's Publishing Order

### 1. Planting Day

Channel: Instagram + Facebook

Status: drafted in GHL

Recommended timing: Thursday or Friday.

Job: show that the garden has moved from clearing into planting.

Why first:

- it is the strongest visual update
- it follows naturally after road-facing progress and mesh arches
- it gives the watering ask something concrete to point at

### 2. Watering And Care Ask

Channel: Facebook

Status: drafted in GHL

Recommended timing: 24 to 48 hours after Planting Day.

Job: replace the failed broad ask with a sharper practical ask.

Do not make this fancy. It should feel like a local notice from a real place.

### 3. Community Art Detail

Channel: Instagram

Status: drafted in GHL

Recommended timing: after the practical ask.

Job: keep the feed human and small.

This is a quiet post, not a conversion post.

### 4. Room To Move

Channel: Facebook

Status: drafted in GHL

Recommended timing: midweek if the feed needs a behind-the-scenes update.

Job: show the operational work behind the public-facing progress.

Use this only if it feels useful. It is not essential.

### 5. What Changed This Week

Channel: Instagram + Facebook

Status: drafted in GHL

Recommended timing: end of week or weekend.

Job: wrap the week and set up the next debrief.

Use this after the first few posts have landed, not before.

## Posts To Ignore Or Hold

### Quick Local Ask

Status: failed.

Action: do not retry as-is.

Reason: too broad, and the watering/care ask is more timely.

### Windy Witta Entry Portal

Status: optional.

Action: hold unless there is a better video cut.

Reason: not needed this week. The week already has enough garden content.

## This Week's Newsletter Seed

Subject:

```text
The babies are in
```

Core:

```text
The Harvest has moved from clearing and shaping into planting and care.
```

CTA:

```text
Reply if you can help with watering, seedlings, mulch, compost, or steady garden time.
```

Short draft:

```html
<h2>The babies are in</h2>

<p>This week The Harvest moved from clearing and shaping into planting and care.</p>

<p>There are seedlings in the beds, mulch around the edges, and a bit more room to move.</p>

<p>The next useful jobs are simple: watering, checking, topping up mulch, seedlings, compost, and people who know how to keep young plants alive in Witta weather.</p>

<p>If you are nearby and can help with steady garden care, reply to this email or send us a message.</p>
```

## Review Questions For Monday

- Did the published posts get comments, DMs, or practical offers?
- Did the watering ask get a clearer response than the broad quick local ask?
- Did Instagram respond better to garden detail or community art detail?
- Is there new WhatsApp media for another weekly debrief?
- Do we need a working bee post, or only quiet ongoing help?

## Manual Engagement Capture

Use this table during the Monday review:

| Post | Channel | Likes / reactions | Comments | DMs | Practical offers | Follow-up |
| --- | --- | --- | --- | --- | --- | --- |
| Garden reel / garden showing itself | Instagram |  |  |  |  |  |
| Garden reel / garden showing itself | Facebook |  |  |  |  |  |
| Road-facing garden | Facebook |  |  |  |  |  |
| Mesh arches ask | Facebook |  |  |  |  |  |

## Daily Use This Week

1. Open GHL Social Planner.
2. Review the next drafted post.
3. Schedule only one or two posts at a time.
4. After each post lands, check Facebook, Instagram, and GHL Inbox manually for comments, DMs, and useful offers.
5. Drop new WhatsApp export into the workflow before planning next week.
