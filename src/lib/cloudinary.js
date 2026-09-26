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
 * Uploads a Buffer (or base64 string) to Cloudinary
 * @param {Buffer} buffer - Image file buffer
 * @param {string} folder - Destination folder on Cloudinary (default: 'portfolio')
 * @returns {Promise<{ secure_url: string, public_id: string, width: number, height: number }>}
 */
export async function uploadToCloudinary(buffer, folder = 'portfolio') {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary environment variables are not configured in .env.local.");
  }

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
    uploadStream.end(buffer);
  });
}

export { cloudinary };
