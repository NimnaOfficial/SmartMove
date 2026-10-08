import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Wrench, PieChart, ArrowRight } from 'lucide-react';


const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AdminReports() {
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
      id: 'passengers',
      title: 'Passenger Travel History',
      description: 'Comprehensive logs of user travel patterns and booking frequencies.',
      icon: <Users className="w-6 h-6 text-blue-400" />,
      color: 'blue'
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
            
            <button className={`mt-6 flex items-center gap-2 text-sm font-semibold text-${report.color}-400 group-hover:text-${report.color}-300 transition-colors`}>
              Open Report
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
