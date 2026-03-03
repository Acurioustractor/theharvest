import type { VercelRequest, VercelResponse } from "@vercel/node";
import { syncReadyPosts } from "../../server/notion.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify cron secret (Vercel sets this header for cron invocations)
  const authHeader = req.headers["authorization"];
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await syncReadyPosts();
    console.log("[Cron] sync-ready-posts result:", result);
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error("[Cron] sync-ready-posts error:", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
