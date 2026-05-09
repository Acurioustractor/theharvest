import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { basename, extname, relative, resolve } from "node:path";
import { readdirSync, readFileSync, statSync } from "node:fs";

type BatchKey =
  | "milk-crate-delivery"
  | "garden-progress"
  | "sophie-garden"
  | "pavilion-build"
  | "details-textures"
  | "human-making";

type BatchMapping = {
  key: BatchKey;
  title: string;
  projectSlug: "milk-crate-pavilion" | "the-garden";
  workSlug: "milk-crate-pavilion" | "the-garden";
  themeSlugs: Array<"make" | "gather" | "grow">;
  categorySlug: "during" | "milestone";
  specialSlugs?: Array<"featured">;
  requiresConsent?: boolean;
};

const HARVEST_GALLERY_ID = "5fa1593e-7d73-477a-9a34-64d2f3ff86cc";
const STORAGE_BUCKET = "media";
const DEFAULT_SOURCE = "/Users/benknight/Pictures/Manual Library/Harvest May 25/Exported Photos";
const EL_ENV_PATH = "/Users/benknight/Code/empathy-ledger-v2/.env.local";

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const check = args.has("--check") || apply;
const sourceFlagIdx = process.argv.indexOf("--source");
const sourceDir = sourceFlagIdx > -1 ? process.argv[sourceFlagIdx + 1] : DEFAULT_SOURCE;
const limitFlagIdx = process.argv.indexOf("--limit");
const limit = limitFlagIdx > -1 ? Number(process.argv[limitFlagIdx + 1]) : null;

dotenv.config({ path: ".env.local", override: false });
dotenv.config({ path: ".env", override: false });
dotenv.config({ path: EL_ENV_PATH, override: true });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const imageExts = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const batches: Record<BatchKey, BatchMapping> = {
  "milk-crate-delivery": {
    key: "milk-crate-delivery",
    title: "Milk crate delivery",
    projectSlug: "milk-crate-pavilion",
    workSlug: "milk-crate-pavilion",
    themeSlugs: ["make", "gather"],
    categorySlug: "during",
  },
  "garden-progress": {
    key: "garden-progress",
    title: "Garden progress",
    projectSlug: "the-garden",
    workSlug: "the-garden",
    themeSlugs: ["grow", "gather"],
    categorySlug: "during",
  },
  "sophie-garden": {
    key: "sophie-garden",
    title: "Sophie garden story",
    projectSlug: "the-garden",
    workSlug: "the-garden",
    themeSlugs: ["grow", "gather"],
    categorySlug: "during",
    specialSlugs: ["featured"],
    requiresConsent: true,
  },
  "pavilion-build": {
    key: "pavilion-build",
    title: "Milk crate pavilion build",
    projectSlug: "milk-crate-pavilion",
    workSlug: "milk-crate-pavilion",
    themeSlugs: ["make", "gather"],
    categorySlug: "milestone",
    specialSlugs: ["featured"],
  },
  "details-textures": {
    key: "details-textures",
    title: "Pavilion details and textures",
    projectSlug: "milk-crate-pavilion",
    workSlug: "milk-crate-pavilion",
    themeSlugs: ["make"],
    categorySlug: "during",
  },
  "human-making": {
    key: "human-making",
    title: "People making the pavilion",
    projectSlug: "milk-crate-pavilion",
    workSlug: "milk-crate-pavilion",
    themeSlugs: ["make", "gather"],
    categorySlug: "during",
    requiresConsent: true,
  },
};

function imageNumber(filePath: string): number {
  const match = basename(filePath).match(/1E5A(\d{4})/);
  if (!match) throw new Error(`Could not parse image number from ${filePath}`);
  return Number(match[1]);
}

function mapBatch(filePath: string): BatchMapping {
  const n = imageNumber(filePath);

  if (n >= 4538 && n <= 4551) return batches["milk-crate-delivery"];
  if ((n >= 4554 && n <= 4569) || (n >= 4571 && n <= 4597)) {
    if (n >= 4585 && n <= 4597) return batches["sophie-garden"];
    return batches["garden-progress"];
  }
  if (n >= 4602 && n <= 4658) return batches["pavilion-build"];
  if (n >= 4664 && n <= 4690) return batches["sophie-garden"];
  if ([4697, 4701, 4703, 4707, 4708].includes(n)) return batches["details-textures"];
  if ([4710, 4711, 4712, 4726, 4729, 4731, 4741].includes(n)) return batches["human-making"];
  if (n >= 4693 && n <= 4752) return batches["pavilion-build"];

  return batches["pavilion-build"];
}

function walk(dir: string): string[] {
  return readdirSync(dir)
    .map((entry) => resolve(dir, entry))
    .filter((fullPath) => statSync(fullPath).isFile())
    .filter((fullPath) => imageExts.has(extname(fullPath).toLowerCase()))
    .sort((a, b) => imageNumber(a) - imageNumber(b));
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

function titleFor(filePath: string, batch: BatchMapping): string {
  return `${batch.title} ${imageNumber(filePath)}`;
}

function altFor(filePath: string, batch: BatchMapping): string {
  const n = imageNumber(filePath);
  if (batch.key === "sophie-garden") return `Sophie and the garden at The Harvest, image ${n}.`;
  if (batch.key === "garden-progress") return `Garden progress at The Harvest, image ${n}.`;
  if (batch.key === "milk-crate-delivery") return `Milk crate delivery for The Harvest pavilion, image ${n}.`;
  if (batch.key === "details-textures") return `Close detail from the milk crate pavilion build, image ${n}.`;
  if (batch.key === "human-making") return `People working on the milk crate pavilion at The Harvest, image ${n}.`;
  return `Milk crate pavilion build progress at The Harvest, image ${n}.`;
}

function summarize(files: string[]) {
  const counts = new Map<BatchKey, number>();
  for (const file of files) {
    const batch = mapBatch(file);
    counts.set(batch.key, (counts.get(batch.key) ?? 0) + 1);
  }
  return counts;
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
  const allFiles = walk(sourceDir);
  const files = limit ? allFiles.slice(0, limit) : allFiles;
  const counts = summarize(files);

  console.log(`${apply ? "APPLY" : check ? "CHECK" : "LOCAL DRY RUN"} Harvest May photo upload to Empathy Ledger`);
  console.log(`Source: ${sourceDir}`);
  console.log(`Files: ${files.length}${limit ? ` of ${allFiles.length}` : ""}\n`);

  for (const [key, count] of counts) {
    const batch = batches[key];
    console.log(`${count.toString().padStart(2, " ")}  ${batch.title} -> ${batch.workSlug}, ${batch.themeSlugs.join(", ")}, ${batch.categorySlug}${batch.requiresConsent ? ", requires consent review" : ""}`);
  }

  console.log("\nSample mapping:");
  for (const file of files.slice(0, 8)) {
    const batch = mapBatch(file);
    console.log(`- ${basename(file)} -> ${batch.title}`);
  }
  console.log("...");
  for (const file of files.slice(-8)) {
    const batch = mapBatch(file);
    console.log(`- ${basename(file)} -> ${batch.title}`);
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

  const projectSlugs = [...new Set(Object.values(batches).map((batch) => batch.projectSlug))];
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id, slug")
    .in("slug", projectSlugs);
  if (projectsError) throw projectsError;
  const projectIdBySlug = new Map((projects ?? []).map((project) => [project.slug, project.id]));

  const tagCategories = ["harvest-work", "harvest-theme", "harvest-category", "harvest-special"];
  const { data: tags, error: tagsError } = await supabase
    .from("tags")
    .select("id, slug, category")
    .in("category", tagCategories);
  if (tagsError) throw tagsError;
  const tagIdByKey = new Map((tags ?? []).map((tag) => [`${tag.category}:${tag.slug}`, tag.id]));

  const wantedTagKeys = new Set<string>();
  for (const batch of Object.values(batches)) {
    wantedTagKeys.add(`harvest-work:${batch.workSlug}`);
    wantedTagKeys.add(`harvest-category:${batch.categorySlug}`);
    for (const slug of batch.themeSlugs) wantedTagKeys.add(`harvest-theme:${slug}`);
    for (const slug of batch.specialSlugs ?? []) wantedTagKeys.add(`harvest-special:${slug}`);
  }
  const missingTags = [...wantedTagKeys].filter((key) => !tagIdByKey.has(key));

  console.log(`\nGallery: ${gallery.title}`);
  console.log(`Projects found: ${projectIdBySlug.size}/${projectSlugs.length} (optional; harvest-work tags are primary)`);
  console.log(`Tags found: ${tagIdByKey.size}`);
  if (missingTags.length) console.log(`Missing tags: ${missingTags.join(", ")}`);
  if (missingTags.length) throw new Error("Missing required EL tags");

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
    const existing = existingByName.get(basename(file));
    return existing && existing.size === statSync(file).size;
  }).length;
  console.log(`Existing exact duplicates in gallery: ${duplicateCount}`);

  if (!apply) {
    console.log("\nNo writes made. Re-run with --apply to upload and tag.");
    return;
  }

  async function attachTags(mediaAssetId: string, batch: BatchMapping): Promise<void> {
    const tagKeys = [
      `harvest-work:${batch.workSlug}`,
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
    const fname = basename(file);
    const ext = extname(fname);
    const size = statSync(file).size;
    const existing = existingByName.get(fname);
    if (existing && existing.size === size) {
      const batch = mapBatch(file);
      await attachTags(existing.id, batch);
      console.log(`Tagged existing ${fname} -> ${batch.title}`);
      skipped++;
      continue;
    }

    const batch = mapBatch(file);
    const projectId = projectIdBySlug.get(batch.projectSlug);
    let phase = "start";

    try {
      phase = "storage upload";
      const storagePath = `galleries/${HARVEST_GALLERY_ID}/harvest-may-2026/${Date.now()}-${fname.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const fileBytes = readFileSync(file);
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, fileBytes, {
          contentType: mimeFromExt(ext),
          upsert: false,
        });
      if (uploadError) throw uploadError;

      phase = "media_assets insert";
      const publicUrl = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath).data.publicUrl;
      const rel = relative(sourceDir, file);
      const { data: asset, error: assetError } = await supabase
        .from("media_assets")
        .insert({
          original_filename: fname,
          display_name: titleFor(file, batch),
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
          project_id: projectId ?? null,
          title: titleFor(file, batch),
          alt_text: altFor(file, batch),
          description: `${batch.title}. Source: ${rel}`,
          source_type: "harvest-lightroom-export",
          requires_consent: Boolean(batch.requiresConsent),
          consent_obtained: !batch.requiresConsent,
          metadata: {
            harvestBatch: batch.key,
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
          sort_order: imageNumber(file),
        });
      if (galleryAssocError) throw galleryAssocError;

      phase = "media_tags insert";
      await attachTags(asset.id, batch);

      uploaded++;
      console.log(`Uploaded ${fname} -> ${batch.title}`);
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
