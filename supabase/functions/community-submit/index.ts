const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";
const DEFAULT_HARVEST_INBOX_PIPELINE_ID = "ggQw10DuH0XRji6keimS";
const DEFAULT_HARVEST_INBOX_NEW_STAGE_ID = "2eded979-7439-407d-89b6-762499b56658";

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

async function upsertHarvestInboxOpportunity(input: {
  apiKey: string;
  locationId: string;
  contactId: string;
  name: string;
  source: string;
}) {
  const pipelineId = Deno.env.get("GHL_HARVEST_INBOX_PIPELINE_ID") || DEFAULT_HARVEST_INBOX_PIPELINE_ID;
  const pipelineStageId = Deno.env.get("GHL_HARVEST_INBOX_NEW_STAGE_ID") || DEFAULT_HARVEST_INBOX_NEW_STAGE_ID;

  await fetch(`${GHL_API_BASE}/opportunities/upsert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${input.apiKey}`,
      Version: GHL_API_VERSION,
    },
    body: JSON.stringify({
      pipelineId,
      locationId: input.locationId,
      contactId: input.contactId,
      name: input.name,
      status: "open",
      pipelineStageId,
      monetaryValue: 0,
      source: input.source,
    }),
  });
}

// Tag mappings for each submission type — canonical ACT GHL namespaces only
// (role:/interest:/source:/place:/lane:). The flat aliases this function used to mint
// (community-idea, residency-applicant, business-interest, workshop-suggestion,
// story-feature, venue-enquiry, residency-*/idea-*/biz-*) are dropped.
const TYPE_TAGS: Record<string, string[]> = {
  volunteer: ["role:volunteer", "interest:volunteer"],
  idea: ["interest:community"],
  residency: ["role:resident", "interest:community"],
  "business-interest": ["role:supplier", "interest:markets"],
  "workshop-suggestion": ["interest:workshops"],
  "story-feature": ["role:storyteller", "interest:community"],
  "venue-enquiry": ["interest:venue"],
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

  if (!type || !email || !name) {
    return jsonResponse({ success: false, error: "Type, name and email are required." }, 400);
  }

  // OCAP guard: every community-line submission is stamped lane:community so these
  // contacts can NEVER be auto-enrolled in comms drips. project:act-hv stamps Harvest
  // scope at this chokepoint. NO comms: tag is granted here — community-line is tend-only.
  const tags = [
    "project:act-hv",
    "lane:community",
    ...(TYPE_TAGS[type] ?? []),
    "harvest-website",
    "harvest-inbox",
  ];
  if (fields.helpType) tags.push(`pod:${String(fields.helpType).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`);
  if (fields.sourceCampaign) tags.push(`source:campaign:${String(fields.sourceCampaign).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`);
  if (fields.sourceContent) tags.push(`source:content:${String(fields.sourceContent).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`);

  // Parse name
  const nameParts = String(name).trim().split(/\s+/).filter(Boolean);
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
        source: `Harvest | ${type}`,
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
    try {
      await fetch(`${GHL_API_BASE}/contacts/${ghlContactId}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
          Version: GHL_API_VERSION,
        },
        body: JSON.stringify({ tags }),
      });
    } catch {
      // Non-critical
    }

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

    try {
      await upsertHarvestInboxOpportunity({
        apiKey,
        locationId,
        contactId: ghlContactId,
        name: `${String(name).trim()} - ${type}`,
        source: `Harvest | ${type}`,
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
      await fetch(`${GHL_API_BASE}/contacts/${ghlContactId}/workflow/${workflowId}`, {
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

  return jsonResponse({ success: true, contactId: ghlContactId });
});
