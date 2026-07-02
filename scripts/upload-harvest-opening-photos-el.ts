/**
 * Upload opening-weekend (and since) photos to the Empathy Ledger Harvest gallery.
 *
 * Cloned from upload-harvest-may-photos-el.ts (the 98-photo May run) with three changes:
 *  1. Batches map from SUBFOLDER names, not camera frame numbers, so phone photos work.
 *  2. iPhone .heic files are converted to jpeg via macOS `sips` before upload.
 *  3. Video files (.mp4/.mov) are listed but NOT uploaded (EL galleries render images;
 *     video stays in the repo until the EL video pipeline is a real build item).
 *
 * Source folder layout (any subset of these subfolders; loose files = opening-day):
 *   ~/Pictures/Manual Library/Harvest Opening 2026-06/
 *     opening-day/   people at the 20 June day     -> milestone, consent review required
 *     featured/      the hero-grade picks          -> milestone + featured, consent review
 *     site/          the place, no people          -> during, gather
 *     garden/        beds, seedlings, soil         -> the-garden, grow
 *     pavilion/      milk crate pavilion           -> milk-crate-pavilion, make
 *     shop/          shelves, produce, signage     -> the-shop (tag may need creating), make
 *     people/        portraits and hands           -> during, consent review required
 *     video/         parked, reported only
 *
 * Dry run by default. --check verifies EL tags + duplicates. --apply uploads.
 *   npx tsx scripts/upload-harvest-opening-photos-el.ts
 *   npx tsx scripts/upload-harvest-opening-photos-el.ts --source "/path/to/folder" --check
 *   npx tsx scripts/upload-harvest-opening-photos-el.ts --apply
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { execSync } from "node:child_process";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";

type BatchKey =
  | "opening-day"
  | "featured"
  | "site"
  | "garden"
  | "pavilion"
  | "shop"
  | "people";

type BatchMapping = {
  key: BatchKey;
  title: string;
  workSlug?: "milk-crate-pavilion" | "the-garden" | "the-shop";
  themeSlugs: Array<"make" | "gather" | "grow">;
  categorySlug: "during" | "milestone";
  specialSlugs?: Array<"featured">;
  requiresConsent?: boolean;
};

const HARVEST_GALLERY_ID = "5fa1593e-7d73-477a-9a34-64d2f3ff86cc";
const STORAGE_BUCKET = "media";
const DEFAULT_SOURCE = `${process.env.HOME}/Pictures/Manual Library/Harvest Opening 2026-06`;
const EL_ENV_PATH = "/Users/benknight/Code/empathy-ledger-v2/.env.local";
const STORAGE_PREFIX = "harvest-opening-2026-06";

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const check = args.has("--check") || apply;
const sourceFlagIdx = process.argv.indexOf("--source");
const sourceDir = sourceFlagIdx > -1 ? resolve(process.argv[sourceFlagIdx + 1]) : DEFAULT_SOURCE;
const limitFlagIdx = process.argv.indexOf("--limit");
const limit = limitFlagIdx > -1 ? Number(process.argv[limitFlagIdx + 1]) : null;

dotenv.config({ path: ".env.local", override: false });
dotenv.config({ path: ".env", override: false });
dotenv.config({ path: EL_ENV_PATH, override: true });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const imageExts = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const heicExts = new Set([".heic", ".heif"]);
const videoExts = new Set([".mp4", ".mov", ".m4v"]);
const CONVERTED_DIR = "_converted";

const batches: Record<BatchKey, BatchMapping> = {
  "opening-day": {
    key: "opening-day",
    title: "Opening day, 20 June 2026",
    themeSlugs: ["gather", "make", "grow"],
    categorySlug: "milestone",
    requiresConsent: true,
  },
  featured: {
    key: "featured",
    title: "Opening day featured",
    themeSlugs: ["gather"],
    categorySlug: "milestone",
    specialSlugs: ["featured"],
    requiresConsent: true,
  },
  site: {
    key: "site",
    title: "The place as it stands",
    themeSlugs: ["gather"],
    categorySlug: "during",
  },
  garden: {
    key: "garden",
    title: "Garden progress",
    workSlug: "the-garden",
    themeSlugs: ["grow"],
    categorySlug: "during",
  },
  pavilion: {
    key: "pavilion",
    title: "Milk crate pavilion",
    workSlug: "milk-crate-pavilion",
    themeSlugs: ["make"],
    categorySlug: "during",
  },
  shop: {
    key: "shop",
    title: "The shop taking shape",
    workSlug: "the-shop",
    themeSlugs: ["make"],
    categorySlug: "during",
  },
  people: {
    key: "people",
    title: "People at The Harvest",
    themeSlugs: ["gather"],
    categorySlug: "during",
    requiresConsent: true,
  },
};

type SourceFile = {
  /** file actually uploaded (converted jpeg for HEIC) */
  uploadPath: string;
  /** original file the user dropped in */
  originalPath: string;
  batch: BatchMapping;
  index: number;
};

function batchForSubfolder(name: string): BatchMapping {
  const key = name.toLowerCase() as BatchKey;
  return batches[key] ?? batches["opening-day"];
}

function convertHeic(filePath: string): string {
  const outDir = join(dirname(filePath), CONVERTED_DIR);
  mkdirSync(outDir, { recursive: true });
  const stem = basename(filePath).replace(/\.[^.]+$/, "");
  const outPath = join(outDir, `${stem}.jpg`);
  if (!existsSync(outPath)) {
    execSync(`sips -s format jpeg ${JSON.stringify(filePath)} --out ${JSON.stringify(outPath)}`, {
      stdio: "pipe",
    });
  }
  return outPath;
}

function collectFiles(): { files: SourceFile[]; videos: string[]; ignored: string[] } {
  if (!existsSync(sourceDir)) {
    console.error(`Source folder does not exist yet: ${sourceDir}`);
    console.error("Create it (subfolders optional), drop the photos in, and re-run.");
    process.exit(1);
  }
  const videos: string[] = [];
  const ignored: string[] = [];
  const files: SourceFile[] = [];
  let index = 0;

  const entries = readdirSync(sourceDir).sort();
  const addFile = (fullPath: string, batch: BatchMapping) => {
    const ext = extname(fullPath).toLowerCase();
    if (videoExts.has(ext)) {
      videos.push(fullPath);
      return;
    }
    if (heicExts.has(ext)) {
      files.push({ uploadPath: apply || check ? convertHeic(fullPath) : fullPath, originalPath: fullPath, batch, index: index++ });
      return;
    }
    if (imageExts.has(ext)) {
      files.push({ uploadPath: fullPath, originalPath: fullPath, batch, index: index++ });
      return;
    }
    ignored.push(fullPath);
  };

  for (const entry of entries) {
    const fullPath = resolve(sourceDir, entry);
    const stat = statSync(fullPath);
    if (stat.isFile()) {
      if (entry.startsWith(".")) continue;
      addFile(fullPath, batches["opening-day"]);
    } else if (stat.isDirectory()) {
      if (entry === CONVERTED_DIR) continue;
      if (entry.toLowerCase() === "video") {
        for (const sub of readdirSync(fullPath).sort()) {
          const p = resolve(fullPath, sub);
          if (statSync(p).isFile() && !sub.startsWith(".")) videos.push(p);
        }
        continue;
      }
      const batch = batchForSubfolder(entry);
      for (const sub of readdirSync(fullPath).sort()) {
        const p = resolve(fullPath, sub);
        if (statSync(p).isFile() && !sub.startsWith(".")) addFile(p, batch);
      }
    }
  }
  return { files, videos, ignored };
}

function mimeFromExt(ext: string): string {
  switch (ext.toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

function titleFor(file: SourceFile): string {
  return `${file.batch.title} ${String(file.index + 1).padStart(3, "0")}`;
}

function altFor(file: SourceFile): string {
  switch (file.batch.key) {
    case "opening-day":
    case "featured":
      return "The first members and makers day at The Harvest, 20 June 2026.";
    case "site":
      return "The Harvest site in Witta, on Jinibara Country.";
    case "garden":
      return "Garden progress at The Harvest.";
    case "pavilion":
      return "The milk crate pavilion at The Harvest.";
    case "shop":
      return "The Harvest shop taking shape.";
    case "people":
      return "People at The Harvest.";
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
}

async function main() {
  const { files: allFiles, videos, ignored } = collectFiles();
  const files = limit ? allFiles.slice(0, limit) : allFiles;

  console.log(`${apply ? "APPLY" : check ? "CHECK" : "LOCAL DRY RUN"} Harvest opening photo upload to Empathy Ledger`);
  console.log(`Source: ${sourceDir}`);
  console.log(`Photos: ${files.length}${limit ? ` of ${allFiles.length}` : ""}`);
  if (videos.length) {
    console.log(`Videos (parked, NOT uploaded, keep local or plan the EL video build):`);
    for (const v of videos) console.log(`  - ${relative(sourceDir, v)}`);
  }
  if (ignored.length) console.log(`Ignored (unsupported type): ${ignored.map((f) => relative(sourceDir, f)).join(", ")}`);

  const counts = new Map<BatchKey, number>();
  for (const file of files) counts.set(file.batch.key, (counts.get(file.batch.key) ?? 0) + 1);
  console.log("");
  for (const [key, count] of counts) {
    const batch = batches[key];
    console.log(
      `${count.toString().padStart(3, " ")}  ${batch.title} -> ${batch.workSlug ?? "(no work tag)"}, ${batch.themeSlugs.join(", ")}, ${batch.categorySlug}${batch.requiresConsent ? ", consent review before public" : ""}`,
    );
  }

  console.log("\nSample mapping:");
  for (const file of files.slice(0, 6)) {
    console.log(`- ${relative(sourceDir, file.originalPath)} -> ${file.batch.title}`);
  }

  if (!check) {
    console.log("\nNo database or storage calls made. Re-run with --check to verify EL tags and duplicates, or --apply to upload.");
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error(`Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Checked ${EL_ENV_PATH}`);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: gallery, error: galleryError } = await supabase
    .from("galleries")
    .select("id, title, organization_id, created_by")
    .eq("id", HARVEST_GALLERY_ID)
    .maybeSingle();
  if (galleryError) throw galleryError;
  if (!gallery) throw new Error(`Harvest gallery ${HARVEST_GALLERY_ID} not found`);

  const { data: ownerProfile, error: ownerError } = await supabase
    .from("profiles")
    .select("id, tenant_id")
    .eq("id", gallery.created_by)
    .maybeSingle();
  if (ownerError) throw ownerError;
  if (!ownerProfile?.tenant_id || !gallery.created_by) throw new Error("Could not resolve gallery owner tenant/uploader");

  const tagCategories = ["harvest-work", "harvest-theme", "harvest-category", "harvest-special"];
  const { data: tags, error: tagsError } = await supabase
    .from("tags")
    .select("id, slug, category")
    .in("category", tagCategories);
  if (tagsError) throw tagsError;
  const tagIdByKey = new Map((tags ?? []).map((tag) => [`${tag.category}:${tag.slug}`, tag.id]));

  const wantedTagKeys = new Set<string>();
  for (const batch of Object.values(batches)) {
    if (batch.workSlug) wantedTagKeys.add(`harvest-work:${batch.workSlug}`);
    wantedTagKeys.add(`harvest-category:${batch.categorySlug}`);
    for (const slug of batch.themeSlugs) wantedTagKeys.add(`harvest-theme:${slug}`);
    for (const slug of batch.specialSlugs ?? []) wantedTagKeys.add(`harvest-special:${slug}`);
  }
  const missingTags = [...wantedTagKeys].filter((key) => !tagIdByKey.has(key));

  console.log(`\nGallery: ${gallery.title}`);
  console.log(`Tags found: ${tagIdByKey.size}`);
  if (missingTags.length) {
    console.log(`Missing tags (photos still upload; these tags are simply skipped): ${missingTags.join(", ")}`);
    const criticalMissing = missingTags.filter((key) => !key.startsWith("harvest-work:"));
    if (criticalMissing.length) {
      throw new Error(`Missing non-work EL tags, create these first: ${criticalMissing.join(", ")}`);
    }
  }

  const { data: existingAssocs, error: assocLoadError } = await supabase
    .from("gallery_media_associations")
    .select("media_asset_id")
    .eq("gallery_id", HARVEST_GALLERY_ID);
  if (assocLoadError) throw assocLoadError;

  const existingIds = (existingAssocs ?? []).map((assoc) => assoc.media_asset_id);
  const existingByName = new Map<string, { id: string; size: number }>();
  if (existingIds.length > 0) {
    const { data: existingAssets, error: existingError } = await supabase
      .from("media_assets")
      .select("id, original_filename, file_size")
      .in("id", existingIds);
    if (existingError) throw existingError;
    for (const asset of existingAssets ?? []) {
      existingByName.set(asset.original_filename, { id: asset.id, size: Number(asset.file_size) });
    }
  }

  const duplicateCount = files.filter((file) => {
    const existing = existingByName.get(basename(file.uploadPath));
    return existing && existing.size === statSync(file.uploadPath).size;
  }).length;
  console.log(`Existing exact duplicates in gallery: ${duplicateCount}`);

  if (!apply) {
    console.log("\nNo writes made. Re-run with --apply to upload and tag.");
    return;
  }

  async function attachTags(mediaAssetId: string, batch: BatchMapping): Promise<void> {
    const tagKeys = [
      ...(batch.workSlug ? [`harvest-work:${batch.workSlug}`] : []),
      `harvest-category:${batch.categorySlug}`,
      ...batch.themeSlugs.map((slug) => `harvest-theme:${slug}`),
      ...(batch.specialSlugs ?? []).map((slug) => `harvest-special:${slug}`),
    ];
    const tagRows = tagKeys
      .map((key) => tagIdByKey.get(key))
      .filter((tagId): tagId is string => Boolean(tagId))
      .map((tagId) => ({
        media_asset_id: mediaAssetId,
        tag_id: tagId,
        source: "batch",
        added_by: gallery.created_by,
        confidence: 0.9,
        verified: false,
      }));
    if (tagRows.length > 0) {
      const { error: tagInsertError } = await supabase
        .from("media_tags")
        .upsert(tagRows, {
          onConflict: "media_asset_id,tag_id",
          ignoreDuplicates: true,
        });
      if (tagInsertError) throw tagInsertError;
    }
  }

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const fname = basename(file.uploadPath);
    const ext = extname(fname);
    const size = statSync(file.uploadPath).size;
    const existing = existingByName.get(fname);
    if (existing && existing.size === size) {
      await attachTags(existing.id, file.batch);
      console.log(`Tagged existing ${fname} -> ${file.batch.title}`);
      skipped++;
      continue;
    }

    let phase = "start";
    try {
      phase = "storage upload";
      const storagePath = `galleries/${HARVEST_GALLERY_ID}/${STORAGE_PREFIX}/${Date.now()}-${fname.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const fileBytes = readFileSync(file.uploadPath);
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, fileBytes, {
          contentType: mimeFromExt(ext),
          upsert: false,
        });
      if (uploadError) throw uploadError;

      phase = "media_assets insert";
      const publicUrl = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath).data.publicUrl;
      const rel = relative(sourceDir, file.originalPath);
      const { data: asset, error: assetError } = await supabase
        .from("media_assets")
        .insert({
          original_filename: fname,
          display_name: titleFor(file),
          file_size: size,
          file_type: mimeFromExt(ext),
          mime_type: mimeFromExt(ext),
          media_type: "image",
          storage_bucket: STORAGE_BUCKET,
          storage_path: storagePath,
          cdn_url: publicUrl,
          url: publicUrl,
          processing_status: "completed",
          privacy_level: "public",
          visibility: "public",
          cultural_sensitivity_level: "standard",
          organization_id: gallery.organization_id,
          tenant_id: ownerProfile.tenant_id,
          uploader_id: gallery.created_by,
          uploaded_by: gallery.created_by,
          project_id: null,
          title: titleFor(file),
          alt_text: altFor(file),
          description: `${file.batch.title}. Source: ${rel}`,
          source_type: "harvest-opening-export",
          requires_consent: Boolean(file.batch.requiresConsent),
          consent_obtained: !file.batch.requiresConsent,
          metadata: {
            harvestBatch: file.batch.key,
            harvestSourceFolder: sourceDir,
            harvestOriginalRelativePath: rel,
            uploadPurpose: "communications-library",
          },
        })
        .select("id")
        .single();
      if (assetError) throw assetError;

      phase = "gallery association insert";
      const { error: galleryAssocError } = await supabase
        .from("gallery_media_associations")
        .insert({
          gallery_id: HARVEST_GALLERY_ID,
          media_asset_id: asset.id,
          sort_order: file.index,
        });
      if (galleryAssocError) throw galleryAssocError;

      phase = "media_tags insert";
      await attachTags(asset.id, file.batch);

      uploaded++;
      console.log(`Uploaded ${fname} -> ${file.batch.title}`);
    } catch (error) {
      failed++;
      console.error(`Failed ${fname} during ${phase}: ${errorMessage(error)}`);
    }
  }

  console.log("\nApply summary:");
  console.log(`  uploaded: ${uploaded}`);
  console.log(`  skipped: ${skipped}`);
  console.log(`  failed: ${failed}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
