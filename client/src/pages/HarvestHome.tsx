import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Utensils,
  Leaf,
  Users,
  Hammer,
  MapPin,
  Calendar,
  ArrowRight,
  Heart,
  Sparkles,
  HandHeart,
  TreeDeciduous,
  Mail,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { InterestSelector, type Interest } from "@/components/InterestSelector";
import { useMutation } from "@tanstack/react-query";

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

const offers = [
  {
    icon: Utensils,
    title: "Eat",
    tagline: "Seasonal, simple, generous.",
    description:
      "A community kitchen serving honest food made with local produce. Come for breakfast, stay for the conversation.",
    image: "/images/harvest-eat.jpg",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Leaf,
    title: "Grow",
    tagline: "Seedlings, soil, skills.",
    description:
      "A garden centre and outdoor learning space where you can get your hands dirty and take something home to plant.",
    image: "/images/harvest-grow.jpg",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: Users,
    title: "Gather",
    tagline: "A venue with warmth and room to breathe.",
    description:
      "Host your celebration, workshop, or community event in a space designed for connection, not performance.",
    image: "/images/harvest-gather.jpg",
    color: "from-blue-500/20 to-indigo-500/20",
  },
  {
    icon: Hammer,
    title: "Make",
    tagline: "Workshops and maker days with locals.",
    description:
      "Learn new skills from neighbours who know their craft. Pottery, preserving, woodwork, and whatever else the community brings.",
    image: "/images/harvest-make.jpg",
    color: "from-purple-500/20 to-pink-500/20",
  },
];

const values = [
  {
    icon: Heart,
    title: "Community-led",
    description: "Locals shape what happens here. We listen, adapt, and grow together.",
  },
  {
    icon: Sparkles,
    title: "Inclusive",
    description: "Everyone deserves a place to land. No gatekeeping, no pretense.",
  },
  {
    icon: TreeDeciduous,
    title: "Sustainable",
    description: "We practice stewardship, not extraction. Good for the land, good for people.",
  },
  {
    icon: HandHeart,
    title: "Collaborative",
    description: "We back local enterprise and shared learning. Your success is our success.",
  },
];

const testimonials = [
  {
    quote: "Finally, a place in the hills where you can just show up and belong.",
    author: "Sarah M.",
    role: "Witta local",
  },
  {
    quote: "The workshops here have connected me with skills and people I never knew I needed.",
    author: "Tom K.",
    role: "Maleny resident",
  },
  {
    quote: "It's not trying to be fancy. It's trying to be real. And that's exactly what we needed.",
    author: "Jenny L.",
    role: "Community member",
  },
];

export default function HarvestHome() {
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newsletterMutation = useMutation({
    mutationFn: subscribeNewsletter,
    onSuccess: () => {
      toast.success("Welcome to The Harvest!", {
        description: "You've been added to our mailing list. We'll be in touch soon.",
      });
      setEmail("");
      setInterests([]);
      setIsSubmitting(false);
    },
    onError: (error: Error) => {
      toast.error("Subscription failed", {
        description: error.message || "Please try again later.",
      });
      setIsSubmitting(false);
    },
  });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    newsletterMutation.mutate({
      email,
      source: "Homepage Newsletter",
      interests: interests.length > 0 ? interests : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/harvest-hero.jpg"
            alt="The Harvest community gathering"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              A regenerative gathering place in Witta
            </span>

            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              A place to gather,
              <br />
              <span className="text-amber-300">grow, and share.</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
              Come for the food. Stay for the community.
              <br />A kitchen, garden centre, and creative hub in the Sunshine Coast hinterland.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-6 text-lg"
                asChild
              >
                <Link href="/whats-on">
                  <Calendar className="mr-2 h-5 w-5" />
                  See What's On
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg bg-white/5 backdrop-blur-sm"
                asChild
              >
                <Link href="/visit">
                  <MapPin className="mr-2 h-5 w-5" />
                  Plan Your Visit
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* What We Offer Section */}
      <section className="py-24 bg-gradient-to-b from-stone-50 to-white">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="text-amber-600 font-medium tracking-wide uppercase text-sm"
            >
              What We Offer
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mt-3 mb-6"
            >
              Eat. Grow. Gather. Make.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-stone-600 max-w-2xl mx-auto"
            >
              Four ways to connect with your community and the land. Start with one, stay for all.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            {offers.map((offer, index) => (
              <motion.div key={offer.title} variants={fadeInUp}>
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${offer.color} opacity-60`}
                    />
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                        <offer.icon className="h-6 w-6 text-stone-700" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-serif font-bold text-white drop-shadow-lg">
                          {offer.title}
                        </h3>
                        <p className="text-white/90 text-sm font-medium drop-shadow">
                          {offer.tagline}
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-stone-600 leading-relaxed">{offer.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Signature Invitation Section */}
      <section className="py-24 bg-stone-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
              This is a place for{" "}
              <span className="text-amber-400">people who want to belong</span> without having to
              perform.
            </h2>
            <p className="text-xl text-stone-300 mb-10 leading-relaxed">
              For families looking for a third place. For makers who need space and community. For
              anyone rebuilding confidence through routine and connection. For neighbours who
              believe good things grow when we work together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                asChild
              >
                <Link href="/about">
                  Learn Our Story
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="text-amber-600 font-medium tracking-wide uppercase text-sm"
            >
              What We Stand For
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mt-3 mb-6"
            >
              Values as behaviour
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-stone-600 max-w-2xl mx-auto">
              Not just words on a wall. This is what you'll experience when you walk through our
              door.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value) => (
              <motion.div key={value.title} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow bg-stone-50">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                      <value.icon className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-stone-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-amber-50 to-white">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="text-amber-600 font-medium tracking-wide uppercase text-sm"
            >
              Community Voices
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mt-3"
            >
              What neighbours say
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-md bg-white">
                  <CardContent className="p-8">
                    <div className="text-5xl text-amber-300 font-serif mb-4">"</div>
                    <p className="text-lg text-stone-700 italic mb-6 leading-relaxed">
                      {testimonial.quote}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center">
                        <span className="text-stone-600 font-medium">
                          {testimonial.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-stone-800">{testimonial.author}</p>
                        <p className="text-sm text-stone-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter / Join Section */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Mail className="h-12 w-12 text-amber-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Join the list</h2>
            <p className="text-stone-300 mb-8">
              Be the first to know about opening hours, events, workshops, and community gatherings.
              No spam, just good news from the hills.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold h-12 px-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Joining..." : "Join Us"}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <InterestSelector
                selected={interests}
                onChange={setInterests}
                variant="dark"
              />
            </form>
          </motion.div>
        </div>
      </section>

      {/* Quick Links / CTA Section */}
      <section className="py-16 bg-white border-t border-stone-200">
        <div className="container">
          <div className="grid sm:grid-cols-3 gap-6">
            <Link href="/whats-on">
              <Card className="group cursor-pointer border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-800">What's On</h3>
                    <p className="text-stone-600 text-sm">Events, workshops, markets</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/venue-hire">
              <Card className="group cursor-pointer border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-800">Book the Space</h3>
                    <p className="text-stone-600 text-sm">Venue hire enquiries</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/visit">
              <Card className="group cursor-pointer border-0 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-800">Visit Us</h3>
                    <p className="text-stone-600 text-sm">Hours, location, directions</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
