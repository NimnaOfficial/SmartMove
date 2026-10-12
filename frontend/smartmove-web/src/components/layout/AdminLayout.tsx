import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useOutlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Car, Users, Map, CalendarCheck, 
  CreditCard, Wrench, MessageSquare, FileText, Database,
  Hexagon, LogOut
} from 'lucide-react';
import authService from '@/services/authService';

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
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const firstName = currentUser?.firstName || currentUser?.FIRST_NAME || '';
  const lastName = currentUser?.lastName || currentUser?.LAST_NAME || '';
  const fullName = (firstName || lastName) 
    ? `${firstName} ${lastName}`.trim() 
    : (currentUser?.name || currentUser?.email?.split('@')[0] || 'Administrator');
  const userId = currentUser?.userId || currentUser?.id || '1';
  const initials = (firstName ? firstName[0] : (currentUser?.email ? currentUser.email[0] : 'A')).toUpperCase() +
    (lastName ? lastName[0]?.toUpperCase() : '');

  return (
    <div className="min-h-screen w-full bg-[#0a0b10] text-gray-300 font-sans selection:bg-purple-500/30 selection:text-white flex flex-col overflow-hidden relative">
      
      {/* Background glow effects for the ethereal look */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* =========================================
          TOP NAVIGATION HEADER (Right-Aligned Nav & User Badge)
          ========================================= */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="h-24 flex-shrink-0 px-6 lg:px-8 flex items-center justify-between relative z-20 border-b border-white/5 bg-[#0a0b10]/60 backdrop-blur-md"
      >
        {/* Left: Brand Logo & Title */}
        <Link to="/admin/dashboard" className="flex items-center gap-3.5 group flex-shrink-0">
          <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform">
            <Hexagon className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div>
            <span className="text-white text-xl font-bold tracking-tight block leading-tight">SmartMove</span>
            <span className="text-[11px] font-semibold text-purple-400 tracking-wider uppercase block">Admin Portal</span>
          </div>
        </Link>

        {/* Right Area: Navigation Links, Authenticated User Profile & Logout */}
        <div className="flex items-center gap-4 lg:gap-6 overflow-x-auto no-scrollbar py-2">
          
          {/* Right-Side Pill Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#1a1b23]/90 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-[0_0_25px_rgba(0,0,0,0.4)]">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 z-10 ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="topNavPill"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/40 to-blue-600/40 border border-purple-500/30 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {isActive && <motion.div layoutId="topNavDot" className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Real Authenticated User Profile Badge (Right Side) */}
          <div 
            onClick={() => navigate('/admin/profile')}
            className="flex items-center gap-3 cursor-pointer group bg-[#1a1b23]/80 hover:bg-[#1a1b23] border border-white/10 hover:border-purple-500/40 px-3.5 py-1.5 rounded-2xl transition-all shadow-md flex-shrink-0"
            title="View Admin Profile & Settings"
          >
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
                {fullName}
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                  ID: #{userId}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md border border-white/20 group-hover:scale-105 transition-transform">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0a0b10]" title="Online" />
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm cursor-pointer flex-shrink-0"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Main Dashboard Canvas */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 pt-4 relative z-10 custom-scrollbar">
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
