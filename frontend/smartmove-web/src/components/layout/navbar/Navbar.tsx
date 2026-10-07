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
        "fixed top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between transition-all duration-300",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-gray-900 cursor-pointer">
        <MapPin className="w-8 h-8 text-blue-600" />
        SmartMove
      </div>

      {/* Center Links */}
      <div className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <div key={link.name} className="relative group cursor-pointer">
            <Link to={link.href} className={`text-sm font-medium transition-colors hover:text-blue-600 ${link.active ? 'text-gray-900' : 'text-gray-600'}`}>
              {link.name}
            </Link>
            {/* Active / Hover Indicator */}
            <motion.div 
              className={`absolute -bottom-2 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${link.active ? 'w-full' : 'w-0 group-hover:w-full'}`}
            />
          </div>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
          <Globe className="w-4 h-4" />
          <span>EN</span>
        </div>
        <button className="p-2 hover:bg-gray-100/50 rounded-full transition-colors">
          <Search className="w-5 h-5 text-gray-700" />
        </button>
        <button className="p-2 hover:bg-gray-100/50 rounded-full transition-colors md:hidden">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </motion.nav>
  );
}
