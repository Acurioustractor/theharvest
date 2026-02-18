import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

const models = ["gemini-3-pro-image-preview"];

for (const model of models) {
  console.log(`\nTrying ${model}...`);
  try {
    const r = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: "Create a simple horizontal decorative divider as a black ink sketch on white background. Timber heritage theme — axes and cedar grain." }] }],
      config: { responseModalities: ["TEXT", "IMAGE"] },
    });
    const parts = r.candidates?.[0]?.content?.parts || [];
    const img = parts.find(p => p.inlineData?.mimeType?.startsWith("image/"));
    if (img) {
      console.log(`  SUCCESS with ${model} — got image (${img.inlineData.mimeType})`);
      break;
    } else {
      console.log(`  ${model} returned text only, no image`);
    }
  } catch (e) {
    console.log(`  FAILED: ${e.message.slice(0, 120)}`);
  }
}
