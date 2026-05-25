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
      "Accept": "application/json",
      "Authorization": `Bearer ${input.apiKey}`,
      "Version": GHL_API_VERSION,
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

  if (!name || !email || !message) {
    return jsonResponse({ success: false, error: "Name, email and message are required" }, 400);
  }

  // Parse name into first/last
  const nameParts = String(name).trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || undefined;
  const lastName = nameParts.slice(1).join(" ") || undefined;
  const tags = [
    "contact-form",
    "harvest-website",
    "harvest-inbox",
    ...(subscribe ? ["newsletter", "harvest-newsletter"] : []),
  ];

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
      source: "Harvest | Contact",
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
      // Tag failure shouldn't block the message.
    }

    // Add a note to the contact with the message
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

    try {
      await upsertHarvestInboxOpportunity({
        apiKey,
        locationId,
        contactId,
        name: `${String(name).trim()} - Contact form`,
        source: "Harvest | Contact",
      });
    } catch (error) {
      console.error("GHL contact opportunity upsert failed:", error);
    }
  }

  // Trigger GHL workflow for contact form auto-reply. The message should still
  // be saved if GHL workflow enrolment has a temporary issue.
  let workflowTriggered = false;
  let workflowError: string | undefined;
  const workflowId = Deno.env.get("GHL_CONTACT_FORM_WORKFLOW_ID");
  if (workflowId && contactId) {
    try {
      const workflowResponse = await fetch(`${GHL_API_BASE}/contacts/${contactId}/workflow/${workflowId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "Version": GHL_API_VERSION,
        },
      });

      if (workflowResponse.ok) {
        workflowTriggered = true;
      } else {
        const errorText = await workflowResponse.text();
        workflowError = `Workflow trigger failed with status ${workflowResponse.status}`;
        console.error("GHL contact workflow trigger failed:", workflowResponse.status, errorText);
      }
    } catch (error) {
      workflowError = error instanceof Error ? error.message : "Workflow trigger failed";
      console.error("GHL contact workflow trigger failed:", error);
    }
  } else if (!workflowId) {
    workflowError = "GHL_CONTACT_FORM_WORKFLOW_ID is not configured";
    console.error(workflowError);
  }

  return jsonResponse({
    success: true,
    contactId,
    workflowTriggered,
    ...(workflowError ? { workflowError } : {}),
  });
});
