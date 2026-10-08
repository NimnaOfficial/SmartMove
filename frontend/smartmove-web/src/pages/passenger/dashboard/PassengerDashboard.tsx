import { motion } from 'framer-motion';
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
  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col gap-8 w-full pb-10">
      
      {/* Header Section */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2 font-light">Welcome back, here is your travel summary.</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-[#1e3f7a] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#152e5e] transition-colors shadow-md hover:-translate-y-0.5">
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
               <h3 className="text-2xl font-bold text-gray-900">42</h3>
             </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:border-green-100 hover:shadow-md transition-all">
             <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600">
               <CheckCircle className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm text-gray-500 font-medium">Completed Trips</p>
               <h3 className="text-2xl font-bold text-gray-900">38</h3>
             </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:border-purple-100 hover:shadow-md transition-all">
             <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
               <Clock className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm text-gray-500 font-medium">Upcoming Trips</p>
               <h3 className="text-2xl font-bold text-gray-900">4</h3>
             </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center gap-5 hover:border-orange-100 hover:shadow-md transition-all">
             <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
               <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm text-gray-500 font-medium">Active Bookings</p>
               <h3 className="text-2xl font-bold text-gray-900">2</h3>
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
                      <input type="text" placeholder="Origin City" className="bg-transparent border-none outline-none text-white placeholder-white/40 w-full font-medium" />
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                    <label className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold block mb-2">To</label>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-white/70" />
                      <input type="text" placeholder="Destination City" className="bg-transparent border-none outline-none text-white placeholder-white/40 w-full font-medium" />
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                    <label className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold block mb-2">Date</label>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-white/70" />
                      <input type="date" className="bg-transparent border-none outline-none text-white w-full font-medium [color-scheme:dark]" />
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
                  <button className="bg-white text-[#1e3f7a] px-8 py-3.5 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 w-full md:w-auto justify-center">
                    <Search className="w-5 h-5" /> Search Available Trips
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Next Booking Summary */}
            <motion.div variants={fadeUp} className="bg-white rounded-[1.5rem] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-auto">
                 <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-blue-600" /> Next Booking Summary
                 </h3>
                 <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold inline-block mb-2 text-sm tracking-wide">
                   TOMORROW
                 </div>
                 <p className="text-3xl font-bold text-gray-900">08:30 AM</p>
                 <p className="text-gray-500 font-medium">Oct 15, 2026</p>
              </div>
              <div className="flex-1 w-full bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-900">Coastal Express</span>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase tracking-wider">Confirmed</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Origin</p>
                    <p className="font-medium text-gray-900">Colombo</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 text-right">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Destination</p>
                    <p className="font-medium text-gray-900">Galle</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Trips List */}
            <motion.div variants={fadeUp} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 text-lg">Upcoming Trips</h3>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">View All</button>
              </div>
              
              <div className="space-y-4">
                {[
                  { route: 'Mountain Pass', date: 'Oct 22, 2026', time: '11:00 AM', status: 'Payment Due', from: 'Kandy', to: 'Nuwara Eliya' },
                  { route: 'Valley Line', date: 'Nov 05, 2026', time: '02:15 PM', status: 'Scheduled', from: 'Colombo', to: 'Kandy' }
                ].map((trip, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-4 items-center p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all group">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors flex-shrink-0">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <h4 className="text-base font-bold text-gray-900 truncate">{trip.route}</h4>
                      <p className="text-sm text-gray-500 truncate">{trip.from} to {trip.to}</p>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="font-semibold text-gray-900">{trip.date}</p>
                      <p className="text-sm text-gray-500">{trip.time}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors sm:ml-2">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
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
                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">NEW</span>
              </div>

              <div className="space-y-5">
                {[
                  { title: "Service Update: Northern Route", date: "Today, 09:00 AM", desc: "Minor delays expected on the Northern Star line due to track maintenance." },
                  { title: "Holiday Schedule Released", date: "Yesterday, 14:30 PM", desc: "Check out our new expanded schedule for the upcoming holiday season." }
                ].map((ann, i) => (
                  <div key={i} className="pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{ann.title}</h4>
                    <p className="text-xs text-gray-400 mb-2">{ann.date}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{ann.desc}</p>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                View All Announcements
              </button>
            </motion.div>

            {/* Recent Feedback/Review Summary */}
            <motion.div variants={fadeUp} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <h3 className="font-semibold text-gray-900 text-lg">Your Feedback</h3>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-900 text-sm">Coastal Express</span>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic mb-3">
                  "Excellent journey, the coach was very comfortable and arrived right on time."
                </p>
                <p className="text-xs text-gray-400 font-medium">Reviewed on Oct 10, 2026</p>
              </div>

              <button className="w-full mt-5 py-2.5 rounded-xl border-2 border-gray-100 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" /> Submit New Feedback
              </button>
            </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
