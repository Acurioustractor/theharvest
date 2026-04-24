# Design System — The Harvest Witta

> **Inherits identity from** `act-global-infrastructure/.claude/skills/act-brand-alignment/references/brand-core.md`. **Visual cluster: Editorial Warmth — uses parent visual unchanged** (default). The Bauhaus exploration at `/bauhaus` is a sandbox, not the cluster decision. See `act-global-infrastructure/wiki/decisions/act-brand-alignment-map.md` for why the parent visual is the right fit for a community hub + CSA + retreat venue (warmth carries trust; Bauhaus carries authority — Harvest needs trust).

## Product Context

- **What this is:** Community hub website for The Harvest at Witta on Gubbi Gubbi Country. Three zones: Garden, Kitchen, Art Space. CSA program, seasonal gatherings, retreats, workshops, residencies. Lease starts 2026-07-01; early access from 2026-01-01.
- **Who it's for:** CSA members + waitlist, retreat guests, workshop attendees, neighbours, partners, funders. Mix of community-local and broader audience.
- **Project type:** Editorial / portfolio + booking surfaces (CSA signup, retreat booking, workshop registration). Not a SaaS dashboard.

## Cluster decision: parent visual

Three options were evaluated:

1. **Parent visual (Editorial Warmth)** — forest green + warm white + Fraunces. ✅ chosen.
2. **EL/JH subfamily** — cream + ochre/terracotta + Cormorant. Rejected: Harvest is place-rooted; the editorial-warmth cluster is more storyteller-rooted.
3. **Bauhaus (continue `/bauhaus` exploration)** — black + signal red + Satoshi. Rejected: Bauhaus signals authority + data, wrong for a CSA + retreat venue where warmth + trust matter most.

The `/bauhaus` route stays as a design sandbox / experiment surface. It does not define the brand.

## Inheritance from parent

Parent visual unchanged:

- **Type:** Fraunces (display) + Source Serif 4 (body) + Work Sans (UI labels) + Geist Mono (data, e.g., CSA quantities).
- **Color:** Forest green `#2D5A3D` (primary accent) + Clay `#C4845C` (secondary) + Warm white `#FAFAF7` (background) + Dark `#1A1F1A` (dark sections, not pure black).
- **Components:** Where possible, lift from `act-regenerative-studio/src/components/design-system/`. New components specific to Harvest go in `client/src/components/harvest/` to keep them isolated.
- **Two design languages:** Bold Documentary (single-narrative pages — Garden zone, Kitchen zone, Art Space, retreat narratives) + Warm Editorial (CSA listings, weekly produce, calendar, contact, governance).

## What's specific to Harvest (not in parent)

- **Three-zone hierarchy:** Every page should make Garden / Kitchen / Art Space legible. Use a small navigation strip or icon set to signal which zone the content belongs to. Cross-zone content (a workshop that uses Garden + Kitchen) should show both.
- **Seasonal:** Hero imagery and CSA produce content rotates with season. The site should never feel "static-summer" in winter.
- **Place-first naming:** Always "on Gubbi Gubbi Country" before postal address (9 Gumland Dr, Maleny QLD).
- **Tech stack carries forward:** React 19 + wouter + Tailwind CSS 4 + Radix UI + tRPC backend + Drizzle. Color tokens and type imports should land in `client/src/styles/harvest-tokens.css` mirroring the parent's variable structure.
- **Co-design ethos** (already in CLAUDE.md): "kids build the kids area, artists shape the art space." Reflect in voice + imagery — show the building, not the finished product.

## Voice (inherits parent rules)

- All ACT voice rules from `brand-core.md` + `writing-voice.md` apply unchanged.
- **Harvest-specific**: prefer kitchen/garden verbs over abstract nouns. "We plant, harvest, share, eat" beats "we cultivate community engagement." Concrete over conceptual. Names of crops, names of cooks, names of the kids who built the chook house.

## Decision rules

| Question | Answer | Treatment |
|---|---|---|
| Is this homepage / landing? | Yes | Bold Documentary, full-bleed seasonal hero |
| Is this a single-zone narrative (Garden / Kitchen / Art Space)? | Yes | Bold Documentary |
| Is this a CSA produce list / weekly box / calendar? | Yes | Warm Editorial, table or card grid |
| Is this a retreat / workshop / residency listing? | Yes | Warm Editorial card; Bold Documentary on the individual program detail page |
| Is this booking flow (CSA signup, retreat booking)? | Yes | Warm Editorial — function over decoration in flows |

## Open

- **iPhone unboxing metaphor** (per CLAUDE.md): "clear first impression, depth behind it." Translate this into a specific homepage hero treatment + below-the-fold reveal pattern. Drafting needed.
- **Bauhaus sandbox:** keep `/bauhaus` route accessible for experimentation but add a banner ("design sandbox, not live brand").
- Existing components in `client/src/components/` may need re-skinning to parent palette. Audit needed before next major page ships.

## Backlinks

- [[../act-global-infrastructure/wiki/decisions/act-brand-alignment-map|Brand alignment map]]
- [[../act-regenerative-studio/DESIGN|Parent visual system]]
- [[../act-global-infrastructure/wiki/projects/the-harvest/the-harvest|Wiki: The Harvest Witta]]
