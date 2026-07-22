import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  RefreshCw,
  Eye,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Calendar,
  HardDrive
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { resumeService } from '../services/resumeService';
import type { ResumeRecord } from '../services/resumeService';
import { usePublicPortfolio } from '../../context/PublicPortfolioContext';

export default function ResumePage() {
  const { refetch } = usePublicPortfolio();
  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [versionInput, setVersionInput] = useState('v1.0.0');

  // Delete states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadResume = async () => {
    setRefreshing(true);
    setErrorMsg(null);
    try {
      const record = await resumeService.getResume();
      if (!record) {
        // Demonstration default placeholder if database is empty
        setResume({
          id: 'res-demo',
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          version: 'v1.0.0',
          file_name: 'P_Venu_Vardhan_Shetty_Resume.pdf',
          file_size: '1.24 MB',
          uploaded_at: new Date().toISOString(),
        });
      } else {
        setResume(record);
        if (record.version) setVersionInput(record.version);
      }
    } catch {
      showToast('Error loading resume record.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMsg('Invalid file format. Only PDF files are accepted.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File exceeds 10 MB maximum size limit.');
      return;
    }

    setUploading(true);
    setErrorMsg(null);

    try {
      const updatedRecord = await resumeService.uploadResume(file, versionInput);
      setResume(updatedRecord);
      showToast('Resume PDF successfully uploaded and updated!');
      console.log('[debugging] Upload success, refetching public context...');
      await refetch();
      console.log('[debugging] Upload refresh complete.');
    } catch (err: any) {
      console.error('Database Resume Upload Error:', err);
      const msg = err?.message || err?.details || 'Failed to upload resume file.';
      setErrorMsg(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!resume) return;

    setDeleting(true);
    try {
      if (!resume.id.startsWith('res-')) {
        await resumeService.deleteResume(resume.id, resume.file_url);
      }
      setResume(null);
      showToast('Resume deleted successfully.');
      console.log('[debugging] Delete success, refetching public context...');
      await refetch();
      console.log('[debugging] Delete refresh complete.');
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      console.error('Database Resume Delete Error:', err);
      setErrorMsg(err?.message || err?.details || 'Failed to delete resume record.');
    } finally {
      setDeleting(false);
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
              Resume Manager
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
              Manage and replace the official PDF resume linked across public CTA buttons
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={loadResume}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-slate-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Record"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <label className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 transition-all cursor-pointer">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{resume ? 'Replace Resume' : 'Upload Resume'}</span>
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-sans">
            {errorMsg}
          </div>
        )}

        {/* Main Content Area */}
        {loading ? (
          <div className="glass-panel p-8 rounded-3xl space-y-4">
            <div className="h-20 bg-slate-100 dark:bg-neutral-900 rounded-2xl animate-pulse" />
          </div>
        ) : !resume ? (
          /* Empty State */
          <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-500/20">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                No active resume file
              </h3>
              <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">
                Upload your official PDF resume to populate public download links on your portfolio.
              </p>
            </div>
            <label className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Upload PDF Resume</span>
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        ) : (
          /* Resume Details Card */
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-neutral-900/60 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
                      {resume.file_name || 'Official_Resume.pdf'}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
                      {resume.version || 'v1.0.0'}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Target Bucket: <span className="text-slate-600 dark:text-neutral-300">resume</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <a
                  href={resume.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Preview</span>
                </a>

                <a
                  href={resume.file_url}
                  download
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Download</span>
                </a>

                <label className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace</span>
                  <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                </label>

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-neutral-900/40 border border-slate-200/40 dark:border-neutral-800/60 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-500" /> Upload Date
                </span>
                <p className="font-bold font-mono text-slate-800 dark:text-slate-200">
                  {new Date(resume.uploaded_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-neutral-900/40 border border-slate-200/40 dark:border-neutral-800/60 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-cyan-500" /> Estimated File Size
                </span>
                <p className="font-bold font-mono text-slate-800 dark:text-slate-200">
                  {resume.file_size || '~1.2 MB'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-neutral-900/40 border border-slate-200/40 dark:border-neutral-800/60 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400">Version Identifier</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={versionInput}
                    onChange={(e) => setVersionInput(e.target.value)}
                    className="w-20 px-2 py-0.5 text-xs rounded border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 font-mono text-center"
                  />
                  <span className="text-[10px] text-slate-400">PDF standard</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {isDeleteModalOpen && (
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
                    Delete Resume?
                  </h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    This will remove your PDF resume file from storage and clear public download triggers.
                  </p>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
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
