import "dotenv/config";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

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

type TestCase = {
  key: string;
  label: string;
  expectedSource: string;
  expectedTags: string[];
};

const TEST_CASES: TestCase[] = [
  {
    key: "member",
    label: "/membership member signup",
    expectedSource: "Harvest | Member Signup",
    expectedTags: ["harvest-member", "harvest-newsletter", "newsletter", "interest-membership", "harvest-website"],
  },
  {
    key: "footer",
    label: "Footer member signup",
    expectedSource: "Harvest | Footer Member Signup",
    expectedTags: ["harvest-member", "harvest-newsletter", "newsletter", "interest-membership", "interest-community", "harvest-website"],
  },
  {
    key: "question",
    label: "/membership question form",
    expectedSource: "Harvest | Member Question",
    expectedTags: ["member-question", "harvest-member", "harvest-newsletter", "interest-membership", "harvest-website"],
  },
  {
    key: "contact",
    label: "/contact general message",
    expectedSource: "Harvest | Contact",
    expectedTags: ["contact-form", "harvest-website"],
  },
  {
    key: "shop",
    label: "Shop interest section",
    expectedSource: "Harvest | Shop",
    expectedTags: ["project:act-hv", "interest:markets", "role:supplier", "shop-produce", "shop-follow-up", "shop-stage-1"],
  },
];

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function todayInBrisbane(): string {
  const now = new Date();
  const brisbane = new Date(now.getTime() + 10 * 60 * 60 * 1000);
  return brisbane.toISOString().slice(0, 10);
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

async function findContactByEmail(email: string): Promise<GhlContact | null> {
  const locationId = requireEnv("GHL_LOCATION_ID");
  let nextPageUrl: string | undefined = `/contacts?locationId=${locationId}&limit=100`;
  const lowerEmail = email.toLowerCase();
  for (let page = 0; page < 30 && nextPageUrl; page += 1) {
    const path = nextPageUrl.startsWith("http")
      ? nextPageUrl.replace(GHL_API_BASE, "")
      : nextPageUrl;
    const data = await ghlJson<{ contacts?: GhlContact[]; meta?: { nextPageUrl?: string } }>(path);
    const contacts = data.contacts ?? [];
    const match = contacts.find((c) => (c.email ?? "").toLowerCase() === lowerEmail);
    if (match) return match;
    nextPageUrl = data.meta?.nextPageUrl ?? undefined;
  }
  return null;
}

function diffTags(expected: string[], actual: string[]): { missing: string[]; extra: string[] } {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  const missing = expected.filter((t) => !actualSet.has(t));
  const extra = actual.filter((t) => !expectedSet.has(t));
  return { missing, extra };
}

async function main() {
  const date = argValue("--date") || todayInBrisbane();
  const pattern = argValue("--pattern") || `benjamin+harvest-test-{key}-${date}@act.place`;

  console.log(`# Form-test verification — ${date}`);
  console.log(`Email pattern: \`${pattern}\``);
  console.log();

  let passCount = 0;
  const cleanup: Array<{ key: string; id: string; email: string }> = [];

  for (const testCase of TEST_CASES) {
    const email = pattern.replace("{key}", testCase.key);
    console.log(`## ${testCase.label}`);
    console.log(`Email: \`${email}\``);

    const contact = await findContactByEmail(email);
    if (!contact) {
      console.log(`  Result: **NOT FOUND** — submission did not land in GHL`);
      console.log();
      continue;
    }

    cleanup.push({ key: testCase.key, id: contact.id, email });

    const sourceMatch = contact.source === testCase.expectedSource;
    const actualTags = contact.tags ?? [];
    const tagDiff = diffTags(testCase.expectedTags, actualTags);
    const tagsPass = tagDiff.missing.length === 0;
    const pass = sourceMatch && tagsPass;

    console.log(`  Contact ID: \`${contact.id}\``);
    console.log(`  Date added: ${contact.dateAdded ?? "—"}`);
    console.log(`  Source: \`${contact.source ?? "—"}\` ${sourceMatch ? "✓" : "✗ expected `" + testCase.expectedSource + "`"}`);
    console.log(`  Tags (${actualTags.length}): ${actualTags.join(", ") || "—"}`);
    if (tagDiff.missing.length > 0) {
      console.log(`    ✗ MISSING expected tags: ${tagDiff.missing.join(", ")}`);
    }
    if (tagDiff.extra.length > 0) {
      console.log(`    + extra tags (informational): ${tagDiff.extra.join(", ")}`);
    }
    console.log(`  Result: ${pass ? "**PASS**" : "**FAIL**"}`);
    console.log();

    if (pass) passCount += 1;
  }

  console.log(`---`);
  console.log(`## Summary`);
  console.log(`${passCount} of ${TEST_CASES.length} forms passed.`);
  console.log();

  if (cleanup.length > 0) {
    console.log(`## Cleanup hint`);
    console.log(`Open GHL and delete (or tag for batch delete) these test contacts:`);
    for (const c of cleanup) {
      console.log(`- \`${c.id}\` — ${c.email} (${c.key})`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
