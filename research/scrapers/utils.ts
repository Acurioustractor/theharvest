import axios, { type AxiosRequestConfig } from "axios";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../data");
const CACHE_DIR = path.resolve(__dirname, "../.cache");

// Rate limiter: simple sequential delay between requests
let lastRequestTime = 0;
const MIN_DELAY_MS = 500;

async function rateLimit() {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_DELAY_MS) {
    await new Promise((r) => setTimeout(r, MIN_DELAY_MS - elapsed));
  }
  lastRequestTime = Date.now();
}

// Cached HTTP GET with disk cache
export async function cachedGet<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
  cacheTTLHours = 24
): Promise<T> {
  await fs.mkdir(CACHE_DIR, { recursive: true });

  const cacheInput = url + JSON.stringify(config?.params || {});
  // Use a simple hash to avoid truncation collisions
  let hash = 0;
  for (let i = 0; i < cacheInput.length; i++) {
    hash = ((hash << 5) - hash + cacheInput.charCodeAt(i)) | 0;
  }
  const cacheKey = Buffer.from(cacheInput)
    .toString("base64url")
    .slice(0, 60) + "_" + Math.abs(hash).toString(36);
  const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);

  // Check cache
  try {
    const stat = await fs.stat(cacheFile);
    const ageHours = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60);
    if (ageHours < cacheTTLHours) {
      const cached = await fs.readFile(cacheFile, "utf-8");
      return JSON.parse(cached) as T;
    }
  } catch {
    // Cache miss
  }

  await rateLimit();
  console.log(`  GET ${url.slice(0, 100)}${url.length > 100 ? "..." : ""}`);

  const response = await axios.get<T>(url, {
    timeout: 30000,
    ...config,
  });

  await fs.writeFile(cacheFile, JSON.stringify(response.data, null, 2));
  return response.data;
}

// Save scraped data to research/data/
export async function saveData(filename: string, data: unknown): Promise<string> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`  Saved ${filePath}`);
  return filePath;
}

// Load previously saved data
export async function loadData<T = unknown>(filename: string): Promise<T | null> {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

// Simple progress logger
export function logSection(title: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${"=".repeat(60)}`);
}
