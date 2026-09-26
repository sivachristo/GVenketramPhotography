---
name: thermo-review
description: Run an exhaustive, evidence-based code quality, security, performance, architecture, and edge-case audit tailored for this Next.js 16, Supabase, and high-resolution photography portfolio.
---

# Thermo-Nuclear Code Quality Review

## Purpose

Perform an uncompromising, evidence-driven code quality, architecture, security, and performance review of this repository. Assume the goal is to discover edge cases, security vulnerabilities, memory bottlenecks, and architectural regressions that would survive a normal code review.

Do not merely comment on cosmetic formatting. Investigate correctness, runtime type safety, database boundaries, media pipeline resilience, and developer experience.

## Review Principles

1. **Evidence-Driven**: Never report a problem without citing specific file paths, line ranges, and reproduction scenarios.
2. **Prioritize Real Production Failure Modes**: Pay special attention to Vercel Serverless limits (e.g. 4.5 MB request body limit, function timeouts), browser memory consumption (e.g. 100MB+ TIFF canvas decoding), and Supabase quota/RLS leaks.
3. **Respect Intended Architecture**: Differentiate between deliberate design choices and actual bugs.

---

## Tailored Review Focus Areas

### 1. Next.js 16 & React 19 Architecture
* **Async Request APIs**: Verify dynamic route parameters (`params` and `searchParams` in App Router) are properly awaited per Next.js 15/16 specifications.
* **Component Boundaries**: Audit `"use client"` directives. Ensure server components are utilized wherever client-side interactivity is unnecessary to minimize client bundle size.
* **Hydration Safety**: Check for SSR / client hydration mismatches, especially in components consuming `localStorage` (such as `SettingsContext`, theme, or cart state).
* **Caching & Revalidation**: Verify `revalidatePath` and route cache tags are properly applied when updating portfolio images, artworks, or visibility toggles.

### 2. High-Resolution Media & Canvas Performance
* **In-Browser Compression Pipeline**: Inspect `src/lib/clientUpload.js` for memory management when decoding heavy files (100MB+ TIFFs or RAW exports). Ensure canvas contexts, object URLs (`URL.revokeObjectURL`), and typed array buffers are aggressively garbage-collected.
* **Image Delivery**: Verify `next/image` usage, responsive `sizes`, aspect ratios, and format fallback chains (`webp`, `avif`).
* **Storage Quota & Orphan Prevention**: Ensure deleted portfolio or artwork items also delete their corresponding Supabase Storage binaries so storage quotas do not balloon.

### 3. Supabase Database & Security
* **Row-Level Security (RLS)**: Verify public read vs admin write policies on `portfolio_images`, `art_gallery`, `categories`, and `settings`.
* **API Key Exposure**: Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is never granted service-role privileges, and backend administration routes validate admin sessions.
* **Data Integrity**: Validate foreign key constraints, order index handling (`display_order`), and upsert uniqueness across categories.

### 4. E-Commerce & Checkout Integrity (Art Gallery & Workshops)
* **Cart Calculations**: Verify price calculations, quantity bounds, and currency formatting cannot be manipulated via client-side state alone.
* **Stock & Availability**: Check behavior when items are marked "Out of Stock" or limited edition runs are exceeded.
* **Contact & Inquiries**: Validate EmailJS / email inquiry forms against spam, missing fields, and silent transmission failures.

### 5. Runtime Data Safety & Edge Cases
* **Null / Undefined Handling**: Verify defensive checks on image arrays, category lists, query parameters, and API response envelopes.
* **Type Coercion**: Guard against string vs numeric ID mismatches and NaN values when parsing dimensions, price, or ordering.
* **Error Resilience**: Verify API errors return appropriate HTTP status codes and user-friendly error banners rather than blank screens or silent console errors.

---

## Review Procedure

1. **Understand Execution Paths**: Trace frontend UI (`components/admin`, `app/`) → API routes (`app/api/`) → Supabase Database/Storage.
2. **Scan Security Boundaries**: Inspect credential usage, route authorization, and payload limits.
3. **Search for Duplication & Fragility**: Look for repeated logic between modals, mismatched category names, or unhandled promise rejections.
4. **Inspect State Management**: Trace context providers (`SettingsContext`, Cart context) and local storage syncing.
5. **Verify Real Code**: Cross-reference every suspected issue with active files in the workspace.

---

## Severity Classification

* **[CRITICAL]**: Security vulnerability, data loss risk, payment/pricing integrity breach, or production-crashing defect.
* **[HIGH]**: Significant correctness bug, memory leak on heavy image upload, or breaking API contract under specific inputs.
* **[MEDIUM]**: Maintainability debt, inefficient database queries, unnecessary re-renders, or missing error boundary.
* **[LOW]**: Minor edge-case quirk or optimization opportunity with limited immediate impact.
* **[INFO]**: Architectural observation or proactive suggestion.

---

## Finding Format

For each issue found:

**[SEVERITY] Short Descriptive Title**
* **Location:** `[Filename:Line](file:///absolute/path/to/file#Lxx-Lyy)`
* **Problem:** Clear, exact explanation of the defect.
* **Why it matters:** Concrete impact in production.
* **Evidence:** Code excerpt and reproduction logic.
* **Recommendation:** Exact, drop-in fix.
* **Confidence:** High / Medium / Low
