import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { listSupabaseStorageFiles } from "@/lib/storageGuard";

export const maxDuration = 60;

const BATCH = 3;

function isCloudinaryUrl(url) {
  return typeof url === "string" && url.includes("res.cloudinary.com");
}

async function removeSupabaseObject(src) {
  if (!src || !src.includes("supabase.co/storage")) return;
  for (const bucket of ["portfolio-images", "artworks"]) {
    const part = src.split(`/${bucket}/`)[1]?.split("?")[0];
    if (!part) continue;
    await supabase.storage.from(bucket).remove([decodeURIComponent(part)]);
    return;
  }
}

async function migrateTable({ table, column, folder, failedIds }) {
  const { data: records, error } = await supabase.from(table).select(`id, ${column}`).limit(5000);
  if (error) throw error;

  const pending = (records || []).filter((record) => {
    const url = record[column] || "";
    if (!url || isCloudinaryUrl(url)) return false;
    if (failedIds.has(record.id)) return false;
    return true;
  });

  const batch = pending.slice(0, BATCH);
  const stats = { uploaded: 0, errors: 0 };
  const newFailed = [];

  for (const record of batch) {
    const src = record[column];
    try {
      const res = await uploadToCloudinary(src, folder);
      const { error: updateErr } = await supabase
        .from(table)
        .update({ [column]: res.secure_url })
        .eq("id", record.id);
      if (updateErr) throw updateErr;
      await removeSupabaseObject(src);
      stats.uploaded += 1;
    } catch (err) {
      console.error(`Migration error for ${table} ${record.id}:`, err.message);
      stats.errors += 1;
      newFailed.push(record.id);
    }
  }

  return {
    stats,
    newFailed,
    hasMore: pending.length > batch.length,
  };
}

async function deleteOrphanBatch() {
  const files = await listSupabaseStorageFiles();
  const { data: activePortfolio } = await supabase.from("portfolio_images").select("src").limit(5000);
  const { data: activeArt } = await supabase.from("art_gallery").select("image").limit(5000);
  const activeUrls = [
    ...(activePortfolio || []).map((row) => row.src),
    ...(activeArt || []).map((row) => row.image),
  ].filter(Boolean);

  const orphans = files.filter((file) => {
    return !activeUrls.some((url) => {
      const encoded = encodeURIComponent(file.fullPath);
      return url.includes(file.fullPath) || url.includes(encoded) || url.includes(file.name);
    });
  });

  const batch = orphans.slice(0, 20);
  if (batch.length === 0) return { removed: 0, hasMore: false };

  const byBucket = new Map();
  for (const file of batch) {
    const paths = byBucket.get(file.bucket) || [];
    paths.push(file.fullPath);
    byBucket.set(file.bucket, paths);
  }

  let removed = 0;
  for (const [bucket, paths] of byBucket) {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (!error) removed += paths.length;
    else console.error(`Orphan delete failed for ${bucket}:`, error.message);
  }

  return { removed, hasMore: orphans.length > batch.length };
}

export async function POST(request) {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  if (!isCloudinaryConfigured) {
    return NextResponse.json({ error: "Cloudinary credentials missing in .env.local" }, { status: 500 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const phase = body.phase || "portfolio";
    const failedIds = new Set(Array.isArray(body.failedIds) ? body.failedIds : []);

    if (phase === "portfolio" || phase === "art") {
      const result = await migrateTable({
        table: phase === "portfolio" ? "portfolio_images" : "art_gallery",
        column: phase === "portfolio" ? "src" : "image",
        folder: phase === "portfolio" ? "portfolio" : "art_gallery",
        failedIds,
      });

      const nextFailed = [...failedIds, ...result.newFailed];
      const nextPhase = result.hasMore ? phase : phase === "portfolio" ? "art" : "orphans";

      return NextResponse.json({
        success: true,
        done: false,
        nextPhase,
        failedIds: nextFailed,
        stats: {
          portfolioUploaded: phase === "portfolio" ? result.stats.uploaded : 0,
          artUploaded: phase === "art" ? result.stats.uploaded : 0,
          orphansRemoved: 0,
          errors: result.stats.errors,
        },
      });
    }

    const orphanResult = await deleteOrphanBatch();
    return NextResponse.json({
      success: true,
      done: !orphanResult.hasMore,
      nextPhase: orphanResult.hasMore ? "orphans" : null,
      failedIds: [...failedIds],
      stats: {
        portfolioUploaded: 0,
        artUploaded: 0,
        orphansRemoved: orphanResult.removed,
        errors: 0,
      },
    });
  } catch (error) {
    console.error("Migration endpoint error:", error);
    return NextResponse.json(
      { error: "Migration failed: " + error.message },
      { status: 500 }
    );
  }
}
