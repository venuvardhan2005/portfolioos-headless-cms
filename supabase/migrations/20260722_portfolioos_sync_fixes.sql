-- ========================================================
-- Database Schema Expansion for Syncing All Settings
-- Created: 2026-07-22
-- Description: Add all remaining settings columns to profiles and social_links
-- ========================================================

-- Expand profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hero_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hero_subtitle TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS about_me TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS availability_status BOOLEAN DEFAULT TRUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS og_image_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS favicon_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS default_theme TEXT DEFAULT 'dark';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#6366f1';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS animations_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reduced_motion BOOLEAN DEFAULT FALSE;

-- Expand social_links table
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS twitter TEXT;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS youtube TEXT;
ALTER TABLE public.social_links ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
