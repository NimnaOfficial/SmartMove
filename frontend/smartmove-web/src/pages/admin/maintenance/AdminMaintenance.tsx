import { useState, useEffect } from 'react';
import maintenanceService from '@/services/maintenanceService';
import vehicleService from '@/services/vehicleService';
import { Maintenance, MaintenanceFormData, Vehicle } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Search, Filter, Plus, Edit2, Eye, Trash2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AdminMaintenance() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Maintenance | null>(null);
  
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<MaintenanceFormData>({
    vehicleId: 0,
    maintenanceDate: new Date().toISOString().split('T')[0],
    nextMaintenanceDate: '',
    type: 'ROUTINE',
    description: '',
    status: 'SCHEDULED',
    cost: 0,
    technician: ''
  });

  const fetchData = async () => {
    try {
      const [mRes, vRes] = await Promise.all([
        maintenanceService.getAll(),
        vehicleService.getAll()
      ]);
      setMaintenanceRecords(Array.isArray(mRes) ? mRes : []);
      setVehicles(Array.isArray(vRes) ? vRes : []);
    } catch (e: any) {
      console.error('Failed to fetch data', e);
      setError('Failed to load data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vehicleId' || name === 'cost' ? Number(value) : value
    }));
  };

  const handleCreateOrEdit = (item: Maintenance | null) => {
    if (item) {
      setFormData({
        vehicleId: item.vehicleId,
        maintenanceDate: item.maintenanceDate ? item.maintenanceDate.split('T')[0] : '',
        nextMaintenanceDate: item.nextMaintenanceDate ? item.nextMaintenanceDate.split('T')[0] : '',
        type: item.type,
        description: item.description,
        status: item.status,
        cost: item.cost || 0,
        technician: item.technician || ''
      });
      setSelectedItem(item);
    } else {
      setFormData({
        vehicleId: vehicles.length > 0 ? vehicles[0].vehicleId : 0,
        maintenanceDate: new Date().toISOString().split('T')[0],
        nextMaintenanceDate: '',
        type: 'ROUTINE',
        description: '',
        status: 'SCHEDULED',
        cost: 0,
        technician: ''
      });
      setSelectedItem(null);
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (selectedItem) {
        await maintenanceService.update(selectedItem.maintenanceId, formData);
      } else {
        await maintenanceService.create(formData);
      }
      setShowForm(false);
      setSelectedItem(null);
      fetchData();
    } catch (e: any) {
      console.error('Failed to save', e);
      setError(e.response?.data?.message || 'Failed to save record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await maintenanceService.delete(selectedItem.maintenanceId);
      setShowDelete(false);
      setSelectedItem(null);
      fetchData();
    } catch (e: any) {
      console.error('Failed to delete maintenance record', e);
      alert('Failed to delete maintenance record: ' + (e.response?.data?.message || e.message));
    }
  };

  const getVehicleReg = (m: Maintenance) => {
    if (m.vehicleRegistration) return m.vehicleRegistration;
    const v = vehicles.find(veh => veh.vehicleId === m.vehicleId);
    return v?.registrationNumber || `Vehicle #${m.vehicleId}`;
  };

  const filtered = maintenanceRecords.filter(m => {
    const vReg = getVehicleReg(m);
    const mType = m.type || '';
    const matchSearch = vReg.toLowerCase().includes(search.toLowerCase()) || 
      mType.toLowerCase().includes(search.toLowerCase()) ||
      m.maintenanceId.toString().includes(search);
    
    // mapping statuses to tabs
    const statusLower = (m.status || '').toLowerCase();
    if (activeTab === 'Due') return matchSearch && (statusLower === 'overdue' || statusLower === 'scheduled');
    if (activeTab === 'Upcoming') return matchSearch && statusLower === 'scheduled';
    if (activeTab === 'Completed') return matchSearch && statusLower === 'completed';
    return matchSearch; // 'All'
  });

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Maintenance Logs</h1>
          <p className="text-gray-400 mt-2 font-medium">Record and track vehicle servicing.</p>
        </div>
        <button 
          onClick={() => handleCreateOrEdit(null)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Record Maintenance</span>
        </button>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#1a1b23] p-4 rounded-2xl border border-white/5 shadow-xl">
        <div className="flex gap-2 w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['All', 'Due', 'Upcoming', 'Completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === tab ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-400 hover:bg-white/5'}`}
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
              placeholder="Search vehicle or type..."
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

      {error && !showForm && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      )}

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4">
        {filtered.map((item) => {
          const vReg = getVehicleReg(item);
          return (
            <motion.div key={item.maintenanceId} variants={fadeUp} className="bg-[#1a1b23] rounded-2xl p-5 border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
                  <PenTool className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{vReg}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : item.status === 'OVERDUE' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-400 font-medium">
                  <span>ID: #{item.maintenanceId}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                  <span>Type: {item.type}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto bg-[#0a0b10] px-6 py-3 rounded-xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Date</span>
                <span className="text-gray-300 font-semibold">{item.maintenanceDate ? item.maintenanceDate.split('T')[0] : 'N/A'}</span>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Next Due</span>
                <span className="text-gray-300 font-semibold">{item.nextMaintenanceDate ? item.nextMaintenanceDate.split('T')[0] : 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setSelectedItem(item)} className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all" title="View Details">
                <Eye className="w-5 h-5" />
              </button>
              <button onClick={() => handleCreateOrEdit(item)} className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all" title="Edit">
                <Edit2 className="w-5 h-5" />
              </button>
              <button onClick={() => { setSelectedItem(item); setShowDelete(true); }} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );
      })}
        {filtered.length === 0 && (
          <div className="text-center py-10 bg-[#1a1b23] rounded-2xl border border-white/5">
            <p className="text-gray-400 font-medium">No maintenance records found.</p>
          </div>
        )}
      </motion.div>

      {/* Record Maintenance Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b23] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">{selectedItem ? 'Edit Maintenance' : 'Record Maintenance'}</h2>
              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Vehicle *</label>
                  <select name="vehicleId" value={formData.vehicleId} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" required>
                    {vehicles.length === 0 && <option value={0} disabled>No vehicles available</option>}
                    {vehicles.map(v => (
                      <option key={v.vehicleId} value={v.vehicleId}>{v.registrationNumber} ({v.type})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Maintenance Date *</label>
                    <input required type="date" name="maintenanceDate" value={formData.maintenanceDate} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50 [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Next Due Date</label>
                    <input type="date" name="nextMaintenanceDate" value={formData.nextMaintenanceDate} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50 [color-scheme:dark]" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Maintenance Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50">
                    <option value="ROUTINE">Routine</option>
                    <option value="REPAIR">Repair</option>
                    <option value="INSPECTION">Inspection</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Description *</label>
                  <textarea required rows={3} name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50 resize-none" placeholder="Details of work done..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50">
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="OVERDUE">Overdue</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Cost</label>
                    <input type="number" min="0" step="0.01" name="cost" value={formData.cost} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Technician</label>
                  <input type="text" name="technician" value={formData.technician} onChange={handleInputChange} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="Technician name..." />
                </div>
                <div className="flex gap-3 justify-end mt-8">
                  <button type="button" onClick={() => { setShowForm(false); setSelectedItem(null); }} className="px-5 py-2.5 rounded-xl font-semibold text-gray-300 hover:bg-white/5 transition-all">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl font-semibold bg-indigo-500 text-white hover:bg-indigo-400 transition-all disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Save Record'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Maintenance Modal */}
      <AnimatePresence>
        {selectedItem && !showForm && !showDelete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b23] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Maintenance Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">ID</span>
                  <span className="text-white font-medium">#{selectedItem.maintenanceId}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Vehicle</span>
                  <span className="text-white font-medium">{getVehicleReg(selectedItem)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white font-medium">{selectedItem.type}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white font-medium">{selectedItem.maintenanceDate?.split('T')[0]}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Next Due</span>
                  <span className="text-white font-medium">{selectedItem.nextMaintenanceDate?.split('T')[0] || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Status</span>
                  <span className="text-white font-medium">{selectedItem.status}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Cost</span>
                  <span className="text-white font-medium">${selectedItem.cost?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Technician</span>
                  <span className="text-white font-medium">{selectedItem.technician || 'N/A'}</span>
                </div>
                <div className="pt-2">
                  <span className="text-gray-400 block mb-1">Description</span>
                  <p className="text-gray-300 text-sm">{selectedItem.description}</p>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={() => setSelectedItem(null)} className="px-5 py-2.5 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-all">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {selectedItem && showDelete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b23] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Delete Record?</h2>
              <p className="text-gray-400 mb-6">Are you sure you want to delete maintenance record <strong className="text-white">#{selectedItem.maintenanceId}</strong>? This action cannot be undone.</p>
              
              <div className="flex gap-3 justify-center">
                <button onClick={() => { setSelectedItem(null); setShowDelete(false); }} className="px-5 py-2.5 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-all flex-1">Cancel</button>
                <button onClick={handleDelete} className="px-5 py-2.5 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-400 transition-all flex-1 shadow-[0_0_20px_rgba(239,68,68,0.3)]">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
