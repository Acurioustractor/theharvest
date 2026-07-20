import { describe, expect, it } from "vitest";
import { deploymentVersion } from "./version";

describe("deploymentVersion", () => {
  it("reports Vercel deployment provenance", () => {
    expect(
      deploymentVersion({
        VERCEL_GIT_COMMIT_SHA: "abc123",
        VERCEL_DEPLOYMENT_ID: "dpl_123",
        VERCEL_DEPLOYMENT_CREATED_AT: "2026-07-20T06:00:00.000Z",
        VERCEL_TARGET_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "www.theharvestwitta.com.au",
      })
    ).toEqual({
      commitSha: "abc123",
      deploymentId: "dpl_123",
      deployedAt: "2026-07-20T06:00:00.000Z",
      environment: "production",
      productionUrl: "www.theharvestwitta.com.au",
    });
  });

  it("uses honest development fallbacks", () => {
    expect(deploymentVersion({})).toEqual({
      commitSha: "development",
      deploymentId: null,
      deployedAt: null,
      environment: "development",
      productionUrl: null,
    });
  });
});
