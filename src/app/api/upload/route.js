import { NextResponse } from "next/server";
import { uploadToCloudinary, isCloudinaryConfigured, compressBufferForCloudinary, CLOUDINARY_MAX_UPLOAD_BYTES } from "@/lib/cloudinary";
import { assertSupabaseUploadAllowed } from "@/lib/storageGuard";
import { formatTitleFromFilename } from "@/utils/formatTitle";


/**
 * Compress any incoming image to WebP via Sharp.
 * - Bypasses Sharp's default 268MP pixel safety cap
 * - Resizes down to max 2560px on longest side (keeps aspect ratio)
 * - Converts to WebP at quality 80
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

  let { buffer, width, height } = await compressBufferForCloudinary(inputBuffer);
  if (buffer.length > CLOUDINARY_MAX_UPLOAD_BYTES) {
    throw new Error("Compressed image is still over Cloudinary's 10 MB limit. It was not saved to Supabase.");
  }

  return {
    buffer,
    width,
    height,
    uniqueFilename,
  };
}

async function processSingleFile(file) {
  const formattedTitle = formatTitleFromFilename(file.name);

  // --- Compress to WebP first ---
  const { buffer, width, height } = await compressToWebP(file);

  const stored = {
    title: formattedTitle,
    originalName: file.name,
    width,
    height,
  };

  if (!isCloudinaryConfigured) {
    await assertSupabaseUploadAllowed(buffer.length);
  }

  try {
    const cRes = await uploadToCloudinary(buffer, "portfolio");
    return {
      success: true,
      src: cRes.secure_url,
      url: cRes.secure_url,
      ...stored,
      width: cRes.width || width,
      height: cRes.height || height,
      storage: "cloudinary",
    };
  } catch (cErr) {
    console.error("Cloudinary upload failed:", cErr.message);
    try {
      await assertSupabaseUploadAllowed(buffer.length);
    } catch (quotaErr) {
      const error = new Error(`${quotaErr.message} Cloudinary error: ${cErr.message}`);
      error.status = quotaErr.status || 507;
      throw error;
    }
  }
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
    const rawResults = await Promise.all(uploadPromises);
    const results = rawResults.map((r) => ({
      ...r,
      url: r.url || r.src,
    }));

    if (fileList.length === 1) {
      const single = results[0];
      return NextResponse.json({
        ...single,
        url: single.url || single.src,
        files: results,
      });
    }

    return NextResponse.json({
      success: true,
      files: results,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json(
      {
        error: error.message || "Upload failed",
        ...(isProd ? {} : {
          details: error.details || {
            name: error.name,
            message: error.message,
            causeCode: error.cause?.code,
            causeMessage: error.cause?.message,
            causeName: error.cause?.name,
            stack: error.stack,
          },
        }),
      },
      { status: error.status || 500 }
    );
  }
}
