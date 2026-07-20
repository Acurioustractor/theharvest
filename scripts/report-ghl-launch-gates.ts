import dotenv from "dotenv";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";
const EVENT_START_MS = new Date("2026-06-20T00:00:00+10:00").getTime();
const EVENT_END_MS = new Date("2026-06-21T00:00:00+10:00").getTime();
const EVENT_IS_PAST = Date.now() > EVENT_END_MS;

type GateStatus = "good" | "watch" | "blocked";

type GhlCalendar = {
  id: string;
  name?: string;
  widgetSlug?: string;
  calendarType?: string;
  isActive?: boolean;
  teamMembers?: Array<{
    userId?: string;
    selected?: boolean;
  }>;
};

type GhlWorkflow = {
  id: string;
  name?: string;
  status?: string;
  version?: number;
};

type GhlTag = {
  id: string;
  name?: string;
};

type GhlUser = {
  id: string;
  name?: string;
  email?: string;
};

type GhlContact = {
  id: string;
  email?: string | null;
  tags?: string[];
};

type GhlEvent = {
  id: string;
  calendarId?: string;
  appointmentStatus?: string | null;
  guests?: unknown[];
};

type EventLookup = {
  events: GhlEvent[];
  error?: string;
};

type Gate = {
  id: string;
  status: GateStatus;
  detail: string;
  nextAction: string;
};

const expectedCalendars = [
  {
    id: "M0KzSu7Bo3jJ3ZQta3ag",
    name: "RSVP: Maker session, Sat 20 June",
    slug: "harvest-2026-06-20-maker-session",
  },
  {
    id: "4IpU9GnzAChTMkKFJPWi",
    name: "RSVP: Afternoon + pizza, Sat 20 June",
    slug: "harvest-2026-06-20-afternoon-pizza",
  },
  {
    id: "viM1BRnHG9gwpIEZd4HM",
    name: "Book a chat about the shop",
    slug: "harvest-shop-chat",
  },
];

const expectedTags = [
  "witta-gathering-2026-06-20",
  "rsvp-maker-morning",
  "rsvp-pizza-dinner",
  "project:act-hv",
  "interest:markets",
  "shop-call-booked",
  "shop-follow-up",
  "role:supplier",
];

const workflowChecks = [
  {
    id: "calendar-maker",
    label: "Calendar workflow: maker session",
    names: ["Harvest - RSVP Maker Session (tag)"],
    pastEventDowngrade: true,
    nextAction:
      "Build and publish the GHL workflow: Customer Booked Appointment on B1 -> add witta-gathering-2026-06-20 + rsvp-maker-morning.",
  },
  {
    id: "calendar-pizza",
    label: "Calendar workflow: afternoon + pizza",
    names: ["Harvest - RSVP Afternoon + Pizza (tag)"],
    aliases: ["Harvest - RSVP Pizza Dinner (tag)"],
    pastEventDowngrade: true,
    nextAction:
      "Build or confirm the GHL workflow: Customer Booked Appointment on B2 -> add witta-gathering-2026-06-20 + rsvp-pizza-dinner.",
  },
  {
    id: "calendar-shop-chat",
    label: "Calendar workflow: shop chat booked",
    names: ["Harvest - Shop Chat Booked (tag)"],
    nextAction:
      "Build and publish the GHL workflow: Customer Booked Appointment on shop-chat -> add project:act-hv + interest:markets + shop-call-booked.",
  },
  {
    id: "shop-receipt",
    label: "Shop interest receipt",
    names: ["Harvest - Shop Interest Receipt"],
    nextAction:
      "Publish the existing Harvest - Shop Interest Receipt workflow so /shop EOIs receive the first acknowledgement.",
  },
];

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value.trim();
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
    throw new Error(`GHL ${response.status} ${pathname}: ${body.slice(0, 300)}`);
  }
  return response.json() as Promise<T>;
}

async function listContacts(): Promise<GhlContact[]> {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const contacts: GhlContact[] = [];
  let nextPageUrl: string | undefined = `/contacts?locationId=${locationId}&limit=100`;

  for (let page = 0; page < 40 && nextPageUrl; page += 1) {
    const path = nextPageUrl.startsWith("http")
      ? nextPageUrl.replace(GHL_API_BASE, "")
      : nextPageUrl;
    const data = await ghlJson<{ contacts?: GhlContact[]; meta?: { nextPageUrl?: string } }>(path);
    contacts.push(...(data.contacts ?? []));
    nextPageUrl = data.meta?.nextPageUrl ?? undefined;
  }

  return contacts;
}

async function listEvents(calendarId: string): Promise<GhlEvent[]> {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const params = new URLSearchParams({
    locationId,
    calendarId,
    startTime: String(EVENT_START_MS),
    endTime: String(EVENT_END_MS),
  });
  const data = await ghlJson<{ events?: GhlEvent[] }>(`/calendars/events?${params.toString()}`);
  return (data.events ?? []).filter((event) => !["cancelled", "canceled"].includes((event.appointmentStatus ?? "").toLowerCase()));
}

async function eventLookup(calendarId: string): Promise<EventLookup> {
  try {
    return { events: await listEvents(calendarId) };
  } catch (error) {
    return {
      events: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function seatsFor(event: GhlEvent) {
  return 1 + (Array.isArray(event.guests) ? event.guests.length : 0);
}

function workflowStatus(workflows: GhlWorkflow[], names: string[], aliases: string[] = []): Gate {
  const exact = workflows.find((workflow) => names.includes(workflow.name ?? ""));
  const alias = workflows.find((workflow) => aliases.includes(workflow.name ?? ""));
  const workflow = exact ?? alias;

  if (!workflow) {
    return {
      id: "",
      status: "blocked",
      detail: `Missing workflow. Expected one of: ${[...names, ...aliases].join(", ")}.`,
      nextAction: "",
    };
  }

  const status = (workflow.status ?? "unknown").toLowerCase();
  if (status !== "published") {
    return {
      id: workflow.id,
      status: "blocked",
      detail: `${workflow.name ?? workflow.id} exists but is ${workflow.status ?? "unknown"} (v${workflow.version ?? "?"}).`,
      nextAction: "",
    };
  }

  return {
    id: workflow.id,
    status: alias && !exact ? "watch" : "good",
    detail: `${workflow.name ?? workflow.id} is published (v${workflow.version ?? "?"}).${alias && !exact ? " Name is an alias; confirm trigger/action blocks in the UI." : ""}`,
    nextAction: "",
  };
}

function printGate(gate: Gate) {
  const icon = gate.status === "good" ? "OK" : gate.status === "watch" ? "WATCH" : "BLOCKED";
  console.log(`- ${icon}: ${gate.detail}`);
  if (gate.nextAction) console.log(`  Next: ${gate.nextAction}`);
}

function maskEmail(email?: string): string | undefined {
  if (!email) return undefined;
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 2)}***@${domain}`;
}

function userLabel(user: GhlUser): string {
  return maskEmail(user.email) || user.name || user.id;
}

function isSuzieUser(user: GhlUser): boolean {
  return /susie|suzie/i.test(`${user.name ?? ""} ${user.email ?? ""}`);
}

function isJoeyUser(user: GhlUser): boolean {
  return /joey/i.test(`${user.name ?? ""} ${user.email ?? ""}`);
}

async function main() {
  const locationId = requireEnv("GHL_LOCATION_ID");

  const [calendarsData, workflowsData, tagsData, usersData, contacts] = await Promise.all([
    ghlJson<{ calendars?: GhlCalendar[] }>(`/calendars/?locationId=${locationId}`),
    ghlJson<{ workflows?: GhlWorkflow[] }>(`/workflows/?locationId=${locationId}`),
    ghlJson<{ tags?: GhlTag[] }>(`/locations/${locationId}/tags`),
    ghlJson<{ users?: GhlUser[] }>(`/users/?locationId=${locationId}`).catch((error) => ({
      users: [],
      error: error instanceof Error ? error.message : String(error),
    })),
    listContacts(),
  ]);

  const calendars = calendarsData.calendars ?? [];
  const workflows = workflowsData.workflows ?? [];
  const tags = new Set((tagsData.tags ?? []).map((tag) => tag.name).filter((tag): tag is string => Boolean(tag)));
  const users = usersData.users ?? [];
  const usersError = "error" in usersData ? usersData.error : "";
  const tagCounts = Object.fromEntries(
    expectedTags.map((tag) => [tag, contacts.filter((contact) => (contact.tags ?? []).includes(tag)).length]),
  );

  const [makerEventLookup, pizzaEventLookup] = await Promise.all([
    eventLookup("M0KzSu7Bo3jJ3ZQta3ag"),
    eventLookup("4IpU9GnzAChTMkKFJPWi"),
  ]);
  const makerEvents = makerEventLookup.events;
  const pizzaEvents = pizzaEventLookup.events;

  console.log(`# GHL launch gates - ${new Date().toISOString()}`);
  console.log();

  console.log("## Calendars");
  for (const expected of expectedCalendars) {
    const calendar = calendars.find((item) => item.id === expected.id || item.name === expected.name);
    printGate({
      id: expected.id,
      status: calendar ? "good" : "blocked",
      detail: calendar
        ? `${expected.name} exists (${calendar.id}, slug ${calendar.widgetSlug ?? "unknown"}).`
        : `${expected.name} is missing.`,
      nextAction: calendar ? "" : "Run npm run setup:june-sprint-calendars:ghl -- --apply or create the calendar in GHL.",
    });
  }

  console.log();
  console.log("## Tags");
  for (const tag of expectedTags) {
    printGate({
      id: tag,
      status: tags.has(tag) ? "good" : "blocked",
      detail: `${tag}: ${tags.has(tag) ? `exists, ${tagCounts[tag]} contact(s)` : "missing from tag library"}.`,
      nextAction: tags.has(tag) ? "" : "Create the tag in GHL before building workflows that reference it.",
    });
  }

  console.log();
  console.log("## Workflows");
  for (const check of workflowChecks) {
    const gate = workflowStatus(workflows, check.names, check.aliases);
    const isPastEventWorkflow = EVENT_IS_PAST && check.pastEventDowngrade && gate.status === "blocked";
    printGate({
      ...gate,
      status: isPastEventWorkflow ? "watch" : gate.status,
      detail: `${check.label}: ${isPastEventWorkflow ? "Past-event workflow not ready; only build if this calendar is reused. " : ""}${gate.detail}`,
      nextAction: gate.status === "good"
        ? ""
        : isPastEventWorkflow
        ? "If this old June 20 calendar is retired, archive the workflow task instead of building it."
        : check.nextAction,
    });
  }

  console.log();
  console.log("## RSVP");
  const makerSeats = makerEvents.reduce((sum, event) => sum + seatsFor(event), 0);
  const pizzaSeats = pizzaEvents.reduce((sum, event) => sum + seatsFor(event), 0);
  const eventCountError = [makerEventLookup.error, pizzaEventLookup.error].filter(Boolean).join(" | ");
  printGate({
    id: "public-rsvp-form",
    status: "good",
    detail:
      "The public /june-20 RSVP path is the embedded website form. It writes witta-gathering-2026-06-20 + rsvp-pizza-dinner directly via the server route.",
    nextAction: "Production has been tested; continue checking RSVP tag counts before each send.",
  });
  printGate({
    id: "rsvp-count",
    status: eventCountError ? "watch" : tagCounts["rsvp-pizza-dinner"] > 0 ? "good" : "watch",
    detail: `B1 seats ${makerSeats}; B2 seats ${pizzaSeats}; rsvp-pizza-dinner tag count ${tagCounts["rsvp-pizza-dinner"]}.${eventCountError ? ` Event lookup warning: ${eventCountError}` : ""}`,
    nextAction: tagCounts["rsvp-pizza-dinner"] > 0 ? "" : "Start sending traffic to the embedded RSVP form.",
  });

  console.log();
  console.log("## Shop");
  const shopCalendar = calendars.find((calendar) => calendar.id === "viM1BRnHG9gwpIEZd4HM");
  const suzieUser = users.find(isSuzieUser);
  const joeyUser = users.find(isJoeyUser);
  const shopCalendarUserIds = new Set(
    (shopCalendar?.teamMembers ?? [])
      .filter((member) => member.selected !== false)
      .map((member) => member.userId)
      .filter(Boolean),
  );
  const shopCalendarHasSuzie = Boolean(suzieUser?.id && shopCalendarUserIds.has(suzieUser.id));
  const shopCalendarHasJoey = Boolean(joeyUser?.id && shopCalendarUserIds.has(joeyUser.id));
  printGate({
    id: "shop-interest",
    status: tagCounts["interest:markets"] > 0 ? "watch" : "blocked",
    detail: `${tagCounts["interest:markets"]} contact(s) carry interest:markets; ${tagCounts["shop-call-booked"]} carry shop-call-booked.`,
    nextAction: tagCounts["shop-call-booked"] > 0 ? "" : "Publish/test the shop-chat booked workflow and book at least one real/test shop chat.",
  });
  printGate({
    id: "shop-users",
    status: usersError ? "watch" : suzieUser && joeyUser ? "good" : "blocked",
    detail: usersError
      ? `Could not fetch GHL users: ${usersError}`
      : suzieUser && joeyUser
      ? `Suzie/Joey GHL users exist: ${[suzieUser.name ?? suzieUser.email, joeyUser.name ?? joeyUser.email].join(", ")}.`
      : `Missing ${!suzieUser ? "Suzie/Susie" : ""}${!suzieUser && !joeyUser ? " and " : ""}${!joeyUser ? "Joey" : ""} GHL user. Current users: ${users.map(userLabel).join(", ")}.`,
    nextAction: suzieUser && joeyUser ? "" : "Create Suzie/Joey GHL users, limit them to Conversations/Opportunities/Calendars/Contacts, then move shop-chat ownership.",
  });
  printGate({
    id: "shop-calendar-team",
    status: shopCalendarHasSuzie && shopCalendarHasJoey ? "good" : "blocked",
    detail: shopCalendar
      ? shopCalendarHasSuzie && shopCalendarHasJoey
        ? "Book a chat about the shop is assigned to Suzie and Joey."
        : `Book a chat about the shop is not fully assigned to Suzie/Joey. Current selected user IDs: ${Array.from(shopCalendarUserIds).join(", ") || "none"}.`
      : "Book a chat about the shop calendar is missing.",
    nextAction: shopCalendarHasSuzie && shopCalendarHasJoey ? "" : "Move shop-chat calendar team members to Suzie and Joey, then connect their Google Calendars in the GHL UI.",
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
