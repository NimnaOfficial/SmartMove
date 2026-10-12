import { useState, useEffect } from 'react';
import reportService from '@/services/reportService';
import authService from '@/services/authService';
import bookingService from '@/services/bookingService';
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

  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
       try {
         const user = authService.getCurrentUser() as any;
         const passengerId = user?.userId || user?.passengerId || user?.id || 1;
         let data: any[] = [];
         try {
           const reportRes = await reportService.getPassengerHistory(passengerId);
           if (Array.isArray(reportRes)) {
             data = reportRes;
           } else if (Array.isArray(reportRes?.trips)) {
             data = reportRes.trips;
           }
         } catch (err) {
           console.warn('Report service error, falling back to bookings', err);
         }

         if (!data || data.length === 0) {
           try {
             const bookings = await bookingService.getMyBookings(passengerId);
             if (Array.isArray(bookings) && bookings.length > 0) {
               data = bookings;
             }
           } catch {}
         }

         const completedAndPaid = (data || []).filter((item: any) => {
           const rawStatus = (item.status || item.STATUS || item.booking_status || item.BOOKING_STATUS || item.bookingStatus || item.trip_status || item.TRIP_STATUS || '').toUpperCase();
           const rawPay = (item.paymentStatus || item.PAYMENT_STATUS || item.payment_status || '').toUpperCase();
           const isCompleted = rawStatus === 'COMPLETED';
           const isPaid = rawPay === 'PAID' || rawPay === 'SUCCESS';
           return isCompleted && isPaid;
         });

         const mapped = completedAndPaid.map((item: any, idx: number) => {
           const tripId = item.tripId || item.TRIP_ID || item.trip_id || item.id || (idx + 1);
           const bookingId = item.bookingId || item.BOOKING_ID || item.booking_id || (idx + 1);
           const rawRoute = item.route || item.route_details || item.ROUTE_DETAILS || 'Colombo → Kandy';
           const cleanRoute = String(rawRoute).replace(' to ', ' → ').replace(' -> ', ' → ');

           const rawDate = item.date || item.departure_time || item.DEPARTURE_TIME || item.travelDate || item.bookingDate;
           let dateStr = 'Completed';
           if (rawDate) {
             const d = new Date(rawDate);
             dateStr = !isNaN(d.getTime()) ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : String(rawDate);
           }

           const veh = item.vehicle || item.registration_number || item.REGISTRATION_NUMBER || 'Volvo 9900 (ND-4521)';
           const payStatus = 'Paid';

           return {
             id: `TRIP-${tripId}`,
             route: cleanRoute,
             date: dateStr,
             vehicle: veh,
             booking: `BK-${bookingId}`,
             paymentStatus: payStatus
           };
         });

         setHistoryData(mapped);
       } catch (e) {
         console.error(e);
       } finally {
         setLoading(false);
       }
    };
    fetchHistory();
  }, []);

  const filteredHistory = historyData.filter(trip => {
    const route = trip.route || '';
    const date = trip.date || '';
    return (filterRoute === '' || route.toLowerCase().includes(filterRoute.toLowerCase())) &&
           (filterDate === '' || date.toLowerCase().includes(filterDate.toLowerCase()));
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
