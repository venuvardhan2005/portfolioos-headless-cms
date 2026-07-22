import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Briefcase } from 'lucide-react';
import { experienceService } from '../services/experienceService';
import type { ExperienceRecord, ExperienceInput } from '../services/experienceService';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  experienceToEdit?: ExperienceRecord | null;
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  experienceToEdit,
}) => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentJob, setCurrentJob] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (experienceToEdit) {
      setCompany(experienceToEdit.company);
      setRole(experienceToEdit.role);
      setDescription(experienceToEdit.description || '');
      setTechInput(experienceToEdit.technologies ? experienceToEdit.technologies.join(', ') : '');
      setStartDate(experienceToEdit.start_date || '');
      setEndDate(experienceToEdit.end_date || '');
      setCurrentJob(experienceToEdit.current_job || false);
      setDisplayOrder(experienceToEdit.display_order || 0);
    } else {
      resetForm();
    }
  }, [experienceToEdit, isOpen]);

  const resetForm = () => {
    setCompany('');
    setRole('');
    setDescription('');
    setTechInput('');
    setStartDate('');
    setEndDate('');
    setCurrentJob(false);
    setDisplayOrder(0);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const techArray = techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload: ExperienceInput = {
      company,
      role,
      description,
      technologies: techArray.length > 0 ? techArray : ['React.js', 'API Integration'],
      start_date: startDate,
      end_date: currentJob ? 'Present' : endDate,
      current_job: currentJob,
      display_order: Number(displayOrder),
    };

    try {
      if (experienceToEdit) {
        await experienceService.updateExperience(experienceToEdit.id, payload);
      } else {
        await experienceService.createExperience(payload);
      }
      onSave();
      onClose();
      resetForm();
    } catch (err: any) {
      console.error('Database Experience Error:', err);
      const message = err?.message || err?.details || 'Failed to save experience.';
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
          className="w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl relative my-8 border border-slate-200/50 dark:border-neutral-800 text-left shadow-2xl space-y-6"
        >
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-3xl" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-900/60 pb-4">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                {experienceToEdit ? 'Edit Experience' : 'Add New Experience'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
                {experienceToEdit ? 'Update role, company and milestone highlights' : 'Add an internship or professional job entry'}
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
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Kishkindha University, TEN"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. React.js Intern - Associate"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Start Date *
                </label>
                <input
                  type="text"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="July 2025"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  End Date
                </label>
                <input
                  type="text"
                  disabled={currentJob}
                  value={currentJob ? 'Present' : endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="August 2025 or Present"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                Description / Highlights
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Bullet points and learning outcomes achieved..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                Technologies (Comma Separated)
              </label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="React.js, Component Architecture, REST APIs"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-neutral-900/60">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={currentJob}
                  onChange={(e) => setCurrentJob(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300 inline-flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" /> Current Position
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
                <span>{experienceToEdit ? 'Save Changes' : 'Add Experience'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
