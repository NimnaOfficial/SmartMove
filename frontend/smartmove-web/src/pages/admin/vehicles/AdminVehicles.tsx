import { useState, useEffect } from 'react';
import vehicleService from '@/services/vehicleService';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Search, Filter, Plus, Edit2, Eye, Trash2, Settings2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AdminVehicles() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  
  const [vehicles, setVehicles] = useState<any[]>([]);
  

  const fetchVehicles = async () => {
    try {
      
      const data = await vehicleService.getAll();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filtered = vehicles.filter(v => 
    v.reg.toLowerCase().includes(search.toLowerCase()) || 
    v.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Vehicle Fleet</h1>
          <p className="text-gray-400 mt-2 font-medium">Manage and monitor all operational vehicles.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Vehicle
        </button>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 shadow-xl flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by registration or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0b10] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0a0b10] border border-white/10 text-gray-300 font-semibold hover:text-white transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0a0b10] border border-white/10 text-gray-300 font-semibold hover:text-white transition-colors">
            <Settings2 className="w-4 h-4" /> Columns
          </button>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="bg-[#1a1b23] border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#0a0b10]/50 border-b border-white/5 text-xs uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-5 pl-8">Vehicle ID</th>
                <th className="p-5">Registration</th>
                <th className="p-5">Type / Capacity</th>
                <th className="p-5">Assigned Driver</th>
                <th className="p-5">Status</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((v) => (
                <motion.tr variants={fadeUp} key={v.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 pl-8 font-semibold text-white">{v.id}</td>
                  <td className="p-5 text-sm font-medium text-gray-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Car className="w-4 h-4" />
                      </div>
                      {v.reg}
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="text-sm text-gray-300 font-medium">{v.type}</p>
                    <p className="text-xs text-gray-500">{v.capacity} Seats</p>
                  </td>
                  <td className="p-5 text-sm text-gray-400">{v.driver}</td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                      ${v.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 
                        v.status === 'Maintenance' ? 'bg-orange-500/20 text-orange-400' : 
                        'bg-red-500/20 text-red-400'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-5 pr-8 flex items-center justify-end gap-2">
                    <button onClick={() => setSelectedVehicle(v)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setSelectedVehicle(v); setShowForm(true); }} className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors">
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

      {/* Add/Edit Vehicle Modal */}
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
              <h2 className="text-2xl font-bold text-white mb-6">{selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Registration Number</label>
                  <input type="text" defaultValue={selectedVehicle?.reg} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="e.g. ND-4521" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Type</label>
                    <select defaultValue={selectedVehicle?.type} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50">
                      <option>Luxury Coach</option>
                      <option>Mini Bus</option>
                      <option>Standard</option>
                      <option>Sleeper</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Capacity</label>
                    <input type="number" defaultValue={selectedVehicle?.capacity} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="e.g. 45" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Status</label>
                  <select defaultValue={selectedVehicle?.status} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50">
                    <option>Active</option>
                    <option>Maintenance</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => { setShowForm(false); setSelectedVehicle(null); }} className="px-5 py-2.5 rounded-xl font-semibold text-gray-300 hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={() => { setShowForm(false); setSelectedVehicle(null); }} className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Vehicle Modal */}
      <AnimatePresence>
        {selectedVehicle && !showForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b23] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Vehicle Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">ID</span>
                  <span className="text-white font-medium">{selectedVehicle.id}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Registration</span>
                  <span className="text-white font-medium">{selectedVehicle.reg}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white font-medium">{selectedVehicle.type}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Capacity</span>
                  <span className="text-white font-medium">{selectedVehicle.capacity} Seats</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Status</span>
                  <span className="text-white font-medium">{selectedVehicle.status}</span>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={() => setSelectedVehicle(null)} className="px-5 py-2.5 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-all">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
