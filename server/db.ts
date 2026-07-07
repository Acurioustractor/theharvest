import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  InsertUser,
  appUsers,
  events,
  InsertEvent,
  Event,
  businesses,
  InsertBusiness,
  Business,
  memberWallEntries,
  InsertMemberWallEntry,
  MemberWallEntry,
  progressImages,
  InsertProgressImage,
  ProgressImage,
  editableContent,
  InsertEditableContent,
  EditableContent,
  sitePlanAnnotations,
  SitePlanAnnotation,
  pulseResponses,
  InsertPulseResponse,
  PulseResponse,
  eventFeedback,
  InsertEventFeedback,
  EventFeedback,
  wittaContributions,
  InsertWittaContribution,
  WittaContribution,
  imageOverrides,
  InsertImageOverride,
  ImageOverride,
  communitySubmissions,
  InsertCommunitySubmission,
  CommunitySubmission,
} from "../drizzle/schema.js";
// Blog posts are now fetched from Empathy Ledger Content Hub API
// See server/empathyLedgerClient.ts for the integration
import { ENV } from "./_core/env.js";

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;
let _skipPostgresUntil = 0;

const shouldSkipPostgres = () => Date.now() < _skipPostgresUntil;

const markPostgresTemporarilyUnavailable = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("ECIRCUITBREAKER") || message.includes("authentication failures")) {
    _skipPostgresUntil = Date.now() + 5 * 60 * 1000;
  }
};

type ImageOverrideRestRow = {
  id: number;
  page: string;
  slot: string;
  media_asset_id: string;
  src: string;
  alt_text: string | null;
  title: string | null;
  set_by: number | null;
  created_at: string;
  updated_at: string;
};

const toImageOverride = (row: ImageOverrideRestRow): ImageOverride => ({
  id: row.id,
  page: row.page,
  slot: row.slot,
  mediaAssetId: row.media_asset_id,
  src: row.src,
  altText: row.alt_text,
  title: row.title,
  setBy: row.set_by,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

async function fetchImageOverridesFromRest(params?: {
  page?: string;
  slot?: string;
  limit?: number;
}): Promise<ImageOverride[]> {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return [];

  const url = new URL("/rest/v1/image_overrides", supabaseUrl);
  url.searchParams.set("select", "*");
  url.searchParams.set("order", "updated_at.desc");
  if (params?.page) url.searchParams.set("page", `eq.${params.page}`);
  if (params?.slot) url.searchParams.set("slot", `eq.${params.slot}`);
  if (params?.limit) url.searchParams.set("limit", String(params.limit));

  const response = await fetch(url, {
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Supabase REST image_overrides failed: ${response.status} ${await response.text()}`);
  }
  const rows = (await response.json()) as ImageOverrideRestRow[];
  return rows.map(toImageOverride);
}

async function setImageOverrideViaRest(
  input: InsertImageOverride,
): Promise<ImageOverride | undefined> {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return undefined;

  const existing = await fetchImageOverridesFromRest({
    page: input.page,
    slot: input.slot,
    limit: 1,
  });

  const payload = {
    media_asset_id: input.mediaAssetId,
    src: input.src,
    alt_text: input.altText ?? null,
    title: input.title ?? null,
    set_by: input.setBy ?? null,
    updated_at: new Date().toISOString(),
    ...(existing.length === 0
      ? {
          page: input.page,
          slot: input.slot,
        }
      : {}),
  };

  const url = new URL("/rest/v1/image_overrides", supabaseUrl);
  if (existing.length > 0) {
    url.searchParams.set("id", `eq.${existing[0].id}`);
  }
  url.searchParams.set("select", "*");

  const response = await fetch(url, {
    method: existing.length > 0 ? "PATCH" : "POST",
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      "content-type": "application/json",
      prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Supabase REST image_overrides write failed: ${response.status} ${await response.text()}`);
  }
  const rows = (await response.json()) as ImageOverrideRestRow[];
  return rows[0] ? toImageOverride(rows[0]) : undefined;
}

async function clearImageOverrideViaRest(page: string, slot: string): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return false;

  const url = new URL("/rest/v1/image_overrides", supabaseUrl);
  url.searchParams.set("page", `eq.${page}`);
  url.searchParams.set("slot", `eq.${slot}`);

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Supabase REST image_overrides delete failed: ${response.status} ${await response.text()}`);
  }
  return true;
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (shouldSkipPostgres()) return null;
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL, { prepare: false });
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      markPostgresTemporarilyUnavailable(error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    // Admin emails - add your email here for auto-promotion
    const adminEmails = ['benjamin@act.place', 'dev@localhost.test'];

    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    } else if (user.email && adminEmails.includes(user.email.toLowerCase())) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }
    updateSet.updatedAt = new Date();

    await db
      .insert(appUsers)
      .values(values)
      .onConflictDoUpdate({ target: appUsers.openId, set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function promoteUserToAdmin(openId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot promote user: database not available");
    return false;
  }

  try {
    await db
      .update(appUsers)
      .set({ role: "admin", updatedAt: new Date() })
      .where(eq(appUsers.openId, openId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to promote user:", error);
    return false;
  }
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get users: database not available");
    return [];
  }

  try {
    const result = await db.select().from(appUsers).orderBy(desc(appUsers.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get users:", error);
    return [];
  }
}

// Event queries
export async function createEvent(event: InsertEvent): Promise<Event | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create event: database not available");
    return undefined;
  }

  try {
    await db.insert(events).values(event);
    // Get the inserted event
    const result = await db.select().from(events).where(eq(events.contactEmail, event.contactEmail)).orderBy(desc(events.createdAt)).limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create event:", error);
    throw error;
  }
}

export async function getApprovedEvents(): Promise<Event[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get events: database not available");
    return [];
  }

  try {
    const result = await db.select().from(events)
      .where(eq(events.status, "approved"))
      .orderBy(events.date);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get events:", error);
    return [];
  }
}

export async function getPendingEvents(): Promise<Event[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get pending events: database not available");
    return [];
  }

  try {
    const result = await db.select().from(events)
      .where(eq(events.status, "pending"))
      .orderBy(desc(events.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get pending events:", error);
    return [];
  }
}

export async function updateEventStatus(eventId: number, status: "approved" | "rejected"): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update event: database not available");
    return false;
  }

  try {
    await db
      .update(events)
      .set({ status, updatedAt: new Date() })
      .where(eq(events.id, eventId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update event status:", error);
    return false;
  }
}

// Business queries
export async function createBusiness(business: InsertBusiness): Promise<Business | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create business: database not available");
    return undefined;
  }

  try {
    await db.insert(businesses).values(business);
    const result = await db.select().from(businesses).where(eq(businesses.submitterEmail, business.submitterEmail)).orderBy(desc(businesses.createdAt)).limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create business:", error);
    throw error;
  }
}

export async function getApprovedBusinesses(): Promise<Business[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get businesses: database not available");
    return [];
  }

  try {
    const result = await db.select().from(businesses)
      .where(eq(businesses.status, "approved"))
      .orderBy(businesses.name);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get businesses:", error);
    return [];
  }
}

export async function getPendingBusinesses(): Promise<Business[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get pending businesses: database not available");
    return [];
  }

  try {
    const result = await db.select().from(businesses)
      .where(eq(businesses.status, "pending"))
      .orderBy(desc(businesses.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get pending businesses:", error);
    return [];
  }
}

export async function updateBusinessStatus(businessId: number, status: "approved" | "rejected"): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update business: database not available");
    return false;
  }

  try {
    await db
      .update(businesses)
      .set({ status, updatedAt: new Date() })
      .where(eq(businesses.id, businessId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update business status:", error);
    return false;
  }
}


// Business profile management for owners
export async function getBusinessByUserId(userOpenId: string): Promise<Business | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get business: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(businesses)
      .where(eq(businesses.userOpenId, userOpenId))
      .limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to get business by user:", error);
    return undefined;
  }
}

export async function getBusinessById(businessId: number): Promise<Business | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get business: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(businesses)
      .where(eq(businesses.id, businessId))
      .limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to get business by id:", error);
    return undefined;
  }
}

export async function claimBusiness(businessId: number, userOpenId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot claim business: database not available");
    return false;
  }

  try {
    // Check if business exists and is approved and not already claimed
    const business = await getBusinessById(businessId);
    if (!business || business.status !== "approved" || business.userOpenId) {
      return false;
    }
    
    await db
      .update(businesses)
      .set({ userOpenId, updatedAt: new Date() })
      .where(eq(businesses.id, businessId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to claim business:", error);
    return false;
  }
}

export async function updateBusinessProfile(
  businessId: number, 
  userOpenId: string, 
  updates: Partial<Omit<InsertBusiness, 'id' | 'userOpenId' | 'status' | 'createdAt' | 'updatedAt'>>
): Promise<Business | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update business: database not available");
    return undefined;
  }

  try {
    // Verify ownership
    const business = await getBusinessById(businessId);
    if (!business || business.userOpenId !== userOpenId) {
      throw new Error("Unauthorized: You don't own this business");
    }

    await db
      .update(businesses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businesses.id, businessId));
    return await getBusinessById(businessId);
  } catch (error) {
    console.error("[Database] Failed to update business profile:", error);
    throw error;
  }
}

export async function getUnclaimedApprovedBusinesses(): Promise<Business[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get unclaimed businesses: database not available");
    return [];
  }

  try {
    const { isNull } = await import("drizzle-orm");
    const { and } = await import("drizzle-orm");
    const result = await db.select().from(businesses)
      .where(and(eq(businesses.status, "approved"), isNull(businesses.userOpenId)))
      .orderBy(businesses.name);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get unclaimed businesses:", error);
    return [];
  }
}

export type PublicMemberWallEntry = {
  id: number;
  name: string;
  business: string | null;
  location: string | null;
  likesToDo: string | null;
  needs: string | null;
  connect: string | null;
  createdAt: Date;
};

export async function createMemberWallEntry(
  entry: InsertMemberWallEntry,
): Promise<MemberWallEntry | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create member wall entry: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(memberWallEntries).values(entry).returning();
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create member wall entry:", error);
    throw error;
  }
}

export async function getPublicMemberWallEntries(): Promise<PublicMemberWallEntry[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get member wall entries: database not available");
    return [];
  }

  try {
    const rows = await db
      .select({
        id: memberWallEntries.id,
        name: memberWallEntries.name,
        business: memberWallEntries.business,
        location: memberWallEntries.location,
        likesToDo: memberWallEntries.likesToDo,
        needs: memberWallEntries.needs,
        connect: memberWallEntries.connect,
        createdAt: memberWallEntries.createdAt,
      })
      .from(memberWallEntries)
      .where(eq(memberWallEntries.isPublic, true))
      .orderBy(desc(memberWallEntries.createdAt))
      .limit(24);
    return rows;
  } catch (error) {
    console.error("[Database] Failed to get member wall entries:", error);
    return [];
  }
}

// Blog posts are now managed through Empathy Ledger Content Hub
// See server/empathyLedgerClient.ts and server/routers.ts blog router

// Progress Images (Gallery) queries
export async function getProgressImages(category?: string): Promise<ProgressImage[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get progress images: database not available");
    return [];
  }

  try {
    let query = db.select().from(progressImages).where(eq(progressImages.isPublished, 1));

    if (category && category !== "all") {
      const { and } = await import("drizzle-orm");
      query = db.select().from(progressImages).where(
        and(
          eq(progressImages.isPublished, 1),
          eq(progressImages.category, category as "before" | "during" | "after" | "milestone")
        )
      );
    }

    const result = await query.orderBy(progressImages.sortOrder, desc(progressImages.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get progress images:", error);
    return [];
  }
}

export async function createProgressImage(image: InsertProgressImage): Promise<ProgressImage | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create progress image: database not available");
    return undefined;
  }

  try {
    await db.insert(progressImages).values(image);
    const result = await db.select().from(progressImages)
      .where(eq(progressImages.src, image.src))
      .orderBy(desc(progressImages.createdAt))
      .limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create progress image:", error);
    throw error;
  }
}

export async function updateProgressImage(
  imageId: number,
  updates: Partial<Omit<InsertProgressImage, 'id' | 'createdAt'>>
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update progress image: database not available");
    return false;
  }

  try {
    await db.update(progressImages).set(updates).where(eq(progressImages.id, imageId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update progress image:", error);
    return false;
  }
}

export async function deleteProgressImage(imageId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete progress image: database not available");
    return false;
  }

  try {
    await db.delete(progressImages).where(eq(progressImages.id, imageId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete progress image:", error);
    return false;
  }
}

// Editable Content queries for inline CMS
export async function getContent(page: string, slot: string): Promise<EditableContent | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get content: database not available");
    return undefined;
  }

  try {
    const { and } = await import("drizzle-orm");
    const result = await db.select().from(editableContent)
      .where(and(eq(editableContent.page, page), eq(editableContent.slot, slot)))
      .limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to get content:", error);
    return undefined;
  }
}

export async function getContentForPage(page: string): Promise<EditableContent[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get page content: database not available");
    return [];
  }

  try {
    const result = await db.select().from(editableContent)
      .where(eq(editableContent.page, page));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get page content:", error);
    return [];
  }
}

export async function upsertContent(
  page: string,
  slot: string,
  content: string,
  contentType: string = "text",
  editedBy?: number
): Promise<EditableContent | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert content: database not available");
    return undefined;
  }

  try {
    const { and } = await import("drizzle-orm");
    // Check if content exists
    const existing = await db.select().from(editableContent)
      .where(and(eq(editableContent.page, page), eq(editableContent.slot, slot)))
      .limit(1);

    if (existing.length > 0) {
      // Update
      await db.update(editableContent)
        .set({ content, contentType, editedBy, updatedAt: new Date() })
        .where(eq(editableContent.id, existing[0].id));
      return { ...existing[0], content, contentType, editedBy: editedBy ?? null, updatedAt: new Date() };
    } else {
      // Insert
      await db.insert(editableContent).values({
        page,
        slot,
        content,
        contentType,
        editedBy,
      });
      const result = await db.select().from(editableContent)
        .where(and(eq(editableContent.page, page), eq(editableContent.slot, slot)))
        .limit(1);
      return result[0];
    }
  } catch (error) {
    console.error("[Database] Failed to upsert content:", error);
    throw error;
  }
}

// Site Plan Annotations
export async function getAnnotationsForPoint(pointId: string): Promise<SitePlanAnnotation[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get annotations: database not available");
    return [];
  }

  try {
    const result = await db.select().from(sitePlanAnnotations)
      .where(eq(sitePlanAnnotations.pointId, pointId))
      .orderBy(desc(sitePlanAnnotations.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get annotations:", error);
    return [];
  }
}

export async function createAnnotation(
  pointId: string,
  type: "note" | "photo",
  content: string,
  caption?: string
): Promise<SitePlanAnnotation | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create annotation: database not available");
    return undefined;
  }

  try {
    await db.insert(sitePlanAnnotations).values({ pointId, type, content, caption });
    const result = await db.select().from(sitePlanAnnotations)
      .where(eq(sitePlanAnnotations.pointId, pointId))
      .orderBy(desc(sitePlanAnnotations.createdAt))
      .limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create annotation:", error);
    throw error;
  }
}

export async function deleteAnnotation(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete annotation: database not available");
    return false;
  }

  try {
    await db.delete(sitePlanAnnotations).where(eq(sitePlanAnnotations.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete annotation:", error);
    return false;
  }
}

// Community submissions (durable capture store; also written by the
// community-submit edge function). Used for RSVPs from the tRPC server.
export async function createCommunitySubmission(
  submission: InsertCommunitySubmission,
): Promise<CommunitySubmission | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create community submission: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(communitySubmissions).values(submission).returning();
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create community submission:", error);
    return undefined;
  }
}

// RSVP list for the admin "who's coming" view — newest first, most recent 200.
export async function listRsvpSubmissions(): Promise<CommunitySubmission[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list RSVP submissions: database not available");
    return [];
  }

  try {
    return await db
      .select()
      .from(communitySubmissions)
      .where(eq(communitySubmissions.type, "rsvp"))
      .orderBy(desc(communitySubmissions.createdAt))
      .limit(200);
  } catch (error) {
    console.error("[Database] Failed to list RSVP submissions:", error);
    return [];
  }
}

// Pulse Survey queries
export async function createPulseResponse(response: InsertPulseResponse): Promise<PulseResponse | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create pulse response: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(pulseResponses).values(response).returning();
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create pulse response:", error);
    throw error;
  }
}

export async function getPulseResults(): Promise<PulseResponse[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get pulse results: database not available");
    return [];
  }

  try {
    return await db.select().from(pulseResponses).orderBy(desc(pulseResponses.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get pulse results:", error);
    return [];
  }
}

// Event Feedback queries
export async function createEventFeedbackEntry(feedback: InsertEventFeedback): Promise<EventFeedback | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create event feedback: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(eventFeedback).values(feedback).returning();
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create event feedback:", error);
    throw error;
  }
}

export async function getEventFeedbackByEventId(eventId: number): Promise<EventFeedback[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get event feedback: database not available");
    return [];
  }

  try {
    return await db.select().from(eventFeedback)
      .where(eq(eventFeedback.eventId, eventId))
      .orderBy(desc(eventFeedback.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get event feedback:", error);
    return [];
  }
}

export async function getAllEventFeedback(): Promise<EventFeedback[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get all event feedback: database not available");
    return [];
  }

  try {
    return await db.select().from(eventFeedback).orderBy(desc(eventFeedback.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get all event feedback:", error);
    return [];
  }
}

// Witta community contributions
export async function createWittaContribution(
  input: InsertWittaContribution,
): Promise<WittaContribution | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create witta contribution: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(wittaContributions).values(input).returning();
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create witta contribution:", error);
    throw error;
  }
}

export async function getApprovedWittaContributions(): Promise<WittaContribution[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(wittaContributions)
      .where(eq(wittaContributions.status, "approved"))
      .orderBy(desc(wittaContributions.approvedAt));
  } catch (error) {
    console.error("[Database] Failed to get approved witta contributions:", error);
    return [];
  }
}

export async function getPendingWittaContributions(): Promise<WittaContribution[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(wittaContributions)
      .where(eq(wittaContributions.status, "pending"))
      .orderBy(desc(wittaContributions.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get pending witta contributions:", error);
    return [];
  }
}

export async function updateWittaContributionStatus(
  id: number,
  status: "approved" | "rejected",
  approvedBy: number,
  adminNotes?: string,
): Promise<WittaContribution | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const updates: Partial<InsertWittaContribution> = {
      status,
      adminNotes: adminNotes ?? null,
    };
    if (status === "approved") {
      updates.approvedAt = new Date();
      updates.approvedBy = approvedBy;
    }

    const result = await db
      .update(wittaContributions)
      .set(updates)
      .where(eq(wittaContributions.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to update witta contribution status:", error);
    throw error;
  }
}

// Image overrides — admin-set EL photo for a (page, slot)
export async function getImageOverride(
  page: string,
  slot: string,
): Promise<ImageOverride | undefined> {
  const db = await getDb();
  if (!db) {
    const rows = await fetchImageOverridesFromRest({ page, slot, limit: 1 });
    return rows[0];
  }
  try {
    const rows = await db
      .select()
      .from(imageOverrides)
      .where(and(eq(imageOverrides.page, page), eq(imageOverrides.slot, slot)))
      .limit(1);
    return rows[0];
  } catch (error) {
    console.error("[Database] Failed to get image override:", error);
    markPostgresTemporarilyUnavailable(error);
    try {
      const rows = await fetchImageOverridesFromRest({ page, slot, limit: 1 });
      return rows[0];
    } catch (restError) {
      console.error("[Database] Failed to get image override via Supabase REST:", restError);
      return undefined;
    }
  }
}

export async function setImageOverride(
  input: InsertImageOverride,
): Promise<ImageOverride | undefined> {
  const db = await getDb();
  if (!db) return await setImageOverrideViaRest(input);
  try {
    const existing = await db
      .select()
      .from(imageOverrides)
      .where(and(eq(imageOverrides.page, input.page), eq(imageOverrides.slot, input.slot)))
      .limit(1);

    if (existing.length > 0) {
      const updated = await db
        .update(imageOverrides)
        .set({
          mediaAssetId: input.mediaAssetId,
          src: input.src,
          altText: input.altText ?? null,
          title: input.title ?? null,
          setBy: input.setBy ?? null,
          updatedAt: new Date(),
        })
        .where(eq(imageOverrides.id, existing[0].id))
        .returning();
      return updated[0];
    }

    const created = await db.insert(imageOverrides).values(input).returning();
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to set image override:", error);
    markPostgresTemporarilyUnavailable(error);
    const row = await setImageOverrideViaRest(input);
    if (row) return row;
    throw error;
  }
}

export async function clearImageOverride(
  page: string,
  slot: string,
): Promise<boolean> {
  const db = await getDb();
  if (!db) return await clearImageOverrideViaRest(page, slot);
  try {
    await db
      .delete(imageOverrides)
      .where(and(eq(imageOverrides.page, page), eq(imageOverrides.slot, slot)));
    return true;
  } catch (error) {
    console.error("[Database] Failed to clear image override:", error);
    markPostgresTemporarilyUnavailable(error);
    try {
      return await clearImageOverrideViaRest(page, slot);
    } catch (restError) {
      console.error("[Database] Failed to clear image override via Supabase REST:", restError);
      return false;
    }
  }
}

export async function listImageOverrides(): Promise<ImageOverride[]> {
  const db = await getDb();
  if (!db) return await fetchImageOverridesFromRest();
  try {
    return await db
      .select()
      .from(imageOverrides)
      .orderBy(desc(imageOverrides.updatedAt));
  } catch (error) {
    console.error("[Database] Failed to list image overrides:", error);
    markPostgresTemporarilyUnavailable(error);
    try {
      return await fetchImageOverridesFromRest();
    } catch (restError) {
      console.error("[Database] Failed to list image overrides via Supabase REST:", restError);
      return [];
    }
  }
}
