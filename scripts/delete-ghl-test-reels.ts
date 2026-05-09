import dotenv from "dotenv";
import { deleteGHLSocialPost, getGHLSocialPosts } from "../server/gohighlevel.js";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

async function main(): Promise<void> {
  const result = await getGHLSocialPosts();
  if (!result.success || !result.posts) {
    throw new Error(result.error || "Failed to fetch GHL posts");
  }

  const tests = result.posts.filter((post: any) => {
    const summary = String(post.summary || "").toLowerCase();
    return summary.startsWith("drone cut test");
  });

  const deleted = [];
  for (const post of tests) {
    const id = post._id || post.id || post.postId;
    if (!id) continue;
    const deletion = await deleteGHLSocialPost(id);
    deleted.push({
      id,
      parentPostId: post.parentPostId,
      summary: String(post.summary || "").split("\n")[0],
      ...deletion,
    });
  }

  console.log(JSON.stringify({ found: tests.length, deleted }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
