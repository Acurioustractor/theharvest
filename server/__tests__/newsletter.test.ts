import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createGHLContact, upsertGHLContact } from "../gohighlevel";
import { appRouter, buildNewsletterTags } from "../routers";
import type { TrpcContext } from "../_core/context";

// Pizza RSVP validation rejects past dates, so these tests must use a date
// ahead of today rather than a fixed one. Weekday is computed in UTC, the same
// way routers.ts reads an ISO date.
function isoDateOfNextWeekday(weekday: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + ((weekday - date.getUTCDay() + 7) % 7 || 7) + 7);
  return date.toISOString().slice(0, 10);
}

vi.mock("../db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../db")>();
  return {
    ...actual,
    createPulseResponse: vi.fn().mockResolvedValue({ id: 123 }),
    createCommunitySubmission: vi.fn().mockResolvedValue({ id: 123 }),
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
      GHL_NEWSLETTER_CONSENT_FIELD_ID: "fixture-newsletter-consent",
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
    it.each([undefined, false, "false", "true", 1, {}, []].map(value => ({ value })))(
      "does not overwrite newsletter preferences for ordinary upserts with $value consent",
      async ({ value }) => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: async () => ({ contact: { id: "contact-123" } }),
        });

        const result = await upsertGHLContact({
          email: "fixture@example.invalid",
          tags: ["contact-form"],
          // Exercise malformed runtime values as well as the typed false/omitted cases.
          newsletterConsent: value as boolean | undefined,
        });

        expect(result.success).toBe(true);
        expect(JSON.parse(mockFetch.mock.calls[0][1].body)).not.toHaveProperty("customFields");
      },
    );

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

    it.each([
      { member: false, fieldId: "fixture-newsletter-consent", configured: true, workflow: "newsletter-workflow" },
      { member: true, fieldId: "aVnqmajnysMtGYhLD0oA", configured: false, workflow: "member-welcome-workflow" },
    ])("persists signup consent before tags and the $workflow", async ({ member, fieldId, configured, workflow }) => {
      if (!configured) delete process.env.GHL_NEWSLETTER_CONSENT_FIELD_ID;
      let finishUpsert!: (response: unknown) => void;
      mockFetch.mockImplementationOnce(() => new Promise(resolve => { finishUpsert = resolve; }));
      const caller = appRouter.createCaller(ctx);
      const subscription = caller.newsletter.subscribe({
        email: "fixture@example.invalid",
        firstName: "Fixture",
        member,
      });

      await vi.waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
      const upsertBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      finishUpsert({
        ok: true,
        json: async () => ({ contact: { id: "contact-123" } }),
      });
      await expect(subscription).resolves.toMatchObject({ success: true });

      expect(upsertBody.customFields).toEqual([{ id: fieldId, fieldValue: "Yes" }]);
      const urls = mockFetch.mock.calls.map(([url]) => String(url));
      expect(urls[0]).toBe("https://services.leadconnectorhq.com/contacts/upsert");
      const tagIndex = urls.findIndex(url => url.endsWith("/contacts/contact-123/tags"));
      const workflowIndex = urls.findIndex(url => url.endsWith(`/contacts/contact-123/workflow/${workflow}`));
      expect(tagIndex).toBeGreaterThan(0);
      expect(workflowIndex).toBeGreaterThan(tagIndex);
      expect(JSON.parse(mockFetch.mock.calls[tagIndex][1].body).tags).toContain("comms:harvest-newsletter");
    });

    it.each(["http", "network"])("blocks tags and workflow enrollment when consent persistence fails through %s", async (failure) => {
      if (failure === "network") {
        mockFetch.mockRejectedValueOnce(new Error("Fixture network failure"));
      } else {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 422,
          json: async () => ({ message: "Fixture consent field rejected" }),
        });
      }
      const caller = appRouter.createCaller(ctx);

      await expect(caller.newsletter.subscribe({
        email: "fixture@example.invalid",
        firstName: "Fixture",
      })).rejects.toThrow();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(JSON.parse(mockFetch.mock.calls[0][1].body).customFields).toEqual([
        { id: "fixture-newsletter-consent", fieldValue: "Yes" },
      ]);
    });

    it("builds Harvest member tags without losing newsletter compatibility", () => {
      const tags = buildNewsletterTags({
        member: true,
        interests: ["membership", "community", "volunteering"],
      });

      // canonical-only (Phase 3 flip): flat newsletter/harvest-newsletter/harvest-member/interest-* dropped
      expect(tags).toEqual(expect.arrayContaining([
        "harvest-website",
        "comms:harvest-newsletter",
        "tier:member",
        "interest:membership",
        "interest:community",
        "interest:volunteer",
      ]));
      expect(tags).not.toContain("harvest-member");
      expect(tags).not.toContain("newsletter");
      expect(tags).not.toContain("interest-membership");
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
          "comms:harvest-newsletter",
          "project:act-hv",
          "tier:member",
          "interest:membership",
          "interest:community",
          "interest:sustainability",
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

      // A signup comment is read, not replied to: note only, no inbox card.
      const opportunityCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/opportunities/upsert")
      );
      expect(opportunityCall).toBeUndefined();
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
      });

      const upsertCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/upsert")
      );
      expect(upsertCall).toBeDefined();
      const upsertBody = JSON.parse(upsertCall![1].body);
      expect(upsertBody.firstName).toBe("Mira");
      expect(upsertBody.lastName).toBe("Stone");
      const tagCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/contacts/contact-123/tags")
      );
      expect(JSON.parse(tagCall![1].body).tags).toEqual(expect.arrayContaining([
        "quiz-maker",
        "workshop-interested",
        "hands-on-learner",
      ]));
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
        "project:act-hv",
        "tier:curious",
        "member-question",
        "harvest-inbox",
      ]));
      expect(JSON.parse(tagCall![1].body).tags).not.toEqual(expect.arrayContaining([
        "tier:member",
        "comms:harvest-newsletter",
        "interest:membership",
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

    it("tags a pizza RSVP with its occurrence date and no historical launch tag", async () => {
      const caller = appRouter.createCaller(ctx);
      const nextSaturday = isoDateOfNextWeekday(6);

      await caller.eoi.submit({
        name: "Phone Guest",
        phone: "0400000000",
        occurrenceDate: nextSaturday,
        session: "saturday",
        source: "What's On page",
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
        "event:witta-pizza",
        `event:witta-pizza:${nextSaturday}`,
        "rsvp:pizza",
        "harvest-event-attendee",
        "harvest-website",
        "harvest-inbox",
      ]));
      expect(JSON.parse(tagCall![1].body).tags).not.toContain("witta-gathering-2026-06-20");

      // An RSVP needs a confirmation, not a human reply: no inbox card.
      const opportunityCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/opportunities/upsert")
      );
      expect(opportunityCall).toBeUndefined();
    });

    it("rejects pizza RSVPs for invalid weekdays or mismatched sessions", async () => {
      const caller = appRouter.createCaller(ctx);

      await expect(caller.eoi.submit({
        name: "Wrong Weekday",
        phone: "0400000000",
        occurrenceDate: isoDateOfNextWeekday(1),
        session: "unsure",
      })).rejects.toThrow("Choose a Friday, Saturday or Sunday pizza date.");

      await expect(caller.eoi.submit({
        name: "Wrong Session",
        phone: "0400000000",
        occurrenceDate: isoDateOfNextWeekday(6),
        session: "friday",
      })).rejects.toThrow("The session does not match the date you selected.");
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
      const caller = appRouter.createCaller({
        ...ctx,
        user: { role: "admin" },
      } as TrpcContext);

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

      // A photo-wall answer is read, not replied to: no inbox card.
      const opportunityCall = mockFetch.mock.calls.find(([url]) =>
        String(url).endsWith("/opportunities/upsert")
      );
      expect(opportunityCall).toBeUndefined();
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
        "interest:community-garden",
        "interest:live-music-events",
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
    // canonical-only (Phase 3 flip): flat aliases no longer minted
    expect(tags).not.toContain("interest-membership");
    expect(tags).not.toContain("interest-community");
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
    ]));
    expect(tags).not.toContain("interest-events");
    expect(tags).not.toContain("tier:member");
    expect(tags).not.toContain("harvest-member");
  });
});
