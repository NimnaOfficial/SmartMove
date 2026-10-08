import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Star, MessageSquare, Image as ImageIcon, Bell } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Top Rated', 'Keyword Search', 'Media', 'Announcements'];

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Content Hub</h1>
          <p className="text-gray-400 mt-2 font-medium">Manage unstructured data, media, and advanced queries.</p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex gap-2 w-full overflow-x-auto pb-2 scrollbar-hide border-b border-white/5">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? 'text-indigo-400 border-indigo-500 bg-indigo-500/5' : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-white/5'}`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mt-4">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'MongoDB Query 1', desc: 'Recent negative feedback analysis', icon: <MessageSquare />, color: 'red' },
              { title: 'MongoDB Query 2', desc: 'Highest-rated vehicles & drivers', icon: <Star />, color: 'amber' },
              { title: 'MongoDB Query 3', desc: 'Keyword complaint search', icon: <Search />, color: 'indigo' },
              { title: 'MongoDB Query 4', desc: 'Vehicle documents & multimedia', icon: <ImageIcon />, color: 'blue' },
              { title: 'Announcements Admin', desc: 'Manage system announcements', icon: <Bell />, color: 'emerald' },
            ].map((card, idx) => (
              <motion.div key={idx} variants={fadeUp} className="bg-[#1a1b23] p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl bg-${card.color}-500/10 flex items-center justify-center border border-${card.color}-500/20 text-${card.color}-400 mb-4 group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'Top Rated' && (
          <motion.div variants={fadeUp} className="bg-[#1a1b23] rounded-2xl p-6 border border-white/5">
            <h2 className="text-xl font-bold text-white mb-6">Highest-Rated Drivers & Vehicles</h2>
            <div className="text-center py-10 text-gray-400 border border-dashed border-white/10 rounded-xl bg-[#0a0b10]">
              <Star className="w-8 h-8 mx-auto mb-3 text-amber-500/50" />
              <p>Top Rated queries will be loaded from MongoDB aggregation pipeline.</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'Keyword Search' && (
          <motion.div variants={fadeUp} className="bg-[#1a1b23] rounded-2xl p-6 border border-white/5">
            <h2 className="text-xl font-bold text-white mb-6">Keyword Complaint Search</h2>
            <div className="flex gap-4 mb-6">
              <input type="text" placeholder="e.g. late, delay, clean..." className="flex-1 bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" />
              <button className="px-6 py-2.5 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-400 transition-all">Search</button>
            </div>
            <div className="text-center py-10 text-gray-400 border border-dashed border-white/10 rounded-xl bg-[#0a0b10]">
              <Database className="w-8 h-8 mx-auto mb-3 text-indigo-500/50" />
              <p>Enter a keyword to execute a MongoDB text search query.</p>
            </div>
          </motion.div>
        )}

        {(activeTab === 'Media' || activeTab === 'Announcements') && (
          <motion.div variants={fadeUp} className="bg-[#1a1b23] rounded-2xl p-6 border border-white/5">
             <h2 className="text-xl font-bold text-white mb-6">{activeTab} Management</h2>
             <div className="text-center py-10 text-gray-400 border border-dashed border-white/10 rounded-xl bg-[#0a0b10]">
               <p>This module is connected to the unstructured data store.</p>
             </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
