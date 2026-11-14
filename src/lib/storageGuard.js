import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const SUPABASE_SAFETY_LIMIT_MB = 900;
export const SUPABASE_SAFETY_LIMIT_BYTES = 900 * 1024 * 1024; // 943,718,400 bytes

const BUCKETS = ["portfolio-images", "artworks"];
const PAGE_SIZE = 100;

/**
 * Lists every object in the portfolio storage buckets.
 * Supabase caps each list call at 100 rows, so this walks pages and folders.
 * @returns {Promise<Array<{ bucket: string, name: string, fullPath: string, size: number }>>}
 */
export async function listSupabaseStorageFiles() {
  if (!isSupabaseConfigured || !supabase) return [];

  const files = [];

  async function listFolder(bucket, prefix) {
    let offset = 0;

    while (offset <= 10000) {
      const { data, error } = await supabase.storage.from(bucket).list(prefix, {
        limit: PAGE_SIZE,
        offset,
        sortBy: { column: "name", order: "asc" },
      });

      if (error) {
        const message = error.message || "Unknown storage error";
        if (!prefix && /bucket not found|does not exist/i.test(message)) return;
        throw new Error(`Could not measure the ${bucket} bucket: ${message}`);
      }
      if (!data || data.length === 0) return;

      for (const item of data) {
        if (!item?.name) continue;
        const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
        const isFolder = item.id == null;
        if (isFolder) {
          await listFolder(bucket, fullPath);
        } else {
          files.push({
            bucket,
            name: item.name,
            fullPath,
            size: Number(item.metadata?.size || 0),
          });
        }
      }

      if (data.length < PAGE_SIZE) return;
      offset += data.length;
    }

    throw new Error(`Storage listing for ${bucket} did not finish.`);
  }

  for (const bucket of BUCKETS) {
    await listFolder(bucket, "");
  }

  return files;
}

/**
 * Total stored bytes across Supabase image buckets.
 * Throws if usage cannot be measured, so a failed lookup cannot be treated as empty.
 */
export async function getSupabaseStorageUsageBytes() {
  const files = await listSupabaseStorageFiles();
  return files.reduce((sum, file) => sum + file.size, 0);
}

/**
 * Verifies whether adding incomingBytes will exceed the 900 MB safety limit.
 * Measurement failure is treated as not allowed.
 */
export async function verifySupabaseQuota(incomingBytes = 0) {
  let currentBytes = 0;
  let measureError = null;

  try {
    currentBytes = await getSupabaseStorageUsageBytes();
  } catch (err) {
    measureError = err.message;
  }

  const projectedBytes = currentBytes + Math.max(0, incomingBytes || 0);
  const allowed = !measureError && projectedBytes <= SUPABASE_SAFETY_LIMIT_BYTES;
  const currentMB = +(currentBytes / (1024 * 1024)).toFixed(2);
  const projectedMB = +(projectedBytes / (1024 * 1024)).toFixed(2);
  const remainingMB = +Math.max(0, SUPABASE_SAFETY_LIMIT_MB - currentMB).toFixed(2);

  return {
    allowed,
    measureError,
    currentBytes,
    currentMB,
    projectedMB,
    remainingMB,
    limitMB: SUPABASE_SAFETY_LIMIT_MB,
  };
}

/**
 * Refuses a Supabase Storage write. Image binaries belong on Cloudinary.
 * When the bucket is already at or above 900 MB, the error says so explicitly
 * so a failed Cloudinary upload cannot spill into the 1 GB free tier.
 */
export async function assertSupabaseUploadAllowed(incomingBytes = 0) {
  const quota = await verifySupabaseQuota(incomingBytes);

  if (quota.measureError || !quota.allowed) {
    const projectedNote =
      incomingBytes > 0 && quota.projectedMB != null
        ? ` Adding this file would reach ${quota.projectedMB} MB.`
        : "";
    const where = quota.measureError
      ? `Supabase storage usage could not be measured (${quota.measureError}).`
      : `Supabase storage is at ${quota.currentMB} MB of the 900 MB safety limit.${projectedNote}`;
    const error = new Error(
      `${where} This upload was rejected so the 1 GB free tier is not crossed. Image files must go to Cloudinary.`
    );
    error.status = 507;
    error.quota = quota;
    throw error;
  }

  const error = new Error(
    `Supabase storage uploads are disabled (${quota.currentMB} MB of 900 MB used). Image files must go to Cloudinary.`
  );
  error.status = 507;
  error.quota = quota;
  throw error;
}
