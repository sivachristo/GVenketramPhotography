import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MAIN_IMAGE_COLUMNS, normalizeMainImageDevice } from "@/lib/getMainImages";
import { initialMainImages } from "@/data/mainImages";
import cloudinaryFallback from "@/data/cloudinaryFallback.json";
import fs from "fs";
import path from "path";

const LOCAL_STORAGE_FILE = path.join(process.cwd(), "src", "data", "mainImages.json");

function revalidateMainImagesCache() {
  revalidateTag("main-images", { expire: 0 });
  revalidatePath("/", "layout");
}

function readLocalImages() {
  try {
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(LOCAL_STORAGE_FILE, "utf-8"));
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading local main images:", err);
  }
  const cldHeroes = cloudinaryFallback?.tables?.main_images;
  if (Array.isArray(cldHeroes) && cldHeroes.length > 0) {
    return cldHeroes;
  }
  return initialMainImages;
}

function writeLocalImages(images) {
  try {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(images, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local main images:", err);
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    const deviceFilter = searchParams.get("device"); // optional: "desktop" | "mobile"

    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from("main_images")
        .select(MAIN_IMAGE_COLUMNS)
        .order("display_order", { ascending: true });

      if (activeOnly) {
        query = query.eq("is_active", true);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const mapped = data.map(normalizeMainImageDevice);
        const filtered = deviceFilter
          ? mapped.filter((img) => img.device === deviceFilter)
          : mapped;
        return NextResponse.json({ success: true, mainImages: filtered, source: "supabase" });
      }
    }

    const localList = readLocalImages().map(normalizeMainImageDevice);
    let filtered = activeOnly ? localList.filter((img) => img.is_active !== false) : localList;
    if (deviceFilter) {
      filtered = filtered.filter((img) => img.device === deviceFilter);
    }
    return NextResponse.json({ success: true, mainImages: filtered, source: "local" });
  } catch (error) {
    console.error("Error in GET /api/main-images:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { src, title, alt, display_order, is_active, device } = body;

    if (!src) {
      return NextResponse.json({ error: "Missing required 'src' field" }, { status: 400 });
    }

    if (String(src).includes("supabase.co/storage")) {
      return NextResponse.json(
        { error: "Supabase Storage URLs are not allowed. Hero images must be stored in Cloudinary." },
        { status: 400 }
      );
    }

    const isMobile = device === "mobile";
    const idPrefix = isMobile ? "main-mob-" : "main-";

    const newImage = {
      id: body.id || `${idPrefix}${Date.now()}`,
      src,
      title: title || (isMobile ? "Mobile Hero Image" : "Main Image"),
      alt: alt || title || (isMobile ? "Mobile Hero Image" : "Main Hero Image"),
      display_order: display_order !== undefined ? Number(display_order) : Date.now(),
      is_active: is_active !== undefined ? is_active : true,
      created_at: new Date().toISOString(),
    };

    // Try Supabase insert
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("main_images")
          .insert([newImage])
          .select(MAIN_IMAGE_COLUMNS);

        if (!error && data) {
          revalidateMainImagesCache();
          return NextResponse.json({
            success: true,
            image: normalizeMainImageDevice(data[0]),
            source: "supabase",
          });
        }
      } catch (err) {
        console.warn("Supabase main_images insert failed, saving locally:", err.message);
      }
    }

    // Local fallback
    const list = readLocalImages();
    list.push(newImage);
    list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    writeLocalImages(list);

    revalidateMainImagesCache();
    return NextResponse.json({
      success: true,
      image: normalizeMainImageDevice(newImage),
      source: "local",
    });
  } catch (error) {
    console.error("Error in POST /api/main-images:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, updates, action, items } = body;

    // Handle batch reorder
    if (action === "reorder" || Array.isArray(items)) {
      const reorderedItems = items || [];
      if (isSupabaseConfigured && supabase) {
        try {
          const promises = reorderedItems.map((item, idx) =>
            supabase
              .from("main_images")
              .update({ display_order: idx + 1 })
              .eq("id", item.id)
          );
          await Promise.all(promises);
        } catch (err) {
          console.warn("Supabase reorder failed:", err.message);
        }
      }

      const localList = readLocalImages();
      const updated = localList.map((img) => {
        const matchIdx = reorderedItems.findIndex((r) => r.id === img.id);
        if (matchIdx !== -1) {
          return { ...img, display_order: matchIdx + 1 };
        }
        return img;
      });
      updated.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      writeLocalImages(updated);

      revalidateMainImagesCache();
      return NextResponse.json({ success: true, message: "Main images reordered" });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing required 'id' field" }, { status: 400 });
    }

    const rawEditFields = updates || body;
    const { device, ...editFields } = rawEditFields;

    if (editFields.src && String(editFields.src).includes("supabase.co/storage")) {
      return NextResponse.json(
        { error: "Supabase Storage URLs are not allowed. Hero images must be stored in Cloudinary." },
        { status: 400 }
      );
    }

    // Try Supabase update
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("main_images")
          .update(editFields)
          .eq("id", id)
          .select(MAIN_IMAGE_COLUMNS);

        if (!error && data) {
          revalidateMainImagesCache();
          return NextResponse.json({
            success: true,
            image: normalizeMainImageDevice(data[0]),
            source: "supabase",
          });
        }
      } catch (err) {
        console.warn("Supabase update failed, updating locally:", err.message);
      }
    }

    // Local fallback update
    const list = readLocalImages();
    const index = list.findIndex((img) => img.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...editFields };
      writeLocalImages(list);
      revalidateMainImagesCache();
      return NextResponse.json({
        success: true,
        image: normalizeMainImageDevice(list[index]),
        source: "local",
      });
    }

    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  } catch (error) {
    console.error("Error in PATCH /api/main-images:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    let targetId = searchParams.get("id");

    if (!targetId) {
      try {
        const body = await request.json();
        targetId = body.id;
      } catch {
        // body was empty or not JSON
      }
    }

    if (!targetId) {
      return NextResponse.json({ error: "Missing required 'id' field" }, { status: 400 });
    }

    // Try Supabase delete
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("main_images").delete().eq("id", targetId);
      } catch (err) {
        console.warn("Supabase delete failed:", err.message);
      }
    }

    // Local fallback delete
    const list = readLocalImages().filter((img) => img.id !== targetId);
    writeLocalImages(list);

    revalidateMainImagesCache();
    return NextResponse.json({ success: true, message: "Main image deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/main-images:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
