import { useState, useEffect } from 'react';
import tripService from '@/services/tripService';
import routeService from '@/services/routeService';
import vehicleService from '@/services/vehicleService';
import driverService from '@/services/driverService';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Eye, Trash2, ShieldCheck, Users, Clock } from 'lucide-react';
import { Trip, TripFormData, RouteInfo, Vehicle, Driver } from '@/types';

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
  const [showForm, setShowForm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [viewOnly, setViewOnly] = useState(false);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  const [formData, setFormData] = useState<TripFormData>({
    routeId: 0,
    vehicleId: 0,
    driverId: 0,
    departureDate: '',
    departureTime: '',
    fare: 0,
    status: 'SCHEDULED'
  });

  const fetchData = async () => {
    try {
      const [tData, rData, vData, dData] = await Promise.all([
        tripService.getAll(),
        routeService.getAll(),
        vehicleService.getAll(),
        driverService.getAll()
      ]);
      setTrips(Array.isArray(tData) ? tData : []);
      setRoutes(Array.isArray(rData) ? rData : []);
      setVehicles(Array.isArray(vData) ? vData : []);
      setDrivers(Array.isArray(dData) ? dData : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenForm = (t?: Trip) => {
    setViewOnly(false);
    setFormError(null);
    if (t) {
      setSelectedTrip(t);
      const depTimeFull = t.departureTime || '';
      const datePart = depTimeFull.includes('T') ? depTimeFull.split('T')[0] : (t.departureDate || '');
      const timePart = depTimeFull.includes('T') ? depTimeFull.split('T')[1].substring(0, 5) : '08:00';
      setFormData({
        routeId: t.routeId || 0,
        vehicleId: t.vehicleId || 0,
        driverId: t.driverId || 0,
        departureDate: datePart,
        departureTime: timePart,
        fare: t.fare || 0,
        status: t.status || 'SCHEDULED'
      });
    } else {
      setSelectedTrip(null);
      setFormData({
        routeId: routes.length > 0 ? routes[0].routeId : 0,
        vehicleId: vehicles.length > 0 ? vehicles[0].vehicleId : 0,
        driverId: drivers.length > 0 ? drivers[0].driverId : 0,
        departureDate: new Date().toISOString().split('T')[0],
        departureTime: '08:00',
        fare: 100,
        status: 'SCHEDULED'
      });
    }
    setShowForm(true);
  };

  const handleView = (t: Trip) => {
    setSelectedTrip(t);
    setViewOnly(true);
    setShowForm(false);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!formData.routeId || !formData.vehicleId || !formData.driverId) {
      setFormError('Please select a route, vehicle, and driver.');
      return;
    }
    try {
      const depDate = formData.departureDate || new Date().toISOString().split('T')[0];
      const depTime = formData.departureTime || '08:00';
      const formattedTime = depTime.length === 5 ? `${depTime}:00` : depTime;
      const departureTimeIso = `${depDate}T${formattedTime}`;
      
      const depDateObj = new Date(departureTimeIso);
      const arrDateObj = new Date(depDateObj.getTime() + (2.5 * 60 * 60 * 1000));
      const arrivalTimeIso = arrDateObj.toISOString().split('.')[0];

      const selectedVeh = vehicles.find(v => v.vehicleId === Number(formData.vehicleId));
      const seats = selectedVeh?.capacity || 45;

      const payload = {
        routeId: Number(formData.routeId),
        vehicleId: Number(formData.vehicleId),
        driverId: Number(formData.driverId),
        departureTime: departureTimeIso,
        arrivalTime: arrivalTimeIso,
        availableSeats: seats,
        status: formData.status || 'SCHEDULED'
      };

      if (selectedTrip) {
        await tripService.update(selectedTrip.tripId, payload);
      } else {
        await tripService.create(payload);
      }
      setShowForm(false);
      setSelectedTrip(null);
      fetchData();
    } catch (e: any) {
      console.error(e);
      setFormError(e.response?.data?.message || 'Failed to save trip.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await tripService.delete(id);
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getRouteDetails = (t: Trip) => {
    const r = routes.find(item => item.routeId === t.routeId);
    const origin = t.routeOrigin || r?.origin || `Route #${t.routeId}`;
    const destination = t.routeDestination || r?.destination || '';
    return { origin, destination, label: destination ? `${origin} → ${destination}` : origin };
  };

  const getVehicleDetails = (t: Trip) => {
    const v = vehicles.find(item => item.vehicleId === t.vehicleId);
    const reg = t.vehicleRegistration || v?.registrationNumber || `Vehicle #${t.vehicleId}`;
    const cap = t.capacity || v?.capacity || 45;
    return { reg, capacity: cap };
  };

  const getDriverDetails = (t: Trip) => {
    const d = drivers.find(item => item.driverId === t.driverId);
    const name = t.driverName || (d ? `${d.firstName} ${d.lastName}` : `Driver #${t.driverId}`);
    return { name };
  };

  const formatSchedule = (t: Trip) => {
    let date = t.departureDate ? t.departureDate.split('T')[0] : '';
    let time = t.departureTime || '';
    if (time.includes('T')) {
      const parts = time.split('T');
      if (!date) date = parts[0];
      time = parts[1].substring(0, 5);
    }
    return { date, time };
  };

  const filtered = trips.filter(t => {
    const { origin, destination } = getRouteDetails(t);
    const { reg } = getVehicleDetails(t);
    const { name } = getDriverDetails(t);
    const q = search.toLowerCase();
    return (t.tripId?.toString() || '').includes(q) || 
      origin.toLowerCase().includes(q) ||
      destination.toLowerCase().includes(q) ||
      reg.toLowerCase().includes(q) ||
      name.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Trip Scheduling</h1>
          <p className="text-gray-400 mt-2 font-medium">Manage and monitor daily trip operations.</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Schedule Trip
        </button>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 shadow-xl flex flex-col md:flex-row gap-4 items-center mt-4">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search trips by ID, route, vehicle or driver..." 
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
              {filtered.map((t) => {
                const route = getRouteDetails(t);
                const vehicle = getVehicleDetails(t);
                const driver = getDriverDetails(t);
                const sched = formatSchedule(t);
                const capacity = vehicle.capacity;
                const booked = t.bookedSeats ?? Math.max(0, capacity - (t.availableSeats ?? capacity));

                return (
                  <motion.tr variants={fadeUp} key={t.tripId} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-5 pl-8 font-semibold text-white">#{t.tripId}</td>
                    <td className="p-5 text-sm font-medium text-gray-200">{route.origin} &rarr; {route.destination}</td>
                    <td className="p-5">
                      <p className="text-sm font-bold text-gray-200 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-purple-400" /> {sched.time}</p>
                      <p className="text-xs text-gray-500 mt-1">{sched.date}</p>
                    </td>
                    <td className="p-5">
                      <p className="text-sm text-gray-300 font-medium flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> {vehicle.reg}</p>
                      <p className="text-xs text-gray-500 mt-1">{driver.name}</p>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                         <Users className="w-4 h-4 text-emerald-400" />
                         <span className="text-sm font-bold text-gray-200">{booked} <span className="text-gray-500 font-medium">/ {capacity}</span></span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                        ${t.status === 'SCHEDULED' ? 'bg-blue-500/20 text-blue-400' : 
                          t.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                          t.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-5 pr-8 flex items-center justify-end gap-2">
                      <button onClick={() => handleView(t)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleOpenForm(t)} className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(t.tripId)} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-5 text-center text-gray-500">No trips found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Trip Modal */}
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
              <h2 className="text-2xl font-bold text-white mb-6">{selectedTrip ? 'Edit Trip' : 'Create New Trip'}</h2>
              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-sm">
                  {formError}
                </div>
              )}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-400 block mb-1">Route</label>
                    <select 
                      value={formData.routeId} 
                      onChange={e => setFormData({...formData, routeId: parseInt(e.target.value)})}
                      className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50">
                      <option value={0} disabled>Select a Route</option>
                      {routes.map(r => (
                        <option key={r.routeId} value={r.routeId}>{r.origin} - {r.destination}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Vehicle</label>
                    <select 
                      value={formData.vehicleId} 
                      onChange={e => setFormData({...formData, vehicleId: parseInt(e.target.value)})}
                      className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50">
                      <option value={0} disabled>Select a Vehicle</option>
                      {vehicles.map(v => (
                        <option key={v.vehicleId} value={v.vehicleId}>{v.registrationNumber} ({v.type})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Driver</label>
                    <select 
                      value={formData.driverId} 
                      onChange={e => setFormData({...formData, driverId: parseInt(e.target.value)})}
                      className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50">
                      <option value={0} disabled>Select a Driver</option>
                      {drivers.map(d => (
                        <option key={d.driverId} value={d.driverId}>{d.firstName} {d.lastName}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Date</label>
                    <input type="date" 
                      value={formData.departureDate} 
                      onChange={e => setFormData({...formData, departureDate: e.target.value})}
                      className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50 [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Time</label>
                    <input type="time" 
                      value={formData.departureTime} 
                      onChange={e => setFormData({...formData, departureTime: e.target.value})}
                      className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50 [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Fare ($)</label>
                    <input type="number" 
                      value={formData.fare} 
                      onChange={e => setFormData({...formData, fare: parseFloat(e.target.value) || 0})}
                      className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50">
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl font-semibold text-gray-300 hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all">Save Trip</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Trip Modal */}
      <AnimatePresence>
        {selectedTrip && viewOnly && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b23] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Trip Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Trip ID</span>
                  <span className="text-white font-medium">#{selectedTrip.tripId}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Route</span>
                  <span className="text-white font-medium">{getRouteDetails(selectedTrip).label}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Schedule</span>
                  <span className="text-white font-medium">{formatSchedule(selectedTrip).date} @ {formatSchedule(selectedTrip).time}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Vehicle / Driver</span>
                  <span className="text-white font-medium">{getVehicleDetails(selectedTrip).reg} / {getDriverDetails(selectedTrip).name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Occupancy</span>
                  <span className="text-white font-medium">
                    {selectedTrip.bookedSeats ?? Math.max(0, getVehicleDetails(selectedTrip).capacity - (selectedTrip.availableSeats ?? getVehicleDetails(selectedTrip).capacity))} / {getVehicleDetails(selectedTrip).capacity}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Fare</span>
                  <span className="text-white font-medium">${selectedTrip.fare}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Status</span>
                  <span className="text-white font-medium">{selectedTrip.status}</span>
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
