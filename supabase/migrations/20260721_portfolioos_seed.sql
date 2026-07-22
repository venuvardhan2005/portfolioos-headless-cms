-- ========================================================
-- PortfolioOS Default Seed Data Migration
-- Created: 2026-07-21
-- Description: Populate database tables with the original landing page data
-- ========================================================

-- 1. Insert Profile (Skip if exists or update fields)
-- Note: id must link to auth.users if auth is used, or can be queried from existing profile table.
-- If no profile exists, let's create a template if auth.users has users.
-- We do a SELECT ID to check for logged-in user or templating.
DO $$
DECLARE
    admin_id UUID;
BEGIN
    SELECT id INTO admin_id FROM auth.users LIMIT 1;
    IF admin_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
        VALUES (
            admin_id,
            'P VENU VARDHAN SHETTY',
            'venuvardhan2005@gmail.com',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
            'admin'
        )
        ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            avatar_url = EXCLUDED.avatar_url;
    END IF;
END $$;

-- 2. Insert Social Links
INSERT INTO public.social_links (id, github, linkedin, leetcode, hackerrank, email, phone)
VALUES (
    'aa47c5d0-9943-4ccb-a459-fde359b39d77',
    'https://github.com/venuvardhan2005',
    'https://linkedin.com/in/p-venu-vardhan-shetty',
    'https://leetcode.com/venuvardhan',
    'https://hackerrank.com/venuvardhan',
    'venuvardhan2005@gmail.com',
    '+91 9876543210'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Projects
INSERT INTO public.projects (title, slug, description, image_url, github_url, live_url, technologies, featured, status, display_order)
VALUES
(
    'AI Resume Builder',
    'ai-resume-builder',
    'AI-powered resume builder that generates tailored, ATS-compliant resumes using Gemini AI.',
    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
    'https://github.com',
    'https://demo.example.com',
    ARRAY['React.js', 'TypeScript', 'Tailwind', 'Gemini API'],
    TRUE,
    'Completed',
    1
),
(
    'Portfolio CMS & Dashboard',
    'portfolio-cms',
    'A developer portfolio platform containing an integrated, secure admin dashboard.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    'https://github.com',
    'https://demo.example.com',
    ARRAY['React.js', 'TS', 'Tailwind', 'Supabase', 'Framer'],
    TRUE,
    'In Progress',
    2
),
(
    'Power BI Taxi Fare Dashboard',
    'powerbi-taxi-dashboard',
    'Interactive analytical data pipeline visualizing regional taxi trip records.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    'https://github.com',
    'https://demo.example.com',
    ARRAY['Power BI', 'Data Analysis', 'DAX Queries', 'SQL Server'],
    FALSE,
    'Completed',
    3
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Insert Skills
INSERT INTO public.skills (name, category, icon, display_order, visible)
VALUES
('React.js', 'Frontend', 'Atom', 1, TRUE),
('TypeScript', 'Frontend', 'ShieldAlert', 2, TRUE),
('JavaScript (ES6+)', 'Frontend', 'Code2', 3, TRUE),
('HTML5', 'Frontend', 'Globe', 4, TRUE),
('CSS3', 'Frontend', 'Layers', 5, TRUE),
('Tailwind CSS', 'Frontend', 'Layers', 6, TRUE),
('Bootstrap', 'Frontend', 'Layers', 7, TRUE),
('Node.js', 'Backend', 'Cpu', 8, TRUE),
('Express.js', 'Backend', 'Server', 9, TRUE),
('REST APIs', 'Backend', 'GitBranch', 10, TRUE),
('MongoDB', 'Database', 'Database', 11, TRUE),
('Firebase', 'Database', 'Flame', 12, TRUE),
('SQL', 'Database', 'Database', 13, TRUE),
('Gemini API', 'AI & Data', 'Sparkles', 14, TRUE),
('Power BI', 'AI & Data', 'BarChart2', 15, TRUE),
('Microsoft Excel', 'AI & Data', 'FileSpreadsheet', 16, TRUE),
('AI Integration', 'AI & Data', 'Cpu', 17, TRUE),
('Git', 'Developer Tools', 'GitBranch', 18, TRUE),
('GitHub', 'Developer Tools', 'Terminal', 19, TRUE),
('VS Code', 'Developer Tools', 'Code2', 20, TRUE),
('Postman', 'Developer Tools', 'Send', 21, TRUE),
('Netlify', 'Developer Tools', 'CloudLightning', 22, TRUE),
('Render', 'Developer Tools', 'CloudLightning', 23, TRUE)
ON CONFLICT DO NOTHING;

-- 5. Insert Experiences
INSERT INTO public.experience (company, role, description, technologies, start_date, end_date, current_job, display_order)
VALUES
(
    'Self-Driven Research & Development',
    'Building AI Products',
    'Engineered an AI Resume Builder integrating LLM suggestions. Developed a headless Portfolio CMS architecture using React & Tailwind. Designed custom analytical Power BI Dashboards for performance tracking. Constructed highly performant, responsive React web apps.',
    ARRAY['Gemini API', 'React.js', 'Power BI', 'Tailwind CSS', 'TypeScript'],
    'March 2026',
    'Present',
    TRUE,
    1
),
(
    'The Entrepreneurship Network (Limitless Technologies LLP)',
    'React.js Intern – Associate',
    'Built and deployed clean, component-based responsive React applications. Integrated backend REST APIs with streamlined client state hydration. Conducted debugging cycles and applied robust clean code patterns. Collaborated in Agile sprints, meeting project delivery goals independently.',
    ARRAY['React.js', 'JavaScript', 'CSS Grid', 'REST APIs', 'Git/GitHub'],
    'December 2025',
    'March 2026',
    FALSE,
    2
),
(
    'Kishkindha University',
    'Python Programming Intern',
    'Mastered core Python paradigms, standard library constructs, and file I/O. Implemented design patterns using Object-Oriented Programming (OOP). Developed custom data structure nodes and sorting algorithms. Architected and delivered a complete command-line automation mini-project.',
    ARRAY['Python', 'OOP', 'Data Structures', 'File Handling', 'CLI Tools'],
    'July 2025',
    'August 2025',
    FALSE,
    3
)
ON CONFLICT DO NOTHING;

-- 6. Insert Certificates
INSERT INTO public.certificates (title, organization, image_url, pdf_url, credential_id, issue_date, category, display_order, visible)
VALUES
(
    'React.js Development Internship',
    'The Entrepreneurship Network',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
    '#download-react',
    'TEN-REC-2026-894',
    'March 2026',
    'Internship',
    1,
    TRUE
),
(
    'Python Programming Internship',
    'Kishkindha University',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
    '#download-python',
    'KU-PY-2025-104',
    'August 2025',
    'Internship',
    2,
    TRUE
)
ON CONFLICT DO NOTHING;

-- 7. Insert Resume
INSERT INTO public.resume (file_url, version)
VALUES (
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'v1.0.0'
)
ON CONFLICT DO NOTHING;
