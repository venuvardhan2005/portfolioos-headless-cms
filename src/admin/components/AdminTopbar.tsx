import React from 'react';
import { Search, Bell, Menu, ExternalLink } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { useAuth } from '../../auth/hooks/useAuth';

interface AdminTopbarProps {
  onMenuToggle: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onMenuToggle }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 px-6 bg-white/40 dark:bg-neutral-950/60 backdrop-blur-xl border-b border-slate-200/40 dark:border-neutral-800/80 sticky top-0 z-30 flex items-center justify-between">
      {/* Search Input & Mobile Drawer Button */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-xs sm:max-w-sm flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 dark:text-neutral-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search CMS (Projects, Skills, Messages...)"
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-800 dark:text-slate-100"
          />
          <kbd className="hidden sm:inline-block absolute right-3 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-200/50 dark:bg-neutral-800 rounded border border-slate-300/40 dark:border-neutral-700 pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Tools & User Info */}
      <div className="flex items-center gap-3">
        {/* Link back to public portfolio */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3 text-indigo-500" />
        </a>

        {/* Notifications */}
        <button
          className="p-2 rounded-full relative text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200/60 dark:border-neutral-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-inner">
            {(user?.email?.[0] || 'A').toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
