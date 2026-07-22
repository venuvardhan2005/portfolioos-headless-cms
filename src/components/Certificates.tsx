import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, ShieldCheck, Sparkles, CheckCircle2, CircleDot } from 'lucide-react';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';

interface Certificate {
  title: string;
  organization: string;
  issueDate: string;
  credentialId: string;
  skills: string[];
  image: string;
  verifyUrl: string;
  downloadUrl: string;
  isFeatured?: boolean;
}

const CERTIFICATES_DATA: Certificate[] = [
  {
    title: 'React.js Development Internship',
    organization: 'The Entrepreneurship Network',
    issueDate: 'March 2026',
    credentialId: 'TEN-REC-2026-894',
    skills: ['React.js', 'State Management', 'REST APIs'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
    verifyUrl: '#verify-react',
    downloadUrl: '#download-react',
    isFeatured: true,
  },
  {
    title: 'Python Programming Internship',
    organization: 'Kishkindha University',
    issueDate: 'August 2025',
    credentialId: 'KU-PY-2025-104',
    skills: ['Python OOP', 'Script Automation', 'Data Structures'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
    verifyUrl: '#verify-python',
    downloadUrl: '#download-python',
    isFeatured: false,
  },
];

const MILESTONES = [
  { text: 'Python Internship', status: 'completed' },
  { text: 'React.js Internship', status: 'completed' },
  { text: 'AI Resume Builder', status: 'completed' },
  { text: 'Portfolio CMS', status: 'current' },
];

const FUTURE_GOALS = [
  { text: 'AWS Practitioner', icon: ShieldCheck },
  { text: 'Microsoft Power BI', icon: Award },
];

export default function Certificates() {
  const { data } = usePublicPortfolio();
  const liveCertificates = data.certificates;

  const displayCertificates: Certificate[] =
    liveCertificates && liveCertificates.length > 0
      ? liveCertificates.map((c) => ({
          title: c.title,
          organization: c.organization,
          issueDate: c.issue_date,
          credentialId: c.credential_id || 'VERIFIED',
          skills: ['Credential', c.category || 'Certification'],
          image: c.image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
          verifyUrl: c.verify_url || '#',
          downloadUrl: c.pdf_url || '#',
          isFeatured: true,
        }))
      : CERTIFICATES_DATA;
  return (
    <div id="certificates" className="space-y-6 text-left">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold font-display uppercase tracking-widest text-indigo-600 dark:text-cyan-400 mb-1">
          Credentials
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
          Certificates & Achievements
        </h2>
      </div>

      {/* Certificates Stack */}
      <div className="space-y-4">
        {displayCertificates.map((cert, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className={`glass-panel p-4 rounded-3xl flex flex-col sm:flex-row gap-4 items-center hover:border-indigo-500/20 hover:shadow-lg duration-300 relative ${
              cert.isFeatured ? 'ring-1 ring-indigo-500/10 dark:ring-indigo-500/5' : ''
            }`}
          >
            {cert.isFeatured && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold font-display uppercase bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/15">
                <Sparkles className="w-2 h-2" />
                Featured
              </span>
            )}

            {/* Left side: Standardized Image (180x140px) */}
            <div className="w-full sm:w-[180px] h-[140px] rounded-2xl overflow-hidden shrink-0 border border-slate-200/20 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 relative group/img">
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover group-hover/img:scale-105 duration-500 transition-transform filter brightness-95 dark:brightness-85"
              />
            </div>

            {/* Right side: Details */}
            <div className="w-full flex-1 flex flex-col justify-between items-start space-y-2">
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-display text-slate-800 dark:text-white leading-tight">
                  {cert.title}
                </h3>
                <p className="text-xs font-sans font-medium text-slate-500 dark:text-neutral-400">
                  {cert.organization}
                </p>
                
                {/* Date & ID */}
                <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono text-slate-400 dark:text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {cert.issueDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    ID: {cert.credentialId}
                  </div>
                </div>
              </div>

              {/* Skills and Action buttons */}
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-neutral-900/50">
                <div className="flex flex-wrap gap-1">
                  {cert.skills.slice(0, 2).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-1.5 py-0.5 rounded text-[8px] font-bold font-mono tracking-wide uppercase bg-slate-50 text-slate-500 dark:bg-neutral-900/40 dark:text-neutral-500 border border-slate-200/10 dark:border-neutral-800/40"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <a href={cert.verifyUrl} className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700">
                    Verify <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href={cert.downloadUrl} className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-neutral-400 hover:text-indigo-600">
                    Download
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Learning Journey Tracker & Future Goals combined in one line block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-neutral-900/50">
        {/* Progress track */}
        <div className="glass-panel p-4 rounded-2xl space-y-2.5">
          <h4 className="text-xs font-bold font-display text-slate-800 dark:text-white">Learning Journey</h4>
          <div className="space-y-1.5 text-[11px] font-sans">
            {MILESTONES.map((mile, mIdx) => (
              <div key={mIdx} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {mile.status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <CircleDot className="w-3.5 h-3.5 text-indigo-500 animate-pulse shrink-0" />
                  )}
                  <span className={`${mile.status === 'current' ? 'text-indigo-600 dark:text-cyan-400 font-semibold' : 'text-slate-500 dark:text-neutral-400'}`}>
                    {mile.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Future Goals */}
        <div className="glass-panel p-4 rounded-2xl space-y-2.5">
          <h4 className="text-xs font-bold font-display text-slate-800 dark:text-white">Future Goals</h4>
          <div className="space-y-2 text-[11px] font-sans">
            {FUTURE_GOALS.map((goal, gIdx) => {
              const GoalIcon = goal.icon;
              return (
                <div key={gIdx} className="flex items-center gap-2 text-slate-500 dark:text-neutral-400">
                  <GoalIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400 shrink-0" />
                  <span>{goal.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
