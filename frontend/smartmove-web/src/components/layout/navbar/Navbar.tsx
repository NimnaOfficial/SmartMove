import { motion } from 'framer-motion';
import { Search, Menu, Globe, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', active: true },
    { name: 'Routes', href: '/routes' },
    { name: 'Vehicles', href: '/vehicles' },
    { name: 'About', href: '/about' },
    { name: 'Support', href: '/support' },
  ];

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500",
        scrolled ? "bg-white/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] py-4" : "bg-gradient-to-b from-slate-900/80 to-transparent py-8"
      )}
    >
      <div className="w-full px-8 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between">
        {/* Logo */}
        <div className={cn(
          "flex items-center gap-2 text-2xl font-medium tracking-tight cursor-pointer transition-colors duration-500",
          scrolled ? "text-gray-900" : "text-white"
        )}>
          <MapPin className="w-7 h-7 text-blue-500" />
          SmartMove
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group cursor-pointer">
              <Link 
                to={link.href} 
                className={cn(
                  "text-sm font-medium transition-colors duration-500",
                  scrolled 
                    ? (link.active ? "text-gray-900" : "text-gray-500 hover:text-blue-600")
                    : (link.active ? "text-white" : "text-gray-300 hover:text-blue-300")
                )}
              >
                {link.name}
              </Link>
              {/* Active / Hover Indicator */}
              <motion.div 
                className={cn(
                  "absolute -bottom-2 left-0 h-[2px] transition-all duration-300",
                  scrolled ? "bg-blue-600" : "bg-blue-400",
                  link.active ? 'w-full' : 'w-0 group-hover:w-full'
                )}
              />
            </div>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-6">
          <div className={cn(
            "hidden sm:flex items-center gap-2 cursor-pointer text-sm font-medium transition-colors duration-500",
            scrolled ? "text-gray-600 hover:text-blue-600" : "text-gray-300 hover:text-white"
          )}>
            <Globe className="w-4 h-4" />
            <span>EN</span>
          </div>
          <button className={cn(
            "p-2 rounded-full transition-colors duration-500",
            scrolled ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/10 text-white"
          )}>
            <Search className="w-5 h-5" />
          </button>
          <button className={cn(
            "p-2 rounded-full transition-colors duration-500 md:hidden",
            scrolled ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/10 text-white"
          )}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
