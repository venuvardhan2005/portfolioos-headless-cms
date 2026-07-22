import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import { highlightsService } from '../services/highlightsService';
import type { HighlightRecord, HighlightInput } from '../services/highlightsService';
import { Select } from './Select';

interface HighlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  highlightToEdit?: HighlightRecord | null;
}

const AVAILABLE_ICONS = [
  'GraduationCap',
  'Briefcase',
  'Cpu',
  'Award',
  'Activity',
  'Code2',
  'Terminal',
  'Atom',
  'Flame',
  'Sparkles',
  'Globe',
  'Database',
  'ShieldCheck',
  'HelpCircle'
] as const;

export const HighlightModal: React.FC<HighlightModalProps> = ({
  isOpen,
  onClose,
  onSave,
  highlightToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [icon, setIcon] = useState<string>('Award');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [visible, setVisible] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (highlightToEdit) {
      setTitle(highlightToEdit.title);
      setValue(highlightToEdit.value);
      setDescription(highlightToEdit.description || '');
      setBadge(highlightToEdit.badge || '');
      setIcon(highlightToEdit.icon || 'Award');
      setDisplayOrder(highlightToEdit.display_order || 0);
      setVisible(highlightToEdit.visible !== false);
    } else {
      resetForm();
    }
  }, [highlightToEdit, isOpen]);

  const resetForm = () => {
    setTitle('');
    setValue('');
    setDescription('');
    setBadge('');
    setIcon('Award');
    setDisplayOrder(0);
    setVisible(true);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const payload: HighlightInput = {
      title,
      value,
      description,
      badge,
      icon,
      display_order: Number(displayOrder),
      visible,
    };

    try {
      if (highlightToEdit) {
        await highlightsService.updateHighlight(highlightToEdit.id, payload);
      } else {
        await highlightsService.createHighlight(payload);
      }
      onSave();
      onClose();
      resetForm();
    } catch (err: any) {
      console.error('[debugging] Error saving highlight:', err);
      setErrorMsg(err?.message || err?.details || 'Failed to save highlight.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl relative my-8 border border-slate-200/50 dark:border-neutral-800 text-left shadow-2xl space-y-6"
        >
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-t-3xl" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-900/60 pb-4">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                {highlightToEdit ? 'Edit Highlight' : 'Add New Highlight'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
                {highlightToEdit ? 'Update highlights configuration parameters' : 'Create an outstanding stat bento card'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-sans">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Highlight Card Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CGPA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Display Value *
                </label>
                <input
                  type="text"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. 8.8 CGPA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Section Badge Label / Category
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Academic status"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Visual Icon Select
                </label>
                <Select
                  value={icon}
                  onChange={(val) => setIcon(val)}
                  options={AVAILABLE_ICONS.map((i) => ({ value: i, label: i }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                Detailed Card Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Excellent performance record in engineering study"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-neutral-900/60">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300 inline-flex items-center gap-1">
                  {visible ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                  Visible on Portfolio
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Order:</span>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-16 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs text-center"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-neutral-900/60">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{highlightToEdit ? 'Save Changes' : 'Create Highlight'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
