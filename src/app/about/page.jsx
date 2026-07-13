"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/animations";

export default function About() {
  const stats = [
    { label: "Years of Craft", value: "12+" },
    { label: "Global Exhibitions", value: "24" },
    { label: "Editorial Covers", value: "45+" },
    { label: "Industry Awards", value: "15" },
  ];

  const publications = [
    "Vogue Italia",
    "Harper's Bazaar",
    "GQ Magazine",
    "Vanity Fair",
    "The New York Times",
    "AD Magazine",
  ];

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-4 sm:px-6 lg:px-8 py-20 text-[#1c1a17]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Text Content - 7 cols */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn("up", 0.1)}
            className="lg:col-span-7 space-y-8"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#A97C5B] font-semibold mb-2 block">
                The Artist Behind the Lens
              </span>
              <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-[#1c1a17] leading-tight font-serif">
                G. <span className="font-semibold text-[#A97C5B] font-serif italic">Venketram</span>
              </h1>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-neutral-600 font-light">
              G. Venketram is an internationally acclaimed fashion photographer and visual director based in Chennai, India. With a signature style characterized by cinematic lighting, precise geometry, and profound emotional intensity, he has spent over a decade redefining the visual language of modern editorial and luxury advertising.
            </p>

            {/* Premium Quote Block */}
            <div className="py-6 px-8 border-l-2 border-[#A97C5B] bg-[#faf8f5] my-6">
              <p className="font-serif italic text-lg sm:text-xl text-neutral-700 leading-relaxed font-light">
                &ldquo;Photography is the silent dialogue between light, subject, and shadow. My goal is to capture the unseen poise that resides in the briefest transition of moments.&rdquo;
              </p>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-neutral-600 font-light">
              Born with an innate fascination for shadows and human expression, he studied fine art and visual composition before establishing his production studio. His work bridges the divide between commercial high-fashion campaigns and raw documentary art, seeking to isolate fleeting moments of pure poise and transition.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-[#e6e2d8]">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <span className="text-3xl sm:text-4xl font-light text-[#A97C5B] block font-serif italic">
                    {stat.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 block font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Publications */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.25em] text-[#A97C5B] font-semibold">
                Select Clients & Publications
              </h3>
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs uppercase tracking-widest text-neutral-600 font-semibold">
                {publications.map((pub) => (
                  <span key={pub} className="hover:text-[#A97C5B] transition-colors duration-300 relative group cursor-default">
                    {pub}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#A97C5B] group-hover:w-full transition-all duration-300" />
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Image Container - 5 cols */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn("left", 0.2)}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#e6e2d8] shadow-lg group">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
                alt="G. Venketram Portrait"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center grayscale-[30%] brightness-[0.95] contrast-[1.05] hover:grayscale-0 transition-all duration-1000 ease-out scale-100 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-[#A97C5B]/5 group-hover:bg-transparent transition-colors duration-1000 pointer-events-none" />
            </div>
            
            {/* Visual Decorative Box */}
            <div className="absolute -bottom-4 -left-4 -z-10 w-24 h-24 border-l border-b border-[#A97C5B]/30 rounded-bl-2xl hidden sm:block" />
            <div className="absolute -top-4 -right-4 -z-10 w-24 h-24 border-r border-t border-[#A97C5B]/30 rounded-tr-2xl hidden sm:block" />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
