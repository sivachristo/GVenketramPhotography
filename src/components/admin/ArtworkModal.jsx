"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw } from "lucide-react";

export default function ArtworkModal({
  isOpen,
  editingArtwork = null,
  onClose,
  onSuccess,
  showToast,
}) {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    price: 350,
    type: "Physical",
    category: "Physical Prints",
    availability: "In Stock",
    quantity: 25,
    dimensions: "24 x 36 inches",
    shortDescription: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState("");
  const abortControllerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingArtwork) {
      setFormData({
        title: editingArtwork.title || "",
        image: editingArtwork.image || "",
        price: editingArtwork.price || 350,
        type: editingArtwork.type || "Physical",
        category: editingArtwork.category || "Physical Prints",
        availability: editingArtwork.availability || "In Stock",
        quantity: editingArtwork.quantity || 25,
        dimensions: editingArtwork.dimensions || "24 x 36 inches",
        shortDescription: editingArtwork.shortDescription || "",
        description: editingArtwork.description || "",
      });
    } else {
      setFormData({
        title: "",
        image: "",
        price: 350,
        type: "Physical",
        category: "Physical Prints",
        availability: "In Stock",
        quantity: 25,
        dimensions: "24 x 36 inches",
        shortDescription: "",
        description: "",
      });
    }
    setSelectedFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    setIsSaving(false);
    setStatusText("");
  }, [editingArtwork, isOpen]);

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
      setFilePreviewUrl(URL.createObjectURL(file));
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
      if (showToast) showToast("Artwork upload cancelled", "info");
    }
    handleRevertFile();
    setIsSaving(false);
    setStatusText("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusText("Saving Changes...");

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      let imageUrl = formData.image;

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
          throw new Error("Failed to upload artwork image file");
        }

        const uploadData = await uploadRes.json();
        if (uploadData.files && uploadData.files.length > 0) {
          imageUrl = uploadData.files[0].src;
        }
      }

      if (!imageUrl && !formData.image) {
        if (showToast) showToast("Please select an image file to upload", "error");
        setIsSaving(false);
        setStatusText("");
        return;
      }

      setStatusText("Saving Changes...");

      const payload = {
        ...formData,
        image: imageUrl || formData.image,
        price: Number(formData.price) || 350,
      };

      if (editingArtwork) {
        const res = await fetch("/api/artworks", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingArtwork.id,
            ...payload,
          }),
          signal,
        });

        if (res.ok) {
          const data = await res.json();
          const updated = data.artwork || { ...editingArtwork, ...payload };
          if (onSuccess) onSuccess(updated, true);
          if (showToast) showToast(`Updated artwork "${formData.title}"!`);
          handleClose();
        } else {
          throw new Error("Failed to update artwork");
        }
      } else {
        const res = await fetch("/api/artworks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal,
        });

        if (res.ok) {
          const data = await res.json();
          if (onSuccess && data.artwork) onSuccess(data.artwork, false);
          if (showToast) showToast(`Created artwork "${formData.title}"!`);
          handleClose();
        } else {
          throw new Error("Failed to create artwork");
        }
      }
    } catch (err) {
      if (err.name === "AbortError" || signal.aborted) return;
      console.error("Artwork submit error:", err);
      if (showToast) showToast(err.message || "Failed to save artwork", "error");
    } finally {
      setIsSaving(false);
      setStatusText("");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-[#f5f2eb] border border-[#d8d3c5] rounded-xl shadow-2xl overflow-hidden my-8"
        >
          <div className="flex items-center justify-between px-6 py-4 bg-[#E2DDD3] border-b border-[#d8d3c5]">
            <h2 className="text-base font-serif uppercase tracking-widest font-semibold text-[#1c1a17]">
              {editingArtwork ? "Edit Artwork" : "Create New Art Gallery Artwork"}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 text-neutral-400 hover:text-black transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
            {/* Title */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                Artwork Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Serenade in Bronze & Shadow"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
              />
            </div>

            {/* Artwork Image File Input with Preview */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                {editingArtwork ? "Artwork Image (Select new file to replace)" : "Artwork Image File *"}
              </label>

              {(filePreviewUrl || formData.image) && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#e6e2d8]">
                  <div className="w-14 h-14 relative rounded-md overflow-hidden border border-[#d8d3c5] bg-neutral-100 flex-shrink-0 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={filePreviewUrl || formData.image}
                      alt={formData.title || "Artwork preview"}
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
                          {formData.title || "Artwork Image"}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedFile && editingArtwork && (
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
              )}

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={false}
                  accept="image/*"
                  required={!editingArtwork && !formData.image}
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17] file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:uppercase file:font-semibold file:bg-[#1c1a17] file:text-white hover:file:bg-neutral-800 file:cursor-pointer"
                />
              </div>
            </div>

            {/* Grid: Type & Category & Price & Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                  Format Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: e.target.value,
                      category: e.target.value === "Digital" ? "Digital Prints" : "Physical Prints",
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
                >
                  <option value="Physical">Physical Print</option>
                  <option value="Digital">Digital Master File</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                  Artwork Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
                >
                  <option value="Digital Prints">Digital Prints</option>
                  <option value="Physical Prints">Physical Prints</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                  Starting Price (₹ INR) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                  Availability Status *
                </label>
                <input
                  type="text"
                  placeholder="e.g. In Stock, Limited Edition (1/25)"
                  value={formData.availability}
                  onChange={(e) => setFormData((prev) => ({ ...prev, availability: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
                />
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                Dimensions / Print Format Specs
              </label>
              <input
                type="text"
                placeholder="e.g. 24 x 36 inches or 8K Ultra-HD Resolution"
                value={formData.dimensions}
                onChange={(e) => setFormData((prev) => ({ ...prev, dimensions: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                Short Description (Excerpt)
              </label>
              <input
                type="text"
                placeholder="Brief 1-2 sentence summary for gallery cards"
                value={formData.shortDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
              />
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                Full Description / Artist Statement
              </label>
              <textarea
                rows={3}
                placeholder="Detailed narrative, artistic vision, and story behind the artwork..."
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
                className="px-5 py-2 bg-[#A97C5B] text-white hover:bg-[#1c1a17] text-xs uppercase tracking-widest rounded font-medium transition-colors cursor-pointer flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{statusText || "Saving..."}</span>
                  </>
                ) : (
                  <span>{editingArtwork ? "Save Artwork Changes" : "Create Artwork"}</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
