import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const notion = vi.hoisted(() => ({
  query: vi.fn(),
  retrieve: vi.fn(),
}));

vi.mock("@notionhq/client", () => ({
  Client: class {
    dataSources = notion;
  },
}));

vi.mock("../gohighlevel.js", () => ({
  getGHLAccountMap: vi.fn(),
  createGHLSocialPost: vi.fn(),
  getGHLSocialAccounts: vi.fn(),
  getGHLSocialPosts: vi.fn(),
}));

const paths = [
  {
    name: "calendar queries",
    method: "query" as const,
    read: async () => (await import("../notion")).queryEditorialCalendar(),
    expected: [{ id: "post-1", title: "Harvest update" }],
  },
  {
    name: "editorial schema retrieval",
    method: "retrieve" as const,
    read: async () => (await import("../notion")).getEditorialCommunicationTypes(),
    expected: ["Newsletter"],
  },
];

describe.each(paths)("Notion configuration for $name", ({ method, read, expected }) => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    vi.stubEnv("NOTION_API_KEY", "test-notion-key");
    vi.stubEnv("NOTION_TOKEN", undefined);
    vi.stubEnv("NOTION_EDITORIAL_DS_ID", undefined);
    vi.stubEnv("NOTION_EDITORIAL_DB_ID", undefined);
    vi.stubGlobal("fetch", vi.fn(() => {
      throw new Error("Notion configuration tests must not access the network");
    }));
    notion.query.mockResolvedValue({
      results: [{
        id: "post-1",
        properties: {
          "Content/Communication Name": {
            type: "title",
            title: [{ plain_text: "Harvest update" }],
          },
        },
      }],
      has_more: false,
      next_cursor: null,
    });
    notion.retrieve.mockResolvedValue({
      properties: {
        "Communication Type": { select: { options: [{ name: "Newsletter" }] } },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("reads with only an explicit data source ID configured", async () => {
    vi.stubEnv("NOTION_EDITORIAL_DS_ID", "editorial-data-source");

    await expect(read()).resolves.toMatchObject(expected);

    expect(notion[method]).toHaveBeenCalledTimes(1);
    expect(notion[method]).toHaveBeenCalledWith(
      expect.objectContaining({ data_source_id: "editorial-data-source" }),
    );
  });

  it("retains database-only configuration support", async () => {
    vi.stubEnv("NOTION_EDITORIAL_DB_ID", "editorial-database");

    await expect(read()).resolves.toMatchObject(expected);

    expect(notion[method]).toHaveBeenCalledTimes(1);
    expect(notion[method]).toHaveBeenCalledWith(
      expect.objectContaining({ data_source_id: "editorial-database" }),
    );
  });

  it("retries the configured database ID when the data source is not found", async () => {
    vi.stubEnv("NOTION_EDITORIAL_DS_ID", "missing-data-source");
    vi.stubEnv("NOTION_EDITORIAL_DB_ID", "editorial-database");
    notion[method].mockRejectedValueOnce({ code: "object_not_found", status: 404 });

    await expect(read()).resolves.toMatchObject(expected);

    expect(notion[method].mock.calls.map(([request]) => request.data_source_id))
      .toEqual(["missing-data-source", "editorial-database"]);
  });

  it("does not replace a data source error with a missing database configuration error", async () => {
    vi.stubEnv("NOTION_EDITORIAL_DS_ID", "missing-data-source");
    const error = { code: "object_not_found", status: 404 };
    notion[method].mockRejectedValueOnce(error);

    await expect(read()).rejects.toBe(error);
    expect(notion[method]).toHaveBeenCalledTimes(1);
  });

  it("does not retry a permission error using the database fallback", async () => {
    vi.stubEnv("NOTION_EDITORIAL_DS_ID", "editorial-data-source");
    vi.stubEnv("NOTION_EDITORIAL_DB_ID", "editorial-database");
    const error = { code: "restricted_resource", status: 403 };
    notion[method].mockRejectedValueOnce(error);

    await expect(read()).rejects.toBe(error);
    expect(notion[method]).toHaveBeenCalledTimes(1);
  });

  it("fails clearly when neither source nor database ID is configured", async () => {
    await expect(read()).rejects.toThrow("NOTION_EDITORIAL_DB_ID not configured");
    expect(notion[method]).not.toHaveBeenCalled();
  });
});
