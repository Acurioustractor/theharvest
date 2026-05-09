# Debriefs

Use this folder for raw source summaries that can become weekly content.

Current WhatsApp debrief:

- [[2026-04-27-whatsapp-chat-harvest-garden-crew-debrief-seed|Harvest Garden Crew WhatsApp Debrief - 2026-04-27]]

Archive:

- [[archive|Old test debriefs]]

## Rule

Use debriefs as source material.

Do not publish directly from them.

Flow:

```text
WhatsApp export -> debrief -> THIS-WEEK -> GHL -> Notion record
```

## Weekly Command

```bash
npm run whatsapp:debrief -- --input "/Users/benknight/Downloads/WhatsApp Chat - Harvest - Garden Crew.zip"
```

The importer skips duplicates when the same export has already been processed.
