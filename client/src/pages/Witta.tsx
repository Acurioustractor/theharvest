import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  TreeDeciduous,
  Mountain,
  Users,
  History,
  MapPin,
  ArrowRight,
  Leaf,
  Home,
  Heart,
  Camera,
} from "lucide-react";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
import { HarvestGallery } from "@/components/EmpathyLedgerGallery";

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

const timelineEvents = [
  {
    era: "Pre-1900s",
    title: "Jinibara Country",
    description:
      "This land has been cared for by the Jinibara people for thousands of years. The hinterland provided food, medicine, and gathering places long before European settlement.",
  },
  {
    era: "1900s",
    title: "Timber & Dairy",
    description:
      "European settlers arrived, drawn by the rich volcanic soil and reliable rainfall. The area became known for timber getting and dairy farming.",
  },
  {
    era: "1970s-90s",
    title: "The Nursery Era",
    description:
      "Our site operated as a plant nursery, growing seedlings and serving local gardeners. The greenhouses and growing beds that remain are part of this legacy.",
  },
  {
    era: "2020s",
    title: "A New Chapter",
    description:
      "After years of sitting quiet, the site is transforming into a community hub. The Harvest is writing the next chapter of this place's story.",
  },
];

const wittaFacts = [
  {
    icon: Mountain,
    title: "600m Elevation",
    description: "Cooler temperatures and misty mornings make Witta perfect for growing.",
  },
  {
    icon: TreeDeciduous,
    title: "Subtropical Rainforest",
    description: "Remnant rainforest patches hold ancient species and incredible biodiversity.",
  },
  {
    icon: Users,
    title: "~800 Residents",
    description: "A small, close-knit community where everyone knows their neighbours.",
  },
  {
    icon: Leaf,
    title: "Rich Red Soil",
    description: "Volcanic krasnozem soil – some of the most fertile in Australia.",
  },
];

export default function Witta() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-green-50 to-white overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-green-100 text-green-700 rounded-full">
              <History className="h-4 w-4" />
              About This Place
            </span>

            <EditableText
              page="witta"
              slot="hero-title"
              defaultContent="Witta"
              as="h1"
              className="text-5xl md:text-6xl font-serif font-bold text-stone-800 mb-6"
            />

            <EditableText
              page="witta"
              slot="hero-description"
              defaultContent="A small village in the Sunshine Coast Hinterland with a big heart. Witta sits on Jinibara country – land that has been gathering place, growing place, and home for thousands of years."
              as="p"
              className="text-xl text-stone-600 mb-8 leading-relaxed"
              multiline
            />

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <MapPin className="h-5 w-5 text-green-500" />
                <span className="text-stone-700 font-medium">Sunshine Coast Hinterland</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Mountain className="h-5 w-5 text-blue-500" />
                <span className="text-stone-700 font-medium">Blackall Range</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="py-12 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <EditableImage
              page="witta"
              slot="hero-image"
              alt="Witta landscape"
              className="w-full aspect-[21/9] rounded-2xl shadow-lg"
              imageClassName="object-cover"
              placeholder={
                <div className="w-full h-full bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center rounded-2xl">
                  <Mountain className="h-20 w-20 text-green-500" />
                </div>
              }
            />
          </motion.div>
        </div>
      </section>

      {/* Witta Facts */}
      <section className="py-24 bg-stone-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">
              What Makes Witta Special
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Tucked into the Blackall Range, Witta has a character all its own.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {wittaFacts.map((fact) => (
              <motion.div key={fact.title} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-md bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <fact.icon className="h-7 w-7 text-green-600" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">
                      {fact.title}
                    </h3>
                    <p className="text-stone-600 text-sm">{fact.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-amber-100 text-amber-700 rounded-full">
              <History className="h-4 w-4" />
              Through Time
            </span>
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">
              A Brief History
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              From ancient gathering place to modern community hub.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.era}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 pb-12 border-l-2 border-green-200 last:border-l-0 last:pb-0"
              >
                <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-green-500 ring-4 ring-white" />
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-3">
                  {event.era}
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">
                  {event.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Acknowledgement */}
      <section className="py-16 bg-stone-900 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Heart className="h-10 w-10 text-amber-400 mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-bold mb-4">
              Acknowledgement of Country
            </h2>
            <p className="text-stone-300 leading-relaxed">
              We acknowledge the Jinibara people as the Traditional Custodians of the land
              on which The Harvest stands. We pay our respects to Elders past, present, and emerging,
              and recognise their continuing connection to land, waters, and culture.
              This always was, and always will be, Aboriginal land.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-24 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-pink-100 text-pink-700 rounded-full">
              <Camera className="h-4 w-4" />
              Gallery
            </span>
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">
              Witta in Pictures
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              The landscape, the community, the feeling of this place.
            </p>
          </motion.div>

          <HarvestGallery tag="witta" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-amber-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Home className="h-12 w-12 text-green-600 mx-auto mb-6" />
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-6">
              Come Experience Witta
            </h2>
            <p className="text-xl text-stone-600 mb-10 leading-relaxed">
              The best way to understand this place is to be here. Walk the land,
              meet the people, and feel why this corner of the hinterland is so special.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                asChild
              >
                <Link href="/visit">
                  Plan Your Visit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
                asChild
              >
                <Link href="/accommodation">Where to Stay</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
