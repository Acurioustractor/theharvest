import { createClient } from "@supabase/supabase-js";

const BUCKET = "media";
const MIRROR_PREFIX = "harvest-image-mirror";
const inFlight = new Map<string, Promise<string>>();
let empathyLedgerClient: ReturnType<typeof createClient> | null | undefined;

function getStorageClient() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function getEmpathyLedgerClient() {
  if (empathyLedgerClient !== undefined) return empathyLedgerClient;

  const url = process.env.EMPATHY_LEDGER_SUPABASE_URL || process.env.EL_SUPABASE_URL;
  const key =
    process.env.EMPATHY_LEDGER_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.EL_SUPABASE_SERVICE_ROLE_KEY;

  empathyLedgerClient = url && key
    ? createClient(url, key, { auth: { persistSession: false } })
    : null;
  return empathyLedgerClient;
}

/**
 * EL's public API currently returns an internal /api/media/:id/file URL. That
 * endpoint is not browser-loadable in production. Resolve the asset against
 * EL's own media_assets row before copying it into Harvest storage.
 */
async function resolveEmpathyLedgerSource(assetId: string, sourceUrl: string): Promise<string> {
  if (!sourceUrl.includes("/api/media/") || !assetId) return sourceUrl;

  const client = getEmpathyLedgerClient();
  if (!client) return sourceUrl;

  try {
    const { data, error } = await client
      .from("media_assets")
      .select("url")
      .eq("id", assetId)
      .maybeSingle();
    if (error) throw error;
    return (data as { url?: string } | null)?.url || sourceUrl;
  } catch (error) {
    console.error(`[Harvest image mirror] Could not resolve EL asset ${assetId}:`, error);
    return sourceUrl;
  }
}

/** Copy an EL image into Harvest-owned storage once and return its durable URL. */
export async function mirrorHarvestImage(assetId: string, sourceUrl: string): Promise<string> {
  if (!sourceUrl || !/^https?:\/\//i.test(sourceUrl)) return sourceUrl;
  const existing = inFlight.get(assetId);
  if (existing) return existing;

  const promise = mirrorHarvestImageOnce(assetId, sourceUrl);
  inFlight.set(assetId, promise);
  try {
    return await promise;
  } finally {
    inFlight.delete(assetId);
  }
}

async function mirrorHarvestImageOnce(assetId: string, sourceUrl: string): Promise<string> {
  const resolvedSourceUrl = await resolveEmpathyLedgerSource(assetId, sourceUrl);
  const supabase = getStorageClient();
  // Even without Harvest storage credentials, return EL's real public storage
  // object rather than its browser-blocked /api/media proxy URL.
  if (!supabase) return resolvedSourceUrl;

  const safeId = assetId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const basePath = `${MIRROR_PREFIX}/${safeId}`;

  try {
    // Check metadata without transferring the cached image back to the server.
    const { data, error: lookupError } = await supabase.storage.from(BUCKET).info(basePath);
    if (data) return supabase.storage.from(BUCKET).getPublicUrl(basePath).data.publicUrl;
    if (lookupError) {
      const status = "statusCode" in lookupError
        ? String(lookupError.statusCode)
        : "status" in lookupError ? String(lookupError.status) : undefined;
      // Storage can report a missing object as HTTP 400 with statusCode 404.
      if (status !== "404") throw lookupError;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(resolvedSourceUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return resolvedSourceUrl;
    const contentType = response.headers.get("content-type");
    if (!contentType?.startsWith("image/")) return resolvedSourceUrl;

    const buffer = Buffer.from(await response.arrayBuffer());
    const { error } = await supabase.storage.from(BUCKET).upload(basePath, buffer, {
      contentType,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error && !/already exists|duplicate/i.test(error.message)) return resolvedSourceUrl;
    return supabase.storage.from(BUCKET).getPublicUrl(basePath).data.publicUrl;
  } catch (error) {
    console.error(`[Harvest image mirror] Failed for ${assetId}:`, error);
    return resolvedSourceUrl;
  }
}
