import "dotenv/config";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";
const MIGRATION_TAG = "member-migrated-from-newsletter-2026-05-15";
const REVIEW_TAG = "member-migration-review-2026-05-15";

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
  dnd?: boolean | null;
};

type ContactsResponse = {
  contacts?: GhlContact[];
  meta?: {
    startAfterId?: string;
    startAfter?: string | number;
  };
};

function hasFlag(name: string) {
  return process.argv.includes(name);
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function contactName(contact: GhlContact) {
  return contact.contactName || [contact.firstName, contact.lastName].filter(Boolean).join(" ") || contact.email || "Unknown";
}

function isTestContact(contact: GhlContact) {
  const email = contact.email?.toLowerCase() ?? "";
  return email.includes("benjamin+") || email.includes("@act.place");
}

function hasUsableIdentity(contact: GhlContact) {
  return Boolean(contact.email && contactName(contact) && !contactName(contact).includes("@"));
}

async function ghlFetch(pathname: string, init?: RequestInit) {
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

  return response;
}

async function listContacts() {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const contacts: GhlContact[] = [];
  let startAfterId: string | undefined;
  let startAfter: string | number | undefined;

  while (true) {
    const params = new URLSearchParams({ locationId, limit: "100" });
    if (startAfterId) params.set("startAfterId", startAfterId);
    if (startAfter) params.set("startAfter", String(startAfter));

    const response = await ghlFetch(`/contacts?${params.toString()}`);
    const data = (await response.json()) as ContactsResponse;
    const page = data.contacts ?? [];
    contacts.push(...page);

    if (page.length < 100) break;
    startAfterId = data.meta?.startAfterId ?? page.at(-1)?.id;
    startAfter = data.meta?.startAfter;
    if (!startAfterId) break;
  }

  return contacts;
}

async function addTags(contactId: string, tags: string[]) {
  await ghlFetch(`/contacts/${contactId}/tags`, {
    method: "POST",
    body: JSON.stringify({ tags }),
  });
}

async function addNote(contact: GhlContact) {
  await ghlFetch(`/contacts/${contact.id}/notes`, {
    method: "POST",
    body: JSON.stringify({
      body: [
        "**Membership migration review**",
        "",
        "Prepared from the initial Harvest newsletter list for migration to the free Harvest member list.",
        "",
        `Original source: ${contact.source || "Unknown"}`,
        `Original tags: ${(contact.tags ?? []).join(", ") || "None"}`,
        "",
        "No old tags were removed. Confirm in GHL before sending the migration email.",
      ].join("\n"),
    }),
  });
}

async function main() {
  const apply = hasFlag("--apply");
  const contacts = await listContacts();
  const newsletterOnly = contacts.filter((contact) => {
    const tags = new Set(contact.tags ?? []);
    return tags.has("harvest-newsletter") && !tags.has("harvest-member");
  });

  const excluded = newsletterOnly.filter((contact) => isTestContact(contact) || contact.dnd || !hasUsableIdentity(contact));
  const candidates = newsletterOnly.filter((contact) => !excluded.includes(contact));

  console.log("Harvest newsletter-to-member migration prep");
  console.log(`Mode: ${apply ? "apply" : "dry-run"}`);
  console.log(`Newsletter-only contacts: ${newsletterOnly.length}`);
  console.log(`Candidates for review tag: ${candidates.length}`);
  console.log(`Excluded: ${excluded.length}`);
  console.log("");

  console.log("Candidates:");
  for (const contact of candidates) {
    console.log(`- ${contactName(contact)} <${contact.email}> source=${contact.source || "unknown"}`);
    if (apply) {
      await addTags(contact.id, [REVIEW_TAG]);
      await addNote(contact);
    }
  }

  if (excluded.length > 0) {
    console.log("");
    console.log("Excluded:");
    for (const contact of excluded) {
      const reason = isTestContact(contact)
        ? "test/contact owned by ACT"
        : contact.dnd
          ? "DND/unsubscribed"
          : "missing usable name/email";
      console.log(`- ${contactName(contact)} <${contact.email || "no email"}> reason=${reason}`);
    }
  }

  console.log("");
  if (apply) {
    console.log(`Added review tag ${REVIEW_TAG} and review note to ${candidates.length} contacts.`);
    console.log("Next GHL check: Contacts smart list tag=member-migration-review-2026-05-15.");
  } else {
    console.log("Run with --apply to add the review tag and notes. This does not add member tags or send email.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
