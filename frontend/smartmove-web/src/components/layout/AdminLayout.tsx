import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useOutlet } from 'react-router-dom';
import { 
  LayoutDashboard, Car, Users, Map, CalendarCheck, 
  CreditCard, Wrench, MessageSquare, FileText, Bell, Database,
  Search, Hexagon
} from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Vehicles', icon: Car, path: '/admin/vehicles' },
  { name: 'Drivers', icon: Users, path: '/admin/drivers' },
  { name: 'Routes', icon: Map, path: '/admin/routes' },
  { name: 'Trips', icon: CalendarCheck, path: '/admin/trips' },
  { name: 'Bookings', icon: CreditCard, path: '/admin/bookings' },
  { name: 'Maintenance', icon: Wrench, path: '/admin/maintenance' },
  { name: 'Feedback', icon: MessageSquare, path: '/admin/feedback' },
  { name: 'Content', icon: Database, path: '/admin/content' },
  { name: 'Reports', icon: FileText, path: '/admin/reports' },
];

export default function AdminLayout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="min-h-screen w-full bg-[#0a0b10] text-gray-300 font-sans selection:bg-purple-500/30 selection:text-white flex flex-col overflow-hidden relative">
      
      {/* Background glow effects for the ethereal look */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* =========================================
          TOP CENTERED NAVIGATION HEADER (Ethereal Style)
          ========================================= */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="h-24 flex-shrink-0 px-8 flex items-center justify-between relative z-20"
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Hexagon className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div className="hidden sm:block">
            <span className="text-white text-xl font-bold tracking-wide block leading-none">ethereal</span>
          </div>
        </div>

        {/* Center: Pill Navigation */}
        <div className="hidden xl:flex items-center gap-1 bg-[#1a1b23]/80 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-[0_0_30px_rgba(0,0,0,0.5)] absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
             const isActive = location.pathname.startsWith(link.path);
             return (
               <Link 
                 key={link.name} 
                 to={link.path}
                 className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 z-10 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
               >
                 {isActive && (
                   <motion.div 
                     layoutId="topNavPill"
                     className="absolute inset-0 bg-white/10 border border-white/20 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] -z-10"
                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   />
                 )}
                 {isActive && <motion.div layoutId="topNavDot" className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />}
                 <span>{link.name}</span>
               </Link>
             );
          })}
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-4">
           <button className="w-10 h-10 rounded-full bg-[#1a1b23]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all relative">
             <Search className="w-4 h-4" />
           </button>
           <button className="w-10 h-10 rounded-full bg-[#1a1b23]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all relative">
             <Bell className="w-4 h-4" />
             <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
           </button>
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px] cursor-pointer hover:scale-105 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.4)]">
             <img 
               src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" 
               alt="Admin" 
               className="w-full h-full rounded-full border-2 border-[#0a0b10] object-cover"
             />
           </div>
        </div>
      </motion.div>

      {/* Main Dashboard Canvas */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 pt-4 relative z-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full max-w-[1600px] mx-auto"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
