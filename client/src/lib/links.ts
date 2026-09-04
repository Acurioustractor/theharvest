/**
 * The members page (Mighty Networks). Events, RSVPs and direct messages live
 * there.
 *
 * Funnel decision (Ben, 2026-07-29), superseding the 2026-07-06 rule that every
 * "members page" mention should open this link directly: the home page and site
 * nav now point at our own /membership page, which explains the offer and then
 * hands off to Mighty. We own the first impression and keep the tracking; Mighty
 * still owns the members space itself.
 *
 * So: use this constant on /membership and further down the funnel, NOT on the
 * home page or in SiteNav/SiteFooter.
 *
 * This is the new-members share link. utm_source=website keeps site-origin joins
 * distinguishable from manually shared links.
 */
export const MEMBERS_PAGE_URL =
  "https://harvest-the-network.mn.co/share/aOwgIoYF3oOGUcfr?utm_source=website";
