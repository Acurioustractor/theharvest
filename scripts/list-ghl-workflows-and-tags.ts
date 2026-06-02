import "dotenv/config";

// Read-only audit: list all GHL workflows (status) + the location tag library.
// GHL exposes workflow status + the tag library via API, but NOT a workflow's
// internal steps/actions (those are UI-only). Use this to ground tag/workflow
// alignment in live state rather than stale docs.

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value.trim();
}

async function ghlJson<T>(pathname: string): Promise<T> {
  const response = await fetch(`${GHL_API_BASE}${pathname}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${requireEnv("GHL_API_KEY")}`,
      Version: VERSION,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GHL ${response.status} on ${pathname}: ${body.slice(0, 300)}`);
  }
  return response.json() as Promise<T>;
}

async function main() {
  const locationId = requireEnv("GHL_LOCATION_ID");

  // Workflows
  const wf = await ghlJson<{ workflows?: Array<{ id: string; name?: string; status?: string; version?: number }> }>(
    `/workflows/?locationId=${locationId}`,
  );
  const workflows = (wf.workflows ?? []).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  console.log(`\n=== WORKFLOWS (${workflows.length}) ===`);
  for (const w of workflows) {
    console.log(`${(w.status || "?").padEnd(10)} | ${w.id} | v${w.version ?? "?"} | ${w.name || "(no name)"}`);
  }

  // Tag library
  try {
    const tg = await ghlJson<{ tags?: Array<{ id: string; name?: string }> }>(`/locations/${locationId}/tags`);
    const tags = (tg.tags ?? []).map((t) => t.name || "").filter(Boolean).sort();
    console.log(`\n=== TAG LIBRARY (${tags.length}) ===`);
    // group by prefix for readability
    const groups: Record<string, string[]> = {};
    for (const name of tags) {
      const prefix = name.includes(":") ? name.split(":")[0] + ":" : (name.split("-")[0] || "other");
      (groups[prefix] ||= []).push(name);
    }
    for (const prefix of Object.keys(groups).sort()) {
      console.log(`\n[${prefix}] (${groups[prefix].length})`);
      console.log("  " + groups[prefix].join(", "));
    }
  } catch (err) {
    console.log(`\n=== TAG LIBRARY ===\nCould not fetch tags: ${(err as Error).message}`);
  }
}

main().catch((error) => {
  console.error("FAILED:", (error as Error).message);
  process.exit(1);
});
