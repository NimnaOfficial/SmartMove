import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useOutlet, useNavigate } from 'react-router-dom';
import { 
  Home, Navigation, Bookmark, Settings, 
  Search, MapPin, LogOut, History, MessageSquare,
  Bell
} from 'lucide-react';
import authService from '@/services/authService';
import passengerService from '@/services/passengerService';

const navLinks = [
  { name: 'Dashboard', icon: Home, path: '/passenger/dashboard' },
  { name: 'Search Trips', icon: Navigation, path: '/passenger/trips' },
  { name: 'My Bookings', icon: Bookmark, path: '/passenger/bookings' },
  { name: 'Travel History', icon: History, path: '/passenger/travel-history' },
  { name: 'Feedback', icon: MessageSquare, path: '/passenger/feedback' },
  { name: 'Announcements', icon: Bell, path: '/passenger/announcements' },
  { name: 'Profile & Settings', icon: Settings, path: '/passenger/profile' },
];

export default function PassengerLayout() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const outlet = useOutlet();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Load authenticated user from local storage
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    // 2. Fetch fresh profile from backend
    passengerService.getProfile().then(profile => {
      if (profile && (profile.firstName || profile.email)) {
        setCurrentUser((prev: any) => ({ ...prev, ...profile }));
      }
    }).catch(() => {
      // Fallback silently to stored auth state
    });
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Extract dynamic user values
  const firstName = currentUser?.firstName || currentUser?.FIRST_NAME || '';
  const lastName = currentUser?.lastName || currentUser?.LAST_NAME || '';
  const fullName = (firstName || lastName) 
    ? `${firstName} ${lastName}`.trim() 
    : (currentUser?.name || currentUser?.email?.split('@')[0] || 'Passenger');
  const userId = currentUser?.userId || currentUser?.PASSENGER_ID || currentUser?.id || '1';
  const initials = (firstName ? firstName[0] : (currentUser?.email ? currentUser.email[0] : 'P')).toUpperCase() +
    (lastName ? lastName[0]?.toUpperCase() : '');

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/passenger/trips?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#1e3f7a] font-sans selection:bg-blue-400 selection:text-white flex overflow-hidden">
      
      {/* =========================================
          LEFT SIDEBAR (Fixed, Deep Navy)
          The original signature SmartMove design
          ========================================= */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-[80px] lg:w-[260px] h-screen flex flex-col z-20 flex-shrink-0"
      >
        {/* Brand Logo */}
        <div className="h-28 flex items-center justify-center lg:justify-start lg:px-10">
          <Link to="/passenger/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors shadow-sm">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-2xl font-semibold tracking-tight hidden lg:block">SmartMove</span>
          </Link>
        </div>

        {/* Sidebar Navigation Links with Inverted Curved Scoops */}
        <nav className="flex-1 flex flex-col gap-2 pl-2 lg:pl-6 mt-4 relative overflow-y-auto no-scrollbar">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link 
                key={link.name} 
                to={link.path}
                className={`relative flex items-center justify-center lg:justify-start gap-4 p-3.5 lg:pl-6 cursor-pointer group rounded-l-full transition-all duration-300 ${
                  isActive ? '' : 'hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-[#f4f7fb] rounded-l-full w-full z-0 shadow-[-5px_0_15px_rgba(0,0,0,0.08)]" 
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {/* Top scoop curve */}
                    <div className="absolute -top-6 right-0 w-6 h-6 hidden lg:block pointer-events-none">
                      <div className="absolute inset-0 bg-[#f4f7fb]" />
                      <div className="absolute inset-0 bg-[#1e3f7a] rounded-br-3xl" />
                    </div>
                    {/* Bottom scoop curve */}
                    <div className="absolute -bottom-6 right-0 w-6 h-6 hidden lg:block pointer-events-none">
                      <div className="absolute inset-0 bg-[#f4f7fb]" />
                      <div className="absolute inset-0 bg-[#1e3f7a] rounded-tr-3xl" />
                    </div>
                  </motion.div>
                )}

                <link.icon className={`w-5 h-5 z-10 transition-colors duration-300 ${
                  isActive ? 'text-[#1e3f7a]' : 'text-blue-200 group-hover:text-white'
                }`} />
                <span className={`font-medium hidden lg:block z-10 transition-colors duration-300 ${
                  isActive ? 'text-[#1e3f7a] font-semibold' : 'text-blue-200 group-hover:text-white'
                }`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Option Left Bottom Corner */}
        <div className="p-4 lg:p-6 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center lg:justify-start gap-4 p-3 rounded-xl text-red-300 hover:text-white hover:bg-red-500/20 transition-all group w-full text-left"
            title="Log Out"
          >
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-200 transition-colors" />
            <span className="font-medium hidden lg:block text-red-300 group-hover:text-white transition-colors">
              Logout
            </span>
          </button>
        </div>
      </motion.div>

      {/* =========================================
          MAIN CONTENT AREA (Scrollable Window)
          ========================================= */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Top Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-24 flex-shrink-0 px-6 lg:px-10 flex items-center justify-between"
        >
          {/* Dynamic Expandable Search Bar */}
          <motion.div 
            initial={{ width: '40%' }}
            animate={{ width: isSearchFocused ? '60%' : '40%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`hidden md:flex items-center px-6 py-3 rounded-full border transition-colors duration-300 shadow-inner max-w-2xl ${
              isSearchFocused 
                ? 'bg-white/20 border-blue-400/50 shadow-blue-900/50' 
                : 'bg-white/10 border-white/5 shadow-black/10'
            }`}
          >
            <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? 'text-blue-200' : 'text-white/50'}`} />
            <input 
              placeholder="Search Trips, Bookings and Announcements..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="bg-transparent border-none text-sm text-white ml-3 flex-1 outline-none placeholder:text-white/40" 
            />
          </motion.div>

          {/* Profile Section (Real Authenticated User Details, No Dummy Data, No Bell) */}
          <div 
            onClick={() => navigate('/passenger/profile')}
            className="flex items-center gap-3.5 ml-auto cursor-pointer group bg-white/10 hover:bg-white/20 px-4 py-2 rounded-2xl transition-all border border-white/10 shadow-sm"
            title="View Profile & Settings"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-white tracking-wide group-hover:text-blue-200 transition-colors">
                {fullName}
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-[11px] font-semibold text-blue-200 bg-white/10 px-2 py-0.5 rounded-full">
                  ID: #{userId}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-400 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shadow-md border border-white/30 group-hover:scale-105 transition-transform">
                {initials}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#1e3f7a]" title="Active" />
            </div>
          </div>
        </motion.div>

        {/* White Dashboard Canvas with Rounded Top-Left Curve */}
        <div className="flex-1 bg-[#f4f7fb] lg:rounded-tl-[2.5rem] shadow-[-10px_0_30px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden relative">
          <div className="h-full overflow-y-auto overflow-x-hidden p-6 lg:p-10 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full max-w-[1600px] mx-auto"
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
