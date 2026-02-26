import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { appRouter } from "../../server/routers.js";
import type { User } from "../../drizzle/schema.js";
import { getSupabaseUser } from "../../server/_core/supabaseAuth.js";
import * as db from "../../server/db.js";
import { ENV } from "../../server/_core/env.js";

type VercelContext = {
  user: User | null;
};

function getBearerToken(authorization: string | undefined): string | null {
  if (!authorization) return null;
  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

const handler = createHTTPHandler({
  router: appRouter,
  createContext: async ({ req }): Promise<VercelContext> => {
    let user: User | null = null;

    try {
      const token = getBearerToken(req.headers.authorization as string | undefined);
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
  },
});

export default async function vercelHandler(req: VercelRequest, res: VercelResponse) {
  // Strip the /api/trpc prefix so tRPC sees just the procedure path
  req.url = req.url?.replace(/^\/api\/trpc/, "") || "/";
  return handler(req, res);
}
