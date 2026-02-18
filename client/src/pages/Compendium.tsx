import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useState, useEffect, useCallback, useRef, type CSSProperties } from "react";
import BauhausFooter from "@/components/BauhausFooter";

/* ─────────────────────────────────────
   HOOKS + HELPERS
   ───────────────────────────────────── */

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: "-100px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function FadeOnly({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: "-100px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────
   SECTION COMPONENT
   ───────────────────────────────────── */

interface SectionProps {
  number: string;
  title: string;
  declaration: string;
  children: React.ReactNode;
  principle: string;
  principleLabel: string;
  dark?: boolean;
  visual?: React.ReactNode;
  bgVideo?: { src: string; poster: string };
}

function CompendiumSection({
  number, title, declaration, children, principle, principleLabel,
  dark = true, visual, bgVideo,
}: SectionProps) {
  const bg = dark ? "#0C0A09" : "#1C1917";
  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      backgroundColor: bg,
    }}>
      {bgVideo && (
        <div style={{ position: "absolute", inset: 0 }}>
          <video autoPlay muted loop playsInline poster={bgVideo.poster}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}>
            <source src={bgVideo.src} type="video/mp4" />
          </video>
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(12,10,9,0.75)" }} />
        </div>
      )}
      <div style={{ position: "relative", padding: "80px 24px", maxWidth: 720, margin: "0 auto", width: "100%" }}>
        <FadeOnly>
          <p style={sectionNumStyle}>{number}</p>
        </FadeOnly>
        <FadeIn>
          <h2 style={sectionTitleStyle}>{title}</h2>
        </FadeIn>
        <FadeIn>
          <blockquote style={declarationStyle}>{declaration}</blockquote>
        </FadeIn>
        <FadeIn>
          <div style={bodyStyle}>{children}</div>
        </FadeIn>
        {visual && <FadeOnly><div style={{ marginBottom: 48 }}>{visual}</div></FadeOnly>}
        <FadeOnly>
          <div style={principleBox}>
            <p style={principleLabelStyle}>{principleLabel}</p>
            <p style={principleTextStyle}>{principle}</p>
          </div>
        </FadeOnly>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────
   CANVAS SECTION
   ───────────────────────────────────── */

function CanvasSection() {
  const [showDrawing, setShowDrawing] = useState(false);

  return (
    <>
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#1C1917",
      }}>
        {/* Ken Burns drawing bg */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <motion.img
            src="/images/compendium/canvas-drawing-dark.jpg"
            alt=""
            style={{ position: "absolute", width: "140%", maxWidth: "none", height: "140%", objectFit: "cover" }}
            animate={{ x: ["-10%", "-25%", "-10%"], y: ["-5%", "-12%", "-5%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(28,25,23,0.80)" }} />
        </div>

        <div style={{ position: "relative", padding: "80px 24px", maxWidth: 720, margin: "0 auto", width: "100%" }}>
          <FadeOnly><p style={sectionNumStyle}>V</p></FadeOnly>
          <FadeIn><h2 style={sectionTitleStyle}>The Canvas</h2></FadeIn>
          <FadeIn>
            <blockquote style={declarationStyle}>
              Gallery, not museum. Nothing permanent. Always evolving.
            </blockquote>
          </FadeIn>
          <FadeIn>
            <div style={bodyStyle}>
              <p>
                The building is an old nursery — shed bones, good light, room to move. We don't renovate it into a finished product. We treat it like a gallery: exhibitions come and go, the walls get repainted, the furniture moves.
              </p>
              <p>
                <strong style={{ color: "white" }}>Test before you build.</strong>{" "}
                Pop-ups before capital. Oyster nights before a restaurant. Pizza from a trailer before a kitchen. The scaffold pavilion before the permanent structure.
              </p>
              <p style={{ color: "rgba(217,169,78,0.8)", fontStyle: "italic", fontFamily: "'Playfair Display', serif" }}>
                You're not coming to something finished — you're coming to something you can be part of.
              </p>
            </div>
          </FadeIn>
          <FadeIn>
            <button
              onClick={() => setShowDrawing(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 24px",
                border: "1px solid rgba(217,169,78,0.3)",
                backgroundColor: "rgba(217,169,78,0.1)",
                color: "rgba(217,169,78,1)",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: 18,
                cursor: "pointer",
                borderRadius: 0,
              }}
            >
              See the Full Drawing
              <span style={{ fontSize: 20 }}>→</span>
            </button>
          </FadeIn>
          <FadeOnly>
            <div style={principleBox}>
              <p style={principleLabelStyle}>ACT Principle 4</p>
              <p style={principleTextStyle}>Build for handover (Beautiful Obsolescence) — design for transfer from day one.</p>
            </div>
          </FadeOnly>
        </div>
      </section>

      {showDrawing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            backgroundColor: "#F5F5F0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            backgroundColor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #E5E5E0",
          }}>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#292524", margin: 0 }}>
                The Harvest — Master Plan
              </h3>
              <p style={{ fontFamily: "monospace", fontSize: 12, color: "#78716C", margin: "2px 0 0" }}>
                Hand-drawn site plan · Morpholio Trace
              </p>
            </div>
            <button
              onClick={() => setShowDrawing(false)}
              style={{
                padding: "8px 16px",
                fontFamily: "monospace",
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                border: "1px solid #D6D3D1",
                backgroundColor: "transparent",
                color: "#57534E",
                cursor: "pointer",
                borderRadius: 20,
              }}
            >
              Close
            </button>
          </div>
          <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              src="/images/compendium/canvas-drawing-full.jpg"
              alt="The Harvest — hand-drawn master plan"
              style={{ maxWidth: "none", width: "95vw", borderRadius: 8, boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}
            />
          </div>
        </motion.div>
      )}
    </>
  );
}

/* ─────────────────────────────────────
   SHED / BARRY SECTION
   ───────────────────────────────────── */

const barryImages = [
  { src: "/images/compendium/barry/IMG_5764.jpg", caption: "Barry at golden hour, his shed behind him" },
  { src: "/images/compendium/barry/IMG_5613.jpg", caption: "The machinery graveyard — engines, axles, memory" },
  { src: "/images/compendium/barry/IMG_5699.jpg", caption: "Inside the shed — pointing out a bandsaw older than most of us" },
  { src: "/images/compendium/barry/IMG_5659.jpg", caption: "Barry among the engines, still knows every one" },
  { src: "/images/compendium/barry/IMG_5745.jpg", caption: "Sitting on the workbench, spanners beside him, telling stories" },
  { src: "/images/compendium/barry/IMG_5758.jpg", caption: "With the Case bulldozer — been here since '72" },
  { src: "/images/compendium/barry/IMG_5687.jpg", caption: "The workshop — where everything gets fixed" },
  { src: "/images/compendium/barry/IMG_5618.jpg", caption: "Surveying the yard with the crane at his back" },
  { src: "/images/compendium/barry/IMG_5727.jpg", caption: "Barry in the shed with visitors — stories are better shared" },
  { src: "/images/compendium/barry/IMG_5777.jpg", caption: "Looking out — 80 years of hinterland in one gaze" },
  { src: "/images/compendium/barry/IMG_5819.jpg", caption: "With the Blue Heelers — always the same breed, always called Samantha" },
  { src: "/images/compendium/barry/IMG_5633.jpg", caption: "Barry" },
];

function ShedSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [viewPhoto, setViewPhoto] = useState<number | null>(null);

  const nextPhoto = useCallback(() => {
    setCurrentPhoto((prev) => (prev + 1) % barryImages.length);
  }, []);

  const prevPhoto = useCallback(() => {
    setCurrentPhoto((prev) => (prev - 1 + barryImages.length) % barryImages.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextPhoto, 5000);
    return () => clearInterval(interval);
  }, [nextPhoto]);

  const navBtn: CSSProperties = {
    padding: 8,
    borderRadius: "50%",
    border: "1px solid #44403C",
    color: "#A8A29E",
    backgroundColor: "rgba(12,10,9,0.6)",
    backdropFilter: "blur(4px)",
    cursor: "pointer",
    lineHeight: 0,
  };

  return (
    <>
      <section style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0C0A09",
      }}>
        {barryImages.map((img, i) => (
          <motion.div
            key={img.src}
            style={{ position: "absolute", inset: 0 }}
            initial={false}
            animate={{ opacity: currentPhoto === i ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
        ))}

        {/* Overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0C0A09, rgba(12,10,9,0.8), rgba(12,10,9,0.3))" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0C0A09, transparent, rgba(12,10,9,0.4))" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", minHeight: "100vh" }}>
          <div style={{ padding: isMobile ? "80px 24px" : "80px 32px", maxWidth: 640 }}>
            <FadeOnly><p style={sectionNumStyle}>II</p></FadeOnly>
            <FadeIn><h2 style={sectionTitleStyle}>The Shed</h2></FadeIn>
            <FadeIn>
              <blockquote style={declarationStyle}>Before there was a harvest, there was a shed.</blockquote>
            </FadeIn>
            <FadeIn>
              <div style={bodyStyle}>
                <p>Barry Rodgerig is 80 years old. He's been on this land since 1972. Before that, Peachester — 25 years of dairy, timber, and red soil. He drove tractors before he could see over the steering wheel. He still drives them now.</p>
                <p>His shed is full of machines that built this hinterland. An AB184 log truck from 1963. Ex-army Blitz trucks from the war. A little Italian Valpadana tractor with a Lombardini diesel. A 1957 Land Rover he'd like to restore, if he lives long enough.</p>
                <p>He starts them up sometimes, just to hear them run.</p>
              </div>
            </FadeIn>
            <FadeIn>
              <div style={quoteBox}>
                <p style={quoteText}>"Rust is a terrible thing. It's just like cancer in humans. It eats. It just kills you."</p>
                <p style={quoteAttrib}>— Barry Rodgerig, Witta</p>
              </div>
            </FadeIn>
            <FadeIn>
              <div style={bodyStyle}>
                <p>The cedar-getters came first, after the Jinibara. Then dairy. Then timber trucks grinding through red mud to Strathpine. Barry watched the hippies shut down the logging at Crystal Waters. He watched the government finish the job. He watched the hinterland turn from working country into scenic drive.</p>
                <p><strong style={{ color: "white" }}>The Harvest is built on layers.</strong> Jinibara Country first. Then cedar. Then dairy. Then nursery. Now this. Every rusted blade and milk separator in Barry's shed is a chapter. The land remembers what was here before.</p>
              </div>
            </FadeIn>
            <FadeIn>
              <div style={quoteBox}>
                <p style={quoteText}>"I think when I die, it'll probably all go for scrap."</p>
                <p style={quoteAttrib}>— Barry</p>
              </div>
            </FadeIn>
            <FadeIn>
              <div style={{ ...bodyStyle, color: "#A8A29E" }}>
                <p>Not if we can help it. Barry's shed isn't scrap — it's archaeology. It's the living memory of what this place was, and the reason why what we build next has to mean something.</p>
                <p>Barry is one neighbour. There are more. Every person who lives around this land carries a piece of its story — and The Harvest exists to make sure those stories aren't forgotten.</p>
                <p style={{ color: "rgba(217,169,78,0.8)", fontStyle: "italic", fontFamily: "'Playfair Display', serif" }}>
                  Four Blue Heelers. Always called Samantha. "You never have two the same."
                </p>
              </div>
            </FadeIn>
            <FadeOnly>
              <div style={principleBox}>
                <p style={principleLabelStyle}>ACT Principle 2</p>
                <p style={principleTextStyle}>Listen before you build — every place has a story already being told.</p>
              </div>
            </FadeOnly>
          </div>
        </div>

        {/* Photo nav */}
        <div style={{ position: "absolute", bottom: 24, left: 16, right: 16, zIndex: 10 }}>
          <div style={{ marginBottom: 8 }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPhoto}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ color: "#78716C", fontFamily: "monospace", fontSize: 12, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {barryImages[currentPhoto].caption}
              </motion.p>
            </AnimatePresence>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={prevPhoto} style={navBtn}>◀</button>
              <button onClick={nextPhoto} style={navBtn}>▶</button>
              <span style={{ color: "#57534E", fontFamily: "monospace", fontSize: 12, marginLeft: 4 }}>
                {currentPhoto + 1}/{barryImages.length}
              </span>
            </div>
            <button
              onClick={() => setViewPhoto(currentPhoto)}
              style={{
                padding: "6px 12px",
                fontFamily: "monospace",
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                border: "1px solid #57534E",
                backgroundColor: "rgba(12,10,9,0.6)",
                backdropFilter: "blur(4px)",
                color: "#A8A29E",
                cursor: "pointer",
                borderRadius: 20,
              }}
            >
              View
            </button>
          </div>
        </div>
      </section>

      {/* Fullscreen viewer */}
      {viewPhoto !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "#0C0A09", display: "flex", flexDirection: "column" }}
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px", backgroundColor: "rgba(28,25,23,0.9)", backdropFilter: "blur(4px)",
            borderBottom: "1px solid #292524",
          }}>
            <p style={{ fontFamily: "monospace", fontSize: 12, color: "#A8A29E", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 12 }}>
              {viewPhoto + 1}/{barryImages.length} — {barryImages[viewPhoto].caption}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setViewPhoto((viewPhoto - 1 + barryImages.length) % barryImages.length)} style={navBtn}>◀</button>
              <button onClick={() => setViewPhoto((viewPhoto + 1) % barryImages.length)} style={navBtn}>▶</button>
              <button onClick={() => setViewPhoto(null)} style={{ ...navBtn, borderRadius: 20, padding: "6px 12px", fontFamily: "monospace", fontSize: 12 }}>Close</button>
            </div>
          </div>
          <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <img src={barryImages[viewPhoto].src} alt={barryImages[viewPhoto].caption} style={{ maxWidth: "none", width: "95vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 8 }} />
          </div>
        </motion.div>
      )}
    </>
  );
}

/* ─────────────────────────────────────
   DRAWING REVEAL SECTION
   ───────────────────────────────────── */

const slideshowImages = [
  "/images/compendium/canvas-drawing-full.jpg",
  "/images/compendium/MASTER FLOOR PLAN_1.jpeg",
  "/images/compendium/MASTER FLOOR PLAN_3.jpeg",
  "/images/compendium/MASTER FLOOR PLAN_4.jpeg",
  "/images/compendium/MASTER FLOOR PLAN_5.jpeg",
  "/images/compendium/MASTER FLOOR PLAN_6.jpeg",
  "/images/compendium/MASTER FLOOR PLAN_7.jpeg",
  "/images/compendium/MASTER FLOOR PLAN_8.jpeg",
  "/images/compendium/MASTER FLOOR PLAN_9.jpeg",
  "/images/compendium/MASTER FLOOR PLAN_10.jpeg",
  "/images/compendium/MASTER FLOOR PLAN_11.jpeg",
];

const drawingElements = [
  "Kids Play", "Pizza Oven", "Fire Pit & BBQ", "Chill Under the Trees", "Pop-Up Shops",
  "Gardeners Shed", "Bike Station", "Cafe", "Seedlings & Bathing", "Water Features",
  "Art Features", "Entry Portal", "Community Gathering", "Garden Beds", "Tea Station",
  "Mulch Station", "Shaded Tables", "Main Building", "Kitchen", "Gallery",
  "Entry Pavilion", "Makers Pergola", "Heavy Art Space", "Parking",
];

function DrawingRevealSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewImage, setViewImage] = useState<string | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <>
      <section style={{
        position: "relative",
        height: "100vh",
        backgroundColor: "#0C0A09",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Slideshow bg */}
        {slideshowImages.map((src, i) => (
          <motion.div
            key={src}
            style={{ position: "absolute", inset: 0 }}
            initial={false}
            animate={{ opacity: currentSlide === i ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </motion.div>
        ))}

        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0C0A09, rgba(12,10,9,0.7), rgba(12,10,9,0.4))" }} />

        {/* Rolling names */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", width: "100%", height: "100%", padding: "0 32px" }}>
          <div style={{ width: "50%" }}>
            <FadeOnly>
              <p style={{ ...sectionNumStyle, marginBottom: 24 }}>What We're Growing</p>
            </FadeOnly>
            <div style={{ height: "50vh", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 64, background: "linear-gradient(to bottom, #0C0A09, transparent)", zIndex: 10 }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 64, background: "linear-gradient(to top, #0C0A09, transparent)", zIndex: 10 }} />
              <motion.div
                animate={{ y: ["0%", "-100%"] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ paddingTop: 32, paddingBottom: 32 }}
              >
                {[...drawingElements, ...drawingElements].map((name, i) => (
                  <p key={`${name}-${i}`} style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "clamp(24px, 4vw, 48px)",
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: 1.3,
                    margin: "16px 0",
                  }}>
                    {name}
                  </p>
                ))}
              </motion.div>
            </div>
            <FadeOnly>
              <p style={{ color: "#57534E", fontFamily: "monospace", fontSize: 12, letterSpacing: "0.1em", marginTop: 24 }}>
                Twenty-four ideas · One hand-drawn plan · Everything possible
              </p>
            </FadeOnly>
          </div>
        </div>

        {/* Slide dots */}
        <div style={{ position: "absolute", bottom: 32, right: 32, display: "flex", gap: 8, zIndex: 10 }}>
          {slideshowImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                height: 6,
                width: currentSlide === i ? 24 : 6,
                borderRadius: 3,
                backgroundColor: currentSlide === i ? "#D97706" : "#44403C",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setViewImage(slideshowImages[currentSlide])}
          style={{
            position: "absolute",
            bottom: 32,
            left: 32,
            zIndex: 10,
            padding: "8px 16px",
            fontFamily: "monospace",
            fontSize: 12,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            border: "1px solid #57534E",
            backgroundColor: "rgba(12,10,9,0.8)",
            backdropFilter: "blur(4px)",
            color: "#A8A29E",
            cursor: "pointer",
            borderRadius: 20,
          }}
        >
          View Current Layer
        </button>
      </section>

      {viewImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "#F5F5F0", display: "flex", flexDirection: "column" }}
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 24px", backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)",
            borderBottom: "1px solid #E5E5E0",
          }}>
            <p style={{ fontFamily: "monospace", fontSize: 14, color: "#57534E", margin: 0 }}>
              Layer {slideshowImages.indexOf(viewImage) + 1} of {slideshowImages.length}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setViewImage(slideshowImages[(slideshowImages.indexOf(viewImage) - 1 + slideshowImages.length) % slideshowImages.length])} style={viewerBtn}>Prev</button>
              <button onClick={() => setViewImage(slideshowImages[(slideshowImages.indexOf(viewImage) + 1) % slideshowImages.length])} style={viewerBtn}>Next</button>
              <button onClick={() => setViewImage(null)} style={viewerBtn}>Close</button>
            </div>
          </div>
          <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <img src={viewImage} alt="" style={{ maxWidth: "none", width: "95vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }} />
          </div>
        </motion.div>
      )}
    </>
  );
}

/* ─────────────────────────────────────
   MAIN PAGE
   ───────────────────────────────────── */

export default function Compendium() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div style={{ backgroundColor: "#0C0A09" }}>
      {/* Progress bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: "rgba(217,169,78,0.8)",
          zIndex: 60,
          transformOrigin: "left",
          width: progressWidth,
        }}
      />

      {/* ═══════════ COVER ═══════════ */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: "#0C0A09",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <video autoPlay muted loop playsInline poster="/images/compendium/hero-aerial.jpg"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}>
            <source src="/images/compendium/hero-aerial.mp4" type="video/mp4" />
          </video>
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(12,10,9,0.70)" }} />
        </div>

        <div style={{ position: "relative", textAlign: "center", padding: "0 24px" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
            <p style={{
              color: "rgba(217,169,78,0.7)",
              fontFamily: "monospace",
              fontSize: isMobile ? 11 : 14,
              letterSpacing: "0.4em",
              textTransform: "uppercase" as const,
              marginBottom: 40,
            }}>
              A Curious Tractor · Witta · Jinibara Country
            </p>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: isMobile ? "clamp(40px, 10vw, 56px)" : "clamp(56px, 7vw, 96px)",
              color: "white",
              margin: "0 0 32px",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}>
              The Harvest<br />
              <span style={{ color: "rgba(217,169,78,1)" }}>Compendium</span>
            </h1>

            <div style={{ maxWidth: 480, margin: "16px auto 0" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px 40px",
                textAlign: "left",
              }}>
                {[
                  { num: "I", title: "The Silence" },
                  { num: "II", title: "The Shed" },
                  { num: "III", title: "The Seed" },
                  { num: "IV", title: "The Cycle" },
                  { num: "V", title: "The Canvas" },
                  { num: "VI", title: "The Garden" },
                  { num: "VII", title: "The Table" },
                  { num: "VIII", title: "The Commons" },
                  { num: "IX", title: "The Handover" },
                ].map((ch) => (
                  <div key={ch.num} style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span style={{ color: "rgba(217,169,78,0.5)", fontFamily: "monospace", fontSize: 12, letterSpacing: "0.15em" }}>
                      {ch.num}
                    </span>
                    <span style={{ color: "#A8A29E", fontFamily: "'Playfair Display', serif", fontSize: 14, letterSpacing: "0.04em" }}>
                      {ch.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#57534E" }}
          >
            <span style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>Scroll</span>
            <span style={{ fontSize: 16 }}>↓</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════ I. THE SILENCE ═══════════ */}
      <CompendiumSection
        number="I"
        title="The Silence"
        declaration="Witta has nowhere to gather."
        principleLabel="ACT Principle 1"
        principle="Country sets the pace — but the land is waiting for something to happen on it."
      >
        <p>Two thousand cars pass through every weekend. One cafe. No gathering place. The hinterland is hollowing out — people drive through but never stop.</p>
        <p>The silence isn't peace. It's absence.</p>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: 24,
          margin: "32px 0",
        }}>
          {[
            { value: "2,000+", label: "cars every weekend" },
            { value: "One", label: "cafe — no gathering place" },
            { value: "#1", label: "homeschooling rate in AU" },
            { value: "10 min", label: "from Maleny — a world away" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: isMobile ? 24 : 28, color: "rgba(217,169,78,1)", margin: 0 }}>
                {stat.value}
              </p>
              <p style={{ color: "#78716C", fontSize: 12, marginTop: 4 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </CompendiumSection>

      {/* ═══════════ II. THE SHED ═══════════ */}
      <ShedSection />

      {/* ═══════════ III. THE SEED ═══════════ */}
      <CompendiumSection
        number="III"
        title="The Seed"
        declaration="We believe food is infrastructure. A table is a civic space. Compost is a philosophy."
        principleLabel="ACT Principle 3"
        principle="Identity before product — we start with belonging, not features."
        dark={false}
        visual={
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 24 }}>
            {[
              { name: "Eat", desc: "A daily act of showing up", color: "#D97706" },
              { name: "Gather", desc: "Where neighbours become community", color: "#16A34A" },
              { name: "Make", desc: "An invitation to create together", color: "#57534E" },
              { name: "Grow", desc: "Time made visible", color: "#059669" },
            ].map((pillar) => (
              <div key={pillar.name} style={{ textAlign: "center" }}>
                <div style={{
                  height: 64, width: 64, borderRadius: 16,
                  backgroundColor: pillar.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 12px",
                }}>
                  <span style={{ color: "white", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20 }}>
                    {pillar.name[0]}
                  </span>
                </div>
                <p style={{ color: "white", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, margin: 0 }}>
                  {pillar.name}
                </p>
                <p style={{ color: "#78716C", fontSize: 12, marginTop: 4 }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        }
      >
        <p>Four seeds: <strong style={{ color: "white" }}>Eat. Gather. Make. Grow.</strong> Not services — beliefs.</p>
        <p>A cafe is not a business; it's a daily act of showing up. A workshop is not a product; it's an invitation to make something together. A garden is not decoration; it's time made visible.</p>
      </CompendiumSection>

      {/* ═══════════ IV. THE CYCLE ═══════════ */}
      <CompendiumSection
        number="IV"
        title="The Cycle"
        declaration="From seedling to harvest to compost — and back again."
        principleLabel="ACT Principle 10"
        principle="Art returns us to Listen — the loop only completes when change becomes culture."
        bgVideo={{ src: "/images/compendium/oyster-lease.mp4", poster: "/images/compendium/oyster-lease-poster.jpg" }}
      >
        <p>Shaun Fisher is a Goenpul man — one of the three clans of the Quandamooka People, Traditional Owners of Minjerribah (North Stradbroke Island) and the southern Moreton Bay. The Yoolooburrabee — people of the sand and sea. The quampi shell is their totem, their food source, their cultural symbol.</p>
        <p>When colonizers arrived in Brisbane, they blew up the Quandamooka oyster leases for limestone. The Treasury building, the banks, the foundations of the city — built from those shells.</p>
        <p>At The Harvest, Shaun sells oysters direct to community. People eat on picnic blankets on the grass. The shells are collected and worked into benchtops, surfaces, and finishes throughout The Harvest. Everything here is compostable, reusable, returned. <strong style={{ color: "white" }}>The shells come back into the place. Full cycle.</strong></p>
        <p style={{ color: "#A8A29E", fontSize: 16, fontStyle: "italic" }}>This is just one example of what we're working to do at The Harvest — every material, every relationship, every exchange designed to complete the loop.</p>
        <div style={{ borderLeft: "2px solid #44403C", paddingLeft: 24, margin: "32px 0" }}>
          <p style={{ color: "#A8A29E", fontSize: 16, lineHeight: 1.7 }}>
            This is LCAA made physical: <strong style={{ color: "#D6D3D1" }}>Listen</strong> to the land and its people. <strong style={{ color: "#D6D3D1" }}>Curiosity</strong> about what's possible. <strong style={{ color: "#D6D3D1" }}>Action</strong> — build it together. <strong style={{ color: "#D6D3D1" }}>Art</strong> — make the change felt. Art returns us to Listen.
          </p>
        </div>
      </CompendiumSection>

      {/* ═══════════ V. THE CANVAS ═══════════ */}
      <CanvasSection />

      {/* ═══════════ V½. THE DRAWING ═══════════ */}
      <DrawingRevealSection />

      {/* ═══════════ VI. THE GARDEN ═══════════ */}
      <CompendiumSection
        number="VI"
        title="The Garden"
        declaration="Dig in. Take something home. Leave something behind."
        principleLabel="ACT Principle 7"
        principle="Grow what you eat, eat what you grow — the garden is the commons made visible."
        dark={false}
        visual={
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 24 : 16 }}>
            {[
              { time: "Morning", feel: "Dew on seedlings. Someone's already weeding. A kid is watering the strawberries with a hose that's too big for her." },
              { time: "Afternoon", feel: "Quiet. Bees working. A homeschool group is drawing insects. The basil smells like it's trying to get your attention." },
              { time: "Saturday", feel: "Farmgate day. Tables of produce, seedlings in recycled pots, eggs from up the road, bread still warm." },
            ].map((moment) => (
              <div key={moment.time} style={{ textAlign: "center" }}>
                <p style={{ color: "rgba(217,169,78,1)", fontFamily: "monospace", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: 8 }}>
                  {moment.time}
                </p>
                <p style={{ color: "#78716C", fontSize: 14, lineHeight: 1.7, fontStyle: "italic" }}>
                  {moment.feel}
                </p>
              </div>
            ))}
          </div>
        }
      >
        <p>This was a nursery once. The bones are still here — the shade cloth frames, the irrigation lines, the propagation benches. We're not building a garden from scratch. We're waking one up.</p>
        <p><strong style={{ color: "white" }}>The garden is not decorative.</strong> It feeds the kitchen. It teaches the kids. It gives the homeschool families a classroom that smells like dirt and basil instead of carpet and whiteboard markers. Witta has the highest homeschooling rate in Australia — and no learning infrastructure. The garden changes that.</p>
        <p>You can dig in. Plant a seedling. Pull a carrot. Take home herbs in a paper bag, a punnet of strawberries, a sourdough starter from the kitchen. Or just sit on the bench and watch someone else do the work. Both are fine.</p>
        <p style={{ color: "rgba(217,169,78,0.8)", fontStyle: "italic", fontFamily: "'Playfair Display', serif" }}>
          The garden is time made visible. Everything here was planted by someone, for someone. You eat what the last season grew. You plant what the next season needs.
        </p>
      </CompendiumSection>

      {/* ═══════════ VII. THE TABLE ═══════════ */}
      <CompendiumSection
        number="VII"
        title="The Table"
        declaration="Building for people who want to belong without having to perform."
        principleLabel="ACT Principle 5"
        principle="Make with lived experience — lived experience is core capability. We hire, train, and design around those who carry the truth."
      >
        <p>Not a meeting room. Not a Zoom call. Not a networking event with name tags. A table with food on it, made from what grows here.</p>
        <p>The farmer sits next to the architect sits next to the kid who just wants a milkshake. Nobody has to explain why they're here. Nobody has to pitch anything. You just sit down and eat.</p>
        <p>Shaun's oysters. Pizza from the trailer. Picnic blankets on the grass. That's the whole beginning. No grand opening. No ribbon cutting. <strong style={{ color: "white" }}>Just food, and the people who show up for it.</strong></p>
        <p style={{ color: "#A8A29E", fontSize: 16, fontStyle: "italic" }}>If that works — if people come back, if they bring someone, if they start saying "see you next week" — then everything else follows. The cafe. The garden. The workshops. The market. All of it grows from the table.</p>
      </CompendiumSection>

      {/* ═══════════ VIII. THE COMMONS ═══════════ */}
      <CompendiumSection
        number="VIII"
        title="The Commons"
        declaration="Not a venue. A platform. The connective tissue of the hinterland."
        principleLabel="ACT Principle 6"
        principle="Enterprise funds the commons — goods, harvest, and enterprise fund land care and community value, not extraction."
        dark={false}
      >
        <p>The Sunshine Coast hinterland is full of people making things. Farmers, bakers, potters, fermenters, weavers, builders, growers. Most of them sell from their driveways or at distant markets. There's no central place where the hinterland economy can show up as itself.</p>
        <p><strong style={{ color: "white" }}>The Harvest is that place.</strong> Not by owning the supply chain — by being the table everyone brings their dish to. Local producers come here to sell, teach, collaborate. The farmer from down the road brings eggs. The baker from Maleny brings sourdough. Shaun brings oysters from Minjerribah. The kid from next door brings a jar of honey.</p>
        <p>This isn't a food court. It's a commons — a shared space where the hinterland's scattered economy can gather, find each other, and build something together that none of them could build alone.</p>
        <p>Every dollar that moves through The Harvest stays local. Every relationship that forms here strengthens the web. The enterprise funds the commons — not shareholders, not landlords, not a head office in Sydney. <strong style={{ color: "white" }}>The wealth stays where the work happens.</strong></p>
      </CompendiumSection>

      {/* ═══════════ IX. THE HANDOVER ═══════════ */}
      <CompendiumSection
        number="IX"
        title="The Handover"
        declaration="Beautiful Obsolescence. Not an ending — a rebirth."
        principleLabel="ACT Principle 4"
        principle="Build for handover — design for transfer from day one. Our success is measured by our irrelevance."
        visual={
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute",
              top: 24,
              left: 0,
              right: 0,
              height: 1,
              background: "linear-gradient(to right, rgba(217,169,78,0.6), rgba(217,169,78,0.4), rgba(217,169,78,0.2))",
            }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: isMobile ? 16 : 32 }}>
              {[
                { year: "Year 1", theme: "Plant", detail: "Pop-ups, first markets, the table. Prove it can live." },
                { year: "Year 2", theme: "Root", detail: "Train local operators. Document the playbook. Let the community lead." },
                { year: "Year 3", theme: "Release", detail: "Ready to be handed over. Ready to redefine itself." },
              ].map((phase, i) => (
                <div key={phase.year} style={{ textAlign: "center", paddingTop: 40 }}>
                  <div style={{
                    position: "absolute",
                    top: 18,
                    left: `${i * 50 + (100 / 6)}%`,
                    height: 12,
                    width: 12,
                    borderRadius: "50%",
                    backgroundColor: "#D97706",
                    border: "2px solid #1C1917",
                  }} />
                  <p style={{ color: "rgba(217,169,78,1)", fontFamily: "monospace", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: 8 }}>
                    {phase.year}
                  </p>
                  <p style={{ color: "white", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
                    {phase.theme}
                  </p>
                  <p style={{ color: "#78716C", fontSize: 14, lineHeight: 1.6 }}>
                    {phase.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <p>We call it Beautiful Obsolescence. Not because we walk away — but because we build something that's ready to become whatever it needs to be next.</p>
        <p>Maybe it's us in Year 4. Maybe it's not. What matters is that the community and the land set the pace — not a business plan, not a board, not an investor's timeline. <strong style={{ color: "white" }}>The Harvest redefines itself. That's the design.</strong></p>
        <p>Every system we build is ready to be handed over. Every role is documented so someone local can step in. Every decision is written down so it can be questioned, changed, or thrown out entirely.</p>
        <p>A Curious Tractor is exactly that — a tractor. A PTO shaft that transfers power, not holds it. We don't drive. We prepare the ground and let what grows, grow.</p>
        <p style={{ color: "rgba(217,169,78,0.8)", fontStyle: "italic", fontFamily: "'Playfair Display', serif", fontSize: 20, lineHeight: 1.6 }}>
          The Harvest belongs to Witta. Not as an exit strategy — as a living thing that sheds its skin, season after season, and becomes what the land and its people ask it to be.
        </p>
      </CompendiumSection>

      {/* ═══════════ CLOSING ═══════════ */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: "#0C0A09",
      }}>
        <div style={{ padding: "0 24px" }}>
          <FadeIn>
            <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
              <p style={{
                color: "rgba(217,169,78,0.6)",
                fontFamily: "monospace",
                fontSize: 12,
                letterSpacing: "0.4em",
                textTransform: "uppercase" as const,
                marginBottom: 40,
              }}>
                The Invitation
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(28px, 5vw, 56px)",
                color: "white",
                lineHeight: 1.15,
                marginBottom: 32,
              }}>
                Come to the table.
              </h2>
              <p style={{
                fontSize: 18,
                color: "#A8A29E",
                lineHeight: 1.7,
                marginBottom: 48,
              }}>
                The Harvest isn't a pitch. It's an invitation. Walk the site. Eat something good. Sit at the table. If it feels right, help us build the next chapter.
              </p>
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 16, justifyContent: "center", marginBottom: 48 }}>
                <Link href="/contact" style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.1em",
                  color: "#1A1A1A",
                  backgroundColor: "#F2C900",
                  padding: "16px 32px",
                  textDecoration: "none",
                  textAlign: "center",
                }}>
                  GET IN TOUCH
                </Link>
                <Link href="/gather" style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.1em",
                  color: "#D6D3D1",
                  border: "1px solid #44403C",
                  padding: "16px 32px",
                  textDecoration: "none",
                  textAlign: "center",
                }}>
                  FIRST GATHERING
                </Link>
              </div>

              <p style={{ color: "#44403C", fontFamily: "monospace", fontSize: 12, letterSpacing: "0.15em", marginTop: 64 }}>
                hello@theharvestwitta.com.au
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <BauhausFooter isMobile={isMobile} />

      {/* Print styles */}
      <style>{`
        @media print {
          header, footer, nav, button { display: none !important; }
          section { background: white !important; color: black !important; padding: 2rem 0 !important; min-height: auto !important; }
          h1, h2, h3, p, li, span, blockquote, strong { color: black !important; }
          img { max-width: 100% !important; page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────
   SHARED STYLES
   ───────────────────────────────────── */

const sectionNumStyle: CSSProperties = {
  color: "rgba(217,169,78,0.6)",
  fontFamily: "monospace",
  fontSize: 14,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  marginBottom: 32,
};

const sectionTitleStyle: CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontWeight: 700,
  fontSize: "clamp(22px, 3vw, 28px)",
  color: "#A8A29E",
  marginBottom: 24,
  letterSpacing: "0.04em",
};

const declarationStyle: CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontWeight: 700,
  fontSize: "clamp(28px, 5vw, 56px)",
  color: "white",
  lineHeight: 1.15,
  marginBottom: 40,
};

const bodyStyle: CSSProperties = {
  fontSize: "clamp(16px, 1.8vw, 20px)",
  color: "#D6D3D1",
  lineHeight: 1.7,
  marginBottom: 48,
};

const principleBox: CSSProperties = {
  borderLeft: "2px solid rgba(217,169,78,0.4)",
  paddingLeft: 24,
  marginTop: 48,
};

const principleLabelStyle: CSSProperties = {
  color: "rgba(217,169,78,0.7)",
  fontFamily: "monospace",
  fontSize: 12,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  marginBottom: 4,
};

const principleTextStyle: CSSProperties = {
  color: "#A8A29E",
  fontStyle: "italic",
  fontFamily: "'Playfair Display', serif",
  fontSize: 16,
  margin: 0,
};

const quoteBox: CSSProperties = {
  borderLeft: "2px solid rgba(217,169,78,0.4)",
  paddingLeft: 24,
  marginBottom: 40,
};

const quoteText: CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontStyle: "italic",
  fontSize: "clamp(18px, 2.5vw, 24px)",
  color: "white",
  lineHeight: 1.6,
  marginBottom: 12,
};

const quoteAttrib: CSSProperties = {
  fontFamily: "monospace",
  fontSize: 14,
  color: "#78716C",
  margin: 0,
};

const viewerBtn: CSSProperties = {
  padding: "6px 12px",
  fontFamily: "monospace",
  fontSize: 12,
  border: "1px solid #D6D3D1",
  backgroundColor: "transparent",
  color: "#57534E",
  cursor: "pointer",
  borderRadius: 20,
};
