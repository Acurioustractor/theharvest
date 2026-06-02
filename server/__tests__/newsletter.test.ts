import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createGHLContact, upsertGHLContact } from "../gohighlevel";
import { appRouter, buildNewsletterTags } from "../routers";
import type { TrpcContext } from "../_core/context";

vi.mock("../db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../db")>();
  return {
    ...actual,
    createPulseResponse: vi.fn().mockResolvedValue({ id: 123 }),
  };
});

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Go High Level Newsletter Integration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    // Set up test environment variables
    process.env = {
      ...originalEnv,
      GHL_API_KEY: "test-api-key",
      GHL_LOCATION_ID: "test-location-id",
      GHL_NEWSLETTER_WORKFLOW_ID: "newsletter-workflow",
      GHL_MEMBER_WELCOME_WORKFLOW_ID: "member-welcome-workflow",
      GHL_MEMBER_QUESTION_WORKFLOW_ID: "member-question-workflow",
      GHL_GATHERING_RSVP_WORKFLOW_ID: "gathering-rsvp-workflow",
      GHL_CONTACT_FORM_WORKFLOW_ID: "contact-form-workflow",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("createGHLContact", () => {
    it("should return error when API credentials are not configured", async () => {
      process.env.GHL_API_KEY = "";
      process.env.GHL_LOCATION_ID = "";

      const result = await createGHLContact({ email: "test@example.com" });

      expect(result.success).toBe(false);
      expect(result.error).toContain("not configured");
    });

    it("should call GHL API with correct parameters", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          contact: {
            id: "contact-123",
            email: "test@example.com",
            locationId: "test-location-id",
          },
        }),
      });

      const result = await createGHLContact({
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        source: "Test Source",
        tags: ["newsletter"],
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://services.leadconnectorhq.com/contacts/",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "Authorization": "Bearer test-api-key",
            "Version": "2021-07-28",
          }),
        })
      );

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.email).toBe("test@example.com");
      expect(callBody.firstName).toBe("John");
      expect(callBody.lastName).toBe("Doe");
      expect(callBody.locationId).toBe("test-location-id");
      expect(callBody.source).toBe("Test Source");

      expect(result.success).toBe(true);
      expect(result.contactId).toBe("contact-123");
    });

    it("should handle API authentication errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: "Unauthorized" }),
      });

      const result = await createGHLContact({ email: "test@example.com" });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Authentication failed");
    });

    it("should handle validation errors (duplicate contact)", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({ message: "Contact already exists" }),
      });

      const result = await createGHLContact({ email: "test@example.com" });

      expect(result.success).toBe(false);
      expect(result.error).toContain("already");
    });

    it("should handle network errors gracefully", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await createGHLContact({ email: "test@example.com" });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Unable to connect");
    });
  });

  describe("upsertGHLContact", () => {
    it("should return error when API credentials are not configured", async () => {
      process.env.GHL_API_KEY = "";
      process.env.GHL_LOCATION_ID = "";

      const result = await upsertGHLContact({ email: "test@example.com" });

      expect(result.success).toBe(false);
      expect(result.error).toContain("not configured");
    });

    it("should call upsert endpoint correctly", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          contact: {
            id: "contact-456",
            email: "test@example.com",
            locationId: "test-location-id",
          },
        }),
      });

      const result = await upsertGHLContact({
        email: "test@example.com",
        source: "Harvest | Newsletter",
        tags: ["newsletter", "website-signup"],
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://services.leadconnectorhq.com/contacts/upsert",
        expect.objectContaining({
          method: "POST",
        })
      );

      expect(result.success).toBe(true);
      expect(result.contactId).toBe("contact-456");
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal server error" }),
      });

      const result = await upsertGHLContact({ email: "test@example.com" });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("newsletter and member router flows", () => {
    const ctx = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      },
      res: {},
    } as TrpcContext;

    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          contact: {
            id: "contact-123",
            email: "test@example.com",
            locationId: "test-location-id",
          },
        }),
      });
    });

    it("builds Harvest member tags without losing newsletter compatibility", () => {
      const tags = buildNewsletterTags({
        member: true,
        interests: ["membership", "community", "volunteering"],
      });

      expect(tags).toEqual(expect.arrayContaining([
        "newsletter",
        "harvest-newsletter",
        "harvest-website",
        "harvest-member",
        "interest-membership",
        "interest-community",
        "interest-volunteer",
      ]));
    });

    it("tags member signup with the Harvest member audience and selected interests", async () => {
      const caller = appRouter.createCaller(ctx);

      await caller.newsletter.subscribe({
        email: "member@example.com",
        firstName: "Mira",
        source: "Harvest | Member Signup",
        interests: ["membership", "community", "sustainability"],
        member: true,
      });

      const tagCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/contact-123/tags")
      );
      expect(tagCall).toBeDefined();
      expect(JSON.parse(tagCall![1].body)).toEqual({
        tags: expect.arrayContaining([
          "newsletter",
          "harvest-newsletter",
          "harvest-member",
          "project:act-hv",
          "tier:member",
          "interest:membership",
          "interest-membership",
          "interest-community",
          "interest-sustainability",
        ]),
      });

      const workflowCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/contact-123/workflow/member-welcome-workflow")
      );
      expect(workflowCall).toBeDefined();
    });

    it("creates a Universal Inquiry card when a member signup includes a comment", async () => {
      const caller = appRouter.createCaller(ctx);

      await caller.newsletter.subscribe({
        email: "member-comment@example.com",
        firstName: "Mira",
        lastName: "Stone",
        source: "Harvest | Member Signup",
        interests: ["membership"],
        member: true,
        notes: "I can help with planting days.",
      });

      const tagCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/contact-123/tags")
      );
      expect(JSON.parse(tagCall![1].body).tags).toEqual(expect.arrayContaining([
        "member-comments",
        "harvest-inbox",
      ]));

      const noteCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/contact-123/notes")
      );
      expect(JSON.parse(noteCall![1].body).body).toContain("I can help with planting days.");

      const opportunityCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/opportunities/upsert")
      );
      expect(opportunityCall).toBeDefined();
      const opportunityBody = JSON.parse(opportunityCall![1].body);
      expect(opportunityBody).toMatchObject({
        contactId: "contact-123",
        name: "Mira Stone - Member comment",
        source: "Harvest | Member Signup",
        pipelineId: "ggQw10DuH0XRji6keimS",
        pipelineStageId: "2eded979-7439-407d-89b6-762499b56658",
        status: "open",
      });
    });

    it("does not sync pulse survey submissions to GHL without a name", async () => {
      const caller = appRouter.createCaller(ctx);

      await caller.pulse.submit({
        email: "pulse-only@example.com",
        wouldUse: ["Community garden"],
      });

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("requires a name for newsletter and member signups", async () => {
      const caller = appRouter.createCaller(ctx);

      await expect(caller.newsletter.subscribe({
        email: "no-name@example.com",
        interests: ["membership"],
        member: true,
      } as any)).rejects.toThrow();
    });

    it("sends visitor quiz names through to GHL", async () => {
      const caller = appRouter.createCaller(ctx);

      await caller.quiz.submit({
        name: "Mira Stone",
        email: "quiz@example.com",
        persona: "maker",
        ghlTags: ["quiz-maker"],
      });

      const upsertCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/upsert")
      );
      expect(upsertCall).toBeDefined();
      const upsertBody = JSON.parse(upsertCall![1].body);
      expect(upsertBody.firstName).toBe("Mira");
      expect(upsertBody.lastName).toBe("Stone");
    });

    it("stores a member question as a note and triggers the member question workflow", async () => {
      const caller = appRouter.createCaller(ctx);

      await caller.members.question({
        name: "Mira Stone",
        email: "mira@example.com",
        phone: "0400000000",
        question: "Can kids help design the play area?",
        source: "Harvest | Member Question",
      });

      const tagCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/contact-123/tags")
      );
      expect(JSON.parse(tagCall![1].body).tags).toEqual(expect.arrayContaining([
        "harvest-member",
        "harvest-newsletter",
        "interest-membership",
        "member-question",
        "harvest-inbox",
      ]));

      const noteCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/contact-123/notes")
      );
      expect(noteCall).toBeDefined();
      expect(JSON.parse(noteCall![1].body).body).toContain("Can kids help design the play area?");

      const workflowCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/contact-123/workflow/member-question-workflow")
      );
      expect(workflowCall).toBeDefined();

      const opportunityCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/opportunities/upsert")
      );
      expect(opportunityCall).toBeDefined();
      expect(JSON.parse(opportunityCall![1].body)).toMatchObject({
        contactId: "contact-123",
        name: "Mira Stone - Member question",
        source: "Harvest | Member Question",
      });
    });

    it("creates a Universal Inquiry card for shop interest submissions", async () => {
      const caller = appRouter.createCaller(ctx);

      await caller.shopInterest.submit({
        name: "Mira Stone",
        email: "shop@example.com",
        phone: "0400000000",
        offerType: "produce",
        description: "We can bring seasonal herbs and vegetables for the shop trial.",
        location: "Witta",
        readiness: "From launch week",
      });

      const opportunityCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/opportunities/upsert")
      );
      expect(opportunityCall).toBeDefined();
      expect(JSON.parse(opportunityCall![1].body)).toMatchObject({
        contactId: "contact-123",
        name: "Mira Stone - Shop interest",
        source: "Harvest | Shop",
      });
    });

    it("tags June 20 phone-only RSVP with the gathering and event attendee tags", async () => {
      const caller = appRouter.createCaller(ctx);

      await caller.eoi.submit({
        name: "Phone Guest",
        phone: "0400000000",
        source: "Garden Launch page",
      });

      const upsertCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/upsert")
      );
      expect(upsertCall).toBeDefined();
      const upsertBody = JSON.parse(upsertCall![1].body);
      expect(upsertBody.email).toBeUndefined();
      expect(upsertBody.phone).toBe("0400000000");

      const tagCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/contact-123/tags")
      );
      expect(JSON.parse(tagCall![1].body).tags).toEqual(expect.arrayContaining([
        "witta-gathering-2026-06-20",
        "harvest-event-attendee",
        "harvest-website",
        "harvest-inbox",
      ]));

      const opportunityCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/opportunities/upsert")
      );
      expect(opportunityCall).toBeDefined();
      expect(JSON.parse(opportunityCall![1].body)).toMatchObject({
        contactId: "contact-123",
        name: "Phone Guest - RSVP 2026-06-20",
        source: "Harvest | RSVP 2026-06-20",
      });
    });

    it("creates a Universal Inquiry card for workshop bookings", async () => {
      const caller = appRouter.createCaller(ctx);

      await caller.workshops.book({
        name: "Mira Stone",
        email: "workshop@example.com",
        phone: "0400000000",
        workshopTitle: "Fermentation afternoon",
        workshopDate: "2026-06-21",
        attendees: 2,
      });

      const tagCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/contact-123/tags")
      );
      expect(JSON.parse(tagCall![1].body).tags).toEqual(expect.arrayContaining([
        "workshop-booking",
        "harvest-inbox",
      ]));

      const opportunityCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/opportunities/upsert")
      );
      expect(opportunityCall).toBeDefined();
      expect(JSON.parse(opportunityCall![1].body)).toMatchObject({
        contactId: "contact-123",
        name: "Mira Stone - Workshop booking",
        source: "Harvest | Workshop",
      });
    });

    it("creates a Universal Inquiry card for photo wall responses", async () => {
      const caller = appRouter.createCaller(ctx);

      await caller.photoWall.submit({
        firstName: "Mira",
        email: "photo@example.com",
        response: "More kids building days.",
      });

      const tagCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/contact-123/tags")
      );
      expect(JSON.parse(tagCall![1].body).tags).toEqual(expect.arrayContaining([
        "photo-wall",
        "harvest-inbox",
      ]));

      const opportunityCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/opportunities/upsert")
      );
      expect(opportunityCall).toBeDefined();
      expect(JSON.parse(opportunityCall![1].body)).toMatchObject({
        contactId: "contact-123",
        name: "Mira - Photo wall response",
        source: "Harvest | Photo Wall",
      });
    });

    it("slugifies pulse interest tags before syncing to GHL", async () => {
      const caller = appRouter.createCaller(ctx);

      await caller.pulse.submit({
        name: "Pulse Person",
        email: "pulse@example.com",
        wouldUse: ["Community garden", "Live music & events"],
      });

      const tagCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/contact-123/tags")
      );
      expect(tagCall).toBeDefined();
      expect(JSON.parse(tagCall![1].body).tags).toEqual(expect.arrayContaining([
        "pulse-respondent",
        "harvest-website",
        "interest-community-garden",
        "interest-live-music-events",
      ]));
    });
  });
});

describe("Phase B — namespaced taxonomy + Journey bridge", () => {
  it("tags a member with tier:member + comms + namespaced interest (no role:member; that's a tier)", () => {
    const tags = buildNewsletterTags({ member: true, interests: ["membership", "community"] });
    expect(tags).toEqual(expect.arrayContaining([
      "tier:member",
      "comms:harvest-newsletter",
      "interest:membership",
      "interest:community",
    ]));
    // legacy flat aliases still dual-written during the migration (remove in Phase C)
    expect(tags).toEqual(expect.arrayContaining(["interest-membership", "interest-community"]));
    // membership is a tier: rung, never a role: — role:member is not in the canonical vocabulary
    expect(tags).not.toContain("role:member");
    expect(tags).not.toContain("tier:connected");
    // project:act-hv is stamped at the GHL-client chokepoint, not in buildNewsletterTags
    expect(tags).not.toContain("project:act-hv");
  });

  it("tags a non-member follower as tier:connected, never as a member", () => {
    const tags = buildNewsletterTags({ member: false, interests: ["events"] });
    expect(tags).toEqual(expect.arrayContaining([
      "tier:connected",
      "comms:harvest-newsletter",
      "interest:events",
      "interest-events",
    ]));
    expect(tags).not.toContain("tier:member");
    expect(tags).not.toContain("harvest-member");
  });
});
