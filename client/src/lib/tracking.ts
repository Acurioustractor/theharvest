export const START_HERE_CAMPAIGN = "start-here";

export function trackedPath(path: string, content: string): string {
  const url = new URL(path, "https://www.theharvestwitta.com.au");
  url.searchParams.set("utm_source", "harvest-website");
  url.searchParams.set("utm_medium", "website");
  url.searchParams.set("utm_campaign", START_HERE_CAMPAIGN);
  url.searchParams.set("utm_content", content);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function currentAttribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    sourcePath: window.location.pathname,
    sourceCampaign: params.get("utm_campaign") || undefined,
    sourceContent: params.get("utm_content") || undefined,
    sourceMedium: params.get("utm_medium") || undefined,
  };
}
