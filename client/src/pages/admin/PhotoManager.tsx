import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  X,
  RefreshCw,
  Eye,
  Save,
  Home,
  MapPin,
  BookOpen,
  Compass,
  Users,
  Calendar,
  Utensils,
  Leaf,
  Hammer,
  Users2,
  Star,
  Sparkles,
} from "lucide-react";

const EMPATHY_LEDGER_BASE =
  import.meta.env.VITE_EMPATHY_LEDGER_URL || "http://localhost:3030";

interface PhotoTags {
  pages: string[];
  themes: string[];
  category: string | null;
  special: string[];
}

interface Photo {
  id: string;
  src: string;
  thumbnail: string | null;
  title: string | null;
  description: string | null;
  altText: string | null;
  createdAt: string;
  tags: PhotoTags;
}

interface AvailableTags {
  pages: string[];
  themes: string[];
  categories: string[];
  special: string[];
}

const PAGE_ICONS: Record<string, React.ReactNode> = {
  home: <Home className="h-3 w-3" />,
  journey: <MapPin className="h-3 w-3" />,
  stories: <BookOpen className="h-3 w-3" />,
  explore: <Compass className="h-3 w-3" />,
  membership: <Users className="h-3 w-3" />,
  visit: <MapPin className="h-3 w-3" />,
  "whats-on": <Calendar className="h-3 w-3" />,
};

const THEME_ICONS: Record<string, React.ReactNode> = {
  eat: <Utensils className="h-3 w-3" />,
  grow: <Leaf className="h-3 w-3" />,
  make: <Hammer className="h-3 w-3" />,
  gather: <Users2 className="h-3 w-3" />,
};

const THEME_COLORS: Record<string, string> = {
  eat: "bg-orange-100 text-orange-700 border-orange-300",
  grow: "bg-green-100 text-green-700 border-green-300",
  make: "bg-purple-100 text-purple-700 border-purple-300",
  gather: "bg-blue-100 text-blue-700 border-blue-300",
};

const SPECIAL_ICONS: Record<string, React.ReactNode> = {
  hero: <Star className="h-3 w-3" />,
  featured: <Sparkles className="h-3 w-3" />,
};

export default function PhotoManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [availableTags, setAvailableTags] = useState<AvailableTags | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [previewPage, setPreviewPage] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Map<string, PhotoTags>>(
    new Map()
  );

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${EMPATHY_LEDGER_BASE}/api/v1/harvest/photos`);
      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }
      const data = await response.json();
      setPhotos(data.photos || []);
      setAvailableTags(data.availableTags || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const getPhotoTags = (photo: Photo): PhotoTags => {
    const tags = pendingChanges.get(photo.id) || photo.tags;
    // Ensure special array exists for backwards compatibility
    return { ...tags, special: tags.special || [] };
  };

  const toggleTag = (
    photo: Photo,
    type: "pages" | "themes" | "special",
    tag: string
  ) => {
    const currentTags = getPhotoTags(photo);
    const newTags = { ...currentTags };

    if (type === "pages" || type === "themes" || type === "special") {
      const list = [...currentTags[type]];
      const index = list.indexOf(tag);
      if (index >= 0) {
        list.splice(index, 1);
      } else {
        list.push(tag);
      }
      newTags[type] = list;
    }

    setPendingChanges((prev) => new Map(prev).set(photo.id, newTags));
  };

  const setCategory = (photo: Photo, category: string | null) => {
    const currentTags = getPhotoTags(photo);
    const newTags = { ...currentTags, category };
    setPendingChanges((prev) => new Map(prev).set(photo.id, newTags));
  };

  const savePhoto = async (photo: Photo) => {
    const tags = pendingChanges.get(photo.id);
    if (!tags) return;

    setSaving(photo.id);

    try {
      const response = await fetch(`${EMPATHY_LEDGER_BASE}/api/v1/harvest/photos`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: photo.id, tags }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save");
      }

      // Update local state
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, tags } : p))
      );
      setPendingChanges((prev) => {
        const next = new Map(prev);
        next.delete(photo.id);
        return next;
      });
    } catch (err) {
      alert("Failed to save changes");
    } finally {
      setSaving(null);
    }
  };

  const hasChanges = (photo: Photo) => pendingChanges.has(photo.id);

  const previewPhotos = previewPage
    ? photos.filter((p) => getPhotoTags(p).pages.includes(previewPage))
    : photos;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Loading photos from Empathy Ledger...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchPhotos}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-stone-800">
                Photo Manager
              </h1>
              <p className="text-sm text-stone-500">
                Tag photos for different pages on The Harvest website
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchPhotos}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Preview Filter */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-stone-500 mr-2">
              <Eye className="h-4 w-4 inline mr-1" />
              Preview page:
            </span>
            <Button
              size="sm"
              variant={previewPage === null ? "default" : "outline"}
              onClick={() => setPreviewPage(null)}
            >
              All ({photos.length})
            </Button>
            {availableTags?.pages.map((page) => {
              const count = photos.filter((p) =>
                getPhotoTags(p).pages.includes(page)
              ).length;
              return (
                <Button
                  key={page}
                  size="sm"
                  variant={previewPage === page ? "default" : "outline"}
                  onClick={() => setPreviewPage(page)}
                  className="capitalize"
                >
                  {PAGE_ICONS[page]}
                  <span className="ml-1">{page}</span>
                  <span className="ml-1 text-xs opacity-70">({count})</span>
                </Button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Photo Grid */}
      <main className="container py-8">
        {previewPhotos.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            {previewPage
              ? `No photos tagged for "${previewPage}" yet. Tag some photos below!`
              : "No photos in the gallery. Add photos in Empathy Ledger first."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewPhotos.map((photo) => {
              const tags = getPhotoTags(photo);
              const changed = hasChanges(photo);
              const isSaving = saving === photo.id;

              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                >
                  <Card
                    className={`overflow-hidden ${
                      changed ? "ring-2 ring-amber-400" : ""
                    }`}
                  >
                    {/* Photo */}
                    <div className="relative h-48 bg-stone-100">
                      <img
                        src={photo.thumbnail || photo.src}
                        alt={photo.altText || photo.title || "Photo"}
                        className="w-full h-full object-cover"
                      />
                      {/* Hero/Featured badges */}
                      {tags.special?.includes("hero") && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow">
                          <Star className="h-3 w-3" />
                          Hero
                        </div>
                      )}
                      {tags.special?.includes("featured") && !tags.special?.includes("hero") && (
                        <div className="absolute top-2 left-2 bg-purple-400 text-purple-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow">
                          <Sparkles className="h-3 w-3" />
                          Featured
                        </div>
                      )}
                      {changed && (
                        <div className="absolute top-2 right-2">
                          <Button
                            size="sm"
                            className="bg-amber-500 hover:bg-amber-600"
                            onClick={() => savePhoto(photo)}
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4 space-y-4">
                      {/* Title */}
                      {photo.title && (
                        <p className="font-medium text-stone-800 text-sm truncate">
                          {photo.title}
                        </p>
                      )}

                      {/* Page Tags */}
                      <div>
                        <p className="text-xs text-stone-500 mb-2">
                          Show on pages:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {availableTags?.pages.map((page) => {
                            const isActive = tags.pages.includes(page);
                            return (
                              <button
                                key={page}
                                onClick={() => toggleTag(photo, "pages", page)}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
                                  isActive
                                    ? "bg-stone-800 text-white border-stone-800"
                                    : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
                                }`}
                              >
                                {PAGE_ICONS[page]}
                                <span className="capitalize">{page}</span>
                                {isActive && <Check className="h-3 w-3" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Theme Tags */}
                      <div>
                        <p className="text-xs text-stone-500 mb-2">Themes:</p>
                        <div className="flex flex-wrap gap-1">
                          {availableTags?.themes.map((theme) => {
                            const isActive = tags.themes.includes(theme);
                            return (
                              <button
                                key={theme}
                                onClick={() => toggleTag(photo, "themes", theme)}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
                                  isActive
                                    ? THEME_COLORS[theme]
                                    : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
                                }`}
                              >
                                {THEME_ICONS[theme]}
                                <span className="capitalize">{theme}</span>
                                {isActive && <Check className="h-3 w-3" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <p className="text-xs text-stone-500 mb-2">
                          Timeline category:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {availableTags?.categories.map((cat) => {
                            const isActive = tags.category === cat;
                            return (
                              <button
                                key={cat}
                                onClick={() =>
                                  setCategory(photo, isActive ? null : cat)
                                }
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
                                  isActive
                                    ? "bg-amber-100 text-amber-700 border-amber-300"
                                    : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
                                }`}
                              >
                                <span className="capitalize">{cat}</span>
                                {isActive && <X className="h-3 w-3" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Special Tags (Hero/Featured) */}
                      <div>
                        <p className="text-xs text-stone-500 mb-2">
                          Special display:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {availableTags?.special?.map((sp) => {
                            const isActive = tags.special?.includes(sp);
                            return (
                              <button
                                key={sp}
                                onClick={() => toggleTag(photo, "special", sp)}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
                                  isActive
                                    ? "bg-yellow-100 text-yellow-700 border-yellow-400"
                                    : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
                                }`}
                              >
                                {SPECIAL_ICONS[sp]}
                                <span className="capitalize">{sp}</span>
                                {isActive && <Check className="h-3 w-3" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Pending Changes Bar */}
      {pendingChanges.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-amber-500 text-white py-3 px-4 shadow-lg">
          <div className="container flex items-center justify-between">
            <span className="font-medium">
              {pendingChanges.size} photo{pendingChanges.size > 1 ? "s" : ""} with
              unsaved changes
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white/20"
                onClick={() => setPendingChanges(new Map())}
              >
                Discard All
              </Button>
              <Button
                size="sm"
                className="bg-white text-amber-600 hover:bg-white/90"
                onClick={async () => {
                  for (const [photoId] of pendingChanges) {
                    const photo = photos.find((p) => p.id === photoId);
                    if (photo) await savePhoto(photo);
                  }
                }}
              >
                Save All Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
