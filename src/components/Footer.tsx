import { ArrowUp, Mail, MessageSquare, FileText } from 'lucide-react';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';

const QUICK_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Contact', href: '#contact' },
];

export default function Footer() {
  const { data, validatedResumeUrl } = usePublicPortfolio();
  const { settings } = data;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-50/70 dark:bg-neutral-900/40 border-t border-slate-200/50 dark:border-neutral-800/50 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start mb-12">
          {/* Left Column: Brand and actions */}
          <div className="lg:col-span-5 text-left space-y-6">
            <h3 className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              PORTFOLIOOS
            </h3>
            <p className="text-sm font-sans text-slate-500 dark:text-neutral-400 font-light leading-relaxed max-w-sm">
              Building AI-powered digital experiences with modern web technologies. Designed for 2026.
            </p>
            <div className="flex flex-wrap gap-3">
              {validatedResumeUrl ? (
                <a
                  href={validatedResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  onClick={() => console.log('[debugging] Footer Resume download clicked. URL:', validatedResumeUrl)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Download Resume
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-neutral-805 text-slate-400 dark:text-neutral-600 text-xs font-semibold cursor-not-allowed opacity-50"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Resume Not Available
                </button>
              )}
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Hire Me
              </a>
            </div>
          </div>

          {/* Center Column: Links */}
          <div className="lg:col-span-3 text-left space-y-4">
            <h4 className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest font-mono">
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm font-sans text-slate-600 dark:text-neutral-400">
              {QUICK_LINKS.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Built with & specs */}
          <div className="lg:col-span-4 text-left space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest font-mono">
                Connect & Details
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href={settings.github || "https://github.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200/20 text-slate-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
                <a
                  href={settings.linkedin || "https://linkedin.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200/20 text-slate-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    settings.email || "venuvardhanp61653@gmail.com"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200/20 text-slate-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${(settings.phone || "917483765885").replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200/20 text-slate-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                </a>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200/30 dark:border-neutral-800/40 text-xs font-mono text-slate-400 dark:text-neutral-500">
              <div className="flex items-center justify-between">
                <span>Version:</span>
                <span className="font-bold text-slate-600 dark:text-neutral-400">v1.0.0</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Built With:</span>
                <span className="font-medium text-slate-500 dark:text-neutral-400 text-right">
                  React, TS, Tailwind, Framer Motion, Supabase
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/50 dark:border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-sans text-slate-400 dark:text-neutral-500 text-left w-full sm:w-auto">
            <p>© 2026 P Venu Vardhan Shetty. All rights reserved.</p>
            <p className="mt-1 flex items-center gap-1">
              Made with <span className="text-red-500">❤️</span> in India
            </p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200/50 dark:border-neutral-855 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 hover:border-indigo-500/30 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer group"
              aria-label="Scroll back to top"
            >
              Back To Top
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
