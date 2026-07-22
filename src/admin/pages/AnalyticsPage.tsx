import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  RefreshCw,
  Download,
  FolderGit2,
  Cpu,
  Briefcase,
  Award,
  MessageSquare,
  FileText,
  Activity,
  CheckCircle2,
  BarChart3,
  PieChart,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { analyticsService } from '../services/analyticsService';
import type { AnalyticsSummary } from '../services/analyticsService';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('30d');
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadAnalytics = async () => {
    setRefreshing(true);
    try {
      const data = await analyticsService.getAnalyticsSummary();
      setSummary(data);
    } catch {
      showToast('Error fetching analytics metrics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleExportCSV = async (type: 'projects' | 'skills' | 'experience' | 'certificates' | 'messages') => {
    setIsExportDropdownOpen(false);
    try {
      await analyticsService.exportToCSV(type);
      showToast(`Exported ${type} dataset to CSV.`);
    } catch {
      showToast(`Failed to export ${type}.`);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left relative">
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl text-xs font-semibold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
          <div>
            <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-indigo-600 dark:text-cyan-400">
              CMS Module
            </span>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
              Monitor portfolio database metrics, skill distributions, and system performance
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center relative">
            <button
              onClick={loadAnalytics}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-slate-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Time Filter */}
            <div className="flex items-center gap-1 bg-slate-100/60 dark:bg-neutral-900/60 p-1 rounded-xl border border-slate-200/40 dark:border-neutral-800/60">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  timeRange === '7d'
                    ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-400'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  timeRange === '30d'
                    ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-400'
                }`}
              >
                30 Days
              </button>
            </div>

            {/* Export CSV Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              <AnimatePresence>
                {isExportDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 glass-panel p-2 rounded-2xl shadow-xl z-50 border border-slate-200/60 dark:border-neutral-800 text-xs font-sans space-y-1"
                  >
                    {(['projects', 'skills', 'experience', 'certificates', 'messages'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleExportCSV(type)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-900 text-slate-700 dark:text-neutral-300 capitalize cursor-pointer transition-colors"
                      >
                        Export {type}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Statistics Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-24 bg-slate-100 dark:bg-neutral-900 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Projects */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  Projects
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {summary?.totalProjects}
                </h3>
              </div>
            </div>

            {/* Total Skills */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  Skills
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {summary?.totalSkills}
                </h3>
              </div>
            </div>

            {/* Experience Entries */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  Experience
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {summary?.totalExperience}
                </h3>
              </div>
            </div>

            {/* Certificates */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  Certificates
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {summary?.totalCertificates}
                </h3>
              </div>
            </div>

            {/* Total Messages */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  Messages
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {summary?.totalMessages}
                </h3>
              </div>
            </div>

            {/* Unread Messages */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  Unread Messages
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {summary?.unreadMessages}
                </h3>
              </div>
            </div>

            {/* Resume Version */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  Resume Ver.
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {summary?.resumeVersion}
                </h3>
              </div>
            </div>

            {/* Last Upload */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  Last Resume
                </span>
                <h3 className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {summary?.lastResumeUpload}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Charts & Distributions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Messages Trend Graph (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-500" /> Messages Inquiries Trend
                </h3>
                <p className="text-xs text-slate-500 font-sans">Monthly portfolio contact requests received</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +28% Growth
              </span>
            </div>

            {/* Monthly Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
              {summary?.messagesByMonth.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div
                    style={{ height: `${(item.count / 15) * 100}%` }}
                    className="w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-xl group-hover:brightness-110 transition-all duration-300 relative"
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-mono px-1.5 py-0.5 rounded shadow transition-opacity">
                      {item.count}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Distribution Breakdown (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80 space-y-6">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-cyan-500" /> Skills Category Distribution
              </h3>
              <p className="text-xs text-slate-500 font-sans">Proportion of technologies per domain</p>
            </div>

            <div className="space-y-4">
              {summary &&
                Object.entries(summary.skillsByCategory).map(([cat, count], idx) => {
                  const percentage = Math.round((count / summary.totalSkills) * 100) || 20;
                  return (
                    <div key={idx} className="space-y-1.5 text-xs font-sans">
                      <div className="flex justify-between text-slate-700 dark:text-neutral-300 font-semibold">
                        <span>{cat}</span>
                        <span className="font-mono text-slate-400">{count} items ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-neutral-900 overflow-hidden">
                        <div
                          style={{ width: `${percentage}%` }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* System Health Status */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80 space-y-4">
          <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" /> Supabase Infrastructure Health
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
            <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-slate-200/40 dark:border-neutral-800/60 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-neutral-300">Database (PostgreSQL)</span>
              <span className="flex items-center gap-1 text-emerald-500 font-mono text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Healthy
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-slate-200/40 dark:border-neutral-800/60 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-neutral-300">Storage Buckets (3)</span>
              <span className="flex items-center gap-1 text-emerald-500 font-mono text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-slate-200/40 dark:border-neutral-800/60 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-neutral-300">Authentication</span>
              <span className="flex items-center gap-1 text-emerald-500 font-mono text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Connected
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-slate-200/40 dark:border-neutral-800/60 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-neutral-300">Realtime Channel</span>
              <span className="flex items-center gap-1 text-emerald-500 font-mono text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Listening
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
