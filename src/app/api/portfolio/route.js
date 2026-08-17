import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { portfolioData, PORTFOLIO_CATEGORIES } from "@/data/portfolio";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "portfolio.js");

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      // Query categories from Supabase
      const { data: dbCategories } = await supabase
        .from("categories")
        .select("name")
        .order("display_order", { ascending: true });

      // Query portfolio images from Supabase
      const { data: dbImages, error: imgError } = await supabase
        .from("portfolio_images")
        .select("*")
        .order("display_order", { ascending: true });

      if (!imgError && dbImages && dbImages.length > 0) {
        const categoryList = dbCategories && dbCategories.length > 0
          ? dbCategories.map((c) => c.name)
          : PORTFOLIO_CATEGORIES;

        // Group images by category
        const grouped = categoryList.map((catName) => ({
          category: catName,
          images: dbImages
            .filter((img) => img.category_name === catName)
            .map((img) => ({
              src: img.src,
              width: img.width,
              height: img.height,
              title: img.title,
              description: img.description || "",
            })),
        }));

        return NextResponse.json({
          categories: categoryList,
          portfolioData: grouped,
          source: "supabase",
        });
      }
    }
  } catch (err) {
    console.warn("Supabase GET fetch fallback to local file:", err.message);
  }

  // Fallback to local portfolio.js
  return NextResponse.json({
    categories: PORTFOLIO_CATEGORIES,
    portfolioData: portfolioData,
    source: "local",
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { categories, portfolioData: updatedData } = body;

    if (!Array.isArray(updatedData)) {
      return NextResponse.json(
        { error: "Invalid portfolioData format" },
        { status: 400 }
      );
    }

    const categoriesList = categories || PORTFOLIO_CATEGORIES;

    // 1. Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        // Upsert categories
        const categoryRecords = categoriesList.map((name, idx) => ({
          name,
          display_order: idx,
        }));
        const { error: catErr } = await supabase
          .from("categories")
          .upsert(categoryRecords, { onConflict: "name" });
        if (catErr) throw catErr;

        // Flatten images into database rows
        const flatRows = [];
        let globalOrder = 0;

        updatedData.forEach((catObj) => {
          catObj.images.forEach((img) => {
            flatRows.push({
              category_name: catObj.category,
              src: img.src,
              width: img.width || 1600,
              height: img.height || 1200,
              title: img.title || "Untitled",
              description: img.description || "",
              display_order: globalOrder++,
            });
          });
        });

        // Query existing portfolio_images from Supabase to detect removed items
        const { data: dbImages, error: fetchErr } = await supabase
          .from("portfolio_images")
          .select("src");

        if (fetchErr) throw fetchErr;

        if (dbImages && dbImages.length > 0) {
          const newSrcSet = new Set(flatRows.map((row) => row.src));
          const removedImages = dbImages.filter((img) => !newSrcSet.has(img.src));

          // Extract bucket path/filename for removed images that reside in Supabase Storage
          const storagePathsToRemove = [];
          removedImages.forEach((img) => {
            if (img.src && img.src.includes("/portfolio-images/")) {
              const filename = img.src.split("/portfolio-images/")[1]?.split("?")[0];
              if (filename) {
                storagePathsToRemove.push(decodeURIComponent(filename));
              }
            }
          });

          // Delete storage objects from portfolio-images bucket if any
          if (storagePathsToRemove.length > 0) {
            const { error: removeErr } = await supabase.storage
              .from("portfolio-images")
              .remove(storagePathsToRemove);

            if (removeErr) {
              console.error("Supabase Storage deletion error:", removeErr.message);
              throw new Error(`Failed to delete storage file: ${removeErr.message}`);
            }
          }
        }

        // Clear and insert new image set
        const { error: deleteErr } = await supabase
          .from("portfolio_images")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000");

        if (deleteErr) throw deleteErr;

        if (flatRows.length > 0) {
          const { error: insertErr } = await supabase
            .from("portfolio_images")
            .insert(flatRows);

          if (insertErr) throw insertErr;
        }
      } catch (sbErr) {
        console.error("Supabase POST sync error:", sbErr.message);
        throw sbErr;
      }
    }

    // 2. Always sync to local file for fallback resilience
    const fileContent = `export const PORTFOLIO_CATEGORIES = ${JSON.stringify(
      categoriesList,
      null,
      2
    )};

export const portfolioData = ${JSON.stringify(updatedData, null, 2)};
`;

    fs.writeFileSync(DATA_FILE_PATH, fileContent, "utf8");

    return NextResponse.json({
      success: true,
      message: "Portfolio data saved successfully",
      categories: categoriesList,
      portfolioData: updatedData,
      supabaseSynced: isSupabaseConfigured,
    });
  } catch (error) {
    console.error("Error saving portfolio data:", error);
    return NextResponse.json(
      { error: "Failed to save portfolio data: " + error.message },
      { status: 500 }
    );
  }
}
