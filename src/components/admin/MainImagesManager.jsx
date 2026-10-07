"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Loader2,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

export default function MainImagesManager() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [deletingImage, setDeletingImage] = useState(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    title: "",
    alt: "",
    src: "",
    display_order: 1,
    is_active: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMainImages = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/main-images");
      const data = await res.json();
      if (data.success && data.mainImages) {
        setImages(data.mainImages);
      }
    } catch (err) {
      console.error("Failed to load main images:", err);
      showToast("Failed to load main images", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMainImages();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (!formData.title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setFormData((prev) => ({
          ...prev,
          title: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
          alt: cleanName,
        }));
      }
    }
  };

  const openAddModal = () => {
    setFormData({
      title: "",
      alt: "",
      src: "",
      display_order: images.length + 1,
      is_active: true,
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (img) => {
    setEditingImage(img);
    setFormData({
      title: img.title || "",
      alt: img.alt || img.title || "",
      src: img.src || "",
      display_order: img.display_order || 1,
      is_active: img.is_active !== false,
    });
    setSelectedFile(null);
    setPreviewUrl(img.src || "");
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let finalSrc = formData.src;

      if (selectedFile) {
        const uploadBody = new FormData();
        uploadBody.append("file", selectedFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadBody,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.src) {
          throw new Error(uploadData.error || "File upload failed");
        }
        finalSrc = uploadData.src;
      }

      if (!finalSrc) {
        showToast("Please select an image file or provide an image URL", "error");
        setIsUploading(false);
        return;
      }

      const res = await fetch("/api/main-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          src: finalSrc,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save main image");
      }

      showToast("Main image added successfully");
      setIsAddModalOpen(false);
      fetchMainImages();
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingImage) return;

    try {
      setIsUploading(true);
      let finalSrc = formData.src;

      if (selectedFile) {
        const uploadBody = new FormData();
        uploadBody.append("file", selectedFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadBody,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.src) {
          throw new Error(uploadData.error || "File upload failed");
        }
        finalSrc = uploadData.src;
      }

      const res = await fetch("/api/main-images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingImage.id,
          updates: {
            title: formData.title,
            alt: formData.alt,
            src: finalSrc,
            display_order: Number(formData.display_order),
            is_active: formData.is_active,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update image");
      }

      showToast("Main image updated successfully");
      setEditingImage(null);
      fetchMainImages();
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleActive = async (img) => {
    try {
      const newStatus = !img.is_active;
      // Optimistic update
      setImages((prev) =>
        prev.map((item) =>
          item.id === img.id ? { ...item, is_active: newStatus } : item
        )
      );

      const res = await fetch("/api/main-images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: img.id,
          updates: { is_active: newStatus },
        }),
      });

      if (!res.ok) {
        fetchMainImages(); // rollback
        showToast("Failed to update status", "error");
      } else {
        showToast(newStatus ? "Image set to Active" : "Image Hidden from Hero");
      }
    } catch (err) {
      fetchMainImages();
      showToast("Error updating image", "error");
    }
  };

  const handleReorder = async (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.splice(targetIndex, 0, moved);

    // Update display_order locally
    const reordered = newImages.map((item, idx) => ({
      ...item,
      display_order: idx + 1,
    }));
    setImages(reordered);

    try {
      await fetch("/api/main-images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder",
          items: reordered,
        }),
      });
      showToast("Display order updated");
    } catch (err) {
      console.error("Reorder failed:", err);
      fetchMainImages();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingImage) return;
    try {
      setIsUploading(true);
      const res = await fetch(`/api/main-images?id=${deletingImage.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete image");
      }

      showToast("Main image deleted successfully");
      setDeletingImage(null);
      fetchMainImages();
    } catch (err) {
      console.error(err);
      showToast(err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-xl text-xs uppercase tracking-wider font-medium flex items-center gap-2.5 transition-all ${
            toast.type === "error"
              ? "bg-red-900/90 text-red-100 border border-red-700"
              : "bg-[#1c1a17] text-[#f5f2eb] border border-[#333]"
          }`}
        >
          {toast.type === "error" ? <X size={15} /> : <Check size={15} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] border border-[#262626] rounded-xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#888] font-mono mb-1">
            <Sparkles size={14} className="text-[#a39882]" />
            Homepage Slideshow
          </div>
          <h2 className="text-xl font-light tracking-wide text-neutral-100">
            Main Images
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Upload, edit, reorder, or delete the full-screen rotating background
            images shown on the homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#f5f2eb] hover:bg-white text-neutral-900 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Upload Main Image</span>
        </button>
      </div>

      {/* Main Images Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#141414] border border-[#262626] rounded-xl">
          <Loader2 size={32} className="animate-spin text-[#888] mb-3" />
          <p className="text-xs tracking-widest uppercase text-neutral-400">
            Loading Main Images...
          </p>
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#141414] border border-[#262626] rounded-xl text-center px-4">
          <ImageIcon size={42} className="text-neutral-600 mb-3" />
          <h3 className="text-sm uppercase tracking-wider text-neutral-300 font-medium">
            No Main Images Found
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mt-1 mb-5">
            Get started by uploading or adding high-resolution photography for
            the homepage.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 bg-[#f5f2eb] text-neutral-900 rounded text-xs uppercase tracking-wider font-semibold hover:bg-white transition"
          >
            Add First Main Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {images.map((img, index) => (
            <div
              key={img.id || index}
              className={`group relative bg-[#171717] border rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                img.is_active === false
                  ? "border-red-900/40 opacity-70"
                  : "border-[#2a2a2a] hover:border-[#444]"
              }`}
            >
              {/* Image Preview Container */}
              <div className="relative aspect-4/3 w-full bg-[#0d0d0d] overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt || img.title || "Main Image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Order & Status Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-md text-[10px] font-mono tracking-wider uppercase text-neutral-200 border border-white/10">
                    #{index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(img)}
                    title={
                      img.is_active === false
                        ? "Currently hidden from homepage hero. Click to activate."
                        : "Active on homepage hero. Click to hide."
                    }
                    className={`px-2.5 py-1 rounded-md text-[10px] font-medium tracking-wider uppercase flex items-center gap-1.5 transition cursor-pointer backdrop-blur-md border ${
                      img.is_active === false
                        ? "bg-red-950/80 text-red-300 border-red-800/60"
                        : "bg-emerald-950/80 text-emerald-300 border-emerald-800/60"
                    }`}
                  >
                    {img.is_active === false ? (
                      <>
                        <EyeOff size={12} />
                        <span>Hidden</span>
                      </>
                    ) : (
                      <>
                        <Eye size={12} />
                        <span>Active</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Reorder Controls Overlay */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    type="button"
                    onClick={() => handleReorder(index, "up")}
                    disabled={index === 0}
                    title="Move earlier in rotation"
                    className="p-1.5 bg-black/80 hover:bg-neutral-800 text-neutral-200 disabled:opacity-30 disabled:pointer-events-none rounded border border-white/10 transition cursor-pointer"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(index, "down")}
                    disabled={index === images.length - 1}
                    title="Move later in rotation"
                    className="p-1.5 bg-black/80 hover:bg-neutral-800 text-neutral-200 disabled:opacity-30 disabled:pointer-events-none rounded border border-white/10 transition cursor-pointer"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>
              </div>

              {/* Card Meta & Action Buttons */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                <div>
                  <h4 className="text-sm font-medium text-neutral-100 truncate">
                    {img.title || "Untitled Main Image"}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5 font-mono">
                    {img.src}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#262626]">
                  <button
                    type="button"
                    onClick={() => openEditModal(img)}
                    className="flex-1 py-1.5 px-3 bg-[#242424] hover:bg-[#303030] text-neutral-200 rounded text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-1.5 transition cursor-pointer border border-[#333]"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingImage(img)}
                    title="Delete this main image"
                    className="py-1.5 px-3 bg-red-950/30 hover:bg-red-900/60 text-red-300 rounded text-xs font-medium tracking-wider uppercase flex items-center justify-center transition cursor-pointer border border-red-900/40"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Main Image Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#181818] border border-[#2e2e2e] rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
              <div>
                <h3 className="text-base font-medium text-neutral-100 uppercase tracking-wider">
                  Add Main Image
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Upload an image file or supply an image URL
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-md transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4">
              {/* File Upload / Dropzone */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                  Image Source
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#333] hover:border-[#666] bg-[#121212] rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {previewUrl ? (
                    <div className="relative w-full aspect-16/9 rounded-lg overflow-hidden bg-black/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <span className="text-xs uppercase tracking-wider text-white font-medium bg-black/60 px-3 py-1 rounded">
                          Change File
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-[#1f1f1f] rounded-full text-neutral-300 group-hover:text-white transition">
                        <Upload size={20} />
                      </div>
                      <p className="text-xs text-neutral-300 font-medium">
                        Click to upload an image from device
                      </p>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
                        Converts automatically to optimized WebP
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Or Direct Image URL */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                  Or Paste Direct Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.src}
                  onChange={(e) => {
                    setFormData({ ...formData, src: e.target.value });
                    if (!selectedFile) setPreviewUrl(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#2e2e2e] rounded-lg text-xs text-neutral-100 placeholder-neutral-600 focus:outline-hidden focus:border-neutral-400 transition"
                />
              </div>

              {/* Title & Alt Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Editorial Fashion Portrait"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#2e2e2e] rounded-lg text-xs text-neutral-100 focus:outline-hidden focus:border-neutral-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                    Alt Text (Accessibility)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Model in red studio lighting"
                    value={formData.alt}
                    onChange={(e) =>
                      setFormData({ ...formData, alt: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#2e2e2e] rounded-lg text-xs text-neutral-100 focus:outline-hidden focus:border-neutral-400 transition"
                  />
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-[#121212] border border-[#2a2a2a] rounded-lg">
                <div>
                  <span className="text-xs uppercase tracking-wider text-neutral-200 font-medium block">
                    Active in Slideshow
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Include this image in the rotating hero background
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 accent-white cursor-pointer"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isUploading}
                  className="px-4 py-2 bg-[#222] hover:bg-[#2c2c2c] text-neutral-300 rounded-lg text-xs uppercase tracking-wider font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || (!selectedFile && !formData.src)}
                  className="px-5 py-2 bg-[#f5f2eb] hover:bg-white text-neutral-900 disabled:opacity-40 disabled:pointer-events-none rounded-lg text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  {isUploading && <Loader2 size={14} className="animate-spin" />}
                  <span>{isUploading ? "Uploading..." : "Save Image"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Main Image Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#181818] border border-[#2e2e2e] rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
              <div>
                <h3 className="text-base font-medium text-neutral-100 uppercase tracking-wider">
                  Edit Main Image
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Update title, metadata, or replace the photo
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingImage(null)}
                className="p-1 text-neutral-400 hover:text-white rounded-md transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Image Preview & Replacement */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                  Current Image
                </label>
                <div className="relative w-full aspect-16/9 rounded-xl overflow-hidden bg-black/50 border border-[#2a2a2a] group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl || editingImage.src}
                    alt={formData.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <span className="text-xs uppercase tracking-wider text-white font-medium bg-neutral-900/80 px-3 py-1.5 rounded-md border border-white/20 flex items-center gap-1.5">
                      <Upload size={13} />
                      Replace Photo
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Direct Image URL */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.src}
                  onChange={(e) => {
                    setFormData({ ...formData, src: e.target.value });
                    if (!selectedFile) setPreviewUrl(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#2e2e2e] rounded-lg text-xs text-neutral-100 placeholder-neutral-600 focus:outline-hidden focus:border-neutral-400 transition"
                />
              </div>

              {/* Title & Alt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#2e2e2e] rounded-lg text-xs text-neutral-100 focus:outline-hidden focus:border-neutral-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.alt}
                    onChange={(e) =>
                      setFormData({ ...formData, alt: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#2e2e2e] rounded-lg text-xs text-neutral-100 focus:outline-hidden focus:border-neutral-400 transition"
                  />
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-[#121212] border border-[#2a2a2a] rounded-lg">
                <div>
                  <span className="text-xs uppercase tracking-wider text-neutral-200 font-medium block">
                    Active in Slideshow
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Include this image in the rotating hero background
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 accent-white cursor-pointer"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  disabled={isUploading}
                  className="px-4 py-2 bg-[#222] hover:bg-[#2c2c2c] text-neutral-300 rounded-lg text-xs uppercase tracking-wider font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-[#f5f2eb] hover:bg-white text-neutral-900 disabled:opacity-40 disabled:pointer-events-none rounded-lg text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  {isUploading && <Loader2 size={14} className="animate-spin" />}
                  <span>{isUploading ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#181818] border border-red-900/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-red-950/80 text-red-300 rounded-lg border border-red-900/50">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-100">
                  Delete Main Image?
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Are you sure you want to remove &quot;{deletingImage.title}&quot; from
                  the homepage rotation? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2a2a2a]">
              <button
                type="button"
                onClick={() => setDeletingImage(null)}
                disabled={isUploading}
                className="px-4 py-2 bg-[#222] hover:bg-[#2c2c2c] text-neutral-300 rounded-lg text-xs uppercase tracking-wider font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isUploading}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                {isUploading && <Loader2 size={14} className="animate-spin" />}
                <span>{isUploading ? "Deleting..." : "Confirm Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
