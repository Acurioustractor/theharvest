// Single source of truth for Harvest brand assets used by scripts
// (GHL email drafts and any script that builds outbound HTML).
//
// Why this file exists: the logo URL was duplicated as a `const LOGO_URL`
// in every email script. The site moved to the roots wordmark but the
// scripts kept pointing at the old wooden-H mark, and an old logo nearly
// went out to ~80 members. Import from here so there is one place to change.
//
// CANONICAL LOGO — roots "HARVEST" wordmark:
//   client/public/images/logo-harvest-only-clean.png
//   -> served live at `${SITE_ORIGIN}/images/logo-harvest-only-clean.png`
//   This is the mark the live website header and footer use. Emails and any
//   script-built HTML must use it too.
//
// DEPRECATED — do not use: logo-harvest-full.png (old wooden-H "THE HARVEST
// WITTA" sketch). See docs/brand/harvest-brand-development-guide.md (Logo).

export const SITE_ORIGIN = "https://www.theharvestwitta.com.au";

/** Canonical Harvest logo as an absolute URL, for emails and external embeds. */
export const LOGO_URL = `${SITE_ORIGIN}/images/logo-harvest-only-clean.png`;

/** Public RSVP surface for the 20 June open day. */
export const RSVP_URL = `${SITE_ORIGIN}/june-20#rsvp`;
