import dotenv from "dotenv";

dotenv.config({ path: ".env.local", override: true, quiet: true });
dotenv.config({ path: ".env", override: false, quiet: true });

type GateStatus = "good" | "watch" | "blocked";

type Gate = {
  id: string;
  status: GateStatus;
  detail: string;
  nextAction: string;
};

type ProbeResult = {
  label: string;
  pathname: string;
  status: number;
  ok: boolean;
  count?: number;
  body?: unknown;
  error?: string;
};

type ProbeOptions = {
  paginate?: boolean;
};

type SpaceSummary = {
  id?: string;
  name: string;
  slug?: string;
  postCount: number;
};

const API_BASE = (process.env.MIGHTY_API_BASE_URL || "https://api.mn.co/admin/v1").replace(/\/$/, "");
const NETWORK_ID = process.env.MIGHTY_NETWORK_ID || "harvest-the-network";
const NETWORK_PATH = `/networks/${encodeURIComponent(NETWORK_ID)}`;

const expectedSpaces = [
  "Start Here",
  "What's On",
  "The Shop Makers",
  "Garden Crew",
  "Questions Wall",
  "Ask a Steward",
];

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function firstString(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function firstId(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return undefined;
}

function itemsFrom(body: unknown): unknown[] {
  if (Array.isArray(body)) return body;

  const record = asRecord(body);
  if (!record) return [];

  for (const key of ["items", "data", "spaces", "members", "posts", "events"]) {
    const value = record[key];
    if (Array.isArray(value)) return value;
  }

  return [];
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function summarizeSpaces(body: unknown, postCountsBySpace: Map<string, number>): SpaceSummary[] {
  return itemsFrom(body)
    .map((item) => {
      const record = asRecord(item);
      if (!record) return undefined;

      const name = firstString(record, ["name", "title", "display_name", "displayName"]);
      if (!name) return undefined;
      const id = firstId(record, ["id", "uid", "space_id", "spaceId"]);

      return {
        id,
        name,
        postCount: id ? postCountsBySpace.get(id) ?? 0 : 0,
        slug: firstString(record, ["slug", "url_slug", "urlSlug", "handle"]),
      };
    })
    .filter((space): space is SpaceSummary => Boolean(space));
}

function duplicateSpaceNames(spaces: SpaceSummary[]): string[] {
  const byName = new Map<string, SpaceSummary[]>();
  for (const space of spaces) {
    const key = normalize(space.name);
    byName.set(key, [...(byName.get(key) ?? []), space]);
  }

  return Array.from(byName.values())
    .filter((group) => group.length > 1)
    .map((group) => {
      const ids = group.map((space) => space.id).filter(Boolean);
      return ids.length ? `${group[0].name} (${ids.join(", ")})` : group[0].name;
    });
}

function duplicateSpaceCleanup(spaces: SpaceSummary[]): string[] {
  const byName = new Map<string, SpaceSummary[]>();
  for (const space of spaces) {
    const key = normalize(space.name);
    byName.set(key, [...(byName.get(key) ?? []), space]);
  }

  return Array.from(byName.values())
    .filter((group) => group.length > 1)
    .map((group) => {
      const keep = [...group].sort((a, b) => b.postCount - a.postCount)[0];
      const remove = group.filter((space) => space !== keep);
      return `keep ${keep.name} [${keep.id ?? "unknown"}] (${keep.postCount} post(s)); remove/hide ${remove
        .map((space) => `[${space.id ?? "unknown"}] (${space.postCount} post(s))`)
        .join(", ")}`;
    });
}

function networkNameFrom(body: unknown): string | undefined {
  const record = asRecord(body);
  const network = asRecord(record?.network);
  return network
    ? firstString(network, ["name", "title", "display_name", "displayName"])
    : firstString(record ?? {}, ["network_name", "networkName"]);
}

async function mightyJson(pathname: string): Promise<{ status: number; body: unknown }> {
  const token = requireEnv("MIGHTY_API_TOKEN");
  if (!API_BASE.startsWith("https://")) {
    throw new Error("MIGHTY_API_BASE_URL must use https");
  }

  const response = await fetch(`${API_BASE}${pathname}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "harvest-website/1.0",
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message = typeof body === "object" && body ? JSON.stringify(body).slice(0, 300) : text.slice(0, 300);
    throw new Error(`Mighty ${response.status} ${pathname}: ${message}`);
  }

  return { status: response.status, body };
}

async function mightyJsonPaginated(pathname: string): Promise<{ status: number; body: { items: unknown[] } }> {
  const token = requireEnv("MIGHTY_API_TOKEN");
  if (!API_BASE.startsWith("https://")) {
    throw new Error("MIGHTY_API_BASE_URL must use https");
  }

  const items: unknown[] = [];
  let status = 0;
  let url: string | null = `${API_BASE}${pathname}`;

  while (url) {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "harvest-website/1.0",
      },
    });

    status = response.status;
    const text = await response.text();
    const body = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const message = typeof body === "object" && body ? JSON.stringify(body).slice(0, 300) : text.slice(0, 300);
      throw new Error(`Mighty ${response.status} ${pathname}: ${message}`);
    }

    const pageItems = itemsFrom(body);
    items.push(...pageItems);
    const links = asRecord(body)?.links;
    const next = asRecord(links)?.next;
    url = pageItems.length > 0 && typeof next === "string" && next.trim()
      ? new URL(next, API_BASE).toString()
      : null;
  }

  return { status, body: { items } };
}

async function probe(label: string, pathname: string, options: ProbeOptions = {}): Promise<ProbeResult> {
  try {
    const { status, body } = options.paginate
      ? await mightyJsonPaginated(pathname)
      : await mightyJson(pathname);
    return {
      label,
      pathname,
      status,
      ok: true,
      count: itemsFrom(body).length,
      body,
    };
  } catch (error) {
    return {
      label,
      pathname,
      status: 0,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function gateLine(gate: Gate): string {
  return `[${gate.status}] ${gate.id}: ${gate.detail} Next: ${gate.nextAction}`;
}

async function main(): Promise<void> {
  const probes = [
    await probe("me", `${NETWORK_PATH}/me`),
    await probe("spaces", `${NETWORK_PATH}/spaces?per_page=100`, { paginate: true }),
    await probe("members", `${NETWORK_PATH}/members?per_page=100`, { paginate: true }),
    await probe("posts", `${NETWORK_PATH}/posts?per_page=100`, { paginate: true }),
    await probe("events", `${NETWORK_PATH}/events?per_page=100`, { paginate: true }),
  ];

  const byLabel = new Map(probes.map((item) => [item.label, item]));
  const me = byLabel.get("me");
  const spaces = byLabel.get("spaces");
  const members = byLabel.get("members");
  const posts = byLabel.get("posts");
  const events = byLabel.get("events");
  const postCountsBySpace = new Map<string, number>();
  for (const item of itemsFrom(posts?.body)) {
    const record = asRecord(item);
    const spaceId = record ? firstId(record, ["space_id", "spaceId", "space", "space_uid"]) : undefined;
    if (spaceId) postCountsBySpace.set(spaceId, (postCountsBySpace.get(spaceId) ?? 0) + 1);
  }
  const spaceSummaries = summarizeSpaces(spaces?.body, postCountsBySpace);
  const spaceNames = spaceSummaries.map((space) => space.name);
  const missingSpaces = expectedSpaces.filter(
    (expected) => !spaceNames.some((actual) => normalize(actual) === normalize(expected)),
  );
  const duplicates = duplicateSpaceNames(spaceSummaries);
  const cleanup = duplicateSpaceCleanup(spaceSummaries);
  const eventsArchive = spaceNames.find((name) => normalize(name).includes("events archive"));

  const gates: Gate[] = [
    {
      id: "api-auth",
      status: me?.ok ? "good" : "blocked",
      detail: me?.ok ? `Authenticated against ${NETWORK_ID}.` : me?.error ?? "Authentication check failed.",
      nextAction: me?.ok ? "Keep the token in env only; do not paste it into docs or client code." : "Check MIGHTY_API_TOKEN and MIGHTY_NETWORK_ID.",
    },
    {
      id: "core-spaces",
      status: !spaces?.ok ? "blocked" : missingSpaces.length ? "watch" : "good",
      detail: !spaces?.ok
        ? spaces?.error ?? "Could not read spaces."
        : missingSpaces.length
          ? `Missing or renamed expected spaces: ${missingSpaces.join(", ")}.`
          : "Expected first-round spaces are present.",
      nextAction: missingSpaces.length
        ? "Confirm those spaces in Mighty before sending first invites."
        : "Keep Start Here first, then What's On, Shop Makers, Garden Crew, Questions Wall, Ask a Steward.",
    },
    {
      id: "duplicate-spaces",
      status: duplicates.length ? "watch" : "good",
      detail: duplicates.length
        ? `Duplicate space names detected: ${duplicates.join("; ")}. Suggested cleanup: ${cleanup.join("; ")}.`
        : "No duplicate space names detected.",
      nextAction: duplicates.length
        ? "Open both spaces in Mighty and delete or hide the accidental duplicate before first invites."
        : "Keep one clear space for each job.",
    },
    {
      id: "duplicate-events",
      status: eventsArchive ? "watch" : "good",
      detail: eventsArchive ? `${eventsArchive} still exists.` : "No Events Archive duplicate detected by name.",
      nextAction: eventsArchive
        ? "Delete it if empty, or hide it from the sidebar before first member invites."
        : "Use What's On as the single event calendar.",
    },
    {
      id: "member-count",
      status: !members?.ok ? "blocked" : (members.count ?? 0) <= 1 ? "watch" : "good",
      detail: !members?.ok
        ? members?.error ?? "Could not read members."
        : `${members.count ?? 0} member record(s) visible to the API.`,
      nextAction: (members?.count ?? 0) <= 1
        ? "Good for setup. Invite the first 10-15 people only after Start Here and the first crew posts are live."
        : "Watch early member behavior before automating broad GHL invites.",
    },
    {
      id: "first-content",
      status: !posts?.ok ? "blocked" : (posts.count ?? 0) === 0 ? "watch" : "good",
      detail: !posts?.ok
        ? posts?.error ?? "Could not read posts."
        : `${posts.count ?? 0} post/article record(s) visible to the API.`,
      nextAction: (posts?.count ?? 0) === 0
        ? "Add Start Here, Questions Wall opener, and Garden Crew first post before invite links go out."
        : "Pin the first practical posts in the right spaces.",
    },
    {
      id: "mighty-events",
      status: !events?.ok ? "blocked" : (events.count ?? 0) === 0 ? "watch" : "good",
      detail: !events?.ok
        ? events?.error ?? "Could not read events."
        : `${events.count ?? 0} event record(s) visible to the API.`,
      nextAction: (events?.count ?? 0) === 0
        ? "Either create the June 20 event in What's On or deliberately keep GHL as the RSVP source of truth."
        : "Keep Mighty event posts aligned with the GHL RSVP capture.",
    },
    {
      id: "script-safety",
      status: "good",
      detail: "This script only makes GET requests and does not create, edit, invite, tag, or delete records.",
      nextAction: "Use this as the pre-invite check before building any write-back automation.",
    },
  ];

  console.log("Mighty API read-only report");
  console.log(`Network ID: ${NETWORK_ID}`);
  const networkName = networkNameFrom(me?.body);
  if (networkName) console.log(`Network: ${networkName}`);
  console.log("");

  for (const result of probes) {
    if (result.ok) {
      console.log(`${result.label}: ${result.status} (${result.count ?? 0} item(s))`);
    } else {
      console.log(`${result.label}: failed (${result.error})`);
    }
  }

  if (spaceSummaries.length) {
    console.log("");
    console.log("Spaces:");
    for (const space of spaceSummaries) {
      const slug = space.slug ? ` (${space.slug})` : "";
      const id = space.id ? ` [${space.id}]` : "";
      console.log(`- ${space.name}${id}${slug} - ${space.postCount} post(s)`);
    }
  }

  console.log("");
  console.log("Gates:");
  for (const gate of gates) console.log(gateLine(gate));

  if (gates.some((gate) => gate.status === "blocked")) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
