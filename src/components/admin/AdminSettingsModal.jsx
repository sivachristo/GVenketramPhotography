"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sliders, Eye, Image as ImageIcon, Ticket, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function AdminSettingsModal({ isOpen, onClose }) {
  const { isArtGalleryEnabled, isWorkshopEnabled, updateVisibility } = useSettings();

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
                  Site Settings
                </h2>
                <p className="text-[11px] text-neutral-500">
                  Manage module visibility and public feature access
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

            {/* Visibility Section */}
            <div className="space-y-4">
              <div className="border-b border-[#e6e2d8] pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1c1a17]">
                  <Eye size={16} className="text-[#A97C5B]" />
                  <h3>Visibility</h3>
                </div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Configure which modules appear on the website and main navigation header.
                </p>
              </div>

              {/* 1. Art Gallery Slide Check Option */}
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

                  {/* Slide Check Switch */}
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

              {/* 2. Workshop Slide Check Option */}
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

                  {/* Slide Check Switch */}
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
