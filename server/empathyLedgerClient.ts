/**
 * Empathy Ledger Content Hub API Client
 *
 * Fetches blog articles, stories, and media from the Empathy Ledger
 * Content Hub API for display on The Harvest website.
 */

export interface ELArticle {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  content?: string; // Only included in single article response
  authorName: string;
  authorBio?: string | null;
  articleType: string;
  primaryProject: string | null;
  relatedProjects?: string[];
  publishedAt: string;
  tags: string[];
  themes: string[];
  visibility: string;
  syndicationDestinations: string[];
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ctas?: Array<{
    position: string;
    ctaType: string;
    buttonText: string;
    description: string;
    icon: string;
    style: string;
    urlTemplate: string;
    actionType: string;
  }>;
}

export interface ELPagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ELArticlesResponse {
  articles: ELArticle[];
  pagination: ELPagination;
}

export interface ELStory {
  id: string;
  title: string;
  summary: string;
  authorName: string;
  authorId: string;
  publishedAt: string;
  themes: string[];
  visibility: string;
  isPublic: boolean;
}

export interface ELStoriesResponse {
  stories: ELStory[];
  pagination: ELPagination;
}

export interface ELMediaAsset {
  id: string;
  src: string;
  title: string;
  description: string | null;
  altText: string | null;
  category: "before" | "during" | "after" | "milestone" | "general";
  date: string | null; // YYYY-MM format
  location: string | null;
  tags: string[]; // Tags for page distribution: "home", "journey", "stories", etc.
  themes: string[]; // Themes: "eat", "grow", "make", "gather", etc.
  projectId: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ELMediaResponse {
  media: ELMediaAsset[];
  pagination: ELPagination;
}

interface FetchArticlesOptions {
  page?: number;
  limit?: number;
  type?: string;
  theme?: string;
  project?: string;
  tag?: string;
  destination?: string;
  after?: string;
  before?: string;
}

const DEFAULT_BASE_URL = process.env.EMPATHY_LEDGER_API_URL || "https://empathyledger.com";
const API_KEY = process.env.EMPATHY_LEDGER_API_KEY || "";

/**
 * Empathy Ledger Content Hub Client
 */
class EmpathyLedgerClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || DEFAULT_BASE_URL;
    this.apiKey = apiKey || API_KEY;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add API key for ecosystem-level access if available
    if (this.apiKey) {
      headers["X-API-Key"] = this.apiKey;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[EmpathyLedger] API error: ${response.status} - ${errorText}`);
      throw new Error(`Empathy Ledger API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Fetch articles with optional filters
   */
  async fetchArticles(options: FetchArticlesOptions = {}): Promise<ELArticlesResponse> {
    const params = new URLSearchParams();

    if (options.page) params.append("page", options.page.toString());
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.type) params.append("type", options.type);
    if (options.theme) params.append("theme", options.theme);
    if (options.project) params.append("project", options.project);
    if (options.tag) params.append("tag", options.tag);
    if (options.destination) params.append("destination", options.destination);
    if (options.after) params.append("after", options.after);
    if (options.before) params.append("before", options.before);

    // Filter for articles syndicated to "harvest"
    params.append("destination", "harvest");

    const queryString = params.toString();
    const endpoint = `/api/v1/content-hub/articles${queryString ? `?${queryString}` : ""}`;

    try {
      return await this.fetch<ELArticlesResponse>(endpoint);
    } catch (error) {
      console.error("[EmpathyLedger] Failed to fetch articles:", error);
      // Return empty response on error
      return { articles: [], pagination: { page: 1, limit: 20, total: 0, hasMore: false } };
    }
  }

  /**
   * Fetch a single article by slug
   */
  async fetchArticle(slug: string): Promise<ELArticle | null> {
    try {
      const response = await this.fetch<ELArticle>(`/api/v1/content-hub/articles/${slug}`);
      return response;
    } catch (error) {
      console.error(`[EmpathyLedger] Failed to fetch article ${slug}:`, error);
      return null;
    }
  }

  /**
   * Fetch recent articles for homepage display
   */
  async fetchRecentArticles(limit: number = 3): Promise<ELArticle[]> {
    const response = await this.fetchArticles({
      limit,
      destination: "harvest",
    });
    return response.articles;
  }

  /**
   * Fetch stories from the community
   */
  async fetchStories(options: { page?: number; limit?: number; theme?: string } = {}): Promise<ELStoriesResponse> {
    const params = new URLSearchParams();

    if (options.page) params.append("page", options.page.toString());
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.theme) params.append("theme", options.theme);

    const queryString = params.toString();
    const endpoint = `/api/v1/content-hub/stories${queryString ? `?${queryString}` : ""}`;

    try {
      return await this.fetch<ELStoriesResponse>(endpoint);
    } catch (error) {
      console.error("[EmpathyLedger] Failed to fetch stories:", error);
      return { stories: [], pagination: { page: 1, limit: 20, total: 0, hasMore: false } };
    }
  }

  /**
   * Search across all content
   */
  async search(query: string, options: { type?: string; limit?: number } = {}): Promise<any> {
    const params = new URLSearchParams();
    params.append("q", query);
    if (options.type) params.append("type", options.type);
    if (options.limit) params.append("limit", options.limit.toString());

    try {
      return await this.fetch(`/api/v1/content-hub/search?${params}`);
    } catch (error) {
      console.error("[EmpathyLedger] Search failed:", error);
      return { results: [] };
    }
  }

  /**
   * Fetch media assets from the gallery
   * Supports filtering by category, tags (pages), and themes
   */
  async fetchMedia(options: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string; // Filter by page tag: "home", "journey", "stories", etc.
    theme?: string; // Filter by theme: "eat", "grow", "make", "gather"
    project?: string;
  } = {}): Promise<ELMediaResponse> {
    const params = new URLSearchParams();

    if (options.page) params.append("page", options.page.toString());
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.category) params.append("category", options.category);
    if (options.tag) params.append("tag", options.tag);
    if (options.theme) params.append("theme", options.theme);
    if (options.project) params.append("project", options.project);

    // Filter for media syndicated to "harvest"
    params.append("destination", "harvest");

    const queryString = params.toString();
    const endpoint = `/api/v1/content-hub/media${queryString ? `?${queryString}` : ""}`;

    try {
      return await this.fetch<ELMediaResponse>(endpoint);
    } catch (error) {
      console.error("[EmpathyLedger] Failed to fetch media:", error);
      return { media: [], pagination: { page: 1, limit: 20, total: 0, hasMore: false } };
    }
  }

  /**
   * Fetch media for a specific page (by tag)
   */
  async fetchMediaForPage(pageTag: string, limit: number = 10): Promise<ELMediaAsset[]> {
    const response = await this.fetchMedia({
      tag: pageTag,
      limit,
    });
    return response.media;
  }

  /**
   * Fetch gallery images by category (before/during/after/milestone)
   */
  async fetchGalleryByCategory(category: string, limit: number = 20): Promise<ELMediaAsset[]> {
    const response = await this.fetchMedia({
      category,
      limit,
    });
    return response.media;
  }

  /**
   * Fetch all gallery images for the progress gallery component
   */
  async fetchGallery(limit: number = 50): Promise<ELMediaAsset[]> {
    const response = await this.fetchMedia({ limit });
    return response.media;
  }

  /**
   * Fetch media from the dedicated Harvest gallery API
   * Uses /api/v1/harvest/gallery endpoint which filters by Harvest-specific tags
   */
  async fetchHarvestGallery(options: {
    page?: number;
    limit?: number;
    tag?: string;      // Page tag: "home", "journey", "stories", etc.
    theme?: string;    // Theme: "eat", "grow", "make", "gather"
    category?: string; // Category: "before", "during", "after", "milestone", "general"
  } = {}): Promise<ELMediaResponse> {
    const params = new URLSearchParams();

    if (options.page) params.append("page", options.page.toString());
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.tag) params.append("tag", options.tag);
    if (options.theme) params.append("theme", options.theme);
    if (options.category) params.append("category", options.category);

    const queryString = params.toString();
    const endpoint = `/api/v1/harvest/gallery${queryString ? `?${queryString}` : ""}`;

    try {
      return await this.fetch<ELMediaResponse>(endpoint);
    } catch (error) {
      console.error("[EmpathyLedger] Failed to fetch Harvest gallery:", error);
      return { media: [], pagination: { page: 1, limit: 20, total: 0, hasMore: false } };
    }
  }

  /**
   * Fetch Harvest gallery images for a specific page
   */
  async fetchHarvestMediaForPage(pageTag: string, limit: number = 10): Promise<ELMediaAsset[]> {
    const response = await this.fetchHarvestGallery({
      tag: pageTag,
      limit,
    });
    return response.media;
  }

  /**
   * Fetch Harvest gallery images by theme
   */
  async fetchHarvestMediaByTheme(theme: string, limit: number = 20): Promise<ELMediaAsset[]> {
    const response = await this.fetchHarvestGallery({
      theme,
      limit,
    });
    return response.media;
  }

  /**
   * Fetch Harvest gallery images by category (before/during/after/milestone)
   */
  async fetchHarvestMediaByCategory(category: string, limit: number = 20): Promise<ELMediaAsset[]> {
    const response = await this.fetchHarvestGallery({
      category,
      limit,
    });
    return response.media;
  }
}

// Export singleton instance
export const empathyLedgerClient = new EmpathyLedgerClient();

// Export class for custom instances
export { EmpathyLedgerClient };
