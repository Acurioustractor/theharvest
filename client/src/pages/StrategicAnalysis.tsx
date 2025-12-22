import { motion } from "framer-motion";
import SwotCard from "@/components/SwotCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  MapPin,
  Leaf,
  ShieldAlert,
  Target,
  Zap,
  Anchor,
  Lock,
  ArrowRight,
  BarChart3,
  FileText,
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function StrategicAnalysis() {
  const { isAuthenticated, loading } = useAuth();

  const swotData = {
    strengths: [
      {
        title: "Strong Community Foundation",
        description:
          "Deeply rooted community spirit with the Witta Market operating for 15+ years from the historic Old Witta School Community Centre.",
      },
      {
        title: "Established Social Enterprise Culture",
        description:
          "Part of the Maleny-Witta region's robust cooperative ecosystem (7+ coops), creating a supportive environment for social business models.",
      },
      {
        title: "Mission Alignment",
        description:
          "Clear values supporting small business, sustainability, and local creativity that resonate with conscious consumers.",
      },
      {
        title: "Premium Location",
        description:
          "Situated in the scenic Blackall Ranges, attracting tourists and day-trippers seeking authentic hinterland experiences.",
      },
      {
        title: "Diverse Offerings",
        description:
          "Mix of fresh produce, artisanal crafts, and live entertainment creates a complete destination experience.",
      },
      {
        title: "Low Overhead Model",
        description:
          "Community-owned venue reduces fixed costs, allowing low-risk testing for new vendors.",
      },
    ],
    weaknesses: [
      {
        title: "Limited Frequency",
        description:
          "Monthly operation (3rd Saturday) limits revenue potential and habit formation for customers.",
      },
      {
        title: "Small Population Base",
        description:
          "Local population of ~1,296 requires heavy reliance on visitors from outside the immediate area.",
      },
      {
        title: "Accessibility",
        description: "No public transport options; 100% reliant on private vehicle access.",
      },
      {
        title: "Weather Dependency",
        description:
          "Outdoor/semi-outdoor nature makes operations vulnerable to the region's significant rainfall.",
      },
      {
        title: "Limited Infrastructure",
        description:
          "Historic venue has charm but may lack modern amenities and parking capacity for growth.",
      },
    ],
    opportunities: [
      {
        title: "Local & Ethical Demand",
        description:
          "79% of Australians believe farmers market produce is fresher; 87% motivated by supporting local farmers.",
      },
      {
        title: "Agritourism Growth",
        description:
          "Identified as a key 5% growth sector in Australian agribusiness; Witta is perfectly positioned to capitalize.",
      },
      {
        title: "Tourism Expansion",
        description: "Leveraging the 4.2 million annual visitors to the Sunshine Coast region.",
      },
      {
        title: "Pop-Up Integration",
        description:
          "Collaboration with emerging pop-up dining scenes (e.g., Sourced Dining) to attract foodies.",
      },
      {
        title: "Digital Expansion",
        description:
          "Potential for online ordering/subscription boxes following successful models like Farmers Pick.",
      },
    ],
    threats: [
      {
        title: "Economic Pressures",
        description:
          "Rising cost of living may reduce discretionary spending on premium local products.",
      },
      {
        title: "Supermarket Competition",
        description: "Major chains increasingly co-opting 'local' and 'fresh' branding.",
      },
      {
        title: "Climate Change",
        description:
          "Extreme weather events impacting agricultural production and market attendance.",
      },
      {
        title: "Vendor Sustainability",
        description:
          "Challenges in profitability and succession planning for small-scale producers.",
      },
    ],
  };

  const marketData = [
    { name: "Freshness Perception", value: 79, color: "#2C5530" },
    { name: "Support Local", value: 87, color: "#C17855" },
    { name: "Family Outing", value: 75, color: "#8B7355" },
    { name: "Supermarket Reliance", value: 82, color: "#5C4033" },
  ];

  // Show login prompt if not authenticated
  if (!loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-b from-stone-800 to-stone-900 overflow-hidden">
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Lock className="h-16 w-16 text-amber-500 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                Strategic Analysis
              </h1>
              <p className="text-xl text-stone-300 leading-relaxed mb-8">
                This section contains detailed strategic analysis, market data, and planning
                documents for partners and stakeholders.
              </p>
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Sign in to access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">
                What's included
              </h2>
              <p className="text-stone-600">
                Partners and stakeholders can access comprehensive strategic resources.
              </p>
            </div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-md bg-stone-50">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-stone-800 mb-2">SWOT Analysis</h3>
                    <p className="text-stone-600 text-sm">
                      Comprehensive evaluation of strengths, weaknesses, opportunities, and threats.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-md bg-stone-50">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-stone-800 mb-2">Market Data</h3>
                    <p className="text-stone-600 text-sm">
                      Consumer sentiment, regional statistics, and industry trends.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 shadow-md bg-stone-50">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-stone-800 mb-2">Strategic Roadmap</h3>
                    <p className="text-stone-600 text-sm">
                      Actionable recommendations and implementation priorities.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-stone-800 to-stone-900 overflow-hidden">
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-amber-500 font-medium tracking-wide uppercase text-sm">
              Partner Resources
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mt-3 mb-6">
              Strategic Analysis
            </h1>
            <p className="text-xl text-stone-300 leading-relaxed">
              Comprehensive SWOT analysis, market data, and strategic recommendations for Witta's
              social enterprise ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-6">
                A Community Rooted in <span className="text-amber-600 italic">Purpose</span>
              </h2>
              <div className="prose prose-lg text-stone-600">
                <p>
                  Witta, situated in the scenic Blackall Ranges, represents a unique microcosm of
                  the broader Maleny cooperative movement. With a population of just ~1,300, it
                  punches above its weight in social capital.
                </p>
                <p>
                  The ecosystem is anchored by the <strong>Witta Market</strong>, operating for over
                  15 years from the historic Old Witta School. It is supported by a growing network
                  of local dining establishments like <em>The Nest</em> and{" "}
                  <em>Witta General Store</em>, creating a resilient local economy focused on
                  sustainability and connection.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-3 gap-6">
                <Card className="border-0 shadow-md bg-stone-50 text-center">
                  <CardContent className="p-6">
                    <span className="block text-4xl font-serif font-bold text-stone-800">15+</span>
                    <span className="text-sm text-stone-600">Years Active</span>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-stone-50 text-center">
                  <CardContent className="p-6">
                    <span className="block text-4xl font-serif font-bold text-stone-800">7+</span>
                    <span className="text-sm text-stone-600">Regional Co-ops</span>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-stone-50 text-center">
                  <CardContent className="p-6">
                    <span className="block text-4xl font-serif font-bold text-stone-800">4.2M</span>
                    <span className="text-sm text-stone-600">Regional Visitors</span>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SWOT Analysis Section */}
      <section className="py-16 bg-stone-50">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4"
            >
              SWOT Analysis
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-stone-600 max-w-2xl mx-auto">
              A comprehensive evaluation of the internal capabilities and external factors shaping
              the future of Witta's social enterprises.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <SwotCard
              type="strengths"
              items={swotData.strengths}
              icon={<Anchor className="h-6 w-6" />}
            />
            <SwotCard
              type="weaknesses"
              items={swotData.weaknesses}
              icon={<ShieldAlert className="h-6 w-6" />}
            />
            <SwotCard
              type="opportunities"
              items={swotData.opportunities}
              icon={<Zap className="h-6 w-6" />}
            />
            <SwotCard
              type="threats"
              items={swotData.threats}
              icon={<TrendingUp className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Market Data Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="h-[400px] w-full bg-stone-50 rounded-2xl p-8 shadow-sm border border-stone-200">
              <h3 className="font-serif text-xl font-bold text-stone-800 mb-6">
                Consumer Sentiment Drivers
              </h3>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart
                  data={marketData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={140}
                    tick={{ fill: "#44403c", fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {marketData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-stone-500 mt-4 text-center">
                Source: Inside FMCG & Pureprofile Australian Consumer Survey 2024
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-serif font-bold text-stone-800 mb-6">
                The Data Case for <span className="text-green-700">Local</span>
              </h2>
              <p className="text-lg text-stone-600 mb-6">
                The strategic opportunity for Witta lies in the gap between consumer desire and
                market reality. While <strong>87%</strong> of Australians want to support local
                farmers, convenience remains a barrier.
              </p>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800">Community Connection</h4>
                    <p className="text-sm text-stone-600">
                      The strongest emotional driver for visitation is the direct connection with
                      producers.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800">Freshness Perception</h4>
                    <p className="text-sm text-stone-600">
                      79% believe market produce is superior to supermarket offerings.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800">Agritourism Potential</h4>
                    <p className="text-sm text-stone-600">
                      Identified as a top 5% growth opportunity for the region.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Recommendations */}
      <section className="py-16 bg-stone-800 text-white">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-serif font-bold mb-4"
            >
              Strategic Roadmap
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-stone-300 max-w-2xl mx-auto">
              Actionable steps to leverage strengths and capture emerging opportunities.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Target className="h-8 w-8" />,
                title: "Amplify Heritage",
                desc: "Leverage the 15+ year history and historic venue as a key differentiator against pop-up competitors.",
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Digital Bridge",
                desc: "Develop online pre-ordering or subscription boxes to overcome the 'once-a-month' limitation.",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Agritourism Packages",
                desc: "Partner with local stays to create weekend 'hinterland immersion' experiences for city visitors.",
              },
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full bg-white/10 backdrop-blur border-white/20">
                  <CardContent className="p-8">
                    <div className="mb-6 text-amber-400">{item.icon}</div>
                    <h3 className="text-xl font-serif font-bold mb-4">{item.title}</h3>
                    <p className="text-stone-300 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
