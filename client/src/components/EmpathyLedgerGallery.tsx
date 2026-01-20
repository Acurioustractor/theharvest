import { useState } from "react";
import { trpc } from "@/lib/trpc";

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

  const photos = (data?.media as ELMediaAsset[]) || [];

  if (isLoading) {
    return (
      <div className={`text-center py-12 text-stone-500 ${className}`}>
        Loading gallery...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 text-stone-500 ${className}`}>
        <p className="mb-2">Gallery not available</p>
        <p className="text-sm text-stone-400">Photos will appear here once connected</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className={`text-center py-12 text-stone-500 ${className}`}>
        <p className="mb-2">No photos yet</p>
        <p className="text-sm text-stone-400">Photos tagged with "{tag || 'harvest'}" will appear here</p>
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
