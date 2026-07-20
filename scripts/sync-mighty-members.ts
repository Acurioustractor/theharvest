import dotenv from "dotenv";

dotenv.config({ path: ".env.local", override: true, quiet: true });
dotenv.config({ path: ".env", override: false, quiet: true });

/**
 * Monthly Mighty -> GHL member sweep.
 *
 * Mighty is the members page; people can join there without ever touching a
 * website form, so GHL never hears about them. This sweep pulls the Mighty
 * member list and makes sure every real member exists in GHL carrying the
 * member canon tags, so member sends and the daily check-in see them.
 *
 * Dry run by default (prints the plan, writes nothing).
 * `--apply` performs the GHL writes:
 *   - contacts already in GHL: ADD missing tags only (never removes tags)
 *   - contacts missing from GHL: create via upsert with the canon tags
 *
 * Staff/test records (@act.place, benjamin+) are always skipped.
 * Never writes to Mighty. Never triggers workflows (existing members should
 * not get the Member Welcome email).
 */

const MIGHTY_API_BASE = (process.env.MIGHTY_API_BASE_URL || "https://api.mn.co/admin/v1").replace(/\/$/, "");
const MIGHTY_NETWORK_ID = process.env.MIGHTY_NETWORK_ID || "harvest-the-network";
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const CANON_TAGS = [
  "tier:member",
  "interest:membership",
  "comms:harvest-newsletter",
  "platform:mighty-active",
  "project:act-hv",
  "harvest-website",
];

const SKIP_EMAIL_PATTERN = /@act\.place$|benjamin\+/i;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

type MightyMember = {
  id: number | string;
  email?: string;
  first_name?: string;
  last_name?: string;
  member_type?: string;
  created_at?: string;
};

async function fetchMightyMembers(): Promise<MightyMember[]> {
  const token = requireEnv("MIGHTY_API_TOKEN");
  const members: MightyMember[] = [];
  let url: string | null =
    `${MIGHTY_API_BASE}/networks/${encodeURIComponent(MIGHTY_NETWORK_ID)}/members?per_page=100`;

  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Mighty members fetch failed: ${res.status} ${await res.text()}`);
    const data = await res.json() as { items?: MightyMember[]; links?: { next?: string | null } };
    const items = data.items ?? [];
    members.push(...items);
    // Mighty returns a next link even for empty pages; stop when a page is empty.
    const next = items.length > 0 ? data.links?.next || null : null;
    url = next ? new URL(next, "https://api.mn.co").toString() : null;
  }
  return members;
}

async function findGHLContactByEmail(email: string): Promise<{ id: string; tags: string[] } | null> {
  const apiKey = requireEnv("GHL_API_KEY");
  const locationId = requireEnv("GHL_LOCATION_ID");
  const res = await fetch(
    `${GHL_API_BASE}/contacts/?locationId=${locationId}&query=${encodeURIComponent(email)}&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: GHL_API_VERSION,
        Accept: "application/json",
      },
    },
  );
  if (!res.ok) throw new Error(`GHL contact lookup failed for ${email}: ${res.status}`);
  const data = await res.json() as { contacts?: { id: string; email?: string; tags?: string[] }[] };
  const match = (data.contacts ?? []).find(
    (c) => (c.email || "").toLowerCase() === email.toLowerCase(),
  );
  return match ? { id: match.id, tags: (match.tags ?? []).map((t) => t.toLowerCase()) } : null;
}

async function addTags(contactId: string, tags: string[]): Promise<void> {
  const apiKey = requireEnv("GHL_API_KEY");
  const res = await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      Version: GHL_API_VERSION,
      Accept: "application/json",
    },
    body: JSON.stringify({ tags }),
  });
  if (!res.ok) throw new Error(`GHL add tags failed for ${contactId}: ${res.status}`);
}

async function createContact(member: MightyMember): Promise<string | null> {
  const apiKey = requireEnv("GHL_API_KEY");
  const locationId = requireEnv("GHL_LOCATION_ID");
  const res = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      Version: GHL_API_VERSION,
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: member.email,
      firstName: member.first_name || undefined,
      lastName: member.last_name || undefined,
      locationId,
      source: "Mighty | member sweep",
      tags: CANON_TAGS,
    }),
  });
  if (!res.ok) {
    console.error(`GHL create failed for ${member.email}: ${res.status} ${await res.text()}`);
    return null;
  }
  const data = await res.json() as { contact?: { id: string } };
  return data.contact?.id ?? null;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const members = await fetchMightyMembers();

  const plan = {
    mode: apply ? "apply" : "dry-run",
    mightyMembers: members.length,
    skippedStaffOrTest: [] as string[],
    noEmail: [] as string[],
    alreadyTagged: [] as string[],
    needTags: [] as { label: string; missing: string[] }[],
    missingFromGHL: [] as string[],
    applied: { tagged: 0, created: 0 },
  };

  for (const member of members) {
    // Light throttle: stay well inside GHL burst rate limits.
    await new Promise((resolve) => setTimeout(resolve, 150));
    const email = (member.email || "").trim();
    const label = `${member.first_name || ""} ${(member.last_name || "").slice(0, 1)}`.trim() || "(no name)";
    if (!email) {
      plan.noEmail.push(label);
      continue;
    }
    if (SKIP_EMAIL_PATTERN.test(email)) {
      plan.skippedStaffOrTest.push(label);
      continue;
    }

    const contact = await findGHLContactByEmail(email);
    if (!contact) {
      plan.missingFromGHL.push(label);
      if (apply) {
        const id = await createContact(member);
        if (id) plan.applied.created += 1;
      }
      continue;
    }

    const missing = CANON_TAGS.filter((t) => !contact.tags.includes(t.toLowerCase()));
    if (missing.length === 0) {
      plan.alreadyTagged.push(label);
    } else {
      plan.needTags.push({ label, missing });
      if (apply) {
        await addTags(contact.id, missing);
        plan.applied.tagged += 1;
      }
    }
  }

  console.log(JSON.stringify(plan, null, 2));
  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to create/tag in GHL.");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
