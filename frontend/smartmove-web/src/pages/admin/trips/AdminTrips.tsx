import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Eye, Trash2, ShieldCheck, Users, Clock } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AdminTrips() {
  const [search, setSearch] = useState('');

  const mockTrips = [
    { id: 'T-1042', route: 'Colombo &rarr; Kandy', vehicle: 'ND-4521', driver: 'D. Palve', date: 'Oct 15, 2026', time: '08:00 AM', booked: 32, capacity: 45, status: 'Scheduled' },
    { id: 'T-1045', route: 'Colombo &rarr; Galle', vehicle: 'ND-3210', driver: 'S. Silva', date: 'Oct 15, 2026', time: '09:15 AM', booked: 25, capacity: 25, status: 'Full' },
    { id: 'T-1048', route: 'Kandy &rarr; Nuwara Eliya', vehicle: 'ND-8891', driver: 'K. Perera', date: 'Oct 16, 2026', time: '07:30 AM', booked: 5, capacity: 54, status: 'Scheduled' },
  ];

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Trip Scheduling</h1>
          <p className="text-gray-400 mt-2 font-medium">Manage and monitor daily trip operations.</p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform flex items-center gap-2">
          <Plus className="w-5 h-5" /> Schedule Trip
        </button>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 shadow-xl flex flex-col md:flex-row gap-4 items-center mt-4">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search trips by ID or route..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0b10] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0a0b10] border border-white/10 text-gray-300 font-semibold hover:text-white transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="bg-[#1a1b23] border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#0a0b10]/50 border-b border-white/5 text-xs uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-5 pl-8">Trip ID</th>
                <th className="p-5">Route</th>
                <th className="p-5">Schedule</th>
                <th className="p-5">Vehicle & Driver</th>
                <th className="p-5">Occupancy</th>
                <th className="p-5">Status</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockTrips.map((t) => (
                <motion.tr variants={fadeUp} key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 pl-8 font-semibold text-white">{t.id}</td>
                  <td className="p-5 text-sm font-medium text-gray-200" dangerouslySetInnerHTML={{ __html: t.route }}></td>
                  <td className="p-5">
                    <p className="text-sm font-bold text-gray-200 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-purple-400" /> {t.time}</p>
                    <p className="text-xs text-gray-500 mt-1">{t.date}</p>
                  </td>
                  <td className="p-5">
                    <p className="text-sm text-gray-300 font-medium flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> {t.vehicle}</p>
                    <p className="text-xs text-gray-500 mt-1">{t.driver}</p>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                       <Users className="w-4 h-4 text-emerald-400" />
                       <span className="text-sm font-bold text-gray-200">{t.booked} <span className="text-gray-500 font-medium">/ {t.capacity}</span></span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                      ${t.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-5 pr-8 flex items-center justify-end gap-2">
                    <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
