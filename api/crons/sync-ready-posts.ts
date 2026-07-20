import type { VercelRequest, VercelResponse } from "@vercel/node";
import { syncReadyPosts, syncPublishedPosts } from "../../server/notion.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify cron secret (Vercel sets this header for cron invocations)
  const authHeader = req.headers["authorization"];
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // 1. Push Ready posts from Notion → GHL
    const readyResult = await syncReadyPosts();
    // 2. Pull published status from GHL → Notion
    const publishedResult = await syncPublishedPosts();

    const result = { ...readyResult, published: publishedResult.updated };
    console.log("[Cron] sync result:", result);
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error("[Cron] sync error:", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
