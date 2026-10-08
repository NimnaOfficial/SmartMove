import { motion } from 'framer-motion';
import { BellRing, AlertTriangle, Info, Calendar, Users, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/layout/navbar/Navbar';
import Footer from '@/components/layout/footer/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

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
  const [searchQuery, setSearchQuery] = useState('');

  const getPriorityStyles = (type: string) => {
    switch(type) {
      case 'alert':
        return { icon: BellRing, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', badge: 'bg-red-600' };
      case 'warning':
        return { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', badge: 'bg-amber-500' };
      case 'info':
      default:
        return { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', badge: 'bg-blue-600' };
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen font-sans">
      <Navbar />

      {/* =========================================
          HERO SECTION
          ========================================= */}
      <section className="relative h-[45vh] min-h-[380px] w-full flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop"
            alt="Communication Network"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-900/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent" />
        </div>

        <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 xl:px-32 text-center pb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-4 drop-shadow-lg"
          >
            Live <span className="font-serif italic text-blue-300">Announcements</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-300 font-light max-w-2xl mx-auto drop-shadow-md"
          >
            Real-time operational updates, travel alerts, and news directly from our dispatch network.
          </motion.p>
        </div>
      </section>

      {/* =========================================
          FILTER WIDGET (Overlapping Hero)
          ========================================= */}
      <section className="relative z-20 w-full px-8 md:px-16 lg:px-24 xl:px-32 -mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-2xl rounded-3xl p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] ring-1 ring-white/50 max-w-5xl mx-auto flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements by keyword..." 
              className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <button className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-medium hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </motion.div>
      </section>

      {/* =========================================
          ANNOUNCEMENTS GRID
          ========================================= */}
      <section className="py-20 px-8 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-5xl mx-auto">
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {mockAnnouncements.map((announcement) => {
              const styles = getPriorityStyles(announcement.type);
              const Icon = styles.icon;

              return (
                <motion.div 
                  key={announcement.id} 
                  variants={fadeUp}
                  className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${styles.bg} ${styles.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] uppercase tracking-widest font-bold text-white px-3 py-1 rounded-full ${styles.badge} mb-2 shadow-sm`}>
                        {announcement.priority}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {announcement.publishedDate}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-medium text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {announcement.title}
                  </h3>
                  
                  <p className="text-gray-500 font-light leading-relaxed mb-8 flex-grow">
                    {announcement.message}
                  </p>

                  <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4 text-gray-400" />
                      Audience: <span className="font-medium text-gray-700">{announcement.audience}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
