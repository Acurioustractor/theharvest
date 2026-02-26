export const config = { runtime: "nodejs" };

export default async function handler(req: Request) {
  return new Response(JSON.stringify({ ok: true, time: Date.now() }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
