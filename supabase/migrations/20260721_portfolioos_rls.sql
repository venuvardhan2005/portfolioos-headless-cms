-- ========================================================
-- PortfolioOS Table Policies & RLS Configurations
-- Created: 2026-07-21
-- Description: Add RLS policies for Projects, Skills, Experience, Certificates, Resume, Profiles, and Messages
-- ========================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Public profiles read access" ON public.profiles;
CREATE POLICY "Public profiles read access" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can upsert their own profile" ON public.profiles;
CREATE POLICY "Users can upsert their own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 2. Projects Policies
DROP POLICY IF EXISTS "Public projects read access" ON public.projects;
CREATE POLICY "Public projects read access" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Skills Policies
DROP POLICY IF EXISTS "Public skills read access" ON public.skills;
CREATE POLICY "Public skills read access" ON public.skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage skills" ON public.skills;
CREATE POLICY "Admins can manage skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Experience Policies
DROP POLICY IF EXISTS "Public experience read access" ON public.experience;
CREATE POLICY "Public experience read access" ON public.experience FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage experience" ON public.experience;
CREATE POLICY "Admins can manage experience" ON public.experience FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Certificates Policies
DROP POLICY IF EXISTS "Public certificates read access" ON public.certificates;
CREATE POLICY "Public certificates read access" ON public.certificates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage certificates" ON public.certificates;
CREATE POLICY "Admins can manage certificates" ON public.certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Social Links Policies
DROP POLICY IF EXISTS "Public social links read access" ON public.social_links;
CREATE POLICY "Public social links read access" ON public.social_links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage social links" ON public.social_links;
CREATE POLICY "Admins can manage social links" ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Resume Policies
DROP POLICY IF EXISTS "Public resume read access" ON public.resume;
CREATE POLICY "Public resume read access" ON public.resume FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage resume" ON public.resume;
CREATE POLICY "Admins can manage resume" ON public.resume FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. Contact Messages Policies
DROP POLICY IF EXISTS "Public can insert messages" ON public.contact_messages;
CREATE POLICY "Public can insert messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage messages" ON public.contact_messages;
CREATE POLICY "Admins can manage messages" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
