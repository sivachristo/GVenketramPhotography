"use client";

const COUNT_KEY = "gvr_uploads_since_backup";
const LAST_BACKUP_KEY = "gvr_last_backup_at";
export const BACKUP_WARNING_THRESHOLD = 15; // Warn once 15+ new images are uploaded

export function getBackupTrackerState() {
  if (typeof window === "undefined") {
    return { uploadsSinceBackup: 0, lastBackupAt: null, needsBackup: false };
  }
  const count = parseInt(localStorage.getItem(COUNT_KEY) || "0", 10) || 0;
  const lastBackupAt = localStorage.getItem(LAST_BACKUP_KEY) || null;
  return {
    uploadsSinceBackup: count,
    lastBackupAt,
    needsBackup: count >= BACKUP_WARNING_THRESHOLD,
  };
}

export function recordUploadedImages(addedCount = 1) {
  if (typeof window === "undefined") return;
  const current = parseInt(localStorage.getItem(COUNT_KEY) || "0", 10) || 0;
  const next = current + Math.max(1, Number(addedCount) || 1);
  localStorage.setItem(COUNT_KEY, String(next));
  window.dispatchEvent(new Event("gvr-backup-tracker-change"));
}

export function markBackupCompleted() {
  if (typeof window === "undefined") return;
  localStorage.setItem(COUNT_KEY, "0");
  localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());
  window.dispatchEvent(new Event("gvr-backup-tracker-change"));
}
