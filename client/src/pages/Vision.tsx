import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BeforeAfterComparison } from "@/components/ProgressGallery";
import FloorPlanViewer from "@/components/FloorPlanViewer";
import SitePlanExplorer from "@/components/SitePlanExplorer";
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
  Flame,
  Palette,
  Quote,
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
    color: "bg-amber-500",
  },
  {
    icon: Users,
    name: "Gather",
    description: "Markets, music, and community events that bring neighbours together throughout the year.",
    color: "bg-green-600",
  },
  {
    icon: Hammer,
    name: "Make",
    description: "Workshops in pottery, preserving, and craft — learn new skills with local makers and artisans.",
    color: "bg-stone-700",
  },
  {
    icon: Sprout,
    name: "Grow",
    description: "Garden centre with native species, productive plants, and expert advice for hinterland gardens.",
    color: "bg-emerald-600",
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
    name: "A Curious Tractor",
    role: "Strategic Oversight",
    description: "Regenerative innovation ecosystem — mission alignment, governance, and strategic direction.",
  },
  {
    name: "Nic",
    role: "Strategic Lead",
    description: "Community vision, relationships, and hands-on build. 10 days on tools before the March pop-up.",
  },
  {
    name: "Susie",
    role: "Site Manager",
    description: "Former supermarket manager. Daily operations, inventory, customer experience. 4 days/week.",
  },
  {
    name: "Cath",
    role: "Garden Lead",
    description: "Garden design with NDIS accessibility focus. Nursery ops, plant sourcing, volunteer coordination.",
  },
  {
    name: "Thais",
    role: "Architect & Designer",
    description: "Brazilian architect specialising in rammed earth. Concept design, floor plans, and material palette.",
  },
  {
    name: "Sean",
    role: "First Pop-Up Partner",
    description: "Aboriginal oyster farmer from Stradbroke Island. Supplying the March oyster bar pop-up and cultural connection.",
  },
];

export default function Vision() {
  return (
    <div className="min-h-screen bg-background vision-page">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative py-32 md:py-44 bg-gradient-to-b from-stone-800 to-stone-900 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/harvest-hero.jpg')] bg-cover bg-center" />
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
              The only gathering place in Witta — transforming a former nursery into
              a regenerative community platform on the Sunshine Coast Hinterland.
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
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              The Opportunity
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Witta has no cafe, no gathering place, no retail hub. Over 2,000 cars pass through
              every weekend on the way to Kenilworth — and there's nowhere to stop. The Harvest
              fills that gap.
            </p>
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
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-6 text-center">
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
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Location + proof points */}
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
                2,000+ cars/weekend passing through
              </span>
            </div>
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
                  icon: Palette,
                  title: "Gallery, Not Museum",
                  text: "Nothing is super permanent. Like an art gallery, exhibitions come, people love them, they evolve, and new ones take their place. The space is always becoming.",
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
                    <h3 className="font-serif font-bold text-white text-lg mb-2">{principle.title}</h3>
                    <p className="text-stone-400 text-sm leading-relaxed">{principle.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ THE SPACE ═══════════ */}
      <section className="py-20 md:py-28 bg-stone-50">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              The Space
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              A former nursery with decades of rich soil, established fruit trees, rammed earth buildings,
              and covered outdoor spaces — already growing tomatoes, pomegranate, coffee, taro, and herbs.
            </p>
          </motion.div>

          {/* Floor Plan */}
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto mb-12">
            <FloorPlanViewer />
          </motion.div>

          {/* Before/After Comparisons */}
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <h3 className="font-serif font-bold text-stone-700 text-xl mb-6 text-center">
              Transformation Preview
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <BeforeAfterComparison
                beforeImage="/images/placeholder-before.jpg"
                afterImage="/images/placeholder-after.jpg"
                title="Main Building — Cafe & Kitchen"
              />
              <BeforeAfterComparison
                beforeImage="/images/placeholder-before.jpg"
                afterImage="/images/placeholder-after.jpg"
                title="Outdoor Area — Event Lawn"
              />
            </div>
            <p className="text-center text-sm text-stone-400 mt-4 italic">
              Architect sketches and renovation renders coming soon
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ EXPLORE THE SITE PLAN ═══════════ */}
      <section>
        <motion.div {...fadeInUp} className="text-center pt-20 pb-8 bg-stone-50">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
            Explore the Site Plan
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed max-w-3xl mx-auto px-4">
            Toggle between stages to see how the site evolves — from current state through
            to the full master plan. Hover zones to explore each area.
          </p>
        </motion.div>
        <SitePlanExplorer />
      </section>

      {/* ═══════════ THE PLAN ═══════════ */}
      <section id="the-plan" className="py-20 md:py-28 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
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
      <section className="py-20 md:py-28 bg-stone-800 text-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
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

          {/* Revenue streams breakdown */}
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
                  <div key={row.stream} className="flex items-center gap-4">
                    <span className="text-sm text-stone-300 w-40 shrink-0">{row.stream}</span>
                    <div className="flex-1 h-3 bg-stone-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-amber-400 font-medium w-20 text-right">
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
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {team.map((member) => (
              <motion.div key={member.name} {...fadeInUp}>
                <Card className="border-0 shadow-md h-full">
                  <CardContent className="p-6 text-center">
                    <div className="h-16 w-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
                      <span className="font-serif font-bold text-stone-600 text-xl">
                        {member.name[0]}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-stone-800 text-lg">
                      {member.name}
                    </h3>
                    <p className="text-amber-600 text-sm font-medium mb-2">{member.role}</p>
                    <p className="text-stone-600 text-sm leading-relaxed">
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
      <section className="py-20 md:py-28 bg-stone-50">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Already Happening
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              We haven't waited to start. Here's what's in motion right now.
            </p>
          </motion.div>

          <motion.div {...staggerContainer} className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "First Pop-Up: March 2026",
                  description: "Oyster bar pop-up with Aboriginal oyster farmer Sean from Stradbroke Island. Ticketed event to test demand — shells collected for rammed earth flooring.",
                  status: "Confirmed",
                },
                {
                  title: "Architect On-Site",
                  description: "Thais has walked the site, measured the buildings, and is developing concept designs — scaffold pavilion, shed cladding, zone layouts, material palette.",
                  status: "In progress",
                },
                {
                  title: "Gardens Assessed",
                  description: "Existing produce mapped: tomatoes, pomegranate, Brazilian coffee, taro, herbs, lilly pillies, pecan trees. Gardener starting 2 days/week in February.",
                  status: "Starting Feb",
                },
                {
                  title: "Community Already Curious",
                  description: "Neighbours are stopping to ask what's happening. The local Facebook page is buzzing. People are ready for something to gather around.",
                  status: "Organic demand",
                },
              ].map((item) => (
                <motion.div key={item.title} {...fadeInUp}>
                  <Card className="border-0 shadow-md h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-serif font-bold text-stone-800">{item.title}</h3>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-stone-600 text-sm leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div {...fadeInUp} className="max-w-2xl mx-auto mt-12">
            <blockquote className="text-center">
              <Quote className="h-8 w-8 text-amber-500/30 mx-auto mb-4" />
              <p className="text-lg text-stone-700 italic font-serif leading-relaxed">
                "When I think about a harvest, you plant something, you nurture it, you water it,
                and then there's a ceremony where you cut it, and then there's a ceremony where
                you eat the harvest, and then you preserve the harvest, and then you compost the
                harvest, and then you start again."
              </p>
              <footer className="mt-4 text-sm text-stone-500">— Nic, site walkthrough</footer>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ THE PARTNERSHIP ═══════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
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
                  {/* What we bring */}
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

                  {/* What we're asking */}
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

            {/* Ownership pathway */}
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
      <section className="py-20 md:py-28 bg-gradient-to-b from-stone-800 to-stone-900">
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
          /* Hide nav, footer, and interactive elements */
          header, footer, nav,
          .vision-page button,
          .vision-page [role="slider"] {
            display: none !important;
          }

          /* Reset backgrounds for printing */
          .vision-page section {
            background: white !important;
            color: black !important;
            padding: 1.5rem 0 !important;
            page-break-inside: avoid;
          }

          .vision-page {
            font-size: 11pt;
          }

          /* Ensure text is black */
          .vision-page h1, .vision-page h2, .vision-page h3,
          .vision-page p, .vision-page li, .vision-page span {
            color: black !important;
          }

          /* Amber accents → dark gray for print */
          .vision-page .text-amber-400,
          .vision-page .text-amber-500,
          .vision-page .text-amber-600 {
            color: #333 !important;
          }

          /* Show images */
          .vision-page img {
            max-width: 100% !important;
            page-break-inside: avoid;
          }

          /* Cards - remove shadows */
          .vision-page .shadow-md,
          .vision-page .shadow-lg,
          .vision-page .shadow-xl {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }

          /* Revenue bars */
          .vision-page .bg-amber-500 {
            background: #666 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Dark sections → white with border */
          .vision-page .bg-stone-800,
          .vision-page .bg-stone-900 {
            background: white !important;
            border-top: 2px solid #333;
          }

          .vision-page .bg-stone-700\\/50,
          .vision-page .bg-stone-700\\/30 {
            background: #f5f5f5 !important;
            border: 1px solid #ddd !important;
          }

          /* Page breaks */
          .vision-page #the-plan {
            page-break-before: always;
          }
        }
      `}</style>
    </div>
  );
}
