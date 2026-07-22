import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Terminal, Award, Cpu } from 'lucide-react';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';

interface ExperienceEntry {
  role: string;
  organization: string;
  duration: string;
  highlights: string[];
  technologies: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const EXPERIENCE_DATA: ExperienceEntry[] = [
  {
    role: 'Building AI Products',
    organization: 'Self-Driven Research & Development',
    duration: 'March 2026 – Present',
    highlights: [
      'Engineered an AI Resume Builder integrating LLM suggestions.',
      'Developed a headless Portfolio CMS architecture using React & Tailwind.',
      'Designed custom analytical Power BI Dashboards for performance tracking.',
      'Constructed highly performant, responsive React web apps.',
    ],
    technologies: ['Gemini API', 'React.js', 'Power BI', 'Tailwind CSS', 'TypeScript'],
    icon: Cpu,
  },
  {
    role: 'React.js Intern – Associate',
    organization: 'The Entrepreneurship Network (Limitless Technologies LLP)',
    duration: 'December 2025 – March 2026',
    highlights: [
      'Built and deployed clean, component-based responsive React applications.',
      'Integrated backend REST APIs with streamlined client state hydration.',
      'Conducted debugging cycles and applied robust clean code patterns.',
      'Collaborated in Agile sprints, meeting project delivery goals independently.',
    ],
    technologies: ['React.js', 'JavaScript', 'CSS Grid', 'REST APIs', 'Git/GitHub'],
    icon: Award,
  },
  {
    role: 'Python Programming Intern',
    organization: 'Kishkindha University',
    duration: 'July 2025 – August 2025',
    highlights: [
      'Mastered core Python paradigms, standard library constructs, and file I/O.',
      'Implemented design patterns using Object-Oriented Programming (OOP).',
      'Developed custom data structure nodes and sorting algorithms.',
      'Architected and delivered a complete command-line automation mini-project.',
    ],
    technologies: ['Python', 'OOP', 'Data Structures', 'File Handling', 'CLI Tools'],
    icon: Terminal,
  },
];

export default function Experience() {
  const { data } = usePublicPortfolio();
  const liveExperiences = data.experiences;

  const displayExperiences: ExperienceEntry[] =
    liveExperiences && liveExperiences.length > 0
      ? liveExperiences.map((e) => ({
          role: e.role,
          organization: e.company,
          duration: `${e.start_date} – ${e.end_date || (e.current_job ? 'Present' : '')}`,
          highlights: e.description ? [e.description] : ['Engineered software solutions.'],
          technologies: e.technologies || ['React.js'],
          icon: e.current_job ? Cpu : Award,
        }))
      : EXPERIENCE_DATA;

  return (
    <section id="experience" className="py-24 border-t border-slate-100 dark:border-neutral-900/50 relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 dark:bg-indigo-500/2 blur-[100px] -z-10" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 dark:bg-cyan-500/2 blur-[120px] -z-10 animate-pulse" />

      {/* Header */}
      <div className="text-left mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-bold font-display uppercase tracking-widest text-indigo-600 dark:text-cyan-400 mb-2"
        >
          Career Path
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white tracking-tight"
        >
          Experience & Journey
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-neutral-400 max-w-2xl font-sans font-light mt-4 text-base sm:text-lg leading-relaxed"
        >
          My learning path through internships, projects, and continuous growth.
        </motion.p>
      </div>

      {/* Experience Vertical Timeline */}
      <div className="max-w-4xl mx-auto relative px-4">
        {/* Connector Line */}
        <div className="absolute left-6 md:left-8 top-4 bottom-4 w-[2px] bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500/30 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-950/20" />

        <div className="space-y-12">
          {displayExperiences.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative pl-12 md:pl-16 group"
              >
                {/* Timeline Icon Node */}
                <div className="absolute left-0 md:left-2 w-12 h-12 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/50 dark:border-neutral-800/80 flex items-center justify-center shadow-sm group-hover:border-indigo-500/40 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-indigo-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>

                {/* Experience Card */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl text-left hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 duration-300 transition-all">
                  {/* Card Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white leading-tight">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-sans font-medium text-slate-500 dark:text-neutral-400 mt-1">
                        {exp.organization}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-indigo-50 text-indigo-600 dark:bg-neutral-900/60 dark:text-cyan-400 self-start sm:self-center border border-indigo-100/20 dark:border-neutral-800">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.duration}
                    </div>
                  </div>

                  {/* Highlights list */}
                  <ul className="space-y-2 mb-6">
                    {exp.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2.5 text-sm font-sans font-light text-slate-600 dark:text-neutral-400 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-400 mt-2 shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  {/* Technologies tags & learn more button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-neutral-900/50">
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wide uppercase bg-slate-50 text-slate-500 dark:bg-neutral-900/40 dark:text-neutral-500 border border-slate-200/20 dark:border-neutral-800/40"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors group/btn self-start sm:self-center">
                      Learn More
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
