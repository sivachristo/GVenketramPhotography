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

  const handleScroll = (e) => {
    e.preventDefault();
    const element = document.getElementById("portfolio");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      {/* Full-Screen Premium Hero Banner */}
      <div className="relative h-screen w-full flex overflow-hidden">
        {/* Background Image with warm editorial tone */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[10%] brightness-[0.85]"
          style={{
            backgroundImage: `url('/fashion_portrait_hero.png')`
          }}
        />
        {/* Subtle full-bleed overlay to ensure off-white text readability */}
        <div className="absolute inset-0 bg-neutral-950/30" />

        {/* View Portfolio Button at the Bottom Center */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn("up", 0.3)}
          >
            <Link
              href="#portfolio"
              onClick={handleScroll}
              className="inline-flex flex-col items-center gap-2 text-xs uppercase tracking-[0.4em] text-[#F8F5F1] hover:text-white transition-colors duration-300 font-medium group text-shadow-editorial"
            >
              <span>View Portfolio</span>
              <span className="text-sm transform group-hover:translate-y-1 transition-transform duration-300 font-sans">↓</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main Curated Gallery Section (Tightly following the Hero) */}
      <div id="portfolio" className="w-full px-4 sm:px-8 lg:px-12 py-16 scroll-mt-6">
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
