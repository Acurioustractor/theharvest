import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
  jsonb,
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
export const events = pgTable("harvest_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: date("date", { mode: "date" }).notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  category: eventCategoryEnum("category").notNull(),
  description: text("description").notNull(),
  contactEmail: text("contactEmail").notNull(),
  status: eventStatusEnum("status").default("pending").notNull(),
  submittedBy: text("submittedBy"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Business submissions table for local enterprise registrations
 */
export const businesses = pgTable("harvest_businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: businessCategoryEnum("category").notNull(),
  description: text("description").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  facebook: text("facebook"),
  instagram: text("instagram"),
  imageUrl: text("imageUrl"),
  status: businessStatusEnum("status").default("pending").notNull(),
  submittedBy: text("submittedBy"),
  submitterEmail: text("submitterEmail").notNull(),
  userOpenId: text("userOpenId"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = typeof businesses.$inferInsert;

/**
 * Public member wall entries for people who want a visible community profile.
 * These are opt-in, light-touch profiles with no private email shown publicly.
 */
export const memberWallEntries = pgTable("member_wall_entries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  business: varchar("business", { length: 255 }),
  location: varchar("location", { length: 180 }),
  likesToDo: text("likesToDo"),
  needs: text("needs"),
  connect: text("connect"),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export type MemberWallEntry = typeof memberWallEntries.$inferSelect;
export type InsertMemberWallEntry = typeof memberWallEntries.$inferInsert;

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
  slot: varchar("slot", { length: 200 }).notNull(),
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

/**
 * Site plan annotations for notes and photos on info points
 */
export const sitePlanAnnotations = pgTable("site_plan_annotations", {
  id: serial("id").primaryKey(),
  pointId: text("point_id").notNull(),
  type: text("type").notNull(), // 'note' or 'photo'
  content: text("content").notNull(), // note text or photo URL
  caption: text("caption"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type SitePlanAnnotation = typeof sitePlanAnnotations.$inferSelect;
export type InsertSitePlanAnnotation = typeof sitePlanAnnotations.$inferInsert;

/**
 * Community Pulse Survey Responses
 * Captures community voice data: what people want, feel, dream about
 */
export const pulseResponses = pgTable("pulse_responses", {
  id: serial("id").primaryKey(),
  // Section 1: You & This Place
  yearsInArea: text("years_in_area"),
  communityValues: jsonb("community_values").$type<string[]>(),
  whatsMissing: text("whats_missing"),
  // Section 2: The Harvest
  heardOfHarvest: text("heard_of_harvest"),
  wouldUse: jsonb("would_use").$type<string[]>(),
  visitFrequency: text("visit_frequency"),
  preferredTime: jsonb("preferred_time").$type<string[]>(),
  // Section 3: You
  skillsToShare: text("skills_to_share"),
  participationBarriers: jsonb("participation_barriers").$type<string[]>(),
  ageBracket: text("age_bracket"),
  name: text("name"),
  email: text("email"),
  // Meta
  source: text("source").default("web"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type PulseResponse = typeof pulseResponses.$inferSelect;
export type InsertPulseResponse = typeof pulseResponses.$inferInsert;

/**
 * Event Micro-Feedback
 * 30-second post-event feedback via QR code
 */
export const eventFeedback = pgTable("event_feedback", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id"),
  rating: integer("rating"),
  bestPart: text("best_part"),
  wouldReturn: text("would_return"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type EventFeedback = typeof eventFeedback.$inferSelect;
export type InsertEventFeedback = typeof eventFeedback.$inferInsert;

/**
 * Witta history community contributions.
 * Anyone can submit a memory, correction, or photo tied to a year/era.
 * Admins approve before it appears on /witta.
 */
const wittaContributionStatusEnum = pgEnum("witta_contribution_status", [
  "pending",
  "approved",
  "rejected",
]);

export const wittaContributions = pgTable("witta_contributions", {
  id: serial("id").primaryKey(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorEmail: varchar("author_email", { length: 320 }),
  /** Free-text year/era anchor — e.g. "1916", "1980s", "Today", "Pre-contact" */
  yearOrEra: varchar("year_or_era", { length: 100 }).notNull(),
  /** The contribution itself — memory, correction, story */
  memory: text("memory").notNull(),
  /** Optional uploaded image URL */
  photoUrl: varchar("photo_url", { length: 1000 }),
  status: wittaContributionStatusEnum("status").default("pending").notNull(),
  /** Admin notes — visible only to admins */
  adminNotes: text("admin_notes"),
  /** Timestamps */
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  approvedBy: integer("approved_by"),
});

export type WittaContribution = typeof wittaContributions.$inferSelect;
export type InsertWittaContribution = typeof wittaContributions.$inferInsert;

/**
 * Image overrides — admins can pick an Empathy Ledger photo for any
 * (page, slot) on the site without redeploying. Public users see the
 * override; if none set, the page falls back to its bundled default.
 *
 * Slot examples:
 *   page="works"  slot="milk-crate-pavilion-hero"
 *   page="home"   slot="hero-aerial"
 */
export const imageOverrides = pgTable("image_overrides", {
  id: serial("id").primaryKey(),
  page: varchar("page", { length: 100 }).notNull(),
  slot: varchar("slot", { length: 200 }).notNull(),
  /** EL media_asset UUID — provenance, lookups, future re-fetches */
  mediaAssetId: varchar("media_asset_id", { length: 64 }).notNull(),
  /** Cached CDN URL so we don't hit EL on every page render */
  src: varchar("src", { length: 1000 }).notNull(),
  altText: varchar("alt_text", { length: 500 }),
  title: varchar("title", { length: 255 }),
  setBy: integer("set_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ImageOverride = typeof imageOverrides.$inferSelect;
export type InsertImageOverride = typeof imageOverrides.$inferInsert;

/**
 * Community submissions — durable store for every community-submit edge
 * function capture (venue enquiries and all get-involved forms). Written
 * BEFORE the GHL upsert so a CRM outage can never lose a message.
 * Type-specific fields live in payload. Table created 2026-07-06 via
 * Supabase migration create_community_submissions; this entry keeps the
 * schema source of truth aligned (do not re-generate a create for it).
 */
export const communitySubmissions = pgTable("community_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  payload: jsonb("payload").notNull().default({}),
  ghlContactId: text("ghl_contact_id"),
  ghlSynced: boolean("ghl_synced").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type CommunitySubmission = typeof communitySubmissions.$inferSelect;
export type InsertCommunitySubmission = typeof communitySubmissions.$inferInsert;
