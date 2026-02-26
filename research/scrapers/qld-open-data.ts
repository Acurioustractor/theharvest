/**
 * Queensland Government Open Data Scraper (CKAN API)
 *
 * Fetches population, heritage, and education datasets from data.qld.gov.au
 * and filters for Maleny/Witta/Sunshine Coast area.
 */

import path from "path";
import { cachedGet, saveData, logSection } from "./utils.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CKANResource {
  id: string;
  name: string;
  description: string;
  format: string;
  url: string;
  size: number | null;
  last_modified: string | null;
}

interface CKANPackage {
  id: string;
  name: string;
  title: string;
  notes: string;
  resources: CKANResource[];
}

interface CKANSearchResponse {
  success: boolean;
  result: {
    count: number;
    results: CKANPackage[];
  };
}

interface CKANDatastoreResponse {
  success: boolean;
  result: {
    records: Record<string, string | number | null>[];
    total: number;
    fields: Array<{ id: string; type: string }>;
  };
}

interface PopulationRecord {
  sa2Name: string;
  year: string | null;
  population: number | null;
  rawFields: Record<string, string | number | null>;
}

interface HeritageRecord {
  name: string | null;
  address: string | null;
  locality: string | null;
  lga: string | null;
  significance: string | null;
  rawFields: Record<string, string | number | null>;
}

interface ScrapedQldData {
  source: string;
  dataset: string;
  fetchedAt: string;
  recordCount: number;
  records: Array<PopulationRecord | HeritageRecord | Record<string, string | number | null>>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CKAN_BASE = "https://www.data.qld.gov.au/api/3/action";

/** SA2 names that cover the Maleny/Witta area and surrounds (lowercase for matching) */
const TARGET_SA2_NAMES = [
  "maleny",
  "witta",
  "north maleny",
  "montville",
  "mapleton",
  "kenilworth",
  "palmwoods",
  "woombye",
  "nambour",
  "eudlo",
  "mooloolah valley", // Include full SA2 names
  "landsborough",
  "beerwah",
  "glass house mountains",
];

/** Localities to filter heritage records */
const TARGET_LOCALITIES = [
  "maleny",
  "witta",
  "north maleny",
  "montville",
  "mapleton",
  "palmwoods",
  "flaxton",
  "reesville",
  "conondale",
  "kenilworth",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Search CKAN for packages matching a query.
 */
async function searchPackages(query: string): Promise<CKANPackage[]> {
  const response = await cachedGet<CKANSearchResponse>(
    `${CKAN_BASE}/package_search`,
    { params: { q: query, rows: 10 } }
  );

  if (!response.success) {
    console.error("    [ERROR] CKAN search failed");
    return [];
  }

  return response.result.results;
}

/**
 * Find a resource in a package by format preference (CSV first, then JSON).
 */
function findBestResource(
  pkg: CKANPackage,
  preferredFormats = ["CSV", "JSON", "XLSX"]
): CKANResource | null {
  for (const format of preferredFormats) {
    const match = pkg.resources.find(
      (r) => r.format.toUpperCase() === format
    );
    if (match) return match;
  }
  // Fall back to first resource
  return pkg.resources[0] ?? null;
}

/**
 * Try to fetch data via the CKAN datastore API (structured access).
 * Returns null if the resource is not in the datastore.
 */
async function fetchDatastore(
  resourceId: string,
  filters?: Record<string, string>,
  limit = 5000
): Promise<Record<string, string | number | null>[] | null> {
  try {
    const params: Record<string, string | number> = {
      resource_id: resourceId,
      limit,
    };
    if (filters) {
      params.filters = JSON.stringify(filters);
    }

    const response = await cachedGet<CKANDatastoreResponse>(
      `${CKAN_BASE}/datastore_search`,
      { params }
    );

    if (!response.success) return null;
    return response.result.records;
  } catch {
    return null;
  }
}

/**
 * Fetch raw CSV data and parse into records.
 * Simple parser -- handles basic CSV without quoted fields containing commas.
 */
function parseCSV(raw: string): Record<string, string>[] {
  const lines = raw.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const records: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const record: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = values[j] ?? "";
    }
    records.push(record);
  }

  return records;
}

/**
 * Check if a string value matches any of the target names (case-insensitive partial match).
 */
function matchesTargetArea(
  value: string | number | null | undefined,
  targets: string[]
): boolean {
  if (value == null) return false;
  const lower = String(value).toLowerCase();
  return targets.some((t) => lower.includes(t));
}

// ---------------------------------------------------------------------------
// Data Source: QGSO Population Estimates
// ---------------------------------------------------------------------------

/**
 * Fetch Estimated Resident Population from the ABS Data API (SDMX REST).
 *
 * SA2 code 316061443 = "Maroochy Hinterland" which covers the Maleny/Witta
 * area. There is no standalone "Maleny" SA2 — the ABS groups it under the
 * broader Maroochy Hinterland statistical area (ASGS 2021 boundaries).
 *
 * Endpoint is public, free, and requires no API key.
 */
const ABS_ERP_URL =
  "https://data.api.abs.gov.au/rest/data/ABS,ABS_ANNUAL_ERP_ASGS2021/ERP.SA2.316061443.A?format=csv";

async function scrapePopulation(): Promise<PopulationRecord[]> {
  console.log("\n  Fetching population estimates from ABS Data API...");
  console.log("    SA2 316061443 — Maroochy Hinterland (covers Maleny/Witta)");

  const rawCSV = await cachedGet<string>(ABS_ERP_URL, {
    responseType: "text" as const,
  });

  if (typeof rawCSV !== "string" || rawCSV.trim().length === 0) {
    console.error("    [SKIP] Empty response from ABS Data API");
    return [];
  }

  const records = parseCSV(rawCSV);
  console.log(`    -> ${records.length} rows from ABS ERP dataset`);

  const results: PopulationRecord[] = [];

  for (const r of records) {
    const year = r["TIME_PERIOD"] ?? null;
    const obsValue = r["OBS_VALUE"] ?? null;
    const population = obsValue ? parseInt(obsValue, 10) : null;

    if (year && population != null && !isNaN(population)) {
      results.push({
        sa2Name: "Maroochy Hinterland",
        year,
        population,
        rawFields: r,
      });
    }
  }

  console.log(`    -> ${results.length} population records extracted`);
  return results;
}

// ---------------------------------------------------------------------------
// Data Source: Queensland Heritage Register
// ---------------------------------------------------------------------------

async function scrapeHeritage(): Promise<HeritageRecord[]> {
  console.log("\n  Searching for Queensland Heritage Register...");

  const packages = await searchPackages("queensland heritage register");
  if (packages.length === 0) {
    console.error("    [SKIP] No heritage register packages found");
    return [];
  }

  console.log(`    Found ${packages.length} packages:`);
  for (const pkg of packages) {
    console.log(`      - ${pkg.title} (${pkg.resources.length} resources)`);
  }

  const results: HeritageRecord[] = [];

  for (const pkg of packages) {
    const resource = findBestResource(pkg, ["CSV", "JSON", "XML"]);
    if (!resource) continue;

    console.log(`    Trying resource: ${resource.name} [${resource.format}]`);

    // Try datastore API first
    const datastoreRecords = await fetchDatastore(resource.id);
    if (datastoreRecords && datastoreRecords.length > 0) {
      console.log(`    -> ${datastoreRecords.length} total records via datastore`);

      const filtered = datastoreRecords.filter((r) => {
        const locality =
          r["Locality"] ?? r["locality"] ?? r["LOCALITY"] ?? r["Town"] ?? "";
        const lga =
          r["LGA"] ?? r["lga"] ?? r["Local Government Area"] ?? "";
        const address = r["Address"] ?? r["address"] ?? r["Street Address"] ?? "";

        return (
          matchesTargetArea(locality, TARGET_LOCALITIES) ||
          matchesTargetArea(lga, ["sunshine coast"]) ||
          matchesTargetArea(address, TARGET_LOCALITIES)
        );
      });

      for (const r of filtered) {
        results.push({
          name: String(r["Place Name"] ?? r["place_name"] ?? r["Name"] ?? "Unknown"),
          address: String(r["Address"] ?? r["address"] ?? r["Street Address"] ?? ""),
          locality: String(r["Locality"] ?? r["locality"] ?? r["Town"] ?? ""),
          lga: String(r["LGA"] ?? r["lga"] ?? r["Local Government Area"] ?? ""),
          significance: String(
            r["Significance"] ?? r["significance"] ?? r["Statement of Significance"] ?? ""
          ),
          rawFields: r,
        });
      }

      if (filtered.length > 0) {
        console.log(`    -> ${filtered.length} heritage records in target area`);
        break;
      }
    }

    // Try raw CSV
    if (resource.format.toUpperCase() === "CSV") {
      try {
        const rawCSV = await cachedGet<string>(resource.url, {
          responseType: "text" as const,
        });

        if (typeof rawCSV === "string") {
          const records = parseCSV(rawCSV);
          console.log(`    -> ${records.length} total CSV rows`);

          const filtered = records.filter((r) => {
            const values = Object.values(r);
            return values.some((v) => matchesTargetArea(v, TARGET_LOCALITIES));
          });

          for (const r of filtered) {
            results.push({
              name: r["Place Name"] ?? r["Name"] ?? null,
              address: r["Address"] ?? r["Street Address"] ?? null,
              locality: r["Locality"] ?? r["Town"] ?? null,
              lga: r["LGA"] ?? r["Local Government Area"] ?? null,
              significance: r["Significance"] ?? null,
              rawFields: r,
            });
          }

          if (filtered.length > 0) {
            console.log(`    -> ${filtered.length} heritage rows in target area`);
            break;
          }
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`    [SKIP] CSV download failed: ${message}`);
      }
    }

    // Try XML for heritage register (known to be XML-only)
    if (resource.format.toUpperCase() === "XML") {
      try {
        console.log(`    -> Downloading XML file (this may take a moment)...`);
        const rawXML = await cachedGet<string>(resource.url, {
          responseType: "text" as const,
        });

        if (typeof rawXML === "string") {
          console.log(`    -> Parsing XML (${(rawXML.length / 1024 / 1024).toFixed(1)} MB)...`);

          // Parse XML heritage places — tags are: <place>, <name>, <suburb>, <street_address>, <lga>, <description>
          const placeMatches = rawXML.matchAll(/<place[^>]*>[\s\S]*?<\/place>/gi);
          let totalPlaces = 0;

          for (const match of placeMatches) {
            totalPlaces++;
            const placeXML = match[0];

            // Extract suburb (XML uses <suburb> not <locality>, values are UPPERCASE)
            const suburbMatch = placeXML.match(/<suburb[^>]*>(.*?)<\/suburb>/i);
            const suburb = suburbMatch ? suburbMatch[1].trim() : "";

            // Check if this place is in our target area
            if (matchesTargetArea(suburb, TARGET_LOCALITIES)) {
              const nameMatch = placeXML.match(/<name[^>]*>(.*?)<\/name>/i);
              const addressMatch = placeXML.match(/<street_address[^>]*>(.*?)<\/street_address>/i);
              const lgaMatch = placeXML.match(/<lga[^>]*>(.*?)<\/lga>/i);
              // Description contains HTML entities, grab first 500 chars
              const descMatch = placeXML.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
              const descText = descMatch ? descMatch[1].replace(/&lt;[^&]*&gt;/g, "").replace(/&amp;#?\w+;/g, "").trim().slice(0, 500) : null;

              results.push({
                name: nameMatch ? nameMatch[1].trim() : null,
                address: addressMatch ? addressMatch[1].trim() : null,
                locality: suburb || null,
                lga: lgaMatch ? lgaMatch[1].trim() : null,
                significance: descText,
                rawFields: {},
              });
            }
          }

          console.log(`    -> Parsed ${totalPlaces} total places from XML`);
          if (results.length > 0) {
            console.log(`    -> ${results.length} heritage places in target area`);
            break;
          }
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`    [SKIP] XML download/parse failed: ${message}`);
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Data Source: School Catchments
// ---------------------------------------------------------------------------

async function scrapeSchools(): Promise<Record<string, string | number | null>[]> {
  console.log("\n  Searching for school catchment data...");

  const packages = await searchPackages("school catchment queensland");
  if (packages.length === 0) {
    // Try broader search
    const broader = await searchPackages("schools queensland location");
    if (broader.length === 0) {
      console.log("    [SKIP] No school datasets found");
      return [];
    }
    packages.push(...broader);
  }

  console.log(`    Found ${packages.length} packages:`);
  for (const pkg of packages.slice(0, 5)) {
    console.log(`      - ${pkg.title}`);
  }

  // Try to find records near our area
  for (const pkg of packages.slice(0, 3)) {
    const resource = findBestResource(pkg);
    if (!resource) continue;

    console.log(`    Trying resource: ${resource.name} [${resource.format}]`);

    const datastoreRecords = await fetchDatastore(resource.id);
    if (datastoreRecords && datastoreRecords.length > 0) {
      const filtered = datastoreRecords.filter((r) => {
        const values = Object.values(r);
        return values.some((v) => matchesTargetArea(v, TARGET_LOCALITIES));
      });

      if (filtered.length > 0) {
        console.log(`    -> ${filtered.length} school records in target area`);
        return filtered;
      }
    }
  }

  console.log("    [SKIP] No school data found for target area");
  return [];
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function scrapeQldOpenData(): Promise<void> {
  logSection("Queensland Government Open Data (CKAN)");

  // 1. Population estimates
  try {
    const population = await scrapePopulation();
    const popData: ScrapedQldData = {
      source: "ABS Data API — Estimated Resident Population",
      dataset: "Annual ERP by SA2 (ASGS 2021), Maroochy Hinterland (316061443)",
      fetchedAt: new Date().toISOString(),
      recordCount: population.length,
      records: population,
    };
    await saveData("qgso-population.json", popData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  [ERROR] Population scrape failed: ${message}`);
  }

  // 2. Heritage register
  try {
    const heritage = await scrapeHeritage();
    const heritageData: ScrapedQldData = {
      source: "Queensland Government Open Data (data.qld.gov.au)",
      dataset: "Queensland Heritage Register",
      fetchedAt: new Date().toISOString(),
      recordCount: heritage.length,
      records: heritage,
    };
    await saveData("qld-heritage.json", heritageData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  [ERROR] Heritage scrape failed: ${message}`);
  }

  // 3. School catchments (best-effort)
  try {
    const schools = await scrapeSchools();
    if (schools.length > 0) {
      const schoolData: ScrapedQldData = {
        source: "Queensland Government Open Data (data.qld.gov.au)",
        dataset: "School Catchments",
        fetchedAt: new Date().toISOString(),
        recordCount: schools.length,
        records: schools,
      };
      await saveData("qld-schools.json", schoolData);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  [ERROR] Schools scrape failed: ${message}`);
  }

  console.log("\n  Queensland open data scrape complete.");
}

// ---------------------------------------------------------------------------
// Standalone execution
// ---------------------------------------------------------------------------

const isMain = import.meta.url === `file://${process.argv[1]}`
  || import.meta.url === `file://${path.resolve(process.argv[1] || "")}`;
if (isMain) {
  scrapeQldOpenData().catch(console.error);
}
