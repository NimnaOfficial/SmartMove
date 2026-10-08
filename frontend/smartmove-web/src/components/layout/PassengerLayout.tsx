import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useOutlet } from 'react-router-dom';
import { 
  Home, Navigation, Bookmark, Bell, Settings, 
  Search, MapPin, LogOut
} from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', icon: Home, path: '/passenger/dashboard' },
  { name: 'Search Trips', icon: Navigation, path: '/passenger/trips' },
  { name: 'My Bookings', icon: Bookmark, path: '/passenger/bookings' },
  { name: 'Announcements', icon: Bell, path: '/passenger/announcements' },
  { name: 'Profile & Settings', icon: Settings, path: '/passenger/profile' },
];

export default function PassengerLayout() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="min-h-screen w-full bg-[#1e3f7a] font-sans selection:bg-blue-400 selection:text-white flex overflow-hidden">
      {/* =========================================
          LEFT SIDEBAR (Fixed, Deep Navy)
          ========================================= */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-[80px] lg:w-[260px] h-screen flex flex-col z-20 flex-shrink-0"
      >
        <div className="h-28 flex items-center justify-center lg:justify-start lg:px-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-2xl font-semibold tracking-tight hidden lg:block">SmartMove</span>
          </Link>
        </div>

        <nav className="flex-1 flex flex-col gap-2 pl-2 lg:pl-6 mt-6 relative">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link 
                key={link.name} 
                to={link.path}
                className={`relative flex items-center justify-center lg:justify-start gap-4 p-4 lg:pl-6 cursor-pointer group rounded-l-full transition-all duration-300 ${isActive ? '' : 'hover:bg-white/5'}`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-[#f4f7fb] rounded-l-full w-full z-0" 
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {/* Top curve */}
                    <div className="absolute -top-6 right-0 w-6 h-6 hidden lg:block">
                      <div className="absolute inset-0 bg-[#f4f7fb]" />
                      <div className="absolute inset-0 bg-[#1e3f7a] rounded-br-3xl" />
                    </div>
                    {/* Bottom curve */}
                    <div className="absolute -bottom-6 right-0 w-6 h-6 hidden lg:block">
                      <div className="absolute inset-0 bg-[#f4f7fb]" />
                      <div className="absolute inset-0 bg-[#1e3f7a] rounded-tr-3xl" />
                    </div>
                  </motion.div>
                )}

                <link.icon className={`w-5 h-5 z-10 transition-colors duration-300 ${isActive ? 'text-[#1e3f7a]' : 'text-blue-200 group-hover:text-white'}`} />
                <span className={`font-medium hidden lg:block z-10 transition-colors duration-300 ${isActive ? 'text-[#1e3f7a]' : 'text-blue-200 group-hover:text-white'}`}>
                  {link.name}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Option Left Down Corner */}
        <div className="p-4 lg:p-6 mt-auto">
          <Link 
            to="/login"
            className="flex items-center justify-center lg:justify-start gap-4 p-4 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors group"
          >
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
            <span className="font-medium hidden lg:block text-red-400 group-hover:text-red-300 transition-colors">Logout</span>
          </Link>
        </div>
      </motion.div>

      {/* =========================================
          MAIN CONTENT AREA (Scrollable Window)
          ========================================= */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-28 flex-shrink-0 px-6 lg:px-10 flex items-center justify-between"
        >
          {/* Dynamic Search Bar */}
          <motion.div 
            initial={{ width: '40%' }}
            animate={{ width: isSearchFocused ? '60%' : '40%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`hidden md:flex items-center px-6 py-3.5 rounded-full border transition-colors duration-300 shadow-inner max-w-2xl ${isSearchFocused ? 'bg-white/20 border-blue-400/50 shadow-blue-900/50' : 'bg-white/10 border-white/5 shadow-black/10'}`}
          >
            <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? 'text-blue-200' : 'text-white/50'}`} />
            <input 
              placeholder="Search Trips, Bookings and Announcements..." 
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="bg-transparent border-none text-sm text-white ml-3 flex-1 outline-none placeholder:text-white/40" 
            />
          </motion.div>

          {/* Profile Section */}
          <div className="flex items-center gap-4 ml-auto">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#1e3f7a]" />
            </button>
            <div className="hidden lg:block text-right ml-2">
              <p className="text-sm font-medium text-white tracking-wide">Dipak Palve</p>
              <p className="text-xs text-blue-200">Premium Passenger</p>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
              alt="Passenger" 
              className="w-11 h-11 rounded-full border-2 border-white/20 object-cover shadow-lg hover:border-white transition-colors cursor-pointer"
            />
          </div>
        </motion.div>

        {/* White Dashboard Canvas */}
        <div className="flex-1 bg-[#f4f7fb] lg:rounded-tl-[2.5rem] shadow-[-10px_0_30px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden relative">
          <div className="h-full overflow-y-auto overflow-x-hidden p-6 lg:p-10 no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
