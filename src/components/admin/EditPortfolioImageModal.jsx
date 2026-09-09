"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, Upload, Image as ImageIcon, RotateCcw, AlertCircle } from "lucide-react";

export default function EditPortfolioImageModal({
  isOpen,
  image,
  categories = [],
  onClose,
  onSuccess,
  showToast,
}) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState("");
  const abortControllerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sync state whenever image changes or modal opens
  useEffect(() => {
    if (image) {
      setFormData({
        title: image.title || "",
        category: image.category || categories[0] || "Advertising",
        description: image.description || "",
      });
      setSelectedFile(null);
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
        setFilePreviewUrl(null);
      }
      setStatusText("");
      setIsSaving(false);
    }
  }, [image, categories]);

  // Clean up object URLs on unmount or file change
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
      const newUrl = URL.createObjectURL(file);
      setFilePreviewUrl(newUrl);
    }
  };

  const handleRevertFile = () => {
    setSelectedFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (isSaving && abortControllerRef.current) {
      abortControllerRef.current.abort();
      if (showToast) showToast("Portfolio edit cancelled", "info");
    }
    handleRevertFile();
    setIsSaving(false);
    setStatusText("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setIsSaving(true);
    setStatusText("Saving Changes...");

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      let newSrc = image.src;
      let newWidth = image.width || 1600;
      let newHeight = image.height || 1200;

      // 1. If replacement file selected, upload image
      if (selectedFile) {
        setStatusText("Updating Image...");
        const fd = new FormData();
        fd.append("files", selectedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
          signal,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload replacement image");
        }

        const uploadData = await uploadRes.json();
        if (uploadData.files && uploadData.files.length > 0) {
          newSrc = uploadData.files[0].src;
          newWidth = uploadData.files[0].width || image.width || 1600;
          newHeight = uploadData.files[0].height || image.height || 1200;
        }
      }

      // 2. Save changes to database
      setStatusText("Saving Changes...");

      const oldCat = image.category;
      const targetCat = formData.category || oldCat;

      const patchBody = {
        action: "update",
        id: image.id,
        src: image.src,
        title: formData.title,
        description: formData.description,
        category: targetCat,
        new_src: newSrc,
        width: newWidth,
        height: newHeight,
      };

      const res = await fetch("/api/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchBody),
        signal,
      });

      if (!res.ok) {
        throw new Error("Failed to save image changes");
      }

      const updatedImage = {
        ...image,
        src: newSrc,
        title: formData.title,
        description: formData.description,
        category: targetCat,
        width: newWidth,
        height: newHeight,
      };

      if (onSuccess) {
        onSuccess(updatedImage, oldCat, targetCat);
      }

      if (showToast) {
        showToast(`Updated "${formData.title || image.title || "Portfolio Image"}" successfully!`);
      }

      handleClose();
    } catch (err) {
      if (err.name === "AbortError" || signal.aborted) return;
      console.error("Portfolio edit error:", err);
      if (showToast) {
        showToast(err.message || "Failed to save changes", "error");
      }
    } finally {
      setIsSaving(false);
      setStatusText("");
    }
  };

  if (!isOpen || !image) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-[#f5f2eb] border border-[#d8d3c5] rounded-xl shadow-2xl overflow-hidden my-8"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#E2DDD3] border-b border-[#d8d3c5]">
            <div className="flex items-center gap-2">
              <Pencil size={18} className="text-[#1c1a17]" />
              <h2 className="text-base font-serif uppercase tracking-widest font-semibold text-[#1c1a17]">
                Edit Portfolio Image
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-neutral-400 hover:text-black transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Title */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                Image Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Heritage Portrait"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                Portfolio Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Replace Image Section with Clean Preview */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                Portfolio Image (Select new file to replace)
              </label>

              {/* Preview Box */}
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#e6e2d8]">
                <div className="w-14 h-14 relative rounded-md overflow-hidden border border-[#d8d3c5] bg-neutral-100 flex-shrink-0 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={filePreviewUrl || image.src}
                    alt={formData.title || "Image preview"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  {selectedFile ? (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="inline-block px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[9px] font-bold uppercase tracking-wider">
                          New Image Selected
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          ({(selectedFile.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#1c1a17] truncate">
                        {selectedFile.name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-neutral-400 block mb-0.5">
                        Current Image
                      </span>
                      <p className="text-xs font-semibold text-[#1c1a17] truncate">
                        {image.title || "Untitled Image"}
                      </p>
                    </div>
                  )}
                </div>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleRevertFile}
                    className="px-2.5 py-1.5 text-[10px] uppercase tracking-wider rounded border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Revert to original image"
                  >
                    <RotateCcw size={12} />
                    <span>Revert</span>
                  </button>
                )}
              </div>

              {/* Single File Picker */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={false}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17] file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:uppercase file:font-semibold file:bg-[#1c1a17] file:text-white hover:file:bg-neutral-800 file:cursor-pointer"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                Image Description / Notes
              </label>
              <textarea
                rows={3}
                placeholder="Brief description or editorial notes..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e6e2d8]">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-black font-medium hover:bg-red-50 hover:text-red-700 rounded cursor-pointer transition-colors"
              >
                {isSaving ? "Cancel Upload" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-[#1c1a17] text-white hover:bg-neutral-800 text-xs uppercase tracking-widest rounded font-medium transition-colors cursor-pointer flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{statusText || "Saving..."}</span>
                  </>
                ) : (
                  <span>Save Image Changes</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
