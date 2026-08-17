import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-")
      .replace(/-+/g, "-");
    const uniqueFilename = `${Date.now()}-${safeName}`;

    // 1. Upload to Supabase Storage bucket if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: uploadResult, error: uploadErr } = await supabase.storage
          .from("portfolio-images")
          .upload(uniqueFilename, buffer, {
            contentType: file.type || "image/jpeg",
            upsert: true,
          });

        if (!uploadErr && uploadResult) {
          const { data: urlData } = supabase.storage
            .from("portfolio-images")
            .getPublicUrl(uniqueFilename);

          if (urlData && urlData.publicUrl) {
            return NextResponse.json({
              success: true,
              src: urlData.publicUrl,
              width: 1600,
              height: 1200,
              storage: "supabase",
            });
          }
        } else {
          console.warn("Supabase Storage upload warning:", uploadErr?.message);
        }
      } catch (sbErr) {
        console.warn("Supabase upload exception:", sbErr.message);
      }
    }

    // 2. Fallback to local public/uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      src: publicUrl,
      width: 1600,
      height: 1200,
      storage: "local",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed: " + error.message },
      { status: 500 }
    );
  }
}
