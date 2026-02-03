import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  MapPin,
  Car,
  Accessibility,
  Dog,
  Phone,
  Mail,
  Navigation,
  Calendar,
  ArrowRight,
  TreePine,
  Tent,
  Footprints,
} from "lucide-react";

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

const whatYoullFind = [
  {
    icon: TreePine,
    title: "The Nursery",
    description:
      "The old nursery has been growing native species for decades — grevilleas, lomandras, lilly pillies, and rare subtropical plants. It's the heart of the property and the reason the land is in the shape it's in.",
  },
  {
    icon: Tent,
    title: "The Building",
    description:
      "A beautiful rammed earth building with natural light and room to move. We're fitting it out now as a community hub — kitchen, gathering space, workshop area. It's not ready yet, but it's getting there.",
  },
  {
    icon: Footprints,
    title: "The Land",
    description:
      "5 acres on Jinibara Country in the Sunshine Coast Hinterland. Established gardens, pecan trees, green paddocks, and the kind of quiet you don't get on the coast. We're restoring the gardens and building new spaces across the site.",
  },
];

const faqs = [
  {
    icon: Dog,
    question: "Are dogs welcome?",
    answer:
      "Well-behaved dogs on leads are welcome in our outdoor areas. Please keep them close and clean up after them.",
  },
  {
    icon: Accessibility,
    question: "Is the site accessible?",
    answer:
      "We're developing accessible pathways across the site. Some areas are still rough ground — get in touch and we'll let you know what to expect.",
  },
  {
    icon: Car,
    question: "Is there parking?",
    answer:
      "Free parking on site with plenty of space. On event days, overflow parking is available in the adjacent paddock.",
  },
];

export default function Visit() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/site-plan/layers/photos/00-base-photo.png"
            alt="Aerial view of The Harvest site in Witta"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        <div className="container relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-amber-400 font-medium tracking-wide uppercase text-sm">
              Plan Your Visit
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mt-3 mb-6">
              Come find us in the hills
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              5 acres of hinterland between the dairy farms and the rainforest.
              10 minutes from Maleny — but a world away from everything else.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What You'll Find */}
      <section className="py-20 bg-white">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4"
            >
              What's here
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-stone-600 max-w-2xl mx-auto">
              We're in the middle of building something. Here's what the site looks like right now.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {whatYoullFind.map((item) => (
              <motion.div key={item.title} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-md bg-stone-50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
                      <item.icon className="h-7 w-7 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-stone-600 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Good to Know */}
      <section className="py-16 bg-stone-800">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-serif font-bold text-white mb-6">
              Good to know
            </h2>
            <div className="grid sm:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-amber-400 font-semibold mb-2">Dress for the hills</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  It's often 5–10 degrees cooler up here than the coast. Bring a layer.
                  Closed shoes are a good idea — it's a working site.
                </p>
              </div>
              <div>
                <h3 className="text-amber-400 font-semibold mb-2">We're still building</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  The building is being fitted out. Paths are being laid. Gardens are being restored.
                  If you visit now, you're seeing the beginning — not the finished thing.
                </p>
              </div>
              <div>
                <h3 className="text-amber-400 font-semibold mb-2">Get in touch first</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  We're not open for drop-ins yet. If you'd like to see the site or
                  talk about what's happening, reach out and we'll arrange a time.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Location & Info Grid */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden border-0 shadow-lg h-full">
                <div className="h-80 lg:h-full min-h-[400px]">
                  <iframe
                    title="The Harvest location map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=152.80%2C-26.73%2C152.84%2C-26.70&layer=mapnik&marker=-26.7176%2C152.8178"
                  />
                </div>
              </Card>
            </motion.div>

            {/* Location Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Address */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-stone-800">Location</h2>
                </div>
                <div className="ml-[52px]">
                  <p className="text-lg text-stone-700 mb-2">
                    <strong>The Harvest</strong>
                  </p>
                  <p className="text-stone-600 mb-4">
                    9 Gumland Drive
                    <br />
                    Witta QLD 4552
                  </p>
                  <p className="text-stone-500 text-sm mb-4">
                    10 minutes from Maleny. Follow the signs once you turn off the Maleny-Kenilworth Road.
                  </p>
                  <Button
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    onClick={() =>
                      window.open(
                        "https://www.google.com/maps/dir/?api=1&destination=-26.7176,152.8178",
                        "_blank"
                      )
                    }
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                </div>
              </div>

              {/* When to Visit */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-stone-800">When to Visit</h2>
                </div>
                <div className="ml-[52px]">
                  <p className="text-stone-600 mb-3">
                    We're not open to the public yet — we're still building. Site visits are
                    by arrangement. Get in touch if you'd like to come see what we're working on,
                    or keep an eye on our events page for the first pop-ups and gatherings.
                  </p>
                  <Button
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    asChild
                  >
                    <Link href="/contact">
                      Get in Touch
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-stone-800">Contact</h2>
                </div>
                <div className="ml-[52px] space-y-2">
                  <a
                    href="tel:+61422883943"
                    className="flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    0422 883 943
                  </a>
                  <a
                    href="mailto:hello@theharvestwitta.com.au"
                    className="flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    hello@theharvestwitta.com.au
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Common questions
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <faq.icon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-stone-800 mb-2">{faq.question}</h3>
                        <p className="text-stone-600 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
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
