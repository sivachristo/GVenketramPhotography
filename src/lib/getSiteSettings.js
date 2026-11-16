import { cacheLife, cacheTag } from "next/cache";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import cloudinaryFallback from "@/data/cloudinaryFallback.json";

const TABLE = "site_settings";

const fallbackSettingsRow = cloudinaryFallback?.tables?.site_settings?.[0]?.settings;

export const DEFAULT_SITE_SETTINGS = {
  visibility: {
    artGallery: fallbackSettingsRow?.visibility?.artGallery ?? true,
    workshop: fallbackSettingsRow?.visibility?.workshop ?? true,
  },
  underConstruction: fallbackSettingsRow?.underConstruction ?? false,
};

export async function getSiteSettings() {
  "use cache";
  cacheLife("hours");
  cacheTag("site-settings");

  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from(TABLE)
        .select("settings")
        .eq("id", 1)
        .single();

      if (!error && data && data.settings) {
        return {
          settings: {
            ...DEFAULT_SITE_SETTINGS,
            ...data.settings,
            visibility: {
              ...DEFAULT_SITE_SETTINGS.visibility,
              ...(data.settings.visibility || {}),
            },
          },
          source: "supabase",
        };
      }
    }
  } catch (err) {
    console.warn("Supabase GET site_settings notice:", err.message);
  }

  return {
    settings: DEFAULT_SITE_SETTINGS,
    source: "memory",
  };
}
