"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/animations";

export default function AboutContent({ initialData }) {
  const data = initialData || {};

  const subtitle = data.subtitle || "";
  const titlePrefix = data.titlePrefix || "";
  const titleHighlight = data.titleHighlight || "";
  const bioParagraph1 = data.bioParagraph1 || "";
  const quote = data.quote || "";
  const bioParagraph2 = data.bioParagraph2 || "";
  const publicationsTitle = data.publicationsTitle || "";
  const publications = Array.isArray(data.publications) ? data.publications : [];
  const imageUrl = data.imageUrl || "";
  const imageAlt = data.imageAlt || "Portrait";

  const hasTitle = titlePrefix.trim() || titleHighlight.trim();
  const hasSubtitle = subtitle.trim();
  const hasHeader = hasTitle || hasSubtitle;
  const hasTextContent = hasHeader || bioParagraph1.trim() || quote.trim() || bioParagraph2.trim() || publications.length > 0;
  const hasImage = imageUrl.trim();

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-4 sm:px-6 lg:px-8 py-20 text-[#1c1a17]">
      <div className="mx-auto max-w-7xl">
        <div className={`grid grid-cols-1 ${hasTextContent && hasImage ? "lg:grid-cols-12" : ""} gap-16 items-start`}>
          
          {/* Left Text Content - 7 cols */}
          {hasTextContent && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeIn("up", 0.1)}
              className={hasImage ? "lg:col-span-7 space-y-8" : "lg:col-span-12 max-w-3xl mx-auto space-y-8"}
            >
              {hasHeader && (
                <div>
                  {hasSubtitle && (
                    <span className="text-xs uppercase tracking-[0.3em] text-[#A97C5B] font-semibold mb-2 block">
                      {subtitle}
                    </span>
                  )}
                  {hasTitle && (
                    <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-[#1c1a17] leading-tight font-serif">
                      {titlePrefix}{titlePrefix.trim() && titleHighlight.trim() ? " " : ""}
                      {titleHighlight.trim() && (
                        <span className="font-semibold text-[#A97C5B] font-serif italic">
                          {titleHighlight}
                        </span>
                      )}
                    </h1>
                  )}
                </div>
              )}

              {bioParagraph1.trim() && (
                <p className="text-sm sm:text-base leading-relaxed text-neutral-600 font-light whitespace-pre-line">
                  {bioParagraph1}
                </p>
              )}

              {/* Premium Quote Block */}
              {quote.trim() && (
                <div className="py-6 px-8 border-l-2 border-[#A97C5B] bg-[#faf8f5] my-6">
                  <p className="font-serif italic text-lg sm:text-xl text-neutral-700 leading-relaxed font-light whitespace-pre-line">
                    &ldquo;{quote}&rdquo;
                  </p>
                </div>
              )}

              {bioParagraph2.trim() && (
                <p className="text-sm sm:text-base leading-relaxed text-neutral-600 font-light whitespace-pre-line">
                  {bioParagraph2}
                </p>
              )}

              {/* Publications */}
              {publications.length > 0 && (
                <div className="space-y-4">
                  {publicationsTitle.trim() && (
                    <h3 className="text-xs uppercase tracking-[0.25em] text-[#A97C5B] font-semibold">
                      {publicationsTitle}
                    </h3>
                  )}
                  <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs uppercase tracking-widest text-neutral-600 font-semibold">
                    {publications.map((pub, idx) => (
                      <span
                        key={`${pub}-${idx}`}
                        className="hover:text-[#A97C5B] transition-colors duration-300 relative group cursor-default"
                      >
                        {pub}
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#A97C5B] group-hover:w-full transition-all duration-300" />
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Right Image Container - 5 cols */}
          {hasImage && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeIn("left", 0.2)}
              className={hasTextContent ? "lg:col-span-5 relative" : "lg:col-span-12 max-w-lg mx-auto relative"}
            >
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#e6e2d8] shadow-lg group">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
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
          )}

        </div>
      </div>
    </div>
  );
}
