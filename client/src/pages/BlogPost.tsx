import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ShareButtons from "@/components/ShareButtons";
import BlogCard, { type ELArticle } from "@/components/BlogCard";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  ChevronRight,
} from "lucide-react";

// Theme colors (matching BlogCard)
const themeColors: Record<string, string> = {
  "Resilience": "bg-amber-100 text-amber-800",
  "Connection": "bg-blue-100 text-blue-800",
  "Growth": "bg-green-100 text-green-800",
  "Healing": "bg-purple-100 text-purple-800",
  "Community": "bg-rose-100 text-rose-800",
  "Land": "bg-emerald-100 text-emerald-800",
  "Identity": "bg-indigo-100 text-indigo-800",
  "Justice": "bg-red-100 text-red-800",
  default: "bg-stone-100 text-stone-800",
};

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function estimateReadingTime(content: string | null | undefined): number {
  if (!content) return 2;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["blog", "post", slug],
    queryFn: () => trpc.blog.bySlug.query({ slug: slug! }),
    enabled: !!slug,
  });

  // Get related articles (recent articles from same theme)
  const primaryTheme = article?.themes?.[0];
  const { data: relatedData } = useQuery({
    queryKey: ["blog", "related", primaryTheme],
    queryFn: () => trpc.blog.list.query({ theme: primaryTheme }),
    enabled: !!primaryTheme,
  });

  // Filter out current article and limit to 3
  const relatedArticles = (relatedData?.articles || [])
    .filter((a: ELArticle) => a.id !== article?.id)
    .slice(0, 3);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-32">
        <div className="container max-w-4xl">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-stone-200 rounded w-1/4" />
            <div className="h-12 bg-stone-200 rounded w-3/4" />
            <div className="h-6 bg-stone-200 rounded w-1/2" />
            <div className="aspect-[16/9] bg-stone-200 rounded-xl" />
            <div className="space-y-4">
              <div className="h-4 bg-stone-200 rounded w-full" />
              <div className="h-4 bg-stone-200 rounded w-full" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white pt-32">
        <div className="container max-w-4xl text-center py-16">
          <h1 className="text-3xl font-serif font-bold text-stone-800 mb-4">
            Article not found
          </h1>
          <p className="text-stone-600 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Journal
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const theme = article.themes[0] || "Community";
  const themeColor = themeColors[theme] || themeColors.default;
  const readingTime = estimateReadingTime(article.content || article.excerpt);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-8">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-stone-500 mb-8">
              <Link href="/blog" className="hover:text-amber-600 transition-colors">
                Journal
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link
                href={`/blog?theme=${theme}`}
                className="hover:text-amber-600 transition-colors"
              >
                {theme}
              </Link>
            </nav>

            {/* Theme Badge */}
            <Badge className={`${themeColor} mb-4`}>
              {theme}
            </Badge>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 leading-tight mb-4">
              {article.title}
            </h1>

            {/* Subtitle */}
            {article.subtitle && (
              <p className="text-xl text-stone-600 mb-6">
                {article.subtitle}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-stone-500 mb-8">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {article.authorName}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
            </div>

            {/* Share buttons */}
            <ShareButtons
              url={currentUrl}
              title={article.title}
              description={article.excerpt || undefined}
              variant="compact"
              className="mb-8"
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {article.featuredImageUrl && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="pb-12"
        >
          <div className="container max-w-5xl">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={article.featuredImageUrl}
                alt={article.featuredImageAlt || article.title}
                className="w-full aspect-[16/9] object-cover"
              />
            </div>
          </div>
        </motion.section>
      )}

      {/* Content */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="pb-16"
      >
        <div className="container max-w-3xl">
          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xl text-stone-600 leading-relaxed mb-8 font-serif italic border-l-4 border-amber-400 pl-6">
              {article.excerpt}
            </p>
          )}

          {/* Main Content */}
          <article className="prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:text-stone-800 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-amber-400 prose-blockquote:bg-amber-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
            {/* Content with basic line break support */}
            <div className="whitespace-pre-wrap">
              {(article.content || "").split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </article>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-stone-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-stone-500 mr-2">Tags:</span>
                {article.tags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-stone-600 hover:bg-stone-100"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Themes */}
          {article.themes && article.themes.length > 1 && (
            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-stone-500 mr-2">Themes:</span>
                {article.themes.map((t: string) => (
                  <Badge
                    key={t}
                    className={themeColors[t] || themeColors.default}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-stone-200">
            <ShareButtons
              url={currentUrl}
              title={article.title}
              description={article.excerpt || undefined}
            />
          </div>
        </div>
      </motion.section>

      {/* Author Section */}
      <section className="py-12 bg-stone-50">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-2xl font-serif font-bold text-amber-700">
                {article.authorName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-stone-800">{article.authorName}</p>
              <p className="text-stone-500 text-sm">The Harvest Community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-8 text-center">
              More {theme} Stories
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedArticles.map((relatedArticle: ELArticle) => (
                <BlogCard key={relatedArticle.id} article={relatedArticle} variant="compact" />
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/blog">
                  View all stories
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Back to Journal */}
      <section className="py-8 border-t border-stone-200">
        <div className="container max-w-3xl">
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Journal
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
