import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Share2,
  Globe,
  Palette,
  HardDrive,
  Save,
  Loader2,
  Upload,
  CheckCircle2,
  Download,
  RotateCcw,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { settingsService, defaultSettings } from '../services/settingsService';
import type { ProfileSettings } from '../services/settingsService';
import { Select } from '../components/Select';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'contact' | 'social' | 'seo' | 'theme' | 'system'>('profile');
  const [formData, setFormData] = useState<ProfileSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setFormData(data);
    } catch {
      showToast('Error loading settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (field: keyof ProfileSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const url = await settingsService.uploadImage(file, 'avatars');
      handleChange('avatar_url', url);
      showToast('Avatar image uploaded!');
    } catch {
      showToast('Failed to upload profile image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingOg(true);
    try {
      const url = await settingsService.uploadImage(file, 'og_images');
      handleChange('og_image_url', url);
      showToast('OpenGraph image uploaded!');
    } catch {
      showToast('Failed to upload OpenGraph image.');
    } finally {
      setUploadingOg(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.saveSettings(formData);
      showToast('Settings saved successfully!');
    } catch (err: any) {
      console.error('Database Settings Save Error:', err);
      const msg = err?.message || err?.details || 'Failed to save settings.';
      showToast(`Error: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(defaultSettings);
    showToast('Settings reset to default values.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setFormData({ ...defaultSettings, ...json });
        showToast('Settings imported successfully!');
      } catch {
        showToast('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
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
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-indigo-600 dark:text-cyan-400">
                CMS Configuration
              </span>
              <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Portfolio Settings
              </h1>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
                Manage personal branding, SEO metadata, theme parameters, and system backups
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={loadSettings}
                className="p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-slate-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                title="Reload Settings"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* Settings Tabs Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 glass-panel p-1.5 rounded-2xl border border-slate-200/40 dark:border-neutral-800/80">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'contact', label: 'Contact', icon: Mail },
              { id: 'social', label: 'Social Links', icon: Share2 },
              { id: 'seo', label: 'SEO & Meta', icon: Globe },
              { id: 'theme', label: 'Theme', icon: Palette },
              { id: 'system', label: 'System', icon: HardDrive },
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium font-sans flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                      : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Sections */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-14 bg-slate-100 dark:bg-neutral-900 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* 1. PROFILE SECTION */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h2 className="text-base font-bold font-display text-slate-900 dark:text-white border-b border-slate-100 dark:border-neutral-900 pb-3">
                      Profile & Branding Parameters
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-4">
                      <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 overflow-hidden shrink-0 relative group">
                        <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-2 text-center sm:text-left">
                        <label className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-300 border border-slate-200/60 dark:border-neutral-800 cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                          {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-indigo-500" />}
                          <span>Upload Photo</span>
                          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                        </label>
                        <p className="text-[11px] text-slate-400 font-sans">
                          JPEG, PNG or WEBP (Max 5MB) to 'profile-images' storage bucket
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">Full Name</label>
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => handleChange('full_name', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">Professional Role</label>
                        <input
                          type="text"
                          value={formData.role}
                          onChange={(e) => handleChange('role', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">Hero Headline Title</label>
                      <input
                        type="text"
                        value={formData.hero_title}
                        onChange={(e) => handleChange('hero_title', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">Hero Subtitle</label>
                      <input
                        type="text"
                        value={formData.hero_subtitle}
                        onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">About Me Biography</label>
                      <textarea
                        rows={4}
                        value={formData.about_me}
                        onChange={(e) => handleChange('about_me', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.availability_status}
                          onChange={(e) => handleChange('availability_status', e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300 inline-flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Open for Opportunities / Hire Availability Badge
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 2. CONTACT SECTION */}
                {activeTab === 'contact' && (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold font-display text-slate-900 dark:text-white border-b border-slate-100 dark:border-neutral-900 pb-3">
                      Contact Info & Professional Platforms
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">Phone Number</label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">Location</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleChange('location', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">LeetCode Profile</label>
                        <input
                          type="url"
                          value={formData.leetcode}
                          onChange={(e) => handleChange('leetcode', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">HackerRank Profile</label>
                        <input
                          type="url"
                          value={formData.hackerrank}
                          onChange={(e) => handleChange('hackerrank', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SOCIAL LINKS SECTION */}
                {activeTab === 'social' && (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold font-display text-slate-900 dark:text-white border-b border-slate-100 dark:border-neutral-900 pb-3">
                      Social Network Links
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">GitHub URL</label>
                        <input
                          type="url"
                          value={formData.github}
                          onChange={(e) => handleChange('github', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">LinkedIn URL</label>
                        <input
                          type="url"
                          value={formData.linkedin}
                          onChange={(e) => handleChange('linkedin', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">Instagram Handle / URL</label>
                        <input
                          type="url"
                          value={formData.instagram}
                          onChange={(e) => handleChange('instagram', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">X (Twitter) URL</label>
                        <input
                          type="url"
                          value={formData.twitter}
                          onChange={(e) => handleChange('twitter', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">YouTube Channel URL</label>
                        <input
                          type="url"
                          value={formData.youtube}
                          onChange={(e) => handleChange('youtube', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">Public Portfolio URL</label>
                        <input
                          type="url"
                          value={formData.portfolio_url}
                          onChange={(e) => handleChange('portfolio_url', e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. SEO SECTION */}
                {activeTab === 'seo' && (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold font-display text-slate-900 dark:text-white border-b border-slate-100 dark:border-neutral-900 pb-3">
                      Search Engine Optimization & Metadata
                    </h2>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">Website Title Tag</label>
                      <input
                        type="text"
                        value={formData.seo_title}
                        onChange={(e) => handleChange('seo_title', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">Meta Description</label>
                      <textarea
                        rows={3}
                        value={formData.seo_description}
                        onChange={(e) => handleChange('seo_description', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">SEO Keywords (Comma Separated)</label>
                      <input
                        type="text"
                        value={formData.seo_keywords}
                        onChange={(e) => handleChange('seo_keywords', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">OpenGraph Social Preview Image</label>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-14 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900 overflow-hidden shrink-0">
                          {formData.og_image_url && <img src={formData.og_image_url} alt="OG" className="w-full h-full object-cover" />}
                        </div>
                        <label className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-300 border border-slate-200/60 dark:border-neutral-800 cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                          {uploadingOg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-cyan-500" />}
                          <span>Upload OG Image</span>
                          <input type="file" accept="image/*" onChange={handleOgUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. THEME SECTION */}
                {activeTab === 'theme' && (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold font-display text-slate-900 dark:text-white border-b border-slate-100 dark:border-neutral-900 pb-3">
                      Design System & Visual Theme Configuration
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">Default Color Mode</label>
                        <Select
                          value={formData.default_theme}
                          onChange={(val) => handleChange('default_theme', val as any)}
                          options={[
                            { value: 'dark', label: 'Dark Theme (Default)' },
                            { value: 'light', label: 'Light Premium Theme' },
                            { value: 'system', label: 'System Preference' }
                          ]}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-semibold uppercase text-slate-400">Accent Color Hex</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.accent_color}
                            onChange={(e) => handleChange('accent_color', e.target.value)}
                            className="w-10 h-9 p-0.5 rounded-lg border border-slate-200 dark:border-neutral-800 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={formData.accent_color}
                            onChange={(e) => handleChange('accent_color', e.target.value)}
                            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.animations_enabled}
                          onChange={(e) => handleChange('animations_enabled', e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                          Enable Framer Motion Micro-Animations & Glow Effects
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.reduced_motion}
                          onChange={(e) => handleChange('reduced_motion', e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                          Respect Reduced Motion Preferences
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 6. SYSTEM SECTION */}
                {activeTab === 'system' && (
                  <div className="space-y-6">
                    <h2 className="text-base font-bold font-display text-slate-900 dark:text-white border-b border-slate-100 dark:border-neutral-900 pb-3">
                      System Backup, Import & Export Protocols
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Export Settings */}
                      <div className="p-5 rounded-2xl bg-white/40 dark:bg-neutral-900/40 border border-slate-200/40 dark:border-neutral-800/60 space-y-3">
                        <div>
                          <h3 className="text-xs font-bold font-display text-slate-900 dark:text-white">Export CMS Configuration</h3>
                          <p className="text-[11px] text-slate-500 font-sans mt-0.5">Download a JSON snapshot of all portfolio parameters.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => settingsService.exportJSON(formData)}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-300 cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Export JSON</span>
                        </button>
                      </div>

                      {/* Import Settings */}
                      <div className="p-5 rounded-2xl bg-white/40 dark:bg-neutral-900/40 border border-slate-200/40 dark:border-neutral-800/60 space-y-3">
                        <div>
                          <h3 className="text-xs font-bold font-display text-slate-900 dark:text-white">Import Configuration</h3>
                          <p className="text-[11px] text-slate-500 font-sans mt-0.5">Restore settings from a previously saved JSON file.</p>
                        </div>
                        <label className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-300 cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                          <Upload className="w-3.5 h-3.5 text-cyan-500" />
                          <span>Import JSON</span>
                          <input type="file" accept="application/json" onChange={handleImportJSON} className="hidden" />
                        </label>
                      </div>
                    </div>

                    {/* Reset Settings */}
                    <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/15 flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 font-display">Reset to Defaults</h3>
                        <p className="text-[11px] text-slate-500 font-sans">Revert all form parameters to original default portfolio config.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/20 cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
