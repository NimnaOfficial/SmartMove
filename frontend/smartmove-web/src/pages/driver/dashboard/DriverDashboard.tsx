import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import driverService from '@/services/driverService';
import authService from '@/services/authService';
import { 
  MapPin, Clock, Navigation, CheckCircle2,
  Calendar, Star, TrendingUp, RefreshCw, Car
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function DriverDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [availableTrips, setAvailableTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'All' | 'Today' | 'Upcoming' | 'Completed'>('All');
  const navigate = useNavigate();

  const fetchDashboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [pData, tData, openData] = await Promise.all([
        driverService.getProfile(),
        driverService.getMyTrips(),
        driverService.getAvailableTrips()
      ]);
      setProfile(pData);
      setTrips(Array.isArray(tData) ? tData : []);
      setAvailableTrips(Array.isArray(openData) ? openData : []);
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(() => fetchDashboard(true), 4000);
    return () => clearInterval(interval);
  }, []);

  const nextTrip = trips.find(t => t.status === 'IN_PROGRESS' || t.status === 'SCHEDULED' || t.status === 'CONFIRMED' || t.status === 'PENDING') || trips[0];

  const currentUser = authService.getCurrentUser();
  const driverName = profile?.firstName || profile?.FIRST_NAME || currentUser?.firstName || 'Captain';
  const completedTripsCount = trips.filter(t => t.status === 'COMPLETED').length + (profile?.totalTrips || profile?.TOTAL_TRIPS || 0);
  const upcomingTripsCount = trips.filter(t => t.status === 'SCHEDULED' || t.status === 'CONFIRMED' || t.status === 'PENDING').length;

  const filteredSchedule = trips.filter(t => {
    if (filterTab === 'All') return true;
    if (filterTab === 'Completed') return t.status === 'COMPLETED';
    if (filterTab === 'Upcoming') return t.status === 'SCHEDULED' || t.status === 'CONFIRMED' || t.status === 'PENDING';
    return true; // Today
  });

  const chartData = [
    { day: 'Mon', hours: 6.5, trips: 2 },
    { day: 'Tue', hours: 7.2, trips: 3 },
    { day: 'Wed', hours: 8.0, trips: 3 },
    { day: 'Thu', hours: 5.5, trips: 2 },
    { day: 'Fri', hours: 9.2, trips: 4 },
    { day: 'Sat', hours: 8.5, trips: 3 },
    { day: 'Sun', hours: 4.0, trips: 1 }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto h-full pb-8">
      
      {/* Top Banner Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Welcome Box */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-7 bg-gray-50 rounded-[2rem] p-8 border border-gray-100 flex items-center justify-between relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Captain On Duty • Live Dynamic</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              Hello {driverName}!
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              You have <strong className="text-gray-900">{trips.length} active trips</strong> assigned to your manifest.
            </p>
            
            {nextTrip ? (
              <div className="mt-7 flex items-center gap-4 bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 w-fit">
                 <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center text-white shadow-md">
                   <Navigation className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-gray-900">
                     {nextTrip.status === 'IN_PROGRESS' ? 'Resume Active Trip' : 'Start Next Trip'}
                   </p>
                   <p className="text-xs text-gray-500 font-medium">
                     {nextTrip.routeOrigin || 'Colombo'} ➔ {nextTrip.routeDestination || 'Kandy'} • {new Date(nextTrip.departureTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </p>
                 </div>
                 <button 
                   onClick={() => navigate(`/driver/trips/${nextTrip.tripId}`)} 
                   className="ml-4 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors cursor-pointer"
                 >
                   {nextTrip.status === 'IN_PROGRESS' ? 'Resume' : 'Start'}
                 </button>
              </div>
            ) : (
              <div className="mt-6 p-4 rounded-xl bg-white border border-gray-100 text-xs text-gray-500">
                All scheduled routes completed for today.
              </div>
            )}
          </div>
          
          <div className="absolute right-0 bottom-0 opacity-40 md:opacity-100 translate-y-4 translate-x-4">
             <div className="w-44 h-44 bg-gray-200/60 rounded-full flex items-center justify-center border-8 border-white">
                <UserIllustration />
             </div>
          </div>
        </motion.div>

        {/* KPIs Box */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-5 grid grid-cols-2 gap-4">
          <motion.div variants={fadeUp} className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500 font-medium text-sm">Trips Completed</span>
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900">{completedTripsCount}</h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">Total Lifetime</p>
          </motion.div>
          
          <motion.div variants={fadeUp} className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500 font-medium text-sm">Upcoming Trips</span>
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900">{upcomingTripsCount}</h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">Pending Departure</p>
          </motion.div>
        </motion.div>

      </div>

      {/* Available Trips Alert Banner */}
      {availableTrips.length > 0 && (
        <motion.div 
          variants={fadeUp} 
          initial="hidden" 
          animate="visible"
          className="bg-amber-500/10 border border-amber-500/30 rounded-[1.75rem] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
            <div>
              <h4 className="font-extrabold text-amber-950 text-base">
                {availableTrips.length} Open Trip Request{availableTrips.length > 1 ? 's' : ''} Ready to Claim
              </h4>
              <p className="text-xs text-amber-800 font-medium mt-0.5">
                New passenger bookings confirmed by dispatch require driver scheduling and vehicle assignment.
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/driver/trips')} 
            className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            Review & Claim Requests
          </button>
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Trips List) */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Schedule</h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Real-time route telemetry & trip states</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2 text-xs font-bold text-gray-400 bg-gray-100 p-1 rounded-xl">
                {(['All', 'Upcoming', 'Completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      filterTab === tab ? 'bg-white text-black shadow-sm' : 'hover:text-black'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button 
                onClick={fetchDashboard} 
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                title="Refresh schedule"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredSchedule.length === 0 ? (
              <div className="p-10 text-center rounded-[2rem] bg-gray-50 border border-gray-100 text-gray-400 text-sm font-semibold">
                No trips found in this category.
              </div>
            ) : (
              filteredSchedule.map((t, i) => {
                const time = new Date(t.departureTime || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <motion.div 
                    key={t.tripId || i} 
                    variants={fadeUp} 
                    className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-between group hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-colors">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-base">{t.routeOrigin} ➔ {t.routeDestination}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            t.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' :
                            t.status === 'IN_PROGRESS' ? 'bg-emerald-100 text-emerald-700 animate-pulse' :
                            t.status === 'PENDING' ? 'bg-orange-100 text-orange-700 font-extrabold' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {t.status || 'SCHEDULED'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-2 mt-1">
                          <span>Vehicle: {t.vehicleRegistration || 'Coach'}</span>
                          <span>•</span>
                          <span>Seats: {t.availableSeats ?? 30}/{t.totalSeats ?? 45} booked</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                        <Clock className="w-4 h-4 text-gray-400" /> {time}
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/driver/trips/${t.tripId}`)} 
                      className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:scale-105 transition-transform"
                    >
                      Details
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Right Column (Stats & Rating) */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Chart Section */}
          <motion.div variants={fadeUp} className="flex flex-col gap-5">
             <div className="flex items-center justify-between">
               <div>
                 <h2 className="text-2xl font-bold text-gray-900">Telemetry Stats</h2>
                 <p className="text-xs text-gray-400 font-medium mt-0.5">Weekly driving hours & trips</p>
               </div>
               <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-700 rounded-xl">Weekly</span>
             </div>
             
             <div className="h-[220px] w-full bg-gray-50/60 p-4 rounded-[2rem] border border-gray-100">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#000" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11, fontWeight: 600}} dy={5} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#000', borderRadius: '12px', border: 'none', color: '#fff'}}
                      itemStyle={{color: '#fff', fontWeight: 'bold'}}
                    />
                    <Area type="monotone" dataKey="hours" stroke="#000" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </motion.div>

          {/* Performance Box */}
          <motion.div variants={fadeUp} className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Star className="w-5 h-5 text-black fill-black" /> Top Rated Driver
              </h3>
              <p className="text-sm text-gray-500 font-medium max-w-[220px] leading-relaxed">
                Rating: <strong>{profile?.rating || '4.9'} ★</strong> with exemplary passenger safety records.
              </p>
              <button onClick={() => navigate('/driver/profile')} className="mt-4 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                View Profile & Security
              </button>
            </div>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-gray-100 shadow-sm flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-black" />
            </div>
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
}

function UserIllustration() {
  return (
    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
