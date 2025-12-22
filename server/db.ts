import { eq, desc } from "drizzle-orm";
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
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL);
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
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
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
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
export async function getBusinessByUserId(userId: number): Promise<Business | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get business: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(businesses)
      .where(eq(businesses.userId, userId))
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

export async function claimBusiness(businessId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot claim business: database not available");
    return false;
  }

  try {
    // Check if business exists and is approved and not already claimed
    const business = await getBusinessById(businessId);
    if (!business || business.status !== "approved" || business.userId) {
      return false;
    }
    
    await db
      .update(businesses)
      .set({ userId, updatedAt: new Date() })
      .where(eq(businesses.id, businessId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to claim business:", error);
    return false;
  }
}

export async function updateBusinessProfile(
  businessId: number, 
  userId: number, 
  updates: Partial<Omit<InsertBusiness, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>>
): Promise<Business | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update business: database not available");
    return undefined;
  }

  try {
    // Verify ownership
    const business = await getBusinessById(businessId);
    if (!business || business.userId !== userId) {
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
      .where(and(eq(businesses.status, "approved"), isNull(businesses.userId)))
      .orderBy(businesses.name);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get unclaimed businesses:", error);
    return [];
  }
}
