import dotenv from "dotenv";
import { getGHLAccountMap } from "../server/gohighlevel.js";
import { getEditorialPostCopy, queryEditorialCalendar, syncGHLPostsToNotion, syncPublishedPosts, syncReadyPosts } from "../server/notion.js";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

const shouldSync = process.argv.includes("--sync");
const shouldSyncPublished = process.argv.includes("--published");
const shouldPullGHL = process.argv.includes("--pull-ghl");
const shouldApply = process.argv.includes("--apply");

function assertEnv(name: string): void {
  if (!process.env[name]) {
    throw new Error(`${name} is not configured`);
  }
}

async function main() {
  assertEnv("NOTION_TOKEN");
  assertEnv("NOTION_EDITORIAL_DB_ID");
  assertEnv("NOTION_EDITORIAL_DS_ID");
  assertEnv("GHL_LOCATION_ID");

  if (shouldPullGHL) {
    const result = await syncGHLPostsToNotion({ apply: shouldApply });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (shouldSync) {
    const result = await syncReadyPosts();
    const published = shouldSyncPublished ? await syncPublishedPosts() : { updated: 0 };
    console.log(JSON.stringify({ mode: "sync", ...result, published: published.updated }, null, 2));
    return;
  }

  const readyPosts = await queryEditorialCalendar({ status: "approved" });
  const unsynced = readyPosts.filter((post) => !post.ghlPostId);
  const accountMap = await getGHLAccountMap();

  const rows = [];
  for (const post of unsynced) {
    const matchingAccounts = post.platforms.flatMap((platform) => accountMap.get(platform) || []);
    const pageCopy = await getEditorialPostCopy(post.id);
    rows.push({
      id: post.id,
      title: post.title,
      scheduledDate: post.scheduledDate,
      targetAccounts: post.platforms,
      matchingAccountCount: matchingAccounts.length,
      copySource: pageCopy ? "page body" : post.caption ? "Key Message/Story" : "missing",
      hasCopy: Boolean(pageCopy || post.caption),
      hasMedia: Boolean(post.mediaUrl),
      link: post.link,
    });
  }

  console.log(JSON.stringify({
    mode: "dry-run",
    readyUnsyncedCount: rows.length,
    rows,
    next: "Run `npm run sync:social -- --sync` to push Ready posts to GHL.",
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
