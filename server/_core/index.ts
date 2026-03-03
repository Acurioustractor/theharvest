import "dotenv/config";
import path from "path";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getApprovedBusinesses, getApprovedEvents } from "../db";
import { generateImage, generateSketch } from "../gemini";
import { refreshGHLToken, persistTokens } from "../gohighlevel";

const resolveBaseUrl = (req: express.Request) => {
  const envUrl = process.env.PUBLIC_SITE_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }
  const forwardedProto = req.get("x-forwarded-proto");
  const proto = forwardedProto ? forwardedProto.split(",")[0] : req.protocol;
  const host = req.get("host") || "localhost";
  return `${proto}://${host}`;
};

const requireRegistryToken = (req: express.Request) => {
  const expectedToken = process.env.REGISTRY_FEED_TOKEN;
  if (!expectedToken) {
    return null;
  }
  const authHeader = req.get("authorization") || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";
  const headerToken = req.get("x-registry-token") || "";
  const providedToken = bearerToken || headerToken;
  if (!providedToken || providedToken !== expectedToken) {
    return "Invalid registry token.";
  }
  return null;
};

const toIsoString = (value: Date | string | null | undefined) => {
  if (!value) return null;
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
};

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/registry", async (req, res) => {
    const authError = requireRegistryToken(req);
    if (authError) {
      return res.status(401).json({ error: authError });
    }

    try {
      const [events, businesses] = await Promise.all([
        getApprovedEvents(),
        getApprovedBusinesses(),
      ]);
      const baseUrl = resolveBaseUrl(req);

      const items = [
        ...events.map((event) => ({
          id: `event-${event.id}`,
          type: "event",
          title: event.title,
          summary: event.description || undefined,
          image_url: undefined,
          canonical_url: `${baseUrl}/whats-on`,
          tags: event.category ? [event.category] : undefined,
          status: "published",
          published_at: toIsoString(event.date),
          updated_at: toIsoString(event.updatedAt),
        })),
        ...businesses.map((business) => ({
          id: `business-${business.id}`,
          type: "business",
          title: business.name,
          summary: business.description || undefined,
          image_url: business.imageUrl || undefined,
          canonical_url: `${baseUrl}/local-enterprises`,
          tags: business.category ? [business.category] : undefined,
          status: "published",
          published_at: toIsoString(business.createdAt),
          updated_at: toIsoString(business.updatedAt),
        })),
      ];

      return res.json({ items });
    } catch (error) {
      console.error("[Registry] Failed to build feed:", error);
      return res.status(500).json({ error: "Failed to build registry feed." });
    }
  });
  // Image generation API
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt, aspectRatio, preset, save } = req.body;
      if (!prompt) return res.status(400).json({ error: "prompt is required" });
      const result = await generateImage({ prompt, aspectRatio, preset, save });
      return res.json(result);
    } catch (error) {
      console.error("[Gemini] generate-image error:", error);
      return res.status(500).json({ error: "Image generation failed" });
    }
  });

  app.post("/api/generate-sketch", async (req, res) => {
    try {
      const { type, seed, theme } = req.body;
      if (!type) return res.status(400).json({ error: "type is required" });
      const result = await generateSketch({ type, seed, theme });
      return res.json(result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("[Gemini] generate-sketch error:", msg);
      return res.status(500).json({ error: msg });
    }
  });

  // ── GHL OAuth2 flow ──────────────────────────────────────────
  // Step 1: Visit /api/social-auth/start to begin authorization
  // Step 2: GHL redirects back to /api/social-auth/callback with code
  // Step 3: We exchange the code for access + refresh tokens and store them
  app.get("/api/social-auth/start", (_req, res) => {
    const clientId = process.env.GHL_OAUTH_CLIENT_ID;
    if (!clientId) {
      return res.status(500).send("GHL_OAUTH_CLIENT_ID not set in .env.local");
    }
    // GHL OAuth requires redirect_uri to exactly match the registered value
    const redirectUri = process.env.GHL_REDIRECT_URI
      || (process.env.NODE_ENV === "production"
        ? `https://theharvestwitta.com.au/api/social-auth/callback`
        : `http://localhost:3000/api/social-auth/callback`);
    const scopes = [
      "socialplanner/oauth.readonly",
      "socialplanner/oauth.write",
      "socialplanner/post.readonly",
      "socialplanner/post.write",
      "socialplanner/account.readonly",
      "socialplanner/account.write",
      "socialplanner/csv.readonly",
      "socialplanner/csv.write",
      "socialplanner/category.readonly",
      "socialplanner/tag.readonly",
      "socialplanner/statistics.readonly",
    ].join(" ");
    const versionId = clientId.split("-").slice(0, -1).join("-"); // 699964a6c5d1fa2bdfc3c187
    const url = `https://marketplace.leadconnectorhq.com/oauth/chooselocation?response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&version_id=${versionId}`;
    res.redirect(url);
  });

  app.get("/api/social-auth/callback", async (req, res) => {
    const { code } = req.query;
    if (!code || typeof code !== "string") {
      return res.status(400).send("Missing authorization code");
    }
    const clientId = process.env.GHL_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GHL_OAUTH_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.status(500).send("GHL OAuth credentials not configured");
    }
    try {
      const response = await fetch("https://services.leadconnectorhq.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code,
          user_type: "Location",
          redirect_uri: process.env.GHL_REDIRECT_URI
              || (process.env.NODE_ENV === "production"
                ? `https://theharvestwitta.com.au/api/social-auth/callback`
                : `http://localhost:3000/api/social-auth/callback`),
        }),
      });
      const data = await response.json() as Record<string, unknown>;
      if (!response.ok) {
        console.error("GHL OAuth token error:", data);
        return res.status(400).json({ error: "Token exchange failed", details: data });
      }
      // Store tokens using shared persistence function
      persistTokens({
        access_token: data.access_token as string,
        refresh_token: data.refresh_token as string,
        expires_in: data.expires_in as number,
        location_id: data.locationId as string,
        user_id: (data.userId as string) || undefined,
      });
      res.send(`
        <html><body style="font-family:sans-serif;text-align:center;padding:60px">
          <h1>GHL Connected!</h1>
          <p>Social Planner access token saved. You can close this tab.</p>
          <p style="color:#666;font-size:14px">Token expires in ~24 hours. Refresh token saved for renewal.</p>
          <p><a href="/social-tile-mockups.html">Back to Social Tile Planner</a></p>
        </body></html>
      `);
    } catch (err) {
      console.error("GHL OAuth callback error:", err);
      res.status(500).send("OAuth callback failed");
    }
  });

  // Token refresh endpoint (call periodically or on 401)
  app.post("/api/social-auth/refresh", async (_req, res) => {
    try {
      const result = await refreshGHLToken();
      res.json({ success: true, expires_in: result.expires_in });
    } catch (err) {
      console.error("GHL OAuth refresh error:", err);
      res.status(500).json({ error: err instanceof Error ? err.message : "Refresh failed" });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // Serve research data as static files
  app.use("/research/data", express.static(
    path.resolve(import.meta.dirname, "../..", "research", "data")
  ));

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
