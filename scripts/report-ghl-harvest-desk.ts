import "dotenv/config";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";
const BRISBANE_UTC_OFFSET_HOURS = 10;

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
  pipelineId?: string | null;
  pipelineStageId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  contactId?: string | null;
  contact?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    tags?: string[];
  } | null;
};

type GhlNote = {
  id: string;
  body?: string | null;
  bodyText?: string | null;
  dateAdded?: string | null;
  contactId?: string | null;
};

const HARVEST_TAGS = new Set([
  "harvest-website",
  "harvest-newsletter",
  "harvest-member",
  "harvest-event-attendee",
  "harvest-shop-interest",
  "witta-gathering-2026-06-20",
  "witta-soft-opening-2026-06-20",
  "photo-wall",
  "harvest-gathering-photos",
  "member-question",
  "member-comments",
  "harvest-inbox",
  "contact-form",
  "event-submission",
  "business-registration",
  "pulse-respondent",
  "venue-enquiry",
  "workshop-booking",
  "quiz-completed",
]);

function argValue(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
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

function contactName(contact: Pick<GhlContact, "contactName" | "firstName" | "lastName" | "email">) {
  return contact.contactName || [contact.firstName, contact.lastName].filter(Boolean).join(" ") || contact.email || "Unknown";
}

function isHarvestContact(contact: GhlContact) {
  const source = contact.source?.toLowerCase() ?? "";
  if (source.includes("harvest") || source.includes("witta gathering") || source.includes("garden launch")) return true;
  return (contact.tags ?? []).some((tag) => HARVEST_TAGS.has(tag));
}

function isHarvestOpportunity(opportunity: GhlOpportunity) {
  const source = opportunity.source?.toLowerCase() ?? "";
  if (source.includes("harvest") || source.includes("witta gathering") || source.includes("garden launch")) return true;
  return (opportunity.contact?.tags ?? []).some((tag) => HARVEST_TAGS.has(tag));
}

async function ghlJson<T>(pathname: string): Promise<T> {
  const response = await fetch(`${GHL_API_BASE}${pathname}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${requireEnv("GHL_API_KEY")}`,
      Version: GHL_API_VERSION,
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

async function listNotes(contactId: string) {
  const data = await ghlJson<{ notes?: GhlNote[] }>(`/contacts/${contactId}/notes`);
  return data.notes ?? [];
}

function shortNote(body: string) {
  return body.replace(/\s+/g, " ").trim().slice(0, 260);
}

async function main() {
  const date = argValue("--date") || brisbaneToday();
  const { start, end } = brisbaneDayWindow(date);

  const [opportunities, contacts] = await Promise.all([
    listOpportunities(),
    listRecentContacts(start),
  ]);

  const todaysOpportunities = opportunities
    .filter((opportunity) => isHarvestOpportunity(opportunity))
    .filter((opportunity) => inWindow(opportunity.createdAt, start, end) || inWindow(opportunity.updatedAt, start, end));

  const todaysContacts = contacts
    .filter((contact) => isHarvestContact(contact))
    .filter((contact) => inWindow(contact.dateAdded, start, end) || inWindow(contact.dateUpdated, start, end));

  const contactIds = Array.from(new Set([
    ...todaysOpportunities.map((opportunity) => opportunity.contactId),
    ...todaysContacts.map((contact) => contact.id),
  ].filter((id): id is string => Boolean(id))));

  const notesByContact = new Map<string, GhlNote[]>();
  await Promise.all(contactIds.map(async (contactId) => {
    const notes = await listNotes(contactId);
    notesByContact.set(contactId, notes.filter((note) => inWindow(note.dateAdded, start, end)));
  }));

  const memberSignups = todaysContacts.filter((contact) => contact.tags?.includes("harvest-member"));
  const memberComments = todaysContacts.filter((contact) => contact.tags?.includes("member-comments"));

  console.log(`Harvest desk for ${date} (Australia/Brisbane)`);
  console.log(`Window: ${start.toISOString()} to ${end.toISOString()}`);
  console.log("");

  console.log(`Reply queue: ${todaysOpportunities.length} opportunity card(s)`);
  for (const opportunity of todaysOpportunities) {
    console.log(`- ${opportunity.contact?.name || opportunity.name || "Unknown"} <${opportunity.contact?.email || "no email"}>`);
    console.log(`  source: ${opportunity.source || "No source"} | card: ${opportunity.name || opportunity.id}`);
    const notes = notesByContact.get(opportunity.contactId || "") ?? [];
    for (const note of notes) {
      console.log(`  note: ${shortNote(note.bodyText || note.body || "")}`);
    }
  }

  console.log("");
  console.log(`Member signups: ${memberSignups.length}`);
  for (const contact of memberSignups) {
    console.log(`- ${contactName(contact)} <${contact.email || "no email"}>`);
  }

  console.log("");
  console.log(`Member comments: ${memberComments.length}`);
  for (const contact of memberComments) {
    console.log(`- ${contactName(contact)} <${contact.email || "no email"}>`);
    const notes = notesByContact.get(contact.id) ?? [];
    for (const note of notes) {
      console.log(`  note: ${shortNote(note.bodyText || note.body || "")}`);
    }
  }

  console.log("");
  console.log("GHL screens to use:");
  console.log("- Opportunities > Universal Inquiry > New Inquiry: reply-needed cards");
  console.log("- Contacts smart list tag=harvest-member sorted newest: all member signups");
  console.log("- Contacts smart list tag=member-comments sorted newest: member comments/ideas");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
