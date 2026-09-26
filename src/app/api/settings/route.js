import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// In-memory / server cache fallback for settings
let cachedSettings = {
  visibility: {
    artGallery: true,
    workshop: true,
  },
  updatedAt: new Date().toISOString(),
};

const TABLE = "site_settings";

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from(TABLE)
          .select("*")
          .eq("id", 1)
          .single();

        if (!error && data && data.settings) {
          cachedSettings = data.settings;
          return NextResponse.json({
            success: true,
            settings: cachedSettings,
            source: "supabase",
          });
        }
      } catch (err) {
        console.warn("Supabase GET site_settings notice:", err.message);
      }
    }

    return NextResponse.json({
      success: true,
      settings: cachedSettings,
      source: "memory",
    });
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

    revalidatePath("/", "layout");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: cachedSettings,
    });
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
