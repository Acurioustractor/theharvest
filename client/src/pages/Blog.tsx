import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import BlogCard, { type ELArticle } from "@/components/BlogCard";
import BlogCategories, { type BlogTheme } from "@/components/BlogCategories";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Newspaper } from "lucide-react";
import { Link } from "wouter";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Blog() {
  const [theme, setTheme] = useState<BlogTheme>(null);
  const [workFilter, setWorkFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch articles from Empathy Ledger — filter server-side by work (project) too
  const { data, isLoading } = trpc.blog.list.useQuery(
    {
      theme: theme ?? undefined,
      project: workFilter ?? undefined,
    },
  );

  const articles = data?.articles || [];

  // Filter articles by search query
  const filteredArticles = articles.filter((article: ELArticle) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.excerpt?.toLowerCase().includes(query) ||
      article.authorName.toLowerCase().includes(query) ||
      article.themes.some(t => t.toLowerCase().includes(query)) ||
      article.tags.some(t => t.toLowerCase().includes(query))
    );
  });

  // Separate featured article (first one) from the rest
  const featuredArticle = filteredArticles[0];
  const remainingArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-amber-50 to-stone-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6">
              <Newspaper className="h-4 w-4" />
              Stories from The Harvest
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-6">
              The Harvest Journal
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Community stories, transformation journeys, and moments of connection.
              A window into life at The Harvest.
            </p>
            <div className="mt-6">
              <Link href="/people">
                <a className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800">
                  Or meet the storytellers <span aria-hidden>→</span>
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b border-stone-200 bg-white sticky top-16 z-30">
        <div className="container space-y-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <BlogCategories selected={theme} onChange={setTheme} />

            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-stone-50 border-stone-200"
              />
            </div>
          </div>

          {/* Work filter — chip row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400 mr-1">
              Work:
            </span>
            <BlogWorkChip label="All" active={!workFilter} onClick={() => setWorkFilter(null)} />
            {[
              { slug: "milk-crate-pavilion", label: "Milk Create Pavilion" },
              { slug: "the-cedar", label: "The Cedar" },
              { slug: "the-garden", label: "The Garden" },
              { slug: "the-sauna", label: "The Sauna" },
              { slug: "the-shop", label: "The Shop" },
            ].map((w) => (
              <BlogWorkChip
                key={w.slug}
                label={w.label}
                active={workFilter === w.slug}
                onClick={() => setWorkFilter(w.slug)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-12 bg-stone-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-600 font-mono text-sm mb-3 uppercase tracking-wider">
              Featured
            </p>
            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">
              Stories from the Land
            </h2>
            <Link href="/people/barry-rodgerig">
              <Card className="overflow-hidden border-0 bg-stone-800 group cursor-pointer hover:ring-2 hover:ring-amber-500/50 transition-all">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <img
                      src="/images/compendium/barry/IMG_5764.jpg"
                      alt="Barry at golden hour"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <span className="text-amber-400 font-mono text-xs uppercase tracking-wider mb-2">
                      Photo Essay
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                      Barry & The Shed
                    </h3>
                    <p className="text-stone-300 leading-relaxed mb-4">
                      Barry has been on this land since 1972. His shed is full of machines
                      that built the hinterland — log trucks, Blitz trucks, a little Italian
                      tractor with a Lombardini diesel.
                    </p>
                    <p className="text-amber-500 text-sm font-medium group-hover:text-amber-400 transition-colors">
                      Read the full story →
                    </p>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-stone-200 rounded-lg aspect-[16/10] mb-4" />
                  <div className="h-4 bg-stone-200 rounded w-1/4 mb-3" />
                  <div className="h-6 bg-stone-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-stone-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="h-8 w-8 text-stone-400" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-700 mb-2">
                No articles found
              </h3>
              <p className="text-stone-500 mb-6">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Check back soon for new stories from The Harvest"}
              </p>
              {(searchQuery || theme) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setTheme(null);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              {/* Featured Article */}
              {featuredArticle && !searchQuery && (
                <motion.div variants={fadeInUp} className="mb-12">
                  <BlogCard article={featuredArticle} variant="featured" />
                </motion.div>
              )}

              {/* Remaining Articles Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(searchQuery ? filteredArticles : remainingArticles).map((article: ELArticle) => (
                  <motion.div key={article.id} variants={fadeInUp}>
                    <BlogCard article={article} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination hint */}
              {data?.pagination?.hasMore && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load more articles
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

    </div>
  );
}

function BlogWorkChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
        active
          ? "bg-stone-800 text-amber-300 border-stone-800"
          : "bg-white text-stone-700 border-stone-300 hover:bg-stone-100"
      }`}
    >
      {label}
    </button>
  );
}
