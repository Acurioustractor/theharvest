# Launch-night 6×4 flyer — copy + prompt

Asset: `harvest-launch-6x4.png` (3600×2400 = 6×4in at 300dpi, 3:2 landscape).
Source: `flyer.html` (re-render command at the bottom). QR: `qr-fb-event.png` → the Facebook event.

## Locked copy (all facts sourced from the weekend runbook; $30 is Ben's call 2026-06-19)
- Brand: **The Harvest · Witta**
- Eyebrow: **Opening Night**
- Headline (the one fact people need): **Saturday 20 June**
- Time: **Pizza from 5pm, till dark**
- Sub: **Music, activities, and the old nursery open again. Come and say hello.**
- Price: **$30 per person · pizza + activities**
- Where: **The Harvest · 9 Gumland Drive, Witta**
- RSVP: **Scan to say you're coming · facebook → The Harvest Witta**
- Facebook event: https://www.facebook.com/events/2546805559095190

## ChatGPT / DALL·E image prompt (background-only — see the warning)
> Create a warm, inviting 3:2 landscape photograph (6×4) for a community event flyer.
> Scene: a long timber communal table inside a rammed-earth pavilion at golden hour,
> bowls of fresh garden produce and bread down the centre, soft afternoon light coming
> through tall windows that look out onto green Sunshine Coast hinterland hills. Relaxed,
> hopeful, lived-in. Natural earthy palette — warm browns, golden light, forest green.
> Leave the bottom third calmer and darker so text can sit over it. No text, no logos,
> no watermarks. Photographic, not illustrated.

**Warning:** AI image tools garble small text, prices and URLs. Don't trust them to render
"$30", the date, or the QR. Use the prompt above for a *background only*, then drop the
locked copy + the real QR (`qr-fb-event.png`) on top — or just use `harvest-launch-6x4.png`,
which already has correct text and a working QR.

## Re-render after any edit to flyer.html
```
cd "docs/strategy/weekend-20-june-2026/launch-flyer"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --hide-scrollbars --force-device-scale-factor=2 --window-size=1800,1200 \
  --virtual-time-budget=3000 --screenshot="harvest-launch-6x4.png" \
  --allow-file-access-from-files \
  "file://$(pwd | sed 's/ /%20/g')/flyer.html"
```
