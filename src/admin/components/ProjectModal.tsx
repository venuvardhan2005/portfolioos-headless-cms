import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Sparkles, Loader2, Link as LinkIcon, FolderGit2, Image as ImageIcon } from 'lucide-react';
import { projectsService } from '../services/projectsService';
import type { ProjectRecord, ProjectInput } from '../services/projectsService';
import { Select } from './Select';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  projectToEdit?: ProjectRecord | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [techInput, setTechInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'Completed' | 'In Progress' | 'Beta'>('Completed');
  const [displayOrder, setDisplayOrder] = useState(0);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setSlug(projectToEdit.slug);
      setDescription(projectToEdit.description || '');
      setImageUrl(projectToEdit.image_url || '');
      setGithubUrl(projectToEdit.github_url || '');
      setLiveUrl(projectToEdit.live_url || '');
      setTechInput(projectToEdit.technologies ? projectToEdit.technologies.join(', ') : '');
      setFeatured(projectToEdit.featured);
      setStatus(projectToEdit.status || 'Completed');
      setDisplayOrder(projectToEdit.display_order || 0);
    } else {
      resetForm();
    }
  }, [projectToEdit, isOpen]);

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setDescription('');
    setImageUrl('');
    setGithubUrl('');
    setLiveUrl('');
    setTechInput('');
    setFeatured(false);
    setStatus('Completed');
    setDisplayOrder(0);
    setErrorMsg(null);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!projectToEdit) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg(null);

    try {
      const url = await projectsService.uploadImage(file);
      setImageUrl(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Image upload failed.';
      setErrorMsg(`Upload failed: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const techArray = techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload: ProjectInput = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
      github_url: githubUrl,
      live_url: liveUrl,
      technologies: techArray.length > 0 ? techArray : ['React.js', 'TypeScript'],
      featured,
      status,
      display_order: Number(displayOrder),
    };

    try {
      if (projectToEdit) {
        await projectsService.updateProject(projectToEdit.id, payload);
      } else {
        await projectsService.createProject(payload);
      }
      onSave();
      onClose();
      resetForm();
    } catch (err: any) {
      console.error('Database Project Error:', err);
      const message = err?.message || err?.details || 'Failed to save project.';
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
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-t-3xl" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-900/60 pb-4">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                {projectToEdit ? 'Edit Project' : 'Create New Project'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
                {projectToEdit ? 'Update project specifications and live metadata' : 'Add a new project showcase to your portfolio'}
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
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. AI Resume Builder"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Slug (URL identifier)
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ai-resume-builder"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description highlighting problem solved and features built..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Image upload & URL */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                Project Preview Image
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-32 h-20 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900 overflow-hidden relative group shrink-0 flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 border border-slate-200/60 dark:border-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-300 cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                      {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-indigo-500" />}
                      <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">Target: project-images bucket</span>
                  </div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or paste external image URL..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400 flex items-center gap-1">
                  <FolderGit2 className="w-3 h-3" /> GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" /> Live Demo URL
                </label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://demo.example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Tech Tags & Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="React.js, TypeScript, Tailwind CSS, Gemini API"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Status
                </label>
                <Select
                  value={status}
                  onChange={(val) => setStatus(val as any)}
                  options={[
                    { value: 'Completed', label: 'Completed' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Beta', label: 'Beta' }
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300 inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Feature on Homepage
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
                disabled={submitting || uploading}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{projectToEdit ? 'Save Changes' : 'Create Project'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
