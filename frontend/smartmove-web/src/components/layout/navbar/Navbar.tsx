import { motion, AnimatePresence } from 'framer-motion';
import { Menu, MapPin, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Trips', href: '/passenger/trips' },
    { name: 'Announcements', href: '/passenger/announcements' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 w-full z-[100] transition-all duration-500",
          scrolled || mobileMenuOpen ? "bg-white/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] py-4" : "bg-gradient-to-b from-slate-900/80 to-transparent py-8"
        )}
      >
        <div className="w-full px-8 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <MapPin className="w-7 h-7 text-blue-500 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full" />
            </div>
            <span className={cn(
              "text-2xl font-medium tracking-tight transition-colors duration-500",
              scrolled || mobileMenuOpen ? "text-gray-900" : "text-white"
            )}>
              SmartMove
            </span>
          </Link>

          {/* Desktop Center Links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              
              return (
                <div key={link.name} className="relative group cursor-pointer">
                  <Link 
                    to={link.href} 
                    className={cn(
                      "text-sm font-medium transition-colors duration-500 tracking-wide",
                      scrolled 
                        ? (isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-600")
                        : (isActive ? "text-white" : "text-gray-300 hover:text-white")
                    )}
                  >
                    {link.name}
                  </Link>
                  
                  {/* Fluid Active Indicator using layoutId */}
                  {isActive && (
                    <motion.div 
                      layoutId="navbar-active-indicator"
                      className={cn(
                        "absolute -bottom-2 left-0 w-full h-[2px]",
                        scrolled ? "bg-blue-600" : "bg-white"
                      )}
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  {/* Subtle hover indicator for non-active links */}
                  {!isActive && (
                    <div className={cn(
                      "absolute -bottom-2 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300",
                      scrolled ? "bg-blue-600/30" : "bg-white/30"
                    )} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link 
              to="/login"
              className={cn(
                "hidden sm:block text-sm font-medium transition-colors duration-500 tracking-wide",
                scrolled || mobileMenuOpen ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-300"
              )}
            >
              Login
            </Link>
            <Link 
              to="/register"
              className="hidden sm:flex bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-blue-500 transition-all shadow-[0_4px_14px_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] tracking-wide"
            >
              Register
            </Link>
            
            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-2 rounded-full transition-colors duration-500 lg:hidden",
                scrolled || mobileMenuOpen ? "hover:bg-gray-100 text-gray-900" : "hover:bg-white/10 text-white"
              )}
            >
              <motion.div
                initial={false}
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* =========================================
          MOBILE MENU OVERLAY
          ========================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-3xl pt-28 px-8 flex flex-col lg:hidden"
          >
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className={cn(
                        "text-3xl font-medium tracking-tight block transition-colors",
                        isActive ? "text-blue-600" : "text-gray-900 hover:text-blue-600"
                      )}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="w-full h-[1px] bg-gray-200 my-4" 
              />
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navLinks.length + 1) * 0.1 }}
                className="flex flex-col gap-4"
              >
                <Link 
                  to="/login"
                  className="text-xl font-medium text-gray-600 hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-4 rounded-full text-center text-lg font-medium hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  Create Account
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
