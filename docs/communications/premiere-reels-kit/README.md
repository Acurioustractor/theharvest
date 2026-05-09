# Premiere Pro Reels Kit

Use this kit to make short Harvest videos quickly in Premiere Pro, then finish the publishing in GHL.

Start here if you are dealing with large files, drone footage, or a messy folder of clips:

- [[../video-to-reels-workflow|Video To Reels Workflow]]

## House Export Standard

Use this for Facebook Reels and Instagram Reels:

```text
Format: H.264
Preset base: Match Source - High Bitrate
File type: MP4
Frame size: 1080 x 1920
Aspect ratio: 9:16 vertical
Frame rate: 30 fps
Field order: Progressive
Profile: High
Level: 4.2
Bitrate encoding: VBR, 1 pass
Target bitrate: 10 Mbps
Maximum bitrate: 16 Mbps
Audio codec: AAC
Audio sample rate: 48 kHz
Audio bitrate: 128 kbps
Maximum length target: 90 seconds
Best length target: 20 to 45 seconds
Maximum file size target: under 300 MB
```

## Premiere Project Template

Create one Premiere project called:

```text
Harvest-Reels-Template.prproj
```

Inside it, set up these bins:

```text
00 Exports
01 Footage
02 Selects
03 Music
04 Voiceover
05 Graphics
06 Captions
07 Sequences
```

Create these starter sequences:

```text
HVST_REEL_15S_PLACE
HVST_REEL_30S_STORY
HVST_REEL_45S_WALKTHROUGH
HVST_REEL_60S_EVENT
```

All sequences should use:

```text
Editing mode: Custom
Timebase: 30.00 fps
Frame size: 1080 horizontal, 1920 vertical
Pixel aspect ratio: Square Pixels
Fields: No Fields
Display format: 30 fps Timecode
Audio sample rate: 48000 Hz
```

## Timeline Layers

Use the same layer order every time:

```text
V5 - Safe zone guide, disabled before export
V4 - Text overlays
V3 - Logo or small end card
V2 - B-roll cutaways
V1 - Main video
A3 - Sound effects
A2 - Music
A1 - Voice or natural sound
```

## Safe Zones

Keep important text and faces away from:

- top 250 px
- bottom 350 px
- left 80 px
- right 80 px

This avoids overlap with usernames, captions, buttons, and GHL or Meta UI.

## Four Templates To Build

### 1. Place Moment, 15 Seconds

Use for quick atmosphere posts.

```text
0-2s: strongest visual, no intro
2-7s: detail shot
7-12s: wider context
12-15s: simple question or invite
```

Example text:

```text
What should this become?
```

### 2. Story, 30 Seconds

Use for a small narrative.

```text
0-3s: hook
3-10s: what we are looking at
10-22s: why it matters
22-30s: question or next step
```

### 3. Walkthrough, 45 Seconds

Use for garden, kitchen, art space, or site progress.

```text
0-4s: hook
4-15s: area 1
15-28s: area 2
28-38s: detail or human moment
38-45s: invitation
```

### 4. Event Recap, 60 Seconds

Use after gatherings or working bees.

```text
0-5s: best human moment
5-20s: people arriving or working
20-40s: details, food, garden, art, tools
40-55s: outcome or feeling
55-60s: thank you or next date
```

## Export Naming

Use this naming pattern:

```text
YYYY-MM-DD_harvest_topic_platform_1080x1920_v01.mp4
```

Example:

```text
2026-04-28_harvest_milk-crates_reel_1080x1920_v01.mp4
```

## GHL Publishing Flow

1. Export from Premiere using the house standard.
2. Upload video directly into GHL Social Planner.
3. Preview Facebook and Instagram separately.
4. Schedule or publish in GHL.
5. Pull the GHL record back to Notion:

```bash
npm run sync:social -- --pull-ghl
npm run sync:social -- --pull-ghl --apply
```
