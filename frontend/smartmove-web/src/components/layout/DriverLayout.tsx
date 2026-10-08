import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useOutlet, useNavigate } from 'react-router-dom';
import { 
  Home, Map, User, Bell, LogOut, Hexagon
} from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', icon: Home, path: '/driver/dashboard' },
  { name: 'My Trips', icon: Map, path: '/driver/trips' },
  { name: 'Notifications', icon: Bell, path: '/driver/notifications' },
  { name: 'Profile', icon: User, path: '/driver/profile' },
];

export default function DriverLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f9fafc] text-gray-900 font-sans selection:bg-black selection:text-white flex overflow-hidden">
      
      {/* Sidebar - Dark Rounded Pill */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-24 bg-[#0a0a0b] m-4 md:m-6 rounded-[2.5rem] flex flex-col items-center py-10 shadow-2xl relative z-20 flex-shrink-0 justify-between hidden md:flex"
      >
        <div className="flex flex-col items-center gap-10 w-full">
          {/* Logo */}
          <Link to="/" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <Hexagon className="w-6 h-6 text-black fill-black" />
          </Link>

          {/* Nav Links */}
          <div className="flex flex-col gap-6 w-full items-center mt-4">
            {navLinks.map((link) => {
               const isActive = location.pathname.startsWith(link.path);
               return (
                 <Link 
                   key={link.name} 
                   to={link.path}
                   className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group ${isActive ? 'text-black bg-white' : 'text-gray-400 hover:text-white'}`}
                   title={link.name}
                 >
                   <link.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'group-hover:scale-110 transition-transform'}`} />
                 </Link>
               );
            })}
          </div>
        </div>

        <button 
          onClick={() => navigate('/login')}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Main Canvas */}
      <div className="flex-1 h-screen overflow-y-auto custom-scrollbar p-6 md:p-8 md:pl-2 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full max-w-[1400px] mx-auto bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 overflow-hidden relative border border-gray-100 flex flex-col"
          >
            {/* Mobile Header (Shows only on small screens) */}
            <div className="md:hidden flex items-center justify-between mb-8 pb-4 border-b border-gray-100 flex-shrink-0">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                   <Hexagon className="w-5 h-5 text-white fill-white" />
                 </div>
                 <span className="font-bold text-xl">Driver</span>
               </div>
               <div className="flex gap-4">
                 <Link to="/driver/notifications" className="text-gray-400 hover:text-black">
                   <Bell className="w-6 h-6" />
                 </Link>
                 <Link to="/driver/profile" className="text-gray-400 hover:text-black">
                   <User className="w-6 h-6" />
                 </Link>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20 md:pb-0">
              {outlet}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-4 z-50">
         {navLinks.map((link) => {
           const isActive = location.pathname.startsWith(link.path);
           return (
             <Link key={link.name} to={link.path} className={`flex flex-col items-center gap-1 ${isActive ? 'text-black' : 'text-gray-400'}`}>
               <link.icon className={`w-6 h-6 ${isActive ? 'fill-black/10' : ''}`} />
             </Link>
           );
         })}
      </div>

    </div>
  );
}
