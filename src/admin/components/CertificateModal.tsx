import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Link as LinkIcon, FileText, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { certificatesService } from '../services/certificatesService';
import type { CertificateRecord, CertificateInput } from '../services/certificatesService';
import { Select } from './Select';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  certificateToEdit?: CertificateRecord | null;
}

const CATEGORIES = ['Internship', 'Certification', 'Achievement'] as const;

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  certificateToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState<'Certification' | 'Internship' | 'Achievement'>('Internship');
  const [issueDate, setIssueDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [verifyUrl, setVerifyUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [visible, setVisible] = useState(true);

  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (certificateToEdit) {
      setTitle(certificateToEdit.title);
      setOrganization(certificateToEdit.organization);
      setCategory(certificateToEdit.category || 'Internship');
      setIssueDate(certificateToEdit.issue_date || '');
      setCredentialId(certificateToEdit.credential_id || '');
      setVerifyUrl(certificateToEdit.verify_url || '');
      setImageUrl(certificateToEdit.image_url || '');
      setPdfUrl(certificateToEdit.pdf_url || '');
      setDisplayOrder(certificateToEdit.display_order || 0);
      setVisible(certificateToEdit.visible !== false);
    } else {
      resetForm();
    }
  }, [certificateToEdit, isOpen]);

  const resetForm = () => {
    setTitle('');
    setOrganization('');
    setCategory('Internship');
    setIssueDate('');
    setCredentialId('');
    setVerifyUrl('');
    setImageUrl('');
    setPdfUrl('');
    setDisplayOrder(0);
    setVisible(true);
    setErrorMsg(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    setErrorMsg(null);

    try {
      const url = await certificatesService.uploadImage(file);
      setImageUrl(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Image upload failed.';
      setErrorMsg(`Image Upload error: ${message}`);
    } finally {
      setUploadingImg(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    setErrorMsg(null);

    try {
      const url = await certificatesService.uploadPdf(file);
      setPdfUrl(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'PDF upload failed.';
      setErrorMsg(`PDF Upload error: ${message}`);
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const payload: CertificateInput = {
      title,
      organization,
      category,
      issue_date: issueDate,
      credential_id: credentialId,
      verify_url: verifyUrl,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
      pdf_url: pdfUrl,
      display_order: Number(displayOrder),
      visible,
    };

    try {
      if (certificateToEdit) {
        await certificatesService.updateCertificate(certificateToEdit.id, payload);
      } else {
        await certificatesService.createCertificate(payload);
      }
      onSave();
      onClose();
      resetForm();
    } catch (err: any) {
      console.error('Database Certificate Error:', err);
      const message = err?.message || err?.details || 'Failed to save certificate.';
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
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-indigo-500 rounded-t-3xl" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-900/60 pb-4">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                {certificateToEdit ? 'Edit Certificate' : 'Add New Certificate'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
                {certificateToEdit ? 'Update certificate details and verification credentials' : 'Add an internship or course completion credential'}
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
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. React.js Internship Certificate"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. The Entrepreneurship Network"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Category
                </label>
                <Select
                  value={category}
                  onChange={(val) => setCategory(val as any)}
                  options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Issue Date *
                </label>
                <input
                  type="text"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  placeholder="March 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Credential ID
                </label>
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="TEN-REC-2026-894"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-semibold uppercase text-slate-400 flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-indigo-500" /> Verification URL
              </label>
              <input
                type="url"
                value={verifyUrl}
                onChange={(e) => setVerifyUrl(e.target.value)}
                placeholder="https://verify.example.com/credential/123"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Certificate Image (certificate-images)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900 overflow-hidden shrink-0 flex items-center justify-center">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <label className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 border border-slate-200/60 dark:border-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-300 cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                    {uploadingImg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-indigo-500" />}
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* PDF Upload */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">
                  Certificate PDF (resume bucket)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-indigo-500" />
                  </div>
                  <label className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 border border-slate-200/60 dark:border-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-300 cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                    {uploadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-cyan-500" />}
                    <span>Upload PDF</span>
                    <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
                  </label>
                </div>
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
                disabled={submitting || uploadingImg || uploadingPdf}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{certificateToEdit ? 'Save Changes' : 'Add Certificate'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
