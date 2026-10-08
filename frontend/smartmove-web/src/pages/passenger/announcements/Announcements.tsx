import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellRing, AlertTriangle, Info, Calendar, Users, Search, 
  Filter, Megaphone, ChevronRight
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const tabs = ['All', 'Alerts', 'News'] as const;
type TabType = typeof tabs[number];

// Mock MongoDB Document Data
const mockAnnouncements = [
  {
    id: 'ANN-001',
    title: 'Mountain Pass Express Detour',
    message: 'Due to heavy snowfall in the northern region, all trips on the Mountain Pass route will experience an estimated 45-minute delay. Our routing algorithms have already selected the safest alternative paths. Your safety is our absolute priority.',
    publishedDate: 'Oct 08, 2026 • 14:30',
    priority: 'High Priority',
    audience: 'Mountain Route Passengers',
    type: 'alert'
  },
  {
    id: 'ANN-002',
    title: 'New Luxury Fleet Additions',
    message: 'We are thrilled to announce the addition of 15 new premium hybrid-electric coaches to our coastal lines. These vehicles feature expanded legroom, panoramic windows, and ultra-fast complimentary Wi-Fi for all passengers.',
    publishedDate: 'Oct 05, 2026 • 09:00',
    priority: 'General News',
    audience: 'All Passengers',
    type: 'info'
  },
  {
    id: 'ANN-003',
    title: 'Scheduled System Maintenance',
    message: 'Our central booking and e-ticketing system will undergo scheduled infrastructure upgrades on Sunday from 2:00 AM to 4:00 AM EST. Ticket purchasing will be temporarily paused during this window. Active tickets remain valid.',
    publishedDate: 'Oct 01, 2026 • 10:15',
    priority: 'Warning',
    audience: 'All Users',
    type: 'warning'
  },
  {
    id: 'ANN-004',
    title: 'Holiday Schedule Adjustments',
    message: 'In preparation for the upcoming national holiday, we are adding 50 additional express routes between major hubs to accommodate increased travel demand. Check the trip search portal for newly available times.',
    publishedDate: 'Sep 28, 2026 • 16:45',
    priority: 'General News',
    audience: 'All Passengers',
    type: 'info'
  }
];

export default function Announcements() {
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  const filteredAnnouncements = mockAnnouncements.filter(a => {
    const matchesTab = 
      activeTab === 'All' ? true : 
      activeTab === 'Alerts' ? (a.type === 'alert' || a.type === 'warning') : 
      (a.type === 'info');
      
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.message.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesTab && matchesSearch;
  });

  const getPriorityStyles = (type: string) => {
    switch(type) {
      case 'alert':
        return { icon: BellRing, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', badge: 'bg-red-100 text-red-700', side: 'bg-red-500' };
      case 'warning':
        return { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', badge: 'bg-amber-100 text-amber-700', side: 'bg-amber-500' };
      case 'info':
      default:
        return { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', badge: 'bg-blue-100 text-blue-700', side: 'bg-blue-500' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col w-full pb-10">
      
      {/* Header Section */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-[#1e3f7a]">
              <Megaphone className="w-6 h-6" />
            </div>
            Announcements
          </h1>
          <p className="text-gray-500 mt-2 font-light max-w-lg">
            Real-time operational updates, travel alerts, and news directly from our dispatch network.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search announcements..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3f7a] focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <button className="flex-shrink-0 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 shadow-sm">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-2 mb-8 bg-gray-100/80 p-1.5 rounded-full w-fit border border-gray-200/50">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeTab === tab ? 'text-[#1e3f7a]' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="announcementTab"
                className="absolute inset-0 bg-white rounded-full shadow-sm border border-gray-200/50"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </motion.div>

      {/* Announcements List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-5"
          >
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => {
                const styles = getPriorityStyles(announcement.type);
                const Icon = styles.icon;

                return (
                  <motion.div 
                    key={announcement.id}
                    variants={fadeUp}
                    className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-blue-100 transition-all duration-300 flex flex-col md:flex-row gap-6 group relative overflow-hidden"
                  >
                    {/* Decorative Side Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${styles.side}`} />

                    {/* Left: Icon & Title */}
                    <div className="flex-1 md:max-w-md flex flex-col justify-center">
                      <div className="flex items-start gap-4 mb-3">
                        <div className={`w-10 h-10 rounded-xl ${styles.bg} ${styles.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles.badge} mb-2`}>
                            {announcement.priority}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1e3f7a] transition-colors line-clamp-2">{announcement.title}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Message */}
                    <div className="flex-1 flex flex-col justify-center px-4 md:border-l md:border-gray-100">
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                        {announcement.message}
                      </p>
                    </div>

                    {/* Right: Meta & Actions */}
                    <div className="flex flex-col items-start md:items-end justify-center md:border-l md:border-gray-100 md:pl-6 min-w-[160px] gap-3 mt-4 md:mt-0">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{announcement.publishedDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-700">{announcement.audience}</span>
                      </div>
                      <button 
                        onClick={() => setSelectedAnnouncement(announcement)}
                        className="mt-2 w-full md:w-auto px-4 py-2 rounded-xl bg-gray-50 text-[#1e3f7a] text-sm font-semibold hover:bg-blue-50 border border-gray-200 hover:border-blue-100 transition-colors flex items-center justify-center gap-1 group/btn"
                      >
                        Read More
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Megaphone className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No announcements found</h3>
                <p className="text-gray-500 font-light max-w-md">
                  We couldn't find any announcements matching your current filters or search query.
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e3f7a]/40 backdrop-blur-sm"
            onClick={() => setSelectedAnnouncement(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-[#1e3f7a] p-6 text-white flex justify-between items-start relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-transparent" />
                <div className="relative z-10 pr-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                      {selectedAnnouncement.priority}
                    </span>
                    <span className="text-blue-200 text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {selectedAnnouncement.publishedDate}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold leading-tight mt-2">
                    {selectedAnnouncement.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedAnnouncement(null)}
                  className="relative z-10 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                    {selectedAnnouncement.message}
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span>Target Audience: <strong className="text-gray-900">{selectedAnnouncement.audience}</strong></span>
                  </div>
                  <button 
                    onClick={() => setSelectedAnnouncement(null)}
                    className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
