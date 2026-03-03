/**
 * Go High Level API Integration
 *
 * This module handles communication with the Go High Level CRM API
 * for newsletter signups and contact management.
 */

import fs from "fs";
import path from "path";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

interface GHLContactInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  source?: string;
}

interface GHLContactResponse {
  contact: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    locationId: string;
    tags?: string[];
  };
}

interface GHLErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

/**
 * Create a contact in Go High Level
 * Used for newsletter signups
 */
export async function createGHLContact(input: GHLContactInput): Promise<{ success: boolean; contactId?: string; error?: string }> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.error("Go High Level credentials not configured. Please set GHL_API_KEY and GHL_LOCATION_ID environment variables.");
    return {
      success: false,
      error: "Newsletter service is not configured. Please contact the site administrator.",
    };
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "Version": GHL_API_VERSION,
      },
      body: JSON.stringify({
        email: input.email,
        firstName: input.firstName || undefined,
        lastName: input.lastName || undefined,
        phone: input.phone || undefined,
        locationId: locationId,
        source: input.source || "The Harvest Website",
        tags: input.tags || ["newsletter", "website-signup"],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json() as GHLErrorResponse;
      console.error("GHL API Error:", errorData);
      
      // Handle specific error cases
      if (response.status === 401) {
        return { success: false, error: "Authentication failed. Please check API credentials." };
      }
      if (response.status === 422) {
        // Validation error - likely duplicate contact
        return { success: false, error: errorData.message || "This email may already be subscribed." };
      }
      
      return { success: false, error: errorData.message || "Failed to subscribe. Please try again." };
    }

    const data = await response.json() as GHLContactResponse;
    return {
      success: true,
      contactId: data.contact.id,
    };
  } catch (error) {
    console.error("GHL API request failed:", error);
    return {
      success: false,
      error: "Unable to connect to newsletter service. Please try again later.",
    };
  }
}

/**
 * Upsert a contact in Go High Level (create or update if exists)
 * Useful when you want to update existing contacts instead of failing on duplicates
 */
export async function upsertGHLContact(input: GHLContactInput): Promise<{ success: boolean; contactId?: string; error?: string }> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.error("Go High Level credentials not configured.");
    return {
      success: false,
      error: "Newsletter service is not configured. Please contact the site administrator.",
    };
  }

  try {
    // 1. Upsert contact (without tags — upsert replaces tags instead of merging)
    const response = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "Version": GHL_API_VERSION,
      },
      body: JSON.stringify({
        email: input.email,
        firstName: input.firstName || undefined,
        lastName: input.lastName || undefined,
        phone: input.phone || undefined,
        locationId: locationId,
        source: input.source || "The Harvest Website",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json() as GHLErrorResponse;
      console.error("GHL Upsert API Error:", errorData);
      return { success: false, error: errorData.message || "Failed to subscribe. Please try again." };
    }

    const data = await response.json() as GHLContactResponse;
    const contactId = data.contact.id;

    // 2. Update contact fields that upsert doesn't reliably merge
    const updates: Record<string, string> = {};
    if (input.phone) updates.phone = input.phone;
    if (input.firstName) updates.firstName = input.firstName;
    if (input.lastName) updates.lastName = input.lastName;
    if (Object.keys(updates).length > 0 && contactId) {
      try {
        await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "Version": GHL_API_VERSION,
          },
          body: JSON.stringify(updates),
        });
      } catch (updateErr) {
        console.error("GHL contact update failed (contact still created):", updateErr);
      }
    }

    // 3. Add tags separately (merges with existing tags)
    const tags = input.tags || ["newsletter", "harvest-website"];
    if (tags.length > 0 && contactId) {
      try {
        await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "Version": GHL_API_VERSION,
          },
          body: JSON.stringify({ tags }),
        });
      } catch (tagErr) {
        console.error("GHL Add Tags failed (contact still created):", tagErr);
      }
    }

    return {
      success: true,
      contactId,
    };
  } catch (error) {
    console.error("GHL Upsert API request failed:", error);
    return {
      success: false,
      error: "Unable to connect to newsletter service. Please try again later.",
    };
  }
}

/**
 * Add a note to a contact in Go High Level
 */
export async function addGHLContactNote(contactId: string, noteBody: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.GHL_API_KEY;

  if (!apiKey) {
    console.error("Go High Level API key not configured.");
    return { success: false, error: "Note service is not configured." };
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "Version": GHL_API_VERSION,
      },
      body: JSON.stringify({ body: noteBody }),
    });

    if (!response.ok) {
      const errorData = await response.json() as GHLErrorResponse;
      console.error("GHL Add Note Error:", errorData);
      return { success: false, error: errorData.message || "Failed to add note." };
    }

    return { success: true };
  } catch (error) {
    console.error("GHL Add Note request failed:", error);
    return { success: false, error: "Unable to add note to contact." };
  }
}

/**
 * Search contacts by tag and return count
 * Used for RSVP social proof counter
 */
let _eoiCountCache: { count: number; fetchedAt: number } | null = null;
const EOI_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getGHLContactCountByTag(tag: string): Promise<number> {
  // Return cached value if fresh
  if (_eoiCountCache && Date.now() - _eoiCountCache.fetchedAt < EOI_CACHE_TTL) {
    return _eoiCountCache.count;
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    return 0;
  }

  try {
    const response = await fetch(
      `${GHL_API_BASE}/contacts/?locationId=${locationId}&query=${encodeURIComponent(tag)}&limit=1`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "Version": GHL_API_VERSION,
        },
      }
    );

    if (!response.ok) {
      console.error("GHL search error:", response.status);
      return _eoiCountCache?.count ?? 0;
    }

    const data = await response.json() as { meta?: { total?: number }; contacts?: unknown[] };
    const count = data.meta?.total ?? data.contacts?.length ?? 0;
    _eoiCountCache = { count, fetchedAt: Date.now() };
    return count;
  } catch (error) {
    console.error("GHL search failed:", error);
    return _eoiCountCache?.count ?? 0;
  }
}

// ============================================================
// SOCIAL PLANNER API — OAuth Token Management
// ============================================================

const SOCIAL_AUTH_PATH = path.resolve(import.meta.dirname, "..", ".env.social-auth");

/** Read persisted token data from .env.social-auth */
function readTokenFile(): Record<string, unknown> | null {
  try {
    if (fs.existsSync(SOCIAL_AUTH_PATH)) {
      return JSON.parse(fs.readFileSync(SOCIAL_AUTH_PATH, "utf8"));
    }
  } catch {}
  return null;
}

/** Write token data to .env.social-auth and update process.env */
export function persistTokens(data: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  location_id?: string;
  user_id?: string;
}) {
  const tokenData = {
    ...data,
    fetched_at: new Date().toISOString(),
  };
  fs.writeFileSync(SOCIAL_AUTH_PATH, JSON.stringify(tokenData, null, 2));
  process.env.GHL_OAUTH_ACCESS_TOKEN = data.access_token;
  process.env.GHL_OAUTH_REFRESH_TOKEN = data.refresh_token;
  if (data.user_id) process.env.GHL_USER_ID = data.user_id;
  console.log("[GHL OAuth] Tokens persisted");
}

/**
 * Refresh the OAuth token using the refresh_token grant.
 * Shared by both the /api/social-auth/refresh endpoint and auto-refresh.
 * Returns the new token data or throws on failure.
 */
export async function refreshGHLToken(): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  locationId?: string;
  userId?: string;
}> {
  const clientId = process.env.GHL_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GHL_OAUTH_CLIENT_SECRET;
  let refreshToken = process.env.GHL_OAUTH_REFRESH_TOKEN;

  // Try loading refresh token from file if not in env
  if (!refreshToken) {
    const fileData = readTokenFile();
    if (fileData?.refresh_token) {
      refreshToken = fileData.refresh_token as string;
    }
  }

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing OAuth credentials or refresh token for GHL refresh");
  }

  const response = await fetch("https://services.leadconnectorhq.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      user_type: "Location",
    }),
  });

  const data = await response.json() as Record<string, unknown>;
  if (!response.ok) {
    console.error("[GHL OAuth] Refresh failed:", data);
    throw new Error(`GHL token refresh failed: ${JSON.stringify(data)}`);
  }

  const result = {
    access_token: data.access_token as string,
    refresh_token: data.refresh_token as string,
    expires_in: data.expires_in as number,
    locationId: data.locationId as string | undefined,
    userId: data.userId as string | undefined,
  };

  persistTokens({
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    expires_in: result.expires_in,
    location_id: result.locationId,
    user_id: result.userId,
  });

  console.log("[GHL OAuth] Token refreshed successfully");
  return result;
}

/**
 * Check if the token is expiring within 5 minutes, refresh if needed.
 * Called before social API requests.
 */
async function refreshTokenIfNeeded(): Promise<void> {
  const fileData = readTokenFile();
  if (!fileData?.fetched_at || !fileData?.expires_in) return;

  const fetchedAt = new Date(fileData.fetched_at as string).getTime();
  const expiresIn = (fileData.expires_in as number) * 1000; // convert to ms
  const expiresAt = fetchedAt + expiresIn;
  const fiveMinutes = 5 * 60 * 1000;

  if (Date.now() > expiresAt - fiveMinutes) {
    console.log("[GHL OAuth] Token expiring soon, refreshing...");
    try {
      await refreshGHLToken();
    } catch (err) {
      console.error("[GHL OAuth] Auto-refresh failed:", err);
    }
  }
}

/**
 * Wrapper that retries a function once on 401 after refreshing the token.
 */
async function withTokenRetry<T>(fn: () => Promise<T>): Promise<T> {
  await refreshTokenIfNeeded();
  try {
    const result = await fn();
    return result;
  } catch (err: any) {
    // Check if the error is a 401-like failure
    if (err?.status === 401 || err?.message?.includes("401")) {
      console.log("[GHL OAuth] Got 401, forcing token refresh and retrying...");
      try {
        await refreshGHLToken();
        return await fn();
      } catch (refreshErr) {
        console.error("[GHL OAuth] Retry after refresh also failed:", refreshErr);
        throw refreshErr;
      }
    }
    throw err;
  }
}

/** Get the best available token for social planner (OAuth > Agency > Sub-account) */
function getSocialApiKey(): string | undefined {
  // Prefer OAuth access token (from OAuth2 flow)
  if (process.env.GHL_OAUTH_ACCESS_TOKEN) return process.env.GHL_OAUTH_ACCESS_TOKEN;
  // Try loading from persisted file
  const fileData = readTokenFile();
  if (fileData?.access_token) {
    process.env.GHL_OAUTH_ACCESS_TOKEN = fileData.access_token as string;
    process.env.GHL_OAUTH_REFRESH_TOKEN = fileData.refresh_token as string;
    return fileData.access_token as string;
  }
  // Fallback to Private Integration tokens
  return process.env.GHL_AGENCY_API_KEY || process.env.GHL_API_KEY;
}

interface GHLSocialAccount {
  id: string;
  name: string;
  platform: string;
  avatar?: string;
  type?: string;
}

interface GHLSocialPost {
  summary: string;
  accountIds: string[];
  mediaUrls?: string[]; // public URLs to images/videos
  scheduledAt?: string; // ISO datetime
  status?: "draft" | "scheduled" | "published";
}

/** Read or fetch the GHL user ID for social posting */
let _cachedUserId: string | undefined;

async function getSocialUserId(): Promise<string | undefined> {
  // Check cache
  if (_cachedUserId) return _cachedUserId;
  // Check env var
  if (process.env.GHL_USER_ID) {
    _cachedUserId = process.env.GHL_USER_ID;
    return _cachedUserId;
  }
  // Check persisted file
  try {
    const envPath = path.resolve(import.meta.dirname, "..", ".env.social-auth");
    if (fs.existsSync(envPath)) {
      const data = JSON.parse(fs.readFileSync(envPath, "utf8"));
      if (data.user_id) {
        _cachedUserId = data.user_id;
        return _cachedUserId;
      }
    }
  } catch {}
  // Fetch from GHL Users API as last resort
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (apiKey && locationId) {
    try {
      const res = await fetch(`${GHL_API_BASE}/users/?locationId=${locationId}`, {
        headers: { Authorization: `Bearer ${apiKey}`, Version: GHL_API_VERSION, Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json() as { users?: { id: string; roles?: { type?: string } }[] };
        // Pick admin user or first available
        const adminUser = data.users?.find(u => u.roles?.type === "admin") || data.users?.[0];
        if (adminUser?.id) {
          _cachedUserId = adminUser.id;
          console.log(`[GHL] Auto-resolved userId: ${_cachedUserId}`);
          // Persist for future use
          try {
            const envPath = path.resolve(import.meta.dirname, "..", ".env.social-auth");
            if (fs.existsSync(envPath)) {
              const existing = JSON.parse(fs.readFileSync(envPath, "utf8"));
              existing.user_id = _cachedUserId;
              fs.writeFileSync(envPath, JSON.stringify(existing, null, 2));
            }
          } catch {}
          return _cachedUserId;
        }
      }
    } catch (err) {
      console.error("[GHL] Failed to auto-resolve userId:", err);
    }
  }
  return undefined;
}

/**
 * Get connected social media accounts from GHL (with auto token refresh)
 */
export async function getGHLSocialAccounts(): Promise<{ success: boolean; accounts?: GHLSocialAccount[]; error?: string }> {
  return withTokenRetry(async () => {
    const apiKey = getSocialApiKey();
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey || !locationId) {
      return { success: false, error: "GHL credentials not configured." };
    }

    const response = await fetch(
      `${GHL_API_BASE}/social-media-posting/${locationId}/accounts`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Version: GHL_API_VERSION,
          Accept: "application/json",
        },
      }
    );

    if (response.status === 401) {
      throw Object.assign(new Error("401 Unauthorized"), { status: 401 });
    }

    if (!response.ok) {
      const err = await response.text();
      return { success: false, error: `GHL API error ${response.status}: ${err}` };
    }

    const data = await response.json() as any;
    const accounts: GHLSocialAccount[] = (data.results?.accounts || []).map((acc: any) => ({
      id: acc.id,
      name: acc.name,
      platform: acc.platform,
      avatar: acc.avatar,
      type: acc.type || "page",
    }));

    return { success: true, accounts };
  });
}

/**
 * Create a social media post in GHL Social Planner (with auto token refresh)
 */
export async function createGHLSocialPost(post: GHLSocialPost): Promise<{ success: boolean; postId?: string; error?: string }> {
  return withTokenRetry(async () => {
    const apiKey = getSocialApiKey();
    const locationId = process.env.GHL_LOCATION_ID;
    const userId = await getSocialUserId();

    if (!apiKey || !locationId) {
      return { success: false, error: "GHL credentials not configured." };
    }
    if (!userId) {
      return { success: false, error: "GHL user ID not configured. Re-authorize via /api/social-auth/start." };
    }

    const body: Record<string, unknown> = {
      userId,
      summary: post.summary,
      accountIds: post.accountIds,
      status: post.scheduledAt ? "scheduled" : "draft",
      type: "post",
    };

    const PROD_ORIGIN = process.env.PUBLIC_SITE_URL || "https://theharvestwitta.com.au";
    const publicMediaUrls = (post.mediaUrls || [])
      .filter(url => url.startsWith("https://") || url.startsWith("http://"))
      .map(url => url.replace(/^https?:\/\/localhost:\d+/, PROD_ORIGIN));
    if (publicMediaUrls.length) {
      body.media = publicMediaUrls.map(url => ({
        url,
        type: /\.(mp4|mov|webm|avi)$/i.test(url) ? "video/mp4" : "image/jpeg",
      }));
    }
    if (post.scheduledAt) {
      const schedDate = new Date(post.scheduledAt);
      if (schedDate.getTime() > Date.now() + 60_000) {
        body.scheduleDate = post.scheduledAt;
      } else {
        body.status = "draft";
      }
    }

    const response = await fetch(`${GHL_API_BASE}/social-media-posting/${locationId}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        Version: GHL_API_VERSION,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      throw Object.assign(new Error("401 Unauthorized"), { status: 401 });
    }

    if (!response.ok) {
      const errorData = await response.json() as GHLErrorResponse;
      console.error("GHL Social Post Error:", errorData);
      return { success: false, error: errorData.message || "Failed to create post." };
    }

    const data = await response.json() as { results?: { post?: { id?: string; _id?: string } }; id?: string };
    const postId = data.results?.post?.id || data.results?.post?._id || data.id;
    return { success: true, postId };
  });
}

/**
 * Build a map from Notion platform names → GHL account IDs.
 * Calls getGHLSocialAccounts() dynamically so new accounts are auto-detected.
 */
export async function getGHLAccountMap(): Promise<Map<string, string[]>> {
  const result = await getGHLSocialAccounts();
  const map = new Map<string, string[]>();

  if (!result.success || !result.accounts) return map;

  // GHL platform field → Notion "Target Accounts" name(s)
  const platformMapping: Record<string, string[]> = {
    instagram: ["Instagram"],
    facebook: ["Facebook"],
    google: ["Google Business"],
    linkedin: [], // disambiguated by type below
    youtube: ["YouTube"],
    twitter: ["Twitter"],
    bluesky: ["Bluesky"],
  };

  for (const acc of result.accounts) {
    const platform = acc.platform?.toLowerCase();
    let notionNames: string[];

    if (platform === "linkedin") {
      // Disambiguate LinkedIn by account type
      notionNames = acc.type === "profile"
        ? ["LinkedIn (Personal)"]
        : ["LinkedIn (Company)"];
    } else {
      notionNames = platformMapping[platform] || [acc.platform];
    }

    for (const name of notionNames) {
      const existing = map.get(name) || [];
      existing.push(acc.id);
      map.set(name, existing);
    }
  }

  return map;
}

/**
 * Get social media posts from GHL (with auto token refresh)
 */
export async function getGHLSocialPosts(status?: string): Promise<{ success: boolean; posts?: any[]; error?: string }> {
  return withTokenRetry(async () => {
    const apiKey = getSocialApiKey();
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey || !locationId) {
      return { success: false, error: "GHL credentials not configured." };
    }

    const url = `${GHL_API_BASE}/social-media-posting/${locationId}/posts/list`;
    const body: Record<string, unknown> = { limit: "50" };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: GHL_API_VERSION,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      throw Object.assign(new Error("401 Unauthorized"), { status: 401 });
    }

    if (!response.ok) {
      const errorData = await response.json() as GHLErrorResponse;
      return { success: false, error: errorData.message || "Failed to fetch posts." };
    }

    const data = await response.json() as { results?: { posts?: any[] }; posts?: any[] };
    const allPosts = data.results?.posts || data.posts || [];
    const userId = await getSocialUserId();
    const posts = userId
      ? allPosts.filter((p: any) => p.createdBy === userId)
      : allPosts;
    return { success: true, posts };
  });
}

/**
 * Search contacts by tag and return full list of contact IDs
 * Used for newsletter sending
 */
export async function searchGHLContactsByTag(tag: string): Promise<{ success: boolean; contacts?: { id: string; email?: string }[]; error?: string }> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    return { success: false, error: "GHL credentials not configured." };
  }

  try {
    const allContacts: { id: string; email?: string }[] = [];
    let offset = 0;
    const limit = 100;

    // Paginate through all contacts with this tag
    while (true) {
      const response = await fetch(
        `${GHL_API_BASE}/contacts/?locationId=${locationId}&query=${encodeURIComponent(tag)}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
            Version: GHL_API_VERSION,
          },
        }
      );

      if (!response.ok) {
        const err = await response.text();
        return { success: false, error: `GHL search error ${response.status}: ${err}` };
      }

      const data = await response.json() as { contacts?: { id: string; email?: string }[]; meta?: { total?: number } };
      const contacts = data.contacts || [];
      allContacts.push(...contacts.map(c => ({ id: c.id, email: c.email })));

      if (contacts.length < limit) break;
      offset += limit;
    }

    return { success: true, contacts: allContacts };
  } catch (error) {
    console.error("GHL contact search failed:", error);
    return { success: false, error: "Unable to search contacts." };
  }
}

/**
 * Trigger a workflow for multiple contacts in batch
 * Used for newsletter sending — triggers a GHL workflow for each subscriber
 */
export async function batchTriggerWorkflow(
  workflowId: string,
  contactIds: string[]
): Promise<{ success: boolean; triggered: number; failed: number; error?: string }> {
  const apiKey = process.env.GHL_API_KEY;

  if (!apiKey) {
    return { success: false, triggered: 0, failed: 0, error: "GHL API key not configured." };
  }

  let triggered = 0;
  let failed = 0;

  // Process in batches of 10 to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < contactIds.length; i += batchSize) {
    const batch = contactIds.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(async (contactId) => {
        const response = await fetch(`${GHL_API_BASE}/workflows/${workflowId}/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
            Version: GHL_API_VERSION,
          },
          body: JSON.stringify({ contactId }),
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
      })
    );

    for (const r of results) {
      if (r.status === "fulfilled") triggered++;
      else failed++;
    }

    // Small delay between batches
    if (i + batchSize < contactIds.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return { success: true, triggered, failed };
}

/**
 * Trigger a workflow for a contact in Go High Level
 * Used to automate follow-up sequences and nurturing campaigns
 */
export async function triggerGHLWorkflow(workflowId: string, contactId: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.GHL_API_KEY;

  if (!apiKey) {
    console.error("Go High Level API key not configured.");
    return {
      success: false,
      error: "Workflow service is not configured.",
    };
  }

  try {
    const response = await fetch(`${GHL_API_BASE}/workflows/${workflowId}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "Version": GHL_API_VERSION,
      },
      body: JSON.stringify({
        contactId: contactId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json() as GHLErrorResponse;
      console.error("GHL Workflow Trigger Error:", errorData);
      return { success: false, error: errorData.message || "Failed to trigger workflow." };
    }

    return { success: true };
  } catch (error) {
    console.error("GHL Workflow Trigger request failed:", error);
    return {
      success: false,
      error: "Unable to trigger workflow.",
    };
  }
}
