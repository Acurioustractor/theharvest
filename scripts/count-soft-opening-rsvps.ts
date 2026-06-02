import "dotenv/config";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const EVENT_START_MS = new Date("2026-06-20T00:00:00+10:00").getTime();
const EVENT_END_MS = new Date("2026-06-21T00:00:00+10:00").getTime();

const CALENDAR_NAMES = {
  maker: "RSVP: Maker session, Sat 20 June",
  pizza: "RSVP: Afternoon + pizza, Sat 20 June",
};

const TAGS = {
  event: "witta-gathering-2026-06-20",
  maker: "rsvp-maker-morning",
  pizza: "rsvp-pizza-dinner",
};

type GhlCalendar = {
  id: string;
  name: string;
  widgetSlug?: string;
  appoinmentPerSlot?: number;
  appointmentPerSlot?: number;
};

type GhlEvent = {
  id: string;
  title?: string | null;
  calendarId?: string;
  contactId?: string;
  appointmentStatus?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  dateAdded?: string | null;
  guests?: unknown[];
};

type GhlContact = {
  id: string;
  contactName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  tags?: string[];
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
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
    throw new Error(`GHL ${response.status} ${pathname}: ${body}`);
  }
  return response.json() as Promise<T>;
}

async function listCalendars(): Promise<GhlCalendar[]> {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const data = await ghlJson<{ calendars?: GhlCalendar[] }>(`/calendars/?locationId=${locationId}`);
  return data.calendars ?? [];
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

async function listAllContacts(): Promise<GhlContact[]> {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const contacts: GhlContact[] = [];
  let nextPageUrl: string | undefined = `/contacts?locationId=${locationId}&limit=100`;
  for (let page = 0; page < 30 && nextPageUrl; page += 1) {
    const path = nextPageUrl.startsWith("http")
      ? nextPageUrl.replace(GHL_API_BASE, "")
      : nextPageUrl;
    const data = await ghlJson<{ contacts?: GhlContact[]; meta?: { nextPageUrl?: string } }>(path);
    contacts.push(...(data.contacts ?? []));
    nextPageUrl = data.meta?.nextPageUrl ?? undefined;
  }
  return contacts;
}

function contactLabel(contact?: GhlContact): string {
  if (!contact) return "";
  return contact.contactName || [contact.firstName, contact.lastName].filter(Boolean).join(" ") || contact.email || contact.id;
}

function seatsFor(event: GhlEvent): number {
  return 1 + (Array.isArray(event.guests) ? event.guests.length : 0);
}

function bookingLabel(event: GhlEvent, contactsById: Map<string, GhlContact>): string {
  const fromContact = event.contactId ? contactLabel(contactsById.get(event.contactId)) : "";
  return fromContact || event.title || event.contactId || event.id;
}

function brisbaneDate(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Brisbane",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.year}-${byType.month}-${byType.day}`;
}

async function main() {
  const [calendars, contacts] = await Promise.all([listCalendars(), listAllContacts()]);
  const contactsById = new Map(contacts.map((contact) => [contact.id, contact]));

  const makerCalendar = calendars.find((calendar) => calendar.name === CALENDAR_NAMES.maker);
  const pizzaCalendar = calendars.find((calendar) => calendar.name === CALENDAR_NAMES.pizza);

  if (!makerCalendar || !pizzaCalendar) {
    throw new Error(`Missing current RSVP calendars. Maker exists: ${Boolean(makerCalendar)}. Pizza exists: ${Boolean(pizzaCalendar)}.`);
  }

  const [makerEvents, pizzaEvents] = await Promise.all([
    listEvents(makerCalendar.id),
    listEvents(pizzaCalendar.id),
  ]);

  const tagCounts = Object.fromEntries(
    Object.entries(TAGS).map(([key, tag]) => [
      key,
      contacts.filter((contact) => (contact.tags ?? []).includes(tag)).length,
    ]),
  );

  const makerSeats = makerEvents.reduce((sum, event) => sum + seatsFor(event), 0);
  const pizzaSeats = pizzaEvents.reduce((sum, event) => sum + seatsFor(event), 0);
  const makerCapacity = makerCalendar.appoinmentPerSlot ?? makerCalendar.appointmentPerSlot ?? 18;
  const pizzaCapacity = pizzaCalendar.appoinmentPerSlot ?? pizzaCalendar.appointmentPerSlot ?? 40;
  const now = brisbaneDate();

  console.log(`# Witta 20 June RSVP headcount - ${now}`);
  console.log();
  console.log(`- B1 calendar: \`${makerCalendar.id}\` (${makerCalendar.name})`);
  console.log(`- B2 calendar: \`${pizzaCalendar.id}\` (${pizzaCalendar.name})`);
  console.log(`- B1 maker session bookings: **${makerSeats} / ${makerCapacity}**`);
  console.log(`- B2 afternoon + pizza bookings: **${pizzaSeats} / ${pizzaCapacity}**`);
  console.log(`- Tag counts: \`${TAGS.event}\` ${tagCounts.event}, \`${TAGS.maker}\` ${tagCounts.maker}, \`${TAGS.pizza}\` ${tagCounts.pizza}`);
  console.log();

  if (makerEvents.length === 0 && pizzaEvents.length === 0) {
    console.log("_No B1 or B2 bookings found yet._");
    return;
  }

  console.log("| Session | Start | Name | Seats | Status |");
  console.log("| --- | --- | --- | --- | --- |");

  for (const event of makerEvents) {
    console.log(`| B1 maker | ${event.startTime ?? ""} | ${bookingLabel(event, contactsById)} | ${seatsFor(event)} | ${event.appointmentStatus ?? ""} |`);
  }
  for (const event of pizzaEvents) {
    console.log(`| B2 pizza | ${event.startTime ?? ""} | ${bookingLabel(event, contactsById)} | ${seatsFor(event)} | ${event.appointmentStatus ?? ""} |`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
