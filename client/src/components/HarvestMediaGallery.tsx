import { Camera, Film } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { optimize } from "@/lib/imageOptimize";
import { EMPATHY_LEDGER_FALLBACK_IMAGES } from "@/data/empathyLedgerFallback";

type MediaCategory = "before" | "during" | "after" | "milestone" | "general";

type MediaAsset = {
  id: string;
  src: string;
  title: string | null;
  description: string | null;
  altText: string | null;
  category: MediaCategory;
  date: string | null;
  tags: string[];
  themes: string[];
  special?: string[];
  works?: string[];
};

type HarvestMediaGalleryProps = {
  title: string;
  eyebrow: string;
  description: string;
  work?: string;
  theme?: string;
  category?: MediaCategory;
  limit?: number;
  tagHint: string;
  className?: string;
};

// Keep public galleries useful when Empathy Ledger is unavailable. These are
// bundled, approved Harvest assets, so the page never depends on EL being up
// just to render an image grid.
const LOCAL_FALLBACK_MEDIA: MediaAsset[] = EMPATHY_LEDGER_FALLBACK_IMAGES.map((item) => ({
  id: `local-${item.id}`,
  src: item.src,
  title: item.title,
  description: item.description,
  altText: item.title,
  category: "general",
  date: null,
  tags: [],
  themes: [],
}));

function isVideoAsset(src: string): boolean {
  return /\.(mp4|mov|m4v|webm)(\?.*)?$/i.test(src);
}

export function HarvestMediaGallery({
  title,
  eyebrow,
  description,
  work,
  theme,
  category,
  limit = 8,
  tagHint,
  className = "",
}: HarvestMediaGalleryProps) {
  const query = trpc.gallery.fromEL.useQuery(
    {
      work,
      theme,
      category,
      limit,
    },
    {
      staleTime: 5 * 60 * 1000,
    },
  );

  const remoteMedia = (query.data?.media ?? []) as MediaAsset[];
  const media = remoteMedia.length > 0 ? remoteMedia : LOCAL_FALLBACK_MEDIA.slice(0, limit);
  const total = remoteMedia.length > 0 ? (query.data?.pagination?.total ?? remoteMedia.length) : media.length;

  return (
    <article className={`border border-stone-300/80 bg-[#FFFDF7] ${className}`}>
      <div className="border-b border-stone-200 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8B4A2A]">
              {eyebrow}
            </p>
            <h3 className="mt-2 text-2xl font-black leading-tight">{title}</h3>
          </div>
          <span className="border border-stone-300 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-600">
            {query.isLoading ? "loading" : remoteMedia.length > 0 ? `${total} in EL` : "bundled fallback"}
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-stone-700">{description}</p>
        <p className="mt-4 border-l-2 border-[#C4922A] pl-3 font-mono text-[10px] uppercase tracking-[0.14em] text-stone-500">
          tag as: {tagHint}
        </p>
      </div>

      {query.isLoading ? (
        <div className="grid gap-3 p-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-[4/3] animate-pulse bg-stone-200" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 p-5 sm:grid-cols-2">
          {media.map((item) => {
            const video = isVideoAsset(item.src);
            return (
              <figure key={item.id} className="group">
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                  {video ? (
                    <video
                      src={item.src}
                      controls
                      preload="metadata"
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={optimize(item.src, "card")}
                      alt={item.altText ?? item.title ?? title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      onError={(event) => {
                        const fallback = LOCAL_FALLBACK_MEDIA.find((candidate) => candidate.src !== item.src);
                        if (fallback && event.currentTarget.src !== window.location.origin + fallback.src) {
                          event.currentTarget.src = fallback.src;
                        }
                      }}
                    />
                  )}
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 bg-[#1C1917]/80 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#F5F0E8]">
                    {video ? <Film className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
                    {video ? "video" : "image"}
                  </span>
                </div>
                {(item.title || item.description) && (
                  <figcaption className="mt-2 text-xs leading-relaxed text-stone-500">
                    {item.title && <span className="font-semibold text-stone-700">{item.title}</span>}
                    {item.title && item.description && " - "}
                    {item.description}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      )}
    </article>
  );
}
