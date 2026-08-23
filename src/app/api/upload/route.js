import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function formatTitleFromFilename(filename) {
  const base = filename.replace(/\.[^/.]+$/, "");
  const clean = base.replace(/[-_]+/g, " ").trim();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : "Untitled Artwork";
}

async function processSingleFile(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, "-")
    .replace(/-+/g, "-");
  const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${safeName}`;
  const formattedTitle = formatTitleFromFilename(file.name);

  // 1. Supabase Storage upload
  if (isSupabaseConfigured && supabase) {
    const { data: uploadResult, error: uploadErr } = await supabase.storage
      .from("portfolio-images")
      .upload(uniqueFilename, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (uploadErr) {
      throw new Error(`Supabase Storage error for ${file.name}: ${uploadErr.message}`);
    }

    if (uploadResult) {
      const { data: urlData } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(uniqueFilename);

      if (urlData && urlData.publicUrl) {
        return {
          success: true,
          src: urlData.publicUrl,
          title: formattedTitle,
          originalName: file.name,
          width: 1600,
          height: 1200,
          storage: "supabase",
        };
      }
    }
  }

  // 2. Local filesystem upload fallback
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, uniqueFilename);
  fs.writeFileSync(filePath, buffer);

  return {
    success: true,
    src: `/uploads/${uniqueFilename}`,
    title: formattedTitle,
    originalName: file.name,
    width: 1600,
    height: 1200,
    storage: "local",
  };
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const fileList = formData.getAll("files").concat(formData.getAll("file")).filter((f) => f && f.name);

    if (fileList.length === 0) {
      return NextResponse.json({ error: "No files provided for upload" }, { status: 400 });
    }

    // Process all files in parallel
    const uploadPromises = fileList.map((file) => processSingleFile(file));
    const results = await Promise.all(uploadPromises);

    if (fileList.length === 1) {
      const single = results[0];
      return NextResponse.json({
        ...single,
        files: results,
      });
    }

    return NextResponse.json({
      success: true,
      files: results,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed: " + error.message },
      { status: 500 }
    );
  }
}
