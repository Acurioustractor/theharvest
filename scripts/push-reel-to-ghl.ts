import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createGHLSocialPost, getGHLAccountMap } from "../server/gohighlevel.js";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

type Options = {
  input: string;
  title: string;
  summary: string;
  platforms: string[];
  storage: "ghl" | "supabase";
};

function usage(): never {
  console.error(`Usage:
  npm run push:reel:ghl -- --input "/path/to/reel.mp4" --title "Garden reveal test" --summary "Caption text" --platforms "Instagram,Facebook"`);
  process.exit(1);
}

function readArgs(): Options {
  const args = process.argv.slice(2);
  const values = new Map<string, string>();

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const value = args[index + 1];
    if (!value || value.startsWith("--")) usage();
    values.set(key, value);
    index += 1;
  }

  const input = values.get("input");
  const title = values.get("title");
  const summary = values.get("summary");
  if (!input || !title || !summary) usage();

  return {
    input,
    title,
    summary,
    platforms: (values.get("platforms") || "Instagram,Facebook")
      .split(",")
      .map((platform) => platform.trim())
      .filter(Boolean),
    storage: values.get("storage") === "supabase" ? "supabase" : "ghl",
  };
}

function safeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "") || "reel";
}

async function uploadPublicVideo(input: string, title: string): Promise<string> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase credentials are not configured");
  }

  const key = `social-reels/${new Date().toISOString().slice(0, 10)}/${Date.now()}-${safeName(title)}.mp4`;
  const body = fs.readFileSync(input);
  const response = await fetch(`${supabaseUrl}/storage/v1/object/photo-wall/${key}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "video/mp4",
      "x-upsert": "true",
    },
    body,
  });

  if (!response.ok) {
    const error = await response.text().catch(() => response.statusText);
    throw new Error(`Supabase upload failed (${response.status}): ${error}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/photo-wall/${key}`;
}

async function uploadGHLMedia(input: string, title: string): Promise<string> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    throw new Error("GHL media credentials are not configured");
  }

  const body = fs.readFileSync(input);
  const form = new FormData();
  form.append("file", new Blob([body], { type: "video/mp4" }), `${safeName(title)}.mp4`);
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
  const options = readArgs();
  if (!fs.existsSync(options.input)) {
    throw new Error(`Input video does not exist: ${options.input}`);
  }

  const accountMap = await getGHLAccountMap();
  const accountIds = options.platforms.flatMap((platform) => accountMap.get(platform) || []);
  if (!accountIds.length) {
    throw new Error(`No GHL accounts found for ${options.platforms.join(", ")}`);
  }

  const mediaUrl = options.storage === "supabase"
    ? await uploadPublicVideo(options.input, options.title)
    : await uploadGHLMedia(options.input, options.title);
  const result = await createGHLSocialPost({
    summary: options.summary,
    accountIds,
    mediaUrls: [mediaUrl],
  });

  console.log(JSON.stringify({
    title: options.title,
    platforms: options.platforms,
    storage: options.storage,
    mediaUrl,
    ...result,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
