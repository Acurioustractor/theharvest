import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const repoRoot = import.meta.dirname;
const publicSourceDir = path.resolve(repoRoot, "client", "public");
const publicOutDir = path.resolve(repoRoot, "dist", "public");

function copyPublicAsset(relativePath: string) {
  const source = path.join(publicSourceDir, relativePath);
  const target = path.join(publicOutDir, relativePath);
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function prunePublicBuildAssetsPlugin() {
  return {
    name: "harvest-prune-public-build-assets",
    closeBundle() {
      const removePaths = [
        "TheHarvestConcept.pdf",
        "align-tool.html",
        "community-explorer.html",
        "image-gallery.html",
        "point-alignment-tool.html",
        "photo-wall-card.html",
        "sketch-studio.html",
        "zone-editor.html",
        "images/email-icons",
        "images/growing-h",
        "images/logo-stages",
        "images/plans",
        "images/site-plan",
        "images/sketches",
      ];

      for (const relativePath of removePaths) {
        fs.rmSync(path.join(publicOutDir, relativePath), { recursive: true, force: true });
      }

      // Keep current public-route assets that live inside larger planning folders.
      copyPublicAsset("images/plans/site-plan-colour-labelled.jpeg");
      copyPublicAsset("images/site-plan/layers/photos/00-base-photo.png");
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    prunePublicBuildAssetsPlugin(),
    ...(mode === "development"
      ? [jsxLocPlugin(), vitePluginManusRuntime()]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(repoRoot, "client", "src"),
      "@shared": path.resolve(repoRoot, "shared"),
      "@assets": path.resolve(repoRoot, "attached_assets"),
    },
  },
  envDir: path.resolve(repoRoot),
  root: path.resolve(repoRoot, "client"),
  publicDir: publicSourceDir,
  build: {
    outDir: publicOutDir,
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
}));
