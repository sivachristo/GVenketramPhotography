import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

export const CLOUDINARY_MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const CLOUDINARY_TARGET_BYTES = 9.5 * 1024 * 1024;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const isCloudinaryConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

/**
 * Shrinks an image until it fits Cloudinary's 10 MB free-plan upload limit.
 * @returns {Promise<{ buffer: Buffer, width: number, height: number }>}
 */
export async function compressBufferForCloudinary(inputBuffer) {
  let edge = 2560;
  let quality = 80;
  let buffer = inputBuffer;
  let width = 0;
  let height = 0;

  for (let attempt = 0; attempt < 8; attempt++) {
    const { data, info } = await sharp(inputBuffer, { limitInputPixels: false, failOn: "none" })
      .rotate()
      .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
      .webp({ quality })
      .toBuffer({ resolveWithObject: true });
    buffer = data;
    width = info.width;
    height = info.height;
    if (buffer.length <= CLOUDINARY_TARGET_BYTES) {
      return { buffer, width, height };
    }
    if (quality > 50) quality -= 10;
    else edge = Math.round(edge * 0.8);
  }

  if (buffer.length > CLOUDINARY_MAX_UPLOAD_BYTES) {
    throw new Error(
      `Image is still ${(buffer.length / (1024 * 1024)).toFixed(1)} MB after compression. Cloudinary's free plan accepts files up to 10 MB, so it was not saved to Supabase.`
    );
  }

  return { buffer, width, height };
}

/**
 * Uploads a Buffer, base64 string, or remote HTTP(S) URL to Cloudinary.
 * Remote files over the 10 MB free-plan limit are compressed first.
 * @param {Buffer|string} input - Image file buffer, base64 data, or remote URL
 * @param {string} folder - Destination folder on Cloudinary (default: 'portfolio')
 * @returns {Promise<{ secure_url: string, public_id: string, width: number, height: number }>}
 */
export async function uploadToCloudinary(input, folder = 'portfolio') {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary environment variables are not configured in .env.local.");
  }

  if (typeof input === "string" && /^https?:\/\//i.test(input)) {
    const response = await fetch(input);
    if (!response.ok) {
      throw new Error(`Could not read the stored image (${response.status}).`);
    }
    const downloaded = Buffer.from(await response.arrayBuffer());
    input = downloaded.length > CLOUDINARY_TARGET_BYTES
      ? (await compressBufferForCloudinary(downloaded)).buffer
      : downloaded;
  }

  // If input is already a base64 string
  if (typeof input === 'string') {
    const result = await cloudinary.uploader.upload(input, {
      folder,
      resource_type: 'image',
    });
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    };
  }

  // If input is a Buffer
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
        });
      }
    );
    uploadStream.end(input);
  });
}

export { cloudinary };
