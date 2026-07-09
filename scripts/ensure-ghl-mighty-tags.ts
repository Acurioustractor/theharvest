import dotenv from "dotenv";

dotenv.config({ path: ".env.local", override: true, quiet: true });
dotenv.config({ path: ".env", override: false, quiet: true });

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const mightyTags = [
  "platform:mighty-invited",
  "platform:mighty-active",
  "platform:mighty-dormant",
  "pod:garden",
  "pod:shop-makers",
  "pod:events",
  "signal:asked-question",
  "signal:help-offered",
];

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function ghlJson<T>(pathname: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${GHL_API_BASE}${pathname}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${requireEnv("GHL_API_KEY")}`,
      Version: GHL_API_VERSION,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GHL ${response.status} ${pathname}: ${body.slice(0, 300)}`);
  }

  return response.json() as Promise<T>;
}

async function listTagNames(): Promise<Set<string>> {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const data = await ghlJson<{ tags?: Array<{ name?: string }> }>(`/locations/${locationId}/tags`);
  return new Set((data.tags ?? []).map((tag) => tag.name).filter((name): name is string => Boolean(name)));
}

async function createTag(name: string): Promise<void> {
  const locationId = requireEnv("GHL_LOCATION_ID");
  await ghlJson(`/locations/${locationId}/tags`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

async function main(): Promise<void> {
  const apply = process.argv.includes("--apply");
  const existing = await listTagNames();
  const missing = mightyTags.filter((tag) => !existing.has(tag));

  console.log(`GHL Mighty tag check (${apply ? "apply" : "read-only"})`);
  console.log(`Expected: ${mightyTags.length}`);
  console.log(`Present: ${mightyTags.length - missing.length}`);
  console.log(`Missing: ${missing.length}`);

  if (!missing.length) {
    console.log("OK: all Mighty mirror tags exist.");
    return;
  }

  for (const tag of missing) console.log(`- ${tag}`);

  if (!apply) {
    console.log("Run with --apply to create missing tags.");
    process.exitCode = 1;
    return;
  }

  for (const tag of missing) {
    await createTag(tag);
    console.log(`created: ${tag}`);
  }

  console.log("OK: missing Mighty mirror tags created.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
