"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Search, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  X,
  Layers,
  Image as ImageIcon,
  Eye,
  ExternalLink,
  Pencil,
  Check
} from "lucide-react";

export default function AdminPage() {
  const [categories, setCategories] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Full View Image Preview Modal State
  const [previewImage, setPreviewImage] = useState(null);

  // Inline Image Editing State
  const [editingImageSrc, setEditingImageSrc] = useState(null);

  // Delete Confirmation Modal State
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);

  // Add Image Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState("url"); // 'url' or 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newImage, setNewImage] = useState({
    title: "",
    src: "",
    category: "Advertising",
    width: 1600,
    height: 1200,
    description: "",
  });

  const [modifiedFieldsMap, setModifiedFieldsMap] = useState({});

  // Load Initial Portfolio Data
  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
        setPortfolioData(data.portfolioData || []);
        setModifiedFieldsMap({});
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      console.error("Failed to load portfolio data:", err);
      showToast("Failed to load data from server", "error");
    }
  };

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Trigger PATCH /api/portfolio/[id] for each modified record only when Save Changes is clicked
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Collect all modified item payloads
      const entries = Object.entries(modifiedFieldsMap);

      if (entries.length === 0) {
        setHasUnsavedChanges(false);
        setIsSaving(false);
        showToast("No changes to save.");
        return;
      }

      // Trigger PATCH /api/portfolio/[id] with only record changes
      const patchResults = await Promise.all(
        entries.map(([id, changes]) =>
          fetch(`/api/portfolio/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changes),
          })
        )
      );

      const hasError = patchResults.some((res) => !res.ok);

      if (!hasError) {
        setModifiedFieldsMap({});
        setHasUnsavedChanges(false);
        showToast("Changes saved successfully!");
      } else {
        showToast("Failed to save some changes", "error");
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast("Error saving changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Update inline image title & description metadata (buffers change until Save Changes)
  const handleUpdateImageMetadata = (categoryName, imageSrc, field, value, imageId) => {
    const updatedData = portfolioData.map((cat) => {
      if (cat.category === categoryName) {
        const updatedImages = cat.images.map((img) => {
          if ((imageId && img.id === imageId) || img.src === imageSrc) {
            return {
              ...img,
              [field]: value,
            };
          }
          return img;
        });
        return { ...cat, images: updatedImages };
      }
      return cat;
    });

    setPortfolioData(updatedData);
    setHasUnsavedChanges(true);

    if (imageId) {
      setModifiedFieldsMap((prev) => ({
        ...prev,
        [imageId]: {
          ...(prev[imageId] || {}),
          [field]: value,
        },
      }));
    }
  };

  // Re-assign Image Tag / Category (buffers change until Save Changes)
  const handleTagChange = (targetCategoryName, imageSrc, currentCategoryName, imageId) => {
    if (targetCategoryName === currentCategoryName) return;

    let movedImage = null;

    // Remove image from old category
    const updatedData = portfolioData.map((cat) => {
      if (cat.category === currentCategoryName) {
        const filtered = cat.images.filter((img) => {
          if ((imageId && img.id === imageId) || img.src === imageSrc) {
            movedImage = { ...img, category: targetCategoryName };
            return false;
          }
          return true;
        });
        return { ...cat, images: filtered };
      }
      return cat;
    });

    if (!movedImage) return;

    // Add image to new target category
    const finalData = updatedData.map((cat) => {
      if (cat.category === targetCategoryName) {
        return {
          ...cat,
          images: [movedImage, ...cat.images],
        };
      }
      return cat;
    });

    setPortfolioData(finalData);
    setHasUnsavedChanges(true);

    if (imageId) {
      setModifiedFieldsMap((prev) => ({
        ...prev,
        [imageId]: {
          ...(prev[imageId] || {}),
          category: targetCategoryName,
        },
      }));
    }
  };

  // Reorder Image within Category or Global View
  const handleReorder = (categoryName, imageSrc, direction, displayedIdx = -1) => {
    if (activeCategory === "All" && displayedIdx >= 0) {
      const targetIdx = direction === "up" ? displayedIdx - 1 : displayedIdx + 1;
      if (targetIdx < 0 || targetIdx >= displayedImages.length) return;

      const targetImg = displayedImages[targetIdx];

      if (targetImg.category === categoryName) {
        const updatedData = portfolioData.map((cat) => {
          if (cat.category === categoryName) {
            const idx1 = cat.images.findIndex((i) => i.src === imageSrc);
            const idx2 = cat.images.findIndex((i) => i.src === targetImg.src);
            if (idx1 !== -1 && idx2 !== -1) {
              const newImages = [...cat.images];
              const temp = newImages[idx1];
              newImages[idx1] = newImages[idx2];
              newImages[idx2] = temp;
              return { ...cat, images: newImages };
            }
          }
          return cat;
        });
        setPortfolioData(updatedData);
        return;
      }

      let movedImg = null;
      let updatedData = portfolioData.map((cat) => {
        if (cat.category === categoryName) {
          return {
            ...cat,
            images: cat.images.filter((i) => {
              if (i.src === imageSrc) {
                movedImg = i;
                return false;
              }
              return true;
            }),
          };
        }
        return cat;
      });

      if (movedImg) {
        updatedData = updatedData.map((cat) => {
          if (cat.category === targetImg.category) {
            const targetInCatIdx = cat.images.findIndex((i) => i.src === targetImg.src);
            const newImages = [...cat.images];
            const insertIdx = direction === "up" ? targetInCatIdx + 1 : targetInCatIdx;
            newImages.splice(Math.max(0, insertIdx), 0, movedImg);
            return { ...cat, images: newImages };
          }
          return cat;
        });
        setPortfolioData(updatedData);
      }
      return;
    }

    // Single Category View
    const updatedData = portfolioData.map((cat) => {
      if (cat.category === categoryName) {
        const inCatIndex = cat.images.findIndex((i) => i.src === imageSrc);
        if (inCatIndex === -1) return cat;

        const targetIndex = direction === "up" ? inCatIndex - 1 : inCatIndex + 1;
        if (targetIndex < 0 || targetIndex >= cat.images.length) return cat;

        const newImages = [...cat.images];
        const temp = newImages[inCatIndex];
        newImages[inCatIndex] = newImages[targetIndex];
        newImages[targetIndex] = temp;

        return { ...cat, images: newImages };
      }
      return cat;
    });

    setPortfolioData(updatedData);
  };

  // Request Image Removal (opens custom modal)
  const handleRemoveImage = (categoryName, imageSrc, imageTitle, imageId) => {
    setDeleteConfirmTarget({
      categoryName,
      imageSrc,
      imageTitle,
      imageId,
    });
  };

  // Confirm Image Removal via RESTful DELETE /api/portfolio/[id]
  const confirmDeleteImage = async () => {
    if (!deleteConfirmTarget) return;
    const { categoryName, imageSrc, imageTitle, imageId } = deleteConfirmTarget;

    const updatedData = portfolioData.map((cat) => {
      if (cat.category === categoryName) {
        return {
          ...cat,
          images: cat.images.filter((img) => (imageId ? img.id !== imageId : img.src !== imageSrc)),
        };
      }
      return cat;
    });

    setPortfolioData(updatedData);
    setDeleteConfirmTarget(null);

    if (imageId) {
      try {
        const res = await fetch(`/api/portfolio/${imageId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          showToast(`Removed "${imageTitle || "Image"}"`);
        } else {
          const err = await res.json();
          showToast(err.error || "Failed to delete image", "error");
        }
      } catch (err) {
        console.error("Delete error:", err);
        showToast("Error deleting image", "error");
      }
    }
  };

  // Submit Add Image Form via single-item PATCH
  const handleAddImageSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let finalSrc = newImage.src;

    // If uploading a file, post file to upload API
    if (uploadMode === "file" && selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "File upload failed");
        }

        const data = await res.json();
        finalSrc = data.src;
      } catch (err) {
        showToast(err.message || "Failed to upload image file", "error");
        setIsUploading(false);
        return;
      }
    }

    if (!finalSrc) {
      showToast("Please provide an image URL or upload a file", "error");
      setIsUploading(false);
      return;
    }

    const targetCategory = newImage.category || categories[0] || "Advertising";
    const newImageObj = {
      src: finalSrc,
      width: parseInt(newImage.width) || 1600,
      height: parseInt(newImage.height) || 1200,
      title: newImage.title || "Untitled Artwork",
      description: newImage.description || `Editorial photography for ${targetCategory} by G Venket Ram.`,
    };

    // Send single-item PATCH to insert new record directly
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
      const createdImageObj = patchData.data?.id
        ? { ...newImageObj, id: patchData.data.id }
        : newImageObj;

      // Append image with UUID id to local UI state
      const updatedData = portfolioData.map((cat) => {
        if (cat.category === targetCategory) {
          return {
            ...cat,
            images: [createdImageObj, ...cat.images],
          };
        }
        return cat;
      });

      setPortfolioData(updatedData);
      setIsAddModalOpen(false);
      setIsUploading(false);
      showToast(`Added new image to "${targetCategory}"!`);

      // Reset form
      setNewImage({
        title: "",
        src: "",
        category: activeCategory !== "All" ? activeCategory : categories[0] || "Advertising",
        width: 1600,
        height: 1200,
        description: "",
      });
      setSelectedFile(null);
    } catch (err) {
      console.error("Add image PATCH error:", err);
      showToast(err.message || "Failed to save image", "error");
      setIsUploading(false);
    }
  };

  // Flatten images for workspace listing
  const allImagesWithCategory = portfolioData.flatMap((cat) =>
    cat.images.map((img) => ({
      ...img,
      category: cat.category,
    }))
  );

  const displayedImages = allImagesWithCategory.filter((img) => {
    const matchesCategory = activeCategory === "All" || img.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#1c1a17] pb-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 text-xs uppercase tracking-widest font-semibold border ${
              toastMessage.type === "error"
                ? "bg-red-900 text-white border-red-700"
                : "bg-[#1c1a17] text-[#f5f2eb] border-neutral-700"
            }`}
          >
            {toastMessage.type === "error" ? (
              <AlertCircle size={16} className="text-red-400" />
            ) : (
              <CheckCircle2 size={16} className="text-emerald-400" />
            )}
            <span>{toastMessage.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#E2DDD3] border-b border-[#d8d3c5] shadow-xs px-4 sm:px-8 py-4">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center text-xs uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Main Site
            </Link>
            <span className="text-neutral-300">|</span>
            <h1 className="text-lg font-serif uppercase tracking-widest text-[#1c1a17] font-semibold flex items-center gap-2">
              <Layers size={18} /> Admin Dashboard
            </h1>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                setNewImage((prev) => ({
                  ...prev,
                  category: activeCategory !== "All" ? activeCategory : categories[0] || "Advertising",
                }));
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2 bg-[#1c1a17] text-[#f5f2eb] hover:bg-neutral-800 text-xs uppercase tracking-widest rounded transition-all flex items-center gap-2 cursor-pointer font-medium"
            >
              <Plus size={15} />
              Add New Image
            </button>

            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className={`px-5 py-2 text-xs uppercase tracking-widest rounded transition-all flex items-center gap-2 font-medium cursor-pointer shadow-sm ${
                hasUnsavedChanges
                  ? "bg-amber-700 text-white hover:bg-amber-800 animate-pulse"
                  : "bg-neutral-800 text-neutral-300 hover:bg-black"
              }`}
            >
              <Save size={15} />
              {isSaving ? "Saving..." : hasUnsavedChanges ? "Save Changes *" : "Saved"}
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="w-full px-4 sm:px-8 py-8">
        
        {/* Workspace Toolbar: Search & Tab Stats */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e6e2d8] pb-6">
          
          {/* Category Tabs Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === "All"
                  ? "bg-[#1c1a17] text-[#f5f2eb] font-semibold"
                  : "bg-[#e6e2d8]/60 text-neutral-600 hover:bg-[#e6e2d8] hover:text-black"
              }`}
            >
              All Tabs ({allImagesWithCategory.length})
            </button>

            {categories.map((catName) => {
              const catObj = portfolioData.find((c) => c.category === catName);
              const count = catObj ? catObj.images.length : 0;
              const isActive = activeCategory === catName;

              return (
                <button
                  key={catName}
                  onClick={() => setActiveCategory(catName)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#1c1a17] text-[#f5f2eb] font-semibold"
                      : "bg-[#e6e2d8]/60 text-neutral-600 hover:bg-[#e6e2d8] hover:text-black"
                  }`}
                >
                  <span>{catName}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded ${isActive ? "bg-neutral-700 text-white" : "bg-neutral-300 text-neutral-700"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
            />
          </div>

        </div>

        {/* Current Active Category Description Bar */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-500">
            Managing: <span className="text-[#1c1a17] font-bold">{activeCategory}</span> ({displayedImages.length} Images Shown)
          </span>
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded font-medium">
              You have unsaved changes. Click "Save Changes" to apply live.
            </span>
          )}
        </div>

        {/* Admin Images Grid */}
        {displayedImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedImages.map((img, idx) => {
              // Find index within context for reordering
              const isAllView = activeCategory === "All";
              const catObj = portfolioData.find((c) => c.category === img.category);
              const inCatIndex = catObj ? catObj.images.findIndex((i) => i.src === img.src) : -1;

              const isFirst = isAllView ? idx === 0 : inCatIndex <= 0;
              const isLast = isAllView
                ? idx >= displayedImages.length - 1
                : catObj ? inCatIndex >= catObj.images.length - 1 : true;
              const displayPos = isAllView ? idx + 1 : inCatIndex + 1;

              const isEditing = editingImageSrc === img.src;

              return (
                <div
                  key={img.id || `${img.category}-${img.src}-${idx}`}
                  className="bg-[#faf8f5] border border-[#e6e2d8] rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
                >
                  {/* Thumbnail Preview - Clickable for Full View */}
                  <div 
                    onClick={() => setPreviewImage(img)}
                    className="relative h-56 w-full bg-neutral-200 overflow-hidden cursor-pointer group/thumb"
                  >
                    <Image
                      src={img.src}
                      alt={img.title || "Portfolio Image"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />

                    {/* Tag Badge */}
                    <div className="absolute top-2 left-2 bg-[#1c1a17]/85 text-[#f5f2eb] px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1 backdrop-blur-xs z-10">
                      <Tag size={10} />
                      {img.category}
                    </div>

                    {/* Quick Full View Hover Overlay */}
                    <div className="absolute inset-0 bg-[#1c1a17]/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white">
                      <Eye size={20} />
                      <span className="text-xs uppercase tracking-widest font-medium">Full View</span>
                    </div>

                    {/* Top Action Overlay Buttons */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                      {/* Inline Edit Toggle Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingImageSrc(isEditing ? null : img.src);
                        }}
                        className={`p-2 rounded transition-colors shadow-sm cursor-pointer ${
                          isEditing
                            ? "bg-amber-600 text-white hover:bg-amber-700"
                            : "bg-[#1c1a17]/90 text-white hover:bg-black"
                        }`}
                        title={isEditing ? "Close Editing" : "Edit Title & Description"}
                      >
                        {isEditing ? <Check size={14} /> : <Pencil size={14} />}
                      </button>

                      {/* Quick Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(img.category, img.src, img.title, img.id);
                        }}
                        className="p-2 bg-red-600/90 text-white rounded hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                        title="Remove Image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Image Metadata & Controls Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    
                    {isEditing ? (
                      /* INLINE EDITING FORM */
                      <div className="flex flex-col gap-2 bg-[#f5f2eb] p-2.5 rounded border border-[#d8d3c5]">
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-semibold mb-1">
                            Edit Title:
                          </label>
                          <input
                            type="text"
                            value={img.title || ""}
                            onChange={(e) => handleUpdateImageMetadata(img.category, img.src, "title", e.target.value, img.id)}
                            className="w-full text-xs font-serif font-semibold uppercase tracking-wider text-[#1c1a17] bg-white border border-[#e6e2d8] rounded px-2 py-1 focus:outline-none focus:border-[#1c1a17]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-semibold mb-1">
                            Edit Description:
                          </label>
                          <textarea
                            rows={2}
                            value={img.description || ""}
                            onChange={(e) => handleUpdateImageMetadata(img.category, img.src, "description", e.target.value, img.id)}
                            className="w-full text-[11px] text-neutral-700 bg-white border border-[#e6e2d8] rounded px-2 py-1 focus:outline-none focus:border-[#1c1a17]"
                          />
                        </div>
                        <button
                          onClick={() => setEditingImageSrc(null)}
                          className="mt-1 self-end px-3 py-1 bg-[#1c1a17] text-[#f5f2eb] text-[10px] uppercase tracking-widest rounded font-medium cursor-pointer"
                        >
                          Done Editing
                        </button>
                      </div>
                    ) : (
                      /* READ-ONLY METADATA DISPLAY */
                      <div>
                        <div className="flex items-center justify-between group/title">
                          <h3 
                            onClick={() => setPreviewImage(img)}
                            className="text-sm font-serif font-semibold uppercase tracking-wider text-[#1c1a17] line-clamp-1 cursor-pointer hover:text-neutral-600 transition-colors"
                          >
                            {img.title || "Untitled Image"}
                          </h3>
                          <button
                            onClick={() => setEditingImageSrc(img.src)}
                            className="p-1 text-neutral-400 hover:text-black transition-colors"
                            title="Edit Title & Description"
                          >
                            <Pencil size={12} />
                          </button>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                          {img.description || "No description provided."}
                        </p>
                      </div>
                    )}

                    {/* Controls Footer */}
                    <div className="border-t border-[#e6e2d8] pt-3 flex flex-col gap-3">
                      
                      {/* Tag / Category Tab Selector */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold flex items-center gap-1">
                          <Tag size={10} /> Move to Category Tab:
                        </label>
                        <select
                          value={img.category}
                          onChange={(e) => handleTagChange(e.target.value, img.src, img.category, img.id)}
                          className="w-full text-xs bg-[#f5f2eb] border border-[#e6e2d8] rounded px-2.5 py-1.5 focus:outline-none focus:border-[#1c1a17] font-sans font-medium"
                        >
                          {categories.map((cName) => (
                            <option key={cName} value={cName}>
                              {cName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Re-order & Action Bar */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-neutral-400 tracking-wider">
                          Pos #{displayPos}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleReorder(img.category, img.src, "up", idx)}
                            disabled={isFirst}
                            className={`p-1.5 rounded border ${
                              isFirst
                                ? "opacity-30 border-neutral-200 cursor-not-allowed text-neutral-400"
                                : "border-[#e6e2d8] bg-white hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                            }`}
                            title="Move Earlier in Tab"
                          >
                            <ArrowUp size={13} />
                          </button>

                          <button
                            onClick={() => handleReorder(img.category, img.src, "down", idx)}
                            disabled={isLast}
                            className={`p-1.5 rounded border ${
                              isLast
                                ? "opacity-30 border-neutral-200 cursor-not-allowed text-neutral-400"
                                : "border-[#e6e2d8] bg-white hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                            }`}
                            title="Move Later in Tab"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#e6e2d8] rounded-lg bg-[#faf8f5]">
            <ImageIcon size={40} className="text-neutral-300 mb-3" />
            <p className="text-sm uppercase tracking-widest text-neutral-400">No images found in this tab view.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-[#1c1a17] text-[#f5f2eb] text-xs uppercase tracking-widest rounded font-medium hover:bg-neutral-800 transition-colors"
            >
              Add First Image
            </button>
          </div>
        )}

      </main>

      {/* FULL VIEW IMAGE PREVIEW MODAL */}
      <AnimatePresence>
        {previewImage && (
          <div 
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] w-full bg-[#1c1a17] text-[#f5f2eb] rounded-xl overflow-hidden shadow-2xl flex flex-col cursor-default border border-neutral-800"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#25221e]">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-[#f5f2eb]/10 text-neutral-300 border border-neutral-700 font-semibold">
                    {previewImage.category}
                  </span>
                  <h2 className="text-sm sm:text-base font-serif uppercase tracking-widest font-semibold text-white">
                    {previewImage.title || "Full View Preview"}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={previewImage.src}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                    title="Open Original Image File"
                  >
                    <ExternalLink size={18} />
                  </a>
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              {/* Full Image Container */}
              <div className="relative flex-1 min-h-[50vh] max-h-[70vh] w-full bg-neutral-950 flex items-center justify-center p-4">
                <img
                  src={previewImage.src}
                  alt={previewImage.title || "Full View"}
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded shadow-lg"
                />
              </div>

              {/* Modal Bottom Metadata */}
              <div className="px-6 py-4 bg-[#25221e] border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400">
                <p className="line-clamp-2 leading-relaxed">
                  {previewImage.description || "No description specified."}
                </p>
                <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest text-neutral-500 shrink-0">
                  <span>Dim: {previewImage.width || "Auto"} x {previewImage.height || "Auto"} px</span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD NEW IMAGE MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#f5f2eb] border border-[#d8d3c5] rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#E2DDD3] border-b border-[#d8d3c5]">
                <h2 className="text-base font-serif uppercase tracking-widest font-semibold text-[#1c1a17]">
                  Add New Portfolio Image
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-neutral-500 hover:text-black transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleAddImageSubmit} className="p-6 space-y-4">
                
                {/* Upload Mode Switcher */}
                <div className="flex gap-2 p-1 bg-[#e6e2d8]/60 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`flex-1 py-1.5 text-xs uppercase tracking-widest rounded font-semibold transition-all ${
                      uploadMode === "url"
                        ? "bg-[#1c1a17] text-[#f5f2eb]"
                        : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`flex-1 py-1.5 text-xs uppercase tracking-widest rounded font-semibold transition-all ${
                      uploadMode === "file"
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
                      value={newImage.src}
                      onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                      Choose Local Image File *
                    </label>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
                    />
                  </div>
                )}

                {/* Target Category Tag */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                    Assign Category Tab Tag *
                  </label>
                  <select
                    value={newImage.category}
                    onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
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
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Sari Collection"
                    value={newImage.title}
                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short description of the photo..."
                    value={newImage.description}
                    onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
                  />
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={newImage.width}
                      onChange={(e) => setNewImage({ ...newImage, width: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={newImage.height}
                      onChange={(e) => setNewImage({ ...newImage, height: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#e6e2d8]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-black font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-5 py-2 bg-[#1c1a17] text-[#f5f2eb] hover:bg-neutral-800 text-xs uppercase tracking-widest rounded font-medium transition-colors"
                  >
                    {isUploading ? "Uploading..." : "Add to Portfolio"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmTarget && (
          <div 
            onClick={() => setDeleteConfirmTarget(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#f5f2eb] border border-[#d8d3c5] rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-red-900/10 border-b border-red-200/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full text-red-700">
                    <AlertCircle size={20} />
                  </div>
                  <h2 className="text-sm font-serif uppercase tracking-widest font-bold text-red-950">
                    Confirm Deletion
                  </h2>
                </div>
                <button
                  onClick={() => setDeleteConfirmTarget(null)}
                  className="p-1 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 text-xs text-neutral-700 space-y-3">
                <p className="leading-relaxed">
                  Are you sure you want to remove{" "}
                  <strong className="text-[#1c1a17] font-semibold font-serif uppercase tracking-wide">
                    "{deleteConfirmTarget.imageTitle || "this image"}"
                  </strong>{" "}
                  from <span className="font-semibold text-neutral-900">{deleteConfirmTarget.categoryName}</span>?
                </p>
                <div className="p-3.5 bg-amber-500/10 border border-amber-300/80 rounded-lg text-[11px] text-amber-950 space-y-2">
                  <div className="font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-amber-700 shrink-0" />
                    Required Two-Step Action:
                  </div>
                  <ul className="space-y-1 text-neutral-800 font-medium pl-1">
                    <li className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                      <span>Click <strong className="text-red-700">"Confirm & Remove"</strong> below to remove from workspace.</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                      <span>Click <strong className="text-amber-800 font-bold">"Save Changes *"</strong> at top right to permanently apply and delete from storage & database.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-6 py-4 bg-[#E2DDD3] border-t border-[#d8d3c5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmTarget(null)}
                  className="px-4 py-2 text-xs uppercase tracking-widest rounded border border-neutral-300 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteImage}
                  className="px-5 py-2 text-xs uppercase tracking-widest rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 size={14} />
                  Confirm & Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
