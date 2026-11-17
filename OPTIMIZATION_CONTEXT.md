# Session Context: Supabase Cached Egress Optimization & Cloudinary Failover

**Project:** G. Venketram Photography (`/Users/jhansi/Desktop/gvenketram`)  
**Tech Stack:** Next.js 16.2.10 (App Router, Turbopack), React 19.2.4, Supabase (`@supabase/supabase-js`), Cloudinary, Vercel  
**Date:** November 2026  

---

## 1. Problem Summary & Root Causes

The Supabase Free Plan project hit its **5 GB Cached Egress quota** (`5.956 / 5 GB`, resulting in HTTP `402` / `EXCEED_CACHED_EGRESS_QUOTA` restrictions).

An inspection of the codebase identified four root causes:
1. **Forced Dynamic Rendering on Public Routes**:
   - `src/app/page.jsx`, `src/app/portfolio/[category]/page.jsx`, `src/app/about/page.jsx`, and `src/app/contact/page.jsx` exported `dynamic = "force-dynamic"` and `revalidate = 0`.
   - `src/app/layout.js` and `src/app/page.jsx` called `await headers()` at the top level to check the hostname for `ProductionHostGuard`, forcing every route to render dynamically on every request.
2. **Uncached Server Data Functions**:
   - `getPortfolioData.js`, `getMainImages.js`, `getAboutData.js`, and `getContactData.js` queried Supabase directly on every page render with no server-side cache.
3. **Uncached Client-Triggered API Queries on Every Page Load**:
   - `SettingsContext.jsx` (mounted in `RootLayout` for every visitor) called `GET /api/settings`, which executed an uncached `select("*")` on `site_settings`.
   - `src/app/art-gallery/page.jsx` and `src/app/art-gallery/[id]/page.jsx` called `GET /api/artworks` on every mount, which executed an uncached `select("*")` on `art_gallery`.
4. **Unnecessary `select("*")` Queries & Empty Fallbacks**:
   - Database queries across `portfolio_images`, `main_images`, `art_gallery`, and `site_settings` used `select("*")` instead of selecting specific columns.
   - When Supabase failed or was restricted (`402`), `getPortfolioData()` fell back to empty `images: []` arrays instead of serving existing Cloudinary image records.

---

## 2. Architecture & Caching Strategy Implemented

### A. Next.js 16 Cache Components (`"use cache"`)
- Enabled `cacheComponents: true` in `next.config.mjs`.
- Added `"use cache"` with `cacheLife("hours")` (`1h` revalidate, `1d` expire) and granular `cacheTag(...)` tags to all public server data-fetching functions:
  - `portfolio-categories` — `getPortfolioCategories()` in `src/lib/getPortfolioData.js`
  - `portfolio-images` & `portfolio-category-<category>` — `getPortfolioData()` and `getPortfolioImages(category)` in `src/lib/getPortfolioData.js`
  - `main-images` — `getMainImages(onlyActive)` in `src/lib/getMainImages.js`
  - `artworks` — `getArtworksData()` in `src/lib/getArtworksData.js` (used by `GET /api/artworks`)
  - `about-data` & `site-settings` — `getAboutData()` in `src/lib/getAboutData.js`
  - `contact-data` & `site-settings` — `getContactData()` in `src/lib/getContactData.js`
  - `site-settings` — `getSiteSettings()` in `src/lib/getSiteSettings.js` (used by `GET /api/settings`)

### B. Static Prerendering & Hydration Fixes
- Removed `dynamic = "force-dynamic"` and `revalidate = 0` from:
  - `src/app/page.jsx`
  - `src/app/portfolio/[category]/page.jsx`
  - `src/app/about/page.jsx`
  - `src/app/contact/page.jsx`
- Removed top-level `await headers()` from `src/app/layout.js` and `src/app/page.jsx`. `ProductionHostGuard.jsx` now checks `window.location.hostname` on the client and is wrapped in `<Suspense fallback={null}>` in `RootLayout`.
- Fixed hydration mismatch in `src/components/Navbar.jsx` (Shopping Cart icon now checks `isLoaded && isArtGalleryEnabled`) and `src/components/Footer.jsx` (middle links check `isLoaded` and copyright year is static).

### C. Query Column Optimization (Replaced `select("*")`)
- `categories`: `name, display_order`
- `portfolio_images` (`PORTFOLIO_IMAGE_COLUMNS`): `id, src, width, height, title, description, category_name, display_order`
- `main_images` (`MAIN_IMAGE_COLUMNS`): `id, src, title, alt, display_order, is_active`
- `art_gallery` (`ARTWORK_COLUMNS`): `id, title, short_description, description, image, width, height, price, type, category, availability, quantity, year, dimensions, display_order, options, specs`
- `site_settings`: `settings`

### D. Immediate Admin Cache Invalidation
All admin write endpoints (`POST`, `PATCH`, `DELETE`) now call `revalidateTag(tag, { expire: 0 })` and `revalidatePath(...)` so public pages update immediately after admin changes while admin `GET` endpoints (`/api/portfolio`, `/api/main-images`) never serve stale cached data:
- `src/app/api/portfolio/route.js` & `src/app/api/portfolio/[id]/route.js` -> invalidates `portfolio-images`, `portfolio-categories`, `portfolio-category-<cat>`, and `/`.
- `src/app/api/main-images/route.js` -> invalidates `main-images` and `/`.
- `src/app/api/artworks/route.js` & `src/app/api/artworks/seed/route.js` -> invalidates `artworks`, `/art-gallery`, `/art-gallery/[id]`, and `/admin`.
- `src/app/api/about/route.js` -> invalidates `about-data`, `site-settings`, `/about`, and `/admin`.
- `src/app/api/contact/route.js` -> invalidates `contact-data`, `site-settings`, `/contact`, and `/admin`.
- `src/app/api/settings/route.js` -> preserves existing `about`/`contact` keys in `site_settings.settings` before upserting, and invalidates `site-settings`, `/`, and `/admin`.

### E. 100% Cloudinary Automatic Failover (`src/data/cloudinaryFallback.json`)
- Generated `src/data/cloudinaryFallback.json` containing all **740 portfolio images**, **10 categories**, **6 hero images**, **24 artworks**, and **site settings** mapped to live `res.cloudinary.com` URLs (`0` `supabase.co/storage` URLs).
- Wired `getPortfolioData.js`, `getMainImages.js`, `getArtworksData.js`, `getSiteSettings.js`, `/api/portfolio`, and `/api/main-images` to automatically serve from `cloudinaryFallback.json` (and `src/data/mainImages.json` for hero images) whenever Supabase is unreachable, paused, or returns a `402` quota error.

### F. Friendly Quota Error Formatting in Admin
- Added `formatSupabaseError()` in `src/lib/supabase.js` and updated `src/app/api/portfolio/route.js`, `src/app/api/portfolio/[id]/route.js`, `src/app/admin/page.jsx`, and `src/components/admin/EditPortfolioImageModal.jsx` so any Supabase `EXCEED_CACHED_EGRESS_QUOTA` / restriction error displays `"superbase limit reached. kindly check"`.

---

## 3. Complete List of Modified & Created Files

### Created
- `src/lib/getArtworksData.js`
- `src/lib/getSiteSettings.js`
- `src/data/cloudinaryFallback.json`
- `OPTIMIZATION_CONTEXT.md` (this file)

### Modified
- `next.config.mjs`
- `src/lib/supabase.js`
- `src/lib/getPortfolioData.js`
- `src/lib/getMainImages.js`
- `src/lib/getAboutData.js`
- `src/lib/getContactData.js`
- `src/app/layout.js`
- `src/app/page.jsx`
- `src/app/about/page.jsx`
- `src/app/contact/page.jsx`
- `src/app/portfolio/[category]/page.jsx`
- `src/app/admin/page.jsx`
- `src/components/Navbar.jsx`
- `src/components/Footer.jsx`
- `src/components/ProductionHostGuard.jsx`
- `src/components/admin/EditPortfolioImageModal.jsx`
- `src/app/api/portfolio/route.js`
- `src/app/api/portfolio/[id]/route.js`
- `src/app/api/main-images/route.js`
- `src/app/api/artworks/route.js`
- `src/app/api/artworks/seed/route.js`
- `src/app/api/about/route.js`
- `src/app/api/contact/route.js`
- `src/app/api/settings/route.js`

---

## 4. Current Live Status & Next Steps (Verified Nov 17, 2026)

1. **Live Supabase Verification & Sync (Completed)**:
   - Supabase is back online and responding with `200 OK` across all tables (`categories`: 10, `portfolio_images`: 740, `main_images`: 6, `art_gallery`: 24, `site_settings`: 1).
   - **Zero Supabase Storage Egress**: `0` rows across the entire database reference `supabase.co/storage`, and the `portfolio-images` and `artworks` storage buckets have `0` remaining files. All 740 portfolio images and 24 artworks point directly to `res.cloudinary.com`.
   - Ran `npm run backup:db` and synced `backups/latest_backup.json`, `src/data/cloudinaryFallback.json`, and `src/data/mainImages.json` with the latest live database state (including the 4 newly added portfolio images and 2 new Cloudinary hero images).
2. **Deploy to Production**:
   - Commit all modified files and push to GitHub/Vercel so production uses the cached routes and updated Cloudinary fallback.
