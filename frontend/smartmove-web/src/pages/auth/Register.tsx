import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, MapPin, Home, Navigation, Bell, Info } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  const [navOpen, setNavOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Trips', href: '/passenger/trips', icon: Navigation },
    { name: 'Updates', href: '/passenger/announcements', icon: Bell },
    { name: 'About', href: '/about', icon: Info },
  ];

  return (
    <div 
      className="min-h-screen w-full font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #ffffff 45%, #4f8cf6 45%)' }}
    >
      {/* PORTABLE POPUP NAV MENU */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-[60]">
        <button 
          onClick={() => setNavOpen(true)}
          className="w-14 h-14 bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl flex items-center justify-center text-[#1e3f7a] bg-white hover:bg-white/80 transition-all hover:scale-105"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {navOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setNavOpen(false)}
              className="fixed inset-0 z-[100] bg-[#1e3f7a]/20 backdrop-blur-sm cursor-pointer"
            />
            <motion.div 
              initial={{ x: '-100%', opacity: 0, rotateY: 45 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              exit={{ x: '-100%', opacity: 0, rotateY: 45 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-screen w-full sm:w-[360px] bg-white z-[110] shadow-[30px_0_60px_rgba(0,0,0,0.2)] p-10 flex flex-col origin-left"
            >
              <div className="flex items-center justify-between mb-16">
                <Link to="/" className="flex items-center gap-3 group">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <MapPin className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">SmartMove</span>
                </Link>
                <button onClick={() => setNavOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1, type: 'spring' }}
                  >
                    <Link to={link.href} className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-blue-50 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-all">
                        <link.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-lg text-gray-600 group-hover:text-blue-600 transition-colors">{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-auto">
                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-50 to-blue-100/50 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <p className="text-xs text-blue-600 font-bold tracking-widest uppercase mb-2 relative z-10">Need Help?</p>
                  <p className="text-sm text-gray-600 mb-6 relative z-10">Contact our 24/7 travel concierge for assistance.</p>
                  <button className="w-full py-3.5 bg-blue-600 shadow-lg shadow-blue-600/20 text-white rounded-2xl text-sm font-medium hover:bg-blue-700 hover:-translate-y-0.5 transition-all relative z-10">
                    Contact Support
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 lg:p-12">
        
        {/* Main Wrapper for the overlapping cards */}
        <div className="relative w-full max-w-6xl flex items-center justify-start h-[650px]">
          
          {/* LEFT: Image Background Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-[75%] h-full rounded-[2rem] overflow-hidden relative shadow-2xl bg-gray-900"
          >
            <img 
              src="https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=2072&auto=format&fit=crop" 
              alt="Scenic"
              className="w-full h-full object-cover opacity-80 mix-blend-overlay"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-blue-900/20" />
            
            {/* Typography */}
            <div className="absolute inset-0 p-10 md:p-16 lg:p-24 flex flex-col justify-center">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-7xl md:text-8xl lg:text-[130px] font-semibold text-white leading-[0.85] tracking-tight drop-shadow-lg font-sans"
              >
                SIGN<br/>UP
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12"
              >
                <Link to="/login" className="text-white font-medium tracking-[0.2em] text-sm hover:text-blue-200 transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-white hover:after:bg-blue-200">
                  SIGN IN
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT: Overlapping Form Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="absolute right-0 lg:right-8 w-full max-w-[460px] bg-[#1e3f7a] rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] p-8 md:p-10 z-20 top-1/2 -translate-y-1/2"
          >
            {/* Close Button Top Right */}
            <Link to="/" className="absolute top-6 right-6 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors shadow-md">
              <X className="w-4 h-4" />
            </Link>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              
              <div className="space-y-1">
                <label className="text-[11px] font-semibold tracking-widest text-blue-100 uppercase">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Your full name goes here"
                  className="w-full bg-transparent border-b border-blue-400/30 py-2 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-300 transition-colors text-sm"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold tracking-widest text-blue-100 uppercase">E-Mail</label>
                <input 
                  type="email" 
                  required
                  placeholder="Your e-mail goes here"
                  className="w-full bg-transparent border-b border-blue-400/30 py-2 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-300 transition-colors text-sm"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold tracking-widest text-blue-100 uppercase">Phone</label>
                <input 
                  type="tel" 
                  required
                  placeholder="Your phone number"
                  className="w-full bg-transparent border-b border-blue-400/30 py-2 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-300 transition-colors text-sm"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold tracking-widest text-blue-100 uppercase">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="*********"
                  className="w-full bg-transparent border-b border-blue-400/30 py-2 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-300 transition-colors text-sm tracking-widest"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[11px] font-semibold tracking-widest text-blue-100 uppercase">Confirm Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="*********"
                  className="w-full bg-transparent border-b border-blue-400/30 py-2 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-300 transition-colors text-sm tracking-widest"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input 
                  type="checkbox" 
                  required
                  className="mt-1 w-3.5 h-3.5 rounded-sm border-white bg-transparent checked:bg-white cursor-pointer"
                />
                <label className="text-xs text-blue-100/90 font-light">
                  I agree all statements in <a href="#" className="font-medium text-white hover:underline underline-offset-2">terms of service</a>
                </label>
              </div>

              <div className="flex items-center gap-6 pt-6">
                <button 
                  type="submit"
                  className="bg-white text-[#1e3f7a] font-bold px-8 py-3 rounded-full text-sm hover:bg-gray-50 transition-colors shadow-lg"
                >
                  SIGN UP
                </button>
                <Link to="/login" className="text-xs text-blue-200 hover:text-white underline decoration-blue-300/50 underline-offset-4 transition-colors">
                  I'm already member
                </Link>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
