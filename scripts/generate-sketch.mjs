/**
 * Generate milk crate pavilion sketches via Gemini API and save to disk.
 * Usage: GOOGLE_AI_API_KEY=... node scripts/generate-sketch.mjs
 */

import { GoogleGenAI } from "@google/genai";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../client/public/images/sketches");
mkdirSync(OUT_DIR, { recursive: true });

const apiKey = process.env.GOOGLE_AI_API_KEY;
if (!apiKey) {
  console.error("Set GOOGLE_AI_API_KEY");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const prompts = [
  {
    name: "milk-crate-pavilion-01",
    prompt:
      "A sketch of a milk crate pavilion structure in an Australian hinterland community space. Stacked milk crates forming walls and seating, with a simple timber frame roof. Warm afternoon light filtering through. Surrounded by native plants. Pencil and watercolour sketch style, earthy tones, timber brown, cream, deep green. Bauhaus-inspired simplicity. Hand-drawn feel, not polished or corporate.",
  },
  {
    name: "milk-crate-pavilion-02",
    prompt:
      "A community building day: people stacking milk crates into a pavilion structure at a rural Australian gathering space. Kids helping. A dairy heritage nod with the crates. Hinterland green hills in background. Sketch style, warm watercolour tones, hand-drawn quality. Simple, honest, grounded.",
  },
];

for (const { name, prompt } of prompts) {
  console.log(`Generating ${name}...`);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith("image/"));

    if (!imagePart) {
      console.error(`No image in response for ${name}`);
      console.log("Response parts:", parts.map((p) => Object.keys(p)));
      continue;
    }

    const ext = imagePart.inlineData.mimeType === "image/png" ? "png" : "jpg";
    const outPath = join(OUT_DIR, `${name}.${ext}`);
    const buf = Buffer.from(imagePart.inlineData.data, "base64");
    writeFileSync(outPath, buf);
    console.log(`Saved ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
  } catch (err) {
    console.error(`Failed ${name}:`, err.message);
  }
}

console.log("Done.");
