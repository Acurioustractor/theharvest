import { listPublicHarvestStorytellers, getPublicHarvestStorytellerBySlug } from "../server/empathyLedgerAdmin.ts";

console.log("=== listPublicHarvestStorytellers ===");
const list = await listPublicHarvestStorytellers();
console.log(JSON.stringify(list, null, 2));

if (list.length > 0) {
  console.log(`\n=== getPublicHarvestStorytellerBySlug("${list[0].slug}") ===`);
  const detail = await getPublicHarvestStorytellerBySlug(list[0].slug);
  console.log(JSON.stringify({
    slug: detail?.slug,
    displayName: detail?.displayName,
    articleCount: detail?.articleCount,
    publishedArticleCount: detail?.publishedArticleCount,
    transcriptCount: detail?.transcriptCount,
    articlesLen: detail?.articles?.length,
    firstArticle: detail?.articles?.[0],
    storiesLen: detail?.stories?.length,
    transcriptsLen: detail?.transcripts?.length,
    localPhotosLen: detail?.localPhotos?.length,
  }, null, 2));
}
