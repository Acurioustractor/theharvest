import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ELArticle, ELStoryteller } from "../empathyLedgerClient";

vi.mock("dotenv", () => ({ default: { config: vi.fn() } }));
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => { throw new Error("Public profiles must not access the database"); }),
}));
vi.mock("node:fs/promises", () => ({
  readdir: vi.fn().mockResolvedValue([]),
  readFile: vi.fn(),
  stat: vi.fn(),
  unlink: vi.fn(),
}));
vi.mock("../empathyLedgerClient", () => ({
  empathyLedgerClient: {
    fetchStorytellers: vi.fn(),
    fetchArticles: vi.fn(),
    fetchStoryteller: vi.fn(),
    fetchMediaForStoryteller: vi.fn(),
  },
}));

import { empathyLedgerClient } from "../empathyLedgerClient";
import {
  getPublicHarvestStorytellerBySlug,
  listPublicHarvestStorytellers,
} from "../empathyLedgerAdmin";

type AttributedArticle = ELArticle & { storyteller?: { id: string }; internalNotes?: string };

function storyteller(index: number): ELStoryteller {
  return {
    id: `teller-${index}`,
    slug: `canonical-person-${index}`,
    displayName: `Person ${index}`,
    bio: "Public biography",
    avatarUrl: null,
    location: "Witta",
    transcriptCount: 3,
  };
}

function article(index: number, tellerId?: string): AttributedArticle {
  return {
    id: `article-${index}`,
    title: `Article ${index}`,
    slug: `article-${index}`,
    subtitle: null,
    excerpt: "Public excerpt",
    authorName: "Public author",
    articleType: "story",
    primaryProject: "the-harvest",
    publishedAt: "2026-09-05T00:00:00Z",
    tags: [],
    themes: ["community"],
    visibility: "public",
    syndicationDestinations: ["harvest"],
    featuredImageUrl: null,
    featuredImageAlt: null,
    storyteller: tellerId ? { id: tellerId } : undefined,
    internalNotes: "Must not appear in public results",
  };
}

function paginate<T>(items: T[], options: { page?: number; limit?: number }, cap = 200) {
  const page = options.page ?? 1;
  const limit = Math.min(options.limit ?? 20, cap);
  return {
    items: items.slice((page - 1) * limit, page * limit),
    pagination: { page, limit, total: items.length, hasMore: page * limit < items.length },
  };
}

function mockPages(tellers: ELStoryteller[], articles: AttributedArticle[], cap = 200) {
  vi.mocked(empathyLedgerClient.fetchStorytellers).mockImplementation(async (options = {}) => {
    const result = paginate(tellers, options, cap);
    return { storytellers: result.items, pagination: result.pagination };
  });
  vi.mocked(empathyLedgerClient.fetchArticles).mockImplementation(async (options = {}) => {
    const result = paginate(articles, options, cap);
    return { articles: result.items, pagination: result.pagination };
  });
}

describe("public storyteller pagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(empathyLedgerClient.fetchStorytellers).mockReset();
    vi.mocked(empathyLedgerClient.fetchArticles).mockReset();
    mockPages([], []);
    vi.mocked(empathyLedgerClient.fetchStoryteller).mockResolvedValue(null);
    vi.mocked(empathyLedgerClient.fetchMediaForStoryteller).mockResolvedValue([]);
  });

  it("includes later-page people and article counts while excluding drafts and private fields", async () => {
    const tellers = Array.from({ length: 201 }, (_, index) => storyteller(index));
    const tail = { ...tellers[200], email: "private@example.com", internalNotes: "private" };
    tellers[200] = tail;
    tellers.push({ ...storyteller(201), slug: "barry-rodgerig" });
    const articles = [
      ...Array.from({ length: 200 }, (_, index) => article(index, tellers[0].id)),
      article(200, tellers[0].id),
      article(201, tail.id),
    ];
    mockPages(tellers, articles);

    const results = await listPublicHarvestStorytellers();

    expect(results).toHaveLength(201);
    expect(results[0]).toMatchObject({ articleCount: 201, publishedArticleCount: 201 });
    expect(results.find((item) => item.id === tail.id)).toEqual({
      id: tail.id,
      slug: tail.slug,
      displayName: tail.displayName,
      bio: tail.bio,
      avatarUrl: tail.avatarUrl,
      location: tail.location,
      projectRole: null,
      articleCount: 1,
      publishedArticleCount: 1,
      publishedStoryCount: 0,
      transcriptCount: 3,
    });
    expect(results.some((item) => item.slug === "barry-rodgerig")).toBe(false);
    for (const method of [empathyLedgerClient.fetchStorytellers, empathyLedgerClient.fetchArticles]) {
      expect(method).toHaveBeenCalledWith({ project: "the-harvest", limit: 200, page: 2, throwOnError: true });
      expect(method).toHaveBeenCalledTimes(2);
    }
  });

  it("finds a profile's articles after page 1 even when the API caps the requested page size", async () => {
    const teller = storyteller(0);
    const articles = [
      ...Array.from({ length: 200 }, (_, index) => article(index, "another-teller")),
      article(200, teller.id),
      article(201, teller.id),
      article(202),
    ];
    mockPages([], articles, 100);
    vi.mocked(empathyLedgerClient.fetchStoryteller).mockResolvedValue(teller);

    const result = await getPublicHarvestStorytellerBySlug("old-person-slug");

    expect(result).toMatchObject({
      slug: teller.slug,
      articleCount: 2,
      publishedArticleCount: 2,
      articles: [
        { id: "article-200", themes: ["community"] },
        { id: "article-201", themes: ["community"] },
      ],
      stories: [],
      transcripts: [],
    });
    expect(result!.articles.map((item) => item.id)).toEqual(["article-200", "article-201"]);
    expect(result!.articles[0]).not.toHaveProperty("internalNotes");
    expect(result!.articles[0]).not.toHaveProperty("storyteller");
    expect(empathyLedgerClient.fetchArticles).toHaveBeenCalledTimes(3);
    expect(empathyLedgerClient.fetchArticles).toHaveBeenLastCalledWith({
      project: "the-harvest", limit: 200, page: 3, throwOnError: true,
    });
  });

  it("preserves a valid empty collection and a profile with no published articles", async () => {
    expect(await listPublicHarvestStorytellers()).toEqual([]);
    vi.mocked(empathyLedgerClient.fetchStoryteller).mockResolvedValue(storyteller(0));

    expect(await getPublicHarvestStorytellerBySlug("canonical-person-0")).toMatchObject({
      articleCount: 0,
      publishedArticleCount: 0,
      articles: [],
    });
  });

  it.each(["barry-rodgerig", "old-draft-slug"])("keeps draft profiles hidden for %s", async (slug) => {
    vi.mocked(empathyLedgerClient.fetchStoryteller).mockResolvedValue({
      ...storyteller(0), slug: "barry-rodgerig",
    });

    expect(await getPublicHarvestStorytellerBySlug(slug)).toBeNull();
    expect(empathyLedgerClient.fetchArticles).not.toHaveBeenCalled();
    expect(empathyLedgerClient.fetchMediaForStoryteller).not.toHaveBeenCalled();
  });

  it("does not return partial article counts when a later page rejects", async () => {
    mockPages([storyteller(0)], []);
    vi.mocked(empathyLedgerClient.fetchArticles)
      .mockResolvedValueOnce({
        articles: [article(0, "teller-0")],
        pagination: { page: 1, limit: 200, total: 2, hasMore: true },
      })
      .mockRejectedValueOnce(new Error("Article page unavailable"));

    await expect(listPublicHarvestStorytellers()).rejects.toThrow("Article page unavailable");
  });

  it.each([
    ["storytellers", "empty page with more results"],
    ["articles", "empty page with more results"],
    ["storytellers", "repeated page"],
    ["articles", "repeated page"],
  ])("rejects invalid %s pagination: %s", async (collection, failure) => {
    const fetchPage = collection === "storytellers"
      ? vi.mocked(empathyLedgerClient.fetchStorytellers)
      : vi.mocked(empathyLedgerClient.fetchArticles);
    const emptyFirstPage = failure === "empty page with more results";
    fetchPage.mockResolvedValueOnce({
      storytellers: emptyFirstPage ? [] : [storyteller(0)],
      articles: emptyFirstPage ? [] : [article(0, "teller-0")],
      pagination: { page: 1, limit: 200, total: 2, hasMore: true },
    }).mockResolvedValueOnce({
      storytellers: [],
      articles: [],
      pagination: { page: emptyFirstPage ? 2 : 1, limit: 200, total: 2, hasMore: false },
    });

    await expect(listPublicHarvestStorytellers()).rejects.toThrow(/pagination/i);
  });
});
