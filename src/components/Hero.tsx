import { ArrowUpRight, FileDown, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';

export default function Hero() {
  const { data, validatedResumeUrl } = usePublicPortfolio();
  const { settings } = data;

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-20 px-4 overflow-hidden"
    >
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-indigo-500/20 dark:bg-indigo-500/10 blur-[80px] -z-10 animate-pulse duration-4000" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-cyan-500/20 dark:bg-cyan-500/10 blur-[80px] -z-10 animate-pulse duration-6000" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Heading and copy */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-cyan-400 text-xs sm:text-sm font-semibold tracking-wide font-display"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow text-indigo-500 dark:text-cyan-400" />
            {settings.availability_status ? 'Available for Opportunities' : 'Designed for 2026'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight text-slate-900 dark:text-white leading-[1.1] sm:leading-[1.05]"
          >
            {settings.full_name || 'Venu Vardhan'}
            <span className="block mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
              {settings.role || 'AI & Full Stack Dev'}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-neutral-400 max-w-xl font-sans font-light leading-relaxed"
          >
            {settings.hero_subtitle || 'Designing and engineering premium digital experiences that seamlessly integrate robust backend architecture with intelligent artificial intelligence models.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg hover:shadow-indigo-500/20 transition-all gap-2 group"
            >
              Hire Me
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            {validatedResumeUrl ? (
              <a
                href={validatedResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                onClick={() => console.log('[debugging] Hero Resume download clicked. URL:', validatedResumeUrl)}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors gap-2 cursor-pointer"
              >
                Download Resume
                <FileDown className="w-5 h-5" />
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-805 text-slate-400 dark:text-neutral-600 font-semibold gap-2 cursor-not-allowed opacity-50"
              >
                Resume Not Available
                <FileDown className="w-5 h-5" />
              </button>
            )}
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-neutral-900 w-full sm:w-auto"
          >
            <span className="text-xs text-slate-400 dark:text-neutral-500 font-medium tracking-wider uppercase font-display">
              Connect:
            </span>
            <div className="flex gap-2">
              <a
                href={settings.github || 'https://github.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href={settings.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                  settings.email || "venuvardhan2005@gmail.com"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                aria-label="Email"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Visual Portrait & Floating cards */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-[2.5rem] overflow-hidden border border-slate-200/50 dark:border-neutral-800/50 shadow-2xl flex items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-neutral-900 dark:to-neutral-800/50"
          >
            {/* Ambient inner soft gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-cyan-500/10 mix-blend-overlay" />

            {/* SVG Illustration Avatar inside image frame */}
            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center border border-indigo-200/30 dark:border-neutral-700/30 relative overflow-hidden">
              {settings.avatar_url ? (
                <img src={settings.avatar_url} alt={settings.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl sm:text-8xl select-none filter drop-shadow-md">👨‍💻</span>
              )}
            </div>
          </motion.div>

          {/* Floating Card 1: Vercel Deploy */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
            className="absolute top-1/2 -left-6 sm:-left-12 glass-panel p-3 rounded-2xl shadow-xl border border-slate-200/50 dark:border-neutral-800/50 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs select-none">
              ▲
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-400 font-mono">DEPLOYED TO VERCEL</p>
              <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200">production-v2.6.sh</p>
            </div>
          </motion.div>

          {/* Floating Card 2: AI Token / Model Inference */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: -40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
            className="absolute bottom-6 -right-6 sm:-right-12 glass-panel p-3 rounded-2xl shadow-xl border border-slate-200/50 dark:border-neutral-800/50 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-400 font-mono">LLM INFERENCE</p>
              <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200">Latency: 14ms</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
