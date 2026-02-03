import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function About() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="relative py-24 bg-stone-100">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-amber-600 font-medium tracking-wide uppercase text-sm">
              About
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-800 mt-3 mb-6">
              An old nursery becoming a gathering place
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              Rammed earth walls and good soil on Jinibara Country.
              We're turning it into somewhere people can eat, learn, make, and belong.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Short Version */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-6">
                The 30-second version
              </h2>
              <div className="prose prose-lg text-stone-600">
                <p>
                  Witta sits 10 minutes from Maleny in the Sunshine Coast Hinterland.
                  2,000 cars pass through every weekend. There's nowhere to stop.
                </p>
                <p>
                  The Harvest is a 5-acre site — an old nursery with a beautiful rammed earth
                  building, established gardens, and land that's been cared for decades.
                </p>
                <p>
                  We're not building a finished product. We're building something that grows
                  with the people who use it. Pop-up kitchens before a permanent restaurant.
                  Market mornings before a retail fit-out. Community first, always.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/compendium/hero-aerial.jpg"
                  alt="Aerial view of The Harvest site in Witta"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Invitation */}
      <section className="py-20 bg-stone-800">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              We're building this for...
            </h2>
            <p className="text-xl text-stone-300 leading-relaxed mb-4">
              The early risers who love a good market morning. The gardeners with dirt under their
              nails. The makers who need space to create. The families looking for a third place.
              The neighbours who want to know their neighbours.
            </p>
            <p className="text-xl font-serif font-bold text-amber-400">
              If that sounds like you, come be part of the story.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Go Deeper */}
      <section className="py-20 bg-stone-50">
        <div className="container">
          <motion.div
            {...fadeInUp}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
              Want to know more?
            </h2>
            <p className="text-lg text-stone-600">
              There's a lot more to the story. Here's where to go next.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-md p-8 h-full flex flex-col">
                <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">
                  Explore the Site
                </h3>
                <p className="text-stone-600 leading-relaxed mb-6 flex-1">
                  Interactive floor plans, site maps, the 3-year timeline, and what's
                  already in motion. See the space and the plan.
                </p>
                <Button
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 w-fit"
                  asChild
                >
                  <Link href="/story">
                    Our Story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white rounded-2xl shadow-md p-8 h-full flex flex-col">
                <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">
                  Read the Compendium
                </h3>
                <p className="text-stone-600 leading-relaxed mb-6 flex-1">
                  The full philosophy, the people, the land, and the vision.
                  Everything we believe about building community from the ground up.
                </p>
                <Button
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 w-fit"
                  asChild
                >
                  <Link href="/compendium">
                    The Compendium
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
