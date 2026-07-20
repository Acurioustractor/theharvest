import { useEffect, useState } from "react";
import { ImageIcon, Loader2, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { HarvestPhotoPicker, type PickedPhoto } from "./HarvestPhotoPicker";
import { optimize, type ImageSize } from "@/lib/imageOptimize";

type ImageLayer = {
  src: string;
  alt: string;
  loaded: boolean;
};

/**
 * Image with admin "swap" affordance.
 *
 * Resolves src in this priority order:
 *   1. Override row in image_overrides for (page, slot)
 *   2. `src` prop (page's bundled / EL-driven default)
 *
 * Admins see a "Swap" button on hover that opens the EL photo picker.
 * Non-admins just see the image — same as today, no UI noise.
 */
export function HarvestImage({
  page,
  slot,
  src: defaultSrc,
  alt: defaultAlt,
  className,
  imgClassName,
  defaultWorkSlug,
  size = "feature",
  priority = false,
  controlsPosition = "center",
}: {
  /** Logical page id, e.g. "works" */
  page: string;
  /** Slot id within the page, e.g. "milk-crate-pavilion-hero" */
  slot: string;
  /** Fallback when no override is set */
  src: string;
  /** Fallback alt text */
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Pre-select this work in the picker filter */
  defaultWorkSlug?: string;
  /** Optimisation size preset (drives Supabase render width + quality) */
  size?: ImageSize;
  /** Above-the-fold image — sets eager loading + high fetchpriority */
  priority?: boolean;
  /** Where the admin swap/revert controls sit. Use "corner" for full-bleed
   * heroes with text overlaid on top of the image, so the controls don't
   * land underneath the (higher z-index) heading and become unclickable. */
  controlsPosition?: "center" | "corner";
}) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const overrideQuery = trpc.imageOverrides.get.useQuery(
    { page, slot },
    { staleTime: 5 * 60 * 1000 },
  );
  const utils = trpc.useUtils();
  const setMutation = trpc.imageOverrides.set.useMutation({
    onSuccess: () => {
      utils.imageOverrides.get.invalidate({ page, slot });
      toast.success("Image swapped.");
    },
    onError: (err) => toast.error("Couldn't save", { description: err.message }),
  });
  const clearMutation = trpc.imageOverrides.clear.useMutation({
    onSuccess: () => {
      utils.imageOverrides.get.invalidate({ page, slot });
      toast.success("Reverted to default.");
    },
  });

  const [pickerOpen, setPickerOpen] = useState(false);
  const [imgErrored, setImgErrored] = useState(false);

  const override = overrideQuery.data;
  const rawSrc = override?.src ?? defaultSrc;
  const primarySrc = optimize(rawSrc, size);
  const bundledSrc = optimize(defaultSrc, size);
  // If the resolved (override or EL) image fails to load — e.g. a deleted
  // EL asset, a stale Supabase link — fall back to the page's bundled
  // default rather than leaving a broken image in place.
  const src = imgErrored && primarySrc !== bundledSrc ? bundledSrc : primarySrc;
  const alt = imgErrored ? defaultAlt : (override?.altText ?? defaultAlt);
  const hasExplicitPosition = /\b(?:absolute|fixed|sticky)\b/.test(className ?? "");
  const [layers, setLayers] = useState<[ImageLayer, ImageLayer | null]>(() => [
    { src: bundledSrc, alt: defaultAlt, loaded: false },
    null,
  ]);
  const [activeLayer, setActiveLayer] = useState<0 | 1>(0);
  const [transitionTarget, setTransitionTarget] = useState<0 | 1 | null>(null);

  // Reset the error flag whenever the resolved source changes (e.g. an
  // admin swaps the photo), so a stale failure doesn't stick around.
  useEffect(() => {
    setImgErrored(false);
  }, [rawSrc]);

  // Keep the currently displayed image mounted while the next source loads.
  // This makes the bundled/default photo available immediately and prevents
  // priority heroes from going blank during the override lookup.
  useEffect(() => {
    setTransitionTarget(null);

    setLayers((current) => {
      const currentLayer = current[activeLayer];
      if (currentLayer?.src === src) {
        if (currentLayer.alt === alt) return current;
        const next = [...current] as [ImageLayer, ImageLayer | null];
        next[activeLayer] = { ...currentLayer, alt };
        return next;
      }

      const nextIndex = activeLayer === 0 ? 1 : 0;
      const pendingLayer = current[nextIndex];
      if (pendingLayer?.src === src) {
        if (pendingLayer.alt === alt) return current;
        const next = [...current] as [ImageLayer, ImageLayer | null];
        next[nextIndex] = { ...pendingLayer, alt };
        return next;
      }

      const next = [...current] as [ImageLayer, ImageLayer | null];
      next[nextIndex] = { src, alt, loaded: false };
      return next;
    });
  }, [activeLayer, alt, src]);

  useEffect(() => {
    const currentLayer = layers[activeLayer];
    if (!currentLayer || currentLayer.src === src) return;

    const nextIndex = activeLayer === 0 ? 1 : 0;
    const nextLayer = layers[nextIndex];
    if (!nextLayer || nextLayer.src !== src || !nextLayer.loaded) return;

    setTransitionTarget(nextIndex);
    const timer = window.setTimeout(() => {
      setActiveLayer(nextIndex);
      setTransitionTarget(null);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [activeLayer, layers, src]);

  const markLayerLoaded = (index: 0 | 1, loadedSrc: string) => {
    setLayers((current) => {
      const layer = current[index];
      if (!layer || layer.src !== loadedSrc || layer.loaded) return current;
      const next = [...current] as [ImageLayer, ImageLayer | null];
      next[index] = { ...layer, loaded: true };
      return next;
    });
  };

  const handlePick = async (photo: PickedPhoto) => {
    await setMutation.mutateAsync({
      page,
      slot,
      mediaAssetId: photo.mediaAssetId,
      src: photo.src,
      altText: photo.altText ?? defaultAlt,
      title: photo.title ?? undefined,
    });
  };

  const handleRevert = async () => {
    await clearMutation.mutateAsync({ page, slot });
  };

  const showSkeleton = !layers[activeLayer]?.loaded;
  const visibleLayer = transitionTarget ?? activeLayer;

  return (
    <div className={`${hasExplicitPosition ? "" : "relative"} group ${className ?? ""} ${showSkeleton ? "bg-stone-200" : ""}`}>
      {layers.map((layer, index) => {
        if (!layer) return null;
        const layerIndex = index as 0 | 1;
        const isBaseLayer = layerIndex === 0;
        const isVisible = isBaseLayer
          ? layer.loaded || (priority && activeLayer === 0)
          : layer.loaded && visibleLayer === 1;

        return (
          <div
            key={`${layerIndex}-${layer.src}`}
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: isVisible ? 1 : 0 }}
          >
            <img
              src={layer.src}
              alt={layerIndex === activeLayer ? layer.alt : ""}
              aria-hidden={layerIndex !== activeLayer}
              className={imgClassName ?? ""}
              loading={priority ? "eager" : "lazy"}
              decoding={priority ? "sync" : "async"}
              fetchPriority={priority ? "high" : undefined}
              onLoad={() => markLayerLoaded(layerIndex, layer.src)}
              onError={() => {
                markLayerLoaded(layerIndex, layer.src);
                if (layer.src !== bundledSrc) setImgErrored(true);
              }}
            />
          </div>
        );
      })}

      {isAdmin && (
        <>
          {/* Hover-only admin overlay */}
          <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />

          <div
            className={`pointer-events-none absolute inset-0 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
              controlsPosition === "corner"
                ? "items-start justify-end p-4 pt-11"
                : "items-center justify-center"
            }`}
          >
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              disabled={setMutation.isPending}
              className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-stone-900 font-semibold text-sm hover:bg-amber-400 transition-colors shadow-lg disabled:opacity-50"
            >
              {setMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
              Swap photo
            </button>
            {override && (
              <button
                type="button"
                onClick={handleRevert}
                disabled={clearMutation.isPending}
                className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-stone-100 text-stone-800 font-medium text-xs hover:bg-white transition-colors shadow-md disabled:opacity-50"
                title="Revert to the page's default image"
              >
                <X className="h-3.5 w-3.5" />
                Revert
              </button>
            )}
          </div>

          {/* Tiny status pip — tells admin at a glance whether override is active */}
          {override && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500/90 text-stone-900 text-[10px] font-mono font-semibold uppercase tracking-wider shadow">
              Override
            </div>
          )}

          <HarvestPhotoPicker
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            onPick={handlePick}
            defaultWorkSlug={defaultWorkSlug}
          />
        </>
      )}
    </div>
  );
}
