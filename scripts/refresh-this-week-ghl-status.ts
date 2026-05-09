import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { getGHLSocialAccounts, getGHLSocialPosts } from "../server/gohighlevel.js";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

type KnownDraft = {
  label: string;
  id: string;
  action: string;
  matchText: string;
};

const thisWeekPath = path.resolve("docs/communications/THIS-WEEK.md");

const knownDrafts: KnownDraft[] = [
  {
    label: "Garden Progress Reel",
    id: "69f14732372bcce22bdd06df",
    action: "Build garden reel post",
    matchText: "The garden is starting to show itself.",
  },
  {
    label: "Quick Local Ask",
    id: "69f147329404d85d921a5ec0",
    action: "Build quick local ask",
    matchText: "Quick local ask.",
  },
  {
    label: "Children's Area Progress",
    id: "69f1473374f2c548223ce147",
    action: "Build children's area post",
    matchText: "The children's area moved forward this week.",
  },
  {
    label: "Entry Portal / Windy Witta",
    id: "69f147336af5365a22219149",
    action: "Build Windy Witta entry portal story",
    matchText: "Entry portal in progress.",
  },
];

function notionPlatformName(platform: string): string {
  const normalized = platform.toLowerCase();
  if (normalized === "instagram") return "Instagram";
  if (normalized === "facebook") return "Facebook";
  if (normalized === "google" || normalized === "google business") return "Google Business";
  if (normalized === "linkedin") return "LinkedIn";
  return platform || "Unknown";
}

function statusLabel(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized === "published") return "Published";
  if (normalized === "scheduled") return "Scheduled";
  if (normalized === "failed") return "Review";
  if (normalized === "in_progress") return "In Progress";
  if (normalized === "in progress") return "In Progress";
  return "Drafted";
}

function formatBrisbaneDate(value: string | null): string {
  if (!value) return "no date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Brisbane",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function postDate(post: Record<string, unknown>): string | null {
  return String(post.publishedAt || post.displayDate || post.scheduleDate || post.createdAt || "") || null;
}

function postId(post: Record<string, unknown>): string {
  return String(post.parentPostId || post._id || post.id || post.postId || "");
}

function childPostId(post: Record<string, unknown>): string {
  return String(post._id || post.id || post.postId || "");
}

function postSummary(post: Record<string, unknown>): string {
  return String(post.summary || "");
}

function titleFromSummary(summary: string): string {
  return summary.split(/\n+/)[0]?.trim() || "Untitled GHL post";
}

function postPlatforms(post: Record<string, unknown>, accountPlatformMap: Map<string, string>): string[] {
  const accountIds = Array.isArray(post.accountIds)
    ? post.accountIds.map(String)
    : post.accountId
      ? [String(post.accountId)]
      : [];
  const platforms = accountIds
    .map((accountId) => accountPlatformMap.get(accountId))
    .filter(Boolean) as string[];

  if (platforms.length) return platforms;

  return [notionPlatformName(String(post.platform || ""))].filter(Boolean);
}

function groupPosts(posts: Record<string, unknown>[]): Map<string, Record<string, unknown>[]> {
  const groups = new Map<string, Record<string, unknown>[]>();
  for (const post of posts) {
    const id = postId(post);
    if (!id) continue;
    groups.set(id, [...(groups.get(id) || []), post]);
  }
  return groups;
}

function replaceActionStatus(content: string, action: string, status: string, note: string): string {
  const lines = content.split("\n");
  const index = lines.findIndex((line) => line.includes(`| ${action}`) || line.includes(`| ${action} `));
  if (index === -1) return content;

  const parts = lines[index].split("|").map((part) => part.trim());
  if (parts.length < 5) return content;

  const where = parts[3] || "";
  lines[index] = `| ${status} | ${action} | ${where} | ${note} |`;
  return lines.join("\n");
}

function replaceSection(content: string, heading: string, body: string): string {
  const pattern = new RegExp(`## ${heading}\\n[\\s\\S]*?(?=\\n## |$)`);
  const replacement = `## ${heading}\n\n${body.trim()}\n`;
  if (pattern.test(content)) return content.replace(pattern, replacement);
  return `${content.trim()}\n\n${replacement}\n`;
}

async function main() {
  const ghlResult = await getGHLSocialPosts();
  if (!ghlResult.success || !ghlResult.posts) {
    throw new Error(ghlResult.error || "Failed to fetch GHL posts");
  }

  let content = fs.readFileSync(thisWeekPath, "utf8");
  const posts = ghlResult.posts as Record<string, unknown>[];
  const accountsResult = await getGHLSocialAccounts();
  const accountPlatformMap = new Map(
    (accountsResult.accounts || []).map((account) => [account.id, notionPlatformName(account.platform)])
  );
  const groups = groupPosts(posts);
  const summaries: string[] = [];

  for (const draft of knownDrafts) {
    const directMatches = posts.filter((post) => postId(post) === draft.id || childPostId(post) === draft.id);
    const fallbackMatches = posts.filter((post) => {
      const summary = postSummary(post);
      return summary.includes(draft.matchText) || titleFromSummary(summary) === draft.matchText;
    });
    const matches = directMatches.length ? directMatches : fallbackMatches;

    if (!matches.length) {
      content = replaceActionStatus(content, draft.action, "Review", `GHL ID \`${draft.id}\` not found in latest pull`);
      summaries.push(`${draft.label}: not found`);
      continue;
    }

    const statuses = matches.map((post) => statusLabel(String(post.status || "")));
    const finalStatus = statuses.every((status) => status === "Published")
      ? "Published"
      : statuses.some((status) => status === "Scheduled")
        ? "Scheduled"
        : statuses.some((status) => status === "In Progress")
          ? "In Progress"
          : statuses.some((status) => status === "Review")
            ? "Review"
            : "Drafted";
    const platforms = Array.from(new Set(matches.flatMap((post) => postPlatforms(post, accountPlatformMap))));
    const hasMedia = matches.some((post) => Array.isArray(post.media) && post.media.length > 0);
    const date = formatBrisbaneDate(postDate(matches[0]));
    const note = `${platforms.join(" + ") || "No platform"}; ${hasMedia ? "media attached" : "no media"}; ${date}; GHL ID \`${draft.id}\``;

    content = replaceActionStatus(content, draft.action, finalStatus, note);
    summaries.push(`${draft.label}: ${finalStatus}, ${note}`);
  }

  const groupedRows = Array.from(groups.entries()).slice(0, 12).map(([id, group]) => {
    const first = group[0] || {};
    const title = titleFromSummary(postSummary(first));
    const platforms = Array.from(new Set(group.flatMap((post) => postPlatforms(post, accountPlatformMap))));
    const statuses = Array.from(new Set(group.map((post) => statusLabel(String(post.status || "")))));
    const media = group.some((post) => Array.isArray(post.media) && post.media.length > 0);
    return `- ${title}: ${statuses.join(" / ")}, ${platforms.join(" + ")}, ${media ? "media" : "no media"}, ${formatBrisbaneDate(postDate(first))}, GHL group \`${id}\``;
  });

  const refreshedAt = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Brisbane",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  content = replaceSection(content, "Latest GHL Status", [
    `Refreshed: ${refreshedAt}`,
    "",
    ...summaries.map((line) => `- ${line}`),
    "",
    "Recent grouped GHL rows:",
    "",
    ...groupedRows,
  ].join("\n"));

  fs.writeFileSync(thisWeekPath, content);

  console.log(JSON.stringify({
    updated: thisWeekPath,
    refreshedAt,
    tracked: summaries,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
