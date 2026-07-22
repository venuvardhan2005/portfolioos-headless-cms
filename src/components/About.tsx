import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';

const TIMELINE_DATA = [
  {
    year: '2026',
    title: 'Building AI Projects & Portfolio CMS',
    description: 'Developing state-of-the-art intelligent portfolio applications, integrating deep learning models, and building premium content management workflows.',
    icon: Icons.Cpu,
  },
  {
    year: '2025–2026',
    title: 'React.js Internship',
    description: 'Engineered high-fidelity frontends, streamlined client state management, and built interactive dashboards utilizing Tailwind CSS and Vercel services.',
    icon: Icons.Briefcase,
  },
  {
    year: '2025',
    title: 'Python Programming Internship',
    description: 'Developed automated scripting tools, data analysis frameworks, and microservices integration workflows.',
    icon: Icons.Briefcase,
  },
  {
    year: '2024',
    title: 'Joined B.Tech CSE',
    description: 'Transitioned to Computer Science and Engineering to align academic path with software architectures and intelligent system development.',
    icon: Icons.GraduationCap,
  },
  {
    year: '2024',
    title: 'Completed Diploma (Mechanical Engineering)',
    description: 'Finished technical foundation in design principles, thermodynamics, and system design, graduating with honors.',
    icon: Icons.GraduationCap,
  },
  {
    year: '2021',
    title: 'Started Diploma',
    description: 'Began engineering journey learning technical modeling, engineering physics, and programming foundations.',
    icon: Icons.Calendar,
  },
];

export default function About() {
  const { data } = usePublicPortfolio();
  const { settings } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 20 },
    },
  };

  return (
    <section id="about" className="py-24 border-t border-slate-100 dark:border-neutral-900/50 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-indigo-500/5 dark:bg-indigo-500/3 blur-[100px] -z-10" />

      {/* Heading */}
      <div className="text-left mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-bold font-display uppercase tracking-widest text-indigo-600 dark:text-cyan-400 mb-2"
        >
          My Journey
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white tracking-tight"
        >
          About Me
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 text-slate-600 dark:text-neutral-400 space-y-4 font-sans text-base sm:text-lg font-light leading-relaxed"
          >
            <p>
              {settings.about_me || 'I am a disciplined Software Engineer specializing in bridging the gap between front-end visuals and robust engineering architecture.'}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 p-6 rounded-3xl bg-slate-50 dark:bg-neutral-900/50 border border-slate-100 dark:border-neutral-800/40 flex flex-col justify-center"
          >
            <h3 className="text-xs font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-2 font-mono">Career Objective</h3>
            <p className="text-slate-800 dark:text-neutral-200 font-sans text-sm sm:text-base font-medium leading-relaxed italic">
              "To leverage cross-disciplinary engineering concepts to build next-generation user interfaces and AI models, driving product efficiency through pixel-perfect execution and scalable architectures."
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bento Grid */}
      <motion.div
        id="highlights"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-24 scroll-mt-24"
      >
        {data.highlights?.filter(h => h.visible !== false).map((highlight, idx) => {
          const LucideIcon = (Icons as any)[highlight.icon] || Icons.Award;
          return (
            <motion.div
              key={highlight.id || idx}
              variants={cardVariants}
              className="glass-panel p-6 rounded-3xl flex flex-col justify-between items-start text-left min-h-[160px] hover:border-indigo-500/30 transition-all duration-300 group"
            >
              <div className="flex justify-between items-center w-full">
                <LucideIcon className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono text-slate-400 uppercase">{highlight.badge || 'Stats'}</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-4">{highlight.value}</h4>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">{highlight.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Vertical Timeline */}
      <div className="max-w-4xl mx-auto relative px-4">
        {/* Central connecting line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-cyan-500/30 dark:from-indigo-950 dark:to-neutral-800/20 transform -translate-x-1/2" />

        <div className="space-y-12">
          {TIMELINE_DATA.map((item, idx) => {
            const Icon = item.icon;
            const isEven = idx % 2 === 0;
            return (
              <div key={idx} className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
                {/* Visual marker node */}
                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full border-2 border-indigo-500 bg-white dark:bg-neutral-950 flex items-center justify-center transform -translate-x-1/2 z-10 shadow-md">
                  <Icon className="w-4 h-4 text-indigo-500" />
                </div>

                {/* Card Container */}
                <div className={`w-full md:w-[calc(50%-2rem)] pl-12 md:pl-0 ${isEven ? 'md:text-right md:order-1' : 'md:text-left md:order-2 md:ml-auto'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="glass-panel p-6 rounded-2xl text-left hover:shadow-lg transition-shadow relative"
                  >
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold font-mono text-indigo-600 bg-indigo-50 dark:text-cyan-400 dark:bg-neutral-900 mb-3">
                      {item.year}
                    </span>
                    <h4 className="text-lg font-bold font-display text-slate-800 dark:text-white mb-2">{item.title}</h4>
                    <p className="text-sm font-sans text-slate-500 dark:text-neutral-400 font-light leading-relaxed">{item.description}</p>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
