import { useState, useEffect } from 'react';
import vehicleService from '@/services/vehicleService';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Search, Filter, Plus, Edit2, Eye, Trash2, Settings2 } from 'lucide-react';
import { Vehicle, VehicleFormData } from '@/types';

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
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  const [formData, setFormData] = useState<VehicleFormData>({
    registrationNumber: '',
    type: 'Luxury Coach',
    model: '',
    year: new Date().getFullYear(),
    capacity: 45,
    status: 'ACTIVE'
  });

  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getAll();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error(e);
      setNotice({ type: 'error', message: 'Failed to load vehicles from database.' });
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notice]);

  const handleOpenForm = (v?: Vehicle) => {
    setViewOnly(false);
    setFormError(null);
    if (v) {
      setSelectedVehicle(v);
      setFormData({
        registrationNumber: v.registrationNumber || '',
        type: v.type || 'Luxury Coach',
        model: v.model || '',
        year: v.year || new Date().getFullYear(),
        capacity: v.capacity || 45,
        status: v.status || 'ACTIVE'
      });
    } else {
      setSelectedVehicle(null);
      setFormData({
        registrationNumber: '',
        type: 'Luxury Coach',
        model: '',
        year: new Date().getFullYear(),
        capacity: 45,
        status: 'ACTIVE'
      });
    }
    setShowForm(true);
  };

  const handleView = (v: Vehicle) => {
    setSelectedVehicle(v);
    setViewOnly(true);
    setShowForm(false);
  };

  const handleSave = async () => {
    setFormError(null);
    const reg = (formData.registrationNumber || '').trim().toUpperCase();
    if (!reg) {
      setFormError('Registration number is required (e.g. ND-4521).');
      return;
    }
    const model = (formData.model || '').trim();
    if (!model) {
      setFormError('Vehicle model is required (e.g. Volvo 9900).');
      return;
    }
    if (!formData.capacity || formData.capacity <= 0) {
      setFormError('Capacity must be greater than 0.');
      return;
    }

    setIsSaving(true);
    try {
      const payload: VehicleFormData = {
        ...formData,
        registrationNumber: reg,
        model: model,
        status: formData.status || 'ACTIVE'
      };
      if (selectedVehicle) {
        await vehicleService.update(selectedVehicle.vehicleId, payload);
        setNotice({ type: 'success', message: `Vehicle ${reg} updated successfully.` });
      } else {
        await vehicleService.create(payload);
        setNotice({ type: 'success', message: `Vehicle ${reg} added successfully.` });
      }
      setShowForm(false);
      setSelectedVehicle(null);
      await fetchVehicles();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save vehicle.';
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const v = vehicles.find(item => item.vehicleId === id);
    const reg = v?.registrationNumber || `ID ${id}`;
    if (window.confirm(`Are you sure you want to delete vehicle ${reg}?`)) {
      try {
        await vehicleService.delete(id);
        setNotice({ type: 'success', message: `Vehicle ${reg} processed successfully.` });
        await fetchVehicles();
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || 'Failed to delete vehicle.';
        alert(msg);
      }
    }
  };

  const filtered = vehicles.filter(v => {
    const term = search.toLowerCase();
    const matchesSearch = 
      (v.registrationNumber || '').toLowerCase().includes(term) || 
      (v.vehicleId?.toString() || '').includes(term) ||
      (v.model || '').toLowerCase().includes(term) ||
      (v.type || '').toLowerCase().includes(term) ||
      (v.driverName || '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Vehicle Fleet</h1>
          <p className="text-gray-400 mt-2 font-medium">Manage and monitor all operational vehicles.</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Vehicle
        </button>
      </motion.div>

      {notice && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className={`p-4 rounded-2xl flex items-center justify-between border ${
            notice.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          <span className="text-sm font-medium">{notice.message}</span>
          <button onClick={() => setNotice(null)} className="text-xs font-bold hover:underline ml-4">Dismiss</button>
        </motion.div>
      )}

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 shadow-xl flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by registration, model, type, or driver..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0b10] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full md:w-auto appearance-none pl-11 pr-8 py-3 rounded-xl bg-[#0a0b10] border border-white/10 text-gray-300 font-semibold hover:text-white focus:outline-none focus:border-purple-500 cursor-pointer transition-colors"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <button 
            onClick={() => fetchVehicles()} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0a0b10] border border-white/10 text-gray-300 font-semibold hover:text-white transition-colors"
            title="Refresh fleet from database"
          >
            <Settings2 className="w-4 h-4" /> Refresh
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
                <motion.tr variants={fadeUp} key={v.vehicleId} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 pl-8 font-semibold text-white">{v.vehicleId}</td>
                  <td className="p-5 text-sm font-medium text-gray-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Car className="w-4 h-4" />
                      </div>
                      {v.registrationNumber}
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="text-sm text-gray-300 font-medium">{v.type}</p>
                    <p className="text-xs text-gray-500">{v.capacity} Seats</p>
                  </td>
                  <td className="p-5 text-sm text-gray-400">{v.driverName || 'Unassigned'}</td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                      ${v.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 
                        v.status === 'MAINTENANCE' ? 'bg-orange-500/20 text-orange-400' : 
                        'bg-red-500/20 text-red-400'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-5 pr-8 flex items-center justify-end gap-2">
                    <button onClick={() => handleView(v)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenForm(v)} className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(v.vehicleId)} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-5 text-center text-gray-500">No vehicles found.</td>
                </tr>
              )}
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
              {formError && (
                <div className="p-3.5 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {formError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Registration Number</label>
                  <input type="text" 
                    value={formData.registrationNumber} 
                    onChange={e => setFormData({...formData, registrationNumber: e.target.value})}
                    className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" 
                    placeholder="e.g. ND-4521" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Type</label>
                    <select 
                      value={formData.type} 
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50">
                      <option value="Luxury Coach">Luxury Coach</option>
                      <option value="Mini Bus">Mini Bus</option>
                      <option value="Standard Bus">Standard Bus</option>
                      <option value="Sleeper">Sleeper</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Capacity</label>
                    <input type="number" 
                      value={formData.capacity} 
                      onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                      className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" 
                      placeholder="e.g. 45" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Model</label>
                    <input type="text" 
                      value={formData.model} 
                      onChange={e => setFormData({...formData, model: e.target.value})}
                      className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" 
                      placeholder="e.g. Volvo 9900" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Year</label>
                    <input type="number" 
                      value={formData.year} 
                      onChange={e => setFormData({...formData, year: parseInt(e.target.value) || 2026})}
                      className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50">
                    <option value="ACTIVE">Active</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={() => setShowForm(false)} 
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl font-semibold text-gray-300 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Vehicle Modal */}
      <AnimatePresence>
        {selectedVehicle && viewOnly && (
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
                  <span className="text-white font-medium">{selectedVehicle.vehicleId}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Registration</span>
                  <span className="text-white font-medium">{selectedVehicle.registrationNumber}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white font-medium">{selectedVehicle.type}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Model / Year</span>
                  <span className="text-white font-medium">{selectedVehicle.model} / {selectedVehicle.year}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Capacity</span>
                  <span className="text-white font-medium">{selectedVehicle.capacity} Seats</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Assigned Driver</span>
                  <span className="text-white font-medium">{selectedVehicle.driverName || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Status</span>
                  <span className="text-white font-medium">{selectedVehicle.status}</span>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={() => setViewOnly(false)} className="px-5 py-2.5 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-all">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
