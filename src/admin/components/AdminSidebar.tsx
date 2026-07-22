import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Briefcase,
  Award,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
  { name: 'Skills', path: '/admin/skills', icon: Cpu },
  { name: 'Experience', path: '/admin/experience', icon: Briefcase },
  { name: 'Certificates', path: '/admin/certificates', icon: Award },
  { name: 'Highlights', path: '/admin/highlights', icon: Sparkles },
  { name: 'Resume', path: '/admin/resume', icon: FileText },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white/70 dark:bg-neutral-950/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-neutral-800/80 z-50 flex flex-col justify-between transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-neutral-900/60">
            <NavLink to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold font-display shadow-md shadow-indigo-500/20 shrink-0">
                P
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sm tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                    PortfolioOS
                  </span>
                  <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 dark:text-neutral-500">
                    CMS Control Center
                  </span>
                </div>
              )}
            </NavLink>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-sans text-xs font-medium transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 font-semibold border border-indigo-500/15'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-neutral-900/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-neutral-900/60 space-y-2">
          {!collapsed ? (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-900/50 border border-slate-200/40 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold font-display text-slate-800 dark:text-white truncate">
                    Vardhan Shetty
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 truncate">
                    {user?.email || 'admin@portfolioos.dev'}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="w-full p-3 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
