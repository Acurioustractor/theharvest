/**
 * Sunshine Coast Council Open Data Scraper
 *
 * Fetches community infrastructure data from SCC ArcGIS REST services,
 * filtered to the Witta/Maleny area (~15km radius).
 */

import path from "path";
import { cachedGet, saveData, logSection } from "./utils.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ArcGISGeometry {
  x: number;
  y: number;
  spatialReference?: { wkid: number };
}

interface ArcGISAttributes {
  [key: string]: string | number | null | undefined;
}

interface ArcGISFeature {
  attributes: ArcGISAttributes;
  geometry?: ArcGISGeometry;
}

interface ArcGISResponse {
  features?: ArcGISFeature[];
  error?: {
    code: number;
    message: string;
    details?: string[];
  };
}

interface LayerConfig {
  key: string;
  label: string;
  url: string;
  outputFile: string;
  /** Merge into another output group (e.g. planning) */
  mergeGroup?: string;
  /** Override spatial params for this layer (e.g. different projection) */
  spatialParams?: Record<string, string>;
}

interface ScrapedFeature {
  name: string | null;
  type: string | null;
  address: string | null;
  suburb: string | null;
  latitude: number | null;
  longitude: number | null;
  attributes: ArcGISAttributes;
}

interface ScrapedDataset {
  source: string;
  layer: string;
  fetchedAt: string;
  featureCount: number;
  features: ScrapedFeature[];
}

// ---------------------------------------------------------------------------
// Server base URLs (discovered Feb 2026)
// ---------------------------------------------------------------------------

/** SCC internal GIS server — ArcGIS 11.3, no auth, supports GeoJSON */
const SCC_GEOPUBLIC = "https://geopublic.scc.qld.gov.au/arcgis/rest/services";

/** SCC datasets hosted on ArcGIS Online (AGOL) */
const SCC_AGOL = "https://services-ap1.arcgis.com/YQyt7djuXN7rQyg4/arcgis/rest/services";

// ---------------------------------------------------------------------------
// Spatial envelopes for Witta/Maleny area (~15km radius)
// ---------------------------------------------------------------------------

/** Web Mercator (EPSG:102100) bbox — for geopublic.scc.qld.gov.au layers */
const BBOX_MERCATOR = {
  geometryType: "esriGeometryEnvelope",
  geometry: JSON.stringify({ xmin: 16980000, ymin: -3130000, xmax: 17060000, ymax: -3060000 }),
  inSR: "102100",
  spatialRel: "esriSpatialRelIntersects",
};

/** WGS84 (EPSG:4326) bbox — for ArcGIS Online feature services */
const BBOX_WGS84 = {
  geometryType: "esriGeometryEnvelope",
  geometry: "152.7,-26.85,152.95,-26.65",
  inSR: "4326",
  spatialRel: "esriSpatialRelIntersects",
};

/** Default spatial params (WGS84) */
const SPATIAL_PARAMS = BBOX_WGS84;

// ---------------------------------------------------------------------------
// Layer configurations — working endpoints
// ---------------------------------------------------------------------------

const LAYERS: LayerConfig[] = [
  {
    key: "venues",
    label: "Community Centres",
    url: `${SCC_GEOPUBLIC}/Society/Society_SCRC/MapServer/12/query`,
    outputFile: "scc-venues.json",
    spatialParams: BBOX_MERCATOR,
  },
  {
    key: "heritage",
    label: "Heritage Places",
    url: `${SCC_AGOL}/Heritage_and_Character_Areas_Overlay/FeatureServer/0/query`,
    outputFile: "scc-heritage.json",
    spatialParams: BBOX_MERCATOR,
  },
  {
    key: "planning",
    label: "Planning Zones",
    url: `${SCC_AGOL}/PlanningScheme_Zoning_SCC/FeatureServer/5/query`,
    outputFile: "scc-planning.json",
    spatialParams: BBOX_MERCATOR,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract common fields from ArcGIS attributes into a normalized shape.
 * SCC layers use varying field names, so we check several possibilities.
 */
function normalizeFeature(feature: ArcGISFeature): ScrapedFeature {
  const a = feature.attributes;
  const g = feature.geometry;

  const name =
    getString(a, "NAME") ??
    getString(a, "FACILITY_NAME") ??
    getString(a, "PARK_NAME") ??
    getString(a, "PLACE_NAME") ??
    getString(a, "SITE_NAME") ??
    null;

  const type =
    getString(a, "TYPE") ??
    getString(a, "FACILITY_TYPE") ??
    getString(a, "CATEGORY") ??
    getString(a, "CLASS") ??
    null;

  const address =
    getString(a, "ADDRESS") ??
    getString(a, "STREET_ADDRESS") ??
    getString(a, "FULL_ADDRESS") ??
    null;

  const suburb =
    getString(a, "SUBURB") ??
    getString(a, "LOCALITY") ??
    null;

  return {
    name,
    type,
    address,
    suburb,
    latitude: g?.y ?? null,
    longitude: g?.x ?? null,
    attributes: a,
  };
}

function getString(
  attrs: ArcGISAttributes,
  key: string
): string | null {
  // Try exact key, then lowercase, then uppercase
  const val = attrs[key] ?? attrs[key.toLowerCase()] ?? attrs[key.toUpperCase()];
  if (val == null) return null;
  const s = String(val).trim();
  return s.length > 0 ? s : null;
}

/**
 * Query a single ArcGIS feature layer with spatial filtering.
 */
async function queryLayer(config: LayerConfig): Promise<ScrapedFeature[]> {
  console.log(`\n  Fetching ${config.label}...`);

  try {
    const spatialParams = config.spatialParams ?? SPATIAL_PARAMS;
    const response = await cachedGet<ArcGISResponse>(config.url, {
      params: {
        where: "1=1",
        outFields: "*",
        f: "json",
        resultRecordCount: 200,
        outSR: 4326,
        ...spatialParams,
      },
    });

    if (response.error) {
      console.error(
        `    [ERROR] ArcGIS error ${response.error.code}: ${response.error.message}`
      );
      return [];
    }

    const features = response.features ?? [];
    const normalized = features.map(normalizeFeature);
    console.log(`    -> ${normalized.length} features found`);
    return normalized;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`    [SKIP] ${config.label}: ${message}`);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function scrapeSunshineCoast(): Promise<void> {
  logSection("Sunshine Coast Council Open Data");

  const groupedResults: Record<string, ScrapedFeature[]> = {};
  const standaloneResults: Map<string, { config: LayerConfig; features: ScrapedFeature[] }> =
    new Map();

  for (const layer of LAYERS) {
    const features = await queryLayer(layer);

    if (layer.mergeGroup) {
      if (!groupedResults[layer.mergeGroup]) {
        groupedResults[layer.mergeGroup] = [];
      }
      // Tag features with source layer for later identification
      for (const f of features) {
        f.attributes._sourceLayer = layer.key;
      }
      groupedResults[layer.mergeGroup].push(...features);
    } else {
      standaloneResults.set(layer.key, { config: layer, features });
    }
  }

  // Save standalone datasets
  for (const [, { config, features }] of standaloneResults) {
    const dataset: ScrapedDataset = {
      source: "Sunshine Coast Council ArcGIS",
      layer: config.label,
      fetchedAt: new Date().toISOString(),
      featureCount: features.length,
      features,
    };
    await saveData(config.outputFile, dataset);
  }

  // Save merged groups
  for (const [group, features] of Object.entries(groupedResults)) {
    const outputFile =
      LAYERS.find((l) => l.mergeGroup === group)?.outputFile ?? `scc-${group}.json`;

    const dataset: ScrapedDataset = {
      source: "Sunshine Coast Council ArcGIS",
      layer: `${group} (merged)`,
      fetchedAt: new Date().toISOString(),
      featureCount: features.length,
      features,
    };
    await saveData(outputFile, dataset);
  }

  // Summary
  const totalStandalone = [...standaloneResults.values()].reduce(
    (sum, r) => sum + r.features.length,
    0
  );
  const totalGrouped = Object.values(groupedResults).reduce(
    (sum, f) => sum + f.length,
    0
  );
  console.log(
    `\n  Summary: ${totalStandalone + totalGrouped} total features across ${LAYERS.length} layers`
  );
}

// ---------------------------------------------------------------------------
// Standalone execution
// ---------------------------------------------------------------------------

const isMain = import.meta.url === `file://${process.argv[1]}`
  || import.meta.url === `file://${path.resolve(process.argv[1] || "")}`;
if (isMain) {
  scrapeSunshineCoast().catch(console.error);
}
