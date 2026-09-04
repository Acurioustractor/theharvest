import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createClientMock } = vi.hoisted(() => ({ createClientMock: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: createClientMock }));

const SOURCE_URL = "https://source.example.test/photo.jpg?token=fixture";
const PUBLIC_URL = "https://harvest.example.test/storage/v1/object/public/media/harvest-image-mirror/photo_1";
const OBJECT_PATH = "harvest-image-mirror/photo_1";

describe("Harvest image mirror cache lookup", () => {
  let mirrorHarvestImage: typeof import("../harvestImageStorage").mirrorHarvestImage;
  let bucket: {
    download: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
    upload: ReturnType<typeof vi.fn>;
    getPublicUrl: ReturnType<typeof vi.fn>;
  };
  let sourceFetch: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv("SUPABASE_URL", "https://harvest.example.test");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "fixture-only");
    bucket = {
      download: vi.fn().mockResolvedValue({ data: new Blob(["existing image"]), error: null }),
      info: vi.fn().mockResolvedValue({ data: { name: OBJECT_PATH }, error: null }),
      upload: vi.fn().mockResolvedValue({ data: { path: OBJECT_PATH }, error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: PUBLIC_URL } }),
    };
    createClientMock.mockReturnValue({ storage: { from: vi.fn().mockReturnValue(bucket) } });
    sourceFetch = vi.fn(async () => new Response("source image", {
      headers: { "Content-Type": "image/jpeg" },
    }));
    vi.stubGlobal("fetch", sourceFetch);
    vi.spyOn(console, "error").mockImplementation(() => {});
    ({ mirrorHarvestImage } = await import("../harvestImageStorage"));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  function missingObject(error = { message: "Object not found", status: 404, statusCode: "404" }) {
    bucket.download.mockResolvedValue({ data: null, error });
    bucket.info.mockResolvedValue({ data: null, error });
  }

  it("returns the cached public URL using metadata without downloading image bytes", async () => {
    const result = await mirrorHarvestImage("photo/1", SOURCE_URL);

    expect(result).toBe(PUBLIC_URL);
    expect(bucket.info).toHaveBeenCalledWith(OBJECT_PATH);
    expect(bucket.download).not.toHaveBeenCalled();
    expect(sourceFetch).not.toHaveBeenCalled();
    expect(bucket.upload).not.toHaveBeenCalled();
    expect(bucket.getPublicUrl).toHaveBeenCalledWith(OBJECT_PATH);
  });

  it.each([404, 400])("uploads a missing object when HTTP %i carries storage status 404", async (status) => {
    missingObject({ message: "Object not found", status, statusCode: "404" });

    const result = await mirrorHarvestImage("photo/1", SOURCE_URL);

    expect(result).toBe(PUBLIC_URL);
    expect(sourceFetch).toHaveBeenCalledWith(SOURCE_URL, expect.objectContaining({ signal: expect.any(AbortSignal) }));
    expect(bucket.upload).toHaveBeenCalledWith(OBJECT_PATH, Buffer.from("source image"), {
      contentType: "image/jpeg",
      cacheControl: "31536000",
      upsert: false,
    });
    expect(bucket.download).not.toHaveBeenCalled();
  });

  it.each([401, 403, 500])("does not treat metadata failure %i as a missing image", async (status) => {
    const error = { message: "Storage unavailable", status, statusCode: String(status) };
    bucket.download.mockResolvedValue({ data: null, error });
    bucket.info.mockResolvedValue({ data: null, error });

    const result = await mirrorHarvestImage("photo/1", SOURCE_URL);

    expect(result).toBe(SOURCE_URL);
    expect(sourceFetch).not.toHaveBeenCalled();
    expect(bucket.upload).not.toHaveBeenCalled();
    expect(bucket.getPublicUrl).not.toHaveBeenCalled();
  });

  it("preserves the source URL when the metadata request throws", async () => {
    bucket.info.mockRejectedValue(new Error("Connection failed"));

    expect(await mirrorHarvestImage("photo/1", SOURCE_URL)).toBe(SOURCE_URL);
    expect(sourceFetch).not.toHaveBeenCalled();
    expect(bucket.upload).not.toHaveBeenCalled();
  });

  it("still returns the durable URL when another request uploads first", async () => {
    missingObject();
    bucket.upload.mockResolvedValue({ data: null, error: { message: "The resource already exists" } });

    expect(await mirrorHarvestImage("photo/1", SOURCE_URL)).toBe(PUBLIC_URL);
    expect(bucket.getPublicUrl).toHaveBeenCalledWith(OBJECT_PATH);
  });

  it("preserves the original source when the upstream response is not an image", async () => {
    missingObject();
    sourceFetch.mockResolvedValue(new Response("unavailable", { headers: { "Content-Type": "text/plain" } }));

    expect(await mirrorHarvestImage("photo/1", SOURCE_URL)).toBe(SOURCE_URL);
    expect(bucket.upload).not.toHaveBeenCalled();
  });
});
