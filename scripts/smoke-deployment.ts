import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import path from "node:path";

type Check = {
  name: string;
  ok: boolean;
  detail: string;
};

const args = new Map<string, string | boolean>();
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (!arg.startsWith("--")) continue;

  const [key, value] = arg.slice(2).split("=", 2);
  if (value !== undefined) {
    args.set(key, value);
    continue;
  }

  const next = process.argv[index + 1];
  if (next && !next.startsWith("--")) {
    args.set(key, next);
    index += 1;
  } else {
    args.set(key, true);
  }
}

const deploymentUrl =
  stringArg("url") ?? process.env.DEPLOYMENT_URL ?? process.env.URL;
const shareToken =
  stringArg("share") ??
  process.env.VERCEL_SHARE_TOKEN ??
  process.env.VERCEL_PROTECTION_BYPASS;
const skipBrowser = Boolean(args.get("skip-browser"));
const localStatic = Boolean(args.get("local-static"));
const expectedSha = stringArg("expected-sha") ?? process.env.EXPECTED_SHA;

const principalRoutes = [
  { path: "/", marker: "harvest-route:home" },
  { path: "/whats-on", marker: "harvest-route:whats-on" },
  { path: "/membership", marker: "harvest-route:membership" },
  { path: "/get-involved", marker: "harvest-route:get-involved" },
  { path: "/venue-hire", marker: "harvest-route:venue-hire" },
  { path: "/works", marker: "harvest-route:works" },
  { path: "/shop", marker: "harvest-route:shop" },
  { path: "/contact", marker: "harvest-route:contact" },
] as const;

if (!deploymentUrl) {
  console.error(
    "Missing deployment URL. Usage: npm run smoke:deployment -- --url https://preview.vercel.app [--share token]"
  );
  process.exit(1);
}

const baseUrl = normalizeBaseUrl(deploymentUrl);
const checks: Check[] = [];

const previewCookie = shareToken
  ? await getPreviewCookie(baseUrl, shareToken)
  : "";

await checkAppShell();
if (!localStatic) {
  await checkRedirect("/pizza", "/witta-pizza");
  await checkRedirect("/gather", "/whats-on");
  await checkRedirect("/photo-wall", "/whats-on");
  await checkVersion();
}
await checkSitemap();

if (skipBrowser) {
  record(
    "browser mount",
    true,
    "skipped with --skip-browser; HTTP checks only"
  );
} else {
  await checkBrowserMount();
}

for (const check of checks) {
  console.log(`${check.ok ? "PASS" : "FAIL"} ${check.name}: ${check.detail}`);
}

if (checks.some((check) => !check.ok)) {
  process.exit(1);
}

function stringArg(name: string) {
  const value = args.get(name);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeBaseUrl(rawUrl: string) {
  const url = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

async function getPreviewCookie(base: string, token: string) {
  const url = new URL(base);
  url.searchParams.set("_vercel_share", token);

  const response = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
  });
  const cookie = response.headers.get("set-cookie");
  const cookieHeader = cookieHeaderFromSetCookie(cookie);

  if (!cookieHeader) {
    record(
      "preview auth",
      false,
      "share token did not return a Vercel preview cookie"
    );
  } else {
    record("preview auth", true, "share token returned preview cookie");
  }

  return cookieHeader;
}

function cookieHeaderFromSetCookie(setCookie: string | null) {
  if (!setCookie) return "";

  return setCookie
    .split(/,(?=\s*[^;]+=)/)
    .map((cookie) => cookie.split(";")[0]?.trim())
    .filter(Boolean)
    .join("; ");
}

async function deploymentFetch(pathname: string, init?: RequestInit) {
  const url = new URL(pathname, baseUrl);
  const headers = new Headers(init?.headers);
  if (previewCookie) headers.set("cookie", previewCookie);

  return fetch(url, {
    ...init,
    headers,
    redirect: init?.redirect ?? "manual",
    signal: init?.signal ?? AbortSignal.timeout(15_000),
  });
}

async function checkAppShell() {
  const response = await deploymentFetch("/witta-pizza");
  const html = await response.text();

  record(
    "/witta-pizza status",
    response.status === 200,
    `expected 200, got ${response.status}`
  );
  record(
    "google verification tag",
    html.includes('name="google-site-verification"') &&
      html.includes("e67VV-cCLUFMzGEtlVWFY7AvgrFAPONwnCof2Jj4T8A"),
    "home shell contains Google Search Console verification tag"
  );
  record(
    "app bundle",
    /<script[^>]+type="module"[^>]+\/assets\/index-/.test(html),
    "home shell references the Vite client bundle"
  );
}

async function checkRedirect(source: string, expectedDestination: string) {
  const response = await deploymentFetch(source);
  const location = response.headers.get("location") ?? "";
  const redirectOk = [301, 302, 307, 308].includes(response.status);

  record(
    `${source} redirect`,
    redirectOk && location.startsWith(expectedDestination),
    `expected ${expectedDestination}, got ${response.status} ${location || "(no location)"}`
  );
}

async function checkSitemap() {
  const response = await deploymentFetch("/sitemap.xml", { redirect: "follow" });
  const xml = await response.text();

  record(
    "sitemap status",
    response.status === 200,
    `expected 200, got ${response.status}`
  );
  record(
    "sitemap has witta pizza",
    xml.includes("https://www.theharvestwitta.com.au/witta-pizza"),
    "sitemap includes /witta-pizza"
  );
  record(
    "sitemap excludes retired routes",
    !xml.includes("/gather") && !xml.includes("/photo-wall"),
    "sitemap does not include /gather or /photo-wall"
  );
}

async function checkVersion() {
  const response = await deploymentFetch("/api/version", { redirect: "follow" });
  const body = (await response.json().catch(() => null)) as
    | {
        commitSha?: string;
        deploymentId?: string | null;
        environment?: string;
      }
    | null;

  record(
    "version endpoint",
    response.status === 200 && Boolean(body?.commitSha),
    `expected deployment provenance, got ${response.status} ${body?.commitSha ?? "(no SHA)"}`
  );

  if (expectedSha) {
    record(
      "production commit SHA",
      body?.commitSha === expectedSha,
      `expected ${expectedSha}, got ${body?.commitSha ?? "(no SHA)"}`
    );
  }
}

async function checkBrowserMount() {
  const chromePath = findChrome();
  if (!chromePath) {
    record(
      "browser mount",
      false,
      "Chrome not found. Set CHROME_PATH or run: npx playwright install chromium"
    );
    return;
  }

  const profileDir = mkdtempSync(path.join(tmpdir(), "harvest-smoke-chrome-"));
  const port = 9300 + Math.floor(Math.random() * 500);
  const url = new URL(principalRoutes[0].path, baseUrl);
  if (shareToken) url.searchParams.set("_vercel_share", shareToken);
  const chrome = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profileDir}`,
      url.toString(),
    ],
    { stdio: ["ignore", "ignore", "pipe"] }
  );

  let stderr = "";
  chrome.stderr?.on("data", (chunk: Buffer) => {
    stderr += chunk.toString();
  });

  try {
    const tabs = await waitForDevToolsTabs(port, () => stderr);
    const targetTab =
      tabs.find((tab) => tab.type === "page" && tab.url?.includes(url.host)) ??
      tabs.find((tab) => tab.type === "page");
    const webSocketUrl = targetTab?.webSocketDebuggerUrl;
    if (!webSocketUrl) {
      record("browser mount", false, "Chrome DevTools tab was not available");
      return;
    }

    const events: Array<{ method: string; params: unknown }> = [];
    const browser = await connectDevTools(webSocketUrl, events);

    await browser.send("Runtime.enable");
    await browser.send("Log.enable");
    await browser.send("Page.enable");
    await browser.send("Network.enable");
    for (const route of principalRoutes) {
      const routeUrl = new URL(route.path, baseUrl);
      if (shareToken) routeUrl.searchParams.set("_vercel_share", shareToken);
      const value = await waitForRouteMarker(browser, routeUrl, route.marker);
      record(
        `${route.path} current-site marker`,
        value?.routeMarker === route.marker,
        value
          ? `rendered ${value.rootHtmlLength ?? 0} characters; expected “${route.marker}”`
          : `did not render “${route.marker}” before timeout`
      );
    }

    const errorText = JSON.stringify(events);
    const browserError = summarizeBrowserError(events, errorText, localStatic);
    record(
      "browser runtime",
      !browserError,
      browserError
        ? `runtime/config error found before promotion: ${browserError}`
        : "no blocking browser runtime/config errors"
    );
    browser.close();
  } catch (error) {
    record(
      "browser mount",
      false,
      error instanceof Error ? error.message : String(error)
    );
  } finally {
    await stopChrome(chrome);
    rmSync(profileDir, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 100,
    });
  }
}

async function waitForRouteMarker(
  browser: { send: (method: string, params?: Record<string, unknown>) => Promise<any> },
  url: URL,
  marker: string
) {
  await browser.send("Page.navigate", { url: url.toString() }).catch(() => {
    // The final DOM assertion is the promotion gate.
  });

  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    const evaluated = await browser.send("Runtime.evaluate", {
      expression: `(() => ({
        href: location.href,
        title: document.title,
        routeMarker: document.querySelector("[data-harvest-route]")?.getAttribute("data-harvest-route") ?? "",
        rootHtmlLength: document.querySelector("#root")?.innerHTML.length ?? null
      }))()`,
      returnByValue: true,
    });
    const value = evaluated.result?.result?.value as
      | {
          href: string;
          title: string;
          rootText: string;
          routeMarker: string;
          rootHtmlLength: number | null;
        }
      | undefined;
    if (value?.routeMarker === marker) return value;
    await sleep(250);
  }
  return undefined;
}

async function stopChrome(chrome: ReturnType<typeof spawn>) {
  if (chrome.exitCode !== null || chrome.signalCode !== null) return;

  chrome.kill("SIGTERM");
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      if (chrome.exitCode === null && chrome.signalCode === null) {
        chrome.kill("SIGKILL");
      }
      resolve();
    }, 2_000);

    chrome.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

async function waitForDevToolsTabs(port: number, getStderr: () => string) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json`, {
        signal: AbortSignal.timeout(1_000),
      });
      if (response.ok) {
        return (await response.json()) as Array<{
          type?: string;
          url?: string;
          webSocketDebuggerUrl?: string;
        }>;
      }
    } catch {
      // Chrome is still starting.
    }
    await sleep(250);
  }
  const stderr = getStderr().trim();
  throw new Error(
    `Chrome DevTools did not start on port ${port}${stderr ? `: ${stderr}` : ""}`
  );
}

function connectDevTools(
  webSocketUrl: string,
  events: Array<{ method: string; params: unknown }>
) {
  let id = 0;
  const pending = new Map<
    number,
    {
      resolve: (message: any) => void;
      reject: (error: Error) => void;
      timer: ReturnType<typeof setTimeout>;
    }
  >();
  const socket = new WebSocket(webSocketUrl);

  socket.addEventListener("message", (event) => {
    const rawMessage = webSocketMessageToString(event.data);
    if (!rawMessage) return;

    let message: any;
    try {
      message = JSON.parse(rawMessage);
    } catch {
      return;
    }

    if (message.id && pending.has(message.id)) {
      const request = pending.get(message.id);
      if (request) {
        clearTimeout(request.timer);
        request.resolve(message);
      }
      pending.delete(message.id);
      return;
    }

    if (
      message.method === "Runtime.consoleAPICalled" ||
      message.method === "Runtime.exceptionThrown" ||
      message.method === "Log.entryAdded" ||
      message.method === "Network.loadingFailed"
    ) {
      events.push({ method: message.method, params: message.params });
    }
  });

  const rejectPending = (error: Error) => {
    for (const [requestId, request] of pending) {
      clearTimeout(request.timer);
      request.reject(error);
      pending.delete(requestId);
    }
  };

  return new Promise<{
    send: (method: string, params?: Record<string, unknown>) => Promise<any>;
    close: () => void;
  }>((resolve, reject) => {
    socket.addEventListener("open", () => {
      resolve({
        send: (method, params = {}) =>
          new Promise((sendResolve, sendReject) => {
            const callId = ++id;
            const timer = setTimeout(() => {
              pending.delete(callId);
              sendReject(
                new Error(`Chrome DevTools command timed out: ${method}`)
              );
            }, 10_000);
            pending.set(callId, {
              resolve: sendResolve,
              reject: sendReject,
              timer,
            });
            socket.send(JSON.stringify({ id: callId, method, params }));
          }),
        close: () => socket.close(),
      });
    });
    socket.addEventListener("error", () => {
      rejectPending(new Error("Chrome DevTools socket error"));
      reject(new Error("Could not connect to Chrome DevTools"));
    });
    socket.addEventListener("close", () => {
      rejectPending(new Error("Chrome DevTools socket closed"));
    });
  });
}

function webSocketMessageToString(data: unknown) {
  if (typeof data === "string") return data;
  if (data instanceof ArrayBuffer) return Buffer.from(data).toString("utf8");
  if (ArrayBuffer.isView(data)) {
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength).toString(
      "utf8"
    );
  }
  return "";
}

function summarizeBrowserError(
  events: Array<{ method: string; params: unknown }>,
  errorText: string,
  allowMissingLocalEnv = false
) {
  const productionConfigPatterns = [
    "Supabase client env vars missing",
    "Supabase is not configured",
    "supabaseUrl is required",
  ];
  const patterns = [
    ...(allowMissingLocalEnv ? [] : productionConfigPatterns),
    "Uncaught",
    "TypeError",
    "ReferenceError",
  ];
  const matchedPattern = patterns.find((pattern) => errorText.includes(pattern));
  if (!matchedPattern) return "";

  const eventSummary = events
    .map((event) => summarizeBrowserEvent(event.params))
    .find((summary) => patterns.some((pattern) => summary.includes(pattern)));

  return eventSummary || matchedPattern;
}

function summarizeBrowserEvent(params: unknown) {
  if (!params || typeof params !== "object") return "";
  const text = JSON.stringify(params)
    .replace(/\s+/g, " ")
    .replace(/https?:\/\/[^\s"']+/g, "[url]");
  return text.slice(0, 240);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findChrome() {
  const explicitChrome = stringArg("chrome") ?? process.env.CHROME_PATH;
  if (explicitChrome && existsSync(explicitChrome)) return explicitChrome;

  const playwrightCache = path.join(homedir(), "Library/Caches/ms-playwright");
  if (existsSync(playwrightCache)) {
    for (const entry of readdirSync(playwrightCache).sort().reverse()) {
      if (!entry.startsWith("chromium-")) continue;
      const candidate = path.join(
        playwrightCache,
        entry,
        "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
      );
      if (existsSync(candidate)) return candidate;
    }
  }

  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  return undefined;
}

function record(name: string, ok: boolean, detail: string) {
  checks.push({ name, ok, detail });
}
