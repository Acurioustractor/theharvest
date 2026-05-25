import "dotenv/config";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const CONTACTS_API_VERSION = "2021-07-28";
const CONVERSATIONS_API_VERSION = "2021-04-15";
const BRISBANE_UTC_OFFSET_HOURS = 10;

type GhlContact = {
  id: string;
  contactName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  source?: string | null;
  tags?: string[];
  dateAdded?: string | null;
  dateUpdated?: string | null;
};

type GhlConversation = {
  id: string;
};

type GhlMessage = {
  direction?: string;
  subject?: string;
  body?: string;
};

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

async function ghlJson<T>(pathname: string, init?: RequestInit, version = CONTACTS_API_VERSION): Promise<T> {
  const response = await fetch(`${GHL_API_BASE}${pathname}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${requireEnv("GHL_API_KEY")}`,
      Version: version,
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
      nextPageUrl.startsWith("http") ? nextPageUrl.replace(GHL_API_BASE, "") : nextPageUrl,
    );
    const pageContacts = data.contacts ?? [];
    contacts.push(...pageContacts);
    nextPageUrl = data.meta?.nextPageUrl ?? "";

    const oldest = pageContacts.at(-1);
    if (oldest?.dateUpdated && new Date(oldest.dateUpdated) < start && page > 1) break;
  }

  return contacts;
}

async function listContactConversations(contactId: string) {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const query = new URLSearchParams({
    locationId,
    contactId,
    status: "all",
    sortBy: "last_message_date",
    sort: "desc",
    limit: "10",
  });
  const data = await ghlJson<{ conversations?: GhlConversation[] }>(
    `/conversations/search?${query.toString()}`,
    undefined,
    CONVERSATIONS_API_VERSION,
  );
  return data.conversations ?? [];
}

async function listConversationMessages(conversationId: string) {
  const data = await ghlJson<{ messages?: { messages?: GhlMessage[] } | GhlMessage[] }>(
    `/conversations/${conversationId}/messages?limit=20`,
    undefined,
    CONVERSATIONS_API_VERSION,
  );
  if (Array.isArray(data.messages)) return data.messages;
  return data.messages?.messages ?? [];
}

function isWelcomeLikeMessage(message: GhlMessage) {
  if (message.direction !== "outbound") return false;
  const subject = message.subject?.toLowerCase() ?? "";
  const body = message.body?.toLowerCase() ?? "";
  return subject.includes("your name is on the list")
    || subject.includes("welcome")
    || body.includes("you're on the harvest member list")
    || body.includes("you are on the harvest member list");
}

async function hasWelcomeEmail(contactId: string) {
  const conversations = await listContactConversations(contactId);
  const messages = (await Promise.all(
    conversations.map((conversation) => listConversationMessages(conversation.id)),
  )).flat();
  return messages.some(isWelcomeLikeMessage);
}

async function triggerWorkflow(contactId: string) {
  const workflowId = requireEnv("GHL_MEMBER_WELCOME_WORKFLOW_ID");
  await ghlJson(`/contacts/${contactId}/workflow/${workflowId}`, { method: "POST" });
}

async function main() {
  const date = argValue("--date") || brisbaneToday();
  const apply = hasFlag("--apply");
  const { start, end } = brisbaneDayWindow(date);
  const contacts = await listRecentContacts(start);

  const members = contacts
    .filter((contact) => contact.tags?.includes("harvest-member"))
    .filter((contact) => inWindow(contact.dateAdded, start, end) || inWindow(contact.dateUpdated, start, end))
    .filter((contact) => contact.email && !contact.email.includes("+harvest-member-welcome-test"));

  const missed: GhlContact[] = [];
  for (const contact of members) {
    if (!(await hasWelcomeEmail(contact.id))) missed.push(contact);
  }

  console.log(`Harvest member welcome catch-up for ${date}`);
  console.log(`Mode: ${apply ? "apply" : "dry-run"}`);
  console.log(`Members checked: ${members.length}`);
  console.log(`Need welcome: ${missed.length}`);

  for (const contact of missed) {
    console.log(`- ${contactName(contact)} <${contact.email}> source=${contact.source || "unknown"}`);
    if (apply) await triggerWorkflow(contact.id);
  }

  if (!apply) {
    console.log("");
    console.log("Run again with --apply to trigger the member welcome workflow for these contacts.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
