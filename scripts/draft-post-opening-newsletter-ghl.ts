import dotenv from "dotenv";
import { writeFileSync } from "node:fs";
import { createGHLEmailTemplate } from "../server/gohighlevel.js";
import { LOGO_URL, SITE_ORIGIN } from "./harvest-brand.js";
import { MEMBERS_PAGE_URL } from "../client/src/lib/links.js";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

const CAMPAIGN_NAME = "harvest-note-04";

function emailCampaignUrl(url: string) {
  const tracked = new URL(url);
  tracked.searchParams.set("utm_source", "email");
  tracked.searchParams.set("utm_medium", "member-note");
  tracked.searchParams.set("utm_campaign", CAMPAIGN_NAME);
  return tracked.toString();
}

const SITE_URL = emailCampaignUrl(SITE_ORIGIN);
const PULSE_URL = emailCampaignUrl(`${SITE_ORIGIN}/pulse`);
// Door #1 in the comms map. Same shared link as the site, email attribution.
const MEMBERS_PAGE_EMAIL_URL = emailCampaignUrl(MEMBERS_PAGE_URL);
const HERO_URL = `${SITE_ORIGIN}/images/optimized/seed-house-front-1600.webp`;
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

const subject = "A few weeks in at The Harvest";
const preheader = "The gate is open. Tell us what should happen next.";

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light only">
    <title>${subject}</title>
    <style>
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; border: 0; display: block; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      @media only screen and (max-width: 640px) {
        .shell-pad { padding: 0 !important; }
        .content-pad { padding-left: 22px !important; padding-right: 22px !important; }
        .headline { font-size: 36px !important; line-height: 1.05 !important; }
        .body-copy { font-size: 17px !important; line-height: 1.58 !important; }
        .cta-link { display: block !important; text-align: center !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#F5F0E8;color:#1C1917;font-family:Inter,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;color:transparent;opacity:0;">${preheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F5F0E8;margin:0;padding:0;">
      <tr>
        <td class="shell-pad" align="center" style="padding:30px 16px;">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;background:#FFFDF8;border:1px solid #D8CDBE;">
            <tr>
              <td class="content-pad" style="padding:30px 32px 22px 32px;border-top:8px solid #C4922A;">
                <a href="${SITE_URL}" style="text-decoration:none;">
                  <img src="${LOGO_URL}" alt="The Harvest" width="190" style="width:190px;max-width:68%;height:auto;margin:0 0 28px 0;">
                </a>
                <p style="margin:0 0 9px 0;color:#4A6741;font-size:12px;line-height:1.4;text-transform:uppercase;letter-spacing:1.4px;font-weight:800;">Harvest Note &middot; July 2026</p>
                <h1 class="headline" style="margin:0 0 12px 0;color:#1C1917;font-family:Montserrat,Arial,sans-serif;font-size:44px;line-height:1.03;letter-spacing:0;font-weight:800;">A few weeks in.</h1>
                <p style="margin:0;color:#3D3832;font-size:18px;line-height:1.5;">The gate is open. The place is still being made.</p>
              </td>
            </tr>
            <tr>
              <td>
                <a href="${SITE_URL}" style="text-decoration:none;">
                  <img src="${HERO_URL}" alt="The old nursery at 9 Gumland Drive, Witta" width="640" style="width:100%;max-width:640px;height:auto;">
                </a>
              </td>
            </tr>
            <tr>
              <td class="content-pad" style="padding:12px 32px 0 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:11px 8px;background:#4A6741;color:#FFFDF8;font-size:12px;font-weight:800;text-align:center;text-transform:uppercase;letter-spacing:1px;">Grow</td>
                    <td style="padding:11px 8px;background:#B58B70;color:#1C1917;font-size:12px;font-weight:800;text-align:center;text-transform:uppercase;letter-spacing:1px;">Make</td>
                    <td style="padding:11px 8px;background:#3B5563;color:#FFFDF8;font-size:12px;font-weight:800;text-align:center;text-transform:uppercase;letter-spacing:1px;">Gather</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="content-pad body-copy" style="padding:28px 32px 4px 32px;color:#1C1917;font-size:18px;line-height:1.62;">
                <p style="margin:0 0 18px 0;">The gate opened on Saturday 20 June. The first members and makers day gave us a real starting point.</p>
                <p style="margin:0 0 18px 0;">Since then, the garden has kept moving through regular work days. Conversations with local makers and growers are shaping the first shop shelves. The art space is still finding its first useful shape.</p>
                <p style="margin:0 0 26px 0;">That is the point. The Harvest is open, but it is not arriving finished.</p>

                <h2 style="margin:0 0 10px 0;color:#1C1917;font-family:Montserrat,Arial,sans-serif;font-size:25px;line-height:1.18;letter-spacing:0;">Before we fill the next month with guesses</h2>
                <p style="margin:0 0 18px 0;">What would you actually use? When would you come? What could you share? What gets in the way?</p>
                <p style="margin:0 0 22px 0;">The Harvest community pulse takes about three minutes. Add your name and email if you want us to follow up, or leave both blank to answer anonymously.</p>

                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 22px 0;">
                  <tr>
                    <td bgcolor="#C4922A" style="border:2px solid #1C1917;">
                      <a class="cta-link" href="${PULSE_URL}" style="display:inline-block;padding:16px 22px;color:#1C1917;text-decoration:none;font-family:Inter,Arial,sans-serif;font-size:17px;line-height:1.1;font-weight:800;">Take the 3-minute pulse</a>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 30px 0;color:#3D3832;font-size:16px;line-height:1.55;">Your answers will shape the next work days, shared meals, shop shelf tests, and first making sessions.</p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #D8CDBE;border-bottom:1px solid #D8CDBE;">
                  <tr>
                    <td style="padding:22px 0;">
                      <p style="margin:0 0 6px 0;color:#3B5563;font-size:12px;line-height:1.4;text-transform:uppercase;letter-spacing:1.2px;font-weight:800;">Keep close</p>
                      <p style="margin:0 0 9px 0;color:#1C1917;font-size:17px;line-height:1.55;">Practical dates, RSVP links and questions land on the members page first. It is free to join.</p>
                      <a href="${MEMBERS_PAGE_EMAIL_URL}" style="color:#1C1917;text-decoration:underline;font-size:17px;line-height:1.5;font-weight:800;">Open the Harvest members page &rarr;</a>
                    </td>
                  </tr>
                </table>

                <p style="margin:26px 0 18px 0;">You can also reply to this email. We read everything, even when it takes a few days to come back.</p>
                <p style="margin:0 0 28px 0;font-weight:800;">Grow. Make. Gather.</p>
              </td>
            </tr>
            <tr>
              <td class="content-pad" style="padding:22px 32px;background:#1C1917;color:#F5F0E8;">
                <p style="margin:0 0 8px 0;color:#F5F0E8;font-size:16px;line-height:1.5;font-weight:700;">The Harvest</p>
                <p style="margin:0 0 10px 0;color:#F5F0E8;font-size:15px;line-height:1.5;">A community garden and creative gathering place in Witta, on Jinibara Country.</p>
                <p style="margin:0 0 10px 0;color:#F5F0E8;font-size:15px;line-height:1.5;">9 Gumland Drive, Witta</p>
                <p style="margin:0;"><a href="${SITE_URL}" style="color:#F5F0E8;text-decoration:underline;font-size:15px;line-height:1.5;">theharvestwitta.com.au</a></p>
              </td>
            </tr>
            <tr>
              <td class="content-pad" style="padding:16px 32px 22px 32px;background:#1C1917;color:#B8AEA2;">
                <p style="margin:0;color:#B8AEA2;font-size:12px;line-height:1.5;">You are receiving this note because you signed up as a Harvest member.</p>
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
  const writeHtmlPath = argValue("--write-html");
  const template = {
    name: "Harvest Note 04 - A few weeks in - member pulse",
    subject,
    preheader,
    html,
  };

  if (writeHtmlPath) {
    writeFileSync(writeHtmlPath, html, "utf8");
  }

  if (!apply) {
    console.log(JSON.stringify({
      mode: "dry-run",
      template: {
        name: template.name,
        subject: template.subject,
        preheader: template.preheader,
        audience: "tier:member + interest:membership, excluding staff/test. Never All.",
        cta: [PULSE_URL, MEMBERS_PAGE_EMAIL_URL],
      },
      html: writeHtmlPath ? undefined : html,
      wroteHtml: writeHtmlPath,
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
      audience: "tier:member + interest:membership, excluding staff/test. Never All.",
      cta: [PULSE_URL, MEMBERS_PAGE_EMAIL_URL],
    },
    result,
    note: "This creates an email template only. It does not choose an audience, send, or schedule a campaign.",
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
