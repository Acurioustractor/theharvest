import { motion } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";

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

function readingMinutes(words: number | null): number {
  if (!words) return 1;
  return Math.max(1, Math.ceil(words / 200));
}

export default function StoryDetail({ storyId }: { storyId: string }) {
  const { data, isLoading, error } = trpc.harvest.publicStoryById.useQuery(
    { storyId },
    { enabled: !!storyId },
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
          <h1 className="text-3xl font-serif font-bold text-stone-800">No story here.</h1>
          <p className="mt-4 text-stone-600">
            We couldn't find that story. It may have moved, or it hasn't been published yet.
          </p>
          <Link href="/stories">
            <a className="mt-6 inline-flex items-center gap-2 text-amber-700 hover:text-amber-800">
              <ArrowLeft className="h-4 w-4" /> Back to stories
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const story = data;
  const minutes = readingMinutes(story.wordCount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <nav className="absolute top-0 left-0 right-0 z-10 px-6 py-4">
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-stone-700 hover:text-amber-700">
            ← The Harvest
          </a>
        </Link>
      </nav>

      <section className="pt-32 pb-12 bg-gradient-to-b from-amber-50 to-stone-50">
        <div className="container mx-auto max-w-3xl">
          <Link href={story.author?.slug ? `/people/${story.author.slug}` : "/people"}>
            <a className="mb-6 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700">
              <ArrowLeft className="h-4 w-4" />
              {story.author?.slug ? `${story.author.displayName}'s profile` : "All people"}
            </a>
          </Link>

          <motion.div {...fadeInUp}>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              <BookOpen className="h-3.5 w-3.5" /> Story from The Harvest
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 leading-tight">
              {story.title}
            </h1>

            {story.summary && (
              <p className="mt-4 text-lg text-stone-600 leading-relaxed">{story.summary}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-500">
              {story.author && (
                <span>
                  by{" "}
                  {story.author.slug ? (
                    <Link href={`/people/${story.author.slug}`}>
                      <a className="text-amber-700 underline-offset-2 hover:underline">
                        {story.author.displayName}
                      </a>
                    </Link>
                  ) : (
                    <span>{story.author.displayName}</span>
                  )}
                </span>
              )}
              {story.createdAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> {formatDate(story.createdAt)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {minutes} min read
              </span>
            </div>

            {story.themes.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {story.themes.slice(0, 6).map((t) => (
                  <span key={t} className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-700">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <article className="container mx-auto max-w-3xl">
          <div className="prose prose-stone max-w-none whitespace-pre-line text-base leading-relaxed text-stone-700 md:text-lg">
            {story.content}
          </div>
        </article>
      </section>

      {story.author?.slug && (
        <section className="py-12 bg-stone-50">
          <div className="container mx-auto max-w-3xl">
            <Link href={`/people/${story.author.slug}`}>
              <a className="group flex items-start gap-4 rounded-lg border border-stone-200 bg-white p-5 transition hover:border-amber-300 hover:shadow-md">
                {story.author.avatarUrl ? (
                  <img
                    src={story.author.avatarUrl}
                    alt={story.author.displayName}
                    className="h-16 w-16 flex-shrink-0 rounded-full border border-stone-200 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <span className="text-2xl font-serif font-bold text-amber-700">
                      {story.author.displayName.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-stone-800 group-hover:text-amber-700">{story.author.displayName}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                    More from {story.author.displayName.split(" ")[0]} <ArrowRight className="h-3 w-3" />
                  </p>
                </div>
              </a>
            </Link>
          </div>
        </section>
      )}

      <section className="py-12 bg-white border-t border-stone-200">
        <div className="container mx-auto max-w-3xl text-center">
          <Link href="/people">
            <a className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800">
              <ArrowLeft className="h-4 w-4" /> All people of The Harvest
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
