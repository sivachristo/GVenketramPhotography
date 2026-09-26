import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import sharp from "sharp";

function formatTitleFromFilename(filename) {
  const base = filename.replace(/\.[^/.]+$/, "");
  const clean = base.replace(/[-_]+/g, " ").trim();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : "Untitled Artwork";
}

/**
 * Compress any incoming image to WebP via Sharp.
 * - Bypasses Sharp's default 268MP pixel safety cap
 * - Resizes down to max 4096px on longest side (keeps aspect ratio)
 * - Converts to WebP at quality 82
 * Returns { buffer, width, height, uniqueFilename }
 */
async function compressToWebP(file) {
  const bytes = await file.arrayBuffer();
  const inputBuffer = Buffer.from(bytes);

  // Build the output filename — always .webp regardless of input type
  const baseName = file.name
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")           // strip extension
    .replace(/[^a-z0-9]/g, "-")         // sanitise
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${baseName}.webp`;

  // limitInputPixels: false — bypass Sharp's default ~268MP safety cap (we handle large images safely via resize)
  const { data: webpBuffer, info } = await sharp(inputBuffer, { limitInputPixels: false })
    .resize({
      width: 4096,
      height: 4096,
      fit: "inside",            // shrink proportionally, never crop
      withoutEnlargement: true, // don't upscale small images
    })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true }); // returns { data, info } with real output dimensions

  return {
    buffer: webpBuffer,
    width: info.width,
    height: info.height,
    uniqueFilename,
  };
}

async function processSingleFile(file) {
  const formattedTitle = formatTitleFromFilename(file.name);

  // --- Compress to WebP first ---
  const { buffer, width, height, uniqueFilename } = await compressToWebP(file);



  // 1. Supabase Storage upload (compressed WebP)
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: uploadResult, error: uploadErr } = await supabase.storage
        .from("portfolio-images")
        .upload(uniqueFilename, buffer, {
          contentType: "image/webp",
          upsert: true,
        });

      if (uploadErr) {
        console.error("=== SUPABASE UPLOAD ERROR OBJECT ===");
        console.error("uploadErr:", uploadErr);
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
            width,
            height,
            storage: "supabase",
          };
        }
      }
    } catch (err) {
      console.error("=== SUPABASE UPLOAD CAUGHT EXCEPTION ===");
      console.error("err.name:", err.name);
      console.error("err.message:", err.message);
      console.error("err.stack:", err.stack);
      console.error("err.cause:", err.cause);
      console.error("err.cause?.code:", err.cause?.code);
      console.error("err.cause?.message:", err.cause?.message);

      const customErr = new Error(err.message);
      customErr.name = err.name;
      customErr.cause = err.cause;
      customErr.details = {
        name: err.name,
        message: err.message,
        causeCode: err.cause?.code,
        causeMessage: err.cause?.message,
        causeName: err.cause?.name,
        stack: err.stack,
      };
      throw customErr;
    }
  }

  // 2. Local filesystem fallback (also saves compressed WebP)
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
    width,
    height,
    storage: "local",
  };
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const fileList = formData
      .getAll("files")
      .concat(formData.getAll("file"))
      .filter((f) => f && f.name);

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
      {
        error: "Upload failed: " + error.message,
        details: error.details || {
          name: error.name,
          message: error.message,
          causeCode: error.cause?.code,
          causeMessage: error.cause?.message,
          causeName: error.cause?.name,
          stack: error.stack,
        },
      },
      { status: 500 }
    );
  }
}
