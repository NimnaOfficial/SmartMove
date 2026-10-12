import { useState, useEffect } from 'react';
import bookingService from '@/services/bookingService';
import { Booking } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, CheckCircle2, XCircle, Trash2, RefreshCw } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AdminBookings() {
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchBookings = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const data = await bookingService.getAll();
      setBookings(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (e: any) {
      console.error('Failed to fetch bookings:', e);
      if (!silent) setError('Failed to fetch bookings.');
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(() => fetchBookings(true), 4000);
    return () => clearInterval(interval);
  }, []);
  
  const handleCancelBooking = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingService.cancel(id);
      fetchBookings();
    } catch (e: any) {
      console.error('Failed to cancel booking', e);
      alert('Failed to cancel booking: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleAcceptBooking = async (id: number) => {
    try {
      await bookingService.acceptBooking(id);
      fetchBookings();
    } catch (e: any) {
      console.error('Failed to accept booking', e);
      alert('Failed to accept booking: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this booking record?')) return;
    try {
      await bookingService.delete(id);
      fetchBookings();
    } catch (e: any) {
      console.error('Failed to delete booking', e);
      alert('Failed to delete booking: ' + (e.response?.data?.message || e.message));
    }
  };

  const filtered = bookings.filter(b => 
    b.bookingId.toString().includes(search) || 
    (b.passengerName && b.passengerName.toLowerCase().includes(search.toLowerCase())) ||
    b.tripId.toString().includes(search)
  );

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Booking Management</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Real-Time Sync
            </span>
          </div>
          <p className="text-gray-400 mt-2 font-medium">Monitor and manage passenger bookings and payments.</p>
        </div>
        <button
          onClick={() => fetchBookings(false)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1b23] border border-white/10 text-gray-300 font-semibold hover:text-white hover:border-white/20 transition-all text-sm w-fit"
          title="Refresh bookings"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 shadow-xl flex flex-col md:flex-row gap-4 items-center mt-4">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search bookings by ID, passenger or trip..." 
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

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      )}

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="bg-[#1a1b23] border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#0a0b10]/50 border-b border-white/5 text-xs uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-5 pl-8">Booking ID</th>
                <th className="p-5">Passenger</th>
                <th className="p-5">Trip Details</th>
                <th className="p-5">Amount</th>
                <th className="p-5">Booking Status</th>
                <th className="p-5">Payment Status</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((b) => {
                const bStatus = (b.status || b.bookingStatus || 'PENDING').toUpperCase();
                const pStatus = (b.paymentStatus || 'UNPAID').toUpperCase();
                const fareAmt = Number(b.totalFare ?? b.totalAmount ?? b.amount ?? 0);
                const seats = b.seatsBooked ?? b.ticketQuantity ?? 1;

                return (
                  <motion.tr variants={fadeUp} key={b.bookingId} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-5 pl-8 font-semibold text-white">#{b.bookingId}</td>
                    <td className="p-5 text-sm font-medium text-gray-300">{b.passengerName || `Passenger #${b.passengerId}`}</td>
                    <td className="p-5">
                      <p className="text-sm font-bold text-gray-200">
                        {b.routeOrigin ? `${b.routeOrigin} → ${b.routeDestination}` : `Trip #${b.tripId}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Trip #{b.tripId} • {seats} seat(s) • {b.bookingDate ? b.bookingDate.split('T')[0] : (b.departureDate || 'Standard')}</p>
                    </td>
                    <td className="p-5 text-sm font-bold text-purple-400">
                      ${fareAmt.toFixed(2)}
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                        ${bStatus === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 
                          bStatus === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-400' :
                          bStatus === 'IN_PROGRESS' ? 'bg-purple-500/20 text-purple-400 animate-pulse' :
                          bStatus === 'PENDING' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                        {(bStatus === 'CONFIRMED' || bStatus === 'COMPLETED') && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {bStatus === 'CANCELLED' && <XCircle className="w-3.5 h-3.5" />}
                        {bStatus}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                        ${pStatus === 'PAID' || pStatus === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' : 
                          'bg-orange-500/20 text-orange-400 font-extrabold'}`}>
                        {pStatus}
                      </span>
                    </td>
                    <td className="p-5 pr-8 flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedBooking(b)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="View Booking">
                        <Eye className="w-4 h-4" />
                      </button>
                      {bStatus === 'PENDING' && (
                        <button onClick={() => handleAcceptBooking(b.bookingId)} className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 transition-colors" title="Accept Booking">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {bStatus !== 'CANCELLED' && (
                        <button onClick={() => handleCancelBooking(b.bookingId)} className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 hover:text-orange-300 hover:bg-orange-500/20 transition-colors" title="Cancel Booking">
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => handleDeleteBooking(b.bookingId)} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors" title="Delete Booking">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* View Booking Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b23] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Booking Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Booking ID</span>
                  <span className="text-white font-medium">#{selectedBooking.bookingId}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Passenger</span>
                  <span className="text-white font-medium">{selectedBooking.passengerName || `ID: ${selectedBooking.passengerId}`}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Trip ID</span>
                  <span className="text-white font-medium">#{selectedBooking.tripId}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Route</span>
                  <span className="text-white font-medium">
                    {selectedBooking.routeOrigin ? `${selectedBooking.routeOrigin} → ${selectedBooking.routeDestination}` : `Trip #${selectedBooking.tripId}`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white font-medium">
                    {selectedBooking.bookingDate ? selectedBooking.bookingDate.split('T')[0] : (selectedBooking.departureDate || 'Standard')}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Tickets</span>
                  <span className="text-white font-medium">{selectedBooking.seatsBooked ?? selectedBooking.ticketQuantity ?? 1}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="text-white font-medium">${((selectedBooking.totalFare ?? selectedBooking.totalAmount ?? selectedBooking.amount ?? 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Booking Status</span>
                  <span className="text-white font-medium">{selectedBooking.status || selectedBooking.bookingStatus || 'CONFIRMED'}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Payment Status</span>
                  <span className="text-white font-medium">{selectedBooking.paymentStatus || 'PAID'}</span>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={() => setSelectedBooking(null)} className="px-5 py-2.5 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-all">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
