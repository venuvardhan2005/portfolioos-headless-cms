import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import { skillsService } from '../services/skillsService';
import type { SkillRecord, SkillInput } from '../services/skillsService';
import { Select } from './Select';

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  skillToEdit?: SkillRecord | null;
}

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'AI & Data', 'Developer Tools'] as const;

export const SkillModal: React.FC<SkillModalProps> = ({
  isOpen,
  onClose,
  onSave,
  skillToEdit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Frontend' | 'Backend' | 'Database' | 'AI & Data' | 'Developer Tools'>('Frontend');
  const [icon, setIcon] = useState('Cpu');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [visible, setVisible] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (skillToEdit) {
      setName(skillToEdit.name);
      setCategory(skillToEdit.category || 'Frontend');
      setIcon(skillToEdit.icon || 'Cpu');
      setDisplayOrder(skillToEdit.display_order || 0);
      setVisible(skillToEdit.visible !== false);
    } else {
      resetForm();
    }
  }, [skillToEdit, isOpen]);

  const resetForm = () => {
    setName('');
    setCategory('Frontend');
    setIcon('Cpu');
    setDisplayOrder(0);
    setVisible(true);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const payload: SkillInput = {
      name,
      category,
      icon: icon || 'Cpu',
      display_order: Number(displayOrder),
      visible,
    };

    try {
      if (skillToEdit) {
        await skillsService.updateSkill(skillToEdit.id, payload);
      } else {
        await skillsService.createSkill(payload);
      }
      onSave();
      onClose();
      resetForm();
    } catch (err: any) {
      console.error('Database Skill Error:', err);
      const message = err?.message || err?.details || 'Failed to save skill.';
      setErrorMsg(message);
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
          className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl relative my-8 border border-slate-200/50 dark:border-neutral-800 text-left shadow-2xl space-y-6"
        >
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-t-3xl" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-900/60 pb-4">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                {skillToEdit ? 'Edit Technology Skill' : 'Add New Technology Skill'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
                {skillToEdit ? 'Update technology item parameters' : 'Define a new skill item to render on your portfolio matrix'}
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
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                Skill Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. React.js, TypeScript, Node.js"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Category *
                </label>
                <Select
                  value={category}
                  onChange={(val) => setCategory(val as any)}
                  options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Icon Identifier / Code
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="Cpu, Code, Globe, Database"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
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
                <span>{skillToEdit ? 'Save Changes' : 'Add Skill'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
