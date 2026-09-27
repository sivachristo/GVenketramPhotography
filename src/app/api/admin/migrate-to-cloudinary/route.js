import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST() {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  if (!isCloudinaryConfigured) {
    return NextResponse.json({ error: "Cloudinary credentials missing" }, { status: 500 });
  }

  try {
    let stats = {
      portfolioUploaded: 0,
      portfolioSkipped: 0,
      artUploaded: 0,
      artSkipped: 0,
      errors: 0,
    };

    // 1. Portfolio images
    const { data: portfolioRecords, error: pErr } = await supabase
      .from("portfolio_images")
      .select("*");

    if (!pErr && portfolioRecords) {
      for (const record of portfolioRecords) {
        const src = record.src || "";
        if (src.includes("res.cloudinary.com") || !src) {
          stats.portfolioSkipped++;
          continue;
        }

        try {
          // Cloudinary can directly fetch from HTTP(S) URL
          const res = await uploadToCloudinary(src, "portfolio");
          const newUrl = res.secure_url;

          const { error: uErr } = await supabase
            .from("portfolio_images")
            .update({ src: newUrl })
            .eq("id", record.id);

          if (!uErr) {
            stats.portfolioUploaded++;

            // Clean up from Supabase storage if applicable
            if (src.includes("supabase.co/storage")) {
              const part = src.split("/portfolio-images/")[1]?.split("?")[0];
              if (part) {
                await supabase.storage
                  .from("portfolio-images")
                  .remove([decodeURIComponent(part)]);
              }
            }
          } else {
            stats.errors++;
          }
        } catch (err) {
          console.error(`Migration error for portfolio item ${record.id}:`, err.message);
          stats.errors++;
        }
      }
    }

    // 2. Art gallery items
    const { data: artRecords, error: aErr } = await supabase
      .from("art_gallery")
      .select("*");

    if (!aErr && artRecords) {
      for (const record of artRecords) {
        const img = record.image || "";
        if (img.includes("res.cloudinary.com") || !img) {
          stats.artSkipped++;
          continue;
        }

        try {
          const res = await uploadToCloudinary(img, "art_gallery");
          const newUrl = res.secure_url;

          const { error: uErr } = await supabase
            .from("art_gallery")
            .update({ image: newUrl })
            .eq("id", record.id);

          if (!uErr) {
            stats.artUploaded++;

            if (img.includes("supabase.co/storage")) {
              const part = img.split("/artworks/")[1]?.split("?")[0];
              if (part) {
                await supabase.storage
                  .from("artworks")
                  .remove([decodeURIComponent(part)]);
              }
            }
          } else {
            stats.errors++;
          }
        } catch (err) {
          console.error(`Migration error for art gallery item ${record.id}:`, err.message);
          stats.errors++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Image migration executed successfully",
      stats,
    });
  } catch (error) {
    console.error("Migration endpoint error:", error);
    return NextResponse.json(
      { error: "Migration failed: " + error.message },
      { status: 500 }
    );
  }
}
