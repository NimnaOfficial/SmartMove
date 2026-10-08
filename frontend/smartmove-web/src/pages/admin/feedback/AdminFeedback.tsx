import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, Filter, Star, Eye } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AdminFeedback() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  const mockFeedback = [
    { id: 'F-001', rating: 5, passenger: 'John Doe', route: 'Colombo - Kandy', vehicle: 'ND-4521', driver: 'D. Palve', date: '2023-11-01', comment: 'Excellent trip, very comfortable and on time.' },
    { id: 'F-002', rating: 3, passenger: 'Jane Smith', route: 'Galle - Colombo', vehicle: 'ND-3210', driver: 'S. Silva', date: '2023-11-02', comment: 'AC was not working properly, but the driver was polite.' },
    { id: 'F-003', rating: 4, passenger: 'Kamal Perera', route: 'Kandy - Nuwara Eliya', vehicle: 'ND-8891', driver: 'K. Perera', date: '2023-11-03', comment: 'Good service.' },
    { id: 'F-004', rating: 2, passenger: 'Nimali Fernando', route: 'Colombo - Jaffna', vehicle: 'ND-7712', driver: 'Unassigned', date: '2023-11-04', comment: 'Bus departed 30 mins late without prior notice.' },
  ];

  const filtered = mockFeedback.filter(f => 
    (activeFilter === 'All' || 
     (activeFilter === 'Positive' && f.rating >= 4) || 
     (activeFilter === 'Negative' && f.rating <= 2) || 
     (activeFilter === 'Neutral' && f.rating === 3)) &&
    (f.passenger.toLowerCase().includes(search.toLowerCase()) || 
     f.route.toLowerCase().includes(search.toLowerCase()) ||
     f.comment.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Passenger Feedback</h1>
          <p className="text-gray-400 mt-2 font-medium">Monitor ratings and reviews from passengers.</p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#1a1b23] p-4 rounded-2xl border border-white/5 shadow-xl">
        <div className="flex gap-2 w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['All', 'Positive', 'Neutral', 'Negative'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeFilter === tab ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-400 hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0a0b10] text-gray-200 pl-10 pr-4 py-2.5 rounded-xl border border-white/5 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-600"
            />
          </div>
          <button className="p-2.5 bg-[#0a0b10] border border-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4">
        {filtered.map((item) => (
          <motion.div key={item.id} variants={fadeUp} className="bg-[#1a1b23] rounded-2xl p-5 border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{item.passenger}</h3>
                  <div className="flex items-center gap-1 bg-[#0a0b10] px-2 py-1 rounded-md border border-white/5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-300 mt-2 line-clamp-2">
                  "{item.comment}"
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500 font-medium">
                  <span className="bg-[#0a0b10] px-2 py-1 rounded border border-white/5">{item.route}</span>
                  <span className="bg-[#0a0b10] px-2 py-1 rounded border border-white/5">{item.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setSelectedFeedback(item)} className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl transition-all flex items-center gap-2 font-medium">
                <Eye className="w-4 h-4" />
                View
              </button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 bg-[#1a1b23] rounded-2xl border border-white/5">
            <p className="text-gray-400 font-medium">No feedback matches your criteria.</p>
          </div>
        )}
      </motion.div>

      {/* Feedback Details Modal */}
      <AnimatePresence>
        {selectedFeedback && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b23] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Feedback Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-6 h-6 ${i < selectedFeedback.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                  ))}
                </div>
                
                <div className="bg-[#0a0b10] p-4 rounded-xl border border-white/5 text-gray-300 italic">
                  "{selectedFeedback.comment}"
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-medium">Passenger</span>
                    <p className="text-white font-medium">{selectedFeedback.passenger}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-medium">Date</span>
                    <p className="text-white font-medium">{selectedFeedback.date}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-medium">Route</span>
                    <p className="text-white font-medium">{selectedFeedback.route}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-medium">Vehicle</span>
                    <p className="text-white font-medium">{selectedFeedback.vehicle}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-medium">Driver</span>
                    <p className="text-white font-medium">{selectedFeedback.driver}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={() => setSelectedFeedback(null)} className="px-5 py-2.5 rounded-xl font-semibold bg-indigo-500 text-white hover:bg-indigo-400 transition-all">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
