"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import { portfolioData, PORTFOLIO_CATEGORIES } from "@/data/portfolio";
import { fadeIn } from "@/utils/animations";

export default function Home() {
  // Flatten all images and tag them with their category
  const allImages = portfolioData.flatMap((cat) =>
    cat.images.map((img) => ({
      ...img,
      category: cat.category,
    }))
  );

  // Categories list including "All" as default filter
  const galleryCategories = ["All", ...PORTFOLIO_CATEGORIES];

  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      {/* Premium Hero Banner (Layout inspired by the reference screenshot) */}
      <div className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden border-b border-[#e6e2d8]">
        {/* Background Image with warm editorial tone */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[20%] brightness-[0.9]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1920&q=80')`
          }}
        />
        {/* Soft warm-beige overlay to blend with the theme and ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f2eb]/60 via-[#f5f2eb]/75 to-[#f5f2eb]" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <motion.span
            initial="hidden"
            animate="show"
            variants={fadeIn("up", 0.1)}
            className="text-xs uppercase tracking-[0.4em] text-neutral-600 font-semibold block"
          >
            HELLO!
          </motion.span>
          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeIn("up", 0.2)}
            className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.15em] text-[#1c1a17] uppercase font-serif"
          >
            I'M G. <span className="font-normal italic">VENKETRAM</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeIn("up", 0.3)}
            className="text-sm md:text-base text-neutral-700 font-light leading-relaxed max-w-2xl mx-auto"
          >
            I am a commercial & fashion photographer based in New York. I specialize in capturing high-end fashion, jewellery campaigns, and editorial narratives. Let us bring your brand's vision into beautiful, timeless light.
          </motion.p>
          
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn("up", 0.4)}
            className="pt-4"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-[#1c1a17] text-[#1c1a17] px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-[#1c1a17] hover:text-[#f5f2eb] transition-all duration-300 font-semibold rounded-md shadow-sm"
            >
              Contact Me
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main Curated Gallery Section (Tightly following the Hero) */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-16">
        {/* Gallery System */}
        <Gallery
          categories={galleryCategories}
          allImages={allImages}
          initialCategory="All"
        />
      </div>
    </div>
  );
}
