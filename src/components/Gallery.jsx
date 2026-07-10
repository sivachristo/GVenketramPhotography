"use client";

import { useState } from "react";
import Image from "next/image";
import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/styles.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

// Custom Render Image component: clean grid of photos, metadata shown as a premium hover overlay
function CustomRenderImage(props, { photo, width, height }) {
  return (
    <div className="relative overflow-hidden rounded-lg group bg-[#faf8f5] border border-[#e6e2d8]/60 shadow-sm cursor-pointer aspect-auto">
      <Image
        src={photo.src}
        alt={photo.alt || photo.title || ""}
        width={width}
        height={height}
        sizes={props.sizes}
        style={{
          ...props.style,
          width: "100%",
          height: "auto",
          display: "block",
        }}
        className={`${props.className || ""} transition-all duration-700 ease-out group-hover:scale-105 filter brightness-[0.98] group-hover:brightness-100`}
      />
      {/* Premium Warm Beige Overlay on Hover (matching the beige theme, clean layout style) */}
      <div className="absolute inset-0 bg-[#f5f2eb]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 pointer-events-none">
        <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-semibold mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          {photo.category}
        </span>
        <h3 className="text-base font-light tracking-wider text-[#1c1a17] uppercase translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out font-serif">
          {photo.title}
        </h3>
        <p className="text-xs text-neutral-600 mt-2 line-clamp-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-75 leading-relaxed font-light">
          {photo.description}
        </p>
        <div className="flex items-center text-xs text-[#1c1a17] font-semibold uppercase tracking-widest mt-4 translate-y-5 group-hover:translate-y-0 transition-transform duration-500 ease-out delay-100">
          <span>View Image</span>
          <ChevronRight size={14} className="ml-1" />
        </div>
      </div>
    </div>
  );
}

export default function Gallery({ initialCategory = "All", categories, allImages }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Filter photos based on selection
  const filteredImages =
    activeCategory === "All"
      ? allImages
      : allImages.filter((img) => img.category === activeCategory);

  // Format images for react-photo-album and lightbox
  const photos = filteredImages.map((img, idx) => ({
    src: img.src,
    width: img.width,
    height: img.height,
    title: img.title,
    description: img.description,
    category: img.category,
    alt: img.title,
    key: `${img.category}-${idx}-${img.title.replace(/\s+/g, "-").toLowerCase()}`
  }));

  return (
    <div className="w-full">
      {/* Category Filtering Tabs (Only shown if initialCategory is 'All') */}
      {initialCategory === "All" && (
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2 border-b border-[#e6e2d8]/60 pb-6">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="relative px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors duration-300 cursor-pointer focus:outline-none"
              >
                <span className={isActive ? "text-[#1c1a17] font-semibold" : "text-neutral-500 hover:text-black"}>
                  {category}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="activeCategoryBorder"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1c1a17]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Album Grid Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full"
        >
          {photos.length > 0 ? (
            <MasonryPhotoAlbum
              photos={photos}
              onClick={({ index }) => setLightboxIndex(index)}
              render={{ image: CustomRenderImage }}
              columns={(containerWidth) => {
                if (containerWidth < 640) return 1;
                if (containerWidth < 1024) return 2;
                if (containerWidth < 1440) return 3;
                if (containerWidth < 1920) return 4;
                return 5;
              }}
              spacing={16}
            />
          ) : (
            <div className="flex h-60 items-center justify-center border border-dashed border-[#e6e2d8] rounded-lg">
              <p className="text-sm text-neutral-400 uppercase tracking-widest">No images found in this category.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox Modal */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={photos.map((photo) => ({
          src: photo.src,
          alt: photo.title,
          width: photo.width,
          height: photo.height,
        }))}
        styles={{
          container: { backgroundColor: "rgba(28, 26, 23, 0.98)" },
        }}
      />
    </div>
  );
}
