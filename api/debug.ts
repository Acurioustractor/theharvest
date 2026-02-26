export const config = { runtime: "nodejs" };

export default async function handler(req: Request) {
  const results: string[] = [];

  try {
    results.push("1. Starting imports...");

    const env = await import("../server/_core/env.js");
    results.push(`2. env.ts loaded. databaseUrl=${env.ENV.databaseUrl ? "SET" : "EMPTY"}, supabaseUrl=${env.ENV.supabaseUrl ? "SET" : "EMPTY"}`);

    const schema = await import("../drizzle/schema.js");
    results.push("3. schema.ts loaded OK");

    const supabaseAuth = await import("../server/_core/supabaseAuth.js");
    results.push("4. supabaseAuth.ts loaded OK");

    const db = await import("../server/db.js");
    results.push("5. db.ts loaded OK");

    const trpc = await import("../server/_core/trpc.js");
    results.push("6. trpc.ts loaded OK");

    const systemRouter = await import("../server/_core/systemRouter.js");
    results.push("7. systemRouter.ts loaded OK");

    const ghl = await import("../server/gohighlevel.js");
    results.push("8. gohighlevel.ts loaded OK");

    const el = await import("../server/empathyLedgerClient.js");
    results.push("9. empathyLedgerClient.ts loaded OK");

    const wiki = await import("../server/wiki.js");
    results.push("10. wiki.ts loaded OK");

    const routers = await import("../server/routers.js");
    results.push("11. routers.ts loaded OK - ALL IMPORTS PASSED");

  } catch (error: any) {
    results.push(`ERROR: ${error.stack || error.message}`);
  }

  return new Response(results.join("\n"), {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}
