import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("dotenv", () => ({ default: { config: vi.fn() } }));
vi.mock("../harvestImageStorage", () => ({
  mirrorHarvestImage: vi.fn(async (_id: string, url: string) => url),
}));

import { EmpathyLedgerClient } from "../empathyLedgerClient";
import { listPublicHarvestStorytellers } from "../empathyLedgerAdmin";

const teller = { id: "teller-1", slug: "person-one", displayName: "Person One", bio: null, avatarUrl: null };
const article = { id: "article-1", title: "Article One", storyteller: { id: teller.id }, featuredImageUrl: null };

describe("public pagination with the real EL client", () => {
  const mockFetch = vi.fn<typeof fetch>();

  beforeEach(() => {
    mockFetch.mockReset();
    vi.stubGlobal("fetch", mockFetch);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each(["storytellers", "articles"])("rejects the public list when a later %s HTTP request fails", async (collection) => {
    mockFetch.mockImplementation(async (input) => {
      const url = new URL(String(input));
      const current = url.pathname.split("/").at(-1);
      const page = Number(url.searchParams.get("page") ?? 1);
      if (current === collection && page === 2) {
        return new Response("Service unavailable", { status: 503 });
      }
      if (current !== "storytellers" && current !== "articles") {
        throw new Error(`Unexpected request: ${url.pathname}`);
      }
      return Response.json({
        [current]: current === "storytellers" ? [teller] : [article],
        pagination: { page, limit: 200, total: current === collection ? 2 : 1, hasMore: current === collection },
      });
    });

    await expect(listPublicHarvestStorytellers()).rejects.toThrow("Empathy Ledger API error: 503");
  });

  it.each(["articles", "storytellers"] as const)("supports strict %s failures while preserving the default empty fallback", async (collection) => {
    mockFetch.mockImplementation(async () => new Response("Service unavailable", { status: 503 }));
    const client = new EmpathyLedgerClient("https://el.example.invalid");
    const fetchPage = collection === "articles"
      ? client.fetchArticles.bind(client)
      : client.fetchStorytellers.bind(client);

    await expect(fetchPage({ page: 2, throwOnError: true })).rejects.toThrow("Empathy Ledger API error: 503");
    await expect(fetchPage({ page: 2 })).resolves.toEqual({
      [collection]: [],
      pagination: { page: 1, limit: 20, total: 0, hasMore: false },
    });
  });
});
