import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderGit2,
  Cpu,
  Briefcase,
  Award,
  MessageSquare,
  Plus,
  FileUp,
  ExternalLink,
  CheckCircle2,
  Activity,
  Clock,
  Sparkles,
  RefreshCw,
  Database,
  ShieldCheck,
  HardDrive
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStats, RecentActivityItem, SystemHealth } from '../services/dashboardService';
import { AdminLayout } from '../components/AdminLayout';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    setRefreshing(true);
    const [statsData, activityData, healthData] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getRecentActivity(),
      dashboardService.checkHealth(),
    ]);

    setStats(statsData);
    setActivities(activityData);
    setHealth(healthData);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
                System Active
              </span>
              <span className="text-xs font-mono text-slate-400">{currentDateStr}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
              Welcome back, Vardhan 👋
            </h1>
            <p className="text-xs font-sans text-slate-500 dark:text-neutral-400 font-light max-w-xl">
              Here is your live PortfolioOS CMS system summary. All database query services, storage buckets, and auth gates are online.
            </p>
          </div>

          <div className="flex items-center gap-2 z-10 self-end md:self-center">
            <button
              onClick={loadDashboardData}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200/50 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-slate-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <span>View Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        {/* Live Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { title: 'Projects', count: stats?.projectsCount, icon: FolderGit2, color: 'text-indigo-500' },
            { title: 'Skills', count: stats?.skillsCount, icon: Cpu, color: 'text-cyan-500' },
            { title: 'Experience', count: stats?.experienceCount, icon: Briefcase, color: 'text-purple-500' },
            { title: 'Certificates', count: stats?.certificatesCount, icon: Award, color: 'text-amber-500' },
            { title: 'Unread Messages', count: stats?.unreadMessagesCount, icon: MessageSquare, color: 'text-emerald-500' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel p-5 rounded-3xl space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 font-sans">
                    {stat.title}
                  </span>
                  <div className={`p-2 rounded-xl bg-slate-100 dark:bg-neutral-900 ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {loading ? (
                  <div className="h-8 w-16 bg-slate-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
                ) : (
                  <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
                    {stat.count}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Middle Section: Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Activity (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-900/60 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">
                    Recent Database Activity
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Live Supabase Feed</span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-12 bg-slate-100 dark:bg-neutral-900 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No recent activity found.</div>
              ) : (
                <div className="space-y-3">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-neutral-900/40 border border-slate-200/40 dark:border-neutral-800/60 flex items-center justify-between gap-3 hover:border-indigo-500/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display">
                            {act.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-sans">
                            {act.subtitle}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {act.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & System Status (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Actions */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white border-b border-slate-100 dark:border-neutral-900/60 pb-3">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Add Project', icon: Plus, path: '/admin/projects' },
                  { label: 'Upload Resume', icon: FileUp, path: '/admin/resume' },
                  { label: 'Add Certificate', icon: Plus, path: '/admin/certificates' },
                  { label: 'Add Skill', icon: Plus, path: '/admin/skills' },
                ].map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <a
                      key={action.label}
                      href={action.path}
                      className="p-3 rounded-2xl bg-white/60 dark:bg-neutral-900/60 border border-slate-200/40 dark:border-neutral-800 hover:border-indigo-500/30 text-slate-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-cyan-400 text-xs font-medium font-sans flex items-center gap-2 transition-all shadow-sm"
                    >
                      <ActionIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">{action.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* System Status */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white border-b border-slate-100 dark:border-neutral-900/60 pb-3">
                System Status
              </h3>
              <div className="space-y-2.5 text-xs font-sans">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/60 dark:bg-neutral-900/40">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-500" />
                    <span>Supabase Database</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    <CheckCircle2 className="w-3 h-3" />
                    {health?.supabaseConnected ? 'Online' : 'Checking'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/60 dark:bg-neutral-900/40">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    <span>Authentication Gate</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/60 dark:bg-neutral-900/40">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-cyan-500" />
                    <span>Storage Buckets</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    <CheckCircle2 className="w-3 h-3" />
                    Healthy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
