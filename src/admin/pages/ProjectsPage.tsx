import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  ExternalLink,
  Edit2,
  Trash2,
  FolderGit2,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { projectsService } from '../services/projectsService';
import type { ProjectRecord } from '../services/projectsService';
import { ProjectModal } from '../components/ProjectModal';
import { Select } from '../components/Select';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Featured' | 'Completed' | 'In Progress'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState<ProjectRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadProjects = async () => {
    setRefreshing(true);
    try {
      const data = await projectsService.getProjects();
      // If database returns empty initially, populate demonstration default entries
      if (data.length === 0) {
        setProjects([
          {
            id: 'demo-1',
            title: 'AI Resume Builder',
            slug: 'ai-resume-builder',
            description: 'AI-powered resume builder that generates professional resumes using Gemini AI.',
            image_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop',
            github_url: 'https://github.com',
            live_url: 'https://demo.example.com',
            technologies: ['React.js', 'TypeScript', 'Tailwind', 'Gemini API'],
            featured: true,
            status: 'Completed',
            display_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'demo-2',
            title: 'Portfolio CMS & Dashboard',
            slug: 'portfolio-cms',
            description: 'A developer portfolio platform containing an integrated admin dashboard.',
            image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
            github_url: 'https://github.com',
            live_url: 'https://demo.example.com',
            technologies: ['React.js', 'TypeScript', 'Supabase', 'Tailwind'],
            featured: true,
            status: 'In Progress',
            display_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      } else {
        setProjects(data);
      }
    } catch {
      showToast('Error loading projects from database.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !currentFeatured } : p))
    );

    try {
      if (!id.startsWith('demo-')) {
        await projectsService.toggleFeatured(id, currentFeatured);
      }
      showToast(`Featured state updated for project.`);
    } catch {
      // Revert on error
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: currentFeatured } : p))
      );
      showToast('Failed to update featured status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      if (!deleteTarget.id.startsWith('demo-')) {
        await projectsService.deleteProject(deleteTarget.id);
      }
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast(`Project "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
    } catch {
      showToast('Failed to delete project.');
    } finally {
      setDeleting(false);
    }
  };

  // Filter and Sort logic
  const filteredProjects = projects
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterStatus === 'Featured') return p.featured;
      if (filterStatus === 'Completed') return p.status === 'Completed';
      if (filterStatus === 'In Progress') return p.status === 'In Progress';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
              Projects Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
              Manage live portfolio project entries, feature flags, and storage screenshots
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={loadProjects}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-slate-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setEditingProject(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>
        </div>

        {/* Search, Filter & Sort Bar */}
        <div className="glass-panel p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filter Status Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100/60 dark:bg-neutral-900/60 p-1 rounded-2xl border border-slate-200/40 dark:border-neutral-800/60 self-start md:self-center">
            {(['All', 'Featured', 'Completed', 'In Progress'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium font-sans transition-all cursor-pointer ${
                  filterStatus === tab
                    ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <span className="text-[11px] font-mono text-slate-400">Sort:</span>
            <Select
              value={sortBy}
              onChange={(val) => setSortBy(val as any)}
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'alphabetical', label: 'Alphabetical' }
              ]}
              className="w-36"
            />
          </div>
        </div>

        {/* Projects Table View */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/40 dark:border-neutral-800/80">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-slate-100 dark:bg-neutral-900 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                <FolderGit2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  No projects found
                </h3>
                <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">
                  {searchTerm ? 'No projects matching your search criteria.' : 'Add your first project showcase entry to get started.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Project</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50/80 dark:bg-neutral-900/60 text-slate-400 dark:text-neutral-500 uppercase tracking-widest font-mono border-b border-slate-100 dark:border-neutral-900/80">
                  <tr>
                    <th className="px-6 py-4">Thumbnail</th>
                    <th className="px-6 py-4">Project Title</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Featured</th>
                    <th className="px-6 py-4">Technologies</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-900/60">
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-neutral-900/30 transition-colors"
                    >
                      {/* Thumbnail */}
                      <td className="px-6 py-4">
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-slate-200/40 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900 shrink-0">
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white font-display">
                            {project.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-1 max-w-xs font-light">
                            {project.description}
                          </p>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase ${
                            project.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>

                      {/* Featured Toggle Switch */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleFeatured(project.id, project.featured)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-display uppercase tracking-wider transition-all inline-flex items-center gap-1 cursor-pointer ${
                            project.featured
                              ? 'bg-indigo-500/15 text-indigo-600 dark:text-cyan-400 border border-indigo-500/30 shadow-sm'
                              : 'bg-slate-100 dark:bg-neutral-900 text-slate-400 border border-slate-200/50 dark:border-neutral-800 hover:text-slate-600'
                          }`}
                          title="Click to toggle featured state on public homepage"
                        >
                          <Sparkles className="w-3 h-3" />
                          {project.featured ? 'Featured' : 'Standard'}
                        </button>
                      </td>

                      {/* Technologies */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {project.technologies?.slice(0, 3).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-slate-100 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProject(project);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(project)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 transition-colors"
                              title="Live Link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Project Create/Edit Modal */}
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={loadProjects}
          projectToEdit={editingProject}
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
                    Delete Project?
                  </h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">"{deleteTarget.title}"</span>? This action cannot be undone.
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
