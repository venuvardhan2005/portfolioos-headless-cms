import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  RefreshCw,
  Search,
  Award,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { certificatesService } from '../services/certificatesService';
import type { CertificateRecord } from '../services/certificatesService';
import { CertificateModal } from '../components/CertificateModal';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | 'Internship' | 'Certification' | 'Achievement'>('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<CertificateRecord | null>(null);

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState<CertificateRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadCertificates = async () => {
    setRefreshing(true);
    try {
      const data = await certificatesService.getCertificates();
      if (data.length === 0) {
        setCertificates([
          {
            id: 'cert-1',
            title: 'React.js Development Internship',
            organization: 'The Entrepreneurship Network',
            category: 'Internship',
            image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
            credential_id: 'TEN-REC-2026-894',
            issue_date: 'March 2026',
            verify_url: 'https://verify.example.com',
            display_order: 1,
            visible: true,
          },
          {
            id: 'cert-2',
            title: 'Python Programming Internship',
            organization: 'Kishkindha University',
            category: 'Internship',
            image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
            credential_id: 'KU-PY-2025-104',
            issue_date: 'August 2025',
            verify_url: 'https://verify.example.com',
            display_order: 2,
            visible: true,
          },
        ]);
      } else {
        setCertificates(data);
      }
    } catch {
      showToast('Error loading certificate records from database.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleToggleVisible = async (id: string, currentVisible?: boolean) => {
    const nextState = currentVisible === false;
    setCertificates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: nextState } : c))
    );

    try {
      if (!id.startsWith('cert-')) {
        await certificatesService.toggleVisibility(id, currentVisible ?? true);
      }
      showToast('Certificate visibility updated.');
    } catch {
      setCertificates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, visible: currentVisible } : c))
      );
      showToast('Failed to update certificate visibility.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      if (!deleteTarget.id.startsWith('cert-')) {
        await certificatesService.deleteCertificate(deleteTarget.id);
      }
      setCertificates((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast(`Certificate "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
    } catch {
      showToast('Failed to delete certificate.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredCertificates = certificates.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterCategory !== 'All' && c.category !== filterCategory) return false;
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
              Certificates Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
              Manage certifications, internship credentials, and downloadable PDFs
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={loadCertificates}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-slate-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setEditingCertificate(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Certificate</span>
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
              placeholder="Search title or organization..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100/60 dark:bg-neutral-900/60 p-1 rounded-2xl border border-slate-200/40 dark:border-neutral-800/60 self-start md:self-center">
            {(['All', 'Internship', 'Certification', 'Achievement'] as const).map((cat) => (
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

        {/* Table View */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/40 dark:border-neutral-800/80">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-16 bg-slate-100 dark:bg-neutral-900 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  No certificates found
                </h3>
                <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">
                  {searchTerm ? 'No certificates matching search terms.' : 'Add your first certificate preview record.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCertificate(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Certificate</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50/80 dark:bg-neutral-900/60 text-slate-400 dark:text-neutral-500 uppercase tracking-widest font-mono border-b border-slate-100 dark:border-neutral-900/80">
                  <tr>
                    <th className="px-6 py-4">Thumbnail</th>
                    <th className="px-6 py-4">Certificate Title</th>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Credential ID</th>
                    <th className="px-6 py-4">Visible</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-900/60">
                  {filteredCertificates.map((cert) => (
                    <tr
                      key={cert.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-neutral-900/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200/40 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900 shrink-0">
                          <img
                            src={cert.image_url}
                            alt={cert.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white font-display">
                        {cert.title}
                      </td>

                      <td className="px-6 py-4 text-slate-600 dark:text-neutral-300 font-medium">
                        {cert.organization}
                      </td>

                      <td className="px-6 py-4 text-slate-500 dark:text-neutral-400 font-mono text-[11px]">
                        {cert.issue_date}
                      </td>

                      <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                        {cert.credential_id || 'N/A'}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleVisible(cert.id, cert.visible)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-display uppercase tracking-wider transition-all inline-flex items-center gap-1 cursor-pointer ${
                            cert.visible !== false
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-100 dark:bg-neutral-900 text-slate-400 border border-slate-200/50 dark:border-neutral-800'
                          }`}
                        >
                          {cert.visible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {cert.visible !== false ? 'Visible' : 'Hidden'}
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCertificate(cert);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                            title="Edit Certificate"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(cert)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Certificate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {cert.verify_url && (
                            <a
                              href={cert.verify_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 transition-colors"
                              title="Verify Credential"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}

                          {cert.pdf_url && (
                            <a
                              href={cert.pdf_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 transition-colors"
                              title="View PDF"
                            >
                              <FileText className="w-4 h-4" />
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

        {/* Certificate Modal */}
        <CertificateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={loadCertificates}
          certificateToEdit={editingCertificate}
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
                    Delete Certificate?
                  </h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">"{deleteTarget.title}"</span>?
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
