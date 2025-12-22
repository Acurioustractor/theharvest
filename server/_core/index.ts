import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getApprovedBusinesses, getApprovedEvents } from "../db";

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
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
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
