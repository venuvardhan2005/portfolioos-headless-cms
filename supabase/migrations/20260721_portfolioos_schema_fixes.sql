-- ========================================================
-- Schema Fixes for Skills & Certificates Tables
-- Created: 2026-07-21
-- Description: Align database schemas with TypeScript interfaces exactly
-- ========================================================

-- Align public.skills table
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT TRUE;

-- Align public.certificates table
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Internship';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS verify_url TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT TRUE;
