import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Wrench, PieChart, ArrowRight, X, Download, FileSpreadsheet, Calendar, Filter } from 'lucide-react';
import reportService from '@/services/reportService';
import { RouteUsageReport, RevenueReport, MaintenanceDueReport, TripPerformanceReport, PassengerAnalyticsReport } from '@/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [passengerAnalytics, setPassengerAnalytics] = useState<PassengerAnalyticsReport[]>([]);
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
      } else if (id === 'customers') {
        const data = await reportService.getPassengerAnalytics();
        setPassengerAnalytics(data);
      } else if (id === 'maintenance') {
        const data = await reportService.getMaintenanceDue();
        setMaintenance(data);
      } else if (id === 'occupancy') {
        const data = await reportService.getTripPerformance();
        setTripPerformance(data);
      }
    } catch (e) {
      console.error('Failed to load report data', e);
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

  const exportReportToPdf = async (reportId: string) => {
    let currentRouteUsage = routeUsage;
    let currentRevenue = revenue;
    let currentPassengerAnalytics = passengerAnalytics;
    let currentMaintenance = maintenance;
    let currentTripPerformance = tripPerformance;

    // Ensure data is loaded prior to export
    if (reportId === 'routes' && currentRouteUsage.length === 0) {
      currentRouteUsage = await reportService.getRouteUsage();
      setRouteUsage(currentRouteUsage);
    } else if (reportId === 'revenue' && !currentRevenue) {
      currentRevenue = await reportService.getRevenue(startDate, endDate);
      setRevenue(currentRevenue);
    } else if (reportId === 'customers' && currentPassengerAnalytics.length === 0) {
      currentPassengerAnalytics = await reportService.getPassengerAnalytics();
      setPassengerAnalytics(currentPassengerAnalytics);
    } else if (reportId === 'maintenance' && currentMaintenance.length === 0) {
      currentMaintenance = await reportService.getMaintenanceDue();
      setMaintenance(currentMaintenance);
    } else if (reportId === 'occupancy' && currentTripPerformance.length === 0) {
      currentTripPerformance = await reportService.getTripPerformance();
      setTripPerformance(currentTripPerformance);
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const nowStr = new Date().toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    // Executive Navy Header Banner
    doc.setFillColor(30, 63, 122);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SMARTMOVE ENTERPRISE TRANSIT SOLUTIONS', 14, 14);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Hybrid Oracle + MongoDB Architecture | Executive Business Intelligence', 14, 21);
    doc.text(`Report Generated: ${nowStr}`, 14, 27);

    let title = '';
    let subtitle = '';
    let head: string[][] = [];
    let body: (string | number)[][] = [];

    if (reportId === 'routes') {
      title = 'EXECUTIVE BUSINESS REPORT: MOST FREQUENTLY USED ROUTES';
      subtitle = 'Ranked by passenger booking frequency (RANK() OVER window function). Informs route scheduling, bus assignment, and infrastructure investments.';
      head = [['Rank', 'Route ID', 'Origin', 'Destination', 'Total Bookings']];
      body = currentRouteUsage.map(r => [`#${r.rank}`, `R-${r.routeId}`, r.origin, r.destination, `${r.bookingCount}`]);
    } else if (reportId === 'revenue') {
      title = 'EXECUTIVE BUSINESS REPORT: REVENUE & FINANCIAL PERFORMANCE';
      subtitle = `Aggregated revenue metrics from Oracle payment ledgers for ${startDate} to ${endDate}. Used for financial auditing and performance monitoring.`;
      head = [['Financial Metric', 'Value', 'Operational Notes']];
      body = [
        ['Total Gross Revenue', `$${(currentRevenue?.totalRevenue ?? 0).toFixed(2)}`, 'Successful payments recorded in Oracle ledger'],
        ['Tickets / Bookings Sold', `${currentRevenue?.ticketsSold ?? 0}`, 'Confirmed completed passenger transactions'],
        ['Average Ticket Value', `$${(currentRevenue?.averageTicketValue ?? 0).toFixed(2)}`, 'Mean passenger spend per verified ticket'],
        ['Audit Period Range', `${startDate} to ${endDate}`, 'Configured date window filter']
      ];
    } else if (reportId === 'customers') {
      title = 'EXECUTIVE BUSINESS REPORT: PASSENGER TRAVEL & CUSTOMER ANALYTICS';
      subtitle = 'Comprehensive passenger activity, booking frequency, and lifetime revenue analytics for customer retention and fleet expansion.';
      head = [['Passenger ID', 'Passenger Name', 'Email', 'Phone', 'Total Trips', 'Lifetime Spent', 'Last Active']];
      body = currentPassengerAnalytics.map(p => [
        `P-${p.passengerId}`, p.passengerName, p.email, p.phone, `${p.totalTrips}`, `$${p.lifetimeSpent.toFixed(2)}`, p.lastActiveDate
      ]);
    } else if (reportId === 'maintenance') {
      title = 'EXECUTIVE BUSINESS REPORT: VEHICLES DUE FOR MAINTENANCE';
      subtitle = 'Dynamic 6-month servicing rule compliance. Identifies vehicles requiring immediate maintenance or preventative safety inspections.';
      head = [['Vehicle ID', 'Registration No.', 'Last Servicing', 'Due Date', 'Days Overdue', 'Status']];
      body = currentMaintenance.map(m => [
        `V-${m.vehicleId}`, m.vehicleRegistration, m.lastMaintenance, m.nextMaintenance, `${m.daysOverdue ?? 0}`, m.status
      ]);
    } else if (reportId === 'occupancy') {
      title = 'EXECUTIVE BUSINESS REPORT: TRIP OCCUPANCY & CAPACITY PERFORMANCE';
      subtitle = 'Fleet seat utilization percentages and trip revenue generation. Informs bus sizing, pricing adjustments, and route viability.';
      head = [['Trip ID', 'Route', 'Vehicle', 'Capacity', 'Booked', 'Occupancy %', 'Revenue ($)']];
      body = currentTripPerformance.map(t => [
        `T-${t.tripId}`, t.route, t.vehicle, `${t.capacity}`, `${t.bookedSeats}`, `${(t.occupancyPercent ?? 0).toFixed(1)}%`, `$${(t.revenue ?? 0).toFixed(2)}`
      ]);
    }

    // Report Title
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 42);

    // Subtitle
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    const splitSub = doc.splitTextToSize(subtitle, 180);
    doc.text(splitSub, 14, 48);

    const startY = 48 + splitSub.length * 5;

    autoTable(doc, {
      startY: startY,
      head: head,
      body: body,
      theme: 'striped',
      headStyles: {
        fillColor: [30, 63, 122],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: [30, 41, 59],
        overflow: 'linebreak',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      didDrawPage: (data) => {
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `SmartMove Transportation Management System | Confidential Executive Report | Page ${data.pageNumber} of ${pageCount}`,
          14,
          290
        );
      }
    });

    doc.save(`SmartMove_${reportId}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const reports = [
    {
      id: 'routes',
      reportNum: 'Report 1',
      title: 'Most Frequently Used Routes',
      description: 'Analyze popularity and usage statistics across all defined travel routes ranked by booking volume.',
      icon: <TrendingUp className="w-6 h-6 text-indigo-400" />,
      color: 'indigo'
    },
    {
      id: 'revenue',
      reportNum: 'Report 2',
      title: 'Revenue Within Period',
      description: 'Track financial performance, bookings revenue, and transactional metrics from the Materialized View.',
      icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
      color: 'emerald'
    },
    {
      id: 'customers',
      reportNum: 'Report 3',
      title: 'Passenger Travel & Customer Analytics',
      description: 'Customer lifetime travel frequency, individual booking trends, and customer spending profiles for business growth.',
      icon: <Users className="w-6 h-6 text-blue-400" />,
      color: 'blue'
    },
    {
      id: 'maintenance',
      reportNum: 'Report 4',
      title: 'Vehicles Due for Maintenance',
      description: 'Identify fleet vehicles requiring immediate or scheduled servicing under the dynamic 6-month rule.',
      icon: <Wrench className="w-6 h-6 text-amber-400" />,
      color: 'amber'
    },
    {
      id: 'occupancy',
      reportNum: 'Report 5',
      title: 'Trip Occupancy & Performance',
      description: 'Evaluate seat utilization rates, booked passenger capacities, and generated revenue per trip.',
      icon: <PieChart className="w-6 h-6 text-purple-400" />,
      color: 'purple'
    }
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Business Reports & Analytics
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider">
              5 Core Business Reports
            </span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Oracle SQL analytics and business intelligence reports with instant PDF export for executive decision making.</p>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <motion.div key={report.id} variants={fadeUp} className="bg-[#1a1b23] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all flex flex-col h-full group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${report.color}-500/5 rounded-full blur-3xl group-hover:bg-${report.color}-500/10 transition-all`}></div>
            
            <div className="flex items-center justify-between mb-5">
              <div className={`w-12 h-12 rounded-xl bg-${report.color}-500/10 flex items-center justify-center border border-${report.color}-500/20`}>
                {report.icon}
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                {report.reportNum}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{report.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed flex-1">
              {report.description}
            </p>
            
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
              <button 
                onClick={() => loadReport(report.id)} 
                className={`flex items-center gap-1.5 text-sm font-semibold text-${report.color}-400 group-hover:text-${report.color}-300 transition-colors cursor-pointer`}
              >
                Open Report
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => exportReportToPdf(report.id)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                title="Export as PDF"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" /> Export PDF
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Report Modal */}
      <AnimatePresence>
        {activeReport && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1b23] border border-white/10 rounded-2xl p-6 w-full max-w-4xl shadow-2xl relative my-8"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    {reports.find(r => r.id === activeReport)?.reportNum} • Oracle Analytics
                  </span>
                  <h2 className="text-2xl font-bold text-white">
                    {reports.find(r => r.id === activeReport)?.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => exportReportToPdf(activeReport)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Export as PDF
                  </button>

                  <button 
                    onClick={() => setActiveReport(null)}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="py-20 text-center text-gray-400">Loading live business report data...</div>
              ) : (
                <div className="overflow-x-auto">
                  {/* Report 1: Routes Report */}
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
                            <td className="py-4 text-gray-300">R-{r.routeId}</td>
                            <td className="py-4 text-gray-300">{r.origin}</td>
                            <td className="py-4 text-gray-300">{r.destination}</td>
                            <td className="py-4 text-right text-indigo-400 font-bold">{r.bookingCount}</td>
                          </tr>
                        ))}
                        {routeUsage.length === 0 && <tr><td colSpan={5} className="py-4 text-center text-gray-500">No data available</td></tr>}
                      </tbody>
                    </table>
                  )}

                  {/* Report 2: Revenue Report */}
                  {activeReport === 'revenue' && (
                    <div>
                      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-xl bg-[#0a0b10] border border-white/5">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-400 font-semibold">From:</span>
                          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none [color-scheme:dark]" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-400 font-semibold">To:</span>
                          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none [color-scheme:dark]" />
                        </div>
                        <button onClick={handleRevenueFilter} className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-xs font-bold transition-all cursor-pointer">
                          <Filter className="w-3 h-3" /> Apply Range
                        </button>
                      </div>
                      
                      {revenue && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-[#0a0b10] p-5 rounded-xl border border-white/5">
                            <div className="text-gray-500 text-xs font-semibold mb-1">TOTAL VERIFIED REVENUE</div>
                            <div className="text-2xl font-extrabold text-emerald-400">${(revenue.totalRevenue ?? 0).toFixed(2)}</div>
                            <div className="text-[10px] text-gray-500 mt-1">Confirmed card transactions</div>
                          </div>
                          <div className="bg-[#0a0b10] p-5 rounded-xl border border-white/5">
                            <div className="text-gray-500 text-xs font-semibold mb-1">TICKETS SOLD</div>
                            <div className="text-2xl font-extrabold text-white">{revenue.ticketsSold ?? 0}</div>
                            <div className="text-[10px] text-gray-500 mt-1">Bookings completed</div>
                          </div>
                          <div className="bg-[#0a0b10] p-5 rounded-xl border border-white/5">
                            <div className="text-gray-500 text-xs font-semibold mb-1">AVERAGE TICKET VALUE</div>
                            <div className="text-2xl font-extrabold text-indigo-400">${(revenue.averageTicketValue ?? 0).toFixed(2)}</div>
                            <div className="text-[10px] text-gray-500 mt-1">Spend per passenger seat</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Report 3: Passenger Travel History & Customer Analytics */}
                  {activeReport === 'customers' && (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-sm">
                          <th className="pb-3">Passenger</th>
                          <th className="pb-3">Email</th>
                          <th className="pb-3">Phone</th>
                          <th className="pb-3 text-center">Total Trips</th>
                          <th className="pb-3 text-right">Lifetime Spent</th>
                          <th className="pb-3 text-right">Last Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        {passengerAnalytics.map((p, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="py-4">
                              <span className="font-bold text-white block">{p.passengerName}</span>
                              <span className="text-[10px] text-gray-500">ID: P-{p.passengerId}</span>
                            </td>
                            <td className="py-4 text-gray-300 text-xs">{p.email}</td>
                            <td className="py-4 text-gray-300 text-xs">{p.phone}</td>
                            <td className="py-4 text-center">
                              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold text-xs border border-blue-500/20">
                                {p.totalTrips} trips
                              </span>
                            </td>
                            <td className="py-4 text-right font-bold text-emerald-400">${p.lifetimeSpent.toFixed(2)}</td>
                            <td className="py-4 text-right text-gray-400 text-xs">{p.lastActiveDate}</td>
                          </tr>
                        ))}
                        {passengerAnalytics.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-gray-500">No passenger records found</td></tr>}
                      </tbody>
                    </table>
                  )}

                  {/* Report 4: Maintenance Report */}
                  {activeReport === 'maintenance' && (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-sm">
                          <th className="pb-3">Vehicle</th>
                          <th className="pb-3">Last Servicing</th>
                          <th className="pb-3">Due Date (6-Mo)</th>
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
                            <td className="py-4 text-gray-300 font-medium">{m.daysOverdue || 0} days</td>
                            <td className="py-4 text-right">
                              <span className={`px-2 py-1 rounded-md text-xs font-bold ${m.status === 'OVERDUE' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                                {m.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {maintenance.length === 0 && <tr><td colSpan={5} className="py-4 text-center text-gray-500">No vehicles due for maintenance</td></tr>}
                      </tbody>
                    </table>
                  )}

                  {/* Report 5: Occupancy Report */}
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
