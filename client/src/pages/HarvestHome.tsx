import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Newspaper, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import BlogCard, { type ELArticle } from "@/components/BlogCard";

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

const pillars = [
  {
    word: "Eat",
    line: "A kitchen that feeds the neighbourhood. Local produce, shared tables, honest food.",
  },
  {
    word: "Gather",
    line: "Markets, music, workshops, and the kind of mornings that turn strangers into regulars.",
  },
  {
    word: "Make",
    line: "Studio space for artists, makers, and anyone who needs a place to work with their hands.",
  },
  {
    word: "Grow",
    line: "Gardens, nursery beds, and soil that's been growing things on this hill for a hundred years.",
  },
];

export default function HarvestHome() {
  const { data: recentPosts = [] } = useQuery({
    queryKey: ["blog", "recent"],
    queryFn: () => trpc.blog.recent.query({ limit: 3 }),
  });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero — Full-bleed aerial with declaration */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            src="/images/compendium/hero-aerial.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 container text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
              Witta has nowhere to gather.
              <br />
              <span className="text-amber-300">We're changing that.</span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-6 text-lg"
                asChild
              >
                <Link href="/compendium">The Compendium</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg bg-white/5 backdrop-blur-sm"
                asChild
              >
                <Link href="/blog">The Harvest Journal</Link>
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

      {/* Four Pillars */}
      <section className="py-24 bg-stone-100">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-800">
                Eat. Gather. Make. Grow.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              {pillars.map((pillar) => (
                <motion.div key={pillar.word} variants={fadeInUp} className="text-center">
                  <h3 className="text-2xl font-serif font-bold text-stone-800 mb-3">
                    {pillar.word}
                  </h3>
                  <p className="text-stone-600 leading-relaxed">{pillar.line}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Invitation */}
      <section className="py-24 bg-stone-800 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">
              Building for people who want to{" "}
              <span className="text-amber-400">belong without having to perform.</span>
            </h2>
            <p className="text-xl text-stone-300 mb-10 leading-relaxed">
              For families looking for a third place. For makers who need space and community. For
              anyone rebuilding confidence through routine and connection. For neighbours who
              believe good things grow when we work together.
            </p>
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              asChild
            >
              <Link href="/compendium">
                Read the Compendium
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Blog Preview */}
      {recentPosts.length > 0 && (
        <section className="py-24 bg-stone-50">
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
                From the Journal
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mt-3 mb-6"
              >
                Latest stories
              </motion.h2>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {recentPosts.map((article: ELArticle) => (
                <motion.div key={article.id} variants={fadeInUp}>
                  <BlogCard article={article} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12"
            >
              <Button variant="outline" size="lg" asChild>
                <Link href="/blog">
                  <Newspaper className="mr-2 h-5 w-5" />
                  Read More
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

    </div>
  );
}
