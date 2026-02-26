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

// Tag mappings for each submission type
const TYPE_TAGS: Record<string, string[]> = {
  idea: ["community-idea", "harvest-website"],
  residency: ["residency-applicant", "harvest-website"],
  "business-interest": ["business-interest", "harvest-website"],
  "workshop-suggestion": ["workshop-suggestion", "harvest-website"],
  "story-feature": ["story-feature", "harvest-website"],
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const apiKey = Deno.env.get("GHL_API_KEY") ?? Deno.env.get("GHL_TOKEN");
  const locationId = Deno.env.get("GHL_LOCATION_ID");
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!apiKey || !locationId) {
    return jsonResponse({ success: false, error: "Service not configured." }, 500);
  }

  const payload = await req.json();
  const { type, email, name, ...fields } = payload;

  if (!type || !email) {
    return jsonResponse({ success: false, error: "Type and email are required." }, 400);
  }

  const tags = TYPE_TAGS[type] ?? ["harvest-website"];
  if (fields.residencyType) tags.push(`residency-${fields.residencyType}`);
  if (fields.ideaType) tags.push(`idea-${fields.ideaType}`);
  if (fields.interestType) tags.push(`biz-${fields.interestType}`);

  // Parse name
  const nameParts = (name || "").trim().split(" ");
  const firstName = nameParts[0] || undefined;
  const lastName = nameParts.slice(1).join(" ") || undefined;

  // 1. Upsert contact in GHL
  let ghlContactId: string | null = null;
  try {
    const ghlRes = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        Version: GHL_API_VERSION,
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        phone: fields.phone ?? undefined,
        locationId,
        source: `Website - ${type}`,
        tags,
      }),
    });
    if (ghlRes.ok) {
      const ghlData = await ghlRes.json();
      ghlContactId = ghlData?.contact?.id ?? null;
    }
  } catch {
    // GHL failure shouldn't block the submission
  }

  // 2. Add a note to the GHL contact
  if (ghlContactId) {
    const noteLines = [`**${type.toUpperCase()} submission from website**`];
    if (fields.title) noteLines.push(`**Title:** ${fields.title}`);
    if (fields.description) noteLines.push(`**Description:** ${fields.description}`);
    if (fields.message) noteLines.push(`**Message:** ${fields.message}`);
    if (fields.businessName) noteLines.push(`**Business:** ${fields.businessName}`);
    if (fields.portfolioUrl) noteLines.push(`**Portfolio:** ${fields.portfolioUrl}`);
    if (fields.durationWeeks) noteLines.push(`**Duration:** ${fields.durationWeeks} weeks`);

    try {
      await fetch(`${GHL_API_BASE}/contacts/${ghlContactId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
          Version: GHL_API_VERSION,
        },
        body: JSON.stringify({ body: noteLines.join("\n\n") }),
      });
    } catch {
      // Non-critical
    }
  }

  // 3. Store in Supabase
  if (supabaseUrl && supabaseKey) {
    try {
      const table =
        type === "idea" || type === "workshop-suggestion"
          ? "community_ideas"
          : type === "residency"
          ? "residency_applications"
          : type === "business-interest"
          ? "business_interest"
          : null;

      if (table) {
        let row: Record<string, unknown> = {};

        if (table === "community_ideas") {
          row = {
            name,
            email,
            idea_type: fields.ideaType ?? (type === "workshop-suggestion" ? "workshop" : "general"),
            title: fields.title ?? `${type} submission`,
            description: fields.description ?? fields.message ?? "",
            ghl_contact_id: ghlContactId,
          };
        } else if (table === "residency_applications") {
          row = {
            applicant_name: name,
            email,
            phone: fields.phone,
            location: fields.location,
            residency_type: fields.residencyType ?? "other",
            title: fields.title ?? "Residency application",
            description: fields.description ?? "",
            portfolio_url: fields.portfolioUrl,
            duration_weeks: fields.durationWeeks ? parseInt(fields.durationWeeks) : null,
            preferred_dates: fields.preferredDates,
            ghl_contact_id: ghlContactId,
          };
        } else if (table === "business_interest") {
          row = {
            business_name: fields.businessName ?? name,
            contact_name: name,
            email,
            phone: fields.phone,
            interest_type: fields.interestType ?? "expression-of-interest",
            message: fields.message,
            ghl_contact_id: ghlContactId,
          };
        }

        await fetch(`${supabaseUrl}/rest/v1/${table}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify(row),
        });
      }
    } catch {
      // DB failure shouldn't block response
    }
  }

  // Trigger GHL workflow for community submission
  const workflowId = Deno.env.get("GHL_COMMUNITY_SUBMIT_WORKFLOW_ID");
  if (workflowId && ghlContactId) {
    try {
      await fetch(`${GHL_API_BASE}/workflows/${workflowId}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "Version": GHL_API_VERSION,
        },
        body: JSON.stringify({ contactId: ghlContactId }),
      });
    } catch {
      // Workflow failure shouldn't block the response
    }
  }

  return jsonResponse({ success: true, contactId: ghlContactId });
});
