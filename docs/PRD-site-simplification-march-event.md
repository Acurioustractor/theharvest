# PRD: Site Simplification + March 7 Gathering Launch

**Status:** Draft — awaiting review
**Date:** 18 Feb 2026
**Authors:** Ben + Claude (spec), Nicholas (vision)

---

## 1. Context

The Harvest is preparing for its first public event — a lunchtime community gathering on **Saturday 7 March 2026** at the site in Witta. This combines:

- **Oyster event** — Shaun Fisher's oysters, community food
- **Regional Arts Australia project launch** — $45k funded project celebrating the dairy, timber and co-op industry of the hinterland. Milk crate structure build, storytelling, photography, recycled materials.
- **Community introduction** — first time locals (and some Brisbane visitors) experience what The Harvest is becoming

The website needs to be simplified from its current sprawling state to a focused tool that:
1. Tells the story (why this place, why now)
2. Drives people to March 7
3. Captures interest and sentiment → GHL CRM pipeline

---

## 2. Audiences (priority order)

1. **Local community** — Witta, Maleny, Montville, Blackall Range residents
2. **Brisbane & surrounds** — people who'd drive up for a day out
3. **Collaborators & producers** — artists, farmers, food producers, makers
4. **Funders & supporters** — Regional Arts Australia, council, potential partners

---

## 3. Site Structure

### Navigation

```
HOME  |  THE GATHERING  |  THE STORY  |  CONTACT
```

Four items. Clean footer nav (as current BauhausFooter pattern).

### Route Map

| Route | Page | Status |
|-------|------|--------|
| `/` | Homepage | **Simplify** — tighten to landing page |
| `/gather` | The Gathering (March 7) | **Rewrite** — update for confirmed event |
| `/compendium` | The Story | **Keep** — rename nav link only |
| `/contact` | Contact | **Keep as-is** |
| `/community` | Community Intelligence | **Keep unlisted** (no nav link) |
| `/pulse` | Community Pulse | **Retire or redirect** — fold into EOI |
| `/feedback/:id` | Event Feedback | **Keep unlisted** (for post-event use) |

### Pages to Remove from Disk (cleanup)

~32 legacy page files not routed to anything. Can be archived/deleted in a separate cleanup pass.

---

## 4. Page Specs + Draft Copy

### 4.1 Homepage `/`

**Job:** First impression. Understand what The Harvest is. Get excited. Go to the gathering or get in touch.

#### Structure & Copy

**1. HERO** (full-viewport, aerial video background)

```
THE HARVEST

Art. Food. Community.

Witta, Sunshine Coast Hinterland. Jinibara Country.
```

> *Keep current hero — it works. Strong, simple, locates you immediately.*

**2. STATEMENT** (dark section, centered)

```
"Art is how we make sense of being alive.
Food is how we sustain each other.
Community is what happens when those two things share a table."
```

> *Keep the quote — it's the mission in three lines.*

Then the three principles, tightened:

```
Nothing is permanent. Like a gallery. The space is always becoming.

Community-built. We don't build for people. We build with them.

Custodianship. We build to hand over.
```

**3. WHAT'S HAPPENING** (cream or accent section, prominent)

```
                    FIRST GATHERING

         Saturday 7 March 2026 — Lunchtime
              9 Gumland Drive, Witta

Oysters from Minjerribah. A milk crate pavilion we'll build together.
   The launch of something we've been working toward.

                    [COME ALONG →]
```

> *This is the primary CTA. Bold, can't miss it. Links to `/gather`.*

**4. REGIONAL ARTS** (short, contextual)

```
                REGIONAL ARTS AUSTRALIA

We've been funded to explore the dairy, timber and co-op
heritage of this ridge — through photography, storytelling,
and building things from what's already here.

This is the first chapter.
```

**5. ALREADY HAPPENING** (dark section, Barry photo + quote)

```
"Timber workers, dairy farmers, red soil.
We're not starting from nothing."

BARRY RODGERIG, WITTA SINCE 1972

The neighbours are already asking what's happening here.
A welcome committee invited us before we opened the doors.
Homeschooling families are circling. Local makers want in.

It's already happening.
```

> *Keep this section — it grounds everything in real people.*

**6. CLOSE** (simple CTA)

```
Come by. Say hello. Bring something to share.

[GET IN TOUCH]        [THE STORY →]

hello@theharvestwitta.com.au
```

**7. FOOTER**

```
THE HARVEST
Witta, Blackall Range. Jinibara Country.

HOME | THE GATHERING | THE STORY | CONTACT
```

#### Acceptance Criteria
- [ ] Page loads in <3s on mobile
- [ ] March 7 gathering CTA visible within 2 scroll-lengths on mobile
- [ ] No more than 4 sections total on mobile before footer
- [ ] Email/contact path accessible from close section

#### Open Questions
- [ ] Keep the MAKE/FEED/GATHER color bands? Proposal: **remove them** from homepage, keep the statement + principles + event CTA + Barry section. Simpler, more focused. The three zones live in the Compendium.
- [ ] Headline "Art. Food. Community." — still the right tagline?

---

### 4.2 The Gathering `/gather`

**Job:** Everything someone needs to decide to come on March 7. Capture EOI + sentiment.

#### Structure & Copy

**1. HERO** (full-viewport, aerial video or static image)

```
              FIRST GATHERING

    Saturday 7 March 2026 — From 11am
           9 Gumland Drive, Witta

    Come as you are. Bring something to share.
```

**2. THE INVITATION** (dark section)

```
                THE INVITATION

No tickets. No agenda. No speeches.

Just food, music, and the people who show up.

This is how it begins — not with a grand opening,
but with a table.
```

**3. WHAT'S HAPPENING** (color band sections — FEED / BUILD / GATHER)

```
─── FEED (red) ───────────────────────────

Oysters fresh from Minjerribah.
Shaun Fisher — Quandamooka man, oyster farmer,
the first person to say yes.

Pizza from the trailer. BYO picnic.


─── BUILD (yellow) ───────────────────────

Milk crate pavilion.
Bring your hands. We'll build it together.

This is the launch of our Regional Arts Australia project —
exploring the dairy, timber and co-op heritage of this ridge.


─── GATHER (blue) ────────────────────────

Drinks. Music. Kids welcome. Dogs on leads.
Everyone shares a table.
```

**4. DETAILS** (cream section, clean grid)

```
WHEN                        WHERE
Saturday 7 March             The Harvest
From 11am                    9 Gumland Drive
                             Witta QLD 4552
                             10 minutes from Maleny

WHAT TO BRING               WHAT WE'RE PROVIDING
A chair or picnic blanket    Oysters (Shaun Fisher)
Something to drink           Pizza from the trailer
Something to share           Music, fire, good light
Kids, dogs (on leads)
```

> *Open Qs on exact times, cost, BYO still stand — using current page values as placeholder.*

**5. LET US KNOW YOU'RE COMING** (dark section, inline form)

```
          LET US KNOW YOU'RE COMING

No commitment — just helps us know how many
oysters to shuck.

[Your name          ]
[Your email         ]

What excites you most about The Harvest?
[                                      ]

How did you hear about us?
[Word of mouth ▾]

           [COUNT ME IN]
```

Form fields:
- **Name** (required)
- **Email** (required)
- **"What excites you most about The Harvest?"** (free text, optional, 1-2 sentences)
- **"How did you hear about us?"** (dropdown: Word of mouth / Social media / Local paper / A friend sent me the link / Other)

On submit → GHL upsert:
- Tags: `eoi-gathering-march-2026`, `website-eoi`
- Custom field or note: excitement text + source

Success state:
```
See you on March 7. ✦
We'll be in touch closer to the day.
```

**6. REGIONAL ARTS CONTEXT** (brief section)

```
            REGIONAL ARTS AUSTRALIA

This gathering is the first chapter of a funded project
exploring the dairy, timber and co-op heritage of the
Blackall Range — through photography, oral histories,
and building things from recycled materials.

We're looking for stories, old equipment, photographs,
and anyone who remembers. If that's you, get in touch.

[GET IN TOUCH →]
```

**7. FOOTER**

#### Acceptance Criteria
- [ ] Date, time, location visible without scrolling on mobile
- [ ] EOI form submits to GHL with tags `eoi-gathering-march-2026`, `website-eoi`
- [ ] Excitement text captured as GHL contact note
- [ ] Source captured as GHL custom field
- [ ] Form works on mobile (thumb-friendly, no horizontal scroll)
- [ ] Good `og:title` / `og:description` / `og:image` for social sharing
- [ ] Success state replaces form (no page reload)

#### Open Questions
- [ ] Exact time window — "From 11am" or "11am–3pm"?
- [ ] Cost — free entry? Oyster pricing? Or just "oysters available to buy"?
- [ ] BYO drinks, or will there be drinks?
- [ ] Headcount cap or open?
- [ ] OG image for social sharing?
- [ ] QR code poster for physical distribution?

---

### 4.3 The Story `/compendium`

**Job:** Deep-dive narrative for anyone who wants to understand the full vision.

**Changes:**
- Nav link text: **"THE STORY"** (instead of "COMPENDIUM")
- No content changes — the 9-chapter narrative stays as-is
- Ensure closing CTAs point to live pages (`/contact` and `/gather`)

#### Acceptance Criteria
- [ ] Nav link reads "THE STORY"
- [ ] All internal links work

---

### 4.4 Contact `/contact`

**Job:** General contact form + details.

**Changes:** Minimal.
- Add a **"Keep me in the loop"** checkbox → adds `newsletter` tag to GHL contact
- Update hours if needed (current: Wed–Sun)

#### Current Copy (keep as-is)
```
GET IN TOUCH

Have a question, want to get involved,
or just want to say hello?
We'd love to hear from you.

[form: name, email, subject, message]
[☐ Keep me in the loop — send me occasional updates]
[SEND MESSAGE]
```

#### Acceptance Criteria
- [ ] Form submits to GHL via Supabase edge function (already works)
- [ ] Newsletter checkbox adds `newsletter` tag when checked
- [ ] Contact details and map still render

---

## 5. EOI → GHL Pipeline

### Flow

```
User fills EOI form on /gather
  → tRPC endpoint `eoi.submit`
  → upsertGHLContact({
       name, email,
       tags: ["eoi-gathering-march-2026", "website-eoi"],
       customFields: { source: "how heard" }
     })
  → Add contact note: "What excites them: {free text}"
  → GHL workflow sends confirmation email (configured in GHL, not in code)
```

### Tags Strategy

| Tag | Applied when |
|-----|-------------|
| `newsletter` | Contact form with "keep me in the loop" checkbox |
| `eoi-gathering-march-2026` | EOI form on /gather |
| `website-eoi` | Any EOI form submission |
| `website-inquiry` | Contact form (already exists) |
| `contact-form` | Contact form (already exists) |

---

## 6. Gemini Image Generation Integration

### Purpose

Add AI image generation capability to the site backend, enabling:
- Social card generation for events (og:image)
- Sketch-style decorative elements (dividers, textures, frames)
- Future: story illustrations for Empathy Ledger content

### Technical Spec

**Library:** `@google/genai` (Google's official GenAI SDK)
**Model:** `gemini-2.5-flash-image` (text + image output)
**Env var:** `GOOGLE_AI_API_KEY`

### API Endpoints

#### `POST /api/generate-image`

General-purpose image generation.

**Request:**
```json
{
  "prompt": "A warm aerial photograph of a community gathering...",
  "aspectRatio": "16:9",
  "preset": "social-card",
  "save": true
}
```

**Presets** (each adds style instructions to the prompt):
| Preset | Description | Aspect |
|--------|-------------|--------|
| `social-card` | Open Graph / social sharing images | 16:9 |
| `story-illustration` | Editorial illustrations for stories | 4:3 |
| `project-banner` | Page hero / banner images | 21:9 |
| `pattern` | Repeatable background patterns | 1:1 |
| `texture` | Organic textures (paper, earth, timber) | 1:1 |

**Response:**
```json
{
  "image": "data:image/png;base64,...",
  "url": "https://storage.supabase.co/media/generated/abc123.png"
}
```

- If `save: true`, uploads to Supabase storage (`media` bucket, `generated/` folder)
- Returns both base64 and public URL

#### `POST /api/generate-sketch`

Cached sketch-style elements for site decoration.

**Request:**
```json
{
  "type": "divider",
  "seed": "gathering-page",
  "theme": "timber-heritage"
}
```

**Types:** `divider`, `frame`, `border`, `illustration`, `texture`, `ornament`

**Themes** (modifiers aligned to The Harvest brand):
| Theme | Style direction |
|-------|----------------|
| `dairy-heritage` | Milk cans, cream, pastoral, soft |
| `timber-heritage` | Cedar, grain, axes, sawmill, strong |
| `coop-heritage` | Hands, tables, sharing, community marks |
| `hinterland` | Green ridge, mist, bird calls, fern |
| `bauhaus` | Geometric, primary colors, bold shapes |

**Caching:** Content-hashed key → Supabase storage. Same inputs return cached result without hitting Gemini API.

**Response:**
```json
{
  "image": "data:image/png;base64,...",
  "url": "https://storage.supabase.co/media/sketches/hash123.png",
  "cached": true
}
```

### Implementation Plan

1. Install `@google/genai` package
2. Create `server/gemini.ts` — SDK setup, preset definitions, generation functions
3. Add Express routes in `server/_core/index.ts` (before tRPC middleware)
4. Create Supabase storage bucket `media` with `generated/` and `sketches/` folders
5. Add `GOOGLE_AI_API_KEY` to `.env` and Vercel env vars

### Brand Style Guide for Prompts

All generated images should carry this base context:
```
Style: Warm, grounded, Australian hinterland. Natural light.
Earthy tones — timber brown, cream, deep green, red soil.
Feel: handmade, honest, community. Not corporate, not polished.
References: Bauhaus simplicity, Australian rural heritage,
community gathering, Jinibara Country.
```

---

## 7. OG / Social Meta

Every page needs proper meta tags for social sharing.

### Per-page meta

| Page | og:title | og:description |
|------|----------|----------------|
| `/` | The Harvest — Art. Food. Community. | A community space forming in Witta, Sunshine Coast Hinterland. Jinibara Country. |
| `/gather` | First Gathering — Saturday 7 March | Oysters, a milk crate pavilion, and the beginning of something. 9 Gumland Drive, Witta. |
| `/compendium` | The Harvest — The Story | Nine chapters. Why this place. Why now. |
| `/contact` | Get In Touch — The Harvest | Questions, ideas, or just want to say hello. |

**og:image:** Generate with Gemini (`social-card` preset) or use aerial video thumbnail. Each page should have its own image.

### Implementation

Update `client/index.html` with default meta tags. Use `react-helmet-async` or a simple `useEffect` to set per-page tags (SPA limitation — or handle via Vercel edge middleware for proper SSR meta).

---

## 8. Future Phases (out of scope, noted for context)

### Phase 2: Newsletter & Email
- GHL email campaigns to tagged contacts
- Regular updates to `newsletter` tagged list
- Content could be auto-generated from Empathy Ledger stories
- Social media posting workflow

### Phase 3: Regional Arts Project Page
- Dedicated page for the $45k dairy/timber/co-op project
- Gallery of photography, oral histories, found objects
- Connects to Empathy Ledger as the story backend
- EOI for participation (farmers, historians, artists)
- Gemini-generated illustrations alongside real photography

### Phase 4: Empathy Ledger Integration
- Story system cataloguing local history
- Feeds curated content to the website
- Separate project with its own identity (name TBD)
- The Harvest site becomes one "client" of the Empathy Ledger
- Trove API integration for historical research (API key requested)

---

## 9. Build Scope Summary

| # | Item | Effort | Priority |
|---|------|--------|----------|
| 1 | Simplify homepage `/` — remove MAKE/FEED/GATHER bands, add event CTA | Medium | **P0** |
| 2 | Rewrite `/gather` for March 7 + EOI form | Medium | **P0** |
| 3 | Add `eoi.submit` tRPC endpoint with GHL integration | Small | **P0** |
| 4 | Install Gemini integration (`@google/genai` + 2 endpoints) | Medium | **P0** |
| 5 | Update footer nav: "THE STORY" label, "THE GATHERING" label | Tiny | P1 |
| 6 | Add "Keep me in the loop" checkbox to contact form | Small | P1 |
| 7 | OG meta tags on all pages | Small | P1 |
| 8 | Generate social card images via Gemini | Small | P1 |
| 9 | Legacy page cleanup (remove ~32 unused files) | Small | P2 |

---

## 10. Open Questions (need answers before build)

1. **Event time** — "From 11am" or specific window like "11am–3pm"?
2. **Cost** — free entry? Oysters priced or pay-what-you-feel?
3. **BYO policy** — BYO drinks, or drinks provided/sold?
4. **Headcount** — open invite or capped?
5. **Homepage zones** — proposal: remove MAKE/FEED/GATHER color bands, keep statement + principles + event CTA + Barry. Agree?
6. **OG image** — use Gemini-generated, or do you have a photo/graphic?
7. **QR code poster** — want a printable version for physical distribution?
8. **Google AI API key** — do you have one, or shall I set up?
