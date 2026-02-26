/**
 * Trove Historical Records Scraper — Witta / Maleny area
 *
 * Searches the National Library of Australia's Trove API v3
 * for historical newspaper articles, books, images, and gazettes
 * related to Witta, Maleny, and surrounds.
 */

import path from "path";
import * as dotenv from "dotenv";
dotenv.config();

import { cachedGet, saveData, logSection } from "./utils.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TroveArticle {
  id: string;
  heading?: string;
  title?: string;
  date?: string;
  snippet?: string;
  troveUrl?: string;
  category?: string;
}

interface TroveRecord {
  id: string;
  url?: string;
  heading?: string;
  title?: string;
  date?: string;
  snippet?: string;
  abstract?: string;
  troveUrl?: string;
}

interface TroveCategory {
  code: string;
  name: string;
  records?: {
    total: number;
    article?: TroveRecord[];
    work?: TroveRecord[];
  };
}

interface TroveSearchResponse {
  category?: TroveCategory[];
}

interface TroveHistoricalData {
  region: string;
  fetchedAt: string;
  searchTerms: string[];
  totalResults: number;
  results: TroveArticle[];
  warning?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TROVE_API_BASE = "https://api.trove.nla.gov.au/v3/result";

const SEARCH_TERMS = [
  "Witta Queensland",
  "Jinibara people",
  "Kabi Kabi Maleny",
  "Maleny history",
  "Baroon Pocket",
  "Obi Obi Creek",
  "Witta dairy",
];

const CATEGORIES = ["newspaper", "image", "book"] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractRecords(
  category: TroveCategory,
  categoryCode: string
): TroveArticle[] {
  const articles: TroveArticle[] = [];
  const records = category.records?.article || category.records?.work || [];

  for (const record of records) {
    articles.push({
      id: record.id,
      heading: record.heading || record.title || undefined,
      title: record.title || record.heading || undefined,
      date: record.date || undefined,
      snippet: record.snippet || record.abstract || undefined,
      troveUrl: record.troveUrl || record.url || undefined,
      category: categoryCode,
    });
  }

  return articles;
}

async function searchTrove(
  searchTerm: string,
  category: string,
  apiKey: string
): Promise<TroveArticle[]> {
  console.log(`  Searching "${searchTerm}" in ${category}...`);

  try {
    const response = await cachedGet<TroveSearchResponse>(TROVE_API_BASE, {
      params: {
        q: searchTerm,
        category,
        encoding: "json",
        n: 20,
        key: apiKey,
      },
    });

    const articles: TroveArticle[] = [];

    if (response.category) {
      for (const cat of response.category) {
        articles.push(...extractRecords(cat, category));
      }
    }

    console.log(`    -> ${articles.length} records found`);
    return articles;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`    [ERROR] "${searchTerm}" (${category}): ${message}`);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function scrapeTroveHistorical(): Promise<TroveHistoricalData> {
  logSection("Trove Historical Records — Witta / Maleny");

  const apiKey = process.env.TROVE_API_KEY;

  if (!apiKey) {
    console.warn(
      "\n  WARNING: TROVE_API_KEY not set.\n" +
        "  To get a free API key:\n" +
        "    1. Create an account at https://trove.nla.gov.au/\n" +
        "    2. Go to your profile and request an API key\n" +
        "    3. Add TROVE_API_KEY=<your-key> to your .env file\n"
    );

    const emptyData: TroveHistoricalData = {
      region: "Witta / Maleny, Sunshine Coast Hinterland",
      fetchedAt: new Date().toISOString(),
      searchTerms: SEARCH_TERMS,
      totalResults: 0,
      results: [],
      warning:
        "TROVE_API_KEY not set. See https://trove.nla.gov.au/ to request a free API key.",
    };

    await saveData("trove-history.json", emptyData);
    return emptyData;
  }

  const allResults: TroveArticle[] = [];

  for (const term of SEARCH_TERMS) {
    for (const category of CATEGORIES) {
      const records = await searchTrove(term, category, apiKey);
      allResults.push(...records);
    }
  }

  // Deduplicate by ID
  const seenIds = new Set<string>();
  const deduplicated: TroveArticle[] = [];

  for (const record of allResults) {
    if (!seenIds.has(record.id)) {
      seenIds.add(record.id);
      deduplicated.push(record);
    }
  }

  console.log(
    `\n  Deduplication: ${allResults.length} -> ${deduplicated.length} unique records`
  );

  // Sort chronologically (earliest first, undated at end)
  deduplicated.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });

  const data: TroveHistoricalData = {
    region: "Witta / Maleny, Sunshine Coast Hinterland",
    fetchedAt: new Date().toISOString(),
    searchTerms: SEARCH_TERMS,
    totalResults: deduplicated.length,
    results: deduplicated,
  };

  console.log(`\n  Summary: ${deduplicated.length} unique historical records`);

  await saveData("trove-history.json", data);
  return data;
}

// ---------------------------------------------------------------------------
// Standalone execution
// ---------------------------------------------------------------------------

const isMain = import.meta.url === `file://${process.argv[1]}`
  || import.meta.url === `file://${path.resolve(process.argv[1] || "")}`;
if (isMain) {
  scrapeTroveHistorical().catch(console.error);
}
