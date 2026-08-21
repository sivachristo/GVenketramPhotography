import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      );
    }

    const { category, category_name, src, title, description, width, height, display_order, position_num } = body;

    if (!src) {
      return NextResponse.json({ error: "Missing required 'src' field" }, { status: 400 });
    }

    const targetCat = category || category_name || "Advertising";
    let orderNum = display_order !== undefined ? display_order : position_num;

    if (orderNum === undefined || orderNum === null) {
      const { data: maxRow } = await supabase
        .from("portfolio_images")
        .select("display_order")
        .eq("category_name", targetCat)
        .order("display_order", { ascending: false })
        .limit(1);
      orderNum = maxRow && maxRow.length > 0 ? (maxRow[0].display_order || 0) + 1 : 1;
    }

    const newRecord = {
      category_name: targetCat,
      src: src,
      width: width || 1600,
      height: height || 1200,
      title: title || "Untitled",
      description: description || "",
      display_order: orderNum,
    };

    const { data, error } = await supabase
      .from("portfolio_images")
      .insert([newRecord])
      .select();

    if (error) throw error;

    revalidatePath("/", "layout");

    return NextResponse.json({
      success: true,
      message: "Portfolio item created successfully",
      data: data?.[0],
    });
  } catch (error) {
    console.error("Error in POST /api/portfolio:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio item: " + error.message },
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
        if (sourceObj.position_num !== undefined) updateFields.display_order = sourceObj.position_num;

        let query = supabase.from("portfolio_images").update(updateFields);
        if (targetId) {
          query = query.eq("id", targetId);
        } else {
          query = query.eq("src", targetSrc);
        }

        const { data, error } = await query.select();

        if (error) throw error;

        revalidatePath("/", "layout");

        return NextResponse.json({
          success: true,
          message: "Image updated successfully in Supabase",
          data,
        });
      }

      // 2. Single Item Create
      if (action === "create" || image) {
        const img = image || body;
        const targetCat = img.category || img.category_name || "Advertising";
        let orderNum = img.display_order !== undefined ? img.display_order : img.position_num;

        if (orderNum === undefined || orderNum === null) {
          const { data: maxRow } = await supabase
            .from("portfolio_images")
            .select("display_order")
            .eq("category_name", targetCat)
            .order("display_order", { ascending: false })
            .limit(1);
          orderNum = maxRow && maxRow.length > 0 ? (maxRow[0].display_order || 0) + 1 : 1;
        }

        const newRecord = {
          category_name: targetCat,
          src: img.src,
          width: img.width || 1600,
          height: img.height || 1200,
          title: img.title || "Untitled",
          description: img.description || "",
          display_order: orderNum,
        };
        if (img.id) {
          newRecord.id = img.id;
        }

        const { data, error } = await supabase
          .from("portfolio_images")
          .insert([newRecord])
          .select();

        if (error) throw error;

        revalidatePath("/", "layout");

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

        revalidatePath("/", "layout");

        return NextResponse.json({
          success: true,
          message: "Image deleted successfully from Supabase",
        });
      }

      // 4. Batch items update without full table wipe
      if (action === "batch_update" || Array.isArray(items)) {
        const rowsToUpdate = (items || []).map((item, idx) => ({
          ...(item.id ? { id: item.id } : {}),
          category_name: item.category || item.category_name,
          src: item.src,
          width: item.width || 1600,
          height: item.height || 1200,
          title: item.title || "Untitled",
          description: item.description || "",
          display_order: item.display_order !== undefined ? item.display_order : (item.position_num !== undefined ? item.position_num : idx + 1),
        }));

        const { error } = await supabase
          .from("portfolio_images")
          .upsert(rowsToUpdate, { onConflict: "id" });

        if (error) throw error;

        revalidatePath("/", "layout");

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
