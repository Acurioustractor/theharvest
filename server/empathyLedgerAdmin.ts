import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readdir, readFile, stat, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join, relative } from "node:path";

dotenv.config({ path: ".env.local", override: false, quiet: true });

const HARVEST_GALLERY_ID = "5fa1593e-7d73-477a-9a34-64d2f3ff86cc";
// Canonical Harvest project. EL v2's public API unions assets via this project_id
// with assets via gallery_media_associations(HARVEST_GALLERY_ID), so all uploads
// must have this set or they only show up via the legacy gallery side.
const HARVEST_PROJECT_ID = "0584b447-57a8-4c85-bc3e-5cd97511b7e4";
const STORAGE_BUCKET = "media";

type HarvestUploadFile = {
  fileName: string;
  contentType: string;
  base64Data: string;
};

type HarvestExtraTag = {
  slug: string;
  category: string;
};

type HarvestUploadRecipe = {
  work: string;
  themes: string[];
  categories: string[];
  title: string;
  extraTags?: HarvestExtraTag[];
};

type UploadResult = {
  id: string;
  fileName: string;
  src: string;
  mediaType: "image" | "video";
};

export type LocalHarvestMotionFile = {
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

type ElAdminContext = {
  supabase: any;
  gallery: {
    id: string;
    title: string | null;
    organization_id: string | null;
    tenant_id: string | null;
    created_by: string;
  };
  tenantId: string;
};

type HarvestUploadSource = {
  fileName: string;
  contentType: string;
  base64Data?: string;
  absolutePath?: string;
  sourcePath?: string;
  proxyMetadata?: {
    originalFileName: string;
    originalSize: number;
    proxySize: number;
    preset: string;
  };
};

type TagMode = "merge" | "replace";

const HARVEST_SPINE_TAG_CATEGORIES = ["harvest-work", "harvest-theme", "harvest-category"];
const MOTION_EXTENSIONS = new Set([".mp4", ".mov", ".m4v", ".webm", ".gif"]);

function getElSupabaseConfig() {
  const url =
    process.env.EMPATHY_LEDGER_SUPABASE_URL ||
    process.env.EL_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL;
  const serviceKey =
    process.env.EMPATHY_LEDGER_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.EL_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Empathy Ledger Supabase credentials are not configured.");
  }

  return { url, serviceKey };
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

function titleFromFile(fileName: string) {
  return sanitizeFileName(fileName).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim() || "Harvest media";
}

function normalizeTagSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTagCategory(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mediaTypeFor(contentType: string, fileName: string): "image" | "video" {
  const ext = extname(fileName).toLowerCase();
  if (contentType.startsWith("video/") || [".mp4", ".mov", ".m4v", ".webm"].includes(ext)) {
    return "video";
  }
  return "image";
}

function tagName(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function getOrCreateTag(
  supabase: any,
  slug: string,
  category: string,
): Promise<string> {
  const { data: existing, error: findError } = await supabase
    .from("tags")
    .select("id")
    .eq("slug", slug)
    .eq("category", category)
    .maybeSingle();

  if (findError) throw findError;
  if (existing?.id) return existing.id;

  const { data: created, error: createError } = await supabase
    .from("tags")
    .insert({
      slug,
      name: tagName(slug),
      category,
      description: `Harvest ${category.replace("harvest-", "")} tag for ${tagName(slug)}`,
      cultural_sensitivity_level: "public",
    })
    .select("id")
    .single();

  if (createError) throw createError;
  if (!created?.id) throw new Error(`Could not create EL tag ${category}:${slug}`);
  return created.id;
}

async function createElAdminContext(): Promise<ElAdminContext> {
  const { url, serviceKey } = getElSupabaseConfig();
  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: gallery, error: galleryError } = await supabase
    .from("galleries")
    .select("id, title, organization_id, created_by")
    .eq("id", HARVEST_GALLERY_ID)
    .maybeSingle();

  if (galleryError) throw galleryError;
  if (!gallery) throw new Error(`Harvest gallery ${HARVEST_GALLERY_ID} was not found in Empathy Ledger.`);

  const { data: ownerProfile, error: ownerError } = await supabase
    .from("profiles")
    .select("id, tenant_id")
    .eq("id", gallery.created_by)
    .maybeSingle();

  if (ownerError) throw ownerError;

  const tenantId = ownerProfile?.tenant_id;
  if (!tenantId || !gallery.created_by) {
    throw new Error("Could not resolve the Harvest gallery tenant/uploader in Empathy Ledger.");
  }

  return { supabase, gallery, tenantId };
}

async function getProjectIdForRecipe(supabase: any, recipe: HarvestUploadRecipe): Promise<string | null> {
  // recipe.work is a tag slug (e.g. "milk-crate-pavilion"), not a project slug.
  // EL has one canonical Harvest project. If a per-work project ever exists with
  // that slug, prefer it; otherwise fall back to the canonical Harvest project.
  const { data: matched } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", recipe.work)
    .maybeSingle();

  return matched?.id ?? HARVEST_PROJECT_ID;
}

function tagEntriesForRecipe(recipe: HarvestUploadRecipe): HarvestExtraTag[] {
  const entries: HarvestExtraTag[] = [
    { slug: recipe.work, category: "harvest-work" },
    ...recipe.themes.map((theme) => ({ slug: theme, category: "harvest-theme" })),
    ...recipe.categories.map((category) => ({ slug: category, category: "harvest-category" })),
    ...(recipe.extraTags ?? []),
  ]
    .map((tag) => ({
      slug: normalizeTagSlug(tag.slug),
      category: normalizeTagCategory(tag.category),
    }))
    .filter((tag) => tag.slug && tag.category);

  const seen = new Set<string>();
  return entries.filter((tag) => {
    const key = `${tag.category}:${tag.slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function tagIdsForRecipe(supabase: any, recipe: HarvestUploadRecipe): Promise<string[]> {
  return Promise.all(tagEntriesForRecipe(recipe).map((tag) => getOrCreateTag(supabase, tag.slug, tag.category)));
}

async function clearHarvestSpineTags(supabase: any, mediaIds: string[]) {
  if (mediaIds.length === 0) return;

  const { data: existingTags, error: tagError } = await supabase
    .from("tags")
    .select("id")
    .in("category", HARVEST_SPINE_TAG_CATEGORIES);

  if (tagError) throw tagError;

  const tagIds = (existingTags ?? []).map((tag: { id: string }) => tag.id).filter(Boolean);
  if (tagIds.length === 0) return;

  const { error: deleteError } = await supabase
    .from("media_tags")
    .delete()
    .in("media_asset_id", mediaIds)
    .in("tag_id", tagIds);

  if (deleteError) throw deleteError;
}

async function applyRecipeTags(input: {
  supabase: any;
  mediaIds: string[];
  recipe: HarvestUploadRecipe;
  addedBy: string;
  mode?: TagMode;
}) {
  if (input.mode === "replace") {
    await clearHarvestSpineTags(input.supabase, input.mediaIds);
  }

  const tagIds = await tagIdsForRecipe(input.supabase, input.recipe);
  const tagRows = input.mediaIds.flatMap((mediaId) =>
    tagIds.map((tagId) => ({
      media_asset_id: mediaId,
      tag_id: tagId,
      source: "manual",
      added_by: input.addedBy,
      confidence: 1,
      verified: true,
    })),
  );

  if (tagRows.length === 0) return;

  const { error: tagError } = await input.supabase
    .from("media_tags")
    .upsert(tagRows, {
      onConflict: "media_asset_id,tag_id",
      ignoreDuplicates: true,
    });

  if (tagError) throw tagError;
}

async function readUploadSource(file: HarvestUploadSource): Promise<Buffer> {
  if (file.base64Data) return Buffer.from(file.base64Data, "base64");
  if (file.absolutePath) return readFile(file.absolutePath);
  throw new Error(`No file data was provided for ${file.fileName}`);
}

async function uploadHarvestMediaSourcesToEmpathyLedger(input: {
  files: HarvestUploadSource[];
  recipe: HarvestUploadRecipe;
  uploadedBy: number | null;
}): Promise<{ uploaded: UploadResult[]; failed: Array<{ fileName: string; error: string }> }> {
  const { supabase, gallery, tenantId } = await createElAdminContext();
  const projectId = await getProjectIdForRecipe(supabase, input.recipe);
  const tagIds = await tagIdsForRecipe(supabase, input.recipe);

  const { data: existingSort } = await supabase
    .from("gallery_media_associations")
    .select("sort_order")
    .eq("gallery_id", HARVEST_GALLERY_ID)
    .order("sort_order", { ascending: false })
    .limit(1);

  let sortOrder = Number(existingSort?.[0]?.sort_order ?? 0) + 1;
  const uploaded: UploadResult[] = [];
  const failed: Array<{ fileName: string; error: string }> = [];

  for (const file of input.files) {
    try {
      const mediaType = mediaTypeFor(file.contentType, file.fileName);
      if (mediaType !== "image" && mediaType !== "video") {
        throw new Error("Only image and video files are supported.");
      }

      const buffer = await readUploadSource(file);
      const safeName = sanitizeFileName(file.fileName);
      const storagePath = `galleries/${HARVEST_GALLERY_ID}/harvest-admin-library/${Date.now()}-${randomUUID()}-${safeName}`;
      const contentType = file.contentType || "application/octet-stream";

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, buffer, { contentType, upsert: false });

      if (uploadError) throw uploadError;

      const publicUrl = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath).data.publicUrl;
      const title = titleFromFile(file.fileName);

      const { data: asset, error: assetError } = await supabase
        .from("media_assets")
        .insert({
          original_filename: file.fileName,
          display_name: title,
          file_size: buffer.length,
          file_type: contentType,
          mime_type: contentType,
          media_type: mediaType,
          storage_bucket: STORAGE_BUCKET,
          storage_path: storagePath,
          cdn_url: publicUrl,
          url: publicUrl,
          processing_status: "completed",
          privacy_level: "public",
          visibility: "public",
          cultural_sensitivity_level: "standard",
          organization_id: gallery.organization_id,
          tenant_id: tenantId,
          uploader_id: gallery.created_by,
          uploaded_by: gallery.created_by,
          project_id: projectId,
          title,
          alt_text: `${input.recipe.title} at The Harvest: ${title}.`,
          description: `${input.recipe.title}. Uploaded from The Harvest media library.`,
          source_type: "harvest-admin-media-library",
          requires_consent: false,
          consent_obtained: true,
          metadata: {
            harvestUploadSource: "admin-media-library",
            harvestUploadedBy: input.uploadedBy,
            harvestRecipe: input.recipe,
            harvestSourcePath: file.sourcePath ?? null,
            harvestProxy: file.proxyMetadata ?? null,
          },
        })
        .select("id")
        .single();

      if (assetError) {
        await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
        throw assetError;
      }

      const { error: galleryAssocError } = await supabase
        .from("gallery_media_associations")
        .insert({
          gallery_id: HARVEST_GALLERY_ID,
          media_asset_id: asset.id,
          sort_order: sortOrder++,
        });

      if (galleryAssocError) throw galleryAssocError;

      const tagRows = tagIds.map((tagId) => ({
        media_asset_id: asset.id,
        tag_id: tagId,
        source: "manual",
        added_by: gallery.created_by,
        confidence: 1,
        verified: true,
      }));

      const { error: tagError } = await supabase
        .from("media_tags")
        .upsert(tagRows, {
          onConflict: "media_asset_id,tag_id",
          ignoreDuplicates: true,
        });

      if (tagError) throw tagError;

      uploaded.push({
        id: asset.id,
        fileName: file.fileName,
        src: publicUrl,
        mediaType,
      });
    } catch (error) {
      failed.push({
        fileName: file.fileName,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { uploaded, failed };
}

export async function uploadHarvestMediaToEmpathyLedger(input: {
  files: HarvestUploadFile[];
  recipe: HarvestUploadRecipe;
  uploadedBy: number | null;
}): Promise<{ uploaded: UploadResult[]; failed: Array<{ fileName: string; error: string }> }> {
  return uploadHarvestMediaSourcesToEmpathyLedger({
    files: input.files,
    recipe: input.recipe,
    uploadedBy: input.uploadedBy,
  });
}

export async function tagHarvestMediaInEmpathyLedger(input: {
  mediaIds: string[];
  recipe: HarvestUploadRecipe;
  mode?: TagMode;
}): Promise<{ updated: number }> {
  const { supabase, gallery } = await createElAdminContext();
  const projectId = await getProjectIdForRecipe(supabase, input.recipe);

  await applyRecipeTags({
    supabase,
    mediaIds: input.mediaIds,
    recipe: input.recipe,
    addedBy: gallery.created_by,
    mode: input.mode ?? "merge",
  });

  if (projectId) {
    await supabase
      .from("media_assets")
      .update({ project_id: projectId, updated_at: new Date().toISOString() })
      .in("id", input.mediaIds);
  }

  return { updated: input.mediaIds.length };
}

function contentTypeForMotionFile(fileName: string) {
  const ext = extname(fileName).toLowerCase();
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".mov") return "video/quicktime";
  if (ext === ".m4v") return "video/x-m4v";
  if (ext === ".webm") return "video/webm";
  if (ext === ".gif") return "image/gif";
  return "application/octet-stream";
}

async function walkMotionFiles(rootDir: string, cwd: string): Promise<LocalHarvestMotionFile[]> {
  let entries;
  try {
    entries = await readdir(rootDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files: LocalHarvestMotionFile[] = [];
  for (const entry of entries) {
    const absolutePath = join(rootDir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "archive") continue;
      files.push(...await walkMotionFiles(absolutePath, cwd));
      continue;
    }

    if (!entry.isFile()) continue;
    const extension = extname(entry.name).toLowerCase();
    if (!MOTION_EXTENSIONS.has(extension)) continue;

    const fileStat = await stat(absolutePath);
    const relativePath = relative(cwd, absolutePath);
    files.push({
      id: relativePath.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      fileName: basename(absolutePath),
      relativePath,
      contentType: contentTypeForMotionFile(entry.name),
      size: fileStat.size,
      kind: extension === ".gif" ? "gif" : "video",
    });
  }

  return files;
}

export async function listHarvestLocalMotionFiles(cwd = process.cwd()): Promise<LocalHarvestMotionFile[]> {
  const roots = [
    join(cwd, "client/public/images/compendium"),
    join(cwd, "client/public/images/social-tiles"),
    join(cwd, "docs/communications/debriefs/_whatsapp-exports"),
  ];

  const allFiles = (await Promise.all(roots.map((root) => walkMotionFiles(root, cwd)))).flat();
  const seen = new Set<string>();
  return allFiles
    .filter((file) => {
      const key = `${file.fileName}:${file.size}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

async function listHarvestLocalMotionFilesWithApiStatus(files: LocalHarvestMotionFile[]): Promise<LocalHarvestMotionFile[]> {
  const baseUrl = (process.env.EMPATHY_LEDGER_API_URL || "https://empathyledger.com").replace(/\/$/, "");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.EMPATHY_LEDGER_API_KEY) {
    headers["X-API-Key"] = process.env.EMPATHY_LEDGER_API_KEY;
  }

  const allMedia: any[] = [];
  for (const page of [1, 2, 3]) {
    const response = await fetch(`${baseUrl}/api/v1/harvest/gallery?limit=100&page=${page}`, { headers });
    if (!response.ok) throw new Error(`Harvest gallery API returned ${response.status}`);
    const body = await response.json() as { media?: any[]; pagination?: { hasMore?: boolean } };
    allMedia.push(...(body.media ?? []));
    if (!body.pagination?.hasMore) break;
  }

  return files.map((file) => {
    const safeTitle = titleFromFile(file.fileName).toLowerCase();
    const matches = allMedia
      .filter((asset) => {
        const haystack = [
          asset.src,
          asset.title,
          asset.description,
          asset.altText,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(file.fileName.toLowerCase()) || haystack.includes(safeTitle);
      })
      .map((asset) => ({
        id: asset.id,
        title: asset.title ?? asset.altText ?? null,
        src: asset.src ?? null,
        works: asset.works ?? [],
        themes: asset.themes ?? [],
        categories: asset.category ? [asset.category] : [],
        tags: asset.tags ?? [],
        createdAt: asset.createdAt ?? null,
      }));

    return {
      ...file,
      elStatus: matches.length > 0 ? "synced" as const : "local-only" as const,
      elMatches: matches,
    };
  });
}

export async function listHarvestLocalMotionFilesWithElStatus(cwd = process.cwd()): Promise<LocalHarvestMotionFile[]> {
  const files = await listHarvestLocalMotionFiles(cwd);
  if (files.length === 0) return files;

  try {
    const { supabase } = await createElAdminContext();
    const fileNames = Array.from(new Set(files.map((file) => file.fileName)));
    const { data: assets, error: assetError } = await supabase
      .from("media_assets")
      .select("id, original_filename, display_name, title, cdn_url, url, metadata, created_at")
      .in("original_filename", fileNames);

    if (assetError) throw assetError;

    const assetRows = (assets ?? []) as Array<{
      id: string;
      original_filename: string | null;
      display_name: string | null;
      title: string | null;
      cdn_url: string | null;
      url: string | null;
      metadata: Record<string, unknown> | null;
      created_at: string | null;
    }>;

    const assetIds = assetRows.map((asset) => asset.id);
    const tagsByAsset = new Map<string, Array<{ slug: string; category: string }>>();

    if (assetIds.length > 0) {
      const { data: tagRows, error: tagError } = await supabase
        .from("media_tags")
        .select("media_asset_id, tags(slug, category)")
        .in("media_asset_id", assetIds);

      if (tagError) throw tagError;

      (tagRows ?? []).forEach((row: any) => {
        const tag = Array.isArray(row.tags) ? row.tags[0] : row.tags;
        if (!row.media_asset_id || !tag?.slug) return;
        const current = tagsByAsset.get(row.media_asset_id) ?? [];
        current.push({ slug: tag.slug, category: tag.category ?? "" });
        tagsByAsset.set(row.media_asset_id, current);
      });
    }

    return files.map((file) => {
      const matches = assetRows
        .filter((asset) => {
          if (asset.original_filename !== file.fileName) return false;
          const sourcePath = asset.metadata?.harvestSourcePath;
          return !sourcePath || sourcePath === file.relativePath;
        })
        .map((asset) => {
          const tagRows = tagsByAsset.get(asset.id) ?? [];
          return {
            id: asset.id,
            title: asset.title ?? asset.display_name,
            src: asset.cdn_url ?? asset.url,
            works: tagRows.filter((tag) => tag.category === "harvest-work").map((tag) => tag.slug),
            themes: tagRows.filter((tag) => tag.category === "harvest-theme").map((tag) => tag.slug),
            categories: tagRows.filter((tag) => tag.category === "harvest-category").map((tag) => tag.slug),
            tags: tagRows.map((tag) => tag.slug),
            createdAt: asset.created_at,
          };
        });

      return {
        ...file,
        elStatus: matches.length > 0 ? "synced" as const : "local-only" as const,
        elMatches: matches,
      };
    });
  } catch (error) {
    console.warn("[MediaLibrary] Falling back to Harvest gallery API for local motion sync status:", error);
    try {
      return await listHarvestLocalMotionFilesWithApiStatus(files);
    } catch (apiError) {
      console.error("[MediaLibrary] Could not load EL sync status for local motion files:", apiError);
      return files.map((file) => ({ ...file, elStatus: "unknown" as const, elMatches: [] }));
    }
  }
}

// Files this size or larger get re-encoded through ffmpeg before upload.
// Below the threshold the cost (encode time, two writes) outweighs storage win.
const VIDEO_PROXY_SIZE_THRESHOLD = 5 * 1024 * 1024;
const VIDEO_PROXY_PRESET = "h264-crf24-720p-aac96k-faststart";

type CompressedProxy = {
  buffer: Buffer;
  fileName: string;
  contentType: "video/mp4";
  originalSize: number;
  proxySize: number;
  preset: string;
};

async function compressVideoToProxy(absolutePath: string, originalFileName: string): Promise<CompressedProxy> {
  const tempPath = join(tmpdir(), `harvest-proxy-${randomUUID()}.mp4`);

  try {
    await new Promise<void>((resolve, reject) => {
      const proc = spawn("ffmpeg", [
        "-hide_banner", "-loglevel", "error", "-y",
        "-i", absolutePath,
        "-vf", "scale='min(1280,iw)':'-2'",
        "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "96k",
        "-movflags", "+faststart",
        tempPath,
      ]);
      let stderr = "";
      proc.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
      proc.on("error", reject);
      proc.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg exit ${code}: ${stderr.slice(-400) || "unknown"}`));
      });
    });

    const buffer = await readFile(tempPath);
    const originalSize = (await stat(absolutePath)).size;
    const proxyName = originalFileName.replace(/\.[^.]+$/, "") + "-proxy.mp4";

    return {
      buffer,
      fileName: proxyName,
      contentType: "video/mp4",
      originalSize,
      proxySize: buffer.length,
      preset: VIDEO_PROXY_PRESET,
    };
  } finally {
    await unlink(tempPath).catch(() => {});
  }
}

export async function importHarvestLocalMotionFilesToEmpathyLedger(input: {
  paths: string[];
  recipe: HarvestUploadRecipe;
  uploadedBy: number | null;
}): Promise<{ uploaded: UploadResult[]; failed: Array<{ fileName: string; error: string }> }> {
  const available = await listHarvestLocalMotionFiles();
  const byPath = new Map(available.map((file) => [file.relativePath, file]));
  const selected = input.paths.map((path) => byPath.get(path)).filter(Boolean) as LocalHarvestMotionFile[];

  if (selected.length !== input.paths.length) {
    throw new Error("One or more selected video files are no longer available in the codebase.");
  }

  const sources: HarvestUploadSource[] = [];
  const failed: Array<{ fileName: string; error: string }> = [];

  for (const file of selected) {
    const absolutePath = join(process.cwd(), file.relativePath);
    const shouldCompress = file.kind === "video" && file.size >= VIDEO_PROXY_SIZE_THRESHOLD;

    if (!shouldCompress) {
      sources.push({
        fileName: file.fileName,
        contentType: file.contentType,
        absolutePath,
        sourcePath: file.relativePath,
      });
      continue;
    }

    try {
      const proxy = await compressVideoToProxy(absolutePath, file.fileName);
      sources.push({
        fileName: proxy.fileName,
        contentType: proxy.contentType,
        base64Data: proxy.buffer.toString("base64"),
        sourcePath: file.relativePath,
        proxyMetadata: {
          originalFileName: file.fileName,
          originalSize: proxy.originalSize,
          proxySize: proxy.proxySize,
          preset: proxy.preset,
        },
      });
    } catch (error) {
      failed.push({
        fileName: file.fileName,
        error: `proxy compression failed: ${(error as Error).message}`,
      });
    }
  }

  if (sources.length === 0) {
    return { uploaded: [], failed };
  }

  const upload = await uploadHarvestMediaSourcesToEmpathyLedger({
    files: sources,
    recipe: input.recipe,
    uploadedBy: input.uploadedBy,
  });

  return {
    uploaded: upload.uploaded,
    failed: [...failed, ...upload.failed],
  };
}
