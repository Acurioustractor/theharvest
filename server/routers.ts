import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createEvent, getApprovedEvents, getPendingEvents, updateEventStatus, createBusiness, getApprovedBusinesses, getPendingBusinesses, updateBusinessStatus, getBusinessByUserId, getBusinessById, claimBusiness, updateBusinessProfile, getUnclaimedApprovedBusinesses, getProgressImages, createProgressImage, updateProgressImage, deleteProgressImage, promoteUserToAdmin, getAllUsers, getContent, getContentForPage, upsertContent, getAnnotationsForPoint, createAnnotation, deleteAnnotation, createPulseResponse, getPulseResults, createEventFeedbackEntry, getEventFeedbackByEventId, getAllEventFeedback } from "./db";
import { storagePut } from "./storage";
import { getDb } from "./db";
import { pulseResponses } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { upsertGHLContact, addGHLContactNote, getGHLContactCountByTag, getGHLSocialAccounts, createGHLSocialPost, getGHLSocialPosts, searchGHLContactsByTag, batchTriggerWorkflow } from "./gohighlevel";
import { empathyLedgerClient } from "./empathyLedgerClient";
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
} from "./wiki";
import { z } from "zod";

const INTEREST_OPTIONS = ["kids-play", "cafe", "garden", "pop-up-events", "art-exhibitions", "something-else"] as const;

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

    // Public: Submit a new event (goes to pending)
    submit: publicProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        date: z.string(),
        time: z.string().min(1).max(100),
        location: z.string().min(1).max(255),
        category: z.enum(["market", "community", "arts", "workshop", "music"]),
        description: z.string().min(1),
        contactEmail: z.string().email(),
        submittedBy: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const event = await createEvent({
          ...input,
          date: new Date(input.date),
          status: "pending",
        });
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

    // Public: Submit a new business (goes to pending)
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
        submittedBy: z.string().optional(),
        submitterEmail: z.string().email(),
      }))
      .mutation(async ({ input }) => {
        const business = await createBusiness({
          ...input,
          status: "pending",
        });
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
        email: z.string().email(),
        excitement: z.string().optional(),
        source: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const [firstName, ...rest] = input.name.split(" ");
        const lastName = rest.join(" ") || undefined;

        const result = await upsertGHLContact({
          email: input.email,
          firstName,
          lastName,
          source: "EOI Form - First Gathering",
          tags: ["eoi-gathering-march-2026", "website-eoi"],
        });

        if (result.contactId && input.excitement) {
          await addGHLContactNote(result.contactId,
            `**EOI — First Gathering**\n\n**What excites them:** ${input.excitement}\n**Source:** ${input.source || "Not specified"}`
          );
        }

        return { success: true };
      }),

    count: publicProcedure.query(async () => {
      const count = await getGHLContactCountByTag("eoi-gathering-march-2026");
      return { count };
    }),

    submitLocalsDay: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
      }))
      .mutation(async ({ input }) => {
        const [firstName, ...rest] = input.name.split(" ");
        const lastName = rest.join(" ") || undefined;

        await upsertGHLContact({
          email: input.email,
          firstName,
          lastName,
          source: "EOI Form - Locals Day",
          tags: ["locals-day-march-2026", "eoi-gathering-march-2026", "website-eoi"],
        });

        return { success: true };
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
        firstName: z.string().max(100).optional(),
        lastName: z.string().max(100).optional(),
        source: z.string().max(100).optional(),
        interests: z.array(z.enum([
          "events",
          "workshops",
          "markets",
          "venue-hire",
          "garden-centre",
          "food-kitchen"
        ])).optional(),
      }))
      .mutation(async ({ input }) => {
        // Build tags array from interests
        const baseTags = ["newsletter", "website-signup"];
        const interestTags = input.interests?.map(interest => `interest-${interest}`) || [];
        const allTags = [...baseTags, ...interestTags];

        const result = await upsertGHLContact({
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          source: input.source || "The Harvest Website Newsletter",
          tags: allTags,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to subscribe");
        }

        return {
          success: true,
          message: "Successfully subscribed to the newsletter!",
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

  blog: router({
    // Public: Get articles from Empathy Ledger with optional filters
    list: publicProcedure
      .input(z.object({
        theme: z.string().optional(),
        type: z.string().optional(),
        page: z.number().optional(),
        limit: z.number().min(1).max(50).optional(),
      }).optional())
      .query(async ({ input }) => {
        const response = await empathyLedgerClient.fetchArticles({
          theme: input?.theme,
          type: input?.type,
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
    // Uses dedicated Harvest gallery API with Harvest-specific tags
    fromEL: publicProcedure
      .input(z.object({
        category: z.enum(["all", "before", "during", "after", "milestone", "general"]).optional(),
        tag: z.string().optional(), // Page tag: "home", "journey", "stories", etc.
        theme: z.string().optional(), // Theme: "eat", "grow", "make", "gather"
        limit: z.number().min(1).max(100).optional(),
        page: z.number().min(1).optional(),
      }).optional())
      .query(async ({ input }) => {
        const response = await empathyLedgerClient.fetchHarvestGallery({
          category: input?.category === "all" ? undefined : input?.category,
          tag: input?.tag,
          theme: input?.theme,
          limit: input?.limit || 50,
          page: input?.page,
        });
        return response;
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
        const response = await createPulseResponse({
          ...input,
          email: cleanEmail,
        });

        // If email provided, upsert GHL contact with pulse tags
        if (cleanEmail) {
          const interestTags = (input.wouldUse || []).map(u => `interest-${u}`);
          await upsertGHLContact({
            email: cleanEmail,
            firstName: input.name?.split(" ")[0],
            lastName: input.name?.split(" ").slice(1).join(" ") || undefined,
            source: "Community Pulse Survey",
            tags: ["pulse-respondent", ...interestTags],
          });
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

  // Editable content for inline CMS
  content: router({
    // Public: Get content for a specific slot
    get: publicProcedure
      .input(z.object({
        page: z.string().min(1).max(100),
        slot: z.string().min(1).max(100),
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
        slot: z.string().min(1).max(100),
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
});

export type AppRouter = typeof appRouter;
