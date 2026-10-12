import { useState, useEffect } from 'react';
import routeService from '@/services/routeService';
import { RouteInfo, RouteFormData } from '@/types';
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
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteInfo | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [formData, setFormData] = useState<RouteFormData>({
    origin: '',
    destination: '',
    status: 'ACTIVE',
    distance: 50,
    duration: '1h 30m',
    baseFare: 350
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = async () => {
    try {
      const data = await routeService.getAll();
      setRoutes(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error('Failed to fetch routes:', e);
      setError('Failed to fetch routes.');
    }
  };

  useEffect(() => {
    fetchRoutes();
    const interval = setInterval(fetchRoutes, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'distance' || name === 'baseFare') ? Number(value) : value
    }));
  };

  const handleCreateOrEdit = (r?: RouteInfo | null) => {
    setError(null);
    if (r) {
      setSelectedRoute(r);
      setFormData({
        origin: r.origin || '',
        destination: r.destination || '',
        status: r.status || 'ACTIVE',
        distance: r.distanceKm ?? r.distance ?? 50,
        duration: r.estimatedDuration ?? r.duration ?? '1h 30m',
        baseFare: r.baseFare ?? 350,
        description: r.description || ''
      });
    } else {
      setSelectedRoute(null);
      setFormData({
        origin: '',
        destination: '',
        status: 'ACTIVE',
        distance: 50,
        duration: '1h 30m',
        baseFare: 350,
        description: ''
      });
    }
    setViewMode(false);
    setShowForm(true);
  };

  const handleView = (r: RouteInfo) => {
    setSelectedRoute(r);
    setViewMode(true);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    const route = routes.find(r => r.routeId === id);
    const label = route ? `#${route.routeId} (${route.origin} -> ${route.destination})` : `Route #${id}`;
    if (!window.confirm(`Are you sure you want to delete ${label}?`)) return;
    try {
      await routeService.delete(id);
      setNotice({ type: 'success', message: `${label} removed or deactivated successfully.` });
      await fetchRoutes();
    } catch (e: any) {
      console.error('Failed to delete route', e);
      alert('Failed to delete route: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const origin = (formData.origin || '').trim();
      const destination = (formData.destination || '').trim();

      if (!origin) {
        setError('Origin is required.');
        setIsSubmitting(false);
        return;
      }
      if (!destination) {
        setError('Destination is required.');
        setIsSubmitting(false);
        return;
      }
      if (origin.toLowerCase() === destination.toLowerCase()) {
        setError('Origin and destination cannot be the same.');
        setIsSubmitting(false);
        return;
      }

      const dist = Number(formData.distance) > 0 ? Number(formData.distance) : 50;
      const fare = Number(formData.baseFare) >= 0 ? Number(formData.baseFare) : Math.max(50, dist * 5);
      const dur = (formData.duration || '').trim() || '1h 30m';

      const payload: RouteFormData = {
        origin,
        destination,
        status: formData.status || 'ACTIVE',
        distance: dist,
        distanceKm: dist,
        duration: dur,
        estimatedDuration: dur,
        baseFare: fare,
        description: formData.description?.trim() || undefined
      };

      if (selectedRoute) {
        await routeService.update(selectedRoute.routeId, payload);
        setNotice({ type: 'success', message: `Route #${selectedRoute.routeId} (${origin} -> ${destination}) updated successfully.` });
      } else {
        const created = await routeService.create(payload);
        setNotice({ type: 'success', message: `Route #${created.routeId || ''} (${origin} -> ${destination}) created successfully.` });
      }
      setShowForm(false);
      setSelectedRoute(null);
      await fetchRoutes();
    } catch (e: any) {
      console.error('Failed to save route', e);
      setError(e.response?.data?.message || e.message || 'Failed to save route. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = routes.filter(r => {
    const term = search.toLowerCase();
    const matchesSearch = 
      (r.origin || '').toLowerCase().includes(term) || 
      (r.destination || '').toLowerCase().includes(term) ||
      (r.routeId?.toString() || '').includes(term) ||
      (r.estimatedDuration || r.duration || '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Route Network</h1>
          <p className="text-gray-400 mt-2 font-medium">Configure and manage travel routes across the network.</p>
        </div>
        <button 
          onClick={() => handleCreateOrEdit(null)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Create Route
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
          <div className="relative flex-1 md:flex-none">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full md:w-auto appearance-none pl-11 pr-8 py-3 rounded-xl bg-[#0a0b10] border border-white/10 text-gray-300 font-semibold hover:text-white focus:outline-none focus:border-purple-500 cursor-pointer transition-colors"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <button 
            onClick={() => fetchRoutes()} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0a0b10] border border-white/10 text-gray-300 font-semibold hover:text-white transition-colors"
            title="Refresh routes from database"
          >
            Refresh
          </button>
        </div>
      </motion.div>

      {error && !showForm && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      )}

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="bg-[#1a1b23] border border-white/5 rounded-[2rem] overflow-hidden shadow-xl mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#0a0b10]/50 border-b border-white/5 text-xs uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-5 pl-8">Route ID</th>
                <th className="p-5">Path (Origin &rarr; Destination)</th>
                <th className="p-5">Distance/Time</th>
                <th className="p-5">Status</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((r) => (
                <motion.tr variants={fadeUp} key={r.routeId} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 pl-8 font-semibold text-white">#{r.routeId}</td>
                  <td className="p-5">
                    <div className="flex items-center gap-3 text-sm text-gray-200 font-medium">
                      <span>{r.origin}</span>
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                      <span>{r.destination}</span>
                    </div>
                  </td>
                  <td className="p-5 text-gray-400 text-sm">
                    {(r.distanceKm ?? r.distance) ? `${r.distanceKm ?? r.distance} km` : 'N/A'} <br/> {r.estimatedDuration || r.duration || 'N/A'}
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                      ${r.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-5 pr-8 flex items-center justify-end gap-2">
                    <button onClick={() => handleView(r)} title="View Route" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleCreateOrEdit(r)} title="Edit Route" className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(r.routeId)} title="Delete Route" className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No routes found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit/View Route Modal */}
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
              <h2 className="text-2xl font-bold text-white mb-6">
                {viewMode ? 'Route Details' : (selectedRoute ? `Edit Route #${selectedRoute.routeId}` : 'Create New Route')}
              </h2>
              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              
              {viewMode && selectedRoute ? (
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Route ID</span>
                    <span className="text-white font-medium">#{selectedRoute.routeId}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Path</span>
                    <span className="text-white font-medium">{selectedRoute.origin} &rarr; {selectedRoute.destination}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Distance</span>
                    <span className="text-white font-medium">{(selectedRoute.distanceKm ?? selectedRoute.distance) ? `${selectedRoute.distanceKm ?? selectedRoute.distance} km` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-medium">{selectedRoute.estimatedDuration || selectedRoute.duration || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Base Fare</span>
                    <span className="text-emerald-400 font-medium font-mono">{selectedRoute.baseFare != null ? `LKR ${selectedRoute.baseFare.toFixed(2)}` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Status</span>
                    <span className="text-white font-medium">{selectedRoute.status}</span>
                  </div>
                  {selectedRoute.description && (
                    <div className="flex flex-col border-b border-white/5 pb-2">
                      <span className="text-gray-400 mb-1">Description</span>
                      <span className="text-white font-medium text-sm">{selectedRoute.description}</span>
                    </div>
                  )}
                  <div className="flex justify-end gap-3 mt-8">
                    <button onClick={() => { setShowForm(false); setSelectedRoute(null); setViewMode(false); }} className="px-5 py-2.5 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-all">Close</button>
                    <button onClick={() => handleCreateOrEdit(selectedRoute)} className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all">Edit Route</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400 block mb-1">Origin *</label>
                      <input required type="text" name="origin" value={formData.origin} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="e.g. Colombo" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400 block mb-1">Destination *</label>
                      <input required type="text" name="destination" value={formData.destination} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="e.g. Kandy" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400 block mb-1">Distance (km)</label>
                      <input type="number" min="0" step="0.1" name="distance" value={formData.distance} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="e.g. 115" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400 block mb-1">Duration (e.g. 3h 30m)</label>
                      <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="e.g. 3h 30m" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400 block mb-1">Base Fare (LKR / $)</label>
                      <input type="number" min="0" step="10" name="baseFare" value={formData.baseFare || ''} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="e.g. 350" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400 block mb-1">Status</label>
                      <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50">
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Description</label>
                    <input type="text" name="description" value={formData.description || ''} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="Route description..." />
                  </div>
                  <div className="flex justify-end gap-3 mt-8">
                    <button type="button" onClick={() => { setShowForm(false); setSelectedRoute(null); setViewMode(false); }} className="px-5 py-2.5 rounded-xl font-semibold text-gray-300 hover:bg-white/5 transition-all">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all disabled:opacity-50">
                      {isSubmitting ? 'Saving...' : (selectedRoute ? 'Update Route' : 'Save Route')}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
