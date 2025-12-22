import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createEvent, getApprovedEvents, getPendingEvents, updateEventStatus, createBusiness, getApprovedBusinesses, getPendingBusinesses, updateBusinessStatus, getBusinessByUserId, getBusinessById, claimBusiness, updateBusinessProfile, getUnclaimedApprovedBusinesses } from "./db";
import { upsertGHLContact } from "./gohighlevel";
import { z } from "zod";

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
  }),
});

export type AppRouter = typeof appRouter;
