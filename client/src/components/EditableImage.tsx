import { useState, useEffect } from "react";
import { Camera, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";

const EMPATHY_LEDGER_BASE =
  import.meta.env.VITE_EMPATHY_LEDGER_URL || "http://localhost:3030";

interface Photo {
  id: string;
  src: string;
  thumbnail: string | null;
  title: string | null;
  altText: string | null;
  tags: {
    pages: string[];
    themes: string[];
    category: string | null;
    special: string[];
  };
}

interface EditableImageProps {
  /** The page this image belongs to (e.g., "visit", "home") */
  page: string;
  /** The slot type (matches Empathy Ledger special tags) */
  slot: "hero" | "featured" | "card-1" | "card-2" | "card-3" | "card-4" | "card-5" | "card-6";
  /** Alt text for the image */
  alt: string;
  /** CSS classes for the container */
  className?: string;
  /** CSS classes for the image */
  imageClassName?: string;
  /** Aspect ratio constraint (e.g., "aspect-video", "aspect-square"). Use "" for no aspect ratio. */
  aspectRatio?: string;
  /** How the image should fit within its container */
  objectFit?: "cover" | "contain" | "fill" | "scale-down";
  /** Placeholder content when no image is set */
  placeholder?: React.ReactNode;
  /** Callback when image changes */
  onImageChange?: (photoId: string | null) => void;
}

/**
 * EditableImage component that displays images from Empathy Ledger
 * and allows admins to click to change the image inline.
 */
export function EditableImage({
  page,
  slot,
  alt,
  className,
  imageClassName,
  aspectRatio = "aspect-video",
  objectFit = "cover",
  placeholder,
  onImageChange,
}: EditableImageProps) {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";

  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [availablePhotos, setAvailablePhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);

  // Fetch the assigned photo for this slot
  // Photos are matched by page tag + special tag (hero/featured)
  useEffect(() => {
    const fetchSlotPhoto = async () => {
      setLoading(true);
      try {
        const url = `${EMPATHY_LEDGER_BASE}/api/v1/harvest/photos`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          // Find photo with matching page + special tag
          const slotPhoto = data.photos?.find((p: Photo) =>
            p.tags.pages?.includes(page) && p.tags.special?.includes(slot)
          );
          setPhoto(slotPhoto || null);
        }
      } catch (err) {
        // Empathy Ledger may not be running - silently fail
        console.log("[EditableImage] Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlotPhoto();
  }, [page, slot]);

  // Fetch all available photos when picker opens
  const openPicker = async () => {
    setPickerOpen(true);
    setLoadingPhotos(true);
    try {
      const response = await fetch(`${EMPATHY_LEDGER_BASE}/api/v1/harvest/photos`);
      if (response.ok) {
        const data = await response.json();
        setAvailablePhotos(data.photos || []);
      }
    } catch (err) {
      console.error("Failed to fetch photos:", err);
    } finally {
      setLoadingPhotos(false);
    }
  };

  // Assign a photo to this slot
  const selectPhoto = async (selectedPhoto: Photo) => {
    setSaving(true);
    try {
      // First, remove this page+slot combo from any existing photo
      if (photo && photo.id !== selectedPhoto.id) {
        const oldTags = {
          pages: photo.tags.pages?.filter((p) => p !== page) || [],
          themes: photo.tags.themes || [],
          category: photo.tags.category,
          special: photo.tags.special?.filter((s) => s !== slot) || [],
        };
        await fetch(`${EMPATHY_LEDGER_BASE}/api/v1/harvest/photos`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photoId: photo.id, tags: oldTags }),
        });
      }

      // Add page + special tag to selected photo
      const newTags = {
        pages: [...new Set([...(selectedPhoto.tags.pages || []), page])],
        themes: selectedPhoto.tags.themes || [],
        category: selectedPhoto.tags.category,
        special: [...new Set([...(selectedPhoto.tags.special || []), slot])],
      };

      const response = await fetch(`${EMPATHY_LEDGER_BASE}/api/v1/harvest/photos`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: selectedPhoto.id, tags: newTags }),
      });

      if (response.ok) {
        setPhoto({ ...selectedPhoto, tags: newTags });
        setImageLoaded(false);
        onImageChange?.(selectedPhoto.id);
      } else {
        const errorData = await response.json();
        console.error("Failed to save photo tags:", errorData);
      }
    } catch (err) {
      console.error("Failed to save photo:", err);
    } finally {
      setSaving(false);
      setPickerOpen(false);
    }
  };

  // Remove photo from slot
  const removePhoto = async () => {
    if (!photo) return;
    setSaving(true);
    try {
      const newTags = {
        pages: photo.tags.pages?.filter((p) => p !== page) || [],
        themes: photo.tags.themes || [],
        category: photo.tags.category,
        special: photo.tags.special?.filter((s) => s !== slot) || [],
      };
      await fetch(`${EMPATHY_LEDGER_BASE}/api/v1/harvest/photos`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: photo.id, tags: newTags }),
      });
      setPhoto(null);
      onImageChange?.(null);
    } catch (err) {
      console.error("Failed to remove photo:", err);
    } finally {
      setSaving(false);
      setPickerOpen(false);
    }
  };

  const defaultPlaceholder = (
    <div className="flex flex-col items-center justify-center text-stone-400">
      <Camera className="h-12 w-12 mb-2" />
      <span className="text-sm">No image set</span>
    </div>
  );

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden bg-stone-100 group",
          aspectRatio,
          className
        )}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
          </div>
        ) : photo ? (
          <>
            {/* Gradient placeholder while loading */}
            <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300" />
            <img
              src={photo.src}
              alt={photo.altText || alt}
              onLoad={() => setImageLoaded(true)}
              className={cn(
                "absolute inset-0 w-full h-full transition-opacity duration-500",
                `object-${objectFit}`,
                imageLoaded ? "opacity-100" : "opacity-0",
                imageClassName
              )}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {placeholder || defaultPlaceholder}
          </div>
        )}

        {/* Admin edit overlay */}
        {isAdmin && (
          <button
            onClick={openPicker}
            className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <div className="bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span className="text-sm font-medium">
                {photo ? "Change Image" : "Add Image"}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Photo Picker Dialog */}
      <Dialog open={pickerOpen} onOpenChange={(open) => {
        setPickerOpen(open);
        if (!open) setPreviewPhoto(null);
      }}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Image for {page} / {slot}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
            {/* Photo Grid */}
            <div className="flex-1 overflow-y-auto min-w-0">
              {loadingPhotos ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
                </div>
              ) : availablePhotos.length === 0 ? (
                <div className="text-center py-12 text-stone-500">
                  <Camera className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No photos available.</p>
                  <p className="text-sm mt-2">
                    Upload photos to Empathy Ledger first.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 p-1">
                  {availablePhotos.map((p) => {
                    const isSelected = photo?.id === p.id;
                    const isPreviewing = previewPhoto?.id === p.id;
                    const isAssignedElsewhere =
                      p.tags.special?.includes(slot) &&
                      p.tags.pages?.some((pg) => pg !== page);

                    return (
                      <button
                        key={p.id}
                        onClick={() => !isAssignedElsewhere && selectPhoto(p)}
                        onMouseEnter={() => setPreviewPhoto(p)}
                        disabled={saving || isAssignedElsewhere}
                        className={cn(
                          "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                          isSelected
                            ? "border-amber-500 ring-2 ring-amber-500/30"
                            : isPreviewing
                            ? "border-amber-300"
                            : isAssignedElsewhere
                            ? "border-stone-200 opacity-50 cursor-not-allowed"
                            : "border-transparent hover:border-stone-300"
                        )}
                      >
                        <img
                          src={p.thumbnail || p.src}
                          alt={p.altText || p.title || "Photo"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                            <div className="bg-amber-500 rounded-full p-1">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                        {isAssignedElsewhere && (
                          <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded text-center">
                            Used elsewhere
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Preview Panel */}
            <div className="hidden md:flex w-72 flex-col border-l pl-4">
              <h4 className="text-sm font-medium text-stone-500 mb-3">Preview</h4>
              {previewPhoto ? (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 mb-3">
                    <img
                      src={previewPhoto.src}
                      alt={previewPhoto.altText || previewPhoto.title || "Preview"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {previewPhoto.title && (
                    <p className="font-medium text-stone-800 text-sm truncate">
                      {previewPhoto.title}
                    </p>
                  )}
                  {previewPhoto.altText && (
                    <p className="text-stone-500 text-xs mt-1 line-clamp-2">
                      {previewPhoto.altText}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {previewPhoto.tags.pages?.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px]">
                        {t}
                      </span>
                    ))}
                    {previewPhoto.tags.special?.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Button
                    className="mt-auto bg-amber-500 hover:bg-amber-600 text-black"
                    onClick={() => selectPhoto(previewPhoto)}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Select This Image
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-stone-400 text-sm">
                  Hover over an image to preview
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              {photo && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removePhoto}
                  disabled={saving}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove Image
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <span className="text-sm text-stone-500 self-center">
                {availablePhotos.length} photos
              </span>
              <Button variant="outline" onClick={() => setPickerOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
