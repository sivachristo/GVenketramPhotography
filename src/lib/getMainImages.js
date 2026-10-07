import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { initialMainImages } from "@/data/mainImages";
import fs from "fs";
import path from "path";

const LOCAL_STORAGE_FILE = path.join(process.cwd(), "src", "data", "mainImages.json");

function getLocalStoredImages() {
  try {
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const content = fs.readFileSync(LOCAL_STORAGE_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading local main images JSON:", err);
  }
  return initialMainImages;
}

export async function getMainImages(onlyActive = false) {
  try {
    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from("main_images")
        .select("*")
        .order("display_order", { ascending: true });

      if (onlyActive) {
        query = query.eq("is_active", true);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return data;
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
