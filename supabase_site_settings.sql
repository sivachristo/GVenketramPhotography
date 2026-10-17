-- ===================================================
-- SITE SETTINGS & ABOUT SECTION SUPABASE SCHEMA SCRIPT
-- ===================================================
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- to enable live database persistence for the dynamic About section
-- and site visibility settings on your live production website.

-- 1. Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 3. Public read access policy
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings" 
ON public.site_settings FOR SELECT 
USING (true);

-- 4. Public insert/update access policy (for Admin API usage)
DROP POLICY IF EXISTS "Allow all for authenticated/anon users on site_settings" ON public.site_settings;
CREATE POLICY "Allow all for authenticated/anon users on site_settings" 
ON public.site_settings FOR ALL 
USING (true)
WITH CHECK (true);

-- 5. Insert initial record with default About data and module visibility
INSERT INTO public.site_settings (id, settings)
VALUES (
  1,
  '{
    "visibility": {
      "artGallery": true,
      "workshop": true
    },
    "about": {
      "subtitle": "The Artist Behind the Lens",
      "titlePrefix": "G.",
      "titleHighlight": "Venketram",
      "bioParagraph1": "G. Venketram is an internationally acclaimed fashion photographer and visual director based in Chennai, India. With a signature style characterized by cinematic lighting, precise geometry, and profound emotional intensity, he has spent over a decade redefining the visual language of modern editorial and luxury advertising.",
      "quote": "Photography is the silent dialogue between light, subject, and shadow. My goal is to capture the unseen poise that resides in the briefest transition of moments.",
      "bioParagraph2": "Born with an innate fascination for shadows and human expression, he studied fine art and visual composition before establishing his production studio. His work bridges the divide between commercial high-fashion campaigns and raw documentary art, seeking to isolate fleeting moments of pure poise and transition.",
      "publicationsTitle": "Select Clients & Publications",
      "publications": [
        "Vogue Italia",
        "Harper''s Bazaar",
        "GQ Magazine",
        "Vanity Fair",
        "The New York Times",
        "AD Magazine"
      ],
      "imageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
      "imageAlt": "G. Venketram Portrait"
    }
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = NOW();
