import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// In-memory / server cache fallback for settings
let cachedSettings = {
  visibility: {
    artGallery: true,
    workshop: true,
  },
  underConstruction: false,
  updatedAt: new Date().toISOString(),
};

const TABLE = "site_settings";

const COOKIE_NAME = "gvr_construction";
const COOKIE_OPTS = { path: "/", httpOnly: false, maxAge: 60 * 60 * 24 * 365, sameSite: "lax" };

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
          // Merge: defaults → in-memory → Supabase, so no key is ever lost
          cachedSettings = {
            underConstruction: false,
            ...cachedSettings,
            ...data.settings,
          };
          const res = NextResponse.json({
            success: true,
            settings: cachedSettings,
            source: "supabase",
          });
          res.cookies.delete(COOKIE_NAME);
          return res;
        }
      } catch (err) {
        console.warn("Supabase GET site_settings notice:", err.message);
      }
    }

    const res = NextResponse.json({
      success: true,
      settings: cachedSettings,
      source: "memory",
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
