import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  HelpCircle
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { highlightsService } from '../services/highlightsService';
import type { HighlightRecord } from '../services/highlightsService';
import { HighlightModal } from '../components/HighlightModal';

export default function HighlightsPage() {
  const [highlights, setHighlights] = useState<HighlightRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<HighlightRecord | null>(null);
  
  // Delete dialog states
  const [deleteTarget, setDeleteTarget] = useState<HighlightRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadHighlights = async () => {
    setRefreshing(true);
    try {
      const data = await highlightsService.getHighlights();
      setHighlights(data);
    } catch {
      showToast('Error loading highlights from database.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHighlights();
  }, []);

  const handleToggleVisible = async (id: string, currentVisible: boolean) => {
    const nextState = !currentVisible;
    setHighlights((prev) =>
      prev.map((h) => (h.id === id ? { ...h, visible: nextState } : h))
    );

    try {
      if (!id.startsWith('highlight-')) {
        await highlightsService.toggleVisibility(id, currentVisible);
      }
      showToast(`Highlight visibility updated.`);
    } catch {
      setHighlights((prev) =>
        prev.map((h) => (h.id === id ? { ...h, visible: currentVisible } : h))
      );
      showToast('Failed to update visibility.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      if (!deleteTarget.id.startsWith('highlight-')) {
        await highlightsService.deleteHighlight(deleteTarget.id);
      }
      setHighlights((prev) => prev.filter((h) => h.id !== deleteTarget.id));
      showToast(`Highlight "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
    } catch {
      showToast('Failed to delete highlight.');
    } finally {
      setDeleting(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= highlights.length) return;

    const list = [...highlights];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // Recalculate display_order
    const updated = list.map((item, idx) => ({
      ...item,
      display_order: idx + 1,
    }));

    setHighlights(updated);

    try {
      await highlightsService.updateDisplayOrders(
        updated.map((item) => ({ id: item.id, display_order: item.display_order }))
      );
      showToast('Highlights display order updated.');
    } catch {
      showToast('Failed to update display order.');
    }
  };

  const filteredHighlights = highlights.filter((h) =>
    h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
          <div>
            <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-indigo-600 dark:text-cyan-400">
              CMS Module
            </span>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Highlights & Stats
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
              Manage the key stats / bento grid cards displayed in the About section of your public portfolio
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={loadHighlights}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-slate-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh highlights list"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setSelectedHighlight(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Highlight</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or value..."
            className="w-full bg-transparent border-none text-xs focus:outline-none text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Highlights Table View */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/40 dark:border-neutral-800/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-neutral-900 bg-slate-50/50 dark:bg-neutral-900/30 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-4 px-6 font-semibold">Icon</th>
                  <th className="py-4 px-6 font-semibold">Highlight Value</th>
                  <th className="py-4 px-6 font-semibold">Title</th>
                  <th className="py-4 px-6 font-semibold">Badge</th>
                  <th className="py-4 px-6 font-semibold text-center">Visibility</th>
                  <th className="py-4 px-6 font-semibold text-center">Reorder</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-900/60 font-sans">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-light">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                        <span>Loading highlights...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredHighlights.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-light">
                      No highlights cards found. Add one to populate the bento grid!
                    </td>
                  </tr>
                ) : (
                  filteredHighlights.map((highlight, index) => {
                    const LucideIcon = (Icons as any)[highlight.icon] || HelpCircle;
                    return (
                      <tr
                        key={highlight.id}
                        className="hover:bg-slate-50/30 dark:hover:bg-neutral-900/10 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-neutral-900/60 flex items-center justify-center border border-indigo-100/20">
                            <LucideIcon className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">
                          {highlight.value}
                        </td>
                        <td className="py-4 px-6 text-slate-500 dark:text-neutral-400">
                          {highlight.title}
                        </td>
                        <td className="py-4 px-6">
                          {highlight.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 border border-slate-200/10">
                              {highlight.badge}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleToggleVisible(highlight.id, highlight.visible)}
                            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer inline-flex"
                          >
                            {highlight.visible ? (
                              <Eye className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleMove(index, 'up')}
                              disabled={index === 0}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-neutral-900 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5 text-slate-500" />
                            </button>
                            <button
                              onClick={() => handleMove(index, 'down')}
                              disabled={index === highlights.length - 1}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-neutral-900 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedHighlight(highlight);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(highlight)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal form */}
        <HighlightModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={loadHighlights}
          highlightToEdit={selectedHighlight}
        />

        {/* Delete Dialog */}
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
                    Delete Highlight Card?
                  </h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    This will permanently delete the stat card "{deleteTarget.title}" from your database.
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
