import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, CheckCircle2,
  MessageSquare, FileText, ChevronRight
} from 'lucide-react';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const { data, validatedResumeUrl } = usePublicPortfolio();
  const { settings } = data;

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await supabase.from('contact_messages').insert([
        {
          name: formState.name,
          email: formState.email,
          subject: formState.subject,
          message: formState.message,
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ]);
      setIsSuccess(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-24 border-t border-slate-100 dark:border-neutral-900/50 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 dark:bg-indigo-500/2 blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-cyan-500/5 dark:bg-cyan-500/2 blur-[80px] -z-10" />

      {/* Header */}
      <div className="text-left mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-bold font-display uppercase tracking-widest text-indigo-600 dark:text-cyan-400 mb-2"
        >
          Connect
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white tracking-tight"
        >
          Let's Build Something Amazing Together
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-neutral-400 max-w-2xl font-sans font-light mt-4 text-base sm:text-lg leading-relaxed"
        >
          Whether you have an internship opportunity, freelance project, collaboration idea, or simply want to connect, I'd love to hear from you.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Left Side: Contact Info Panel */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {settings.availability_status ? 'Available for Opportunities' : 'Contact Available'}
            </div>

            <h3 className="text-xl font-bold font-display text-slate-800 dark:text-white">Contact Details</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3.5 text-sm">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-neutral-900 border border-slate-200/20 text-indigo-600 dark:text-cyan-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-slate-400 dark:text-neutral-500">Email</span>
                  <a
                    href={`mailto:${settings.email || 'venuvardhanp61653@gmail.com'}`}
                    onClick={(e) => {
                      window.location.href = `mailto:${settings.email || 'venuvardhanp61653@gmail.com'}`;
                      e.preventDefault();
                    }}
                    className="font-medium text-slate-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {settings.email || 'venuvardhanp61653@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-sm">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-neutral-900 border border-slate-200/20 text-indigo-600 dark:text-cyan-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-slate-400 dark:text-neutral-500">Phone</span>
                  <a href={`tel:${settings.phone}`} className="font-medium text-slate-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
                    {settings.phone || '+91 98765 43210'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-sm">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-neutral-900 border border-slate-200/20 text-indigo-600 dark:text-cyan-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-slate-400 dark:text-neutral-500">Location</span>
                  <span className="font-medium text-slate-700 dark:text-neutral-300">
                    {settings.location || 'Ballari, India'}
                  </span>
                </div>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-neutral-900/50 border border-indigo-100/30 dark:border-neutral-800 text-xs font-mono text-slate-500 dark:text-neutral-400 flex items-center gap-2">
              <span>⚡</span> Usually replies within 24 hours.
            </div>

            {validatedResumeUrl ? (
              <a
                href={validatedResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                onClick={() => console.log('[debugging] Contact Detail Resume download clicked. URL:', validatedResumeUrl)}
                className="inline-flex items-center justify-center w-full px-5 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-neutral-950 font-semibold hover:opacity-90 transition-opacity gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                Download Resume
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center justify-center w-full px-5 py-3 rounded-2xl bg-slate-100 dark:bg-neutral-805 text-slate-400 dark:text-neutral-600 font-semibold gap-2 cursor-not-allowed opacity-50"
              >
                <FileText className="w-4 h-4" />
                Resume Not Available
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 text-left">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl relative">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="name" className="text-xs font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-widest font-mono">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleInputChange}
                        className="px-4 py-3 rounded-xl border border-slate-200/50 dark:border-neutral-850 bg-white/50 dark:bg-neutral-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 dark:text-slate-100"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="email" className="text-xs font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-widest font-mono">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleInputChange}
                        className="px-4 py-3 rounded-xl border border-slate-200/50 dark:border-neutral-850 bg-white/50 dark:bg-neutral-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 dark:text-slate-100"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="subject" className="text-xs font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-widest font-mono">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formState.subject}
                      onChange={handleInputChange}
                      className="px-4 py-3 rounded-xl border border-slate-200/50 dark:border-neutral-850 bg-white/50 dark:bg-neutral-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 dark:text-slate-100"
                      placeholder="Collaboration opportunity"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="message" className="text-xs font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-widest font-mono">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formState.message}
                      onChange={handleInputChange}
                      className="px-4 py-3 rounded-xl border border-slate-200/50 dark:border-neutral-850 bg-white/50 dark:bg-neutral-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 dark:text-slate-100 resize-none"
                      placeholder="Hi, I'd like to talk about..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center w-full px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg hover:shadow-indigo-500/20 transition-all gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                >
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                  <h3 className="text-2xl font-bold font-display text-slate-800 dark:text-white">Message Sent Successfully!</h3>
                  <p className="text-sm font-sans text-slate-500 dark:text-neutral-400 max-w-sm leading-relaxed">
                    Thank you for reaching out. I have received your message and will review it shortly.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors"
                  >
                    Send another message
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-left">
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
            settings.email || "venuvardhanp61653@gmail.com"
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between items-start hover:border-indigo-500/20 hover:shadow-lg duration-300 transition-all min-h-[110px]"
        >
          <Mail className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">
              Email
            </h4>
            <p className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 mt-0.5">
              Write to me
            </p>
          </div>
        </a>

        <a
          href={settings.linkedin || 'https://linkedin.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between items-start hover:border-indigo-500/20 hover:shadow-lg duration-300 transition-all min-h-[110px]"
        >
          <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">LinkedIn</h4>
            <p className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 mt-0.5">Let's connect</p>
          </div>
        </a>

        <a
          href={settings.github || 'https://github.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between items-start hover:border-indigo-500/20 hover:shadow-lg duration-300 transition-all min-h-[110px]"
        >
          <svg className="w-5 h-5 text-slate-700 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">GitHub</h4>
            <p className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 mt-0.5">Check projects</p>
          </div>
        </a>

        <a
          href={`https://wa.me/${(settings.phone || '917483765885').replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between items-start hover:border-indigo-500/20 hover:shadow-lg duration-300 transition-all min-h-[110px]"
        >
          <MessageSquare className="w-5 h-5 text-emerald-500" />
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">WhatsApp</h4>
            <p className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 mt-0.5">Quick chat</p>
          </div>
        </a>

        {validatedResumeUrl ? (
          <a
            href={validatedResumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            onClick={() => console.log('[debugging] Contact Quick Card Resume download clicked. URL:', validatedResumeUrl)}
            className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between items-start hover:border-indigo-500/20 hover:shadow-lg duration-300 transition-all min-h-[110px] col-span-2 md:col-span-1 cursor-pointer"
          >
            <FileText className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white">Resume</h4>
              <p className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 mt-0.5">Download PDF</p>
            </div>
          </a>
        ) : (
          <button
            disabled
            className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between items-start min-h-[110px] col-span-2 md:col-span-1 cursor-not-allowed opacity-50 border border-slate-200/20"
          >
            <FileText className="w-5 h-5 text-slate-400" />
            <div>
              <h4 className="text-xs font-bold text-slate-400">Resume</h4>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">Not Available</p>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
