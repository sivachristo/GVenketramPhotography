import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function GET() {
  let cloudinaryStats = null;
  let supabaseStats = null;

  // 1. Fetch Cloudinary Usage Stats
  if (isCloudinaryConfigured) {
    try {
      const usage = await cloudinary.api.usage();
      const storageBytes = usage.storage?.usage || 0;
      const bandwidthBytes = usage.bandwidth?.usage || 0;
      const creditsUsed = usage.credits?.usage || 0;
      const creditsLimit = usage.credits?.limit || 25;
      const creditsPercent = usage.credits?.used_percent || 0;

      cloudinaryStats = {
        configured: true,
        plan: usage.plan || "Free",
        creditsUsed: +creditsUsed.toFixed(2),
        creditsLimit,
        creditsPercent: +creditsPercent.toFixed(2),
        storageBytes,
        storageMB: +(storageBytes / (1024 * 1024)).toFixed(2),
        storageGB: +(storageBytes / (1024 * 1024 * 1024)).toFixed(3),
        storageLimitGB: 25,
        resourcesCount: usage.resources || 0,
        transformations: usage.transformations?.usage || 0,
        bandwidthMB: +(bandwidthBytes / (1024 * 1024)).toFixed(2),
      };
    } catch (err) {
      console.error("Cloudinary stats error:", err.message);
      cloudinaryStats = { configured: true, error: err.message };
    }
  } else {
    cloudinaryStats = { configured: false };
  }

  // 2. Fetch Supabase Bucket & DB Stats
  if (isSupabaseConfigured && supabase) {
    try {
      // List all objects in portfolio-images bucket recursively
      async function listAllFiles(prefix = "") {
        let allFiles = [];
        const { data, error } = await supabase.storage.from("portfolio-images").list(prefix, { limit: 1000 });
        if (error || !data) return allFiles;

        for (const item of data) {
          const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
          if (!item.id && (!item.metadata || Object.keys(item.metadata).length === 0)) {
            const subFiles = await listAllFiles(itemPath);
            allFiles = allFiles.concat(subFiles);
          } else {
            allFiles.push({ ...item, fullPath: itemPath });
          }
        }
        return allFiles;
      }

      const files = await listAllFiles();
      let totalBytes = 0;
      files.forEach((f) => {
        totalBytes += f.metadata?.size || f.size || 0;
      });

      const { count: portfolioCount } = await supabase
        .from("portfolio_images")
        .select("*", { count: "exact", head: true });

      const { count: galleryCount } = await supabase
        .from("art_gallery")
        .select("*", { count: "exact", head: true });

      const { count: categoryCount } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });

      supabaseStats = {
        configured: true,
        storageBytes: totalBytes,
        storageMB: +(totalBytes / (1024 * 1024)).toFixed(2),
        storageGB: +(totalBytes / (1024 * 1024 * 1024)).toFixed(3),
        storageLimitMB: 1000, // 1 GB free tier limit
        fileCount: files.length,
        portfolioRows: portfolioCount || 0,
        galleryRows: galleryCount || 0,
        categoryRows: categoryCount || 0,
      };
    } catch (err) {
      console.error("Supabase stats error:", err.message);
      supabaseStats = { configured: true, error: err.message };
    }
  } else {
    supabaseStats = { configured: false };
  }

  return NextResponse.json({
    success: true,
    cloudinary: cloudinaryStats,
    supabase: supabaseStats,
    timestamp: new Date().toISOString(),
  });
}
