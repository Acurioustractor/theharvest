import { useRef, useState } from "react";
import { Loader2, Search, Check, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const WORKS = [
  { slug: "milk-crate-pavilion", label: "Milk Crate Pavilion" },
  { slug: "the-cedar", label: "The Garden Paths" },
  { slug: "the-garden", label: "The Garden" },
  { slug: "kids-area", label: "Kids' Area" },
  { slug: "the-shop", label: "The Shop" },
  { slug: "the-milk-man", label: "The Milk Man" },
] as const;

const THEMES = [
  { slug: "eat", label: "Eat" },
  { slug: "grow", label: "Grow" },
  { slug: "make", label: "Make" },
  { slug: "gather", label: "Gather" },
] as const;

export type PickedPhoto = {
  mediaAssetId: string;
  src: string;
  altText: string | null;
  title: string | null;
};

export function HarvestPhotoPicker({
  open,
  onOpenChange,
  onPick,
  defaultWorkSlug,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPick: (photo: PickedPhoto) => void;
  /** Pre-select a work filter (e.g. the page's work slug). */
  defaultWorkSlug?: string;
}) {
  const [work, setWork] = useState<string | undefined>(defaultWorkSlug);
  const [theme, setTheme] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();

  const query = trpc.gallery.fromEL.useQuery(
    { work, theme, limit: 500 },
    { enabled: open },
  );
  const uploadMutation = trpc.mediaLibrary.uploadToEL.useMutation({
    onSuccess: () => {
      utils.gallery.fromEL.invalidate();
    },
    onError: (error) => toast.error("Could not upload photo", { description: error.message }),
  });
  const photos = query.data?.media ?? [];

  const filtered = search.trim()
    ? photos.filter((p) =>
        [p.title, p.description, p.altText]
          .filter(Boolean)
          .some((s) => s!.toLowerCase().includes(search.toLowerCase())),
      )
    : photos;

  const uploadWork = work ?? defaultWorkSlug;

  async function handleUpload(file: File) {
    if (!uploadWork) {
      toast.error("Choose a work first", {
        description: "Pick the work this photo belongs to before uploading.",
      });
      return;
    }

    const base64Data = await fileToBase64(file);
    const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Harvest photo";
    const response = await uploadMutation.mutateAsync({
      recipe: {
        work: uploadWork,
        themes: [theme ?? "gather"],
        categories: ["general"],
        title,
      },
      files: [{
        fileName: file.name,
        contentType: file.type || "image/jpeg",
        base64Data,
      }],
    });

    const uploaded = response.uploaded[0];
    if (!uploaded) {
      const failed = response.failed[0]?.error;
      toast.error("Upload did not complete", { description: failed });
      return;
    }

    onPick({
      mediaAssetId: uploaded.id,
      src: uploaded.src,
      altText: title,
      title,
    });
    onOpenChange(false);
    toast.success("Photo uploaded and linked.");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="font-serif text-2xl text-stone-800">
            Pick a photo from the Harvest gallery
          </DialogTitle>
          <DialogDescription>
            Filter by work or theme. Click a photo to use it here.
            Photos come from Empathy Ledger and are cached for 5 minutes.
          </DialogDescription>
          <div className="mt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                event.currentTarget.value = "";
                if (file) void handleUpload(file);
              }}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploadMutation.isPending || !uploadWork}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2"
              title={uploadWork ? "Upload a local image to Empathy Ledger and tag it to this work" : "Choose a work before uploading"}
            >
              {uploadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Upload from computer
            </Button>
          </div>
        </DialogHeader>

        {/* Filters */}
        <div className="px-6 py-4 border-b bg-stone-50 space-y-3">
          <div className="flex flex-wrap gap-2">
            <FilterChip label="Any work" active={!work} onClick={() => setWork(undefined)} />
            {WORKS.map((w) => (
              <FilterChip
                key={w.slug}
                label={w.label}
                active={work === w.slug}
                onClick={() => setWork(w.slug)}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterChip label="Any theme" active={!theme} onClick={() => setTheme(undefined)} />
            {THEMES.map((t) => (
              <FilterChip
                key={t.slug}
                label={t.label}
                active={theme === t.slug}
                onClick={() => setTheme(t.slug)}
              />
            ))}
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Search title, alt text, or description"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {query.isLoading ? (
            <div className="flex items-center justify-center py-20 text-stone-500">
              <Loader2 className="h-6 w-6 animate-spin mr-3" />
              Loading photos…
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-stone-500">
              <p className="mb-2">
                No photos match these filters{work ? ` for "${work}"` : ""}.
              </p>
              <p className="text-sm">
                Upload to The Harvest Gallery in EL admin (
                <code className="bg-stone-100 px-1.5 py-0.5 rounded">
                  /admin/galleries
                </code>
                ) and they'll appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => {
                    onPick({
                      mediaAssetId: photo.id,
                      src: photo.src,
                      altText: photo.altText,
                      title: photo.title,
                    });
                    onOpenChange(false);
                  }}
                  className="group relative aspect-square overflow-hidden rounded-md bg-stone-100 ring-2 ring-transparent hover:ring-amber-500 transition-all"
                  type="button"
                >
                  <img
                    src={photo.src}
                    alt={photo.altText ?? photo.title ?? ""}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-amber-500 text-stone-900 rounded-full p-2">
                      <Check className="h-5 w-5" />
                    </div>
                  </div>
                  {(photo.title || photo.projectId) && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[10px] leading-tight truncate">
                        {photo.title}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-stone-50 flex items-center justify-between text-sm text-stone-600">
          <span>
            {filtered.length} photo{filtered.length === 1 ? "" : "s"}
            {work ? ` · work: ${work}` : ""}
            {theme ? ` · theme: ${theme}` : ""}
          </span>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result ?? "");
      resolve(value.includes(",") ? value.split(",")[1] : value);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
        active
          ? "bg-stone-800 text-amber-300 border-stone-800"
          : "bg-white text-stone-700 border-stone-300 hover:bg-stone-100"
      }`}
    >
      {label}
    </button>
  );
}
