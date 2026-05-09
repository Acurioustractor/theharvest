import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import {
  createGHLSocialPost,
  getGHLAccountMap,
  getGHLSocialPosts,
} from "../server/gohighlevel.js";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

type Draft = {
  title: string;
  platforms: string[];
  summary: string;
  mediaPaths: string[];
};

const whatsappMediaRoot = path.resolve(
  "docs/communications/debriefs/_whatsapp-exports/archive/2026-04-27T09-46-09-055Z-whatsapp-chat-harvest-garden-crew"
);

const drafts: Draft[] = [
  {
    title: "Road-Facing Garden Follow-Up - 2026-04-29",
    platforms: ["Facebook"],
    summary: `You can start to feel the change from the road now.

A bit less overgrowth. A few more edges. More of the shape coming back.

It is not finished. That is not the point yet.

The point is that the place is starting to show where the next useful jobs are.

If you want to help with garden jobs, materials, or useful local knowledge, send us a message.`,
    mediaPaths: [
      "00003466-PHOTO-2026-04-09-18-22-41.jpg",
      "00003478-PHOTO-2026-04-09-18-26-41.jpg",
      "00003481-PHOTO-2026-04-09-18-26-53.jpg",
    ],
  },
  {
    title: "Mesh Arches And Growing Things - 2026-04-29",
    platforms: ["Facebook"],
    summary: `Garden question for local brains.

We are thinking about simple, good-looking ways to grow climbers and protect raised beds.

Mesh arches, trellis ideas, netting that does not look awful, materials that can handle Witta weather.

Who around here knows the useful version of this?`,
    mediaPaths: ["00003408-PHOTO-2026-03-20-13-11-06.jpg"],
  },
];

function assertEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function safeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "") || "harvest-media";
}

function mimeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".mov") return "video/quicktime";
  return "image/jpeg";
}

function postSummary(post: unknown): string {
  if (!post || typeof post !== "object") return "";
  const record = post as Record<string, unknown>;
  return String(record.summary || record.caption || record.message || "");
}

async function uploadGHLMedia(input: string, title: string): Promise<string> {
  const apiKey = assertEnv("GHL_API_KEY");
  const locationId = assertEnv("GHL_LOCATION_ID");
  const file = fs.readFileSync(input);
  const fileName = `${safeName(title)}-${safeName(path.basename(input))}`;
  const form = new FormData();

  form.append("file", new Blob([new Uint8Array(file)], { type: mimeFor(input) }), fileName);
  form.append("locationId", locationId);
  form.append("name", title);

  const response = await fetch("https://services.leadconnectorhq.com/medias/upload-file", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
    body: form,
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`GHL media upload failed (${response.status}): ${text}`);
  }

  const data = JSON.parse(text) as { url?: string };
  if (!data.url) throw new Error(`GHL media upload did not return a URL: ${text}`);
  return data.url;
}

async function main(): Promise<void> {
  assertEnv("GHL_LOCATION_ID");

  const accountMap = await getGHLAccountMap();
  const existingPosts = await getGHLSocialPosts();
  const existingSummaries = new Set((existingPosts.posts || []).map(postSummary).filter(Boolean));
  const results = [];

  for (const draft of drafts) {
    if (existingSummaries.has(draft.summary)) {
      results.push({
        title: draft.title,
        success: true,
        skipped: true,
        reason: "Matching draft already exists in GHL",
      });
      continue;
    }

    const accountIds = draft.platforms.flatMap((platform) => accountMap.get(platform) || []);
    if (!accountIds.length) {
      results.push({
        title: draft.title,
        success: false,
        skipped: true,
        reason: `No connected GHL accounts found for ${draft.platforms.join(", ")}`,
      });
      continue;
    }

    const mediaUrls = [];
    for (const mediaPath of draft.mediaPaths) {
      const absolutePath = path.join(whatsappMediaRoot, mediaPath);
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Missing media for ${draft.title}: ${absolutePath}`);
      }
      mediaUrls.push(await uploadGHLMedia(absolutePath, draft.title));
    }

    const result = await createGHLSocialPost({
      summary: draft.summary,
      accountIds,
      mediaUrls,
    });

    results.push({
      title: draft.title,
      platforms: draft.platforms,
      accountCount: accountIds.length,
      mediaCount: mediaUrls.length,
      ...result,
    });
  }

  console.log(JSON.stringify({ social: results }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
