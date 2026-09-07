/**
 * Generate sitemap.xml for production build.
 *
 * Runs AFTER vite build. Writes to dist/public/sitemap.xml, overwriting
 * the static fallback that was copied from client/public/sitemap.xml.
 *
 * Sources:
 *  - static public routes (hard-coded — matches client/public/sitemap.xml as the floor)
 *  - /works/:slug from client/src/data/works.ts (static)
 *
 * /stories, /people, /story, /witta, /photo-wall and /gather are paused
 * (redirect to /whats-on or /what-is-the-harvest as of 2026-07). /blog was
 * un-paused 2026-09-07: the index plus every Empathy Ledger article the
 * consent ledger releases to this site (destination=harvest) is listed.
 * and deliberately excluded so search engines don't index redirect chains.
 */

import { writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const SITE = "https://www.theharvestwitta.com.au";
const TODAY = new Date().toISOString().slice(0, 10);
const OUTPUT = resolve(process.cwd(), "dist/public/sitemap.xml");

type Entry = {
  loc: string;
  priority: string;
  changefreq: "weekly" | "monthly" | "yearly";
  lastmod?: string;
};

const STATIC_ROUTES: Entry[] = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/start", priority: "0.95", changefreq: "weekly" },
  { loc: "/membership", priority: "0.9", changefreq: "weekly" },
  { loc: "/whats-on", priority: "0.9", changefreq: "weekly" },
  { loc: "/witta-pizza", priority: "0.85", changefreq: "weekly" },
  { loc: "/shop", priority: "0.8", changefreq: "weekly" },
  { loc: "/what-is-the-harvest", priority: "0.8", changefreq: "monthly" },
  { loc: "/works", priority: "0.7", changefreq: "weekly" },
  { loc: "/blog", priority: "0.6", changefreq: "weekly" },
  { loc: "/get-involved", priority: "0.7", changefreq: "monthly" },
  { loc: "/venue-hire", priority: "0.6", changefreq: "monthly" },
  { loc: "/contact", priority: "0.6", changefreq: "yearly" },
  { loc: "/media", priority: "0.5", changefreq: "monthly" },
  { loc: "/pulse", priority: "0.5", changefreq: "monthly" },
];

function entryXml(e: Entry): string {
  return `  <url>
    <loc>${SITE}${e.loc}</loc>
    <lastmod>${e.lastmod ?? TODAY}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`;
}

/**
 * Empathy Ledger articles released to this site. The content-hub route scopes
 * by destination and, with the site key, by per-site consent, so nothing here
 * can list an article the ledger would not serve. Empty on any failure: a
 * sitemap missing articles is recoverable, a build failing on it is not.
 */
async function blogEntries(): Promise<Entry[]> {
  const base = process.env.EMPATHY_LEDGER_API_URL || process.env.VITE_EMPATHY_LEDGER_URL || "https://empathyledger.com";
  const key = process.env.EMPATHY_LEDGER_API_KEY;
  try {
    const res = await fetch(`${base}/api/v1/content-hub/articles?destination=harvest&limit=100`, {
      headers: key ? { "X-API-Key": key } : {},
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { articles?: Array<{ slug: string; publishedAt?: string | null }> };
    return (data.articles || [])
      .filter((a) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug))
      .map((a) => ({ loc: `/blog/${a.slug}`, priority: "0.6", changefreq: "monthly", lastmod: (a.publishedAt || TODAY).slice(0, 10) }));
  } catch {
    return [];
  }
}

async function workEntries(): Promise<Entry[]> {
  try {
    const { works } = await import("../client/src/data/works.js");
    return works.map((w: { slug: string }) => ({
      loc: `/works/${w.slug}`,
      priority: "0.6",
      changefreq: "monthly" as const,
    }));
  } catch (error) {
    console.warn("[sitemap] could not load works.ts:", (error as Error).message);
    return [];
  }
}

async function main() {
  if (!existsSync(resolve(process.cwd(), "dist/public"))) {
    console.error("[sitemap] dist/public does not exist - run vite build first");
    process.exit(0);
  }

  const works = await workEntries();
  const blog = await blogEntries();
  const all = [...STATIC_ROUTES, ...works, ...blog];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(entryXml).join("\n")}
</urlset>
`;

  writeFileSync(OUTPUT, xml, "utf8");
  console.log(
    `[sitemap] wrote ${all.length} URLs to ${OUTPUT} ` +
      `(${STATIC_ROUTES.length} static, ${works.length} works, ${blog.length} blog)`,
  );
}

main().catch((error) => {
  console.error("[sitemap] generation failed:", error);
  // Don't fail the build - the static client/public/sitemap.xml fallback is already in dist/public/
  process.exit(0);
});
