import { afterEach, describe, expect, it, vi } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import handler from "./sync-ready-posts";

const originalSecret = process.env.CRON_SECRET;

afterEach(() => {
  process.env.CRON_SECRET = originalSecret;
});

function responseDouble() {
  let statusCode = 200;
  let body: unknown;
  const response = {
    setHeader: vi.fn(),
    status: vi.fn((code: number) => {
      statusCode = code;
      return response;
    }),
    json: vi.fn((payload: unknown) => {
      body = payload;
      return response;
    }),
  } as unknown as VercelResponse;

  return { response, status: () => statusCode, body: () => body };
}

describe("editorial sync cron", () => {
  it("fails closed when CRON_SECRET is missing", async () => {
    delete process.env.CRON_SECRET;
    const result = responseDouble();

    await handler(
      { method: "GET", headers: {} } as VercelRequest,
      result.response,
    );

    expect(result.status()).toBe(401);
    expect(result.body()).toEqual({ error: "Unauthorized" });
  });

  it("rejects non-GET requests before sync", async () => {
    process.env.CRON_SECRET = "test-secret";
    const result = responseDouble();

    await handler(
      { method: "POST", headers: { authorization: "Bearer test-secret" } } as VercelRequest,
      result.response,
    );

    expect(result.status()).toBe(405);
  });
});
