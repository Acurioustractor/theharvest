/**
 * Gemini Image Generation Integration
 *
 * Uses Google's GenAI SDK with gemini-3-pro-image-preview for image generation.
 * Supports presets for brand-consistent output and optional Supabase storage.
 */

import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const BRAND_CONTEXT = `Style: Warm, grounded, Australian hinterland. Natural light.
Earthy tones — timber brown, cream, deep green, red soil.
Feel: handmade, honest, community. Not corporate, not polished.
References: Bauhaus simplicity, Australian rural heritage, community gathering, Jinibara Country.`;

const PRESETS: Record<string, { suffix: string; aspectRatio: string }> = {
  "social-card": {
    suffix: "Create a warm, inviting social media card image. 16:9 aspect ratio. Bold, simple composition with space for text overlay.",
    aspectRatio: "16:9",
  },
  "story-illustration": {
    suffix: "Create an editorial illustration in a warm, hand-drawn style. 4:3 aspect ratio.",
    aspectRatio: "4:3",
  },
  "project-banner": {
    suffix: "Create a wide panoramic banner image. 21:9 aspect ratio. Atmospheric, cinematic feel.",
    aspectRatio: "21:9",
  },
  "pattern": {
    suffix: "Create a seamless repeatable pattern. 1:1 aspect ratio. Simple, geometric.",
    aspectRatio: "1:1",
  },
  "texture": {
    suffix: "Create an organic texture. 1:1 aspect ratio. Could be paper, earth, timber grain, or natural material.",
    aspectRatio: "1:1",
  },
};

const SKETCH_THEMES: Record<string, string> = {
  "dairy-heritage": "Inspired by milk cans, cream, pastoral landscapes, soft curves",
  "timber-heritage": "Inspired by cedar, wood grain, axes, sawmill marks, strong lines",
  "coop-heritage": "Inspired by hands joining, shared tables, community marks, cooperation symbols",
  "hinterland": "Inspired by green ridgelines, morning mist, fern fronds, bird silhouettes",
  "bauhaus": "Inspired by Bauhaus design — geometric shapes, primary colors, bold forms, clean lines",
};

const SKETCH_TYPES: Record<string, string> = {
  "divider": "a horizontal decorative divider line",
  "frame": "a decorative frame or border element",
  "border": "a page border decoration",
  "illustration": "a small spot illustration",
  "texture": "a subtle background texture",
  "ornament": "a decorative ornamental element",
};

function getGenAI() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY not configured");
  return new GoogleGenAI({ apiKey });
}

function getSupabaseStorage() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function uploadToSupabase(path: string, base64Data: string, contentType: string): Promise<string | null> {
  const supabase = getSupabaseStorage();
  if (!supabase) return null;

  const buffer = Buffer.from(base64Data, "base64");
  const { error } = await supabase.storage
    .from("media")
    .upload(path, buffer, { contentType, upsert: true });

  if (error) {
    console.error("Supabase upload error:", error);
    return null;
  }

  const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
  return urlData.publicUrl;
}

export async function generateImage(options: {
  prompt: string;
  aspectRatio?: string;
  preset?: string;
  save?: boolean;
}): Promise<{ image: string; url?: string }> {
  const ai = getGenAI();

  let fullPrompt = options.prompt;
  const preset = options.preset ? PRESETS[options.preset] : null;

  if (preset) {
    fullPrompt = `${fullPrompt}\n\n${preset.suffix}`;
  }
  fullPrompt = `${fullPrompt}\n\n${BRAND_CONTEXT}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith("image/"));

  if (!imagePart?.inlineData) {
    throw new Error("No image generated");
  }

  const base64 = imagePart.inlineData.data as string;
  const mimeType = imagePart.inlineData.mimeType as string;
  const ext = mimeType.includes("png") ? "png" : "jpg";
  const imageDataUri = `data:${mimeType};base64,${base64}`;

  let url: string | undefined;
  if (options.save) {
    const filename = `generated/${Date.now()}.${ext}`;
    const uploaded = await uploadToSupabase(filename, base64, mimeType);
    if (uploaded) url = uploaded;
  }

  return { image: imageDataUri, url };
}

export async function generateSketch(options: {
  type: string;
  seed?: string;
  theme?: string;
}): Promise<{ image: string; url?: string; cached: boolean }> {
  const ai = getGenAI();

  // Build cache key from inputs
  const cacheKey = `${options.type}-${options.theme || "default"}-${options.seed || "default"}`;
  const hashKey = Buffer.from(cacheKey).toString("base64url");
  const storagePath = `sketches/${hashKey}.png`;

  // Check cache
  const supabase = getSupabaseStorage();
  if (supabase) {
    const { data: existing } = supabase.storage.from("media").getPublicUrl(storagePath);
    // Try to download to check existence
    const { data: fileData } = await supabase.storage.from("media").download(storagePath);
    if (fileData) {
      const buffer = Buffer.from(await fileData.arrayBuffer());
      const base64 = buffer.toString("base64");
      return {
        image: `data:image/png;base64,${base64}`,
        url: existing.publicUrl,
        cached: true,
      };
    }
  }

  const typeDesc = SKETCH_TYPES[options.type] || "a decorative element";
  const themeDesc = options.theme ? SKETCH_THEMES[options.theme] || "" : "";
  const seedContext = options.seed ? `Context: ${options.seed}.` : "";

  const prompt = `Create ${typeDesc} as a black ink sketch on transparent/white background. Simple, hand-drawn quality. ${themeDesc} ${seedContext}\n\n${BRAND_CONTEXT}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith("image/"));

  if (!imagePart?.inlineData) {
    throw new Error("No sketch generated");
  }

  const base64 = imagePart.inlineData.data as string;
  const mimeType = imagePart.inlineData.mimeType as string;
  const imageDataUri = `data:${mimeType};base64,${base64}`;

  // Cache to storage
  let url: string | undefined;
  const uploaded = await uploadToSupabase(storagePath, base64, "image/png");
  if (uploaded) url = uploaded;

  return { image: imageDataUri, url, cached: false };
}
