import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import FloorPlanViewer from "@/components/FloorPlanViewer";
import SitePlanExplorer from "@/components/SitePlanExplorer";
import SiteZoneExplorer from "@/components/SiteZoneExplorer";
import {
  Utensils,
  Users,
  Hammer,
  Sprout,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Quote,
  Palette,
  CheckCircle,
  Calendar,
  TreePine,
  MessageCircle,
  Mail,
  X,
} from "lucide-react";
import { Link } from "wouter";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  viewport: { once: true },
};

const pillars = [
  {
    icon: Utensils,
    name: "Eat",
    description: "Farm-to-plate cafe with local produce, pop-up dining, and community kitchens.",
    color: "bg-amber-500",
  },
  {
    icon: Users,
    name: "Gather",
    description: "Markets, music, oyster pop-ups, and community events year-round.",
    color: "bg-stone-600",
  },
  {
    icon: Hammer,
    name: "Make",
    description: "Workshops in pottery, preserving, rammed earth — The Classroom is bookable.",
    color: "bg-stone-700",
  },
  {
    icon: Sprout,
    name: "Grow",
    description: "Established gardens with tomatoes, pomegranate, coffee, taro, herbs, and pecan trees.",
    color: "bg-amber-700",
  },
];

const timeline = [
  {
    year: "Year 1",
    theme: "Launch & Prove",
    period: "2026",
    quote: "Test everything. Keep what works.",
    items: [
      "March: First pop-up — oyster bar + pizza nights",
      "Building fit-out and activation as community hub",
      "Scaffold pavilion built under the pecan trees",
      "Gardens restored with market produce + raised beds",
      "The Classroom opens for bookable workshops",
      "CSA memberships: 10 founding → 50 members",
      "Break-even by mid-year",
    ],
  },
  {
    year: "Year 2",
    theme: "Integrate & Scale",
    period: "2027",
    quote: "Connect the ecosystem.",
    items: [
      "Main building activated: modular restaurant + event space",
      "ACT Farm → Harvest supply chain established",
      "Artist & maker residency programs",
      "Youth vocational training partnerships",
      "Community operators identified & in training",
    ],
  },
  {
    year: "Year 3",
    theme: "Hand Over the Keys",
    period: "2028",
    quote: "Community takes the lead.",
    items: [
      "Community cooperative takes operational lead",
      "ACT shifts to capacity support only",
      "Model documented for replication",
      "Full ecosystem integration with ACT Farm",
    ],
  },
];

const momentum = [
  {
    icon: CheckCircle,
    title: "Pop-Up Confirmed",
    detail: "Shaun Fisher — Goenpul man, Quandamooka People — is bringing oysters from Minjerribah for our first pop-up. March 2026, ticketed.",
    status: "Confirmed",
  },
  {
    icon: Palette,
    title: "Architect On-Site",
    detail: "Thais has walked the site, measured the buildings, and is developing concept designs — scaffold pavilion, building fit-out, zone layouts.",
    status: "In progress",
  },
  {
    icon: TreePine,
    title: "Gardens Assessed",
    detail: "Existing produce mapped: tomatoes, pomegranate, Brazilian coffee, taro, herbs, lilly pillies, pecan trees. Gardener starting 2 days/week.",
    status: "Starting Feb",
  },
  {
    icon: MessageCircle,
    title: "Community Already Curious",
    detail: "Neighbours are stopping to ask what's happening. The local Facebook page is buzzing. People are ready for something to gather around.",
    status: "Organic",
  },
];

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

export default function Story() {
  const [barryPhoto, setBarryPhoto] = useState(0);
  const [viewBarryPhoto, setViewBarryPhoto] = useState<number | null>(null);

  const nextBarryPhoto = useCallback(() => {
    setBarryPhoto((prev) => (prev + 1) % barryImages.length);
  }, []);

  const prevBarryPhoto = useCallback(() => {
    setBarryPhoto((prev) => (prev - 1 + barryImages.length) % barryImages.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextBarryPhoto, 5000);
    return () => clearInterval(interval);
  }, [nextBarryPhoto]);

  return (
    <div className="story-page">
      {/* Scroll-snap container */}
      <div className="h-screen overflow-y-auto snap-y snap-mandatory">

        {/* ═══════════ 1. HERO ═══════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center relative bg-stone-950 overflow-hidden">
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
            <div className="absolute inset-0 bg-stone-950/60" />
          </div>
          <div className="container relative text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-6">
                The Harvest &middot; Witta
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                From seedling to harvest<br className="hidden md:block" /> to compost — and back again
              </h1>
              <p className="text-xl md:text-2xl text-stone-300 leading-relaxed max-w-2xl mx-auto font-light">
                A community hub where Witta comes together to{" "}
                <span className="text-amber-400 font-medium">eat, gather, make, and grow</span>.
              </p>
            </motion.div>
          </div>
          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-stone-400"
            >
              <span className="text-xs tracking-wider uppercase">Scroll</span>
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════ 2. THE GAP ═══════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-white">
          <div className="container px-4">
            <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 mb-4">
                Witta has nowhere to gather
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed mb-10 max-w-xl mx-auto">
                Two thousand cars pass through every weekend. One cafe. No gathering place.
                The hinterland is hollowing out — people drive through but never stop.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {[
                  { value: "2,000+", label: "cars every weekend" },
                  { value: "One", label: "cafe — no gathering place" },
                  { value: "#1", label: "homeschooling rate in AU" },
                  { value: "10 min", label: "from Maleny — a world away" },
                ].map((stat) => (
                  <motion.div key={stat.label} {...fadeInUp} className="text-center">
                    <p className="text-3xl md:text-4xl font-serif font-bold text-amber-600">
                      {stat.value}
                    </p>
                    <p className="text-stone-500 text-sm mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              <motion.blockquote {...fadeInUp} className="mt-8">
                <Quote className="h-8 w-8 text-amber-500/30 mx-auto mb-4" />
                <p className="text-xl md:text-2xl text-stone-700 italic font-serif leading-relaxed">
                  "People always say 'where's Witta?' and I say it's 10 minutes from
                  Maleny"
                </p>
                <footer className="mt-3 text-sm text-stone-400">
                  — Nic
                </footer>
              </motion.blockquote>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ 3. THE SEED ═══════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-stone-50">
          <div className="container px-4">
            <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 mb-4">
                What if there was a place?
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                Four pillars, one vision — a regenerative community platform on the
                Sunshine Coast Hinterland.
              </p>
            </motion.div>
            <motion.div
              {...staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
            >
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <motion.div key={pillar.name} {...fadeInUp}>
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 text-center h-full">
                      <div
                        className={`h-14 w-14 rounded-2xl ${pillar.color} flex items-center justify-center mx-auto mb-4`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="font-serif font-bold text-stone-800 text-xl mb-2">
                        {pillar.name}
                      </h3>
                      <p className="text-stone-600 text-sm leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══════════ 4. THE SPACE — WHERE WE'RE HEADED ═══════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-stone-50">
          <div className="container px-4 py-12">
            <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 mb-4">
                Where we're headed
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                This is the master plan — what the site looks like when it's done.
                We're not there yet. Right now we're fitting out the rammed earth building,
                restoring the gardens, and preparing for our first pop-up events.
              </p>
            </motion.div>
            <motion.div {...fadeInUp} className="max-w-5xl mx-auto">
              <div className="rounded-2xl overflow-hidden shadow-xl bg-white">
                <img
                  src="/images/compendium/canvas-drawing-full.jpg"
                  alt="The Harvest master plan — hand-drawn colour site layout showing buildings, gardens, gathering spaces, and community zones"
                  className="w-full"
                />
              </div>
              <p className="text-center text-stone-500 text-sm mt-4 italic">
                Hand-drawn master plan by our architect — the full vision for the 5-acre site
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ 5. THE SPACE — WHERE WE ARE NOW ═══════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-stone-900">
          <div className="container px-4 py-12">
            <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
                The site today
              </h2>
              <p className="text-lg text-stone-400 leading-relaxed">
                Aerial view of the 5-acre property as it stands right now.
                The rammed earth building, the nursery, the paddocks — all being brought to life.
              </p>
            </motion.div>
            <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
              <SiteZoneExplorer />
              <p className="text-center text-stone-500 text-sm mt-2 italic">
                Hover or tap zones to explore — click for details
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ 5b. FLOOR PLAN ═══════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-white">
          <div className="container px-4 py-12">
            <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 mb-4">
                Inside the building
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                The rammed earth building is being fitted out as a community hub.
                Hover the zones to explore the current layout.
              </p>
            </motion.div>
            <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
              <FloorPlanViewer />
            </motion.div>
          </div>
        </section>

        {/* ═══════════ 6. THE VISION ═══════════ */}
        <section className="min-h-screen snap-start relative">
          <motion.div {...fadeInUp} className="text-center pt-16 pb-6 bg-stone-50">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 mb-4">
              Explore the Site Plan
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed max-w-3xl mx-auto px-4">
              Toggle between stages to see how the site evolves — from current state
              through to the full master plan.
            </p>
          </motion.div>
          <SitePlanExplorer />
        </section>

        {/* ═══════════ 7. THE OYSTER STORY ═══════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-stone-900">
          <div className="container px-4 py-12">
            <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white text-center mb-10">
                The Cycle
              </h2>
              <div className="aspect-video rounded-xl overflow-hidden mb-10 shadow-xl">
                <video
                  src="/images/compendium/oyster-lease.mp4"
                  poster="/images/compendium/oyster-lease-poster.jpg"
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6 text-stone-300 text-lg leading-relaxed">
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
                <div className="border-l-4 border-amber-500 pl-6 py-2 my-8">
                  <p className="text-xl md:text-2xl font-serif italic text-white">
                    At The Harvest, Shaun sells oysters direct to community.
                    People eat on picnic blankets on the grass. The shells are
                    collected and worked into benchtops, surfaces, and finishes
                    throughout The Harvest. The shells come back into the place. Full cycle.
                  </p>
                </div>
                <p className="text-stone-500 text-base text-center italic">
                  From seedling to harvest to compost — and back again.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ 7b. BARRY'S STORY ═══════════ */}
        <section className="min-h-screen snap-start relative overflow-hidden bg-stone-950">
          {/* Photo background — crossfade slideshow */}
          {barryImages.map((img, i) => (
            <motion.div
              key={img.src}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: barryPhoto === i ? 1 : 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <img src={img.src} alt="" className="w-full h-full object-cover" />
            </motion.div>
          ))}

          {/* Gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />

          {/* Content */}
          <div className="relative z-10 flex items-center min-h-screen">
            <div className="container px-6 md:px-8 py-20 md:py-28">
              <div className="max-w-2xl">
                <motion.h2
                  {...fadeInUp}
                  className="text-2xl md:text-3xl font-serif font-bold text-stone-400 mb-4 tracking-wide"
                >
                  The Shed
                </motion.h2>

                <motion.p
                  {...fadeInUp}
                  className="text-3xl md:text-5xl font-serif font-bold text-white leading-[1.15] mb-10"
                >
                  Before there was a harvest, there was a shed.
                </motion.p>

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

                <motion.div {...fadeInUp} className="border-l-2 border-amber-500/40 pl-6 mb-10">
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

                <motion.div {...fadeInUp} className="border-l-2 border-amber-500/40 pl-6 mb-10">
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
              </div>

              {/* Photo controls */}
              <div className="flex items-center gap-3 mt-8">
                <button
                  onClick={prevBarryPhoto}
                  className="p-2 rounded-full border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500 transition-colors bg-stone-950/60 backdrop-blur-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextBarryPhoto}
                  className="p-2 rounded-full border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500 transition-colors bg-stone-950/60 backdrop-blur-sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <span className="text-stone-600 text-xs font-mono ml-1">
                  {barryPhoto + 1}/{barryImages.length}
                </span>
                <button
                  onClick={() => setViewBarryPhoto(barryPhoto)}
                  className="ml-2 px-3 py-1.5 text-xs font-mono tracking-wider uppercase rounded-full border border-stone-600 text-stone-400 hover:text-white hover:border-stone-400 transition-colors bg-stone-950/60 backdrop-blur-sm"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Barry fullscreen photo viewer */}
        {viewBarryPhoto !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-stone-950 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-stone-900/90 backdrop-blur-sm border-b border-stone-800 shrink-0">
              <p className="text-xs md:text-sm font-mono text-stone-400 truncate flex-1 min-w-0 mr-3">
                {viewBarryPhoto + 1}/{barryImages.length} — {barryImages[viewBarryPhoto].caption}
              </p>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setViewBarryPhoto((viewBarryPhoto - 1 + barryImages.length) % barryImages.length)}
                  className="p-2 rounded-full border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewBarryPhoto((viewBarryPhoto + 1) % barryImages.length)}
                  className="p-2 rounded-full border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewBarryPhoto(null)}
                  className="p-2 rounded-full border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center p-4">
              <img
                src={barryImages[viewBarryPhoto].src}
                alt={barryImages[viewBarryPhoto].caption}
                className="max-w-none w-[95vw] md:w-auto md:max-h-[85vh] rounded-lg"
              />
            </div>
          </motion.div>
        )}

        {/* ═══════════ 8. THE JOURNEY ═══════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-stone-50">
          <div className="container px-4">
            <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 mb-4">
                The Journey
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                Three years. One clear arc: launch, integrate, hand over the keys.
              </p>
            </motion.div>

            <motion.div {...staggerContainer} className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {timeline.map((phase, index) => (
                  <motion.div key={phase.year} {...fadeInUp}>
                    <div className="bg-white rounded-2xl shadow-md p-6 h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-stone-800 text-lg">
                            {phase.year}
                          </h3>
                          <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">
                            {phase.theme} &middot; {phase.period}
                          </p>
                        </div>
                      </div>
                      <p className="text-stone-500 text-sm italic mb-4">
                        "{phase.quote}"
                      </p>
                      <ul className="space-y-2">
                        {phase.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm text-stone-600"
                          >
                            <ArrowRight className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-1" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="mt-10 text-center">
              <blockquote>
                <Quote className="h-6 w-6 text-amber-500/30 mx-auto mb-3" />
                <p className="text-lg text-stone-700 italic font-serif leading-relaxed max-w-xl mx-auto">
                  "Our success is measured by our irrelevance. We build to hand over, not to hold."
                </p>
              </blockquote>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ 9. ALREADY HAPPENING ═══════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-white">
          <div className="container px-4">
            <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 mb-4">
                Already Happening
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                We haven't waited to start. Here's what's in motion right now.
              </p>
            </motion.div>

            <motion.div
              {...staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            >
              {momentum.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.title} {...fadeInUp}>
                    <div className="bg-stone-50 rounded-2xl p-6 h-full">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-amber-600" />
                          </div>
                          <h3 className="font-serif font-bold text-stone-800">
                            {item.title}
                          </h3>
                        </div>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-stone-600 text-sm leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══════════ 10. THE INVITATION ═══════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-gradient-to-b from-stone-800 to-stone-900">
          <div className="container px-4">
            <motion.div {...fadeInUp} className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                Let's build this together
              </h2>
              <p className="text-lg text-stone-300 leading-relaxed mb-10">
                We'd love to sit down, walk the site, and talk about what The Harvest
                can become. The best next step is a conversation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              </div>
              <div className="flex items-center justify-center gap-2 text-stone-400 mt-8">
                <Mail className="h-4 w-4" />
                <span className="text-sm">hello@theharvestwitta.com.au</span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* ═══════════ PRINT STYLES ═══════════ */}
      <style>{`
        @media print {
          header, footer, nav,
          .story-page button,
          .story-page [role="slider"] {
            display: none !important;
          }

          .story-page .snap-y {
            height: auto !important;
            overflow: visible !important;
            scroll-snap-type: none !important;
          }

          .story-page .snap-start {
            min-height: auto !important;
            scroll-snap-align: unset !important;
            page-break-inside: avoid;
          }

          .story-page section {
            background: white !important;
            color: black !important;
            padding: 1.5rem 0 !important;
          }

          .story-page h1, .story-page h2, .story-page h3,
          .story-page p, .story-page li, .story-page span,
          .story-page blockquote {
            color: black !important;
          }

          .story-page .text-amber-400,
          .story-page .text-amber-500,
          .story-page .text-amber-600 {
            color: #333 !important;
          }

          .story-page img {
            max-width: 100% !important;
            page-break-inside: avoid;
          }

          .story-page .shadow-md,
          .story-page .shadow-lg {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
        }
      `}</style>
    </div>
  );
}
