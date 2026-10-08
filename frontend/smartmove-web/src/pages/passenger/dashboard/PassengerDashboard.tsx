// removed
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Calendar, ChevronRight,
  Clock, ShieldCheck, Mail, Phone, MessageSquare, Bell, Navigation
} from 'lucide-react';
// removed

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
    <div className="max-w-7xl mx-auto h-full grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
            
            {/* ================= COLUMN 1: LEFT ================= */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="xl:col-span-3 space-y-6">
              
              {/* Upcoming Trips List */}
              <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900">Upcoming Trips</h3>
                  <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-purple-50 transition-colors">
                    <Search className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { route: 'Coastal Express', date: 'Oct 15, 2026', time: '08:30 AM', status: 'Confirmed', img: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=100&h=100&fit=crop' },
                    { route: 'Mountain Pass', date: 'Oct 22, 2026', time: '11:00 AM', status: 'Payment Due', img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100&h=100&fit=crop' },
                    { route: 'Valley Line', date: 'Nov 05, 2026', time: '02:15 PM', status: 'Scheduled', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' }
                  ].map((trip, i) => (
                    <motion.div variants={fadeUp} key={i} className="flex gap-4 items-center p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="relative">
                        <img src={trip.img} className="w-12 h-12 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" alt="Trip" />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${trip.status === 'Confirmed' ? 'bg-green-500' : trip.status === 'Payment Due' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{trip.route}</h4>
                        <p className="text-xs text-gray-500 truncate">{trip.date} • {trip.time}</p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Active Bookings (Groups style) */}
              <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Active Bookings <span className="text-xs text-gray-400 ml-1">(2)</span></h3>
                  <button className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 text-gray-500">+</button>
                </div>
                <div className="space-y-3">
                  <motion.div variants={fadeUp} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">U</div>
                      <span className="text-sm font-medium text-gray-700">Urban Transit</span>
                    </div>
                    <div className="flex -space-x-2">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop" className="w-6 h-6 rounded-full border border-white" alt="Avatar"/>
                      <div className="w-6 h-6 rounded-full border border-white bg-gray-100 text-[10px] flex items-center justify-center font-medium text-gray-600">+2</div>
                    </div>
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">W</div>
                      <span className="text-sm font-medium text-gray-700">Weekend Getaway</span>
                    </div>
                    <div className="flex -space-x-2">
                      <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop" className="w-6 h-6 rounded-full border border-white" alt="Avatar"/>
                      <div className="w-6 h-6 rounded-full border border-white bg-gray-100 text-[10px] flex items-center justify-center font-medium text-gray-600">+4</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* ================= COLUMN 2: MIDDLE ================= */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="xl:col-span-6 flex flex-col gap-6">
              
              {/* Search Trips Panel (Main Chat Window Layout) */}
              <div className="bg-white rounded-[1.5rem] flex-1 shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Navigation className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Find Your Next Journey</h2>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Network Online</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors"><MapPin className="w-5 h-5" /></button>
                    <button className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors"><Calendar className="w-5 h-5" /></button>
                  </div>
                </div>

                {/* Form Body (Mimicking Chat Bubbles Layout visually) */}
                <div className="flex-1 p-6 md:p-8 bg-gray-50/50 overflow-y-auto flex flex-col gap-8">
                  
                  {/* Assistant Bubble */}
                  <motion.div variants={fadeUp} className="flex gap-4 max-w-[85%]">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full object-cover shadow-sm" alt="AI Agent"/>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-700">SmartMove Assistant</span>
                        <span className="text-[10px] text-gray-400">10:20 AM</span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 text-sm text-gray-600 leading-relaxed">
                        Welcome back! Where would you like to travel today? I can help you find routes across our entire hybrid network.
                      </div>
                    </div>
                  </motion.div>

                  {/* User Bubble (Interactive Form) */}
                  <motion.div variants={fadeUp} className="flex gap-4 max-w-[90%] self-end flex-row-reverse">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full object-cover shadow-sm" alt="You"/>
                    <div className="w-full">
                      <div className="flex items-center gap-2 mb-1 justify-end">
                        <span className="text-xs font-semibold text-gray-700">You</span>
                        <span className="text-[10px] text-gray-400">10:22 AM</span>
                      </div>
                      <div className="bg-[#1e3f7a] p-5 rounded-2xl rounded-tr-sm shadow-md text-sm text-white w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">Origin</label>
                            <input type="text" placeholder="Enter City..." className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40 outline-none focus:bg-white/20 transition-colors" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">Destination</label>
                            <input type="text" placeholder="Enter City..." className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40 outline-none focus:bg-white/20 transition-colors" />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">Travel Date</label>
                            <input type="date" className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white outline-none focus:bg-white/20 transition-colors [color-scheme:dark]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* System Action Button */}
                  <motion.div variants={fadeUp} className="flex justify-end pr-14 -mt-4">
                    <button className="bg-[#1e3f7a] hover:bg-[#152e5e] text-white px-8 py-2.5 rounded-full text-sm font-semibold shadow-lg transition-all hover:-translate-y-0.5">
                      Search Routes
                    </button>
                  </motion.div>

                </div>

                {/* Bottom Announcements Bar */}
                <div className="p-4 border-t border-gray-50 bg-white flex items-center gap-4">
                  <div className="flex gap-2 bg-gray-50 p-2 rounded-full">
                    <span className="text-lg">📢</span> <span className="text-lg">🚌</span> <span className="text-lg">✨</span>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-full px-4 py-3 flex items-center gap-2 border border-gray-100">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <input type="text" readOnly value="System Announcement: New Express Routes added to the Northern Line!" className="bg-transparent border-none outline-none text-sm text-gray-600 w-full truncate cursor-default" />
                  </div>
                  <button className="w-12 h-12 bg-[#1e3f7a] rounded-full flex items-center justify-center text-white hover:bg-[#152e5e] transition-colors shadow-md hover:-translate-y-0.5">
                    <Navigation className="w-5 h-5 rotate-45 -ml-1 mt-1" />
                  </button>
                </div>
              </div>

            </motion.div>

            {/* ================= COLUMN 3: RIGHT ================= */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="xl:col-span-3 space-y-6">
              
              {/* Profile / Stats Card */}
              <motion.div variants={fadeUp} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 relative mt-12 xl:mt-0">
                {/* Overlapping Avatar */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" 
                    className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-xl"
                    alt="Profile"
                  />
                </div>
                
                <div className="pt-14 text-center pb-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900">Dipak Palve</h3>
                  <p className="text-sm text-gray-500 font-light">Frequent Traveler</p>
                  
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs font-medium text-gray-600 bg-gray-50 w-fit mx-auto px-3 py-1.5 rounded-full border border-gray-100">
                    <MapPin className="w-3.5 h-3.5 text-red-500" /> Pune, India
                  </div>
                  
                  <div className="flex justify-center gap-3 mt-5">
                    <button className="w-8 h-8 rounded-full bg-[#1da1f2]/10 text-[#1da1f2] flex items-center justify-center hover:bg-[#1da1f2]/20 transition-colors"><MessageSquare className="w-4 h-4" /></button>
                    <button className="w-8 h-8 rounded-full bg-[#25d366]/10 text-[#25d366] flex items-center justify-center hover:bg-[#25d366]/20 transition-colors"><Phone className="w-4 h-4" /></button>
                    <button className="w-8 h-8 rounded-full bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center hover:bg-[#1877f2]/20 transition-colors"><Mail className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><Navigation className="w-4 h-4" /></div>
                    <span className="text-gray-500 w-16">Total Trips</span>
                    <span className="font-semibold text-gray-900 ml-auto">124</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600"><ShieldCheck className="w-4 h-4" /></div>
                    <span className="text-gray-500 w-16">Completed</span>
                    <span className="font-semibold text-gray-900 ml-auto">120</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Clock className="w-4 h-4" /></div>
                    <span className="text-gray-500 w-16">Upcoming</span>
                    <span className="font-semibold text-gray-900 ml-auto">4</span>
                  </div>
                </div>
              </motion.div>

              {/* Recent Media/Feedback */}
              <motion.div variants={fadeUp} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Recent Media (28)</h3>
                  <button className="text-xs font-medium text-gray-500 hover:text-purple-600 flex items-center transition-colors">See all <ChevronRight className="w-3 h-3 ml-0.5" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl overflow-hidden h-20 group relative cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&h=200&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Media" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="rounded-xl overflow-hidden h-20 group relative cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Media" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>

            </motion.div>

          </div>
  );
}
