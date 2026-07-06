import dotenv from "dotenv";
import { getGHLAccountMap, getGHLSocialPosts } from "../server/gohighlevel.js";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

function summaryTitle(post: Record<string, unknown>): string {
  return String(post.summary || post.caption || post.message || "")
    .split("\n")[0]
    .trim();
}

function postId(post: Record<string, unknown>): string {
  return String(post.id || post._id || post.postId || post.groupId || "");
}

function postDate(post: Record<string, unknown>): string {
  return String(post.scheduleDate || post.date || post.createdAt || post.updatedAt || "");
}

function hasMedia(post: Record<string, unknown>): boolean {
  const media = post.media;
  return Array.isArray(media) ? media.length > 0 : Boolean(media);
}

function engagementSnapshot(post: Record<string, unknown>): Record<string, unknown> {
  const candidateKeys = [
    "likes",
    "likeCount",
    "comments",
    "commentCount",
    "shares",
    "shareCount",
    "views",
    "viewCount",
    "reach",
    "impressions",
    "clicks",
    "engagement",
    "insights",
    "analytics",
  ];
  const snapshot: Record<string, unknown> = {};

  for (const key of candidateKeys) {
    if (post[key] !== undefined) snapshot[key] = post[key];
  }

  return snapshot;
}

async function main(): Promise<void> {
  const rawFailed = process.argv.includes("--raw-failed");
  const withEngagement = process.argv.includes("--engagement");
  // allCreators: staff create posts in the GHL UI under their own users; the
  // review must see those (and their failed statuses), not just API-created posts.
  const [accountMap, result] = await Promise.all([
    getGHLAccountMap(),
    getGHLSocialPosts(undefined, { allCreators: true }),
  ]);
  const accountToPlatform = new Map<string, string>();
  for (const [platform, ids] of accountMap.entries()) {
    for (const id of ids) accountToPlatform.set(id, platform);
  }

  const posts = (result.posts || []).slice(0, 120).map((raw) => {
    const post = raw as Record<string, unknown>;
    const accountIds = Array.isArray(post.accountIds) ? post.accountIds.map(String) : [];
    const platforms = accountIds.length
      ? Array.from(new Set(accountIds.map((id) => accountToPlatform.get(id)).filter(Boolean)))
      : [String(post.platform || "")].filter(Boolean);

    return {
      id: postId(post),
      title: summaryTitle(post),
      status: post.status,
      date: postDate(post),
      platforms,
      media: hasMedia(post),
      engagement: withEngagement ? engagementSnapshot(post) : undefined,
    };
  });

  console.log(JSON.stringify({
    success: result.success,
    count: result.posts?.length || 0,
    posts,
    rawFailed: rawFailed
      ? (result.posts || []).filter((raw) => (raw as Record<string, unknown>).status === "failed")
      : undefined,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
