import { cacheLife, cacheTag } from "next/cache";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { initialMainImages } from "@/data/mainImages";
import cloudinaryFallback from "@/data/cloudinaryFallback.json";
import fs from "fs";
import path from "path";

const LOCAL_STORAGE_FILE = path.join(process.cwd(), "src", "data", "mainImages.json");

export const MAIN_IMAGE_COLUMNS = "id, src, title, alt, display_order, is_active";

export function normalizeMainImageDevice(img) {
  if (!img) return img;
  const isMobile =
    img.device === "mobile" || String(img.id || "").startsWith("main-mob-");
  return {
    ...img,
    device: isMobile ? "mobile" : "desktop",
  };
}

function getLocalStoredImages() {
  try {
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const content = fs.readFileSync(LOCAL_STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeMainImageDevice);
      }
    }
  } catch (err) {
    console.error("Error reading local main images JSON:", err);
  }
  const cldHeroes = cloudinaryFallback?.tables?.main_images;
  if (Array.isArray(cldHeroes) && cldHeroes.length > 0) {
    return cldHeroes.map(normalizeMainImageDevice);
  }
  return initialMainImages.map(normalizeMainImageDevice);
}

export async function getMainImages(onlyActive = false) {
  "use cache";
  cacheLife("hours");
  cacheTag("main-images");
  try {
    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from("main_images")
        .select(MAIN_IMAGE_COLUMNS)
        .order("display_order", { ascending: true });

      if (onlyActive) {
        query = query.eq("is_active", true);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return data.map(normalizeMainImageDevice);
      }
    }
  } catch (err) {
    console.error("Error fetching main_images from Supabase, falling back:", err.message);
  }

  const localImages = getLocalStoredImages();
  if (onlyActive) {
    return localImages.filter((img) => img.is_active !== false);
  }
  return localImages;
}
