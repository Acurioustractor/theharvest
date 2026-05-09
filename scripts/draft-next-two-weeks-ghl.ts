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
  mediaRoot: string;
  mediaPaths: string[];
};

const latestMediaRoot = path.resolve(
  "docs/communications/debriefs/_whatsapp-exports/2026-04-29-latest-whatsapp-chat-harvest-garden-crew"
);

const drafts: Draft[] = [
  {
    title: "Planting Day - 2026-05",
    platforms: ["Instagram", "Facebook"],
    mediaRoot: latestMediaRoot,
    mediaPaths: [
      "00003533-PHOTO-2026-04-29-07-02-57.jpg",
      "00003537-PHOTO-2026-04-29-11-45-40.jpg",
      "00003543-PHOTO-2026-04-29-12-53-24.jpg",
    ],
    summary: `Planting day at The Harvest.

The first version of the garden is starting to move from clearing and sorting into planting and care.

Tiny things in the ground. Mulch around the edges. A bit more shape every time people turn up.

This is the part that needs steady hands more than big announcements.

If you are nearby and want to help with watering, seedlings, garden jobs, or practical materials, send us a message.`,
  },
  {
    title: "Watering And Care Ask - 2026-05",
    platforms: ["Facebook"],
    mediaRoot: latestMediaRoot,
    mediaPaths: [
      "00003537-PHOTO-2026-04-29-11-45-40.jpg",
      "00003543-PHOTO-2026-04-29-12-53-24.jpg",
    ],
    summary: `The next useful job is care.

The beds are starting to fill, which means watering, checking, topping up mulch, and keeping the small things alive while they settle in.

If you are local and can help with a light watering rhythm, seedlings, mulch, compost, or garden time, send us a message.

Small steady help is exactly the thing.`,
  },
  {
    title: "Community Art Detail - 2026-05",
    platforms: ["Instagram"],
    mediaRoot: latestMediaRoot,
    mediaPaths: ["00003540-PHOTO-2026-04-29-12-23-55.jpg"],
    summary: `Small signs of the place becoming itself.

Not everything here needs to be big.

Some of it is a bird on a post, a bit of colour in the garden, and someone taking the time to notice it.`,
  },
  {
    title: "Room To Move - 2026-05",
    platforms: ["Facebook"],
    mediaRoot: latestMediaRoot,
    mediaPaths: ["00003538-PHOTO-2026-04-29-12-22-49.jpg"],
    summary: `A little more organised. A little more room to move.

Not the glamorous bit, but definitely the bit that makes everything else easier.

The Harvest is being built through these small practical shifts as much as the visible garden moments.`,
  },
  {
    title: "What Changed This Week - 2026-05",
    platforms: ["Instagram", "Facebook"],
    mediaRoot: latestMediaRoot,
    mediaPaths: [
      "00003533-PHOTO-2026-04-29-07-02-57.jpg",
      "00003537-PHOTO-2026-04-29-11-45-40.jpg",
      "00003540-PHOTO-2026-04-29-12-23-55.jpg",
      "00003543-PHOTO-2026-04-29-12-53-24.jpg",
    ],
    summary: `What changed this week:

- more seedlings in
- more mulch down
- more edges making sense
- more jobs becoming obvious

The place keeps teaching us what it needs next.

If you want to help with the next round of garden jobs, send us a message.`,
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
      const absolutePath = path.join(draft.mediaRoot, mediaPath);
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
