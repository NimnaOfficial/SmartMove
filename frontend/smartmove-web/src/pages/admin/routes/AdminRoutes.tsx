import { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Plus, Edit2, Eye, Trash2, ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AdminRoutes() {
  const mockRoutes = [
    { id: 'RT-100', origin: 'Colombo', destination: 'Kandy', status: 'Active', trips: 12 },
    { id: 'RT-101', origin: 'Colombo', destination: 'Galle', status: 'Active', trips: 8 },
    { id: 'RT-102', origin: 'Kandy', destination: 'Nuwara Eliya', status: 'Active', trips: 5 },
    { id: 'RT-103', origin: 'Colombo', destination: 'Jaffna', status: 'Inactive', trips: 0 },
  ];

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Route Network</h1>
          <p className="text-gray-400 mt-2 font-medium">Configure and manage travel routes across the network.</p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform flex items-center gap-2">
          <Plus className="w-5 h-5" /> Create Route
        </button>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="bg-[#1a1b23] border border-white/5 rounded-[2rem] overflow-hidden shadow-xl mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#0a0b10]/50 border-b border-white/5 text-xs uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-5 pl-8">Route ID</th>
                <th className="p-5">Path (Origin &rarr; Destination)</th>
                <th className="p-5">Active Trips</th>
                <th className="p-5">Status</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockRoutes.map((r) => (
                <motion.tr variants={fadeUp} key={r.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 pl-8 font-semibold text-white">{r.id}</td>
                  <td className="p-5">
                    <div className="flex items-center gap-3 text-sm text-gray-200 font-medium">
                      <span>{r.origin}</span>
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                      <span>{r.destination}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-lg text-sm font-bold">{r.trips} Trips</span>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                      ${r.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {r.status}
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
