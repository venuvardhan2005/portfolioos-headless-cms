import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { 
  Atom, Code2, Server, Database, Sparkles, Terminal, 
  Layers, Globe, Cpu, Flame, BarChart2, FileSpreadsheet, 
  GitBranch, Send, ShieldAlert, CloudLightning 
} from 'lucide-react';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';
import type { SkillRecord } from '../admin/services/skillsService';

interface Skill {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Category {
  title: string;
  skills: Skill[];
}

const SKILLS_DATA: Category[] = [
  {
    title: 'Frontend Development',
    skills: [
      { name: 'React.js', description: 'Interactive SPAs, React Hooks, and Virtual DOM state updates.', icon: Atom, color: 'from-cyan-400 to-blue-500' },
      { name: 'TypeScript', description: 'Strict type safety, compiler options, and interfaces.', icon: ShieldAlert, color: 'from-blue-600 to-indigo-500' },
      { name: 'JavaScript (ES6+)', description: 'Asynchronous logic, DOM, array methods, and prototypes.', icon: Code2, color: 'from-yellow-400 to-amber-500' },
      { name: 'HTML5', description: 'Semantic structure, media nodes, and global browser standards.', icon: Globe, color: 'from-orange-500 to-red-500' },
      { name: 'CSS3', description: 'Custom grid flex layouts, modern variables, and transitions.', icon: Layers, color: 'from-blue-400 to-indigo-600' },
      { name: 'Tailwind CSS', description: 'Utility-first compiling, custom config themes, and layouts.', icon: Layers, color: 'from-cyan-400 to-teal-400' },
      { name: 'Bootstrap', description: 'Grid structure, custom components, and responsive utils.', icon: Layers, color: 'from-purple-600 to-indigo-700' },
    ]
  },
  {
    title: 'Backend Engineering',
    skills: [
      { name: 'Node.js', description: 'V8 runtime scripting, filesystem tasks, and package systems.', icon: Cpu, color: 'from-emerald-500 to-green-600' },
      { name: 'Express.js', description: 'Custom routing controllers, middleware pipelines, and API setups.', icon: Server, color: 'from-slate-600 to-neutral-800' },
      { name: 'REST APIs', description: 'Secure request formats, structured status states, and JSON outputs.', icon: GitBranch, color: 'from-indigo-500 to-cyan-500' }
    ]
  },
  {
    title: 'Database & Systems',
    skills: [
      { name: 'MongoDB', description: 'BSON doc formatting, search queries, and schema patterns.', icon: Database, color: 'from-green-500 to-emerald-600' },
      { name: 'Firebase', description: 'Real-time sync databases, OAuth systems, and serverless tasks.', icon: Flame, color: 'from-amber-500 to-orange-500' },
      { name: 'SQL', description: 'Structured tables, join queries, and transaction controls.', icon: Database, color: 'from-blue-500 to-cyan-600' }
    ]
  },
  {
    title: 'AI & Data Integration',
    skills: [
      { name: 'Gemini API', description: 'Semantic model generation, system tuning parameters, and API flows.', icon: Sparkles, color: 'from-indigo-500 to-purple-500' },
      { name: 'Power BI', description: 'Interactive dashboard panels, data modeling, and custom reports.', icon: BarChart2, color: 'from-yellow-500 to-amber-600' },
      { name: 'Microsoft Excel', description: 'Complex functions, lookup tables, and spreadsheet analytics.', icon: FileSpreadsheet, color: 'from-emerald-600 to-green-700' },
      { name: 'AI Integration', description: 'Orchestrating agent workflows, system prompts, and context loops.', icon: Cpu, color: 'from-pink-500 to-rose-600' }
    ]
  },
  {
    title: 'Developer Tools',
    skills: [
      { name: 'Git', description: 'Branch merging, history tracking, conflict fixes, and resets.', icon: GitBranch, color: 'from-orange-600 to-red-600' },
      { name: 'GitHub', description: 'Code hosting, collaboration, pipeline runs, and release flows.', icon: Terminal, color: 'from-slate-800 to-neutral-950' },
      { name: 'VS Code', description: 'IDE configuration, extension builds, and workspace options.', icon: Code2, color: 'from-blue-500 to-sky-600' },
      { name: 'Postman', description: 'Endpoint testing, header payloads, and environment scopes.', icon: Send, color: 'from-orange-500 to-amber-500' },
      { name: 'Netlify', description: 'SPA deployments, header redirects, and serverless builds.', icon: CloudLightning, color: 'from-teal-400 to-cyan-500' },
      { name: 'Render', description: 'Web service containers, background scripts, and database setups.', icon: CloudLightning, color: 'from-indigo-600 to-indigo-900' }
    ]
  }
];

function SkillCard({ skill }: { skill: Skill }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse coords relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = skill.icon;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="glass-panel p-5 rounded-2xl flex flex-col items-start text-left relative overflow-hidden group hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 duration-300 min-h-[140px] cursor-pointer"
    >
      {/* Background radial hover glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      {/* Card Corner Gradient Accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${skill.color} opacity-10 group-hover:opacity-20 blur-xl transition-all duration-300 rounded-full`} />

      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${skill.color} bg-opacity-15 text-white flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-slate-800 dark:text-white" />
        </div>
        <h4 className="font-bold font-display text-slate-800 dark:text-white text-base">{skill.name}</h4>
      </div>

      <p className="text-xs font-sans text-slate-400 dark:text-neutral-500 leading-relaxed font-light mt-1">
        {skill.description}
      </p>
    </motion.div>
  );
}

export default function Skills() {
  const { data } = usePublicPortfolio();
  const liveSkills = data.skills;

  // Group live skills or fallback to SKILLS_DATA
  const groupedCategories: Category[] = [];

  if (liveSkills && liveSkills.length > 0) {
    const categoryMap: Record<string, Skill[]> = {};
    liveSkills.forEach((s: SkillRecord) => {
      const cat = s.category || 'Other Technologies';
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push({
        name: s.name,
        description: `${s.name} skill module`,
        icon: Cpu,
        color: 'from-indigo-500 to-cyan-500',
      });
    });

    Object.entries(categoryMap).forEach(([title, skills]) => {
      groupedCategories.push({ title, skills });
    });
  }

  const displayCategories = groupedCategories.length > 0 ? groupedCategories : SKILLS_DATA;

  return (
    <section id="skills" className="py-24 border-t border-slate-100 dark:border-neutral-900/50 relative overflow-hidden">
      {/* Background Ambient Shapes */}
      <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-cyan-500/5 dark:bg-cyan-500/3 blur-[120px] -z-10 animate-pulse duration-5000" />
      
      {/* Headers */}
      <div className="text-left mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-bold font-display uppercase tracking-widest text-indigo-600 dark:text-cyan-400 mb-2"
        >
          Tech Stack
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white tracking-tight"
        >
          Skills & Technologies
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-neutral-400 max-w-2xl font-sans font-light mt-4 text-base sm:text-lg leading-relaxed"
        >
          Proficiencies in full-stack architecture, custom database schema designs, statistical business reporting, and intelligent AI models.
        </motion.p>
      </div>

      {/* Categories stack */}
      <div className="space-y-16">
        {displayCategories.map((cat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-neutral-900 pb-3">
              <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-500" />
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-neutral-200 tracking-tight">
                {cat.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {cat.skills.map((skill, sIdx) => (
                <SkillCard key={sIdx} skill={skill} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
