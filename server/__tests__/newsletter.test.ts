import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createGHLContact, upsertGHLContact } from "../gohighlevel";

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
});
