import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { invokeLLM, type Message } from "../server/_core/llm.js";
import { loadData, logSection } from "./scrapers/utils.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ANALYSIS_DIR = path.resolve(__dirname, "analysis");

interface AnalysisResult {
  demographicSummary: string;
  gapAnalysis: string;
  programmingSuggestions: string;
  grantEvidencePack: string;
  communityAssetMap: string;
  historicalContext: string;
  indigenousContext: string;
  harvestOpportunityMatrix: string;
  communitySentiment: string;
  communityPersonas: string;
  generatedAt: string;
}

async function askClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const messages: Message[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const result = await invokeLLM({ messages, maxTokens: 4096 });

  const content = result.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("\n");
  }
  return "";
}

function summarizeData(data: unknown): string {
  const json = JSON.stringify(data, null, 2);
  // Truncate to avoid overwhelming the LLM
  if (json.length > 15000) {
    return json.slice(0, 15000) + "\n... [truncated]";
  }
  return json;
}

export async function runAnalysis() {
  logSection("AI Analysis Pipeline — Community Profile");

  await fs.mkdir(ANALYSIS_DIR, { recursive: true });

  // Load all available data
  console.log("  Loading scraped data...");
  const census = await loadData("abs-census.json");
  const venues = await loadData("scc-venues.json");
  const heritage = await loadData("scc-heritage.json");
  const planning = await loadData("scc-planning.json");
  const population = await loadData("qgso-population.json");
  const qldHeritage = await loadData("qld-heritage.json");
  const trove = await loadData("trove-history.json");
  const species = await loadData("ala-species.json");
  const communityOrgs = await loadData("community-orgs.json");
  const localEvents = await loadData("local-events.json");
  // Sentiment data
  const facebookGroups = await loadData("facebook-groups.json");
  const googleReviews = await loadData("google-reviews.json");
  const councilConsultations = await loadData("council-consultations.json");
  const localMedia = await loadData("local-media.json");

  const dataSources = {
    census: census ? "available" : "missing",
    venues: venues ? "available" : "missing",
    heritage: heritage ? "available" : "missing",
    population: population ? "available" : "missing",
    trove: trove ? "available" : "missing",
    species: species ? "available" : "missing",
    communityOrgs: communityOrgs ? "available" : "missing",
    localEvents: localEvents ? "available" : "missing",
    facebookGroups: facebookGroups ? "available" : "missing",
    googleReviews: googleReviews ? "available" : "missing",
    councilConsultations: councilConsultations ? "available" : "missing",
    localMedia: localMedia ? "available" : "missing",
  };
  console.log("  Data sources:", dataSources);

  const systemPrompt = `You are a community development researcher analyzing data for The Harvest, a community hub being established in Witta, QLD (postcode 4552), on Jinibara/Kabi Kabi Country in the Sunshine Coast Hinterland.

The Harvest has three core zones:
- Garden (grow) — food production, permaculture, community gardens
- Kitchen (feed) — communal cooking, food preservation, shared meals
- Art Space (make) — creative arts, workshops, maker space

Your analysis should be practical, evidence-based, and suitable for grant applications (especially RADF — Regional Arts Development Fund). Write in a professional but warm tone that reflects community values.`;

  const analyses: Partial<AnalysisResult> = {};

  // 1. Demographic Summary
  if (census || population) {
    console.log("  Generating demographic summary...");
    try {
      analyses.demographicSummary = await askClaude(
        systemPrompt,
        `Synthesize this Census and population data into a community narrative for Witta/Maleny (POA 4552). Cover age structure, household composition, income levels, employment patterns, cultural diversity, and volunteering rates. Highlight what makes this community distinctive.

Census data:
${census ? summarizeData(census) : "Not available"}

Population data:
${population ? summarizeData(population) : "Not available"}`
      );
    } catch (e) {
      console.log(`  Warning: Demographic summary failed: ${e instanceof Error ? e.message : e}`);
      analyses.demographicSummary = "Analysis not available — LLM invocation failed.";
    }
  } else {
    analyses.demographicSummary = "No census or population data available for analysis.";
  }

  // 2. Gap Analysis
  console.log("  Generating gap analysis...");
  try {
    analyses.gapAnalysis = await askClaude(
      systemPrompt,
      `Based on the community data below, identify gaps in services and programs for the Witta/Maleny area. What needs are underserved? What demographics are missing out? Where could The Harvest fill gaps?

Community organizations: ${communityOrgs ? summarizeData(communityOrgs) : "Not available"}
Local events: ${localEvents ? summarizeData(localEvents) : "Not available"}
Census data: ${census ? summarizeData(census) : "Not available"}
Venues: ${venues ? summarizeData(venues) : "Not available"}`
    );
  } catch (e) {
    console.log(`  Warning: Gap analysis failed: ${e instanceof Error ? e.message : e}`);
    analyses.gapAnalysis = "Analysis not available.";
  }

  // 3. Programming Suggestions
  console.log("  Generating programming suggestions...");
  try {
    analyses.programmingSuggestions = await askClaude(
      systemPrompt,
      `Suggest specific programs and activities The Harvest could offer based on community data. Organize suggestions by the three zones (Garden, Kitchen, Art Space) and include cross-zone programs. Consider age groups, seasonal patterns, and existing community strengths.

Census/demographics: ${census ? summarizeData(census) : "Not available"}
Community orgs: ${communityOrgs ? summarizeData(communityOrgs) : "Not available"}
Events: ${localEvents ? summarizeData(localEvents) : "Not available"}
Biodiversity: ${species ? summarizeData(species) : "Not available"}`
    );
  } catch (e) {
    console.log(`  Warning: Programming suggestions failed: ${e instanceof Error ? e.message : e}`);
    analyses.programmingSuggestions = "Analysis not available.";
  }

  // 4. Grant Evidence Pack
  console.log("  Generating grant evidence pack...");
  try {
    analyses.grantEvidencePack = await askClaude(
      systemPrompt,
      `Generate RADF-ready evidence statements and statistics that The Harvest can use in grant applications. Include:
- Community need statements backed by data
- Demographic evidence for target audiences
- Gap analysis evidence
- Cultural and environmental significance
- Community engagement potential
- Alignment with arts/cultural development priorities

Format as numbered evidence statements with source citations.

Census: ${census ? summarizeData(census) : "Not available"}
Community: ${communityOrgs ? summarizeData(communityOrgs) : "Not available"}
Heritage: ${heritage ? summarizeData(heritage) : "Not available"}
${qldHeritage ? `QLD Heritage: ${summarizeData(qldHeritage)}` : ""}`
    );
  } catch (e) {
    console.log(`  Warning: Grant evidence pack failed: ${e instanceof Error ? e.message : e}`);
    analyses.grantEvidencePack = "Analysis not available.";
  }

  // 5. Community Asset Map
  console.log("  Generating community asset map...");
  try {
    analyses.communityAssetMap = await askClaude(
      systemPrompt,
      `Create a community asset map narrative. Categorize and describe the local organizations, venues, natural assets, and cultural resources. Identify potential partners and collaborators for The Harvest.

Organizations: ${communityOrgs ? summarizeData(communityOrgs) : "Not available"}
Venues: ${venues ? summarizeData(venues) : "Not available"}
Heritage: ${heritage ? summarizeData(heritage) : "Not available"}
Biodiversity: ${species ? summarizeData(species) : "Not available"}`
    );
  } catch (e) {
    console.log(`  Warning: Community asset map failed: ${e instanceof Error ? e.message : e}`);
    analyses.communityAssetMap = "Analysis not available.";
  }

  // 6. Historical Context
  if (trove) {
    console.log("  Generating historical context...");
    try {
      analyses.historicalContext = await askClaude(
        systemPrompt,
        `Synthesize these historical records from Trove into a place-based narrative for Witta and the Maleny hinterland. Cover settlement history, agricultural heritage, community development, and key events. Make it vivid and suitable for community storytelling.

Trove records: ${summarizeData(trove)}
Heritage data: ${heritage ? summarizeData(heritage) : "Not available"}
${qldHeritage ? `QLD Heritage: ${summarizeData(qldHeritage)}` : ""}`
      );
    } catch (e) {
      console.log(`  Warning: Historical context failed: ${e instanceof Error ? e.message : e}`);
      analyses.historicalContext = "Analysis not available.";
    }
  } else {
    analyses.historicalContext = "No Trove historical data available. Set TROVE_API_KEY to enable.";
  }

  // 7. Indigenous Context
  console.log("  Generating indigenous context...");
  try {
    analyses.indigenousContext = await askClaude(
      systemPrompt,
      `Respectfully summarize what is publicly known about the indigenous heritage of the Witta/Maleny area (Jinibara and Kabi Kabi Country). Include:
- Traditional custodians and language groups
- Known cultural significance of the area
- Native Title status
- Public reconciliation efforts
- Opportunities for The Harvest to engage respectfully with indigenous community

IMPORTANT: Clearly flag that deeper indigenous knowledge requires direct community engagement with Jinibara and Kabi Kabi elders and organizations, not web scraping. Any cultural protocols must be developed in partnership.

Heritage data: ${heritage ? summarizeData(heritage) : "Not available"}
Trove records: ${trove ? summarizeData(trove) : "Not available"}`
    );
  } catch (e) {
    console.log(`  Warning: Indigenous context failed: ${e instanceof Error ? e.message : e}`);
    analyses.indigenousContext = "Analysis not available.";
  }

  // 8. Harvest Opportunity Matrix
  console.log("  Generating Harvest opportunity matrix...");
  try {
    analyses.harvestOpportunityMatrix = await askClaude(
      systemPrompt,
      `Create a "Harvest Opportunity Matrix" that cross-references community needs with The Harvest's three zones (Garden, Kitchen, Art Space). For each zone, identify:
- Top 3-5 opportunities based on evidence
- Target demographics
- Potential partnerships
- Seasonal considerations
- Revenue/funding potential
- Quick wins vs. long-term programs

Also identify cross-zone opportunities that connect all three.

Census: ${census ? summarizeData(census) : "Not available"}
Gap analysis context: ${analyses.gapAnalysis || "Not available"}
Community: ${communityOrgs ? summarizeData(communityOrgs) : "Not available"}
Biodiversity: ${species ? summarizeData(species) : "Not available"}`
    );
  } catch (e) {
    console.log(`  Warning: Opportunity matrix failed: ${e instanceof Error ? e.message : e}`);
    analyses.harvestOpportunityMatrix = "Analysis not available.";
  }

  // 9. Community Sentiment Synthesis
  const hasSentimentData = facebookGroups || googleReviews || councilConsultations || localMedia;
  if (hasSentimentData) {
    console.log("  Generating community sentiment synthesis...");
    try {
      analyses.communitySentiment = await askClaude(
        systemPrompt,
        `Synthesize community sentiment data from multiple sources into a coherent narrative. Identify:
- What this community values most (top 5 values with evidence)
- What frustrates or concerns them (top 5 pain points)
- Unmet needs and desires
- The community's self-image vs. outsider perception
- Emotional drivers that would motivate engagement with The Harvest
- Key tensions (e.g., growth vs. preservation, tourism vs. local character)

Facebook community groups: ${facebookGroups ? summarizeData(facebookGroups) : "Not available"}
Google Reviews of local venues: ${googleReviews ? summarizeData(googleReviews) : "Not available"}
Council consultations: ${councilConsultations ? summarizeData(councilConsultations) : "Not available"}
Local media themes: ${localMedia ? summarizeData(localMedia) : "Not available"}`
      );
    } catch (e) {
      console.log(`  Warning: Sentiment synthesis failed: ${e instanceof Error ? e.message : e}`);
      analyses.communitySentiment = "Analysis not available.";
    }
  } else {
    analyses.communitySentiment = "No sentiment data available. Run sentiment scrapers first.";
  }

  // 10. Community Personas for Acquisition Strategy
  console.log("  Generating community personas...");
  try {
    analyses.communityPersonas = await askClaude(
      systemPrompt,
      `Based on ALL the community data collected, create 5-6 detailed community personas for The Harvest's acquisition strategy. For each persona include:

**Name & Archetype** (e.g., "Sarah — The Regenerative Tree-Changer")
**Demographics**: Age range, household type, income bracket, occupation
**Values & Motivations**: What drives them, what they care about
**Pain Points**: What's missing from their life in the hinterland
**Digital Habits**: Where they hang out online (which Facebook groups, media they read)
**Physical Habits**: Where they go (which markets, venues, groups)
**Gateway to The Harvest**: What program/event would get them through the door the FIRST time
**Zone Alignment**: Which Harvest zone (Garden/Kitchen/Art Space) is their entry point
**Acquisition Channel**: How to reach them specifically
**Lifetime Value**: What they could become (member, volunteer, champion, funder)

Then provide an ACQUISITION PRIORITY RANKING — which persona should The Harvest pursue first and why. Consider ease of reach, alignment with values, and potential to become advocates.

Census demographics: ${census ? summarizeData(census) : "Not available"}
Community organizations: ${communityOrgs ? summarizeData(communityOrgs) : "Not available"}
Facebook groups: ${facebookGroups ? summarizeData(facebookGroups) : "Not available"}
Google reviews: ${googleReviews ? summarizeData(googleReviews) : "Not available"}
Local events: ${localEvents ? summarizeData(localEvents) : "Not available"}
Sentiment data: ${analyses.communitySentiment ? analyses.communitySentiment.slice(0, 3000) : "Not available"}`
    );
  } catch (e) {
    console.log(`  Warning: Community personas failed: ${e instanceof Error ? e.message : e}`);
    analyses.communityPersonas = "Analysis not available.";
  }

  const result: AnalysisResult = {
    demographicSummary: analyses.demographicSummary || "Not available",
    gapAnalysis: analyses.gapAnalysis || "Not available",
    programmingSuggestions: analyses.programmingSuggestions || "Not available",
    grantEvidencePack: analyses.grantEvidencePack || "Not available",
    communityAssetMap: analyses.communityAssetMap || "Not available",
    historicalContext: analyses.historicalContext || "Not available",
    indigenousContext: analyses.indigenousContext || "Not available",
    harvestOpportunityMatrix: analyses.harvestOpportunityMatrix || "Not available",
    communitySentiment: analyses.communitySentiment || "Not available",
    communityPersonas: analyses.communityPersonas || "Not available",
    generatedAt: new Date().toISOString(),
  };

  // Save as JSON
  const jsonPath = path.join(ANALYSIS_DIR, "community-profile.json");
  await fs.writeFile(jsonPath, JSON.stringify(result, null, 2));
  console.log(`  Saved ${jsonPath}`);

  // Save as Markdown
  const markdown = `# Community Profile — Witta/Maleny (POA 4552)
*Generated ${result.generatedAt}*

## Demographic Summary
${result.demographicSummary}

---

## Gap Analysis
${result.gapAnalysis}

---

## Programming Suggestions
${result.programmingSuggestions}

---

## Grant Evidence Pack (RADF-Ready)
${result.grantEvidencePack}

---

## Community Asset Map
${result.communityAssetMap}

---

## Historical Context
${result.historicalContext}

---

## Indigenous Context
${result.indigenousContext}

---

## Harvest Opportunity Matrix
${result.harvestOpportunityMatrix}

---

## Community Sentiment Synthesis
${result.communitySentiment}

---

## Community Personas & Acquisition Strategy
${result.communityPersonas}
`;

  const mdPath = path.join(ANALYSIS_DIR, "community-profile.md");
  await fs.writeFile(mdPath, markdown);
  console.log(`  Saved ${mdPath}`);

  return result;
}

// Run standalone
if (import.meta.url === `file://${process.argv[1]}`) {
  runAnalysis().catch(console.error);
}
