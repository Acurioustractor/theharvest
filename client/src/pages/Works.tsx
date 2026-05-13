import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { works, LIFECYCLE_VOCAB, sortLifecycleTags } from "@/data/works";
import { EditableText } from "@/components/EditableText";
import { HarvestImage } from "@/components/HarvestImage";
import { useAuth } from "@/_core/hooks/useAuth";
import { SiteFooter, SiteNav } from "./HarvestReviewTest";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};


export default function Works() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    document.title = "The Collection · The Harvest";
    const desc = "The works of The Harvest — a living collection on Jinibara Country, Witta. Each piece carries a thread back to the history of the place.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <SiteNav />
      {/* Hero */}
      <section className="relative pb-24 pt-36 md:pb-32 md:pt-44 bg-stone-100">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-amber-600 font-mono text-sm mb-4 uppercase tracking-[0.2em]">
              The Collection · {works.length} works
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-800 mb-8 leading-[0.95]">
              Everything here<br />is a piece.
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
              The Harvest is a slow, living collection. Some works are built.
              Some are growing. Some are still forthcoming. Each one carries a
              thread back to the history of this place.
            </p>
            <div className="mt-10">
              <Link
                href="/witta"
                className="inline-flex items-center gap-2 text-stone-700 hover:text-stone-900 underline underline-offset-4 decoration-amber-500 decoration-2"
              >
                Read the Witta history first
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Works grid */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-6xl mx-auto grid gap-10 md:gap-14 md:grid-cols-2">
            {works.map((work, i) => {
              const lifecycleTags = sortLifecycleTags(work.lifecycleTags);
              const number = String(i + 1).padStart(2, "0");

              return (
                <motion.article
                  key={work.slug}
                  {...fadeInUp}
                  transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                  className="group"
                >
                  {/* Image plate — clickable */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-200 rounded-sm shadow-sm group-hover:shadow-md transition-shadow">
                    <HarvestImage
                      page="works"
                      slot={`${work.slug}-card`}
                      src={work.heroImage}
                      alt={work.heroAlt}
                      defaultWorkSlug={work.slug}
                      size="card"
                      className="absolute inset-0 h-full w-full"
                      imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      {lifecycleTags.map((tag) => {
                        const meta = LIFECYCLE_VOCAB[tag];
                        return (
                          <span
                            key={tag}
                            className={`inline-flex items-center px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full ${meta.badgeClass}`}
                          >
                            {meta.label}
                          </span>
                        );
                      })}
                    </div>
                    {!isAdmin && (
                      <Link
                        href={`/works/${work.slug}`}
                        className="absolute inset-0"
                        aria-label={`See ${work.title}`}
                      />
                    )}
                  </div>

                  {/* Museum label — text outside the Link so EditableText pencils don't navigate */}
                  <div className="mt-6 grid grid-cols-[auto_1fr] gap-x-6">
                    <p className="font-mono text-stone-400 text-sm tabular-nums pt-1">
                      {number}
                    </p>
                    <div>
                      <Link href={`/works/${work.slug}`}>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 group-hover:text-amber-700 transition-colors cursor-pointer">
                          {work.title}
                        </h2>
                      </Link>
                      <EditableText
                        page="works-index"
                        slot={`${work.slug}-subtitle`}
                        defaultContent={work.subtitle}
                        as="p"
                        className="text-stone-600 italic mt-1 leading-snug"
                        multiline
                      />
                      <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
                        <span className="font-mono text-stone-400 uppercase tracking-wider text-[10px] pt-1">Year</span>
                        <span className="text-stone-700">{work.year}</span>
                        <span className="font-mono text-stone-400 uppercase tracking-wider text-[10px] pt-1">Materials</span>
                        <span className="text-stone-700">{work.materials}</span>
                      </div>
                      <EditableText
                        page="works-index"
                        slot={`${work.slug}-blurb`}
                        defaultContent={work.blurb}
                        as="p"
                        className="mt-5 text-stone-600 leading-relaxed"
                        multiline
                      />
                      <Link
                        href={`/works/${work.slug}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-amber-700 font-medium text-sm group-hover:gap-2.5 transition-all"
                      >
                        See the work
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing band */}
      <section className="py-24 bg-stone-800 text-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center">
            <p className="text-amber-400 font-mono text-sm mb-4 uppercase tracking-[0.2em]">
              The Collection grows
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              The next pieces will be made with you.
            </h2>
            <p className="text-lg text-stone-300 leading-relaxed mb-10">
              Each season brings a new work — sometimes a structure, sometimes a
              practice, sometimes a partnership. Add a memory, share a skill, or
              come and help build one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/witta"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 transition-colors"
              >
                Add to Witta history
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-stone-500 text-stone-200 hover:bg-stone-700 transition-colors"
              >
                Back to The Harvest
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
