/**
 * Notion API client for the ACT Communications Dashboard.
 *
 * Reads/writes to the ACT Communications Dashboard database that serves as the
 * source of truth for editorial content across all ACT projects (The Harvest, etc.).
 * Includes in-memory caching (60s) and rate limiting (3 RPS).
 */

import { Client } from "@notionhq/client";
import type { EditorialPost, EditorialProject } from "../client/src/types/social";
import { getGHLAccountMap, createGHLSocialPost } from "./gohighlevel.js";

// ── Notion client singleton ───────────────────────────────────

let _notion: Client | null = null;

function getNotionClient(): Client {
  if (!_notion) {
    const apiKey = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;
    if (!apiKey) throw new Error("NOTION_API_KEY (or NOTION_TOKEN) not configured");
    _notion = new Client({ auth: apiKey });
  }
  return _notion;
}

/** Database ID — used for pages.create parent and databases.retrieve */
function getDbId(): string {
  const id = process.env.NOTION_EDITORIAL_DB_ID;
  if (!id) throw new Error("NOTION_EDITORIAL_DB_ID not configured");
  return id;
}

/** Data source ID — used for dataSources.query (Notion SDK v5+) */
function getDataSourceId(): string {
  return process.env.NOTION_EDITORIAL_DS_ID || getDbId();
}

// ── Rate limiter (token bucket, 3 RPS) ───────────────────────

const RATE_LIMIT = 3;
let _tokens = RATE_LIMIT;
let _lastRefill = Date.now();

async function rateLimit(): Promise<void> {
  const now = Date.now();
  const elapsed = (now - _lastRefill) / 1000;
  _tokens = Math.min(RATE_LIMIT, _tokens + elapsed * RATE_LIMIT);
  _lastRefill = now;

  if (_tokens < 1) {
    const waitMs = ((1 - _tokens) / RATE_LIMIT) * 1000;
    await new Promise((r) => setTimeout(r, waitMs));
    _tokens = 1;
  }
  _tokens -= 1;
}

// ── Cache (60s TTL) ──────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}

const CACHE_TTL = 60_000; // 60 seconds
const _cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = _cache.get(key);
  if (entry && Date.now() - entry.fetchedAt < CACHE_TTL) {
    return entry.data as T;
  }
  _cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  _cache.set(key, { data, fetchedAt: Date.now() });
}

/** Clear the editorial cache (call after mutations) */
export function clearEditorialCache(): void {
  _cache.clear();
}

// ── Notion property helpers ──────────────────────────────────

type NotionPage = any; // Notion SDK types are complex; we use any + safe access

function getText(page: NotionPage, prop: string): string {
  const p = page.properties?.[prop];
  if (!p) return "";
  if (p.type === "title") return p.title?.map((t: any) => t.plain_text).join("") || "";
  if (p.type === "rich_text") return p.rich_text?.map((t: any) => t.plain_text).join("") || "";
  return "";
}

function getSelect(page: NotionPage, prop: string): string {
  return page.properties?.[prop]?.select?.name || "";
}

function getMultiSelect(page: NotionPage, prop: string): string[] {
  return (page.properties?.[prop]?.multi_select || []).map((s: any) => s.name);
}

function getStatus(page: NotionPage, prop: string): string {
  return page.properties?.[prop]?.status?.name || "";
}

function getDate(page: NotionPage, prop: string): string | null {
  return page.properties?.[prop]?.date?.start || null;
}

function getUrl(page: NotionPage, prop: string): string | null {
  return page.properties?.[prop]?.url || null;
}

/** Extract first file URL from a Notion files property */
function getFileUrl(page: NotionPage, prop: string): string | null {
  const files = page.properties?.[prop]?.files;
  if (!files || files.length === 0) return null;
  const first = files[0];
  // Notion files can be "file" (hosted by Notion) or "external"
  if (first.type === "file") return first.file?.url || null;
  if (first.type === "external") return first.external?.url || null;
  return null;
}

/** Extract relation page IDs */
function getRelationIds(page: NotionPage, prop: string): string[] {
  const rel = page.properties?.[prop]?.relation;
  if (!Array.isArray(rel)) return [];
  return rel.map((r: any) => r.id).filter(Boolean);
}

// ── Status mapping (Notion ↔ Social Planner) ────────────────
// Notion statuses: Idea, Draft, Ready, Scheduled, Published
// Social Planner statuses: draft, approved, scheduled, published
// Legacy ACT statuses kept for backward compatibility.

const NOTION_TO_SOCIAL_STATUS: Record<string, EditorialPost["status"]> = {
  // Current statuses (added to Notion UI)
  "idea": "draft",
  "draft": "draft",
  "ready": "approved",
  "scheduled": "scheduled",
  "published": "published",
  // Legacy ACT statuses (backward compat)
  "story prep needed": "draft",
  "ready to connect": "approved",
  "conversation scheduled": "scheduled",
  "story in development": "scheduled",
  "connected & delighted": "published",
};

const SOCIAL_TO_NOTION_STATUS: Record<string, string> = {
  "draft": "Draft",
  "approved": "Ready",
  "scheduled": "Scheduled",
  "published": "Published",
};

function mapNotionStatus(raw: string): EditorialPost["status"] {
  return NOTION_TO_SOCIAL_STATUS[raw.toLowerCase()] || "draft";
}

/** Convert a social planner status to the Notion status name */
function toNotionStatus(socialStatus: string): string {
  return SOCIAL_TO_NOTION_STATUS[socialStatus.toLowerCase()] || socialStatus.charAt(0).toUpperCase() + socialStatus.slice(1);
}

// ── Map Notion page → EditorialPost ─────────────────────────

function mapPageToPost(page: NotionPage): EditorialPost {
  const statusRaw = getStatus(page, "Status");

  // Media: prefer Image files, fall back to Video link
  const imageUrl = getFileUrl(page, "Image");
  const videoUrl = getUrl(page, "Video link");

  return {
    id: page.id,
    title: getText(page, "Content/Communication Name"),
    communicationType: getSelect(page, "Communication Type"),
    status: mapNotionStatus(statusRaw),
    scheduledDate: getDate(page, "Sent date"),
    platforms: getMultiSelect(page, "Target Accounts"),
    caption: getText(page, "Key Message/Story"),
    editorialNote: getText(page, "Notes"),
    mediaUrl: imageUrl || videoUrl,
    format: (getSelect(page, "Format") as EditorialPost["format"]) || "square",
    link: getUrl(page, "Link"),
    utmContent: getText(page, "UTM Content"),
    ghlPostId: getText(page, "GHL Post ID") || null,
    projectIds: getRelationIds(page, "Project"),
  };
}

// ── Public API ───────────────────────────────────────────────

/**
 * Query the editorial calendar, optionally filtered by project and/or status.
 * Also supports filtering by communication type.
 */
export async function queryEditorialCalendar(opts?: {
  projectId?: string;
  status?: string;
  communicationType?: string;
}): Promise<EditorialPost[]> {
  const cacheKey = `list:${opts?.projectId || "all"}:${opts?.status || "all"}:${opts?.communicationType || "all"}`;
  const cached = getCached<EditorialPost[]>(cacheKey);
  if (cached) return cached;

  await rateLimit();
  const notion = getNotionClient();

  const filters: any[] = [];
  if (opts?.projectId) {
    filters.push({
      property: "Project",
      relation: { contains: opts.projectId },
    });
  }
  if (opts?.status) {
    filters.push({
      property: "Status",
      status: { equals: toNotionStatus(opts.status) },
    });
  }
  if (opts?.communicationType) {
    filters.push({
      property: "Communication Type",
      select: { equals: opts.communicationType },
    });
  }

  const response = await notion.dataSources.query({
    data_source_id: getDataSourceId(),
    filter: filters.length > 1
      ? { and: filters }
      : filters.length === 1
        ? filters[0]
        : undefined,
    sorts: [{ property: "Sent date", direction: "ascending" }],
    page_size: 100,
  });

  const posts = response.results.map(mapPageToPost);
  setCache(cacheKey, posts);
  return posts;
}

/**
 * Get a single editorial post by Notion page ID.
 */
export async function getEditorialPost(pageId: string): Promise<EditorialPost | null> {
  const cacheKey = `post:${pageId}`;
  const cached = getCached<EditorialPost>(cacheKey);
  if (cached) return cached;

  await rateLimit();
  const notion = getNotionClient();

  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    const post = mapPageToPost(page);
    setCache(cacheKey, post);
    return post;
  } catch {
    return null;
  }
}

/**
 * Update an editorial post in Notion.
 * Only updates the properties that are provided.
 */
export async function updateEditorialPost(
  pageId: string,
  updates: {
    status?: string;
    caption?: string;
    scheduledDate?: string;
    ghlPostId?: string;
    mediaUrl?: string;
  }
): Promise<void> {
  await rateLimit();
  const notion = getNotionClient();

  const properties: Record<string, any> = {};

  if (updates.status) {
    properties["Status"] = {
      status: { name: toNotionStatus(updates.status) },
    };
  }
  if (updates.caption !== undefined) {
    properties["Key Message/Story"] = {
      rich_text: [{ text: { content: updates.caption } }],
    };
  }
  if (updates.scheduledDate !== undefined) {
    properties["Sent date"] = {
      date: updates.scheduledDate ? { start: updates.scheduledDate } : null,
    };
  }
  if (updates.ghlPostId !== undefined) {
    properties["GHL Post ID"] = {
      rich_text: [{ text: { content: updates.ghlPostId } }],
    };
  }
  if (updates.mediaUrl !== undefined) {
    // Video link is a URL type — use for external media URLs
    properties["Video link"] = {
      url: updates.mediaUrl || null,
    };
  }

  await notion.pages.update({ page_id: pageId, properties });
  clearEditorialCache();
}

/**
 * Create a new editorial post in Notion.
 */
export async function createEditorialPost(post: {
  title: string;
  communicationType?: string;
  status?: string;
  scheduledDate?: string;
  platforms?: string[];
  caption?: string;
  editorialNote?: string;
  mediaUrl?: string;
  format?: string;
  link?: string;
  utmContent?: string;
  projectId?: string;
}): Promise<string> {
  await rateLimit();
  const notion = getNotionClient();

  const properties: Record<string, any> = {
    "Content/Communication Name": { title: [{ text: { content: post.title } }] },
  };

  if (post.communicationType) {
    properties["Communication Type"] = { select: { name: post.communicationType } };
  }
  if (post.status) {
    properties["Status"] = {
      status: { name: toNotionStatus(post.status) },
    };
  }
  if (post.scheduledDate) {
    properties["Sent date"] = { date: { start: post.scheduledDate } };
  }
  if (post.platforms?.length) {
    properties["Target Accounts"] = {
      multi_select: post.platforms.map((name) => ({ name })),
    };
  }
  if (post.caption) {
    properties["Key Message/Story"] = { rich_text: [{ text: { content: post.caption } }] };
  }
  if (post.editorialNote) {
    properties["Notes"] = { rich_text: [{ text: { content: post.editorialNote } }] };
  }
  if (post.mediaUrl) {
    properties["Video link"] = { url: post.mediaUrl };
  }
  if (post.format) {
    properties["Format"] = { select: { name: post.format } };
  }
  if (post.link) {
    properties["Link"] = { url: post.link };
  }
  if (post.utmContent) {
    properties["UTM Content"] = { rich_text: [{ text: { content: post.utmContent } }] };
  }
  if (post.projectId) {
    properties["Project"] = { relation: [{ id: post.projectId }] };
  }

  const response = await notion.pages.create({
    parent: { database_id: getDbId() },
    properties,
  });

  clearEditorialCache();
  return response.id;
}

/**
 * Get distinct project names from the ACT Projects database.
 * The Project relation points to database 177ebcf9-81cf-80dd-9514-f1ec32f3314c.
 */
export async function getEditorialProjects(): Promise<EditorialProject[]> {
  const cacheKey = "projects";
  const cached = getCached<EditorialProject[]>(cacheKey);
  if (cached) return cached;

  await rateLimit();
  const notion = getNotionClient();

  // Get the Projects database ID from the relation property
  const ds = await notion.dataSources.retrieve({ data_source_id: getDataSourceId() });
  const projectProp = (ds as any).properties?.Project;
  const projectsDbId = projectProp?.relation?.database_id;
  if (!projectsDbId) {
    setCache(cacheKey, []);
    return [];
  }

  // Resolve the data source ID for the Projects database
  const projectsDsId = projectProp?.relation?.data_source_id || projectsDbId;

  await rateLimit();
  const response = await notion.dataSources.query({
    data_source_id: projectsDsId,
    page_size: 100,
  });

  const projects: EditorialProject[] = response.results.map((page: any) => {
    const titleParts = page.properties?.Name?.title || page.properties?.["Project Name"]?.title || [];
    const name = titleParts.map((t: any) => t.plain_text).join("") || "Untitled";
    return { id: page.id, name };
  });

  setCache(cacheKey, projects);
  return projects;
}

/**
 * Get distinct Communication Type values from the database schema.
 */
export async function getEditorialCommunicationTypes(): Promise<string[]> {
  const cacheKey = "commTypes";
  const cached = getCached<string[]>(cacheKey);
  if (cached) return cached;

  await rateLimit();
  const notion = getNotionClient();

  const ds = await notion.dataSources.retrieve({ data_source_id: getDataSourceId() });
  const commTypeProp = (ds as any).properties?.["Communication Type"];
  const options = commTypeProp?.select?.options || [];
  const types = options.map((o: any) => o.name as string);

  setCache(cacheKey, types);
  return types;
}

/**
 * Auto-sync "Ready" posts from Notion → GHL Social Planner.
 * Finds posts with status=Ready and no GHL Post ID, creates them in GHL,
 * then updates Notion with the GHL Post ID and status → Scheduled.
 */
export async function syncReadyPosts(): Promise<{
  synced: number;
  failed: number;
  skipped: number;
}> {
  // 1. Query Notion for Ready posts without a GHL Post ID
  const readyPosts = await queryEditorialCalendar({ status: "approved" });
  const unsynced = readyPosts.filter((p) => !p.ghlPostId);

  if (unsynced.length === 0) {
    return { synced: 0, failed: 0, skipped: 0 };
  }

  // 2. Get platform → account ID mapping once
  const accountMap = await getGHLAccountMap();
  if (accountMap.size === 0) {
    console.warn("[AutoSync] No GHL social accounts found — skipping all posts");
    return { synced: 0, failed: 0, skipped: unsynced.length };
  }

  let synced = 0;
  let failed = 0;
  let skipped = 0;

  // 3. Process each post
  for (const post of unsynced) {
    // Map Notion platforms → GHL account IDs
    const accountIds: string[] = [];
    for (const platform of post.platforms) {
      const ids = accountMap.get(platform);
      if (ids) accountIds.push(...ids);
    }

    if (accountIds.length === 0) {
      console.warn(`[AutoSync] No matching GHL accounts for post "${post.title}" (platforms: ${post.platforms.join(", ")})`);
      skipped++;
      continue;
    }

    // Skip posts with no caption
    if (!post.caption) {
      console.warn(`[AutoSync] Skipping post "${post.title}" — no caption`);
      skipped++;
      continue;
    }

    try {
      const result = await createGHLSocialPost({
        summary: post.caption,
        accountIds,
        mediaUrls: post.mediaUrl ? [post.mediaUrl] : undefined,
        scheduledAt: post.scheduledDate || undefined,
      });

      if (result.success && result.postId) {
        // Update Notion: set GHL Post ID, status → Scheduled, set date if missing
        await updateEditorialPost(post.id, {
          ghlPostId: result.postId,
          status: "scheduled",
          scheduledDate: post.scheduledDate || new Date().toISOString(),
        });
        synced++;
        console.log(`[AutoSync] Synced "${post.title}" → GHL ${result.postId}`);
      } else {
        console.error(`[AutoSync] GHL post creation failed for "${post.title}":`, result.error);
        failed++;
      }
    } catch (err) {
      console.error(`[AutoSync] Error syncing "${post.title}":`, err);
      failed++;
    }
  }

  return { synced, failed, skipped };
}
