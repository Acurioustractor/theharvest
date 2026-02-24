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
  email: string;
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
        tags: input.tags || ["newsletter", "website-signup"],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json() as GHLErrorResponse;
      console.error("GHL Upsert API Error:", errorData);
      return { success: false, error: errorData.message || "Failed to subscribe. Please try again." };
    }

    const data = await response.json() as GHLContactResponse;
    return {
      success: true,
      contactId: data.contact.id,
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
// SOCIAL PLANNER API
// ============================================================

/** Get the best available token for social planner (OAuth > Agency > Sub-account) */
function getSocialApiKey(): string | undefined {
  // Prefer OAuth access token (from OAuth2 flow)
  if (process.env.GHL_OAUTH_ACCESS_TOKEN) return process.env.GHL_OAUTH_ACCESS_TOKEN;
  // Try loading from persisted file
  try {
    const envPath = path.resolve(import.meta.dirname, "..", ".env.social-auth");
    if (fs.existsSync(envPath)) {
      const data = JSON.parse(fs.readFileSync(envPath, "utf8"));
      if (data.access_token) {
        process.env.GHL_OAUTH_ACCESS_TOKEN = data.access_token;
        process.env.GHL_OAUTH_REFRESH_TOKEN = data.refresh_token;
        return data.access_token;
      }
    }
  } catch {}
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
 * Get connected social media accounts from GHL
 */
export async function getGHLSocialAccounts(): Promise<{ success: boolean; accounts?: GHLSocialAccount[]; error?: string }> {
  const apiKey = getSocialApiKey();
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    return { success: false, error: "GHL credentials not configured." };
  }

  try {
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
  } catch (err) {
    console.error("GHL social accounts error:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Create a social media post in GHL Social Planner
 */
export async function createGHLSocialPost(post: GHLSocialPost): Promise<{ success: boolean; postId?: string; error?: string }> {
  const apiKey = getSocialApiKey();
  const locationId = process.env.GHL_LOCATION_ID;
  const userId = await getSocialUserId();

  if (!apiKey || !locationId) {
    return { success: false, error: "GHL credentials not configured." };
  }
  if (!userId) {
    return { success: false, error: "GHL user ID not configured. Re-authorize via /api/social-auth/start." };
  }

  try {
    // GHL CreatePostDTO schema — locationId is in URL path, NOT body
    const body: Record<string, unknown> = {
      userId,
      summary: post.summary,
      accountIds: post.accountIds,
      status: post.scheduledAt ? "scheduled" : "draft",
      type: "post",
    };

    // Media: GHL expects array of { url, type? } objects
    // Rewrite localhost URLs to production domain so GHL can fetch them
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
        // GHL uses "scheduleDate" — must be in the future
        body.scheduleDate = post.scheduledAt;
      } else {
        // Date is in the past or too close — save as draft instead
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

    if (!response.ok) {
      const errorData = await response.json() as GHLErrorResponse;
      console.error("GHL Social Post Error:", errorData);
      return { success: false, error: errorData.message || "Failed to create post." };
    }

    const data = await response.json() as { results?: { post?: { id?: string; _id?: string } }; id?: string };
    const postId = data.results?.post?.id || data.results?.post?._id || data.id;
    return { success: true, postId };
  } catch (error) {
    console.error("GHL Social Post request failed:", error);
    return { success: false, error: "Unable to create social post." };
  }
}

/**
 * Get social media posts from GHL
 */
export async function getGHLSocialPosts(status?: string): Promise<{ success: boolean; posts?: any[]; error?: string }> {
  const apiKey = getSocialApiKey();
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    return { success: false, error: "GHL credentials not configured." };
  }

  try {
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

    if (!response.ok) {
      const errorData = await response.json() as GHLErrorResponse;
      return { success: false, error: errorData.message || "Failed to fetch posts." };
    }

    const data = await response.json() as { results?: { posts?: any[] }; posts?: any[] };
    const allPosts = data.results?.posts || data.posts || [];
    // Filter to only posts created by our OAuth user (The Harvest tile planner)
    const userId = await getSocialUserId();
    const posts = userId
      ? allPosts.filter((p: any) => p.createdBy === userId)
      : allPosts;
    return { success: true, posts };
  } catch (error) {
    console.error("GHL get posts failed:", error);
    return { success: false, error: "Unable to fetch posts." };
  }
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
