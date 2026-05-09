import { motion } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Users } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function People() {
  const { data: storytellers, isLoading } = trpc.harvest.publicStorytellers.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <section className="pt-32 pb-12 bg-gradient-to-b from-amber-50 to-stone-50">
        <div className="container">
          <motion.div
            {...fadeInUp}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              The people of The Harvest
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-6">
              Who is on the land
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Storytellers, growers, makers — the people whose hands and voices shape The Harvest.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="container">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-lg border border-stone-200 bg-white" />
              ))}
            </div>
          ) : !storytellers || storytellers.length === 0 ? (
            <p className="text-center text-stone-600">No storytellers yet — check back soon.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {storytellers.map((s, i) => (
                <motion.article
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link href={`/people/${s.slug}`}>
                    <a className="group block h-full overflow-hidden rounded-lg border border-stone-200 bg-white p-6 transition hover:border-amber-300 hover:shadow-md">
                      <div className="flex items-start gap-4">
                        {s.avatarUrl ? (
                          <img
                            src={s.avatarUrl}
                            alt={s.displayName}
                            className="h-16 w-16 flex-shrink-0 rounded-full border border-stone-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-stone-200 bg-amber-50 text-2xl font-serif font-bold text-amber-700">
                            {s.displayName.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h2 className="text-xl font-serif font-bold text-stone-800 group-hover:text-amber-700">
                            {s.displayName}
                          </h2>
                          <p className="mt-1 text-xs text-stone-500">
                            {s.location ?? "The Harvest"}
                            {s.projectRole && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-700">
                                {s.projectRole}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {s.bio && (
                        <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-stone-600">
                          {s.bio}
                        </p>
                      )}

                      <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
                        <div className="flex flex-wrap gap-2 text-xs text-stone-500">
                          {s.publishedArticleCount > 0 && (
                            <span>{s.publishedArticleCount} {s.publishedArticleCount === 1 ? "article" : "articles"}</span>
                          )}
                          {s.publishedStoryCount > 0 && (
                            <span>· {s.publishedStoryCount} {s.publishedStoryCount === 1 ? "story" : "stories"}</span>
                          )}
                          {s.publishedArticleCount === 0 && s.publishedStoryCount === 0 && (
                            <span className="text-stone-400">Profile only — content coming</span>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-stone-400 transition group-hover:translate-x-1 group-hover:text-amber-600" />
                      </div>
                    </a>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
