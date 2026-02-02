import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: "easeOut" },
};

const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 1, ease: "easeOut" },
};

interface SectionProps {
  number: string;
  title: string;
  declaration: string;
  children: React.ReactNode;
  principle: string;
  principleLabel: string;
  bg?: string;
  visual?: React.ReactNode;
  bgVideo?: { src: string; poster: string };
}

function CanvasSection() {
  const [showDrawing, setShowDrawing] = useState(false);

  return (
    <>
      {/* ── Text section with Ken Burns drawing behind ── */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-stone-900">
        {/* Slow pan across the drawing */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src="/images/compendium/canvas-drawing-dark.jpg"
            alt=""
            className="absolute w-[140%] max-w-none h-[140%] object-cover"
            animate={{
              x: ["-10%", "-25%", "-10%"],
              y: ["-5%", "-12%", "-5%"],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="absolute inset-0 bg-stone-900/80" />
        </div>

        <div className="container relative px-6 md:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto">
            <motion.p
              {...fadeIn}
              className="text-amber-500/60 text-sm font-mono tracking-[0.3em] uppercase mb-8"
            >
              V
            </motion.p>

            <motion.h2
              {...fadeInUp}
              className="text-2xl md:text-3xl font-serif font-bold text-stone-400 mb-6 tracking-wide"
            >
              The Canvas
            </motion.h2>

            <motion.blockquote
              {...fadeInUp}
              className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.15] mb-10"
            >
              Gallery, not museum. Nothing permanent. Always evolving.
            </motion.blockquote>

            <motion.div
              {...fadeInUp}
              className="text-lg md:text-xl text-stone-300 leading-relaxed space-y-6 mb-12"
            >
              <p>
                The building is an old nursery — shed bones, good light, room to
                move. We don't renovate it into a finished product. We treat it
                like a gallery: exhibitions come and go, the walls get repainted,
                the furniture moves.
              </p>
              <p>
                <strong className="text-white">Test before you build.</strong>{" "}
                Pop-ups before capital. Oyster nights before a restaurant. Pizza
                from a trailer before a kitchen. The scaffold pavilion before the
                permanent structure.
              </p>
              <p className="text-amber-400/80 font-serif italic">
                You're not coming to something finished — you're coming to
                something you can be part of.
              </p>
            </motion.div>

            <motion.div {...fadeInUp}>
              <button
                onClick={() => setShowDrawing(true)}
                className="group flex items-center gap-3 px-6 py-4 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
              >
                <span className="text-amber-400 font-serif font-bold text-lg">
                  See the Full Drawing
                </span>
                <ArrowRight className="h-5 w-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              {...fadeIn}
              className="border-l-2 border-amber-500/40 pl-6 mt-12"
            >
              <p className="text-sm text-amber-500/70 font-mono tracking-wider uppercase mb-1">
                ACT Principle 4
              </p>
              <p className="text-base text-stone-400 italic font-serif">
                Build for handover (Beautiful Obsolescence) — design for transfer from
                day one.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Fullscreen drawing viewer ── */}
      {showDrawing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-stone-100 flex flex-col"
        >
          {/* Minimal top bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-stone-200 shrink-0">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-800">
                The Harvest — Master Plan
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Hand-drawn site plan &middot; Morpholio Trace
              </p>
            </div>
            <button
              onClick={() => setShowDrawing(false)}
              className="px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Close
            </button>
          </div>

          {/* Scrollable/zoomable drawing */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4 md:p-8">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              src="/images/compendium/canvas-drawing-full.jpg"
              alt="The Harvest — hand-drawn master plan showing community gathering spaces, garden beds, main building, pizza oven, kids play area, entry portal, and outdoor art spaces"
              className="max-w-none w-[95vw] md:w-auto md:max-h-[85vh] rounded-lg shadow-2xl"
            />
          </div>
        </motion.div>
      )}
    </>
  );
}

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

  return (
    <>
      <section className="min-h-screen relative overflow-hidden bg-stone-950">
        {/* Photo background — crossfade slideshow */}
        {barryImages.map((img, i) => (
          <motion.div
            key={img.src}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: currentPhoto === i ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <img
              src={img.src}
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}

        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />

        {/* Content */}
        <div className="relative z-10 flex items-center min-h-screen">
          <div className="container px-6 md:px-8 py-20 md:py-28">
            <div className="max-w-2xl">
              <motion.p
                {...fadeIn}
                className="text-amber-500/60 text-sm font-mono tracking-[0.3em] uppercase mb-8"
              >
                II
              </motion.p>

              <motion.h2
                {...fadeInUp}
                className="text-2xl md:text-3xl font-serif font-bold text-stone-400 mb-6 tracking-wide"
              >
                The Shed
              </motion.h2>

              <motion.blockquote
                {...fadeInUp}
                className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.15] mb-10"
              >
                Before there was a harvest, there was a shed.
              </motion.blockquote>

              <motion.div
                {...fadeInUp}
                className="text-lg md:text-xl text-stone-300 leading-relaxed space-y-6 mb-10"
              >
                <p>
                  Barry Rodgerig is 80 years old. He's been on this land since 1972.
                  Before that, Peachester — 25 years of dairy, timber, and red soil.
                  He drove tractors before he could see over the steering wheel. He
                  still drives them now.
                </p>
                <p>
                  His shed is full of machines that built this hinterland. An AB184 log
                  truck from 1963. Ex-army Blitz trucks from the war. A little Italian
                  Valpadana tractor with a Lombardini diesel. A 1957 Land Rover he'd
                  like to restore, if he lives long enough.
                </p>
                <p>
                  He starts them up sometimes, just to hear them run.
                </p>
              </motion.div>

              {/* Barry quote */}
              <motion.div
                {...fadeInUp}
                className="border-l-2 border-amber-500/40 pl-6 mb-10"
              >
                <p className="text-xl md:text-2xl text-white font-serif italic leading-relaxed mb-3">
                  "Rust is a terrible thing. It's just like cancer in humans. It eats. It just kills you."
                </p>
                <p className="text-sm text-stone-500 font-mono">— Barry Rodgerig, Witta</p>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="text-lg md:text-xl text-stone-300 leading-relaxed space-y-6 mb-10"
              >
                <p>
                  The cedar-getters came first, after the Jinibara. Then dairy. Then
                  timber trucks grinding through red mud to Strathpine. Barry watched
                  the hippies shut down the logging at Crystal Waters. He watched the
                  government finish the job. He watched the hinterland turn from
                  working country into scenic drive.
                </p>
                <p>
                  <strong className="text-white">
                    The Harvest is built on layers.
                  </strong>{" "}
                  Jinibara Country first. Then cedar. Then dairy. Then nursery. Now
                  this. Every rusted blade and milk separator in Barry's shed is a
                  chapter. The land remembers what was here before.
                </p>
              </motion.div>

              {/* Second quote */}
              <motion.div
                {...fadeInUp}
                className="border-l-2 border-amber-500/40 pl-6 mb-10"
              >
                <p className="text-xl md:text-2xl text-white font-serif italic leading-relaxed mb-3">
                  "I think when I die, it'll probably all go for scrap."
                </p>
                <p className="text-sm text-stone-500 font-mono">— Barry</p>
              </motion.div>

              <motion.div
                {...fadeInUp}
                className="text-lg text-stone-400 leading-relaxed space-y-4"
              >
                <p>
                  Not if we can help it. Barry's shed isn't scrap — it's archaeology.
                  It's the living memory of what this place was, and the reason why
                  what we build next has to mean something.
                </p>
                <p>
                  Barry is one neighbour. There are more. Every person who lives
                  around this land carries a piece of its story — and The Harvest
                  exists to make sure those stories aren't forgotten.
                </p>
                <p className="text-amber-400/80 font-serif italic">
                  Four Blue Heelers. Always called Samantha. "You never have two the
                  same."
                </p>
              </motion.div>

              {/* ACT Principle */}
              <motion.div
                {...fadeIn}
                className="border-l-2 border-amber-500/40 pl-6 mt-12"
              >
                <p className="text-sm text-amber-500/70 font-mono tracking-wider uppercase mb-1">
                  ACT Principle 2
                </p>
                <p className="text-base text-stone-400 italic font-serif">
                  Listen before you build — every place has a story already being told.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Photo navigation */}
        <div className="absolute bottom-6 md:bottom-8 left-4 md:left-8 right-4 md:right-8 z-10">
          {/* Caption */}
          <div className="mb-3">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPhoto}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-stone-500 text-xs font-mono truncate"
              >
                {barryImages[currentPhoto].caption}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={prevPhoto}
                className="p-2 rounded-full border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500 transition-colors bg-stone-950/60 backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextPhoto}
                className="p-2 rounded-full border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500 transition-colors bg-stone-950/60 backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="text-stone-600 text-xs font-mono ml-1">
                {currentPhoto + 1}/{barryImages.length}
              </span>
            </div>

            {/* Dots — hidden on mobile, shown on md+ */}
            <div className="hidden md:flex gap-1.5">
              {barryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPhoto(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentPhoto === i
                      ? "w-5 bg-amber-500"
                      : "w-1.5 bg-stone-700 hover:bg-stone-500"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setViewPhoto(currentPhoto)}
              className="px-3 py-1.5 text-xs font-mono tracking-wider uppercase rounded-full border border-stone-600 text-stone-400 hover:text-white hover:border-stone-400 transition-colors bg-stone-950/60 backdrop-blur-sm"
            >
              View
            </button>
          </div>
        </div>
      </section>

      {/* Fullscreen photo viewer */}
      {viewPhoto !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-stone-950 flex flex-col"
        >
          <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-stone-900/90 backdrop-blur-sm border-b border-stone-800 shrink-0">
            <p className="text-xs md:text-sm font-mono text-stone-400 truncate flex-1 min-w-0 mr-3">
              {viewPhoto + 1}/{barryImages.length} — {barryImages[viewPhoto].caption}
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setViewPhoto((viewPhoto - 1 + barryImages.length) % barryImages.length)}
                className="p-2 rounded-full border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewPhoto((viewPhoto + 1) % barryImages.length)}
                className="p-2 rounded-full border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewPhoto(null)}
                className="px-3 py-1.5 text-xs font-mono rounded-full border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500"
              >
                Close
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            <img
              src={barryImages[viewPhoto].src}
              alt={barryImages[viewPhoto].caption}
              className="max-w-none w-[95vw] md:w-auto md:max-h-[85vh] rounded-lg"
            />
          </div>
        </motion.div>
      )}
    </>
  );
}

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
  "Kids Play",
  "Pizza Oven",
  "Fire Pit & BBQ",
  "Chill Under the Trees",
  "Pop-Up Shops",
  "Gardeners Shed",
  "Bike Station",
  "Cafe",
  "Seedlings & Bathing",
  "Water Features",
  "Art Features",
  "Entry Portal",
  "Community Gathering",
  "Garden Beds",
  "Tea Station",
  "Mulch Station",
  "Shaded Tables",
  "Main Building",
  "Kitchen",
  "Gallery",
  "Entry Pavilion",
  "Makers Pergola",
  "Heavy Art Space",
  "Parking",
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
      <section className="relative h-screen bg-stone-950 overflow-hidden flex items-center justify-center">
        {/* Slideshow background */}
        {slideshowImages.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: currentSlide === i ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-contain"
            />
          </motion.div>
        ))}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-stone-950/40" />

        {/* Rolling element names — left side */}
        <div className="relative z-10 flex items-center w-full h-full px-8 md:px-16">
          <div className="w-full md:w-1/2">
            <motion.p
              {...fadeIn}
              className="text-amber-500/60 text-xs font-mono tracking-[0.4em] uppercase mb-6"
            >
              What We're Growing
            </motion.p>

            <div className="h-[50vh] overflow-hidden relative">
              {/* Fade edges */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-stone-950 to-transparent z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-950 to-transparent z-10" />

              <motion.div
                animate={{ y: ["0%", "-100%"] }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="space-y-4 py-8"
              >
                {/* Double the list for seamless loop */}
                {[...drawingElements, ...drawingElements].map((name, i) => (
                  <p
                    key={`${name}-${i}`}
                    className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white/90 leading-tight"
                  >
                    {name}
                  </p>
                ))}
              </motion.div>
            </div>

            <motion.p
              {...fadeIn}
              className="text-stone-600 text-xs font-mono tracking-wider mt-6"
            >
              Twenty-four ideas &middot; One hand-drawn plan &middot; Everything possible
            </motion.p>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 right-8 flex gap-2 z-10">
          {slideshowImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === i
                  ? "w-6 bg-amber-500"
                  : "w-1.5 bg-stone-700 hover:bg-stone-500"
              }`}
            />
          ))}
        </div>

        {/* View drawing button */}
        <button
          onClick={() => setViewImage(slideshowImages[currentSlide])}
          className="absolute bottom-8 left-8 md:left-auto md:right-24 z-10 px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-full border border-stone-600 text-stone-400 hover:text-white hover:border-stone-400 transition-colors bg-stone-950/80 backdrop-blur-sm"
        >
          View Current Layer
        </button>
      </section>

      {/* Fullscreen image viewer */}
      {viewImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-stone-100 flex flex-col"
        >
          <div className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-stone-200 shrink-0">
            <p className="text-sm font-mono text-stone-600">
              Layer {slideshowImages.indexOf(viewImage) + 1} of {slideshowImages.length}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setViewImage(slideshowImages[(slideshowImages.indexOf(viewImage) - 1 + slideshowImages.length) % slideshowImages.length])}
                className="px-3 py-1.5 text-xs font-mono rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
              >
                Prev
              </button>
              <button
                onClick={() => setViewImage(slideshowImages[(slideshowImages.indexOf(viewImage) + 1) % slideshowImages.length])}
                className="px-3 py-1.5 text-xs font-mono rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
              >
                Next
              </button>
              <button
                onClick={() => setViewImage(null)}
                className="px-3 py-1.5 text-xs font-mono rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
              >
                Close
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            <img
              src={viewImage}
              alt=""
              className="max-w-none w-[95vw] md:w-auto md:max-h-[85vh] rounded-lg shadow-xl"
            />
          </div>
        </motion.div>
      )}
    </>
  );
}

function CompendiumSection({
  number,
  title,
  declaration,
  children,
  principle,
  principleLabel,
  bg = "bg-stone-950",
  visual,
  bgVideo,
}: SectionProps) {
  return (
    <section
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${bg}`}
    >
      {bgVideo && (
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={bgVideo.poster}
            className="w-full h-full object-cover"
          >
            <source src={bgVideo.src} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-stone-950/75" />
        </div>
      )}
      <div className="container relative px-6 md:px-8 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          {/* Section number */}
          <motion.p
            {...fadeIn}
            className="text-amber-500/60 text-sm font-mono tracking-[0.3em] uppercase mb-8"
          >
            {number}
          </motion.p>

          {/* Title */}
          <motion.h2
            {...fadeInUp}
            className="text-2xl md:text-3xl font-serif font-bold text-stone-400 mb-6 tracking-wide"
          >
            {title}
          </motion.h2>

          {/* Declaration */}
          <motion.blockquote
            {...fadeInUp}
            className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.15] mb-10"
          >
            {declaration}
          </motion.blockquote>

          {/* Body */}
          <motion.div
            {...fadeInUp}
            className="text-lg md:text-xl text-stone-300 leading-relaxed space-y-6 mb-12"
          >
            {children}
          </motion.div>

          {/* Visual */}
          {visual && (
            <motion.div {...fadeIn} className="mb-12">
              {visual}
            </motion.div>
          )}

          {/* ACT Principle */}
          <motion.div
            {...fadeIn}
            className="border-l-2 border-amber-500/40 pl-6"
          >
            <p className="text-sm text-amber-500/70 font-mono tracking-wider uppercase mb-1">
              {principleLabel}
            </p>
            <p className="text-base text-stone-400 italic font-serif">
              {principle}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Compendium() {
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="compendium-page">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-amber-500/80 z-[60] origin-left"
        style={{ width: progressWidth }}
      />

      {/* Sections */}
      <div>
        {/* ═══════════ COVER ═══════════ */}
        <section className="min-h-screen flex items-center justify-center relative bg-stone-950 overflow-hidden">
          {/* Drone aerial video background */}
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/images/compendium/hero-aerial.jpg"
              className="w-full h-full object-cover"
            >
              <source src="/images/compendium/hero-aerial.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-stone-950/70" />
          </div>

          <div className="container relative text-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <p className="text-amber-500/70 text-xs md:text-sm font-mono tracking-[0.4em] uppercase mb-10">
                A Curious Tractor &middot; Witta &middot; Jinibara Country
              </p>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 leading-[1.05] tracking-tight">
                The Harvest
                <br />
                <span className="text-amber-400">Compendium</span>
              </h1>

              <div className="max-w-lg mx-auto mt-4">
                <div className="grid grid-cols-3 md:grid-cols-3 gap-x-10 gap-y-3 text-left">
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
                    <div key={ch.num} className="flex items-baseline gap-3">
                      <span className="text-amber-500/50 font-mono text-xs tracking-widest">
                        {ch.num}
                      </span>
                      <span className="text-stone-400 font-serif text-sm tracking-wide">
                        {ch.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center gap-2 text-stone-600"
            >
              <span className="text-xs font-mono tracking-wider uppercase">
                Scroll
              </span>
              <ChevronDown className="h-4 w-4" />
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
          <p>
            Two thousand cars pass through every weekend. One cafe. No
            gathering place. The hinterland is hollowing out — people drive
            through but never stop.
          </p>
          <p>The silence isn't peace. It's absence.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-8">
            {[
              { value: "2,000+", label: "cars every weekend" },
              { value: "One", label: "cafe — no gathering place" },
              { value: "#1", label: "homeschooling rate in AU" },
              { value: "10 min", label: "from Maleny — a world away" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-serif font-bold text-amber-400">
                  {stat.value}
                </p>
                <p className="text-stone-500 text-xs mt-1">{stat.label}</p>
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
          bg="bg-stone-900"
          visual={
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  name: "Eat",
                  desc: "A daily act of showing up",
                  color: "bg-amber-500",
                },
                {
                  name: "Gather",
                  desc: "Where neighbours become community",
                  color: "bg-green-600",
                },
                {
                  name: "Make",
                  desc: "An invitation to create together",
                  color: "bg-stone-600",
                },
                {
                  name: "Grow",
                  desc: "Time made visible",
                  color: "bg-emerald-600",
                },
              ].map((pillar) => (
                <div key={pillar.name} className="text-center">
                  <div
                    className={`h-16 w-16 rounded-2xl ${pillar.color} flex items-center justify-center mx-auto mb-3`}
                  >
                    <span className="text-white font-serif font-bold text-xl">
                      {pillar.name[0]}
                    </span>
                  </div>
                  <p className="text-white font-serif font-bold text-lg">
                    {pillar.name}
                  </p>
                  <p className="text-stone-500 text-xs mt-1">{pillar.desc}</p>
                </div>
              ))}
            </div>
          }
        >
          <p>
            Four seeds: <strong className="text-white">Eat. Gather. Make. Grow.</strong> Not
            services — beliefs.
          </p>
          <p>
            A cafe is not a business; it's a daily act of showing up. A workshop
            is not a product; it's an invitation to make something together. A
            garden is not decoration; it's time made visible.
          </p>
        </CompendiumSection>

        {/* ═══════════ IV. THE CYCLE ═══════════ */}
        <CompendiumSection
          number="IV"
          title="The Cycle"
          declaration="From seedling to harvest to compost — and back again."
          principleLabel="ACT Principle 10"
          principle="Art returns us to Listen — the loop only completes when change becomes culture."
          bgVideo={{
            src: "/images/compendium/oyster-lease.mp4",
            poster: "/images/compendium/oyster-lease-poster.jpg",
          }}
        >
          <p>
            Shaun Fisher is a Goenpul man — one of the three clans of the
            Quandamooka People, Traditional Owners of Minjerribah (North
            Stradbroke Island) and the southern Moreton Bay. The
            Yoolooburrabee — people of the sand and sea. The quampi shell
            is their totem, their food source, their cultural symbol.
          </p>
          <p>
            When colonizers arrived in Brisbane, they blew up the
            Quandamooka oyster leases for limestone. The Treasury building,
            the banks, the foundations of the city — built from those
            shells.
          </p>
          <p>
            At The Harvest, Shaun sells oysters direct to community.
            People eat on picnic blankets on the grass. The shells are
            collected and worked into benchtops, surfaces, and finishes
            throughout The Harvest. Everything here is compostable,
            reusable, returned.{" "}
            <strong className="text-white">
              The shells come back into the place. Full cycle.
            </strong>
          </p>
          <p className="text-stone-400 text-base italic">
            This is just one example of what we're working to do at The
            Harvest — every material, every relationship, every exchange
            designed to complete the loop.
          </p>
          <div className="border-l-2 border-stone-700 pl-6 my-8">
            <p className="text-stone-400 text-base leading-relaxed">
              This is LCAA made physical:{" "}
              <strong className="text-stone-200">Listen</strong> to the land and
              its people.{" "}
              <strong className="text-stone-200">Curiosity</strong> about what's
              possible. <strong className="text-stone-200">Action</strong> —
              build it together.{" "}
              <strong className="text-stone-200">Art</strong> — make the change
              felt. Art returns us to Listen.
            </p>
          </div>
        </CompendiumSection>

        {/* ═══════════ V. THE CANVAS ═══════════ */}
        <CanvasSection />

        {/* ═══════════ V½. THE DRAWING — scrolling element reveal ═══════════ */}
        <DrawingRevealSection />

        {/* ═══════════ VI. THE GARDEN ═══════════ */}
        <CompendiumSection
          number="VI"
          title="The Garden"
          declaration="Dig in. Take something home. Leave something behind."
          principleLabel="ACT Principle 7"
          principle="Grow what you eat, eat what you grow — the garden is the commons made visible."
          bg="bg-stone-900"
          visual={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
              {[
                { time: "Morning", feel: "Dew on seedlings. Someone's already weeding. A kid is watering the strawberries with a hose that's too big for her." },
                { time: "Afternoon", feel: "Quiet. Bees working. A homeschool group is drawing insects. The basil smells like it's trying to get your attention." },
                { time: "Saturday", feel: "Farmgate day. Tables of produce, seedlings in recycled pots, eggs from up the road, bread still warm." },
              ].map((moment) => (
                <div key={moment.time} className="text-center md:text-center text-left">
                  <p className="text-amber-400 font-mono text-xs tracking-wider uppercase mb-2">
                    {moment.time}
                  </p>
                  <p className="text-stone-500 text-sm leading-relaxed italic">
                    {moment.feel}
                  </p>
                </div>
              ))}
            </div>
          }
        >
          <p>
            This was a nursery once. The bones are still here — the shade cloth
            frames, the irrigation lines, the propagation benches. We're not
            building a garden from scratch. We're waking one up.
          </p>
          <p>
            <strong className="text-white">The garden is not decorative.</strong>{" "}
            It feeds the kitchen. It teaches the kids. It gives the homeschool
            families a classroom that smells like dirt and basil instead of
            carpet and whiteboard markers. Witta has the highest homeschooling
            rate in Australia — and no learning infrastructure. The garden
            changes that.
          </p>
          <p>
            You can dig in. Plant a seedling. Pull a carrot. Take home herbs
            in a paper bag, a punnet of strawberries, a sourdough starter from
            the kitchen. Or just sit on the bench and watch someone else do
            the work. Both are fine.
          </p>
          <p className="text-amber-400/80 font-serif italic">
            The garden is time made visible. Everything here was planted by
            someone, for someone. You eat what the last season grew. You plant
            what the next season needs.
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
          <p>
            Not a meeting room. Not a Zoom call. Not a networking event with
            name tags. A table with food on it, made from what grows here.
          </p>
          <p>
            The farmer sits next to the architect sits next to the kid who just
            wants a milkshake. Nobody has to explain why they're here. Nobody
            has to pitch anything. You just sit down and eat.
          </p>
          <p>
            Shaun's oysters. Pizza from the trailer. Picnic blankets on the
            grass. That's the whole beginning. No grand opening. No ribbon
            cutting.{" "}
            <strong className="text-white">
              Just food, and the people who show up for it.
            </strong>
          </p>
          <p className="text-stone-400 text-base italic">
            If that works — if people come back, if they bring someone, if they
            start saying "see you next week" — then everything else follows.
            The cafe. The garden. The workshops. The market. All of it grows
            from the table.
          </p>
        </CompendiumSection>

        {/* ═══════════ VIII. THE COMMONS ═══════════ */}
        <CompendiumSection
          number="VIII"
          title="The Commons"
          declaration="Not a venue. A platform. The connective tissue of the hinterland."
          principleLabel="ACT Principle 6"
          principle="Enterprise funds the commons — goods, harvest, and enterprise fund land care and community value, not extraction."
          bg="bg-stone-900"
        >
          <p>
            The Sunshine Coast hinterland is full of people making things.
            Farmers, bakers, potters, fermenters, weavers, builders, growers.
            Most of them sell from their driveways or at distant markets. There's
            no central place where the hinterland economy can show up as itself.
          </p>
          <p>
            <strong className="text-white">The Harvest is that place.</strong>{" "}
            Not by owning the supply chain — by being the table everyone brings
            their dish to. Local producers come here to sell, teach, collaborate.
            The farmer from down the road brings eggs. The baker from Maleny
            brings sourdough. Shaun brings oysters from Minjerribah. The kid
            from next door brings a jar of honey.
          </p>
          <p>
            This isn't a food court. It's a commons — a shared space where the
            hinterland's scattered economy can gather, find each other, and build
            something together that none of them could build alone.
          </p>
          <p>
            Every dollar that moves through The Harvest stays local. Every
            relationship that forms here strengthens the web. The enterprise
            funds the commons — not shareholders, not landlords, not a head
            office in Sydney.{" "}
            <strong className="text-white">
              The wealth stays where the work happens.
            </strong>
          </p>
        </CompendiumSection>

        {/* ═══════════ IX. THE HANDOVER ═══════════ */}
        <CompendiumSection
          number="IX"
          title="The Handover"
          declaration="Beautiful Obsolescence. Not an ending — a rebirth."
          principleLabel="ACT Principle 4"
          principle="Build for handover — design for transfer from day one. Our success is measured by our irrelevance."
          visual={
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-amber-500/60 via-amber-500/40 to-amber-500/20" />

              <div className="grid grid-cols-3 gap-4 md:gap-8">
                {[
                  {
                    year: "Year 1",
                    theme: "Plant",
                    detail: "Pop-ups, first markets, the table. Prove it can live.",
                  },
                  {
                    year: "Year 2",
                    theme: "Root",
                    detail: "Train local operators. Document the playbook. Let the community lead.",
                  },
                  {
                    year: "Year 3",
                    theme: "Release",
                    detail: "Ready to be handed over. Ready to redefine itself.",
                  },
                ].map((phase, i) => (
                  <div key={phase.year} className="text-center pt-10">
                    {/* Timeline dot */}
                    <div className="absolute top-[18px] h-3 w-3 rounded-full bg-amber-500 border-2 border-stone-900" style={{ left: `${i * 50 + (100/6)}%` }} />
                    <p className="text-amber-400 font-mono text-xs tracking-wider uppercase mb-2">
                      {phase.year}
                    </p>
                    <p className="text-white font-serif font-bold text-xl mb-2">
                      {phase.theme}
                    </p>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      {phase.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <p>
            We call it Beautiful Obsolescence. Not because we walk away — but
            because we build something that's ready to become whatever it needs
            to be next.
          </p>
          <p>
            Maybe it's us in Year 4. Maybe it's not. What matters is that
            the community and the land set the pace — not a business plan, not
            a board, not an investor's timeline.{" "}
            <strong className="text-white">
              The Harvest redefines itself. That's the design.
            </strong>
          </p>
          <p>
            Every system we build is ready to be handed over. Every role is
            documented so someone local can step in. Every decision is written
            down so it can be questioned, changed, or thrown out entirely.
          </p>
          <p>
            A Curious Tractor is exactly that — a tractor. A PTO shaft that
            transfers power, not holds it. We don't drive. We prepare the
            ground and let what grows, grow.
          </p>
          <p className="text-amber-400/80 font-serif italic text-xl leading-relaxed">
            The Harvest belongs to Witta. Not as an exit strategy — as a
            living thing that sheds its skin, season after season, and becomes
            what the land and its people ask it to be.
          </p>
        </CompendiumSection>

        {/* ═══════════ CLOSING ═══════════ */}
        <section className="min-h-screen flex items-center justify-center relative bg-stone-950">
          <div className="container px-6 md:px-8">
            <motion.div {...fadeInUp} className="max-w-2xl mx-auto text-center">
              <p className="text-amber-500/60 text-xs font-mono tracking-[0.4em] uppercase mb-10">
                The Invitation
              </p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.15] mb-8">
                Come to the table.
              </h2>
              <p className="text-lg text-stone-400 leading-relaxed mb-12">
                The Harvest isn't a pitch. It's an invitation. Walk the site.
                Eat something good. Sit at the table. If it feels right, help us
                build the next chapter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base px-8"
                  asChild
                >
                  <Link href="/contact">
                    Get in Touch
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-stone-700 text-stone-300 hover:bg-stone-800 text-base px-8"
                  asChild
                >
                  <Link href="/story">Read the Full Story</Link>
                </Button>
              </div>

              {/* Deeper links */}
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                {[
                  { label: "Our Story", href: "/story" },
                  { label: "The Vision", href: "/vision" },
                  { label: "Site Plan", href: "/site-plan" },
                  { label: "What's On", href: "/whats-on" },
                ].map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span className="text-stone-500 hover:text-amber-400 transition-colors underline underline-offset-4 decoration-stone-700 hover:decoration-amber-500/50">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>

              <p className="text-stone-700 text-xs font-mono tracking-wider mt-16">
                hello@theharvestwitta.com.au
              </p>
            </motion.div>
          </div>
        </section>
      </div>

      {/* ═══════════ PRINT STYLES ═══════════ */}
      <style>{`
        @media print {
          header, footer, nav,
          .compendium-page button {
            display: none !important;
          }

          .compendium-page .snap-y {
            height: auto !important;
            overflow: visible !important;
            scroll-snap-type: none !important;
          }

          .compendium-page .snap-start {
            min-height: auto !important;
            scroll-snap-align: unset !important;
            page-break-inside: avoid;
          }

          .compendium-page section {
            background: white !important;
            color: black !important;
            padding: 2rem 0 !important;
          }

          .compendium-page h1, .compendium-page h2, .compendium-page h3,
          .compendium-page p, .compendium-page li, .compendium-page span,
          .compendium-page blockquote, .compendium-page strong {
            color: black !important;
          }

          .compendium-page .text-amber-400,
          .compendium-page .text-amber-500 {
            color: #333 !important;
          }

          .compendium-page img {
            max-width: 100% !important;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
