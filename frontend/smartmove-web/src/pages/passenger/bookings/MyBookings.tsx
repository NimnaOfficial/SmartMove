import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, Calendar, MapPin, Search, 
  CreditCard, CheckCircle2, XCircle, Clock, AlertCircle
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const tabs = ['Upcoming', 'Completed', 'Cancelled'] as const;
type TabType = typeof tabs[number];

// Mock Data following Specification
const mockBookings = [
  {
    id: 'BKG-7829-XL',
    route: 'Coastal Express',
    trip: 'Colombo to Galle',
    date: 'Oct 15, 2026',
    time: '08:30 AM',
    amount: 15.00,
    bookingStatus: 'Confirmed',
    paymentStatus: 'Paid',
    type: 'Upcoming'
  },
  {
    id: 'BKG-9921-MD',
    route: 'Mountain Pass',
    trip: 'Kandy to Nuwara Eliya',
    date: 'Oct 22, 2026',
    time: '11:00 AM',
    amount: 18.50,
    bookingStatus: 'Pending',
    paymentStatus: 'Unpaid',
    type: 'Upcoming'
  },
  {
    id: 'BKG-1102-CH',
    route: 'City Loop',
    trip: 'Colombo Fort to Mount Lavinia',
    date: 'Sep 28, 2026',
    time: '04:15 PM',
    amount: 5.50,
    bookingStatus: 'Completed',
    paymentStatus: 'Paid',
    type: 'Completed'
  },
  {
    id: 'BKG-0092-ZX',
    route: 'Northern Star',
    trip: 'Colombo to Jaffna',
    date: 'Aug 12, 2026',
    time: '10:00 PM',
    amount: 45.00,
    bookingStatus: 'Cancelled',
    paymentStatus: 'Refunded',
    type: 'Cancelled'
  }
];

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState<TabType>('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'view' | 'cancel' | 'pay' | 'feedback'>('view');

  const filteredBookings = mockBookings.filter(b => 
    b.type === activeTab && 
    (b.route.toLowerCase().includes(searchQuery.toLowerCase()) || 
     b.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col w-full pb-10">
      
      {/* Header Section */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Bookmark className="w-6 h-6" />
            </div>
            My Bookings
          </h1>
          <p className="text-gray-500 mt-2 font-light max-w-lg">
            Manage your travel itinerary, view past journeys, and handle cancellations or payments all in one place.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search bookings..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3f7a] focus:border-transparent transition-all shadow-sm"
          />
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-2 mb-8 bg-gray-100/80 p-1.5 rounded-full w-fit border border-gray-200/50">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeTab === tab ? 'text-[#1e3f7a]' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="bookingTab"
                className="absolute inset-0 bg-white rounded-full shadow-sm border border-gray-200/50"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </motion.div>

      {/* Bookings List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-5"
          >
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <motion.div 
                  key={booking.id}
                  variants={fadeUp}
                  className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-blue-100 transition-all duration-300 flex flex-col lg:flex-row gap-6 group relative overflow-hidden"
                >
                  {/* Decorative Side Bar based on status */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    booking.bookingStatus === 'Confirmed' ? 'bg-green-500' :
                    booking.bookingStatus === 'Pending' ? 'bg-orange-400' :
                    booking.bookingStatus === 'Completed' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`} />

                  {/* Left: ID & Route */}
                  <div className="flex-1 lg:max-w-xs flex flex-col justify-center">
                    <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">{booking.id}</p>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{booking.route}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 w-fit px-3 py-1.5 rounded-lg border border-gray-100">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span className="font-medium truncate max-w-[200px]">{booking.trip}</span>
                    </div>
                  </div>

                  {/* Middle: Date & Time */}
                  <div className="flex-1 flex flex-col justify-center px-4 lg:border-l lg:border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Travel Date</p>
                        <p className="text-sm font-semibold text-gray-900">{booking.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Departure Time</p>
                        <p className="text-sm font-semibold text-gray-900">{booking.time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right-Middle: Status Badges */}
                  <div className="flex-1 flex flex-col justify-center gap-3 px-4 lg:border-l lg:border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-medium w-16">Booking:</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        booking.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        booking.bookingStatus === 'Pending' ? 'bg-orange-100 text-orange-700' :
                        booking.bookingStatus === 'Completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.bookingStatus === 'Confirmed' && <CheckCircle2 className="w-3 h-3" />}
                        {booking.bookingStatus === 'Pending' && <AlertCircle className="w-3 h-3" />}
                        {booking.bookingStatus === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                        {booking.bookingStatus === 'Cancelled' && <XCircle className="w-3 h-3" />}
                        {booking.bookingStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-medium w-16">Payment:</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                        booking.paymentStatus === 'Unpaid' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        <CreditCard className="w-3 h-3" />
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Far Right: Price & Actions */}
                  <div className="flex flex-col items-end justify-center lg:border-l lg:border-gray-100 lg:pl-6 min-w-[120px]">
                    <p className="text-sm text-gray-400 font-medium mb-1">Total</p>
                    <p className="text-2xl font-bold text-[#1e3f7a] mb-4">${booking.amount.toFixed(2)}</p>
                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                      <button 
                        onClick={() => { setSelectedBooking(booking); setModalMode('view'); }}
                        className="flex-1 px-4 py-2 rounded-xl bg-gray-50 text-gray-700 text-sm font-semibold hover:bg-gray-100 border border-gray-200 transition-colors flex items-center justify-center gap-1"
                      >
                        View
                      </button>
                      {activeTab === 'Upcoming' && (
                        <button 
                          onClick={() => { setSelectedBooking(booking); setModalMode('cancel'); }}
                          className="flex-1 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 border border-red-100 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Bookmark className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No {activeTab.toLowerCase()} bookings found</h3>
                <p className="text-gray-500 font-light max-w-md">
                  You don't have any bookings in this category right now. Use the search trips tool to plan your next journey!
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Modal Popups */}
        <AnimatePresence>
          {selectedBooking && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e3f7a]/40 backdrop-blur-sm"
              onClick={() => setSelectedBooking(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className={`${modalMode === 'cancel' ? 'bg-red-500' : 'bg-[#1e3f7a]'} p-6 text-white flex justify-between items-center relative overflow-hidden transition-colors`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold">
                      {modalMode === 'cancel' ? 'Cancel Booking' : 'Booking Details'}
                    </h3>
                    <p className="text-white/80 text-sm mt-1">{selectedBooking.id}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedBooking(null)}
                    className="relative z-10 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-8">
                  {modalMode === 'view' ? (
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
                        <div>
                           <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Status</p>
                           <p className={`font-bold ${selectedBooking.bookingStatus === 'Confirmed' ? 'text-green-600' : 'text-blue-600'}`}>
                             {selectedBooking.bookingStatus}
                           </p>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Payment</p>
                           <p className="font-bold text-gray-900">{selectedBooking.paymentStatus}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                         <div className="flex justify-between border-b border-gray-100 pb-2">
                           <span className="text-gray-500">Route</span>
                           <span className="font-bold text-gray-900">{selectedBooking.route}</span>
                         </div>
                         <div className="flex justify-between border-b border-gray-100 pb-2">
                           <span className="text-gray-500">Trip</span>
                           <span className="font-bold text-gray-900">{selectedBooking.trip}</span>
                         </div>
                         <div className="flex justify-between border-b border-gray-100 pb-2">
                           <span className="text-gray-500">Travel Date</span>
                           <span className="font-bold text-gray-900">{selectedBooking.date}</span>
                         </div>
                         <div className="flex justify-between pb-2">
                           <span className="text-gray-500">Departure</span>
                           <span className="font-bold text-gray-900">{selectedBooking.time}</span>
                         </div>
                      </div>

                      <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                        <span className="text-gray-500 font-medium">Amount Paid</span>
                        <span className="text-3xl font-bold text-[#1e3f7a]">${selectedBooking.amount.toFixed(2)}</span>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => setSelectedBooking(null)}
                          className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                        >
                          Close
                        </button>
                        {selectedBooking.paymentStatus === 'Unpaid' && selectedBooking.bookingStatus !== 'Cancelled' && (
                          <button 
                            onClick={() => setModalMode('pay')}
                            className="flex-1 py-3 rounded-xl bg-[#1e3f7a] text-white font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20"
                          >
                            Pay Now
                          </button>
                        )}
                        {selectedBooking.bookingStatus === 'Completed' && (
                          <button 
                            onClick={() => setModalMode('feedback')}
                            className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-900/20"
                          >
                            Write a Review
                          </button>
                        )}
                      </div>
                    </div>
                  ) : modalMode === 'pay' ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                        <p className="text-sm font-semibold text-blue-800 mb-1">Simulated Payment Sandbox</p>
                        <p className="text-xs text-blue-600">This is a sandbox gateway for CW testing. Do not enter real card details.</p>
                      </div>

                      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="text-gray-500 font-medium">Total Amount Due</span>
                        <span className="text-3xl font-bold text-[#1e3f7a]">${selectedBooking.amount.toFixed(2)}</span>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Cardholder Name</label>
                          <input type="text" placeholder="John Doe" className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3f7a]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Card Number</label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3f7a]" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Expiry</label>
                            <input type="text" placeholder="MM/YY" className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3f7a]" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">CVV</label>
                            <input type="text" placeholder="123" className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3f7a]" />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                         <button 
                           onClick={() => setModalMode('view')}
                           className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                         >
                           Cancel
                         </button>
                         <button 
                           onClick={() => {
                             setSelectedBooking(null);
                             // Handle success mock here
                           }}
                           className="flex-1 py-3.5 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                         >
                           <CheckCircle2 className="w-5 h-5" /> Pay ${selectedBooking.amount.toFixed(2)}
                         </button>
                      </div>
                    </div>
                  ) : modalMode === 'cancel' ? (
                    <div className="space-y-6 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h3>
                        <p className="text-gray-500">
                          Do you really want to cancel booking <strong className="text-gray-900">{selectedBooking.id}</strong>? 
                          This action cannot be undone. Standard cancellation policies apply.
                        </p>
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                         <button 
                           onClick={() => setSelectedBooking(null)}
                           className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                         >
                           Keep Booking
                         </button>
                         <button 
                           onClick={() => setSelectedBooking(null)}
                           className="flex-1 py-3.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                         >
                           Yes, Cancel
                         </button>
                      </div>
                    </div>
                  ) : null}
                  {modalMode === 'feedback' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">How was your trip?</h3>
                        <p className="text-gray-500 text-sm">Please rate your experience on the <strong className="text-gray-900">{selectedBooking.route}</strong> route.</p>
                      </div>
                      
                      <div className="flex justify-center gap-2 py-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} className="text-gray-300 hover:text-yellow-400 transition-colors">
                            <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Write a Review</label>
                        <textarea 
                          rows={4} 
                          className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                          placeholder="Tell us what you liked or what could be improved..."
                        ></textarea>
                      </div>

                      <div className="flex gap-3 pt-4">
                         <button 
                           onClick={() => setModalMode('view')}
                           className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                         >
                           Cancel
                         </button>
                         <button 
                           onClick={() => {
                             setSelectedBooking(null);
                           }}
                           className="flex-1 py-3.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
                         >
                           Submit Review
                         </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
