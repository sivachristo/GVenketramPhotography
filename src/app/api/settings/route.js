import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/getSiteSettings";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// In-memory / server cache fallback for settings
let cachedSettings = {
  ...DEFAULT_SITE_SETTINGS,
  updatedAt: new Date().toISOString(),
};

const TABLE = "site_settings";

const COOKIE_NAME = "gvr_construction";

export async function GET() {
  try {
    const { settings, source } = await getSiteSettings();
    if (source === "supabase" && settings) {
      cachedSettings = {
        ...cachedSettings,
        ...settings,
      };
    }

    const res = NextResponse.json({
      success: true,
      settings: cachedSettings,
      source,
    });
    res.cookies.delete(COOKIE_NAME);
    return res;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    // Load current settings from DB first if configured so we preserve about & contact keys
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existingData } = await supabase
          .from(TABLE)
          .select("settings")
          .eq("id", 1)
          .single();
        if (existingData?.settings) {
          cachedSettings = {
            ...cachedSettings,
            ...existingData.settings,
          };
        }
      } catch (err) {
        // ignore
      }
    }

    const vis = body?.settings?.visibility || body?.visibility || body;

    const newVisibility = { ...cachedSettings.visibility };
    if (vis?.artGallery !== undefined) {
      newVisibility.artGallery = Boolean(vis.artGallery);
    }
    if (vis?.workshop !== undefined) {
      newVisibility.workshop = Boolean(vis.workshop);
    }

    cachedSettings = {
      ...cachedSettings,
      visibility: newVisibility,
      updatedAt: new Date().toISOString(),
    };

    // Handle underConstruction flag (top-level, not nested under visibility)
    if (body?.underConstruction !== undefined) {
      cachedSettings = {
        ...cachedSettings,
        underConstruction: Boolean(body.underConstruction),
        updatedAt: new Date().toISOString(),
      };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: sbErr } = await supabase.from(TABLE).upsert({
          id: 1,
          settings: cachedSettings,
          updated_at: new Date().toISOString(),
        });

        if (sbErr) {
          console.warn("Supabase upsert site_settings notice:", sbErr.message);
        }
      } catch (err) {
        console.warn("Supabase upsert site_settings exception:", err.message);
      }
    }

    revalidateTag("site-settings", { expire: 0 });
    revalidatePath("/", "layout");
    revalidatePath("/admin");

    // Return response and ensure any stale construction cookie is deleted
    const res = NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: cachedSettings,
    });
    res.cookies.delete(COOKIE_NAME);
    return res;
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  return POST(request);
}
