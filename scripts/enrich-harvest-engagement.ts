import { Client } from "@notionhq/client";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import { promises as fs } from "fs";
import path from "path";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

const HARVEST_ENGAGEMENT_DS_ID =
  process.env.HARVEST_ENGAGEMENT_DS_ID || "355ebcf9-81cf-806b-a4db-000bcb31d57a";
const CACHE_DIR = path.resolve("research/.cache/engagement-enrichment");
const REPORT_PATH = path.resolve("research/data/harvest-engagement-enrichment-report.json");
const WITTA_LAT_LNG = "-26.743,152.827";
const SEARCH_RADIUS_METRES = 45_000;
const BLOCKED_EMAIL_DOMAINS = new Set([
  "example.com",
  "mysite.com",
  "sentry.io",
  "wixpress.com",
  "wix.com",
]);
const AGGREGATOR_HOST_MARKERS = [
  "booking.com",
  "expedia.",
  "agoda.",
  "hotels.com",
  "tripadvisor.",
  "airbnb.",
  "stayz.",
  "vrbo.",
  "wotif.",
  "kayak.",
  "trivago.",
  "vio.com",
  "deals.vio.com",
];
const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.com.au",
  "outlook.com",
  "outlook.com.au",
  "live.com",
  "live.com.au",
  "msn.com",
  "yahoo.com",
  "yahoo.com.au",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "bigpond.com",
  "bigpond.com.au",
  "bigpond.net.au",
  "telstra.com",
  "optusnet.com.au",
  "iinet.net.au",
  "iinet.com.au",
  "westnet.com.au",
  "ozemail.com.au",
  "tpg.com.au",
  "internode.on.net",
  "dodo.com.au",
  "iprimus.com.au",
  "netspace.net.au",
  "fastmail.com",
  "mail.com",
  "gmx.com",
  "aol.com",
]);
const PERSONAL_EMAIL_DOMAIN_LABELS = new Set([
  "gmail",
  "googlemail",
  "hotmail",
  "outlook",
  "live",
  "msn",
  "yahoo",
  "ymail",
  "icloud",
  "me",
  "mac",
  "proton",
  "protonmail",
  "pm",
  "bigpond",
  "telstra",
  "optusnet",
  "iinet",
  "westnet",
  "ozemail",
  "tpg",
  "internode",
  "dodo",
  "iprimus",
  "netspace",
  "fastmail",
  "mail",
  "gmx",
  "aol",
]);
const DOMAIN_NAME_WORDS = [
  "accommodation",
  "construction",
  "consulting",
  "properties",
  "restaurant",
  "electrical",
  "community",
  "whispering",
  "landcare",
  "cottages",
  "brewery",
  "finance",
  "gallery",
  "kitchen",
  "nursery",
  "markets",
  "market",
  "studio",
  "design",
  "cheese",
  "valley",
  "dairy",
  "foods",
  "food",
  "arts",
  "farm",
  "cafe",
];
const GOOGLE_DETAILS_FIELDS = [
  "name",
  "formatted_address",
  "formatted_phone_number",
  "international_phone_number",
  "geometry",
  "opening_hours",
  "place_id",
  "rating",
  "types",
  "url",
  "user_ratings_total",
  "business_status",
  "website",
].join(",");

type SelectName =
  | "Matched"
  | "Partial"
  | "Needs review"
  | "No match"
  | "Error";

interface CliOptions {
  apply: boolean;
  emailDomain: boolean;
  limit: number;
  only: string;
  recheck: boolean;
  hunter: boolean;
  abn: boolean;
  skipWebsite: boolean;
}

interface HarvestRecord {
  id: string;
  name: string;
  type: string;
  location: string;
  phone: string;
  email: string;
  publicEmail: string;
  website: string;
  organisation: string;
  nextAction: string;
  sourceUrls: string;
  enrichmentNotes: string;
  enrichmentStatus: string;
  tags: string[];
  source: string[];
  dataQuality: string[];
  rawPage: any;
}

interface GoogleTextSearchResponse {
  results?: GoogleTextSearchResult[];
  status: string;
  error_message?: string;
}

interface GoogleTextSearchResult {
  formatted_address?: string;
  geometry?: { location?: { lat?: number; lng?: number } };
  name: string;
  place_id: string;
  rating?: number;
  types?: string[];
  user_ratings_total?: number;
  business_status?: string;
}

interface GoogleDetailsResponse {
  result?: GooglePlaceDetails;
  status: string;
  error_message?: string;
}

interface GooglePlaceDetails {
  business_status?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  geometry?: { location?: { lat?: number; lng?: number } };
  international_phone_number?: string;
  name: string;
  opening_hours?: { weekday_text?: string[] };
  place_id: string;
  rating?: number;
  types?: string[];
  url?: string;
  user_ratings_total?: number;
  website?: string;
}

interface WebsiteCrawl {
  title: string;
  description: string;
  emails: string[];
  contactFormUrl: string;
  instagram: string;
  facebook: string;
  linkedIn: string;
  sourceUrls: string[];
  error?: string;
}

interface EnrichmentResult {
  pageId: string;
  name: string;
  type: string;
  status: SelectName;
  confidence: number;
  googleName?: string;
  googleAddress?: string;
  website?: string;
  phone?: string;
  publicEmail?: string;
  contactFormUrl?: string;
  sourceUrls: string[];
  notes: string;
  applied: boolean;
  error?: string;
}

function parseOptions(): CliOptions {
  const args = process.argv.slice(2);
  const valueAfter = (name: string): string => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] || "" : "";
  };

  return {
    apply: args.includes("--apply"),
    emailDomain: args.includes("--email-domain"),
    limit: Number(valueAfter("--limit") || "0"),
    only: valueAfter("--only").toLowerCase(),
    recheck: args.includes("--recheck"),
    hunter: args.includes("--hunter"),
    abn: args.includes("--abn"),
    skipWebsite: args.includes("--skip-website"),
  };
}

function assertEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(pty|ltd|inc|the|and|co|company|australia|qld|queensland)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 2);
}

function propertyTitle(page: any, property: string): string {
  const prop = page.properties?.[property];
  return prop?.type === "title" ? prop.title.map((text: any) => text.plain_text || "").join("") : "";
}

function propertyText(page: any, property: string): string {
  const prop = page.properties?.[property];
  if (!prop) return "";
  if (prop.type === "rich_text") return prop.rich_text.map((text: any) => text.plain_text || "").join("");
  if (prop.type === "email") return prop.email || "";
  if (prop.type === "phone_number") return prop.phone_number || "";
  if (prop.type === "url") return prop.url || "";
  return "";
}

function propertySelect(page: any, property: string): string {
  const prop = page.properties?.[property];
  return prop?.type === "select" ? prop.select?.name || "" : "";
}

function propertyMultiSelect(page: any, property: string): string[] {
  const prop = page.properties?.[property];
  return prop?.type === "multi_select" ? prop.multi_select.map((item: any) => item.name).filter(Boolean) : [];
}

function unique(values: Array<string | undefined | null>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value && value.trim())).map((value) => value.trim()))];
}

function truncate(value: string, max = 1900): string {
  return value.length <= max ? value : `${value.slice(0, max - 3)}...`;
}

function asRichText(value: string) {
  return { type: "rich_text", rich_text: [{ text: { content: truncate(value) } }] };
}

function asSelect(name: string) {
  return { type: "select", select: { name } };
}

function asMultiSelect(names: string[]) {
  return { type: "multi_select", multi_select: unique(names).map((name) => ({ name })) };
}

function cleanUrl(value: string): string {
  try {
    const parsed = new URL(value);
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return "";
  }
}

function emailDomain(email: string): string {
  const domain = email.toLowerCase().split("@")[1] || "";
  return domain.replace(/^www\./, "").trim();
}

function isPersonalEmailDomain(domain: string): boolean {
  const label = domain.split(".")[0] || "";
  return PERSONAL_EMAIL_DOMAINS.has(domain) || PERSONAL_EMAIL_DOMAIN_LABELS.has(label);
}

function titleCaseWords(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function wordsFromDomainLabel(label: string): string {
  let value = label.replace(/[-_]+/g, " ").trim();
  for (const word of DOMAIN_NAME_WORDS) {
    value = value.replace(new RegExp(`(?<!\\s)${word}(?=\\s|$)`, "gi"), ` ${word}`);
  }
  return value.replace(/\s+/g, " ").trim();
}

function titleCaseFromDomain(domain: string, personName = ""): string {
  const label = domain.split(".")[0] || "";
  const compressedPersonName = personName.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const compressedLabel = label.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const personWords = personName
    .split(/[^a-z0-9]+/gi)
    .filter((word) => word.length > 2 && compressedLabel.includes(word.toLowerCase()));

  if (compressedPersonName && compressedLabel.startsWith(compressedPersonName) && compressedLabel.length > compressedPersonName.length) {
    const suffix = wordsFromDomainLabel(compressedLabel.slice(compressedPersonName.length));
    return titleCaseWords(`${personName} ${suffix}`);
  }

  if (personWords.length >= 2) return titleCaseWords(personWords.join(" "));

  return titleCaseWords(wordsFromDomainLabel(label));
}

function isUsefulEmail(email: string, website: string): boolean {
  const lower = email.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower)) return false;
  if (/\.(png|jpg|jpeg|gif|webp|svg|pdf)$/i.test(lower)) return false;
  const domain = lower.split("@")[1];
  if (BLOCKED_EMAIL_DOMAINS.has(domain)) return false;
  if (!website) return true;

  try {
    const host = new URL(website).hostname.replace(/^www\./, "");
    return domain === host || domain.endsWith(`.${host}`) || /^(info|hello|admin|contact|bookings|enquiries|sales|office)@/.test(lower);
  } catch {
    return true;
  }
}

function isBlockedWebsite(value: string): boolean {
  if (!value) return false;
  try {
    const host = new URL(value).hostname.replace(/^www\./, "").toLowerCase();
    return AGGREGATOR_HOST_MARKERS.some((marker) => host === marker || host.endsWith(`.${marker}`) || host.includes(marker));
  } catch {
    return true;
  }
}

function addressLooksLocal(address: string): boolean {
  const padded = ` ${address.toLowerCase()} `;
  return padded.includes(" qld ") || padded.includes("queensland") || padded.includes("australia");
}

function isLikelyAustralianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return false;
  if (digits.startsWith("61")) return digits.length >= 10 && digits.length <= 12;
  if (digits.startsWith("04")) return digits.length === 10;
  if (digits.startsWith("07")) return digits.length === 10;
  if (digits.startsWith("1300") || digits.startsWith("1800")) return digits.length === 10;
  return false;
}

async function cachedJson<T>(url: string, cacheKey: string, ttlHours = 24): Promise<T> {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const file = path.join(CACHE_DIR, `${cacheKey}.json`);

  try {
    const stat = await fs.stat(file);
    const ageHours = (Date.now() - stat.mtimeMs) / 3_600_000;
    if (ageHours < ttlHours) {
      return JSON.parse(await fs.readFile(file, "utf8")) as T;
    }
  } catch {
    // Cache miss.
  }

  const response = await fetch(url, { headers: { "User-Agent": "TheHarvestEnrichment/1.0" } });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${new URL(url).origin}`);
  const json = (await response.json()) as T;
  await fs.writeFile(file, JSON.stringify(json, null, 2));
  await sleep(250);
  return json;
}

async function cachedText(url: string, cacheKey: string, ttlHours = 168): Promise<string> {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const file = path.join(CACHE_DIR, `${cacheKey}.html`);

  try {
    const stat = await fs.stat(file);
    const ageHours = (Date.now() - stat.mtimeMs) / 3_600_000;
    if (ageHours < ttlHours) return fs.readFile(file, "utf8");
  } catch {
    // Cache miss.
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": "TheHarvestEnrichment/1.0 (+https://www.theharvestwitta.com.au/)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) throw new Error(`Non-HTML response for ${url}`);

  const html = await response.text();
  await fs.writeFile(file, html);
  await sleep(400);
  return html;
}

function cacheSlug(value: string): string {
  return Buffer.from(value).toString("base64url").slice(0, 90);
}

async function queryHarvestRecords(notion: Client, options: CliOptions): Promise<HarvestRecord[]> {
  const records: HarvestRecord[] = [];
  let startCursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: HARVEST_ENGAGEMENT_DS_ID,
      filter: options.emailDomain
        ? undefined
        : {
            or: [
              { property: "Type", select: { equals: "Business" } },
              { property: "Type", select: { equals: "Organisation" } },
            ],
          },
      start_cursor: startCursor,
      page_size: 100,
    } as any);

    for (const page of response.results) {
      const name = propertyTitle(page, "Name");
      if (!name) continue;
      if (options.only && !name.toLowerCase().includes(options.only)) continue;

      const enrichmentStatus = propertySelect(page, "Enrichment Status");
      if (!options.recheck && ["Matched", "Partial"].includes(enrichmentStatus)) continue;

      records.push({
        id: (page as any).id,
        name,
        type: propertySelect(page, "Type"),
        location: propertyText(page, "Location"),
        phone: propertyText(page, "Phone"),
        email: propertyText(page, "Email"),
        publicEmail: propertyText(page, "Public Email"),
        website: propertyText(page, "Website"),
        organisation: propertyText(page, "Organisation"),
        nextAction: propertyText(page, "Next Action"),
        sourceUrls: propertyText(page, "Source URLs"),
        enrichmentNotes: propertyText(page, "Enrichment Notes"),
        enrichmentStatus,
        tags: propertyMultiSelect(page, "Tags"),
        source: propertyMultiSelect(page, "Source"),
        dataQuality: propertyMultiSelect(page, "Data Quality"),
        rawPage: page,
      });
    }

    startCursor = response.has_more ? response.next_cursor || undefined : undefined;
  } while (startCursor);

  return records;
}

function buildGoogleQuery(record: HarvestRecord): string {
  const placeHint = record.location || "Witta Maleny Sunshine Coast Hinterland Queensland";
  return `${record.name} ${placeHint} QLD Australia`;
}

function placeScore(record: HarvestRecord, place: GoogleTextSearchResult | GooglePlaceDetails): number {
  const recordName = normalize(record.name);
  const placeName = normalize(place.name || "");
  const recordTokens = tokens(record.name);
  const placeTokens = tokens(place.name || "");
  let score = 0;

  if (recordName && placeName && (recordName === placeName || recordName.includes(placeName) || placeName.includes(recordName))) {
    score += 0.48;
  }

  const overlap = recordTokens.filter((token) => placeTokens.includes(token)).length;
  if (recordTokens.length) score += Math.min(0.26, (overlap / recordTokens.length) * 0.26);

  const address = (place.formatted_address || "").toLowerCase();
  const location = record.location.toLowerCase();
  for (const locality of ["witta", "maleny", "montville", "mapleton", "flaxton", "kenilworth", "sunshine coast"]) {
    if ((location.includes(locality) || record.name.toLowerCase().includes(locality)) && address.includes(locality)) {
      score += 0.16;
      break;
    }
  }

  if (place.business_status === "OPERATIONAL") score += 0.05;
  if (place.rating || place.user_ratings_total) score += 0.05;
  if (place.formatted_address && !addressLooksLocal(place.formatted_address)) score = Math.min(score, 0.42);

  return Math.min(1, Number(score.toFixed(2)));
}

async function fetchGooglePlace(record: HarvestRecord, apiKey: string): Promise<{ place?: GooglePlaceDetails; confidence: number; status: SelectName; error?: string }> {
  const query = buildGoogleQuery(record);
  const searchUrl = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  searchUrl.searchParams.set("query", query);
  searchUrl.searchParams.set("location", WITTA_LAT_LNG);
  searchUrl.searchParams.set("radius", String(SEARCH_RADIUS_METRES));
  searchUrl.searchParams.set("key", apiKey);

  const search = await cachedJson<GoogleTextSearchResponse>(
    searchUrl.toString(),
    `google-search-${cacheSlug(query)}`,
  );

  if (search.status !== "OK" || !search.results?.length) {
    return { confidence: 0, status: "No match", error: search.error_message || search.status };
  }

  const ranked = search.results
    .slice(0, 5)
    .map((result) => ({ result, score: placeScore(record, result) }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best || best.score < 0.38) {
    return { confidence: best?.score || 0, status: "No match", error: `Low-confidence search result: ${best?.result.name || "none"}` };
  }

  const detailsUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  detailsUrl.searchParams.set("place_id", best.result.place_id);
  detailsUrl.searchParams.set("fields", GOOGLE_DETAILS_FIELDS);
  detailsUrl.searchParams.set("key", apiKey);

  const details = await cachedJson<GoogleDetailsResponse>(
    detailsUrl.toString(),
    `google-details-${best.result.place_id}`,
  );

  if (details.status !== "OK" || !details.result) {
    return { confidence: best.score, status: "Partial", error: details.error_message || details.status };
  }

  const confidence = placeScore(record, details.result);
  return {
    place: details.result,
    confidence,
    status: confidence >= 0.62 ? "Matched" : "Needs review",
  };
}

function absoluteUrl(base: string, href: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return "";
  }
}

function socialLink($: cheerio.CheerioAPI, host: string): string {
  const href = $(`a[href*="${host}"]`).first().attr("href") || "";
  return cleanUrl(href);
}

function extractEmails(text: string, website: string): string[] {
  const matches = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  return unique(matches.map((email) => email.toLowerCase())).filter((email) => isUsefulEmail(email, website));
}

function parseWebsitePage(baseUrl: string, html: string): Omit<WebsiteCrawl, "sourceUrls"> {
  const $ = cheerio.load(html);
  const bodyText = $("body").text();
  const mailtoEmails = $("a[href^='mailto:']")
    .map((_, element) => ($(element).attr("href") || "").replace(/^mailto:/i, "").split("?")[0])
    .get();
  const emails = unique([...mailtoEmails, ...extractEmails(bodyText, baseUrl)]).filter((email) => isUsefulEmail(email, baseUrl));
  const contactLinks = $("a")
    .map((_, element) => {
      const href = $(element).attr("href") || "";
      const label = $(element).text().toLowerCase();
      if (!href) return "";
      if (!/(contact|enquir|inquir|book|visit|connect)/i.test(`${href} ${label}`)) return "";
      const url = cleanUrl(absoluteUrl(baseUrl, href));
      if (!url) return "";
      try {
        return new URL(url).hostname === new URL(baseUrl).hostname ? url : "";
      } catch {
        return "";
      }
    })
    .get()
    .filter(Boolean);

  return {
    title: truncate($("title").first().text().trim(), 240),
    description: truncate(
      ($("meta[name='description']").attr("content") || $("meta[property='og:description']").attr("content") || "").trim(),
      500,
    ),
    emails,
    contactFormUrl: cleanUrl(contactLinks[0] || ""),
    instagram: socialLink($, "instagram.com"),
    facebook: socialLink($, "facebook.com"),
    linkedIn: socialLink($, "linkedin.com"),
  };
}

async function crawlWebsite(website: string): Promise<WebsiteCrawl> {
  const url = cleanUrl(website);
  if (!url) {
    return { title: "", description: "", emails: [], contactFormUrl: "", instagram: "", facebook: "", linkedIn: "", sourceUrls: [], error: "Invalid website URL" };
  }

  try {
    const homeHtml = await cachedText(url, `website-home-${cacheSlug(url)}`);
    const home = parseWebsitePage(url, homeHtml);
    const sourceUrls = [url];

    let merged = home;
    if (home.contactFormUrl && home.contactFormUrl !== url) {
      try {
        const contactHtml = await cachedText(home.contactFormUrl, `website-contact-${cacheSlug(home.contactFormUrl)}`);
        const contact = parseWebsitePage(home.contactFormUrl, contactHtml);
        sourceUrls.push(home.contactFormUrl);
        merged = {
          title: home.title || contact.title,
          description: home.description || contact.description,
          emails: unique([...home.emails, ...contact.emails]),
          contactFormUrl: home.contactFormUrl || contact.contactFormUrl,
          instagram: home.instagram || contact.instagram,
          facebook: home.facebook || contact.facebook,
          linkedIn: home.linkedIn || contact.linkedIn,
        };
      } catch {
        // A failed contact page should not discard useful homepage details.
      }
    }

    return { ...merged, sourceUrls: unique(sourceUrls) };
  } catch (error) {
    return {
      title: "",
      description: "",
      emails: [],
      contactFormUrl: "",
      instagram: "",
      facebook: "",
      linkedIn: "",
      sourceUrls: [url],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function fetchHunterGenericEmail(domain: string, apiKey: string): Promise<string> {
  const url = new URL("https://api.hunter.io/v2/domain-search");
  url.searchParams.set("domain", domain);
  url.searchParams.set("type", "generic");
  url.searchParams.set("limit", "10");
  url.searchParams.set("api_key", apiKey);

  const result = await cachedJson<any>(url.toString(), `hunter-domain-${cacheSlug(domain)}`, 168);
  const emails = Array.isArray(result?.data?.emails) ? result.data.emails : [];
  const best = emails
    .filter((email: any) => email?.type === "generic" && typeof email.value === "string")
    .sort((a: any, b: any) => (b.confidence || 0) - (a.confidence || 0))[0];

  return best?.value || "";
}

function outreachChannel(email: string, phone: string, contactFormUrl: string, socials: string[]): string {
  if (email) return "Email";
  if (contactFormUrl) return "Contact form";
  if (phone) return "Phone";
  if (socials.some(Boolean)) return "Social";
  return "Manual review";
}

function consentBasis(email: string, contactFormUrl: string): string {
  if (email) return "Conspicuously published business contact";
  if (contactFormUrl) return "Contact form only";
  return "Manual review required";
}

async function crawlEmailDomainWebsite(domain: string): Promise<{ website: string; crawl?: WebsiteCrawl; error?: string }> {
  const candidates = [
    `https://${domain}/`,
    `https://www.${domain}/`,
    `http://${domain}/`,
    `http://www.${domain}/`,
  ];

  for (const candidate of candidates) {
    if (isBlockedWebsite(candidate)) continue;
    const crawl = await crawlWebsite(candidate);
    if (!crawl.error) return { website: cleanUrl(candidate), crawl };
  }

  return { website: "", error: "No reachable website found from email domain" };
}

function isGenericWebsiteTitle(value: string): boolean {
  return /^(home|official site|contact us|contact|coming soon|untitled|loading|one moment|index)$/i.test(value.trim())
    || /^[a-z0-9.-]+\.(com|com\.au|net|net\.au|org|org\.au|au)$/i.test(value.trim());
}

function organisationFromWebsite(domain: string, crawl?: WebsiteCrawl, personName = ""): string {
  const domainName = titleCaseFromDomain(domain, personName);
  const domainTokens = tokens(domainName);
  const titleParts = unique((crawl?.title || "").split(/\s+[|-]\s+/).map((part) => part.replace(/\s+/g, " ").trim()))
    .filter((part) => part.length >= 3 && part.length <= 100 && !isGenericWebsiteTitle(part));

  const tokenMatched = titleParts
    .map((part) => ({
      part,
      matches: domainTokens.filter((token) => normalize(part).includes(token)).length,
    }))
    .sort((a, b) => b.matches - a.matches || a.part.length - b.part.length)[0];

  if (tokenMatched?.matches) {
    return !/\s/.test(tokenMatched.part) && /\s/.test(domainName) ? domainName : tokenMatched.part;
  }

  const firstUsefulTitle = titleParts[0];
  if (firstUsefulTitle) return !/\s/.test(firstUsefulTitle) && /\s/.test(domainName) ? domainName : firstUsefulTitle;

  return domainName;
}

function shouldReplaceOrganisation(existing: string, next: string): boolean {
  if (!next) return false;
  if (!existing) return true;
  return /^[a-z0-9.-]+\.(com|com\.au|net|net\.au|org|org\.au|au)$/i.test(existing.trim());
}

async function enrichRecordFromEmailDomain(record: HarvestRecord, options: CliOptions): Promise<EnrichmentResult> {
  const email = record.email || record.publicEmail;
  const domain = emailDomain(email);

  if (!domain || !isUsefulEmail(email, "") || isPersonalEmailDomain(domain) || BLOCKED_EMAIL_DOMAINS.has(domain)) {
    return {
      pageId: record.id,
      name: record.name,
      type: record.type,
      status: "No match",
      confidence: 0,
      sourceUrls: [],
      notes: email ? `Skipped generic/personal email domain: ${domain}` : "No email address available.",
      applied: false,
      error: "Skipped email domain",
    };
  }

  const domainResult = await crawlEmailDomainWebsite(domain);
  const website = record.website && !isBlockedWebsite(record.website) ? record.website : domainResult.website;
  const crawl = domainResult.crawl;
  const orgName = organisationFromWebsite(domain, crawl, record.name);
  const websiteEmails = crawl?.emails || [];
  const publicEmail = isUsefulEmail(record.publicEmail, website) ? record.publicEmail : isUsefulEmail(record.email, website) ? record.email : websiteEmails[0] || "";
  const contactFormUrl = crawl?.contactFormUrl || "";
  const hasUsefulWebsite = Boolean(website && crawl && !crawl.error);
  const hasUsefulContact = Boolean(publicEmail || contactFormUrl || crawl?.instagram || crawl?.facebook || crawl?.linkedIn);
  const status: SelectName = hasUsefulWebsite ? "Partial" : "No match";
  const confidence = hasUsefulWebsite && hasUsefulContact ? 0.72 : hasUsefulWebsite ? 0.62 : 0;
  const notes = [
    `Email-domain enrichment: ${email} -> ${domain}.`,
    hasUsefulWebsite ? `Reachable website found: ${website}.` : "",
    orgName ? `Suggested organisation/business name: ${orgName}.` : "",
    crawl?.description ? `Website summary: ${crawl.description}` : "",
    publicEmail ? `Public/domain email retained: ${publicEmail}.` : "",
    contactFormUrl ? `Contact form found: ${contactFormUrl}.` : "",
    domainResult.error ? `Caveat: ${domainResult.error}` : "",
    "Review before outreach; email-domain matching is useful but not proof of relationship.",
  ].filter(Boolean).join("\n");

  const result: EnrichmentResult = {
    pageId: record.id,
    name: record.name,
    type: record.type,
    status,
    confidence,
    website,
    publicEmail,
    contactFormUrl,
    sourceUrls: unique([website, ...(crawl?.sourceUrls || [])]),
    notes: truncate(notes),
    applied: false,
    error: domainResult.error,
  };

  if (!options.apply || !hasUsefulWebsite) return result;

  const existingSources = record.source.filter((item) => item !== "Email Domain");
  const existingDataQuality = record.dataQuality.filter((item) => !["missing-website", "source-incomplete"].includes(item));
  const existingTags = record.tags.filter((item) => item !== "outreach-ready");
  const channel = outreachChannel(publicEmail, "", contactFormUrl, [crawl?.instagram || "", crawl?.facebook || "", crawl?.linkedIn || ""]);

  const properties: Record<string, any> = {
    "Enrichment Status": asSelect(status),
    "Enrichment Confidence": { type: "number", number: confidence },
    "Last Enriched": { type: "date", date: { start: new Date().toISOString().slice(0, 10) } },
    "Website": { type: "url", url: website },
    "Source": asMultiSelect([...existingSources, "Email Domain", crawl && !crawl.error ? "Website Crawl" : ""]),
    "Data Quality": asMultiSelect([...existingDataQuality, "email-domain-enriched", "needs-human-review"]),
    "Tags": asMultiSelect([...existingTags, "enriched", channel !== "Manual review" ? "outreach-ready" : "", "needs-human-review"]),
    "Outreach Channel": asSelect(channel),
    "Consent Basis": asSelect(consentBasis(publicEmail, contactFormUrl)),
    "Enrichment Notes": asRichText(result.notes),
    "Source URLs": asRichText(unique([record.sourceUrls, ...result.sourceUrls]).join("\n")),
  };

  if (shouldReplaceOrganisation(record.organisation, orgName)) properties["Organisation"] = asRichText(orgName);
  if (record.name.toLowerCase().includes("@") && orgName) {
    properties["Name"] = { type: "title", title: [{ text: { content: orgName } }] };
  }
  if (publicEmail) {
    properties["Public Email"] = { type: "email", email: publicEmail };
    if (!record.email) properties["Email"] = { type: "email", email: publicEmail };
  }
  if (contactFormUrl) properties["Contact Form URL"] = { type: "url", url: contactFormUrl };
  if (crawl?.instagram) properties["Instagram"] = { type: "url", url: crawl.instagram };
  if (crawl?.facebook) properties["Facebook"] = { type: "url", url: crawl.facebook };
  if (crawl?.linkedIn) properties["LinkedIn"] = { type: "url", url: crawl.linkedIn };
  if (!record.nextAction) properties["Next Action"] = asRichText("Review email-domain enrichment and choose the right outreach path.");

  await notion.pages.update({ page_id: record.id, properties } as any);
  await sleep(350);
  result.applied = true;
  return result;
}

function suggestedAction(record: HarvestRecord, channel: string): string {
  const lowerTags = record.tags.join(" ").toLowerCase();
  if (channel === "Manual review") return "Manually confirm the right contact path before outreach.";
  if (lowerTags.includes("market")) return "Invite a low-pressure chat about market/community calendar alignment with The Harvest.";
  if (lowerTags.includes("food-produce") || lowerTags.includes("hospitality")) return "Explore a local food, producer story, workshop, or supplier collaboration.";
  if (lowerTags.includes("gallery-arts")) return "Explore maker, exhibition, residency, or cross-promotion fit.";
  if (lowerTags.includes("community-venue")) return "Ask about shared community noticeboards, event calendars, and referral pathways.";
  if (lowerTags.includes("accommodation") || lowerTags.includes("tourism")) return "Explore visitor referrals and place-story collaboration for Witta and the hinterland.";
  return "Review enriched details and choose one warm, relevant outreach angle.";
}

function buildNotes(record: HarvestRecord, place?: GooglePlaceDetails, website?: WebsiteCrawl, hunterEmail?: string, error?: string): string {
  const lines = [
    place ? `Google Places match: ${place.name}${place.formatted_address ? `, ${place.formatted_address}` : ""}.` : "No confident Google Places match.",
    place?.website && !isBlockedWebsite(place.website) ? `Website from Google: ${place.website}.` : "",
    website?.description ? `Website summary: ${website.description}` : "",
    website?.emails.length ? `Public website email found: ${website.emails[0]}.` : "",
    hunterEmail ? "Hunter returned a generic domain email. Human review before use." : "",
    error ? `Caveat: ${error}` : "",
    "Use for targeted relationship outreach only. Check consent basis and relevance before sending.",
  ];

  return truncate(lines.filter(Boolean).join("\n"));
}

async function enrichRecord(record: HarvestRecord, options: CliOptions, googleApiKey: string): Promise<EnrichmentResult> {
  const sourceUrls: string[] = [];
  const google = await fetchGooglePlace(record, googleApiKey);
  const place = google.place;

  if (place?.url) sourceUrls.push(place.url);
  if (place?.website && !isBlockedWebsite(place.website)) sourceUrls.push(place.website);

  const confidentGoogleMatch = google.status === "Matched" || google.confidence >= 0.62;
  const distrustExistingGoogleData = !confidentGoogleMatch && record.source.includes("Google Places");
  const existingWebsite = isBlockedWebsite(record.website) || distrustExistingGoogleData ? "" : record.website;
  const googleWebsite = place?.website && !isBlockedWebsite(place.website) ? place.website : "";
  const websiteUrl = existingWebsite || (confidentGoogleMatch ? googleWebsite : "");
  const website = !options.skipWebsite && websiteUrl ? await crawlWebsite(websiteUrl) : undefined;
  if (website) sourceUrls.push(...website.sourceUrls);

  let hunterEmail = "";
  if (options.hunter && process.env.HUNTER_API_KEY && websiteUrl) {
    try {
      const domain = new URL(websiteUrl).hostname.replace(/^www\./, "");
      hunterEmail = await fetchHunterGenericEmail(domain, process.env.HUNTER_API_KEY);
    } catch {
      // Optional enrichment only.
    }
  }

  const existingEmail = isUsefulEmail(record.email, websiteUrl || existingWebsite) ? record.email : "";
  const existingPublicEmail = isUsefulEmail(record.publicEmail, websiteUrl || existingWebsite) ? record.publicEmail : "";
  const publicEmail = existingEmail || existingPublicEmail || website?.emails[0] || hunterEmail || "";
  const existingPhone = !distrustExistingGoogleData && isLikelyAustralianPhone(record.phone) ? record.phone : "";
  const phone = existingPhone || (confidentGoogleMatch ? place?.formatted_phone_number || place?.international_phone_number || "" : "");
  const contactFormUrl = website?.contactFormUrl || "";
  const channel = outreachChannel(publicEmail, phone, contactFormUrl, [website?.instagram || "", website?.facebook || "", website?.linkedIn || ""]);
  const basis = consentBasis(publicEmail, contactFormUrl);
  const hasUsefulContact = Boolean(publicEmail || phone || contactFormUrl || website?.instagram || website?.facebook);
  const confidence = google.status === "Matched" ? google.confidence : hasUsefulContact ? Math.max(0.5, google.confidence) : google.confidence;
  const status: SelectName =
    google.status === "Matched" && hasUsefulContact
      ? "Matched"
      : google.status === "Matched"
        ? "Partial"
        : hasUsefulContact
          ? "Partial"
          : google.status;
  const notes = buildNotes(record, place, website, hunterEmail, google.error || website?.error);

  const result: EnrichmentResult = {
    pageId: record.id,
    name: record.name,
    type: record.type,
    status,
    confidence,
    googleName: place?.name,
    googleAddress: place?.formatted_address,
    website: websiteUrl,
    phone,
    publicEmail,
    contactFormUrl,
    sourceUrls: unique(sourceUrls),
    notes,
    applied: false,
    error: google.error || website?.error,
  };

  if (!options.apply) return result;

  const sources = unique([
    ...record.source.filter((item) => !(distrustExistingGoogleData && ["Google Places", "Website Crawl"].includes(item))),
    place && !distrustExistingGoogleData ? "Google Places" : "",
    website && !website.error && !distrustExistingGoogleData ? "Website Crawl" : "",
    hunterEmail ? "Hunter" : "",
  ]);
  const dataQuality = unique([
    ...record.dataQuality.filter((item) => !["missing-phone", "source-incomplete", "enriched-google", "enriched-website"].includes(item)),
    place && !distrustExistingGoogleData ? "enriched-google" : "no-place-match",
    website && !website.error && !distrustExistingGoogleData ? "enriched-website" : !websiteUrl ? "missing-website" : "",
    phone ? "" : "missing-phone",
    status === "No match" || status === "Error" ? "source-incomplete" : "",
    confidence < 0.7 || status === "Needs review" ? "needs-human-review" : "",
  ]);
  const tags = unique([
    ...record.tags.filter((item) => !["enriched", "outreach-ready"].includes(item)),
    status === "Matched" || status === "Partial" ? "enriched" : "",
    status === "Matched" && channel !== "Manual review" ? "outreach-ready" : "",
    confidence < 0.7 || status === "Needs review" ? "needs-human-review" : "",
  ]);

  const properties: Record<string, any> = {
    "Enrichment Status": asSelect(status),
    "Enrichment Confidence": { type: "number", number: confidence },
    "Last Enriched": { type: "date", date: { start: new Date().toISOString().slice(0, 10) } },
    "Source": asMultiSelect(sources),
    "Data Quality": asMultiSelect(dataQuality),
    "Tags": asMultiSelect(tags),
    "Outreach Channel": asSelect(channel),
    "Consent Basis": asSelect(basis),
    "Enrichment Notes": asRichText(record.source.includes("Web Research") && google.status !== "Matched" && record.enrichmentNotes ? record.enrichmentNotes : notes),
    "Source URLs": asRichText((distrustExistingGoogleData ? result.sourceUrls : unique([record.sourceUrls, ...result.sourceUrls])).join("\n")),
    "ABN Status": asSelect(options.abn && process.env.ABN_LOOKUP_GUID ? "Unknown" : "Not checked"),
  };

  if (!record.nextAction) properties["Next Action"] = asRichText(suggestedAction(record, channel));
  if (websiteUrl) properties["Website"] = { type: "url", url: websiteUrl };
  if (!websiteUrl && record.website && (isBlockedWebsite(record.website) || distrustExistingGoogleData)) properties["Website"] = { type: "url", url: null };
  if (place?.place_id) properties["Google Place ID"] = asRichText(place.place_id);
  if (place?.url) properties["Google Maps URL"] = { type: "url", url: place.url };
  if (confidentGoogleMatch && place?.formatted_address) properties["Location"] = asRichText(place.formatted_address);
  if (confidentGoogleMatch && typeof place?.geometry?.location?.lat === "number") properties["Latitude"] = { type: "number", number: place.geometry.location.lat };
  if (confidentGoogleMatch && typeof place?.geometry?.location?.lng === "number") properties["Longitude"] = { type: "number", number: place.geometry.location.lng };
  if (phone) properties["Phone"] = { type: "phone_number", phone_number: phone };
  if (!phone && record.phone && !isLikelyAustralianPhone(record.phone)) properties["Phone"] = { type: "phone_number", phone_number: null };
  if (publicEmail) {
    properties["Public Email"] = { type: "email", email: publicEmail };
    if (!record.email || !isUsefulEmail(record.email, websiteUrl || existingWebsite)) properties["Email"] = { type: "email", email: publicEmail };
  } else {
    if (record.publicEmail && !isUsefulEmail(record.publicEmail, websiteUrl || existingWebsite)) properties["Public Email"] = { type: "email", email: null };
    if (record.email && !isUsefulEmail(record.email, websiteUrl || existingWebsite)) properties["Email"] = { type: "email", email: null };
  }
  if (contactFormUrl) properties["Contact Form URL"] = { type: "url", url: contactFormUrl };
  if (website?.instagram) properties["Instagram"] = { type: "url", url: website.instagram };
  if (website?.facebook) properties["Facebook"] = { type: "url", url: website.facebook };
  if (website?.linkedIn) properties["LinkedIn"] = { type: "url", url: website.linkedIn };
  if (place?.opening_hours?.weekday_text?.length) properties["Opening Hours"] = asRichText(place.opening_hours.weekday_text.join("\n"));
  if (typeof place?.rating === "number") properties["Rating"] = { type: "number", number: place.rating };
  if (typeof place?.user_ratings_total === "number") properties["Review Count"] = { type: "number", number: place.user_ratings_total };
  if (place?.business_status) properties["Business Status"] = asSelect(place.business_status);
  if (distrustExistingGoogleData) {
    properties["Google Place ID"] = asRichText("");
    properties["Google Maps URL"] = { type: "url", url: null };
    properties["Latitude"] = { type: "number", number: null };
    properties["Longitude"] = { type: "number", number: null };
    properties["Rating"] = { type: "number", number: null };
    properties["Review Count"] = { type: "number", number: null };
    properties["Business Status"] = { type: "select", select: null };
    properties["Opening Hours"] = asRichText("");
    if (record.location && !addressLooksLocal(record.location)) properties["Location"] = asRichText("");
  }

  await notion.pages.update({ page_id: record.id, properties } as any);
  await sleep(350);
  result.applied = true;
  return result;
}

const notion = new Client({ auth: assertEnv("NOTION_TOKEN") });

async function main(): Promise<void> {
  const options = parseOptions();
  const googleApiKey = options.emailDomain ? "" : assertEnv("GOOGLE_PLACES_API_KEY");

  if (options.abn && !process.env.ABN_LOOKUP_GUID) {
    console.warn("ABN lookup requested, but ABN_LOOKUP_GUID is not configured. ABN fields will be marked Not checked.");
  }
  if (options.hunter && !process.env.HUNTER_API_KEY) {
    console.warn("Hunter lookup requested, but HUNTER_API_KEY is not configured. Hunter enrichment will be skipped.");
  }

  const records = await queryHarvestRecords(notion, options);
  const filteredRecords = options.emailDomain
    ? records.filter((record) => {
        const email = record.email || record.publicEmail;
        const domain = emailDomain(email);
        if (!email || !domain || isPersonalEmailDomain(domain) || BLOCKED_EMAIL_DOMAINS.has(domain)) return false;
        if (options.recheck) return true;
        return !record.website || !record.organisation || record.enrichmentStatus === "No match";
      })
    : records;
  const limitedRecords = options.limit > 0 ? filteredRecords.slice(0, options.limit) : filteredRecords;
  console.log(`${options.apply ? "Applying" : "Dry-run"} ${options.emailDomain ? "email-domain" : "place"} enrichment for ${limitedRecords.length} records.`);

  const results: EnrichmentResult[] = [];
  for (const record of limitedRecords) {
    try {
      console.log(`- ${record.name}`);
      results.push(options.emailDomain ? await enrichRecordFromEmailDomain(record, options) : await enrichRecord(record, options, googleApiKey));
    } catch (error) {
      results.push({
        pageId: record.id,
        name: record.name,
        type: record.type,
        status: "Error",
        confidence: 0,
        sourceUrls: [],
        notes: "",
        applied: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const summary = {
    mode: options.apply ? "apply" : "dry-run",
    generatedAt: new Date().toISOString(),
    recordCount: results.length,
    counts: results.reduce<Record<string, number>>((acc, result) => {
      acc[result.status] = (acc[result.status] || 0) + 1;
      return acc;
    }, {}),
    results,
  };

  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await fs.writeFile(REPORT_PATH, JSON.stringify(summary, null, 2));
  console.log(`Saved report: ${REPORT_PATH}`);
  console.log(JSON.stringify(summary.counts, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
