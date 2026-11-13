import { v2 as cloudinary } from 'cloudinary';

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
 * Uploads a Buffer, base64 string, or remote HTTP(S) URL to Cloudinary
 * @param {Buffer|string} input - Image file buffer, base64 data, or remote URL
 * @param {string} folder - Destination folder on Cloudinary (default: 'portfolio')
 * @returns {Promise<{ secure_url: string, public_id: string, width: number, height: number }>}
 */
export async function uploadToCloudinary(input, folder = 'portfolio') {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary environment variables are not configured in .env.local.");
  }

  // If input is already a remote URL (e.g. from Supabase Storage) or base64 string
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
