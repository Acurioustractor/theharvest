import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FloorPlanViewer from "@/components/FloorPlanViewer";
import SiteZoneExplorer from "@/components/SiteZoneExplorer";
import {
  Utensils,
  Users,
  Hammer,
  Sprout,
  ArrowRight,
  Heart,
  Handshake,
  MapPin,
  Leaf,
  Target,
  ChevronRight,
  ChevronLeft,
  Quote,
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
    description: "Farm-to-plate cafe serving seasonal breakfast and lunch with local produce and honest cooking.",
    bg: "bg-amber-500",
    accent: "bg-amber-600",
  },
  {
    icon: Users,
    name: "Gather",
    description: "Markets, music, and community events that bring neighbours together throughout the year.",
    bg: "bg-amber-700",
    accent: "bg-amber-800",
  },
  {
    icon: Hammer,
    name: "Make",
    description: "Workshops in pottery, preserving, and craft — learn new skills with local makers and artisans.",
    bg: "bg-stone-600",
    accent: "bg-stone-700",
  },
  {
    icon: Sprout,
    name: "Grow",
    description: "Garden centre with native species, productive plants, and expert advice for hinterland gardens.",
    bg: "bg-stone-700",
    accent: "bg-stone-800",
  },
];

const timeline = [
  {
    year: "Year 1",
    theme: "Launch & Prove",
    period: "2026",
    items: [
      "March: First pop-up — oyster bar + pizza nights",
      "Shed clad and activated as retail/servery space",
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
    items: [
      "Community cooperative takes operational lead",
      "ACT shifts to capacity support only",
      "Model documented for replication",
      "Full ecosystem integration with ACT Farm",
    ],
  },
];

const financials = [
  { label: "Stage 1 Activation", value: "$15-20K", description: "Shed cladding, scaffold pavilion, paths, garden beds, furniture — ready in 4 weeks" },
  { label: "Full Startup Budget", value: "$79K", description: "Kitchen fit-out, garden development, equipment, permits, working capital" },
  { label: "Year 1 Revenue Target", value: "$276K", description: "Cafe, events, garden centre, CSA, sublease income" },
  { label: "Year 1 Surplus", value: "$74K", description: "After all operating costs including rent and staffing" },
];

const team = [
  {
    name: "Nic & Ben",
    role: "Head Lease & Strategic Direction",
    org: "A Curious Tractor",
    description: "Regenerative innovation ecosystem. Head lease holders, mission alignment, governance, and strategic direction.",
  },
  {
    name: "Michelle & Grant",
    role: "Owners",
    description: "Property owners and partners in the vision for what the site can become.",
  },
  {
    name: "TBC",
    role: "Harvest Manager",
    description: "Day-to-day operations, customer experience, inventory, and site management.",
  },
  {
    name: "Thais",
    role: "Lead Architect",
    description: "Specialising in rammed earth and natural materials. Concept design, floor plans, and material palette.",
  },
  {
    name: "Shaun Fisher",
    role: "Pop-Up Supplier",
    org: "Fisher's Oysters",
    description: "Goenpul man, Quandamooka People. Bringing oysters from Minjerribah for the first pop-up and ongoing events.",
  },
  {
    name: "Shaun Christie-David",
    role: "Kitchen & Restaurant Consultant",
    description: "Restaurant and hospitality expertise guiding the cafe and kitchen strategy.",
  },
  {
    name: "Barry",
    role: "First Story & Story Referral",
    description: "27 years restoring this nursery. The first story of The Harvest and our connection to its history.",
  },
  {
    name: "Witta Community",
    role: "Lead Consultants",
    description: "The neighbours, the families, the people who pass through — the community shapes what this place becomes.",
  },
];

const planGallery = [
  { src: "/images/plans/building-survey.jpeg", title: "Building Survey", caption: "Architect's measured survey of the existing building" },
  { src: "/images/plans/building-survey-labelled.jpeg", title: "Building Survey (Original Labels)", caption: "Original nursery layout — Staff Room, Cold Room, Seed Pack, Mail Order" },
  { src: "/images/plans/building-layout-detail.jpeg", title: "Building Interior", caption: "Detailed interior layout — rooms, furniture placement, flow" },
  { src: "/images/plans/site-plan-linework.jpeg", title: "Site Plan (Line Drawing)", caption: "Full site line drawing — the bones of the design" },
  { src: "/images/plans/site-plan-colour.jpeg", title: "Site Plan (Colour)", caption: "Watercolour site plan — gardens, pavilion, building, trees" },
  { src: "/images/plans/site-plan-colour-labelled.jpeg", title: "Site Plan (Labelled)", caption: "Every zone named — Kids Play, Pizza Oven, Cafe, Gallery, Parking" },
  { src: "/images/plans/site-plan-colour-annotated.jpeg", title: "Site Plan (Annotated)", caption: "With reference photos and design notes" },
  { src: "/images/plans/site-analysis-zones.jpeg", title: "Element Zones", caption: "Design zones — kids, wood, fire, food, water, earth, play/gather" },
  { src: "/images/plans/site-analysis-zones-circulation.jpeg", title: "Zones + Circulation", caption: "Public and staff circulation flows through the zones" },
  { src: "/images/plans/site-analysis-sun-path.jpeg", title: "Sun Path + Analysis", caption: "Winter sun path, compass orientation, full site analysis" },
];

export default function Vision() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-stone-50 vision-page">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative py-32 md:py-44 bg-stone-950 overflow-hidden">
        <div className="absolute inset-0">
          <video
            src="/images/compendium/hero-aerial.mp4"
            poster="/images/compendium/hero-aerial.jpg"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 text-sm font-medium mb-8">
              <Leaf className="h-4 w-4" />
              A Curious Tractor &middot; Witta Enterprise
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              The Harvest
            </h1>
            <p className="text-xl md:text-2xl text-stone-300 leading-relaxed mb-4 font-light">
              A community hub where Witta comes together to{" "}
              <span className="text-amber-400 font-medium">eat, gather, make, and grow</span>.
            </p>
            <p className="text-stone-400 text-lg mb-3 max-w-2xl mx-auto">
              Transforming a former nursery into a regenerative community platform
              on the Sunshine Coast Hinterland.
            </p>
            <p className="text-stone-500 text-base mb-10 max-w-xl mx-auto italic font-serif">
              From seedling to harvest to compost — and back again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base px-8"
                onClick={() => document.getElementById("the-plan")?.scrollIntoView({ behavior: "smooth" })}
              >
                See the Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-base px-8"
                asChild
              >
                <Link href="/contact">Let's Talk</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ THE OPPORTUNITY ═══════════ */}
      <section className="py-12 md:py-28 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              The Opportunity
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed mb-8">
              Two thousand cars pass through Witta every weekend on the way to Kenilworth.
              One cafe. No gathering place. The hinterland is hollowing out — people drive
              through but never stop.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              {[
                { value: "2,000+", label: "cars every weekend" },
                { value: "One", label: "cafe — no gathering place" },
                { value: "#1", label: "homeschooling rate in AU" },
                { value: "10 min", label: "from Maleny — a world away" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-serif font-bold text-amber-600">
                    {stat.value}
                  </p>
                  <p className="text-stone-500 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Four Pillars */}
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <motion.div key={pillar.name} {...fadeInUp}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full overflow-hidden group">
                    <div className={`relative h-32 ${pillar.bg} overflow-hidden`}>
                      {/* Organic texture pattern */}
                      <div className="absolute inset-0 opacity-[0.08]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }} />
                      <div className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full ${pillar.accent} opacity-30`} />
                      <div className={`absolute -top-2 -left-2 h-16 w-16 rounded-full ${pillar.accent} opacity-20`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="h-10 w-10 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    <CardContent className="p-5 text-center">
                      <h3 className="font-serif font-bold text-stone-800 text-xl mb-2">
                        {pillar.name}
                      </h3>
                      <p className="text-stone-600 text-sm leading-relaxed">
                        {pillar.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div {...fadeInUp} className="mt-12 max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-stone-500">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-500" />
                Witta, Sunshine Coast Hinterland — Jinibara Country
              </span>
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-500" />
                ~500 sqm building + established gardens
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-500" />
                Five acres of potential
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ THE SITE TODAY ═══════════ */}
      <section className="py-12 md:py-28 bg-stone-900">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              The Site Today
            </h2>
            <p className="text-lg text-stone-400 leading-relaxed">
              Five acres as they stand right now. Hover the zones to see what's here — and what's coming.
            </p>
          </motion.div>
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <SiteZoneExplorer />
          </motion.div>
          <motion.div {...fadeInUp} className="max-w-6xl mx-auto mt-12">
            <Card className="overflow-hidden border-0 shadow-lg bg-stone-800">
              <div className="overflow-hidden">
                <img
                  src="/images/plans/site-plan-colour-labelled-cropped.jpeg"
                  alt="Site Plan — every zone named: Kids Play, Pizza Oven, Cafe, Gallery, Parking"
                  className="w-full h-auto scale-110 origin-center"
                />
              </div>
              <div className="p-4 text-center">
                <p className="text-stone-400 text-sm">
                  Architect's site plan — every zone named
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ INSIDE THE BUILDING ═══════════ */}
      <section className="py-12 md:py-28 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Inside the Building
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              The rammed earth building is being fitted out as a community hub.
              Click the numbered points to explore what each space becomes.
            </p>
          </motion.div>
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <FloorPlanViewer />
          </motion.div>
        </div>
      </section>

      {/* ═══════════ DESIGN PHILOSOPHY ═══════════ */}
      <section className="py-16 md:py-20 bg-stone-800 text-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Gallery, Not Museum",
                  text: "Nothing is super permanent. Like an art gallery, exhibitions come, people love them, they evolve, and new ones take their place. The space is always becoming.",
                  image: "/images/compendium/MASTER FLOOR PLAN_4.jpeg",
                },
                {
                  title: "Test Before You Build",
                  text: "Pop-ups before permanent builds. We test with oysters and pizza before investing in a restaurant. Every dollar follows proof of demand.",
                  image: "/images/compendium/canvas-drawing.jpg",
                },
                {
                  title: "Unfinished Canvas",
                  text: "You're not coming to something that's finished — you're coming to something you can be a part of. Every chair, every plant, every event is a community contribution.",
                  image: "/images/compendium/MASTER FLOOR PLAN_10.jpeg",
                },
              ].map((principle) => (
                <motion.div key={principle.title} {...fadeInUp} className="text-center">
                  <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                    <img
                      src={principle.image}
                      alt={principle.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <h3 className="font-serif font-bold text-white text-lg mb-2">{principle.title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{principle.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Design concepts grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {[
                { src: "/images/compendium/MASTER FLOOR PLAN_5.jpeg", alt: "Curved pavilion — colourful modular structure" },
                { src: "/images/compendium/MASTER FLOOR PLAN_6.jpeg", alt: "Crate structure — modular market stall" },
                { src: "/images/compendium/MASTER FLOOR PLAN_4.jpeg", alt: "Pink crate gallery wall — exhibition and retail" },
                { src: "/images/compendium/MASTER FLOOR PLAN_8.jpeg", alt: "Wheelchair-accessible raised garden bed" },
              ].map((img) => (
                <div key={img.src} className="rounded-xl overflow-hidden shadow-lg aspect-square">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ ARCHITECT PLANS GALLERY ═══════════ */}
      <section className="py-12 md:py-28 bg-stone-50">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Architect Plans &amp; Analysis
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              From survey to concept — every layer of the design process.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto"
          >
            {planGallery.map((item, index) => (
              <motion.button
                key={item.src}
                {...fadeInUp}
                onClick={() => setLightboxIndex(index)}
                className="group text-left rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-serif font-bold text-stone-800 text-sm mb-0.5">{item.title}</h3>
                  <p className="text-stone-500 text-xs leading-snug">{item.caption}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-10 text-white/70 hover:text-white p-2"
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex - 1 + planGallery.length) % planGallery.length);
            }}
            className="absolute left-4 z-10 text-white/70 hover:text-white p-2"
            aria-label="Previous"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % planGallery.length);
            }}
            className="absolute right-4 z-10 text-white/70 hover:text-white p-2"
            aria-label="Next"
          >
            <ChevronRight className="h-10 w-10" />
          </button>
          <div
            className="max-w-5xl max-h-[90vh] flex flex-col items-center px-4 md:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={planGallery[lightboxIndex].src}
              alt={planGallery[lightboxIndex].caption}
              className="max-h-[80vh] max-w-full w-auto object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-serif font-bold text-lg">
                {planGallery[lightboxIndex].title}
              </p>
              <p className="text-stone-400 text-sm mt-1">
                {planGallery[lightboxIndex].caption}
              </p>
              <p className="text-stone-600 text-xs mt-2">
                {lightboxIndex + 1} / {planGallery.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ THE PLAN ═══════════ */}
      <section id="the-plan" className="py-12 md:py-28 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              The Plan
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              A three-year arc: launch and prove the model, integrate with ACT Farm,
              then hand the keys to the community.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {timeline.map((phase, index) => (
                <motion.div key={phase.year} {...fadeInUp}>
                  <Card className="border-0 shadow-md h-full">
                    <CardContent className="p-6">
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
                      <ul className="space-y-2">
                        {phase.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
                            <ChevronRight className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ THE NUMBERS ═══════════ */}
      <section className="py-12 md:py-28 bg-stone-800 text-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              The Numbers
            </h2>
            <p className="text-lg text-stone-300 leading-relaxed">
              Conservative projections based on comparable community enterprises
              in the Sunshine Coast Hinterland.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {financials.map((item) => (
              <motion.div key={item.label} {...fadeInUp}>
                <div className="bg-stone-700/50 rounded-xl p-6 text-center border border-stone-600/30">
                  <p className="text-3xl md:text-4xl font-serif font-bold text-amber-400 mb-2">
                    {item.value}
                  </p>
                  <p className="text-white font-medium text-sm mb-2">{item.label}</p>
                  <p className="text-stone-400 text-xs leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-3xl mx-auto mt-12">
            <div className="bg-stone-700/30 rounded-xl p-6 border border-stone-600/30">
              <h3 className="font-serif font-bold text-white text-lg mb-4 text-center">
                Revenue Streams (Year 1 Steady State)
              </h3>
              <div className="space-y-3">
                {[
                  { stream: "Cafe & Kitchen", monthly: "$12,000", pct: 52 },
                  { stream: "Events & Workshops", monthly: "$4,000", pct: 17 },
                  { stream: "CSA Memberships", monthly: "$3,000", pct: 13 },
                  { stream: "Garden Centre", monthly: "$2,500", pct: 11 },
                  { stream: "Sublease Income", monthly: "$1,500", pct: 7 },
                ].map((row) => (
                  <div key={row.stream} className="space-y-1 md:space-y-0 md:flex md:items-center md:gap-4">
                    <div className="flex items-center justify-between md:contents">
                      <span className="text-sm text-stone-300 md:w-40 md:shrink-0">{row.stream}</span>
                      <span className="text-sm text-amber-400 font-medium md:hidden">
                        {row.monthly}/mo
                      </span>
                    </div>
                    <div className="flex-1 h-3 bg-stone-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="hidden md:block text-sm text-amber-400 font-medium w-20 text-right">
                      {row.monthly}/mo
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-center text-stone-400 text-sm mt-4">
                Total: $23,000/month &middot; $276,000/year
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ THE TEAM ═══════════ */}
      <section className="py-12 md:py-28 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              The Team
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Experienced operators with deep community roots and a shared commitment
              to regenerative, values-driven enterprise.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto"
          >
            {team.map((member) => (
              <motion.div key={member.name} {...fadeInUp}>
                <Card className="border-0 shadow-md h-full">
                  <CardContent className="p-5 text-center">
                    <div className="h-11 w-11 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
                      <span className="font-serif font-bold text-amber-600 text-base">
                        {member.name[0]}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-stone-800 text-base mb-0.5">
                      {member.name}
                    </h3>
                    {"org" in member && member.org && (
                      <p className="text-amber-600 text-xs font-medium">{member.org}</p>
                    )}
                    <p className="text-stone-500 text-xs font-medium mb-2">{member.role}</p>
                    <p className="text-stone-600 text-xs leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ ALREADY HAPPENING ═══════════ */}
      <section className="py-12 md:py-28 bg-stone-50">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Already Happening
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              We haven't waited to start. Here's what's in motion right now.
            </p>
          </motion.div>

          {/* Oyster bar hero card */}
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto mb-8">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-video md:aspect-auto overflow-hidden bg-stone-900">
                  <video
                    src="/images/compendium/oyster-lease.mp4"
                    poster="/images/compendium/oyster-lease-poster.jpg"
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800 w-fit mb-3">
                    Confirmed
                  </span>
                  <h3 className="font-serif font-bold text-stone-800 text-xl mb-2">
                    First Pop-Up: March 2026
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Shaun Fisher — Goenpul man, Quandamooka People — is bringing oysters
                    from Minjerribah for our first pop-up. Ticketed event to test demand.
                    Shells collected for rammed earth finishes throughout the building.
                  </p>
                </CardContent>
              </div>
            </Card>
          </motion.div>

          <motion.div {...staggerContainer} className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Architect On-Site",
                  description: "Thais has walked the site, measured the buildings, and is developing concept designs — scaffold pavilion, shed cladding, zone layouts, material palette.",
                  status: "In progress",
                  image: "/images/compendium/canvas-drawing.jpg",
                },
                {
                  title: "Gardens Assessed",
                  description: "Existing produce mapped: tomatoes, pomegranate, Brazilian coffee, taro, herbs, lilly pillies, pecan trees. Gardener starting 2 days/week.",
                  status: "Starting Feb",
                  image: "/images/compendium/MASTER FLOOR PLAN_9.jpeg",
                },
                {
                  title: "Community Already Curious",
                  description: "Neighbours are stopping to ask what's happening. The local Facebook page is buzzing. People are ready for something to gather around.",
                  status: "Organic demand",
                  image: "/images/compendium/MASTER FLOOR PLAN_10.jpeg",
                },
              ].map((item) => (
                <motion.div key={item.title} {...fadeInUp}>
                  <Card className="border-0 shadow-md h-full overflow-hidden">
                    <div className="relative h-32 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-serif font-bold text-stone-800 text-sm">{item.title}</h3>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800 shrink-0 ml-2">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-stone-600 text-xs leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ THE PARTNERSHIP ═══════════ */}
      <section className="py-12 md:py-28 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              The Partnership
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              We see The Harvest as more than a tenancy — it's a shared vision for
              what Witta can become.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div {...fadeInUp}>
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-8 bg-white">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
                        <Heart className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-serif font-bold text-stone-800 text-lg">What We Bring</h3>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "Values-aligned tenancy with community mission",
                        "Operational team ready from Day 1",
                        "$100K capital improvement fund management",
                        "Revenue-generating activation of the full site",
                        "Connection to ACT Farm & broader ecosystem",
                        "Community programming & event curation",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
                          <ChevronRight className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-8 bg-stone-800 text-white">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Handshake className="h-5 w-5 text-amber-400" />
                      </div>
                      <h3 className="font-serif font-bold text-lg">What We're Asking</h3>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "A lease structure that rewards mutual investment",
                        "First right of refusal on any future sale",
                        "Capital improvement fund for kitchen & garden",
                        "Shared vision: community asset, not just real estate",
                        "Ramp-up period as operations establish",
                        "A partnership built on trust, not just transactions",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-stone-300">
                          <ChevronRight className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} className="mt-8">
              <Card className="border-0 shadow-md">
                <CardContent className="p-8 text-center">
                  <h3 className="font-serif font-bold text-stone-800 text-xl mb-3">
                    The Bigger Picture
                  </h3>
                  <p className="text-stone-600 leading-relaxed max-w-2xl mx-auto">
                    Our long-term vision is a community-owned asset — where The Harvest
                    is operated by the people it serves. We're not looking to build a
                    business on someone else's land; we're looking to build a community
                    platform that creates lasting value for Witta, for the landlord,
                    and for the region.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-12 md:py-28 bg-gradient-to-b from-stone-800 to-stone-900">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Let's Build This Together
            </h2>
            <p className="text-lg text-stone-300 leading-relaxed mb-8">
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
            <p className="text-stone-500 text-sm mt-6">
              hello@theharvestwitta.com.au
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ PRINT STYLES ═══════════ */}
      <style>{`
        @media print {
          header, footer, nav,
          .vision-page button,
          .vision-page [role="slider"] {
            display: none !important;
          }
          .vision-page section {
            background: white !important;
            color: black !important;
            padding: 1.5rem 0 !important;
            page-break-inside: avoid;
          }
          .vision-page { font-size: 11pt; }
          .vision-page h1, .vision-page h2, .vision-page h3,
          .vision-page p, .vision-page li, .vision-page span {
            color: black !important;
          }
          .vision-page .text-amber-400,
          .vision-page .text-amber-500,
          .vision-page .text-amber-600 {
            color: #333 !important;
          }
          .vision-page img {
            max-width: 100% !important;
            page-break-inside: avoid;
          }
          .vision-page .shadow-md,
          .vision-page .shadow-lg,
          .vision-page .shadow-xl {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
          .vision-page .bg-amber-500 {
            background: #666 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .vision-page .bg-stone-800,
          .vision-page .bg-stone-900,
          .vision-page .bg-stone-950 {
            background: white !important;
            border-top: 2px solid #333;
          }
          .vision-page .bg-stone-700\\/50,
          .vision-page .bg-stone-700\\/30 {
            background: #f5f5f5 !important;
            border: 1px solid #ddd !important;
          }
          .vision-page #the-plan {
            page-break-before: always;
          }
        }
      `}</style>
    </div>
  );
}
