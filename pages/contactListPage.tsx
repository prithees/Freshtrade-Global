'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Building2, User, MessageSquare, Calendar, CheckCircle, Trash2, Search, Filter, Copy } from 'lucide-react';

interface ContactType {
  _id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

const ContactListPage: React.FC = () => {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(
    null
  );

  const fetchContacts = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/contact');
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const showToast = (type: string, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const markAsContacted = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/contact/${id}/contacted`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (data.success) {
        setContacts((prev) => prev.filter((c) => c._id !== id));
        showToast('success', 'Contact marked as contacted!');
      }
    } catch (err) {
      console.error('Error marking as contacted:', err);
      showToast('error', 'Failed to update contact');
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    showToast('success', 'Email copied!');
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-2">
            Contact Messages
          </h1>
          <p className="text-purple-400/70 text-lg">
            Manage and respond to incoming contact inquiries
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-700/30 backdrop-blur border border-slate-600/50 p-4 rounded-lg mb-8 flex gap-4"
        >
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-3 text-purple-400/50"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-600/50 text-white placeholder-slate-400 border border-slate-500 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-purple-500 transition"
            />
          </div>
          <div className="text-slate-400 font-semibold py-2 px-4 bg-slate-700/30 rounded-lg">
            {filteredContacts.length} message{filteredContacts.length !== 1 ? 's' : ''}
          </div>
        </motion.div>

        {/* Contact Cards */}
        <AnimatePresence mode="popLayout">
          {filteredContacts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Mail className="mx-auto w-16 h-16 text-purple-400/30 mb-4" />
              <p className="text-slate-400 text-lg">No messages found</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredContacts.map((contact, idx) => (
                <motion.div
                  key={contact._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                >
                  <motion.button
                    onClick={() =>
                      setExpandedId(
                        expandedId === contact._id ? null : contact._id
                      )
                    }
                    className="w-full text-left bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-slate-700/80 hover:to-slate-800/80 border border-slate-600/50 hover:border-purple-500/50 p-6 rounded-lg transition-all duration-300 backdrop-blur"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="text-purple-400 flex-shrink-0" size={20} />
                          <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition truncate">
                            {contact.name}
                          </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-400 text-sm ml-8">
                          <div className="flex items-center gap-2">
                            <Mail size={14} />
                            <span className="truncate">{contact.email}</span>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} />
                              {contact.phone}
                            </div>
                          )}
                          {contact.company && (
                            <div className="flex items-center gap-2">
                              <Building2 size={14} />
                              {contact.company}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="mt-3 text-slate-300 text-sm line-clamp-2 ml-8">
                          {contact.message}
                        </p>
                      </div>
                      <motion.div
                        animate={{
                          rotate: expandedId === contact._id ? 180 : 0,
                        }}
                        className="flex-shrink-0"
                      >
                        <Mail
                          className="text-purple-400/50 group-hover:text-purple-400"
                          size={24}
                        />
                      </motion.div>
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {expandedId === contact._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-800/50 border border-t-0 border-slate-600/50 p-6 rounded-b-lg backdrop-blur space-y-4"
                      >
                        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="text-purple-400" size={18} />
                            <h3 className="font-semibold text-white">
                              Message
                            </h3>
                          </div>
                          <p className="text-slate-300 leading-relaxed">
                            {contact.message}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                            <label className="text-slate-400 text-sm font-semibold">
                              Email
                            </label>
                            <div className="flex items-center justify-between mt-2">
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-purple-400 hover:text-purple-300 truncate"
                              >
                                {contact.email}
                              </a>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={() => copyEmail(contact.email)}
                                className="ml-2"
                              >
                                {copiedEmail === contact.email ? (
                                  <CheckCircle
                                    size={18}
                                    className="text-emerald-400"
                                  />
                                ) : (
                                  <Copy
                                    size={18}
                                    className="text-slate-400 hover:text-slate-300"
                                  />
                                )}
                              </motion.button>
                            </div>
                          </div>

                          {contact.phone && (
                            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                              <label className="text-slate-400 text-sm font-semibold">
                                Phone
                              </label>
                              <a
                                href={`tel:${contact.phone}`}
                                className="text-purple-400 hover:text-purple-300 block mt-2"
                              >
                                {contact.phone}
                              </a>
                            </div>
                          )}

                          {contact.company && (
                            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                              <label className="text-slate-400 text-sm font-semibold">
                                Company
                              </label>
                              <p className="text-white mt-2">{contact.company}</p>
                            </div>
                          )}

                          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                            <label className="text-slate-400 text-sm font-semibold">
                              Date Received
                            </label>
                            <p className="text-white mt-2">
                              {new Date(contact.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => markAsContacted(contact._id)}
                            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition"
                          >
                            <CheckCircle size={18} /> Mark Contacted
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              setContacts((prev) =>
                                prev.filter((c) => c._id !== contact._id)
                              )
                            }
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
                          >
                            <Trash2 size={18} /> Delete
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
                toast.type === 'success'
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                  : 'bg-red-500/20 border border-red-500/50 text-red-300'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle size={18} />
              ) : (
                <Mail size={18} />
              )}
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContactListPage;
