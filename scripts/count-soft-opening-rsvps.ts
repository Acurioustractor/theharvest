import "dotenv/config";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const SOFT_OPENING_TAG = "witta-soft-opening-2026-06-20";
const RSVP_NOTE_PREFIX = "Soft-opening RSVP:";
const SEAT_TARGET = 40;

type GhlContact = {
  id: string;
  contactName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  tags?: string[];
  dateUpdated?: string | null;
};

type GhlNote = {
  id: string;
  body?: string | null;
  dateAdded?: string | null;
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

async function listNotes(contactId: string): Promise<GhlNote[]> {
  const data = await ghlJson<{ notes?: GhlNote[] }>(`/contacts/${contactId}/notes`);
  return data.notes ?? [];
}

function contactLabel(c: GhlContact): string {
  return c.contactName || [c.firstName, c.lastName].filter(Boolean).join(" ") || c.email || c.id;
}

function parseSeatsFromNote(body: string): number | null {
  // Expected pattern: "Soft-opening RSVP: 3 seats, vegan, ..."
  const match = body.match(/RSVP:\s*(\d+)\s*seat/i);
  if (match) return Number(match[1]);
  return null;
}

async function main() {
  const all = await listAllContacts();
  const tagged = all.filter((c) => (c.tags ?? []).includes(SOFT_OPENING_TAG));

  let totalSeats = 0;
  const rows: Array<{ name: string; seats: number; note: string; dateAdded: string | null }> = [];

  for (const contact of tagged) {
    const notes = await listNotes(contact.id);
    const rsvpNotes = notes
      .filter((n) => (n.body ?? "").startsWith(RSVP_NOTE_PREFIX))
      .sort((a, b) => (b.dateAdded ?? "").localeCompare(a.dateAdded ?? ""));
    const latest = rsvpNotes[0];
    const seats = latest ? parseSeatsFromNote(latest.body ?? "") ?? 1 : 1;
    totalSeats += seats;
    rows.push({
      name: contactLabel(contact),
      seats,
      note: (latest?.body ?? "").replace(/\s+/g, " ").trim().slice(0, 180),
      dateAdded: latest?.dateAdded ?? null,
    });
  }

  rows.sort((a, b) => (b.dateAdded ?? "").localeCompare(a.dateAdded ?? ""));

  const now = new Date().toISOString().slice(0, 10);
  const pct = Math.round((totalSeats / SEAT_TARGET) * 100);

  console.log(`# Soft-opening RSVP headcount — ${now}`);
  console.log();
  console.log(`- Tag: \`${SOFT_OPENING_TAG}\``);
  console.log(`- Contacts tagged: **${tagged.length}**`);
  console.log(`- Total seats requested: **${totalSeats} / ${SEAT_TARGET}** (${pct}%)`);
  console.log();

  if (tagged.length === 0) {
    console.log("_No contacts tagged yet — invite not yet sent or no replies in._");
    return;
  }

  console.log("| Replied | Name | Seats | Note |");
  console.log("| --- | --- | --- | --- |");
  for (const row of rows) {
    const date = row.dateAdded ? row.dateAdded.slice(0, 10) : "—";
    const note = row.note || "_no RSVP note on contact_";
    console.log(`| ${date} | ${row.name} | ${row.seats} | ${note} |`);
  }

  console.log();
  console.log(`### Headcount-tracker block (paste into alignment page)`);
  console.log();
  console.log("| Signal | Target | Current | Last checked |");
  console.log("| --- | --- | --- | --- |");
  console.log(`| \`harvest-member\` tag count | grows with each touchpoint | (run audit:contacts:ghl) | — |`);
  console.log(`| Soft-opening reply count | ~${SEAT_TARGET} seats | ${totalSeats} | ${now} |`);
  console.log(`| \`${SOFT_OPENING_TAG}\` tag count | match reply count | ${tagged.length} | ${now} |`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
