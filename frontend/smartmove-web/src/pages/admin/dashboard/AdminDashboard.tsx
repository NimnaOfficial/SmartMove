import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import reportService from '@/services/reportService';
import { 
  Car, Users, Route as RouteIcon, CalendarCheck, 
  Wrench, Plus, MoreHorizontal, AlertCircle, RefreshCw,
  Download, ArrowUpRight, X, ShieldAlert, Sparkles
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { DashboardStats, MaintenanceDueReport } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [occupancyData, setOccupancyData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<MaintenanceDueReport[]>([]);
  const [avgOccupancy, setAvgOccupancy] = useState(0);
  const [revenueView, setRevenueView] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [occupancyFilter, setOccupancyFilter] = useState<'Today' | 'Overall'>('Today');
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboard = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const dashboardStats = await reportService.getDashboardStats();
      if (dashboardStats) setStats(dashboardStats);

      const maintenance = await reportService.getMaintenanceDue();
      if (maintenance) setAlerts(maintenance);

      const tripPerf = await reportService.getTripPerformance();
      if (tripPerf && tripPerf.length > 0) {
        let totalOccupancy = 0;
        let booked = 0;
        let available = 0;
        tripPerf.forEach(t => {
          totalOccupancy += Number(t.occupancyPercent || 0);
          booked += Number(t.bookedSeats || 0);
          available += Number(t.availableSeats || 0);
        });
        const calculatedAvg = Math.round(totalOccupancy / tripPerf.length);
        setAvgOccupancy(isNaN(calculatedAvg) ? 0 : calculatedAvg);
        setOccupancyData([
          { name: 'Booked', value: booked, color: '#a855f7' },
          { name: 'Available', value: available, color: '#fb923c' }
        ]);
      } else {
        setOccupancyData([]);
        setAvgOccupancy(0);
      }

      const today = new Date();
      const pastDays = revenueView === 'Weekly' ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(today.getDate() - pastDays);

      const rev = await reportService.getRevenue(
        startDate.toISOString().split('T')[0], 
        today.toISOString().split('T')[0]
      );
      
      if (rev && rev.dailyBreakdown && rev.dailyBreakdown.length > 0) {
        setRevenueData(rev.dailyBreakdown.map((d: any) => ({
          name: d.date.substring(5), // MM-DD
          value: d.revenue,
          tickets: d.tickets
        })));
      } else if (rev && rev.totalRevenue) {
        setRevenueData([
          { name: 'Total', value: rev.totalRevenue, tickets: rev.ticketsSold || 0 }
        ]);
      } else {
        setRevenueData([]);
      }

    } catch (e) {
      console.error('Failed to load dashboard', e);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(() => fetchDashboard(true), 5000);
    return () => clearInterval(interval);
  }, [revenueView, occupancyFilter]);

  const handleExport = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Vehicles', stats?.totalVehicles ?? 0],
      ['Active Drivers', stats?.activeDrivers ?? 0],
      ["Today's Trips", stats?.todaysTrips ?? 0],
      ["Today's Bookings", stats?.todaysBookings ?? 0],
      ["Today's Revenue ($)", stats?.todaysRevenue ?? 0],
      ['Maintenance Due', stats?.maintenanceDue ?? 0],
      ['Average Occupancy (%)', `${avgOccupancy}%`],
      ['Generated At', new Date().toISOString()]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartMove_Admin_Summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Page Title & Refresh */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Admin Dashboard
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Dynamic
            </span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Real-time fleet operations, financial analytics and scheduling controls.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchDashboard(false)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Main Metrics & Charts) - 8 cols */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Ethereal Card (Revenue) */}
            <motion.div variants={fadeUp} className="bg-gradient-to-br from-[#98F5E1] to-[#34d399] rounded-[2rem] p-8 relative overflow-hidden shadow-[0_10px_40px_rgba(52,211,153,0.2)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 mix-blend-overlay" />
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <span className="text-[#064e3b] font-medium text-lg">Today's Revenue</span>
                <div>
                  <h2 className="text-5xl font-extrabold text-[#064e3b] tracking-tight">
                    <span className="text-3xl font-bold">$</span>{(stats?.todaysRevenue ?? 0).toLocaleString()}<span className="text-2xl font-bold">.00</span>
                  </h2>
                </div>
                <div className="flex gap-3 mt-2">
                  <button 
                    onClick={() => navigate('/admin/reports')} 
                    className="bg-[#022c22] text-[#98F5E1] hover:bg-black/90 px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-black/10 transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    View Report <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleExport}
                    className="bg-white/30 text-[#064e3b] px-6 py-2.5 rounded-full text-sm font-bold backdrop-blur-sm hover:bg-white/40 transition-colors active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Secondary Metrics Column */}
            <div className="flex flex-col gap-6">
              <motion.div 
                variants={fadeUp} 
                onClick={() => navigate('/admin/bookings')}
                className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 flex-1 flex flex-col justify-center relative overflow-hidden group cursor-pointer hover:border-blue-500/30 transition-all hover:bg-[#1e1f29]"
              >
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-125" />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 font-medium">Total Bookings (Today)</span>
                  <ArrowUpRight className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-white">{stats?.todaysBookings || 0}</h3>
                  <span className="text-xs text-blue-400 font-semibold bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">Manage Bookings</span>
                </div>
              </motion.div>

              <motion.div 
                variants={fadeUp} 
                onClick={() => navigate('/admin/trips')}
                className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 flex-1 flex flex-col justify-center relative overflow-hidden group cursor-pointer hover:border-purple-500/30 transition-all hover:bg-[#1e1f29]"
              >
                <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-125" />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 font-medium">Active Trips (Today)</span>
                  <ArrowUpRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-white">{stats?.todaysTrips || 0}</h3>
                  <span className="text-xs text-purple-400 font-semibold bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">View Schedule</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-[320px]">
            {/* Revenue Flow Bar Chart */}
            <motion.div variants={fadeUp} className="md:col-span-3 bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-white font-semibold">Revenue Flow</h3>
                  <p className="text-xs text-gray-500">Income trends over time</p>
                </div>
                <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                  <button 
                    onClick={() => setRevenueView('Weekly')}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${revenueView === 'Weekly' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => setRevenueView('Monthly')}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${revenueView === 'Monthly' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full relative">
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                      <Tooltip 
                        cursor={{fill: 'rgba(255,255,255,0.02)'}}
                        contentStyle={{backgroundColor: '#272935', border: 'none', borderRadius: '12px', color: '#fff'}}
                        itemStyle={{color: '#a855f7', fontWeight: 'bold'}}
                        formatter={(val: any) => [`$${val.toLocaleString()}`, 'Revenue']}
                      />
                      <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                        {revenueData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index === revenueData.length - 1 ? '#a855f7' : '#373945'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">Loading flow data...</div>
                )}
              </div>
            </motion.div>

            {/* Occupancy Donut Chart */}
            <motion.div variants={fadeUp} className="md:col-span-2 bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-white font-semibold">Trip Occupancy</h3>
                  <p className="text-xs text-gray-500">Fleet seat utilization</p>
                </div>
                <button 
                  onClick={() => setOccupancyFilter(occupancyFilter === 'Today' ? 'Overall' : 'Today')}
                  className="bg-white/5 text-xs text-purple-400 hover:text-purple-300 px-3 py-1.5 rounded-lg border border-white/5 cursor-pointer font-medium"
                >
                  {occupancyFilter}
                </button>
              </div>
              <div className="flex-1 relative flex items-center justify-center">
                {occupancyData.length > 0 ? (
                  <>
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-gray-400 text-xs font-medium">Avg</span>
                      <span className="text-white text-2xl font-bold">{avgOccupancy}%</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No data</div>
                )}
              </div>
              {occupancyData.length > 0 && (
                <div className="flex justify-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]"></span>
                    <span className="text-xs text-gray-300 font-medium">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fb923c]"></span>
                    <span className="text-xs text-gray-300 font-medium">Available</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Operational Alerts Row */}
          <motion.div variants={fadeUp} className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" /> Operational Alerts
              </h3>
              <button 
                onClick={() => navigate('/admin/maintenance')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                See All Maintenance <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {alerts.length > 0 ? alerts.slice(0, 3).map((alert, idx) => (
                <div 
                  key={idx} 
                  onClick={() => navigate('/admin/maintenance')}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold group-hover:text-orange-400 transition-colors">
                        Maintenance {alert.status === 'OVERDUE' ? 'Overdue' : 'Scheduled'}
                      </p>
                      <p className="text-gray-400 text-xs">Vehicle <span className="font-semibold text-gray-200">{alert.vehicleRegistration}</span> requires {alert.status === 'OVERDUE' ? 'immediate ' : ''}attention.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${alert.status === 'OVERDUE' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                      {alert.status}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              )) : (
                <div className="text-gray-500 text-sm py-4 text-center bg-[#0a0b10] rounded-xl border border-white/5">
                  No pending maintenance alerts. Fleet operating smoothly.
                </div>
              )}
            </div>
          </motion.div>

        </motion.div>

        {/* Right Column (Cards & Quick Actions) - 4 cols */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quick Actions (Overlapping Ethereal Cards) */}
          <motion.div variants={fadeUp} className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-semibold">Quick Actions</h3>
              <button 
                onClick={() => setShowQuickModal(true)}
                title="Open Quick Menu"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-purple-600 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Stacked Cards Effect */}
            <div className="relative h-[220px]">
              {/* Back Card */}
              <div className="absolute top-0 left-4 right-4 h-32 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl opacity-40 translate-y-4" />
              
              {/* Middle Card */}
              <div className="absolute top-0 left-2 right-2 h-32 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl opacity-70 translate-y-8" />
              
              {/* Front Card */}
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl translate-y-12 shadow-[0_20px_40px_rgba(168,85,247,0.3)] p-6 flex flex-col justify-between border border-white/20 backdrop-blur-xl">
                <div className="flex justify-between items-start">
                  <div className="text-white">
                    <p className="text-xs font-medium text-white/70 uppercase tracking-widest mb-1">Operational Action</p>
                    <p className="text-xl font-extrabold">Schedule Trip</p>
                  </div>
                  <CalendarCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate('/admin/trips')} 
                    className="bg-white text-purple-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  >
                    + Schedule Now
                  </button>
                  <button 
                    onClick={() => navigate('/admin/trips')} 
                    className="bg-black/20 text-white px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md hover:bg-black/30 transition-colors cursor-pointer"
                  >
                    View Timetable
                  </button>
                </div>
              </div>
            </div>
            
            {/* Quick Link Buttons Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button 
                onClick={() => navigate('/admin/vehicles')} 
                className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 flex items-center justify-center gap-2 text-sm text-gray-300 hover:text-white transition-all cursor-pointer group"
              >
                <Car className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" /> Add Vehicle
              </button>
              <button 
                onClick={() => navigate('/admin/drivers')} 
                className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 flex items-center justify-center gap-2 text-sm text-gray-300 hover:text-white transition-all cursor-pointer group"
              >
                <Users className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" /> Add Driver
              </button>
              <button 
                onClick={() => navigate('/admin/routes')} 
                className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 flex items-center justify-center gap-2 text-sm text-gray-300 hover:text-white transition-all cursor-pointer group"
              >
                <RouteIcon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" /> Add Route
              </button>
              <button 
                onClick={() => navigate('/admin/maintenance')} 
                className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 flex items-center justify-center gap-2 text-sm text-gray-300 hover:text-white transition-all cursor-pointer group"
              >
                <Wrench className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" /> Log Maint.
              </button>
            </div>
          </motion.div>

          {/* Interactive Counters Grid */}
          <motion.div variants={fadeUp} className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-6 flex-1">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold">Fleet Status</h3>
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
             </div>
             <div className="space-y-3">
               <div 
                 onClick={() => navigate('/admin/vehicles')}
                 className="bg-[#21232e] hover:bg-[#282b38] p-4 rounded-xl flex items-center justify-between border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group"
               >
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                     <Car className="w-5 h-5" />
                   </div>
                   <div>
                     <span className="text-gray-200 font-medium text-sm block">Total Vehicles</span>
                     <span className="text-xs text-gray-500">Active fleet registry</span>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="text-white font-bold text-xl">{stats?.totalVehicles || 0}</span>
                   <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                 </div>
               </div>

               <div 
                 onClick={() => navigate('/admin/drivers')}
                 className="bg-[#21232e] hover:bg-[#282b38] p-4 rounded-xl flex items-center justify-between border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group"
               >
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                     <Users className="w-5 h-5" />
                   </div>
                   <div>
                     <span className="text-gray-200 font-medium text-sm block">Active Drivers</span>
                     <span className="text-xs text-gray-500">Assigned & on-trip</span>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="text-white font-bold text-xl">{stats?.activeDrivers || 0}</span>
                   <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
                 </div>
               </div>

               <div 
                 onClick={() => navigate('/admin/maintenance')}
                 className="bg-[#21232e] hover:bg-[#282b38] p-4 rounded-xl flex items-center justify-between border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer group"
               >
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
                     <AlertCircle className="w-5 h-5" />
                   </div>
                   <div>
                     <span className="text-gray-200 font-medium text-sm block">Maintenance Due</span>
                     <span className="text-xs text-gray-500">Service required</span>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="text-orange-400 font-bold text-xl">{stats?.maintenanceDue || 0}</span>
                   <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-orange-400 transition-colors" />
                 </div>
               </div>
             </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Quick Action Hub Modal */}
      <AnimatePresence>
        {showQuickModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b23] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Quick Action Hub</h3>
                </div>
                <button 
                  onClick={() => setShowQuickModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'Schedule a New Trip', desc: 'Deploy a vehicle on a timetable', icon: CalendarCheck, color: 'purple', path: '/admin/trips' },
                  { title: 'Register Fleet Vehicle', desc: 'Add new coach or bus', icon: Car, color: 'emerald', path: '/admin/vehicles' },
                  { title: 'Enroll New Driver', desc: 'Add qualified captain credentials', icon: Users, color: 'blue', path: '/admin/drivers' },
                  { title: 'Create Travel Route', desc: 'Define origin, destination and distance', icon: RouteIcon, color: 'amber', path: '/admin/routes' },
                  { title: 'Record Fleet Maintenance', desc: 'Log servicing, inspection or repairs', icon: Wrench, color: 'rose', path: '/admin/maintenance' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={i}
                      onClick={() => { setShowQuickModal(false); navigate(item.path); }}
                      className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-xl bg-${item.color}-500/10 text-${item.color}-400 flex items-center justify-center border border-${item.color}-500/20`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
