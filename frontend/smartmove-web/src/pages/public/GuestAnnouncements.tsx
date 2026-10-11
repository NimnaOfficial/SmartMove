import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Bell, Calendar, AlertTriangle, Info, CheckCircle2, 
  Search, Tag, RefreshCw, AlertCircle, ArrowRight
} from 'lucide-react';
import Navbar from '@/components/layout/navbar/Navbar';
import Footer from '@/components/layout/footer/Footer';
import contentService from '@/services/contentService';
import { Announcement } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

export default function GuestAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await contentService.getAllAnnouncements();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to retrieve live announcement feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesPriority = selectedPriority === 'ALL' || item.priority === selectedPriority;
    const matchesSearch = 
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.message || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> High Priority
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Info className="w-3.5 h-3.5 text-amber-600" /> Notice
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> General
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-950 via-[#162038] to-[#1e3f7a] text-white py-20 px-8 md:px-16 lg:px-24 xl:px-32 overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-blue-400/20"
            >
              <Bell className="w-3.5 h-3.5 text-blue-400" />
              <span>Official System Broadcasts</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              Transit Updates & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Announcements</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed"
            >
              Stay informed with real-time operational bulletins, route alerts, weather detours, and schedule revisions.
            </motion.p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 mt-12">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Priority Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPriority(p)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedPriority === p
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p === 'ALL' ? 'All Updates' : `${p} Priority`}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Feed List */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 text-gray-500">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-medium">Loading transit announcements from MongoDB...</p>
            </div>
          ) : error ? (
            <div className="my-12 p-8 bg-red-50 border border-red-200 rounded-3xl text-center max-w-xl mx-auto">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-red-800">Connection Error</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <button 
                onClick={fetchAnnouncements}
                className="mt-4 px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="py-24 text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No Announcements</h3>
              <p className="text-sm text-gray-500 mt-2">
                There are currently no active announcements matching your filter. Check back soon for transit updates!
              </p>
            </div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6 mt-8"
            >
              {filteredAnnouncements.map((item, idx) => {
                const dateStr = item.createdAt 
                  ? new Date(item.createdAt).toLocaleDateString([], { 
                      month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })
                  : 'Recent Notice';

                return (
                  <motion.div 
                    key={item.id || item._id || idx}
                    variants={fadeUp}
                    className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        {getPriorityBadge(item.priority)}
                        {item.category && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            <Tag className="w-3 h-3" /> {item.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {item.message}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
