"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ArtworkCard({ artwork }) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(artwork);
  };

  const isDigital = artwork.type === "Digital";

  return (
    <div className="group relative flex flex-col bg-[#faf8f5] border border-[#e6e2d8] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
      
      {/* Image Container with Natural Aspect Ratio preservation */}
      <div className="relative w-full overflow-hidden bg-[#e8e3d8]">
        <Link href={`/art-gallery/${artwork.id}`} className="block relative w-full cursor-pointer">
          <Image
            src={artwork.image}
            alt={artwork.title}
            width={artwork.width}
            height={artwork.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] brightness-[0.98] group-hover:brightness-100"
          />

          {/* Overlay Gradient on Hover */}
          <div className="absolute inset-0 bg-[#1c1a17]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <span className="inline-flex items-center space-x-1.5 text-[11px] uppercase tracking-[0.2em] font-medium bg-[#f5f2eb] text-[#1c1a17] px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Eye size={14} />
              <span>View Artwork</span>
            </span>
          </div>
        </Link>

        {/* Type Badge Top Left */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`text-[9px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm border ${
              isDigital
                ? "bg-[#1c1a17]/80 text-[#f5f2eb] border-neutral-700"
                : "bg-[#A97C5B]/90 text-white border-[#A97C5B]"
            }`}
          >
            {artwork.type}
          </span>
        </div>

        {/* Quick Add to Cart Button Top Right */}
        <button
          onClick={handleQuickAdd}
          className="absolute top-3 right-3 z-10 p-2.5 bg-[#f5f2eb]/90 hover:bg-[#1c1a17] text-[#1c1a17] hover:text-[#f5f2eb] rounded-full backdrop-blur-md transition-all duration-300 shadow-md cursor-pointer group/btn"
          title="Quick Add to Cart"
        >
          <ShoppingBag size={15} className="group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>

      {/* Card Metadata Footer */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-3 border-t border-[#e6e2d8]/60">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A97C5B] font-semibold">
              {artwork.category}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              {artwork.year}
            </span>
          </div>

          <Link href={`/art-gallery/${artwork.id}`} className="block mt-1 group/title">
            <h3 className="text-base sm:text-lg font-serif font-semibold text-[#1c1a17] tracking-wider uppercase group-hover/title:text-[#A97C5B] transition-colors duration-300 line-clamp-1">
              {artwork.title}
            </h3>
          </Link>

          <p className="text-xs text-neutral-500 font-light mt-1.5 line-clamp-2 leading-relaxed">
            {artwork.shortDescription}
          </p>
        </div>

        <div className="pt-3 border-t border-[#e6e2d8]/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-medium">Starting from</span>
            <span className="text-base font-serif font-semibold text-[#1c1a17]">
              ${artwork.price.toLocaleString()}
            </span>
          </div>

          <Link
            href={`/art-gallery/${artwork.id}`}
            className="inline-flex items-center space-x-1 text-[11px] uppercase tracking-widest text-neutral-600 hover:text-black font-semibold transition-colors duration-300 group/link"
          >
            <span>Explore</span>
            <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  );
}
