import { useState, useEffect } from 'react';
import driverService from '@/services/driverService';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Eye, Star, Search, Filter, Trash2, Key, CheckCircle2, Copy, Check, ShieldCheck } from 'lucide-react';
import { Driver, DriverFormData } from '@/types';
import { DEFAULT_DRIVER_PASSWORD } from '@/services/mockDataStore';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AdminDrivers() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [newDriverNotice, setNewDriverNotice] = useState<{ email: string; name: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  const [formData, setFormData] = useState<DriverFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    status: 'ACTIVE'
  });

  const fetchDrivers = async () => {
    try {
      const data = await driverService.getAll();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleOpenForm = (d?: Driver) => {
    setViewOnly(false);
    if (d) {
      setSelectedDriver(d);
      setFormData({
        firstName: d.firstName || '',
        lastName: d.lastName || '',
        email: d.email || '',
        phone: d.phone || '',
        licenseNumber: d.licenseNumber || '',
        status: d.status || 'ACTIVE'
      });
    } else {
      setSelectedDriver(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenseNumber: '',
        status: 'ACTIVE'
      });
    }
    setShowForm(true);
  };

  const handleView = (d: Driver) => {
    setSelectedDriver(d);
    setViewOnly(true);
    setShowForm(false);
  };

  const handleSave = async () => {
    try {
      if (selectedDriver) {
        await driverService.update(selectedDriver.driverId, formData);
      } else {
        const created = await driverService.create(formData);
        setNewDriverNotice({
          email: created.email || formData.email,
          name: `${created.firstName || formData.firstName} ${created.lastName || formData.lastName}`,
          password: DEFAULT_DRIVER_PASSWORD
        });
      }
      setShowForm(false);
      setSelectedDriver(null);
      fetchDrivers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        await driverService.delete(id);
        fetchDrivers();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filtered = drivers.filter(d => {
    const name = `${d.firstName} ${d.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase()) || 
           (d.driverId?.toString() || '').includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Driver Management</h1>
          <p className="text-gray-400 mt-2 font-medium">Manage driver profiles, assignments, and ratings.</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Driver
        </button>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 shadow-xl flex flex-col md:flex-row gap-4 items-center mt-4">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
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
                <th className="p-5 pl-8">Driver ID</th>
                <th className="p-5">Name & Contact</th>
                <th className="p-5">License</th>
                <th className="p-5">Rating</th>
                <th className="p-5">Status</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((d) => (
                <motion.tr variants={fadeUp} key={d.driverId} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 pl-8 font-semibold text-white">{d.driverId}</td>
                  <td className="p-5">
                    <p className="text-sm text-gray-200 font-medium">{d.firstName} {d.lastName}</p>
                    <p className="text-xs text-gray-500">{d.phone} | {d.email}</p>
                  </td>
                  <td className="p-5 text-sm text-gray-400 font-medium">
                    {d.licenseNumber}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 w-fit px-2 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-yellow-500" />
                      <span className="text-sm font-bold">{d.rating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                      ${d.status === 'ACTIVE' || d.status === 'ON_TRIP' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-5 pr-8 flex items-center justify-end gap-2">
                    <button onClick={() => handleView(d)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenForm(d)} className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(d.driverId)} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-5 text-center text-gray-500">No drivers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Driver Modal */}
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
              <h2 className="text-2xl font-bold text-white mb-4">{selectedDriver ? 'Edit Driver' : 'Add New Driver'}</h2>

              {!selectedDriver && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 flex items-start gap-3.5 mb-5 shadow-lg">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">Default Login Credentials</span>
                    <p className="text-sm text-white mt-1">
                      Static Temporary Password: <strong className="font-mono text-emerald-400 bg-black/50 px-2 py-0.5 rounded border border-emerald-500/30">{DEFAULT_DRIVER_PASSWORD}</strong>
                    </p>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                      This driver can immediately sign in at the normal Login screen with their email & this temporary password. They will be prompted to change their password on first login.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">First Name</label>
                    <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="e.g. Nimal" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Last Name</label>
                    <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="e.g. Perera" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="e.g. driver@smartmove.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Contact Number</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="e.g. +94 77 123 4567" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">License Number</label>
                    <input type="text" value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" placeholder="e.g. B1234567" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50">
                      <option value="ACTIVE">Active</option>
                      <option value="ON_TRIP">On Trip</option>
                      <option value="ON_LEAVE">On Leave</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl font-semibold text-gray-300 hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all">Save Driver</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Driver Modal */}
      <AnimatePresence>
        {selectedDriver && viewOnly && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b23] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Driver Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">ID</span>
                  <span className="text-white font-medium">{selectedDriver.driverId}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Name</span>
                  <span className="text-white font-medium">{selectedDriver.firstName} {selectedDriver.lastName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Contact</span>
                  <span className="text-white font-medium">{selectedDriver.phone} | {selectedDriver.email}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">License</span>
                  <span className="text-white font-medium">{selectedDriver.licenseNumber}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Status</span>
                  <span className="text-white font-medium">{selectedDriver.status}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Temporary Password</span>
                  <span className="text-emerald-400 font-mono font-bold">{DEFAULT_DRIVER_PASSWORD}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-white font-medium">{selectedDriver.rating || 'N/A'} ★</span>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={() => setViewOnly(false)} className="px-5 py-2.5 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-all">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Driver Created Success Dialog with Credentials */}
      <AnimatePresence>
        {newDriverNotice && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#161722] border border-purple-500/40 rounded-3xl p-7 w-full max-w-md shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-white">Driver Account Created!</h3>
              <p className="text-xs text-gray-400 mt-1">
                Give these credentials to <strong className="text-white">{newDriverNotice.name}</strong> to sign in:
              </p>

              <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Login Email</span>
                  <p className="text-sm font-bold text-white select-all">{newDriverNotice.email}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Static Temporary Password</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-base font-mono font-bold text-emerald-400 bg-black/40 px-2.5 py-1 rounded-lg border border-emerald-500/30 select-all">
                      {newDriverNotice.password}
                    </span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`Email: ${newDriverNotice.email}\nPassword: ${newDriverNotice.password}`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 text-left flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>First Login Requirement:</strong> When the driver logs in, SmartMove will prompt them to replace this temporary password with their own permanent password.
                </p>
              </div>

              <button
                onClick={() => setNewDriverNotice(null)}
                className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
