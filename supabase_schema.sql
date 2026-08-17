-- ===================================================
-- G VENKET RAM PHOTOGRAPHY - SUPABASE DATABASE SCHEMA
-- ===================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor)

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create portfolio_images table
CREATE TABLE IF NOT EXISTS portfolio_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name TEXT NOT NULL,
  src TEXT NOT NULL,
  width INT DEFAULT 1600,
  height INT DEFAULT 1200,
  title TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Enable Row Level Security (RLS) on tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;

-- 4. Create public read/write access policies (for development & admin usage)
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on categories" ON categories FOR ALL USING (true);

CREATE POLICY "Allow public read access on portfolio_images" ON portfolio_images FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on portfolio_images" ON portfolio_images FOR ALL USING (true);

-- 5. Create storage bucket for uploaded portfolio images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage bucket policies for public access
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
CREATE POLICY "Public Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images');
CREATE POLICY "Public Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-images');
