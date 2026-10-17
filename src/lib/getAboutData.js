import fs from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const LOCAL_STORAGE_FILE = path.join(process.cwd(), "src", "data", "about.json");

export const DEFAULT_ABOUT_DATA = {
  subtitle: "The Artist Behind the Lens",
  titlePrefix: "G.",
  titleHighlight: "Venketram",
  bioParagraph1: "G. Venketram is an internationally acclaimed fashion photographer and visual director based in Chennai, India. With a signature style characterized by cinematic lighting, precise geometry, and profound emotional intensity, he has spent over a decade redefining the visual language of modern editorial and luxury advertising.",
  quote: "Photography is the silent dialogue between light, subject, and shadow. My goal is to capture the unseen poise that resides in the briefest transition of moments.",
  bioParagraph2: "Born with an innate fascination for shadows and human expression, he studied fine art and visual composition before establishing his production studio. His work bridges the divide between commercial high-fashion campaigns and raw documentary art, seeking to isolate fleeting moments of pure poise and transition.",
  publicationsTitle: "Select Clients & Publications",
  publications: [
    "Vogue Italia",
    "Harper's Bazaar",
    "GQ Magazine",
    "Vanity Fair",
    "The New York Times",
    "AD Magazine"
  ],
  imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
  imageAlt: "G. Venketram Portrait",
  updatedAt: new Date().toISOString()
};

export function getLocalAboutData() {
  try {
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const content = fs.readFileSync(LOCAL_STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      return { ...DEFAULT_ABOUT_DATA, ...parsed };
    }
  } catch (err) {
    console.error("Error reading local about.json:", err);
  }
  return DEFAULT_ABOUT_DATA;
}

export function writeLocalAboutData(data) {
  try {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to local about.json:", err);
  }
}

export async function getAboutData() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (!error && data?.settings?.about) {
        return {
          ...DEFAULT_ABOUT_DATA,
          ...data.settings.about,
          source: "supabase",
        };
      }
    }
  } catch (err) {
    console.warn("Supabase GET about data notice:", err.message);
  }

  const local = getLocalAboutData();
  return { ...local, source: "local" };
}
