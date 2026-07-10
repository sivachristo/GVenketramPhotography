"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function ImageCard({ category, imageSrc, description }) {
  return (
    <Link 
      href={`/portfolio/${category.toLowerCase()}`} 
      className="group relative block overflow-hidden rounded-xl border border-[#e6e2d8] bg-[#faf8f5] aspect-[3/4]"
    >
      {/* Zoom-on-hover Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imageSrc}
          alt={`${category} portfolio`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 filter brightness-[0.95] group-hover:brightness-100"
        />
      </div>

      {/* Elegant Warm Gradient Shadow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#f5f2eb] via-[#f5f2eb]/30 to-transparent opacity-95 transition-opacity duration-500" />

      {/* Content Overlay */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-500 font-semibold mb-2">
          Collection
        </span>
        <h3 className="text-xl font-light uppercase tracking-widest text-[#1c1a17] mb-2 font-serif">
          {category}
        </h3>
        <p className="text-xs text-neutral-600 font-light leading-relaxed mb-6 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-16 overflow-hidden transition-all duration-500 ease-out">
          {description}
        </p>

        {/* View Collection Button */}
        <div className="flex items-center text-xs text-[#1c1a17] font-medium uppercase tracking-[0.2em] pt-4 border-t border-[#e6e2d8] w-full justify-between">
          <span>Explore Work</span>
          <motion.div
            className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:border-[#1c1a17] group-hover:bg-[#1c1a17] group-hover:text-[#f5f2eb] transition-colors duration-300"
            whileHover={{ x: 5 }}
          >
            <ChevronRight size={14} />
          </motion.div>
        </div>
      </div>
    </Link>
  );
}
