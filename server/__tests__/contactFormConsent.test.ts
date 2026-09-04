import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type ContactHandler = (request: Request) => Promise<Response>;
type CapturedBody = {
  tags?: string[];
  customFields?: { id: string; fieldValue?: string }[];
};

describe("contact form newsletter consent", () => {
  let handler: ContactHandler;
  let env: Record<string, string | undefined>;
  let failContactUpsert: boolean;
  const calls: { url: string; body: CapturedBody | undefined }[] = [];

  beforeEach(async () => {
    vi.resetModules();
    calls.length = 0;
    failContactUpsert = false;
    env = {
      GHL_API_KEY: "fixture-only",
      GHL_LOCATION_ID: "fixture-location",
      GHL_CONTACT_FORM_WORKFLOW_ID: "fixture-contact-workflow",
      GHL_NEWSLETTER_CONSENT_FIELD_ID: "fixture-newsletter-consent",
    };
    vi.stubGlobal("Deno", {
      env: { get: (key: string) => env[key] },
      serve: (callback: ContactHandler) => { handler = callback; },
    });
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = String(input);
      const body = init?.body ? JSON.parse(String(init.body)) : undefined;
      calls.push({ url, body });
      const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), {
        status,
        headers: { "Content-Type": "application/json" },
      });
      if (url.endsWith("/contacts/upsert")) {
        return failContactUpsert
          ? json({ message: "Fixture CRM failure" }, 503)
          : json({ contact: { id: "fixture-contact" } });
      }
      if (url.includes("/conversations/search?")) {
        return json({ conversations: [{ id: "fixture-conversation" }] });
      }
      if ([
        "/contacts/fixture-contact/tags",
        "/contacts/fixture-contact/notes",
        "/contacts/fixture-contact/workflow/fixture-contact-workflow",
        "/conversations/messages/inbound",
        "/opportunities/upsert",
      ].some(path => url.endsWith(path))) {
        return json({});
      }
      throw new Error(`Unexpected request in isolated contact-form test: ${url}`);
    }));

    // Import the real edge entry point with its Deno host and all HTTP calls mocked.
    await import("../../supabase/functions/contact-form/index");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const submit = (subscribe: unknown) => handler(new Request("https://function.invalid/contact-form", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Fixture Person",
      email: "fixture@example.invalid",
      subject: "A question",
      message: "Fixture message",
      subscribe,
    }),
  }));

  const bodyFor = (suffix: string) => calls.find(call => call.url.endsWith(suffix))?.body;

  it.each([false, undefined, null, "false", "true", "Yes", 1, {}, []].map(value => ({ value })))(
    "does not infer consent from $value",
    async ({ value }) => {
      const response = await submit(value);
      expect(response.status).toBe(200);
      expect(bodyFor("/contacts/fixture-contact/tags")?.tags).toContain("act-inquiry");
      expect(bodyFor("/contacts/fixture-contact/tags")?.tags).not.toContain("comms:harvest-newsletter");
      expect(bodyFor("/contacts/upsert")?.customFields).not.toEqual(expect.arrayContaining([
        expect.objectContaining({ id: "fixture-newsletter-consent" }),
      ]));
    },
  );

  it("persists explicit consent before adding the sendable newsletter tag", async () => {
    const response = await submit(true);
    expect(response.status).toBe(200);
    expect(bodyFor("/contacts/upsert")?.customFields).toEqual(expect.arrayContaining([
      { id: "fixture-newsletter-consent", fieldValue: "Yes" },
      { id: "ceJz9FUf8dE4fmvnPDKd", fieldValue: "Subject: A question\n\nFixture message" },
    ]));
    expect(bodyFor("/contacts/fixture-contact/tags")?.tags).toContain("comms:harvest-newsletter");
    expect(calls.findIndex(call => call.url.endsWith("/contacts/upsert")))
      .toBeLessThan(calls.findIndex(call => call.url.endsWith("/contacts/fixture-contact/tags")));
  });

  it("uses the existing Harvest consent field when no override is configured", async () => {
    delete env.GHL_NEWSLETTER_CONSENT_FIELD_ID;
    await submit(true);
    expect(bodyFor("/contacts/upsert")?.customFields).toContainEqual({
      id: "aVnqmajnysMtGYhLD0oA", fieldValue: "Yes",
    });
  });

  it("does not apply marketing tags when persisting the contact fails", async () => {
    failContactUpsert = true;
    const response = await submit(true);
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ success: false });
    expect(bodyFor("/contacts/fixture-contact/tags")).toBeUndefined();
    expect(calls.some(call => call.url.includes("/workflow/"))).toBe(false);
  });
});
