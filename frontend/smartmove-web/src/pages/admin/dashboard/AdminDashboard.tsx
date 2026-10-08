import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import reportService from '@/services/reportService';
import { 
  Car, Users, Route as RouteIcon, CalendarCheck, 
  Wrench, Plus, MoreHorizontal, AlertCircle, MessageSquare
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const revenueData: any[] = [];
const occupancyData: any[] = [];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    activeRoutes: 12,
    totalVehicles: 45,
    totalDrivers: 38,
    activeTrips: 8,
    revenue: 12500,
    occupancyRate: 85
  });
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
         const dashboardStats = await reportService.getDashboardStats();
         if (dashboardStats) setStats(dashboardStats);
      } catch (e) {
         console.error('Failed to load dashboard', e);
      }
    };
    fetchDashboard();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Main Metrics & Charts) - 8 cols */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Ethereal Card (Revenue) */}
            <motion.div variants={fadeUp} className="bg-gradient-to-br from-[#98F5E1] to-[#34d399] rounded-[2rem] p-8 relative overflow-hidden shadow-[0_10px_40px_rgba(52,211,153,0.2)]">
              {/* Abstract overlay */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 mix-blend-overlay" />
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <span className="text-[#064e3b] font-medium text-lg">Today's Revenue</span>
                <div>
                  <h2 className="text-5xl font-extrabold text-[#064e3b] tracking-tight">
                    <span className="text-3xl font-bold">$</span>{stats?.revenue?.toLocaleString() || '0'}<span className="text-2xl font-bold">.00</span>
                  </h2>
                  <p className="text-[#064e3b]/80 mt-2 text-sm font-medium flex items-center gap-1">
                    +15.3% revenue from yesterday
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => navigate('/admin/reports')} className="bg-[#022c22] text-[#98F5E1] px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-black/10">View Report</button>
                  <button className="bg-white/30 text-[#064e3b] px-6 py-2.5 rounded-full text-sm font-bold backdrop-blur-sm hover:bg-white/40 transition-colors">Export</button>
                </div>
              </div>
            </motion.div>

            {/* Secondary Metrics Column */}
            <div className="flex flex-col gap-6">
              <motion.div variants={fadeUp} className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 flex-1 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-110" />
                <span className="text-gray-400 font-medium mb-2">Total Bookings (Today)</span>
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-white">342</h3>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs font-bold">+12%</span>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 flex-1 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-110" />
                <span className="text-gray-400 font-medium mb-2">Active Trips (Today)</span>
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-white">28</h3>
                  <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-lg text-xs font-bold">-2%</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-[320px]">
            {/* Revenue Flow Bar Chart */}
            <motion.div variants={fadeUp} className="md:col-span-3 bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold">Revenue flow</h3>
                <button className="bg-white/5 text-xs text-gray-300 px-3 py-1.5 rounded-lg border border-white/5">Monthly</button>
              </div>
              <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.02)'}}
                      contentStyle={{backgroundColor: '#272935', border: 'none', borderRadius: '12px', color: '#fff'}}
                      itemStyle={{color: '#a855f7', fontWeight: 'bold'}}
                    />
                    <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                      {revenueData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === revenueData.length - 1 ? '#a855f7' : '#373945'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Occupancy Donut Chart */}
            <motion.div variants={fadeUp} className="md:col-span-2 bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-semibold">Trip Occupancy</h3>
                <button className="bg-white/5 text-xs text-gray-300 px-3 py-1.5 rounded-lg border border-white/5">Today</button>
              </div>
              <div className="flex-1 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text inside Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-gray-400 text-xs font-medium">Avg</span>
                  <span className="text-white text-2xl font-bold">75%</span>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#a855f7]"></span><span className="text-xs text-gray-400">Booked</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#fb923c]"></span><span className="text-xs text-gray-400">Available</span></div>
              </div>
            </motion.div>
          </div>

          {/* Operational Alerts Row */}
          <motion.div variants={fadeUp} className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" /> Operational Alerts
              </h3>
              <button className="text-xs text-gray-400 hover:text-white transition-colors">See All {'>'}</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold group-hover:text-orange-400 transition-colors">Maintenance Overdue</p>
                    <p className="text-gray-500 text-xs">Vehicle ND-4521 requires immediate oil change.</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Urgent</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold group-hover:text-red-400 transition-colors">New Low Rating (1-star)</p>
                    <p className="text-gray-500 text-xs">Driver behaviour complaint on Route T-1042.</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Attention</span>
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* Right Column (Cards & Quick Actions) - 4 cols */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quick Actions (Overlapping Ethereal Cards) */}
          <motion.div variants={fadeUp} className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-semibold">Quick Actions</h3>
              <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Stacked Cards Effect */}
            <div className="relative h-[220px]">
              {/* Back Card */}
              <div className="absolute top-0 left-4 right-4 h-32 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl opacity-50 translate-y-4" />
              
              {/* Middle Card */}
              <div className="absolute top-0 left-2 right-2 h-32 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl opacity-75 translate-y-8" />
              
              {/* Front Card */}
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl translate-y-12 shadow-[0_20px_40px_rgba(168,85,247,0.3)] p-6 flex flex-col justify-between border border-white/20 backdrop-blur-xl">
                <div className="flex justify-between items-start">
                  <div className="text-white">
                    <p className="text-xs font-medium text-white/70 uppercase tracking-widest mb-1">Action</p>
                    <p className="text-lg font-bold">Schedule Trip</p>
                  </div>
                  <CalendarCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate('/admin/trips')} className="bg-white text-purple-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-transform">Create</button>
                  <button onClick={() => navigate('/admin/trips')} className="bg-black/20 text-white px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md hover:bg-black/30 transition-colors">View Schedule</button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={() => navigate('/admin/vehicles')} className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 flex items-center justify-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                <Car className="w-4 h-4 text-emerald-400" /> Add Vehicle
              </button>
              <button onClick={() => navigate('/admin/drivers')} className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 flex items-center justify-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                <Users className="w-4 h-4 text-blue-400" /> Add Driver
              </button>
            </div>
          </motion.div>

          {/* Static Counters Grid */}
          <motion.div variants={fadeUp} className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 flex-1">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold">Fleet Status</h3>
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
             </div>
             <div className="space-y-3">
               <div className="bg-[#21232e] p-4 rounded-xl flex items-center justify-between border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center"><Car className="w-5 h-5 text-gray-400" /></div>
                   <span className="text-gray-300 font-medium text-sm">Total Vehicles</span>
                 </div>
                 <span className="text-white font-bold text-lg">124</span>
               </div>
               <div className="bg-[#21232e] p-4 rounded-xl flex items-center justify-between border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center"><Users className="w-5 h-5 text-gray-400" /></div>
                   <span className="text-gray-300 font-medium text-sm">Total Drivers</span>
                 </div>
                 <span className="text-white font-bold text-lg">89</span>
               </div>
               <div className="bg-[#21232e] p-4 rounded-xl flex items-center justify-between border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center"><RouteIcon className="w-5 h-5 text-gray-400" /></div>
                   <span className="text-gray-300 font-medium text-sm">Active Routes</span>
                 </div>
                 <span className="text-white font-bold text-lg">42</span>
               </div>
             </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
