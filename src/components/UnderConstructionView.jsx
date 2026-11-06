"use client";

import Image from "next/image";
import { useState } from "react";

export default function UnderConstructionView() {
  const [hasCustomImage, setHasCustomImage] = useState(true);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#141210]">
      {/* Clean solid dark background without any background photos */}
      <div className="absolute inset-0 bg-radial from-[#1e1c19] via-[#141210] to-[#0a0908]" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-xl select-none">
        {/* Studio Name */}
        <p
          className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[#C49B76] mb-6 font-medium"
          style={{ letterSpacing: "0.35em" }}
        >
          G Venket Ram Photography
        </p>

        {/* Custom Image (if /public/under-construction.jpg is provided) */}
        {hasCustomImage && (
          <div className="relative w-full max-w-md h-64 sm:h-80 mb-6">
            <Image
              src="/under-construction.jpg"
              alt="Under Construction"
              fill
              priority
              quality={95}
              className="object-contain"
              onError={() => setHasCustomImage(false)}
            />
          </div>
        )}

        {/* Clean Editorial Title */}
        {!hasCustomImage && (
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#f5f2eb] tracking-tight mb-6">
            Under Construction
          </h1>
        )}

        {/* Curated Experience Note */}
        <p className="font-sans text-sm sm:text-base text-[#f5f2eb]/75 tracking-wider font-light max-w-md leading-relaxed">
          We are curating a refined digital experience.
          <br className="hidden sm:block" />
          Our new online portfolio will unveil shortly.
        </p>

        {/* Minimal Accent Divider */}
        <div className="mt-8 flex items-center gap-3">
          <div className="h-px w-10 bg-[#A97C5B]/40" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#C49B76]" />
          <div className="h-px w-10 bg-[#A97C5B]/40" />
        </div>
      </div>
    </div>
  );
}
