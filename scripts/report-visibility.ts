import { spawn } from "node:child_process";

const SITE_URL = "https://www.theharvestwitta.com.au";

type CheckStatus = "verified" | "blocked" | "watch";

type Check = {
  label: string;
  status: CheckStatus;
  detail: string;
};

type CommandResult = {
  code: number | null;
  stdout: string;
  stderr: string;
};

function printCheck(check: Check) {
  const label = check.status === "verified" ? "VERIFIED" : check.status === "blocked" ? "BLOCKED" : "WATCH";
  console.log(`- ${label}: ${check.label}: ${check.detail}`);
}

async function fetchText(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    cache: "no-store",
    ...init,
  });
  return {
    response,
    text: await response.text(),
  };
}

async function liveSeoChecks(): Promise<Check[]> {
  const checks: Check[] = [];

  try {
    const response = await fetch(`${SITE_URL}/witta-pizza`, { redirect: "manual", cache: "no-store" });
    checks.push({
      label: "/witta-pizza",
      status: response.status === 200 ? "verified" : "blocked",
      detail: `HTTP ${response.status}`,
    });
  } catch (error) {
    checks.push({
      label: "/witta-pizza",
      status: "blocked",
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  for (const path of ["/gather", "/photo-wall"]) {
    try {
      const response = await fetch(`${SITE_URL}${path}`, { redirect: "manual", cache: "no-store" });
      const location = response.headers.get("location") ?? "";
      checks.push({
        label: path,
        status: response.status === 308 && location === "/whats-on" ? "verified" : "blocked",
        detail: `HTTP ${response.status}, location ${location || "none"}`,
      });
    } catch (error) {
      checks.push({
        label: path,
        status: "blocked",
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }

  try {
    const { text } = await fetchText(`${SITE_URL}/sitemap.xml`);
    const hasPizza = text.includes("<loc>https://www.theharvestwitta.com.au/witta-pizza</loc>");
    const hasRetired = text.includes("/gather") || text.includes("/photo-wall");
    checks.push({
      label: "sitemap",
      status: hasPizza && !hasRetired ? "verified" : "blocked",
      detail: `${hasPizza ? "includes /witta-pizza" : "missing /witta-pizza"}; ${
        hasRetired ? "contains retired route" : "no retired /gather or /photo-wall URL"
      }`,
    });
  } catch (error) {
    checks.push({
      label: "sitemap",
      status: "blocked",
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    const { text: html } = await fetchText(`${SITE_URL}/witta-pizza`);
    const assetPath = html.match(/\/assets\/index-[^"]+\.js/)?.[0];

    if (!assetPath) {
      checks.push({
        label: "live bundle",
        status: "blocked",
        detail: "could not find index asset",
      });
    } else {
      const { text: bundle } = await fetchText(`${SITE_URL}${assetPath}`);
      const required = [
        "/witta-pizza",
        "DIY pizza in Witta",
        "Witta pizza weekends",
        "FoodEstablishment",
        "9 Gumland Drive",
      ];
      const missing = required.filter((value) => !bundle.includes(value));
      checks.push({
        label: "live bundle",
        status: missing.length === 0 ? "verified" : "blocked",
        detail: missing.length === 0 ? `contains Witta pizza route/content in ${assetPath}` : `missing ${missing.join(", ")}`,
      });
    }
  } catch (error) {
    checks.push({
      label: "live bundle",
      status: "blocked",
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  return checks;
}

function runCommand(command: string, args: string[]): Promise<CommandResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

function extractJsonObject(output: string): unknown {
  const lines = output.split("\n");
  const start = lines.findIndex((line) => line.trim() === "{");
  if (start < 0) throw new Error("No JSON object found in command output");
  return JSON.parse(lines.slice(start).join("\n"));
}

function matchFirst(output: string, pattern: RegExp): string | undefined {
  return output.match(pattern)?.[1];
}

async function ghlChecks(): Promise<Check[]> {
  const checks: Check[] = [];

  const launch = await runCommand("npm", ["run", "--silent", "report:launch-gates:ghl"]);
  if (launch.code !== 0) {
    checks.push({
      label: "GHL launch gates",
      status: "blocked",
      detail: launch.stderr.trim() || launch.stdout.trim() || `command exited ${launch.code}`,
    });
  } else {
    const blocked = launch.stdout.split("\n").filter((line) => line.includes("- BLOCKED:"));
    const watch = launch.stdout.split("\n").filter((line) => line.includes("- WATCH:"));
    checks.push({
      label: "GHL launch gates",
      status: blocked.length === 0 ? (watch.length === 0 ? "verified" : "watch") : "blocked",
      detail:
        blocked.length === 0
          ? `${watch.length} watch item(s)`
          : `${blocked.length} blocker(s): ${blocked.map((line) => line.replace("- BLOCKED: ", "").trim()).join(" | ")}`,
    });
  }

  const audit = await runCommand("npm", ["run", "--silent", "audit:contacts:ghl"]);
  if (audit.code !== 0) {
    checks.push({
      label: "GHL contact audit",
      status: "blocked",
      detail: audit.stderr.trim() || audit.stdout.trim() || `command exited ${audit.code}`,
    });
  } else {
    try {
      const data = extractJsonObject(audit.stdout) as {
        harvestContacts?: number;
        missingNameCount?: number;
        duplicateEmailGroupsHarvest?: number;
        duplicatePhoneGroupsHarvest?: number;
        plannedTagRefreshes?: number;
        tagCounts?: Record<string, number>;
      };
      const tagCounts = data.tagCounts ?? {};
      checks.push({
        label: "GHL contact audit",
        status: data.plannedTagRefreshes === 0 ? "verified" : "watch",
        detail: `${data.harvestContacts ?? "?"} Harvest contacts; ${data.missingNameCount ?? "?"} missing names; ${
          data.duplicateEmailGroupsHarvest ?? "?"
        } duplicate Harvest email groups; ${data.duplicatePhoneGroupsHarvest ?? "?"} duplicate Harvest phone groups; ${
          data.plannedTagRefreshes ?? "?"
        } tag refresh(es); interest:markets ${tagCounts["interest:markets"] ?? 0}; shop-call-booked ${
          tagCounts["shop-call-booked"] ?? 0
        }`,
      });
    } catch (error) {
      checks.push({
        label: "GHL contact audit",
        status: "watch",
        detail: `completed, but summary parse failed: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  const desk = await runCommand("npm", ["run", "--silent", "desk:ghl"]);
  if (desk.code !== 0) {
    checks.push({
      label: "GHL desk",
      status: "blocked",
      detail: desk.stderr.trim() || desk.stdout.trim() || `command exited ${desk.code}`,
    });
  } else {
    const replyQueue = matchFirst(desk.stdout, /Reply queue: (\d+) opportunity card\(s\)/);
    const memberSignups = matchFirst(desk.stdout, /Member signups: (\d+)/);
    const memberComments = matchFirst(desk.stdout, /Member comments: (\d+)/);
    checks.push({
      label: "GHL desk",
      status: replyQueue === "0" ? "verified" : "watch",
      detail: `${replyQueue ?? "?"} reply-needed card(s); ${memberSignups ?? "?"} member signup(s); ${
        memberComments ?? "?"
      } member comment(s)`,
    });
  }

  return checks;
}

async function main() {
  console.log(`# Harvest visibility report - ${new Date().toISOString()}`);
  console.log("");

  console.log("## Live site SEO");
  for (const check of await liveSeoChecks()) printCheck(check);
  console.log("");

  console.log("## GHL");
  for (const check of await ghlChecks()) printCheck(check);
  console.log("");

  console.log("## Manual checks still required");
  printCheck({
    label: "Search Console ranking/index status",
    status: "watch",
    detail: "requires Search Console UI/API access; not checked by this command",
  });
  printCheck({
    label: "Google Business Profile completeness/posts/reviews",
    status: "watch",
    detail: "requires GBP or GHL Listings UI access; not checked by this command",
  });
  printCheck({
    label: "GHL workflow action graph",
    status: "watch",
    detail: "GHL API exposes workflow name/status, not trigger/action blocks; inspect in workflow builder",
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
