import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, Calendar, MapPin, Search, 
  CreditCard, CheckCircle2, XCircle, Clock, AlertCircle
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, transition: { staggerChildren: 0.05 } }
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
                      <button className="flex-1 px-4 py-2 rounded-xl bg-gray-50 text-gray-700 text-sm font-semibold hover:bg-gray-100 border border-gray-200 transition-colors flex items-center justify-center gap-1">
                        View
                      </button>
                      {activeTab === 'Upcoming' && (
                        <button className="flex-1 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 border border-red-100 transition-colors">
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
      </div>

    </div>
  );
}
