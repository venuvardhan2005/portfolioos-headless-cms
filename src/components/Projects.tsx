import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';

interface Project {
  title: string;
  isFeatured?: boolean;
  description: string;
  features?: string[];
  tech: string[];
  image: string;
  demoUrl: string;
  githubUrl: string;
  status: 'Completed' | 'In Progress' | 'Beta';
  eta?: string;
  futureImprovements?: string;
  accentColor: string;
}

const PROJECTS_DATA: Project[] = [
  {
    title: 'AI Resume Builder',
    isFeatured: true,
    description: 'AI-powered resume builder that generates tailored, ATS-compliant resumes using Gemini AI.',
    features: [
      'Interactive questionnaire.',
      'ATS score analyzer & optimizer.',
      'Real-time design switching & PDF exports.'
    ],
    tech: ['React.js', 'TypeScript', 'Tailwind', 'Gemini API'],
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com',
    status: 'Completed',
    accentColor: 'from-indigo-500 to-purple-500'
  },
  {
    title: 'Portfolio CMS & Dashboard',
    isFeatured: true,
    description: 'A developer portfolio platform containing an integrated, secure admin dashboard.',
    features: [
      'Analytics dashboard panel.',
      'Drag-and-drop skills list reordering.',
      'Supabase database sync rules.'
    ],
    tech: ['React.js', 'TS', 'Tailwind', 'Supabase', 'Framer'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com',
    status: 'In Progress',
    accentColor: 'from-cyan-500 to-blue-500'
  },
  {
    title: 'Power BI Taxi Fare Dashboard',
    isFeatured: false,
    description: 'Interactive analytical data pipeline visualizing regional taxi trip records.',
    tech: ['Power BI', 'Data Analysis', 'DAX Queries', 'SQL Server'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com',
    status: 'Completed',
    accentColor: 'from-amber-500 to-orange-500'
  }
];

export default function Projects() {
  const { data } = usePublicPortfolio();
  const liveProjects = data.projects;

  const displayProjects: Project[] =
    liveProjects && liveProjects.length > 0
      ? liveProjects.map((p) => ({
          title: p.title,
          isFeatured: p.featured,
          description: p.description,
          features: ['Modular architecture', 'Responsive UI components', 'API Data flow'],
          tech: p.technologies || ['React.js', 'TypeScript'],
          image: p.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
          demoUrl: p.live_url || '#',
          githubUrl: p.github_url || '#',
          status: (p.status as any) || 'Completed',
          accentColor: p.featured ? 'from-indigo-500 to-purple-500' : 'from-cyan-500 to-blue-500',
        }))
      : PROJECTS_DATA;

  return (
    <div id="projects" className="space-y-6 text-left">
      {/* Header inside component */}
      <div className="mb-8">
        <p className="text-[10px] font-bold font-display uppercase tracking-widest text-indigo-600 dark:text-cyan-400 mb-1">
          Selected Work
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
          Featured Projects
        </h2>
      </div>

      {/* Projects Stack */}
      <div className="space-y-4">
        {displayProjects.map((project, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className={`glass-panel p-4 rounded-3xl flex flex-col sm:flex-row gap-4 items-center hover:border-indigo-500/20 hover:shadow-lg duration-300 relative ${
              project.isFeatured ? 'ring-1 ring-indigo-500/10 dark:ring-indigo-500/5' : ''
            }`}
          >
            {/* Left side: Standardized Image (180x140px) */}
            <div className="w-full sm:w-[180px] h-[140px] rounded-2xl overflow-hidden shrink-0 border border-slate-200/20 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 relative group/img">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover/img:scale-105 duration-500 transition-transform filter brightness-95 dark:brightness-85"
              />
            </div>

            {/* Right side: Project Details (Fills remaining container width) */}
            <div className="w-full sm:flex-1 flex flex-col justify-between items-start space-y-2.5">
              <div className="w-full space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-display text-slate-800 dark:text-white leading-tight">
                      {project.title}
                    </h3>
                    {project.isFeatured && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold font-display uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/15">
                        <Sparkles className="w-2 h-2" />
                        Featured
                      </span>
                    )}
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold font-mono tracking-wider uppercase ${
                    project.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-xs font-sans text-slate-500 dark:text-neutral-400 leading-relaxed font-light">
                  {project.description}
                </p>

                {/* Key features */}
                {project.features && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 pt-1">
                    {project.features.slice(0, 2).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-neutral-400 font-sans">
                        <span className="w-1 h-1 rounded-full bg-indigo-500 dark:bg-cyan-400 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Badges & Actions */}
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-neutral-900/50">
                <div className="flex flex-wrap gap-1">
                  {project.tech.slice(0, 3).map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-1.5 py-0.5 rounded text-[8px] font-bold font-mono tracking-wide uppercase bg-slate-50 text-slate-500 dark:bg-neutral-900/40 dark:text-neutral-500 border border-slate-200/10 dark:border-neutral-800/40"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                  <a 
                    href={project.demoUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors"
                  >
                    Live Demo <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href={project.githubUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                    GitHub Repository
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
