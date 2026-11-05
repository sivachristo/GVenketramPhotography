import Image from "next/image";
import fs from "fs";
import path from "path";

export const metadata = {
  title: "Coming Soon | G Venket Ram Photography",
  description:
    "We are working on something beautiful. G Venket Ram Photography — check back soon.",
};

export default function UnderConstructionPage() {
  // Check if user has uploaded a custom /public/under-construction.jpg
  const customImagePath = path.join(process.cwd(), "public", "under-construction.jpg");
  const hasCustomImage = fs.existsSync(customImagePath);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#141210]">
      {/* Background Media */}
      {hasCustomImage ? (
        <Image
          src="/under-construction.jpg"
          alt="G Venket Ram Photography — Coming Soon"
          fill
          priority
          quality={95}
          className="object-cover object-center select-none pointer-events-none"
          sizes="100vw"
        />
      ) : (
        <>
          {/* Elegant fallback studio backdrop */}
          <div className="absolute inset-0 bg-radial from-[#2a241e] via-[#171513] to-[#0d0c0b] opacity-90" />
          <Image
            src="/fashion_portrait_hero.png"
            alt="G Venket Ram Photography Studio"
            fill
            priority
            quality={90}
            className="object-cover object-center opacity-30 select-none pointer-events-none filter grayscale contrast-125 scale-105"
            sizes="100vw"
          />
        </>
      )}

      {/* Dark luxury vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#141210]/70 via-[#141210]/50 to-[#141210]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#141210_90%)]" />

      {/* Branded editorial content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-2xl">
        {/* Studio Name Monogram / Subtitle */}
        <p
          className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[#C49B76] mb-6 select-none font-medium"
          style={{ letterSpacing: "0.35em" }}
        >
          G Venket Ram Photography
        </p>

        {/* Main Serif Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#f5f2eb] leading-[1.15] tracking-tight mb-6 drop-shadow-lg">
          Something beautiful <br />
          <span className="italic font-light text-[#E2DDD3]">is on its way.</span>
        </h1>

        {/* Description */}
        <p className="font-sans text-sm sm:text-base text-[#f5f2eb]/75 tracking-wider font-light max-w-md drop-shadow leading-relaxed">
          We are curating a refined digital experience.
          <br className="hidden sm:block" />
          Our new online portfolio will unveil shortly.
        </p>

        {/* Refined Divider */}
        <div className="mt-8 flex items-center gap-3">
          <div className="h-px w-12 bg-[#A97C5B]/40" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#C49B76]" />
          <div className="h-px w-12 bg-[#A97C5B]/40" />
        </div>

        {/* Direct contact hint */}
        <p className="mt-8 font-sans text-xs text-[#f5f2eb]/50 tracking-[0.2em] uppercase font-light">
          Chennai &bull; Worldwide Assignments
        </p>
      </div>
    </div>
  );
}
