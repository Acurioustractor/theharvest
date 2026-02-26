/**
 * Atlas of Living Australia (ALA) Biodiversity Scraper — Witta area
 *
 * Fetches species occurrence records, threatened species, species group
 * summaries, and notable/iconic species within ~10km of Witta.
 */

import path from "path";
import { cachedGet, saveData, logSection } from "./utils.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ALAFacetField {
  fieldName: string;
  fieldResult: Array<{
    label: string;
    count: number;
    fq?: string;
  }>;
}

interface ALASearchResponse {
  totalRecords: number;
  facetResults?: ALAFacetField[];
  occurrences?: Array<Record<string, unknown>>;
}

interface SpeciesGroup {
  group: string;
  count: number;
}

interface ThreatenedSpecies {
  name: string;
  conservationStatus: string;
  recordCount: number;
}

interface NotableSpecies {
  commonName: string;
  scientificName: string;
  recordCount: number;
  notes: string;
}

interface ALABiodiversityData {
  region: string;
  coordinates: { lat: number; lon: number; radiusKm: number };
  fetchedAt: string;
  totalRecords: number;
  speciesGroups: SpeciesGroup[];
  threatenedSpecies: ThreatenedSpecies[];
  notableSpecies: NotableSpecies[];
  summary: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ALA_BASE = "https://biocache-ws.ala.org.au/ws/occurrences/search";

const WITTA_LAT = -26.75;
const WITTA_LON = 152.85;
const SEARCH_RADIUS_KM = 10;

const NOTABLE_SPECIES_LIST = [
  {
    commonName: "Platypus",
    scientificName: "Ornithorhynchus anatinus",
    notes: "Iconic monotreme found in local creeks including Obi Obi Creek",
  },
  {
    commonName: "Koala",
    scientificName: "Phascolarctos cinereus",
    notes: "Vulnerable species; hinterland eucalypt habitat is critical",
  },
  {
    commonName: "Glossy Black-Cockatoo",
    scientificName: "Calyptorhynchus lathami",
    notes: "Relies on she-oak (Allocasuarina) forests in the hinterland",
  },
  {
    commonName: "Richmond Birdwing Butterfly",
    scientificName: "Ornithoptera richmondia",
    notes: "Vulnerable species; subtropical rainforest specialist",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractFacet(
  response: ALASearchResponse,
  fieldName: string
): Array<{ label: string; count: number }> {
  const facet = response.facetResults?.find(
    (f) => f.fieldName === fieldName
  );
  if (!facet) return [];
  return facet.fieldResult.map((r) => ({ label: r.label, count: r.count }));
}

// ---------------------------------------------------------------------------
// Data fetchers
// ---------------------------------------------------------------------------

async function fetchSpeciesGroups(): Promise<{
  totalRecords: number;
  groups: SpeciesGroup[];
}> {
  console.log("  Fetching species group summary...");

  try {
    const response = await cachedGet<ALASearchResponse>(ALA_BASE, {
      params: {
        q: "*:*",
        lat: WITTA_LAT,
        lon: WITTA_LON,
        radius: SEARCH_RADIUS_KM,
        facets: "species_group",
        pageSize: 0,
        flimit: 50,
      },
    });

    const facetResults = extractFacet(response, "species_group");
    const groups = facetResults.map((r) => ({
      group: r.label,
      count: r.count,
    }));

    console.log(
      `    -> ${response.totalRecords} total records, ${groups.length} species groups`
    );

    return { totalRecords: response.totalRecords, groups };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`    [ERROR] Species groups: ${message}`);
    return { totalRecords: 0, groups: [] };
  }
}

async function fetchThreatenedSpecies(): Promise<ThreatenedSpecies[]> {
  console.log("  Fetching threatened species...");

  try {
    // First, get all species with state conservation status
    const response = await cachedGet<ALASearchResponse>(ALA_BASE, {
      params: {
        q: "*:*",
        lat: WITTA_LAT,
        lon: WITTA_LON,
        radius: SEARCH_RADIUS_KM,
        fq: "state_conservation:[* TO *]",
        facets: "raw_scientificName",
        pageSize: 0,
        flimit: 100,
        fsort: "count",
      },
    });

    const speciesResults = extractFacet(response, "raw_scientificName");

    console.log(
      `    -> Found ${speciesResults.length} threatened species, fetching individual statuses...`
    );

    // Fetch conservation status for each species
    const threatened: ThreatenedSpecies[] = [];

    for (const speciesResult of speciesResults) {
      try {
        const statusResponse = await cachedGet<ALASearchResponse>(ALA_BASE, {
          params: {
            q: "*:*",
            lat: WITTA_LAT,
            lon: WITTA_LON,
            radius: SEARCH_RADIUS_KM,
            fq: [
              "state_conservation:[* TO *]",
              `raw_scientificName:"${speciesResult.label}"`,
            ],
            facets: "state_conservation",
            pageSize: 0,
            flimit: 10,
          },
        });

        const statusFacets = extractFacet(statusResponse, "state_conservation");

        // Most species have one status, but some might have multiple
        const conservationStatus =
          statusFacets.length > 0
            ? statusFacets.map((s) => s.label).join(", ")
            : "Listed";

        threatened.push({
          name: speciesResult.label,
          conservationStatus,
          recordCount: speciesResult.count,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`    [WARN] Could not fetch status for ${speciesResult.label}: ${message}`);

        // Still include the species with generic status
        threatened.push({
          name: speciesResult.label,
          conservationStatus: "Listed",
          recordCount: speciesResult.count,
        });
      }
    }

    console.log(`    -> ${threatened.length} threatened species with status retrieved`);
    return threatened;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`    [ERROR] Threatened species: ${message}`);
    return [];
  }
}

async function fetchNotableSpecies(): Promise<NotableSpecies[]> {
  console.log("  Fetching notable/iconic species...");

  const results: NotableSpecies[] = [];

  for (const species of NOTABLE_SPECIES_LIST) {
    try {
      const response = await cachedGet<ALASearchResponse>(ALA_BASE, {
        params: {
          q: `taxon_name:"${species.scientificName}"`,
          lat: WITTA_LAT,
          lon: WITTA_LON,
          radius: 15,
          pageSize: 0,
        },
      });

      results.push({
        commonName: species.commonName,
        scientificName: species.scientificName,
        recordCount: response.totalRecords,
        notes: species.notes,
      });

      console.log(
        `    -> ${species.commonName}: ${response.totalRecords} records`
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`    [ERROR] ${species.commonName}: ${message}`);

      results.push({
        commonName: species.commonName,
        scientificName: species.scientificName,
        recordCount: 0,
        notes: `${species.notes} (fetch error: ${message})`,
      });
    }
  }

  return results;
}

function buildSummary(data: Omit<ALABiodiversityData, "summary">): string {
  const topGroups = data.speciesGroups
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((g) => `${g.group} (${g.count.toLocaleString()} records)`)
    .join(", ");

  const notablePresent = data.notableSpecies
    .filter((s) => s.recordCount > 0)
    .map((s) => s.commonName)
    .join(", ");

  const lines = [
    `The area within ${data.coordinates.radiusKm}km of Witta has ${data.totalRecords.toLocaleString()} biodiversity occurrence records in the Atlas of Living Australia.`,
    topGroups
      ? `Top species groups: ${topGroups}.`
      : "No species group data available.",
    data.threatenedSpecies.length > 0
      ? `${data.threatenedSpecies.length} threatened or conservation-listed species have been recorded.`
      : "No threatened species data retrieved.",
    notablePresent
      ? `Notable species confirmed in the area: ${notablePresent}.`
      : "No records found for targeted notable species.",
  ];

  return lines.join(" ");
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function scrapeALABiodiversity(): Promise<ALABiodiversityData> {
  logSection("Atlas of Living Australia — Witta Biodiversity");

  const { totalRecords, groups } = await fetchSpeciesGroups();
  const threatenedSpecies = await fetchThreatenedSpecies();
  const notableSpecies = await fetchNotableSpecies();

  const partialData = {
    region: "Witta, Sunshine Coast Hinterland",
    coordinates: {
      lat: WITTA_LAT,
      lon: WITTA_LON,
      radiusKm: SEARCH_RADIUS_KM,
    },
    fetchedAt: new Date().toISOString(),
    totalRecords,
    speciesGroups: groups,
    threatenedSpecies,
    notableSpecies,
  };

  const data: ALABiodiversityData = {
    ...partialData,
    summary: buildSummary(partialData),
  };

  console.log(`\n  Summary: ${data.summary}`);

  await saveData("ala-species.json", data);
  return data;
}

// ---------------------------------------------------------------------------
// Standalone execution
// ---------------------------------------------------------------------------

const isMain = import.meta.url === `file://${process.argv[1]}`
  || import.meta.url === `file://${path.resolve(process.argv[1] || "")}`;
if (isMain) {
  scrapeALABiodiversity().catch(console.error);
}
