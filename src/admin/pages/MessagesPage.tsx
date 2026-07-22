import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  RefreshCw,
  Search,
  Trash2,
  CheckCircle2,
  Mail,
  Copy,
  Reply,
  Inbox,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { messagesService } from '../services/messagesService';
import type { ContactMessageRecord } from '../services/messagesService';

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageRecord | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<'All' | 'Unread' | 'Read'>('All');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<'single' | 'bulk' | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadMessages = async () => {
    setRefreshing(true);
    try {
      const data = await messagesService.getMessages();
      if (data.length === 0) {
        // Demonstration entries if database table is empty initially
        const demoData: ContactMessageRecord[] = [
          {
            id: 'msg-1',
            name: 'Alex Mercer',
            email: 'alex.mercer@techcorp.io',
            subject: 'Senior Frontend Developer Position Opportunity',
            message: 'Hi Vardhan, we reviewed your AI Resume Builder project and developer portfolio. We are highly impressed with your React and TypeScript work and would love to discuss a developer position with our team.',
            is_read: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'msg-2',
            name: 'Sarah Jenkins',
            email: 'sarah@designstudio.dev',
            subject: 'Freelance PortfolioOS CMS Collaboration',
            message: 'Hello P Venu Vardhan! Your portfolio design system looks incredibly sleek (Apple/Linear quality). Are you available for freelance project development or consulting?',
            is_read: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ];
        setMessages(demoData);
        setSelectedMessage(demoData[0]);
      } else {
        setMessages(data);
        if (!selectedMessage && data.length > 0) {
          setSelectedMessage(data[0]);
        }
      }
    } catch {
      showToast('Error loading messages.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMessages();

    // Subscribe to Supabase Realtime INSERT pings
    const channel = messagesService.subscribeToNewMessages((newMsg) => {
      setMessages((prev) => [newMsg, ...prev]);
      showToast(`⚡ New message received from ${newMsg.name}!`);
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleSelectMessage = async (msg: ContactMessageRecord) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      // Automatically mark as read when opened
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
      );
      try {
        if (!msg.id.startsWith('msg-')) {
          await messagesService.markAsRead(msg.id);
        }
      } catch {
        // Fallback
      }
    }
  };

  const handleCheckToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredMessages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMessages.map((m) => m.id));
    }
  };

  const handleBulkMarkRead = async () => {
    if (selectedIds.length === 0) return;
    setMessages((prev) =>
      prev.map((m) => (selectedIds.includes(m.id) ? { ...m, is_read: true } : m))
    );
    try {
      const realIds = selectedIds.filter((id) => !id.startsWith('msg-'));
      if (realIds.length > 0) {
        await messagesService.markMultipleAsRead(realIds);
      }
      showToast(`Marked ${selectedIds.length} messages as read.`);
      setSelectedIds([]);
    } catch {
      showToast('Failed to mark selected messages as read.');
    }
  };

  const handleDeleteConfirmed = async () => {
    setDeleting(true);
    try {
      if (deleteTarget === 'bulk' && selectedIds.length > 0) {
        const realIds = selectedIds.filter((id) => !id.startsWith('msg-'));
        if (realIds.length > 0) {
          await messagesService.deleteMultipleMessages(realIds);
        }
        setMessages((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
        if (selectedMessage && selectedIds.includes(selectedMessage.id)) {
          setSelectedMessage(null);
        }
        showToast(`Deleted ${selectedIds.length} selected messages.`);
        setSelectedIds([]);
      } else if (deleteTarget === 'single' && selectedMessage) {
        if (!selectedMessage.id.startsWith('msg-')) {
          await messagesService.deleteMessage(selectedMessage.id);
        }
        const updated = messages.filter((m) => m.id !== selectedMessage.id);
        setMessages(updated);
        setSelectedMessage(updated[0] || null);
        showToast('Message deleted.');
      }
    } catch {
      showToast('Failed to delete messages.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    showToast(`Copied email "${email}" to clipboard!`);
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === 'Unread') return !m.is_read;
    if (filterTab === 'Read') return m.is_read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

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
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-indigo-600 dark:text-cyan-400">
                Inbox Management
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Contact Messages
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
              Manage incoming portfolio inquiries and collaboration messages with Realtime sync
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={loadMessages}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 text-slate-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Inbox"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {selectedIds.length > 0 && (
              <>
                <button
                  onClick={handleBulkMarkRead}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer"
                >
                  Mark Read ({selectedIds.length})
                </button>
                <button
                  onClick={() => setDeleteTarget('bulk')}
                  className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/20 transition-colors cursor-pointer"
                >
                  Delete Selected ({selectedIds.length})
                </button>
              </>
            )}
          </div>
        </div>

        {/* Split-Pane Inbox Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
          {/* Left Panel: Message List (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-4 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80 flex flex-col space-y-4">
            {/* Search & Filter bar */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-neutral-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name, email or subject..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200/60 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-slate-100/60 dark:bg-neutral-900/60 p-1 rounded-xl border border-slate-200/40 dark:border-neutral-800/60">
                  {(['All', 'Unread', 'Read'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilterTab(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        filterTab === tab
                          ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                          : 'text-slate-500 dark:text-neutral-400'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filteredMessages.length > 0 && selectedIds.length === filteredMessages.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Select All
                </label>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-16 bg-slate-100 dark:bg-neutral-900 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold text-slate-500">No messages found</p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isSelected = selectedMessage?.id === msg.id;
                  const isChecked = selectedIds.includes(msg.id);
                  return (
                    <div
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex items-start gap-3 ${
                        isSelected
                          ? 'bg-indigo-500/10 dark:bg-indigo-500/15 border-indigo-500/30 shadow-sm'
                          : !msg.is_read
                          ? 'bg-white/80 dark:bg-neutral-900/80 border-indigo-500/20 font-semibold'
                          : 'bg-white/40 dark:bg-neutral-900/30 border-slate-200/30 dark:border-neutral-800/50 hover:bg-white/70'
                      }`}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleCheckToggle(msg.id);
                        }}
                        className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                      />

                      <div className="flex-1 overflow-hidden space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold font-display text-slate-900 dark:text-white truncate">
                            {msg.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {new Date(msg.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-200 font-sans truncate">
                          {msg.subject}
                        </p>
                        <p className="text-[11px] text-slate-400 font-light truncate">
                          {msg.message}
                        </p>
                      </div>

                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0 mt-1.5 animate-pulse" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Message Reader (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/40 dark:border-neutral-800/80 flex flex-col justify-between">
            {selectedMessage ? (
              <div className="space-y-6">
                {/* Message Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-neutral-900/60 pb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400">INBOX</span>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white leading-tight">
                      {selectedMessage.subject}
                    </h2>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 transition-all"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </a>

                    <button
                      onClick={() => handleCopyEmail(selectedMessage.email)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-600 dark:text-neutral-300 transition-colors cursor-pointer"
                      title="Copy Email"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTarget('single')}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sender Info Card */}
                <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-neutral-900/40 border border-slate-200/40 dark:border-neutral-800/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 flex items-center justify-center font-bold font-display text-base border border-indigo-500/20">
                      {selectedMessage.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white font-display">
                        {selectedMessage.name}
                      </p>
                      <p className="text-xs font-mono text-slate-500 dark:text-neutral-400">
                        {selectedMessage.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyEmail(selectedMessage.email)}
                    className="text-[11px] font-mono text-indigo-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Copy Address</span>
                  </button>
                </div>

                {/* Message Body */}
                <div className="p-6 rounded-2xl bg-white/40 dark:bg-neutral-900/20 border border-slate-200/30 dark:border-neutral-800/40 text-sm font-sans text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-light">
                  {selectedMessage.message}
                </div>
              </div>
            ) : (
              /* No selection empty state */
              <div className="m-auto text-center space-y-3 p-8">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold font-display text-slate-700 dark:text-neutral-300">
                  Select a message to view details
                </h3>
                <p className="text-xs text-slate-400 font-sans max-w-xs mx-auto">
                  Click on any contact entry from the left inbox list to inspect inquiry contents.
                </p>
              </div>
            )}

            {/* Reader Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-neutral-900/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Supabase Realtime Channel: Active</span>
              <span>PortfolioOS Inbox Protocol</span>
            </div>
          </div>
        </div>

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
                    {deleteTarget === 'bulk' ? 'Delete Selected Messages?' : 'Delete Message?'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    {deleteTarget === 'bulk'
                      ? `Are you sure you want to delete ${selectedIds.length} selected message entries?`
                      : `Are you sure you want to delete message from "${selectedMessage?.name}"?`}
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
                    onClick={handleDeleteConfirmed}
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
