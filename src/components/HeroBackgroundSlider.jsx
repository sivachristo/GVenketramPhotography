"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const DEFAULT_HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=80",
    alt: "High Fashion Portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=80",
    alt: "Editorial Fashion Photography",
  },
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2000&q=80",
    alt: "Studio Portrait & Lighting",
  },
  {
    src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2000&q=80",
    alt: "Cinematic Fine Art Portrait",
  },
];

export default function HeroBackgroundSlider({ images }) {
  const slideImages = images && images.length > 0 ? images : DEFAULT_HERO_IMAGES;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slideImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slideImages.length);
    }, 8000); // 8-second interval

    return () => clearInterval(timer);
  }, [slideImages.length]);

  // Hide browser scrollbar only while user is on the Hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroThreshold = window.innerHeight * 0.75;
      if (window.scrollY < heroThreshold) {
        document.documentElement.classList.add("hero-scrollbar-hidden");
      } else {
        document.documentElement.classList.remove("hero-scrollbar-hidden");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.classList.remove("hero-scrollbar-hidden");
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
          className="absolute inset-0 h-full w-full"
        >
          <Image
            src={slideImages[currentIndex].src}
            alt={slideImages[currentIndex].alt}
            fill
            priority={currentIndex === 0}
            sizes="100vw"
            quality={85}
            className="object-cover object-center grayscale-[10%] brightness-[0.85]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Editorial overlay for off-white text and navigation readability */}
      <div className="absolute inset-0 bg-neutral-950/30 z-10" />

      {/* Subtle Slide Indicators */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 flex items-center gap-2 pointer-events-auto">
        {slideImages.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              idx === currentIndex
                ? "w-8 bg-white/90"
                : "w-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
