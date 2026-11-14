import { NextResponse } from "next/server";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

const ALLOWED_FOLDERS = new Set(["hero", "portfolio", "art_gallery", "about"]);

export async function POST(request) {
  if (!isCloudinaryConfigured) {
    return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const folder = ALLOWED_FOLDERS.has(body.folder) ? body.folder : "portfolio";
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { folder, timestamp };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
