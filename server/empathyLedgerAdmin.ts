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

// ---------------------------------------------------------------------------
// Harvest storytellers + their stories / articles / media
// ---------------------------------------------------------------------------

// Source of truth: the project_storytellers join in EL. Whoever is added to
// the Harvest project in EL admin shows up here automatically.
export type HarvestStorytellerSummary = {
  id: string;
  profileId: string | null;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  isActive: boolean;
  // From project_storytellers join
  projectRole: string | null;
  projectStatus: string | null;
  joinedAt: string | null;
  stories: Array<{
    id: string;
    title: string | null;
    isPublic: boolean;
    projectId: string | null;
    createdAt: string | null;
    isHarvestProject: boolean;
  }>;
  articles: Array<{
    id: string;
    title: string | null;
    slug: string | null;
    status: string | null;
    primaryProject: string | null;
    relatedProjects: string[] | null;
    publishedAt: string | null;
    isHarvestTagged: boolean;
  }>;
  transcripts: Array<{
    id: string;
    title: string | null;
    recordingDate: string | null;
    durationSeconds: number | null;
    wordCount: number | null;
    processingStatus: string | null;
  }>;
  mediaCount: number;
};

export type HarvestProjectStats = {
  storytellerCount: number;
  storyCount: number;
  transcriptCount: number;
  // Three different photo views — EL counts them differently in different places.
  mediaByProjectId: number;
  mediaByGalleryAssoc: number;
  mediaByCollectionId: number;
};

export async function getHarvestProjectStats(): Promise<HarvestProjectStats> {
  const { supabase } = await createElAdminContext();
  const [stCount, storyCount, transcriptCount, byProject, byAssoc, byCollection] = await Promise.all([
    supabase.from("project_storytellers").select("id", { count: "exact", head: true }).eq("project_id", HARVEST_PROJECT_ID),
    supabase.from("stories").select("id", { count: "exact", head: true }).eq("project_id", HARVEST_PROJECT_ID),
    supabase.from("transcripts").select("id", { count: "exact", head: true }).eq("project_id", HARVEST_PROJECT_ID),
    supabase.from("media_assets").select("id", { count: "exact", head: true }).eq("project_id", HARVEST_PROJECT_ID),
    supabase.from("gallery_media_associations").select("id", { count: "exact", head: true }).eq("gallery_id", HARVEST_GALLERY_ID),
    supabase.from("media_assets").select("id", { count: "exact", head: true }).eq("collection_id", HARVEST_GALLERY_ID),
  ]);
  return {
    storytellerCount: stCount.count ?? 0,
    storyCount: storyCount.count ?? 0,
    transcriptCount: transcriptCount.count ?? 0,
    mediaByProjectId: byProject.count ?? 0,
    mediaByGalleryAssoc: byAssoc.count ?? 0,
    mediaByCollectionId: byCollection.count ?? 0,
  };
}

export async function listHarvestStorytellersWithContent(): Promise<HarvestStorytellerSummary[]> {
  const { supabase } = await createElAdminContext();

  // 1) Pull project_storytellers join (this is what EL admin shows under People).
  const { data: links, error: linkErr } = await supabase
    .from("project_storytellers")
    .select("storyteller_id, role, status, joined_at, storytellers(id, profile_id, display_name, bio, public_avatar_url, location, is_active)")
    .eq("project_id", HARVEST_PROJECT_ID);
  if (linkErr) throw linkErr;
  if (!links || links.length === 0) return [];

  type LinkRow = {
    storyteller_id: string;
    role: string | null;
    status: string | null;
    joined_at: string | null;
    storytellers: {
      id: string;
      profile_id: string | null;
      display_name: string | null;
      bio: string | null;
      public_avatar_url: string | null;
      location: string | null;
      is_active: boolean | null;
    } | null;
  };

  const rows = (links as unknown as LinkRow[]).filter((r) => r.storytellers !== null);
  const ids = rows.map((r) => r.storytellers!.id);
  const profileIds = rows.map((r) => r.storytellers!.profile_id).filter(Boolean) as string[];
  const allAuthorIds = [...ids, ...profileIds];

  // 2) Stories — author_id may reference either storyteller_id or profile_id (data is mixed).
  const { data: storyRows } = await supabase
    .from("stories")
    .select("id, title, is_public, project_id, created_at, author_id")
    .in("author_id", allAuthorIds);

  // 3) Articles authored by these storytellers (formal link only).
  const { data: articleRows } = await supabase
    .from("articles")
    .select("id, title, slug, status, primary_project, related_projects, published_at, author_storyteller_id")
    .in("author_storyteller_id", ids);

  // 4) Transcripts. EL doesn't store author_id on transcripts the same way,
  // so we surface them at the project level — if any show metadata that
  // includes a storyteller name/email, we attach. Else they appear as
  // "unattributed" via getHarvestProjectStats.
  const { data: transcriptRows } = await supabase
    .from("transcripts")
    .select("id, title, recording_date, duration_seconds, word_count, processing_status, metadata")
    .eq("project_id", HARVEST_PROJECT_ID);

  // 5) Media uploads by linked profiles, scoped to the Harvest project.
  const mediaCounts = new Map<string, number>();
  if (profileIds.length > 0) {
    const { data: mediaRows } = await supabase
      .from("media_assets")
      .select("uploader_id")
      .in("uploader_id", profileIds)
      .eq("project_id", HARVEST_PROJECT_ID);
    for (const row of (mediaRows ?? []) as Array<{ uploader_id: string | null }>) {
      if (!row.uploader_id) continue;
      mediaCounts.set(row.uploader_id, (mediaCounts.get(row.uploader_id) ?? 0) + 1);
    }
  }

  return rows.map((r): HarvestStorytellerSummary => {
    const s = r.storytellers!;
    const profId = s.profile_id;
    const stories = (storyRows ?? [])
      .filter((row: any) => row.author_id === s.id || (profId && row.author_id === profId))
      .map((row: any) => ({
        id: row.id,
        title: row.title,
        isPublic: !!row.is_public,
        projectId: row.project_id,
        createdAt: row.created_at,
        isHarvestProject: row.project_id === HARVEST_PROJECT_ID,
      }));
    const articles = (articleRows ?? [])
      .filter((row: any) => row.author_storyteller_id === s.id)
      .map((row: any) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        status: row.status,
        primaryProject: row.primary_project,
        relatedProjects: row.related_projects,
        publishedAt: row.published_at,
        isHarvestTagged:
          row.primary_project === "the-harvest" ||
          (Array.isArray(row.related_projects) && row.related_projects.includes("the-harvest")),
      }));
    // Best-effort transcript attribution by display_name match in title or metadata.
    const nameToken = (s.display_name ?? "").toLowerCase().split(/\s+/).filter(Boolean)[0];
    const transcripts = nameToken
      ? (transcriptRows ?? [])
          .filter((row: any) => {
            const t = (row.title ?? "").toLowerCase();
            const m = JSON.stringify(row.metadata ?? {}).toLowerCase();
            return t.includes(nameToken) || m.includes(nameToken);
          })
          .map((row: any) => ({
            id: row.id,
            title: row.title,
            recordingDate: row.recording_date,
            durationSeconds: row.duration_seconds,
            wordCount: row.word_count,
            processingStatus: row.processing_status,
          }))
      : [];

    return {
      id: s.id,
      profileId: profId,
      displayName: s.display_name,
      bio: s.bio,
      avatarUrl: s.public_avatar_url,
      location: s.location,
      isActive: !!s.is_active,
      projectRole: r.role,
      projectStatus: r.status,
      joinedAt: r.joined_at,
      stories,
      articles,
      transcripts,
      mediaCount: profId ? mediaCounts.get(profId) ?? 0 : 0,
    };
  });
}

// Orphaned candidates: articles whose title/slug suggests Harvest content but
// that aren't formally tagged (primary_project != "the-harvest" AND not in
// related_projects). Includes Sophie's published article which was tagged with
// a work slug ("the-garden") instead of the actual project slug.
export type HarvestOrphanArticle = {
  id: string;
  title: string | null;
  slug: string | null;
  status: string | null;
  authorName: string | null;
  authorStorytellerId: string | null;
  primaryProject: string | null;
  relatedProjects: string[] | null;
  publishedAt: string | null;
};

export async function listOrphanedHarvestArticles(): Promise<HarvestOrphanArticle[]> {
  const { supabase } = await createElAdminContext();
  // Pull a wider candidate set then filter in memory; PostgREST `or` syntax
  // doesn't compose cleanly for "matches name OR matches slug AND not tagged".
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, slug, status, author_name, author_storyteller_id, primary_project, related_projects, published_at")
    .or("slug.ilike.%harvest%,slug.ilike.%sophie%,slug.ilike.%barry%,slug.ilike.%garden%,slug.ilike.%milk-crate%,slug.ilike.%witta%,title.ilike.%harvest%,author_name.ilike.%harvest%");
  if (error) throw error;
  return (data ?? [])
    .filter((row: any) => {
      const isTagged =
        row.primary_project === "the-harvest" ||
        (Array.isArray(row.related_projects) && row.related_projects.includes("the-harvest"));
      return !isTagged;
    })
    .map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      status: row.status,
      authorName: row.author_name,
      authorStorytellerId: row.author_storyteller_id,
      primaryProject: row.primary_project,
      relatedProjects: row.related_projects,
      publishedAt: row.published_at,
    }));
}

// One-shot fix-up: tag an article's primary_project to "the-harvest" so it
// surfaces in the public Harvest articles feed. If primary_project already
// has a different value, that value is preserved by being added to
// related_projects so we don't lose work-slug categorization.
export async function tagArticleAsHarvest(articleId: string): Promise<{ updated: boolean; before: string | null; preservedInRelated: string | null }> {
  const { supabase } = await createElAdminContext();
  const { data: existing, error: readErr } = await supabase
    .from("articles")
    .select("id, primary_project, related_projects")
    .eq("id", articleId)
    .maybeSingle();
  if (readErr) throw readErr;
  if (!existing) throw new Error(`Article ${articleId} not found in Empathy Ledger.`);

  if (existing.primary_project === "the-harvest") {
    return { updated: false, before: existing.primary_project, preservedInRelated: null };
  }

  const previousPrimary = existing.primary_project as string | null;
  const currentRelated = Array.isArray(existing.related_projects) ? existing.related_projects : [];
  const nextRelated =
    previousPrimary && !currentRelated.includes(previousPrimary)
      ? [...currentRelated, previousPrimary]
      : currentRelated;

  const { error: updateErr } = await supabase
    .from("articles")
    .update({
      primary_project: "the-harvest",
      related_projects: nextRelated,
      updated_at: new Date().toISOString(),
    })
    .eq("id", articleId);
  if (updateErr) throw updateErr;

  return {
    updated: true,
    before: previousPrimary,
    preservedInRelated: previousPrimary && !currentRelated.includes(previousPrimary) ? previousPrimary : null,
  };
}

// Claim an orphan article by linking it to a Harvest project storyteller.
// Sets author_storyteller_id and switches author_type to "storyteller".
// Validates the storyteller is actually on the Harvest project_storytellers join.
export async function claimArticleForStoryteller(input: {
  articleId: string;
  storytellerId: string;
}): Promise<{ updated: boolean; before: string | null }> {
  const { supabase } = await createElAdminContext();
  const { data: link } = await supabase
    .from("project_storytellers")
    .select("id")
    .eq("project_id", HARVEST_PROJECT_ID)
    .eq("storyteller_id", input.storytellerId)
    .maybeSingle();
  if (!link) {
    throw new Error(`Storyteller ${input.storytellerId} is not on the Harvest project_storytellers join.`);
  }
  const { data: existing, error: readErr } = await supabase
    .from("articles")
    .select("id, author_storyteller_id")
    .eq("id", input.articleId)
    .maybeSingle();
  if (readErr) throw readErr;
  if (!existing) throw new Error(`Article ${input.articleId} not found.`);

  if (existing.author_storyteller_id === input.storytellerId) {
    return { updated: false, before: existing.author_storyteller_id };
  }

  const { error: updateErr } = await supabase
    .from("articles")
    .update({
      author_storyteller_id: input.storytellerId,
      author_type: "storyteller",
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.articleId);
  if (updateErr) throw updateErr;

  return { updated: true, before: existing.author_storyteller_id };
}
