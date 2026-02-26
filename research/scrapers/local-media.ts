/**
 * Local Media Scraper — Maleny/Hinterland
 *
 * Uses WordPress REST APIs to fetch articles from local news sources.
 * Falls back to HTML scraping where REST API is unavailable.
 */

import path from "path";
import * as cheerio from "cheerio";
import { cachedGet, saveData, logSection } from "./utils.js";

interface Article {
  title: string;
  url: string;
  source: string;
  date?: string;
  snippet: string;
  themes: string[];
  sentiment: "positive" | "negative" | "neutral" | "mixed";
}

interface MediaData {
  articles: Article[];
  sources: Array<{ name: string; url: string; type: string; articlesFound: number }>;
  themeAnalysis: Array<{ theme: string; count: number; sentiment: string; examples: string[] }>;
  communityNarrative: {
    dominantTopics: string[];
    positiveStories: string[];
    concerns: string[];
    opportunities: string[];
  };
  methodology: string;
  limitations: string;
  dataDate: string;
}

// Theme detection keywords
const THEME_KEYWORDS: Record<string, string[]> = {
  development_pressure: ["development", "subdivision", "rezoning", "planning application", "building", "density", "approval"],
  community_spirit: ["community", "volunteer", "together", "fundrais", "support", "rally", "donate"],
  environment: ["wildlife", "koala", "platypus", "conservation", "habitat", "corridor", "revegetation", "landcare"],
  arts_culture: ["art", "gallery", "festival", "music", "creative", "exhibition", "performance", "cultural"],
  local_economy: ["business", "shop", "market", "tourism", "visitor", "trade", "economic"],
  food_agriculture: ["farm", "dairy", "produce", "organic", "garden", "food", "harvest", "crop", "agriculture"],
  heritage: ["heritage", "historic", "history", "preservation", "traditional", "heritage-listed"],
  infrastructure: ["road", "bridge", "water", "sewerage", "internet", "mobile", "transport", "traffic"],
  housing: ["housing", "rental", "affordable", "homeless", "accommodation", "property", "real estate"],
  health_wellbeing: ["health", "hospital", "mental health", "wellbeing", "aged care", "disability"],
  education: ["school", "education", "student", "learning", "university", "training"],
  indigenous: ["indigenous", "aboriginal", "jinibara", "kabi kabi", "first nations", "reconciliation"],
  climate_disaster: ["bushfire", "flood", "storm", "climate", "drought", "disaster", "emergency", "resilience"],
  youth: ["youth", "young people", "teenager", "children", "playground", "skatepark"],
};

function detectThemes(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      found.push(theme);
    }
  }
  return found;
}

function detectSentiment(text: string): "positive" | "negative" | "neutral" | "mixed" {
  const lower = text.toLowerCase();
  const positive = [
    "celebrate", "success", "award", "win", "grow", "thrive", "beautiful",
    "community spirit", "well done", "exciting", "proud", "welcome",
    "new opening", "record", "boost", "support",
  ];
  const negative = [
    "concern", "protest", "oppose", "fear", "angry", "destroy", "loss",
    "close", "shut", "crisis", "threat", "damage", "crime", "accident",
    "disappoint", "fail", "decline", "controversy",
  ];

  const posScore = positive.filter((w) => lower.includes(w)).length;
  const negScore = negative.filter((w) => lower.includes(w)).length;

  if (posScore > 0 && negScore > 0) return "mixed";
  if (posScore > negScore) return "positive";
  if (negScore > posScore) return "negative";
  return "neutral";
}

function stripHtml(html: string): string {
  return cheerio.load(html).text().trim();
}

// WordPress REST API response type
interface WPPost {
  title: { rendered: string };
  date: string;
  link: string;
  excerpt: { rendered: string };
}

interface WPSource {
  name: string;
  baseUrl: string;
  type: string;
  searchTerms: string[];
  maxPerTerm: number;
}

const WP_SOURCES: WPSource[] = [
  {
    name: "Sunshine Coast News",
    baseUrl: "https://www.sunshinecoastnews.com.au",
    type: "regional_news",
    searchTerms: ["maleny", "hinterland", "witta", "montville", "mapleton"],
    maxPerTerm: 20,
  },
  {
    name: "myPolice Sunshine Coast",
    baseUrl: "https://mypolice.qld.gov.au/sunshinecoast",
    type: "police_news",
    searchTerms: ["maleny", "hinterland", "witta"],
    maxPerTerm: 10,
  },
];

async function scrapeWPSource(source: WPSource): Promise<Article[]> {
  const articles: Article[] = [];
  const seenUrls = new Set<string>();

  for (const term of source.searchTerms) {
    try {
      const apiUrl = `${source.baseUrl}/wp-json/wp/v2/posts`;
      const posts = await cachedGet<WPPost[]>(apiUrl, {
        params: {
          search: term,
          per_page: source.maxPerTerm,
          _fields: "title,date,link,excerpt",
        },
      });

      if (!Array.isArray(posts)) continue;

      for (const post of posts) {
        if (seenUrls.has(post.link)) continue;
        seenUrls.add(post.link);

        const title = stripHtml(post.title.rendered);
        const snippet = stripHtml(post.excerpt.rendered);
        const fullText = title + " " + snippet;

        if (title.length < 10) continue;

        articles.push({
          title: title.slice(0, 200),
          url: post.link,
          source: source.name,
          date: post.date ? post.date.split("T")[0] : undefined,
          snippet: snippet.slice(0, 500),
          themes: detectThemes(fullText),
          sentiment: detectSentiment(fullText),
        });
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.log(`  Warning: WP API failed for ${source.name} (${term}): ${msg}`);
    }
  }

  return articles;
}

// Fallback: HTML scraping for SCN (Newspaper theme)
async function scrapeSCNHtml(searchTerms: string[]): Promise<Article[]> {
  const articles: Article[] = [];
  const seenTitles = new Set<string>();

  for (const term of searchTerms) {
    try {
      const html = await cachedGet<string>(
        `https://www.sunshinecoastnews.com.au/?s=${encodeURIComponent(term)}`,
        {
          headers: { "User-Agent": "TheHarvestCommunityResearch/1.0" },
          responseType: "text",
        }
      );

      if (typeof html !== "string") continue;
      const $ = cheerio.load(html);

      $(".tdb_module_loop.td_module_wrap").each((_, el) => {
        const titleEl = $(el).find("h3.entry-title a").first();
        const title = titleEl.text().trim();
        const href = titleEl.attr("href");
        const snippet = $(el).find(".td-excerpt").first().text().trim();
        const date = $(el).find("time.entry-date").first().attr("datetime")
          || $(el).find("time.entry-date").first().text().trim();

        const key = title.toLowerCase().slice(0, 50);
        if (title.length > 10 && !seenTitles.has(key)) {
          seenTitles.add(key);
          const fullText = title + " " + snippet;
          articles.push({
            title: title.slice(0, 200),
            url: href || `https://www.sunshinecoastnews.com.au/?s=${term}`,
            source: "Sunshine Coast News",
            date: date ? date.split("T")[0] : undefined,
            snippet: snippet.slice(0, 500),
            themes: detectThemes(fullText),
            sentiment: detectSentiment(fullText),
          });
        }
      });
    } catch {
      // Ignore HTML scraping failures — WP API is primary
    }
  }

  return articles;
}

function analyzeMediaThemes(articles: Article[]) {
  const themeData: Record<string, { count: number; sentiments: string[]; examples: string[] }> = {};

  for (const article of articles) {
    for (const theme of article.themes) {
      if (!themeData[theme]) themeData[theme] = { count: 0, sentiments: [], examples: [] };
      themeData[theme].count++;
      themeData[theme].sentiments.push(article.sentiment);
      if (themeData[theme].examples.length < 3) {
        themeData[theme].examples.push(article.title);
      }
    }
  }

  return Object.entries(themeData)
    .map(([theme, data]) => {
      const posSent = data.sentiments.filter((s) => s === "positive").length;
      const negSent = data.sentiments.filter((s) => s === "negative").length;
      let overallSentiment = "neutral";
      if (posSent > negSent * 1.5) overallSentiment = "positive";
      else if (negSent > posSent * 1.5) overallSentiment = "negative";
      else if (posSent > 0 && negSent > 0) overallSentiment = "mixed";

      return {
        theme,
        count: data.count,
        sentiment: overallSentiment,
        examples: data.examples,
      };
    })
    .sort((a, b) => b.count - a.count);
}

function buildNarrative(
  themeAnalysis: Array<{ theme: string; count: number; sentiment: string }>,
  articles: Article[]
) {
  const dominantTopics = themeAnalysis.slice(0, 5).map((t) => t.theme.replace(/_/g, " "));

  const positiveStories = articles
    .filter((a) => a.sentiment === "positive")
    .slice(0, 5)
    .map((a) => a.title);

  const concerns = articles
    .filter((a) => a.sentiment === "negative")
    .slice(0, 5)
    .map((a) => a.title);

  const opportunities: string[] = [];
  const themeNames = themeAnalysis.map((t) => t.theme);

  if (themeNames.includes("food_agriculture")) {
    opportunities.push("Local food and agriculture stories suggest strong appetite for farm-to-table programs");
  }
  if (themeNames.includes("arts_culture")) {
    opportunities.push("Arts and culture coverage indicates active creative community seeking more spaces");
  }
  if (themeNames.includes("community_spirit")) {
    opportunities.push("Community spirit stories show willingness to participate in collective projects");
  }
  if (themeNames.includes("environment")) {
    opportunities.push("Environmental stories create natural alignment with Garden zone programming");
  }
  if (themeNames.includes("youth")) {
    opportunities.push("Youth coverage suggests demand for more youth-oriented spaces and programs");
  }
  if (themeNames.includes("housing")) {
    opportunities.push("Housing concerns create opportunity for community resilience and mutual aid programs");
  }

  return { dominantTopics, positiveStories, concerns, opportunities };
}

export async function scrapeLocalMedia(): Promise<MediaData> {
  logSection("Local Media — Maleny/Hinterland News");

  const allArticles: Article[] = [];
  const sourceSummary: Array<{ name: string; url: string; type: string; articlesFound: number }> = [];

  // Primary method: WordPress REST API
  for (const source of WP_SOURCES) {
    console.log(`  Scraping ${source.name} (WP REST API)...`);
    const articles = await scrapeWPSource(source);
    console.log(`    Found ${articles.length} articles`);
    allArticles.push(...articles);
    sourceSummary.push({
      name: source.name,
      url: source.baseUrl,
      type: source.type,
      articlesFound: articles.length,
    });
  }

  // If SCN WP API returned nothing, fall back to HTML scraping
  const scnCount = sourceSummary.find((s) => s.name === "Sunshine Coast News")?.articlesFound ?? 0;
  if (scnCount === 0) {
    console.log("  SCN WP API returned 0 results — falling back to HTML scraping...");
    const htmlArticles = await scrapeSCNHtml(["maleny", "hinterland", "witta"]);
    console.log(`    HTML fallback found ${htmlArticles.length} articles`);
    allArticles.push(...htmlArticles);
    const scnSource = sourceSummary.find((s) => s.name === "Sunshine Coast News");
    if (scnSource) scnSource.articlesFound = htmlArticles.length;
  }

  // Deduplicate across sources by URL
  const seenUrls = new Set<string>();
  const dedupedArticles = allArticles.filter((a) => {
    if (seenUrls.has(a.url)) return false;
    seenUrls.add(a.url);
    return true;
  });

  // Analyze themes
  const themeAnalysis = analyzeMediaThemes(dedupedArticles);
  const communityNarrative = buildNarrative(themeAnalysis, dedupedArticles);

  const result: MediaData = {
    articles: dedupedArticles,
    sources: sourceSummary,
    themeAnalysis,
    communityNarrative,
    methodology:
      "Articles fetched via WordPress REST API from local news sites, searching for Maleny, Witta, " +
      "hinterland, Montville, and Mapleton. Theme detection uses keyword matching. Sentiment " +
      "analysis uses positive/negative keyword scoring. Results represent media coverage patterns.",
    limitations:
      "Keyword-based theme detection and sentiment analysis are approximate. Media coverage may not " +
      "accurately represent community views — it tends to over-represent conflict and under-represent " +
      "everyday community life. For deeper sentiment analysis, community surveys and focus groups " +
      "would be needed.",
    dataDate: new Date().toISOString().split("T")[0],
  };

  console.log(`  Total: ${dedupedArticles.length} unique articles across ${sourceSummary.length} sources`);
  console.log(`  Themes identified: ${themeAnalysis.length}`);

  await saveData("local-media.json", result);
  return result;
}

// Run standalone
const isMain = import.meta.url === `file://${process.argv[1]}`
  || import.meta.url === `file://${path.resolve(process.argv[1] || "")}`;
if (isMain) {
  scrapeLocalMedia().catch(console.error);
}
