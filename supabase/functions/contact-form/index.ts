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
      error: "Contact service is not configured.",
    }, 500);
  }

  const payload = await req.json();
  const { name, email, subject, message, subscribe } = payload;

  if (!email || !message) {
    return jsonResponse({ success: false, error: "Email and message are required" }, 400);
  }

  // Parse name into first/last
  const nameParts = (name || "").trim().split(" ");
  const firstName = nameParts[0] || undefined;
  const lastName = nameParts.slice(1).join(" ") || undefined;

  // Create/update contact in GHL
  const contactResponse = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "Version": GHL_API_VERSION,
    },
    body: JSON.stringify({
      email,
      firstName,
      lastName,
      locationId,
      source: "Website Contact Form",
      tags: ["contact-form", "website-inquiry", ...(subscribe ? ["newsletter"] : [])],
    }),
  });

  if (!contactResponse.ok) {
    let errorMessage = "Failed to process contact. Please try again.";
    try {
      const errorData = await contactResponse.json();
      errorMessage = errorData?.message ?? errorMessage;
    } catch {
      // ignore
    }
    return jsonResponse({ success: false, error: errorMessage }, contactResponse.status);
  }

  const contactData = await contactResponse.json();
  const contactId = contactData?.contact?.id;

  // Add a note to the contact with the message
  if (contactId) {
    await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "Version": GHL_API_VERSION,
      },
      body: JSON.stringify({
        body: `**Website Contact Form**\n\n**Subject:** ${subject || "No subject"}\n\n**Message:**\n${message}`,
      }),
    });
  }

  return jsonResponse({ success: true, contactId });
});
