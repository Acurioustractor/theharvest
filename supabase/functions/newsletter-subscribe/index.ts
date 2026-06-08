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

// Canonical ACT interest namespaces (mirrors NEWSLETTER_INTEREST_TAGS in server/routers.ts).
const INTEREST_TAGS: Record<string, string> = {
  events: "interest:events",
  workshops: "interest:workshops",
  markets: "interest:markets",
  "venue-hire": "interest:venue",
  "garden-centre": "interest:garden",
  "food-kitchen": "interest:food",
  community: "interest:community",
  volunteering: "interest:volunteer",
  membership: "interest:membership",
  sustainability: "interest:sustainability",
};

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ") || undefined,
  };
}

// Build the canonical tag set (mirrors server/routers.ts buildNewsletterTags).
// project:act-hv stamps Harvest scope; interest:* canonical; membership is a tier: rung
// (no role:member, no flat harvest-member); non-members get tier:connected.
// CONSENT GATE: the comms:harvest-newsletter channel tag is granted ONLY when the caller
// passes explicit consent — it is NOT added here. See buildBaseTags / the handler below.
function buildBaseTags(payload: Record<string, unknown>) {
  const interests = Array.isArray(payload?.interests) ? payload.interests.map(String) : [];
  const tags = new Set(["project:act-hv", "harvest-website"]);

  for (const interest of interests) {
    const tag = INTEREST_TAGS[interest];
    if (tag) tags.add(tag);
  }

  if (payload?.member === true || interests.includes("membership")) {
    tags.add("tier:member");
    tags.add("interest:membership");
  } else {
    tags.add("tier:connected");
  }

  return Array.from(tags);
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
  const email = String(payload?.email ?? "").trim();
  if (!email) return jsonResponse({ success: false, error: "Email is required" }, 400);

  const fullName = String(payload?.name ?? [payload?.firstName, payload?.lastName].filter(Boolean).join(" ")).trim();
  if (!fullName) return jsonResponse({ success: false, error: "Name is required" }, 400);

  const { firstName, lastName } = splitName(fullName);

  // CONSENT GATE (Spam Act 2003). Grant comms:harvest-newsletter ONLY when the caller
  // sends explicit consent: newsletter_consent === "Yes" (string, canonical) or === true.
  // Fail safe: any other value (missing, "No", undefined) => create the contact as a lead
  // WITHOUT the comms tag. Never grant a comms channel we are not sure was opted into.
  const consentRaw = payload?.newsletter_consent ?? payload?.newsletterConsent;
  const newsletterConsent =
    consentRaw === true ||
    (typeof consentRaw === "string" && consentRaw.trim().toLowerCase() === "yes");

  const tags = buildBaseTags(payload);
  if (newsletterConsent) tags.push("comms:harvest-newsletter");

  // Stamp newsletter_consent=Yes on the contact record so the consent trail is durable.
  const contactBody: Record<string, unknown> = {
    email,
    firstName,
    lastName,
    phone: payload?.phone ?? undefined,
    locationId,
    source: payload?.source ?? "Harvest | Newsletter",
  };
  if (newsletterConsent) {
    contactBody.customFields = [{ key: "newsletter_consent", field_value: "Yes" }];
  }

  const response = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "Version": GHL_API_VERSION,
    },
    body: JSON.stringify(contactBody),
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

  if (contactId) {
    try {
      await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "Version": GHL_API_VERSION,
        },
        body: JSON.stringify({ tags }),
      });
    } catch {
      // Tag failure should not block the signup.
    }
  }

  // Trigger GHL workflow for newsletter welcome
  const isMember = tags.includes("tier:member");
  const workflowId = isMember
    ? Deno.env.get("GHL_MEMBER_WELCOME_WORKFLOW_ID") ?? Deno.env.get("GHL_NEWSLETTER_WORKFLOW_ID")
    : Deno.env.get("GHL_NEWSLETTER_WORKFLOW_ID");
  if (workflowId && contactId) {
    try {
      await fetch(`${GHL_API_BASE}/contacts/${contactId}/workflow/${workflowId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "Version": GHL_API_VERSION,
        },
      });
    } catch {
      // Workflow failure shouldn't block the response
    }
  }

  return jsonResponse({ success: true, contactId });
});
