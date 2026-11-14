import { formatTitleFromFilename } from "../utils/formatTitle";

export { formatTitleFromFilename };

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
    let srcCanvas = null;
    let canvas = null;
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

      srcCanvas = document.createElement("canvas");
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

      canvas = document.createElement("canvas");
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

      return await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (srcCanvas) { srcCanvas.width = 0; srcCanvas.height = 0; }
            if (canvas) { canvas.width = 0; canvas.height = 0; }
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
      if (srcCanvas) { srcCanvas.width = 0; srcCanvas.height = 0; }
      if (canvas) { canvas.width = 0; canvas.height = 0; }
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
          canvas.width = 0;
          canvas.height = 0;
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

const HERO_TARGET_BYTES = 9 * 1024 * 1024;

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

/**
 * Every hero image is encoded to 9 MB. Quality and dimensions are adjusted
 * until the file lands on that size without going over it.
 */
export async function prepareHeroImage(file) {
  const name = file.name || "hero.jpg";
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not read this image. Use a standard RGB JPEG, PNG, or WebP."));
      image.src = objectUrl;
    });

    const longest = Math.max(img.width, img.height);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const encode = async (edge, quality) => {
      const scale = Math.min(1, edge / longest);
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      return canvasToBlob(canvas, "image/jpeg", quality);
    };

    let edge = Math.min(longest, 12000);
    let best = null;

    const keep = (blob) => {
      if (blob && blob.size <= HERO_TARGET_BYTES && (!best || blob.size > best.size)) {
        best = blob;
      }
    };

    while (edge >= 1200) {
      const smallest = await encode(edge, 0.4);
      if (smallest && smallest.size > HERO_TARGET_BYTES) {
        edge = Math.round(edge * 0.86);
        continue;
      }

      let low = 0.4;
      let high = 0.98;
      for (let i = 0; i < 10; i++) {
        const quality = (low + high) / 2;
        const blob = await encode(edge, quality);
        if (!blob || blob.size > HERO_TARGET_BYTES) {
          high = quality;
        } else {
          low = quality;
          keep(blob);
        }
      }
      break;
    }

    canvas.width = 0;
    canvas.height = 0;

    if (!best) {
      throw new Error("Could not compress this hero image to 9 MB.");
    }

    const base = name.replace(/\.[^.]+$/, "") || "hero";
    return new File([best], `${base}.jpg`, { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Sends a hero file directly to Cloudinary. The Next.js upload route is capped
 * near 4.5 MB, which would force a heavier compress than the 9 MB target.
 */
export async function uploadHeroImage(file) {
  const payload = await prepareHeroImage(file);
  const signRes = await fetch("/api/admin/cloudinary-sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "hero" }),
  });
  const sign = await signRes.json().catch(() => ({}));
  if (!signRes.ok || !sign.signature) {
    throw new Error(sign.error || "Could not start the Cloudinary upload.");
  }

  const body = new FormData();
  body.append("file", payload, payload.name);
  body.append("api_key", sign.apiKey);
  body.append("timestamp", String(sign.timestamp));
  body.append("signature", sign.signature);
  body.append("folder", sign.folder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  const data = await uploadRes.json().catch(() => ({}));
  if (!uploadRes.ok || !data.secure_url) {
    throw new Error(data?.error?.message || "Cloudinary rejected this hero image.");
  }
  return data.secure_url;
}

/**
 * Uploads one image straight to Cloudinary.
 * The file never passes through Supabase Storage. The 900 MB safety limit
 * is enforced on the server only for a Supabase write, which this path does not do.
 */
export async function uploadSingleImage(file, { signal, folder = "portfolio" } = {}) {
  const formattedTitle = formatTitleFromFilename(file.name);
  const cloudinaryLimit = 9.5 * 1024 * 1024;
  let edge = 2560;
  let quality = 0.8;
  let compressed = await compressImageClient(file, edge, quality);
  while (compressed.blob.size > cloudinaryLimit && edge > 1200) {
    quality = Math.max(0.5, quality - 0.1);
    edge = Math.round(edge * 0.85);
    compressed = await compressImageClient(file, edge, quality);
  }
  if (compressed.blob.size > 10 * 1024 * 1024) {
    throw new Error(
      "This image is still over Cloudinary's 10 MB upload limit after compression. It was not saved to Supabase."
    );
  }

  const signRes = await fetch("/api/admin/cloudinary-sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
    signal,
  });
  const sign = await signRes.json().catch(() => ({}));
  if (!signRes.ok || !sign.signature) {
    throw new Error(sign.error || "Could not start the Cloudinary upload.");
  }

  const body = new FormData();
  body.append("file", compressed.blob, compressed.uniqueFilename);
  body.append("api_key", sign.apiKey);
  body.append("timestamp", String(sign.timestamp));
  body.append("signature", sign.signature);
  body.append("folder", sign.folder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
    method: "POST",
    body,
    signal,
  });
  const data = await uploadRes.json().catch(() => ({}));
  if (!uploadRes.ok || !data.secure_url) {
    throw new Error(data?.error?.message || "Cloudinary rejected this image. It was not saved to Supabase.");
  }

  return {
    success: true,
    src: data.secure_url,
    title: formattedTitle,
    originalName: file.name,
    width: data.width || compressed.width,
    height: data.height || compressed.height,
    storage: "cloudinary",
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
      const folder = bucket === "artworks" ? "art_gallery" : "portfolio";
      const uploaded = await uploadSingleImage(file, { signal, folder });
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
