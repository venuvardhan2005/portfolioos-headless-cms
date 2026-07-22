-- ========================================================
-- PortfolioOS Supabase Storage Buckets & RLS Setup
-- Created: 2026-07-21
-- Description: Create 5 storage buckets and configure RLS policies
-- ========================================================

-- --------------------------------------------------------
-- 1. Create Storage Buckets
-- --------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('project-images', 'project-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
    ('certificate-images', 'certificate-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
    ('profile-images', 'profile-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
    ('resume', 'resume', true, 10485760, ARRAY['application/pdf']),
    ('blog-images', 'blog-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- --------------------------------------------------------
-- 2. Storage Policies on storage.objects
-- --------------------------------------------------------

-- Policy A: Anyone can view/download public files
DROP POLICY IF EXISTS "Public Read Access for PortfolioOS Buckets" ON storage.objects;
CREATE POLICY "Public Read Access for PortfolioOS Buckets"
ON storage.objects FOR SELECT
USING (
    bucket_id IN ('project-images', 'certificate-images', 'profile-images', 'resume', 'blog-images')
);

-- Policy B: Only authenticated users (Admins) can upload files
DROP POLICY IF EXISTS "Admin Upload Access for PortfolioOS Buckets" ON storage.objects;
CREATE POLICY "Admin Upload Access for PortfolioOS Buckets"
ON storage.objects FOR INSERT
WITH CHECK (
    auth.role() = 'authenticated' AND
    bucket_id IN ('project-images', 'certificate-images', 'profile-images', 'resume', 'blog-images')
);

-- Policy C: Only authenticated users (Admins) can update files
DROP POLICY IF EXISTS "Admin Update Access for PortfolioOS Buckets" ON storage.objects;
CREATE POLICY "Admin Update Access for PortfolioOS Buckets"
ON storage.objects FOR UPDATE
USING (
    auth.role() = 'authenticated' AND
    bucket_id IN ('project-images', 'certificate-images', 'profile-images', 'resume', 'blog-images')
)
WITH CHECK (
    auth.role() = 'authenticated' AND
    bucket_id IN ('project-images', 'certificate-images', 'profile-images', 'resume', 'blog-images')
);

-- Policy D: Only authenticated users (Admins) can delete files
DROP POLICY IF EXISTS "Admin Delete Access for PortfolioOS Buckets" ON storage.objects;
CREATE POLICY "Admin Delete Access for PortfolioOS Buckets"
ON storage.objects FOR DELETE
USING (
    auth.role() = 'authenticated' AND
    bucket_id IN ('project-images', 'certificate-images', 'profile-images', 'resume', 'blog-images')
);
