import "dotenv/config";
import fs from "fs";
import path from "path";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

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

type ContactsResponse = {
  contacts?: GhlContact[];
  meta?: {
    total?: number;
    startAfterId?: string;
    startAfter?: string | number;
    nextPageUrl?: string;
  };
};

const HARVEST_TAGS = [
  "harvest-website",
  "harvest-newsletter",
  "harvest-member",
  "harvest-event-attendee",
  "harvest-shop-interest",
  "witta-gathering-2026-06-20",
  "newsletter",
  "photo-wall",
  "harvest-gathering-photos",
  "member-question",
  "contact-form",
  "event-submission",
  "business-registration",
  "pulse-respondent",
  "venue-enquiry",
  "workshop-booking",
  "shop-produce",
  "shop-maker",
  "shop-food",
  "shop-consignment",
  "shop-follow-up",
  "interest-events",
  "interest-workshops",
  "interest-markets",
  "interest-venue",
  "interest-garden",
  "interest-food",
  "interest-community",
  "interest-volunteer",
  "interest-membership",
  "interest-sustainability",
  "quiz-completed",
  "quiz-regular",
  "quiz-maker",
  "quiz-gatherer",
  "quiz-grower",
  "quiz-explorer",
  "high-frequency",
  "community-builder",
  "workshop-interested",
  "hands-on-learner",
  "venue-interested",
  "event-host",
  "garden-interested",
  "plant-buyer",
  "first-timer",
  "curious-visitor",
  "harvest-needs-name-review",
  "harvest-duplicate-review",
];

const NAME_REVIEW_TAG = "harvest-needs-name-review";
const DUPLICATE_REVIEW_TAG = "harvest-duplicate-review";

function argValue(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || "";
}

function normalizePhone(phone?: string | null) {
  return phone?.replace(/[^\d+]/g, "") || "";
}

function maskEmail(email?: string | null) {
  const clean = normalizeEmail(email);
  if (!clean) return "";
  const [name, domain] = clean.split("@");
  if (!domain) return clean.slice(0, 2) + "***";
  return `${name.slice(0, 2)}***@${domain}`;
}

function hasName(contact: GhlContact) {
  return Boolean(contact.firstName?.trim() || contact.lastName?.trim());
}

function namePartsFromContact(contact: GhlContact) {
  const firstName = contact.firstName?.trim() || "";
  const lastName = contact.lastName?.trim() || "";
  return firstName ? { firstName, lastName: lastName || undefined } : null;
}

function namePartsFromContactName(contact: GhlContact) {
  const value = contact.contactName?.trim();
  if (!value || value.includes("@") || /\d{4,}/.test(value)) return null;
  if (["test", "unknown", "guest"].includes(value.toLowerCase())) return null;

  const parts = value.split(/\s+/).filter(Boolean);
  if (!parts.length) return null;
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ") || undefined,
  };
}

function isHarvestContact(contact: GhlContact) {
  const tags = new Set(contact.tags ?? []);
  if (HARVEST_TAGS.some((tag) => tags.has(tag))) return true;
  const source = contact.source?.toLowerCase() ?? "";
  return source.includes("harvest") || source.includes("witta gathering") || source.includes("garden launch");
}

function plannedTagRefresh(contact: GhlContact) {
  const tags = new Set(contact.tags ?? []);
  const add = new Set<string>();

  if ((tags.has("newsletter") && tags.has("harvest-website")) || tags.has("harvest-newsletter")) {
    add.add("newsletter");
    add.add("harvest-newsletter");
    add.add("harvest-website");
  }

  if (tags.has("interest-membership") || tags.has("harvest-member")) {
    add.add("harvest-member");
    add.add("harvest-newsletter");
    add.add("newsletter");
    add.add("harvest-website");
    add.add("interest-membership");
  }

  return Array.from(add).filter((tag) => !tags.has(tag));
}

function plannedReviewTags(contact: GhlContact) {
  if (hasName(contact)) return [];
  const tags = new Set(contact.tags ?? []);
  return tags.has(NAME_REVIEW_TAG) ? [] : [NAME_REVIEW_TAG];
}

function buildDuplicateReviewPlan(harvestContacts: GhlContact[]) {
  const byId = new Map<string, GhlContact>();
  for (const [, group] of groupedDuplicates(harvestContacts, (contact) => normalizeEmail(contact.email))) {
    for (const contact of group) byId.set(contact.id, contact);
  }
  for (const [, group] of groupedDuplicates(harvestContacts, (contact) => normalizePhone(contact.phone))) {
    for (const contact of group) byId.set(contact.id, contact);
  }

  return Array.from(byId.values())
    .map((contact) => {
      const tags = new Set(contact.tags ?? []);
      return {
        contact,
        addTags: tags.has(DUPLICATE_REVIEW_TAG) ? [] : [DUPLICATE_REVIEW_TAG],
      };
    })
    .filter((item) => item.addTags.length > 0);
}

function buildNameBackfillPlan(harvestContacts: GhlContact[]) {
  const groups = groupedDuplicates(harvestContacts, (contact) => normalizeEmail(contact.email));
  const sourceByEmail = new Map<string, { firstName: string; lastName?: string; source: string }>();

  for (const [email, group] of groups) {
    const sourceContact = group.find((contact) => namePartsFromContact(contact));
    const sourceName = sourceContact ? namePartsFromContact(sourceContact) : null;
    if (sourceName && sourceContact) {
      sourceByEmail.set(email, {
        ...sourceName,
        source: `duplicate-email:${sourceContact.id}`,
      });
    }
  }

  return harvestContacts
    .filter((contact) => !hasName(contact))
    .map((contact) => {
      const fromContactName = namePartsFromContactName(contact);
      const fromDuplicate = sourceByEmail.get(normalizeEmail(contact.email));
      const candidate = fromContactName
        ? { ...fromContactName, source: "contactName" }
        : fromDuplicate;

      return candidate ? { contact, name: candidate } : null;
    })
    .filter((item): item is { contact: GhlContact; name: { firstName: string; lastName?: string; source: string } } => Boolean(item));
}

async function ghlFetch(pathname: string, init?: RequestInit) {
  const apiKey = requireEnv("GHL_API_KEY");
  const response = await fetch(`${GHL_API_BASE}${pathname}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      Version: GHL_API_VERSION,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GHL ${response.status}: ${body}`);
  }

  return response;
}

async function listContacts(maxContacts?: number) {
  const locationId = requireEnv("GHL_LOCATION_ID");
  const contacts: GhlContact[] = [];
  const limit = 100;
  let startAfterId: string | undefined;
  let startAfter: string | number | undefined;

  while (!maxContacts || contacts.length < maxContacts) {
    const params = new URLSearchParams({
      locationId,
      limit: String(limit),
    });
    if (startAfterId) params.set("startAfterId", startAfterId);
    if (startAfter) params.set("startAfter", String(startAfter));

    const response = await ghlFetch(`/contacts/?${params.toString()}`);
    const data = (await response.json()) as ContactsResponse;
    const page = data.contacts ?? [];
    contacts.push(...page);

    if (page.length < limit) break;
    startAfterId = data.meta?.startAfterId ?? page.at(-1)?.id;
    startAfter = data.meta?.startAfter;
    if (!startAfterId) break;
  }

  return maxContacts ? contacts.slice(0, maxContacts) : contacts;
}

async function addTags(contactId: string, tags: string[]) {
  await ghlFetch(`/contacts/${contactId}/tags`, {
    method: "POST",
    body: JSON.stringify({ tags }),
  });
}

async function updateContactName(contactId: string, name: { firstName: string; lastName?: string }) {
  await ghlFetch(`/contacts/${contactId}`, {
    method: "PUT",
    body: JSON.stringify({
      firstName: name.firstName,
      lastName: name.lastName,
    }),
  });
}

function groupedDuplicates(contacts: GhlContact[], keyFor: (contact: GhlContact) => string) {
  const groups = new Map<string, GhlContact[]>();
  for (const contact of contacts) {
    const key = keyFor(contact);
    if (!key) continue;
    const group = groups.get(key) ?? [];
    group.push(contact);
    groups.set(key, group);
  }
  return Array.from(groups.entries()).filter(([, group]) => group.length > 1);
}

async function main() {
  const applyTags = process.argv.includes("--apply-tags");
  const applyNameBackfill = process.argv.includes("--apply-name-backfill");
  const applyReviewTags = process.argv.includes("--apply-review-tags");
  const writeJson = process.argv.includes("--write-json");
  const maxContacts = Number(argValue("--limit") ?? "0") || undefined;
  const outputPath = argValue("--output") ?? "research/data/ghl-harvest-contact-audit.json";

  const contacts = await listContacts(maxContacts);
  const harvestContacts = contacts.filter(isHarvestContact);
  const missingNames = harvestContacts.filter((contact) => !hasName(contact));
  const emailDuplicates = groupedDuplicates(contacts, (contact) => normalizeEmail(contact.email));
  const harvestEmailDuplicates = groupedDuplicates(harvestContacts, (contact) => normalizeEmail(contact.email));
  const phoneDuplicates = groupedDuplicates(contacts, (contact) => normalizePhone(contact.phone));
  const harvestPhoneDuplicates = groupedDuplicates(harvestContacts, (contact) => normalizePhone(contact.phone));

  const tagCounts = new Map<string, number>();
  for (const contact of harvestContacts) {
    for (const tag of contact.tags ?? []) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const refreshPlan = harvestContacts
    .map((contact) => ({ contact, addTags: plannedTagRefresh(contact) }))
    .filter((item) => item.addTags.length > 0);
  const reviewTagPlan = harvestContacts
    .map((contact) => ({ contact, addTags: plannedReviewTags(contact) }))
    .filter((item) => item.addTags.length > 0);
  const duplicateReviewTagPlan = buildDuplicateReviewPlan(harvestContacts);
  const nameBackfillPlan = buildNameBackfillPlan(harvestContacts);

  if (applyTags) {
    for (const item of refreshPlan) {
      await addTags(item.contact.id, item.addTags);
    }
  }

  if (applyReviewTags) {
    for (const item of [...reviewTagPlan, ...duplicateReviewTagPlan]) {
      await addTags(item.contact.id, item.addTags);
    }
  }

  if (applyNameBackfill) {
    for (const item of nameBackfillPlan) {
      await updateContactName(item.contact.id, item.name);
    }
  }

  const report = {
    fetchedAt: new Date().toISOString(),
    scannedContacts: contacts.length,
    harvestContacts: harvestContacts.length,
    missingNameCount: missingNames.length,
    duplicateEmailGroupsAll: emailDuplicates.length,
    duplicateEmailGroupsHarvest: harvestEmailDuplicates.length,
    duplicatePhoneGroupsAll: phoneDuplicates.length,
    duplicatePhoneGroupsHarvest: harvestPhoneDuplicates.length,
    plannedTagRefreshes: refreshPlan.length,
    plannedNameBackfills: nameBackfillPlan.length,
    plannedReviewTags: reviewTagPlan.length,
    plannedDuplicateReviewTags: duplicateReviewTagPlan.length,
    appliedTagRefreshes: applyTags ? refreshPlan.length : 0,
    appliedNameBackfills: applyNameBackfill ? nameBackfillPlan.length : 0,
    appliedReviewTags: applyReviewTags ? reviewTagPlan.length : 0,
    appliedDuplicateReviewTags: applyReviewTags ? duplicateReviewTagPlan.length : 0,
    tagCounts: Object.fromEntries(Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1])),
    missingNames: missingNames.slice(0, 50).map((contact) => ({
      id: contact.id,
      email: maskEmail(contact.email),
      phone: contact.phone ? "***" + contact.phone.slice(-3) : undefined,
      source: contact.source,
      tags: contact.tags ?? [],
    })),
    nameBackfills: nameBackfillPlan.slice(0, 50).map((item) => ({
      id: item.contact.id,
      email: maskEmail(item.contact.email),
      firstName: item.name.firstName,
      hasLastName: Boolean(item.name.lastName),
      source: item.name.source,
    })),
    duplicateEmails: harvestEmailDuplicates.slice(0, 50).map(([email, group]) => ({
      email: maskEmail(email),
      contactIds: group.map((contact) => contact.id),
      sources: group.map((contact) => contact.source ?? ""),
      tagSets: group.map((contact) => contact.tags ?? []),
    })),
    duplicatePhones: harvestPhoneDuplicates.slice(0, 50).map(([, group]) => ({
      phone: "***" + normalizePhone(group[0]?.phone).slice(-3),
      contactIds: group.map((contact) => contact.id),
      emails: group.map((contact) => maskEmail(contact.email)),
      sources: group.map((contact) => contact.source ?? ""),
    })),
    duplicateEmailsAllSample: emailDuplicates.slice(0, 10).map(([email, group]) => ({
      email: maskEmail(email),
      contactIds: group.map((contact) => contact.id),
      sources: group.map((contact) => contact.source ?? ""),
    })),
  };

  console.log(JSON.stringify(report, null, 2));

  if (writeJson) {
    const absolutePath = path.resolve(outputPath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, `${JSON.stringify(report, null, 2)}\n`);
    console.error(`Wrote ${absolutePath}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
