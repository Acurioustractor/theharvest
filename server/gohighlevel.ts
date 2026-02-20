/**
 * Go High Level API Integration
 * 
 * This module handles communication with the Go High Level CRM API
 * for newsletter signups and contact management.
 */

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
