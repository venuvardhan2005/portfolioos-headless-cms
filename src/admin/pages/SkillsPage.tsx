import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  RefreshCw,
  Search,
  Cpu,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Code,
  Globe,
  Database,
  Server,
  Terminal
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { skillsService } from '../services/skillsService';
import type { SkillRecord } from '../services/skillsService';
import { SkillModal } from '../components/SkillModal';

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | 'Frontend' | 'Backend' | 'Database' | 'AI & Data' | 'Developer Tools'>('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillRecord | null>(null);

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState<SkillRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadSkills = async () => {
    setRefreshing(true);
    try {
      const data = await skillsService.getSkills();
      if (data.length === 0) {
        setSkills([
          { id: 'sk-1', name: 'React.js', category: 'Frontend', icon: 'Code', display_order: 1, visible: true },
          { id: 'sk-2', name: 'TypeScript', category: 'Frontend', icon: 'Code', display_order: 2, visible: true },
          { id: 'sk-3', name: 'Node.js', category: 'Backend', icon: 'Server', display_order: 3, visible: true },
          { id: 'sk-4', name: 'MongoDB', category: 'Database', icon: 'Database', display_order: 4, visible: true },
          { id: 'sk-5', name: 'Gemini API', category: 'AI & Data', icon: 'Cpu', display_order: 5, visible: true },
          { id: 'sk-6', name: 'Git & GitHub', category: 'Developer Tools', icon: 'Terminal', display_order: 6, visible: true },
        ]);
      } else {
        setSkills(data);
      }
    } catch {
      showToast('Error loading skills from database.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleToggleVisible = async (id: string, currentVisible?: boolean) => {
    const nextState = currentVisible === false;

    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: nextState } : s))
    );

    try {
      if (!id.startsWith('sk-')) {
        await skillsService.toggleVisibility(id, currentVisible ?? true);
      }
      showToast(`Skill visibility updated.`);
    } catch {
      setSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, visible: currentVisible } : s))
      );
      showToast('Failed to update skill visibility.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      if (!deleteTarget.id.startsWith('sk-')) {
        await skillsService.deleteSkill(deleteTarget.id);
      }
      setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      showToast(`Skill "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch {
      showToast('Failed to delete skill.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredSkills = skills.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterCategory !== 'All' && s.category !== filterCategory) return false;
    return true;
  });

  const getSkillIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'code': return Code;
      case 'globe': return Globe;
      case 'database': return Database;
      case 'server': return Server;
      case 'terminal': return Terminal;
      default: return Cpu;
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
              Skills Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
              Manage technologies, categories, and icons rendered across your portfolio matrix
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={loadSkills}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-slate-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setEditingSkill(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
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
              placeholder="Search skills by name..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-slate-100/60 dark:bg-neutral-900/60 p-1 rounded-2xl border border-slate-200/40 dark:border-neutral-800/60 self-start md:self-center">
            {(['All', 'Frontend', 'Backend', 'Database', 'AI & Data', 'Developer Tools'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium font-sans transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Table View */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/40 dark:border-neutral-800/80">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-14 bg-slate-100 dark:bg-neutral-900 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center mx-auto border border-cyan-500/20">
                <Cpu className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  No skills found
                </h3>
                <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">
                  {searchTerm ? 'No skills matching search terms.' : 'Add your first skill entry.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingSkill(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50/80 dark:bg-neutral-900/60 text-slate-400 dark:text-neutral-500 uppercase tracking-widest font-mono border-b border-slate-100 dark:border-neutral-900/80">
                  <tr>
                    <th className="px-6 py-4">Icon</th>
                    <th className="px-6 py-4">Skill Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Display Order</th>
                    <th className="px-6 py-4">Visible</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-900/60">
                  {filteredSkills.map((skill) => {
                    const IconComp = getSkillIcon(skill.icon || 'Cpu');
                    return (
                      <tr
                        key={skill.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-neutral-900/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-indigo-500/15">
                            <IconComp className="w-4 h-4" />
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-900 dark:text-white font-display">
                            {skill.name}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 border border-slate-200/50 dark:border-neutral-800">
                            {skill.category}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-mono text-slate-500">
                          #{skill.display_order}
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleVisible(skill.id, skill.visible)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-display uppercase tracking-wider transition-all inline-flex items-center gap-1 cursor-pointer ${
                              skill.visible !== false
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-100 dark:bg-neutral-900 text-slate-400 border border-slate-200/50 dark:border-neutral-800'
                            }`}
                          >
                            {skill.visible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            {skill.visible !== false ? 'Visible' : 'Hidden'}
                          </button>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingSkill(skill);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                              title="Edit Skill"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeleteTarget(skill)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Delete Skill"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Skill Create/Edit Modal */}
        <SkillModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={loadSkills}
          skillToEdit={editingSkill}
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
                    Delete Skill?
                  </h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">"{deleteTarget.name}"</span>?
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
