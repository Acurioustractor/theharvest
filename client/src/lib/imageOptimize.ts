/**
 * Image optimisation helper.
 *
 * Supabase Storage exposes a render endpoint that resizes/optimises images on
 * the fly:  /storage/v1/render/image/public/<bucket>/<path>?width=...&quality=...
 *
 * We swap `/object/public/` for `/render/image/public/` on EL-hosted assets
 * and append the size you actually need. Local images and external URLs are
 * returned untouched.
 *
 * Real-world saving on Harvest gallery photos: ~430KB → ~70KB at 400px.
 */

export type ImageSize = "thumb" | "card" | "hero" | "feature";

const PRESETS: Record<ImageSize, { width: number; quality: number }> = {
  thumb:   { width: 400,  quality: 70 },  // grid tiles
  card:    { width: 800,  quality: 75 },  // /works index cards
  hero:    { width: 1600, quality: 82 },  // detail-page hero
  feature: { width: 1200, quality: 78 },  // inline feature images
};

/**
 * Given a Supabase Storage URL and a size preset, return an optimised version.
 * Untouched if the URL isn't a Supabase /object/public/ URL or is empty.
 */
export function optimize(url: string | null | undefined, size: ImageSize): string {
  if (!url) return "";
  const preset = PRESETS[size];

  // Detect Supabase storage public URL
  const m = url.match(/^(https:\/\/[^/]+)\/storage\/v1\/object\/public\/(.+)$/);
  if (!m) return url;

  const [, origin, path] = m;
  // Strip any existing query string from the path before re-appending ours
  const [cleanPath, existingQuery] = path.split("?");
  const params = new URLSearchParams(existingQuery || "");
  params.set("width", String(preset.width));
  params.set("quality", String(preset.quality));
  params.set("resize", "contain");
  return `${origin}/storage/v1/render/image/public/${cleanPath}?${params.toString()}`;
}

/**
 * Build a srcSet for responsive images. Useful when the same photo appears
 * at varying viewport widths.
 */
export function buildSrcSet(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const sizes: ImageSize[] = ["thumb", "card", "feature", "hero"];
  return sizes
    .map((s) => `${optimize(url, s)} ${PRESETS[s].width}w`)
    .join(", ");
}
