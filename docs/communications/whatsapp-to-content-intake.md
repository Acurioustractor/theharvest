# WhatsApp To Content Intake

Use this when weekend discussion, site photos, voice notes, and quick local replies happen in WhatsApp and need to become posts.

## The Clean Model

```text
WhatsApp discussion -> content inbox -> weekend debrief -> post slate -> GHL publishing -> Notion record
```

WhatsApp is the raw field notebook.

GHL is the publishing desk.

Notion is the record.

Premiere is the video bench.

## What We Can Pull

### Official Path

Use the WhatsApp Business Cloud API.

It can capture messages sent to the business WhatsApp number through webhooks.

It can include:

- text messages
- image messages
- video messages
- audio or voice notes
- document messages
- sender metadata
- timestamps
- delivery and read status events

This is the clean, consent-aware path.

### What We Should Not Do

Do not scrape personal WhatsApp chats.

Do not use a shady WhatsApp Web session bridge for private groups.

Do not treat private chat messages as public copy without checking permission.

If something useful is said in a private chat, turn it into a note first:

```text
Private source. Needs permission before public use.
```

## Best Version For The Harvest

Create a dedicated WhatsApp Business number for Harvest field intake.

Use it for:

- weekend notes
- local offers
- people sending photos
- quick voice notes after working bees
- "I found this thing" messages
- volunteer questions
- site updates from Ben, Nic, Susie, Joey, or helpers

Every inbound item gets turned into a content inbox item with:

```text
Source: WhatsApp
Sender:
Date:
Type: text | image | video | voice | document
Raw note:
Media URL:
Consent: unknown | internal only | ok to quote | ok to use image
Possible use: post | reel | newsletter | record only
Status: raw | reviewed | drafted | used | archived
```

## Consent Rules

Default to private.

Before public use, check:

- did the person know this could be shared?
- can we use their name?
- can we show their face?
- can we use their photo or video?
- is this a child or family moment?
- is this sensitive, unfinished, or culturally specific?

Use these labels:

```text
Internal only
Paraphrase only
Quote approved
Image approved
Needs follow-up
```

## Weekend Debrief Add-On

When doing the weekend debrief, add:

```text
WhatsApp notes:

[Paste useful messages, voice note transcripts, and media descriptions.]

Permission status:

[Say what is safe to use publicly and what is private.]
```

Then the agent should pull out:

- story sparks
- useful quotes
- practical asks
- possible replies to people
- images worth using
- moments that need permission
- things that belong in newsletter only

## Content Patterns From WhatsApp

### 1. Local Offer

Raw:

```text
I have a few chairs and some old timber if useful.
```

Post angle:

```text
Before we buy new, we are asking local.
```

Best channel:

- Facebook
- newsletter note

### 2. Site Discovery

Raw:

```text
Found the old pots behind the shed.
```

Post angle:

```text
The place keeps giving us useful things.
```

Best channel:

- Instagram reel
- photo dump

### 3. Voice Note Reflection

Raw:

```text
The garden makes more sense when kids are running through it.
```

Post angle:

```text
The plan gets better when real people move through the place.
```

Best channel:

- Instagram
- newsletter lead

### 4. Practical Question

Raw:

```text
When is the next working bee?
```

Post angle:

```text
Next chance to come through.
```

Best channel:

- Facebook event post
- Instagram story

## Minimum Useful Integration

Start with this before building anything heavy:

1. Create a Harvest WhatsApp Business number.
2. Ask core team to send weekend photos, voice notes, and offers there.
3. Export or forward useful messages into the weekend debrief.
4. Use the debrief workflow to create posts and videos.

This proves the behavior before touching the API.

## Weekly Export Workflow

This is the simplest weekly capture method.

On your phone:

1. Open the WhatsApp chat or group.
2. Tap the chat name.
3. Choose `Export chat`.
4. Choose `With media` if images and videos matter, or `Without media` for speed.
5. Save the export to your computer.
6. Use the `.zip` directly, or use an extracted folder if you already unzipped it.
7. Run the importer.

```bash
npm run whatsapp:debrief -- --input "/Users/benknight/Downloads/WhatsApp Chat - Harvest - Garden Crew.zip"
```

If you have already moved the export into the project, this also works:

```bash
npm run whatsapp:debrief -- --input docs/communications/debriefs/_whatsapp-exports/[export-folder-or-file]
```

The script creates:

```text
docs/communications/debriefs/YYYY-MM-DD-[chat-name]-debrief-seed.md
```

That file gives the agent:

- message count
- main voices
- possible story sparks
- media to check
- recent conversation tail
- permission labels to fill in

Then paste or reference that file in the weekend debrief.

The script adds hashes to the debrief. If the same export is imported again, it skips instead of creating a duplicate. Use `--force` only when you intentionally want a second debrief from the same export.

For the Harvest Garden Crew export, the weekly command is:

```bash
npm run whatsapp:debrief -- --input "/Users/benknight/Downloads/WhatsApp Chat - Harvest - Garden Crew.zip"
```

## Why Not Playwright First

Playwright or computer-use automation against WhatsApp Web is possible in theory, but it is the wrong first move.

Problems:

- WhatsApp Web does not expose a clean export-chat flow like the phone app.
- UI automation is brittle.
- It can drift when WhatsApp changes the interface.
- It creates more privacy and account-risk surface.

Use phone export first.

If the weekly habit works, then build a proper business-number webhook later.

## Proper Integration Later

Build a webhook endpoint:

```text
POST /api/whatsapp/webhook
GET /api/whatsapp/webhook
```

The webhook should:

1. verify Meta's webhook challenge
2. receive inbound WhatsApp messages
3. store raw message payloads
4. download media files using the media ID
5. mirror media into Supabase storage
6. create or update a Notion content inbox record
7. mark everything as `raw` until reviewed

Do not auto-publish from WhatsApp.

WhatsApp is for capture.

Humans still decide what becomes public.

## Content Inbox Shape

If we create a Notion database, use these fields:

```text
Name
Source
Sender
Date
Message Type
Raw Text
Media
Consent Status
Possible Use
Related Weekend
Status
Used In Post
Notes
```

Useful views:

- Raw Inbox
- Needs Permission
- Good For Posts
- Good For Reels
- Used
- Archive

## Weekly Use

On Monday:

1. Review the WhatsApp inbox.
2. Mark anything private.
3. Pull 3 to 5 usable moments into the weekend debrief.
4. Build the post slate.
5. Make the first reel.
6. Publish in GHL.
7. Pull GHL records back to Notion.
