import path from "path";
import * as cheerio from "cheerio";
import { cachedGet, saveData, logSection } from "./utils.js";

// --- Types ---

type ActivityLevel = "very_high" | "high" | "medium" | "low" | "seasonal";
type GroupType = "community_discussion" | "marketplace" | "real_estate" | "interest_group" | "business_page";

interface FacebookGroup {
  name: string;
  url: string;
  estimatedMembers: number;
  type: GroupType;
  description: string;
  topics: string[];
  activityLevel: ActivityLevel;
  sentimentThemes: string[];
  enrichedDescription?: string;
  enrichedFollowers?: number;
  fetchStatus?: "success" | "blocked" | "error" | "skipped";
}

interface ThemeFrequency {
  theme: string;
  frequency: number;
  relevantGroups: string[];
}

interface SentimentSummary {
  dominantThemes: ThemeFrequency[];
  totalCommunityReach: number;
  topicDistribution: Record<string, number>;
  harvestAlignment: {
    garden: string[];
    kitchen: string[];
    artSpace: string[];
  };
}

interface FacebookGroupsOutput {
  groups: FacebookGroup[];
  sentimentSummary: SentimentSummary;
  methodology: string;
  limitations: string;
  dataDate: string;
}

// --- Known Groups ---

const KNOWN_GROUPS: FacebookGroup[] = [
  {
    name: "Maleny Community Board",
    url: "https://www.facebook.com/groups/malenycommunityboard",
    estimatedMembers: 12000,
    type: "community_discussion",
    description: "Main community discussion group for Maleny and surrounds",
    topics: ["local_issues", "events", "recommendations", "complaints", "council", "development"],
    activityLevel: "very_high",
    sentimentThemes: [
      "development_concerns",
      "community_spirit",
      "local_business_support",
      "traffic_parking",
      "environment",
    ],
  },
  {
    name: "Maleny Buy Sell Swap",
    url: "https://www.facebook.com/groups/malenybuysellswap",
    estimatedMembers: 8000,
    type: "marketplace",
    description: "Local buy/sell/swap marketplace for Maleny area",
    topics: ["secondhand", "local_trade", "services", "free_stuff"],
    activityLevel: "high",
    sentimentThemes: ["community_exchange", "affordability", "local_economy"],
  },
  {
    name: "Sunshine Coast Hinterland Community",
    url: "https://www.facebook.com/groups/schinterland",
    estimatedMembers: 15000,
    type: "community_discussion",
    description:
      "Broader hinterland community group covering Maleny, Montville, Mapleton, Kenilworth",
    topics: ["events", "news", "wildlife", "weather", "recommendations"],
    activityLevel: "high",
    sentimentThemes: [
      "hinterland_identity",
      "tourism_tension",
      "wildlife_encounters",
      "bushfire_preparedness",
    ],
  },
  {
    name: "Maleny and Hinterland Real Estate",
    url: "https://www.facebook.com/groups/malenyhinterlandrealestate",
    estimatedMembers: 5000,
    type: "real_estate",
    description: "Property listings and real estate discussion for the hinterland",
    topics: ["property", "rentals", "market_trends", "acreage"],
    activityLevel: "medium",
    sentimentThemes: [
      "housing_affordability",
      "tree_change",
      "rental_crisis",
      "development_pressure",
    ],
  },
  {
    name: "Range Gardeners",
    url: "https://www.facebook.com/groups/rangegardeners",
    estimatedMembers: 3000,
    type: "interest_group",
    description: "Gardening community for the Blackall Range area",
    topics: ["gardening", "permaculture", "food_growing", "native_plants", "composting"],
    activityLevel: "medium",
    sentimentThemes: [
      "food_sovereignty",
      "sustainability",
      "knowledge_sharing",
      "seasonal_growing",
    ],
  },
  {
    name: "Maleny Arts and Crafts",
    url: "https://www.facebook.com/groups/malenyartsandcrafts",
    estimatedMembers: 2000,
    type: "interest_group",
    description: "Arts, crafts, and creative community in Maleny",
    topics: ["art", "craft", "exhibitions", "workshops", "markets"],
    activityLevel: "medium",
    sentimentThemes: [
      "creative_community",
      "exhibition_opportunities",
      "workshop_demand",
      "art_market",
    ],
  },
  {
    name: "Maleny Food Co-op / Maple Street Co-op",
    url: "https://www.facebook.com/MapleStreetCoop",
    estimatedMembers: 4000,
    type: "business_page",
    description: "Community-owned cooperative offering local, organic, and fair trade products",
    topics: ["local_food", "organic", "cooperative", "sustainability"],
    activityLevel: "medium",
    sentimentThemes: ["cooperative_economy", "local_food_systems", "ethical_consumption"],
  },
  {
    name: "Crystal Waters Community",
    url: "https://www.facebook.com/crystalwatersecovillage",
    estimatedMembers: 2500,
    type: "business_page",
    description: "Permaculture eco-village near Maleny",
    topics: ["permaculture", "eco_living", "community_design", "sustainability"],
    activityLevel: "low",
    sentimentThemes: ["intentional_community", "permaculture", "alternative_living"],
  },
  {
    name: "Barung Landcare",
    url: "https://www.facebook.com/BarungLandcare",
    estimatedMembers: 3000,
    type: "business_page",
    description:
      "Environmental restoration and landcare across the Blackall Range",
    topics: ["revegetation", "wildlife_corridors", "native_plants", "volunteering", "workshops"],
    activityLevel: "medium",
    sentimentThemes: ["environmental_stewardship", "volunteer_community", "biodiversity"],
  },
  {
    name: "Witta Community",
    url: "https://www.facebook.com/groups/wittacommunity",
    estimatedMembers: 500,
    type: "community_discussion",
    description: "Local community group for Witta residents",
    topics: ["local_news", "witta_markets", "neighbours", "road_conditions"],
    activityLevel: "low",
    sentimentThemes: ["rural_identity", "community_connection", "infrastructure"],
  },
  {
    name: "Maleny Dairies",
    url: "https://www.facebook.com/MalenyDairies",
    estimatedMembers: 8000,
    type: "business_page",
    description: "Local dairy producer, iconic Maleny brand",
    topics: ["local_dairy", "farm_tours", "sustainability"],
    activityLevel: "medium",
    sentimentThemes: ["local_production", "agricultural_heritage", "buy_local"],
  },
  {
    name: "Sunshine Coast Food and Agribusiness Network (FAN)",
    url: "https://www.facebook.com/scfoodnetwork",
    estimatedMembers: 3000,
    type: "business_page",
    description: "Network supporting local food producers on the Sunshine Coast",
    topics: ["food_production", "agribusiness", "farm_gate", "food_trails"],
    activityLevel: "medium",
    sentimentThemes: ["food_economy", "producer_support", "paddock_to_plate"],
  },
  {
    name: "Maleny Music Festival",
    url: "https://www.facebook.com/malenymusicfestival",
    estimatedMembers: 6000,
    type: "business_page",
    description: "Annual music and arts festival",
    topics: ["music", "arts", "festival", "community_celebration"],
    activityLevel: "seasonal",
    sentimentThemes: ["cultural_celebration", "community_gathering", "arts_economy"],
  },
];

// --- Harvest zone alignment mapping ---

const GARDEN_THEMES = new Set([
  "food_sovereignty",
  "sustainability",
  "seasonal_growing",
  "permaculture",
  "environmental_stewardship",
  "biodiversity",
  "volunteer_community",
  "native_plants",
  "revegetation",
  "alternative_living",
  "intentional_community",
  "environment",
]);

const KITCHEN_THEMES = new Set([
  "local_food_systems",
  "cooperative_economy",
  "ethical_consumption",
  "food_economy",
  "producer_support",
  "paddock_to_plate",
  "local_production",
  "agricultural_heritage",
  "buy_local",
  "community_exchange",
  "affordability",
  "local_economy",
]);

const ART_SPACE_THEMES = new Set([
  "creative_community",
  "exhibition_opportunities",
  "workshop_demand",
  "art_market",
  "cultural_celebration",
  "community_gathering",
  "arts_economy",
  "knowledge_sharing",
  "community_spirit",
  "hinterland_identity",
]);

// --- Scraping helpers ---

async function fetchPublicPageMeta(
  group: FacebookGroup
): Promise<{ description?: string; followers?: number }> {
  try {
    const html = await cachedGet<string>(group.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      responseType: "text",
    });

    if (typeof html !== "string") return {};

    const $ = cheerio.load(html);

    // Try to extract meta description
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      undefined;

    // Try to extract follower/member counts from meta or page text
    let followers: number | undefined;
    const pageText = $("body").text();
    const followerMatch = pageText.match(/([\d,]+)\s*(?:followers|people like this|members)/i);
    if (followerMatch) {
      followers = parseInt(followerMatch[1].replace(/,/g, ""), 10);
      if (isNaN(followers)) followers = undefined;
    }

    return { description, followers };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`  Warning: Could not fetch ${group.name}: ${msg}`);
    return {};
  }
}

// --- Sentiment analysis ---

function buildSentimentSummary(groups: FacebookGroup[]): SentimentSummary {
  // Aggregate theme frequencies
  const themeCounts = new Map<string, { count: number; groups: string[] }>();
  for (const group of groups) {
    for (const theme of group.sentimentThemes) {
      const existing = themeCounts.get(theme) || { count: 0, groups: [] };
      existing.count++;
      existing.groups.push(group.name);
      themeCounts.set(theme, existing);
    }
  }

  const dominantThemes: ThemeFrequency[] = Array.from(themeCounts.entries())
    .map(([theme, data]) => ({
      theme,
      frequency: data.count,
      relevantGroups: data.groups,
    }))
    .sort((a, b) => b.frequency - a.frequency);

  // Topic distribution
  const topicCounts: Record<string, number> = {};
  for (const group of groups) {
    for (const topic of group.topics) {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    }
  }

  // Total reach
  const totalCommunityReach = groups.reduce((sum, g) => sum + g.estimatedMembers, 0);

  // Harvest zone alignment
  const allThemes = dominantThemes.map((t) => t.theme);
  const gardenAligned = allThemes.filter((t) => GARDEN_THEMES.has(t));
  const kitchenAligned = allThemes.filter((t) => KITCHEN_THEMES.has(t));
  const artSpaceAligned = allThemes.filter((t) => ART_SPACE_THEMES.has(t));

  return {
    dominantThemes,
    totalCommunityReach,
    topicDistribution: topicCounts,
    harvestAlignment: {
      garden: gardenAligned,
      kitchen: kitchenAligned,
      artSpace: artSpaceAligned,
    },
  };
}

// --- Main export ---

export async function scrapeFacebookGroups(): Promise<FacebookGroupsOutput> {
  logSection("Facebook Community Groups \u2014 Maleny/Witta Area");

  const groups: FacebookGroup[] = KNOWN_GROUPS.map((g) => ({ ...g }));

  // Attempt to enrich business pages (not groups -- groups require login)
  const pageEntries = groups.filter((g) => g.type === "business_page");
  console.log(
    `  Attempting to fetch public metadata for ${pageEntries.length} Facebook pages...`
  );

  for (const page of pageEntries) {
    const meta = await fetchPublicPageMeta(page);
    if (meta.description) {
      page.enrichedDescription = meta.description;
      page.fetchStatus = "success";
    } else if (meta.followers) {
      page.fetchStatus = "success";
    } else {
      page.fetchStatus = "blocked";
    }
    if (meta.followers) {
      page.enrichedFollowers = meta.followers;
    }
  }

  // Mark group-type entries as skipped (require login)
  for (const group of groups) {
    if (!group.fetchStatus) {
      group.fetchStatus = "skipped";
    }
  }

  const enrichedCount = groups.filter((g) => g.fetchStatus === "success").length;
  const blockedCount = groups.filter((g) => g.fetchStatus === "blocked").length;
  console.log(
    `  Results: ${enrichedCount} enriched, ${blockedCount} blocked, ${groups.length - enrichedCount - blockedCount} skipped (groups require login)`
  );

  // Build sentiment summary
  const sentimentSummary = buildSentimentSummary(groups);

  console.log(`  Total community reach: ~${sentimentSummary.totalCommunityReach.toLocaleString()} members`);
  console.log(
    `  Top themes: ${sentimentSummary.dominantThemes.slice(0, 5).map((t) => t.theme).join(", ")}`
  );
  console.log(
    `  Harvest alignment — Garden: ${sentimentSummary.harvestAlignment.garden.length} themes, Kitchen: ${sentimentSummary.harvestAlignment.kitchen.length} themes, Art Space: ${sentimentSummary.harvestAlignment.artSpace.length} themes`
  );

  const output: FacebookGroupsOutput = {
    groups,
    sentimentSummary,
    methodology:
      "Curated catalog of public Facebook groups and pages in the Maleny/Witta/Hinterland area. " +
      "Member counts are estimates based on publicly visible information. " +
      "Business pages were fetched for public metadata where possible; " +
      "group content was not accessed as it requires membership.",
    limitations:
      "Facebook group content requires membership to access. Most group metadata is not " +
      "available without authentication. Member counts are approximate and may be outdated. " +
      "Sentiment themes are inferred from group purpose and public description, not from " +
      "analysis of actual posts. Activity levels are qualitative estimates.",
    dataDate: new Date().toISOString().split("T")[0],
  };

  await saveData("facebook-groups.json", output);
  console.log(`  Cataloged ${groups.length} Facebook groups/pages`);

  return output;
}

// Run standalone
const isMain = import.meta.url === `file://${process.argv[1]}`
  || import.meta.url === `file://${path.resolve(process.argv[1] || "")}`;
if (isMain) {
  scrapeFacebookGroups().catch(console.error);
}
