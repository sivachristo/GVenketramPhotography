import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const SUPABASE_SAFETY_LIMIT_MB = 900;
export const SUPABASE_SAFETY_LIMIT_BYTES = 900 * 1024 * 1024; // 943,718,400 bytes

/**
 * Calculates total byte usage across all Supabase Storage buckets.
 * @returns {Promise<number>} Total usage in bytes
 */
export async function getSupabaseStorageUsageBytes() {
  if (!isSupabaseConfigured || !supabase) {
    return 0;
  }

  const buckets = ["portfolio-images", "artworks"];
  let totalBytes = 0;

  async function listFolderBytes(bucket, prefix = "") {
    let bytes = 0;
    try {
      const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
      if (error || !data) return bytes;

      for (const item of data) {
        const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
        if (!item.id && (!item.metadata || Object.keys(item.metadata).length === 0)) {
          const subFolderBytes = await listFolderBytes(bucket, itemPath);
          bytes += subFolderBytes;
        } else {
          bytes += item.metadata?.size || item.size || 0;
        }
      }
    } catch (err) {
      console.error(`Error calculating storage bytes for bucket ${bucket}:`, err.message);
    }
    return bytes;
  }

  for (const bucket of buckets) {
    const bucketBytes = await listFolderBytes(bucket);
    totalBytes += bucketBytes;
  }

  return totalBytes;
}

/**
 * Verifies whether adding incomingBytes will exceed the 900 MB safety limit.
 * @param {number} incomingBytes - Size of file to be uploaded in bytes
 * @returns {Promise<{ allowed: boolean, currentBytes: number, currentMB: number, remainingMB: number, limitMB: number }>}
 */
export async function verifySupabaseQuota(incomingBytes = 0) {
  const currentBytes = await getSupabaseStorageUsageBytes();
  const projectedBytes = currentBytes + incomingBytes;
  const allowed = projectedBytes <= SUPABASE_SAFETY_LIMIT_BYTES;

  const currentMB = +(currentBytes / (1024 * 1024)).toFixed(2);
  const projectedMB = +(projectedBytes / (1024 * 1024)).toFixed(2);
  const remainingMB = +Math.max(0, SUPABASE_SAFETY_LIMIT_MB - currentMB).toFixed(2);

  return {
    allowed,
    currentBytes,
    currentMB,
    projectedMB,
    remainingMB,
    limitMB: SUPABASE_SAFETY_LIMIT_MB,
  };
}
