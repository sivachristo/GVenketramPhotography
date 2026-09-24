import { supabase, isSupabaseConfigured } from "./supabase";

export function formatTitleFromFilename(filename) {
  const base = filename.replace(/\.[^/.]+$/, "");
  const clean = base.replace(/[-_]+/g, " ").trim();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : "Untitled Artwork";
}

/**
 * Compresses an image in the browser using HTML5 Canvas.
 * - Scales down to maxDimension (default 4096px) maintaining aspect ratio
 * - Converts to WebP format at specified quality (default 0.85)
 * - Returns { blob, width, height, uniqueFilename }
 */
export async function compressImageClient(file, maxDimension = 4096, quality = 0.85) {
  const fileNameLower = (file.name || "").toLowerCase();
  const isTiff =
    fileNameLower.endsWith(".tif") ||
    fileNameLower.endsWith(".tiff") ||
    file.type === "image/tiff" ||
    file.type === "image/tif";

  // Dedicated decoder for .tif and .tiff files (which browsers cannot render natively)
  if (isTiff) {
    try {
      const utifModule = await import("utif");
      const UTIF = utifModule.default || utifModule;
      const arrayBuffer = await file.arrayBuffer();
      const ifds = UTIF.decode(arrayBuffer);
      if (!ifds || ifds.length === 0) {
        throw new Error("Unable to parse TIFF structure");
      }
      UTIF.decodeImage(arrayBuffer, ifds[0]);
      const rgba = UTIF.toRGBA8(ifds[0]);
      const origWidth = ifds[0].width;
      const origHeight = ifds[0].height;

      const srcCanvas = document.createElement("canvas");
      srcCanvas.width = origWidth;
      srcCanvas.height = origHeight;
      const sCtx = srcCanvas.getContext("2d");
      const clamped = new Uint8ClampedArray(rgba.buffer, rgba.byteOffset, rgba.byteLength);
      const imgData = new ImageData(clamped, origWidth, origHeight);
      sCtx.putImageData(imgData, 0, 0);

      let width = origWidth;
      let height = origHeight;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(srcCanvas, 0, 0, width, height);

      const baseName = file.name
        .toLowerCase()
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${baseName}.webp`;

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve({
              blob: blob || file,
              width,
              height,
              uniqueFilename,
            });
          },
          "image/webp",
          quality
        );
      });
    } catch (tiffErr) {
      console.error("TIFF decoding error:", tiffErr);
      throw new Error(`Failed to decode TIFF image: ${tiffErr.message || "Invalid TIFF format"}`);
    }
  }

  return new Promise((resolve, reject) => {
    const isStandardImage =
      file.type?.startsWith("image/") ||
      /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(file.name);

    // If it's not a recognized image format, pass through
    if (!isStandardImage) {
      const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${file.name}`;
      return resolve({
        blob: file,
        width: 1600,
        height: 1200,
        uniqueFilename,
      });
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // Calculate proportional dimensions
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      // Draw image onto canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Sanitize filename and create unique .webp filename
      const baseName = file.name
        .toLowerCase()
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${baseName}.webp`;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            // Fallback if toBlob fails
            return resolve({
              blob: file,
              width: img.width,
              height: img.height,
              uniqueFilename,
            });
          }
          resolve({
            blob,
            width,
            height,
            uniqueFilename,
          });
        },
        "image/webp",
        quality
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image for compression: ${err?.message || "Invalid image"}`));
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads a single file:
 * 1. Compresses to WebP in browser (cutting 15-30MB down to <1MB)
 * 2. Uploads directly to Supabase Storage (bypassing Vercel 4.5MB limit)
 * 3. Falls back to /api/upload with compressed WebP if Supabase isn't reachable
 */
export async function uploadSingleImage(file, { signal, bucket = "portfolio-images" } = {}) {
  const formattedTitle = formatTitleFromFilename(file.name);
  const { blob, width, height, uniqueFilename } = await compressImageClient(file);

  // 1. Direct Supabase Storage Upload (Bypasses Vercel completely)
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: uploadResult, error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(uniqueFilename, blob, {
          contentType: blob.type || "image/webp",
          upsert: true,
        });

      if (!uploadErr && uploadResult) {
        const { data: urlData } = supabase.storage
          .from(bucket)
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
      console.warn("Direct Supabase upload failed, falling back to API upload:", uploadErr);
    } catch (directErr) {
      console.warn("Supabase direct upload exception, falling back to API:", directErr);
    }
  }

  // 2. Server API fallback (Sends pre-compressed <1MB WebP to prevent Vercel 413)
  const formData = new FormData();
  formData.append("files", blob, uniqueFilename);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    signal,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed with status ${res.status}`);
  }

  const data = await res.json();
  const fileResult = (data.files && data.files[0]) || data;

  return {
    success: true,
    src: fileResult.src,
    title: formattedTitle,
    originalName: file.name,
    width: fileResult.width || width,
    height: fileResult.height || height,
    storage: fileResult.storage || "api",
  };
}

/**
 * Uploads multiple files sequentially with per-item progress tracking and resilient error handling.
 * Continues uploading remaining files even if an individual file fails.
 */
export async function uploadMultipleImages(files, {
  onProgress,
  onItemStart,
  onItemComplete,
  onItemError,
  signal,
  bucket = "portfolio-images",
} = {}) {
  const total = files.length;
  if (total === 0) return { success: true, files: [], errors: [] };

  const successful = [];
  const errors = [];

  for (let i = 0; i < total; i++) {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const file = files[i];
    if (onItemStart) {
      onItemStart(i, file);
    }

    try {
      const uploaded = await uploadSingleImage(file, { signal, bucket });
      successful.push(uploaded);
      if (onItemComplete) {
        onItemComplete(i, file, uploaded);
      }
    } catch (err) {
      console.error(`Error uploading ${file.name}:`, err);
      const errorItem = {
        index: i,
        fileName: file.name,
        error: err.message || "Upload failed",
      };
      errors.push(errorItem);
      if (onItemError) {
        onItemError(i, file, err);
      }
    }

    if (onProgress) {
      const percent = Math.round(((i + 1) / total) * 90);
      onProgress(percent, i + 1, total, file);
    }
  }

  return {
    success: successful.length > 0,
    files: successful,
    errors,
  };
}
