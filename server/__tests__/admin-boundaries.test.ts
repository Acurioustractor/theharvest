import { describe, expect, it } from "vitest";
import type { TrpcContext } from "../_core/context";
import { appRouter } from "../routers";
import { loadStory } from "../wiki";

type Caller = ReturnType<typeof appRouter.createCaller>;

function restrictedCalls(caller: Caller) {
  return [
    ["newsletter count", () => caller.newsletter.subscriberCount()],
    ["RSVP count", () => caller.eoi.count()],
    ["photo wall submission", () => caller.photoWall.submit({ firstName: "Test", email: "test@example.com" })],
    ["photo wall contact", () => caller.photoWall.getContact({ contactId: "contact-1" })],
    ["photo wall note", () => caller.photoWall.addNote({ contactId: "contact-1", note: "Test" })],
    ["photo wall photo", () => caller.photoWall.sendPhoto({ contactId: "contact-1", photoUrl: "https://example.com/photo.jpg" })],
    ["photo wall upload", () => caller.photoWall.upload({ base64Data: "AA==", fileName: "photo.png", contentType: "image/png" })],
    ["photo wall gallery", () => caller.photoWall.gallery()],
    ["site plan annotations", () => caller.sitePlan.annotations({ pointId: "garden" })],
    ["site plan note", () => caller.sitePlan.addNote({ pointId: "garden", content: "Test" })],
    ["site plan upload", () => caller.sitePlan.uploadPhoto({ pointId: "garden", fileName: "photo.png", base64Data: "AA==", contentType: "image/png" })],
    ["site plan delete", () => caller.sitePlan.delete({ id: 1 })],
    ["event feedback", () => caller.feedback.forEvent({ eventId: 1 })],
    ["editorial list", () => caller.editorial.list()],
    ["editorial summary", () => caller.editorial.harvestSummary()],
    ["editorial create", () => caller.editorial.create({ title: "Test" })],
    ["editorial update", () => caller.editorial.update({ id: "page-1", status: "Draft" })],
    ["editorial sync", () => caller.editorial.autoSync()],
    ["social accounts", () => caller.social.accounts()],
    ["social list", () => caller.social.list()],
    ["social post", () => caller.social.post({ summary: "Test", accountIds: ["account-1"] })],
    ["email template", () => caller.email.createTemplate({ name: "Test", html: "<p>Test</p>" })],
    ["untagged media library", () => caller.gallery.fromEL({ limit: 1 })],
  ] as const;
}

describe("admin procedure boundaries", () => {
  it.each([
    ["anonymous", null],
    ["non-admin", { role: "user" }],
  ])("rejects %s callers before external side effects", async (_label, user) => {
    const caller = appRouter.createCaller({ user } as TrpcContext);

    for (const [name, call] of restrictedCalls(caller)) {
      await expect(call(), name).rejects.toMatchObject({ code: "FORBIDDEN" });
    }
  });
});

describe("wiki path safety", () => {
  it("rejects story traversal slugs", async () => {
    const caller = appRouter.createCaller({ user: null } as TrpcContext);

    await expect(
      caller.wiki.story({ slug: "../../operations/lease" }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(loadStory("../../operations/lease")).toBeNull();
  });

  it("rejects article proxy traversal slugs", async () => {
    const caller = appRouter.createCaller({ user: null } as TrpcContext);

    await expect(
      caller.blog.bySlug({ slug: "../../admin" }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
