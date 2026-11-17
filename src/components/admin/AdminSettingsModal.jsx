"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sliders, Eye, Image as ImageIcon, Ticket, CheckCircle2, HardDrive, Cloud, Database, RefreshCw, Construction, AlertTriangle, Download, ShieldCheck } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { getBackupTrackerState, markBackupCompleted } from "@/utils/backupTracker";

export default function AdminSettingsModal({ isOpen, onClose }) {
  const { isArtGalleryEnabled, isWorkshopEnabled, updateVisibility, isUnderConstruction, updateUnderConstruction } = useSettings();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [migrating, setMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [moveAlert, setMoveAlert] = useState(null);
  const [backupState, setBackupState] = useState({
    uploadsSinceBackup: 0,
    lastBackupAt: null,
    needsBackup: false,
  });
  const [downloadingBackup, setDownloadingBackup] = useState(false);
  const [backupToast, setBackupToast] = useState(null);
  const forcedMoveStarted = useRef(false);

  const handleDownloadBackup = async () => {
    try {
      setDownloadingBackup(true);
      setBackupToast(null);
      const res = await fetch("/api/admin/backup-db?download=true");
      if (!res.ok) {
        throw new Error("Could not generate database backup.");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `gvenketram_db_backup_${dateStamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      markBackupCompleted();
      setBackupState(getBackupTrackerState());
      setBackupToast("Database backup downloaded! Upload counter has been reset.");
    } catch (err) {
      setBackupToast(err.message || "Failed to download backup.");
    } finally {
      setDownloadingBackup(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/storage-stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setError("Failed to load storage statistics.");
      }
    } catch (err) {
      setError("Network error fetching storage stats.");
    } finally {
      setLoading(false);
    }
  };

  const runCloudinaryMove = async ({ forced = false } = {}) => {
    if (!forced && !window.confirm("Move all remaining images from Supabase Storage to Cloudinary and update database links?")) {
      return;
    }
    setMigrating(true);
    setMigrationStatus(forced ? "Supabase limit reached. Moving images and addresses to Cloudinary..." : "Starting migration...");
    if (forced) {
      setMoveAlert("Supabase is at its hard limit. Images and their addresses are being moved to Cloudinary.");
    }
    try {
      let phase = "portfolio";
      let failedIds = [];
      let migrated = 0;
      let orphans = 0;
      let errors = 0;
      let rounds = 0;

      while (phase && rounds < 80) {
        rounds += 1;
        const res = await fetch("/api/admin/migrate-to-cloudinary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phase, failedIds }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to complete migration.");
        }
        migrated += (data.stats?.portfolioUploaded || 0) + (data.stats?.artUploaded || 0);
        orphans += data.stats?.orphansRemoved || 0;
        errors += data.stats?.errors || 0;
        failedIds = data.failedIds || failedIds;
        setMigrationStatus(`Moved ${migrated} image(s) to Cloudinary. Cleared ${orphans} Supabase file(s).`);
        if (data.done) break;
        phase = data.nextPhase;
      }

      const finished = `Finished. Moved ${migrated} image(s) to Cloudinary, cleared ${orphans} Supabase file(s)${errors ? `, ${errors} could not be moved` : ""}.`;
      setMigrationStatus(finished);
      if (forced) {
        setMoveAlert(
          errors
            ? `Supabase limit reached. ${migrated} image address(es) now point at Cloudinary. ${errors} could not be moved.`
            : "Supabase limit reached. Remaining images and their addresses now live on Cloudinary."
        );
      }
      fetchStats();
    } catch (err) {
      const message = "Error running migration: " + err.message;
      setMigrationStatus(message);
      if (forced) setMoveAlert(message);
    } finally {
      setMigrating(false);
    }
  };

  const handleMigrateToCloudinary = () => runCloudinaryMove({ forced: false });

  useEffect(() => {
    if (!isOpen) {
      forcedMoveStarted.current = false;
      setBackupToast(null);
      return;
    }
    setBackupState(getBackupTrackerState());
    fetchStats();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !stats?.supabase?.limitReached || !stats?.cloudinary?.configured) return;
    if ((stats.supabase.fileCount || 0) === 0) {
      setMoveAlert("Supabase is at its hard limit. No image files are left in the bucket. New photos go to Cloudinary.");
      return;
    }
    if (forcedMoveStarted.current || migrating) return;
    forcedMoveStarted.current = true;
    runCloudinaryMove({ forced: true });
  }, [isOpen, stats]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1c1a17]/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#faf8f5] rounded-2xl border border-[#d8d3c5] shadow-2xl overflow-hidden z-10 flex flex-col my-8"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-[#E2DDD3] border-b border-[#d8d3c5] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#1c1a17] text-[#f5f2eb] rounded-lg">
                <Sliders size={18} />
              </div>
              <div>
                <h2 className="text-base font-serif font-bold uppercase tracking-wider text-[#1c1a17]">
                  Site Settings & Infrastructure
                </h2>
                <p className="text-[11px] text-neutral-500">
                  Manage module visibility, storage quotas & database health
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-black transition-colors rounded-lg hover:bg-neutral-200/60 cursor-pointer"
              aria-label="Close settings"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

            {/* 0. Database Backup & Safety Snapshot Section */}
            <div
              className={`p-4 rounded-xl border transition-all space-y-3 ${
                backupState.needsBackup
                  ? "bg-amber-50 border-amber-300 shadow-xs"
                  : "bg-white border-[#e6e2d8] shadow-2xs"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-lg shrink-0 ${
                      backupState.needsBackup
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {backupState.needsBackup ? (
                      <AlertTriangle size={18} />
                    ) : (
                      <ShieldCheck size={18} />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#1c1a17] uppercase tracking-wider">
                        Database Backup Snapshot
                      </span>
                      {backupState.needsBackup ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider bg-amber-200 text-amber-900 border border-amber-400">
                          {backupState.uploadsSinceBackup} New Images Uploaded — Backup Recommended
                        </span>
                      ) : backupState.uploadsSinceBackup > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-semibold tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-300">
                          {backupState.uploadsSinceBackup} new image{backupState.uploadsSinceBackup > 1 ? "s" : ""} since last backup
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Up to Date
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                      {backupState.needsBackup
                        ? `You've uploaded ${backupState.uploadsSinceBackup} new images recently. Download a quick backup copy to keep your portfolio records safe.`
                        : "Download a complete snapshot of all portfolio categories, image links, hero slides, and artworks anytime."}
                    </p>
                    {backupState.lastBackupAt && (
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Last downloaded: {new Date(backupState.lastBackupAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  disabled={downloadingBackup}
                  className={`px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-xs ${
                    backupState.needsBackup
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-[#1c1a17] hover:bg-black text-[#f5f2eb]"
                  } disabled:opacity-60`}
                >
                  <Download size={14} className={downloadingBackup ? "animate-bounce" : ""} />
                  <span>{downloadingBackup ? "Preparing..." : "Download DB Backup"}</span>
                </button>
              </div>

              {backupToast && (
                <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                  <span>{backupToast}</span>
                </div>
              )}
            </div>

            {/* 1. Storage & Quota Health Section */}
            <div className="space-y-4">
              <div className="border-b border-[#e6e2d8] pb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1c1a17]">
                    <HardDrive size={16} className="text-[#A97C5B]" />
                    <h3>Storage & Free Quota Health</h3>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Live media storage, credit usage, and database capacity status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchStats}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#d8d3c5] hover:border-[#1c1a17]/40 text-[11px] font-semibold text-[#1c1a17] flex items-center gap-1.5 transition-all shadow-2xs hover:shadow cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={12} className={loading ? "animate-spin text-[#A97C5B]" : "text-neutral-500"} />
                  {loading ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Cloudinary Status Card */}
                <div className="p-4 rounded-xl bg-white border border-[#e6e2d8] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <Cloud size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1c1a17] uppercase tracking-wider">
                          Cloudinary
                        </div>
                        <div className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 inline-block">
                          Primary Upload Vault (25 GB)
                        </div>
                      </div>
                    </div>
                  </div>

                  {stats?.cloudinary?.configured ? (
                    <div className="space-y-2.5 pt-1">
                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-neutral-600">
                          <span>Bucket Usage</span>
                          <span className="font-bold text-[#1c1a17]">
                            {stats.cloudinary.creditsUsed} / {stats.cloudinary.creditsLimit} Credits ({stats.cloudinary.creditsPercent}%)
                          </span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2 mt-1 overflow-hidden">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(2, stats.cloudinary.creditsPercent)}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-neutral-100">
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase">Storage Used</span>
                          <span className="font-semibold text-neutral-800">{stats.cloudinary.storageMB} MB</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase">Transformations</span>
                          <span className="font-semibold text-neutral-800">{stats.cloudinary.transformations}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                      Cloudinary API credentials missing in .env.local
                    </div>
                  )}
                </div>

                {/* Supabase Status Card */}
                <div className="p-4 rounded-xl bg-white border border-[#e6e2d8] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                        <Database size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1c1a17] uppercase tracking-wider">
                          Supabase
                        </div>
                        <div className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 inline-block">
                          Database 400 MB · Bucket 900 MB
                        </div>
                      </div>
                    </div>
                  </div>

                  {stats?.supabase?.configured ? (
                    <div className="space-y-2.5 pt-1">
                      {(stats.supabase.limitReached || moveAlert) && (
                        <div className="flex items-start gap-2 text-[11px] text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                          <span>
                            {moveAlert || "Supabase is at its hard limit. New photos go to Cloudinary, and any files still in the bucket are moved there with their addresses."}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-neutral-600">
                          <span>Bucket Usage (900 MB Safety Limit)</span>
                          <span className={`font-bold ${stats.supabase.storageMB >= 900 ? "text-red-600" : stats.supabase.storageMB >= 750 ? "text-amber-600" : "text-[#1c1a17]"}`}>
                            {stats.supabase.storageMB} MB / 900 MB ({((stats.supabase.storageMB / 900) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2 mt-1 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${stats.supabase.storageMB >= 900
                              ? "bg-red-600"
                              : stats.supabase.storageMB >= 750
                                ? "bg-amber-500"
                                : "bg-emerald-700"
                              }`}
                            style={{ width: `${Math.min(100, Math.max(2, (stats.supabase.storageMB / 900) * 100)).toFixed(1)}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          Hard stop at 900 MB. There is no Supabase fallback. Photos go to Cloudinary at any original size.
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-neutral-600">
                          <span>Database (400 MB Hard Limit)</span>
                          <span className={`font-bold ${stats.supabase.databaseLimitReached ? "text-red-600" : (stats.supabase.databaseMB || 0) >= 320 ? "text-amber-600" : "text-[#1c1a17]"}`}>
                            {stats.supabase.databaseError
                              ? "Unmeasured"
                              : `${stats.supabase.databaseMB} MB / ${stats.supabase.databaseLimitMB || 400} MB (${(((stats.supabase.databaseMB || 0) / (stats.supabase.databaseLimitMB || 400)) * 100).toFixed(1)}%)`}
                          </span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2 mt-1 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${stats.supabase.databaseLimitReached
                              ? "bg-red-600"
                              : (stats.supabase.databaseMB || 0) >= 320
                                ? "bg-amber-500"
                                : "bg-emerald-700"
                              }`}
                            style={{ width: `${Math.min(100, Math.max(2, ((stats.supabase.databaseMB || 0) / (stats.supabase.databaseLimitMB || 400)) * 100)).toFixed(1)}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          Hard stop at 400 MB. Crossing either limit raises this alert and moves remaining bucket images and addresses to Cloudinary.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-neutral-100">
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase">Storage Binaries</span>
                          <span className="font-semibold text-neutral-800">{stats.supabase.fileCount} files</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase">Database Rows</span>
                          <span className="font-semibold text-neutral-800">{stats.supabase.portfolioRows + stats.supabase.galleryRows} rows</span>
                        </div>
                      </div>

                      {/* DB Backup Download Action */}
                      <div className="pt-2 border-t border-neutral-100">
                        <button
                          type="button"
                          onClick={handleDownloadBackup}
                          disabled={downloadingBackup}
                          className="w-full py-1.5 px-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#1c1a17] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-neutral-200 disabled:opacity-50"
                        >
                          <Download size={12} className="text-neutral-600" />
                          <span>{downloadingBackup ? "Downloading Backup..." : "Download DB Backup (JSON)"}</span>
                        </button>
                      </div>

                      {/* Migration to Cloudinary to reclaim Supabase Quota */}
                      {stats.supabase.fileCount > 0 && stats?.cloudinary?.configured && (
                        <div className="pt-2 border-t border-neutral-100 space-y-2">
                          <button
                            type="button"
                            onClick={handleMigrateToCloudinary}
                            disabled={migrating}
                            className="w-full py-2 px-3 rounded-lg bg-[#1c1a17] hover:bg-black text-[#f5f2eb] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60 shadow-xs"
                          >
                            {migrating ? (
                              <>
                                <RefreshCw size={12} className="animate-spin text-[#A97C5B]" />
                                <span>Migrating images to Cloudinary...</span>
                              </>
                            ) : (
                              <>
                                <Cloud size={13} className="text-[#A97C5B]" />
                                <span>Free Supabase Quota: Migrate to Cloudinary</span>
                              </>
                            )}
                          </button>
                          <p className="text-[10px] text-neutral-500 text-center">
                            Moves stored image files to Cloudinary (25 GB vault) and clears Supabase bucket.
                          </p>
                        </div>
                      )}

                      {migrationStatus && (
                        <div className="text-[11px] text-neutral-800 bg-[#f5f2eb] p-2.5 rounded-lg border border-[#e6e2d8]">
                          {migrationStatus}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                      Supabase environment variables missing in .env.local
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* 2. Visibility Section */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-[#e6e2d8] pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1c1a17]">
                  <Eye size={16} className="text-[#A97C5B]" />
                  <h3>Visibility & Header Modules</h3>
                </div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Configure which modules appear on the website and main navigation header.
                </p>
              </div>

              {/* 1. Art Gallery Option */}
              <div className="p-4 rounded-xl bg-white border border-[#e6e2d8] shadow-2xs hover:border-[#1c1a17]/30 transition-all space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#f5f2eb] text-[#A97C5B]">
                      <ImageIcon size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1c1a17] uppercase tracking-wider">
                          Art Gallery
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${isArtGalleryEnabled
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-neutral-200 text-neutral-600 border border-neutral-300"
                            }`}
                        >
                          {isArtGalleryEnabled ? "Visible" : "Disabled"}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Shows in header, enables fine-art prints catalog & shopping bag.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isArtGalleryEnabled}
                    onClick={() => updateVisibility("artGallery", !isArtGalleryEnabled)}
                    className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isArtGalleryEnabled ? "bg-[#1c1a17]" : "bg-neutral-300"
                      }`}
                    title="Toggle Art Gallery Visibility"
                  >
                    <span className="sr-only">Toggle Art Gallery</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isArtGalleryEnabled ? "translate-x-6" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>
              </div>

              {/* 2. Workshop Option */}
              <div className="p-4 rounded-xl bg-white border border-[#e6e2d8] shadow-2xs hover:border-[#1c1a17]/30 transition-all space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#f5f2eb] text-[#A97C5B]">
                      <Ticket size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1c1a17] uppercase tracking-wider">
                          Workshop
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${isWorkshopEnabled
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-neutral-200 text-neutral-600 border border-neutral-300"
                            }`}
                        >
                          {isWorkshopEnabled ? "Visible" : "Disabled"}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Shows in header, enables masterclass schedule & seat reservations.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isWorkshopEnabled}
                    onClick={() => updateVisibility("workshop", !isWorkshopEnabled)}
                    className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isWorkshopEnabled ? "bg-[#1c1a17]" : "bg-neutral-300"
                      }`}
                    title="Toggle Workshop Visibility"
                  >
                    <span className="sr-only">Toggle Workshop</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isWorkshopEnabled ? "translate-x-6" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>
              </div>

              {/* 3. Under Construction Mode */}
              <div
                className={`p-4 rounded-xl border shadow-2xs transition-all space-y-3 ${isUnderConstruction
                  ? "bg-amber-50 border-amber-300"
                  : "bg-white border-[#e6e2d8] hover:border-[#1c1a17]/30"
                  }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-lg ${isUnderConstruction
                        ? "bg-amber-100 text-amber-700"
                        : "bg-[#f5f2eb] text-[#A97C5B]"
                        }`}
                    >
                      <Construction size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1c1a17] uppercase tracking-wider">
                          Under Construction Mode
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${isUnderConstruction
                            ? "bg-amber-200 text-amber-900 border border-amber-400"
                            : "bg-neutral-200 text-neutral-600 border border-neutral-300"
                            }`}
                        >
                          {isUnderConstruction ? "🚧 Active" : "Off"}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Replaces all public pages with a coming-soon screen. Admin panel stays accessible.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isUnderConstruction}
                    onClick={() => updateUnderConstruction(!isUnderConstruction)}
                    className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isUnderConstruction ? "bg-amber-500" : "bg-neutral-300"
                      }`}
                    title="Toggle Under Construction Mode"
                  >
                    <span className="sr-only">Toggle Under Construction Mode</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isUnderConstruction ? "translate-x-6" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>

                {/* Live warning banner — only shown when active */}
                {isUnderConstruction && (
                  <div className="flex items-start gap-2 text-[11px] text-amber-900 bg-amber-100 border border-amber-300 rounded-lg px-3 py-2.5">
                    <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      <strong>Your site is hidden from visitors.</strong> Only{" "}
                      <code className="bg-amber-200 px-1 rounded text-[10px]">/admin</code> remains
                      accessible. Toggle off to restore the live site.
                    </span>
                  </div>
                )}
              </div>

            </div>

            {/* Sync & Backend Info */}
            <div className="p-4 rounded-xl bg-[#f5f2eb] border border-[#e6e2d8] flex items-center justify-between text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Changes save automatically and update navigation instantly.</span>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#E2DDD3] border-t border-[#d8d3c5] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                updateVisibility("artGallery", true);
                updateVisibility("workshop", true);
              }}
              className="text-xs uppercase tracking-wider text-neutral-600 hover:text-black font-semibold transition-colors cursor-pointer"
            >
              Enable All
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-[#1c1a17] text-[#f5f2eb] hover:bg-black text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
