/**
 * Generate sitemap.xml for production build.
 *
 * Runs AFTER vite build. Writes to dist/public/sitemap.xml, overwriting
 * the static fallback that was copied from client/public/sitemap.xml.
 *
 * Sources:
 *  - static public routes (hard-coded — matches client/public/sitemap.xml as the floor)
 *  - /works/:slug from client/src/data/works.ts (static)
 *  - /blog/:slug from Empathy Ledger (best-effort, falls back silently on failure)
 *  - /stories/:slug from Empathy Ledger (best-effort)
 *  - /people/:slug from Empathy Ledger (best-effort)
 *
 * If EL is unreachable or returns nothing, the dynamic sections are skipped
 * and the sitemap still has the full static-route set. Build never fails
 * because of a sitemap-generation hiccup.
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
  { loc: "/membership", priority: "0.9", changefreq: "weekly" },
  { loc: "/what-is-the-harvest", priority: "0.8", changefreq: "monthly" },
  { loc: "/story", priority: "0.8", changefreq: "monthly" },
  { loc: "/witta", priority: "0.7", changefreq: "monthly" },
  { loc: "/works", priority: "0.7", changefreq: "weekly" },
  { loc: "/people", priority: "0.7", changefreq: "weekly" },
  { loc: "/blog", priority: "0.6", changefreq: "weekly" },
  { loc: "/contact", priority: "0.6", changefreq: "yearly" },
  { loc: "/compendium", priority: "0.5", changefreq: "monthly" },
  { loc: "/pulse", priority: "0.5", changefreq: "monthly" },
  { loc: "/community", priority: "0.5", changefreq: "monthly" },
  { loc: "/photo-wall", priority: "0.5", changefreq: "monthly" },
  { loc: "/gather", priority: "0.5", changefreq: "monthly" },
];

function entryXml(e: Entry): string {
  return `  <url>
    <loc>${SITE}${e.loc}</loc>
    <lastmod>${e.lastmod ?? TODAY}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`;
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

async function elEntries(): Promise<Entry[]> {
  const apiKey = process.env.EMPATHY_LEDGER_API_KEY;
  const baseUrl = process.env.EMPATHY_LEDGER_API_URL || "https://empathyledger.com";

  if (!apiKey) {
    console.warn("[sitemap] EMPATHY_LEDGER_API_KEY not set, skipping EL routes");
    return [];
  }

  const entries: Entry[] = [];

  type ElItem = { slug?: string };

  async function fetchJson<T>(path: string): Promise<T | null> {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) {
        console.warn(`[sitemap] EL ${path} returned ${res.status}`);
        return null;
      }
      return (await res.json()) as T;
    } catch (error) {
      console.warn(`[sitemap] EL ${path} fetch failed:`, (error as Error).message);
      return null;
    }
  }

  // Blog articles
  const articlesRes = await fetchJson<{ articles?: ElItem[] }>(
    "/api/v1/content-hub/articles?syndicated_to=harvest&limit=200",
  );
  for (const a of articlesRes?.articles ?? []) {
    if (a.slug) {
      entries.push({ loc: `/blog/${a.slug}`, priority: "0.5", changefreq: "monthly" });
    }
  }

  // Stories
  const storiesRes = await fetchJson<{ stories?: ElItem[] }>(
    "/api/v1/content-hub/stories?syndicated_to=harvest&limit=200",
  );
  for (const s of storiesRes?.stories ?? []) {
    if (s.slug) {
      entries.push({ loc: `/stories/${s.slug}`, priority: "0.5", changefreq: "monthly" });
    }
  }

  // People (storytellers)
  const peopleRes = await fetchJson<{ storytellers?: ElItem[] }>(
    "/api/v1/content-hub/storytellers?syndicated_to=harvest&limit=200",
  );
  for (const p of peopleRes?.storytellers ?? []) {
    if (p.slug) {
      entries.push({ loc: `/people/${p.slug}`, priority: "0.5", changefreq: "monthly" });
    }
  }

  return entries;
}

async function main() {
  if (!existsSync(resolve(process.cwd(), "dist/public"))) {
    console.error("[sitemap] dist/public does not exist - run vite build first");
    process.exit(0);
  }

  const [works, el] = await Promise.all([workEntries(), elEntries()]);
  const all = [...STATIC_ROUTES, ...works, ...el];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(entryXml).join("\n")}
</urlset>
`;

  writeFileSync(OUTPUT, xml, "utf8");
  console.log(
    `[sitemap] wrote ${all.length} URLs to ${OUTPUT} ` +
      `(${STATIC_ROUTES.length} static, ${works.length} works, ${el.length} EL)`,
  );
}

main().catch((error) => {
  console.error("[sitemap] generation failed:", error);
  // Don't fail the build - the static client/public/sitemap.xml fallback is already in dist/public/
  process.exit(0);
});
