// dotenv not needed on Vercel — env vars are injected natively
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers.js";
import type { User } from "../../drizzle/schema.js";
import { getSupabaseUser } from "../../server/_core/supabaseAuth.js";
import * as db from "../../server/db.js";
import { ENV } from "../../server/_core/env.js";

export const config = {
  runtime: "nodejs",
};

type VercelContext = {
  user: User | null;
};

function getBearerToken(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

async function createVercelContext(req: Request): Promise<VercelContext> {
  let user: User | null = null;

  try {
    const token = getBearerToken(req);
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
    user = null;
  }

  return { user };
}

export default async function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createVercelContext(req),
  });
}
