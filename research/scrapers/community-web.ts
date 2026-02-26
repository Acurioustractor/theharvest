import path from "path";
import * as cheerio from "cheerio";
import { cachedGet, saveData, logSection } from "./utils.js";

interface CommunityOrg {
  name: string;
  type: string;
  description: string;
  url?: string;
  location?: string;
  contact?: string;
}

interface LocalEvent {
  name: string;
  type: string;
  schedule?: string;
  location?: string;
  description: string;
  url?: string;
}

// Known community organizations in the Maleny/Witta area
const KNOWN_ORGS: CommunityOrg[] = [
  {
    name: "Maleny Neighbourhood Centre",
    type: "community_service",
    description: "Community support services, programs, and referrals for the Maleny and hinterland area",
    url: "https://www.malenyneighbourhoodcentre.org",
    location: "Maleny",
  },
  {
    name: "Maleny Arts Council",
    type: "arts",
    description: "Supporting and promoting arts and culture in the Maleny region",
    location: "Maleny",
  },
  {
    name: "Maleny Community Centre",
    type: "community_venue",
    description: "Multi-purpose community venue hosting events, meetings, and activities",
    location: "Maleny",
  },
  {
    name: "Range Community Kindergarten",
    type: "education",
    description: "Community kindergarten serving families in the Blackall Range area",
    location: "Maleny",
  },
  {
    name: "Maleny & District Green Hills Fund",
    type: "environment",
    description: "Environmental conservation and land management in the Maleny district",
    location: "Maleny",
  },
  {
    name: "Barung Landcare",
    type: "environment",
    description: "Landcare and bushland rehabilitation across the Blackall Range and surrounds",
    url: "https://www.barunglandcare.org.au",
    location: "Maleny",
  },
  {
    name: "Maleny Credit Union (Maleny Credit Co-operative)",
    type: "cooperative",
    description: "Community-owned credit union serving the Maleny and hinterland region",
    location: "Maleny",
  },
  {
    name: "Maple Street Co-op",
    type: "cooperative",
    description: "Community-owned cooperative offering local, organic, and fair trade products",
    location: "Maleny",
  },
  {
    name: "Crystal Waters Eco Village",
    type: "intentional_community",
    description: "Permaculture-based eco village near Maleny, established 1987",
    location: "Conondale (near Maleny)",
  },
  {
    name: "Maleny Showground",
    type: "community_venue",
    description: "Home of the annual Maleny Show and various community events",
    location: "Maleny",
  },
  {
    name: "Maleny RSL Sub-Branch",
    type: "community_service",
    description: "Returned services support and community social hub",
    location: "Maleny",
  },
  {
    name: "Maleny Trail Riders",
    type: "recreation",
    description: "Mountain biking and trail riding community in the hinterland",
    location: "Maleny",
  },
  {
    name: "Witta Recreation Club",
    type: "recreation",
    description: "Local recreation and social club for the Witta community",
    location: "Witta",
  },
  {
    name: "Maleny Singers",
    type: "arts",
    description: "Community choir bringing together local singers",
    location: "Maleny",
  },
  {
    name: "Hinterland Bush Links",
    type: "environment",
    description: "Wildlife corridor restoration connecting habitats in the Sunshine Coast Hinterland",
    location: "Hinterland region",
  },
  {
    name: "Maleny Hospital Auxiliary",
    type: "health",
    description: "Volunteer support for Maleny Soldiers Memorial Hospital",
    location: "Maleny",
  },
  {
    name: "Maleny Lions Club",
    type: "service_club",
    description: "Lions Club International chapter serving the Maleny community",
    location: "Maleny",
  },
  {
    name: "Maleny Rotary Club",
    type: "service_club",
    description: "Rotary International chapter supporting community projects in Maleny",
    location: "Maleny",
  },
  {
    name: "Range Care",
    type: "community_service",
    description: "Aged care and disability support services for the Blackall Range area",
    location: "Maleny",
  },
];

interface EventDateInfo {
  nextDate?: string;
  upcomingDates?: string[];
}

const KNOWN_EVENTS: LocalEvent[] = [
  {
    name: "Witta Markets",
    type: "market",
    schedule: "First Saturday of every month, 6:30am-12pm",
    location: "Witta Recreation Club, Witta",
    description: "Community market with local produce, plants, crafts, food, and live music",
  },
  {
    name: "Maleny Community Markets",
    type: "market",
    schedule: "Every Sunday, 8am-1pm",
    location: "RSL Hall, Maleny",
    description: "Weekly market with local produce, handmade goods, and community atmosphere",
  },
  {
    name: "Montville Markets",
    type: "market",
    schedule: "Second Saturday of every month",
    location: "Montville Village Green",
    description: "Artisan and produce market in the village of Montville",
  },
  {
    name: "Maleny Show",
    type: "annual_event",
    schedule: "Annually (typically May/June)",
    location: "Maleny Showground",
    description: "Annual agricultural show celebrating rural life, livestock, and community",
  },
  {
    name: "Maleny Music Festival",
    type: "festival",
    schedule: "Annual (New Year period)",
    location: "Various venues, Maleny",
    description: "Multi-day music and arts festival attracting national and local performers",
  },
  {
    name: "Maleny Wood Expo",
    type: "annual_event",
    schedule: "Annually",
    location: "Maleny Showground",
    description: "Exhibition of woodworking, timber arts, and sustainable forestry practices",
  },
  {
    name: "Sunshine Coast Hinterland Harvest Trail",
    type: "tourism",
    schedule: "Ongoing / seasonal",
    location: "Various farms across hinterland",
    description: "Farm gate trail connecting visitors with local producers in the hinterland",
  },
  {
    name: "Maleny Scarecrow Festival",
    type: "community_event",
    schedule: "Annually (typically June)",
    location: "Maple Street and surrounds, Maleny",
    description: "Community festival with scarecrow displays, workshops, and street activities",
  },
];

async function scrapeWebPage(url: string): Promise<string | null> {
  try {
    const html = await cachedGet<string>(url, {
      headers: {
        "User-Agent": "TheHarvestCommunityResearch/1.0 (community research project)",
      },
      responseType: "text",
    });
    return typeof html === "string" ? html : JSON.stringify(html);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(`  Warning: Could not fetch ${url}: ${msg}`);
    return null;
  }
}

async function scrapeBarungLandcare(): Promise<Partial<CommunityOrg> | null> {
  const html = await scrapeWebPage("https://www.barunglandcare.org.au");
  if (!html) return null;

  const $ = cheerio.load(html);
  const description =
    $('meta[name="description"]').attr("content") ||
    $("p").first().text().trim().slice(0, 300);

  return {
    description: description || "Landcare and bushland rehabilitation",
  };
}

async function scrapeMalenyNeighbourhoodCentre(): Promise<Partial<CommunityOrg> | null> {
  const html = await scrapeWebPage("https://www.malenyneighbourhoodcentre.org");
  if (!html) return null;

  const $ = cheerio.load(html);
  const description =
    $('meta[name="description"]').attr("content") ||
    $("p").first().text().trim().slice(0, 300);

  return {
    description: description || "Community support services",
  };
}

// Scrape SCC grants recipients page for local orgs
async function scrapeSCCGrants(): Promise<CommunityOrg[]> {
  const orgs: CommunityOrg[] = [];
  try {
    // Try to find community grants info from SCC
    const html = await scrapeWebPage(
      "https://www.sunshinecoast.qld.gov.au/living-and-community/grants-and-funding/funding-recipients"
    );
    if (html) {
      const $ = cheerio.load(html);
      // Look for grant recipients in the Maleny/Witta area
      $("table tr, li").each((_, el) => {
        const text = $(el).text();
        if (
          text.toLowerCase().includes("maleny") ||
          text.toLowerCase().includes("witta") ||
          text.toLowerCase().includes("hinterland")
        ) {
          orgs.push({
            name: text.trim().slice(0, 100),
            type: "grant_recipient",
            description: "SCC community grant recipient in the Maleny/Witta area",
            location: "Maleny/Witta area",
          });
        }
      });
    }
  } catch (error) {
    console.log(`  Warning: Could not scrape SCC grants page`);
  }
  return orgs;
}

// Scrape SCC events page for upcoming events
async function scrapeSCCEvents(): Promise<LocalEvent[]> {
  const events: LocalEvent[] = [];
  try {
    const html = await scrapeWebPage(
      "https://www.sunshinecoast.qld.gov.au/experience-sunshine-coast/events"
    );
    if (html) {
      const $ = cheerio.load(html);
      $(".event-item, .event-card, article").each((_, el) => {
        const text = $(el).text();
        const title = $(el).find("h2, h3, .event-title").first().text().trim();

        // Filter for Maleny/hinterland events
        if (
          text.toLowerCase().includes("maleny") ||
          text.toLowerCase().includes("witta") ||
          text.toLowerCase().includes("hinterland")
        ) {
          const dateText = $(el).find(".event-date, time, .date").first().text().trim();
          const locationText = $(el).find(".event-location, .location").first().text().trim();

          if (title) {
            events.push({
              name: title,
              type: "community_event",
              schedule: dateText || "See website for dates",
              location: locationText || "Sunshine Coast Hinterland",
              description: text.trim().slice(0, 200),
            });
          }
        }
      });
    }
  } catch (error) {
    console.log(`  Warning: Could not scrape SCC events page`);
  }
  return events;
}

// Scrape Visit Sunshine Coast events
async function scrapeVisitSCEvents(): Promise<LocalEvent[]> {
  const events: LocalEvent[] = [];
  try {
    const html = await scrapeWebPage(
      "https://www.visitsunshinecoast.com/events"
    );
    if (html) {
      const $ = cheerio.load(html);
      $(".event-item, .event-listing, article").each((_, el) => {
        const text = $(el).text();
        const title = $(el).find("h2, h3, .title").first().text().trim();

        // Filter for Maleny area events
        if (
          text.toLowerCase().includes("maleny") ||
          text.toLowerCase().includes("witta") ||
          text.toLowerCase().includes("montville")
        ) {
          const dateText = $(el).find(".date, time").first().text().trim();
          const locationText = $(el).find(".location, .venue").first().text().trim();

          if (title && title.length > 3) {
            events.push({
              name: title,
              type: "tourism_event",
              schedule: dateText || "Check website",
              location: locationText || "Maleny area",
              description: text.trim().slice(0, 200),
            });
          }
        }
      });
    }
  } catch (error) {
    console.log(`  Warning: Could not scrape Visit Sunshine Coast events`);
  }
  return events;
}

export async function scrapeCommunityWeb() {
  logSection("Community Web Research — Maleny/Witta Area");

  // Start with known organizations
  const orgs = [...KNOWN_ORGS];
  const events = [...KNOWN_EVENTS];

  // Enrich with web scraping where possible
  console.log("  Enriching organization data from websites...");
  console.log("  Discovering events from web sources...");

  const [barungInfo, mncInfo, grantOrgs, sccEvents, visitSCEvents] = await Promise.all([
    scrapeBarungLandcare(),
    scrapeMalenyNeighbourhoodCentre(),
    scrapeSCCGrants(),
    scrapeSCCEvents(),
    scrapeVisitSCEvents(),
  ]);

  // Update known orgs with scraped data
  if (barungInfo) {
    const barung = orgs.find((o) => o.name.includes("Barung"));
    if (barung && barungInfo.description) {
      barung.description = barungInfo.description;
    }
  }

  if (mncInfo) {
    const mnc = orgs.find((o) => o.name.includes("Neighbourhood Centre"));
    if (mnc && mncInfo.description) {
      mnc.description = mncInfo.description;
    }
  }

  // Add any discovered grant recipients not already in our list
  for (const grantOrg of grantOrgs) {
    if (!orgs.some((o) => o.name.toLowerCase().includes(grantOrg.name.toLowerCase().slice(0, 20)))) {
      orgs.push(grantOrg);
    }
  }

  // Add discovered events (deduplicate by name)
  for (const newEvent of [...sccEvents, ...visitSCEvents]) {
    if (!events.some((e) => e.name.toLowerCase().includes(newEvent.name.toLowerCase().slice(0, 15)))) {
      events.push(newEvent);
    }
  }

  // Categorize organizations
  const orgsByType: Record<string, CommunityOrg[]> = {};
  for (const org of orgs) {
    if (!orgsByType[org.type]) orgsByType[org.type] = [];
    orgsByType[org.type].push(org);
  }

  const orgsSummary = {
    totalOrganizations: orgs.length,
    byType: orgsByType,
    organizations: orgs,
    note: "Data compiled from public web sources and local knowledge. Some organizations may have changed status.",
    dataDate: new Date().toISOString().split("T")[0],
  };

  const eventsSummary = {
    totalEvents: events.length,
    events,
    note: "Schedules are indicative — check with organizers for current dates.",
    dataDate: new Date().toISOString().split("T")[0],
  };

  await saveData("community-orgs.json", orgsSummary);
  await saveData("local-events.json", eventsSummary);

  console.log(`  Found ${orgs.length} organizations and ${events.length} events`);

  return { organizations: orgsSummary, events: eventsSummary };
}

// Run standalone
const isMain = import.meta.url === `file://${process.argv[1]}`
  || import.meta.url === `file://${path.resolve(process.argv[1] || "")}`;
if (isMain) {
  scrapeCommunityWeb().catch(console.error);
}
