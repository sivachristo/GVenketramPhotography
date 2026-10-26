"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Quote,
  Sparkles,
  User,
  Newspaper,
  Eye,
} from "lucide-react";

export default function AboutSectionManager() {
  const [formData, setFormData] = useState({
    subtitle: "",
    titlePrefix: "",
    titleHighlight: "",
    bioParagraph1: "",
    quote: "",
    bioParagraph2: "",
    publicationsTitle: "",
    publications: [],
    imageUrl: "",
    imageAlt: "",
  });

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [newTagInput, setNewTagInput] = useState("");
  const fileInputRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAboutData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/about");
      const data = await res.json();
      if (data.success && data.about) {
        setFormData(data.about);
        setInitialData(data.about);
      }
    } catch (err) {
      console.error("Failed to fetch about data:", err);
      showToast("Failed to load about section data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // Check if there are unsaved modifications
  const hasChanges =
    initialData && JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddPublicationTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    if (formData.publications?.includes(trimmed)) {
      showToast(`"${trimmed}" is already in the list`, "error");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      publications: [...(prev.publications || []), trimmed],
    }));
    setNewTagInput("");
  };

  const handleRemovePublicationTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      publications: (prev.publications || []).filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (JPEG, PNG, WEBP)", "error");
      return;
    }

    try {
      setIsUploading(true);
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();

      if (res.ok && data.success && data.url) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: data.url,
          imageAlt: prev.imageAlt || `${prev.titlePrefix} ${prev.titleHighlight} Portrait`,
        }));
        showToast("Portrait image uploaded and optimized successfully!");
      } else {
        throw new Error(data.error || "Image upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      showToast(err.message || "Failed to upload image", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setInitialData(data.about);
        setFormData(data.about);
        showToast("About section published successfully!");
      } else {
        throw new Error(data.error || "Failed to save about section");
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast(err.message || "Failed to save changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
      showToast("Reverted to last published state");
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4 text-neutral-500">
        <Loader2 className="animate-spin text-[#A97C5B]" size={36} />
        <p className="text-xs uppercase tracking-widest font-medium">Loading About Section...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 text-xs uppercase tracking-widest font-semibold border transition-all ${
            toast.type === "error"
              ? "bg-red-900 text-white border-red-700"
              : "bg-[#1c1a17] text-[#f5f2eb] border-[#A97C5B]"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={16} className="text-red-400" />
          ) : (
            <CheckCircle2 size={16} className="text-[#A97C5B]" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Banner Toolbar */}
      <div className="bg-[#faf8f5] p-6 rounded-xl border border-[#e6e2d8] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#A97C5B]/10 text-[#A97C5B]">
              <User size={18} />
            </span>
            <h2 className="text-base sm:text-lg font-serif uppercase tracking-widest text-[#1c1a17] font-semibold">
              About Page Manager
            </h2>
            {hasChanges && (
              <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                Unsaved Edits
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Edit the artist narrative, typography, quote block, publications, and portrait photograph.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Link
            href="/about"
            target="_blank"
            className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-700 border border-[#d8d3c5] text-xs uppercase tracking-widest rounded transition-all flex items-center gap-2 font-medium"
            title="View Live About Page"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Preview Live</span>
            <ExternalLink size={12} className="opacity-50" />
          </Link>

          {hasChanges && (
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="px-3.5 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs uppercase tracking-widest rounded transition-all flex items-center gap-1.5 font-medium cursor-pointer"
              title="Discard changes"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`px-5 py-2 text-xs uppercase tracking-widest rounded transition-all flex items-center gap-2 font-medium cursor-pointer shadow-sm ${
              hasChanges
                ? "bg-[#A97C5B] text-white hover:bg-[#8e6547] animate-pulse"
                : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
            }`}
          >
            {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isSaving ? "Publishing..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Main Grid: Form on Left (7 cols), Portrait Image & Live Preview on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Content Forms (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. Artist Header & Titles */}
          <div className="bg-white p-6 rounded-xl border border-[#e6e2d8] shadow-xs space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A97C5B] font-semibold flex items-center gap-2 border-b border-neutral-100 pb-2">
              <Sparkles size={14} /> Artist Identity & Headings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">
                  Eyebrow / Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle || ""}
                  onChange={(e) => handleInputChange("subtitle", e.target.value)}
                  placeholder="e.g. The Artist Behind the Lens"
                  className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">
                  Highlighted Name (Italic Gold — e.g. G Venket Ram)
                </label>
                <input
                  type="text"
                  value={formData.titleHighlight || ""}
                  onChange={(e) => handleInputChange("titleHighlight", e.target.value)}
                  placeholder="e.g. G Venket Ram"
                  className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors font-serif italic text-[#A97C5B] font-semibold"
                />
              </div>
            </div>
          </div>

          {/* 2. Narrative Bio & Editorial Quote */}
          <div className="bg-white p-6 rounded-xl border border-[#e6e2d8] shadow-xs space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A97C5B] font-semibold flex items-center gap-2 border-b border-neutral-100 pb-2">
              <Quote size={14} /> Narrative Biography & Editorial Quote
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">
                  Primary Biography (Opening Paragraph)
                </label>
                <textarea
                  rows={4}
                  value={formData.bioParagraph1 || ""}
                  onChange={(e) => handleInputChange("bioParagraph1", e.target.value)}
                  placeholder="Introduce the artist, philosophy, location, and visual direction..."
                  className="w-full px-3.5 py-2.5 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A97C5B] font-semibold mb-1 flex items-center gap-1.5">
                  <Quote size={12} /> Featured Quote Statement
                </label>
                <textarea
                  rows={3}
                  value={formData.quote || ""}
                  onChange={(e) => handleInputChange("quote", e.target.value)}
                  placeholder="An editorial quote capturing the artist's creative philosophy..."
                  className="w-full px-3.5 py-2.5 text-xs bg-[#faf8f5] border-l-2 border-l-[#A97C5B] border-y border-r border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors font-serif italic text-neutral-800"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">
                  Secondary Biography (Background & Vision)
                </label>
                <textarea
                  rows={4}
                  value={formData.bioParagraph2 || ""}
                  onChange={(e) => handleInputChange("bioParagraph2", e.target.value)}
                  placeholder="Detail background, education, studio milestones, commercial and fine-art work..."
                  className="w-full px-3.5 py-2.5 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* 3. Clients & Publications */}
          <div className="bg-white p-6 rounded-xl border border-[#e6e2d8] shadow-xs space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A97C5B] font-semibold flex items-center gap-2 border-b border-neutral-100 pb-2">
              <Newspaper size={14} /> Select Clients & Publications
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">
                  Section Header
                </label>
                <input
                  type="text"
                  value={formData.publicationsTitle || ""}
                  onChange={(e) => handleInputChange("publicationsTitle", e.target.value)}
                  placeholder="e.g. Select Clients & Publications"
                  className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-2">
                  Active Publications List ({formData.publications?.length || 0})
                </label>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-2 mb-3 min-h-[38px] p-2 bg-[#faf8f5] border border-[#e6e2d8] rounded-md">
                  {formData.publications?.length === 0 && (
                    <span className="text-[11px] text-neutral-400 italic">
                      No publications added yet. Type below to add one.
                    </span>
                  )}
                  {formData.publications?.map((pub) => (
                    <span
                      key={pub}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#d8d3c5] text-[#1c1a17] rounded-full text-xs uppercase tracking-wider font-medium shadow-xs group"
                    >
                      <span>{pub}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePublicationTag(pub)}
                        className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        title={`Remove ${pub}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Tag Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddPublicationTag();
                      }
                    }}
                    placeholder="Type publication name (e.g. Vanity Fair, Vogue)..."
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddPublicationTag}
                    disabled={!newTagInput.trim()}
                    className="px-4 py-2 bg-[#1c1a17] text-white hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs uppercase tracking-wider rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Portrait Photo & Live Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Portrait Photo Upload & Details */}
          <div className="bg-white p-6 rounded-xl border border-[#e6e2d8] shadow-xs space-y-5">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A97C5B] font-semibold flex items-center gap-2 border-b border-neutral-100 pb-2">
              <ImageIcon size={14} /> Artist Portrait Photograph
            </h3>

            {/* Portrait Preview Container (Matches /about Aspect Ratio & Styling) */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#e6e2d8] bg-[#faf8f5] shadow-md group">
              {formData.imageUrl ? (
                <>
                  <Image
                    src={formData.imageUrl}
                    alt={formData.imageAlt || "Portrait"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover object-center transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-[#A97C5B]/5 pointer-events-none" />
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-2 p-6 text-center">
                  <ImageIcon size={40} className="stroke-[1.5]" />
                  <p className="text-xs uppercase tracking-wider">No portrait photograph selected</p>
                </div>
              )}

              {/* Uploading Overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2 z-20">
                  <Loader2 className="animate-spin text-[#A97C5B]" size={32} />
                  <p className="text-xs uppercase tracking-widest font-medium">Compressing & Uploading...</p>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileUpload}
            />

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full py-2.5 px-4 bg-[#1c1a17] hover:bg-neutral-800 text-[#f5f2eb] text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Upload size={14} />
                {isUploading ? "Uploading..." : "Upload New Portrait Photo"}
              </button>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">
                  Image URL (or paste external URL)
                </label>
                <input
                  type="text"
                  value={formData.imageUrl || ""}
                  onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">
                  Image Alt Description
                </label>
                <input
                  type="text"
                  value={formData.imageAlt || ""}
                  onChange={(e) => handleInputChange("imageAlt", e.target.value)}
                  placeholder="e.g. G. Venketram Studio Portrait"
                  className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Quick Live Preview Snippet */}
          <div className="bg-[#f5f2eb] p-6 rounded-xl border border-[#d8d3c5] space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A97C5B] font-semibold block">
              Real-time Preview Snippet
            </span>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#A97C5B] font-semibold block">
                {formData.subtitle || "The Artist Behind the Lens"}
              </span>
              <h4 className="text-2xl font-brand font-normal uppercase tracking-widest leading-tight" style={{ color: "#A97C5B" }}>
                {formData.titleHighlight || "G Venket Ram"}
              </h4>
            </div>

            {formData.quote && (
              <div className="py-3 px-4 border-l-2 border-[#A97C5B] bg-white/70 rounded-r text-xs font-serif italic text-neutral-700 leading-relaxed">
                &ldquo;{formData.quote}&rdquo;
              </div>
            )}

            <div className="pt-2 text-[11px] text-neutral-500">
              <span className="font-semibold text-neutral-700">{formData.publications?.length || 0}</span> publications currently listed.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
