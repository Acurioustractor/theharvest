import type { VercelRequest, VercelResponse } from "@vercel/node";

export type DeploymentVersion = {
  commitSha: string;
  deploymentId: string | null;
  deployedAt: string | null;
  environment: string;
  productionUrl: string | null;
};

export function deploymentVersion(
  env: NodeJS.ProcessEnv = process.env
): DeploymentVersion {
  return {
    commitSha:
      env.VERCEL_GIT_COMMIT_SHA ?? env.GITHUB_SHA ?? "development",
    deploymentId:
      env.VERCEL_DEPLOYMENT_ID ?? env.VERCEL_URL ?? null,
    deployedAt:
      env.VERCEL_DEPLOYMENT_CREATED_AT ??
      env.DEPLOYMENT_TIMESTAMP ??
      null,
    environment:
      env.VERCEL_TARGET_ENV ?? env.VERCEL_ENV ?? env.NODE_ENV ?? "development",
    productionUrl: env.VERCEL_PROJECT_PRODUCTION_URL ?? null,
  };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  return res.status(200).json(deploymentVersion());
}
