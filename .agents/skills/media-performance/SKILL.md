---
name: media-performance
description: High-resolution media optimization, browser memory management, and responsive image performance workflows for photography portfolios.
---

# Media Performance & Memory Guard Skill

## Purpose
Ensure fluid 60fps scrolling, minimal bandwidth consumption, and safe browser memory usage when displaying or processing hundreds of high-resolution photographs.

## Workflows

### 1. In-Browser Decoder Memory Management
* Monitor `src/lib/clientUpload.js` for canvas context disposal and typed array lifecycle.
* Ensure `URL.revokeObjectURL()` is called promptly after image loads.
* Prevent DOM canvas element retention during bulk uploads (especially with 100MB+ TIFF files).

### 2. Gallery Delivery & Layout Shift
* Audit `next/image` components across masonry collections (`react-photo-album`) and lightbox views.
* Verify `sizes` attributes accurately reflect column breakpoints so mobile devices do not load desktop resolutions.
* Guard against layout shift (CLS) by preserving intrinsic width/height aspect ratios.

### 3. Cache & Preload Optimization
* Verify browser caching headers for WebP images served from Supabase CDN.
* Ensure above-the-fold hero images use `priority={true}` while below-the-fold gallery images use lazy loading.
