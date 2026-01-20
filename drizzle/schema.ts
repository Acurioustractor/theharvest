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

/**
 * Story theme categories for community voices
 */
const storyThemeEnum = pgEnum("story_theme", [
  "belonging",
  "growth",
  "connection",
  "transformation",
]);

/**
 * Story status for moderation workflow
 */
const storyStatusEnum = pgEnum("story_status", [
  "pending",
  "approved",
  "rejected",
  "featured",
]);

/**
 * Community stories table for the Stories/Empathy Ledger feature
 */
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  authorEmail: varchar("authorEmail", { length: 320 }).notNull(),
  authorRole: varchar("authorRole", { length: 255 }),
  theme: storyThemeEnum("theme"),
  status: storyStatusEnum("status").default("pending").notNull(),
  isAnonymous: integer("isAnonymous").default(0).notNull(),
  consentGiven: integer("consentGiven").default(0).notNull(),
  aiEnhanced: text("aiEnhanced"), // AI-generated enhancement of the story
  aiNarrative: text("aiNarrative"), // AI-generated audio transcript
  createdAt: timestamp("createdAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
  approvedAt: timestamp("approvedAt", { withTimezone: false }),
  approvedBy: integer("approvedBy"),
});

export type Story = typeof stories.$inferSelect;
export type InsertStory = typeof stories.$inferInsert;

/**
 * Progress gallery images for transformation journey
 */
const progressCategoryEnum = pgEnum("progress_category", [
  "before",
  "during",
  "after",
  "milestone",
]);

export const progressImages = pgTable("progress_images", {
  id: serial("id").primaryKey(),
  src: varchar("src", { length: 1000 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  date: varchar("date", { length: 20 }).notNull(), // YYYY-MM format
  category: progressCategoryEnum("category").notNull(),
  location: varchar("location", { length: 255 }),
  sortOrder: integer("sortOrder").default(0),
  isPublished: integer("isPublished").default(1).notNull(),
  uploadedBy: integer("uploadedBy"),
  createdAt: timestamp("createdAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export type ProgressImage = typeof progressImages.$inferSelect;
export type InsertProgressImage = typeof progressImages.$inferInsert;

/**
 * Workshop bookings for the booking system
 */
const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "attended",
]);

export const workshopBookings = pgTable("workshop_bookings", {
  id: serial("id").primaryKey(),
  workshopId: varchar("workshopId", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  attendees: integer("attendees").default(1).notNull(),
  dietaryRequirements: text("dietaryRequirements"),
  specialRequests: text("specialRequests"),
  status: bookingStatusEnum("status").default("pending").notNull(),
  ghlContactId: varchar("ghlContactId", { length: 100 }),
  createdAt: timestamp("createdAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
  confirmedAt: timestamp("confirmedAt", { withTimezone: false }),
});

export type WorkshopBooking = typeof workshopBookings.$inferSelect;
export type InsertWorkshopBooking = typeof workshopBookings.$inferInsert;

/**
 * Visitor quiz responses for personalization
 */
export const quizResponses = pgTable("quiz_responses", {
  id: serial("id").primaryKey(),
  personaId: varchar("personaId", { length: 50 }).notNull(),
  answers: text("answers").notNull(), // JSON stringified answers
  email: varchar("email", { length: 320 }),
  ghlContactId: varchar("ghlContactId", { length: 100 }),
  createdAt: timestamp("createdAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export type QuizResponse = typeof quizResponses.$inferSelect;
export type InsertQuizResponse = typeof quizResponses.$inferInsert;

// Blog posts are fetched from Empathy Ledger Content Hub API
// See server/empathyLedgerClient.ts for the integration

/**
 * Editable content table for inline CMS functionality
 * Allows admins to edit text content on pages without code changes
 */
export const editableContent = pgTable("editable_content", {
  id: serial("id").primaryKey(),
  /** Page identifier (e.g., "journey", "home", "about") */
  page: varchar("page", { length: 100 }).notNull(),
  /** Slot identifier within the page (e.g., "hero-title", "event-1-description") */
  slot: varchar("slot", { length: 100 }).notNull(),
  /** The actual content - can be plain text or markdown */
  content: text("content").notNull(),
  /** Content type for rendering hints */
  contentType: varchar("contentType", { length: 20 }).default("text").notNull(),
  /** Last edited by user ID */
  editedBy: integer("editedBy"),
  createdAt: timestamp("createdAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export type EditableContent = typeof editableContent.$inferSelect;
export type InsertEditableContent = typeof editableContent.$inferInsert;
