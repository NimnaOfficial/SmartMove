import { useState, useEffect } from 'react';
import bookingService from '@/services/bookingService';
import contentService from '@/services/contentService';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Calendar, ChevronRight,
  Clock, ShieldCheck, Navigation, ArrowRight,
  Star, MessageSquare, Bell, User, CheckCircle
} from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function PassengerDashboard() {
  const navigate = useNavigate();
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  
  const userStr = localStorage.getItem('smartmove_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const firstName = user?.firstName || user?.FIRST_NAME || user?.name || 'Passenger';

  useEffect(() => {
    bookingService.getMyBookings().then(data => {
      if (Array.isArray(data)) {
        setAllBookings(data);
        const upcoming = data.filter(b => {
          const s = (b.status || b.bookingStatus || '').toUpperCase();
          return s === 'CONFIRMED' || s === 'PENDING' || s === 'PAID';
        }).sort((a, b) => new Date(b.bookingDate || b.createdAt || 0).getTime() - new Date(a.bookingDate || a.createdAt || 0).getTime());
        setUpcomingBookings(upcoming.slice(0, 3));
      }
    }).catch(e => console.error(e));

    contentService.getAllAnnouncements().then(data => {
      if (Array.isArray(data)) {
        setAnnouncements(data.slice(0, 3));
      }
    }).catch(e => console.error(e));

    contentService.getAllReviews().then(data => {
      if (Array.isArray(data)) {
        setReviews(data.slice(0, 1)); // Just show the latest 1
      }
    }).catch(e => console.error(e));
  }, []);

  const nextBooking = upcomingBookings.length > 0 ? upcomingBookings[0] : null;
  const totalTrips = allBookings.length;
  const completedTrips = allBookings.filter(b => (b.status || b.bookingStatus || '').toUpperCase() === 'COMPLETED').length;
  const activeTripsCount = allBookings.filter(b => {
    const s = (b.status || b.bookingStatus || '').toUpperCase();
    return s === 'CONFIRMED' || s === 'PENDING' || s === 'PAID';
  }).length;

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col gap-8 w-full pb-10">
      
      {/* Header Section */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2 font-light">Welcome back {firstName}, here is your travel summary.</p>
        </div>
        <button onClick={() => navigate('/passenger/trips')} className="hidden sm:flex items-center gap-2 bg-[#1e3f7a] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#152e5e] transition-colors shadow-md hover:-translate-y-0.5">
          <Search className="w-4 h-4" /> New Booking
        </button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={fadeUp} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:border-blue-100 hover:shadow-md transition-all">
             <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
               <Navigation className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm text-gray-500 font-medium">Total Trips</p>
               <h3 className="text-2xl font-bold text-gray-900">{totalTrips}</h3>
             </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:border-green-100 hover:shadow-md transition-all">
             <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600">
               <CheckCircle className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm text-gray-500 font-medium">Completed Trips</p>
               <h3 className="text-2xl font-bold text-gray-900">{completedTrips}</h3>
             </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:border-purple-100 hover:shadow-md transition-all">
             <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
               <Clock className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm text-gray-500 font-medium">Upcoming Trips</p>
               <h3 className="text-2xl font-bold text-gray-900">{activeTripsCount}</h3>
             </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:border-orange-100 hover:shadow-md transition-all">
             <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
               <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm text-gray-500 font-medium">Active Bookings</p>
               <h3 className="text-2xl font-bold text-gray-900">{activeTripsCount}</h3>
             </div>
          </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - 7 col */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-7 space-y-8">
            
            {/* Search Trips Panel */}
            <motion.div variants={fadeUp} className="bg-[#1e3f7a] rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <Search className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Search Trips</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                    <label className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold block mb-2">From</label>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-white/70" />
                      <input id="dash-origin" type="text" placeholder="Origin City" className="bg-transparent border-none outline-none text-white placeholder-white/40 w-full font-medium" />
                    </div>
                  </div>

                  
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                    <label className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold block mb-2">To</label>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-white/70" />
                      <input id="dash-dest" type="text" placeholder="Destination City" className="bg-transparent border-none outline-none text-white placeholder-white/40 w-full font-medium" />
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                    <label className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold block mb-2">Date</label>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-white/70" />
                      <input id="dash-date" type="date" className="bg-transparent border-none outline-none text-white w-full font-medium [color-scheme:dark]" />
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                    <label className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold block mb-2">Passengers</label>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-white/70" />
                      <select className="bg-transparent border-none outline-none text-white w-full font-medium appearance-none">
                        <option className="text-gray-900">1 Passenger</option>
                        <option className="text-gray-900">2 Passengers</option>
                        <option className="text-gray-900">3 Passengers</option>
                        <option className="text-gray-900">4+ Passengers</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button onClick={() => {
                    const originInput = document.getElementById('dash-origin') as HTMLInputElement;
                    const destInput = document.getElementById('dash-dest') as HTMLInputElement;
                    const dateInput = document.getElementById('dash-date') as HTMLInputElement;
                    navigate('/passenger/trips', {
                      state: {
                        origin: originInput?.value || '',
                        destination: destInput?.value || '',
                        date: dateInput?.value || ''
                      }
                    });
                  }} className="bg-white text-[#1e3f7a] px-8 py-3.5 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 w-full md:w-auto justify-center">
                    <Search className="w-5 h-5" /> Search Available Trips
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Next Booking Summary */}
            {nextBooking ? (
            <motion.div variants={fadeUp} className="bg-white rounded-[1.5rem] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-auto">
                 <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-blue-600" /> Next Booking Summary
                 </h3>
                 <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold inline-block mb-2 text-sm tracking-wide">
                   UPCOMING
                 </div>
                 <p className="text-3xl font-bold text-gray-900">{nextBooking.seatsBooked ? `${nextBooking.seatsBooked} Seat(s)` : (nextBooking.seatNumber || 'Confirmed')}</p>
                 <p className="text-gray-500 font-medium">Booking #{nextBooking.bookingId}</p>
              </div>
              <div className="flex-1 w-full bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-900">Total Paid</span>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase tracking-wider">LKR {(nextBooking.totalFare || nextBooking.amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                    <p className="font-medium text-gray-900">{nextBooking.status || nextBooking.bookingStatus || 'CONFIRMED'}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 text-right">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                    <p className="font-medium text-gray-900">{nextBooking.bookingDate ? new Date(nextBooking.bookingDate).toLocaleDateString() : (nextBooking.createdAt ? new Date(nextBooking.createdAt).toLocaleDateString() : 'N/A')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            ) : (
            <motion.div variants={fadeUp} className="bg-white rounded-[1.5rem] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-6 items-center justify-center text-center">
                 <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-blue-600" /> No Upcoming Bookings
                 </h3>
                 <p className="text-gray-500">You do not have any upcoming trips scheduled.</p>
                 <button onClick={() => navigate('/passenger/trips')} className="bg-blue-50 text-blue-600 px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-blue-100 transition-all flex items-center gap-2 mt-2">
                   Book a Trip Now
                 </button>
            </motion.div>
            )}

            {/* Upcoming Trips List */}
            <motion.div variants={fadeUp} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 text-lg">Upcoming Trips</h3>
                <button onClick={() => navigate('/passenger/bookings')} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">View All</button>
              </div>
              
              <div className="space-y-4">
                {upcomingBookings.length > 0 ? upcomingBookings.map((trip, i) => (
                  <div key={i} onClick={() => navigate('/passenger/bookings')} className="cursor-pointer flex flex-col sm:flex-row gap-4 items-center p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all group">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors flex-shrink-0">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <h4 className="text-base font-bold text-gray-900 truncate">Booking #{trip.bookingId}</h4>
                      <p className="text-sm text-gray-500 truncate">Status: {trip.status || trip.bookingStatus || 'CONFIRMED'}</p>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="font-semibold text-gray-900">LKR {(trip.totalFare || trip.amount || 0).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{trip.bookingDate ? new Date(trip.bookingDate).toLocaleDateString() : (trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : 'N/A')}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors sm:ml-2">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">No recent bookings found.</p>
                )}
              </div>
            </motion.div>

        </motion.div>
        
        {/* Right Column - 5 col */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-5 space-y-8">
            
            {/* Latest Announcements */}
            <motion.div variants={fadeUp} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-900 text-lg">Announcements</h3>
                </div>
                {announcements.length > 0 && <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">NEW</span>}
              </div>

              <div className="space-y-5">
                {announcements.length > 0 ? announcements.map((ann, i) => (
                  <div key={i} className="pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{ann.title || 'Notification'}</h4>
                    <p className="text-xs text-gray-400 mb-2">{ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : ''}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{ann.message || ann.desc || ''}</p>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 py-2">No new announcements at this time.</p>
                )}
              </div>
              
              <button onClick={() => navigate('/passenger/announcements')} className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                View All Announcements
              </button>
            </motion.div>

            {/* Recent Feedback/Review Summary */}
            <motion.div variants={fadeUp} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <h3 className="font-semibold text-gray-900 text-lg">Recent Reviews</h3>
              </div>
              
              {reviews.length > 0 ? reviews.map((review, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-900 text-sm">Route {review.routeId || ''}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating || 5 }).map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic mb-3">
                    "{review.comment || 'Great experience!'}"
                  </p>
                  <p className="text-xs text-gray-400 font-medium">Reviewed on {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                </div>
              )) : (
                <p className="text-sm text-gray-500 py-2">No recent feedback.</p>
              )}

              <button onClick={() => navigate('/passenger/feedback')} className="w-full mt-5 py-2.5 rounded-xl border-2 border-gray-100 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" /> Submit New Feedback
              </button>
            </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

