"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import ArtworkCard from "@/components/ArtworkCard";
import { artworksData as initialData, ARTWORK_CATEGORIES } from "@/data/artworks";
import { fadeIn } from "@/utils/animations";

export default function ArtGalleryPage() {
  const [artworks, setArtworks] = useState(initialData);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    async function loadArtworks() {
      try {
        const res = await fetch("/api/artworks");
        if (res.ok) {
          const data = await res.json();
          if (data.artworks && data.artworks.length > 0) {
            setArtworks(data.artworks);
          }
        }
      } catch (err) {
        console.error("Failed to load artworks from API:", err);
      }
    }
    loadArtworks();
  }, []);

  const filteredArtworks = useMemo(() => {
    return artworks
      .filter((art) => {
        const matchesCategory =
          activeCategory === "All" || art.category === activeCategory;
        const matchesSearch =
          searchQuery.trim() === "" ||
          art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return 0; // featured default order
      });
  }, [artworks, activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-4 sm:px-8 lg:px-12 py-16 text-[#1c1a17]">
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Editorial Header Section */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeIn("up", 0.1)}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.3em] text-[#A97C5B] font-semibold">
            <Sparkles size={14} />
            <span>Limited Edition Fine Art & Digital Collectibles</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light uppercase tracking-widest font-serif text-[#1c1a17]">
            The <span className="font-semibold text-[#A97C5B] italic font-serif">Art Gallery</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">
            Explore curated museum-quality fine art prints and high-resolution digital masterworks by G. Venketram. Each physical print is produced on archival papers with signed certificates of authenticity.
          </p>
        </motion.div>

        {/* Filter & Search Toolbar */}
        <div className="mb-12">
          
          {/* Search Input & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#e6e2d8] pb-6">
            
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {ARTWORK_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all duration-300 rounded-full cursor-pointer ${
                      isActive
                        ? "bg-[#1c1a17] text-[#f5f2eb] font-semibold shadow-sm"
                        : "bg-[#faf8f5] text-neutral-600 hover:text-black border border-[#e6e2d8]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Right Tools: Search & Sort */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
              
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-56">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search artworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#faf8f5] border border-[#e6e2d8] rounded-full text-xs text-[#1c1a17] placeholder:text-neutral-400 focus:outline-none focus:border-[#1c1a17] transition-colors"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative flex items-center bg-[#faf8f5] border border-[#e6e2d8] rounded-full px-3 py-1.5 text-xs text-neutral-600">
                <SlidersHorizontal size={14} className="mr-2 text-neutral-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent focus:outline-none text-xs font-medium cursor-pointer"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title">Title: A - Z</option>
                </select>
              </div>

            </div>
          </div>

        </div>

        {/* Masonry Artwork Grid Layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${searchQuery}-${sortBy}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {filteredArtworks.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {filteredArtworks.map((artwork) => (
                  <div key={artwork.id} className="break-inside-avoid">
                    <ArtworkCard artwork={artwork} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border border-dashed border-[#e6e2d8] rounded-xl text-center p-8 space-y-3">
                <p className="text-sm uppercase tracking-widest text-neutral-400 font-semibold">
                  No artworks found matching your criteria
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="text-xs uppercase tracking-wider text-[#A97C5B] underline hover:text-[#1c1a17] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Gallery Info Footer Banner */}
        <div className="mt-24 p-8 sm:p-12 bg-[#faf8f5] border border-[#e6e2d8] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A97C5B] font-semibold">
              Collector Services & Custom Editions
            </span>
            <h3 className="text-2xl font-serif font-semibold text-[#1c1a17] uppercase tracking-wider">
              Looking for Custom Sizes or Private Commissions?
            </h3>
            <p className="text-xs text-neutral-600 max-w-xl font-light leading-relaxed">
              We offer bespoke framing options, large architectural scale installations, and direct artist consultations for private art collectors and corporate spaces.
            </p>
          </div>
          <a
            href="/contact"
            className="px-8 py-3.5 bg-[#1c1a17] hover:bg-[#A97C5B] text-[#f5f2eb] text-xs uppercase tracking-[0.2em] font-medium rounded transition-colors duration-300 shrink-0"
          >
            Inquire with Studio
          </a>
        </div>

      </div>
    </div>
  );
}
