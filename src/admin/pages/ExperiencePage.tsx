import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  RefreshCw,
  Search,
  Briefcase,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { experienceService } from '../services/experienceService';
import type { ExperienceRecord } from '../services/experienceService';
import { ExperienceModal } from '../components/ExperienceModal';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Current' | 'Completed'>('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceRecord | null>(null);

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState<ExperienceRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadExperiences = async () => {
    setRefreshing(true);
    try {
      const data = await experienceService.getExperiences();
      if (data.length === 0) {
        setExperiences([
          {
            id: 'exp-1',
            company: 'Kishkindha University',
            role: 'Python Programming Intern',
            description: 'Learned Python fundamentals, OOP, file handling, and data structures.',
            technologies: ['Python', 'OOP', 'Data Structures'],
            start_date: 'July 2025',
            end_date: 'August 2025',
            current_job: false,
            display_order: 1,
          },
          {
            id: 'exp-2',
            company: 'The Entrepreneurship Network (Limitless Technologies LLP)',
            role: 'React.js Intern - Associate',
            description: 'Built responsive React applications, component architecture, API integration, and clean code practices.',
            technologies: ['React.js', 'TypeScript', 'Tailwind', 'REST APIs'],
            start_date: 'December 2025',
            end_date: 'March 2026',
            current_job: true,
            display_order: 2,
          },
        ]);
      } else {
        setExperiences(data);
      }
    } catch {
      showToast('Error loading experience records from database.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleToggleCurrentJob = async (id: string, currentJob: boolean) => {
    const nextState = !currentJob;
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, current_job: nextState, end_date: nextState ? 'Present' : e.end_date } : e))
    );

    try {
      if (!id.startsWith('exp-')) {
        await experienceService.toggleCurrentJob(id, currentJob);
      }
      showToast('Current position status updated.');
    } catch {
      setExperiences((prev) =>
        prev.map((e) => (e.id === id ? { ...e, current_job: currentJob } : e))
      );
      showToast('Failed to update position status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      if (!deleteTarget.id.startsWith('exp-')) {
        await experienceService.deleteExperience(deleteTarget.id);
      }
      setExperiences((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      showToast(`Experience entry for "${deleteTarget.company}" deleted.`);
      setDeleteTarget(null);
    } catch {
      showToast('Failed to delete experience record.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredExperiences = experiences.filter((e) => {
    const matchesSearch =
      e.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.role.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'Current') return e.current_job;
    if (filterType === 'Completed') return !e.current_job;
    return true;
  });

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
              Experience Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
              Manage internship milestones, career journeys, and role achievements
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={loadExperiences}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-slate-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setEditingExperience(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Experience</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-panel p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company or role..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100/60 dark:bg-neutral-900/60 p-1 rounded-2xl border border-slate-200/40 dark:border-neutral-800/60 self-start md:self-center">
            {(['All', 'Current', 'Completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium font-sans transition-all cursor-pointer ${
                  filterType === tab
                    ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Table View */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/40 dark:border-neutral-800/80">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-16 bg-slate-100 dark:bg-neutral-900 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredExperiences.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto border border-purple-500/20">
                <Briefcase className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  No experience entries found
                </h3>
                <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">
                  {searchTerm ? 'No entries matching search criteria.' : 'Add your first career milestone or internship.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingExperience(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50/80 dark:bg-neutral-900/60 text-slate-400 dark:text-neutral-500 uppercase tracking-widest font-mono border-b border-slate-100 dark:border-neutral-900/80">
                  <tr>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Technologies</th>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-900/60">
                  {filteredExperiences.map((exp) => (
                    <tr
                      key={exp.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-neutral-900/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-purple-500/15">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white font-display">
                            {exp.company}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                        {exp.role}
                      </td>

                      <td className="px-6 py-4 text-slate-500 dark:text-neutral-400 font-mono text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-indigo-500" />
                          {exp.start_date} – {exp.end_date || 'Present'}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleCurrentJob(exp.id, exp.current_job)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-display uppercase tracking-wider transition-all inline-flex items-center gap-1 cursor-pointer ${
                            exp.current_job
                              ? 'bg-indigo-500/15 text-indigo-600 dark:text-cyan-400 border border-indigo-500/30'
                              : 'bg-slate-100 dark:bg-neutral-900 text-slate-400 border border-slate-200/50 dark:border-neutral-800'
                          }`}
                        >
                          {exp.current_job && <Sparkles className="w-3 h-3 text-indigo-500" />}
                          {exp.current_job ? 'Current' : 'Completed'}
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {exp.technologies?.slice(0, 3).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-slate-100 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-slate-500">
                        #{exp.display_order}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingExperience(exp);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                            title="Edit Experience"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(exp)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Experience"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Experience Modal */}
        <ExperienceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={loadExperiences}
          experienceToEdit={editingExperience}
        />

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm glass-panel p-6 rounded-3xl text-left space-y-4 relative border border-rose-500/20"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center border border-rose-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                    Delete Experience Entry?
                  </h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    Are you sure you want to delete experience record for <span className="font-semibold text-slate-800 dark:text-slate-200">"{deleteTarget.company}"</span>?
                  </p>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={deleting}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer shadow-md shadow-rose-500/20 disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
