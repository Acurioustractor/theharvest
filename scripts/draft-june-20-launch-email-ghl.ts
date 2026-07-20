import dotenv from "dotenv";
import { createGHLEmailTemplate } from "../server/gohighlevel.js";
import { LOGO_URL } from "./harvest-brand.js";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

const RSVP_URL = "https://www.theharvestwitta.com.au/june-20#rsvp";
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const subject = "After the Witta Market, the gate opens";
const preheader = "Turn up after the market, help make the first version, then make and eat pizza together.";

const bodyParagraphs = [
  "The gate opens on Saturday 20 June.",
  "Witta Market runs in the morning. After it packs down, come up the road to The Harvest.",
  "The old nursery is not arriving finished. That is the point.",
  "From 1pm, we will open the gate for a working afternoon.",
  "People will turn up and do a few things together.",
  "We will walk the garden, put thoughts on the question wall, and make or fix a few small things that help the place become easier to use.",
  "Nothing grand. Just useful first moves.",
  "Then we will make pizzas together.",
  "Roll, top, cook, eat. Sit down for a bit.",
  "If the garden has something ready, it can go on the table. If not, we keep it simple.",
  "The ticket is free. It just helps us plan the dough and understand what brings people through the gate.",
  "When you put your name down, we will ask one small question:",
  "What brings you through the gate?",
  "Garden, shop, making, pizza, curiosity, kids, a question, a skill, or nothing in particular. All of those are useful.",
  "Before we leave, we will ask one more thing:",
  "What should happen next?",
  "That might be a garden working day, a shelf idea, a workshop, a kids project, a repair job, a question, or someone putting their hand up to help.",
  "After Saturday, we will invite a small first group into the Harvest inside room. It is where garden hands, shop makers, workshop people, and people with practical questions can help shape the next version.",
  "If that sounds like you, reply to this email with one word: garden, shop, workshop, help, or question.",
  "The Harvest is a community garden and creative gathering place taking shape in Witta, on Jinibara Country.",
  "It will only become real if people walk through it and start making it with us.",
];

const paragraphHtml = bodyParagraphs
  .map((paragraph) => {
    const isQuestion = paragraph.endsWith("?") || paragraph === "What should happen next?";
    const tag = isQuestion ? "h2" : "p";
    return `<${tag}>${paragraph}</${tag}>`;
  })
  .join("\n");

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
                <p style="margin:0 0 8px 0;color:#4A6741;font-size:13px;line-height:1.4;text-transform:uppercase;letter-spacing:1.4px;font-weight:700;">Witta · Jinibara Country</p>
                <h1 style="margin:0;color:#1C1917;font-family:Montserrat,Arial,sans-serif;font-size:34px;line-height:1.05;letter-spacing:0;font-weight:800;">After the Witta Market, the gate opens.</h1>
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
                ${paragraphHtml}
              </td>
            </tr>
            <tr>
              <td align="left" style="padding:8px 28px 26px 28px;">
                <a href="${RSVP_URL}" style="display:inline-block;background:#C4922A;color:#1C1917;text-decoration:none;font-weight:800;font-size:17px;line-height:1;padding:16px 22px;border:2px solid #1C1917;">Get a free ticket</a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 30px 28px;">
                <p style="margin:0 0 6px 0;font-size:17px;line-height:1.5;"><strong>Saturday 20 June 2026</strong></p>
                <p style="margin:0 0 6px 0;font-size:17px;line-height:1.5;">From 1pm to late afternoon</p>
                <p style="margin:0 0 6px 0;font-size:17px;line-height:1.5;">9 Gumland Drive, Witta</p>
                <p style="margin:0;font-size:17px;line-height:1.5;">Free ticket</p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 28px;background:#1C1917;color:#F5F0E8;">
                <p style="margin:0 0 10px 0;color:#F5F0E8;font-size:16px;line-height:1.5;">Come after the market.</p>
                <p style="margin:0;color:#F5F0E8;font-size:16px;line-height:1.5;">Bring gloves, a chair, a tool, a story, a question, or nothing at all.</p>
              </td>
            </tr>
          </table>
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
  const template = {
    name: "Harvest Field Note - June 20 gate opens - 2026-06-12",
    subject,
    preheader,
    html,
  };

  if (!apply) {
    console.log(JSON.stringify({
      mode: "dry-run",
      template: {
        name: template.name,
        subject: template.subject,
        preheader: template.preheader,
        cta: RSVP_URL,
      },
      next: "Run `npx tsx scripts/draft-june-20-launch-email-ghl.ts --apply` to create the GHL email template.",
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
      cta: RSVP_URL,
    },
    result,
    note: "This creates an email template only. It does not choose an audience, send, or schedule a campaign.",
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
