import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, CheckCircle2, XCircle } from 'lucide-react';

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
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const mockBookings = [
    { id: 'BKG-7829', passenger: 'John Doe', trip: 'T-1042', route: 'Colombo &rarr; Kandy', date: 'Oct 15, 2026', amount: 15.00, bookingStatus: 'Confirmed', paymentStatus: 'Paid' },
    { id: 'BKG-9921', passenger: 'Jane Smith', trip: 'T-1048', route: 'Kandy &rarr; Nuwara Eliya', date: 'Oct 16, 2026', amount: 18.50, bookingStatus: 'Pending', paymentStatus: 'Unpaid' },
    { id: 'BKG-1102', passenger: 'Saman Silva', trip: 'T-1045', route: 'Colombo &rarr; Galle', date: 'Oct 15, 2026', amount: 15.00, bookingStatus: 'Cancelled', paymentStatus: 'Refunded' },
  ];
  const filtered = mockBookings.filter(b => 
    b.id.toLowerCase().includes(search.toLowerCase()) || 
    b.passenger.toLowerCase().includes(search.toLowerCase()) ||
    b.trip.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Booking Management</h1>
          <p className="text-gray-400 mt-2 font-medium">Monitor and manage passenger bookings and payments.</p>
        </div>
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
              {filtered.map((b) => (
                <motion.tr variants={fadeUp} key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 pl-8 font-semibold text-white">{b.id}</td>
                  <td className="p-5 text-sm font-medium text-gray-300">{b.passenger}</td>
                  <td className="p-5">
                    <p className="text-sm font-bold text-gray-200" dangerouslySetInnerHTML={{ __html: b.route }}></p>
                    <p className="text-xs text-gray-500 mt-1">{b.trip} • {b.date}</p>
                  </td>
                  <td className="p-5 text-sm font-bold text-purple-400">
                    ${b.amount.toFixed(2)}
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                      ${b.bookingStatus === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 
                        b.bookingStatus === 'Pending' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                      {b.bookingStatus === 'Confirmed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {b.bookingStatus === 'Cancelled' && <XCircle className="w-3.5 h-3.5" />}
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                      ${b.paymentStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 
                        b.paymentStatus === 'Unpaid' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="p-5 pr-8 flex items-center justify-end gap-2">
                    <button onClick={() => setSelectedBooking(b)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    {b.bookingStatus !== 'Cancelled' && (
                      <button className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
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
                  <span className="text-white font-medium">{selectedBooking.id}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Passenger</span>
                  <span className="text-white font-medium">{selectedBooking.passenger}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Trip</span>
                  <span className="text-white font-medium">{selectedBooking.trip}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Route</span>
                  <span className="text-white font-medium" dangerouslySetInnerHTML={{ __html: selectedBooking.route }}></span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white font-medium">{selectedBooking.date}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-white font-medium">${selectedBooking.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Booking Status</span>
                  <span className="text-white font-medium">{selectedBooking.bookingStatus}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Payment Status</span>
                  <span className="text-white font-medium">{selectedBooking.paymentStatus}</span>
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
