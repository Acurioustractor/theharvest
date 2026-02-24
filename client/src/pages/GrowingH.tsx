import { type CSSProperties, type ReactNode } from "react";
import { colors, fonts } from "../styles/brand";

/* -----------------------------------------------
   THE GROWING H — Foundation Story
   A growing document. A living constitution for
   a place that refuses to be finished.
   ----------------------------------------------- */

/* ===== SVG H MARK — 6 STAGES (organic SVGs) ===== */

const stageFiles: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "/images/logo-stages/stage-01-seed.png",
  2: "/images/logo-stages/stage-02-shoots.png",
  3: "/images/logo-stages/stage-03-sapling.png",
  4: "/images/logo-stages/stage-04-mature.png",
  5: "/images/logo-stages/stage-05-fruit.png",
  6: "/images/logo-stages/stage-06-return.png",
};

function HMark({ stage }: { stage: 1 | 2 | 3 | 4 | 5 | 6 }) {
  return (
    <img
      src={stageFiles[stage]}
      alt={`H mark — stage ${stage}`}
      style={{ width: "100%", maxWidth: 200, height: "auto", display: "block", margin: "0 auto" }}
    />
  );
}

/* ===== SHARED TEXT STYLES (used in slide data below) ===== */

const bodyTextStyle: CSSProperties = {
  opacity: 0.6,
  lineHeight: 2,
};

const asideStyle: CSSProperties = {
  opacity: 0.35,
  fontStyle: "italic",
  lineHeight: 1.9,
  marginTop: 16,
  marginBottom: 16,
};

const pullQuoteStyle: CSSProperties = {
  fontSize: 28,
  fontFamily: fonts.display,
  fontWeight: 900,
  opacity: 0.9,
  margin: "32px 0",
  letterSpacing: "-0.01em",
};

/* ===== SLIDE DATA ===== */

interface Slide {
  stage: 1 | 2 | 3 | 4 | 5 | 6;
  eyebrow: string;
  title: string;
  body: ReactNode;
  accent: string;
  image: string;
}

const slides: Slide[] = [
  {
    stage: 1,
    eyebrow: "STAGE 01",
    title: "The Seed.",
    accent: colors.canopy,
    image: "/images/growing-h/01-seed.png",
    body: (
      <>
        <p>A single point. A mark in the soil.</p>
        <p>Nic walks the property for the first time. Barry's shed at the top of the ridge. Rusted crane. Decades of use. Golden hour light falling through the beams. Rammed earth walls older than anyone's memory of them.</p>
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <img src="/images/growing-h/place-shed-v2.png" alt="The property — rammed earth building, shed, paddocks" style={{ width: "100%", maxWidth: 480, borderRadius: 8, opacity: 0.9, display: "block", margin: "0 auto" }} />
        </div>
        <p>No plan yet. No brand. No budget. Just the conviction that this place has something to give and a community that needs somewhere to receive it.</p>
        <p style={asideStyle}>Ian Curtis wrote songs with four chords and three words that hit harder than anything with a symphony behind it. A seed works the same way. Everything that follows is already inside it. You just have to trust it enough to put it in the ground.</p>
        <Divider />
        <Detail label="ELEMENT" text="Earth. What was here before us." />
        <Detail label="MATERIAL" text="Soil. Rammed earth. Jinibara Country." />
        <Detail label="THE PERSON" text="Barry. The heritage. His hands, his crane, his shed." />
        <div style={{ textAlign: "center", margin: "16px 0 0" }}>
          <img src="/images/compendium/barry/IMG_5633.jpg" alt="Barry with his crane" style={{ width: "100%", maxWidth: 480, borderRadius: 8, opacity: 0.9, display: "block", margin: "0 auto" }} />
        </div>
      </>
    ),
  },
  {
    stage: 2,
    eyebrow: "STAGE 02",
    title: "The Shoots.",
    accent: colors.rammedEarth,
    image: "/images/growing-h/02-shoots.png",
    body: (
      <>
        <p>Two thin stems push up from the soil. No bars yet. Just potential.</p>
        <p>The neighbours are already asking what is happening here. A welcome committee turned up before we opened the doors. Homeschooling families are circling. Local makers want in. Shaun's oysters connect Aboriginal food sovereignty to rammed earth floors. Shells from Stradbroke Island returning to the ground at Witta.</p>
        <p style={asideStyle}>That last sentence. Read it again. That is the kind of connection this place makes visible. Not because we designed it. Because we left enough space for it to happen.</p>
        <Divider />
        <Detail label="THE PEOPLE ARRIVING" text="" />
        <p style={bodyTextStyle}>Suzie brings food, gardens and community. Thais brings architecture and design. Sophie brings growing and planning. Joey brings energy for everything else. And behind them, parents, kids, friends, ACT partners, artists, makers, and all of Witta.</p>
        <p>A community waiting for a place. Not the other way around.</p>
      </>
    ),
  },
  {
    stage: 3,
    eyebrow: "STAGE 03",
    title: "The Sapling.",
    accent: colors.canopy,
    image: "/images/growing-h/03-sapling.png",
    body: (
      <>
        <p>The posts thicken. The first bar appears. A root connection between two trunks. Underground. Essential.</p>
        <p>Phase 1. Focused on outdoor activation and community-facing infrastructure. Garden beds wake up the former nursery site. The milk crate pavilion rises as a gathering anchor. Pathways invite people in.</p>
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <img src="/images/growing-h/place-milkcrate.png" alt="The milk crate pavilion" style={{ width: "100%", maxWidth: 480, borderRadius: 8, opacity: 0.9, display: "block", margin: "0 auto" }} />
        </div>
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <img src="/images/site-plan/cropped/photo.png" alt="Aerial view of the Harvest site — the property from above" style={{ width: "100%", maxWidth: 480, borderRadius: 8, opacity: 0.9, display: "block", margin: "0 auto" }} />
        </div>
        <p>This phase creates the bones of the site. Visible, usable, immediately alive. Activation as iteration. Not renovation as finished product.</p>
        <Divider />
        <Detail label="ELEMENT" text="Earth. Fire, food, fuel. The timber industry." />
        <Detail label="THE BAR" text="Bottom. Green. The land. The garden. Grow." />
        <Detail label="GROWING" text="Sophie's garden design. Pathways. The milk crate pavilion. The welcome." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px auto", maxWidth: 480 }}>
          <img src="/images/compendium/sophie-garden.jpg" alt="Sophie in the garden — hay bales, timber arbour, green everywhere" style={{ width: "100%", borderRadius: 6, opacity: 0.9, objectFit: "cover", aspectRatio: "1" }} />
          <img src="/images/compendium/team-garden-selfie.jpg" alt="The garden team on site" style={{ width: "100%", borderRadius: 6, opacity: 0.9, objectFit: "cover", aspectRatio: "1" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "12px auto 16px", maxWidth: 480 }}>
          <img src="/images/zone-garden-sketch.png" alt="Garden design — raised beds, polytunnel, rammed earth" style={{ width: "100%", borderRadius: 6, opacity: 0.85 }} />
          <img src="/images/growing-h/place-milkcrate.png" alt="The milk crate pavilion — community gathering space" style={{ width: "100%", borderRadius: 6, opacity: 0.85, objectFit: "cover", aspectRatio: "1" }} />
        </div>
        <div style={{ textAlign: "center", margin: "0 0 16px" }}>
          <img src="/images/compendium/canvas-drawing.jpg" alt="Site design drawing — zones, pathways, gathering spaces" style={{ width: "100%", maxWidth: 480, borderRadius: 6, opacity: 0.85, display: "block", margin: "0 auto" }} />
        </div>
        <ThreeColumn
          items={[
            { heading: "Nothing is permanent.", body: "Like a gallery. Exhibitions come. People love them. They evolve. The space is always becoming. This is not a renovation with a completion date. It is a conversation with a place." },
            { heading: "Community-built.", body: "The kids build the kids area. The community runs the milk bar. We do not build for people. We build with them." },
            { heading: "Custodianship to community.", body: "We start as custodians of spaces. We build to hand over. Our success is measured by our irrelevance." },
          ]}
        />
      </>
    ),
  },
  {
    stage: 4,
    eyebrow: "STAGE 04",
    title: "The Mature H.",
    accent: colors.goldenHour,
    image: "/images/growing-h/04-mature.png",
    body: (
      <>
        <p>Full H. All three bars. Thick trunks, strong branches. Leaves, texture, life. The colours appear naturally. Green at the roots. Golden in the heartwood. Brown where it meets the sky.</p>
        <p style={pullQuoteStyle}>Make. Feed. Gather.</p>
        <p>Art is how we make sense of being alive. Food is how we sustain each other. Community is what happens when those two things share a table.</p>
        <p style={asideStyle}>Bowie said the only art he would ever study was whatever was on the edge of what terrified him. A community kitchen doing that might look like an Aboriginal oyster farmer serving on rammed earth floors. An art space doing that might look like kids curating a quarterly gallery. A garden doing that might look like NDIS-accessible beds where anyone can pick what they cook with, for free.</p>
        <p>Phase 2 turns attention inside. Kitchen fit-out. Commercial hospitality infrastructure. Gallery and workshop space. The milk bar and cafe build-out.</p>
        <Divider />
        <Detail label="THREE BARS · THREE ZONES · THREE ELEMENTS" text="" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, margin: "16px auto 24px", maxWidth: 480 }}>
          <div style={{ textAlign: "center" }}>
            <img src="/images/growing-h/zone-garden.png" alt="The garden" style={{ width: "100%", borderRadius: 6, marginBottom: 12, opacity: 0.85 }} />
            <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 14, marginBottom: 6, opacity: 0.8 }}>Garden / Grow</div>
            <div style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.7, opacity: 0.45 }}>Earth. Sophie's beds. The soil. Fire, food, fuel.</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <img src="/images/growing-h/zone-kitchen.png" alt="The kitchen" style={{ width: "100%", borderRadius: 6, marginBottom: 12, opacity: 0.85 }} />
            <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 14, marginBottom: 6, opacity: 0.8 }}>Kitchen / Feed</div>
            <div style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.7, opacity: 0.45 }}>Water. The dairy. Milk bar, community meal. Sustenance.</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <img src="/images/growing-h/zone-art.png" alt="The art space" style={{ width: "100%", borderRadius: 6, marginBottom: 12, opacity: 0.85 }} />
            <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 14, marginBottom: 6, opacity: 0.8 }}>Art Space / Make</div>
            <div style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.7, opacity: 0.45 }}>Air. The co-operative. Gallery. Workshops. The residency.</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, margin: "0 auto 24px", maxWidth: 480 }}>
          <img src="/images/witta/history/teutoburg-man-hoe-1899.png" alt="Farmer in corn field, Teutoburg, 1899" style={{ width: "100%", borderRadius: 4, opacity: 0.6 }} />
          <img src="/images/witta/history/teutoburg-cheese-making-1899.png" alt="Cheese making at Teutoburg farm, 1899" style={{ width: "100%", borderRadius: 4, opacity: 0.6 }} />
          <img src="/images/witta/history/maleny-sawmill-workers.jpg" alt="Maleny sawmill workers, Blackall Range" style={{ width: "100%", borderRadius: 4, opacity: 0.6 }} />
        </div>
      </>
    ),
  },
  {
    stage: 5,
    eyebrow: "STAGE 05",
    title: "The Fruit.",
    accent: colors.calendula,
    image: "/images/growing-h/05-fruit.png",
    body: (
      <>
        <p>Things hang from the bars. Produce, art, lanterns, hands. The H is bearing fruit.</p>
        <p><strong style={{ opacity: 0.8 }}>Residency 01: Radical Scoops.</strong></p>
        <p>Drawing from the region's layered industrial past. Timber. Dairy. Co-operative movements. The residency situates its work within a long history of community identity, enterprise, and mutual aid. It asks how today's communities might continue these traditions of working together.</p>
        <Divider />
        <Detail label="WHAT HANGS FROM THE BARS" text="" />
        <ThreeColumn
          items={[
            { heading: "From the garden", body: "Herbs, produce, compost cycles. Ingredients you can pick and cook with for free. The land feeding the table." },
            { heading: "From the kitchen", body: "Community meals. Once a day, soup from the garden, for an hour. The milk bar. Shaun's oysters on rammed earth." },
            { heading: "From the art space", body: "Exhibitions. Kids' quarterly design workshops. Maker residencies. A gallery that brings art, experience, and food together." },
          ]}
        />
        <Detail label="THE JOURNEY" text="" />
        <p style={bodyTextStyle}>
          Visit. Community meal. MYO deli. Milk bar. Gallery.
          <br />
          <span style={{ opacity: 0.5 }}>Anyone can come. The depth is up to you.</span>
        </p>
        <Divider />
        <Detail label="IT IS ALREADY HAPPENING" text="" />
        <p style={bodyTextStyle}>Sabrina will run the milk bar. Susie is here three days a week on operations. Leah project-manages. Sophie is designing the garden — NDIS-accessible, six months just to get it started. The kids area, the quarterly design workshops, the gallery — all of it is forming.</p>
        <Divider />
        <Detail label="SHAUN FISHER" text="" />
        <p style={bodyTextStyle}>A Goenpul man of the Quandamooka People, Traditional Owners of Minjerribah and the southern Moreton Bay. He grows oysters from his leases in Moreton Bay. When colonisers arrived in Brisbane, they blew up the Quandamooka oyster leases for limestone to build the city's foundations. Shaun brings those oysters to The Harvest. The shells go into the rammed earth floors. From Stradbroke Island back into the ground at Witta. Full cycle.</p>
        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <img src="/images/growing-h/country-oysters.png" alt="Oyster shells on rammed earth — Moreton Bay to Witta" style={{ width: "100%", maxWidth: 480, borderRadius: 8, opacity: 0.9, display: "block", margin: "0 auto" }} />
        </div>
        <p style={asideStyle}>These are not staff. They are players. They showed up because the space made room for them.</p>
      </>
    ),
  },
  {
    stage: 6,
    eyebrow: "STAGE 06",
    title: "The Return.",
    accent: colors.canopy,
    image: "/images/growing-h/06-return.png",
    body: (
      <>
        <p>Leaves fall. The bars thin. But the posts remain. Compost feeds the next cycle.</p>
        <p>This is the hardest stage to talk about because it requires letting go. Nic and Ben step back. The community takes over. The kids who built the kids area are now running it. The artists who shaped the art space are curating it. The neighbours who showed up before the doors opened are the ones holding the keys.</p>
        <p style={pullQuoteStyle}>Our success is measured by our irrelevance.</p>
        <p>A new seed is visible at the base. The H has not died. It has composted. The structure remains. The posts are as solid as they ever were. But the bars will fill with new colours, new people, new seasons.</p>
        <div style={{ textAlign: "center", margin: "24px 0" }}>
          <img src="/images/growing-h/cycle-compost.png" alt="The compost cycle" style={{ width: "100%", maxWidth: 340, borderRadius: 8, opacity: 0.85, display: "block", margin: "0 auto" }} />
        </div>
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <img src="/images/compendium/barry/IMG_5819.jpg" alt="Barry with his dogs — the quiet moment" style={{ width: "100%", maxWidth: 480, borderRadius: 8, opacity: 0.9, display: "block", margin: "0 auto" }} />
        </div>
        <p style={asideStyle}>Joy Division became New Order. The loss was real. The transformation was real. The music kept going because the structure was honest enough to hold a completely different version of itself. That is what The Return asks of this place.</p>
        <p>Nothing is permanent. The space is always becoming.</p>
      </>
    ),
  },
];

/* ===== HELPER COMPONENTS ===== */

function Divider() {
  return <div style={{ height: 1, backgroundColor: "rgba(245,240,232,0.08)", margin: "28px 0" }} />;
}

function Detail({ label, text }: { label: string; text: string }) {
  return (
    <div style={{ marginBottom: text ? 12 : 4 }}>
      <div style={detailLabelS}>{label}</div>
      {text && <div style={detailTextS}>{text}</div>}
    </div>
  );
}

function ThreeColumn({ items }: { items: { heading: string; body: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20, margin: "16px 0 24px" }}>
      {items.map((item) => (
        <div key={item.heading}>
          <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 14, marginBottom: 6, opacity: 0.8 }}>{item.heading}</div>
          <div style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.7, opacity: 0.45 }}>{item.body}</div>
        </div>
      ))}
    </div>
  );
}

/* ===== MAIN COMPONENT ===== */

export default function GrowingH() {
  return (
    <div style={pageStyle}>
      {/* Opening */}
      <section style={heroStyle}>
        <p style={eyebrowS}>THE HARVEST · WITTA</p>
        <h1 style={heroTitleStyle}>Growing H</h1>
        <p style={heroSubStyle}>A foundation story.<br />A growing document.<br />A living constitution for a place that refuses to be finished.</p>
      </section>

      {/* Premise */}
      <section style={{ ...slideStyle, borderTop: "none" }}>
        <div style={slideInnerStyle}>
          <p style={{ ...eyebrowS, color: colors.milk }}>BEFORE WE BEGIN</p>
          <h2 style={{ ...slideTitleStyle, fontSize: "clamp(24px, 5vw, 32px)" }}>The premise.</h2>
          <div style={slideBodyStyle}>
            <p>Every town has a place that used to be something. A hall. A factory. A nursery. A shed with a crane on the ridge and rammed earth walls that have outlasted every plan anyone ever made for them.</p>
            <p>Most of the time, someone buys that place and turns it into something for people. A cafe. A venue. A gallery with a gift shop.</p>
            <p>This is not that.</p>
            <p>The Harvest is an experiment in what happens when you build a place with people instead of for them. When the community that shows up before the doors open is the same community holding the keys when the founders step back.</p>
            <p style={{ opacity: 0.35, marginTop: 24 }}>This document is the foundation story. Not a business plan. Not a brand book. Something closer to a field guide for a place that is always becoming.</p>
          </div>
        </div>
      </section>

      {/* The Country */}
      <section style={slideStyle}>
        <div style={slideInnerStyle}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <img
              src="/images/growing-h/country-bunya.png"
              alt="Bunya pine gathering — Jinibara Country"
              style={{ width: "100%", maxWidth: 360, borderRadius: 8, opacity: 0.9, display: "block", margin: "0 auto" }}
            />
          </div>
          <p style={{ ...eyebrowS, color: colors.canopy }}>THE COUNTRY</p>
          <h2 style={{ ...slideTitleStyle, fontSize: "clamp(24px, 5vw, 32px)" }}>Jinibara Country.</h2>
          <div style={slideBodyStyle}>
            <p>Before the seed. Before the shed. Before the crane and the rammed earth and the nursery and every plan anyone ever made for this ridge. The land.</p>
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <img src="/images/witta/history/mary-cairncross-glasshouse-mountains.jpg" alt="View from Mary Cairncross towards the Glasshouse Mountains" style={{ width: "100%", maxWidth: 480, borderRadius: 8, opacity: 0.9, display: "block", margin: "0 auto" }} />
            </div>
            <p>Witta sits on Jinibara Country. The Jinibara are the mountain, rainforest and freshwater people of the Blackall Range. Their name means "people of the lawyer vine." Jini for the vine. Bara for the people. The Nalbo clan held custodianship of this part of the range.</p>
            <p>For thousands of years, the bunya pine forests at Baroon Pocket drew people from across the region. Every three years, a bountiful crop. Inter-tribal gatherings that were part feast, part ceremony, part law. The Jinibara managed these forests with fire and seasonal movement long before anyone called it land management.</p>
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <img src="/images/witta/history/bunya-pines-witta-1931.png" alt="Bunya pines at Witta, 1931" style={{ width: "100%", maxWidth: 480, borderRadius: 8, opacity: 0.85, display: "block", margin: "0 auto" }} />
            </div>
            <p>In 1845, Tom Petrie, aged fourteen, travelled from Brisbane with one hundred Aboriginal people to attend the Baroon Bunya Festival. He walked pathways that had been walked for millennia. When the first German settlers selected farms in 1887, the land was dense vine scrub in ancient forest crossed by those same Aboriginal pathways.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "20px auto", maxWidth: 480 }}>
              <img src="/images/witta/history/teutoburg-farm-couple-corn-1899.png" alt="Teutoburg settler couple in their corn field, 1899" style={{ width: "100%", borderRadius: 6, opacity: 0.85 }} />
              <img src="/images/witta/history/teutoburg-children-grapevines-1899.png" alt="Children among the grapevines, Blackall Range, 1899" style={{ width: "100%", borderRadius: 6, opacity: 0.85 }} />
            </div>
            <div style={{ textAlign: "center", margin: "0 0 20px" }}>
              <img src="/images/witta/history/witta-towards-conondale-1931.png" alt="Two figures looking towards the Conondale Ranges from Witta, 1931" style={{ width: "100%", maxWidth: 480, borderRadius: 8, opacity: 0.85, display: "block", margin: "0 auto" }} />
            </div>
            <p>In 2012, the Federal Court recognised the Jinibara People as traditional owners of the Blackall, D'Aguilar, and Conondale Ranges. What the law affirmed is what the land already knew.</p>
            <p>This is not an acknowledgement at the bottom of a page. This is the ground the seed goes into. Everything that grows here grows from Country first.</p>
          </div>
          <div style={{ height: 1, backgroundColor: "rgba(245,240,232,0.08)", margin: "28px 0" }} />
          <p style={{ fontFamily: fonts.body, fontSize: 14, opacity: 0.3, lineHeight: 1.9 }}>
            We acknowledge the Jinibara people as the Traditional Custodians of the land on which The Harvest stands. We pay our respects to Elders past, present, and emerging. This always was, and always will be, Aboriginal land.
          </p>
        </div>
      </section>

      {/* Growing H intro */}
      <section style={slideStyle}>
        <div style={slideInnerStyle}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <HMark stage={4} />
          </div>
          <div style={slideBodyStyle}>
            <p style={{ ...eyebrowS, color: colors.goldenHour }}>GROWING H</p>
            <p style={{ fontSize: 20, opacity: 0.8, fontFamily: fonts.display, fontWeight: 700 }}>A mark that grows with the place.</p>
            <p>Most logos sit still. Ours grows.</p>
            <p>The H is two posts and three bars. The posts are tree trunks. The bars are branches reaching across. The whole mark is alive. It thickens with the seasons. It bears fruit. It composts. A new seed appears at the base.</p>
            <p style={asideStyle}>David Bowie changed his face every album because he understood that identity is not a fixed thing but a series of honest responses to the moment you are in. The H works the same way. It is a mark that tells you where we are in the story.</p>
            <p style={{ opacity: 0.4 }}>Six stages. Each one changes the logo. Each one changes the place.</p>
          </div>
        </div>
      </section>

      {/* Slides */}
      {slides.map((slide) => (
        <section key={slide.stage} style={slideStyle}>
          <div style={slideInnerStyle}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <img
                src={slide.image}
                alt={slide.title}
                style={{
                  width: "100%",
                  maxWidth: 400,
                  borderRadius: 8,
                  marginBottom: 24,
                  opacity: 0.9,
                  display: "block",
                  margin: "0 auto 24px",
                }}
              />
              <HMark stage={slide.stage} />
            </div>
            <div style={slideContentStyle}>
              <p style={{ ...eyebrowS, color: slide.accent }}>{slide.eyebrow}</p>
              <h2 style={slideTitleStyle}>{slide.title}</h2>
              <div style={slideBodyStyle}>
                {slide.body}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Closing */}
      <section style={{ ...heroStyle, minHeight: "60vh" }}>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap" }}>
          {([1, 2, 3, 4, 5, 6] as const).map((s) => (
            <div key={s} style={{ opacity: 0.5, width: 60 }}>
              <HMark stage={s} />
            </div>
          ))}
        </div>
        <p style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: "clamp(20px, 4vw, 28px)", letterSpacing: "-0.01em", margin: "0 0 4px", opacity: 0.9 }}>
          THE H IS NOT BUILT.
        </p>
        <p style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: "clamp(20px, 4vw, 28px)", letterSpacing: "-0.01em", margin: "0 0 24px", opacity: 0.9 }}>
          IT IS GROWN.
        </p>
        <p style={{ fontFamily: fonts.body, fontSize: 16, opacity: 0.4, maxWidth: 440, margin: "0 auto", textAlign: "center", lineHeight: 1.8 }}>
          The posts are tree trunks. The bars are branches reaching across.
          The whole mark is alive. It grows with the place. Bears fruit with the people.
          Returns to the soil when the season turns.
        </p>
        <p style={{ fontFamily: fonts.body, fontSize: 14, opacity: 0.2, marginTop: 40, textAlign: "center" }}>
          This document will keep growing. Come back and see what has changed.
        </p>
        <p style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 10, letterSpacing: "0.2em", opacity: 0.15, marginTop: 48 }}>
          THE HARVEST · WITTA · JINIBARA COUNTRY
        </p>
        <p style={{ fontFamily: fonts.body, fontSize: 13, opacity: 0.15, fontStyle: "italic", marginTop: 8 }}>
          A Curious Tractor
        </p>

        <div style={{ marginTop: 48, display: "flex", gap: 32, justifyContent: "center", opacity: 0.2 }}>
          <a href="/logo-story" style={linkStyle}>Logo Story</a>
          <a href="/" style={linkStyle}>Home</a>
        </div>
      </section>
    </div>
  );
}

/* ===== STYLES ===== */

const pageStyle: CSSProperties = {
  backgroundColor: colors.shed,
  color: colors.milk,
  minHeight: "100vh",
  fontFamily: fonts.body,
};

const heroStyle: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "48px 24px",
  textAlign: "center",
};

const heroTitleStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: "clamp(36px, 8vw, 64px)",
  letterSpacing: "-0.03em",
  margin: "0 0 16px",
  lineHeight: 1.1,
};

const heroSubStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 17,
  opacity: 0.4,
  lineHeight: 2,
  margin: 0,
};

const eyebrowS: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 11,
  letterSpacing: "0.2em",
  opacity: 0.4,
  margin: "0 0 12px",
};

const slideStyle: CSSProperties = {
  padding: "80px 24px",
  borderTop: `1px solid rgba(245,240,232,0.04)`,
};

const slideInnerStyle: CSSProperties = {
  maxWidth: 640,
  margin: "0 auto",
};

const slideContentStyle: CSSProperties = {};

const slideTitleStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: "clamp(28px, 6vw, 42px)",
  letterSpacing: "-0.02em",
  margin: "0 0 24px",
  lineHeight: 1.15,
};

const slideBodyStyle: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 16,
  lineHeight: 1.8,
  opacity: 0.6,
};

const detailLabelS: CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 900,
  fontSize: 11,
  letterSpacing: "0.15em",
  opacity: 0.35,
  marginBottom: 4,
};

const detailTextS: CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 15,
  opacity: 0.7,
};

const linkStyle: CSSProperties = {
  fontFamily: fonts.display,
  fontSize: 11,
  letterSpacing: "0.1em",
  color: colors.milk,
  textDecoration: "none",
};
