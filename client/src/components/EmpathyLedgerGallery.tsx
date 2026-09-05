import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { EMPATHY_LEDGER_FALLBACK_IMAGES } from "@/data/empathyLedgerFallback";

// Media asset returned by Harvest Gallery API
interface ELMediaAsset {
  id: string;
  src: string;
  title: string;
  description: string | null;
  altText: string | null;
  category: "before" | "during" | "after" | "milestone" | "general";
  date: string | null;
  tags: string[];
  themes: string[];
  sortOrder: number;
}

interface HarvestGalleryProps {
  className?: string;
  tag?: string;
  theme?: "eat" | "grow" | "make" | "gather";
  category?: "before" | "during" | "after" | "milestone" | "general";
  limit?: number;
  columns?: 2 | 3 | 4;
}

// Shown when Empathy Ledger is unreachable or has nothing tagged yet, so a
// "Photo Gallery" section never renders as an empty placeholder. Reuses
// real photos already bundled with the site.
const FALLBACK_PHOTOS: ELMediaAsset[] = EMPATHY_LEDGER_FALLBACK_IMAGES.map((item, index) => ({
  id: item.id,
  src: item.src,
  title: item.title,
  description: item.description,
  altText: item.title,
  category: "general",
  date: null,
  tags: [],
  themes: [],
  sortOrder: index,
}));

/**
 * Transform Supabase storage URL to use image transformation
 * Reduces 6-8MB images to ~200KB for mobile performance
 */
function optimizeImageUrl(src: string, width: number = 800): string {
  if (!src) return src;

  // Check if it's a Supabase storage URL
  if (src.includes('supabase.co/storage/v1/object/public/')) {
    // Convert to render endpoint with transformation params
    return src.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    ) + `?width=${width}&quality=75`;
  }

  return src;
}

/**
 * Displays photos from Empathy Ledger with Harvest tags
 *
 * Uses tRPC gallery.fromEL endpoint which proxies to Empathy Ledger.
 * No CORS issues - all requests go through our server.
 */
export function HarvestGallery({
  className = "",
  tag,
  theme,
  category,
  limit = 12,
  columns = 3,
}: HarvestGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ELMediaAsset | null>(null);

  const { data, isLoading, error } = trpc.gallery.fromEL.useQuery({
    tag,
    theme,
    category: category === "general" ? undefined : category,
    limit,
  });

  const elPhotos = (data?.media as ELMediaAsset[]) || [];
  // Empathy Ledger is unreachable or has nothing tagged yet — show a
  // curated set of real local photos instead of an empty placeholder.
  const photos = !isLoading && (error || elPhotos.length === 0) ? FALLBACK_PHOTOS : elPhotos;

  if (isLoading) {
    return (
      <div className={`text-center py-12 text-stone-500 ${className}`}>
        Loading gallery...
      </div>
    );
  }

  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={className}>
      <div className={`grid gap-4 ${gridCols[columns]}`}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative overflow-hidden rounded-lg bg-stone-100 cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={optimizeImageUrl(photo.src, 600)}
              alt={photo.altText || photo.title || "Gallery image"}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/images/placeholder.jpg";
              }}
            />
            {(photo.title || photo.description) && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                {photo.title && (
                  <p className="text-white font-medium text-sm">{photo.title}</p>
                )}
                {photo.description && (
                  <p className="text-white/80 text-xs line-clamp-2">{photo.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:opacity-70"
            onClick={() => setSelectedPhoto(null)}
          >
            &times;
          </button>
          <img
            src={optimizeImageUrl(selectedPhoto.src, 1200)}
            alt={selectedPhoto.altText || selectedPhoto.title || "Gallery image"}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/images/placeholder.jpg";
            }}
          />
          {(selectedPhoto.title || selectedPhoto.description) && (
            <div className="absolute bottom-4 left-4 right-4 text-center text-white">
              {selectedPhoto.title && (
                <p className="text-lg font-medium">{selectedPhoto.title}</p>
              )}
              {selectedPhoto.description && (
                <p className="text-sm opacity-80">{selectedPhoto.description}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Attribution */}
      <div className="mt-4 text-center">
        <a
          href="https://empathyledger.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-stone-400 hover:text-stone-600"
        >
          Powered by Empathy Ledger
        </a>
      </div>
    </div>
  );
}

export default HarvestGallery;
