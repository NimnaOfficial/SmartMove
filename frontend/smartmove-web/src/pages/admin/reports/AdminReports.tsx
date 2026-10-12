import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Wrench, PieChart, ArrowRight, X } from 'lucide-react';
import reportService from '@/services/reportService';
import { RouteUsageReport, RevenueReport, MaintenanceDueReport, TripPerformanceReport } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AdminReports() {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  
  // States for report data
  const [routeUsage, setRouteUsage] = useState<RouteUsageReport[]>([]);
  const [revenue, setRevenue] = useState<RevenueReport | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceDueReport[]>([]);
  const [tripPerformance, setTripPerformance] = useState<TripPerformanceReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Date params for revenue
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const loadReport = async (id: string) => {
    setActiveReport(id);
    setIsLoading(true);
    try {
      if (id === 'routes') {
        const data = await reportService.getRouteUsage();
        setRouteUsage(data);
      } else if (id === 'revenue') {
        const data = await reportService.getRevenue(startDate, endDate);
        setRevenue(data);
      } else if (id === 'maintenance') {
        const data = await reportService.getMaintenanceDue();
        setMaintenance(data);
      } else if (id === 'occupancy') {
        const data = await reportService.getTripPerformance();
        setTripPerformance(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevenueFilter = async () => {
    setIsLoading(true);
    try {
      const data = await reportService.getRevenue(startDate, endDate);
      setRevenue(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const reports = [
    {
      id: 'routes',
      title: 'Most Frequently Used Routes',
      description: 'Analyze popularity and usage statistics across all defined travel routes.',
      icon: <TrendingUp className="w-6 h-6 text-indigo-400" />,
      color: 'indigo'
    },
    {
      id: 'revenue',
      title: 'Revenue Within Period',
      description: 'Track financial performance, bookings revenue, and transactional data over time.',
      icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
      color: 'emerald'
    },
    {
      id: 'maintenance',
      title: 'Vehicles Due for Maintenance',
      description: 'Identify fleet vehicles requiring immediate or upcoming scheduled servicing.',
      icon: <Wrench className="w-6 h-6 text-amber-400" />,
      color: 'amber'
    },
    {
      id: 'occupancy',
      title: 'Trip Occupancy & Performance',
      description: 'Evaluate seat utilization rates and overall efficiency per individual trip.',
      icon: <PieChart className="w-6 h-6 text-purple-400" />,
      color: 'purple'
    }
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-3xl font-bold text-white tracking-tight">Reports & Analytics</h1>
        <p className="text-gray-400 mt-2 font-medium">Access detailed insights and operational metrics.</p>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <motion.div key={report.id} variants={fadeUp} className="bg-[#1a1b23] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all flex flex-col h-full group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${report.color}-500/5 rounded-full blur-3xl group-hover:bg-${report.color}-500/10 transition-all`}></div>
            
            <div className={`w-12 h-12 rounded-xl bg-${report.color}-500/10 flex items-center justify-center border border-${report.color}-500/20 mb-5`}>
              {report.icon}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{report.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed flex-1">
              {report.description}
            </p>
            
            <button onClick={() => loadReport(report.id)} className={`mt-6 flex items-center gap-2 text-sm font-semibold text-${report.color}-400 group-hover:text-${report.color}-300 transition-colors`}>
              Open Report
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Report Modal */}
      <AnimatePresence>
        {activeReport && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b23] border border-white/10 rounded-2xl p-6 w-full max-w-4xl shadow-2xl relative my-8"
            >
              <button 
                onClick={() => setActiveReport(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-6">
                {reports.find(r => r.id === activeReport)?.title}
              </h2>

              {isLoading ? (
                <div className="py-20 text-center text-gray-400">Loading report data...</div>
              ) : (
                <div className="overflow-x-auto">
                  {/* Routes Report */}
                  {activeReport === 'routes' && (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-sm">
                          <th className="pb-3">Rank</th>
                          <th className="pb-3">Route ID</th>
                          <th className="pb-3">Origin</th>
                          <th className="pb-3">Destination</th>
                          <th className="pb-3 text-right">Total Bookings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {routeUsage.map((r, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="py-4 font-bold text-white">#{r.rank}</td>
                            <td className="py-4 text-gray-300">{r.routeId}</td>
                            <td className="py-4 text-gray-300">{r.origin}</td>
                            <td className="py-4 text-gray-300">{r.destination}</td>
                            <td className="py-4 text-right text-indigo-400 font-bold">{r.bookingCount}</td>
                          </tr>
                        ))}
                        {routeUsage.length === 0 && <tr><td colSpan={5} className="py-4 text-center text-gray-500">No data available</td></tr>}
                      </tbody>
                    </table>
                  )}

                  {/* Revenue Report */}
                  {activeReport === 'revenue' && (
                    <div>
                      <div className="flex gap-4 mb-6">
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2 text-white outline-none [color-scheme:dark]" />
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-[#0a0b10] border border-white/10 rounded-xl px-4 py-2 text-white outline-none [color-scheme:dark]" />
                        <button onClick={handleRevenueFilter} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl font-bold">Filter</button>
                      </div>
                      
                      {revenue && (
                        <div className="grid grid-cols-3 gap-4 mb-8">
                          <div className="bg-[#0a0b10] p-4 rounded-xl border border-white/5">
                            <div className="text-gray-500 text-sm mb-1">Total Revenue</div>
                            <div className="text-2xl font-bold text-emerald-400">${(revenue.totalRevenue ?? 0).toFixed(2)}</div>
                          </div>
                          <div className="bg-[#0a0b10] p-4 rounded-xl border border-white/5">
                            <div className="text-gray-500 text-sm mb-1">Tickets Sold</div>
                            <div className="text-2xl font-bold text-white">{revenue.ticketsSold ?? 0}</div>
                          </div>
                          <div className="bg-[#0a0b10] p-4 rounded-xl border border-white/5">
                            <div className="text-gray-500 text-sm mb-1">Avg Ticket Value</div>
                            <div className="text-2xl font-bold text-white">${(revenue.averageTicketValue ?? 0).toFixed(2)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Maintenance Report */}
                  {activeReport === 'maintenance' && (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-sm">
                          <th className="pb-3">Vehicle</th>
                          <th className="pb-3">Last Maint.</th>
                          <th className="pb-3">Next Maint.</th>
                          <th className="pb-3">Days Overdue</th>
                          <th className="pb-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {maintenance.map((m, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="py-4 font-bold text-white">{m.vehicleRegistration || `ID: ${m.vehicleId}`}</td>
                            <td className="py-4 text-gray-300">{m.lastMaintenance?.split('T')[0] || 'N/A'}</td>
                            <td className="py-4 text-gray-300">{m.nextMaintenance?.split('T')[0] || 'N/A'}</td>
                            <td className="py-4 text-gray-300">{m.daysOverdue || 0}</td>
                            <td className="py-4 text-right">
                              <span className={`px-2 py-1 rounded-md text-xs font-bold ${m.status === 'OVERDUE' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                {m.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {maintenance.length === 0 && <tr><td colSpan={5} className="py-4 text-center text-gray-500">No vehicles due for maintenance</td></tr>}
                      </tbody>
                    </table>
                  )}

                  {/* Occupancy Report */}
                  {activeReport === 'occupancy' && (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-sm">
                          <th className="pb-3">Trip ID</th>
                          <th className="pb-3">Route</th>
                          <th className="pb-3">Vehicle</th>
                          <th className="pb-3 text-center">Occupancy</th>
                          <th className="pb-3 text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tripPerformance.map((t, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="py-4 font-bold text-white">#{t.tripId}</td>
                            <td className="py-4 text-gray-300">{t.route}</td>
                            <td className="py-4 text-gray-300">{t.vehicle}</td>
                            <td className="py-4 text-center">
                              <div className="flex flex-col items-center">
                                <span className="font-bold text-purple-400">{(t.occupancyPercent ?? 0).toFixed(1)}%</span>
                                <span className="text-xs text-gray-500">{t.bookedSeats ?? 0} / {t.capacity ?? 0} seats</span>
                              </div>
                            </td>
                            <td className="py-4 text-right font-bold text-emerald-400">${(t.revenue ?? 0).toFixed(2)}</td>
                          </tr>
                        ))}
                        {tripPerformance.length === 0 && <tr><td colSpan={5} className="py-4 text-center text-gray-500">No data available</td></tr>}
                      </tbody>
                    </table>
                  )}

                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
