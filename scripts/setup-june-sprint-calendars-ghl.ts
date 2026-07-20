import dotenv from "dotenv";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";
const LOCATION = "The Harvest, 9 Gumland Dr, Witta";

type GhlCalendar = {
  id: string;
  name: string;
  widgetSlug?: string;
  calendarType?: string;
  isActive?: boolean;
  appoinmentPerSlot?: number;
  appointmentPerSlot?: number;
};

type CalendarPlan = {
  key: "B1" | "B2" | "shop-chat";
  name: string;
  widgetSlug: string;
  payload: Record<string, unknown>;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function bookingUrl(slug?: string): string | undefined {
  return slug ? `https://api.leadconnectorhq.com/widget/bookings/${slug}` : undefined;
}

function maskEmail(email?: string): string | undefined {
  if (!email) return undefined;
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 2)}***@${domain}`;
}

function saturdayHours(openHour: number, closeHour: number) {
  return [
    {
      daysOfTheWeek: [6],
      hours: [{ openHour, openMinute: 0, closeHour, closeMinute: 0 }],
    },
  ];
}

async function ghlJson<T>(pathname: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${GHL_API_BASE}${pathname}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${requireEnv("GHL_API_KEY")}`,
      Version: GHL_API_VERSION,
      ...init?.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) as T : {} as T;

  if (!response.ok) {
    throw new Error(`GHL ${response.status} ${pathname}: ${text}`);
  }

  return data;
}

async function listCalendars(): Promise<GhlCalendar[]> {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const data = await ghlJson<{ calendars?: GhlCalendar[] }>(`/calendars/?locationId=${locationId}`);
  return data.calendars ?? [];
}

async function listUsers(): Promise<Array<{ id: string; name?: string; email?: string }>> {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const data = await ghlJson<{ users?: Array<{ id: string; name?: string; email?: string }> }>(`/users/?locationId=${locationId}`);
  return data.users ?? [];
}

async function listTags(): Promise<Array<{ id: string; name: string }>> {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const data = await ghlJson<{ tags?: Array<{ id: string; name: string }> }>(`/locations/${locationId}/tags`);
  return data.tags ?? [];
}

function buildPlans(users: Array<{ id: string; name?: string; email?: string }>): CalendarPlan[] {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const ben = users.find((user) => user.email === "benjamin@act.place") ?? users[0];
  const nic = users.find((user) => user.email === "nicholas@act.place") ?? users[1] ?? ben;
  const suzie = users.find((user) => /susie|suzie/i.test(`${user.name ?? ""} ${user.email ?? ""}`));
  const joey = users.find((user) => /joey/i.test(`${user.name ?? ""} ${user.email ?? ""}`));
  const shopTeam = suzie && joey ? [suzie, joey] : [ben, nic];
  const shopTeamMembers = shopTeam
    .filter((user, index, arr): user is { id: string; name?: string; email?: string } => Boolean(user?.id) && arr.findIndex((item) => item?.id === user.id) === index)
    .map((user) => ({
      userId: user.id,
      priority: 0.5,
      selected: true,
      locationConfigurations: [
        {
          kind: "custom",
          location: "Phone or video call. We will confirm the best channel before the chat.",
          position: 0,
        },
      ],
    }));

  return [
    {
      key: "B1",
      name: "RSVP: Maker session, Sat 20 June",
      widgetSlug: "harvest-2026-06-20-maker-session",
      payload: {
        locationId,
        name: "RSVP: Maker session, Sat 20 June",
        description: `Private Harvest makers' morning at ${LOCATION}. Saturday 20 June 2026, 10am to 2pm.`,
        widgetSlug: "harvest-2026-06-20-maker-session",
        calendarType: "event",
        eventTitle: "{{contact.name}} - Maker session RSVP",
        eventColor: "#5F6F52",
        slotDuration: 240,
        slotDurationUnit: "mins",
        slotInterval: 30,
        slotIntervalUnit: "mins",
        slotBuffer: 0,
        slotBufferUnit: "mins",
        preBuffer: 0,
        preBufferUnit: "mins",
        appoinmentPerSlot: 18,
        appointmentPerSlot: 18,
        openHours: saturdayHours(10, 14),
        enableRecurring: false,
        autoConfirm: true,
        googleInvitationEmails: true,
        allowReschedule: false,
        allowCancellation: true,
        formSubmitType: "ThankYouMessage",
        formSubmitThanksMessage: "You are booked for the maker session. See you in the garden at The Harvest, 9 Gumland Dr, Witta.",
        consentLabel: "I confirm that I want to receive information about this Harvest booking using the contact details I provide.",
        guestType: "collect_detail",
        isActive: true,
      },
    },
    {
      key: "B2",
      name: "RSVP: Afternoon + pizza, Sat 20 June",
      widgetSlug: "harvest-2026-06-20-afternoon-pizza",
      payload: {
        locationId,
        name: "RSVP: Afternoon + pizza, Sat 20 June",
        description: `Private Harvest members' afternoon and pizza headcount at ${LOCATION}. Saturday 20 June 2026, from 2pm.`,
        widgetSlug: "harvest-2026-06-20-afternoon-pizza",
        calendarType: "event",
        eventTitle: "{{contact.name}} - Afternoon and pizza RSVP",
        eventColor: "#B65A2A",
        slotDuration: 240,
        slotDurationUnit: "mins",
        slotInterval: 30,
        slotIntervalUnit: "mins",
        slotBuffer: 0,
        slotBufferUnit: "mins",
        preBuffer: 0,
        preBufferUnit: "mins",
        appoinmentPerSlot: 40,
        appointmentPerSlot: 40,
        openHours: saturdayHours(14, 18),
        enableRecurring: false,
        autoConfirm: true,
        googleInvitationEmails: true,
        allowReschedule: false,
        allowCancellation: true,
        formSubmitType: "ThankYouMessage",
        formSubmitThanksMessage: "You are booked for the afternoon and pizza. See you in the garden at The Harvest, 9 Gumland Dr, Witta.",
        consentLabel: "I confirm that I want to receive information about this Harvest booking using the contact details I provide.",
        guestType: "collect_detail",
        isActive: true,
      },
    },
    {
      key: "shop-chat",
      name: "Book a chat about the shop",
      widgetSlug: "harvest-shop-chat",
      payload: {
        locationId,
        name: "Book a chat about the shop",
        description: "Short call for local growers, makers, cooks, and neighbours interested in the Harvest shop shelf.",
        widgetSlug: "harvest-shop-chat",
        calendarType: "round_robin",
        eventType: "RoundRobin_OptimizeForAvailability",
        teamMembers: shopTeamMembers,
        eventTitle: "{{contact.name}} - Harvest shop chat",
        eventColor: "#7B6B43",
        slotDuration: 30,
        slotDurationUnit: "mins",
        slotInterval: 30,
        slotIntervalUnit: "mins",
        slotBuffer: 0,
        slotBufferUnit: "mins",
        preBuffer: 0,
        preBufferUnit: "mins",
        appoinmentPerSlot: 1,
        appointmentPerSlot: 1,
        openHours: [
          {
            daysOfTheWeek: [2],
            hours: [{ openHour: 13, openMinute: 0, closeHour: 16, closeMinute: 0 }],
          },
          {
            daysOfTheWeek: [4],
            hours: [{ openHour: 13, openMinute: 0, closeHour: 16, closeMinute: 0 }],
          },
        ],
        enableRecurring: false,
        autoConfirm: true,
        googleInvitationEmails: true,
        allowReschedule: true,
        allowCancellation: true,
        formSubmitType: "ThankYouMessage",
        formSubmitThanksMessage: "You are booked for a Harvest shop chat. We will see you then.",
        consentLabel: "I confirm that I want to receive information about this Harvest booking using the contact details I provide.",
        guestType: "collect_detail",
        isActive: true,
      },
    },
  ];
}

async function createCalendar(plan: CalendarPlan): Promise<GhlCalendar> {
  const data = await ghlJson<{ calendar?: GhlCalendar }>(`/calendars/`, {
    method: "POST",
    body: JSON.stringify(plan.payload),
  });
  if (!data.calendar?.id) {
    throw new Error(`GHL create calendar did not return a calendar id for ${plan.name}`);
  }
  return data.calendar;
}

async function main(): Promise<void> {
  requireEnv("GHL_LOCATION_ID");
  const apply = process.argv.includes("--apply");

  const [calendars, users, tags] = await Promise.all([listCalendars(), listUsers(), listTags()]);
  const plans = buildPlans(users);
  const requiredTags = [
    "witta-gathering-2026-06-20",
    "rsvp-maker-morning",
    "rsvp-pizza-dinner",
    "project:act-hv",
    "interest:markets",
    "shop-call-booked",
  ];
  const existingTags = new Set(tags.map((tag) => tag.name));
  const missingTags = requiredTags.filter((tag) => !existingTags.has(tag));
  if (missingTags.length) {
    throw new Error(`Missing required GHL tags: ${missingTags.join(", ")}`);
  }

  const existingByName = new Map(calendars.map((calendar) => [calendar.name, calendar]));
  const results = [];

  for (const plan of plans) {
    const existing = existingByName.get(plan.name);
    if (existing) {
      results.push({
        key: plan.key,
        name: plan.name,
        status: "exists",
        calendarId: existing.id,
        slug: existing.widgetSlug,
        bookingUrl: bookingUrl(existing.widgetSlug),
        calendarType: existing.calendarType,
        capacity: existing.appoinmentPerSlot ?? existing.appointmentPerSlot,
      });
      continue;
    }

    if (!apply) {
      results.push({
        key: plan.key,
        name: plan.name,
        status: "would-create",
        slug: plan.widgetSlug,
        bookingUrl: bookingUrl(plan.widgetSlug),
        calendarType: plan.payload.calendarType,
        capacity: plan.payload.appoinmentPerSlot,
      });
      continue;
    }

    const created = await createCalendar(plan);
    results.push({
      key: plan.key,
      name: plan.name,
      status: "created",
      calendarId: created.id,
      slug: created.widgetSlug ?? plan.widgetSlug,
      bookingUrl: bookingUrl(created.widgetSlug ?? plan.widgetSlug),
      calendarType: created.calendarType,
      capacity: created.appoinmentPerSlot ?? created.appointmentPerSlot,
    });
  }

  console.log(JSON.stringify({
    mode: apply ? "apply" : "dry-run",
    usersAvailable: users.map((user) => ({ id: user.id, name: user.name, email: maskEmail(user.email) })),
    note: "Shop-chat prefers Suzie/Joey when both GHL users exist. It falls back to Ben/Nicholas only while steward users are missing.",
    results,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
