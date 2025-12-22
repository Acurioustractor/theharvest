import Layout from "@/components/Layout";
import SwotCard from "@/components/SwotCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, MapPin, Leaf, ShieldAlert, Target, Zap, Anchor } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

export default function Home() {
  const swotData = {
    strengths: [
      { title: "Strong Community Foundation", description: "Deeply rooted community spirit with the Witta Market operating for 15+ years from the historic Old Witta School Community Centre." },
      { title: "Established Social Enterprise Culture", description: "Part of the Maleny-Witta region's robust cooperative ecosystem (7+ coops), creating a supportive environment for social business models." },
      { title: "Mission Alignment", description: "Clear values supporting small business, sustainability, and local creativity that resonate with conscious consumers." },
      { title: "Premium Location", description: "Situated in the scenic Blackall Ranges, attracting tourists and day-trippers seeking authentic hinterland experiences." },
      { title: "Diverse Offerings", description: "Mix of fresh produce, artisanal crafts, and live entertainment creates a complete destination experience." },
      { title: "Low Overhead Model", description: "Community-owned venue reduces fixed costs, allowing low-risk testing for new vendors." }
    ],
    weaknesses: [
      { title: "Limited Frequency", description: "Monthly operation (3rd Saturday) limits revenue potential and habit formation for customers." },
      { title: "Small Population Base", description: "Local population of ~1,296 requires heavy reliance on visitors from outside the immediate area." },
      { title: "Accessibility", description: "No public transport options; 100% reliant on private vehicle access." },
      { title: "Weather Dependency", description: "Outdoor/semi-outdoor nature makes operations vulnerable to the region's significant rainfall." },
      { title: "Limited Infrastructure", description: "Historic venue has charm but may lack modern amenities and parking capacity for growth." }
    ],
    opportunities: [
      { title: "Local & Ethical Demand", description: "79% of Australians believe farmers market produce is fresher; 87% motivated by supporting local farmers." },
      { title: "Agritourism Growth", description: "Identified as a key 5% growth sector in Australian agribusiness; Witta is perfectly positioned to capitalize." },
      { title: "Tourism Expansion", description: "Leveraging the 4.2 million annual visitors to the Sunshine Coast region." },
      { title: "Pop-Up Integration", description: "Collaboration with emerging pop-up dining scenes (e.g., Sourced Dining) to attract foodies." },
      { title: "Digital Expansion", description: "Potential for online ordering/subscription boxes following successful models like Farmers Pick." }
    ],
    threats: [
      { title: "Economic Pressures", description: "Rising cost of living may reduce discretionary spending on premium local products." },
      { title: "Supermarket Competition", description: "Major chains increasingly co-opting 'local' and 'fresh' branding." },
      { title: "Climate Change", description: "Extreme weather events impacting agricultural production and market attendance." },
      { title: "Vendor Sustainability", description: "Challenges in profitability and succession planning for small-scale producers." }
    ]
  };

  const marketData = [
    { name: "Freshness Perception", value: 79, color: "var(--primary)" },
    { name: "Support Local", value: 87, color: "var(--secondary)" },
    { name: "Family Outing", value: 75, color: "var(--chart-3)" },
    { name: "Supermarket Reliance", value: 82, color: "var(--chart-4)" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-background.jpg" 
            alt="Witta Hinterland Landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-sm font-medium tracking-wider mb-6">
              STRATEGIC BUSINESS ANALYSIS
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
              Witta Social Enterprise Ecosystem
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Uncovering the potential of community-led markets, restaurants, and pop-up enterprises in the Sunshine Coast Hinterland.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white border-none font-serif text-lg px-8 h-14 rounded-full shadow-xl" onClick={() => document.getElementById('swot')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Analysis
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md font-serif text-lg px-8 h-14 rounded-full" onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}>
                Read Overview
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-24 bg-background relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10" />
        
        <div className="container grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-8">
              A Community Rooted in <span className="text-secondary italic">Purpose</span>
            </h2>
            <div className="prose prose-lg text-muted-foreground">
              <p className="mb-6">
                Witta, situated in the scenic Blackall Ranges, represents a unique microcosm of the broader Maleny cooperative movement. With a population of just ~1,300, it punches above its weight in social capital.
              </p>
              <p className="mb-6">
                The ecosystem is anchored by the <strong>Witta Market</strong>, operating for over 15 years from the historic Old Witta School. It is supported by a growing network of local dining establishments like <em>The Nest</em> and <em>Witta General Store</em>, creating a resilient local economy focused on sustainability and connection.
              </p>
              <div className="flex gap-8 mt-8 border-t border-border pt-8">
                <div>
                  <span className="block text-4xl font-serif font-bold text-foreground">15+</span>
                  <span className="text-sm uppercase tracking-wider text-muted-foreground">Years Active</span>
                </div>
                <div>
                  <span className="block text-4xl font-serif font-bold text-foreground">7+</span>
                  <span className="text-sm uppercase tracking-wider text-muted-foreground">Regional Co-ops</span>
                </div>
                <div>
                  <span className="block text-4xl font-serif font-bold text-foreground">4.2M</span>
                  <span className="text-sm uppercase tracking-wider text-muted-foreground">Regional Visitors</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative z-10">
              <img 
                src="/images/market-atmosphere.jpg" 
                alt="Witta Market Atmosphere" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-2/3 aspect-video rounded-xl overflow-hidden shadow-xl z-20 border-4 border-background hidden md:block">
              <img 
                src="/images/local-produce.jpg" 
                alt="Local Produce" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative texture */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* SWOT Analysis Section */}
      <section id="swot" className="py-24 bg-muted/30 relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url(/images/swot-bg-texture.jpg)', backgroundSize: 'cover' }} />
        
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">SWOT Analysis</h2>
            <p className="text-lg text-muted-foreground">
              A comprehensive evaluation of the internal capabilities and external factors shaping the future of Witta's social enterprises.
            </p>
          </div>

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
      <section id="data" className="py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 h-[400px] w-full bg-card rounded-2xl p-8 shadow-sm border border-border">
              <h3 className="font-serif text-xl font-bold mb-6">Consumer Sentiment Drivers</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={140} 
                    tick={{ fill: 'var(--foreground)', fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {marketData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Source: Inside FMCG & Pureprofile Australian Consumer Survey 2024
              </p>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="font-serif text-4xl font-bold text-foreground mb-6">
                The Data Case for <span className="text-primary">Local</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                The strategic opportunity for Witta lies in the gap between consumer desire and market reality. While <strong>87%</strong> of Australians want to support local farmers, convenience remains a barrier.
              </p>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Community Connection</h4>
                    <p className="text-sm text-muted-foreground">The strongest emotional driver for visitation is the direct connection with producers.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Freshness Perception</h4>
                    <p className="text-sm text-muted-foreground">79% believe market produce is superior to supermarket offerings.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Agritourism Potential</h4>
                    <p className="text-sm text-muted-foreground">Identified as a top 5% growth opportunity for the region.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Recommendations */}
      <section id="strategy" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/community-gathering.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Strategic Roadmap</h2>
            <p className="text-lg text-primary-foreground/80">
              Actionable steps to leverage strengths and capture emerging opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-8 w-8" />,
                title: "Amplify Heritage",
                desc: "Leverage the 15+ year history and historic venue as a key differentiator against pop-up competitors."
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Digital Bridge",
                desc: "Develop online pre-ordering or subscription boxes to overcome the 'once-a-month' limitation."
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Agritourism Packages",
                desc: "Partner with local stays to create weekend 'hinterland immersion' experiences for city visitors."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl"
              >
                <div className="mb-6 text-secondary">{item.icon}</div>
                <h3 className="font-serif text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" variant="secondary" className="font-serif text-lg px-10 h-14 rounded-full shadow-xl hover:scale-105 transition-transform">
              Download Full Strategic Plan
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
