import { useState } from "react";
import { motion } from "framer-motion";
import { subscribeNewsletter } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { InterestSelector, type Interest } from "@/components/InterestSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Leaf,
  Heart,
  Handshake,
  Mail,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";

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

const values = [
  {
    icon: Users,
    title: "Community-led",
    description:
      "Locals shape what happens here. From the events we host to the produce we grow, the community's voice guides our direction.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Heart,
    title: "Inclusive",
    description:
      "Everyone deserves a place to land. Whether you're new to the area or have lived here for generations, there's a seat at our table.",
    color: "bg-pink-100 text-pink-700",
  },
  {
    icon: Leaf,
    title: "Sustainable",
    description:
      "We practice stewardship, not extraction. From our gardens to our partnerships, we're building something that lasts.",
    color: "bg-green-100 text-green-700",
  },
  {
    icon: Handshake,
    title: "Collaborative",
    description:
      "We back local enterprise and shared learning. Success here means success for the whole community.",
    color: "bg-blue-100 text-blue-700",
  },
];

const collaborators = [
  {
    name: "Witta Market",
    description: "Monthly community market running for 15+ years",
    link: "/whats-on",
  },
  {
    name: "Local Producers",
    description: "Fresh produce from farms across the hinterland",
    link: "/enterprises",
  },
  {
    name: "Maleny Co-ops",
    description: "Part of the region's cooperative ecosystem",
    link: "/enterprises",
  },
  {
    name: "Community Groups",
    description: "Supporting local clubs, schools, and organisations",
    link: "/venue-hire",
  },
];

export default function About() {
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newsletterMutation = useMutation({
    mutationFn: subscribeNewsletter,
    onSuccess: () => {
      toast.success("Welcome to The Harvest!", {
        description: "You've been added to our mailing list.",
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    newsletterMutation.mutate({
      email,
      source: "About Page Newsletter",
      interests: interests.length > 0 ? interests : undefined,
    });
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-stone-100 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-amber-600 font-medium tracking-wide uppercase text-sm">
              Our Story
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-800 mt-3 mb-6">
              About The Harvest
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              A regenerative gathering place in Witta. A place to eat, learn, grow, make, and
              belong.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-6">
                A place that grew from the ground up
              </h2>
              <div className="prose prose-lg text-stone-600">
                <p>
                  The Harvest began with a simple question: what would it look like to create a
                  space where the community could truly gather – not just to consume, but to
                  contribute?
                </p>
                <p>
                  Nestled in the hills of Witta, just 10 minutes from Maleny, we're part of a region
                  with deep roots in cooperative enterprise and community-led initiatives. The
                  Sunshine Coast Hinterland has long been home to people who believe in doing things
                  differently.
                </p>
                <p>
                  We're not a closed club. We're not a glossy wellness brand. We're not
                  profit-at-all-costs. We're a place where locals shape what happens, where everyone
                  deserves a seat at the table, and where we're building something that lasts.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-amber-100 to-green-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <Leaf className="h-20 w-20 text-green-600 mx-auto mb-4" />
                  <p className="text-2xl font-serif font-bold text-stone-800">
                    Growing together since 2024
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-green-500/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              What we stand for
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-stone-600 max-w-2xl mx-auto">
              Our values aren't just words on a wall – they're how we make decisions, every day.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {values.map((value) => (
              <motion.div key={value.title} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-5">
                      <div
                        className={`w-14 h-14 rounded-full ${value.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <value.icon className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">
                          {value.title}
                        </h3>
                        <p className="text-stone-600 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Signature Invitation */}
      <section className="py-16 bg-amber-500">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-6">
              This is a place for...
            </h2>
            <p className="text-xl text-black/80 leading-relaxed mb-8">
              The early risers who love a good market morning. The gardeners with dirt under their
              nails. The makers who need space to create. The families looking for a third place.
              The neighbours who want to know their neighbours. The curious ones who just want to
              see what's growing.
            </p>
            <p className="text-2xl font-serif font-bold text-black">
              If that sounds like you, you're already welcome here.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collaborators Section */}
      <section className="py-16 bg-white">
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
              Our collaborators
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-stone-600 max-w-2xl mx-auto">
              The Harvest doesn't exist in isolation. We're part of a network of local producers,
              community groups, and regional initiatives.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {collaborators.map((collab) => (
              <motion.div key={collab.name} variants={fadeInUp}>
                <Link href={collab.link}>
                  <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold text-stone-800 mb-2 group-hover:text-amber-600 transition-colors">
                        {collab.name}
                      </h3>
                      <p className="text-stone-600 text-sm">{collab.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-10"
          >
            <p className="text-stone-600 mb-4">
              Interested in collaborating with The Harvest?
            </p>
            <Button
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
              asChild
            >
              <a href="mailto:partners@theharvestwitta.com.au">
                Get in touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-stone-800 text-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-serif font-bold mb-6">Get in touch</h2>
              <p className="text-stone-300 mb-8">
                Whether you have a question, want to book the space, or just want to say hello –
                we'd love to hear from you.
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:hello@theharvestwitta.com.au"
                  className="flex items-center gap-3 text-stone-300 hover:text-amber-400 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  hello@theharvestwitta.com.au
                </a>
                <a
                  href="tel:+61754941234"
                  className="flex items-center gap-3 text-stone-300 hover:text-amber-400 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  (07) 5494 1234
                </a>
                <div className="flex items-center gap-3 text-stone-300">
                  <MapPin className="h-5 w-5" />
                  123 Witta Road, Witta QLD 4552
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <a
                  href="https://instagram.com/theharvestwitta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com/theharvestwitta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 bg-white/5 backdrop-blur">
                <CardContent className="p-8">
                  <h3 className="text-xl font-serif font-bold mb-4">Stay in the loop</h3>
                  <p className="text-stone-300 mb-6">
                    Join our mailing list for updates on events, market days, and what's growing.
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <InterestSelector
                      selected={interests}
                      onChange={setInterests}
                      variant="dark"
                    />
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        "Join the list"
                      )}
                    </Button>
                  </form>
                  <p className="text-stone-400 text-sm mt-4">
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
