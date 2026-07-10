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
            backgroundImage: `url('/fashion_portrait_hero.png')`
          }}
        />
        {/* Minimal gradient fade at the very bottom to transition to the gallery section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f5f2eb] to-transparent" />

        {/* Hero Content inside a premium editorial card */}
        <div className="relative z-10 max-w-xl mx-auto px-6 py-10 sm:px-12 sm:py-12 text-center space-y-6 bg-[#f5f2eb]/95 border border-[#e6e2d8] rounded-none shadow-xl">
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
            className="text-3xl sm:text-4xl font-light tracking-[0.15em] text-[#1c1a17] uppercase font-serif"
          >
            I'M G. <span className="font-normal italic">VENKETRAM</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeIn("up", 0.3)}
            className="text-xs sm:text-sm text-neutral-700 font-light leading-relaxed max-w-md mx-auto"
          >
            I am a commercial & fashion photographer based in New York. I specialize in capturing high-end fashion, jewellery campaigns, and editorial narratives. Let us bring your brand's vision into beautiful, timeless light.
          </motion.p>
          
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn("up", 0.4)}
            className="pt-2"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-[#1c1a17] bg-[#1c1a17] text-[#f5f2eb] hover:bg-transparent hover:text-[#1c1a17] px-8 py-3 text-xs uppercase tracking-[0.25em] transition-all duration-300 font-semibold"
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
