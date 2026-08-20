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

        // Group images by category preserving database UUID id
        const grouped = categoryList.map((catName) => ({
          category: catName,
          images: dbImages
            .filter((img) => img.category_name === catName)
            .map((img) => ({
              id: img.id,
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

        // Flatten images into database rows preserving UUID id when present
        const flatRows = [];
        let globalOrder = 0;

        updatedData.forEach((catObj) => {
          catObj.images.forEach((img) => {
            const row = {
              category_name: catObj.category,
              src: img.src,
              width: img.width || 1600,
              height: img.height || 1200,
              title: img.title || "Untitled",
              description: img.description || "",
              display_order: globalOrder++,
            };
            if (img.id) {
              row.id = img.id;
            }
            flatRows.push(row);
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
              console.error("Supabase Storage deletion warning:", removeErr.message);
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

        // Return immediately when Supabase is configured without touching src/data/portfolio.js
        return NextResponse.json({
          success: true,
          message: "Portfolio data saved successfully to Supabase",
          categories: categoriesList,
          portfolioData: updatedData,
          supabaseSynced: true,
        });
      } catch (sbErr) {
        console.error("Supabase POST sync error:", sbErr.message);
        return NextResponse.json(
          { error: "Failed to save portfolio data to Supabase: " + sbErr.message },
          { status: 500 }
        );
      }
    }

    // 2. Local fallback sync only when Supabase is unconfigured
    try {
      const fileContent = `export const PORTFOLIO_CATEGORIES = ${JSON.stringify(
        categoriesList,
        null,
        2
      )};\n\nexport const portfolioData = ${JSON.stringify(updatedData, null, 2)};\n`;

      fs.writeFileSync(DATA_FILE_PATH, fileContent, "utf8");

      return NextResponse.json({
        success: true,
        message: "Portfolio data saved successfully to local file",
        categories: categoriesList,
        portfolioData: updatedData,
        supabaseSynced: false,
      });
    } catch (fsErr) {
      console.error("Local file save error:", fsErr.message);
      return NextResponse.json(
        { error: "Failed to save portfolio data: " + fsErr.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error saving portfolio data:", error);
    return NextResponse.json(
      { error: "Failed to save portfolio data: " + error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { action, id, src, updates, image, items } = body;

    if (isSupabaseConfigured && supabase) {
      const targetId = id || body.id || updates?.id;
      const targetSrc = src || body.src || updates?.src;

      // 1. Single Item Update (title, description, category, reorder, etc.)
      if (action === "update" || ((targetId || targetSrc) && !action && !image && !items)) {
        if (!targetId && !targetSrc) {
          return NextResponse.json({ error: "Missing image 'id' or 'src' to update" }, { status: 400 });
        }

        const updateFields = {};
        const sourceObj = updates || body;

        if (sourceObj.title !== undefined) updateFields.title = sourceObj.title;
        if (sourceObj.description !== undefined) updateFields.description = sourceObj.description;
        if (sourceObj.category !== undefined || sourceObj.category_name !== undefined) {
          updateFields.category_name = sourceObj.category || sourceObj.category_name;
        }
        if (sourceObj.width !== undefined) updateFields.width = sourceObj.width;
        if (sourceObj.height !== undefined) updateFields.height = sourceObj.height;
        if (sourceObj.display_order !== undefined) updateFields.display_order = sourceObj.display_order;

        let query = supabase.from("portfolio_images").update(updateFields);
        if (targetId) {
          query = query.eq("id", targetId);
        } else {
          query = query.eq("src", targetSrc);
        }

        const { data, error } = await query.select();

        if (error) throw error;

        return NextResponse.json({
          success: true,
          message: "Image updated successfully in Supabase",
          data,
        });
      }

      // 2. Single Item Create
      if (action === "create" || image) {
        const img = image || body;
        const newRecord = {
          category_name: img.category || img.category_name || "Advertising",
          src: img.src,
          width: img.width || 1600,
          height: img.height || 1200,
          title: img.title || "Untitled",
          description: img.description || "",
          display_order: img.display_order || 0,
        };
        if (img.id) {
          newRecord.id = img.id;
        }

        const { data, error } = await supabase
          .from("portfolio_images")
          .insert([newRecord])
          .select();

        if (error) throw error;

        return NextResponse.json({
          success: true,
          message: "Image created successfully in Supabase",
          data: data?.[0],
        });
      }

      // 3. Single Item Delete
      if (action === "delete") {
        if (!targetId && !targetSrc) {
          return NextResponse.json({ error: "Missing image 'id' or 'src' to delete" }, { status: 400 });
        }

        // Remove from storage bucket if stored in Supabase Storage
        if (targetSrc && targetSrc.includes("/portfolio-images/")) {
          const filename = targetSrc.split("/portfolio-images/")[1]?.split("?")[0];
          if (filename) {
            await supabase.storage
              .from("portfolio-images")
              .remove([decodeURIComponent(filename)]);
          }
        }

        let deleteQuery = supabase.from("portfolio_images").delete();
        if (targetId) {
          deleteQuery = deleteQuery.eq("id", targetId);
        } else {
          deleteQuery = deleteQuery.eq("src", targetSrc);
        }

        const { error } = await deleteQuery;

        if (error) throw error;

        return NextResponse.json({
          success: true,
          message: "Image deleted successfully from Supabase",
        });
      }

      // 4. Batch items update without full table wipe
      if (action === "batch_update" || Array.isArray(items)) {
        const rowsToUpdate = (items || []).map((item) => ({
          ...(item.id ? { id: item.id } : {}),
          category_name: item.category || item.category_name,
          src: item.src,
          width: item.width || 1600,
          height: item.height || 1200,
          title: item.title || "Untitled",
          description: item.description || "",
          display_order: item.display_order || 0,
        }));

        const { error } = await supabase
          .from("portfolio_images")
          .upsert(rowsToUpdate, { onConflict: "src" });

        if (error) throw error;

        return NextResponse.json({
          success: true,
          message: "Batch images updated successfully in Supabase",
        });
      }
    }

    return NextResponse.json(
      { error: "PATCH operation requires Supabase configuration" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error patching portfolio data:", error);
    return NextResponse.json(
      { error: "Failed to patch portfolio data: " + error.message },
      { status: 500 }
    );
  }
}
