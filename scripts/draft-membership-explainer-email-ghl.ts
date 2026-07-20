import { writeFileSync } from "node:fs";
import dotenv from "dotenv";
import { createGHLEmailTemplate } from "../server/gohighlevel.js";
import { LOGO_URL } from "./harvest-brand.js";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

// A reusable "Membership, made simple" explainer email.
// Audience guidance: the newsletter list (comms:harvest-newsletter) from the week of
// 20 June onward, OR the member list as a plain-language refresher. Do NOT slot this
// into the pre-launch June cadence (it is locked) and remember public membership stays
// one sentence until after the 20 June open day.
//
// ALREADY CREATED in GHL on 2026-06-13: template id 6a2cce21cecb6468c1a1a13b.
// Do NOT run --apply again (it would create a duplicate). To push edits to the existing
// template, run: npx tsx scripts/draft-membership-explainer-email-ghl.ts --update-template 6a2cce21cecb6468c1a1a13b --apply
const JOIN_URL = "https://www.theharvestwitta.com.au/membership";
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const subject = "Membership, made simple";
const preheader = "Free to join. You hear first, and you help shape what The Harvest becomes.";

type Block = { tag: "p" | "h2"; text: string };

const beforeCta: Block[] = [
  { tag: "p", text: "Membership at The Harvest is free. It is not a fee and not a discount card." },
  { tag: "p", text: "Being a member means three simple things. You hear about what is on before anyone else. You find the next useful thing to be part of. And you get a say in how this place grows." },
  { tag: "p", text: "Some people come for the garden. Some make for the shop. Some come for the workshops. All of them are members, and all of them help shape what happens next." },
  { tag: "h2", text: "How to be part of it" },
  { tag: "p", text: "The best way in is to show up. Come to a work day. Make something for the shop. Bring a friend along to something that is on. Share a post so more people in the hills find us." },
];

const afterCta: Block[] = [
  { tag: "p", text: "Or reply and tell us what you are into. One word is plenty: garden, shop, or workshop." },
  { tag: "p", text: "The Harvest is a community garden and creative gathering place taking shape in Witta, on Jinibara Country." },
];

function renderBlocks(blocks: Block[]) {
  return blocks.map(({ tag, text }) => `<${tag}>${text}</${tag}>`).join("\n");
}

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background:#F5F0E8;color:#1C1917;font-family:Inter,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;color:transparent;opacity:0;">${preheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F5F0E8;margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:28px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#FFFDF8;border:1px solid #D8CDBE;">
            <tr>
              <td style="padding:28px 28px 14px 28px;border-top:8px solid #C4922A;">
                <img src="${LOGO_URL}" alt="The Harvest" width="200" style="display:block;width:200px;max-width:72%;height:auto;margin:0 0 24px 0;">
                <p style="margin:0 0 8px 0;color:#4A6741;font-size:13px;line-height:1.4;text-transform:uppercase;letter-spacing:1.4px;font-weight:700;">Membership · Witta · Jinibara Country</p>
                <h1 style="margin:0;color:#1C1917;font-family:Montserrat,Arial,sans-serif;font-size:34px;line-height:1.05;letter-spacing:0;font-weight:800;">Membership, made simple.</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:4px 28px 4px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:12px 10px;background:#4A6741;color:#FFFDF8;font-size:13px;font-weight:700;text-align:center;">Grow</td>
                    <td style="padding:12px 10px;background:#B58B70;color:#1C1917;font-size:13px;font-weight:700;text-align:center;">Make</td>
                    <td style="padding:12px 10px;background:#3B5563;color:#FFFDF8;font-size:13px;font-weight:700;text-align:center;">Gather</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 0 28px;font-size:18px;line-height:1.62;">
                <style>
                  h2 { margin: 24px 0 8px 0; color: #1C1917; font-family: Montserrat, Arial, sans-serif; font-size: 24px; line-height: 1.18; letter-spacing: 0; }
                  p { margin: 0 0 18px 0; color: #1C1917; font-size: 18px; line-height: 1.62; }
                  a { color: #1C1917; }
                </style>
                ${renderBlocks(beforeCta)}
              </td>
            </tr>
            <tr>
              <td align="left" style="padding:8px 28px 10px 28px;">
                <a href="${JOIN_URL}" style="display:inline-block;background:#C4922A;color:#1C1917;text-decoration:none;font-weight:800;font-size:17px;line-height:1;padding:16px 22px;border:2px solid #1C1917;">Join the member list</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 0 28px;font-size:18px;line-height:1.62;">
                ${renderBlocks(afterCta)}
              </td>
            </tr>
            <tr>
              <td style="padding:22px 28px;background:#1C1917;color:#F5F0E8;">
                <p style="margin:0 0 10px 0;color:#F5F0E8;font-size:16px;line-height:1.5;">Whatever you turn up for, you are a member.</p>
                <p style="margin:0;color:#F5F0E8;font-size:16px;line-height:1.5;">Free to join, and the first word on what is happening here.</p>
              </td>
            </tr>
          </table>
          <p style="margin:14px 0 0 0;max-width:640px;color:#8A7E6E;font-size:13px;line-height:1.5;">You are getting this because you are part of The Harvest at Witta.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

function argValue(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

async function updateGhlTemplateData(templateId: string) {
  const response = await fetch(`${GHL_API_BASE}/emails/builder/data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${requireEnv("GHL_API_KEY")}`,
      "Version": GHL_API_VERSION,
    },
    body: JSON.stringify({
      locationId: requireEnv("GHL_LOCATION_ID"),
      templateId,
      updatedBy: "api",
      editorType: "html",
      html,
    }),
  });

  const data = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) {
    throw new Error(`GHL template data update failed ${response.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const updateTemplateId = argValue("--update-template");
  const writeHtmlPath = argValue("--write-html");
  const printRequest = process.argv.includes("--print-request");
  const template = {
    name: "Harvest membership explainer - made simple - 2026-06-13",
    subject,
    preheader,
    html,
  };

  if (printRequest) {
    // DRY-RUN of --apply: intercept fetch, print the exact request, make NO network call.
    const originalFetch = globalThis.fetch;
    (globalThis as { fetch: typeof fetch }).fetch = (async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const headers: Record<string, string> = { ...((init.headers as Record<string, string>) || {}) };
      for (const key of Object.keys(headers)) {
        if (key.toLowerCase() === "authorization") headers[key] = "Bearer <GHL_API_KEY redacted>";
      }
      let body: unknown = init.body;
      try { body = JSON.parse(String(init.body)); } catch { /* leave raw */ }
      if (body && typeof body === "object") {
        const b = body as Record<string, unknown>;
        if (typeof b.locationId === "string") b.locationId = "<GHL_LOCATION_ID redacted>";
        const td = b.templateData as Record<string, unknown> | undefined;
        if (td && typeof td.html === "string") {
          td.html = `<${td.html.length} bytes of HTML, see docs/communications/membership-explainer-email-2026-06-13.html>`;
        }
      }
      console.log(JSON.stringify({
        note: "DRY-RUN of --apply. This is the exact request createGHLEmailTemplate would send. No network call was made.",
        method: init.method,
        url: String(input),
        headers,
        body,
      }, null, 2));
      (globalThis as { fetch: typeof fetch }).fetch = originalFetch;
      return new Response(JSON.stringify({ dryRun: true }), { status: 200, headers: { "Content-Type": "application/json" } });
    }) as typeof fetch;
    try {
      await createGHLEmailTemplate(template);
    } catch {
      // request already printed; ignore any post-print parsing error
    }
    return;
  }

  if (writeHtmlPath) {
    writeFileSync(writeHtmlPath, html, "utf8");
    console.log(`Wrote HTML to ${writeHtmlPath}`);
    if (!apply) return;
  }

  if (!apply) {
    console.log(JSON.stringify({
      mode: "dry-run",
      template: {
        name: template.name,
        subject: template.subject,
        preheader: template.preheader,
        cta: JOIN_URL,
        audience: "comms:harvest-newsletter from the week of 20 June onward, OR the member list as a refresher. NOT a pre-launch send (June cadence is locked). Never All.",
      },
      next: "Run `npx tsx scripts/draft-membership-explainer-email-ghl.ts --apply` to create the GHL email template.",
    }, null, 2));
    return;
  }

  const result = updateTemplateId
    ? { success: true, templateId: updateTemplateId, update: await updateGhlTemplateData(updateTemplateId) }
    : await createGHLEmailTemplate(template);
  console.log(JSON.stringify({
    mode: "apply",
    template: {
      name: template.name,
      subject: template.subject,
      preheader: template.preheader,
      cta: JOIN_URL,
    },
    result,
    note: "This creates an email template only. It does not choose an audience, send, or schedule a campaign.",
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
