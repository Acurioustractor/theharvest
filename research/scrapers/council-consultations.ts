/**
 * Sunshine Coast Council Community Consultations Scraper
 *
 * Scrapes public consultation/engagement data from SCC's
 * "Have Your Say" platform and council meeting minutes.
 */

import path from "path";
import * as cheerio from "cheerio";
import { cachedGet, saveData, logSection } from "./utils.js";

interface Consultation {
  title: string;
  url: string;
  status: "open" | "closed" | "upcoming" | "unknown";
  description: string;
  category: string;
  relevance: "direct" | "regional" | "indirect";
  themes: string[];
  location?: string;
  dateRange?: string;
}

interface ConsultationData {
  consultations: Consultation[];
  sentimentThemes: Array<{ theme: string; count: number; examples: string[] }>;
  communityPriorities: string[];
  harvestRelevance: string[];
  methodology: string;
  limitations: string;
  dataDate: string;
}

// Known SCC consultation URLs and topics relevant to hinterland
const HAVE_YOUR_SAY_BASE = "https://haveyoursay.sunshinecoast.qld.gov.au";
const SCC_NEWS_BASE = "https://www.sunshinecoast.qld.gov.au/council/news-centre";

// Curated list of known/recent consultations relevant to the hinterland
const KNOWN_CONSULTATIONS: Consultation[] = [
  {
    title: "Sunshine Coast Community Strategy 2019-2041",
    url: "https://www.sunshinecoast.qld.gov.au/council/planning-and-projects/council-strategies/community-strategy",
    status: "closed",
    description: "Long-term strategy for community wellbeing, social infrastructure, and community development across the Sunshine Coast",
    category: "community_strategy",
    relevance: "regional",
    themes: ["community_wellbeing", "social_infrastructure", "inclusion", "resilience", "placemaking"],
  },
  {
    title: "Environment and Liveability Strategy 2017",
    url: "https://www.sunshinecoast.qld.gov.au/council/planning-and-projects/council-strategies/environment-and-liveability-strategy",
    status: "closed",
    description: "Strategy for environmental sustainability, biodiversity corridors, and liveable communities",
    category: "environment",
    relevance: "regional",
    themes: ["biodiversity", "sustainability", "wildlife_corridors", "green_infrastructure", "climate_resilience"],
  },
  {
    title: "Arts and Heritage Levy",
    url: "https://www.sunshinecoast.qld.gov.au/experience-sunshine-coast/arts-and-culture/arts-and-heritage-levy",
    status: "closed",
    description: "Community consultation on the Arts and Heritage Levy funding priorities and allocation",
    category: "arts_culture",
    relevance: "regional",
    themes: ["arts_funding", "heritage_preservation", "creative_economy", "cultural_infrastructure"],
  },
  {
    title: "Hinterland Futures — Planning Scheme Review",
    url: "https://www.sunshinecoast.qld.gov.au/council/planning-and-projects/planning-scheme",
    status: "closed",
    description: "Planning scheme amendments affecting rural and hinterland zones, including Maleny and Witta",
    category: "planning",
    relevance: "direct",
    themes: ["rural_character", "development_pressure", "agricultural_land", "housing_density", "infrastructure"],
  },
  {
    title: "Sunshine Coast Mass Transit Options",
    url: "https://www.sunshinecoast.qld.gov.au/council/planning-and-projects/council-strategies/mass-transit",
    status: "closed",
    description: "Community consultation on mass transit options — hinterland connectivity is a recurring theme",
    category: "transport",
    relevance: "regional",
    themes: ["public_transport", "hinterland_access", "commuter_needs", "parking", "road_safety"],
  },
  {
    title: "Maleny Precinct Plan",
    url: "https://www.sunshinecoast.qld.gov.au/council/planning-and-projects/major-regional-projects",
    status: "closed",
    description: "Planning for Maleny town centre — retail, parking, pedestrian access, character preservation",
    category: "planning",
    relevance: "direct",
    themes: ["town_character", "parking", "pedestrian_access", "retail_mix", "heritage_buildings", "tourism_management"],
  },
  {
    title: "Community Grants Program Review",
    url: "https://www.sunshinecoast.qld.gov.au/living-and-community/grants-and-funding",
    status: "closed",
    description: "Review of SCC's community grants program, including arts, environment, and community development grants",
    category: "grants",
    relevance: "regional",
    themes: ["grant_funding", "community_capacity", "volunteer_support", "program_sustainability"],
  },
  {
    title: "Sunshine Coast Recreation Parks and Open Space Plan",
    url: "https://www.sunshinecoast.qld.gov.au/council/planning-and-projects/council-strategies",
    status: "closed",
    description: "Planning for recreation spaces, parks, trails, and community gathering areas",
    category: "recreation",
    relevance: "regional",
    themes: ["recreation_spaces", "trails", "community_gathering", "nature_play", "accessibility"],
  },
  {
    title: "Disaster Management — Community Resilience",
    url: "https://www.sunshinecoast.qld.gov.au/living-and-community/community-safety/disaster-management",
    status: "closed",
    description: "Community preparedness for bushfire, flood, and storm events — relevant to rural hinterland",
    category: "disaster_management",
    relevance: "direct",
    themes: ["bushfire_preparedness", "flood_resilience", "community_networks", "rural_isolation", "emergency_access"],
  },
  {
    title: "Reconciliation Action Plan",
    url: "https://www.sunshinecoast.qld.gov.au/living-and-community/first-nations-partnerships",
    status: "closed",
    description: "SCC's Reconciliation Action Plan — engagement with Jinibara and Kabi Kabi peoples",
    category: "indigenous",
    relevance: "direct",
    themes: ["reconciliation", "first_nations_engagement", "cultural_heritage", "truth_telling", "partnerships"],
  },
  {
    title: "Neighbourhood and Targeted Community Projects",
    url: "https://haveyoursay.sunshinecoast.qld.gov.au/neighbourhood-targeted-projects",
    status: "open",
    description: "Ongoing consultation on projects targeted to local neighbourhoods, places and people across the Sunshine Coast",
    category: "community_engagement",
    relevance: "direct",
    themes: ["neighbourhood_projects", "local_identity", "community_connection", "placemaking", "participation"],
  },
  {
    title: "Coastal Resilience and Climate Adaptation",
    url: "https://haveyoursay.sunshinecoast.qld.gov.au/coastal-resilience-projects",
    status: "closed",
    description: "Community consultation on coastal resilience projects addressing climate impacts and natural hazards",
    category: "environment",
    relevance: "regional",
    themes: ["climate_adaptation", "coastal_resilience", "natural_hazards", "community_preparedness", "green_infrastructure"],
  },
];

async function scrapeHaveYourSay(): Promise<Consultation[]> {
  const discovered: Consultation[] = [];

  try {
    const html = await cachedGet<string>(HAVE_YOUR_SAY_BASE, {
      headers: {
        "User-Agent": "TheHarvestCommunityResearch/1.0",
      },
      responseType: "text",
    });

    if (typeof html === "string") {
      const $ = cheerio.load(html);

      // Have Your Say uses article.project.card structure
      $("article.project.card").each((_, el) => {
        const $article = $(el);
        const $link = $article.find("a").first();
        const title = $article.find(".card-heading, h4.p-name").first().text().trim();
        const href = $link.attr("href");
        const desc = $article.find(".card-summary, p.p-summary").first().text().trim();

        // Extract data attributes for better categorization
        const projectName = $article.attr("data-project-name") || title;
        const categories = $article.attr("data-project-category") || "[]";
        const locations = $article.attr("data-project-location") || "[]";

        if (title && title.length > 5) {
          const isRelevant =
            /maleny|witta|hinterland|rural|range|community|arts|heritage|environment|neighbourhood|targeted/i.test(
              projectName + " " + desc + " " + categories + " " + locations
            );

          if (isRelevant) {
            discovered.push({
              title: projectName.slice(0, 200),
              url: href ? new URL(href, HAVE_YOUR_SAY_BASE).toString() : HAVE_YOUR_SAY_BASE,
              status: "unknown",
              description: desc.slice(0, 500) || "Discovered from Have Your Say platform",
              category: "general",
              relevance: "regional",
              themes: [],
            });
          }
        }
      });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`  Warning: Could not scrape Have Your Say: ${msg}`);
  }

  return discovered;
}

async function scrapeSCCNews(): Promise<Consultation[]> {
  const newsItems: Consultation[] = [];

  try {
    const html = await cachedGet<string>(SCC_NEWS_BASE, {
      headers: { "User-Agent": "TheHarvestCommunityResearch/1.0" },
      responseType: "text",
    });

    if (typeof html === "string") {
      const $ = cheerio.load(html);

      // SCC News Centre is a Nuxt/Vue app with client-side rendering
      // Content is not in the initial HTML, would need a headless browser
      // Leaving this as a placeholder for potential future API integration
      console.log(`  Note: SCC News is client-side rendered, content not available via static scrape`);
    }
  } catch (error) {
    console.log(`  Warning: Could not scrape SCC news`);
  }

  return newsItems;
}

function analyzeThemes(consultations: Consultation[]) {
  const themeCount: Record<string, { count: number; examples: string[] }> = {};

  for (const c of consultations) {
    for (const theme of c.themes) {
      if (!themeCount[theme]) themeCount[theme] = { count: 0, examples: [] };
      themeCount[theme].count++;
      if (themeCount[theme].examples.length < 3) {
        themeCount[theme].examples.push(c.title);
      }
    }
  }

  return Object.entries(themeCount)
    .map(([theme, data]) => ({ theme, ...data }))
    .sort((a, b) => b.count - a.count);
}

function identifyPriorities(themes: Array<{ theme: string; count: number }>) {
  const priorityThemes = themes.slice(0, 10).map((t) => t.theme);

  const priorities: string[] = [];

  if (priorityThemes.some((t) => t.includes("community"))) {
    priorities.push("Strong desire for community connection and gathering spaces");
  }
  if (priorityThemes.some((t) => t.includes("arts") || t.includes("culture") || t.includes("creative"))) {
    priorities.push("Arts and cultural infrastructure seen as community priority");
  }
  if (priorityThemes.some((t) => t.includes("environment") || t.includes("biodiversity"))) {
    priorities.push("Environmental stewardship central to community identity");
  }
  if (priorityThemes.some((t) => t.includes("heritage") || t.includes("character"))) {
    priorities.push("Preserving rural and heritage character is a strong value");
  }
  if (priorityThemes.some((t) => t.includes("development") || t.includes("housing"))) {
    priorities.push("Tension around development pressure vs. preserving rural lifestyle");
  }
  if (priorityThemes.some((t) => t.includes("reconciliation") || t.includes("first_nations"))) {
    priorities.push("Growing commitment to First Nations engagement and truth-telling");
  }
  if (priorityThemes.some((t) => t.includes("resilience") || t.includes("disaster"))) {
    priorities.push("Community resilience and preparedness for natural hazards");
  }
  if (priorityThemes.some((t) => t.includes("food") || t.includes("agricultural"))) {
    priorities.push("Local food systems and agricultural heritage highly valued");
  }

  return priorities;
}

function identifyHarvestRelevance(themes: Array<{ theme: string; count: number }>) {
  const relevance: string[] = [];

  const themeNames = themes.map((t) => t.theme);

  if (themeNames.some((t) => t.includes("gathering") || t.includes("placemaking") || t.includes("community"))) {
    relevance.push("Council strategies explicitly call for more community gathering spaces — The Harvest fills this gap");
  }
  if (themeNames.some((t) => t.includes("arts") || t.includes("creative"))) {
    relevance.push("Arts and Heritage Levy creates direct funding pathway for Harvest art space programs");
  }
  if (themeNames.some((t) => t.includes("biodiversity") || t.includes("wildlife"))) {
    relevance.push("Garden zone aligns with council's biodiversity corridor and green infrastructure priorities");
  }
  if (themeNames.some((t) => t.includes("resilience") || t.includes("community_networks"))) {
    relevance.push("Community hub model directly supports disaster resilience through social networks");
  }
  if (themeNames.some((t) => t.includes("reconciliation") || t.includes("first_nations"))) {
    relevance.push("The Harvest's co-design approach with indigenous community aligns with RAP commitments");
  }
  if (themeNames.some((t) => t.includes("rural_character") || t.includes("agricultural"))) {
    relevance.push("Kitchen and Garden zones celebrate agricultural heritage while addressing food sovereignty");
  }
  if (themeNames.some((t) => t.includes("grant") || t.includes("funding"))) {
    relevance.push("Multiple SCC grant streams align with Harvest programming across all three zones");
  }

  return relevance;
}

export async function scrapeCouncilConsultations(): Promise<ConsultationData> {
  logSection("Council Consultations — Sunshine Coast Council");

  // Start with curated consultations
  const consultations = [...KNOWN_CONSULTATIONS];

  // Try to discover more from Have Your Say and news
  console.log("  Scraping Have Your Say platform...");
  const hysItems = await scrapeHaveYourSay();
  console.log(`  Found ${hysItems.length} relevant items from Have Your Say`);

  console.log("  Scraping SCC news...");
  const newsItems = await scrapeSCCNews();
  console.log(`  Found ${newsItems.length} relevant news items`);

  // Add discovered items (avoid duplicates by title similarity)
  for (const item of [...hysItems, ...newsItems]) {
    const isDuplicate = consultations.some(
      (c) => c.title.toLowerCase().includes(item.title.toLowerCase().slice(0, 20))
    );
    if (!isDuplicate) {
      consultations.push(item);
    }
  }

  // Analyze themes
  const sentimentThemes = analyzeThemes(consultations);
  const communityPriorities = identifyPriorities(sentimentThemes);
  const harvestRelevance = identifyHarvestRelevance(sentimentThemes);

  const result: ConsultationData = {
    consultations,
    sentimentThemes,
    communityPriorities,
    harvestRelevance,
    methodology:
      "Curated catalog of Sunshine Coast Council consultations, strategies, and engagement processes " +
      "relevant to the Maleny/Witta hinterland area. Supplemented with automated scraping of the " +
      "Have Your Say platform (static HTML scraping of article.project.card elements). " +
      "Themes extracted from consultation descriptions and categorized for community sentiment analysis. " +
      "Have Your Say platform uses server-rendered HTML allowing effective scraping of project listings.",
    limitations:
      "Individual community submissions are not publicly available for most consultations. " +
      "Theme analysis is based on consultation topics rather than actual public responses. " +
      "SCC News Centre uses client-side rendering (Nuxt/Vue) and cannot be scraped with static HTML tools — " +
      "would require headless browser or API access. " +
      "For deeper sentiment, Freedom of Information requests or direct engagement with " +
      "council community development team would be needed.",
    dataDate: new Date().toISOString().split("T")[0],
  };

  console.log(`  Total: ${consultations.length} consultations, ${sentimentThemes.length} themes identified`);
  console.log(`  Community priorities: ${communityPriorities.length}`);
  console.log(`  Harvest alignment points: ${harvestRelevance.length}`);

  await saveData("council-consultations.json", result);
  return result;
}

// Run standalone
const isMain = import.meta.url === `file://${process.argv[1]}`
  || import.meta.url === `file://${path.resolve(process.argv[1] || "")}`;
if (isMain) {
  scrapeCouncilConsultations().catch(console.error);
}
