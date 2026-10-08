import { useState, useEffect } from 'react';
import routeService from '@/services/routeService';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Eye, Trash2, ArrowRight, Search, Filter } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AdminRoutes() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  
  const [routes, setRoutes] = useState<any[]>([]);
  

  const fetchRoutes = async () => {
    try {
      
      const data = await routeService.getAll();
      setRoutes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const filtered = routes.filter(r => 
    r.origin.toLowerCase().includes(search.toLowerCase()) || 
    r.destination.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Route Network</h1>
          <p className="text-gray-400 mt-2 font-medium">Configure and manage travel routes across the network.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Create Route
        </button>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 shadow-xl flex flex-col md:flex-row gap-4 items-center mt-4">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by origin, destination or ID..." 
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
              {filtered.map((r) => (
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
                    <button onClick={() => setSelectedRoute(r)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setSelectedRoute(r); setShowForm(true); }} className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors">
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

      {/* Add/Edit Route Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b23] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
            >
              <h2 className="text-2xl font-bold text-white mb-6">{selectedRoute ? 'Edit Route' : 'Create New Route'}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Origin</label>
                    <input type="text" defaultValue={selectedRoute?.origin} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="e.g. Colombo" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Destination</label>
                    <input type="text" defaultValue={selectedRoute?.destination} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="e.g. Kandy" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Status</label>
                  <select defaultValue={selectedRoute?.status} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => { setShowForm(false); setSelectedRoute(null); }} className="px-5 py-2.5 rounded-xl font-semibold text-gray-300 hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={() => { setShowForm(false); setSelectedRoute(null); }} className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all">Save Route</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Route Modal */}
      <AnimatePresence>
        {selectedRoute && !showForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b23] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Route Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Route ID</span>
                  <span className="text-white font-medium">{selectedRoute.id}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Path</span>
                  <span className="text-white font-medium">{selectedRoute.origin} &rarr; {selectedRoute.destination}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Active Trips</span>
                  <span className="text-white font-medium">{selectedRoute.trips} Trips</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Status</span>
                  <span className="text-white font-medium">{selectedRoute.status}</span>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={() => setSelectedRoute(null)} className="px-5 py-2.5 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-all">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
