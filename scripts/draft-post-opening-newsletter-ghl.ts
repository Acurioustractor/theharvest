import dotenv from "dotenv";
import { createGHLEmailTemplate } from "../server/gohighlevel.js";
import { LOGO_URL } from "./harvest-brand.js";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

const MEMBERSHIP_URL = "https://www.theharvestwitta.com.au/membership";
const SHOP_URL = "https://www.theharvestwitta.com.au/shop";
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const subject = "The gate is open";
const preheader = "The Harvest opened on 20 June. Here is what you can do there now, and what comes next.";

const headings = new Set(["What you can do there now", "What comes next"]);

const bodyParagraphs = [
  "The gate opened on Saturday 20 June.",
  "Thank you to everyone who was part of the first day.",
  "The old nursery is still not arriving finished. That is still the point.",
  "From the first of July, The Harvest is properly under way.",
  "What you can do there now",
  "You do not need to book to come and have a look while we find our feet.",
  "If you want to be part of it, three doors are open.",
  "Join the members page. Upcoming events land there first, you can RSVP there, and you can message us directly.",
  "Come to a work day. The garden grows through regular work days, and an extra pair of hands changes what a day can do. Reply to this email and we will tell you when the next one is.",
  "Put your hand up for the shop. The first shelves are being shaped with local makers and growers. If you make or grow something, tell us and we will have a proper conversation.",
  "What comes next",
  "Small first moves, in the open: more work days, the first shelves in the shop, the art space finding its shape, more shared meals.",
  "Members hear first, every time. When the next date lands, it lands on the members page before anywhere else.",
  "Susie and Joey are stewarding the place day to day. Say hello when you visit.",
  "Questions? Reply to this email. We read everything, and replies can take a few days while we find our feet.",
  "The Harvest is a community garden and creative gathering place in Witta, on Jinibara Country.",
  "It becomes real as people walk through it and make it with us.",
];

const paragraphHtml = bodyParagraphs
  .map((paragraph) => {
    const tag = headings.has(paragraph) ? "h2" : "p";
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
                <h1 style="margin:0;color:#1C1917;font-family:Montserrat,Arial,sans-serif;font-size:34px;line-height:1.05;letter-spacing:0;font-weight:800;">The gate is open.</h1>
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
                <a href="${MEMBERSHIP_URL}" style="display:inline-block;background:#C4922A;color:#1C1917;text-decoration:none;font-weight:800;font-size:17px;line-height:1;padding:16px 22px;border:2px solid #1C1917;margin:0 12px 12px 0;">Become a member</a>
                <a href="${SHOP_URL}" style="display:inline-block;background:#FFFDF8;color:#1C1917;text-decoration:none;font-weight:800;font-size:17px;line-height:1;padding:16px 22px;border:2px solid #1C1917;margin:0 0 12px 0;">The shop</a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 30px 28px;">
                <p style="margin:0;font-size:17px;line-height:1.5;">9 Gumland Drive, Witta</p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 28px;background:#1C1917;color:#F5F0E8;">
                <p style="margin:0;color:#F5F0E8;font-size:16px;line-height:1.5;">The Harvest is a community garden and creative gathering place in Witta, on Jinibara Country.</p>
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
    name: "Harvest Note 04 - The gate is open",
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
        cta: [MEMBERSHIP_URL, SHOP_URL],
      },
      html,
      next: "Run `npx tsx scripts/draft-post-opening-newsletter-ghl.ts --apply` to create the GHL email template.",
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
      cta: [MEMBERSHIP_URL, SHOP_URL],
    },
    result,
    note: "This creates an email template only. It does not choose an audience, send, or schedule a campaign.",
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
