"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  Maximize2,
  Check,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { getArtworkById, artworksData as initialData } from "@/data/artworks";
import { useCart } from "@/context/CartContext";
import ArtworkCard from "@/components/ArtworkCard";

export default function ArtworkDetailPage({ params }) {
  const resolvedParams = use(params);
  const targetId = resolvedParams.id;
  const initialArtwork = getArtworkById(targetId);

  const [artwork, setArtwork] = useState(initialArtwork);
  const [allArtworks, setAllArtworks] = useState(initialData);

  useEffect(() => {
    async function fetchLatestArtworks() {
      try {
        const res = await fetch("/api/artworks");
        if (res.ok) {
          const data = await res.json();
          if (data.artworks && data.artworks.length > 0) {
            setAllArtworks(data.artworks);
            const found = data.artworks.find((a) => a.id === targetId);
            if (found) {
              setArtwork(found);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching artwork details:", err);
      }
    }
    fetchLatestArtworks();
  }, [targetId]);

  if (!artwork && !initialArtwork) {
    notFound();
  }

  const activeArt = artwork || initialArtwork;

  const { addToCart, toggleCart } = useCart();
  const [selectedOption, setSelectedOption] = useState(
    activeArt?.options ? activeArt.options[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const currentPrice = selectedOption ? selectedOption.price : activeArt.price;

  const handleAddToCart = () => {
    addToCart(activeArt, selectedOption, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const relatedArtworks = allArtworks
    .filter((a) => a.id !== activeArt.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-4 sm:px-8 lg:px-12 py-12 text-[#1c1a17]">
      <div className="w-full max-w-7xl mx-auto space-y-12">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-500 border-b border-[#e6e2d8] pb-6">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-neutral-400" />
          <Link href="/art-gallery" className="hover:text-black transition-colors">
            Art Gallery
          </Link>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="text-[#1c1a17] font-semibold line-clamp-1">
            {activeArt.title}
          </span>
        </div>

        {/* Main Artwork Grid (2 Columns on Large Screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Image Viewer (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative w-full rounded-2xl overflow-hidden bg-[#faf8f5] border border-[#e6e2d8] shadow-md group">
              <div className="relative w-full h-auto">
                <Image
                  src={activeArt.image}
                  alt={activeArt.title}
                  width={activeArt.width}
                  height={activeArt.height}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Zoom Trigger Button */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-3 bg-[#1c1a17]/80 hover:bg-[#1c1a17] text-white rounded-full backdrop-blur-md transition-all duration-300 shadow-lg cursor-pointer flex items-center space-x-2 text-xs uppercase tracking-widest"
                title="Expand Artwork"
              >
                <Maximize2 size={16} />
                <span className="hidden sm:inline">Zoom Fullscreen</span>
              </button>

              {/* Type Badge */}
              <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.25em] font-semibold bg-[#1c1a17]/85 text-[#f5f2eb] px-3 py-1 rounded-full backdrop-blur-md">
                {activeArt.type} Edition
              </span>
            </div>

            <p className="text-[11px] text-neutral-400 text-center italic">
              Click &quot;Zoom Fullscreen&quot; to inspect print details in high resolution.
            </p>
          </div>

          {/* Right Column: Artwork Metadata & Purchase UI (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Header Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.3em] text-[#A97C5B] font-semibold">
                  {activeArt.category}
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {activeArt.availability}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#1c1a17] uppercase tracking-wider">
                {activeArt.title}
              </h1>

              {/* Price Display */}
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="text-3xl font-serif font-bold text-[#1c1a17]">
                  ${currentPrice.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-400 font-light">
                  USD (Inclusive of certificate)
                </span>
              </div>
            </div>

            {/* Description Excerpt */}
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              {activeArt.description}
            </p>

            {/* Option Selector (Sizes / License Formats) */}
            {activeArt.options && activeArt.options.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="block text-xs uppercase tracking-[0.2em] font-semibold text-[#1c1a17]">
                  Select Format / Edition Option:
                </label>
                <div className="space-y-2">
                  {activeArt.options.map((opt) => {
                    const isSelected = selectedOption?.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedOption(opt)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-xs transition-all duration-300 text-left cursor-pointer ${
                          isSelected
                            ? "bg-[#1c1a17] text-[#f5f2eb] border-[#1c1a17] shadow-sm font-medium"
                            : "bg-[#faf8f5] text-neutral-700 border-[#e6e2d8] hover:border-neutral-400"
                        }`}
                      >
                        <span className="tracking-wide">{opt.label}</span>
                        <span className="font-serif font-semibold ml-2">
                          ${opt.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart Controls */}
            <div className="space-y-4 pt-4 border-t border-[#e6e2d8]">
              
              <div className="flex items-center space-x-4">
                <label className="text-xs uppercase tracking-widest font-semibold text-neutral-500">
                  Quantity:
                </label>
                <div className="flex items-center space-x-3 border border-[#d8d3c5] rounded-md bg-[#faf8f5] px-3 py-1.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-neutral-500 hover:text-black p-1"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-semibold text-[#1c1a17] w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-neutral-500 hover:text-black p-1"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 px-6 rounded-md text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-md cursor-pointer ${
                    addedSuccess
                      ? "bg-emerald-700 text-white"
                      : "bg-[#1c1a17] hover:bg-[#A97C5B] text-[#f5f2eb]"
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check size={16} />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>Add to Cart (${(currentPrice * quantity).toLocaleString()})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    handleAddToCart();
                    toggleCart();
                  }}
                  className="py-4 px-6 border border-[#1c1a17] text-[#1c1a17] hover:bg-[#1c1a17] hover:text-[#f5f2eb] text-xs uppercase tracking-[0.2em] font-medium rounded transition-all duration-300"
                >
                  Buy Now
                </button>
              </div>

            </div>

            {/* Specifications & Guarantee List */}
            <div className="bg-[#faf8f5] border border-[#e6e2d8] rounded-xl p-5 space-y-4 text-xs">
              <h4 className="font-serif font-semibold uppercase tracking-wider text-[#1c1a17] text-sm">
                Artwork Specifications
              </h4>

              <ul className="space-y-2.5 text-neutral-600 font-light">
                {activeArt.specs?.paper && (
                  <li className="flex justify-between border-b border-[#e6e2d8]/60 pb-2">
                    <span className="font-medium text-neutral-500">Medium Paper:</span>
                    <span>{activeArt.specs.paper}</span>
                  </li>
                )}
                {activeArt.specs?.printing && (
                  <li className="flex justify-between border-b border-[#e6e2d8]/60 pb-2">
                    <span className="font-medium text-neutral-500">Technique:</span>
                    <span>{activeArt.specs.printing}</span>
                  </li>
                )}
                {activeArt.specs?.format && (
                  <li className="flex justify-between border-b border-[#e6e2d8]/60 pb-2">
                    <span className="font-medium text-neutral-500">Digital Format:</span>
                    <span>{activeArt.specs.format}</span>
                  </li>
                )}
                <li className="flex justify-between border-b border-[#e6e2d8]/60 pb-2">
                  <span className="font-medium text-neutral-500">Dimensions:</span>
                  <span>{activeArt.dimensions}</span>
                </li>
                <li className="flex justify-between border-b border-[#e6e2d8]/60 pb-2">
                  <span className="font-medium text-neutral-500">Certificate:</span>
                  <span>Signed Authenticity Seal Included</span>
                </li>
              </ul>

              <div className="pt-2 flex flex-col space-y-2 text-[11px] text-neutral-500">
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={14} className="text-[#A97C5B]" />
                  <span>Insured worldwide shipping in wooden gallery tubes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck size={14} className="text-[#A97C5B]" />
                  <span>Ships within 5-7 business days with tracking</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Related Artworks Recommendations */}
        <div className="pt-16 border-t border-[#e6e2d8] space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#A97C5B] font-semibold">
                Curated Recommendations
              </span>
              <h3 className="text-2xl font-serif font-semibold text-[#1c1a17] uppercase tracking-wider">
                Related Artworks
              </h3>
            </div>
            <Link
              href="/art-gallery"
              className="text-xs uppercase tracking-widest text-neutral-500 hover:text-black transition-colors font-semibold"
            >
              View Full Gallery &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArtworks.map((related) => (
              <ArtworkCard key={related.id} artwork={related} />
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={[{ src: activeArt.image, title: activeArt.title }]}
        styles={{
          container: { backgroundColor: "rgba(28, 26, 23, 0.96)" },
        }}
      />
    </div>
  );
}
