import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function TravelHistory() {
  const [filterRoute, setFilterRoute] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const historyData = [
    { id: 'TRP-8821', route: 'Colombo to Kandy', date: 'Oct 10, 2026', vehicle: 'ND-4521 (Luxury Coach)', booking: 'B-7741', paymentStatus: 'Paid' },
    { id: 'TRP-8742', route: 'Galle to Matara', date: 'Sep 25, 2026', vehicle: 'ND-3210 (Mini Bus)', booking: 'B-7602', paymentStatus: 'Paid' },
    { id: 'TRP-8511', route: 'Kandy to Nuwara Eliya', date: 'Aug 14, 2026', vehicle: 'ND-8891 (Standard)', booking: 'B-7321', paymentStatus: 'Refunded' }
  ];

  const filteredHistory = historyData.filter(trip => {
    return (filterRoute === '' || trip.route.toLowerCase().includes(filterRoute.toLowerCase())) &&
           (filterDate === '' || trip.date.includes(filterDate));
  });

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col gap-8 w-full pb-10">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Travel History</h1>
          <p className="text-gray-500 mt-2 font-light">View your past trips and booking records.</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-700 font-semibold w-full md:w-auto mb-2 md:mb-0">
          <Filter className="w-5 h-5 text-blue-600" /> Filters:
        </div>
        
        <div className="flex-1 w-full flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:border-blue-400 transition-colors">
          <MapPin className="w-5 h-5 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search by Route..." 
            value={filterRoute}
            onChange={(e) => setFilterRoute(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm font-medium text-gray-900 placeholder-gray-400" 
          />
        </div>

        <div className="flex-1 w-full flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:border-blue-400 transition-colors">
          <Calendar className="w-5 h-5 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Filter by Date (e.g., Oct 10)" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm font-medium text-gray-900 placeholder-gray-400" 
          />
        </div>
      </motion.div>

      {/* History List */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                 <th className="p-5 pl-6">Trip ID</th>
                 <th className="p-5">Route</th>
                 <th className="p-5">Date</th>
                 <th className="p-5">Vehicle</th>
                 <th className="p-5">Booking Ref</th>
                 <th className="p-5 pr-6">Payment Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {filteredHistory.length > 0 ? filteredHistory.map((trip) => (
                 <motion.tr variants={fadeUp} key={trip.id} className="hover:bg-gray-50/50 transition-colors group">
                   <td className="p-5 pl-6 font-semibold text-gray-900">{trip.id}</td>
                   <td className="p-5 text-sm font-medium text-gray-700">{trip.route}</td>
                   <td className="p-5 text-sm text-gray-600">{trip.date}</td>
                   <td className="p-5 text-sm text-gray-600">{trip.vehicle}</td>
                   <td className="p-5 text-sm font-semibold text-blue-600">{trip.booking}</td>
                   <td className="p-5 pr-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${trip.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {trip.paymentStatus === 'Paid' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {trip.paymentStatus}
                      </span>
                   </td>
                 </motion.tr>
               )) : (
                 <tr>
                   <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                     No travel history found matching your filters.
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </motion.div>
    </div>
  );
}
