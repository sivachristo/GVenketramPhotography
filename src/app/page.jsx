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

        {/* Editorial Content container in the left third */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 flex items-center">
          <div className="max-w-[450px] md:max-w-[550px] text-left space-y-6 md:space-y-8">
            <motion.span
              initial="hidden"
              animate="show"
              variants={fadeIn("up", 0.1)}
              className="text-xs uppercase tracking-[0.4em] text-[#F8F5F1]/85 font-medium block text-shadow-editorial"
            >
              HELLO
            </motion.span>
            
            <motion.h1
              initial="hidden"
              animate="show"
              variants={fadeIn("up", 0.2)}
              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.15em] text-[#F8F5F1] uppercase font-serif leading-tight text-shadow-editorial"
            >
              I&apos;m G. <br />
              <span className="block text-[55px] sm:text-[70px] md:text-[85px] lg:text-[90px] font-normal tracking-[0.05em] mt-2 leading-none text-[#F8F5F1]">
                VENKETRAM
              </span>
            </motion.h1>
            
            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeIn("up", 0.3)}
              className="text-xs sm:text-sm md:text-base text-[#F8F5F1]/90 font-light leading-relaxed max-w-md text-shadow-editorial"
            >
              I am a commercial & fashion photographer based in New York. I specialize in capturing high-end fashion campaigns, luxury jewellery campaigns, and premium editorial narratives.
            </motion.p>
            
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeIn("up", 0.4)}
              className="pt-2"
            >
              <Link
                href="#portfolio"
                onClick={handleScroll}
                className="inline-flex items-center text-xs uppercase tracking-[0.3em] text-[#F8F5F1] hover:text-white transition-colors duration-300 font-medium group text-shadow-editorial"
              >
                View Portfolio
                <span className="ml-3 transform group-hover:translate-x-1.5 transition-transform duration-300 font-sans">→</span>
              </Link>
            </motion.div>
          </div>
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
