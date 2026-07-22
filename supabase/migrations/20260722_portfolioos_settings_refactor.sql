-- ========================================================
-- PortfolioOS Settings Table Refactor Migration
-- Created: 2026-07-22
-- Description: Create the centralized settings table and insert seed data
-- ========================================================

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT,
    role TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    about_me TEXT,
    avatar_url TEXT,
    availability_status BOOLEAN DEFAULT TRUE,
    email TEXT,
    phone TEXT,
    location TEXT,
    github TEXT,
    linkedin TEXT,
    instagram TEXT,
    twitter TEXT,
    youtube TEXT,
    leetcode TEXT,
    hackerrank TEXT,
    portfolio_url TEXT,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    og_image_url TEXT,
    favicon_url TEXT,
    default_theme TEXT DEFAULT 'dark',
    accent_color TEXT DEFAULT '#6366f1',
    animations_enabled BOOLEAN DEFAULT TRUE,
    reduced_motion BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies
DROP POLICY IF EXISTS "Public settings read access" ON public.settings;
CREATE POLICY "Public settings read access" ON public.settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;
CREATE POLICY "Admins can manage settings" ON public.settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert original default seed settings
INSERT INTO public.settings (
    id,
    full_name,
    role,
    hero_title,
    hero_subtitle,
    about_me,
    avatar_url,
    availability_status,
    email,
    phone,
    location,
    github,
    linkedin,
    instagram,
    twitter,
    youtube,
    leetcode,
    hackerrank,
    portfolio_url,
    seo_title,
    seo_description,
    seo_keywords,
    og_image_url,
    favicon_url,
    default_theme,
    accent_color,
    animations_enabled,
    reduced_motion
)
VALUES (
    'bb27c5d0-9943-4ccb-a459-fde359b39d77',
    'P VENU VARDHAN SHETTY',
    'Full Stack React Developer & AI Practitioner',
    'Architecting High-Performance Web Applications & AI Tools',
    'Full Stack Developer proficient in React, TypeScript, Python, Node.js, and Supabase.',
    'Computer Science & Engineering undergraduate passionate about building scalable, high-performance web applications and AI-driven products.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    TRUE,
    'venuvardhan2005@gmail.com',
    '+91 9876543210',
    'Ballari, Karnataka, India',
    'https://github.com/venuvardhan2005',
    'https://linkedin.com/in/p-venu-vardhan-shetty',
    'https://instagram.com',
    'https://x.com',
    'https://youtube.com',
    'https://leetcode.com/venuvardhan',
    'https://hackerrank.com/venuvardhan',
    'https://portfolio-os.vercel.app',
    'P Venu Vardhan Shetty | Full Stack React Developer & PortfolioOS',
    'Official Portfolio of P Venu Vardhan Shetty. Full Stack React Developer building modern Web Applications.',
    'React, TypeScript, Portfolio, Full Stack, Software Engineer, Supabase',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop',
    '',
    'dark',
    '#6366f1',
    TRUE,
    FALSE
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;
