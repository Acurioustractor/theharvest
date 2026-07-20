import dotenv from "dotenv";

dotenv.config({ path: ".env.local", override: true, quiet: true });
dotenv.config({ path: ".env", override: false, quiet: true });

const API_BASE = (process.env.MIGHTY_API_BASE_URL || "https://api.mn.co/admin/v1").replace(/\/$/, "");
const NETWORK_ID = process.env.MIGHTY_NETWORK_ID || "harvest-the-network";
const NETWORK_PATH = `/networks/${encodeURIComponent(NETWORK_ID)}`;

type MightySpace = {
  id: number;
  name: string;
};

type MightyPost = {
  id: number;
  space_id?: number;
  title?: string | null;
};

type SeedPost = {
  spaceName: string;
  title: string;
  description: string;
  manualOnly?: boolean;
  manualReason?: string;
};

const seedPosts: SeedPost[] = [
  {
    spaceName: "Start Here",
    title: "Start here: how this room works",
    manualOnly: true,
    manualReason: "Start Here is Page-only in Mighty; edit the Page in the UI.",
    description: [
      "Good to have you in here.",
      "",
      "This is the quiet inside room for The Harvest. It is not another newsletter and it is not a place to perform. It is where we keep the practical things close: what is happening, what needs hands, what makers need to know, and the questions that should not get lost in text messages.",
      "",
      "For now, do three things:",
      "",
      "1. Read this first.",
      "2. Reply with one line: what are you here to help grow, make, or gather?",
      "3. Ask practical questions in Questions Wall, not in private messages unless it is sensitive.",
      "",
      "GHL holds the member record and emails. Mighty holds the room. If something here creates a real next step, we record it back in GHL during the Monday sweep.",
      "",
      "Keep it plain. Keep it useful. Bring the thing you can actually carry.",
    ].join("\n"),
  },
  {
    spaceName: "Questions Wall",
    title: "Ask the practical thing here",
    description: [
      "Use this wall for the questions that help other people too.",
      "",
      "Good questions:",
      "",
      "- What time should I come?",
      "- What should I bring?",
      "- Who do I talk to about the shop shelf?",
      "- Can I run a workshop?",
      "- Where should garden photos go?",
      "- What needs hands this week?",
      "",
      "If the question is personal, sensitive, or about someone else, use Ask a Steward instead.",
      "",
      "If a question gets asked twice, we will turn the answer into a pinned note so the room gets easier to use over time.",
    ].join("\n"),
  },
  {
    spaceName: "The Shop Makers",
    title: "What are you making, growing, preserving, baking, or carrying?",
    description: [
      "This room is for people who might belong near the shared shelf.",
      "",
      "No pressure to have it all sorted. Start with a simple reply:",
      "",
      "- what you make, grow, preserve, bake, repair, or carry",
      "- roughly where you are based",
      "- whether you are ready now, soon, or just curious",
      "- one question you have about the shelf",
      "",
      "GHL is still the shop pipeline. Square will be the till. This room is for practical maker questions, sample days, shelf notes, labels, consignment questions, and what we need to learn before the shop becomes too formal.",
    ].join("\n"),
  },
  {
    spaceName: "Garden Crew",
    title: "What needs hands this week",
    description: [
      "This is where garden jobs, tools, photos, and work-day notes live.",
      "",
      "For this first round, reply with one thing you could help with:",
      "",
      "- clearing",
      "- planting",
      "- compost",
      "- signs",
      "- watering",
      "- kids area",
      "- tools",
      "- photos",
      "- food for people working",
      "",
      "Ten minutes counts. One bucket counts. One useful photo counts.",
      "",
      "If you are taking photos on site, check before posting anything with faces or kids in it.",
    ].join("\n"),
  },
  {
    spaceName: "What's On",
    title: "June 20: come through the gate",
    manualOnly: true,
    manualReason: "What's On is Events-only in Mighty; create this as an Event/Page in the UI.",
    description: [
      "Saturday 20 June is the first simple public gathering.",
      "",
      "It starts around 1pm after the Witta Market rhythm. We will make things together, pick from the garden where we can, make pizzas, and finish early in the afternoon.",
      "",
      "RSVP stays on the Harvest website so GHL can hold the headcount and receipts:",
      "",
      "https://www.theharvestwitta.com.au/june-20",
      "",
      "This Mighty room is for the inside layer after that: who wants to help, what questions are coming up, what the shop makers need, and what the garden needs next.",
    ].join("\n"),
  },
];

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function mightyJson<T>(pathname: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE.startsWith("https://")) {
    throw new Error("MIGHTY_API_BASE_URL must use https");
  }

  const response = await fetch(`${API_BASE}${pathname}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${requireEnv("MIGHTY_API_TOKEN")}`,
      "Content-Type": "application/json",
      "User-Agent": "harvest-website/1.0",
      ...init.headers,
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`Mighty ${response.status} ${pathname}: ${JSON.stringify(body).slice(0, 300)}`);
  }

  return body as T;
}

function itemsFrom<T>(body: unknown): T[] {
  if (Array.isArray(body)) return body as T[];
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    for (const key of ["items", "data", "spaces", "posts"]) {
      const value = record[key];
      if (Array.isArray(value)) return value as T[];
    }
  }
  return [];
}

async function main(): Promise<void> {
  const apply = process.argv.includes("--apply");
  const spaces = itemsFrom<MightySpace>(await mightyJson(`${NETWORK_PATH}/spaces`));
  const posts = itemsFrom<MightyPost>(await mightyJson(`${NETWORK_PATH}/posts`));

  const spacesByName = new Map<string, MightySpace[]>();
  for (const space of spaces) {
    spacesByName.set(space.name, [...(spacesByName.get(space.name) ?? []), space]);
  }

  console.log(`Mighty member-system seed (${apply ? "apply" : "read-only"})`);

  for (const seed of seedPosts) {
    const matchingSpaces = spacesByName.get(seed.spaceName) ?? [];
    if (!matchingSpaces.length) {
      console.log(`blocked: missing space "${seed.spaceName}"`);
      process.exitCode = 1;
      continue;
    }

    const space = matchingSpaces.sort((a, b) => a.id - b.id)[0];
    const exists = posts.some((post) => post.space_id === space.id && post.title === seed.title);

    if (exists) {
      console.log(`exists: ${seed.spaceName} -> ${seed.title}`);
      continue;
    }

    if (seed.manualOnly) {
      console.log(`manual UI: ${seed.spaceName} -> ${seed.title} (${seed.manualReason})`);
      continue;
    }

    if (!apply) {
      console.log(`would create: ${seed.spaceName} -> ${seed.title}`);
      continue;
    }

    try {
      const created = await mightyJson<MightyPost>(`${NETWORK_PATH}/posts?notify=false`, {
        method: "POST",
        body: JSON.stringify({
          space_id: space.id,
          title: seed.title,
          description: seed.description,
        }),
      });
      console.log(`created: ${seed.spaceName} -> ${seed.title} [${created.id}]`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`skipped: ${seed.spaceName} -> ${seed.title} (${message})`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
