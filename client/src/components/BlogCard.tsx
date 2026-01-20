import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";

// Empathy Ledger Article type
export interface ELArticle {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  authorName: string;
  articleType: string;
  primaryProject: string | null;
  publishedAt: string;
  tags: string[];
  themes: string[];
  visibility: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
}

interface BlogCardProps {
  article: ELArticle;
  variant?: "default" | "featured" | "compact";
}

// Map themes to colors
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

// Map article types to labels
const articleTypeLabels: Record<string, string> = {
  "story_feature": "Story",
  "program_spotlight": "Program",
  "research_summary": "Research",
  "community_news": "News",
  "editorial": "Editorial",
  "impact_report": "Impact",
  "project_update": "Update",
  "tutorial": "Guide",
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

function estimateReadingTime(excerpt: string | null): number {
  if (!excerpt) return 2;
  const words = excerpt.split(/\s+/).length;
  // Estimate full article is ~5x the excerpt length
  return Math.max(1, Math.ceil((words * 5) / 200));
}

export default function BlogCard({ article, variant = "default" }: BlogCardProps) {
  const primaryTheme = article.themes[0] || "Community";
  const themeColor = themeColors[primaryTheme] || themeColors.default;
  const readingTime = estimateReadingTime(article.excerpt);

  if (variant === "compact") {
    return (
      <Link href={`/blog/${article.slug}`}>
        <Card className="group cursor-pointer border-0 shadow-sm hover:shadow-md transition-all bg-white overflow-hidden">
          <CardContent className="p-4 flex gap-4">
            {article.featuredImageUrl && (
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={article.featuredImageUrl}
                  alt={article.featuredImageAlt || article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Badge className={`${themeColor} text-xs mb-2`}>
                {primaryTheme}
              </Badge>
              <h3 className="font-serif font-semibold text-stone-800 group-hover:text-amber-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {readingTime} min
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/blog/${article.slug}`}>
        <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all bg-white overflow-hidden">
          <div className="relative aspect-[16/9] overflow-hidden">
            {article.featuredImageUrl ? (
              <img
                src={article.featuredImageUrl}
                alt={article.featuredImageAlt || article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <span className="text-6xl opacity-30">
                  {primaryTheme[0] || "H"}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className={`${themeColor} mb-3`}>
                {primaryTheme}
              </Badge>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white drop-shadow-lg leading-tight">
                {article.title}
              </h2>
              {article.subtitle && (
                <p className="text-white/80 mt-2 text-sm">{article.subtitle}</p>
              )}
            </div>
          </div>
          <CardContent className="p-6">
            {article.excerpt && (
              <p className="text-stone-600 leading-relaxed mb-4 line-clamp-2">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between text-sm text-stone-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {article.authorName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.publishedAt)}
                </span>
              </div>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/blog/${article.slug}`}>
      <Card className="group cursor-pointer h-full border-0 shadow-md hover:shadow-lg transition-all bg-white overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden">
          {article.featuredImageUrl ? (
            <img
              src={article.featuredImageUrl}
              alt={article.featuredImageAlt || article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
              <span className="text-4xl opacity-20">
                {primaryTheme[0] || "H"}
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge className={`${themeColor} text-xs`}>
              {primaryTheme}
            </Badge>
            <span className="text-xs text-stone-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime} min
            </span>
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-800 group-hover:text-amber-600 transition-colors mb-2 line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-stone-600 text-sm leading-relaxed line-clamp-2 mb-3">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100">
            <span>{article.authorName}</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
