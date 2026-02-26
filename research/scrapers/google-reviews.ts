import * as dotenv from "dotenv";
import path from "path";
import { cachedGet, saveData, logSection } from "./utils.js";

dotenv.config();

// --- Types ---

interface KnownVenue {
  name: string;
  query: string;
  type: string;
  expectedRating: number;
}

interface SampleReview {
  text: string;
  rating: number;
  time: string;
}

interface VenueResult {
  name: string;
  type: string;
  rating: number | null;
  totalReviews: number | null;
  sentimentThemes: Record<string, number>;
  topPositiveThemes: string[];
  topNegativeThemes: string[];
  sampleReviews: SampleReview[];
}

interface AggregateSentiment {
  overallRating: number;
  totalReviewsAnalyzed: number;
  themeFrequency: Record<string, number>;
  positiveThemes: string[];
  negativeThemes: string[];
  communityStrengths: string[];
  communityGaps: string[];
}

interface HarvestInsights {
  gardenOpportunities: string[];
  kitchenOpportunities: string[];
  artSpaceOpportunities: string[];
}

interface GoogleReviewsOutput {
  venues: VenueResult[];
  aggregateSentiment: AggregateSentiment;
  harvestInsights: HarvestInsights;
  methodology: string;
  dataDate: string;
  apiMode: "google_places" | "curated_estimates";
}

// Google Places API response types

interface PlacesTextSearchResult {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
}

interface PlacesTextSearchResponse {
  results: PlacesTextSearchResult[];
  status: string;
}

interface PlaceReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
}

interface PlaceDetailsResult {
  name: string;
  rating?: number;
  user_ratings_total?: number;
  reviews?: PlaceReview[];
  types?: string[];
}

interface PlaceDetailsResponse {
  result: PlaceDetailsResult;
  status: string;
}

// --- Known Venues ---

const KNOWN_VENUES: KnownVenue[] = [
  { name: "Witta Markets", query: "Witta Markets Queensland", type: "market", expectedRating: 4.6 },
  { name: "Maleny Community Markets", query: "Maleny Community Markets", type: "market", expectedRating: 4.4 },
  { name: "Maple Street Co-op", query: "Maple Street Co-op Maleny", type: "retail_coop", expectedRating: 4.3 },
  { name: "Maleny Showground", query: "Maleny Showground", type: "venue", expectedRating: 4.2 },
  { name: "The Upfront Club", query: "Upfront Club Maleny", type: "cafe_community", expectedRating: 4.5 },
  { name: "Maleny Neighbourhood Centre", query: "Maleny Neighbourhood Centre", type: "community_service", expectedRating: 4.5 },
  { name: "Barung Landcare", query: "Barung Landcare Maleny", type: "environment", expectedRating: 4.7 },
  { name: "Crystal Waters Eco Village", query: "Crystal Waters Eco Village", type: "eco_community", expectedRating: 4.4 },
  { name: "Maleny Botanic Gardens", query: "Maleny Botanic Gardens", type: "garden_attraction", expectedRating: 4.6 },
  { name: "Gardners Falls", query: "Gardners Falls Maleny", type: "natural_attraction", expectedRating: 4.5 },
  { name: "Mary Cairncross Scenic Reserve", query: "Mary Cairncross Scenic Reserve", type: "nature_reserve", expectedRating: 4.7 },
  { name: "Maleny Cheese", query: "Maleny Cheese factory", type: "food_producer", expectedRating: 4.3 },
  { name: "Maleny Dairies", query: "Maleny Dairies", type: "food_producer", expectedRating: 4.5 },
  { name: "Montville Markets", query: "Montville Markets Queensland", type: "market", expectedRating: 4.3 },
  { name: "Maleny RSL", query: "Maleny RSL Sub Branch", type: "community_venue", expectedRating: 4.1 },
  { name: "Maleny Hotel", query: "Maleny Hotel", type: "pub_social", expectedRating: 3.8 },
  { name: "Rosetta Books Maleny", query: "Rosetta Books Maleny", type: "bookshop_culture", expectedRating: 4.8 },
  { name: "Maleny Artisan Market", query: "Maleny Artisan Market", type: "market", expectedRating: 4.5 },

  // --- NEW VENUES (12 additions) ---

  // Cafes & Restaurants
  { name: "Colin James Fine Food", query: "Colin James Fine Food Maleny", type: "cafe_restaurant", expectedRating: 4.4 },
  { name: "The Maleny Food Co", query: "The Maleny Food Co", type: "cafe_restaurant", expectedRating: 4.3 },
  { name: "The Terrace Maleny", query: "The Terrace Maleny Restaurant", type: "cafe_restaurant", expectedRating: 4.2 },

  // Art & Culture
  { name: "Maleny Printmakers", query: "Maleny Printmakers Studio", type: "arts_culture", expectedRating: 4.6 },
  { name: "Black Bamboo Art Gallery", query: "Black Bamboo Art Gallery Maleny", type: "arts_culture", expectedRating: 4.5 },
  { name: "The Laneway Gallery", query: "The Laneway Gallery Maleny", type: "arts_culture", expectedRating: 4.6 },

  // Community Spaces
  { name: "Maleny Library", query: "Maleny Library Sunshine Coast", type: "community_venue", expectedRating: 4.5 },
  { name: "Maleny Swimming Pool", query: "Maleny Aquatic Centre", type: "community_venue", expectedRating: 4.3 },

  // Nearby Attractions
  { name: "Kondalilla Falls", query: "Kondalilla Falls National Park", type: "natural_attraction", expectedRating: 4.7 },
  { name: "Obi Obi Creek", query: "Obi Obi Creek Maleny", type: "natural_attraction", expectedRating: 4.6 },

  // Food Producers
  { name: "Kenilworth Cheese", query: "Kenilworth Country Foods", type: "food_producer", expectedRating: 4.4 },
  { name: "Brouhaha Brewery Maleny", query: "Brouhaha Brewery Maleny", type: "food_producer", expectedRating: 4.5 },
];

// --- Sentiment Analysis ---

const SENTIMENT_THEMES: Record<string, string[]> = {
  community_value: ["community", "togetherness", "welcoming", "friendly", "inclusive", "neighbours", "belonging", "volunteer", "support", "local community"],
  local_identity: ["local", "hinterland", "character", "unique", "authentic", "village", "small town", "quirky", "independent", "maleny"],
  nature_environment: ["nature", "garden", "wildlife", "trees", "rainforest", "green", "bush", "birds", "scenic", "views", "creek", "falls", "walk"],
  food_quality: ["food", "produce", "fresh", "organic", "local food", "delicious", "homemade", "farm", "cheese", "milk", "coffee", "breakfast", "lunch"],
  arts_culture: ["art", "music", "creative", "culture", "gallery", "craft", "handmade", "artisan", "workshop", "books", "reading"],
  family_friendly: ["kids", "family", "children", "playground", "stroller", "pram", "young", "school"],
  criticism_gaps: ["disappointing", "overpriced", "expensive", "crowded", "poor", "closed", "limited", "parking", "dirty", "rude", "wait", "slow"],
  tourism_tension: ["tourist", "tourists", "crowds", "parking", "overtourism", "busy", "packed", "weekends", "day trippers", "instagram"],
};

const POSITIVE_THEMES = ["community_value", "local_identity", "nature_environment", "food_quality", "arts_culture", "family_friendly"];
const NEGATIVE_THEMES = ["criticism_gaps", "tourism_tension"];

function analyzeReviewText(text: string): Record<string, number> {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};
  for (const [theme, keywords] of Object.entries(SENTIMENT_THEMES)) {
    let count = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) count++;
    }
    if (count > 0) scores[theme] = count;
  }
  return scores;
}

function mergeThemeCounts(a: Record<string, number>, b: Record<string, number>): Record<string, number> {
  const merged = { ...a };
  for (const [key, val] of Object.entries(b)) {
    merged[key] = (merged[key] || 0) + val;
  }
  return merged;
}

function topThemes(themes: Record<string, number>, filter: string[], limit: number): string[] {
  return Object.entries(themes)
    .filter(([key]) => filter.includes(key))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key]) => key);
}

// --- Curated Fallback Sentiment ---

const VENUE_TYPE_SENTIMENT: Record<string, Record<string, number>> = {
  market: { community_value: 3, food_quality: 4, local_identity: 3, family_friendly: 2, arts_culture: 1 },
  retail_coop: { community_value: 4, local_identity: 4, food_quality: 3 },
  venue: { community_value: 3, family_friendly: 2, local_identity: 1 },
  cafe_community: { community_value: 4, food_quality: 3, arts_culture: 2, local_identity: 2 },
  cafe_restaurant: { food_quality: 4, local_identity: 2, community_value: 2, tourism_tension: 1 },
  community_service: { community_value: 5, local_identity: 2 },
  environment: { nature_environment: 5, community_value: 3, local_identity: 2 },
  eco_community: { nature_environment: 4, community_value: 4, local_identity: 3 },
  garden_attraction: { nature_environment: 5, family_friendly: 2, food_quality: 1, tourism_tension: 1 },
  natural_attraction: { nature_environment: 5, family_friendly: 3, tourism_tension: 1 },
  nature_reserve: { nature_environment: 5, family_friendly: 3, local_identity: 2 },
  food_producer: { food_quality: 5, local_identity: 3, family_friendly: 1, tourism_tension: 1 },
  community_venue: { community_value: 3, local_identity: 2, family_friendly: 1 },
  pub_social: { community_value: 2, food_quality: 2, local_identity: 1, criticism_gaps: 1 },
  bookshop_culture: { arts_culture: 5, local_identity: 4, community_value: 3 },
  arts_culture: { arts_culture: 5, local_identity: 3, community_value: 3 },
};

function generateCuratedVenue(venue: KnownVenue): VenueResult {
  const themes = VENUE_TYPE_SENTIMENT[venue.type] || { community_value: 2, local_identity: 1 };
  return {
    name: venue.name,
    type: venue.type,
    rating: venue.expectedRating,
    totalReviews: null,
    sentimentThemes: themes,
    topPositiveThemes: topThemes(themes, POSITIVE_THEMES, 3),
    topNegativeThemes: topThemes(themes, NEGATIVE_THEMES, 2),
    sampleReviews: [],
  };
}

// --- Google Places API ---

async function fetchVenueFromAPI(venue: KnownVenue, apiKey: string): Promise<VenueResult> {
  const searchUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json";
  const searchResponse = await cachedGet<PlacesTextSearchResponse>(searchUrl, {
    params: {
      query: venue.query,
      location: "-26.75,152.85",
      radius: 15000,
      key: apiKey,
    },
  });

  if (searchResponse.status !== "OK" || searchResponse.results.length === 0) {
    console.log(`  Warning: No Places results for "${venue.query}" (status: ${searchResponse.status})`);
    return generateCuratedVenue(venue);
  }

  const place = searchResponse.results[0];
  const detailsUrl = "https://maps.googleapis.com/maps/api/place/details/json";
  const detailsResponse = await cachedGet<PlaceDetailsResponse>(detailsUrl, {
    params: {
      place_id: place.place_id,
      fields: "name,rating,user_ratings_total,reviews,types",
      key: apiKey,
    },
  });

  if (detailsResponse.status !== "OK") {
    console.log(`  Warning: Could not get details for "${venue.name}" (status: ${detailsResponse.status})`);
    return generateCuratedVenue(venue);
  }

  const details = detailsResponse.result;
  const reviews = details.reviews || [];

  // Analyze sentiment across all reviews
  let combinedThemes: Record<string, number> = {};
  for (const review of reviews) {
    const reviewThemes = analyzeReviewText(review.text);
    combinedThemes = mergeThemeCounts(combinedThemes, reviewThemes);
  }

  const sampleReviews: SampleReview[] = reviews.slice(0, 3).map((r) => ({
    text: r.text.slice(0, 300),
    rating: r.rating,
    time: new Date(r.time * 1000).toISOString().split("T")[0],
  }));

  return {
    name: venue.name,
    type: venue.type,
    rating: details.rating ?? null,
    totalReviews: details.user_ratings_total ?? null,
    sentimentThemes: combinedThemes,
    topPositiveThemes: topThemes(combinedThemes, POSITIVE_THEMES, 3),
    topNegativeThemes: topThemes(combinedThemes, NEGATIVE_THEMES, 2),
    sampleReviews,
  };
}

// --- Harvest Insights Derivation ---

function deriveHarvestInsights(themes: Record<string, number>, venues: VenueResult[]): HarvestInsights {
  const gardenOpportunities: string[] = [];
  const kitchenOpportunities: string[] = [];
  const artSpaceOpportunities: string[] = [];

  // Garden insights from nature/environment and food/produce themes
  if ((themes.nature_environment || 0) > 5) {
    gardenOpportunities.push("Strong community appetite for nature-based experiences — native gardens, bush restoration, and wildlife habitat could anchor the Garden zone");
  }
  if ((themes.food_quality || 0) > 3) {
    gardenOpportunities.push("Local food and produce culture is highly valued — edible gardens, permaculture demonstrations, and seed libraries would resonate");
  }
  const ecoVenues = venues.filter((v) => ["environment", "eco_community", "nature_reserve"].includes(v.type));
  if (ecoVenues.length >= 2) {
    gardenOpportunities.push("Multiple eco/nature orgs already active — partnership opportunities for shared knowledge, volunteer programs, and plant propagation");
  }

  // Kitchen insights from food and community themes
  if ((themes.food_quality || 0) > 3) {
    kitchenOpportunities.push("Reviews highlight fresh, local, and organic food as a core draw — a community kitchen with local produce focus would align perfectly");
  }
  if ((themes.community_value || 0) > 5) {
    kitchenOpportunities.push("Community togetherness is the top-rated theme — shared meals, cooking workshops, and community dinners could fill a social gap");
  }
  const foodVenues = venues.filter((v) => ["food_producer", "market", "cafe_community"].includes(v.type));
  if (foodVenues.length >= 3) {
    kitchenOpportunities.push("Dense food producer ecosystem nearby — potential for farm-to-table collaborations, producer showcases, and food preservation workshops");
  }

  // Art space insights from arts/culture themes
  if ((themes.arts_culture || 0) > 2) {
    artSpaceOpportunities.push("Arts and culture referenced positively across venues — dedicated creative space would serve an existing appetite");
  }
  const cultureVenues = venues.filter((v) => ["bookshop_culture", "cafe_community", "arts_culture"].includes(v.type));
  if (cultureVenues.length >= 1) {
    artSpaceOpportunities.push("Existing cultural anchors (bookshops, creative cafes) show demand — an art space could offer what these venues cannot: workshop and exhibition space");
  }
  if ((themes.local_identity || 0) > 3) {
    artSpaceOpportunities.push("Strong local identity pride — art space could celebrate and document hinterland culture, support local makers, and resist homogenisation");
  }

  // Gaps-based insights
  if ((themes.criticism_gaps || 0) > 2) {
    kitchenOpportunities.push("Some criticism around limited options and closures — a reliable, community-run kitchen could fill gaps in local food infrastructure");
  }
  if ((themes.tourism_tension || 0) > 1) {
    artSpaceOpportunities.push("Tourism tension detected — art space can prioritise local makers and community-first programming over tourist-oriented content");
    gardenOpportunities.push("Tourism pressure on nature spots — a local garden space reduces need to compete with tourists at popular reserves");
  }

  return { gardenOpportunities, kitchenOpportunities, artSpaceOpportunities };
}

// --- Main Scraper ---

export async function scrapeGoogleReviews(): Promise<GoogleReviewsOutput> {
  logSection("Google Reviews — Community Venue Sentiment Analysis");

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const useAPI = Boolean(apiKey);
  const apiMode: "google_places" | "curated_estimates" = useAPI ? "google_places" : "curated_estimates";

  if (useAPI) {
    console.log("  Mode: Google Places API (live data)");
  } else {
    console.log("  Mode: Curated estimates (no GOOGLE_PLACES_API_KEY set)");
  }

  // Fetch venue data
  const venues: VenueResult[] = [];

  if (useAPI && apiKey) {
    for (const venue of KNOWN_VENUES) {
      try {
        console.log(`  Fetching: ${venue.name}...`);
        const result = await fetchVenueFromAPI(venue, apiKey);
        venues.push(result);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.log(`  Warning: Failed to fetch ${venue.name}: ${msg}`);
        venues.push(generateCuratedVenue(venue));
      }
    }
  } else {
    for (const venue of KNOWN_VENUES) {
      venues.push(generateCuratedVenue(venue));
    }
  }

  // Aggregate sentiment
  let allThemes: Record<string, number> = {};
  let totalReviews = 0;
  let ratingSum = 0;
  let ratingCount = 0;

  for (const venue of venues) {
    allThemes = mergeThemeCounts(allThemes, venue.sentimentThemes);
    totalReviews += venue.sampleReviews.length;
    if (venue.rating !== null) {
      ratingSum += venue.rating;
      ratingCount++;
    }
  }

  const overallRating = ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 10) / 10 : 0;

  // Derive strengths and gaps from theme frequencies
  const sortedPositive = topThemes(allThemes, POSITIVE_THEMES, 5);
  const sortedNegative = topThemes(allThemes, NEGATIVE_THEMES, 5);

  const strengthDescriptions: Record<string, string> = {
    community_value: "Community togetherness and welcoming atmosphere",
    local_identity: "Strong local identity and authentic character",
    nature_environment: "Rich natural environment and green spaces",
    food_quality: "High-quality local food and produce culture",
    arts_culture: "Active arts, culture, and creative community",
    family_friendly: "Family-friendly spaces and activities",
  };

  const gapDescriptions: Record<string, string> = {
    criticism_gaps: "Some venues noted for limited options, closures, or service issues",
    tourism_tension: "Tension between local community needs and tourism pressure",
  };

  const communityStrengths = sortedPositive.map((t) => strengthDescriptions[t] || t);
  const communityGaps = sortedNegative.map((t) => gapDescriptions[t] || t);

  const aggregateSentiment: AggregateSentiment = {
    overallRating,
    totalReviewsAnalyzed: totalReviews,
    themeFrequency: allThemes,
    positiveThemes: sortedPositive,
    negativeThemes: sortedNegative,
    communityStrengths,
    communityGaps,
  };

  const harvestInsights = deriveHarvestInsights(allThemes, venues);

  const methodology = useAPI
    ? "Google Places API Text Search + Place Details used to collect real reviews for each venue. Sentiment analysis via keyword matching against predefined community-relevant theme categories."
    : "Curated venue list with estimated ratings based on public knowledge. Sentiment themes estimated from venue type and community context. No live review data — marked as estimates. Set GOOGLE_PLACES_API_KEY in .env for live data.";

  const output: GoogleReviewsOutput = {
    venues,
    aggregateSentiment,
    harvestInsights,
    methodology,
    dataDate: new Date().toISOString().split("T")[0],
    apiMode,
  };

  await saveData("google-reviews.json", output);

  console.log(`  Processed ${venues.length} venues (mode: ${apiMode})`);
  console.log(`  Overall rating: ${overallRating}`);
  console.log(`  Top strengths: ${communityStrengths.slice(0, 3).join(", ")}`);

  return output;
}

// Run standalone
const isMain = import.meta.url === `file://${process.argv[1]}`
  || import.meta.url === `file://${path.resolve(process.argv[1] || "")}`;
if (isMain) {
  scrapeGoogleReviews().catch(console.error);
}
