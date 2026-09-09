import { NextResponse } from "next/server";
import { initialArtworksData } from "@/data/artworks";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const TABLE = "art_gallery";

/**
 * POST /api/artworks/seed
 * Seeds the art_gallery Supabase table with all local artworks.
 * This is a one-time admin utility.
 */
export async function POST() {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      { error: "Supabase not configured – add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local" },
      { status: 503 }
    );
  }

  try {
    // Check if table already has data
    const { count, error: countError } = await supabase
      .from(TABLE)
      .select("id", { count: "exact", head: true });

    if (countError) {
      return NextResponse.json(
        {
          error: `Could not query the "${TABLE}" table. Make sure you have run supabase_art_gallery.sql in your Supabase SQL Editor first.`,
          supabaseError: countError.message,
        },
        { status: 400 }
      );
    }

    if (count && count > 0) {
      return NextResponse.json({
        success: true,
        message: `Table "${TABLE}" already has ${count} items. Skipping seed to avoid duplicates.`,
        skipped: true,
        existingCount: count,
      });
    }

    // Build rows to insert
    const rows = initialArtworksData.map((art, index) => ({
      id: art.id,
      title: art.title,
      short_description: art.shortDescription || art.description?.slice(0, 120) || "",
      description: art.description || art.shortDescription || "",
      image: art.image || art.src,
      width: art.width || 1200,
      height: art.height || 1600,
      price: Number(art.price) || 350,
      type: art.type || "Physical",
      category: art.category || "Physical Prints",
      availability: art.availability || "In Stock",
      quantity: Number(art.quantity) || 25,
      year: art.year || "2025",
      dimensions: art.dimensions || "24 x 36 inches",
      options: art.options || [],
      specs: art.specs || {},
      display_order: index + 1,
    }));

    const { data, error: insertError } = await supabase
      .from(TABLE)
      .insert(rows)
      .select("id");

    if (insertError) {
      return NextResponse.json(
        {
          error: "Failed to seed artworks",
          supabaseError: insertError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${data?.length || rows.length} artworks into the art_gallery table!`,
      seededCount: data?.length || rows.length,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error: " + err.message },
      { status: 500 }
    );
  }
}
