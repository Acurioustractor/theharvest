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
        source: "The Harvest Website Newsletter",
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
        source: "Harvest member list",
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
        source: "Membership page question form",
      });

      const tagCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/contact-123/tags")
      );
      expect(JSON.parse(tagCall![1].body).tags).toEqual(expect.arrayContaining([
        "harvest-member",
        "harvest-newsletter",
        "interest-membership",
        "member-question",
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
      ]));
    });
  });
});
