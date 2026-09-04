import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type CommunityHandler = (request: Request) => Promise<Response>;
type CapturedBody = {
  payload?: { helpType?: string; availability?: string };
  tags?: string[];
  body?: string;
  html?: string;
};

describe("community volunteer help preferences", () => {
  let handler: CommunityHandler;
  const calls: { url: string; body: CapturedBody | undefined }[] = [];

  beforeEach(async () => {
    vi.resetModules();
    calls.length = 0;
    const env: Record<string, string> = {
      SUPABASE_URL: "https://storage.invalid",
      SUPABASE_SERVICE_ROLE_KEY: "fixture-only",
      GHL_API_KEY: "fixture-only",
      GHL_LOCATION_ID: "fixture-location",
    };
    vi.stubGlobal("Deno", {
      env: { get: (key: string) => env[key] },
      serve: (callback: CommunityHandler) => { handler = callback; },
    });
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = String(input);
      const body = init?.body ? JSON.parse(String(init.body)) : undefined;
      calls.push({ url, body });
      if (url === "https://storage.invalid/rest/v1/community_submissions") {
        return Response.json([{ id: "fixture-submission" }]);
      }
      if (url.endsWith("/contacts/upsert")) {
        return Response.json({ contact: { id: "fixture-contact" } });
      }
      if (url.includes("/conversations/search?")) {
        return Response.json({ conversations: [{ id: "fixture-conversation" }] });
      }
      if ([
        "/community_submissions?id=eq.fixture-submission",
        "/contacts/fixture-contact/tags",
        "/contacts/fixture-contact/notes",
        "/conversations/messages/inbound",
        "/opportunities/upsert",
      ].some((suffix) => url.endsWith(suffix))) {
        return Response.json({});
      }
      throw new Error(`Unexpected request in isolated community preference test: ${url}`);
    }));

    await import("../../supabase/functions/community-submit/index");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const submit = (helpType?: string) => handler(new Request("https://function.invalid/community-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "volunteer",
      name: "Fixture Person",
      email: "fixture@example.invalid",
      helpType,
      availability: "Occasional weekends",
      message: "I would like to help.",
    }),
  }));

  const bodyFor = (suffix: string) => calls.find((call) => call.url.endsWith(suffix))?.body;

  it.each(["garden", "making", "events", "shop", "stories", "anything-useful"])(
    "records %s as a preference for review without assigning a crew",
    async (helpType) => {
      const response = await submit(helpType);

      expect(response.status).toBe(200);
      expect(bodyFor("/community_submissions")?.payload).toMatchObject({
        helpType,
        availability: "Occasional weekends",
      });
      const tags = bodyFor("/contacts/fixture-contact/tags")?.tags;
      expect(tags).toEqual(expect.arrayContaining(["interest:volunteer", "lane:community", "harvest-inbox", "project:act-hv"]));
      expect(tags?.some((tag) => tag.startsWith("pod:"))).toBe(false);
      expect(bodyFor("/contacts/fixture-contact/notes")?.body).toContain(`**Help preference:** ${helpType}`);
      expect(bodyFor("/conversations/messages/inbound")?.html).toContain(`<p>Help preference: ${helpType}</p>`);
    },
  );

  it("escapes a submitted preference in the inbox while preserving the original in storage", async () => {
    const helpType = "<img src=x onerror=alert(1)>";

    await submit(helpType);

    expect(bodyFor("/community_submissions")?.payload?.helpType).toBe(helpType);
    expect(bodyFor("/conversations/messages/inbound")?.html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(bodyFor("/conversations/messages/inbound")?.html).not.toContain(helpType);
  });

  it("does not invent a preference when none was supplied", async () => {
    const response = await submit();

    expect(response.status).toBe(200);
    expect(bodyFor("/community_submissions")?.payload).not.toHaveProperty("helpType");
    expect(bodyFor("/contacts/fixture-contact/notes")?.body).not.toContain("Help preference:");
    expect(bodyFor("/conversations/messages/inbound")?.html).not.toContain("Help preference:");
    expect(bodyFor("/contacts/fixture-contact/tags")?.tags?.some((tag) => tag.startsWith("pod:"))).toBe(false);
  });
});
