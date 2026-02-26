import { scrapeABSCensus } from "./scrapers/abs-census.js";
import { scrapeSunshineCoast } from "./scrapers/sunshine-coast.js";
import { scrapeQldOpenData } from "./scrapers/qld-open-data.js";
import { scrapeTroveHistorical } from "./scrapers/trove-historical.js";
import { scrapeALABiodiversity } from "./scrapers/ala-biodiversity.js";
import { scrapeCommunityWeb } from "./scrapers/community-web.js";
import { scrapeFacebookGroups } from "./scrapers/facebook-groups.js";
import { scrapeGoogleReviews } from "./scrapers/google-reviews.js";
import { scrapeCouncilConsultations } from "./scrapers/council-consultations.js";
import { scrapeLocalMedia } from "./scrapers/local-media.js";
import { runAnalysis } from "./analyze.js";
import dotenv from "dotenv";

dotenv.config();

const SKIP_ANALYSIS = process.argv.includes("--scrape-only");
const ONLY_ANALYSIS = process.argv.includes("--analyze-only");

async function runScraper(name: string, fn: () => Promise<unknown>) {
  const start = Date.now();
  try {
    await fn();
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`  ✓ ${name} completed in ${elapsed}s`);
  } catch (error) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`  ✗ ${name} failed after ${elapsed}s: ${msg}`);
  }
}

async function main() {
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║  The Harvest — Community Research Toolkit                ║");
  console.log("║  Witta/Maleny (POA 4552) — Jinibara/Kabi Kabi Country   ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  const totalStart = Date.now();

  if (!ONLY_ANALYSIS) {
    console.log("Phase 1: Data Collection (Government APIs)\n");

    // Government APIs first (most reliable)
    await Promise.all([
      runScraper("ABS Census", scrapeABSCensus),
      runScraper("Sunshine Coast Council", scrapeSunshineCoast),
      runScraper("QLD Open Data", scrapeQldOpenData),
      runScraper("Atlas of Living Australia", scrapeALABiodiversity),
    ]);

    console.log("\nPhase 2: Community & Historical Data\n");

    // Web scrapers and community data
    await Promise.all([
      runScraper("Trove Historical Records", scrapeTroveHistorical),
      runScraper("Community Web Research", scrapeCommunityWeb),
    ]);

    console.log("\nPhase 3: Sentiment Mining\n");

    // Sentiment scrapers
    await Promise.all([
      runScraper("Facebook Community Groups", scrapeFacebookGroups),
      runScraper("Google Reviews", scrapeGoogleReviews),
      runScraper("Council Consultations", scrapeCouncilConsultations),
      runScraper("Local Media", scrapeLocalMedia),
    ]);
  }

  if (!SKIP_ANALYSIS) {
    console.log("\nPhase 4: AI Analysis\n");
    await runScraper("AI Community Analysis", runAnalysis);
  }

  const totalElapsed = ((Date.now() - totalStart) / 1000).toFixed(1);
  console.log(`\n${"─".repeat(58)}`);
  console.log(`  All tasks completed in ${totalElapsed}s`);
  console.log(`  Data: research/data/`);
  console.log(`  Analysis: research/analysis/`);
  console.log(`  Explorer: client/public/community-explorer.html`);
  console.log(`${"─".repeat(58)}\n`);
}

main().catch(console.error);
