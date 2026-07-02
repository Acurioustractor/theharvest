import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import BlogCard, { type ELArticle } from "@/components/BlogCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Newspaper, Search } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteNav } from "./HarvestReviewTest";

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
  const [searchQuery, setSearchQuery] = useState("");

  // Public articles come from Empathy Ledger when they are published and syndicated to Harvest.
  const { data, isLoading } = trpc.blog.list.useQuery();

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
      <SiteNav />
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
              The Harvest Blog
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Start with What is The Harvest, then follow the people, work, and
              notes coming out of the garden, events, and art space.
            </p>
            <div className="mt-6">
              <Link
                href="/what-is-the-harvest"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
              >
                Learn about The Harvest <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b border-stone-200 bg-white sticky top-[76px] z-30">
        <div className="container space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-stone-400">
                Empathy Ledger
              </p>
              <p className="mt-1 text-sm text-stone-600">
                Published stories syndicated to The Harvest.
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                type="search"
                placeholder="Search the current stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-stone-50 border-stone-200"
              />
            </div>
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
              Read this first
            </h2>
            <Link href="/what-is-the-harvest">
              <Card className="mb-8 overflow-hidden border-0 bg-[#1C1917] group cursor-pointer transition-all hover:ring-2 hover:ring-amber-500/50">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 overflow-hidden md:h-auto">
                    <img
                      src="/images/optimized/hero-aerial-1400.webp"
                      alt="Aerial view of The Harvest site in Witta"
                      className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="flex flex-col justify-center p-8">
                    <span className="mb-2 font-mono text-xs uppercase tracking-wider text-amber-400">
                      Start here
                    </span>
                    <h3 className="mb-3 text-2xl font-serif font-bold text-white md:text-3xl">
                      What is The Harvest?
                    </h3>
                    <p className="mb-4 leading-relaxed text-stone-300">
                      The old Witta nursery, the three rooms, and how to be part
                      of the place now that it is open.
                    </p>
                    <p className="inline-flex items-center gap-2 text-sm font-medium text-amber-500 transition-colors group-hover:text-amber-400">
                      Read the story <ArrowRight className="h-4 w-4" />
                    </p>
                  </CardContent>
                </div>
              </Card>
            </Link>
            <div className="mb-6 flex items-center gap-3 text-stone-500">
              <Mail className="h-4 w-4 text-amber-600" />
              <Link
                href="/membership"
                className="text-sm font-semibold text-amber-700 underline-offset-2 hover:underline"
              >
                Become a member for letters, invites, and early opportunities.
              </Link>
            </div>
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
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                  }}
                >
                  Clear search
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

      <SiteFooter />
    </div>
  );
}
