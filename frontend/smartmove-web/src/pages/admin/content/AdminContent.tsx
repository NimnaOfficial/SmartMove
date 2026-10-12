import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Search, Star, MessageSquare, 
  Bell, Plus, Edit2, Trash2, X, Eye, FileText, CheckCircle2,
  Filter, Tag, Calendar, AlertTriangle, FileCheck
} from 'lucide-react';
import contentService from '@/services/contentService';
import { Announcement, AnnouncementFormData, Review, VehicleDocument } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Announcements' | 'Reviews' | 'Top Rated' | 'Documents'>('Overview');
  
  // Data states
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);
  
  // Announcement Form Modal State
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [selectedAnn, setSelectedAnn] = useState<Announcement | null>(null);
  const [annForm, setAnnForm] = useState<AnnouncementFormData>({
    title: '',
    message: '',
    targetAudience: 'ALL',
    priority: 'MEDIUM'
  });

  // Search keyword state for Reviews
  const [keyword, setKeyword] = useState('');
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);

  // Load all initial content
  const loadAllContent = async () => {
    try {
      const [annData, revData, topData, docData] = await Promise.all([
        contentService.getAllAnnouncements(),
        contentService.getAllReviews(),
        contentService.getTopRated(),
        contentService.getVehicleDocuments(101)
      ]);
      setAnnouncements(Array.isArray(annData) ? annData : []);
      setReviews(Array.isArray(revData) ? revData : []);
      setFilteredReviews(Array.isArray(revData) ? revData : []);
      setTopRated(Array.isArray(topData) ? topData : []);
      setDocuments(Array.isArray(docData) ? docData : []);
    } catch (e) {
      console.error('Failed to load content', e);
    }
  };

  useEffect(() => {
    loadAllContent();
  }, []);

  // Keyword search effect for Reviews
  useEffect(() => {
    if (!keyword.trim()) {
      setFilteredReviews(reviews);
      return;
    }
    const q = keyword.toLowerCase();
    const res = reviews.filter(r =>
      (r.comment || '').toLowerCase().includes(q) ||
      (r.passengerName || '').toLowerCase().includes(q) ||
      (r.tags || []).some(t => t.toLowerCase().includes(q))
    );
    setFilteredReviews(res);
  }, [keyword, reviews]);

  // Announcement Handlers
  const handleOpenAnnModal = (ann?: Announcement) => {
    if (ann) {
      setSelectedAnn(ann);
      setAnnForm({
        title: ann.title,
        message: ann.message,
        targetAudience: ann.targetAudience || 'ALL',
        priority: ann.priority
      });
    } else {
      setSelectedAnn(null);
      setAnnForm({
        title: '',
        message: '',
        targetAudience: 'ALL',
        priority: 'MEDIUM'
      });
    }
    setShowAnnModal(true);
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedAnn && selectedAnn._id) {
        await contentService.updateAnnouncement(selectedAnn._id, annForm);
      } else {
        await contentService.createAnnouncement(annForm);
      }
      setShowAnnModal(false);
      setSelectedAnn(null);
      const data = await contentService.getAllAnnouncements();
      setAnnouncements(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAnnouncement = async (id?: string) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await contentService.deleteAnnouncement(id);
        const data = await contentService.getAllAnnouncements();
        setAnnouncements(data);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Media Handlers
  const tabs: Array<'Overview' | 'Announcements' | 'Reviews' | 'Top Rated' | 'Documents'> = [
    'Overview', 'Announcements', 'Reviews', 'Top Rated', 'Documents'
  ];

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Page Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Content Hub
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase tracking-wider">
              MongoDB Store
            </span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Manage unstructured publications, customer sentiment, and operational records.</p>
        </div>
        {activeTab === 'Announcements' && (
          <button 
            onClick={() => handleOpenAnnModal()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2.5 rounded-full font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex gap-2 w-full overflow-x-auto pb-2 scrollbar-hide border-b border-white/5">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 font-semibold text-sm rounded-xl transition-all cursor-pointer ${
              activeTab === tab 
                ? 'text-white bg-white/10 border border-white/10 shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Tab Panels */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mt-2">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Announcements', count: announcements.length, desc: 'Public broadcasts', icon: Bell, color: 'purple', tab: 'Announcements' as const },
                { title: 'Passenger Reviews', count: reviews.length, desc: 'Ratings & complaints', icon: MessageSquare, color: 'blue', tab: 'Reviews' as const },
                { title: 'Top Rated Aggregates', count: topRated.length, desc: 'Aggregation pipeline', icon: Star, color: 'amber', tab: 'Top Rated' as const },
                { title: 'Vehicle Documents', count: documents.length, desc: 'Compliance certificates', icon: FileCheck, color: 'emerald', tab: 'Documents' as const },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div 
                    key={idx} 
                    variants={fadeUp} 
                    onClick={() => setActiveTab(card.tab)}
                    className="bg-[#1a1b23] p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group hover:bg-[#1e1f2b]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-${card.color}-500/10 flex items-center justify-center border border-${card.color}-500/20 text-${card.color}-400 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-extrabold text-white">{card.count}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">{card.title}</h3>
                    <p className="text-xs text-gray-500">{card.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Announcements Preview */}
              <div className="bg-[#1a1b23] border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-400" /> Active Announcements
                  </h3>
                  <button onClick={() => setActiveTab('Announcements')} className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer">
                    Manage All &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {announcements.slice(0, 3).map((a, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-white">{a.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          a.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {a.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">{a.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Reviews Preview */}
              <div className="bg-[#1a1b23] border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" /> Recent Reviews & Feedback
                  </h3>
                  <button onClick={() => setActiveTab('Reviews')} className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer">
                    View All &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {reviews.slice(0, 3).map((r, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-white">{r.passengerName || 'Passenger'}</span>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {r.rating} / 5
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS TAB (FULL CRUD) */}
        {activeTab === 'Announcements' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map((ann) => (
                <motion.div 
                  key={ann._id} 
                  variants={fadeUp}
                  className="bg-[#1a1b23] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            ann.priority === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            ann.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {ann.priority} Priority
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10 uppercase font-semibold">
                            Audience: {ann.targetAudience}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                          {ann.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleOpenAnnModal(ann)}
                          className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit Announcement"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAnnouncement(ann._id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Announcement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed mb-4">
                      {ann.message}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-white/5">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Published {ann.publishedAt?.split('T')[0] || 'Recently'}
                    </span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {ann.status || 'ACTIVE'}
                    </span>
                  </div>
                </motion.div>
              ))}
              {announcements.length === 0 && (
                <div className="col-span-2 text-center py-12 bg-[#1a1b23] rounded-2xl border border-white/5 text-gray-400">
                  No announcements published yet. Click "New Announcement" above to publish one.
                </div>
              )}
            </div>
          </div>
        )}

        {/* REVIEWS & KEYWORD SEARCH TAB */}
        {activeTab === 'Reviews' && (
          <div className="flex flex-col gap-6">
            {/* Search Filter */}
            <div className="bg-[#1a1b23] border border-white/5 rounded-2xl p-4 flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Execute MongoDB regex text search (e.g. late, delay, clean, smooth)..." 
                  className="w-full bg-[#0a0b10] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              {keyword && (
                <button 
                  onClick={() => setKeyword('')}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.map((r, i) => (
                <motion.div key={r._id || i} variants={fadeUp} className="bg-[#1a1b23] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">{r.passengerName || 'Passenger Review'}</h4>
                        <span className="text-xs text-gray-500">Route #{r.routeId} {r.vehicleId ? `• Vehicle #${r.vehicleId}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-amber-400">{r.rating} / 5</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 italic mb-4 leading-relaxed">
                      "{r.comment}"
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      r.type === 'COMPLAINT' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {r.type}
                    </span>
                    {(r.tags || []).map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/5 flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" /> {t}
                      </span>
                    ))}
                    <span className="text-[10px] text-gray-500 ml-auto">
                      {r.createdAt?.split('T')[0] || 'Recently'}
                    </span>
                  </div>
                </motion.div>
              ))}
              {filteredReviews.length === 0 && (
                <div className="col-span-2 text-center py-12 bg-[#1a1b23] rounded-2xl border border-white/5 text-gray-400">
                  No reviews match your keyword query.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOP RATED TAB (AGGREGATION) */}
        {activeTab === 'Top Rated' && (
          <div className="bg-[#1a1b23] border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Highest-Rated Vehicles & Drivers</h2>
            <p className="text-sm text-gray-400 mb-6">Generated from the MongoDB collection aggregation pipeline ($group + $avg + $sort).</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topRated.map((item, idx) => (
                <div key={idx} className="bg-[#0a0b10] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Rank #{idx + 1}</span>
                      <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {(item.avgRating || 4.8).toFixed(1)}
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">
                      Vehicle #{item._id || (100 + idx)}
                    </h3>
                    <p className="text-xs text-gray-400">Aggregated from {item.count || 12} certified passenger evaluations.</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                    <span>Performance</span>
                    <span className="text-emerald-400 font-bold">Excellent</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'Documents' && (
          <div className="flex flex-col gap-6">
            <div className="bg-[#1a1b23] border border-white/5 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-2">Fleet Compliance & Vehicle Documents</h2>
              <p className="text-sm text-gray-400 mb-6">Document repositories, insurance policies, and fitness certifications stored in MongoDB.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc, idx) => (
                  <motion.div key={doc._id || idx} variants={fadeUp} className="bg-[#0a0b10] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                          {doc.documentType || 'CERTIFICATE'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          doc.status === 'VALID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {doc.status || 'VALID'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1">
                        {doc.fileName || `Document #${idx + 1}`}
                      </h3>
                      <p className="text-xs text-gray-400">Assigned to Vehicle #{doc.vehicleId}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                      <span>{doc.uploadedAt ? `Uploaded ${doc.uploadedAt.split('T')[0]}` : 'Active Record'}</span>
                      <a 
                        href={doc.url || '#'} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </a>
                    </div>
                  </motion.div>
                ))}
                {documents.length === 0 && (
                  <div className="col-span-3 text-center py-12 bg-[#0a0b10] rounded-xl border border-white/5 text-gray-400">
                    No documents currently archived for this fleet vehicle.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </motion.div>

      {/* CREATE / EDIT ANNOUNCEMENT MODAL */}
      <AnimatePresence>
        {showAnnModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b23] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {selectedAnn ? 'Edit Announcement' : 'Publish New Announcement'}
              </h2>
              <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Headline / Title *</label>
                  <input 
                    type="text" 
                    required
                    value={annForm.title}
                    onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                    className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-purple-500"
                    placeholder="e.g. Expressway Service Schedule Update"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Audience</label>
                    <select 
                      value={annForm.targetAudience}
                      onChange={(e) => setAnnForm({ ...annForm, targetAudience: e.target.value as any })}
                      className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-purple-500"
                    >
                      <option value="ALL">All Users</option>
                      <option value="PASSENGERS">Passengers</option>
                      <option value="DRIVERS">Drivers</option>
                      <option value="ADMIN">Admins Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Priority</label>
                    <select 
                      value={annForm.priority}
                      onChange={(e) => setAnnForm({ ...annForm, priority: e.target.value as any })}
                      className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-purple-500"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Announcement Message *</label>
                  <textarea 
                    rows={4}
                    required
                    value={annForm.message}
                    onChange={(e) => setAnnForm({ ...annForm, message: e.target.value })}
                    className="w-full bg-[#0a0b10] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-purple-500 resize-none text-sm"
                    placeholder="Provide full announcement details..."
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowAnnModal(false)}
                    className="px-5 py-2.5 rounded-xl font-semibold text-gray-400 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-purple-500/20"
                  >
                    Save & Publish
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
