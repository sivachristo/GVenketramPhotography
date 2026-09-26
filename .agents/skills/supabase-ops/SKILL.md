---
name: supabase-ops
description: Safe database and storage hygiene workflows for Supabase, including storage quota audits, orphan binary detection, and RLS policy verification.
---

# Supabase Operations & Storage Hygiene Skill

## Purpose
Provide safe, non-destructive workflows for managing Supabase database tables and storage buckets in this portfolio repository without risking live data.

## Workflows

### 1. Storage Quota & File Audit
* List objects in `portfolio-images` bucket.
* Compare storage object URLs against active database rows in `portfolio_images` and `art_gallery`.
* Identify orphaned binaries (files that exist in storage but are no longer referenced in the database).
* Report storage usage by folder and format without deleting anything automatically.

### 2. Orphan Cleanup Protocol (Safe Mode)
* Always output a dry-run list of orphaned files before deletion.
* Ensure files actively displayed in the gallery or referenced in JSON fallbacks are never deleted.
* Require explicit user confirmation before executing `supabase.storage.from('portfolio-images').remove([...])`.

### 3. Row-Level Security (RLS) & Access Audit
* Verify that tables (`portfolio_images`, `art_gallery`, `categories`, `settings`) allow public `SELECT` for site visitors.
* Verify that destructive operations (`INSERT`, `UPDATE`, `DELETE`) require authenticated admin credentials or service role.
* Confirm that `NEXT_PUBLIC_SUPABASE_ANON_KEY` cannot drop tables or access admin endpoints directly.
