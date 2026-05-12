import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  MapPin,
  ZoomIn,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

interface ProgressImage {
  id: string;
  src: string;
  title: string;
  description: string;
  date: string;
  category: "before" | "during" | "after" | "milestone";
  location?: string;
}

// Progress images featuring the transformation journey
// These images showcase different aspects of The Harvest:
// - before: Original state when the nursery was acquired
// - during: Renovation and community work days
// - after: Completed spaces in action
// - milestone: Key moments in the community's story
const sampleProgressImages: ProgressImage[] = [
  // The Harvest Themes - showcasing different aspects of community life
  {
    id: "1",
    src: "/images/harvest-hero.jpg",
    title: "The Harvest Today",
    description: "The transformed site welcomes visitors to a place of eating, learning, growing, making, and gathering.",
    date: "2025-01",
    category: "after",
    location: "Main Site",
  },
  {
    id: "2",
    src: "/images/harvest-eat.jpg",
    title: "Eat: Kitchen in Action",
    description: "Seasonal breakfast and lunch served daily. Local produce, honest cooking, shared tables.",
    date: "2025-01",
    category: "after",
    location: "Kitchen & Cafe",
  },
  {
    id: "3",
    src: "/images/harvest-grow.jpg",
    title: "Grow: Garden Centre",
    description: "Native species, productive plants, and expert advice for hinterland gardens.",
    date: "2025-01",
    category: "after",
    location: "Garden Centre",
  },
  {
    id: "4",
    src: "/images/harvest-make.jpg",
    title: "Make: Workshop Spaces",
    description: "From pottery to preserving, learn new skills with local makers and artisans.",
    date: "2025-01",
    category: "after",
    location: "Workshop Shed",
  },
  {
    id: "5",
    src: "/images/harvest-gather.jpg",
    title: "Gather: Community Events",
    description: "Markets, music, and gatherings that bring neighbours together throughout the year.",
    date: "2025-01",
    category: "milestone",
    location: "Event Space",
  },
  // Community moments
  {
    id: "6",
    src: "/images/community-gathering.jpg",
    title: "Community Work Day",
    description: "Neighbours came together on clearing days, turning an overgrown nursery into a community hub.",
    date: "2024-06",
    category: "during",
    location: "Main Site",
  },
  {
    id: "7",
    src: "/images/market-atmosphere.jpg",
    title: "Market Day Vibes",
    description: "Monthly markets bringing together local producers, makers, and the wider community.",
    date: "2024-09",
    category: "milestone",
    location: "Market Area",
  },
  {
    id: "8",
    src: "/images/local-produce.jpg",
    title: "Fresh from the Hinterland",
    description: "Seasonal produce from local growers - the foundation of everything we serve.",
    date: "2025-01",
    category: "after",
    location: "Kitchen",
  },
];

const categoryLabels = {
  before: "Before",
  during: "In Progress",
  after: "Completed",
  milestone: "Milestone",
};

const categoryColors = {
  before: "bg-stone-500",
  during: "bg-amber-500",
  after: "bg-green-500",
  milestone: "bg-purple-500",
};

interface ProgressGalleryProps {
  images?: ProgressImage[];
  showFilters?: boolean;
  source?: "samples" | "local" | "empathy-ledger"; // Where to fetch images from
  pageTag?: string; // For EL: filter by page tag (home, journey, stories, etc.)
  theme?: string; // For EL: filter by theme (eat, grow, make, gather)
}

export function ProgressGallery({
  images: propImages,
  showFilters = true,
  source = "samples",
  pageTag,
  theme,
}: ProgressGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProgressImage["category"] | "all">("all");
  const [selectedImage, setSelectedImage] = useState<ProgressImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch from local database API
  const { data: localImages } = trpc.gallery.list.useQuery(undefined, {
    enabled: source === "local",
  });

  // Fetch from Empathy Ledger
  const { data: elResponse } = trpc.gallery.fromEL.useQuery(
    { tag: pageTag, theme },
    { enabled: source === "empathy-ledger" },
  );

  // Transform local DB images to match our interface
  const transformedLocalImages: ProgressImage[] | undefined = localImages?.map((img: {
    id: number;
    src: string;
    title: string;
    description: string | null;
    date: string;
    category: "before" | "during" | "after" | "milestone";
    location: string | null;
  }) => ({
    id: String(img.id),
    src: img.src,
    title: img.title,
    description: img.description || "",
    date: img.date,
    category: img.category,
    location: img.location || undefined,
  }));

  // Transform Empathy Ledger images to match our interface
  const transformedELImages: ProgressImage[] | undefined = elResponse?.media?.map((img: {
    id: string;
    src: string;
    title: string;
    description: string | null;
    date: string | null;
    category: "before" | "during" | "after" | "milestone" | "general";
    location: string | null;
  }) => ({
    id: img.id,
    src: img.src,
    title: img.title,
    description: img.description || "",
    date: img.date || "",
    category: img.category === "general" ? "milestone" : img.category,
    location: img.location || undefined,
  }));

  // Determine which images to use based on source
  const images = source === "empathy-ledger"
    ? (transformedELImages || [])
    : source === "local"
    ? (transformedLocalImages || propImages || sampleProgressImages)
    : (propImages || sampleProgressImages);

  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const openLightbox = (image: ProgressImage) => {
    setSelectedImage(image);
    setLightboxIndex(filteredImages.findIndex((img) => img.id === image.id));
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? (lightboxIndex - 1 + filteredImages.length) % filteredImages.length
        : (lightboxIndex + 1) % filteredImages.length;
    setLightboxIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  return (
    <div>
      {/* Category Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className={selectedCategory === "all" ? "bg-stone-800" : ""}
          >
            All Stages
          </Button>
          {(Object.keys(categoryLabels) as ProgressImage["category"][]).map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? categoryColors[cat] : ""}
            >
              {categoryLabels[cat]}
            </Button>
          ))}
        </div>
      )}

      {/* Image Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="overflow-hidden cursor-pointer group border-0 shadow-md hover:shadow-xl transition-all"
                onClick={() => openLightbox(image)}
              >
                <div className="relative aspect-square">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Category Badge */}
                  <div
                    className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white ${categoryColors[image.category]}`}
                  >
                    {categoryLabels[image.category]}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                      <ZoomIn className="h-5 w-5 text-stone-700" />
                    </div>
                  </div>

                  {/* Title on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-medium text-sm truncate">
                      {image.title}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedImage && (
            <div>
              {/* Image */}
              <div className="relative bg-black">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="w-full max-h-[70vh] object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />

                {/* Navigation Arrows */}
                {filteredImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateLightbox("prev");
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6 text-stone-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateLightbox("next");
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="h-6 w-6 text-stone-700" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
                  {lightboxIndex + 1} / {filteredImages.length}
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium text-white ${categoryColors[selectedImage.category]}`}
                  >
                    {categoryLabels[selectedImage.category]}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">
                  {selectedImage.title}
                </h3>

                <p className="text-stone-600 mb-4">{selectedImage.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-stone-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(selectedImage.date).toLocaleDateString("en-AU", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  {selectedImage.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {selectedImage.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Before/After Comparison Component
interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  title?: string;
}

export function BeforeAfterComparison({
  beforeImage,
  afterImage,
  title,
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50);

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      {title && (
        <div className="p-4 border-b">
          <h3 className="font-serif font-bold text-stone-800">{title}</h3>
        </div>
      )}
      <div className="relative aspect-video select-none">
        {/* After Image (Background) */}
        <img
          src={afterImage}
          alt="After"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Before Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={beforeImage}
            alt="Before"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: `${100 / (position / 100)}%`, maxWidth: "none" }}
          />
        </div>

        {/* Slider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
            <ChevronLeft className="h-4 w-4 text-stone-600 -mr-1" />
            <ChevronRight className="h-4 w-4 text-stone-600 -ml-1" />
          </div>
        </div>

        {/* Drag Handler */}
        <input
          type="range"
          min="5"
          max="95"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        />

        {/* Labels */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-stone-800/80 rounded-full text-white text-sm font-medium">
          Before
        </div>
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-green-600/80 rounded-full text-white text-sm font-medium">
          After
        </div>
      </div>
    </Card>
  );
}

export { sampleProgressImages };
