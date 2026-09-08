import { useState, type CSSProperties } from "react";
import { colors, fonts } from "@/styles/brand";

/* ─── WRITE LIKE THIS ─────────────────────────────────────────────
   The four pillars and the weekly rhythm come from
   docs/communications/weekly-content-patterns.md. The worked examples
   are written for the current situation: the gate is open and the
   pizza weekend is the front door.
   ---------------------------------------------------------------- */

const rhythm = [
  {
    day: "Tuesday",
    job: "This weekend at The Harvest",
    detail: "Days and hours, what is on, one photo from last weekend. Members page first, then Facebook, Instagram and Google Business Profile.",
  },
  {
    day: "Thursday",
    job: "One practical ask",
    detail: "A hand on the day, a maker for the shelf, something the place needs. Facebook first.",
  },
  {
    day: "Sunday or Monday",
    job: "The after story",
    detail: "One photo, one line, thanks. No head counts in public.",
  },
];

const pillars = [
  {
    name: "Place",
    when: "The site itself is the story.",
    examples: "Light through the shed. The old nursery rows. The long table. Milk crate art. Tools, timber, doors, paths.",
    question: "What could this hold?",
  },
  {
    name: "People",
    when: "Trust is the story.",
    examples: "Barry and the nursery. Susie and Joey in the garden. Local growers. Makers and artists. Whoever turned up on the day.",
    question: "Who else should be part of this?",
  },
  {
    name: "Making",
    when: "Action is the story.",
    examples: "Moving tables. Clearing paths. Planting. Painting. Fixing. Hanging lights. A work day.",
    question: "What should we make here first?",
  },
  {
    name: "Invitation",
    when: "The reader needs a next step.",
    examples: "Come to a pizza weekend. Join the members page. Put your hand up for a work day, the shop shelf or the art space.",
    question: "Want to help?",
  },
];

const examplePosts = [
  {
    label: "Tuesday, this weekend",
    pillar: "Invitation",
    text: `This weekend at The Harvest.

Friday and Saturday, DIY pizza in the wood oven. Make your own or let the custodian cook it. Kids get a free small base. Card only.

The garden is coming back on after winter and the shed end looks different to last month. Come and sit in it.

Witta, on Jinibara Country. No booking needed, just come through the gate.`,
  },
  {
    label: "Thursday, practical ask",
    pillar: "Making",
    text: `Two things the place needs this week.

A hand on Saturday afternoon, from about 2pm, setting up before pizza starts.

And makers. If you grow, bake or make something and you have wondered about the shop shelf, reply here and we will have a real conversation about it.`,
  },
  {
    label: "Weekend, after story",
    pillar: "People",
    text: `Quiet Friday, good fire, and the first proper warm night of the year.

Thanks to everyone who came through the gate and made their own dinner.

Same again next weekend.`,
  },
];

/* ─── POSTER KIT ──────────────────────────────────────────────────
   From docs/communications/pizza-night-poster-prompt-pack-2026-07-08.md.
   Prices are as recorded on 8 July 2026. Check Square before printing.
   ---------------------------------------------------------------- */

const sourcePhotos = [
  { src: "/images/overrides/whats-on-pizza-gallery-1.jpg", use: "Hands and pizza prep" },
  { src: "/images/overrides/whats-on-pizza-gallery-2.jpg", use: "Night, the place open" },
  { src: "/images/overrides/whats-on-pizza-gallery-3.jpg", use: "Dessert pizza, close detail" },
  { src: "/images/overrides/whats-on-pizza-gallery-4.jpg", use: "People holding pizza" },
  { src: "/images/membership/member-welcome-crates.jpg", use: "Milk crate texture" },
];

const posterCopy = `DIY PIZZA AT THE HARVEST

Make it. Top it. Cook it with us.

Pizza $30 each

Dessert pizza $10 each
Nutella, whipped cream, strawberries, caramel sauce, or marshmallows.
Included with an order of 3 pizzas.

Soft drinks $5 to $6.50

The Harvest
9 Gumland Drive, Witta`;

const posterPrompt = `Use the attached real photo as the dominant image. Create a warm, practical poster for The Harvest in Witta, on Jinibara Country.

Format: portrait poster, 1080 x 1350.

Design direction: real place first, hard edges, workmanlike type, warm milk paper background (#F5F0E8), dark shed brown (#1C1917), golden hour accent (#C4922A), small canopy green details (#4A6741). Montserrat bold for display, Inter for body. It should feel like a sign at the gate of a working community garden and pizza night, not a polished restaurant ad.

Keep the photo real. Crop and colour correct only. Do not invent new people, new buildings, fake interiors, fake crowds, fake QR codes, cartoon pizza, Italian flag styling or glossy cafe branding.

Use this exact copy:

${posterCopy}

Make the headline readable from a distance. Keep the details in clean blocks. Leave a clear bottom right space for a real QR code to be added later. Do not generate a QR code.`;

const hierarchy = [
  "Biggest line: DIY PIZZA AT THE HARVEST",
  "Second line: Make it. Top it. Cook it with us.",
  "Price blocks: pizza, dessert pizza, soft drinks",
  "Small line: toppings and dessert details",
  "Footer: The Harvest, 9 Gumland Drive, Witta",
];

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(text);
        setDone(true);
        window.setTimeout(() => setDone(false), 1400);
      }}
      style={{
        fontFamily: fonts.display,
        fontWeight: 900,
        fontSize: 11,
        letterSpacing: "0.14em",
        color: colors.shed,
        backgroundColor: colors.goldenHour,
        border: "none",
        padding: "10px 18px",
        cursor: "pointer",
      }}
    >
      {done ? "COPIED" : label}
    </button>
  );
}

export function WriteLikeThis({ isMobile }: { isMobile: boolean }) {
  return (
    <section id="writing" style={{ padding: isMobile ? "60px 24px" : "80px 40px" }}>
      <h2 style={sectionHeadingStyle}>WRITE LIKE THIS</h2>
      <p style={sectionDescStyle}>
        Write like someone standing at the gate. Plain sentences, named things,
        one invitation. Here is the week, the four things worth posting about,
        and three posts you can copy and change.
      </p>

      {/* Weekly rhythm */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        gap: 16,
        maxWidth: 1000,
        margin: "40px auto 0",
      }}>
        {rhythm.map((r) => (
          <div key={r.day} style={{ border: `1px solid rgba(26,26,26,0.15)`, padding: "20px 22px" }}>
            <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", color: colors.crane }}>
              {r.day.toUpperCase()}
            </div>
            <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 17, marginTop: 8 }}>
              {r.job}
            </div>
            <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.6, marginTop: 10, marginBottom: 0 }}>
              {r.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Pillars */}
      <div style={{ maxWidth: 1000, margin: "48px auto 0" }}>
        <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", opacity: 0.5 }}>
          FOUR THINGS WORTH POSTING ABOUT
        </span>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          gap: 16,
          marginTop: 16,
        }}>
          {pillars.map((p) => (
            <div key={p.name} style={{ border: `1px solid rgba(26,26,26,0.15)`, padding: "20px 22px" }}>
              <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 15, letterSpacing: "0.1em" }}>
                {p.name.toUpperCase()}
              </div>
              <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.6, marginTop: 8, marginBottom: 0, opacity: 0.75 }}>
                {p.when}
              </p>
              <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.6, marginTop: 8, marginBottom: 0 }}>
                {p.examples}
              </p>
              <p style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 14, marginTop: 12, marginBottom: 0, color: colors.crane }}>
                {p.question}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Worked examples */}
      <div style={{ maxWidth: 1000, margin: "48px auto 0" }}>
        <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", opacity: 0.5 }}>
          THREE POSTS TO START FROM
        </span>
        <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
          {examplePosts.map((post) => (
            <div key={post.label} style={{ border: `1px solid rgba(26,26,26,0.15)`, padding: isMobile ? "20px" : "22px 26px" }}>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div>
                  <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 13, letterSpacing: "0.1em" }}>
                    {post.label.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: fonts.body, fontSize: 13, marginLeft: 10, opacity: 0.6 }}>
                    {post.pillar}
                  </span>
                </div>
                <CopyButton text={post.text} label="COPY POST" />
              </div>
              <pre style={{
                fontFamily: fonts.body,
                fontSize: 14,
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
                margin: "14px 0 0",
              }}>
                {post.text}
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        maxWidth: 1000,
        margin: "24px auto 0",
        padding: isMobile ? "20px" : "22px 26px",
        border: `2px solid ${colors.calendula}`,
      }}>
        <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", color: colors.calendula }}>
          CHECK BEFORE YOU POST
        </span>
        <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.65, marginTop: 12, marginBottom: 0 }}>
          Hours in the same words as the website. Consent for every face and name.
          No head counts, no invented dates, no finished-build claims. One
          invitation per post. Read it back: does it sound like a person at the
          gate, or like an ad?
        </p>
      </div>
    </section>
  );
}

export function PosterKit({ isMobile }: { isMobile: boolean }) {
  return (
    <section id="posters" style={{
      padding: isMobile ? "60px 24px" : "80px 40px",
      backgroundColor: colors.shed,
      color: colors.milk,
    }}>
      <h2 style={{ ...sectionHeadingStyle, color: colors.milk }}>MAKE A POSTER</h2>
      <p style={{ ...sectionDescStyle, color: colors.milk, opacity: 0.65 }}>
        Start from a real photo of the place, then let the tool lay out type
        around it. The photo is ours. The layout can be machine made. Never the
        other way around.
      </p>

      {/* Rule */}
      <div style={{
        maxWidth: 1000,
        margin: "36px auto 0",
        padding: isMobile ? "20px" : "22px 26px",
        border: `2px solid ${colors.calendula}`,
      }}>
        <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", color: colors.calendula }}>
          THE ONE RULE
        </span>
        <p style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.65, marginTop: 12, marginBottom: 0 }}>
          AI-generated images are never Harvest brand assets. A tool may crop,
          sequence, caption and lay out real material. It may not invent people,
          buildings, interiors, crowds, QR codes, cartoon pizza or a scene that
          did not happen. If a poster shows the place, that photo was taken here.
        </p>
      </div>

      {/* Source photos */}
      <div style={{ maxWidth: 1000, margin: "36px auto 0" }}>
        <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", opacity: 0.55 }}>
          START FROM ONE OF THESE
        </span>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)",
          gap: 10,
          marginTop: 16,
        }}>
          {sourcePhotos.map((photo) => (
            <a
              key={photo.src}
              href={photo.src}
              download
              style={{ textDecoration: "none", color: colors.milk }}
            >
              <div style={{
                height: 120,
                backgroundImage: `url(${photo.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }} />
              <div style={{ fontFamily: fonts.body, fontSize: 12, lineHeight: 1.4, marginTop: 8, opacity: 0.75 }}>
                {photo.use}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Copy + hierarchy */}
      <div style={{
        maxWidth: 1000,
        margin: "36px auto 0",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "3fr 2fr",
        gap: 16,
      }}>
        <div style={{ border: `1px solid rgba(245,240,232,0.25)`, padding: isMobile ? "20px" : "22px 26px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", opacity: 0.55 }}>
              THE COPY
            </span>
            <CopyButton text={posterCopy} label="COPY TEXT" />
          </div>
          <pre style={{
            fontFamily: fonts.body,
            fontSize: 14,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            margin: "14px 0 0",
          }}>
            {posterCopy}
          </pre>
          <p style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.6, marginTop: 16, marginBottom: 0, opacity: 0.6 }}>
            Prices as recorded on 8 July 2026. Check them against Square before
            anything is printed, and keep the words the same as the till items.
          </p>
        </div>

        <div style={{ border: `1px solid rgba(245,240,232,0.25)`, padding: isMobile ? "20px" : "22px 26px" }}>
          <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", opacity: 0.55 }}>
            SIZE ORDER
          </span>
          <ol style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.7, marginTop: 14, marginBottom: 0, paddingLeft: 20 }}>
            {hierarchy.map((line) => (
              <li key={line} style={{ marginBottom: 6 }}>{line}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* The prompt */}
      <div style={{
        maxWidth: 1000,
        margin: "16px auto 0",
        border: `1px solid rgba(245,240,232,0.25)`,
        padding: isMobile ? "20px" : "22px 26px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 12, letterSpacing: "0.16em", opacity: 0.55 }}>
            THE PROMPT, PASTE IT WITH THE PHOTO
          </span>
          <CopyButton text={posterPrompt} label="COPY PROMPT" />
        </div>
        <pre style={{
          fontFamily: fonts.body,
          fontSize: 13,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          margin: "14px 0 0",
          opacity: 0.85,
        }}>
          {posterPrompt}
        </pre>
      </div>
    </section>
  );
}

const sectionHeadingStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 28,
  letterSpacing: "0.1em",
  textAlign: "center",
  margin: 0,
};

const sectionDescStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 16,
  lineHeight: 1.7,
  textAlign: "center",
  maxWidth: 640,
  margin: "16px auto 0",
  opacity: 0.7,
};
