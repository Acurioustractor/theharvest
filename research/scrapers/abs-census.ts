/**
 * ABS Census 2021 Scraper — POA 4552 (Maleny / Witta area)
 *
 * Fetches key Census datasets from the ABS SDMX Data API
 * for Postal Area 4552 and compiles them into a single JSON file.
 */

import path from "path";
import { cachedGet, saveData, logSection } from "./utils.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SDMXDimension {
  id: string;
  name: string;
  keyPosition?: number;
  values: Array<{ id: string; name: string }>;
}

interface SDMXObservation {
  [key: string]: [number | null, ...unknown[]] | undefined;
}

interface SDMXDataSet {
  observations?: SDMXObservation;
}

interface SDMXStructure {
  dimensions?: {
    observation?: SDMXDimension[];
  };
}

interface SDMXDataResponse {
  data: {
    dataSets?: SDMXDataSet[];
    structures?: SDMXStructure[];
  };
  // Legacy location (SDMX-JSON 1.x)
  structure?: SDMXStructure;
}

interface DatasetConfig {
  key: string;
  label: string;
  dataflowId: string;
  filter: string;
}

interface ParsedRecord {
  [label: string]: number | null;
}

interface CensusData {
  region: string;
  censusYear: number;
  fetchedAt: string;
  ageStructure: ParsedRecord | null;
  income: ParsedRecord | null;
  occupation: ParsedRecord | null;
  housingTenure: ParsedRecord | null;
  ancestry: ParsedRecord | null;
  volunteering: ParsedRecord | null;
  language: ParsedRecord | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ABS_API_BASE = "https://data.api.abs.gov.au/rest/data";

// Filter patterns vary by number of dimensions:
// 6-dim (SEXP.PCHAR.REGION.REGION_TYPE.STATE.TIME): ..4552...
// 4-dim (MEASURE.REGION.REGION_TYPE.TIME): .4552..
// 7-dim (SEXP.X.Y.REGION.REGION_TYPE.STATE.TIME): ...4552...
const DATASETS: DatasetConfig[] = [
  {
    key: "ageStructure",
    label: "Selected Person Characteristics by Sex",
    dataflowId: "C21_G01_POA",
    filter: "..4552...",
  },
  {
    key: "income",
    label: "Selected Medians and Averages",
    dataflowId: "C21_G02_POA",
    filter: ".4552..",
  },
  {
    key: "occupation",
    label: "Qualification Field by Occupation by Sex",
    dataflowId: "C21_G51_POA",
    filter: "...4552...",
  },
  {
    key: "housingTenure",
    label: "Housing Tenure Type",
    dataflowId: "C21_G33_POA",
    filter: "..4552...",
  },
  {
    key: "ancestry",
    label: "Ancestry by Country of Birth",
    dataflowId: "C21_G08_POA",
    filter: "..4552...",
  },
  {
    key: "volunteering",
    label: "Long-Term Health Conditions by Age by Sex",
    dataflowId: "C21_G19_POA",
    filter: "...4552...",
  },
  {
    key: "language",
    label: "Language at Home by English Proficiency by Sex",
    dataflowId: "C21_G13_POA",
    filter: "...4552...",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build the ABS SDMX JSON data URL for a given dataflow and filter.
 */
function buildUrl(dataflowId: string, filter: string): string {
  return (
    `${ABS_API_BASE}/ABS,${dataflowId},1.0.0` +
    `/${filter}` +
    `?dimensionAtObservation=AllDimensions&format=jsondata`
  );
}

/**
 * Parse an SDMX jsondata response into a flat key/value record using
 * the dimension labels from the structure metadata.
 */
function parseObservations(response: SDMXDataResponse): ParsedRecord {
  const result: ParsedRecord = {};

  const dataSets = response.data?.dataSets;
  // SDMX-JSON 2.0: dimensions live under data.structures[0]
  // SDMX-JSON 1.x fallback: dimensions under top-level structure
  const dimensions =
    response.data?.structures?.[0]?.dimensions?.observation ??
    response.structure?.dimensions?.observation;

  if (!dataSets?.length || !dimensions?.length) {
    return result;
  }

  const observations = dataSets[0].observations;
  if (!observations) return result;

  for (const [obsKey, obsValue] of Object.entries(observations)) {
    if (!obsValue) continue;

    const indices = obsKey.split(":").map(Number);
    const labelParts: string[] = [];

    for (let i = 0; i < indices.length; i++) {
      const dim = dimensions[i];
      if (!dim) continue;
      const valueEntry = dim.values[indices[i]];
      if (valueEntry) {
        labelParts.push(valueEntry.name);
      }
    }

    const label = labelParts.join(" | ");
    const value = obsValue[0] ?? null;
    result[label] = value;
  }

  return result;
}

/**
 * Fetch a single ABS dataset, returning parsed records or null on failure.
 */
async function fetchDataset(config: DatasetConfig): Promise<ParsedRecord | null> {
  const url = buildUrl(config.dataflowId, config.filter);
  console.log(`\n  Fetching ${config.label} (${config.dataflowId})...`);

  try {
    const response = await cachedGet<SDMXDataResponse>(url, {
      headers: {
        Accept: "application/vnd.sdmx.data+json;version=2.0.0",
      },
    });

    const records = parseObservations(response);
    const count = Object.keys(records).length;
    console.log(`    -> ${count} observations parsed`);
    return count > 0 ? records : null;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : String(err);
    console.error(`    [ERROR] ${config.label}: ${message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function scrapeABSCensus(): Promise<CensusData> {
  logSection("ABS Census Data — POA 4552");

  const results: Record<string, ParsedRecord | null> = {};

  for (const dataset of DATASETS) {
    results[dataset.key] = await fetchDataset(dataset);
  }

  const data: CensusData = {
    region: "POA 4552 (Maleny / Witta)",
    censusYear: 2021,
    fetchedAt: new Date().toISOString(),
    ageStructure: results.ageStructure ?? null,
    income: results.income ?? null,
    occupation: results.occupation ?? null,
    housingTenure: results.housingTenure ?? null,
    ancestry: results.ancestry ?? null,
    volunteering: results.volunteering ?? null,
    language: results.language ?? null,
  };

  const successCount = Object.values(results).filter(Boolean).length;
  console.log(`\n  Summary: ${successCount}/${DATASETS.length} datasets fetched`);

  await saveData("abs-census.json", data);
  return data;
}

// ---------------------------------------------------------------------------
// Standalone execution
// ---------------------------------------------------------------------------

const isMain = import.meta.url === `file://${process.argv[1]}`
  || import.meta.url === `file://${path.resolve(process.argv[1] || "")}`;
if (isMain) {
  scrapeABSCensus().catch(console.error);
}
