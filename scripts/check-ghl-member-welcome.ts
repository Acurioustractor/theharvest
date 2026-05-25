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
  tags?: string[];
  source?: string | null;
  dateAdded?: string | null;
  dateUpdated?: string | null;
};

type GhlWorkflow = {
  id: string;
  name?: string;
  status?: string;
  version?: number;
};

type GhlConversation = {
  id: string;
  contactId?: string;
  lastMessageBody?: string | null;
  lastMessageType?: string | null;
  lastMessageDirection?: string | null;
  lastMessageDate?: string | null;
};

type GhlMessage = {
  id: string;
  contactId?: string;
  conversationId?: string;
  messageType?: string;
  type?: number | string;
  direction?: string;
  status?: string;
  dateAdded?: string;
  subject?: string;
  body?: string;
};

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

function contactName(contact: GhlContact) {
  return contact.contactName || [contact.firstName, contact.lastName].filter(Boolean).join(" ") || contact.email || "Unknown";
}

async function ghlJson<T>(pathname: string, version = CONTACTS_API_VERSION): Promise<T> {
  const response = await fetch(`${GHL_API_BASE}${pathname}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${requireEnv("GHL_API_KEY")}`,
      Version: version,
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

async function listWorkflows() {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const data = await ghlJson<{ workflows?: GhlWorkflow[] }>(`/workflows/?locationId=${locationId}`);
  return data.workflows ?? [];
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
    CONVERSATIONS_API_VERSION,
  );
  return data.conversations ?? [];
}

async function listConversationMessages(conversationId: string) {
  const data = await ghlJson<{ messages?: { messages?: GhlMessage[] } | GhlMessage[] }>(
    `/conversations/${conversationId}/messages?limit=20`,
    CONVERSATIONS_API_VERSION,
  );
  if (Array.isArray(data.messages)) return data.messages;
  return data.messages?.messages ?? [];
}

function isWelcomeLikeMessage(message: GhlMessage) {
  const subject = message.subject?.toLowerCase() ?? "";
  const body = message.body?.toLowerCase() ?? "";
  return subject.includes("your name is on the list")
    || subject.includes("welcome")
    || body.includes("you're on the harvest member list")
    || body.includes("you are on the harvest member list");
}

async function main() {
  const date = argValue("--date") || brisbaneToday();
  const { start, end } = brisbaneDayWindow(date);
  const memberWorkflowId = process.env.GHL_MEMBER_WELCOME_WORKFLOW_ID;

  const [contacts, workflows] = await Promise.all([
    listRecentContacts(start),
    listWorkflows(),
  ]);

  const workflow = workflows.find((item) => item.id === memberWorkflowId);
  const members = contacts
    .filter((contact) => contact.tags?.includes("harvest-member"))
    .filter((contact) => inWindow(contact.dateAdded, start, end) || inWindow(contact.dateUpdated, start, end));

  console.log(`Harvest member welcome check for ${date}`);
  console.log(`Workflow env: ${memberWorkflowId ? "SET" : "EMPTY"}`);
  console.log(`Workflow status: ${workflow ? `${workflow.name || workflow.id} / ${workflow.status || "unknown"} / v${workflow.version ?? "?"}` : "not found by API"}`);
  console.log(`Members checked: ${members.length}`);
  console.log("");

  let withWelcome = 0;
  let withOutbound = 0;

  for (const contact of members) {
    const conversations = await listContactConversations(contact.id);
    const messages = (await Promise.all(
      conversations.map((conversation) => listConversationMessages(conversation.id)),
    )).flat();

    const outbound = messages.filter((message) => message.direction === "outbound");
    const welcome = outbound.find(isWelcomeLikeMessage);
    if (outbound.length > 0) withOutbound += 1;
    if (welcome) withWelcome += 1;

    console.log(`- ${contactName(contact)} <${contact.email || "no email"}>`);
    console.log(`  source: ${contact.source || "unknown"} | conversations: ${conversations.length} | outbound: ${outbound.length} | welcome: ${welcome ? "yes" : "no"}`);
    for (const message of outbound.slice(0, 3)) {
      console.log(`  outbound: ${message.dateAdded || "no date"} | ${message.messageType || message.type || "message"} | ${message.status || "no status"} | ${message.subject || "(no subject)"}`);
    }
  }

  console.log("");
  console.log(`Summary: ${withWelcome}/${members.length} have a welcome-like outbound email; ${withOutbound}/${members.length} have any outbound conversation message.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
