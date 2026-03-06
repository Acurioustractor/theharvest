/**
 * Photo Wall Gallery — flat JSON persistence for uploaded photo URLs.
 * No database migration needed — just a simple file on disk.
 */

import fs from "fs";
import path from "path";

const GALLERY_PATH = path.resolve(import.meta.dirname, "..", "data", "photo-wall-gallery.json");

export interface GalleryPhoto {
  url: string;
  fileName: string;
  uploadedAt: string;
}

function ensureDir() {
  const dir = path.dirname(GALLERY_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getGalleryPhotos(): GalleryPhoto[] {
  try {
    if (fs.existsSync(GALLERY_PATH)) {
      return JSON.parse(fs.readFileSync(GALLERY_PATH, "utf8"));
    }
  } catch (err) {
    console.error("Failed to read photo wall gallery:", err);
  }
  return [];
}

export function addGalleryPhoto(photo: GalleryPhoto): void {
  ensureDir();
  const photos = getGalleryPhotos();
  photos.push(photo);
  fs.writeFileSync(GALLERY_PATH, JSON.stringify(photos, null, 2));
}

export function removeGalleryPhoto(url: string): boolean {
  const photos = getGalleryPhotos();
  const filtered = photos.filter(p => p.url !== url);
  if (filtered.length === photos.length) return false;
  ensureDir();
  fs.writeFileSync(GALLERY_PATH, JSON.stringify(filtered, null, 2));
  return true;
}
