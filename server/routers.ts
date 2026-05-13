import { systemRouter } from "./_core/systemRouter.js";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc.js";
import { createEvent, getApprovedEvents, getPendingEvents, updateEventStatus, createBusiness, getApprovedBusinesses, getPendingBusinesses, updateBusinessStatus, getBusinessByUserId, getBusinessById, claimBusiness, updateBusinessProfile, getUnclaimedApprovedBusinesses, getProgressImages, createProgressImage, updateProgressImage, deleteProgressImage, promoteUserToAdmin, getAllUsers, getContent, getContentForPage, upsertContent, getAnnotationsForPoint, createAnnotation, deleteAnnotation, createPulseResponse, getPulseResults, createEventFeedbackEntry, getEventFeedbackByEventId, getAllEventFeedback, createWittaContribution, getApprovedWittaContributions, getPendingWittaContributions, updateWittaContributionStatus, getImageOverride, setImageOverride, clearImageOverride, listImageOverrides } from "./db.js";
import { storagePut } from "./storage.js";
import { getDb } from "./db.js";
import { pulseResponses } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { upsertGHLContact, addGHLContactNote, addGHLContactTag, getGHLContact, triggerGHLWorkflow, getGHLContactCountByTag, getGHLSocialAccounts, createGHLSocialPost, getGHLSocialPosts, searchGHLContactsByTag, batchTriggerWorkflow, createGHLEmailTemplate } from "./gohighlevel.js";
import { getGalleryPhotos, addGalleryPhoto, removeGalleryPhoto } from "./photoWallGallery.js";
import { empathyLedgerClient } from "./empathyLedgerClient.js";
import {
  addStorytellerToHarvest,
  addHarvestWorkTagToMedia,
  claimArticleForStoryteller,
  createHarvestArticle,
  createHarvestStory,
  deleteHarvestArticle,
  deleteHarvestStory,
  getHarvestArticle,
  getHarvestProjectStats,
  getHarvestStory,
  getPublicHarvestStoryById,
  getPublicHarvestStorytellerBySlug,
  importHarvestLocalMotionFilesToEmpathyLedger,
  listHarvestLocalMotionFilesWithElStatus,
  listHarvestMediaForAttribution,
  listHarvestStorytellersWithContent,
  listOrphanedHarvestArticles,
  listPublicHarvestStorytellers,
  searchStorytellers,
  tagArticleAsHarvest,
  tagHarvestMediaInEmpathyLedger,
  tagMediaWithStorytellers,
  removeHarvestWorkTagFromMedia,
  updateHarvestArticle,
  updateHarvestStory,
  updateStorytellerBio,
  uploadHarvestMediaToEmpathyLedger,
} from "./empathyLedgerAdmin.js";
import {
  loadTimeline,
  loadZones,
  loadTestimonials,
  loadImpact,
  loadContact,
  loadValues,
  loadOrigins,
  loadAllContent,
  listStories,
  loadStory,
  getWikiStatus,
} from "./wiki.js";
import { queryEditorialCalendar, getEditorialPost, updateEditorialPost, createEditorialPost, getEditorialProjects, getEditorialCommunicationTypes, syncReadyPosts, syncPublishedPosts } from "./notion.js";
import { z } from "zod";

const INTEREST_OPTIONS = ["kids-play", "cafe", "garden", "pop-up-events", "art-exhibitions", "something-else"] as const;

// Next upcoming Harvest gathering. Update these three lines per event — the
// rest of the system reads from them (tags, count query, workflow source).
const CURRENT_GATHERING_DATE = "2026-06-20";
const CURRENT_GATHERING_TAG = "witta-gathering-2026-06-20";
const CURRENT_GATHERING_SWITCHBOARD_TAGS = [
  `Event: Witta Gathering - ${CURRENT_GATHERING_DATE}`,
  "Event type: Public launch (50-150)",
  "Access: Open registration (Public)",
];

export const NEWSLETTER_INTEREST_OPTIONS = [
  "events",
  "workshops",
  "markets",
  "venue-hire",
  "garden-centre",
  "food-kitchen",
  "community",
  "volunteering",
  "membership",
  "sustainability",
] as const;

type NewsletterInterest = (typeof NEWSLETTER_INTEREST_OPTIONS)[number];

const NEWSLETTER_INTEREST_TAGS: Record<NewsletterInterest, string> = {
  events: "interest-events",
  workshops: "interest-workshops",
  markets: "interest-markets",
  "venue-hire": "interest-venue",
  "garden-centre": "interest-garden",
  "food-kitchen": "interest-food",
  community: "interest-community",
  volunteering: "interest-volunteer",
  membership: "interest-membership",
  sustainability: "interest-sustainability",
};

function splitPersonName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ") || undefined,
  };
}

export function buildNewsletterTags(input: {
  interests?: NewsletterInterest[];
  member?: boolean;
  extraTags?: string[];
}) {
  const tags = new Set(["newsletter", "harvest-newsletter", "harvest-website"]);

  for (const interest of input.interests || []) {
    tags.add(NEWSLETTER_INTEREST_TAGS[interest]);
  }

  if (input.member || input.interests?.includes("membership")) {
    tags.add("harvest-member");
    tags.add("interest-membership");
  }

  for (const tag of input.extraTags || []) {
    tags.add(tag);
  }

  return Array.from(tags);
}

const harvestMediaRecipeInput = z.object({
  work: z.string().min(1).max(100),
  themes: z.array(z.string().min(1).max(50)).min(1).max(4),
  categories: z.array(z.string().min(1).max(80)).min(1).max(4),
  title: z.string().min(1).max(120),
  extraTags: z.array(z.object({
    slug: z.string().min(1).max(80),
    category: z.string().min(1).max(80),
  })).max(12).optional(),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      return {
        success: true,
      } as const;
    }),
  }),

  admin: router({
    // Get all users (admin only, or first user setup)
    users: protectedProcedure.query(async ({ ctx }) => {
      // Allow if admin OR if this is the first/only user (for initial setup)
      const users = await getAllUsers();
      if (ctx.user.role !== "admin" && users.length > 1) {
        throw new Error("Unauthorized");
      }
      return users;
    }),

    // Promote user to admin (requires existing admin, or first user can self-promote)
    promoteToAdmin: protectedProcedure
      .input(z.object({ openId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const users = await getAllUsers();
        const hasAdmin = users.some(u => u.role === "admin");

        // Allow if: current user is admin, OR no admins exist yet (first setup)
        if (ctx.user.role !== "admin" && hasAdmin) {
          throw new Error("Unauthorized - only admins can promote users");
        }

        const success = await promoteUserToAdmin(input.openId);
        return { success };
      }),
  }),

  events: router({
    // Public: Get all approved events
    list: publicProcedure.query(async () => {
      return await getApprovedEvents();
    }),

    // Public: Submit a new event (goes to pending) + GHL contact
    submit: publicProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        date: z.string(),
        time: z.string().min(1).max(100),
        location: z.string().min(1).max(255),
        category: z.enum(["market", "community", "arts", "workshop", "music"]),
        description: z.string().min(1),
        contactEmail: z.string().email(),
        submittedBy: z.string().trim().min(1).max(120),
      }))
      .mutation(async ({ input }) => {
        const event = await createEvent({
          ...input,
          date: new Date(input.date),
          status: "pending",
        });

        // Create/update GHL contact with event submission tags
        try {
          const { firstName, lastName } = splitPersonName(input.submittedBy);
          const result = await upsertGHLContact({
            email: input.contactEmail,
            firstName,
            lastName,
            source: "Website - Event Submission",
            tags: ["event-submission", "harvest-website"],
          });

          if (result.contactId) {
            await addGHLContactNote(result.contactId,
              `**Event Submission**\n\n**Title:** ${input.title}\n**Date:** ${input.date}\n**Time:** ${input.time}\n**Location:** ${input.location}\n**Category:** ${input.category}\n**Description:** ${input.description}`
            );

            const workflowId = process.env.GHL_EVENT_SUBMIT_WORKFLOW_ID;
            if (workflowId) {
              triggerGHLWorkflow(workflowId, result.contactId).catch(err =>
                console.error("GHL workflow trigger failed (event submit):", err)
              );
            }
          }
        } catch (err) {
          console.error("GHL event contact creation failed:", err);
        }

        return { success: true, event };
      }),

    // Admin: Get pending events
    pending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getPendingEvents();
    }),

    // Admin: Approve or reject an event
    updateStatus: protectedProcedure
      .input(z.object({
        eventId: z.number(),
        status: z.enum(["approved", "rejected"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const success = await updateEventStatus(input.eventId, input.status);
        return { success };
      }),
  }),

  businesses: router({
    // Public: Get all approved businesses
    list: publicProcedure.query(async () => {
      return await getApprovedBusinesses();
    }),

    // Public: Submit a new business (goes to pending) + GHL contact
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        category: z.enum(["markets", "arts", "accommodation", "services", "food", "wellness", "retail", "other"]),
        description: z.string().min(1),
        address: z.string().max(500).optional(),
        phone: z.string().max(50).optional(),
        email: z.string().email().optional(),
        website: z.string().url().optional().or(z.literal("")),
        facebook: z.string().max(500).optional(),
        instagram: z.string().max(500).optional(),
        imageUrl: z.string().url().optional().or(z.literal("")),
        submittedBy: z.string().trim().min(1).max(120),
        submitterEmail: z.string().email(),
      }))
      .mutation(async ({ input }) => {
        const business = await createBusiness({
          ...input,
          status: "pending",
        });

        // Create/update GHL contact with business registration tags
        try {
          const { firstName, lastName } = splitPersonName(input.submittedBy);
          const result = await upsertGHLContact({
            email: input.submitterEmail,
            firstName,
            lastName,
            phone: input.phone,
            source: "Website - Business Registration",
            tags: ["business-registration", "harvest-website"],
          });

          if (result.contactId) {
            await addGHLContactNote(result.contactId,
              `**Business Registration**\n\n**Business Name:** ${input.name}\n**Category:** ${input.category}\n**Description:** ${input.description}\n**Address:** ${input.address || "Not provided"}\n**Website:** ${input.website || "Not provided"}`
            );

            const workflowId = process.env.GHL_BUSINESS_REG_WORKFLOW_ID;
            if (workflowId) {
              triggerGHLWorkflow(workflowId, result.contactId).catch(err =>
                console.error("GHL workflow trigger failed (business reg):", err)
              );
            }
          }
        } catch (err) {
          console.error("GHL business contact creation failed:", err);
        }

        return { success: true, business };
      }),

    // Admin: Get pending businesses
    pending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getPendingBusinesses();
    }),

    // Admin: Approve or reject a business
    updateStatus: protectedProcedure
      .input(z.object({
        businessId: z.number(),
        status: z.enum(["approved", "rejected"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const success = await updateBusinessStatus(input.businessId, input.status);
        return { success };
      }),

    // Owner: Get my business profile
    myBusiness: protectedProcedure.query(async ({ ctx }) => {
      const business = await getBusinessByUserId(ctx.user.id);
      return business ?? null; // tRPC requires non-undefined return values
    }),

    // Owner: Get unclaimed approved businesses (for claiming)
    unclaimed: protectedProcedure.query(async () => {
      return await getUnclaimedApprovedBusinesses();
    }),

    // Owner: Claim a business
    claim: protectedProcedure
      .input(z.object({
        businessId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if user already has a business
        const existingBusiness = await getBusinessByUserId(ctx.user.id);
        if (existingBusiness) {
          throw new Error("You already have a claimed business");
        }
        const success = await claimBusiness(input.businessId, ctx.user.id);
        if (!success) {
          throw new Error("Unable to claim this business. It may already be claimed or not approved.");
        }
        return { success };
      }),

    // Owner: Update my business profile
    updateProfile: protectedProcedure
      .input(z.object({
        businessId: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().min(1).optional(),
        address: z.string().max(500).optional(),
        phone: z.string().max(50).optional(),
        email: z.string().email().optional().or(z.literal("")),
        website: z.string().url().optional().or(z.literal("")),
        facebook: z.string().max(500).optional(),
        instagram: z.string().max(500).optional(),
        imageUrl: z.string().url().optional().or(z.literal("")),
      }))
      .mutation(async ({ ctx, input }) => {
        const { businessId, ...updates } = input;
        // Filter out undefined values
        const cleanUpdates = Object.fromEntries(
          Object.entries(updates).filter(([_, v]) => v !== undefined)
        );
        const business = await updateBusinessProfile(businessId, ctx.user.id, cleanUpdates);
        return { success: true, business };
      }),
  }),

  eoi: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email().nullish(),
        phone: z.string().nullish(),
        excitement: z.string().optional(),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        if (!input.email && !input.phone) {
          throw new Error("Email or phone is required");
        }
        const { firstName, lastName } = splitPersonName(input.name);

        const result = await upsertGHLContact({
          email: input.email || undefined,
          firstName,
          lastName,
          phone: input.phone || undefined,
          source: `RSVP - Witta Gathering ${CURRENT_GATHERING_DATE}`,
          tags: [
            CURRENT_GATHERING_TAG,
            "harvest-event-attendee",
            "harvest-website",
            ...CURRENT_GATHERING_SWITCHBOARD_TAGS,
          ],
        });

        if (result.contactId && input.excitement) {
          await addGHLContactNote(result.contactId,
            `**RSVP - Witta Gathering ${CURRENT_GATHERING_DATE}**\n\n**What excites them:** ${input.excitement}\n**Source:** ${input.source || "Not specified"}`
          );
        }

        if (result.contactId) {
          const workflowId = process.env.GHL_GATHERING_RSVP_WORKFLOW_ID || process.env.GHL_EOI_WORKFLOW_ID;
          if (workflowId) {
            triggerGHLWorkflow(workflowId, result.contactId).catch(err =>
              console.error("GHL workflow trigger failed (gathering rsvp):", err)
            );
          }
        }

        return { success: true };
      }),

    count: publicProcedure.query(async () => {
      const count = await getGHLContactCountByTag(CURRENT_GATHERING_TAG);
      return { count };
    }),
  }),

  // Workshop bookings via GHL
  workshops: router({
    book: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        workshopTitle: z.string().min(1),
        workshopDate: z.string().min(1),
        attendees: z.number().min(1).max(10),
        dietaryRequirements: z.string().optional(),
        specialRequests: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { firstName, lastName } = splitPersonName(input.name);

        const result = await upsertGHLContact({
          email: input.email,
          firstName,
          lastName,
          phone: input.phone,
          source: "Website - Workshop Booking",
          tags: ["workshop-booking", "harvest-website"],
        });

        if (result.contactId) {
          await addGHLContactNote(result.contactId,
            `**Workshop Booking**\n\n**Workshop:** ${input.workshopTitle}\n**Date:** ${input.workshopDate}\n**Attendees:** ${input.attendees}\n**Dietary:** ${input.dietaryRequirements || "None"}\n**Special Requests:** ${input.specialRequests || "None"}`
          );

          const workflowId = process.env.GHL_WORKSHOP_WORKFLOW_ID;
          if (workflowId) {
            triggerGHLWorkflow(workflowId, result.contactId).catch(err =>
              console.error("GHL workflow trigger failed (workshop):", err)
            );
          }
        }

        return { success: true, message: "Booking request submitted. We'll confirm your spot within 24 hours." };
      }),
  }),

  // Visitor quiz results via GHL
  quiz: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().trim().min(1).max(120),
        email: z.string().email(),
        persona: z.string().min(1),
        ghlTags: z.array(z.string()),
        motivation: z.string().optional(),
        frequency: z.string().optional(),
        interests: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { firstName, lastName } = splitPersonName(input.name);
        const result = await upsertGHLContact({
          email: input.email,
          firstName,
          lastName,
          source: "Website - Visitor Quiz",
          tags: [...input.ghlTags, "quiz-completed", "harvest-website"],
        });

        if (result.contactId) {
          const interestsList = input.interests?.join(", ") || "None selected";
          await addGHLContactNote(result.contactId,
            `**Visitor Quiz Result**\n\n**Persona:** ${input.persona}\n**Motivation:** ${input.motivation || "Not specified"}\n**Visit Frequency:** ${input.frequency || "Not specified"}\n**Interests:** ${interestsList}`
          );

          const workflowId = process.env.GHL_QUIZ_WORKFLOW_ID;
          if (workflowId) {
            triggerGHLWorkflow(workflowId, result.contactId).catch(err =>
              console.error("GHL workflow trigger failed (quiz):", err)
            );
          }
        }

        return { success: true, message: "Welcome to The Harvest community!" };
      }),
  }),

  // Interest Poll - what excites you about The Harvest?
  interestPoll: router({
    vote: publicProcedure
      .input(z.object({
        interests: z.array(z.string()).min(1),
        other: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        await db.insert(pulseResponses).values({
          wouldUse: input.interests,
          skillsToShare: input.other ?? undefined,
          source: "interest-poll",
        });
        return { success: true };
      }),

    results: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { counts: {}, total: 0 };
      const rows = await db.select({ wouldUse: pulseResponses.wouldUse })
        .from(pulseResponses)
        .where(eq(pulseResponses.source, "interest-poll"));
      const counts: Record<string, number> = {};
      for (const row of rows) {
        const interests = row.wouldUse as string[] | null;
        if (interests) {
          for (const interest of interests) {
            counts[interest] = (counts[interest] || 0) + 1;
          }
        }
      }
      return { counts, total: rows.length };
    }),
  }),

  newsletter: router({
    // Public: Subscribe to newsletter via Go High Level
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        phone: z.string().nullish(),
        firstName: z.string().trim().min(1).max(100),
        lastName: z.string().trim().max(100).optional(),
        source: z.string().max(100).optional(),
        interests: z.array(z.enum(NEWSLETTER_INTEREST_OPTIONS)).optional(),
        member: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const interests = input.interests || [];
        const allTags = buildNewsletterTags({
          interests,
          member: input.member,
        });

        const result = await upsertGHLContact({
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone || undefined,
          source: input.source || "The Harvest Website Newsletter",
          tags: allTags,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to subscribe");
        }

        if (result.contactId) {
          const isMember = Boolean(input.member || interests.includes("membership"));
          const workflowId = isMember
            ? process.env.GHL_MEMBER_WELCOME_WORKFLOW_ID || process.env.GHL_NEWSLETTER_WORKFLOW_ID
            : process.env.GHL_NEWSLETTER_WORKFLOW_ID;
          if (workflowId) {
            triggerGHLWorkflow(workflowId, result.contactId).catch(err =>
              console.error("GHL workflow trigger failed (newsletter):", err)
            );
          }
        }

        return {
          success: true,
          message: input.member ? "Successfully joined the Harvest member list!" : "Successfully subscribed to the newsletter!",
        };
      }),

    // Get subscriber count
    subscriberCount: publicProcedure
      .query(async () => {
        const count = await getGHLContactCountByTag("newsletter");
        return { count };
      }),

    // Send campaign: find contacts by tag, trigger workflow for each
    sendCampaign: publicProcedure
      .input(z.object({
        tag: z.string().min(1).default("newsletter"),
        workflowId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const workflowId = input.workflowId || process.env.GHL_NEWSLETTER_WORKFLOW_ID;
        if (!workflowId) {
          return { success: false, error: "Newsletter workflow ID not configured. Set GHL_NEWSLETTER_WORKFLOW_ID env var.", contactCount: 0 };
        }

        const searchResult = await searchGHLContactsByTag(input.tag);
        if (!searchResult.success || !searchResult.contacts?.length) {
          return { success: false, error: searchResult.error || "No subscribers found.", contactCount: 0 };
        }

        const contactIds = searchResult.contacts.map(c => c.id);
        const batchResult = await batchTriggerWorkflow(workflowId, contactIds);

        return {
          success: batchResult.success,
          contactCount: batchResult.triggered,
          failed: batchResult.failed,
          error: batchResult.error,
        };
      }),
  }),

  members: router({
    question: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(120),
        email: z.string().email(),
        phone: z.string().max(60).nullish(),
        question: z.string().min(1).max(2000),
        source: z.string().max(100).optional(),
      }))
      .mutation(async ({ input }) => {
        const [firstName, ...rest] = input.name.trim().split(/\s+/);
        const result = await upsertGHLContact({
          email: input.email,
          firstName,
          lastName: rest.join(" ") || undefined,
          phone: input.phone || undefined,
          source: input.source || "Harvest member question",
          tags: buildNewsletterTags({
            member: true,
            interests: ["membership"],
            extraTags: ["member-question"],
          }),
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to send question");
        }

        if (result.contactId) {
          const noteResult = await addGHLContactNote(
            result.contactId,
            `**Member question**\n\n**Question:**\n${input.question}\n\n**Source:** ${input.source || "Membership page"}`
          );

          if (!noteResult.success) {
            throw new Error(noteResult.error || "Failed to save question");
          }

          const workflowId = process.env.GHL_MEMBER_QUESTION_WORKFLOW_ID || process.env.GHL_CONTACT_FORM_WORKFLOW_ID;
          if (workflowId) {
            const workflowResult = await triggerGHLWorkflow(workflowId, result.contactId);
            if (!workflowResult.success) {
              console.error("GHL workflow trigger failed (member question):", workflowResult.error);
            }
          }
        }

        return { success: true };
      }),
  }),

  photoWall: router({
    submit: publicProcedure
      .input(z.object({
        firstName: z.string().min(1).max(100),
        email: z.string().email(),
        phone: z.string().max(20).optional(),
        response: z.string().max(1000).optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await upsertGHLContact({
          email: input.email,
          firstName: input.firstName,
          phone: input.phone,
          source: "Photo Wall — Witta Gathering",
          tags: ["photo-wall", "harvest-website", "harvest-gathering-photos"],
        });

        if (!result.success) {
          return { success: false, error: result.error };
        }

        if (result.contactId && input.response) {
          addGHLContactNote(
            result.contactId,
            `**Photo Wall — What would you love to see grow here?**\n\n${input.response}`
          ).catch(err => console.error("Photo wall note failed:", err));
        }

        // Trigger notification workflow if configured
        const workflowId = process.env.GHL_PHOTO_WALL_WORKFLOW_ID;
        if (workflowId && result.contactId) {
          triggerGHLWorkflow(workflowId, result.contactId).catch(err =>
            console.error("GHL workflow trigger failed (photo wall):", err)
          );
        }

        return { success: true, contactId: result.contactId };
      }),

    getContact: publicProcedure
      .input(z.object({ contactId: z.string().min(1) }))
      .query(async ({ input }) => {
        const result = await getGHLContact(input.contactId);
        if (!result.success || !result.contact) {
          throw new Error(result.error || "Contact not found");
        }
        return { firstName: result.contact.firstName, lastName: result.contact.lastName };
      }),

    addNote: publicProcedure
      .input(z.object({
        contactId: z.string().min(1),
        note: z.string().min(1).max(2000),
      }))
      .mutation(async ({ input }) => {
        const result = await addGHLContactNote(input.contactId, `**Photo Wall Note**\n\n${input.note}`);
        if (!result.success) {
          throw new Error(result.error || "Failed to save note");
        }
        return { success: true };
      }),

    sendPhoto: publicProcedure
      .input(z.object({
        contactId: z.string().min(1),
        photoUrl: z.string().url(),
      }))
      .mutation(async ({ input }) => {
        const result = await addGHLContactNote(
          input.contactId,
          `**Your Photo Wall Portrait**\nHere's your portrait from The Harvest: ${input.photoUrl}`
        );
        if (!result.success) {
          throw new Error(result.error || "Failed to add photo note");
        }
        return { success: true };
      }),

    // Upload a photo to the shared gallery (via Supabase Storage)
    upload: publicProcedure
      .input(z.object({
        base64Data: z.string().min(1),
        fileName: z.string().min(1),
        contentType: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !serviceKey) {
          throw new Error("Supabase credentials not configured for photo upload");
        }

        const buffer = Buffer.from(input.base64Data, "base64");
        const filePath = `${Date.now()}-${input.fileName}`;

        const response = await fetch(
          `${supabaseUrl}/storage/v1/object/photo-wall/${filePath}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${serviceKey}`,
              "Content-Type": input.contentType,
              "x-upsert": "true",
            },
            body: buffer,
            // @ts-expect-error duplex needed for Node fetch with body stream
            duplex: "half",
          }
        );

        if (!response.ok) {
          const err = await response.text();
          console.error("Supabase storage upload failed:", response.status, err);
          throw new Error("Photo upload failed");
        }

        const url = `${supabaseUrl}/storage/v1/object/public/photo-wall/${filePath}`;
        return { success: true, url };
      }),

    // Get all gallery photos (list from Supabase storage, fall back to local JSON)
    gallery: publicProcedure.query(async () => {
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && serviceKey) {
        try {
          const res = await fetch(`${supabaseUrl}/storage/v1/object/list/photo-wall`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${serviceKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prefix: "", limit: 500, sortBy: { column: "created_at", order: "desc" } }),
          });
          if (res.ok) {
            const files = await res.json() as Array<{ name: string; created_at: string }>;
            return files
              .filter((f: { name: string }) => !f.name.startsWith("."))
              .map((f: { name: string; created_at: string }) => ({
                url: `${supabaseUrl}/storage/v1/object/public/photo-wall/${f.name}`,
                fileName: f.name.replace(/^\d+-/, ""),
                uploadedAt: f.created_at,
              }));
          }
        } catch (err) {
          console.error("Failed to list photos from Supabase storage:", err);
        }
      }
      return getGalleryPhotos();
    }),

    // Delete a photo from the gallery
    deletePhoto: publicProcedure
      .input(z.object({ url: z.string().min(1) }))
      .mutation(async ({ input }) => {
        // Delete from Supabase storage
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (supabaseUrl && serviceKey) {
          const prefix = `${supabaseUrl}/storage/v1/object/public/photo-wall/`;
          if (input.url.startsWith(prefix)) {
            const filePath = input.url.slice(prefix.length);
            const res = await fetch(`${supabaseUrl}/storage/v1/object/photo-wall/${filePath}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${serviceKey}` },
            });
            return { success: res.ok };
          }
        }

        return { success: false };
      }),

    // Add photo-wall-ready tag to all photo-wall contacts (triggers GHL text workflow)
    notifyAll: publicProcedure.mutation(async () => {
      const searchResult = await searchGHLContactsByTag("photo-wall");
      if (!searchResult.success || !searchResult.contacts?.length) {
        return { success: false, error: searchResult.error || "No photo-wall contacts found.", tagged: 0 };
      }

      let tagged = 0;
      let failed = 0;
      for (const contact of searchResult.contacts) {
        const result = await addGHLContactTag(contact.id, "photo-wall-ready");
        if (result.success) tagged++;
        else failed++;
      }

      return { success: true, tagged, failed, total: searchResult.contacts.length };
    }),
  }),

  blog: router({
    // Public: Get articles from Empathy Ledger with optional filters
    list: publicProcedure
      .input(z.object({
        theme: z.string().optional(),
        type: z.string().optional(),
        project: z.string().optional(), // EL primaryProject — e.g. work slug
        page: z.number().optional(),
        limit: z.number().min(1).max(50).optional(),
      }).optional())
      .query(async ({ input }) => {
        const response = await empathyLedgerClient.fetchArticles({
          theme: input?.theme,
          type: input?.type,
          project: input?.project,
          page: input?.page,
          limit: input?.limit || 20,
        });
        return response;
      }),

    // Public: Get recent articles for homepage
    recent: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(10).default(3),
      }).optional())
      .query(async ({ input }) => {
        const articles = await empathyLedgerClient.fetchRecentArticles(input?.limit ?? 3);
        return articles;
      }),

    // Public: Get single article by slug
    bySlug: publicProcedure
      .input(z.object({
        slug: z.string().min(1),
      }))
      .query(async ({ input }) => {
        const article = await empathyLedgerClient.fetchArticle(input.slug);
        if (!article) {
          throw new Error("Article not found");
        }
        return article;
      }),

    // Public: Search articles
    search: publicProcedure
      .input(z.object({
        query: z.string().min(2),
        limit: z.number().min(1).max(20).optional(),
      }))
      .query(async ({ input }) => {
        const results = await empathyLedgerClient.search(input.query, {
          type: "articles",
          limit: input.limit || 10,
        });
        return results;
      }),
  }),

  // Public-facing Harvest content surface (storytellers + their work).
  // No auth — these power /people pages on the public site.
  harvest: router({
    publicStorytellers: publicProcedure.query(async () => {
      return listPublicHarvestStorytellers();
    }),

    publicStorytellerBySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1).max(100) }))
      .query(async ({ input }) => {
        return getPublicHarvestStorytellerBySlug(input.slug);
      }),

    publicStoryById: publicProcedure
      .input(z.object({ storyId: z.string().uuid() }))
      .query(async ({ input }) => {
        return getPublicHarvestStoryById(input.storyId);
      }),
  }),

  // Wiki content from thoughts/wiki folder
  wiki: router({
    // Get all content at once (for initial page load)
    all: publicProcedure.query(() => {
      return loadAllContent();
    }),

    // Journey page: timeline events
    timeline: publicProcedure.query(() => {
      return loadTimeline();
    }),

    // Explore page: zones
    zones: publicProcedure.query(() => {
      return loadZones();
    }),

    // Stories page: testimonials
    testimonials: publicProcedure
      .input(z.object({
        page: z.string().optional(), // Filter by page: "home", "stories", etc.
        featured: z.boolean().optional(),
      }).optional())
      .query(({ input }) => {
        let testimonials = loadTestimonials();

        if (input?.page) {
          testimonials = testimonials.filter(t => t.pages.includes(input.page!));
        }
        if (input?.featured !== undefined) {
          testimonials = testimonials.filter(t => t.featured === input.featured);
        }

        return testimonials;
      }),

    // Impact metrics
    impact: publicProcedure
      .input(z.object({
        section: z.enum(["stories", "membership", "journey"]).optional(),
      }).optional())
      .query(({ input }) => {
        const impact = loadImpact();
        if (!impact) return null;

        if (input?.section === "stories") return impact.stories_stats;
        if (input?.section === "membership") return impact.membership_stats;
        if (input?.section === "journey") return impact.journey_stats;

        return impact;
      }),

    // Contact info
    contact: publicProcedure.query(() => {
      return loadContact();
    }),

    // Values content (markdown)
    values: publicProcedure.query(() => {
      return loadValues();
    }),

    // Origins story (markdown)
    origins: publicProcedure.query(() => {
      return loadOrigins();
    }),

    // List all community stories
    stories: publicProcedure.query(() => {
      return listStories();
    }),

    // Get a specific story by slug
    story: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => {
        return loadStory(input.slug);
      }),

    // Admin: Get wiki status
    status: protectedProcedure.query(({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return getWikiStatus();
    }),
  }),

  // Gallery - Progress images for the transformation journey
  // Supports both local database and Empathy Ledger sync
  gallery: router({
    // Public: Get all published progress images (local database)
    list: publicProcedure
      .input(z.object({
        category: z.enum(["all", "before", "during", "after", "milestone"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        const images = await getProgressImages(input?.category || "all");
        return images;
      }),

    // Public: Get gallery images from Empathy Ledger
    //
    // Strategy:
    //   - When ANY filter is set (work, theme, tag, category) → use the strict
    //     /harvest/gallery endpoint which returns only tagged photos with the
    //     rich metadata (themes, works, special, etc).
    //   - When NO filter is set → fall back to the full /content-hub/media
    //     endpoint scoped to project=the-harvest. This returns the entire ~394
    //     photo library including untagged uploads, so the photo picker shows
    //     everything an editor might want.
    //   - Merging: strict-tagged photos are returned first (they have richer
    //     metadata for filtering/display), then any untagged photos from the
    //     full library that aren't already in the strict set.
    fromEL: publicProcedure
      .input(z.object({
        category: z.enum(["all", "before", "during", "after", "milestone", "general"]).optional(),
        tag: z.string().optional(), // Page tag: "home", "journey", "stories", etc.
        theme: z.string().optional(), // Theme: "eat", "grow", "make", "gather"
        project: z.string().optional(), // Project slug (legacy / project_id filter)
        work: z.string().optional(), // Harvest work slug — filters by harvest-work tag
        limit: z.number().min(1).max(500).optional(),
        page: z.number().min(1).optional(),
      }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit || 50;
        const hasFilter = Boolean(
          input?.work || input?.theme || input?.tag ||
          (input?.category && input.category !== "all") ||
          input?.project,
        );

        // Filtered — use the strict /harvest/gallery endpoint that returns
        // only tagged photos with the rich metadata needed for filtering.
        if (hasFilter) {
          return await empathyLedgerClient.fetchHarvestGallery({
            category: input?.category === "all" ? undefined : input?.category,
            tag: input?.tag,
            theme: input?.theme,
            project: input?.project,
            work: input?.work,
            limit,
            page: input?.page,
          });
        }

        // No filter — return the full library so untagged uploads appear too.
        // /content-hub/media?project=the-harvest returns all ~394 photos.
        return await empathyLedgerClient.fetchAllHarvestMedia({
          limit,
          page: input?.page,
        });
      }),

    // Public: Get media for a specific Work (one of the 5 collection pieces)
    // Filters by harvest-work tag (mill-crate-pavilion / the-cedar / etc.)
    // Tag photos with `harvest-work: <slug>` in EL admin to make them appear here.
    forWork: publicProcedure
      .input(z.object({
        slug: z.string().min(1).max(100), // e.g. "milk-crate-pavilion"
        limit: z.number().min(1).max(100).optional(),
      }))
      .query(async ({ input }) => {
        return await empathyLedgerClient.fetchHarvestGallery({
          work: input.slug,
          limit: input.limit ?? 24,
        });
      }),

    // Public: Get media for a specific page
    // Uses dedicated Harvest gallery API
    forPage: publicProcedure
      .input(z.object({
        page: z.string().min(1), // Page tag: "home", "journey", "stories", etc.
        limit: z.number().min(1).max(20).optional(),
      }))
      .query(async ({ input }) => {
        const media = await empathyLedgerClient.fetchHarvestMediaForPage(input.page, input.limit || 10);
        return media;
      }),

    // Admin: Add a new progress image
    create: protectedProcedure
      .input(z.object({
        src: z.string().min(1).max(1000),
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        date: z.string().min(1).max(20), // YYYY-MM format
        category: z.enum(["before", "during", "after", "milestone"]),
        location: z.string().max(255).optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const image = await createProgressImage({
          ...input,
          isPublished: 1,
          uploadedBy: ctx.user.id,
        });
        return { success: true, image };
      }),

    // Admin: Update a progress image
    update: protectedProcedure
      .input(z.object({
        imageId: z.number(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        date: z.string().max(20).optional(),
        category: z.enum(["before", "during", "after", "milestone"]).optional(),
        location: z.string().max(255).optional(),
        sortOrder: z.number().optional(),
        isPublished: z.number().min(0).max(1).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const { imageId, ...updates } = input;
        const success = await updateProgressImage(imageId, updates);
        return { success };
      }),

    // Admin: Delete a progress image
    delete: protectedProcedure
      .input(z.object({
        imageId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const success = await deleteProgressImage(input.imageId);
        return { success };
      }),
  }),

  // Site plan annotations (notes & photos on info points)
  sitePlan: router({
    annotations: publicProcedure
      .input(z.object({ pointId: z.string() }))
      .query(async ({ input }) => {
        return await getAnnotationsForPoint(input.pointId);
      }),

    addNote: publicProcedure
      .input(z.object({ pointId: z.string(), content: z.string().min(1) }))
      .mutation(async ({ input }) => {
        const annotation = await createAnnotation(input.pointId, "note", input.content);
        return { success: true, annotation };
      }),

    uploadPhoto: publicProcedure
      .input(z.object({
        pointId: z.string(),
        fileName: z.string(),
        base64Data: z.string(),
        contentType: z.string(),
        caption: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64Data, "base64");
        const key = `site-plan/${input.pointId}/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        const annotation = await createAnnotation(input.pointId, "photo", url, input.caption);
        return { success: true, annotation };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const success = await deleteAnnotation(input.id);
        return { success };
      }),
  }),

  // Community Pulse Survey
  pulse: router({
    submit: publicProcedure
      .input(z.object({
        yearsInArea: z.string().optional(),
        communityValues: z.array(z.string()).optional(),
        whatsMissing: z.string().optional(),
        heardOfHarvest: z.string().optional(),
        wouldUse: z.array(z.string()).optional(),
        visitFrequency: z.string().optional(),
        preferredTime: z.array(z.string()).optional(),
        skillsToShare: z.string().optional(),
        participationBarriers: z.array(z.string()).optional(),
        ageBracket: z.string().optional(),
        name: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const cleanEmail = input.email || undefined;
        const cleanName = input.name?.trim() || undefined;
        const response = await createPulseResponse({
          ...input,
          email: cleanEmail,
        });

        // Only sync to GHL when we have both email and a real name.
        if (cleanEmail && cleanName) {
          const interestTags = (input.wouldUse || []).map(u => `interest-${u}`);
          const pulseResult = await upsertGHLContact({
            email: cleanEmail,
            firstName: cleanName.split(" ")[0],
            lastName: cleanName.split(" ").slice(1).join(" ") || undefined,
            source: "Community Pulse Survey",
            tags: ["pulse-respondent", "harvest-website", ...interestTags],
          });

          if (pulseResult.contactId) {
            const workflowId = process.env.GHL_PULSE_WORKFLOW_ID;
            if (workflowId) {
              triggerGHLWorkflow(workflowId, pulseResult.contactId).catch(err =>
                console.error("GHL workflow trigger failed (pulse):", err)
              );
            }
          }
        } else if (cleanEmail && !cleanName) {
          console.warn("[Pulse] Skipping GHL sync because email was provided without a name.");
        }

        return { success: true, id: response?.id };
      }),

    results: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getPulseResults();
    }),
  }),

  // Event Micro-Feedback
  feedback: router({
    submit: publicProcedure
      .input(z.object({
        eventId: z.number().optional(),
        rating: z.number().min(1).max(4),
        bestPart: z.string().optional(),
        wouldReturn: z.string(),
      }))
      .mutation(async ({ input }) => {
        const feedback = await createEventFeedbackEntry(input);
        return { success: true, id: feedback?.id };
      }),

    forEvent: publicProcedure
      .input(z.object({ eventId: z.number() }))
      .query(async ({ input }) => {
        return await getEventFeedbackByEventId(input.eventId);
      }),

    all: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getAllEventFeedback();
    }),
  }),

  // Witta history community contributions
  witta: router({
    // Public: submit a memory/correction tied to a year/era
    submit: publicProcedure
      .input(z.object({
        authorName: z.string().min(1).max(255),
        authorEmail: z.string().email().optional().or(z.literal("")),
        yearOrEra: z.string().min(1).max(100),
        memory: z.string().min(10).max(4000),
        photoUrl: z.string().max(1000).optional().or(z.literal("")),
      }))
      .mutation(async ({ input }) => {
        const contribution = await createWittaContribution({
          authorName: input.authorName,
          authorEmail: input.authorEmail || null,
          yearOrEra: input.yearOrEra,
          memory: input.memory,
          photoUrl: input.photoUrl || null,
          status: "pending",
        });
        return { success: true, id: contribution?.id };
      }),

    // Public: list approved community memories
    approved: publicProcedure.query(async () => {
      return await getApprovedWittaContributions();
    }),

    // Admin: list pending memories awaiting moderation
    pending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getPendingWittaContributions();
    }),

    // Admin: approve or reject a memory
    moderate: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["approved", "rejected"]),
        adminNotes: z.string().max(1000).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const updated = await updateWittaContributionStatus(
          input.id,
          input.status,
          ctx.user.id,
          input.adminNotes,
        );
        return { success: true, id: updated?.id };
      }),
  }),

  mediaLibrary: router({
    localVideos: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return listHarvestLocalMotionFilesWithElStatus();
    }),

    applyTags: protectedProcedure
      .input(z.object({
        recipe: harvestMediaRecipeInput,
        mediaIds: z.array(z.string().min(1).max(80)).min(1).max(100),
        mode: z.enum(["merge", "replace"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return tagHarvestMediaInEmpathyLedger({
          mediaIds: input.mediaIds,
          recipe: input.recipe,
          mode: input.mode,
        });
      }),

    addToWork: protectedProcedure
      .input(z.object({
        work: z.string().min(1).max(100),
        mediaIds: z.array(z.string().min(1).max(80)).min(1).max(100),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return addHarvestWorkTagToMedia({
          work: input.work,
          mediaIds: input.mediaIds,
        });
      }),

    removeFromWork: protectedProcedure
      .input(z.object({
        work: z.string().min(1).max(100),
        mediaId: z.string().min(1).max(80),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return removeHarvestWorkTagFromMedia({
          work: input.work,
          mediaId: input.mediaId,
        });
      }),

    uploadToEL: protectedProcedure
      .input(z.object({
        recipe: harvestMediaRecipeInput,
        files: z.array(z.object({
          fileName: z.string().min(1).max(255),
          contentType: z.string().min(1).max(120),
          base64Data: z.string().min(1),
        })).min(1).max(12),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return uploadHarvestMediaToEmpathyLedger({
          files: input.files,
          recipe: input.recipe,
          uploadedBy: ctx.user.id,
        });
      }),

    importLocalVideos: protectedProcedure
      .input(z.object({
        recipe: harvestMediaRecipeInput,
        paths: z.array(z.string().min(1).max(500)).min(1).max(30),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return importHarvestLocalMotionFilesToEmpathyLedger({
          paths: input.paths,
          recipe: input.recipe,
          uploadedBy: ctx.user.id,
        });
      }),

    // Project-level rollup matching EL admin's Harvest project view.
    harvestProjectStats: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return getHarvestProjectStats();
      }),

    // Storytellers on the Harvest project_storytellers join (Chris, Barry,
    // Sophie, plus anyone added via EL admin) with their stories, articles,
    // transcripts, and media counts rolled up.
    harvestStorytellers: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return listHarvestStorytellersWithContent();
      }),

    // Articles whose title/slug suggests Harvest content but that aren't
    // formally project-tagged. Click "Tag as Harvest" to rescue them.
    orphanedHarvestArticles: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return listOrphanedHarvestArticles();
      }),

    tagArticleAsHarvest: protectedProcedure
      .input(z.object({ articleId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return tagArticleAsHarvest(input.articleId);
      }),

    claimArticleForStoryteller: protectedProcedure
      .input(z.object({
        articleId: z.string().uuid(),
        storytellerId: z.string().uuid(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return claimArticleForStoryteller(input);
      }),

    // Phase 2: write into EL from the Harvest admin

    searchStorytellers: protectedProcedure
      .input(z.object({ query: z.string().min(0).max(120) }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return searchStorytellers(input.query);
      }),

    addStorytellerToHarvest: protectedProcedure
      .input(z.object({
        storytellerId: z.string().uuid(),
        role: z.enum(["participant", "contributor", "owner", "subject"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return addStorytellerToHarvest(input);
      }),

    updateStorytellerBio: protectedProcedure
      .input(z.object({
        storytellerId: z.string().uuid(),
        bio: z.string().min(0).max(5000),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return updateStorytellerBio(input);
      }),

    createHarvestStory: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1).max(50000),
        summary: z.string().max(1000).optional(),
        themes: z.array(z.string().max(80)).max(10).optional(),
        authorStorytellerId: z.string().uuid(),
        isPublic: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return createHarvestStory(input);
      }),

    getHarvestStory: protectedProcedure
      .input(z.object({ storyId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return getHarvestStory(input.storyId);
      }),

    updateHarvestStory: protectedProcedure
      .input(z.object({
        storyId: z.string().uuid(),
        title: z.string().min(1).max(255).optional(),
        content: z.string().min(1).max(50000).optional(),
        summary: z.string().max(1000).optional(),
        themes: z.array(z.string().max(80)).max(10).optional(),
        isPublic: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return updateHarvestStory(input);
      }),

    deleteHarvestStory: protectedProcedure
      .input(z.object({ storyId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return deleteHarvestStory(input.storyId);
      }),

    // Photo attribution: list recent Harvest media + which storytellers each
    // is currently tagged with. Powers the per-storyteller photo picker.
    harvestMediaForAttribution: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(500).optional(),
        work: z.string().min(1).max(100).nullable().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return listHarvestMediaForAttribution({
          limit: input?.limit ?? 200,
          work: input?.work ?? null,
        });
      }),

    tagMediaWithStorytellers: protectedProcedure
      .input(z.object({
        mediaIds: z.array(z.string().uuid()).min(1).max(200),
        storytellerIds: z.array(z.string().uuid()).max(20),
        mode: z.enum(["merge", "replace"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return tagMediaWithStorytellers(input);
      }),

    // Article CRUD — author + publish polished articles directly into Harvest
    createHarvestArticle: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1).max(100000),
        slug: z.string().max(120).optional(),
        excerpt: z.string().max(500).optional(),
        subtitle: z.string().max(255).optional(),
        themes: z.array(z.string().max(80)).max(10).optional(),
        authorStorytellerId: z.string().uuid(),
        articleType: z.enum([
          "story_feature", "editorial", "community_news", "project_update",
          "program_spotlight", "impact_report", "community_event",
        ]).optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return createHarvestArticle(input);
      }),

    getHarvestArticle: protectedProcedure
      .input(z.object({ articleId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return getHarvestArticle(input.articleId);
      }),

    updateHarvestArticle: protectedProcedure
      .input(z.object({
        articleId: z.string().uuid(),
        title: z.string().min(1).max(255).optional(),
        content: z.string().min(1).max(100000).optional(),
        slug: z.string().max(120).optional(),
        excerpt: z.string().max(500).optional(),
        subtitle: z.string().max(255).optional(),
        themes: z.array(z.string().max(80)).max(10).optional(),
        articleType: z.enum([
          "story_feature", "editorial", "community_news", "project_update",
          "program_spotlight", "impact_report", "community_event",
        ]).optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return updateHarvestArticle(input);
      }),

    deleteHarvestArticle: protectedProcedure
      .input(z.object({ articleId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new Error("Unauthorized");
        return deleteHarvestArticle(input.articleId);
      }),
  }),

  // Image overrides — admins can pick an EL photo for any (page, slot)
  imageOverrides: router({
    // Public: read the current override for a (page, slot)
    get: publicProcedure
      .input(z.object({
        page: z.string().min(1).max(100),
        slot: z.string().min(1).max(200),
      }))
      .query(async ({ input }) => {
        const row = await getImageOverride(input.page, input.slot);
        return row ?? null;
      }),

    // Admin: set / replace the override
    set: protectedProcedure
      .input(z.object({
        page: z.string().min(1).max(100),
        slot: z.string().min(1).max(200),
        mediaAssetId: z.string().min(1).max(64),
        src: z.string().min(1).max(1000),
        altText: z.string().max(500).optional(),
        title: z.string().max(255).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const row = await setImageOverride({
          page: input.page,
          slot: input.slot,
          mediaAssetId: input.mediaAssetId,
          src: input.src,
          altText: input.altText ?? null,
          title: input.title ?? null,
          setBy: ctx.user.id,
        });
        return { success: true, id: row?.id };
      }),

    // Admin: clear an override (reverts to bundled / EL-tag fallback)
    clear: protectedProcedure
      .input(z.object({
        page: z.string().min(1).max(100),
        slot: z.string().min(1).max(200),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const ok = await clearImageOverride(input.page, input.slot);
        return { success: ok };
      }),

    // Admin: list all overrides (for an audit panel)
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await listImageOverrides();
    }),
  }),

  // Editable content for inline CMS
  content: router({
    // Public: Get content for a specific slot
    get: publicProcedure
      .input(z.object({
        page: z.string().min(1).max(100),
        slot: z.string().min(1).max(200),
      }))
      .query(async ({ input }) => {
        const content = await getContent(input.page, input.slot);
        return content ?? null;
      }),

    // Public: Get all content for a page
    forPage: publicProcedure
      .input(z.object({
        page: z.string().min(1).max(100),
      }))
      .query(async ({ input }) => {
        return await getContentForPage(input.page);
      }),

    // Admin: Update content for a slot
    update: protectedProcedure
      .input(z.object({
        page: z.string().min(1).max(100),
        slot: z.string().min(1).max(200),
        content: z.string(),
        contentType: z.enum(["text", "markdown", "html"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const result = await upsertContent(
          input.page,
          input.slot,
          input.content,
          input.contentType || "text",
          ctx.user.id
        );
        return { success: true, content: result };
      }),
  }),

  // Editorial calendar (ACT Communications Dashboard in Notion)
  editorial: router({
    // List posts from Notion, optionally filtered by project/status/type
    list: publicProcedure
      .input(z.object({
        projectId: z.string().optional(),
        status: z.string().optional(),
        communicationType: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await queryEditorialCalendar({
          projectId: input?.projectId,
          status: input?.status,
          communicationType: input?.communicationType,
        });
      }),

    // Create a new post in Notion
    create: publicProcedure
      .input(z.object({
        title: z.string(),
        communicationType: z.string().optional(),
        status: z.string().optional(),
        scheduledDate: z.string().optional(),
        platforms: z.array(z.string()).optional(),
        caption: z.string().optional(),
        editorialNote: z.string().optional(),
        mediaUrl: z.string().optional(),
        format: z.string().optional(),
        link: z.string().optional(),
        projectId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await createEditorialPost(input);
        return { success: true, id };
      }),

    // Get a single post by Notion page ID
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await getEditorialPost(input.id);
      }),

    // Update a post in Notion (status, caption, date, GHL Post ID)
    update: publicProcedure
      .input(z.object({
        id: z.string(),
        status: z.string().optional(),
        caption: z.string().optional(),
        scheduledDate: z.string().optional(),
        ghlPostId: z.string().optional(),
        mediaUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await updateEditorialPost(id, updates);
        return { success: true };
      }),

    // List projects from the ACT Projects database
    projects: publicProcedure.query(async () => {
      return await getEditorialProjects();
    }),

    // List communication type options
    communicationTypes: publicProcedure.query(async () => {
      return await getEditorialCommunicationTypes();
    }),

    // Auto-sync: push Ready → GHL, pull Published ← GHL
    autoSync: publicProcedure.mutation(async () => {
      const readyResult = await syncReadyPosts();
      const publishedResult = await syncPublishedPosts();
      return { success: true, ...readyResult, published: publishedResult.updated };
    }),

    // Sync published status from GHL back to Notion (legacy, kept for backward compat)
    syncPublished: publicProcedure.mutation(async () => {
      const result = await syncPublishedPosts();
      return { success: true, updated: result.updated };
    }),
  }),

  // Social media posting via GHL Social Planner
  social: router({
    // Get connected social accounts
    accounts: publicProcedure
      .query(async () => {
        const result = await getGHLSocialAccounts();
        return result;
      }),

    // Create/schedule a social post
    post: publicProcedure
      .input(z.object({
        summary: z.string().min(1).max(5000),
        accountIds: z.array(z.string()).min(1),
        mediaUrls: z.array(z.string()).optional(), // public URLs to images/videos
        scheduledAt: z.string().optional(), // ISO datetime
      }))
      .mutation(async ({ input }) => {
        const result = await createGHLSocialPost(input);
        return result;
      }),

    // List posts from GHL
    list: publicProcedure
      .input(z.object({
        status: z.enum(["draft", "scheduled", "published"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        const result = await getGHLSocialPosts(input?.status);
        return result;
      }),
  }),

  // Email templates
  email: router({
    createTemplate: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        html: z.string().min(1),
        subject: z.string().optional(),
        preheader: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await createGHLEmailTemplate(input);
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
