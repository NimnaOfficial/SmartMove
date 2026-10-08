import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useOutlet, useNavigate } from 'react-router-dom';
import { 
  Home, Navigation, Bookmark, Bell, Settings, 
  Search, MapPin, LogOut, History, MessageSquare, Image as ImageIcon
} from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', icon: Home, path: '/passenger/dashboard' },
  { name: 'Search Trips', icon: Navigation, path: '/passenger/trips' },
  { name: 'My Bookings', icon: Bookmark, path: '/passenger/bookings' },
  { name: 'Travel History', icon: History, path: '/passenger/travel-history' },
  { name: 'Feedback', icon: MessageSquare, path: '/passenger/feedback' },
  { name: 'Announcements', icon: Bell, path: '/passenger/announcements' },
  { name: 'Media', icon: ImageIcon, path: '/passenger/media' },
  { name: 'Profile & Settings', icon: Settings, path: '/passenger/profile' },
];

export default function PassengerLayout() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();
  const outlet = useOutlet();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] font-sans selection:bg-blue-400 selection:text-white flex flex-col overflow-hidden">
      
      {/* =========================================
          TOP CENTERED NAVIGATION HEADER
          ========================================= */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="h-24 flex-shrink-0 px-6 lg:px-10 flex items-center justify-between bg-white shadow-sm border-b border-gray-100 relative z-20"
      >
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-10 h-10 bg-[#1e3f7a] rounded-xl flex items-center justify-center shadow-md group-hover:bg-blue-800 transition-colors">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-900 text-xl font-bold tracking-tight hidden lg:block">SmartMove</span>
        </Link>

        {/* Center: Pill Navigation */}
        <div className="hidden xl:flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full p-1.5 shadow-sm absolute left-1/2 -translate-x-1/2 overflow-hidden overflow-x-auto custom-scrollbar whitespace-nowrap max-w-[60vw]">
          {navLinks.map((link) => {
             const isActive = location.pathname.startsWith(link.path);
             return (
               <Link 
                 key={link.name} 
                 to={link.path}
                 className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 z-10 flex-shrink-0 ${isActive ? 'text-[#1e3f7a]' : 'text-gray-500 hover:text-gray-900 hover:bg-white'}`}
               >
                 {isActive && (
                   <motion.div 
                     layoutId="passengerNavPill"
                     className="absolute inset-0 bg-white border border-gray-200 rounded-full shadow-sm -z-10"
                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   />
                 )}
                 <link.icon className="w-4 h-4" />
                 <span className="hidden lg:block">{link.name}</span>
               </Link>
             );
          })}
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-4 flex-shrink-0">
           {/* Dynamic Search Bar */}
           <motion.div 
             initial={{ width: 40 }}
             animate={{ width: isSearchFocused ? 280 : 40 }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
             className={`hidden md:flex items-center rounded-full border transition-all duration-300 overflow-hidden ${isSearchFocused ? 'bg-white border-blue-200 shadow-inner px-4 py-2.5' : 'bg-gray-50 border-gray-200 hover:border-gray-300 justify-center h-10 w-10 cursor-pointer'}`}
             onClick={() => { if(!isSearchFocused) setIsSearchFocused(true); }}
           >
             <Search className={`w-4 h-4 flex-shrink-0 transition-colors ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'}`} />
             <input 
               placeholder="Search Trips..." 
               onFocus={() => setIsSearchFocused(true)}
               onBlur={() => setIsSearchFocused(false)}
               className={`bg-transparent border-none text-sm text-gray-900 outline-none placeholder:text-gray-400 flex-1 ml-2 ${isSearchFocused ? 'block' : 'hidden'}`} 
             />
           </motion.div>

           <button onClick={() => navigate('/passenger/announcements')} className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1e3f7a] hover:bg-blue-50 transition-all relative">
             <Bell className="w-4 h-4" />
             <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
           </button>
           
           <div className="hidden lg:block text-right ml-2 mr-2">
             <p className="text-sm font-bold text-gray-900 tracking-wide">Dipak Palve</p>
             <p className="text-xs text-blue-600 font-semibold">Premium</p>
           </div>
           
           <div className="relative group cursor-pointer" onClick={() => navigate('/passenger/profile')}>
             <img 
               src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
               alt="Passenger" 
               className="w-10 h-10 rounded-full border border-gray-200 object-cover shadow-sm group-hover:border-[#1e3f7a] transition-colors"
             />
           </div>

           {/* Logout Button */}
           <Link 
             to="/login"
             className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all ml-1"
             title="Logout"
           >
             <LogOut className="w-4 h-4" />
           </Link>
        </div>
      </motion.div>

      {/* =========================================
          MAIN DASHBOARD CANVAS
          ========================================= */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 relative z-10 custom-scrollbar">
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
