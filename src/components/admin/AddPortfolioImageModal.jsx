"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Image as ImageIcon, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AddPortfolioImageModal({
  isOpen,
  onClose,
  categories = [],
  defaultCategory = "Advertising",
  onSuccess,
  showToast,
}) {
  const fileInputRef = useRef(null);

  const [uploadMode, setUploadMode] = useState("file"); // 'url' or 'file'
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatusText, setUploadStatusText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    src: "",
    category: defaultCategory,
    width: 1600,
    height: 1200,
    description: "",
  });

  // Keep default category in sync if passed
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        category: defaultCategory || categories[0] || "Advertising",
      }));
    }
  }, [isOpen, defaultCategory, categories]);

  // Reset form when modal closes
  const handleClose = () => {
    if (isUploading) return;
    setSelectedFiles([]);
    setUploadStatusText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  // Handle selecting files
  const handleFileChange = (e) => {
    const newSelected = Array.from(e.target.files || []);
    if (newSelected.length > 0) {
      // Append to existing files or replace
      setSelectedFiles((prev) => {
        const combined = [...prev, ...newSelected];
        // Deduplicate by name and size
        const unique = [];
        const seen = new Set();
        for (const file of combined) {
          const key = `${file.name}-${file.size}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(file);
          }
        }
        return unique;
      });
    }
    // Reset file input value so user can re-pick same file if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove a single file from the selected list
  const handleRemoveFile = (indexToRemove, e) => {
    if (e) e.stopPropagation();
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Clear all selected files
  const handleClearAllFiles = (e) => {
    if (e) e.stopPropagation();
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const targetCategory = formData.category || categories[0] || "Advertising";

    // 1. BULK FILE UPLOAD MODE
    if (uploadMode === "file" && selectedFiles.length > 0) {
      const uploadFormData = new FormData();
      selectedFiles.forEach((file) => {
        uploadFormData.append("files", file);
      });

      try {
        setUploadStatusText(`Uploading ${selectedFiles.length} image(s) to storage...`);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error || "File upload failed");
        }

        const uploadData = await uploadRes.json();
        const uploadedFiles = uploadData.files || [];

        if (uploadedFiles.length === 0) {
          throw new Error("No files were successfully uploaded");
        }

        setUploadStatusText(`Saving ${uploadedFiles.length} image(s) to database...`);

        const imagesToCreate = uploadedFiles.map((uf, idx) => ({
          src: uf.src,
          title:
            selectedFiles.length === 1 && formData.title
              ? formData.title
              : uf.title || `Artwork ${idx + 1}`,
          category: targetCategory,
          width: uf.width || 1600,
          height: uf.height || 1200,
          description:
            formData.description ||
            `Editorial photography for ${targetCategory} by G Venket Ram.`,
        }));

        const portfolioRes = await fetch("/api/portfolio", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "bulk_create",
            category: targetCategory,
            images: imagesToCreate,
          }),
        });

        if (!portfolioRes.ok) {
          const errData = await portfolioRes.json();
          throw new Error(errData.error || "Failed to save portfolio items");
        }

        const portfolioDataRes = await portfolioRes.json();
        const rawCreated = portfolioDataRes.data || [];
        const createdItems = rawCreated.map((item, idx) => ({
          id: item.id || `temp-${Date.now()}-${idx}`,
          src: item.src,
          width: item.width || 1600,
          height: item.height || 1200,
          title: item.title || "Untitled",
          description: item.description || "",
          category: item.category_name || item.category || targetCategory,
          display_order: item.display_order ?? idx + 1,
          position_num: item.display_order ?? idx + 1,
        }));

        setIsUploading(false);
        setUploadStatusText("");
        setSelectedFiles([]);
        setFormData({
          title: "",
          src: "",
          category: targetCategory,
          width: 1600,
          height: 1200,
          description: "",
        });

        if (onSuccess) {
          onSuccess(createdItems, targetCategory);
        }
        onClose();
        return;
      } catch (err) {
        console.error("Bulk upload error:", err);
        if (showToast) showToast(err.message || "Failed to process bulk upload", "error");
        setIsUploading(false);
        setUploadStatusText("");
        return;
      }
    }

    // 2. SINGLE URL UPLOAD MODE
    const finalSrc = formData.src;
    if (!finalSrc && uploadMode === "url") {
      if (showToast) showToast("Please provide an image URL", "error");
      setIsUploading(false);
      return;
    }

    const newImageObj = {
      src: finalSrc,
      width: parseInt(formData.width) || 1600,
      height: parseInt(formData.height) || 1200,
      title: formData.title || "Untitled Artwork",
      description:
        formData.description ||
        `Editorial photography for ${targetCategory} by G Venket Ram.`,
    };

    try {
      const patchRes = await fetch("/api/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          image: {
            ...newImageObj,
            category: targetCategory,
          },
        }),
      });

      if (!patchRes.ok) {
        const errData = await patchRes.json();
        throw new Error(errData.error || "Failed to save image");
      }

      const patchData = await patchRes.json();
      const rawSingle = patchData.data || {};
      const createdImageObj = {
        ...newImageObj,
        id: rawSingle.id || newImageObj.id || `temp-${Date.now()}`,
        category: rawSingle.category_name || rawSingle.category || targetCategory,
      };

      setIsUploading(false);
      setFormData({
        title: "",
        src: "",
        category: targetCategory,
        width: 1600,
        height: 1200,
        description: "",
      });
      setSelectedFiles([]);

      if (onSuccess) {
        onSuccess([createdImageObj], targetCategory);
      }
      onClose();
    } catch (err) {
      console.error("Add image PATCH error:", err);
      if (showToast) showToast(err.message || "Failed to save image", "error");
      setIsUploading(false);
    }
  };

  const totalSizeMB = (
    selectedFiles.reduce((acc, f) => acc + f.size, 0) /
    (1024 * 1024)
  ).toFixed(2);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-[#f5f2eb] border border-[#d8d3c5] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#E2DDD3] border-b border-[#d8d3c5] shrink-0">
              <h2 className="text-base font-serif uppercase tracking-widest font-semibold text-[#1c1a17]">
                Add New Portfolio Image
              </h2>
              <button
                type="button"
                onClick={handleClose}
                disabled={isUploading}
                className="p-1 text-neutral-500 hover:text-black transition-colors rounded hover:bg-black/5 disabled:opacity-50"
                title="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Upload Mode Switcher */}
              <div className="flex gap-2 p-1 bg-[#e6e2d8]/60 rounded-lg">
                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={`flex-1 py-1.5 text-xs uppercase tracking-widest rounded font-semibold transition-all ${uploadMode === "url"
                      ? "bg-[#1c1a17] text-[#f5f2eb]"
                      : "text-neutral-600 hover:text-black"
                    }`}
                >
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={`flex-1 py-1.5 text-xs uppercase tracking-widest rounded font-semibold transition-all ${uploadMode === "file"
                      ? "bg-[#1c1a17] text-[#f5f2eb]"
                      : "text-neutral-600 hover:text-black"
                    }`}
                >
                  Upload File
                </button>
              </div>

              {/* Image Source Input */}
              {uploadMode === "url" ? (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                    Image Source URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/photo.jpg or /portfolio/fashion/image.webp"
                    value={formData.src}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, src: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                      Choose Image File(s) (Select 1 or Multiple) *
                    </label>
                    {selectedFiles.length > 0 && (
                      <span className="text-[10px] text-neutral-500 font-medium">
                        {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
                      </span>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    required={selectedFiles.length === 0}
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17] file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:uppercase file:tracking-wider file:font-semibold file:bg-[#1c1a17] file:text-white hover:file:bg-neutral-800 file:cursor-pointer"
                  />

                  {/* Selected Files List with Delete Buttons */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-2.5 p-3 bg-[#e6e2d8]/50 border border-[#d8d3c5] rounded text-xs space-y-2 max-h-48 overflow-y-auto">
                      <div className="font-semibold text-[#1c1a17] text-[11px] uppercase tracking-wider flex justify-between items-center pb-1 border-b border-[#d8d3c5]">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-700" />
                          <span>{selectedFiles.length} file(s) selected:</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-neutral-600 font-mono text-[10px]">{totalSizeMB} MB</span>
                          <button
                            type="button"
                            onClick={handleClearAllFiles}
                            className="text-[10px] text-red-600 hover:text-red-800 hover:underline uppercase font-bold tracking-wider cursor-pointer"
                          >
                            Clear all
                          </button>
                        </div>
                      </div>

                      <ul className="space-y-1 text-neutral-700 font-mono text-[10px]">
                        {selectedFiles.map((file, i) => (
                          <li
                            key={`${file.name}-${file.size}-${i}`}
                            className="py-1 px-1.5 rounded hover:bg-white/60 flex items-center justify-between gap-2 group transition-colors"
                          >
                            <span className="truncate flex-1 font-sans text-[11px] text-neutral-800 font-medium" title={file.name}>
                              <span className="font-mono text-[10px] text-neutral-400 mr-1.5">#{i + 1}</span>
                              {file.name}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-neutral-500 font-mono text-[10px]">
                                {(file.size / 1024).toFixed(0)} KB
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleRemoveFile(i, e)}
                                title={`Remove ${file.name}`}
                                className="p-1 rounded-full text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Target Category Tag */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                  Assign Category Tab Tag *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17] font-semibold"
                >
                  {categories.map((cName) => (
                    <option key={cName} value={cName}>
                      {cName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className={uploadMode === "file" && selectedFiles.length > 1 ? "opacity-50 pointer-events-none select-none" : ""}>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                    Title {uploadMode === "file" && selectedFiles.length > 1 ? "(Auto from filename)" : "*"}
                  </label>
                  {uploadMode === "file" && selectedFiles.length > 1 && (
                    <span className="text-[10px] text-neutral-400 italic">
                      Not needed for bulk upload
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required={uploadMode === "url" || selectedFiles.length <= 1}
                  disabled={uploadMode === "file" && selectedFiles.length > 1}
                  placeholder={
                    uploadMode === "file" && selectedFiles.length > 1
                      ? "Title name will be taken as per the file name"
                      : "e.g. Royal Sari Collection"
                  }
                  value={uploadMode === "file" && selectedFiles.length > 1 ? "" : formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className={`w-full px-3 py-2 text-xs border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17] ${uploadMode === "file" && selectedFiles.length > 1 ? "bg-[#f0ede6] cursor-not-allowed" : "bg-white"}`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    uploadMode === "file" && selectedFiles.length > 1
                      ? "Give them a common discription and edit it manually for each image"
                      : "Short description of the photo..."
                  }
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
                />
              </div>

              {/* Dimensions */}
              <div className={`grid grid-cols-2 gap-4 ${uploadMode === "file" && selectedFiles.length > 1 ? "opacity-50 pointer-events-none select-none" : ""}`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                      Width (px)
                    </label>
                    {uploadMode === "file" && selectedFiles.length > 1 && (
                      <span className="text-[10px] text-neutral-400 italic">Auto-detected</span>
                    )}
                  </div>
                  <input
                    type="number"
                    disabled={uploadMode === "file" && selectedFiles.length > 1}
                    value={formData.width}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, width: e.target.value }))
                    }
                    className={`w-full px-3 py-2 text-xs border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17] ${uploadMode === "file" && selectedFiles.length > 1 ? "bg-[#f0ede6] cursor-not-allowed" : "bg-white"}`}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                      Height (px)
                    </label>
                    {uploadMode === "file" && selectedFiles.length > 1 && (
                      <span className="text-[10px] text-neutral-400 italic">Auto-detected</span>
                    )}
                  </div>
                  <input
                    type="number"
                    disabled={uploadMode === "file" && selectedFiles.length > 1}
                    value={formData.height}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, height: e.target.value }))
                    }
                    className={`w-full px-3 py-2 text-xs border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17] ${uploadMode === "file" && selectedFiles.length > 1 ? "bg-[#f0ede6] cursor-not-allowed" : "bg-white"}`}
                  />
                </div>
              </div>

              {/* Upload Status / Progress Message */}
              {uploadStatusText && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-300 rounded text-xs text-amber-900 flex items-center gap-2 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
                  <span className="font-medium">{uploadStatusText}</span>
                </div>
              )}

              {/* Form Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#e6e2d8]">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isUploading}
                  className="px-4 py-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-black font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-[#1c1a17] text-[#f5f2eb] hover:bg-neutral-800 text-xs uppercase tracking-widest rounded font-medium transition-colors cursor-pointer flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>
                      {uploadMode === "file" && selectedFiles.length > 1
                        ? `Add ${selectedFiles.length} Images`
                        : "Add to Portfolio"}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
