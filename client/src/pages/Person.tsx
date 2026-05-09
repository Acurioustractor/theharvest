import { motion } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, MapPin, Newspaper, BookOpen, Image as ImageIcon } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

export default function Person({ slug }: { slug: string }) {
  const { data, isLoading, error } = trpc.harvest.publicStorytellerBySlug.useQuery(
    { slug },
    { enabled: !!slug },
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32">
        <div className="container mx-auto max-w-3xl">
          <div className="h-64 animate-pulse rounded-lg border border-stone-200 bg-white" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 pb-16">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-serif font-bold text-stone-800">No one here by that name.</h1>
          <p className="mt-4 text-stone-600">This storyteller might not be on The Harvest project (yet).</p>
          <Link href="/people">
            <a className="mt-6 inline-flex items-center gap-2 text-amber-700 hover:text-amber-800">
              <ArrowLeft className="h-4 w-4" /> Back to all people
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const s = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <section className="pt-32 pb-12 bg-gradient-to-b from-amber-50 to-stone-50">
        <div className="container">
          <Link href="/people">
            <a className="mb-6 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700">
              <ArrowLeft className="h-4 w-4" /> All people
            </a>
          </Link>

          <motion.div {...fadeInUp} className="max-w-3xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {s.avatarUrl ? (
                <img
                  src={s.avatarUrl}
                  alt={s.displayName}
                  className="h-32 w-32 flex-shrink-0 rounded-full border-2 border-stone-200 object-cover shadow-md"
                />
              ) : (
                <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full border-2 border-stone-200 bg-amber-100 text-5xl font-serif font-bold text-amber-700 shadow-md">
                  {s.displayName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800">
                  {s.displayName}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-stone-600">
                  {s.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {s.location}
                    </span>
                  )}
                  {s.projectRole && (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      {s.projectRole} on The Harvest
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {s.bio && (
        <section className="py-12 bg-white">
          <div className="container mx-auto max-w-3xl">
            <p className="whitespace-pre-line text-lg leading-relaxed text-stone-700">
              {s.bio}
            </p>
          </div>
        </section>
      )}

      {s.articles.length > 0 && (
        <section className="py-12 bg-stone-50">
          <div className="container mx-auto max-w-3xl">
            <h2 className="mb-6 inline-flex items-center gap-2 text-2xl font-serif font-bold text-stone-800">
              <Newspaper className="h-5 w-5 text-amber-700" /> Articles by {s.displayName.split(" ")[0]}
            </h2>
            <div className="grid gap-4">
              {s.articles.map((a) => (
                <Link key={a.id} href={a.slug ? `/blog/${a.slug}` : "#"}>
                  <a className="group block rounded-lg border border-stone-200 bg-white p-5 transition hover:border-amber-300 hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-serif font-bold text-stone-800 group-hover:text-amber-700">
                          {a.title}
                        </h3>
                        {a.publishedAt && (
                          <p className="mt-1 text-xs text-stone-500">{formatDate(a.publishedAt)}</p>
                        )}
                        {a.excerpt && (
                          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-600">{a.excerpt}</p>
                        )}
                        {a.themes.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {a.themes.slice(0, 4).map((t) => (
                              <span key={t} className="inline-flex items-center rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-700">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-stone-400 transition group-hover:translate-x-1 group-hover:text-amber-600" />
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {s.stories.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto max-w-3xl">
            <h2 className="mb-6 inline-flex items-center gap-2 text-2xl font-serif font-bold text-stone-800">
              <BookOpen className="h-5 w-5 text-amber-700" /> Stories
            </h2>
            <div className="grid gap-4">
              {s.stories.map((st) => (
                <article key={st.id} className="rounded-lg border border-stone-200 bg-stone-50 p-5">
                  <h3 className="text-lg font-serif font-bold text-stone-800">{st.title}</h3>
                  {st.summary && (
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{st.summary}</p>
                  )}
                  {st.themes && st.themes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {st.themes.slice(0, 4).map((t) => (
                        <span key={t} className="inline-flex items-center rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {s.articles.length === 0 && s.stories.length === 0 && (
        <section className="py-12 bg-stone-50">
          <div className="container mx-auto max-w-3xl text-center text-stone-600">
            <ImageIcon className="mx-auto h-8 w-8 text-stone-400" />
            <p className="mt-3 text-sm">No published content yet — check back soon.</p>
          </div>
        </section>
      )}

      <section className="py-12 bg-white border-t border-stone-200">
        <div className="container mx-auto max-w-3xl text-center">
          <Link href="/people">
            <a className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800">
              <ArrowLeft className="h-4 w-4" /> Back to all people
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
