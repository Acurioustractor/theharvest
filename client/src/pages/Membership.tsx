import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  Heart,
  Leaf,
  Crown,
  Check,
  ArrowRight,
  Users,
  Sparkles,
  Gift,
  Calendar,
  Coffee,
  TreeDeciduous,
  Star,
  Bell,
  Mail,
} from "lucide-react";
import { useSeason } from "@/contexts/SeasonalContext";
import { useMutation } from "@tanstack/react-query";
import { subscribeNewsletter } from "@/lib/api";
import { toast } from "sonner";
import { InterestSelector, type Interest } from "@/components/InterestSelector";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

interface MembershipTier {
  id: string;
  name: string;
  price: number;
  period: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
  features: string[];
  highlighted?: boolean;
}

const membershipTiers: MembershipTier[] = [
  {
    id: "friend",
    name: "Friend",
    price: 50,
    period: "year",
    tagline: "Support the vision",
    description:
      "Perfect for those who believe in what we're building and want to help it grow. Your contribution directly supports community programs.",
    icon: Heart,
    color: "text-rose-600",
    bgGradient: "from-rose-50 to-white",
    features: [
      "Monthly newsletter with behind-the-scenes updates",
      "10% discount on workshops",
      "Early access to event bookings",
      "Name on our supporters wall",
      "Invitation to annual members gathering",
    ],
  },
  {
    id: "steward",
    name: "Steward",
    price: 150,
    period: "year",
    tagline: "Grow with us",
    description:
      "For committed community members who want deeper involvement. Help shape the future of The Harvest while enjoying exclusive benefits.",
    icon: Leaf,
    color: "text-emerald-600",
    bgGradient: "from-emerald-50 to-white",
    highlighted: true,
    features: [
      "Everything in Friend, plus:",
      "One free workshop per quarter",
      "Priority venue hire booking",
      "20% discount at the garden centre",
      "Quarterly steward gatherings",
      "Input into programming decisions",
      "Free coffee on every visit",
    ],
  },
  {
    id: "patron",
    name: "Patron",
    price: 500,
    period: "year",
    tagline: "Champion the cause",
    description:
      "Our most generous supporters who make ambitious projects possible. Patrons are true partners in building this community asset.",
    icon: Crown,
    color: "text-amber-600",
    bgGradient: "from-amber-50 to-white",
    features: [
      "Everything in Steward, plus:",
      "Unlimited free workshops",
      "Private venue hire once per year",
      "Named tree in the food forest",
      "Quarterly dinner with founders",
      "Input into strategic direction",
      "Recognition on all major signage",
      "Tax-deductible (DGR pending)",
    ],
  },
];

const impactStats = [
  {
    icon: Users,
    value: "500+",
    label: "Community members",
  },
  {
    icon: TreeDeciduous,
    value: "40+",
    label: "Trees planted",
  },
  {
    icon: Calendar,
    value: "100+",
    label: "Events hosted",
  },
  {
    icon: Coffee,
    value: "2,000+",
    label: "Coffees served",
  },
];

function MembershipCard({ tier }: { tier: MembershipTier }) {
  return (
    <motion.div variants={fadeInUp} className="h-full">
      <Card
        className={`h-full border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden ${
          tier.highlighted ? "ring-2 ring-emerald-500 ring-offset-2" : ""
        }`}
      >
        <div className={`bg-gradient-to-br ${tier.bgGradient}`}>
          {tier.highlighted && (
            <div className="bg-emerald-500 text-white text-center py-1 text-sm font-medium">
              Most Popular
            </div>
          )}
          <CardHeader className="text-center pt-8 pb-4">
            <div
              className={`w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4`}
            >
              <tier.icon className={`h-8 w-8 ${tier.color}`} />
            </div>
            <CardTitle className="text-2xl font-serif">{tier.name}</CardTitle>
            <p className={`text-sm font-medium ${tier.color}`}>{tier.tagline}</p>
          </CardHeader>

          <CardContent className="text-center pb-6">
            <div className="mb-4">
              <span className="text-5xl font-serif font-bold text-stone-800">
                ${tier.price}
              </span>
              <span className="text-stone-500">/{tier.period}</span>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              {tier.description}
            </p>
          </CardContent>
        </div>

        <CardContent className="pt-6 pb-8">
          <ul className="space-y-3 mb-8">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check
                  className={`h-5 w-5 ${tier.color} shrink-0 mt-0.5`}
                />
                <span className="text-sm text-stone-600">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            className={`w-full ${
              tier.highlighted
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-stone-800 hover:bg-stone-900 text-white"
            }`}
            size="lg"
            asChild
          >
            <a href="#express-interest">
              Express Interest
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Membership() {
  const { data: seasonalData } = useSeason();
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newsletterMutation = useMutation({
    mutationFn: subscribeNewsletter,
    onSuccess: () => {
      toast.success("You're on the list!", {
        description: "We'll notify you as soon as membership opens.",
      });
      setEmail("");
      setInterests([]);
      setIsSubmitting(false);
    },
    onError: (error: Error) => {
      toast.error("Something went wrong", {
        description: error.message || "Please try again later.",
      });
      setIsSubmitting(false);
    },
  });

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    newsletterMutation.mutate({
      email,
      source: "Membership Interest",
      interests: interests.length > 0 ? interests : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Coming Soon Banner */}
      <div className="bg-amber-500 text-black py-3">
        <div className="container">
          <div className="flex items-center justify-center gap-3 text-center">
            <Bell className="h-5 w-5" />
            <p className="font-medium">
              Membership is launching soon! Express your interest below to be first in line.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-stone-100 to-white overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-amber-100 text-amber-700 rounded-full">
              <Sparkles className="h-4 w-4" />
              Coming Soon
            </span>

            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-800 mb-6">
              Become a <span className="text-amber-600">Member</span>
            </h1>

            <p className="text-xl text-stone-600 mb-8 leading-relaxed">
              The Harvest grows through community support. Membership helps fund
              programs, maintain the space, and keep prices accessible for everyone.
              We're putting the finishing touches on our membership program.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Gift className="h-5 w-5 text-amber-500" />
                <span className="text-stone-700 font-medium">Exclusive benefits</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Heart className="h-5 w-5 text-rose-500" />
                <span className="text-stone-700 font-medium">Support the mission</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-stone-700 font-medium">Join the community</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-24 bg-white">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {membershipTiers.map((tier) => (
              <MembershipCard key={tier.id} tier={tier} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-gradient-to-b from-white to-stone-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Your Support in Action
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Every membership directly contributes to growing this community asset.
              Here's what we've achieved together.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {impactStats.map((stat, index) => (
              <motion.div key={stat.label} variants={fadeInUp}>
                <Card className="text-center border-0 shadow-md">
                  <CardContent className="p-8">
                    <stat.icon className="h-8 w-8 text-amber-500 mx-auto mb-4" />
                    <p className="text-4xl font-serif font-bold text-stone-800 mb-2">
                      {stat.value}
                    </p>
                    <p className="text-stone-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Questions?
            </h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6"
          >
            {[
              {
                q: "Can I change my membership level later?",
                a: "Absolutely. You can upgrade or downgrade at any time. If upgrading, you'll just pay the difference for the remaining period.",
              },
              {
                q: "Is my membership tax-deductible?",
                a: "We're currently applying for DGR (Deductible Gift Recipient) status. Once approved, Patron memberships will be partially tax-deductible. We'll notify members when this is confirmed.",
              },
              {
                q: "Can I gift a membership?",
                a: "Yes! Memberships make wonderful gifts. Contact us directly and we'll set up a gift membership with a personalized welcome.",
              },
              {
                q: "What if I can't afford membership but want to help?",
                a: "We value all contributions. Volunteering is a wonderful way to be part of The Harvest community. Check our volunteer opportunities or simply spread the word about what we're doing.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-stone-50 rounded-lg p-6"
              >
                <h3 className="font-semibold text-stone-800 mb-2">{faq.q}</h3>
                <p className="text-stone-600">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Express Interest CTA */}
      <section id="express-interest" className="py-24 bg-stone-900 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Mail className="h-12 w-12 text-amber-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Be First to Know
            </h2>
            <p className="text-xl text-stone-300 mb-10 leading-relaxed">
              Membership is launching soon. Leave your email and we'll notify you
              the moment it's ready. Early supporters may receive special benefits.
            </p>

            <form onSubmit={handleInterestSubmit} className="space-y-6">
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
                  {isSubmitting ? "Joining..." : "Notify Me"}
                  <Bell className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <InterestSelector
                selected={interests}
                onChange={setInterests}
                variant="dark"
              />
            </form>

            <p className="text-stone-400 text-sm mt-6">
              No spam, ever. Just a notification when membership opens.
            </p>

            <div className="mt-10 pt-10 border-t border-white/10">
              <p className="text-stone-400 mb-4">Have questions before then?</p>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
