"use client";

import React from "react";

// Portfolio Category Tabs Skeleton
export function PortfolioCategoryTabsSkeleton() {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-8 w-24 bg-[#e6e2d8]/70 rounded shrink-0"
        />
      ))}
    </div>
  );
}

// Portfolio Grid Skeleton Loader
export function PortfolioSkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-[#faf8f5] border border-[#e6e2d8] rounded-lg overflow-hidden flex flex-col justify-between"
        >
          {/* Image Thumbnail Skeleton */}
          <div className="h-56 w-full bg-[#e6e2d8]/60 relative flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#d8d3c5]/50" />
            <div className="absolute top-2 left-2 h-5 w-20 bg-[#d8d3c5] rounded" />
            <div className="absolute top-2 right-2 flex gap-1">
              <div className="w-7 h-7 bg-[#d8d3c5] rounded" />
              <div className="w-7 h-7 bg-[#d8d3c5] rounded" />
              <div className="w-7 h-7 bg-[#d8d3c5] rounded" />
            </div>
          </div>

          {/* Metadata Body Skeleton */}
          <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-[#e6e2d8] rounded" />
              <div className="h-3 w-full bg-[#e6e2d8]/70 rounded" />
              <div className="h-3 w-5/6 bg-[#e6e2d8]/50 rounded" />
            </div>

            {/* Category Select Skeleton */}
            <div className="space-y-1 pt-2 border-t border-[#e6e2d8]">
              <div className="h-2.5 w-20 bg-[#e6e2d8] rounded" />
              <div className="h-7 w-full bg-[#e6e2d8]/80 rounded" />
            </div>

            {/* Position Controls Skeleton */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1">
                <div className="h-3 w-8 bg-[#e6e2d8] rounded" />
                <div className="h-6 w-12 bg-[#e6e2d8] rounded" />
              </div>
              <div className="flex items-center gap-1">
                <div className="h-6 w-8 bg-[#e6e2d8] rounded" />
                <div className="h-6 w-6 bg-[#e6e2d8] rounded" />
                <div className="h-6 w-6 bg-[#e6e2d8] rounded" />
                <div className="h-6 w-8 bg-[#e6e2d8] rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Art Gallery Grid Skeleton Loader
export function ArtGallerySkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-[#faf8f5] border border-[#e6e2d8] rounded-lg overflow-hidden flex flex-col justify-between"
        >
          {/* Image Thumbnail Skeleton */}
          <div className="h-56 w-full bg-[#e6e2d8]/60 relative flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#d8d3c5]/50" />
            <div className="absolute top-2 left-2 h-5 w-16 bg-[#d8d3c5] rounded" />
            <div className="absolute top-2 right-2 flex gap-1">
              <div className="w-7 h-7 bg-[#d8d3c5] rounded" />
              <div className="w-7 h-7 bg-[#d8d3c5] rounded" />
            </div>
          </div>

          {/* Details Body Skeleton */}
          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="h-4 w-2/3 bg-[#e6e2d8] rounded" />
              <div className="h-3 w-full bg-[#e6e2d8]/70 rounded" />
              <div className="h-3 w-4/5 bg-[#e6e2d8]/50 rounded" />
            </div>

            {/* Price and Stock Skeleton */}
            <div className="flex items-center justify-between border-t border-[#e6e2d8] pt-3">
              <div className="h-5 w-16 bg-[#d8d3c5] rounded" />
              <div className="h-3 w-14 bg-[#e6e2d8] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Workshop Registrations Table Skeleton
export function RegistrationsTableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#faf8f5] p-6 rounded-xl border border-[#d8d3c5] flex items-center justify-between"
          >
            <div className="space-y-2 w-2/3">
              <div className="h-3 w-20 bg-[#e6e2d8] rounded" />
              <div className="h-7 w-28 bg-[#d8d3c5] rounded" />
            </div>
            <div className="w-12 h-12 bg-[#e6e2d8] rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-[#faf8f5] border border-[#d8d3c5] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#d8d3c5] flex items-center justify-between bg-[#E2DDD3]/40">
          <div className="space-y-2">
            <div className="h-5 w-48 bg-[#d8d3c5] rounded" />
            <div className="h-3 w-64 bg-[#e6e2d8] rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-44 bg-[#e6e2d8] rounded" />
            <div className="h-8 w-24 bg-[#e6e2d8] rounded" />
          </div>
        </div>

        <div className="p-4 space-y-3">
          {Array.from({ length: rows }).map((_, rIdx) => (
            <div
              key={rIdx}
              className="flex items-center justify-between py-3 px-4 bg-white/60 rounded border border-[#e6e2d8]/60 gap-4"
            >
              <div className="h-4 w-28 bg-[#d8d3c5] rounded" />
              <div className="h-4 w-36 bg-[#e6e2d8] rounded" />
              <div className="h-4 w-40 bg-[#e6e2d8]/70 rounded" />
              <div className="h-4 w-12 bg-[#d8d3c5] rounded" />
              <div className="h-5 w-20 bg-[#d8d3c5] rounded" />
              <div className="h-6 w-24 bg-[#e6e2d8] rounded" />
              <div className="flex gap-1">
                <div className="w-7 h-7 bg-[#d8d3c5] rounded" />
                <div className="w-7 h-7 bg-[#d8d3c5] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
