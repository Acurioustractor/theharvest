import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
const eventCategoryEnum = pgEnum("event_category", [
  "market",
  "community",
  "arts",
  "workshop",
  "music",
]);
const eventStatusEnum = pgEnum("event_status", [
  "pending",
  "approved",
  "rejected",
]);
const businessCategoryEnum = pgEnum("business_category", [
  "markets",
  "arts",
  "accommodation",
  "services",
  "food",
  "wellness",
  "retail",
  "other",
]);
const businessStatusEnum = pgEnum("business_status", [
  "pending",
  "approved",
  "rejected",
]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const appUsers = pgTable("app_users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export type User = typeof appUsers.$inferSelect;
export type InsertUser = typeof appUsers.$inferInsert;

/**
 * Community events table for storing event submissions
 */
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  date: timestamp("date", { withTimezone: false }).notNull(),
  time: varchar("time", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  category: eventCategoryEnum("category").notNull(),
  description: text("description").notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  status: eventStatusEnum("status").default("pending").notNull(),
  submittedBy: varchar("submittedBy", { length: 255 }),
  createdAt: timestamp("createdAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Business submissions table for local enterprise registrations
 */
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  /** Link to user account - set when business is approved and user claims it */
  userId: integer("userId"),
  name: varchar("name", { length: 255 }).notNull(),
  category: businessCategoryEnum("category").notNull(),
  description: text("description").notNull(),
  address: varchar("address", { length: 500 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 500 }),
  facebook: varchar("facebook", { length: 500 }),
  instagram: varchar("instagram", { length: 500 }),
  imageUrl: varchar("imageUrl", { length: 1000 }),
  status: businessStatusEnum("status").default("pending").notNull(),
  submittedBy: varchar("submittedBy", { length: 255 }),
  submitterEmail: varchar("submitterEmail", { length: 320 }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = typeof businesses.$inferInsert;
