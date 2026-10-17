import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  getAboutData,
  getLocalAboutData,
  writeLocalAboutData,
  DEFAULT_ABOUT_DATA,
} from "@/lib/getAboutData";

export async function GET() {
  try {
    const about = await getAboutData();
    return NextResponse.json({
      success: true,
      about,
    });
  } catch (error) {
    console.error("Error in GET /api/about:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch about data" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const payload = body?.about || body;

    // Get current local data to merge
    const current = getLocalAboutData();

    // Prepare updated data with sanitation
    const updatedAbout = {
      subtitle: typeof payload.subtitle === "string" ? payload.subtitle : current.subtitle,
      titlePrefix: typeof payload.titlePrefix === "string" ? payload.titlePrefix : current.titlePrefix,
      titleHighlight: typeof payload.titleHighlight === "string" ? payload.titleHighlight : current.titleHighlight,
      bioParagraph1: typeof payload.bioParagraph1 === "string" ? payload.bioParagraph1 : current.bioParagraph1,
      quote: typeof payload.quote === "string" ? payload.quote : current.quote,
      bioParagraph2: typeof payload.bioParagraph2 === "string" ? payload.bioParagraph2 : current.bioParagraph2,
      publicationsTitle: typeof payload.publicationsTitle === "string" ? payload.publicationsTitle : current.publicationsTitle,
      publications: Array.isArray(payload.publications)
        ? payload.publications.filter((p) => typeof p === "string" && p.trim().length > 0)
        : current.publications,
      imageUrl: typeof payload.imageUrl === "string" && payload.imageUrl.trim().length > 0
        ? payload.imageUrl
        : current.imageUrl,
      imageAlt: typeof payload.imageAlt === "string" ? payload.imageAlt : current.imageAlt,
      updatedAt: new Date().toISOString(),
    };

    // 1. Save to local JSON file
    writeLocalAboutData(updatedAbout);

    // 2. Save to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existingSettings } = await supabase
          .from("site_settings")
          .select("settings")
          .eq("id", 1)
          .single();

        const currentSettings = existingSettings?.settings || {};
        const mergedSettings = {
          ...currentSettings,
          about: updatedAbout,
        };

        const { error: sbErr } = await supabase.from("site_settings").upsert({
          id: 1,
          settings: mergedSettings,
          updated_at: new Date().toISOString(),
        });

        if (sbErr) {
          console.warn("Supabase upsert site_settings (about) notice:", sbErr.message);
        }
      } catch (err) {
        console.warn("Supabase upsert site_settings (about) exception:", err.message);
      }
    }

    // Revalidate public about and admin page caches
    try {
      revalidatePath("/about");
      revalidatePath("/admin");
    } catch (e) {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: "About section updated successfully",
      about: updatedAbout,
    });
  } catch (error) {
    console.error("Error in POST /api/about:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update about section" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  return POST(request);
}
