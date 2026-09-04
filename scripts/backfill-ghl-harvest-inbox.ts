import "dotenv/config";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";
const BRISBANE_UTC_OFFSET_HOURS = 10;
const DEFAULT_HARVEST_INBOX_PIPELINE_ID = "5ZqAuFokM4LsNqMCMPmY";
const DEFAULT_HARVEST_INBOX_NEW_STAGE_ID = "aafc9a01-1ad6-42c8-8c47-69a74cf1141d";

type GhlContact = {
  id: string;
  contactName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  tags?: string[];
  dateAdded?: string | null;
  dateUpdated?: string | null;
};

type GhlOpportunity = {
  id: string;
  name?: string | null;
  source?: string | null;
  status?: string | null;
  contactId?: string | null;
};

const ACTION_TAGS = new Map<string, string>([
  ["member-comments", "Member comment"],
  ["member-question", "Member question"],
  ["contact-form", "Contact form"],
  ["harvest-shop-interest", "Shop interest"],
  ["interest:markets", "Shop interest"],
  ["venue-enquiry", "Venue enquiry"],
  ["event-submission", "Event submission"],
  ["business-registration", "Business registration"],
  ["workshop-booking", "Workshop booking"],
  ["photo-wall", "Photo wall response"],
  ["witta-gathering-2026-06-20", "RSVP 2026-06-20"],
]);

function argValue(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function hasFlag(name: string) {
  return process.argv.includes(name);
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function brisbaneToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Brisbane",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

function brisbaneDayWindow(date = brisbaneToday()) {
  const [year, month, day] = date.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, day, -BRISBANE_UTC_OFFSET_HOURS));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { date, start, end };
}

function inWindow(value: string | null | undefined, start: Date, end: Date) {
  if (!value) return false;
  const date = new Date(value);
  return date >= start && date < end;
}

function contactName(contact: GhlContact) {
  return contact.contactName || [contact.firstName, contact.lastName].filter(Boolean).join(" ") || contact.email || "Unknown";
}

function sourceForFlow(flow: string) {
  if (flow.startsWith("RSVP")) return "Harvest | RSVP 2026-06-20";
  return `Harvest | ${flow.replace(/ form| response| submission| registration| booking| interest| comment| question| enquiry/g, "").trim()}`;
}

async function ghlJson<T>(pathname: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${GHL_API_BASE}${pathname}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${requireEnv("GHL_API_KEY")}`,
      Version: GHL_API_VERSION,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GHL ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}

async function listRecentContacts(start: Date) {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const contacts: GhlContact[] = [];
  let nextPageUrl = `/contacts?locationId=${locationId}&limit=100`;

  for (let page = 0; page < 10 && nextPageUrl; page += 1) {
    const data = await ghlJson<{ contacts?: GhlContact[]; meta?: { nextPageUrl?: string } }>(
      nextPageUrl.startsWith("http")
        ? nextPageUrl.replace(GHL_API_BASE, "")
        : nextPageUrl,
    );
    const pageContacts = data.contacts ?? [];
    contacts.push(...pageContacts);
    nextPageUrl = data.meta?.nextPageUrl ?? "";

    const oldest = pageContacts.at(-1);
    if (oldest?.dateUpdated && new Date(oldest.dateUpdated) < start && page > 1) break;
  }

  return contacts;
}

async function listOpportunities() {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const data = await ghlJson<{ opportunities?: GhlOpportunity[] }>(`/opportunities/search?location_id=${locationId}`);
  return data.opportunities ?? [];
}

function actionFlowForContact(contact: GhlContact) {
  for (const [tag, flow] of ACTION_TAGS) {
    if (contact.tags?.includes(tag)) return flow;
  }
  return null;
}

async function addHarvestInboxTag(contactId: string) {
  await ghlJson(`/contacts/${contactId}/tags`, {
    method: "POST",
    body: JSON.stringify({ tags: ["harvest-inbox"] }),
  });
}

async function upsertOpportunity(contact: GhlContact, flow: string) {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const pipelineId = process.env.GHL_HARVEST_INBOX_PIPELINE_ID || DEFAULT_HARVEST_INBOX_PIPELINE_ID;
  const pipelineStageId = process.env.GHL_HARVEST_INBOX_NEW_STAGE_ID || DEFAULT_HARVEST_INBOX_NEW_STAGE_ID;
  const name = `${contactName(contact)} - ${flow}`;

  await ghlJson("/opportunities/upsert", {
    method: "POST",
    body: JSON.stringify({
      pipelineId,
      locationId,
      contactId: contact.id,
      name,
      status: "open",
      pipelineStageId,
      monetaryValue: 0,
      source: contact.source || sourceForFlow(flow),
    }),
  });
}

async function main() {
  const date = argValue("--date") || brisbaneToday();
  const apply = hasFlag("--apply");
  const force = hasFlag("--force");
  const { start, end } = brisbaneDayWindow(date);

  const [contacts, opportunities] = await Promise.all([
    listRecentContacts(start),
    listOpportunities(),
  ]);

  const existingOpportunityContactIds = new Set(
    opportunities
      .filter((opportunity) => opportunity.status !== "lost")
      .map((opportunity) => opportunity.contactId)
      .filter((id): id is string => Boolean(id)),
  );

  const candidates = contacts
    .filter((contact) => inWindow(contact.dateAdded, start, end) || inWindow(contact.dateUpdated, start, end))
    .map((contact) => ({ contact, flow: actionFlowForContact(contact) }))
    .filter((item): item is { contact: GhlContact; flow: string } => Boolean(item.flow))
    .filter(({ contact }) => force || !existingOpportunityContactIds.has(contact.id));

  console.log(`Harvest inbox backfill for ${date}`);
  console.log(`Mode: ${apply ? "apply" : "dry-run"}${force ? " force" : ""}`);
  console.log(`Candidates: ${candidates.length}`);

  for (const { contact, flow } of candidates) {
    console.log(`- ${contactName(contact)} <${contact.email || contact.phone || "no contact"}> -> ${flow}`);
    if (apply) {
      await addHarvestInboxTag(contact.id);
      await upsertOpportunity(contact, flow);
    }
  }

  if (!apply) {
    console.log("");
    console.log("Run with --apply to create/update GHL inbox cards.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
