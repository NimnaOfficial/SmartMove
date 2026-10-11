import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, MapPin, Home, Navigation, Bell, Info, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '@/services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!formData.password) {
      setError('Please enter a password.');
      return;
    }
    if (formData.password !== formData.confirmPassword) { 
      setError('Passwords do not match.'); 
      return; 
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept the terms of service to continue.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const parts = formData.name.trim().split(' ');
      const firstName = parts[0] || 'User';
      const lastName = parts.slice(1).join(' ') || '';

      const response = await authService.register({
        firstName,
        lastName,
        email: formData.email.trim(),
        phone: formData.phone.trim() || '0770000000',
        password: formData.password,
        role: 'PASSENGER'
      });
      localStorage.setItem('smartmove_token', response.token);
      localStorage.setItem('smartmove_user', JSON.stringify(response));
      navigate('/passenger/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed');
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
        <div className="relative w-full max-w-6xl flex flex-col lg:flex-row items-center justify-start min-h-[660px]">
          
          {/* LEFT: Image Background Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-[75%] h-[320px] lg:h-[660px] rounded-[2.5rem] overflow-hidden relative shadow-2xl bg-gray-900 shrink-0"
          >
            <img 
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" 
              alt="Scenic Travel Route"
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
                SIGN<br/>UP
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 lg:mt-12"
              >
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium tracking-[0.15em] text-xs uppercase px-6 py-3 rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                >
                  <span>Already registered?</span>
                  <span className="font-bold underline decoration-blue-300 underline-offset-4">Sign In</span>
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
              <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
              <p className="text-blue-200/80 text-xs mt-1 font-light">Join the SmartMove transit network</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              
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

              <div className="space-y-1">
                <label className="text-[11px] font-semibold tracking-widest text-blue-100 uppercase">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Nimal Perera"
                  className="w-full bg-white/5 border-b border-blue-400/40 px-2 py-2 text-white placeholder-blue-300/40 focus:outline-none focus:border-white focus:bg-white/10 transition-all text-sm rounded-t-lg"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  disabled={loading}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold tracking-widest text-blue-100 uppercase">E-Mail Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="nimal@example.com"
                  className="w-full bg-white/5 border-b border-blue-400/40 px-2 py-2 text-white placeholder-blue-300/40 focus:outline-none focus:border-white focus:bg-white/10 transition-all text-sm rounded-t-lg"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  disabled={loading}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold tracking-widest text-blue-100 uppercase">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="0771234567"
                  className="w-full bg-white/5 border-b border-blue-400/40 px-2 py-2 text-white placeholder-blue-300/40 focus:outline-none focus:border-white focus:bg-white/10 transition-all text-sm rounded-t-lg"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  disabled={loading}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold tracking-widest text-blue-100 uppercase">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border-b border-blue-400/40 px-2 py-2 text-white placeholder-blue-300/40 focus:outline-none focus:border-white focus:bg-white/10 transition-all text-sm tracking-wider rounded-t-lg"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[11px] font-semibold tracking-widest text-blue-100 uppercase">Confirm Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border-b border-blue-400/40 px-2 py-2 text-white placeholder-blue-300/40 focus:outline-none focus:border-white focus:bg-white/10 transition-all text-sm tracking-wider rounded-t-lg"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  disabled={loading}
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input 
                  type="checkbox" 
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-blue-300 bg-white/10 checked:bg-blue-500 cursor-pointer accent-blue-500"
                />
                <label htmlFor="agree-terms" className="text-xs text-blue-100/90 font-light select-none cursor-pointer">
                  I agree to the <Link to="/about" className="font-semibold text-white hover:underline underline-offset-2">terms of service</Link> & privacy policy.
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
                <button 
                  type="submit"
                  disabled={loading}
                  className="relative group w-full sm:w-auto overflow-hidden bg-white hover:bg-blue-50 text-[#1e3f7a] font-bold px-9 py-3.5 rounded-full text-sm transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#1e3f7a]" />
                      <span className="tracking-wide">Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span className="tracking-wide">SIGN UP</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <Link 
                  to="/login" 
                  className="text-xs text-blue-200 hover:text-white underline decoration-blue-300/50 underline-offset-4 transition-colors cursor-pointer"
                >
                  Already registered? Sign in
                </Link>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
