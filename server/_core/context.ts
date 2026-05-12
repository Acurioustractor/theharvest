import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getSupabaseUser } from "./supabaseAuth";
import * as db from "../db";
import { ENV } from "./env";

// Context type - req/res optional to support both Express and Vercel serverless
export type TrpcContext = {
  req?: CreateExpressContextOptions["req"];
  res?: CreateExpressContextOptions["res"];
  user: User | null;
};

function getBearerToken(req: CreateExpressContextOptions["req"]) {
  const header = req.headers.authorization;
  if (!header || typeof header !== "string") return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

/**
 * Dev-only synthetic admin user. Returned when:
 *   - NODE_ENV !== "production"
 *   - the request hostname is localhost
 *   - the client sent header `x-dev-admin: true`
 * Mirrors DEV_ADMIN_USER on the client (client/src/_core/hooks/useAuth.ts).
 */
const DEV_ADMIN_USER: User = {
  id: 1,
  openId: "dev-admin-local",
  name: "Dev Admin",
  email: "benjamin@act.place",
  role: "admin",
  loginMethod: "dev",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function isDevAdminRequest(req: CreateExpressContextOptions["req"]): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const header = req.headers["x-dev-admin"];
  if (header !== "true" && header !== "1") return false;
  const host = (req.hostname || req.headers.host || "").toString();
  return host === "localhost" || host.startsWith("localhost:") || host === "127.0.0.1" || host.startsWith("127.0.0.1:");
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // Dev shortcut: localhost + header → synthetic admin. Skipped in production.
  if (isDevAdminRequest(opts.req)) {
    return {
      req: opts.req,
      res: opts.res,
      user: DEV_ADMIN_USER,
    };
  }

  try {
    const token = getBearerToken(opts.req);
    if (token) {
      const supabaseUser = await getSupabaseUser(token);
      if (supabaseUser) {
        await db.upsertUser({
          openId: supabaseUser.id,
          name:
            supabaseUser.user_metadata?.full_name ||
            supabaseUser.user_metadata?.name ||
            null,
          email: supabaseUser.email ?? null,
          loginMethod:
            supabaseUser.app_metadata?.provider ||
            supabaseUser.app_metadata?.providers?.[0] ||
            null,
          lastSignedIn: new Date(),
          role: supabaseUser.id === ENV.ownerOpenId ? "admin" : undefined,
        });
        user = (await db.getUserByOpenId(supabaseUser.id)) ?? null;
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
