'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, MapPin, Clock, ChevronDown, Plus, Copy, CheckCircle, AlertCircle, Filter, X,Pencil,Trash2 } from 'lucide-react';
import axios from 'axios';
interface JobType {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  postedAt: string;
}

const JobListPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editJob, setEditJob] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [deleteId, setDeleteId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(
    null
  );

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    description: '',
  });

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      showToast('error', 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const showToast = (type: string, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };
  const openEditModal = (job: any) => {
    setEditJob(job);
    setShowEditModal(true);
  };
  
  const openDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  
  // UPDATE JOB API
  const updateJob = async () => {
    try {
      const res = await axios.put(`http://localhost:4000/api/jobs/${editJob._id}`, editJob);
  
      setToast({ type: "success", message: "Job updated successfully" });
      setShowEditModal(false);
      fetchJobs();
    } catch (err) {
      setToast({ type: "error", message: "Error updating job" });
    }
  };
  
  // DELETE JOB API
  const deleteJob = async () => {
    console.log("Deleting job with ID:", deleteId);
    try {
      await axios.delete(`http://localhost:4000/api/jobs/${deleteId}`);
      setToast({ type: "success", message: "Job deleted successfully" });
      setShowDeleteModal(false);
      fetchJobs();
    } catch (err) {
      setToast({ type: "error", message: "Error deleting job" });
    }
  };
  

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newJob.title ||
      !newJob.company ||
      !newJob.location ||
      !newJob.description
    ) {
      showToast('error', 'Please fill all fields');
      return;
    }

    setAdding(true);

    try {
      const res = await fetch('http://localhost:4000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });
      const data = await res.json();

      if (data.success) {
        showToast('success', 'Job added successfully!');
        setNewJob({
          title: '',
          company: '',
          location: '',
          type: 'Full-Time',
          description: '',
        });
        setShowForm(false);
        fetchJobs();
      } else {
        showToast('error', data.error || 'Failed to add job');
      }
    } catch (err) {
      console.error('Error adding job:', err);
      showToast('error', 'Server error');
    } finally {
      setAdding(false);
    }
  };

  const copyJobId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    showToast('success', 'Job ID copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch = job.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterType === 'all' || job.type === filterType;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'recent')
        return (
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        );
      if (sortBy === 'oldest')
        return (
          new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime()
        );
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                Job Listings
              </h1>
              <p className="text-blue-600 text-lg">
                Discover and manage job opportunities
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/30 transition"
            >
              <Plus size={20} /> Post Job
            </motion.button>
          </div>

          {/* Form */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddJob}
                className="bg-blue-50/50 backdrop-blur border border-blue-200 p-6 rounded-xl mb-8 space-y-4"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Post a New Job
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={newJob.title}
                    onChange={(e) =>
                      setNewJob({ ...newJob, title: e.target.value })
                    }
                    className="bg-white text-gray-900 placeholder-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={newJob.company}
                    onChange={(e) =>
                      setNewJob({ ...newJob, company: e.target.value })
                    }
                    className="bg-white text-gray-900 placeholder-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={newJob.location}
                    onChange={(e) =>
                      setNewJob({ ...newJob, location: e.target.value })
                    }
                    className="bg-white text-gray-900 placeholder-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                  <select
                    value={newJob.type}
                    onChange={(e) =>
                      setNewJob({ ...newJob, type: e.target.value })
                    }
                    className="bg-white text-gray-900 border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                  </select>
                </div>
                <textarea
                  placeholder="Job Description"
                  value={newJob.description}
                  onChange={(e) =>
                    setNewJob({ ...newJob, description: e.target.value })
                  }
                  className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                  rows={4}
                  required
                ></textarea>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    type="submit"
                    disabled={adding}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition"
                  >
                    {adding ? 'Adding...' : 'Add Job'}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur border border-gray-300 p-4 rounded-lg mb-8 flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white text-gray-900 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
          >
            <option value="all">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white text-gray-900 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
          </select>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
          </div>
        )}

        {/* Job Cards */}
        {!loading && (
          <AnimatePresence mode="popLayout">
            {filteredJobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <AlertCircle className="mx-auto w-16 h-16 text-blue-300 mb-4" />
                <p className="text-gray-600 text-lg">No jobs found</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job, idx) => (
                  <motion.div
                    key={job._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <motion.button
                      onClick={() =>
                        setExpandedId(expandedId === job._id ? null : job._id)
                      }
                      className="w-full text-left bg-white hover:bg-gray-50 border border-gray-300 hover:border-blue-400 p-6 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                            {job.title}
                          </h2>
                          <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                            <div className="flex items-center gap-1">
                              <Briefcase size={16} />
                              {job.company}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={16} />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              {job.type}
                            </div>
                            <div className="text-blue-600">
                              {new Date(job.postedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <motion.div
                          animate={{
                            rotate: expandedId === job._id ? 180 : 0,
                          }}
                        >
                          <ChevronDown
                            className="text-gray-400 group-hover:text-blue-600"
                            size={24}
                          />
                        </motion.div>
                      </div>
                    </motion.button>
                  {/* ACTION BUTTONS */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {/* Edit Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditModal(job)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <Pencil size={18} />
                      Edit Job
                    </motion.button>

                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openDeleteConfirm(job._id)}
                      className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      <Trash2 size={18} />
                      Delete Job
                    </motion.button>
                  </div>
                  {/* EDIT JOB MODAL */}
                  {/* DELETE CONFIRM MODAL */}
<AnimatePresence>
  {showDeleteModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg"
      >
        <h2 className="text-xl font-bold">Delete Job?</h2>
        <p className="text-gray-600 mt-2">
          Are you sure you want to delete this job? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={deleteJob}
            className="px-5 py-2 bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

<AnimatePresence>
  {showEditModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Edit Job</h2>

        <div className="space-y-3">
          <input
            type="text"
            value={editJob.title}
            onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Job Title"
          />

          <input
            type="text"
            value={editJob.company}
            onChange={(e) => setEditJob({ ...editJob, company: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Company"
          />

          <input
            type="text"
            value={editJob.location}
            onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Location"
          />

          <textarea
            value={editJob.description}
            onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg"
            rows={4}
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setShowEditModal(false)}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={updateJob}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>



                    <AnimatePresence>
                      {expandedId === job._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50 border border-t-0 border-gray-300 p-6 rounded-b-lg"
                        >
                          <p className="text-gray-700 leading-relaxed mb-4">
                            {job.description}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                showToast('success', `Applying for ${job.title}`)
                              }
                              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold transition"
                            >
                              Apply Now
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
        )}

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
                toast.type === 'success'
                  ? 'bg-emerald-100 border border-emerald-300 text-emerald-700'
                  : 'bg-red-100 border border-red-300 text-red-700'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JobListPage;
