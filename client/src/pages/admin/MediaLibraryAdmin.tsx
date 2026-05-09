import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  CheckSquare,
  ExternalLink,
  FileUp,
  Film,
  FileVideo,
  Image as ImageIcon,
  Images,
  Link2,
  Loader2,
  LogIn,
  MapPinned,
  Plus,
  RefreshCw,
  Replace,
  Search,
  ShieldAlert,
  Square,
  Tags,
  Upload,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HarvestPhotoPicker, type PickedPhoto } from "@/components/HarvestPhotoPicker";
import { trpc } from "@/lib/trpc";
import { optimize } from "@/lib/imageOptimize";
import { elLinks } from "@/lib/empathyLedger";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

type AdminMediaAsset = {
  id: string;
  src: string;
  title: string | null;
  description: string | null;
  altText: string | null;
  category: string | null;
  tags: string[];
  themes: string[];
  special?: string[];
  works?: string[];
};

type HarvestRecipePayload = {
  work: string;
  themes: string[];
  categories: string[];
  title: string;
  extraTags?: Array<{ slug: string; category: string }>;
};

type TagMode = "merge" | "replace";

type ImageOverrideRow = {
  id: number;
  page: string;
  slot: string;
  mediaAssetId: string;
  src: string;
  altText: string | null;
  title: string | null;
};

type AssetPageUse = {
  label: string;
  href: string;
  source: "slot" | "work" | "tag";
};

type LocalVideoAsset = {
  id: string;
  fileName: string;
  relativePath: string;
  contentType: string;
  size: number;
  kind: "video" | "gif";
  elStatus?: "local-only" | "synced" | "unknown";
  elMatches?: Array<{
    id: string;
    title: string | null;
    src: string | null;
    works: string[];
    themes: string[];
    categories: string[];
    tags: string[];
    createdAt: string | null;
  }>;
};

type MediaSet = {
  key: string;
  title: string;
  description: string;
  work: string;
  themes: string[];
  category: string;
  categoryTags: string[];
  publicUse: string;
};

type PageSlot = {
  label: string;
  page: string;
  slot: string;
  defaultWorkSlug: string;
  publicUrl: string;
  note: string;
};

const mediaSets: MediaSet[] = [
  {
    key: "garden",
    title: "Garden now",
    description: "Seedlings, beds, soil, shade and visible Garden progress.",
    work: "the-garden",
    themes: ["grow", "gather"],
    category: "during",
    categoryTags: ["during"],
    publicUse: "/new-look-test#work, /works/the-garden, Garden updates",
  },
  {
    key: "pavilion",
    title: "Milk crate pavilion",
    description: "Crates, scaffold, people making, details and the first roof.",
    work: "milk-crate-pavilion",
    themes: ["make", "gather"],
    category: "during or milestone",
    categoryTags: ["during", "milestone"],
    publicUse: "/new-look-test#work, /works/milk-crate-pavilion, event updates",
  },
  {
    key: "timber",
    title: "Timber paths",
    description: "St Mary's timber, Barry's shed, tools, source tracing and walkway pieces.",
    work: "the-cedar",
    themes: ["make", "gather"],
    category: "during",
    categoryTags: ["during"],
    publicUse: "/new-look-test#work, /works/the-cedar, Witta timber stories",
  },
  {
    key: "shop",
    title: "Shop and table",
    description: "Produce shelf tests, co-op shop ideas, local food, growers and makers.",
    work: "the-shop",
    themes: ["eat", "gather"],
    category: "general or during",
    categoryTags: ["general-harvest", "during"],
    publicUse: "/new-look-test#work, /works/the-shop, shop updates",
  },
];

const publicSlots: PageSlot[] = [
  {
    label: "Garden card",
    page: "new-look-test",
    slot: "garden-area-card",
    defaultWorkSlug: "the-garden",
    publicUrl: "/new-look-test#work",
    note: "Main Garden-first card on the test page.",
  },
  {
    label: "Milk crate pavilion card",
    page: "new-look-test",
    slot: "milk-crate-pavilion-card",
    defaultWorkSlug: "milk-crate-pavilion",
    publicUrl: "/new-look-test#work",
    note: "Card for the giant milk crate pavilion.",
  },
  {
    label: "Timber walkways card",
    page: "new-look-test",
    slot: "timber-walkways-card",
    defaultWorkSlug: "the-cedar",
    publicUrl: "/new-look-test#work",
    note: "Card for St Mary's timber and paths.",
  },
  {
    label: "Shop table card",
    page: "new-look-test",
    slot: "co-op-shop-card",
    defaultWorkSlug: "the-shop",
    publicUrl: "/new-look-test#work",
    note: "Card for the produce shelf / co-op type shop.",
  },
  {
    label: "Garden work hero",
    page: "works",
    slot: "the-garden-hero",
    defaultWorkSlug: "the-garden",
    publicUrl: "/works/the-garden",
    note: "Hero image for The Garden work page.",
  },
  {
    label: "Pavilion work hero",
    page: "works",
    slot: "milk-crate-pavilion-hero",
    defaultWorkSlug: "milk-crate-pavilion",
    publicUrl: "/works/milk-crate-pavilion",
    note: "Hero image for the pavilion work page.",
  },
  {
    label: "Timber work hero",
    page: "works",
    slot: "the-cedar-hero",
    defaultWorkSlug: "the-cedar",
    publicUrl: "/works/the-cedar",
    note: "Hero image for the timber work page.",
  },
  {
    label: "Shop work hero",
    page: "works",
    slot: "the-shop-hero",
    defaultWorkSlug: "the-shop",
    publicUrl: "/works/the-shop",
    note: "Hero image for the shop work page.",
  },
];

const videoSources = [
  "/images/compendium/hero-aerial.mp4",
  "/images/compendium/oyster-lease.mp4",
  "/images/social-tiles/milk-crates.gif",
  "18 WhatsApp source MP4s in docs/communications/debriefs/_whatsapp-exports",
];

const workFilters = [
  { value: "all", label: "All works" },
  { value: "unpinned", label: "Needs work tag" },
  ...mediaSets.map((set) => ({ value: set.work, label: set.title })),
];

const themeFilters = [
  { value: "all", label: "All themes" },
  { value: "grow", label: "Grow" },
  { value: "make", label: "Make" },
  { value: "gather", label: "Gather" },
  { value: "eat", label: "Eat" },
];

const categoryFilters = [
  { value: "all", label: "All categories" },
  { value: "during", label: "During" },
  { value: "milestone", label: "Milestone" },
  { value: "general-harvest", label: "General" },
  { value: "general", label: "General fallback" },
  { value: "before", label: "Before" },
  { value: "after", label: "After" },
];

const extraTagCategories = [
  { value: "harvest-page", label: "Page" },
  { value: "harvest-special", label: "Special" },
  { value: "harvest-custom", label: "Custom" },
];

const workPageUses: Record<string, AssetPageUse[]> = {
  "the-garden": [
    { label: "Garden work page", href: "/works/the-garden", source: "work" },
    { label: "New-look work grid", href: "/new-look-test#work", source: "work" },
    { label: "Garden updates", href: "/new-look-test#updates", source: "work" },
  ],
  "milk-crate-pavilion": [
    { label: "Pavilion work page", href: "/works/milk-crate-pavilion", source: "work" },
    { label: "New-look work grid", href: "/new-look-test#work", source: "work" },
    { label: "Event updates", href: "/new-look-test#updates", source: "work" },
  ],
  "the-cedar": [
    { label: "Timber work page", href: "/works/the-cedar", source: "work" },
    { label: "New-look work grid", href: "/new-look-test#work", source: "work" },
  ],
  "the-shop": [
    { label: "Shop work page", href: "/works/the-shop", source: "work" },
    { label: "New-look work grid", href: "/new-look-test#work", source: "work" },
  ],
};

const pageTagUses: Record<string, AssetPageUse> = {
  home: { label: "Home gallery", href: "/", source: "tag" },
  stories: { label: "Stories", href: "/stories", source: "tag" },
  updates: { label: "Updates", href: "/new-look-test#updates", source: "tag" },
  works: { label: "Works", href: "/new-look-test#work", source: "tag" },
  garden: { label: "Garden", href: "/works/the-garden", source: "tag" },
};

function isVideoAsset(src: string): boolean {
  return /\.(mp4|mov|m4v|webm|gif)(\?.*)?$/i.test(src);
}

function countByWork(media: AdminMediaAsset[], work: string): number {
  return media.filter((item) => item.works?.includes(work)).length;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.onload = () => {
      const value = String(reader.result ?? "");
      resolve(value.includes(",") ? value.split(",")[1] : value);
    };
    reader.readAsDataURL(file);
  });
}

function recipePayload(set: MediaSet, extraTags: Array<{ slug: string; category: string }> = []): HarvestRecipePayload {
  return {
    work: set.work,
    themes: set.themes,
    categories: set.categoryTags,
    title: set.title,
    ...(extraTags.length > 0 ? { extraTags } : {}),
  };
}

function normaliseExtraTag(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pageUseKey(use: AssetPageUse) {
  return `${use.label}:${use.href}:${use.source}`;
}

function pageUsesForAsset(item: AdminMediaAsset, overrides: ImageOverrideRow[]): AssetPageUse[] {
  const uses: AssetPageUse[] = [];

  item.works?.forEach((work) => {
    uses.push(...(workPageUses[work] ?? []));
  });

  item.tags?.forEach((tag) => {
    const use = pageTagUses[tag];
    if (use) uses.push(use);
  });

  overrides
    .filter((override) => override.mediaAssetId === item.id)
    .forEach((override) => {
      const slot = publicSlots.find((candidate) => candidate.page === override.page && candidate.slot === override.slot);
      uses.unshift({
        label: slot?.label ?? `${override.page} / ${override.slot}`,
        href: slot?.publicUrl ?? `/${override.page}`,
        source: "slot",
      });
    });

  const seen = new Set<string>();
  return uses.filter((use) => {
    const key = pageUseKey(use);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function localMotionPreviewUrl(file: LocalVideoAsset) {
  return `/api/admin/media-library/local-motion?path=${encodeURIComponent(file.relativePath)}`;
}

function LazyVideo({
  src,
  className,
  controls,
  muted = true,
  playsInline = true,
}: {
  src: string;
  className?: string;
  controls?: boolean;
  muted?: boolean;
  playsInline?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <video
      ref={ref}
      src={inView ? src : undefined}
      className={className}
      controls={controls}
      muted={muted}
      playsInline={playsInline}
      preload={inView ? "metadata" : "none"}
    />
  );
}

function isLocalVideoAlignedToRecipe(file: LocalVideoAsset, recipe: MediaSet) {
  return (file.elMatches ?? []).some((match) => (
    match.works.includes(recipe.work) &&
    recipe.themes.every((theme) => match.themes.includes(theme)) &&
    recipe.categoryTags.some((category) => match.categories.includes(category))
  ));
}

function localVideoSyncCopy(file: LocalVideoAsset, recipe: MediaSet) {
  if (file.elStatus === "unknown") {
    return {
      label: "EL status unknown",
      detail: "Could not check Empathy Ledger right now.",
      tone: "warn" as const,
    };
  }

  if (!(file.elMatches ?? []).length) {
    return {
      label: "Local only",
      detail: "Not synced to Empathy Ledger yet.",
      tone: "warn" as const,
    };
  }

  if (isLocalVideoAlignedToRecipe(file, recipe)) {
    return {
      label: `Aligned to ${recipe.title}`,
      detail: "Synced in EL with this work/theme/category spine.",
      tone: "work" as const,
    };
  }

  return {
    label: "Synced, needs tags",
    detail: `In EL, but not aligned to ${recipe.title}.`,
    tone: "neutral" as const,
  };
}

export default function MediaLibraryAdmin() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const firstPage = trpc.gallery.fromEL.useQuery(
    { limit: 100, page: 1 },
    { enabled: isAuthenticated && user?.role === "admin", staleTime: 5 * 60 * 1000 },
  );
  const secondPage = trpc.gallery.fromEL.useQuery(
    { limit: 100, page: 2 },
    {
      enabled: Boolean(isAuthenticated && user?.role === "admin" && firstPage.data?.pagination?.hasMore),
      staleTime: 5 * 60 * 1000,
    },
  );
  const overridesQuery = trpc.imageOverrides.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
    staleTime: 60 * 1000,
  });

  const media = useMemo(() => {
    const first = (firstPage.data?.media ?? []) as AdminMediaAsset[];
    const second = (secondPage.data?.media ?? []) as AdminMediaAsset[];
    return [...first, ...second];
  }, [firstPage.data?.media, secondPage.data?.media]);

  const [mediaSearch, setMediaSearch] = useState("");
  const [workFilter, setWorkFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState<"all" | "image" | "video">("all");
  const [recipeKey, setRecipeKey] = useState(mediaSets[0].key);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);

  const totalReported = firstPage.data?.pagination?.total ?? media.length;
  const unpinned = media.filter((item) => !item.works || item.works.length === 0);
  const videoCount = media.filter((item) => isVideoAsset(item.src)).length;
  const selectedRecipe = mediaSets.find((set) => set.key === recipeKey) ?? mediaSets[0];
  const selectedMedia = media.filter((item) => selectedMediaIds.includes(item.id));
  const pageUsesByAsset = useMemo(() => {
    const overrides = (overridesQuery.data ?? []) as ImageOverrideRow[];
    return new Map(media.map((item) => [item.id, pageUsesForAsset(item, overrides)]));
  }, [media, overridesQuery.data]);

  const filteredMedia = useMemo(() => {
    const needle = mediaSearch.trim().toLowerCase();
    return media.filter((item) => {
      const isVideo = isVideoAsset(item.src);
      if (kindFilter === "image" && isVideo) return false;
      if (kindFilter === "video" && !isVideo) return false;
      if (workFilter === "unpinned" && item.works?.length) return false;
      if (workFilter !== "all" && workFilter !== "unpinned" && !item.works?.includes(workFilter)) return false;
      if (themeFilter !== "all" && !item.themes?.includes(themeFilter)) return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (!needle) return true;

      const haystack = [
        item.id,
        item.title,
        item.description,
        item.altText,
        item.category,
        ...(item.tags ?? []),
        ...(item.themes ?? []),
        ...(item.works ?? []),
        ...(item.special ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [categoryFilter, kindFilter, media, mediaSearch, themeFilter, workFilter]);

  const toggleSelectedMedia = (id: string) => {
    setSelectedMediaIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const selectFilteredMedia = () => {
    const next = filteredMedia.map((item) => item.id);
    setSelectedMediaIds(next);
  };

  const clearSelectedMedia = () => setSelectedMediaIds([]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <Loader2 className="h-8 w-8 animate-spin text-stone-700" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAccessCard mode="login" />;
  }

  if (user?.role !== "admin") {
    return <AdminAccessCard mode="denied" />;
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-stone-900">
      <header className="border-b border-stone-300 bg-[#1C1917] text-[#F5F0E8]">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
          <a href="/admin" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Admin dashboard
          </a>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#C4922A]">
                backend media library
              </p>
              <h1 className="mt-3 text-4xl font-black leading-none md:text-6xl">
                Organise photos, video and public slots.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/72">
                Empathy Ledger stays the source of truth. Use this page to see what is
                tagged, what is missing, and which public Harvest page slots are using
                which EL assets.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <AdminLink href={elLinks.photoManager()} label="Photo manager" />
              <AdminLink href={elLinks.bulkEdit()} label="Bulk tag" />
              <AdminLink href={elLinks.galleries()} label="EL galleries" />
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        <div className="grid gap-4 md:grid-cols-5">
          <StatCard label="EL assets" value={String(totalReported)} detail="visible through Harvest API" />
          <StatCard label="Garden" value={String(countByWork(media, "the-garden"))} detail="tagged the-garden" />
          <StatCard label="Pavilion" value={String(countByWork(media, "milk-crate-pavilion"))} detail="tagged milk-crate-pavilion" />
          <StatCard label="Unpinned" value={String(unpinned.length)} detail="needs work tag" tone={unpinned.length ? "warn" : "ok"} />
          <StatCard label="EL video" value={String(videoCount)} detail="motion assets returned" tone={videoCount ? "ok" : "warn"} />
        </div>

        <AddMediaPanel
          selectedRecipe={selectedRecipe}
          recipeKey={recipeKey}
          onRecipeChange={setRecipeKey}
        />

        <LocalVideoImportPanel
          selectedRecipe={selectedRecipe}
          recipeKey={recipeKey}
          onRecipeChange={setRecipeKey}
        />

        <StorytellersPanel />

        <AllMediaWorkbench
          media={media}
          filteredMedia={filteredMedia}
          selectedMedia={selectedMedia}
          selectedMediaIds={selectedMediaIds}
          selectedRecipe={selectedRecipe}
          recipeKey={recipeKey}
          mediaSearch={mediaSearch}
          workFilter={workFilter}
          themeFilter={themeFilter}
          categoryFilter={categoryFilter}
          kindFilter={kindFilter}
          onRecipeChange={setRecipeKey}
          onSearchChange={setMediaSearch}
          onWorkFilterChange={setWorkFilter}
          onThemeFilterChange={setThemeFilter}
          onCategoryFilterChange={setCategoryFilter}
          onKindFilterChange={setKindFilter}
          onToggleSelected={toggleSelectedMedia}
          onSelectFiltered={selectFilteredMedia}
          onClearSelected={clearSelectedMedia}
          pageUsesByAsset={pageUsesByAsset}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="space-y-5">
            <SectionIntro
              eyebrow="tag sets"
              title="Review the working media sets."
              body="These are the tag recipes that decide where assets appear publicly. If a set reads 0, the photos may exist but need the right work/theme/category tags in Empathy Ledger."
            />
            <div className="grid gap-5 xl:grid-cols-2">
              {mediaSets.map((set) => (
                <MediaSetCard key={set.work} set={set} media={media} />
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <ProcessCard />
            <VideoPassCard />
          </aside>
        </div>

        <section className="mt-10">
          <SectionIntro
            eyebrow="public placement"
            title="Send EL assets into public page slots."
            body="Pick a photo from Empathy Ledger for a specific public slot. The override stays linked to the EL media asset id, so we know what is being used where."
          />
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {publicSlots.map((slot) => (
              <PublicSlotCard key={`${slot.page}-${slot.slot}`} slot={slot} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <SectionIntro
            eyebrow="needs attention"
            title="Assets visible in EL but not pinned to a work."
            body="These need a work tag before they can reliably appear in Garden, Works, Stories or Updates."
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {firstPage.isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="aspect-[4/3] animate-pulse bg-stone-200" />
              ))
            ) : unpinned.length === 0 ? (
              <div className="border border-stone-300 bg-white p-5 text-sm text-stone-600">
                Everything returned by the Harvest API has a work tag.
              </div>
            ) : (
              unpinned.slice(0, 12).map((item) => <MediaThumb key={item.id} item={item} />)
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function AdminAccessCard({ mode }: { mode: "login" | "denied" }) {
  const denied = mode === "denied";
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
            {denied ? <ShieldAlert className="h-7 w-7 text-red-600" /> : <LogIn className="h-7 w-7 text-stone-700" />}
          </div>
          <CardTitle>{denied ? "Access denied" : "Admin access required"}</CardTitle>
          <CardDescription>
            {denied
              ? "You do not have permission to manage the Harvest media library."
              : "Sign in to organise Harvest media and public page slots."}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button onClick={() => (window.location.href = denied ? "/" : getLoginUrl())}>
            {denied ? "Return home" : "Sign in"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function AdminLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-10 items-center gap-2 border border-white/18 px-4 text-sm font-semibold text-[#F5F0E8] transition hover:bg-white/10"
    >
      {label}
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}

function StatCard({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "neutral" | "ok" | "warn";
}) {
  const toneClass =
    tone === "ok" ? "border-[#4A6741]" : tone === "warn" ? "border-[#C4922A]" : "border-stone-300";
  return (
    <div className={`border bg-[#FFFDF7] p-4 ${toneClass}`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
      <p className="mt-1 text-xs leading-relaxed text-stone-600">{detail}</p>
    </div>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black leading-tight">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-stone-700 md:text-base">{body}</p>
    </div>
  );
}

function AddMediaPanel({
  selectedRecipe,
  recipeKey,
  onRecipeChange,
}: {
  selectedRecipe: MediaSet;
  recipeKey: string;
  onRecipeChange: (key: string) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [lastUploaded, setLastUploaded] = useState<Array<{ id: string; fileName: string }>>([]);
  const utils = trpc.useUtils();
  const uploadMutation = trpc.mediaLibrary.uploadToEL.useMutation({
    onSuccess: async (result) => {
      await utils.gallery.fromEL.invalidate();
      setLastUploaded(result.uploaded.map((item) => ({ id: item.id, fileName: item.fileName })));
      if (result.uploaded.length > 0) {
        setFiles([]);
        toast.success(`${result.uploaded.length} file${result.uploaded.length === 1 ? "" : "s"} uploaded and tagged in EL.`);
      }
      if (result.failed.length > 0) {
        toast.error(`${result.failed.length} file${result.failed.length === 1 ? "" : "s"} could not upload.`, {
          description: result.failed.slice(0, 2).map((item) => `${item.fileName}: ${item.error}`).join("\n"),
        });
      }
    },
    onError: (error) => toast.error("Upload failed", { description: error.message }),
  });
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Choose at least one file first.");
      return;
    }

    const maxFileBytes = 35 * 1024 * 1024;
    const oversized = files.find((file) => file.size > maxFileBytes);
    if (oversized) {
      toast.error(`${oversized.name} is too large for this quick uploader.`, {
        description: "Use smaller selects here for now, or upload large originals in EL.",
      });
      return;
    }

    const uploadFiles = await Promise.all(
      files.map(async (file) => ({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        base64Data: await readFileAsBase64(file),
      })),
    );

    await uploadMutation.mutateAsync({
      recipe: recipePayload(selectedRecipe),
      files: uploadFiles,
    });
  };

  return (
    <section className="mt-8 border border-stone-300 bg-[#FFFDF7]">
      <div className="grid gap-5 border-b border-stone-200 p-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]">add media</p>
          <h2 className="mt-2 text-3xl font-black leading-tight">Upload and tag photos and video.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-700 md:text-base">
            Choose the files, pick the tags, then this page creates the EL assets and applies the work/theme/category tags.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <a href={elLinks.galleries()} target="_blank" rel="noopener noreferrer">
              <Upload className="mr-2 h-4 w-4" />
              Open EL
            </a>
          </Button>
          <Button onClick={handleUpload} disabled={files.length === 0 || uploadMutation.isPending}>
            {uploadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {uploadMutation.isPending ? "Uploading..." : "Upload + tag"}
          </Button>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[0.85fr_1.15fr]">
        <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center border border-dashed border-stone-300 bg-stone-50 p-6 text-center transition hover:bg-white">
          <FileUp className="h-9 w-9 text-[#8B4A2A]" />
          <span className="mt-3 text-lg font-black">Choose photos or video</span>
          <span className="mt-1 text-sm text-stone-600">Images, GIFs and motion files for the Garden, works and stories.</span>
          <input
            className="sr-only"
            type="file"
            accept="image/*,video/*,.gif,.mp4,.mov,.m4v,.webm"
            multiple
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          />
        </label>

        <div className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-[220px_1fr]">
            <label className="text-sm font-semibold text-stone-700" htmlFor="media-recipe">
              Tags to apply
            </label>
            <select
              id="media-recipe"
              value={recipeKey}
              onChange={(event) => onRecipeChange(event.target.value)}
              className="min-h-10 border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-900 outline-none focus:border-[#8B4A2A]"
            >
              {mediaSets.map((set) => (
                <option key={set.key} value={set.key}>
                  {set.title}
                </option>
              ))}
            </select>
          </div>

          <div className="border border-stone-200 bg-white p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">EL tag spine</p>
            <p className="mt-2 text-sm leading-relaxed text-stone-800">
              <strong>{selectedRecipe.work}</strong> + {selectedRecipe.themes.join("/")} + {selectedRecipe.category}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <TagChip label={`work:${selectedRecipe.work}`} />
              {selectedRecipe.themes.map((theme) => <TagChip key={theme} label={`theme:${theme}`} />)}
              {selectedRecipe.categoryTags.map((category) => <TagChip key={category} label={`category:${category}`} />)}
            </div>
          </div>

          {files.length > 0 ? (
            <div className="border border-stone-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-black">
                  {files.length} file{files.length === 1 ? "" : "s"} staged · {formatFileSize(totalSize)}
                </p>
                <Button size="sm" variant="outline" onClick={() => setFiles([])}>
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
              <ul className="mt-3 grid gap-2 text-xs text-stone-600 sm:grid-cols-2">
                {files.slice(0, 8).map((file) => (
                  <li key={`${file.name}-${file.size}`} className="border-t border-stone-200 pt-2">
                    <span className="font-semibold text-stone-800">{file.name}</span>
                    <br />
                    {file.type || "unknown type"} · {formatFileSize(file.size)}
                  </li>
                ))}
              </ul>
              {files.length > 8 && (
                <p className="mt-3 text-xs text-stone-500">+ {files.length - 8} more files</p>
              )}
            </div>
          ) : (
            <div className="border border-stone-200 bg-white p-4 text-sm leading-relaxed text-stone-600">
              No files staged yet. Use this for the next Garden batch, timber path evidence, shop tests and video selects.
            </div>
          )}

          {lastUploaded.length > 0 && (
            <div className="border border-[#4A6741]/35 bg-[#4A6741]/10 p-4 text-sm leading-relaxed text-[#2F472B]">
              <p className="font-black">Last upload created {lastUploaded.length} EL asset{lastUploaded.length === 1 ? "" : "s"}.</p>
              <ul className="mt-2 grid gap-1 text-xs">
                {lastUploaded.slice(0, 6).map((item) => (
                  <li key={item.id}>
                    <span className="font-semibold">{item.fileName}</span> · <code>{item.id}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function LocalVideoImportPanel({
  selectedRecipe,
  recipeKey,
  onRecipeChange,
}: {
  selectedRecipe: MediaSet;
  recipeKey: string;
  onRecipeChange: (key: string) => void;
}) {
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const localVideosQuery = trpc.mediaLibrary.localVideos.useQuery(undefined, { staleTime: 60 * 1000 });
  const utils = trpc.useUtils();
  const importMutation = trpc.mediaLibrary.importLocalVideos.useMutation({
    onSuccess: async (result) => {
      await Promise.all([
        utils.gallery.fromEL.invalidate(),
        utils.mediaLibrary.localVideos.invalidate(),
      ]);
      setSelectedPaths([]);
      if (result.uploaded.length > 0) {
        toast.success(`${result.uploaded.length} motion file${result.uploaded.length === 1 ? "" : "s"} imported to EL.`);
      }
      if (result.failed.length > 0) {
        toast.error(`${result.failed.length} motion file${result.failed.length === 1 ? "" : "s"} could not import.`, {
          description: result.failed.slice(0, 2).map((item) => `${item.fileName}: ${item.error}`).join("\n"),
        });
      }
    },
    onError: (error) => toast.error("Video import failed", { description: error.message }),
  });

  const files = (localVideosQuery.data ?? []) as LocalVideoAsset[];
  const selectedFiles = files.filter((file) => selectedPaths.includes(file.relativePath));
  const selectedSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
  const syncedCount = files.filter((file) => (file.elMatches ?? []).length > 0).length;
  const localOnlyCount = files.length - syncedCount;
  const alignedCount = files.filter((file) => isLocalVideoAlignedToRecipe(file, selectedRecipe)).length;

  const togglePath = (path: string) => {
    setSelectedPaths((current) => (
      current.includes(path) ? current.filter((item) => item !== path) : [...current, path]
    ));
  };

  const selectLocalOnly = () => setSelectedPaths(files.filter((file) => !(file.elMatches ?? []).length).map((file) => file.relativePath));
  const clear = () => setSelectedPaths([]);

  const importSelected = async () => {
    if (selectedPaths.length === 0) {
      toast.error("Select at least one local video first.");
      return;
    }

    await importMutation.mutateAsync({
      paths: selectedPaths,
      recipe: recipePayload(selectedRecipe),
    });
  };

  return (
    <section className="mt-8 border border-stone-300 bg-[#FFFDF7]">
      <div className="grid gap-5 border-b border-stone-200 p-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]">codebase video</p>
          <h2 className="mt-2 text-3xl font-black leading-tight">Import existing motion files into EL.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-700 md:text-base">
            These are the MP4 and GIF files already in the site repo, excluding archived WhatsApp duplicates. Pick the right tag set, import selected files into the Harvest EL gallery, then run another batch for a different work area.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => localVideosQuery.refetch()} disabled={localVideosQuery.isFetching}>
            <RefreshCw className={`mr-2 h-4 w-4 ${localVideosQuery.isFetching ? "animate-spin" : ""}`} />
            Rescan
          </Button>
          <Button onClick={importSelected} disabled={selectedPaths.length === 0 || importMutation.isPending}>
            {importMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileVideo className="mr-2 h-4 w-4" />}
            {importMutation.isPending ? "Importing..." : "Import selected"}
          </Button>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <FilterSelect
            label="Tags to apply"
            value={recipeKey}
            options={mediaSets.map((set) => ({ value: set.key, label: set.title }))}
            onChange={onRecipeChange}
          />
          <div className="border border-stone-200 bg-white p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">selected</p>
            <p className="mt-2 text-2xl font-black">{selectedPaths.length} of {files.length}</p>
            <p className="mt-1 text-xs text-stone-600">{formatFileSize(selectedSize)} selected</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="border border-stone-200 bg-stone-50 p-2">
                <p className="text-lg font-black">{localOnlyCount}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-stone-500">local</p>
              </div>
              <div className="border border-[#4A6741]/25 bg-[#4A6741]/8 p-2">
                <p className="text-lg font-black">{syncedCount}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-stone-500">in EL</p>
              </div>
              <div className="border border-[#C4922A]/30 bg-[#C4922A]/8 p-2">
                <p className="text-lg font-black">{alignedCount}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-stone-500">aligned</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-stone-600">
              Importing adds these as EL assets, links them to the Harvest gallery and applies <strong>{selectedRecipe.work}</strong> + {selectedRecipe.themes.join("/")} + {selectedRecipe.category}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={selectLocalOnly} disabled={localOnlyCount === 0}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Select local only
            </Button>
            <Button size="sm" variant="outline" onClick={clear} disabled={selectedPaths.length === 0}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        <div className="grid max-h-[520px] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
          {localVideosQuery.isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-44 animate-pulse border border-stone-200 bg-stone-100" />
            ))
          ) : files.length === 0 ? (
            <div className="border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-600">
              No local motion files found in the configured Harvest folders.
            </div>
          ) : (
            files.map((file) => {
              const selected = selectedPaths.includes(file.relativePath);
              const sync = localVideoSyncCopy(file, selectedRecipe);
              const previewSrc = localMotionPreviewUrl(file);
              const firstMatch = file.elMatches?.[0];
              return (
                <article
                  key={file.relativePath}
                  className={`grid gap-3 border p-3 transition ${
                    selected ? "border-[#C4922A] bg-[#C4922A]/8 ring-2 ring-[#C4922A]/20" : "border-stone-200 bg-white"
                  }`}
                >
                  <div className="grid gap-3 sm:grid-cols-[170px_1fr]">
                    <div className="overflow-hidden border border-stone-200 bg-stone-950">
                      {file.kind === "gif" ? (
                        <img
                          src={previewSrc}
                          alt={`${file.fileName} preview`}
                          className="aspect-video h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <LazyVideo
                          src={previewSrc}
                          className="aspect-video h-full w-full object-cover"
                          controls
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="break-words text-base font-black leading-tight text-stone-900">{file.fileName}</h3>
                          <p className="mt-1 break-all font-mono text-[10px] leading-relaxed text-stone-500">{file.relativePath}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => togglePath(file.relativePath)}
                          className={`inline-flex min-h-9 items-center gap-2 border px-3 text-xs font-semibold transition ${
                            selected
                              ? "border-[#C4922A] bg-[#C4922A]/18 text-stone-950"
                              : "border-stone-300 bg-white text-stone-800 hover:border-stone-500"
                          }`}
                        >
                          {selected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                          {selected ? "Selected" : "Select"}
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <TagChip label={file.kind === "gif" ? "GIF" : "MP4"} tone="work" />
                        <TagChip label={formatFileSize(file.size)} />
                        <TagChip label={sync.label} tone={sync.tone} />
                      </div>

                      <div className="mt-3 border-t border-stone-100 pt-3 text-xs leading-relaxed text-stone-600">
                        <p className="flex items-center gap-1.5 font-semibold text-stone-800">
                          {sync.tone === "work" ? <CheckCircle2 className="h-4 w-4 text-[#4A6741]" /> : <Video className="h-4 w-4 text-[#8B4A2A]" />}
                          {sync.detail}
                        </p>
                        {firstMatch ? (
                          <div className="mt-2 grid gap-1">
                            <p className="font-mono text-[10px] text-stone-500">EL asset: {firstMatch.id}</p>
                            <p>
                              <strong>EL tags:</strong>{" "}
                              {[...firstMatch.works, ...firstMatch.themes, ...firstMatch.categories].slice(0, 8).join(", ") || "no Harvest spine tags yet"}
                            </p>
                          </div>
                        ) : (
                          <p className="mt-2">Import it once, then this card will show the EL asset id and tag alignment.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

function StorytellersPanel() {
  const statsQuery = trpc.mediaLibrary.harvestProjectStats.useQuery(undefined, { staleTime: 60_000 });
  const storytellersQuery = trpc.mediaLibrary.harvestStorytellers.useQuery(undefined, { staleTime: 60_000 });
  const orphansQuery = trpc.mediaLibrary.orphanedHarvestArticles.useQuery(undefined, { staleTime: 60_000 });

  // Phase 2 write state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [addRole, setAddRole] = useState<"participant" | "contributor" | "subject" | "owner">("participant");
  const [editingBioId, setEditingBioId] = useState<string | null>(null);
  const [bioDraft, setBioDraft] = useState("");
  const [creatingStoryFor, setCreatingStoryFor] = useState<string | null>(null);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContent, setStoryContent] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  const searchResultsQuery = trpc.mediaLibrary.searchStorytellers.useQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length >= 2, staleTime: 30_000 },
  );

  const refetchAll = () => {
    storytellersQuery.refetch();
    statsQuery.refetch();
    searchResultsQuery.refetch();
  };

  const addStoryteller = trpc.mediaLibrary.addStorytellerToHarvest.useMutation({
    onSuccess: (r, vars) => {
      toast.success(r.alreadyMember ? "Already a member." : `Added storyteller as ${vars.role}.`);
      setSearchQuery("");
      refetchAll();
    },
    onError: (e) => toast.error(`Add failed: ${e.message}`),
  });
  const updateBio = trpc.mediaLibrary.updateStorytellerBio.useMutation({
    onSuccess: () => {
      toast.success("Bio updated.");
      setEditingBioId(null);
      setBioDraft("");
      storytellersQuery.refetch();
    },
    onError: (e) => toast.error(`Bio update failed: ${e.message}`),
  });
  const createStory = trpc.mediaLibrary.createHarvestStory.useMutation({
    onSuccess: (r) => {
      toast.success(`Story created (id ${r.id.slice(0, 8)}…).`);
      setCreatingStoryFor(null);
      setStoryTitle("");
      setStoryContent("");
      refetchAll();
    },
    onError: (e) => toast.error(`Story create failed: ${e.message}`),
  });

  const tagAsHarvest = trpc.mediaLibrary.tagArticleAsHarvest.useMutation({
    onSuccess: (result) => {
      if (result.updated) {
        toast.success(
          result.preservedInRelated
            ? `Tagged as Harvest. Previous "${result.preservedInRelated}" preserved in related_projects.`
            : "Tagged as Harvest.",
        );
      } else {
        toast.message("Already tagged as Harvest — no change.");
      }
      orphansQuery.refetch();
      storytellersQuery.refetch();
    },
    onError: (err) => toast.error(`Tag failed: ${err.message}`),
  });

  const claimForStoryteller = trpc.mediaLibrary.claimArticleForStoryteller.useMutation({
    onSuccess: (result) => {
      toast.success(result.updated ? "Article claimed by storyteller." : "Already claimed.");
      orphansQuery.refetch();
      storytellersQuery.refetch();
    },
    onError: (err) => toast.error(`Claim failed: ${err.message}`),
  });

  const stats = statsQuery.data;
  const storytellers = storytellersQuery.data ?? [];
  const orphans = orphansQuery.data ?? [];
  const isLoading = storytellersQuery.isLoading || orphansQuery.isLoading;

  return (
    <section className="mt-8 border border-stone-300 bg-[#FFFDF7]">
      <div className="border-b border-stone-200 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8B4A2A]">the harvest · empathy ledger</p>
        <h2 className="mt-2 text-3xl font-black leading-tight">People, stories, transcripts, photos.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-700 md:text-base">
          This mirrors the EL admin's "The Harvest" project view. Storytellers come from the <code className="rounded bg-stone-200 px-1 font-mono text-[11px]">project_storytellers</code> join — anyone added to the project in EL admin shows up here automatically.
          <a href="https://empathyledger.com/admin/projects/the-harvest" target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center gap-1 text-[#8B4A2A] underline">Open project in EL <ExternalLink className="h-3 w-3" /></a>
        </p>
        {stats && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:grid-cols-6">
            <div className="border border-stone-200 bg-white p-2"><p className="font-mono text-[10px] uppercase text-stone-500">people</p><p className="text-lg font-black text-stone-900">{stats.storytellerCount}</p></div>
            <div className="border border-stone-200 bg-white p-2"><p className="font-mono text-[10px] uppercase text-stone-500">stories</p><p className="text-lg font-black text-stone-900">{stats.storyCount}</p></div>
            <div className="border border-stone-200 bg-white p-2"><p className="font-mono text-[10px] uppercase text-stone-500">transcripts</p><p className="text-lg font-black text-stone-900">{stats.transcriptCount}</p></div>
            <div className="border border-stone-200 bg-white p-2" title="media_assets.project_id = HARVEST_PROJECT_ID"><p className="font-mono text-[10px] uppercase text-stone-500">photos · project</p><p className="text-lg font-black text-stone-900">{stats.mediaByProjectId}</p></div>
            <div className="border border-stone-200 bg-white p-2" title="gallery_media_associations rows"><p className="font-mono text-[10px] uppercase text-stone-500">photos · gallery</p><p className="text-lg font-black text-stone-900">{stats.mediaByGalleryAssoc}</p></div>
            <div className="border border-stone-200 bg-white p-2" title="legacy media_assets.collection_id"><p className="font-mono text-[10px] uppercase text-stone-500">photos · collection</p><p className="text-lg font-black text-stone-900">{stats.mediaByCollectionId}</p></div>
          </div>
        )}
      </div>

      <div className="border-b border-stone-200 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">add storyteller to the harvest</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search EL storytellers by name (≥ 2 chars)…"
              className="border-stone-300"
            />
            {debouncedQuery.length >= 2 && (searchResultsQuery.data ?? []).length > 0 && (
              <div className="absolute z-20 mt-1 w-full max-h-72 overflow-y-auto border border-stone-300 bg-white shadow-lg">
                {(searchResultsQuery.data ?? []).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    disabled={r.alreadyOnHarvest || addStoryteller.isPending}
                    onClick={() => addStoryteller.mutate({ storytellerId: r.id, role: addRole })}
                    className={`flex w-full items-center justify-between gap-2 border-b border-stone-100 px-3 py-2 text-left text-sm transition ${
                      r.alreadyOnHarvest ? "cursor-not-allowed bg-stone-50 text-stone-400" : "hover:bg-[#C4922A]/8"
                    }`}
                  >
                    <span className="min-w-0 truncate">
                      <span className="font-semibold">{r.displayName ?? "(unnamed)"}</span>
                      <span className="ml-2 text-xs text-stone-500">{r.location ?? "no location"}</span>
                      {!r.isActive && <span className="ml-1 text-[10px] text-amber-700">(inactive)</span>}
                    </span>
                    {r.alreadyOnHarvest ? (
                      <span className="shrink-0 text-[10px] font-mono uppercase text-[#4A6741]">on harvest</span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-mono uppercase text-stone-500">add as {addRole}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {debouncedQuery.length >= 2 && searchResultsQuery.data?.length === 0 && !searchResultsQuery.isLoading && (
              <p className="absolute z-20 mt-1 w-full border border-stone-300 bg-white px-3 py-2 text-xs text-stone-600 shadow-lg">No matches.</p>
            )}
          </div>
          <select
            value={addRole}
            onChange={(e) => setAddRole(e.target.value as typeof addRole)}
            className="border border-stone-300 bg-white px-2 text-sm"
          >
            <option value="participant">participant</option>
            <option value="contributor">contributor</option>
            <option value="subject">subject</option>
            <option value="owner">owner</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse border border-stone-200 bg-stone-100" />
          ))
        ) : storytellers.length === 0 ? (
          <div className="col-span-full border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-600">
            No curated storytellers configured.
          </div>
        ) : (
          storytellers.map((s) => {
            const elProfileUrl = s.profileId ? `https://empathyledger.com/admin/storytellers/${s.id}` : null;
            const publishedArticles = s.articles.filter((a) => a.status === "published").length;
            const harvestStories = s.stories.filter((st) => st.isHarvestProject).length;
            return (
              <article key={s.id} className="grid gap-3 border border-stone-200 bg-white p-4">
                <header className="flex items-start gap-3">
                  {s.avatarUrl ? (
                    <img
                      src={s.avatarUrl}
                      alt={s.displayName ?? "Storyteller"}
                      className="h-14 w-14 flex-shrink-0 rounded-full border border-stone-200 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-base font-black text-stone-500">
                      {(s.displayName ?? "?").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-lg font-black leading-tight text-stone-900">{s.displayName ?? "(unnamed)"}</h3>
                    <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                      <span>{s.location ?? "no location"}</span>
                      {s.projectRole && (
                        <span className="inline-flex items-center rounded-full bg-[#4A6741]/15 px-2 py-0.5 text-[10px] font-semibold text-[#4A6741]">
                          {s.projectRole}
                        </span>
                      )}
                      {!s.isActive && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                          profile inactive
                        </span>
                      )}
                    </p>
                  </div>
                </header>

                {editingBioId === s.id ? (
                  <div className="grid gap-2">
                    <textarea
                      value={bioDraft}
                      onChange={(e) => setBioDraft(e.target.value)}
                      rows={6}
                      maxLength={5000}
                      className="w-full resize-y border border-stone-300 bg-white p-2 text-sm leading-relaxed text-stone-800"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateBio.mutate({ storytellerId: s.id, bio: bioDraft })}
                        disabled={updateBio.isPending || bioDraft === (s.bio ?? "")}
                      >
                        {updateBio.isPending ? "Saving…" : "Save bio"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingBioId(null); setBioDraft(""); }}>
                        Cancel
                      </Button>
                      <span className="text-[10px] text-stone-500">{bioDraft.length} / 5000</span>
                    </div>
                  </div>
                ) : (
                  s.bio && <p className="line-clamp-3 text-sm leading-relaxed text-stone-700">{s.bio}</p>
                )}

                <div className="flex flex-wrap gap-1.5">
                  <TagChip label={`${s.stories.length} stories`} tone={s.stories.length > 0 ? "work" : "neutral"} />
                  <TagChip label={`${harvestStories} Harvest-tagged`} tone={harvestStories > 0 ? "work" : "warn"} />
                  <TagChip label={`${publishedArticles} published`} tone={publishedArticles > 0 ? "work" : "neutral"} />
                  <TagChip label={`${s.transcripts.length} transcripts`} tone={s.transcripts.length > 0 ? "work" : "neutral"} />
                  <TagChip label={`${s.mediaCount} uploads`} />
                </div>

                {(s.stories.length > 0 || s.articles.length > 0 || s.transcripts.length > 0) && (
                  <div className="grid gap-1 border-t border-stone-100 pt-3 text-xs text-stone-700">
                    {s.stories.map((story) => (
                      <p key={story.id} className="flex items-center gap-2">
                        <span className={`inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-mono text-[9px] uppercase ${story.isPublic ? "bg-[#4A6741] text-white" : "bg-stone-200 text-stone-700"}`}>
                          {story.isPublic ? "pub" : "draft"}
                        </span>
                        <span className="truncate">{story.title ?? "(no title)"}</span>
                      </p>
                    ))}
                    {s.articles.map((article) => (
                      <p key={article.id} className="flex items-center gap-2">
                        <span className={`inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-mono text-[9px] uppercase ${article.status === "published" ? "bg-[#4A6741] text-white" : "bg-stone-200 text-stone-700"}`}>
                          {article.status ?? "?"}
                        </span>
                        <span className="truncate">{article.title ?? "(no title)"}</span>
                        {!article.isHarvestTagged && <span className="shrink-0 text-amber-700">(not Harvest-tagged)</span>}
                      </p>
                    ))}
                    {s.transcripts.map((tr) => (
                      <p key={tr.id} className="flex items-center gap-2">
                        <span className="inline-flex shrink-0 items-center rounded bg-[#8B4A2A]/15 px-1.5 py-0.5 font-mono text-[9px] uppercase text-[#8B4A2A]">
                          tr
                        </span>
                        <span className="truncate">{tr.title ?? "(untitled transcript)"}</span>
                        {tr.wordCount && <span className="shrink-0 text-stone-500">· {tr.wordCount.toLocaleString()} words</span>}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 border-t border-stone-100 pt-3">
                  {elProfileUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={elProfileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs">
                        Open in EL <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  {editingBioId !== s.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setEditingBioId(s.id); setBioDraft(s.bio ?? ""); }}
                    >
                      Edit bio
                    </Button>
                  )}
                  {creatingStoryFor !== s.id && (
                    <Button
                      size="sm"
                      onClick={() => { setCreatingStoryFor(s.id); setStoryTitle(""); setStoryContent(""); }}
                    >
                      + Story
                    </Button>
                  )}
                </div>

                {creatingStoryFor === s.id && (
                  <div className="grid gap-2 border-t border-[#C4922A] bg-[#C4922A]/8 p-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8B4A2A]">new story · author: {s.displayName}</p>
                    <Input
                      value={storyTitle}
                      onChange={(e) => setStoryTitle(e.target.value)}
                      placeholder="Story title"
                      maxLength={255}
                    />
                    <textarea
                      value={storyContent}
                      onChange={(e) => setStoryContent(e.target.value)}
                      rows={8}
                      placeholder="Story content (markdown ok)…"
                      maxLength={50000}
                      className="w-full resize-y border border-stone-300 bg-white p-2 text-sm leading-relaxed text-stone-800"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => createStory.mutate({
                          title: storyTitle,
                          content: storyContent,
                          authorStorytellerId: s.id,
                          isPublic: false,
                        })}
                        disabled={createStory.isPending || !storyTitle.trim() || !storyContent.trim()}
                      >
                        {createStory.isPending ? "Creating…" : "Create draft"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setCreatingStoryFor(null); setStoryTitle(""); setStoryContent(""); }}>
                        Cancel
                      </Button>
                      <span className="text-[10px] text-stone-500">draft · is_public=false · project_id=Harvest</span>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {orphans.length > 0 && (
        <div className="border-t border-stone-200 p-5">
          <h3 className="text-base font-black text-stone-900">Orphaned Harvest content</h3>
          <p className="mt-1 max-w-3xl text-sm text-stone-600">
            Articles whose title or slug suggests Harvest content but that aren't tagged with <code className="rounded bg-stone-200 px-1 font-mono text-[11px]">primary_project="the-harvest"</code>. One click adds the tag (preserving any existing project value in <code className="rounded bg-stone-200 px-1 font-mono text-[11px]">related_projects</code>).
          </p>
          <div className="mt-3 grid gap-3">
            {orphans.map((o) => (
              <div key={o.id} className="grid gap-2 border border-amber-200 bg-amber-50 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-900">{o.title ?? "(no title)"}</p>
                  <p className="mt-0.5 truncate font-mono text-[10px] text-stone-600">
                    {o.slug ?? "(no slug)"} · {o.status ?? "?"} · by {o.authorName ?? "unknown"} · primary={o.primaryProject ?? "(none)"} · related={JSON.stringify(o.relatedProjects ?? [])}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => tagAsHarvest.mutate({ articleId: o.id })}
                    disabled={tagAsHarvest.isPending}
                  >
                    Tag as Harvest
                  </Button>
                  {!o.authorStorytellerId && storytellers.map((s) => (
                    <Button
                      key={s.id}
                      size="sm"
                      variant="outline"
                      onClick={() => claimForStoryteller.mutate({ articleId: o.id, storytellerId: s.id })}
                      disabled={claimForStoryteller.isPending}
                    >
                      Claim for {s.displayName?.split(" ")[0]}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function AllMediaWorkbench({
  media,
  filteredMedia,
  selectedMedia,
  selectedMediaIds,
  selectedRecipe,
  recipeKey,
  mediaSearch,
  workFilter,
  themeFilter,
  categoryFilter,
  kindFilter,
  onRecipeChange,
  onSearchChange,
  onWorkFilterChange,
  onThemeFilterChange,
  onCategoryFilterChange,
  onKindFilterChange,
  onToggleSelected,
  onSelectFiltered,
  onClearSelected,
  pageUsesByAsset,
}: {
  media: AdminMediaAsset[];
  filteredMedia: AdminMediaAsset[];
  selectedMedia: AdminMediaAsset[];
  selectedMediaIds: string[];
  selectedRecipe: MediaSet;
  recipeKey: string;
  mediaSearch: string;
  workFilter: string;
  themeFilter: string;
  categoryFilter: string;
  kindFilter: "all" | "image" | "video";
  onRecipeChange: (key: string) => void;
  onSearchChange: (value: string) => void;
  onWorkFilterChange: (value: string) => void;
  onThemeFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onKindFilterChange: (value: "all" | "image" | "video") => void;
  onToggleSelected: (id: string) => void;
  onSelectFiltered: () => void;
  onClearSelected: () => void;
  pageUsesByAsset: Map<string, AssetPageUse[]>;
}) {
  const [tagMode, setTagMode] = useState<TagMode>("replace");
  const [extraTag, setExtraTag] = useState("");
  const [extraTagCategory, setExtraTagCategory] = useState(extraTagCategories[0].value);
  const utils = trpc.useUtils();
  const applyTagsMutation = trpc.mediaLibrary.applyTags.useMutation({
    onSuccess: async (result) => {
      await utils.gallery.fromEL.invalidate();
      toast.success(`Applied tags to ${result.updated} asset${result.updated === 1 ? "" : "s"}.`);
    },
    onError: (error) => toast.error("Could not apply tags", { description: error.message }),
  });

  const applySelectedRecipe = async () => {
    if (selectedMediaIds.length === 0) {
      toast.error("Select at least one asset first.");
      return;
    }

    const cleanedExtraTag = normaliseExtraTag(extraTag);
    await applyTagsMutation.mutateAsync({
      mediaIds: selectedMediaIds,
      recipe: recipePayload(
        selectedRecipe,
        cleanedExtraTag ? [{ slug: cleanedExtraTag, category: extraTagCategory }] : [],
      ),
      mode: tagMode,
    });
  };

  return (
    <section className="mt-8 border border-stone-300 bg-[#FFFDF7]">
      <div className="border-b border-stone-200 p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionIntro
            eyebrow="all media"
            title="Tag existing EL assets here."
            body="Search or filter, select the photos, choose the tags, then apply them. No copy-paste step."
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={onSelectFiltered} disabled={filteredMedia.length === 0}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Select shown
            </Button>
            <Button variant="outline" onClick={onClearSelected} disabled={selectedMediaIds.length === 0}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              value={mediaSearch}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search title, source, id, work or tag"
              className="h-10 rounded-none border-stone-300 bg-white pl-9"
            />
          </div>
          <FilterSelect label="Work" value={workFilter} options={workFilters} onChange={onWorkFilterChange} />
          <FilterSelect label="Theme" value={themeFilter} options={themeFilters} onChange={onThemeFilterChange} />
          <FilterSelect label="Category" value={categoryFilter} options={categoryFilters} onChange={onCategoryFilterChange} />
          <FilterSelect
            label="Kind"
            value={kindFilter}
            options={[
              { value: "all", label: "All media" },
              { value: "image", label: "Images" },
              { value: "video", label: "Video" },
            ]}
            onChange={(value) => onKindFilterChange(value as "all" | "image" | "video")}
          />
        </div>

        <div className="mt-4 grid gap-3 border border-stone-200 bg-white p-3 text-sm lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-3 md:grid-cols-[220px_1fr] md:items-end">
            <FilterSelect
              label="Tags to apply"
              value={recipeKey}
              options={mediaSets.map((set) => ({ value: set.key, label: set.title }))}
              onChange={onRecipeChange}
            />
            <div>
              <p className="font-semibold text-stone-800">
                Showing {filteredMedia.length} of {media.length} loaded assets · {selectedMedia.length} selected
              </p>
              <p className="mt-1 text-xs text-stone-600">
                {tagMode === "replace" ? "Change mode replaces old work/theme/category tags." : "Add mode keeps existing tags and adds the new set."}
                {" "}Selected assets become <strong>{selectedRecipe.work}</strong> + {selectedRecipe.themes.join("/")} + {selectedRecipe.category}.
                {extraTag.trim() ? ` Extra tag: ${normaliseExtraTag(extraTag)}.` : ""}
              </p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-[170px_1fr_auto]">
            <FilterSelect
              label="Mode"
              value={tagMode}
              options={[
                { value: "replace", label: "Change spine" },
                { value: "merge", label: "Add only" },
              ]}
              onChange={(value) => setTagMode(value as TagMode)}
            />
            <label className="grid gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
              Quick tag
              <div className="grid gap-2 sm:grid-cols-[1fr_120px]">
                <Input
                  value={extraTag}
                  onChange={(event) => setExtraTag(event.target.value)}
                  placeholder="home, featured, june-20..."
                  className="h-10 rounded-none border-stone-300 bg-white text-sm normal-case tracking-normal"
                />
                <select
                  value={extraTagCategory}
                  onChange={(event) => setExtraTagCategory(event.target.value)}
                  className="h-10 border border-stone-300 bg-white px-3 text-sm normal-case tracking-normal text-stone-900 outline-none focus:border-[#8B4A2A]"
                >
                  {extraTagCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </label>
            <Button
              size="sm"
              className="self-end"
              disabled={selectedMediaIds.length === 0 || applyTagsMutation.isPending}
              onClick={applySelectedRecipe}
            >
              {applyTagsMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : tagMode === "replace" ? (
                <Replace className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {applyTagsMutation.isPending ? "Applying..." : tagMode === "replace" ? "Change tags" : "Add tags"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-600">
            No assets match the current filters.
          </div>
        ) : (
          filteredMedia.map((item) => (
            <MediaLibraryCard
              key={item.id}
              item={item}
              selected={selectedMediaIds.includes(item.id)}
              pageUses={pageUsesByAsset.get(item.id) ?? []}
              onToggleSelected={() => onToggleSelected(item.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 min-w-36 border border-stone-300 bg-white px-3 text-sm normal-case tracking-normal text-stone-900 outline-none focus:border-[#8B4A2A]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MediaLibraryCard({
  item,
  selected,
  pageUses,
  onToggleSelected,
}: {
  item: AdminMediaAsset;
  selected: boolean;
  pageUses: AssetPageUse[];
  onToggleSelected: () => void;
}) {
  const video = isVideoAsset(item.src);

  return (
    <article className={`border bg-white ${selected ? "border-[#C4922A] ring-2 ring-[#C4922A]/30" : "border-stone-200"}`}>
      <button
        type="button"
        onClick={onToggleSelected}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-stone-200 text-left"
        aria-pressed={selected}
      >
        {video ? (
          <LazyVideo src={item.src} className="h-full w-full object-cover" />
        ) : (
          <img
            src={optimize(item.src, "thumb")}
            alt={item.altText ?? item.title ?? "Harvest media"}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 bg-stone-950/75 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white">
          {video ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
          {video ? "video" : "image"}
        </span>
        <span className="absolute right-2 top-2 bg-white/90 p-1 text-stone-900">
          {selected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
        </span>
      </button>
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-10 text-sm font-black leading-tight">
          {item.title || item.altText || "Untitled media"}
        </h3>
        <p className="mt-1 truncate font-mono text-[10px] text-stone-500">{item.id}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(item.works && item.works.length > 0) ? (
            item.works.map((work) => <TagChip key={work} label={work} tone="work" />)
          ) : (
            <TagChip label="no work tag" tone="warn" />
          )}
          {item.themes?.map((theme) => <TagChip key={theme} label={theme} />)}
          {item.category && <TagChip label={item.category} />}
        </div>
        <PageUseChips uses={pageUses} />
      </div>
    </article>
  );
}

function PageUseChips({ uses }: { uses: AssetPageUse[] }) {
  return (
    <div className="mt-3 border-t border-stone-100 pt-3">
      <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-stone-500">
        <MapPinned className="h-3.5 w-3.5" />
        shows in
      </p>
      {uses.length === 0 ? (
        <span className="inline-flex border border-dashed border-stone-300 px-2 py-1 text-[10px] font-semibold text-stone-500">
          not on a page yet
        </span>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {uses.slice(0, 4).map((use) => (
            <a
              key={pageUseKey(use)}
              href={use.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 border px-2 py-1 text-[10px] font-semibold transition hover:bg-stone-100 ${
                use.source === "slot"
                  ? "border-[#4A6741]/35 bg-[#4A6741]/10 text-[#2F472B]"
                  : "border-stone-200 bg-stone-50 text-stone-700"
              }`}
            >
              {use.source === "slot" ? <Link2 className="h-3 w-3" /> : <ExternalLink className="h-3 w-3" />}
              {use.label}
            </a>
          ))}
          {uses.length > 4 && (
            <span className="inline-flex border border-stone-200 bg-stone-50 px-2 py-1 text-[10px] font-semibold text-stone-500">
              +{uses.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function TagChip({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "work" | "warn" }) {
  const className =
    tone === "work"
      ? "border-[#4A6741]/35 bg-[#4A6741]/10 text-[#2F472B]"
      : tone === "warn"
        ? "border-[#C4922A]/45 bg-[#C4922A]/12 text-[#7A4C07]"
        : "border-stone-200 bg-stone-100 text-stone-700";

  return (
    <span className={`inline-flex items-center border px-2 py-0.5 text-[10px] font-semibold ${className}`}>
      {label}
    </span>
  );
}

function MediaSetCard({ set, media }: { set: MediaSet; media: AdminMediaAsset[] }) {
  const assets = media.filter((item) => item.works?.includes(set.work));
  return (
    <article className="border border-stone-300 bg-[#FFFDF7]">
      <div className="border-b border-stone-200 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8B4A2A]">
              {assets.length ? "tagged" : "needs tagging"}
            </p>
            <h3 className="mt-2 text-2xl font-black">{set.title}</h3>
          </div>
          <span className="border border-stone-300 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em]">
            {assets.length} in EL
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-stone-700">{set.description}</p>
        <div className="mt-4 grid gap-2 text-xs text-stone-600">
          <p>
            <strong>Tag spine:</strong> {set.work} + {set.themes.join("/")} + {set.category}
          </p>
          <p>
            <strong>Public use:</strong> {set.publicUse}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 p-4">
        {assets.length === 0 ? (
          <div className="col-span-3 border border-dashed border-stone-300 bg-stone-50 p-5 text-sm leading-relaxed text-stone-600">
            Open Empathy Ledger and add the work tag <code className="bg-white px-1.5 py-0.5">{set.work}</code>.
          </div>
        ) : (
          assets.slice(0, 6).map((item) => <MediaThumb key={item.id} item={item} compact />)
        )}
      </div>
    </article>
  );
}

function ProcessCard() {
  const steps = [
    "Upload new selects or import local videos into EL.",
    "Change the work/theme/category spine in this page.",
    "Add quick page or feature tags when needed.",
    "Check the shows-in chips before using an asset publicly.",
    "Assign hero and card slots from the same linked EL assets.",
  ];

  return (
    <article className="border border-stone-300 bg-[#1C1917] p-5 text-[#F5F0E8]">
      <div className="flex items-center gap-3">
        <Tags className="h-5 w-5 text-[#C4922A]" />
        <h3 className="text-2xl font-black">Workflow</h3>
      </div>
      <ol className="mt-5 space-y-3 text-sm leading-relaxed text-white/72">
        {steps.map((step, index) => (
          <li key={step} className="grid grid-cols-[auto_1fr] gap-3 border-t border-white/12 pt-3">
            <span className="font-mono text-[#C4922A]">{String(index + 1).padStart(2, "0")}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}

function VideoPassCard() {
  return (
    <article className="border border-stone-300 bg-[#FFFDF7] p-5">
      <div className="flex items-center gap-3">
        <Film className="h-5 w-5 text-[#8B4A2A]" />
        <h3 className="text-2xl font-black">Video pass</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-stone-700">
        The importer above scans the repo for non-archive motion files and sends selected MP4/GIF assets into the same EL gallery as the photos.
      </p>
      <ul className="mt-4 space-y-2 text-xs leading-relaxed text-stone-600">
        {videoSources.map((source) => (
          <li key={source} className="border-t border-stone-200 pt-2">{source}</li>
        ))}
      </ul>
    </article>
  );
}

function PublicSlotCard({ slot }: { slot: PageSlot }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const utils = trpc.useUtils();
  const overrideQuery = trpc.imageOverrides.get.useQuery({ page: slot.page, slot: slot.slot });
  const setMutation = trpc.imageOverrides.set.useMutation({
    onSuccess: () => {
      utils.imageOverrides.get.invalidate({ page: slot.page, slot: slot.slot });
      toast.success("Public slot updated.");
    },
    onError: (error) => toast.error("Could not update slot", { description: error.message }),
  });
  const clearMutation = trpc.imageOverrides.clear.useMutation({
    onSuccess: () => {
      utils.imageOverrides.get.invalidate({ page: slot.page, slot: slot.slot });
      toast.success("Slot reverted.");
    },
    onError: (error) => toast.error("Could not revert slot", { description: error.message }),
  });

  const override = overrideQuery.data;

  const handlePick = async (photo: PickedPhoto) => {
    await setMutation.mutateAsync({
      page: slot.page,
      slot: slot.slot,
      mediaAssetId: photo.mediaAssetId,
      src: photo.src,
      altText: photo.altText ?? undefined,
      title: photo.title ?? undefined,
    });
  };

  return (
    <article className="grid gap-4 border border-stone-300 bg-[#FFFDF7] p-4 sm:grid-cols-[150px_1fr]">
      <div className="aspect-[4/3] overflow-hidden bg-stone-200">
        {override?.src ? (
          <img
            src={optimize(override.src, "thumb")}
            alt={override.altText ?? override.title ?? slot.label}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-400">
            <Images className="h-8 w-8" />
          </div>
        )}
      </div>
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black">{slot.label}</h3>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500">
              {slot.page} / {slot.slot}
            </p>
          </div>
          {override && (
            <span className="inline-flex items-center gap-1 bg-[#4A6741]/10 px-2 py-1 text-xs font-semibold text-[#4A6741]">
              <Check className="h-3.5 w-3.5" />
              EL linked
            </span>
          )}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-stone-700">{slot.note}</p>
        {override?.title && (
          <p className="mt-2 text-xs leading-relaxed text-stone-500">Current: {override.title}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setPickerOpen(true)} disabled={setMutation.isPending}>
            <Camera className="mr-2 h-4 w-4" />
            Pick from EL
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={slot.publicUrl} target="_blank" rel="noopener noreferrer">
              View public slot
            </a>
          </Button>
          {override && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => clearMutation.mutate({ page: slot.page, slot: slot.slot })}
              disabled={clearMutation.isPending}
            >
              Revert
            </Button>
          )}
        </div>
      </div>
      <HarvestPhotoPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={handlePick}
        defaultWorkSlug={slot.defaultWorkSlug}
      />
    </article>
  );
}

function MediaThumb({ item, compact = false }: { item: AdminMediaAsset; compact?: boolean }) {
  const video = isVideoAsset(item.src);
  return (
    <figure className={compact ? "" : "border border-stone-200 bg-white p-2"}>
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        {video ? (
          <LazyVideo src={item.src} className="h-full w-full object-cover" />
        ) : (
          <img
            src={optimize(item.src, "thumb")}
            alt={item.altText ?? item.title ?? "Harvest media"}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
        <span className="absolute left-2 top-2 bg-stone-950/75 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white">
          {video ? "video" : "image"}
        </span>
      </div>
      {!compact && (
        <figcaption className="mt-2 text-xs leading-relaxed text-stone-600">
          <span className="font-semibold text-stone-800">{item.title ?? "Untitled"}</span>
          <br />
          {(item.works && item.works.length > 0) ? item.works.join(", ") : "No work tag"}
        </figcaption>
      )}
    </figure>
  );
}
