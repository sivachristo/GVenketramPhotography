"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { uploadHeroImage } from "@/lib/clientUpload";
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
  Monitor,
  Smartphone,
} from "lucide-react";

function getImageDevice(img) {
  if (!img) return "desktop";
  if (img.device === "mobile" || String(img.id || "").startsWith("main-mob-")) {
    return "mobile";
  }
  return "desktop";
}

export default function MainImagesManager() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeDeviceTab, setActiveDeviceTab] = useState("desktop"); // 'desktop' | 'mobile'

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
    device: "desktop",
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

  const desktopImages = images.filter((img) => getImageDevice(img) === "desktop");
  const mobileImages = images.filter((img) => getImageDevice(img) === "mobile");
  const currentDeviceImages =
    activeDeviceTab === "mobile" ? mobileImages : desktopImages;

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

  const openAddModal = (targetDevice = activeDeviceTab) => {
    const listForDevice =
      targetDevice === "mobile" ? mobileImages : desktopImages;
    setActiveDeviceTab(targetDevice);
    setFormData({
      title: "",
      alt: "",
      src: "",
      display_order: listForDevice.length + 1,
      is_active: true,
      device: targetDevice,
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
      device: getImageDevice(img),
    });
    setSelectedFile(null);
    setPreviewUrl(img.src || "");
  };

  const uploadSelectedFile = async (file) => uploadHeroImage(file);

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let finalSrc = formData.src;

      if (selectedFile) {
        finalSrc = await uploadSelectedFile(selectedFile);
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
          device: formData.device || activeDeviceTab,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save main image");
      }

      showToast(
        formData.device === "mobile"
          ? "Mobile hero image added successfully"
          : "Desktop & Tablet hero image added successfully"
      );
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
        finalSrc = await uploadSelectedFile(selectedFile);
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

      showToast("Hero image updated successfully");
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
        fetchMainImages();
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
    if (targetIndex < 0 || targetIndex >= currentDeviceImages.length) return;

    const newDeviceList = [...currentDeviceImages];
    const [moved] = newDeviceList.splice(index, 1);
    newDeviceList.splice(targetIndex, 0, moved);

    const reorderedDeviceList = newDeviceList.map((item, idx) => ({
      ...item,
      display_order: idx + 1,
    }));

    const otherDeviceList =
      activeDeviceTab === "mobile" ? desktopImages : mobileImages;

    const combined =
      activeDeviceTab === "mobile"
        ? [...otherDeviceList, ...reorderedDeviceList]
        : [...reorderedDeviceList, ...otherDeviceList];

    setImages(combined);

    try {
      await fetch("/api/main-images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder",
          items: combined,
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

      showToast("Hero image deleted successfully");
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

      {/* Header Bar with Separate Desktop/Tablet and Mobile Upload Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-[#141414] border border-[#262626] rounded-xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#888] font-mono mb-1">
            <Sparkles size={14} className="text-[#a39882]" />
            Homepage Hero Slideshow
          </div>
          <h2 className="text-xl font-light tracking-wide text-neutral-100">
            Desktop &amp; Mobile Hero Images
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Manage two dedicated sets of full-screen hero images — one for{" "}
            <span className="text-neutral-200 font-medium">Desktop &amp; Tablets</span>{" "}
            and a separate set specifically for{" "}
            <span className="text-neutral-200 font-medium">Mobile Portrait</span>{" "}
            so they never overlap.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => openAddModal("desktop")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f5f2eb] hover:bg-white text-neutral-900 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Monitor size={15} />
            <span>Upload Desktop / Tablet Hero</span>
          </button>

          <button
            type="button"
            onClick={() => openAddModal("mobile")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#A97C5B] hover:bg-[#b88967] text-white rounded-lg text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Smartphone size={15} />
            <span>Upload Mobile Hero</span>
          </button>
        </div>
      </div>

      {/* Viewport Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#141414] border border-[#262626] rounded-xl p-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveDeviceTab("desktop")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              activeDeviceTab === "desktop"
                ? "bg-[#f5f2eb] text-neutral-900 shadow-sm"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#1e1e1e]"
            }`}
          >
            <Monitor size={15} />
            <span>Desktop &amp; Tablet Set</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeDeviceTab === "desktop"
                  ? "bg-neutral-900 text-[#f5f2eb]"
                  : "bg-[#262626] text-neutral-300"
              }`}
            >
              {desktopImages.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDeviceTab("mobile")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              activeDeviceTab === "mobile"
                ? "bg-[#A97C5B] text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#1e1e1e]"
            }`}
          >
            <Smartphone size={15} />
            <span>Mobile Set</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeDeviceTab === "mobile"
                  ? "bg-black/30 text-white"
                  : "bg-[#262626] text-neutral-300"
              }`}
            >
              {mobileImages.length}
            </span>
          </button>
        </div>

        <div className="text-[11px] text-neutral-400 px-2">
          {activeDeviceTab === "desktop"
            ? "Shown exclusively on Desktop & Tablet viewports (≥ 768px)"
            : "Shown exclusively on Mobile viewports (< 768px)"}
        </div>
      </div>

      {/* Main Images Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#141414] border border-[#262626] rounded-xl">
          <Loader2 size={32} className="animate-spin text-[#888] mb-3" />
          <p className="text-xs tracking-widest uppercase text-neutral-400">
            Loading Hero Images...
          </p>
        </div>
      ) : currentDeviceImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#141414] border border-[#262626] rounded-xl text-center px-4">
          {activeDeviceTab === "mobile" ? (
            <Smartphone size={42} className="text-neutral-600 mb-3" />
          ) : (
            <Monitor size={42} className="text-neutral-600 mb-3" />
          )}
          <h3 className="text-sm uppercase tracking-wider text-neutral-300 font-medium">
            {activeDeviceTab === "mobile"
              ? "No Mobile Hero Images Found"
              : "No Desktop / Tablet Hero Images Found"}
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mt-1 mb-5">
            {activeDeviceTab === "mobile"
              ? "Upload vertical / portrait photography tailored specifically for mobile screens."
              : "Upload landscape photography tailored for desktop and tablet screens."}
          </p>
          <button
            type="button"
            onClick={() => openAddModal(activeDeviceTab)}
            className="px-4 py-2 bg-[#f5f2eb] text-neutral-900 rounded text-xs uppercase tracking-wider font-semibold hover:bg-white transition cursor-pointer"
          >
            {activeDeviceTab === "mobile"
              ? "Add First Mobile Hero Image"
              : "Add First Desktop Hero Image"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {currentDeviceImages.map((img, index) => (
            <div
              key={img.id || index}
              className={`group relative bg-[#171717] border rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                img.is_active === false
                  ? "border-red-900/40 opacity-70"
                  : "border-[#2a2a2a] hover:border-[#444]"
              }`}
            >
              {/* Image Preview Container */}
              <div
                className={`relative w-full bg-[#0d0d0d] overflow-hidden ${
                  activeDeviceTab === "mobile" ? "aspect-3/4" : "aspect-4/3"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt || img.title || "Main Image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Vignette Overlay (Admin Card UI Only) */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Order, Device & Status Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-md text-[10px] font-mono tracking-wider uppercase text-neutral-200 border border-white/10">
                      #{index + 1}
                    </span>
                    <span className="px-2 py-1 bg-black/70 backdrop-blur-md rounded-md text-[10px] tracking-wider uppercase text-neutral-300 border border-white/10 flex items-center gap-1">
                      {activeDeviceTab === "mobile" ? (
                        <>
                          <Smartphone size={11} />
                          <span>Mobile</span>
                        </>
                      ) : (
                        <>
                          <Monitor size={11} />
                          <span>Desktop</span>
                        </>
                      )}
                    </span>
                  </div>

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
                    disabled={index === currentDeviceImages.length - 1}
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
                <h3 className="text-base font-medium text-neutral-100 uppercase tracking-wider flex items-center gap-2">
                  {formData.device === "mobile" ? (
                    <>
                      <Smartphone size={17} className="text-[#A97C5B]" />
                      <span>Upload Mobile Hero Image</span>
                    </>
                  ) : (
                    <>
                      <Monitor size={17} className="text-[#a39882]" />
                      <span>Upload Desktop / Tablet Hero Image</span>
                    </>
                  )}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {formData.device === "mobile"
                    ? "Displayed exclusively on mobile phones (< 768px)"
                    : "Displayed exclusively on desktops & tablets (≥ 768px)"}
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
              {/* Target Viewport Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                  Target Viewport Set
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        device: "desktop",
                        display_order: desktopImages.length + 1,
                      }))
                    }
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs uppercase tracking-wider font-semibold border transition cursor-pointer ${
                      formData.device === "desktop"
                        ? "bg-[#f5f2eb] text-neutral-900 border-[#f5f2eb]"
                        : "bg-[#121212] text-neutral-400 border-[#2e2e2e] hover:text-neutral-200"
                    }`}
                  >
                    <Monitor size={14} />
                    <span>Desktop &amp; Tablet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        device: "mobile",
                        display_order: mobileImages.length + 1,
                      }))
                    }
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs uppercase tracking-wider font-semibold border transition cursor-pointer ${
                      formData.device === "mobile"
                        ? "bg-[#A97C5B] text-white border-[#A97C5B]"
                        : "bg-[#121212] text-neutral-400 border-[#2e2e2e] hover:text-neutral-200"
                    }`}
                  >
                    <Smartphone size={14} />
                    <span>Mobile Only</span>
                  </button>
                </div>
              </div>

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
                    accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {previewUrl ? (
                    <div
                      className={`relative w-full rounded-lg overflow-hidden bg-black/40 ${
                        formData.device === "mobile"
                          ? "max-w-[220px] aspect-9/16 mx-auto"
                          : "aspect-16/9"
                      }`}
                    >
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
                        Click to upload{" "}
                        {formData.device === "mobile"
                          ? "a mobile portrait image"
                          : "a desktop / tablet landscape image"}
                      </p>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
                        Saved at 9 MB.
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
                  placeholder="https://res.cloudinary.com/..."
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
                    Include this image in the rotating{" "}
                    {formData.device === "mobile" ? "mobile" : "desktop & tablet"} hero
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
                  Edit {formData.device === "mobile" ? "Mobile" : "Desktop / Tablet"} Hero Image
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
                <div
                  className={`relative w-full rounded-xl overflow-hidden bg-black/50 border border-[#2a2a2a] group ${
                    formData.device === "mobile"
                      ? "max-w-[220px] aspect-9/16 mx-auto"
                      : "aspect-16/9"
                  }`}
                >
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
                    accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
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
                  Delete Hero Image?
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
