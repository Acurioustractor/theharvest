import dotenv from "dotenv";
import {
  createGHLEmailTemplate,
  createGHLSocialPost,
  getGHLAccountMap,
  getGHLSocialPosts,
} from "../server/gohighlevel.js";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

type SocialDraft = {
  title: string;
  platforms: string[];
  summary: string;
};

const socialDrafts: SocialDraft[] = [
  {
    title: "Garden Progress Reel - 2026-04-29",
    platforms: ["Instagram", "Facebook"],
    summary: `The garden is starting to show itself.

Not in a finished way. In the better way.

A few more weeds gone. A few more edges visible. A few more paths making sense. The kind of progress that only happens when people keep turning up and doing the useful jobs.

This is probably how The Harvest gets built.

One corner at a time.

If you live nearby and want to help shape the garden, send us a message.`,
  },
  {
    title: "Quick Local Ask - 2026-04-29",
    platforms: ["Facebook"],
    summary: `Quick local ask.

We are collecting useful things for the first version of The Harvest.

Not fancy. Useful.

We are looking for:

- sturdy outdoor chairs
- folding tables
- timber that still has life in it
- garden tools
- large pots
- shade cloth
- mesh or trellis ideas for growing plants
- people who know gardens
- people who know kitchens

Before we buy new, we want to ask local.

If you have something sitting around that could help, send us a message.`,
  },
  {
    title: "Children's Area Progress - 2026-04-29",
    platforms: ["Instagram", "Facebook"],
    summary: `The children's area moved forward this week.

Mulch shifted. Edges cleaned up. More of the space started to feel usable.

It is still early, but that is the point. This part of The Harvest should be shaped by real use, not adult plans on paper alone.

More soon.

If you have ideas for a kids area that can handle real life, message us.`,
  },
  {
    title: "Entry Portal / Windy Witta - 2026-04-29",
    platforms: ["Instagram"],
    summary: `Entry portal in progress.

Still needs arms.

Also needs to survive Windy Witta, which is a design brief all by itself.

Got ideas for the entrance? Send them through.`,
  },
];

const newsletter = {
  name: "Harvest - One Corner At A Time - 2026-04-29",
  subject: "One corner at a time",
  preheader: "The Harvest is starting to show itself, one useful job at a time.",
  html: `<h2>One corner at a time</h2>

<p>The Harvest is starting to make more sense because people are showing up and doing the useful jobs.</p>

<p>Weeding. Mulch. Pruning. Clearing edges. Moving things around. Finding the old shape of the place again.</p>

<p>It is not glamorous work, but it is the work that lets the next layer happen.</p>

<p>This week we are looking for practical help: outdoor chairs, folding tables, timber, garden tools, large pots, shade cloth, mesh or trellis ideas, and people who know gardens or kitchens.</p>

<p>Before we buy new, we want to ask local.</p>

<p>If you can help, reply to this email or send us a message.</p>`,
};

function assertEnv(name: string): void {
  if (!process.env[name]) {
    throw new Error(`${name} is not configured`);
  }
}

function postSummary(post: unknown): string {
  if (!post || typeof post !== "object") return "";
  const record = post as Record<string, unknown>;
  return String(record.summary || record.caption || record.message || "");
}

async function main() {
  assertEnv("GHL_LOCATION_ID");

  const accountMap = await getGHLAccountMap();
  const existingPosts = await getGHLSocialPosts();
  const existingSummaries = new Set((existingPosts.posts || []).map(postSummary).filter(Boolean));

  const results = [];

  for (const draft of socialDrafts) {
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

    if (existingSummaries.has(draft.summary)) {
      results.push({
        title: draft.title,
        success: true,
        skipped: true,
        reason: "Matching social draft already exists in GHL",
      });
      continue;
    }

    const result = await createGHLSocialPost({
      summary: draft.summary,
      accountIds,
    });

    results.push({
      title: draft.title,
      platforms: draft.platforms,
      accountCount: accountIds.length,
      ...result,
    });
  }

  const emailResult = await createGHLEmailTemplate(newsletter);

  console.log(JSON.stringify({
    social: results,
    newsletter: {
      name: newsletter.name,
      ...emailResult,
    },
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
