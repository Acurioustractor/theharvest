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

export interface ELStoryteller {
  id: string;
  slug?: string | null;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  culturalBackground?: string[];
  location?: string | null;
  elderStatus?: boolean;
  featured?: boolean;
  themes?: string[];
  transcriptCount?: number;
  qualityScore?: number | null;
}

export interface ELStorytellersResponse {
  storytellers: ELStoryteller[];
  pagination: ELPagination;
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
  special?: string[]; // Special tags: "hero", "featured"
  works?: string[]; // Harvest work slugs: "milk-crate-pavilion", "the-cedar", etc.
  // Storytellers this media is attributed to. EL adds this from media_assets.metadata.harvestStorytellers.
  taggedStorytellers?: Array<{ id: string; slug?: string | null; displayName: string; avatarUrl: string | null }>;
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

  /**
   * The content-hub/media endpoint returns internal `/api/media/:id/file`
   * links that redirect to the underlying storage URL. Browsers block
   * loading those cross-origin (the EL server sends
   * Cross-Origin-Resource-Policy: same-origin), so resolve to the final
   * storage URL here, server-side, before handing it to the client. This
   * also keeps saved image overrides portable — they end up pointing at the
   * permanent storage URL rather than a local EL dev-server port.
   */
  private async resolveMediaFileUrl(url: string): Promise<string> {
    if (!/^https?:\/\/[^/]+\/api\/media\//.test(url)) return url;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const response = await fetch(url, { redirect: "manual", signal: controller.signal });
      clearTimeout(timeout);
      const location = response.headers.get("location");
      return location || url;
    } catch (error) {
      console.error(`[EmpathyLedger] Failed to resolve media URL ${url}:`, error);
      return url;
    }
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
   * Fetch storytellers from the content-hub.
   * Public, no auth needed. Filter by project slug to scope to one site.
   */
  async fetchStorytellers(options: { project?: string; limit?: number; page?: number } = {}): Promise<ELStorytellersResponse> {
    const params = new URLSearchParams();
    if (options.project) params.append("project", options.project);
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.page) params.append("page", options.page.toString());

    const queryString = params.toString();
    const endpoint = `/api/v1/content-hub/storytellers${queryString ? `?${queryString}` : ""}`;

    try {
      return await this.fetch<ELStorytellersResponse>(endpoint);
    } catch (error) {
      console.error("[EmpathyLedger] Failed to fetch storytellers:", error);
      return { storytellers: [], pagination: { page: 1, limit: 20, total: 0, hasMore: false } };
    }
  }

  /**
   * Fetch a single storyteller by slug or UUID.
   * Returns null on 404 / network failure.
   */
  async fetchStoryteller(identifier: string): Promise<ELStoryteller | null> {
    try {
      return await this.fetch<ELStoryteller>(`/api/v1/content-hub/storytellers/${encodeURIComponent(identifier)}`);
    } catch (error) {
      console.error(`[EmpathyLedger] Failed to fetch storyteller ${identifier}:`, error);
      return null;
    }
  }

  /**
   * Fetch media attributed to a single storyteller.
   * Backed by the public /media?storyteller=<uuid|slug> filter.
   */
  async fetchMediaForStoryteller(identifier: string, options: { project?: string; limit?: number } = {}): Promise<ELMediaAsset[]> {
    const params = new URLSearchParams();
    params.append("storyteller", identifier);
    if (options.project) params.append("project", options.project);
    params.append("limit", String(options.limit ?? 60));

    try {
      const res = await this.fetch<{ media?: ELMediaAsset[]; items?: ELMediaAsset[] }>(
        `/api/v1/content-hub/media?${params.toString()}`,
      );
      return res.media ?? res.items ?? [];
    } catch (error) {
      console.error(`[EmpathyLedger] Failed to fetch media for storyteller ${identifier}:`, error);
      return [];
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
    project?: string;  // Project slug — kept for backwards compat (resolves to project_id)
    work?: string;     // Harvest work slug: "milk-crate-pavilion", "the-cedar", etc.
                       // Primary mechanism for per-work filtering. Filters by harvest-work tag.
  } = {}): Promise<ELMediaResponse> {
    const params = new URLSearchParams();

    if (options.page) params.append("page", options.page.toString());
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.tag) params.append("tag", options.tag);
    if (options.theme) params.append("theme", options.theme);
    if (options.category) params.append("category", options.category);
    if (options.project) params.append("project", options.project);
    if (options.work) params.append("work", options.work);

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
   * Fetch the full Harvest media library, including untagged photos.
   *
   * The strict `/harvest/gallery` endpoint only returns photos that carry the
   * Harvest tagging (themes, works, etc). For the photo picker we want every
   * photo in the project, even untagged ones, so editors can find and use
   * recently-uploaded images before re-tagging.
   *
   * Pulls from `/content-hub/media?project=the-harvest` (returns the full 394+
   * photo library) and adapts the broader schema to the gallery shape the
   * website consumes.
   */
  async fetchAllHarvestMedia(options: {
    page?: number;
    limit?: number;
  } = {}): Promise<ELMediaResponse> {
    const requestedLimit = options.limit ?? 50;
    // EL backend caps each /content-hub/media request at 50. To satisfy
    // larger requested limits (the photo picker asks for 100), loop pages.
    const EL_PAGE_SIZE = 50;
    const startPage = options.page ?? 1;

    type RawMedia = {
      id: string;
      url: string;
      thumbnailUrl?: string | null;
      title: string | null;
      description: string | null;
      altText: string | null;
      mediaType?: string | null;
      projectId: string | null;
      createdAt: string;
    };

    const collected: RawMedia[] = [];
    let pagination: ELPagination = { page: startPage, limit: EL_PAGE_SIZE, total: 0, hasMore: false };

    try {
      let cursor = startPage;
      while (collected.length < requestedLimit) {
        const params = new URLSearchParams();
        params.append("project", "the-harvest");
        params.append("limit", EL_PAGE_SIZE.toString());
        params.append("page", cursor.toString());

        const raw = await this.fetch<{ media: RawMedia[]; pagination: ELPagination }>(
          `/api/v1/content-hub/media?${params.toString()}`,
        );
        pagination = raw.pagination;

        collected.push(...raw.media);

        if (!raw.pagination.hasMore || raw.media.length === 0) break;
        cursor += 1;
      }
    } catch (error) {
      console.error("[EmpathyLedger] Failed to fetch full Harvest media:", error);
      return { media: [], pagination: { page: 1, limit: 20, total: 0, hasMore: false } };
    }

    // Map the broader content-hub schema onto the gallery schema the website
    // consumes. Untagged photos get empty arrays so the UI keeps working.
    const sliced = collected.slice(0, requestedLimit);

    // Resolve each item's proxy link to its real storage URL, in
    // concurrency-limited batches so we don't fire hundreds of requests at
    // the EL server at once.
    const resolvedSrcs: string[] = [];
    const RESOLVE_BATCH_SIZE = 20;
    for (let i = 0; i < sliced.length; i += RESOLVE_BATCH_SIZE) {
      const batch = sliced.slice(i, i + RESOLVE_BATCH_SIZE);
      const batchSrcs = await Promise.all(batch.map((item) => this.resolveMediaFileUrl(item.url)));
      resolvedSrcs.push(...batchSrcs);
    }

    const media: ELMediaAsset[] = sliced.map((item, index) => ({
      id: item.id,
      src: resolvedSrcs[index],
      title: item.title || item.altText || "Untitled",
      description: item.description,
      altText: item.altText,
      category: "general",
      date: item.createdAt?.slice(0, 7) ?? null,
      location: null,
      tags: [],
      themes: [],
      special: [],
      works: [],
      projectId: item.projectId,
      sortOrder: index,
      isPublished: true,
      createdAt: item.createdAt,
      updatedAt: item.createdAt,
    }));

    return {
      media,
      pagination: {
        page: startPage,
        limit: requestedLimit,
        total: pagination.total,
        hasMore: pagination.total > collected.length,
      },
    };
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
