import dotenv from "dotenv";
import { createGHLEmailTemplate } from "../server/gohighlevel.js";

dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: false });

const B1_RSVP_URL = "https://api.leadconnectorhq.com/widget/bookings/harvest-2026-06-20-maker-session";
const B2_RSVP_URL = "https://api.leadconnectorhq.com/widget/bookings/harvest-2026-06-20-afternoon-pizza";

type EmailTemplateDraft = {
  name: string;
  subject: string;
  preheader: string;
  audience: string;
  sendWindow: string;
  html: string;
};

const templates: EmailTemplateDraft[] = [
  {
    name: "Harvest June Sprint - Wk4 Field Note - Shop Shelf - 2026-06",
    subject: "Witta hasn't had a shop in a long time",
    preheader: "We are trying to put one back. Here is how you could be on the shelf.",
    audience: "harvest-newsletter",
    sendWindow: "2026-06-02 to 2026-06-08",
    html: `<p>Hi {{contact.first_name}},</p>

<p>Here is something most people do not clock about Witta: around 1,300 people live here, and there is nowhere to buy a loaf of bread or the thing your neighbour grew. Witta has not had a shop in a long time.</p>

<p>We are trying to put one back at The Harvest. Not a supermarket, not a boutique. A shared shelf for what people around Witta and Maleny already grow and make, with honest signage about who made it and what they got paid.</p>

<p>It starts small and opens slowly, as the products and the people to run it come together. If you grow something, make something, cook or preserve something, or just want a hand in shaping how it works, there is a place for you.</p>

<p><a href="https://theharvestwitta.com.au/shop">Have a look and put your name down here</a>.</p>

<p>We read every one.</p>

<p>See you at the shop,<br>The Harvest</p>`,
  },
  {
    name: "Harvest June Sprint - Wk4 Makers Invite - 2026-06-20",
    subject: "Come help open the place, Saturday 20 June",
    preheader: "A makers' morning before the garden opens to everyone.",
    audience: "makers and doers",
    sendWindow: "2026-06-02 to 2026-06-08",
    html: `<p>Hi {{contact.first_name}},</p>

<p>You have had a hand in The Harvest, as a maker, a grower, a doer, someone shaping the garden, the events space or the art space. So you are hearing this first.</p>

<p>On Saturday 20 June we are opening the garden at Witta on Jinibara Country. The morning, 10am to 2pm, is yours: a maker session for the people building the place. A chance to get hands on, see how it is coming together, and shape the parts still forming.</p>

<p>From 2pm it opens up to everyone and runs till late, with a make-your-own pizza dinner from the garden and local makers. Stay for that too.</p>

<p>There are two things to let us know, so we can plan properly.</p>

<ol>
  <li>Can you make the morning maker session, 10am to 2pm? Put your name down here: <a href="${B1_RSVP_URL}">maker session RSVP</a></li>
  <li>Staying for the afternoon and the pizza dinner? Grab a spot here so we know how much dough to make: <a href="${B2_RSVP_URL}">afternoon and pizza RSVP</a></li>
</ol>

<p>Come for the part that suits you. Both, if you can.</p>

<p>See you in the garden,<br>The Harvest</p>`,
  },
  {
    name: "Harvest June Sprint - Harvest Note 02 - 2026-06-09",
    subject: "You are hearing this first: the garden opens Saturday 20 June",
    preheader: "Members get the first word, and the first invite.",
    audience: "harvest-member",
    sendWindow: "2026-06-09",
    html: `<p>Hi {{contact.first_name}},</p>

<p>You are on the member list, so you are hearing this before anyone else: we are opening the garden at The Harvest for a members' day on Saturday 20 June.</p>

<p>It is a chance to walk the rows, see what is taking shape across the garden, the events space and the art space, and meet the people building it. Nothing polished, nothing performative. Just the place as it is right now, and you in it.</p>

<p>The day runs in two parts. The morning is a maker session for the makers and doers helping build the place. From the afternoon it opens up for everyone and runs into the evening, with a make-your-own pizza dinner from the garden and local makers. Come for the part that suits you.</p>

<p>We will send the practical details, timing, what to bring, where to park, closer to the day. For now, let us know you are coming so we can plan: <a href="${B2_RSVP_URL}">afternoon and pizza RSVP</a></p>

<p>See you in the garden,<br>The Harvest</p>`,
  },
  {
    name: "Harvest June Sprint - Harvest Note 03 Practical - 2026-06-19",
    subject: "Tomorrow: the garden, and the practical bits",
    preheader: "Everything you need for Saturday.",
    audience: "harvest-member",
    sendWindow: "2026-06-19",
    html: `<p>Hi {{contact.first_name}},</p>

<p>Tomorrow is the day. Here is what you need.</p>

<p>The day runs in two parts. From 10am to 2pm it is a maker session for the makers and doers, the people helping build and shape the place. From 2pm it opens up for everyone and runs till late, with a make-your-own pizza dinner from the garden and local makers.</p>

<p><strong>When:</strong> Saturday 20 June, 10am till late.<br>
<strong>Where:</strong> The Harvest, 9 Gumland Dr, Witta. Parking is out the side, follow the signs in.<br>
<strong>Bring:</strong> a hat, water and good walking shoes. It is a garden, so dress for being outside.</p>

<p>Come for the part that suits you, or stay for the whole day. There will be people to show you around and plenty to see taking shape.</p>

<p>If your plans change, no stress, just reply and let us know.</p>

<p>See you tomorrow,<br>The Harvest</p>`,
  },
  {
    name: "Harvest June Sprint - Thank You Photos - 2026-06-24",
    subject: "Thank you for the first day",
    preheader: "A few photos, what we learned, and what happens next.",
    audience: "harvest-member",
    sendWindow: "2026-06-24",
    html: `<p>Hi {{contact.first_name}},</p>

<p>Thank you for being part of the first day we opened the garden at The Harvest.</p>

<p>[ONE VERIFIED DETAIL FROM THE DAY: who came, what was made, what the room noticed, or what changed because people showed up.]</p>

<p>A few photos are below. Every person-led photo here has been cleared before sending.</p>

<p>[3 to 5 approved photos]</p>

<p><strong>One thing we learned:</strong></p>

<p>[ONE TRUE LEARNING, WRITTEN AFTER THE DEBRIEF]</p>

<p><strong>What happens next:</strong></p>

<p>[ONE TRUE NEXT STEP. If the next date is not decided, say that plainly.]</p>

<p>If you came and want to leave one word about the day, hit reply. If you did not make it and want to come next time, hit reply too.</p>

<p>See you in the garden,<br>The Harvest</p>`,
  },
  {
    name: "Harvest June Sprint - Early July Learning Note - 2026-07",
    subject: "What the first day taught us",
    preheader: "What we learned, what changes, and the next shape of The Harvest.",
    audience: "harvest-member",
    sendWindow: "early 2026-07",
    html: `<p>Hi {{contact.first_name}},</p>

<p>We have had a little time to sit with the first day at The Harvest.</p>

<p>Here is what we learned:</p>

<ul>
  <li>[LEARNING 1, specific]</li>
  <li>[LEARNING 2, specific]</li>
  <li>[LEARNING 3, specific]</li>
</ul>

<p>Here is what we are changing:</p>

<ul>
  <li>[CHANGE 1, practical]</li>
  <li>[CHANGE 2, practical]</li>
</ul>

<p>Here is what comes next:</p>

<p>[NEXT STEP OR HONEST HOLDING LINE]</p>

<p>Nothing here is finished. That is why the member list matters. You help us see what the place is becoming before it gets locked too early.</p>

<p>See you in the garden,<br>The Harvest</p>`,
  },
];

function assertEnv(name: string): void {
  if (!process.env[name]) {
    throw new Error(`${name} is not configured`);
  }
}

async function main(): Promise<void> {
  assertEnv("GHL_LOCATION_ID");

  const apply = process.argv.includes("--apply");

  if (!apply) {
    console.log(JSON.stringify({
      mode: "dry-run",
      count: templates.length,
      templates: templates.map(({ name, subject, preheader, audience, sendWindow }) => ({
        name,
        subject,
        preheader,
        audience,
        sendWindow,
      })),
      next: "Run `npm run draft:june-sprint-emails:ghl -- --apply` to create these as HighLevel email templates.",
    }, null, 2));
    return;
  }

  const results = [];
  for (const template of templates) {
    const result = await createGHLEmailTemplate(template);
    results.push({
      name: template.name,
      audience: template.audience,
      sendWindow: template.sendWindow,
      ...result,
    });
  }

  console.log(JSON.stringify({
    mode: "apply",
    results,
    note: "These are email templates only. Build one-off Campaigns in HighLevel, set the audience, set first-name fallback to `there`, test-send, then schedule.",
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
