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

  const hasTitle = (titlePrefix + titleHighlight).trim();
  const hasSubtitle = subtitle.trim();
  const hasHeader = hasTitle || hasSubtitle;
  const hasTextContent =
    hasHeader ||
    bioParagraph1.trim() ||
    quote.trim() ||
    bioParagraph2.trim() ||
    publications.length > 0;
  const hasImage = imageUrl.trim();

  // Split multi-paragraph text cleanly so every paragraph has proper typographic rhythm
  const bio1Paragraphs = bioParagraph1
    ? bioParagraph1
        .split(/\n\s*\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  const bio2Paragraphs = bioParagraph2
    ? bioParagraph2
        .split(/\n\s*\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-4 sm:px-6 lg:px-8 py-20 text-[#1c1a17]">
      <div className="mx-auto max-w-7xl">
        <div
          className={`grid grid-cols-1 ${
            hasTextContent && hasImage ? "lg:grid-cols-12" : ""
          } gap-12 lg:gap-16 items-start`}
        >
          {/* Left Text Content - 7 cols */}
          {hasTextContent && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeIn("up", 0.1)}
              className={
                hasImage
                  ? "lg:col-span-7 space-y-10"
                  : "lg:col-span-12 max-w-3xl mx-auto space-y-10"
              }
            >
              {/* Header */}
              {hasHeader && (
                <div className="border-b border-[#e6e2d8] pb-6">
                  {hasSubtitle && (
                    <span className="text-xs uppercase tracking-[0.3em] text-[#A97C5B] font-semibold mb-2 block">
                      {subtitle}
                    </span>
                  )}
                  {hasTitle && (
                    <h1
                      className="text-4xl sm:text-5xl lg:text-6xl font-brand font-normal uppercase tracking-widest leading-tight"
                      style={{ color: "#A97C5B" }}
                    >
                      {titlePrefix && <span>{titlePrefix} </span>}
                      {titleHighlight}
                    </h1>
                  )}
                </div>
              )}

              {/* Bio Part 1: Opening & Career Background */}
              {bio1Paragraphs.length > 0 && (
                <div className="space-y-6">
                  {/* Lead opening paragraph */}
                  <p className="text-[14px] leading-relaxed text-[#1c1a17] font-light">
                    {bio1Paragraphs[0]}
                  </p>

                  {/* Remaining background paragraphs */}
                  {bio1Paragraphs.slice(1).map((para, idx) => (
                    <p
                      key={`bio1-${idx}`}
                      className="text-[14px] leading-relaxed text-neutral-600 font-light"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Editorial Quote Block */}
              {quote.trim() && (
                <div className="relative my-8 p-6 sm:p-7 rounded-2xl bg-[#faf8f5] border border-[#e6e2d8] shadow-sm">
                  <div className="absolute top-2 left-4 text-4xl text-[#A97C5B]/25 font-serif select-none pointer-events-none">
                    &ldquo;
                  </div>
                  <blockquote className="relative font-serif italic text-base sm:text-lg text-[#1c1a17] leading-relaxed font-light pl-6 border-l-2 border-[#A97C5B]">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                </div>
              )}

              {/* Bio Part 2: Exhibitions, Calendars & Fine Art Work */}
              {bio2Paragraphs.length > 0 && (
                <div className="space-y-6">
                  {bio2Paragraphs.map((para, idx) => (
                    <p
                      key={`bio2-${idx}`}
                      className="text-[14px] leading-relaxed text-neutral-600 font-light"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Select Clients & Publications Section */}
              {publications.length > 0 && (
                <div className="pt-8 mt-12 border-t border-[#e6e2d8]">
                  {publicationsTitle.trim() && (
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="text-xs uppercase tracking-[0.25em] text-[#A97C5B] font-semibold">
                        {publicationsTitle}
                      </h3>
                      <span className="h-[1px] flex-1 bg-[#e6e2d8]" />
                    </div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {publications.map((pub, idx) => (
                      <div
                        key={`${pub}-${idx}`}
                        className="px-4 py-3 rounded-lg bg-[#faf8f5] border border-[#e6e2d8] text-xs uppercase tracking-[0.18em] text-neutral-700 font-medium hover:border-[#A97C5B] hover:text-[#A97C5B] transition-all duration-300 flex items-center justify-between group"
                      >
                        <span>{pub}</span>
                        <span className="text-[10px] text-neutral-400 group-hover:text-[#A97C5B] transition-colors">
                          ✦
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Right Image Container - 5 cols (Sticky on desktop to anchor the long story) */}
          {hasImage && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeIn("left", 0.2)}
              className={
                hasTextContent
                  ? "lg:col-span-5 relative lg:sticky lg:top-28 self-start space-y-4"
                  : "lg:col-span-12 max-w-lg mx-auto relative space-y-4"
              }
            >
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#e6e2d8] shadow-lg group bg-[#faf8f5]">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center grayscale-[20%] brightness-[0.98] contrast-[1.03] hover:grayscale-0 transition-all duration-1000 ease-out scale-100 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[#A97C5B]/5 group-hover:bg-transparent transition-colors duration-1000 pointer-events-none" />
              </div>

              {/* Minimalist Photographer Caption Plate */}
              <div className="px-3.5 py-2.5 rounded-lg bg-[#faf8f5] border border-[#e6e2d8] flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-medium">
                <span>{imageAlt || "Portrait"}</span>
                <span className="text-[#A97C5B]">Studio GVR</span>
              </div>

              {/* Visual Decorative Accent Corners */}
              <div className="absolute -bottom-4 -left-4 -z-10 w-24 h-24 border-l border-b border-[#A97C5B]/30 rounded-bl-2xl hidden sm:block" />
              <div className="absolute -top-4 -right-4 -z-10 w-24 h-24 border-r border-t border-[#A97C5B]/30 rounded-tr-2xl hidden sm:block" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
