"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sliders, Eye, Image as ImageIcon, Ticket, CheckCircle2, HardDrive, Cloud, Database, RefreshCw, Server, ShieldCheck } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function AdminSettingsModal({ isOpen, onClose }) {
  const { isArtGalleryEnabled, isWorkshopEnabled, updateVisibility } = useSettings();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

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
                          <span>Free Credit Usage</span>
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
                          Database & Storage (1 GB)
                        </div>
                      </div>
                    </div>
                  </div>

                  {stats?.supabase?.configured ? (
                    <div className="space-y-2.5 pt-1">
                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-neutral-600">
                          <span>Bucket Usage</span>
                          <span className="font-bold text-[#1c1a17]">
                            {stats.supabase.storageMB} MB / 1,000 MB ({((stats.supabase.storageMB / 1000) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2 mt-1 overflow-hidden">
                          <div
                            className="bg-emerald-700 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, ((stats.supabase.storageMB / 1000) * 100)).toFixed(1)}%` }}
                          />
                        </div>
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
                          className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                            isArtGalleryEnabled
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
                    className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isArtGalleryEnabled ? "bg-[#1c1a17]" : "bg-neutral-300"
                    }`}
                    title="Toggle Art Gallery Visibility"
                  >
                    <span className="sr-only">Toggle Art Gallery</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isArtGalleryEnabled ? "translate-x-6" : "translate-x-0"
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
                          className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                            isWorkshopEnabled
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
                    className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isWorkshopEnabled ? "bg-[#1c1a17]" : "bg-neutral-300"
                    }`}
                    title="Toggle Workshop Visibility"
                  >
                    <span className="sr-only">Toggle Workshop</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isWorkshopEnabled ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
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
