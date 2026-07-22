-- ========================================================
-- PortfolioOS Highlights Table Migration & Seeding
-- Created: 2026-07-22
-- Description: Create highlights table, RLS, and seed data
-- ========================================================

-- Create table
CREATE TABLE IF NOT EXISTS public.portfolio_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    badge TEXT,
    display_order INT DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.portfolio_highlights ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Public select portfolio_highlights" ON public.portfolio_highlights;
CREATE POLICY "Public select portfolio_highlights" ON public.portfolio_highlights FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage portfolio_highlights" ON public.portfolio_highlights;
CREATE POLICY "Admin manage portfolio_highlights" ON public.portfolio_highlights FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed existing cards
INSERT INTO public.portfolio_highlights (id, icon, title, value, description, badge, display_order, visible)
VALUES
(
    'b1c7c5d0-9943-4ccb-a459-fde359b39d01',
    'GraduationCap',
    'CGPA',
    '8.8 CGPA',
    'Excellent performance record in engineering study',
    'Academic status',
    1,
    TRUE
),
(
    'b1c7c5d0-9943-4ccb-a459-fde359b39d02',
    'Briefcase',
    'Internships',
    '2 Internships',
    'Python Automation & React.js system development',
    'Professional',
    2,
    TRUE
),
(
    'b1c7c5d0-9943-4ccb-a459-fde359b39d03',
    'Cpu',
    'Projects',
    '15+ Projects',
    'Machine Learning models, React dashboards, & automation',
    'AI & Full Stack',
    3,
    TRUE
),
(
    'b1c7c5d0-9943-4ccb-a459-fde359b39d04',
    'Award',
    'Availability',
    'Open to Work',
    'Looking for opportunities to develop scalable apps',
    'Availability',
    4,
    TRUE
)
ON CONFLICT (id) DO NOTHING;
