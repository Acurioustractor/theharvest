---
title: "Harvest Engagement Enrichment Workflow"
type: workflow
date: 2026-05-03
tags:
  - "#workflow/enrichment"
  - "#workflow/notion"
  - "#strategic/engagement"
status: current
---

# Harvest Engagement Enrichment Workflow

## Summary

The Harvest Engagement database is the relationship memory. The enrichment runner adds factual contact and location data to business and organisation records, then leaves the outreach judgment visible in Notion.

The flow is:

```text
Notion Harvest Engagement -> Google Places -> official website crawl -> optional Hunter/ABN -> Notion enrichment fields -> human outreach review
```

## Notion Fields

The database now has these enrichment fields:

- Website
- Google Place ID
- Google Maps URL
- Latitude
- Longitude
- Public Email
- Contact Form URL
- Instagram
- Facebook
- LinkedIn
- ABN
- ABN Status
- Opening Hours
- Rating
- Review Count
- Business Status
- Enrichment Status
- Enrichment Confidence
- Source URLs
- Outreach Channel
- Consent Basis
- Last Enriched
- Enrichment Notes

It also has two working views:

- Enrichment Pipeline
- Outreach Ready

## Runner

Use the local TypeScript runner:

```bash
npm run enrich:engagement
```

Dry-run is the default. It queries business and organisation records, enriches them, and writes a report to:

```text
research/data/harvest-engagement-enrichment-report.json
```

Apply changes to Notion:

```bash
npm run enrich:engagement -- --apply
```

Useful scoped runs:

```bash
npm run enrich:engagement -- --limit 10
npm run enrich:engagement -- --only "Maleny Cheese" --apply
npm run enrich:engagement -- --recheck --apply
```

Email-domain sweep:

```bash
npm run enrich:engagement -- --email-domain
npm run enrich:engagement -- --email-domain --apply
```

This uses existing `Email` and `Public Email` values to infer a domain website. It skips generic personal domains and ISP inbox providers such as Gmail, Outlook, Yahoo, iCloud, Bigpond, OzEmail, TPG, and similar addresses. It can fill missing `Website`, `Organisation`, contact form, public/domain email, social links, source URLs, and enrichment notes.

Optional paid or registered sources:

```bash
npm run enrich:engagement -- --hunter --apply
npm run enrich:engagement -- --abn --apply
```

## Environment

Required:

```text
NOTION_TOKEN
GOOGLE_PLACES_API_KEY
HARVEST_ENGAGEMENT_DS_ID
```

Optional:

```text
HUNTER_API_KEY
ABN_LOOKUP_GUID
```

## Outreach Guardrails

The script does not send messages. It only records facts and routing hints.

Public emails found on websites are marked as `Conspicuously published business contact`, not as blanket consent. If a record has weak matching, no clear contact path, or only a scraped clue, it is marked `needs-human-review`.

Before outreach, check:

- Is the message directly relevant to the business or organisation?
- Is the contact path public and intended for this kind of enquiry?
- Would a contact form, phone call, or warm intro be more respectful than email?
- Does the message identify The Harvest and give a clear opt-out if it is a marketing-style email?

## Source Notes

Primary enrichment sources:

- Google Places for place identity, address, phone, website, rating, review count, opening hours, and Google Maps URL.
- Official business websites for published email, contact forms, and social links.
- Hunter only when explicitly enabled, mainly for generic domain emails.
- ABN Lookup only when `ABN_LOOKUP_GUID` is configured.

Compliance note: Australian spam rules still matter. Treat enrichment as relationship preparation, not automatic cold-email permission.
