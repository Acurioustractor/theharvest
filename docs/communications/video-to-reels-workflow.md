# Video To Reels Workflow

Use this when you have a pile of phone videos, drone footage, long clips, and no obvious reel yet.

The goal is not to process everything.

The goal is to find one small story.

## The Rule

```text
Big footage -> quick review -> selects -> clean vertical cut -> GHL Media Storage -> GHL Social Planner
```

Do not start by editing.

Start by choosing.

## Where Large Video Should Live

Keep large raw video files out of the repo.

Use a local media folder like:

```text
/Users/benknight/Movies/Harvest Media/
```

Suggested folders:

```text
Harvest Media/
  00_INBOX/
  01_ORIGINALS/
  02_SELECTS/
  03_PROJECTS/
  04_EXPORTS/
  05_ARCHIVE/
```

What each folder does:

| Folder | Job |
| --- | --- |
| `00_INBOX` | Dump new phone, drone, and camera files here |
| `01_ORIGINALS` | Keep untouched source files |
| `02_SELECTS` | Copy only the best clips or trimmed selects |
| `03_PROJECTS` | Premiere projects |
| `04_EXPORTS` | Finished reels ready for GHL |
| `05_ARCHIVE` | Old weeks |

## Weekly Folder

Create one folder per week:

```text
/Users/benknight/Movies/Harvest Media/2026-04-29_garden-progress/
```

Inside:

```text
00_INBOX/
01_ORIGINALS/
02_SELECTS/
03_PROJECTS/
04_EXPORTS/
notes.md
```

`notes.md` should link back to Obsidian:

```text
Comms plan: docs/communications/THIS-WEEK.md
Weekly plan: docs/communications/weekly-plans/2026-04-29-harvest-content-plan.md
```

## File Naming

Rename only the selects, not every raw file.

Use:

```text
YYYY-MM-DD_harvest_zone_subject_shot_v01.ext
```

Examples:

```text
2026-04-29_harvest_garden_drone-wide_v01.mov
2026-04-29_harvest_garden_weeding-close_v01.mp4
2026-04-29_harvest_entry_windy-witta_v01.mp4
2026-04-29_harvest_kids-area_mulch-after_v01.mp4
```

## The 20 Minute Triage

Do this before opening Premiere.

### Pass 1: Delete Nothing

Watch fast.

Move anything possibly useful into:

```text
02_SELECTS/
```

Look for:

- best first 2 seconds
- visible before and after
- human hands
- movement through space
- texture
- sound
- a funny or local moment
- one shot that makes the place understandable

### Pass 2: Give Each Select A Job

Each clip gets one label:

```text
HOOK
PLACE
PROGRESS
PEOPLE
DETAIL
ASK
ENDING
DRONE
```

Put the label in the filename if helpful:

```text
2026-04-29_harvest_garden_HOOK_after-wide_v01.mov
```

### Pass 3: Choose One Reel

Pick one:

```text
Place changed
Someone showed up
We need a thing
Walk the space
Before and after
Funny local moment
```

Then stop sorting and make that reel.

## Fast Terminal Reel Cut

For a simple drone or phone clip, skip Premiere and make a clean vertical cut:

```bash
npm run make:reel -- --input "/path/to/video.mp4" --output /private/tmp/harvest-reel.mp4 --start 12 --duration 12 --crop-x 1320
```

Default is no overlay text. Keep it that way unless the post needs text baked into the video.

Then push it to GHL:

```bash
npm run push:reel:ghl -- --input /private/tmp/harvest-reel.mp4 --title "Garden Drone Reel - 2026-04-29" --summary "Caption text here" --platforms "Instagram,Facebook"
```

This uploads to GHL Media Storage first. That matters. Facebook may fail when asked to fetch video from other public storage URLs.

## Drone Footage Rules

Drone footage is seasoning, not the meal.

Use it for:

- opening context
- showing the whole place
- moving from road to garden
- showing before and after scale
- ending with a sense of place

Avoid:

- long flyovers
- slow cinematic intros
- drone-only reels
- shots where the subject is unclear
- using the best drone shot before the story has a point

Good use:

```text
0-2s: after shot or strongest ground detail
2-5s: drone context
5-20s: ground progress
20-25s: drone wide or entry move
25-30s: ask
```

Today's proven use:

```text
DJI 4K drone clip -> 12 second 1080x1920 clean cut -> GHL Media Storage -> Instagram + Facebook Reel
```

The post worked after the media lived on GHL's `filesafe.space` CDN.

## Reel Recipes For Harvest

### 1. The Place Changed

Best for: garden cleanup, mulch, pruning, children's area, entry path.

Length: 20 to 30 seconds

Structure:

```text
0-2s: strongest after shot
2-5s: before shot
5-12s: work happening
12-20s: details
20-27s: wider context
27-30s: invite or ask
```

Overlay:

```text
One corner changed this week
```

Caption job:

Say what changed and ask for the next bit of help.

### 2. Drone To Ground

Best for: showing The Harvest as a real place.

Length: 15 to 25 seconds

Structure:

```text
0-3s: drone wide
3-8s: entry or path
8-15s: ground detail
15-22s: human or object detail
22-25s: question
```

Overlay:

```text
This place is starting to make sense
```

Caption job:

Make the site understandable. Do not over-explain.

### 3. Before We Buy New

Best for: local asks.

Length: 15 to 25 seconds

Structure:

```text
0-3s: show the place
3-8s: show the gap
8-18s: list the useful things
18-25s: message us
```

Overlay:

```text
Quick local ask
```

Caption job:

Ask for chairs, tables, timber, pots, tools, shade cloth, skills.

### 4. Windy Witta

Best for: light local character.

Length: 8 to 15 seconds

Structure:

```text
0-3s: the funny movement
3-8s: wider shot
8-12s: one dry line
12-15s: question
```

Overlay:

```text
Windy Witta is part of the design brief
```

Caption job:

Keep it light. Make the place feel alive.

### 5. Working Bee Recap

Best for: after people show up.

Length: 30 to 45 seconds

Structure:

```text
0-3s: best human or progress moment
3-12s: people working
12-25s: details
25-35s: result
35-45s: thanks and next date
```

Overlay:

```text
Small progress. Useful progress.
```

Caption job:

Thank people and name the next way to help.

## Premiere Setup For Big Files

Use the existing kit:

- [[premiere-reels-kit/README|Premiere Reels Kit]]
- [[premiere-reels-kit/reel-production-checklist|Reel Production Checklist]]

For big drone files, use proxies.

Premiere path:

```text
Media Browser -> Ingest checkbox -> Create Proxies
```

Suggested proxy preset:

```text
QuickTime ProRes Proxy
1280 x 720 for horizontal footage
720 x 1280 for vertical footage if available
```

Edit in the vertical sequence:

```text
1080 x 1920
30 fps
H.264 export
Target 10 Mbps
Maximum 16 Mbps
```

Use `Set to Frame Size`, then manually reframe important action.

For drone footage, expect to crop heavily into the vertical frame. Keep the subject centered.

## Export Standard

Use this for Instagram and Facebook reels:

```text
MP4
H.264
1080 x 1920
9:16 vertical
30 fps
AAC audio
20 to 45 seconds preferred
under 90 seconds when possible
```

Meta's current official guidance says Instagram reels can be uploaded between `1.91:1` and `9:16`, with at least `30 fps` and at least `720 px` resolution. For our workflow, keep it simple and export `1080 x 1920` vertical.

## Fast Command Line Helpers

Only use these if you are comfortable in Terminal.

Make a small review copy:

```bash
ffmpeg -i input.mov -vf scale=-2:720 -c:v libx264 -crf 28 -preset fast -c:a aac review.mp4
```

Trim a rough select without re-encoding:

```bash
ffmpeg -ss 00:01:12 -to 00:01:24 -i input.mov -c copy select.mp4
```

These are for sorting, not final exports.

## This Week's Best Reel From The Current Footage

Make this first:

```text
The garden is starting to show itself
```

Use:

- drone or wide shot for context
- 9 April before and after garden clips
- pruning, weeding, mulch, and road-facing cleanup
- one human detail if available

Do not make a full site montage first.

Make one clean progress reel.

## The Weekly Habit

After every site day:

1. Drop all video into `00_INBOX`.
2. Copy the best 10 to 20 clips into `02_SELECTS`.
3. Label 5 clips as hook, place, progress, detail, ending.
4. Make one reel.
5. Export to `04_EXPORTS`.
6. Upload to GHL.
7. Pull the GHL record back to Notion.

If the system takes more than 45 minutes before editing starts, it is too heavy.
