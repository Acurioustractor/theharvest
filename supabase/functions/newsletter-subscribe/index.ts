const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async req => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const apiKey = Deno.env.get("GHL_API_KEY") ?? Deno.env.get("GHL_TOKEN");
  const locationId = Deno.env.get("GHL_LOCATION_ID");
  if (!apiKey || !locationId) {
    return jsonResponse({
      success: false,
      error: "Newsletter service is not configured.",
    }, 500);
  }

  const payload = await req.json();
  const email = payload?.email;
  if (!email) return jsonResponse({ success: false, error: "Email is required" }, 400);

  const tags = Array.isArray(payload?.interests)
    ? ["newsletter", "harvest-website", ...payload.interests.map((i: string) => `interest-${i}`)]
    : ["newsletter", "harvest-website"];

  const response = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "Version": GHL_API_VERSION,
    },
    body: JSON.stringify({
      email,
      firstName: payload?.firstName ?? undefined,
      lastName: payload?.lastName ?? undefined,
      phone: payload?.phone ?? undefined,
      locationId,
      source: payload?.source ?? "The Harvest Website",
      tags,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to subscribe. Please try again.";
    try {
      const errorData = await response.json();
      errorMessage = errorData?.message ?? errorMessage;
    } catch {
      // ignore
    }
    return jsonResponse({ success: false, error: errorMessage }, response.status);
  }

  const data = await response.json();
  const contactId = data?.contact?.id ?? null;

  // Trigger GHL workflow for newsletter welcome
  const workflowId = Deno.env.get("GHL_NEWSLETTER_WORKFLOW_ID");
  if (workflowId && contactId) {
    try {
      await fetch(`${GHL_API_BASE}/workflows/${workflowId}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "Version": GHL_API_VERSION,
        },
        body: JSON.stringify({ contactId }),
      });
    } catch {
      // Workflow failure shouldn't block the response
    }
  }

  return jsonResponse({ success: true, contactId });
});
