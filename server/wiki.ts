/**
 * Wiki Content Server
 *
 * Reads content from the wiki folder (thoughts/wiki) and serves it to the frontend.
 * Supports both YAML (structured data) and Markdown (narrative content).
 */

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, resolve, extname, basename } from "path";
import { parse as parseYaml } from "yaml";

// Base path to wiki content
const WIKI_BASE = resolve(process.cwd(), "thoughts/wiki");

/**
 * Safely read a file from the wiki folder
 */
function readWikiFile(relativePath: string): string | null {
  const fullPath = join(WIKI_BASE, relativePath);

  // Prevent path traversal
  if (!fullPath.startsWith(WIKI_BASE)) {
    console.error("Path traversal attempt blocked:", relativePath);
    return null;
  }

  if (!existsSync(fullPath)) {
    console.warn("Wiki file not found:", relativePath);
    return null;
  }

  return readFileSync(fullPath, "utf-8");
}

/**
 * Parse YAML content
 */
function parseYamlContent<T = unknown>(content: string): T | null {
  try {
    return parseYaml(content) as T;
  } catch (error) {
    console.error("Failed to parse YAML:", error);
    return null;
  }
}

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (match) {
    const frontmatter = parseYamlContent<Record<string, unknown>>(match[1]) || {};
    return { frontmatter, body: match[2].trim() };
  }

  return { frontmatter: {}, body: content };
}

/**
 * Transform Empathy Ledger URLs
 * Converts el://media/ID to actual EL API URLs
 */
function transformELUrls(content: string, elBaseUrl: string = "https://api.empathyledger.org"): string {
  return content
    .replace(/el:\/\/media\/(\w+)/g, `${elBaseUrl}/media/$1`)
    .replace(/el:\/\/video\/(\w+)/g, `${elBaseUrl}/video/$1`);
}

// ============ Content Type Interfaces ============

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  image: {
    el_id?: string;
    fallback: string;
    alt: string;
  };
  stats?: {
    visitors?: string;
    events?: string;
    enterprises?: string;
    workshops?: string;
    volunteers?: string;
  };
  status: "history" | "current" | "future";
}

export interface Zone {
  id: string;
  name: string;
  icon: string;
  status: "open" | "coming-soon" | "seasonal";
  description: string;
  features: string[];
  hours?: string;
  map_position?: { x: number; y: number };
  funding?: { goal: number; raised: number };
  image?: {
    el_id?: string;
    fallback: string;
    alt: string;
  };
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  connection: string;
  image?: {
    el_id?: string;
    fallback: string;
    alt: string;
  };
  featured: boolean;
  pages: string[];
}

export interface ImpactStat {
  id: string;
  value: string;
  label: string;
  icon: string;
  verified: boolean;
}

export interface ContactInfo {
  address: {
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
    full: string;
    map_link: string;
  };
  phone: string;
  email: {
    general: string;
    events: string;
    garden: string;
  };
  social: {
    instagram: string;
    facebook: string;
  };
  hours: {
    kitchen: string;
    garden: string;
    general: string;
  };
}

export interface WikiContent {
  timeline: TimelineEvent[];
  zones: Zone[];
  testimonials: Testimonial[];
  impact: {
    stories_stats: ImpactStat[];
    membership_stats: ImpactStat[];
    journey_stats: Record<string, Record<string, string>>;
  };
  contact: ContactInfo;
  values: string; // Markdown content
}

// ============ Content Loaders ============

/**
 * Load timeline events from history/timeline.yaml
 */
export function loadTimeline(): TimelineEvent[] {
  const content = readWikiFile("history/timeline.yaml");
  if (!content) return [];

  const data = parseYamlContent<{ events: TimelineEvent[] }>(content);
  return data?.events || [];
}

/**
 * Load zones from places/zones.yaml
 */
export function loadZones(): Zone[] {
  const content = readWikiFile("places/zones.yaml");
  if (!content) return [];

  const data = parseYamlContent<{ zones: Zone[] }>(content);
  return data?.zones || [];
}

/**
 * Load testimonials from community/testimonials.yaml
 */
export function loadTestimonials(): Testimonial[] {
  const content = readWikiFile("community/testimonials.yaml");
  if (!content) return [];

  const data = parseYamlContent<{ testimonials: Testimonial[] }>(content);
  return data?.testimonials || [];
}

/**
 * Load impact metrics from community/impact.yaml
 */
export function loadImpact() {
  const content = readWikiFile("community/impact.yaml");
  if (!content) return null;

  return parseYamlContent<{
    stories_stats: ImpactStat[];
    membership_stats: ImpactStat[];
    journey_stats: Record<string, Record<string, string>>;
  }>(content);
}

/**
 * Load contact info from operations/contact.yaml
 */
export function loadContact(): ContactInfo | null {
  const content = readWikiFile("operations/contact.yaml");
  if (!content) return null;

  return parseYamlContent<ContactInfo>(content);
}

/**
 * Load values content from foundation/values.md
 */
export function loadValues(): { frontmatter: Record<string, unknown>; body: string } | null {
  const content = readWikiFile("foundation/values.md");
  if (!content) return null;

  return parseFrontmatter(content);
}

/**
 * Load origins story from history/origins.md
 */
export function loadOrigins(): { frontmatter: Record<string, unknown>; body: string } | null {
  const content = readWikiFile("history/origins.md");
  if (!content) return null;

  return parseFrontmatter(content);
}

/**
 * Load all wiki content at once
 */
export function loadAllContent(): Partial<WikiContent> {
  return {
    timeline: loadTimeline(),
    zones: loadZones(),
    testimonials: loadTestimonials(),
    impact: loadImpact() || undefined,
    contact: loadContact() || undefined,
    values: loadValues()?.body,
  };
}

/**
 * List all story files in community/stories/
 */
export function listStories(): string[] {
  const storiesPath = join(WIKI_BASE, "community/stories");

  if (!existsSync(storiesPath)) {
    return [];
  }

  return readdirSync(storiesPath)
    .filter(file => file.endsWith(".md"))
    .map(file => basename(file, ".md"));
}

/**
 * Load a specific story by slug
 */
export function loadStory(slug: string): { frontmatter: Record<string, unknown>; body: string } | null {
  const content = readWikiFile(`community/stories/${slug}.md`);
  if (!content) return null;

  return parseFrontmatter(content);
}

/**
 * Get wiki file metadata (for debugging/admin)
 */
export function getWikiStatus() {
  const files = [
    "history/timeline.yaml",
    "history/origins.md",
    "foundation/values.md",
    "places/zones.yaml",
    "community/testimonials.yaml",
    "community/impact.yaml",
    "operations/contact.yaml",
  ];

  return files.map(file => {
    const fullPath = join(WIKI_BASE, file);
    const exists = existsSync(fullPath);

    let stats = null;
    if (exists) {
      const s = statSync(fullPath);
      stats = {
        size: s.size,
        modified: s.mtime.toISOString(),
      };
    }

    return {
      file,
      exists,
      stats,
    };
  });
}
