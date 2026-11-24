"use client";

import { useState, useEffect, useRef } from "react";
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
  const allSlides = images && images.length > 0 ? images : DEFAULT_HERO_IMAGES;

  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const updateDevice = (e) => {
      setIsMobileViewport(e.matches);
      setCurrentIndex(0);
    };

    setIsMobileViewport(mql.matches);
    if (mql.addEventListener) {
      mql.addEventListener("change", updateDevice);
      return () => mql.removeEventListener("change", updateDevice);
    } else {
      mql.addListener(updateDevice);
      return () => mql.removeListener(updateDevice);
    }
  }, []);

  const desktopSlides = allSlides.filter((img) => {
    const target = (img.device || img.viewport || "").toLowerCase();
    if (target === "mobile") return false;
    return !String(img.id || "").startsWith("main-mob-");
  });

  const mobileSlides = allSlides.filter((img) => {
    const target = (img.device || img.viewport || "").toLowerCase();
    if (target === "mobile") return true;
    return String(img.id || "").startsWith("main-mob-");
  });

  const activeSet = isMobileViewport ? mobileSlides : desktopSlides;
  const slideImages =
    activeSet.length > 0
      ? activeSet
      : desktopSlides.length > 0
      ? desktopSlides
      : DEFAULT_HERO_IMAGES;

  const safeIndex = currentIndex % slideImages.length;

  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  const handleTouchStart = (e) => {
    const touch = e.touches?.[0];
    if (!touch) return;
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null || slideImages.length <= 1) return;
    const touch = e.changedTouches?.[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - (touchStartYRef.current ?? touch.clientY);

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // Trigger slide change if horizontal swipe is dominant and exceeds 40px
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swiped left -> next photo
        setCurrentIndex((prev) => (prev + 1) % slideImages.length);
      } else {
        // Swiped right -> previous photo
        setCurrentIndex(
          (prev) => (prev - 1 + slideImages.length) % slideImages.length
        );
      }
    }
  };

  useEffect(() => {
    if (slideImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slideImages.length);
    }, 5000); // 6-second interval (decreased by 2 seconds from 8s)

    return () => clearInterval(timer);
  }, [slideImages.length, safeIndex]);

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
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="absolute inset-0 overflow-hidden select-none touch-pan-y"
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`${isMobileViewport ? "mob" : "desk"}-${safeIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
          className="absolute inset-0 h-full w-full pointer-events-none"
        >
          <Image
            src={slideImages[safeIndex].src}
            alt={slideImages[safeIndex].alt || slideImages[safeIndex].title || "Hero Image"}
            fill
            priority={safeIndex === 0}
            sizes="100vw"
            quality={100}
            unoptimized={String(slideImages[safeIndex].src || "").includes("res.cloudinary.com")}
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle Bottom Scrim for "View Portfolio" & Slide Indicators readability on light photos */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/35 via-black/10 to-transparent z-10" />

      {/* Subtle Slide Indicators — Centered above "View Portfolio" on Mobile, Bottom-Right on Tablet/Desktop */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 md:bottom-10 md:left-auto md:right-10 md:translate-x-0 z-20 flex items-center gap-2 pointer-events-auto">
        {slideImages.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.65)] ${
              idx === safeIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/55 hover:bg-white/85"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
