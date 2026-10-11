import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, MapPin, Home, Navigation, Bell, Info, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '@/services/authService';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const redirectNotice = (location.state as any)?.message || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(formData);
      localStorage.setItem('smartmove_token', response.token);
      localStorage.setItem('smartmove_user', JSON.stringify(response));
      
      const from = (location.state as any)?.from?.pathname;
      if (response.role === 'ADMIN') {
        navigate(from && from.startsWith('/admin') ? from : '/admin/dashboard');
      } else if (response.role === 'DRIVER') {
        navigate(from && from.startsWith('/driver') ? from : '/driver/dashboard');
      } else {
        navigate(from && from.startsWith('/passenger') ? from : '/passenger/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const [navOpen, setNavOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Trips', href: '/trips', icon: Navigation },
    { name: 'Updates', href: '/announcements', icon: Bell },
    { name: 'About', href: '/about', icon: Info },
  ];

  return (
    <div 
      className="min-h-screen w-full font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden overflow-y-auto"
      style={{ background: 'linear-gradient(135deg, #ffffff 45%, #4f8cf6 45%)' }}
    >
      {/* PORTABLE POPUP NAV MENU */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-[60]">
        <button 
          type="button"
          onClick={() => setNavOpen(true)}
          className="w-14 h-14 bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg rounded-2xl flex items-center justify-center text-[#1e3f7a] bg-white hover:bg-white/90 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {navOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setNavOpen(false)}
              className="fixed inset-0 z-[100] bg-[#1e3f7a]/30 backdrop-blur-sm cursor-pointer"
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
                <button 
                  type="button" 
                  onClick={() => setNavOpen(false)} 
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1, type: 'spring' }}
                  >
                    <Link to={link.href} className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-blue-50 transition-colors cursor-pointer">
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
                  <Link 
                    to="/about"
                    className="block w-full py-3.5 bg-blue-600 shadow-lg shadow-blue-600/20 text-white rounded-2xl text-sm font-medium hover:bg-blue-700 hover:-translate-y-0.5 transition-all relative z-10 text-center cursor-pointer"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 py-16">
        
        {/* Main Wrapper for the overlapping cards */}
        <div className="relative w-full max-w-6xl flex flex-col lg:flex-row items-center justify-start min-h-[580px]">
          
          {/* LEFT: Image Background Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-[75%] h-[320px] lg:h-[580px] rounded-[2.5rem] overflow-hidden relative shadow-2xl bg-gray-900 shrink-0"
          >
            <img 
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" 
              alt="Scenic Transit Journey"
              className="w-full h-full object-cover opacity-80 mix-blend-overlay"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-blue-900/40 to-transparent" />
            
            {/* Typography */}
            <div className="absolute inset-0 p-8 md:p-16 lg:p-20 flex flex-col justify-center">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-[120px] font-semibold text-white leading-[0.85] tracking-tight drop-shadow-xl font-sans"
              >
                SIGN<br/>IN
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 lg:mt-12"
              >
                <Link 
                  to="/register" 
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium tracking-[0.15em] text-xs uppercase px-6 py-3 rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                >
                  <span>New passenger?</span>
                  <span className="font-bold underline decoration-blue-300 underline-offset-4">Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT: Overlapping Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-auto lg:absolute lg:right-6 xl:right-10 max-w-[480px] bg-[#1e3f7a]/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.35)] p-8 sm:p-10 md:p-12 z-30 -mt-16 lg:mt-0 border border-white/10"
          >
            {/* Close Button Top Right */}
            <Link 
              to="/" 
              className="absolute top-6 right-6 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-800 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              title="Return to Home"
            >
              <X className="w-4 h-4" />
            </Link>

            <div className="mb-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
              <p className="text-blue-200/80 text-xs mt-1 font-light">Access your SmartMove travel portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              
              {redirectNotice && !error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-blue-500/20 border border-blue-400/40 rounded-2xl text-xs text-blue-100 font-medium flex items-center gap-2"
                >
                  <Info className="w-4 h-4 text-blue-300 shrink-0" />
                  <span>{redirectNotice}</span>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-red-500/20 border border-red-500/40 rounded-2xl text-xs text-red-100 font-medium flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-widest text-blue-100 uppercase">E-Mail Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@smartmove.lk"
                  className="w-full bg-white/5 border-b border-blue-400/40 px-2 py-2.5 text-white placeholder-blue-300/40 focus:outline-none focus:border-white focus:bg-white/10 transition-all text-sm rounded-t-lg"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-widest text-blue-100 uppercase">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border-b border-blue-400/40 px-2 py-2.5 text-white placeholder-blue-300/40 focus:outline-none focus:border-white focus:bg-white/10 transition-all text-sm tracking-wider rounded-t-lg"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2.5 text-blue-100/90 font-light cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    defaultChecked
                    className="w-4 h-4 rounded border-blue-300 bg-white/10 checked:bg-blue-500 cursor-pointer accent-blue-500"
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/about" className="text-blue-300 hover:text-white transition-colors">
                  Need help?
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="relative group w-full sm:w-auto overflow-hidden bg-white hover:bg-blue-50 text-[#1e3f7a] font-bold px-9 py-3.5 rounded-full text-sm transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#1e3f7a]" />
                      <span className="tracking-wide">Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span className="tracking-wide">SIGN IN</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <Link 
                  to="/register" 
                  className="text-xs text-blue-200 hover:text-white underline decoration-blue-300/50 underline-offset-4 transition-colors cursor-pointer"
                >
                  Create new account
                </Link>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
