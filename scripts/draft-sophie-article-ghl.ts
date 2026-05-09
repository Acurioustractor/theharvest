import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { createGHLSocialPost, deleteGHLSocialPost, getGHLAccountMap, getGHLSocialPosts } from "../server/gohighlevel.js";

const EL_ENV_PATH = "/Users/benknight/Code/empathy-ledger-v2/.env.local";
const ARTICLE_SLUG = "from-clearing-to-care-sophie-harvest-garden";
const HARVEST_URL = `https://www.theharvestwitta.com.au/blog/${ARTICLE_SLUG}`;
const SOCIAL_IMAGE_FILENAMES = [
  "20260506-1E5A4675.jpg",
  "20260506-1E5A4665.jpg",
  "20260506-1E5A4671.jpg",
];

dotenv.config({ path: ".env.local", override: false });
dotenv.config({ path: ".env", override: false });
dotenv.config({ path: EL_ENV_PATH, override: true });

function mustEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`${name} is missing. Checked ${EL_ENV_PATH}`);
  return value;
}

function postSummary(post: unknown): string {
  if (!post || typeof post !== "object") return "";
  const record = post as Record<string, unknown>;
  return String(record.summary || record.caption || record.message || "");
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function selectedArticleImages(article: { import_metadata: unknown; featuredImageUrl?: string | null }): string[] {
  const metadata = asRecord(article.import_metadata);
  const media = asRecord(metadata?.media);
  const photos = media?.photos;
  const byFilename = new Map<string, string>();
  if (Array.isArray(photos)) {
    for (const photo of photos) {
      const row = asRecord(photo);
      if (
        typeof row?.filename === "string" &&
        typeof row?.url === "string" &&
        row.url.startsWith("https://")
      ) {
        byFilename.set(row.filename, row.url);
      }
    }
  }

  const selected = SOCIAL_IMAGE_FILENAMES
    .map((filename) => byFilename.get(filename))
    .filter((url): url is string => Boolean(url));
  if (selected.length) return selected;

  const featured = metadata?.featuredImageUrl;
  if (typeof featured === "string" && featured.startsWith("https://")) return [featured];

  const photoUrls = metadata?.photo_urls;
  if (Array.isArray(photoUrls)) {
    return photoUrls.filter((item): item is string => typeof item === "string" && item.startsWith("https://")).slice(0, 3);
  }

  return [];
}

function caption(): string {
  return `Sophie knew this place before it was The Harvest.

She came here as a gardener, buying seeds from Green Harvest and chasing the weird and wonderful vegetables that made sense in this climate.

Now she is back in the garden, helping the place find its next shape.

"You've got these constant babies," she says about seedlings.

That feels like the right lesson for this stage of The Harvest. Not just clearing. Care. Timing. Weather. Netting. Raised beds. People noticing what the place is ready for.

And the best line from Sophie so far:

"It's not really about the gardening anymore. That's just a fun byproduct. It's really about social connection."

That is the garden story.

Read the story:
${HARVEST_URL}`;
}

async function main() {
  const supabase = createClient(
    mustEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    mustEnv("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("id, title, slug, import_metadata, status, syndication_destinations")
    .eq("slug", ARTICLE_SLUG)
    .maybeSingle();
  if (articleError) throw articleError;
  if (!article) throw new Error(`Article not found: ${ARTICLE_SLUG}`);
  if (article.status !== "published") throw new Error(`Article is not published: ${article.status}`);

  const summary = caption();
  const existingPosts = await getGHLSocialPosts();
  const existingMatchingPosts = (existingPosts.posts || []).filter((post) => postSummary(post).includes(ARTICLE_SLUG));
  for (const post of existingMatchingPosts) {
    const id = String(post.id || post._id || "");
    const status = String(post.status || "").toLowerCase();
    if (!id || status !== "draft") {
      console.log(JSON.stringify({
        skipped: true,
        reason: "A non-draft GHL post already links to this article. Not replacing it automatically.",
        articleId: article.id,
        articleUrl: HARVEST_URL,
        existingPostId: id || null,
        existingPostStatus: status || null,
      }, null, 2));
      return;
    }
    const deleted = await deleteGHLSocialPost(id);
    if (!deleted.success) {
      throw new Error(`Could not delete old GHL draft ${id}: ${deleted.error || "unknown error"}`);
    }
    console.log(`Deleted old GHL draft ${id} before recreating with edited copy and selected images.`);
  }

  const accountMap = await getGHLAccountMap();
  const accountIds = ["Instagram", "Facebook"].flatMap((platform) => accountMap.get(platform) || []);
  if (!accountIds.length) throw new Error("No GHL Instagram or Facebook accounts found.");

  const mediaUrls = selectedArticleImages(article);
  const result = await createGHLSocialPost({
    summary,
    accountIds,
    mediaUrls,
  });

  console.log(JSON.stringify({
    title: article.title,
    articleId: article.id,
    articleUrl: HARVEST_URL,
    platforms: ["Instagram", "Facebook"],
    accountCount: accountIds.length,
    mediaUrls,
    ...result,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
