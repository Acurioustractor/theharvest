import React, { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Works from "../../client/src/pages/Works";

const { state, contentQuery } = vi.hoisted(() => ({
  state: { user: null as { role: string } | null, content: {} as Record<string, string> },
  contentQuery: vi.fn(),
}));

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ user: state.user }) }));
vi.mock("@/lib/trpc", () => ({ trpc: { content: { get: { useQuery: contentQuery } } } }));
vi.mock("@/lib/seo", () => ({ setPageSeo: vi.fn() }));
vi.mock("wouter", () => ({
  Link: ({ children, ...props }: { children: ReactNode; href: string }) => createElement("a", props, children),
}));
vi.mock("framer-motion", () => {
  const element = (tag: string) => ({ children, className }: { children: ReactNode; className?: string }) =>
    createElement(tag, { className }, children);
  return { motion: { div: element("div"), article: element("article") } };
});
vi.mock("@/components/EditableText", () => ({
  EditableText: ({ defaultContent }: { defaultContent: string }) => defaultContent,
}));
vi.mock("@/components/HarvestImage", () => ({ HarvestImage: () => null }));
vi.mock("@/components/VisitStrip", () => ({ VisitStrip: () => null }));
vi.mock("../../client/src/pages/HarvestReviewTest", () => ({
  harvestButtonClasses: { primary: "" },
  SiteNav: () => null,
  SiteFooter: () => null,
}));

beforeEach(() => {
  // The isolated Vitest config uses the classic JSX transform for this real TSX page.
  vi.stubGlobal("React", React);
  state.user = null;
  state.content = {};
  contentQuery.mockReset();
  contentQuery.mockImplementation(({ page, slot }: { page: string; slot: string }) => ({
    data: state.content[`${page}/${slot}`] === undefined
      ? undefined
      : { content: state.content[`${page}/${slot}`] },
  }));
});

afterEach(() => vi.unstubAllGlobals());

function renderBadges(slug: string) {
  const $ = load(renderToStaticMarkup(createElement(Works)));
  const card = $(`a[href="/works/${slug}"]`).first().closest("article");
  return card.find(".absolute.top-4.left-4 span").map((_index, element) => $(element).text()).get();
}

describe("Works index lifecycle badges", () => {
  it.each([
    { slug: "the-garden", status: "Growing" },
    { slug: "the-cedar", status: "Growing" },
    { slug: "the-shop", status: "Forthcoming" },
    { slug: "the-milk-man", status: "Built" },
  ])("shows visitors one status for $slug", ({ slug, status }) => {
    expect(renderBadges(slug)).toEqual([status]);
  });

  it("uses the same saved lifecycle slot as the work detail page", () => {
    state.content["works/the-shop-lifecycleTags"] = JSON.stringify(["built", "making"]);

    expect(renderBadges("the-shop")).toEqual(["Growing"]);
    expect(contentQuery).toHaveBeenCalledWith({ page: "works", slot: "the-shop-lifecycleTags" });
  });

  it("keeps the full sorted taxonomy for admins, including saved overrides", () => {
    state.user = { role: "admin" };
    state.content["works/the-shop-lifecycleTags"] = JSON.stringify(["making", "built"]);

    expect(renderBadges("the-shop")).toEqual(["Built", "Making"]);
    expect(renderBadges("the-garden")).toEqual(["Planted", "Growing"]);
  });

  it.each(["not-json", '{"status":"built"}', '["unknown"]'])(
    "uses the default status when a saved override is invalid: %s",
    (content) => {
      state.content["works/the-garden-lifecycleTags"] = content;
      expect(renderBadges("the-garden")).toEqual(["Growing"]);
    },
  );

  it("respects an intentionally empty saved tag list", () => {
    state.content["works/the-garden-lifecycleTags"] = "[]";
    expect(renderBadges("the-garden")).toEqual(["Forthcoming"]);
  });
});
