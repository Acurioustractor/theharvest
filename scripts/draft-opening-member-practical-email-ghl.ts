import dotenv from "dotenv";
import { createGHLEmailTemplate } from "../server/gohighlevel.js";
import { LOGO_URL } from "./harvest-brand.js";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

const RSVP_URL = "https://www.theharvestwitta.com.au/june-20#rsvp";

const subject = "Tomorrow: the gate opens at 1pm";
const preheader = "The practical member note for Saturday at The Harvest.";

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
                <h1 style="margin:0;color:#1C1917;font-family:Montserrat,Arial,sans-serif;font-size:34px;line-height:1.05;letter-spacing:0;font-weight:800;">Tomorrow, the gate opens.</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 0 28px;font-size:18px;line-height:1.62;">
                <p style="margin:0 0 18px 0;">Hi there,</p>

                <p style="margin:0 0 18px 0;">You are on the member list, so here is the practical version for tomorrow.</p>

                <p style="margin:0 0 18px 0;">The Harvest opens its gate on Saturday 20 June. Come after the Witta Market. Walk the garden, see the milk crate pavilion, leave a thought on the wall, and stay into the evening if you can.</p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;background:#F5F0E8;border:1px solid #D8CDBE;">
                  <tr>
                    <td style="padding:18px 18px 8px 18px;">
                      <p style="margin:0 0 10px 0;font-size:17px;line-height:1.5;"><strong>When:</strong> Saturday 20 June 2026, gate from 1pm</p>
                      <p style="margin:0 0 10px 0;font-size:17px;line-height:1.5;"><strong>Where:</strong> The Harvest, 9 Gumland Drive, Witta</p>
                      <p style="margin:0 0 10px 0;font-size:17px;line-height:1.5;"><strong>Bring:</strong> a jacket, shoes for the garden, and a chair or picnic blanket if you have one</p>
                      <p style="margin:0 0 10px 0;font-size:17px;line-height:1.5;"><strong>Kids:</strong> welcome. Please keep close to them around the road edge, tools, oven, and garden edges.</p>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 18px 0;">Please RSVP even if you are only a maybe. It helps us count people, parking, and dough.</p>

                <p style="margin:0 0 18px 0;">We are keeping payment simple. You do not need to pay online to come. Do not use Mighty for this event. If card payment is confirmed on site, we will use Square on the night. If it is not confirmed, we will keep it to headcount, food, and a simple support sheet.</p>

                <p style="margin:0 0 18px 0;">If you can help, reply with one word: gate, parking, food, kids, photos, or pack-down.</p>
              </td>
            </tr>
            <tr>
              <td align="left" style="padding:8px 28px 28px 28px;">
                <a href="${RSVP_URL}" style="display:inline-block;background:#C4922A;color:#1C1917;text-decoration:none;font-weight:800;font-size:17px;line-height:1;padding:16px 22px;border:2px solid #1C1917;">RSVP for Saturday</a>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 28px;background:#1C1917;color:#F5F0E8;">
                <p style="margin:0 0 10px 0;color:#F5F0E8;font-size:16px;line-height:1.5;">Come as you are.</p>
                <p style="margin:0;color:#F5F0E8;font-size:16px;line-height:1.5;">The place is still being made. That is why you are invited.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

async function main() {
  const apply = process.argv.includes("--apply");
  const template = {
    name: "Harvest Opening - Member Practical Note - 2026-06-19",
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
        audience: "tier:member",
        cta: RSVP_URL,
      },
      note: "Dry run only. Add --apply to create the GHL email template. This does not send or schedule a campaign.",
    }, null, 2));
    return;
  }

  const result = await createGHLEmailTemplate(template);
  console.log(JSON.stringify({
    mode: "apply",
    template: {
      name: template.name,
      subject: template.subject,
      preheader: template.preheader,
      audience: "tier:member",
      cta: RSVP_URL,
    },
    result,
    note: "Template only. Build a one-off GHL Campaign to the Harvest Members smart list / tier:member, test-send, click links, then send or schedule. Do not add tags.",
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
