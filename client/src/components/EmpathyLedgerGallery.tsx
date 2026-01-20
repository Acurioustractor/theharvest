import { useEffect, useState } from "react";

// Use localhost for development, production URL when deployed
const EMPATHY_LEDGER_BASE = import.meta.env.VITE_EMPATHY_LEDGER_URL || "http://localhost:3030";

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
  tag?: "home" | "journey" | "stories" | "explore" | "membership" | "visit" | "whats-on";
  theme?: "eat" | "grow" | "make" | "gather";
  category?: "before" | "during" | "after" | "milestone" | "general";
  limit?: number;
  columns?: 2 | 3 | 4;
}

/**
 * Displays photos from Empathy Ledger with Harvest tags
 *
 * Uses the /api/v1/harvest/gallery endpoint which filters by tags.
 * No syndication setup required - just tag photos in Empathy Ledger admin.
 */
export function HarvestGallery({
  className = "",
  tag,
  theme,
  category,
  limit = 12,
  columns = 3,
}: HarvestGalleryProps) {
  const [photos, setPhotos] = useState<ELMediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<ELMediaAsset | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ limit: String(limit) });
      if (tag) params.set("tag", tag);
      if (theme) params.set("theme", theme);
      if (category) params.set("category", category);

      const url = `${EMPATHY_LEDGER_BASE}/api/v1/harvest/gallery?${params}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to load gallery");
        }
        const data = await response.json();
        setPhotos(data.media || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load gallery");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [tag, theme, category, limit]);

  if (loading) {
    return (
      <div className={`text-center py-12 text-stone-500 ${className}`}>
        Loading gallery...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 text-red-600 bg-red-50 rounded-lg ${className}`}>
        {error}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className={`text-center py-12 text-stone-500 ${className}`}>
        No photos available
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
              src={photo.src}
              alt={photo.altText || photo.title || "Gallery image"}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
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
            src={selectedPhoto.src}
            alt={selectedPhoto.altText || selectedPhoto.title || "Gallery image"}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
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
