import { afterEach, describe, expect, it, vi } from "vitest";
import { EmpathyLedgerClient } from "../empathyLedgerClient";

vi.mock("../harvestImageStorage.js", () => ({
  mirrorHarvestImage: vi.fn(async (_id: string, src: string) => src),
}));

function mockMediaLibrary(total: number) {
  const records = Array.from({ length: total }, (_, index) => ({
    id: String(index + 1),
    url: `https://images.example.test/${index + 1}.jpg`,
    title: `Photo ${index + 1}`,
    description: null,
    altText: null,
    projectId: "harvest",
    createdAt: "2026-09-05T00:00:00Z",
  }));
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    expect(url.pathname).toBe("/api/v1/content-hub/media");
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 50);
    return Response.json({
      media: records.slice((page - 1) * limit, page * limit),
      pagination: { page, limit, total, hasMore: page * limit < total },
    });
  });
  vi.stubGlobal("fetch", fetchMock);
  return new EmpathyLedgerClient("https://el.example.test", "test-key");
}

function idsBetween(first: number, last: number) {
  return Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => String(first + index));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("full Harvest media pagination", () => {
  it("returns consecutive 100-item pages without overlap", async () => {
    const client = mockMediaLibrary(250);

    const first = await client.fetchAllHarvestMedia({ page: 1, limit: 100 });
    const second = await client.fetchAllHarvestMedia({ page: 2, limit: 100 });

    expect(first.media.map((item) => item.id)).toEqual(idsBetween(1, 100));
    expect(second.media.map((item) => item.id)).toEqual(idsBetween(101, 200));
    expect(second.pagination).toEqual({ page: 2, limit: 100, total: 250, hasMore: true });
  });

  it.each([
    { page: 2, limit: 75, first: 76, last: 150 },
    { page: 2, limit: 20, first: 21, last: 40 },
    { page: 3, limit: 20, first: 41, last: 60 },
  ])("preserves offsets for page $page with limit $limit", async ({ page, limit, first, last }) => {
    const client = mockMediaLibrary(250);

    const result = await client.fetchAllHarvestMedia({ page, limit });

    expect(result.media.map((item) => item.id)).toEqual(idsBetween(first, last));
    expect(result.pagination).toEqual({ page, limit, total: 250, hasMore: true });
  });

  it.each([
    { page: 3, limit: 100, first: 201, last: 250 },
    { page: 5, limit: 50, first: 201, last: 250 },
    { page: 4, limit: 100, first: 301, last: 250 },
  ])("ends pagination on page $page with limit $limit", async ({ page, limit, first, last }) => {
    const client = mockMediaLibrary(250);

    const result = await client.fetchAllHarvestMedia({ page, limit });

    expect(result.media.map((item) => item.id)).toEqual(idsBetween(first, last));
    expect(result.pagination).toEqual({ page, limit, total: 250, hasMore: false });
  });

  it("returns an empty collection without suggesting another page", async () => {
    const client = mockMediaLibrary(0);

    const result = await client.fetchAllHarvestMedia({ page: 1, limit: 100 });

    expect(result.media).toEqual([]);
    expect(result.pagination).toEqual({ page: 1, limit: 100, total: 0, hasMore: false });
  });

  it("offers another caller page while the final upstream page still has unused records", async () => {
    const client = mockMediaLibrary(50);

    const second = await client.fetchAllHarvestMedia({ page: 2, limit: 20 });
    const third = await client.fetchAllHarvestMedia({ page: 3, limit: 20 });

    expect(second.media.map((item) => item.id)).toEqual(idsBetween(21, 40));
    expect(second.pagination.hasMore).toBe(true);
    expect(third.media.map((item) => item.id)).toEqual(idsBetween(41, 50));
    expect(third.pagination.hasMore).toBe(false);
  });

  it("stops when an upstream page is empty despite stale pagination metadata", async () => {
    const fetchMock = vi.fn(async () => Response.json({
      media: [],
      pagination: { page: 3, limit: 50, total: 500, hasMore: true },
    }));
    vi.stubGlobal("fetch", fetchMock);
    const client = new EmpathyLedgerClient("https://el.example.test", "test-key");

    const result = await client.fetchAllHarvestMedia({ page: 2, limit: 100 });

    expect(result.media).toEqual([]);
    expect(result.pagination.hasMore).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not suggest more pages after an empty response ends a partial page", async () => {
    const client = mockMediaLibrary(50);
    const fetchMock = vi.mocked(fetch);
    const originalFetch = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation(async (...args) => {
      const response = await originalFetch(...args);
      const body = await response.json();
      return Response.json({ ...body, pagination: { ...body.pagination, total: 500, hasMore: true } });
    });

    const result = await client.fetchAllHarvestMedia({ page: 1, limit: 100 });

    expect(result.media.map((item) => item.id)).toEqual(idsBetween(1, 50));
    expect(result.pagination.hasMore).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
