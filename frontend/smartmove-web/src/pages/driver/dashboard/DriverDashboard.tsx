import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import driverService from '@/services/driverService';
import authService from '@/services/authService';
import { 
  MapPin, Clock, Navigation, CheckCircle2,
  Calendar, Star, TrendingUp
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

/* removed static */

export default function DriverDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
     const fetchDashboard = async () => {
        try {
           const pData = await driverService.getProfile();
           setProfile(pData);
           const tData = await driverService.getMyTrips();
           setTrips(Array.isArray(tData) ? tData : []);
        } catch (e) {
           console.error(e);
        }
     };
     fetchDashboard();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto h-full">
      
      {/* Top Banner Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Welcome Box */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-7 bg-gray-50 rounded-[2rem] p-8 border border-gray-100 flex items-center justify-between relative overflow-hidden">
          <div className="z-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hello Josh!</h1>
            <p className="text-gray-500 mt-2 font-medium">You have <strong className="text-gray-900">2 trips</strong> scheduled for today.</p>
            
            <div className="mt-8 flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 w-fit">
               <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                 <Navigation className="w-5 h-5" />
               </div>
               <div>
                 <p className="text-sm font-bold text-gray-900">Start Next Trip</p>
                 <p className="text-xs text-gray-500 font-medium">Colombo to Kandy • 08:30 AM</p>
               </div>
               <button onClick={() => navigate('/driver/trips')} className="ml-4 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                 Start
               </button>
            </div>
          </div>
          
          {/* Abstract Illustration Placeholder */}
          <div className="absolute right-0 bottom-0 opacity-50 md:opacity-100 translate-y-4 translate-x-4">
             <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center border-8 border-white">
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
            <h3 className="text-4xl font-extrabold text-gray-900">14</h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">This Week</p>
          </motion.div>
          
          <motion.div variants={fadeUp} className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500 font-medium text-sm">Upcoming Trips</span>
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900">6</h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">Next 7 Days</p>
          </motion.div>
        </motion.div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Trips List) */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Your Schedule</h2>
            <div className="flex gap-4 text-sm font-semibold text-gray-400">
              <span className="text-black cursor-pointer">Today</span>
              <span className="hover:text-gray-600 cursor-pointer">Upcoming</span>
              <span className="hover:text-gray-600 cursor-pointer">Completed</span>
            </div>
          </div>

          <div className="space-y-4">
            {([] as any[]).map((trip, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-between group hover:border-gray-300 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{trip.route}</h4>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                      {trip.from} to {trip.to}
                    </p>
                  </div>
                </div>
                
                <div className="hidden sm:flex items-center gap-8">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" /> {trip.time}
                  </div>
                  <div className="text-sm font-bold text-gray-700">
                    {trip.duration}
                  </div>
                </div>

                <button onClick={() => navigate('/driver/trips')} className="bg-black text-white px-5 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform">
                  View
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column (Stats & Promo) */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Chart Section */}
          <motion.div variants={fadeUp} className="flex flex-col gap-6">
             <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold text-gray-900">Your Statistics</h2>
               <select className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 outline-none">
                 <option>Weekly</option>
                 <option>Monthly</option>
               </select>
             </div>
             
             <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[]}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} dy={10} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#000', borderRadius: '12px', border: 'none', color: '#fff'}}
                      itemStyle={{color: '#fff', fontWeight: 'bold'}}
                    />
                    <Area type="monotone" dataKey="hours" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </motion.div>

          {/* Performance Box */}
          <motion.div variants={fadeUp} className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Star className="w-5 h-5 text-black fill-black" /> Top Rated!
              </h3>
              <p className="text-sm text-gray-500 font-medium max-w-[200px] leading-relaxed">
                You maintained a 4.9 rating this week. Keep up the excellent work on the road.
              </p>
              <button onClick={() => navigate('/driver/profile')} className="mt-4 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                View Feedback
              </button>
            </div>
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-gray-100 shadow-sm">
              <TrendingUp className="w-10 h-10 text-black" />
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
