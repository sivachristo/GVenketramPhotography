import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST() {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  if (!isCloudinaryConfigured) {
    return NextResponse.json({ error: "Cloudinary credentials missing in .env.local" }, { status: 500 });
  }

  try {
    const stats = {
      portfolioUploaded: 0,
      portfolioSkipped: 0,
      artUploaded: 0,
      artSkipped: 0,
      orphansRemoved: 0,
      errors: 0,
    };

    // 1. Migrate Portfolio Images from Supabase Storage -> Cloudinary
    const { data: portfolioRecords, error: pErr } = await supabase
      .from("portfolio_images")
      .select("*")
      .limit(5000);

    if (!pErr && portfolioRecords) {
      for (const record of portfolioRecords) {
        const src = record.src || "";
        if (src.includes("res.cloudinary.com") || !src) {
          stats.portfolioSkipped++;
          continue;
        }

        try {
          // Cloudinary fetches directly from HTTP(S) URL
          const res = await uploadToCloudinary(src, "portfolio");
          const newUrl = res.secure_url;

          const { error: uErr } = await supabase
            .from("portfolio_images")
            .update({ src: newUrl })
            .eq("id", record.id);

          if (!uErr) {
            stats.portfolioUploaded++;

            // Clean up binary from Supabase storage
            if (src.includes("supabase.co/storage")) {
              for (const bucket of ["portfolio-images", "artworks"]) {
                const part = src.split(`/${bucket}/`)[1]?.split("?")[0];
                if (part) {
                  await supabase.storage
                    .from(bucket)
                    .remove([decodeURIComponent(part)]);
                  break;
                }
              }
            }
          } else {
            console.error(`DB update failed for portfolio ${record.id}:`, uErr.message);
            stats.errors++;
          }
        } catch (err) {
          console.error(`Migration error for portfolio item ${record.id}:`, err.message);
          stats.errors++;
        }
      }
    }

    // 2. Migrate Art Gallery Items from Supabase Storage -> Cloudinary
    const { data: artRecords, error: aErr } = await supabase
      .from("art_gallery")
      .select("*")
      .limit(5000);

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
              for (const bucket of ["artworks", "portfolio-images"]) {
                const part = img.split(`/${bucket}/`)[1]?.split("?")[0];
                if (part) {
                  await supabase.storage
                    .from(bucket)
                    .remove([decodeURIComponent(part)]);
                  break;
                }
              }
            }
          } else {
            console.error(`DB update failed for artwork ${record.id}:`, uErr.message);
            stats.errors++;
          }
        } catch (err) {
          console.error(`Migration error for art gallery item ${record.id}:`, err.message);
          stats.errors++;
        }
      }
    }

    // 3. Clean up orphaned binaries from Supabase Storage buckets
    // Re-fetch all updated active URLs from database
    const { data: activePortfolio } = await supabase.from("portfolio_images").select("src").limit(5000);
    const { data: activeArt } = await supabase.from("art_gallery").select("image").limit(5000);

    const activeUrls = new Set([
      ...(activePortfolio || []).map((p) => p.src).filter(Boolean),
      ...(activeArt || []).map((a) => a.image).filter(Boolean),
    ]);

    for (const bucket of ["portfolio-images", "artworks"]) {
      try {
        const { data: fileList } = await supabase.storage.from(bucket).list("", { limit: 1000 });
        if (fileList && fileList.length > 0) {
          const orphans = [];
          for (const file of fileList) {
            if (!file.name) continue;
            // Check if this file is referenced in any active URL
            const isReferenced = Array.from(activeUrls).some((url) => url.includes(file.name));
            if (!isReferenced) {
              orphans.push(file.name);
            }
          }

          if (orphans.length > 0) {
            // Delete orphans in chunks of 50
            for (let i = 0; i < orphans.length; i += 50) {
              const chunk = orphans.slice(i, i + 50);
              const { error: delErr } = await supabase.storage.from(bucket).remove(chunk);
              if (!delErr) {
                stats.orphansRemoved += chunk.length;
              }
            }
          }
        }
      } catch (bucketErr) {
        console.error(`Error cleaning orphans for bucket ${bucket}:`, bucketErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Storage migration & cleanup completed successfully",
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
