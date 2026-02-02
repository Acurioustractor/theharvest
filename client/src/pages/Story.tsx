import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import FloorPlanViewer from "@/components/FloorPlanViewer";
import SitePlanExplorer from "@/components/SitePlanExplorer";
import {
  Utensils,
  Users,
  Hammer,
  Sprout,
  ArrowRight,
  ChevronDown,
  Quote,
  Palette,
  Flame,
  Heart,
  CheckCircle,
  Calendar,
  TreePine,
  MessageCircle,
  Mail,
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
    color: "bg-green-600",
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
    color: "bg-emerald-600",
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
    detail: "Sean (Aboriginal oyster farmer, Stradbroke Island) has 1,000 dozen ready for March 2026. Ticketed event to test demand.",
    status: "Confirmed",
  },
  {
    icon: Palette,
    title: "Architect On-Site",
    detail: "Thais has walked the site, measured the buildings, and is developing concept designs — scaffold pavilion, shed cladding, zone layouts.",
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

export default function Story() {
  return (
    <div className="story-page">
      {/* Scroll-snap container */}
      <div className="h-screen overflow-y-auto snap-y snap-mandatory">

        {/* ═══════════ 1. HERO ═══════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center relative bg-gradient-to-b from-stone-800 to-stone-900 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/images/harvest-hero.jpg')] bg-cover bg-center" />
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
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 mb-8">
                Witta has nowhere to gather
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {[
                  { value: "2,000+", label: "cars every weekend" },
                  { value: "Zero", label: "cafes or shops" },
                  { value: "#1", label: "homeschooling rate in Australia" },
                  { value: "10 min", label: "from Maleny — but a world away" },
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
                  — Nic, site walkthrough
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

        {/* ═══════════ 4. THE CANVAS ═══════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-stone-800">
          <div className="container px-4">
            <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white text-center mb-12">
                Our Design Philosophy
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    icon: Palette,
                    title: "Gallery, Not Museum",
                    text: "Nothing is super permanent. Like an art gallery — exhibitions come, people love them, they evolve, new ones take their place. The space is always becoming.",
                  },
                  {
                    icon: Flame,
                    title: "Test Before You Build",
                    text: "Pop-ups before permanent builds. We test with oysters and pizza before investing in a restaurant. Every dollar follows proof of demand.",
                  },
                  {
                    icon: Heart,
                    title: "Unfinished Canvas",
                    text: "You're not coming to something that's finished — you're coming to something you can be a part of. Every chair, every plant, every event is a community contribution.",
                  },
                ].map((principle) => {
                  const Icon = principle.icon;
                  return (
                    <motion.div key={principle.title} {...fadeInUp} className="text-center">
                      <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-6 w-6 text-amber-400" />
                      </div>
                      <h3 className="font-serif font-bold text-white text-lg mb-2">
                        {principle.title}
                      </h3>
                      <p className="text-stone-400 text-sm leading-relaxed">
                        {principle.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
              <motion.blockquote {...fadeInUp} className="text-center max-w-2xl mx-auto">
                <p className="text-lg text-stone-300 italic font-serif leading-relaxed">
                  "You're not coming to something finished — you're coming to something you can be a part of"
                </p>
              </motion.blockquote>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ 5. THE SPACE ═══════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-stone-50">
          <div className="container px-4 py-12">
            <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 mb-4">
                The Space
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                A former nursery with decades of rich soil, established fruit trees,
                rammed earth buildings, and covered outdoor spaces. Hover the zones
                to explore.
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
        <section className="min-h-screen snap-start flex items-center justify-center bg-white">
          <div className="container px-4">
            <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 text-center mb-10">
                The Oyster Story
              </h2>
              <div className="space-y-6 text-stone-700 text-lg leading-relaxed">
                <p>
                  Sean is an Aboriginal oyster farmer from Stradbroke Island.
                </p>
                <p>
                  When colonizers arrived in Brisbane, they blew up the Aboriginal oyster
                  leases for limestone — the Treasury building, the banks, the city
                  foundations are built from his ancestors' oyster shells.
                </p>
                <div className="border-l-4 border-amber-500 pl-6 py-2 my-8">
                  <p className="text-xl md:text-2xl font-serif italic text-stone-800">
                    At The Harvest, Sean sells oysters direct to community. People eat
                    on picnic blankets on the lawn. Shells are collected and used to make
                    rammed earth flooring. The oyster shells return to the earth — full
                    cycle.
                  </p>
                </div>
                <p className="text-stone-500 text-base text-center italic">
                  From seedling to harvest to compost — and back again.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

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
